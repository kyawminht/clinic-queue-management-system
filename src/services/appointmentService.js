import { getDoctorsSnapshot } from './doctorService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const queueState = {
  started: false,
  startedAt: null,
  currentServingQueueNumber: 1,
  appointments: [
    {
      id: 'apt-1001',
      queueNumber: 1,
      patientName: 'Aye Aye',
      age: '42',
      phone: '09 123 456 789',
      doctorId: 'dr-khin',
      doctorName: 'Dr. Khin Thida',
      slot: '09:00 AM',
      status: 'serving',
      estimatedWaitMinutes: 0,
    },
    {
      id: 'apt-1002',
      queueNumber: 2,
      patientName: 'Ko Min',
      age: '31',
      phone: '09 888 555 444',
      doctorId: 'dr-zaw',
      doctorName: 'Dr. Zaw Moe',
      slot: '09:30 AM',
      status: 'waiting',
      estimatedWaitMinutes: 15,
    },
  ],
};

function cloneAppointment(appointment) {
  return { ...appointment };
}

function buildQueueSnapshot() {
  return {
    started: queueState.started,
    startedAt: queueState.startedAt,
    currentServingQueueNumber: queueState.currentServingQueueNumber,
    appointments: queueState.appointments.map(cloneAppointment),
  };
}

function syncQueueState(queue) {
  queueState.started = Boolean(queue?.started);
  queueState.startedAt = queue?.startedAt || null;
  queueState.currentServingQueueNumber = queue.currentServingQueueNumber;
  queueState.appointments = (queue.appointments || []).map(cloneAppointment);
}

async function parseApiResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.code = data?.code;
    throw error;
  }

  return data;
}

function getNextQueueNumber() {
  if (queueState.appointments.length === 0) {
    return 1;
  }

  return Math.max(...queueState.appointments.map((appointment) => appointment.queueNumber)) + 1;
}

function updateWaitingTimes() {
  const waitingAppointments = [...queueState.appointments]
    .filter((appointment) => appointment.status === 'waiting')
    .sort((left, right) => left.queueNumber - right.queueNumber);

  waitingAppointments.forEach((appointment, index) => {
    const target = queueState.appointments.find((item) => item.id === appointment.id);

    if (target) {
      target.estimatedWaitMinutes = (index + 1) * 15;
    }
  });
}

export function getQueueSnapshot() {
  return buildQueueSnapshot();
}

export async function fetchQueueData(dateKey) {
  try {
    const query = dateKey ? `?date=${encodeURIComponent(dateKey)}` : '';
    const response = await fetch(`${API_BASE_URL}/bookings/queue${query}`);
    const queue = await parseApiResponse(response);
    syncQueueState(queue);
    return buildQueueSnapshot();
  } catch (error) {
    return buildQueueSnapshot();
  }
}

export async function submitAppointment(payload) {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const result = await parseApiResponse(response);
  syncQueueState(result.queue);

  return {
    appointment: cloneAppointment(result.appointment),
    queue: buildQueueSnapshot(),
  };
}

export async function markCurrentDone() {
  queueState.appointments = queueState.appointments.map((appointment) =>
    appointment.queueNumber === queueState.currentServingQueueNumber
      ? { ...appointment, status: 'done', estimatedWaitMinutes: 0 }
      : appointment
  );

  return buildQueueSnapshot();
}

export async function moveToNextPatient() {
  const waitingAppointments = [...queueState.appointments]
    .filter((appointment) => appointment.status === 'waiting')
    .sort((left, right) => left.queueNumber - right.queueNumber);

  if (waitingAppointments.length === 0) {
    return buildQueueSnapshot();
  }

  const nextQueueNumber = waitingAppointments[0].queueNumber;
  queueState.currentServingQueueNumber = nextQueueNumber;

  queueState.appointments = queueState.appointments.map((appointment) => {
    if (appointment.status === 'serving' && appointment.queueNumber !== nextQueueNumber) {
      return { ...appointment, status: 'done', estimatedWaitMinutes: 0 };
    }

    if (appointment.queueNumber === nextQueueNumber) {
      return { ...appointment, status: 'serving', estimatedWaitMinutes: 0 };
    }

    return appointment;
  });

  updateWaitingTimes();

  return buildQueueSnapshot();
}

export async function addWalkInPatient() {
  const [defaultDoctor] = getDoctorsSnapshot();

  return submitAppointment({
    user: {
      name: `Walk-in ${queueState.appointments.length + 1}`,
      age: '40',
      phone: '09 000 000 000',
    },
    doctor: defaultDoctor,
    slot: defaultDoctor.availableSlots[0],
  });
}

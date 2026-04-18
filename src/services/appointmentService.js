import { getDoctorsSnapshot } from './doctorService';

const queueState = {
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
    currentServingQueueNumber: queueState.currentServingQueueNumber,
    appointments: queueState.appointments.map(cloneAppointment),
  };
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

export async function fetchQueueData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(buildQueueSnapshot()), 250);
  });
}

export async function submitAppointment(payload) {
  const nextQueueNumber = getNextQueueNumber();
  const waitMins = Math.max(nextQueueNumber - queueState.currentServingQueueNumber, 0) * 15;

  const newAppointment = {
    id: `apt-${Date.now()}`,
    queueNumber: nextQueueNumber,
    patientName: payload.user.name,
    age: payload.user.age,
    phone: payload.user.phone,
    doctorId: payload.doctor.id,
    doctorName: payload.doctor.name,
    slot: payload.slot,
    status: 'waiting',
    estimatedWaitMinutes: waitMins,
  };

  queueState.appointments.push(newAppointment);

  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          appointment: cloneAppointment(newAppointment),
          queue: buildQueueSnapshot(),
        }),
      250
    );
  });
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

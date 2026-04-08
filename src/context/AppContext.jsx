import { createContext, useContext, useMemo, useState } from 'react';
import { initialDoctors } from '../services/doctorService';
import { translations } from '../services/translations';

const AppContext = createContext(null);

const starterAppointments = [
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
];

function localizeWait(minutes, t, status) {
  if (status === 'done') {
    return t('waitFinished');
  }

  if (minutes <= 0) {
    return t('waitNow');
  }

  return `${minutes} ${t('mins')}`;
}

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('my');
  const [currentUser, setCurrentUser] = useState({
    name: 'Ko Min',
    age: '31',
    phone: '09 888 555 444',
  });
  const [doctors] = useState(initialDoctors);
  const [appointments, setAppointments] = useState(starterAppointments);
  const [currentServingQueueNumber, setCurrentServingQueueNumber] = useState(1);

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  const addAppointment = ({ user, doctor, slot }) => {
    const nextQueueNumber =
      appointments.length > 0
        ? Math.max(...appointments.map((appointment) => appointment.queueNumber)) + 1
        : 1;

    const waitMins = Math.max(nextQueueNumber - currentServingQueueNumber, 0) * 15;

    const newAppointment = {
      id: `apt-${Date.now()}`,
      queueNumber: nextQueueNumber,
      patientName: user.name,
      age: user.age,
      phone: user.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      slot,
      status: 'waiting',
      estimatedWaitMinutes: waitMins,
    };

    setCurrentUser(user);
    setAppointments((previous) => [...previous, newAppointment]);

    return newAppointment;
  };

  const markCurrentDone = () => {
    setAppointments((previous) =>
      previous.map((appointment) =>
        appointment.queueNumber === currentServingQueueNumber
          ? { ...appointment, status: 'done', estimatedWaitMinutes: 0 }
          : appointment
      )
    );
  };

  const moveToNextPatient = () => {
    const waitingAppointments = appointments
      .filter((appointment) => appointment.status === 'waiting')
      .sort((left, right) => left.queueNumber - right.queueNumber);

    if (waitingAppointments.length === 0) {
      return null;
    }

    const nextQueueNumber = waitingAppointments[0].queueNumber;
    setCurrentServingQueueNumber(nextQueueNumber);

    setAppointments((previous) =>
      previous.map((appointment) => {
        if (appointment.status === 'serving' && appointment.queueNumber !== nextQueueNumber) {
          return { ...appointment, status: 'done', estimatedWaitMinutes: 0 };
        }

        if (appointment.queueNumber === nextQueueNumber) {
          return { ...appointment, status: 'serving', estimatedWaitMinutes: 0 };
        }

        if (appointment.status === 'waiting') {
          const aheadCount = previous.filter(
            (item) => item.status === 'waiting' && item.queueNumber < appointment.queueNumber
          ).length;

          return {
            ...appointment,
            estimatedWaitMinutes: Math.max(aheadCount - 1, 0) * 15 + 15,
          };
        }

        return appointment;
      })
    );

    return nextQueueNumber;
  };

  const addWalkInPatient = () => {
    const defaultDoctor = doctors[0];

    return addAppointment({
      user: {
        name: `Walk-in ${appointments.length + 1}`,
        age: '40',
        phone: '09 000 000 000',
      },
      doctor: defaultDoctor,
      slot: defaultDoctor.availableSlots[0],
    });
  };

  const getDoctorById = (doctorId) => doctors.find((doctor) => doctor.id === doctorId);

  const localizedAppointments = useMemo(
    () =>
      appointments.map((appointment) => ({
        ...appointment,
        estimatedWait: localizeWait(appointment.estimatedWaitMinutes, t, appointment.status),
      })),
    [appointments, language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      currentUser,
      setCurrentUser,
      appointments: localizedAppointments,
      rawAppointments: appointments,
      setAppointments,
      doctors,
      currentServingQueueNumber,
      setCurrentServingQueueNumber,
      addAppointment,
      markCurrentDone,
      moveToNextPatient,
      addWalkInPatient,
      getDoctorById,
    }),
    [appointments, currentServingQueueNumber, currentUser, doctors, language, localizedAppointments]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }

  return context;
}

import QueueStatusPage from '../pages/QueueStatusPage';
import { useAppContext } from '../context/AppContext';
import { useAppointments } from '../hooks/useAppointments';
import { useTranslation } from '../hooks/useTranslation';

function normalizeName(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function QueueStatusPageContainer() {
  const { currentUser, selectedDate, setSelectedDate } = useAppContext();
  const { appointments, currentServingQueueNumber, started } = useAppointments();
  const { t } = useTranslation();

  const normalizedUserName = normalizeName(currentUser?.name);
  const latestAppointment =
    [...appointments]
      .reverse()
      .find((appointment) => normalizeName(appointment.patientName) === normalizedUserName) || null;

  return (
    <QueueStatusPage
      latestAppointment={latestAppointment}
      currentServingQueueNumber={currentServingQueueNumber}
      started={started}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      t={t}
    />
  );
}

export default QueueStatusPageContainer;

import QueueStatusPage from '../pages/QueueStatusPage';
import { useAppContext } from '../context/AppContext';
import { useAppointments } from '../hooks/useAppointments';
import { useTranslation } from '../hooks/useTranslation';

function QueueStatusPageContainer() {
  const { currentUser, selectedDate, setSelectedDate } = useAppContext();
  const { appointments, currentServingQueueNumber, started } = useAppointments();
  const { t } = useTranslation();

  const latestAppointment =
    [...appointments]
      .reverse()
      .find((appointment) => appointment.patientName === currentUser.name) || appointments[0];

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

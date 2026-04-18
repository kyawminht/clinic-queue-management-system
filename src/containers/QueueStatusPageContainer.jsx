import QueueStatusPage from '../pages/QueueStatusPage';
import { useAppContext } from '../context/AppContext';
import { useAppointments } from '../hooks/useAppointments';
import { useTranslation } from '../hooks/useTranslation';

function QueueStatusPageContainer() {
  const { currentUser } = useAppContext();
  const { appointments, currentServingQueueNumber } = useAppointments();
  const { t } = useTranslation();

  const latestAppointment =
    [...appointments]
      .reverse()
      .find((appointment) => appointment.patientName === currentUser.name) || appointments[0];

  return (
    <QueueStatusPage
      latestAppointment={latestAppointment}
      currentServingQueueNumber={currentServingQueueNumber}
      t={t}
    />
  );
}

export default QueueStatusPageContainer;

import { useAppContext } from '../context/AppContext';
import { submitAppointment } from '../services/appointmentService';
import { useApi } from './useApi';

export function useAppointments() {
  const context = useAppContext();
  const bookingApi = useApi(async (payload) => {
    await submitAppointment(payload);
    return context.addAppointment(payload);
  });

  return {
    appointments: context.appointments,
    currentServingQueueNumber: context.currentServingQueueNumber,
    createAppointment: bookingApi.request,
    createLoading: bookingApi.loading,
    createError: bookingApi.error,
  };
}

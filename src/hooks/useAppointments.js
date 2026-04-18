import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchQueueData, getQueueSnapshot, submitAppointment } from '../services/appointmentService';
import { queryKeys } from '../services/queryKeys';
import { useTranslation } from './useTranslation';

function localizeWait(minutes, t, status) {
  if (status === 'done') {
    return t('waitFinished');
  }

  if (minutes <= 0) {
    return t('waitNow');
  }

  return `${minutes} ${t('mins')}`;
}

export function useAppointments() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.queue,
    queryFn: fetchQueueData,
    initialData: getQueueSnapshot,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: submitAppointment,
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.queue, result.queue);
    },
  });

  const appointments = useMemo(
    () =>
      (data?.appointments || []).map((appointment) => ({
        ...appointment,
        estimatedWait: localizeWait(appointment.estimatedWaitMinutes, t, appointment.status),
      })),
    [data?.appointments, t]
  );

  return {
    appointments,
    currentServingQueueNumber: data?.currentServingQueueNumber || 0,
    createAppointment: createAppointmentMutation.mutateAsync,
    createLoading: createAppointmentMutation.isPending,
    createError: createAppointmentMutation.error || error,
    loading: isLoading,
  };
}

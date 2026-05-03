import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchQueueData, getQueueSnapshot, submitAppointment } from '../services/appointmentService';
import { queryKeys } from '../services/queryKeys';
import { useTranslation } from './useTranslation';
import { useAppContext } from '../context/AppContext';

function localizeWait(minutes, t, status, started) {
  if (status === 'done') {
    return t('waitFinished');
  }

  if (!started) {
    return t('waitNotStarted');
  }

  if (minutes <= 0) {
    return t('waitNow');
  }

  return `${minutes} ${t('mins')}`;
}

export function useAppointments() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { selectedDate } = useAppContext();
  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKeys.queue, selectedDate],
    queryFn: () => fetchQueueData(selectedDate),
    initialData: getQueueSnapshot,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: submitAppointment,
    onSuccess: (result) => {
      queryClient.setQueryData([...queryKeys.queue, selectedDate], result.queue);
    },
  });

  const appointments = useMemo(
    () =>
      (data?.appointments || []).map((appointment) => ({
        ...appointment,
        estimatedWait: localizeWait(
          appointment.estimatedWaitMinutes,
          t,
          appointment.status,
          Boolean(data?.started)
        ),
      })),
    [data?.appointments, data?.started, t]
  );

  return {
    appointments,
    currentServingQueueNumber: data?.currentServingQueueNumber || 0,
    started: Boolean(data?.started),
    startedAt: data?.startedAt || null,
    createAppointment: createAppointmentMutation.mutateAsync,
    createLoading: createAppointmentMutation.isPending,
    createError: createAppointmentMutation.error || error,
    loading: isLoading,
  };
}

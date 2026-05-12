import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { fetchQueueData, getQueueSnapshot, submitAppointment } from '../services/appointmentService';
import { queryKeys } from '../services/queryKeys';
import { useTranslation } from './useTranslation';
import { useAppContext } from '../context/AppContext';
import { enqueueSubmission, loadQueue, removeSubmission } from '../services/offlineSubmissionQueue';
import { useOnlineStatus } from './useOnlineStatus';

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
  const isOnline = useOnlineStatus();
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [...queryKeys.queue, selectedDate],
    queryFn: () => fetchQueueData(selectedDate),
    initialData: getQueueSnapshot,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
  });

  const flushOfflineQueue = async () => {
    const items = loadQueue();
    const pending = items.filter((item) => item?.type === 'create_booking');
    for (const item of pending) {
      try {
        const result = await submitAppointment(item.payload);
        queryClient.setQueryData([...queryKeys.queue, item.payload?.date], result.queue);
        removeSubmission(item.queueId);
      } catch {
        break;
      }
    }
  };

  const createAppointmentMutation = useMutation({
    mutationFn: async (payload) => {
      if (!isOnline) {
        enqueueSubmission({ type: 'create_booking', payload });
        return { queued: true, queue: queryClient.getQueryData([...queryKeys.queue, selectedDate]) };
      }
      return submitAppointment(payload);
    },
    onSuccess: (result) => {
      if (result?.queued) return;
      queryClient.setQueryData([...queryKeys.queue, selectedDate], result.queue);
    },
  });

  // When we come back online, flush queued submissions.
  useEffect(() => {
    if (!isOnline) return;
    flushOfflineQueue().catch(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

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
    fetching: isFetching,
  };
}

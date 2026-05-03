import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { submitAppointment } from '../services/appointmentService';
import { queryKeys } from '../services/queryKeys';
import { useOnlineStatus } from './useOnlineStatus';
import { useSubmissions } from '../context/SubmissionContext';

const FORM_KEY = 'booking_create';

export function useAsyncBookingSubmission() {
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();
  const { addSubmission, updateSubmission, removeSubmission, getSubmissions, registerRetryHandler } =
    useSubmissions();

  const execute = useCallback(
    async (submissionId, payload) => {
      if (!isOnline) {
        updateSubmission(FORM_KEY, submissionId, { status: 'queued', progress: 0, error: null });
        return { queued: true };
      }

      updateSubmission(FORM_KEY, submissionId, { status: 'pending', progress: 5, error: null });

      let progressTimer = null;
      progressTimer = window.setInterval(() => {
        updateSubmission(FORM_KEY, submissionId, (previous) => {
          const next = Math.min(90, Math.max(5, (previous?.progress || 5) + 7));
          return { progress: next };
        });
      }, 400);

      try {
        const result = await submitAppointment(payload);
        updateSubmission(FORM_KEY, submissionId, { progress: 100, status: 'complete' });

        queryClient.setQueryData([...queryKeys.queue, payload?.date], result.queue);
        await queryClient.invalidateQueries({ queryKey: [...queryKeys.queue, payload?.date] });

        removeSubmission(FORM_KEY, submissionId);
        return result;
      } catch (error) {
        const offlineNow = !navigator.onLine;
        updateSubmission(FORM_KEY, submissionId, {
          status: offlineNow ? 'queued' : 'failed',
          progress: 0,
          error: offlineNow ? null : error?.message || 'Request failed',
        });
        return { error, queued: offlineNow };
      } finally {
        if (progressTimer) window.clearInterval(progressTimer);
      }
    },
    [isOnline, queryClient, removeSubmission, updateSubmission]
  );

  const submit = useCallback(
    async (payload, options = {}) => {
      const title = options.title || payload?.user?.name || 'Booking';
      const submissionId = addSubmission(FORM_KEY, {
        title,
        payload,
        status: isOnline ? 'pending' : 'queued',
        progress: 0,
      });

      if (!isOnline) return { queued: true, submissionId };

      return execute(submissionId, payload);
    },
    [addSubmission, execute, isOnline]
  );

  const retry = useCallback(
    (submissionId) => {
      const items = getSubmissions(FORM_KEY);
      const item = items.find((entry) => entry.id === submissionId);
      if (!item?.payload) return;
      execute(submissionId, item.payload).catch(() => null);
    },
    [execute, getSubmissions]
  );

  useEffect(() => {
    registerRetryHandler(FORM_KEY, retry);
  }, [registerRetryHandler, retry]);

  return { submit, formKey: FORM_KEY };
}

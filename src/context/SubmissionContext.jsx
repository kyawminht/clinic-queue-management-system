import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const STORAGE_KEY = 'booking_submissions_v1';
const SubmissionContext = createContext(null);

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function loadStored() {
  if (typeof window === 'undefined') return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? safeParse(raw) : null;
  return parsed && typeof parsed === 'object' ? parsed : {};
}

function persistStored(submissions) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch {
    // ignore
  }
}

export function SubmissionProvider({ children }) {
  const isOnline = useOnlineStatus();
  const [submissions, setSubmissions] = useState(() => loadStored());
  const retryRegistryRef = useRef({});
  const submissionsRef = useRef(submissions);

  useEffect(() => {
    submissionsRef.current = submissions;
    persistStored(submissions);
  }, [submissions]);

  const registerRetryHandler = useCallback((formKey, handler) => {
    retryRegistryRef.current[formKey] = handler;
  }, []);

  const addSubmission = useCallback((formKey, data) => {
    const id = `${formKey}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const item = {
      id,
      createdAt: new Date().toISOString(),
      status: isOnline ? 'pending' : 'queued',
      progress: 0,
      error: null,
      ...data,
    };

    setSubmissions((previous) => ({
      ...previous,
      [formKey]: [item, ...(previous[formKey] || [])],
    }));

    return id;
  }, [isOnline]);

  const updateSubmission = useCallback((formKey, id, updates) => {
    setSubmissions((previous) => ({
      ...previous,
      [formKey]: (previous[formKey] || []).map((item) => {
        if (item.id !== id) return item;
        const patch = typeof updates === 'function' ? updates(item) : updates;
        return { ...item, ...(patch || {}) };
      }),
    }));
  }, []);

  const removeSubmission = useCallback((formKey, id) => {
    setSubmissions((previous) => ({
      ...previous,
      [formKey]: (previous[formKey] || []).filter((item) => item.id !== id),
    }));
  }, []);

  const getSubmissions = useCallback((formKey) => submissions[formKey] || [], [submissions]);

  const retrySubmission = useCallback((formKey, submissionId) => {
    const handler = retryRegistryRef.current[formKey];
    if (!handler) return;
    handler(submissionId);
  }, []);

  useEffect(() => {
    if (!isOnline) return;

    const timer = window.setTimeout(() => {
      const current = submissionsRef.current;
      for (const [formKey, items] of Object.entries(current)) {
        const handler = retryRegistryRef.current[formKey];
        if (!handler) continue;
        (items || [])
          .filter((item) => item.status === 'queued')
          .forEach((item) => handler(item.id));
      }
    }, 750);

    return () => window.clearTimeout(timer);
  }, [isOnline]);

  const value = useMemo(
    () => ({
      submissions,
      isOnline,
      addSubmission,
      updateSubmission,
      removeSubmission,
      getSubmissions,
      registerRetryHandler,
      retrySubmission,
    }),
    [addSubmission, getSubmissions, isOnline, registerRetryHandler, removeSubmission, retrySubmission, submissions, updateSubmission]
  );

  return <SubmissionContext.Provider value={value}>{children}</SubmissionContext.Provider>;
}

export function useSubmissions() {
  const context = useContext(SubmissionContext);
  if (!context) throw new Error('useSubmissions must be used within SubmissionProvider');
  return context;
}

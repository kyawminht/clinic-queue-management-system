import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

async function getVapidPublicKey() {
  const fromEnv = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (fromEnv) return fromEnv;

  try {
    const response = await fetch('/api/push/vapidPublicKey');
    const data = await response.json().catch(() => null);
    if (!response.ok) return null;
    return data?.publicKey || null;
  } catch {
    return null;
  }
}

export function usePwa() {
  const { currentUser } = useAppContext();
  const [registration, setRegistration] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [pushStatus, setPushStatus] = useState('idle'); // idle | enabling | enabled | error
  const [pushError, setPushError] = useState('');

  const canInstall = Boolean(installPrompt);
  const notificationsSupported = typeof window !== 'undefined' && 'Notification' in window;
  const pushSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    notificationsSupported;

  const notificationPermission = notificationsSupported ? Notification.permission : 'denied';

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const allowDevSw = String(import.meta.env.VITE_ENABLE_SW || '').toLowerCase() === 'true';

    if (import.meta.env.DEV && !allowDevSw) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => Promise.all(registrations.map((reg) => reg.unregister())))
        .then(() => caches?.keys?.().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))))
        .catch(() => null);
      return;
    }

    navigator.serviceWorker.register('/sw.js').then((reg) => setRegistration(reg)).catch(() => null);
  }, []);

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) return false;
    installPrompt.prompt();
    const choiceResult = await installPrompt.userChoice.catch(() => ({ outcome: 'dismissed' }));
    setInstallPrompt(null);
    return choiceResult.outcome === 'accepted';
  }, [installPrompt]);

  const enablePushNotifications = useCallback(async () => {
    if (!pushSupported) return;

    setPushStatus('enabling');
    setPushError('');

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      const reg = registration || (await navigator.serviceWorker.ready);
      const publicKey = await getVapidPublicKey();
      if (!publicKey) {
        throw new Error('Push is not configured on the server yet');
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          phone: null,
        }),
      });

      try {
        window.localStorage.setItem('push_endpoint', subscription?.endpoint || '');
      } catch {
        // ignore
      }

      setPushStatus('enabled');
    } catch (error) {
      setPushStatus('error');
      setPushError(error?.message || 'Failed to enable notifications');
    }
  }, [currentUser?.phone, pushSupported, registration]);

  const state = useMemo(
    () => ({
      canInstall,
      promptInstall,
      notificationsSupported,
      pushSupported,
      notificationPermission,
      pushStatus,
      pushError,
      enablePushNotifications,
    }),
    [
      canInstall,
      promptInstall,
      notificationsSupported,
      pushSupported,
      notificationPermission,
      pushStatus,
      pushError,
      enablePushNotifications,
    ]
  );

  return state;
}

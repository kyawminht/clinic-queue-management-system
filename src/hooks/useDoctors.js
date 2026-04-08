import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchDoctors } from '../services/doctorService';
import { useApi } from './useApi';

export function useDoctors() {
  const { doctors } = useAppContext();
  const { data, loading, error, request } = useApi(fetchDoctors);

  useEffect(() => {
    request();
  }, [request]);

  return {
    doctors: data || doctors,
    loading,
    error,
  };
}

import { useQuery } from '@tanstack/react-query';
import { fetchDoctors, getDoctorsSnapshot } from '../services/doctorService';
import { queryKeys } from '../services/queryKeys';

export function useDoctors() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: queryKeys.doctors,
    queryFn: fetchDoctors,
    initialData: getDoctorsSnapshot,
  });

  return {
    doctors: data,
    loading: isLoading,
    error,
  };
}

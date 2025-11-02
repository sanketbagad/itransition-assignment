import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DrugService } from '../services/drugService';
import type { SearchParams, CreateDrugRequest } from '../types';

export const useDrugs = (params: SearchParams = {}) => {
  // Normalize params for consistent query key
  const normalizedParams = {
    page: params.page || 1,
    limit: params.limit || 20,
    search: params.search || undefined,
    sortBy: params.sortBy || undefined,
    sortOrder: params.sortOrder || 'asc',
  };

  return useQuery({
    queryKey: ['drugs', normalizedParams],
    queryFn: () => {
      return DrugService.getDrugs(normalizedParams);
    },
    staleTime: 1 * 60 * 1000, // Reduced to 1 minute for testing
    gcTime: 2 * 60 * 1000, // 2 minutes garbage collection
  });
};

export const useDrug = (id: number) => {
  return useQuery({
    queryKey: ['drug', id],
    queryFn: () => DrugService.getDrugById(id),
    enabled: !!id,
  });
};

export const useCreateDrug = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (drug: CreateDrugRequest) => DrugService.createDrug(drug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
    },
  });
};

export const useUpdateDrug = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      drug,
    }: {
      id: number;
      drug: Partial<CreateDrugRequest>;
    }) => DrugService.updateDrug(id, drug),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      queryClient.invalidateQueries({ queryKey: ['drug', id] });
    },
  });
};

export const useDeleteDrug = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => DrugService.deleteDrug(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
    },
  });
};

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => DrugService.checkHealth(),
    refetchInterval: 30000, // Check every 30 seconds
    retry: 1,
  });
};

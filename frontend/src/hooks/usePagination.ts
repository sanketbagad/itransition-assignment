import React from 'react';
import type { SearchParams } from '../types';

interface UsePaginationProps {
  initialParams?: SearchParams;
  onParamsChange?: (params: SearchParams) => void;
}

interface UsePaginationReturn {
  params: SearchParams;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search?: string) => void;
  setSortBy: (sortBy?: 'name' | 'company' | 'launchDate') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  resetToFirstPage: () => void;
  updateParams: (newParams: Partial<SearchParams>) => void;
}

export const usePagination = ({
  initialParams = { page: 1, limit: 20, sortOrder: 'asc' },
  onParamsChange,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [params, setParams] = React.useState<SearchParams>(initialParams);

  // Notify parent component of parameter changes
  React.useEffect(() => {
    onParamsChange?.(params);
  }, [params, onParamsChange]);

  const updateParams = React.useCallback((newParams: Partial<SearchParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const setPage = React.useCallback(
    (page: number) => {
      updateParams({ page });
    },
    [updateParams]
  );

  const setLimit = React.useCallback(
    (limit: number) => {
      updateParams({ limit, page: 1 }); // Reset to first page when changing limit
    },
    [updateParams]
  );

  const setSearch = React.useCallback(
    (search?: string) => {
      updateParams({ search, page: 1 }); // Reset to first page when searching
    },
    [updateParams]
  );

  const setSortBy = React.useCallback(
    (sortBy?: 'name' | 'company' | 'launchDate') => {
      updateParams({ sortBy, page: 1 }); // Reset to first page when changing sort
    },
    [updateParams]
  );

  const setSortOrder = React.useCallback(
    (sortOrder: 'asc' | 'desc') => {
      updateParams({ sortOrder, page: 1 }); // Reset to first page when changing sort order
    },
    [updateParams]
  );

  const resetToFirstPage = React.useCallback(() => {
    updateParams({ page: 1 });
  }, [updateParams]);

  return {
    params,
    setPage,
    setLimit,
    setSearch,
    setSortBy,
    setSortOrder,
    resetToFirstPage,
    updateParams,
  };
};

export default usePagination;

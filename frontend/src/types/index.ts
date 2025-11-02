export interface Drug {
  id: number;
  code: string;
  name: string;
  company: string;
  launchDate: string;
}

export interface DrugResponse {
  success: boolean;
  data: Drug[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  timestamp: string;
}

export interface CreateDrugRequest {
  code: string;
  genericName: string;
  brandName: string;
  company: string;
  launchDate: string;
}

export interface UpdateDrugRequest extends Partial<CreateDrugRequest> {
  id: number;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'company' | 'launchDate';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiError {
  error: string;
  message: string;
  timestamp?: string;
}

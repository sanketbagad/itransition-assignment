import axios from 'axios';
import type {
  Drug,
  DrugResponse,
  CreateDrugRequest,
  SearchParams,
  ApiError,
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data) {
      throw error.response.data as ApiError;
    }
    throw {
      error: 'Network Error',
      message: 'Failed to connect to the server. Please check your connection.',
    } as ApiError;
  }
);

export class DrugService {
  static async getDrugs(params: SearchParams = {}): Promise<DrugResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/drugs?${queryParams.toString()}`;

    const response = await api.get<DrugResponse>(url);

    return response.data;
  }

  static async getDrugById(id: number): Promise<Drug> {
    const response = await api.get<{ success: boolean; data: Drug }>(
      `/drugs/${id}`
    );
    return response.data.data;
  }

  static async createDrug(drug: CreateDrugRequest): Promise<Drug> {
    const response = await api.post<{ success: boolean; data: Drug }>(
      '/drugs',
      drug
    );
    return response.data.data;
  }

  static async updateDrug(
    id: number,
    drug: Partial<CreateDrugRequest>
  ): Promise<Drug> {
    const response = await api.put<{ success: boolean; data: Drug }>(
      `/drugs/${id}`,
      drug
    );
    return response.data.data;
  }

  static async deleteDrug(id: number): Promise<void> {
    await api.delete(`/drugs/${id}`);
  }

  static async checkHealth(): Promise<{ status: string; message: string }> {
    const response = await axios.get(
      `${API_BASE_URL.replace('/api', '')}/health`
    );
    return response.data;
  }
}

export default DrugService;

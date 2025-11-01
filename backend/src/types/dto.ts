import { z } from 'zod';

// Drug response DTO
export interface DrugResponseDTO {
  id: number;
  code: string;
  name: string; // combination of genericName and brandName
  company: string;
  launchDate: string; // ISO string format
}

// Query parameters validation
export const getDrugsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  company: z.string().optional(),
  sortBy: z
    .enum(['code', 'name', 'company', 'launchDate'])
    .optional()
    .default('launchDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional(),
});

export type GetDrugsQuery = z.infer<typeof getDrugsQuerySchema>;

// Pagination response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters?: {
    companies: string[];
  };
}

// Error response DTO
export interface ErrorResponseDTO {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

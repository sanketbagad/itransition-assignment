import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Drug, DrugResponse, CreateDrugRequest } from '../../types';

// Mock axios completely with vi.hoisted to avoid initialization issues
const { mockGet, mockPost, mockPut, mockDelete } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
  mockDelete: vi.fn(),
}));

// Mock axios module
vi.mock('axios', () => ({
  default: {
    create: () => ({
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    }),
  },
}));

// Import the service after mocking
import { DrugService } from '../../services/drugService';

describe('DrugService', () => {
  beforeEach(() => {
    // Clear all mock calls before each test
    mockGet.mockClear();
    mockPost.mockClear();
    mockPut.mockClear();
    mockDelete.mockClear();
  });

  describe('getDrugs', () => {
    it('should fetch drugs with default parameters', async () => {
      const mockResponse: DrugResponse = {
        success: true,
        data: [
          {
            id: 1,
            code: '12345-678',
            name: 'Test Drug (Brand)',
            company: 'Test Company',
            launchDate: '2023-01-01T00:00:00.000Z',
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 20,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        timestamp: '2023-01-01T00:00:00.000Z',
      };

      mockGet.mockResolvedValue({ data: mockResponse });

      const result = await DrugService.getDrugs({});

      expect(mockGet).toHaveBeenCalledWith('/drugs?');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch drugs with search parameters', async () => {
      const mockResponse: DrugResponse = {
        success: true,
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        timestamp: '2023-01-01T00:00:00.000Z',
      };

      mockGet.mockResolvedValue({ data: mockResponse });

      await DrugService.getDrugs({
        page: 2,
        limit: 10,
        search: 'ibuprofen',
        sortBy: 'name',
        sortOrder: 'desc',
      });

      expect(mockGet).toHaveBeenCalledWith(
        '/drugs?page=2&limit=10&search=ibuprofen&sortBy=name&sortOrder=desc'
      );
    });
  });

  describe('getDrugById', () => {
    it('should fetch a single drug by ID', async () => {
      const mockDrug: Drug = {
        id: 1,
        code: '12345-678',
        name: 'Test Drug (Brand)',
        company: 'Test Company',
        launchDate: '2023-01-01T00:00:00.000Z',
      };

      const mockResponse = {
        success: true,
        data: mockDrug,
      };

      mockGet.mockResolvedValue({ data: mockResponse });

      const result = await DrugService.getDrugById(1);

      expect(mockGet).toHaveBeenCalledWith('/drugs/1');
      expect(result).toEqual(mockDrug);
    });
  });

  describe('createDrug', () => {
    it('should create a new drug', async () => {
      const newDrug: CreateDrugRequest = {
        code: '12345-678',
        genericName: 'Test Drug',
        brandName: 'Brand',
        company: 'Test Company',
        launchDate: '2023-01-01',
      };

      const mockResponse = {
        success: true,
        data: {
          id: 1,
          code: '12345-678',
          name: 'Test Drug (Brand)',
          company: 'Test Company',
          launchDate: '2023-01-01T00:00:00.000Z',
        },
      };

      mockPost.mockResolvedValue({ data: mockResponse });

      const result = await DrugService.createDrug(newDrug);

      expect(mockPost).toHaveBeenCalledWith('/drugs', newDrug);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateDrug', () => {
    it('should update an existing drug', async () => {
      const updateData = {
        genericName: 'Updated Drug Name',
        company: 'Updated Company',
      };

      const mockResponse = {
        success: true,
        data: {
          id: 1,
          code: '12345-678',
          name: 'Updated Drug Name (Brand)',
          company: 'Updated Company',
          launchDate: '2023-01-01T00:00:00.000Z',
        },
      };

      mockPut.mockResolvedValue({ data: mockResponse });

      const result = await DrugService.updateDrug(1, updateData);

      expect(mockPut).toHaveBeenCalledWith('/drugs/1', updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteDrug', () => {
    it('should delete a drug', async () => {
      mockDelete.mockResolvedValue({});

      await DrugService.deleteDrug(1);

      expect(mockDelete).toHaveBeenCalledWith('/drugs/1');
    });
  });
});

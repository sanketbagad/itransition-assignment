import { getDrugsQuerySchema } from '../../types/dto';
import { ZodError } from 'zod';

describe('DTO Validation', () => {
  describe('getDrugsQuerySchema', () => {
    it('should validate valid query parameters', () => {
      const validQuery = {
        page: '1',
        limit: '20',
        sortBy: 'name',
        sortOrder: 'asc',
        company: 'Test Company',
        search: 'test search',
      };

      const result = getDrugsQuerySchema.parse(validQuery);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.sortBy).toBe('name');
      expect(result.sortOrder).toBe('asc');
      expect(result.company).toBe('Test Company');
      expect(result.search).toBe('test search');
    });

    it('should apply default values when optional parameters are missing', () => {
      const minimalQuery = {};

      const result = getDrugsQuerySchema.parse(minimalQuery);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.sortBy).toBe('launchDate');
      expect(result.sortOrder).toBe('desc');
      expect(result.company).toBeUndefined();
      expect(result.search).toBeUndefined();
    });

    it('should coerce string numbers to integers', () => {
      const stringQuery = {
        page: '5',
        limit: '50',
      };

      const result = getDrugsQuerySchema.parse(stringQuery);

      expect(result.page).toBe(5);
      expect(result.limit).toBe(50);
      expect(typeof result.page).toBe('number');
      expect(typeof result.limit).toBe('number');
    });

    it('should reject invalid page numbers', () => {
      const invalidQueries = [
        { page: '0' },
        { page: '-1' },
        { page: 'invalid' },
        { page: '1.5' },
      ];

      invalidQueries.forEach(query => {
        expect(() => getDrugsQuerySchema.parse(query)).toThrow(ZodError);
      });
    });

    it('should reject invalid limit values', () => {
      const invalidQueries = [
        { limit: '0' },
        { limit: '-1' },
        { limit: '101' }, // exceeds max
        { limit: 'invalid' },
        { limit: '1.5' },
      ];

      invalidQueries.forEach(query => {
        expect(() => getDrugsQuerySchema.parse(query)).toThrow(ZodError);
      });
    });

    it('should reject invalid sortBy values', () => {
      const invalidQuery = { sortBy: 'invalid_field' };

      expect(() => getDrugsQuerySchema.parse(invalidQuery)).toThrow(ZodError);
    });

    it('should reject invalid sortOrder values', () => {
      const invalidQuery = { sortOrder: 'invalid_order' };

      expect(() => getDrugsQuerySchema.parse(invalidQuery)).toThrow(ZodError);
    });

    it('should accept valid sortBy values', () => {
      const validSortByValues = ['code', 'name', 'company', 'launchDate'];

      validSortByValues.forEach(sortBy => {
        const query = { sortBy };
        const result = getDrugsQuerySchema.parse(query);
        expect(result.sortBy).toBe(sortBy);
      });
    });

    it('should accept valid sortOrder values', () => {
      const validSortOrderValues = ['asc', 'desc'];

      validSortOrderValues.forEach(sortOrder => {
        const query = { sortOrder };
        const result = getDrugsQuerySchema.parse(query);
        expect(result.sortOrder).toBe(sortOrder);
      });
    });

    it('should handle edge case limit values', () => {
      // Test minimum limit
      const minQuery = { limit: '1' };
      const minResult = getDrugsQuerySchema.parse(minQuery);
      expect(minResult.limit).toBe(1);

      // Test maximum limit
      const maxQuery = { limit: '100' };
      const maxResult = getDrugsQuerySchema.parse(maxQuery);
      expect(maxResult.limit).toBe(100);
    });

    it('should handle empty string values', () => {
      const emptyQuery = {
        company: '',
        search: '',
      };

      const result = getDrugsQuerySchema.parse(emptyQuery);
      expect(result.company).toBe('');
      expect(result.search).toBe('');
    });

    it('should preserve special characters in search and company fields', () => {
      const specialCharsQuery = {
        company: 'Johnson & Johnson',
        search: 'drug-name (brand)',
      };

      const result = getDrugsQuerySchema.parse(specialCharsQuery);
      expect(result.company).toBe('Johnson & Johnson');
      expect(result.search).toBe('drug-name (brand)');
    });

    it('should handle very large page numbers', () => {
      const largePageQuery = { page: '999999' };

      const result = getDrugsQuerySchema.parse(largePageQuery);
      expect(result.page).toBe(999999);
    });

    it('should provide detailed error information for validation failures', () => {
      const invalidQuery = {
        page: 'invalid',
        limit: '-1',
        sortBy: 'invalid_field',
        sortOrder: 'invalid_order',
      };

      try {
        getDrugsQuerySchema.parse(invalidQuery);
        fail('Should have thrown ZodError');
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
        const zodError = error as ZodError;
        expect(zodError.issues.length).toBeGreaterThan(0);

        // Check that all invalid fields are reported
        const fieldPaths = zodError.issues.map(issue => issue.path[0]);
        expect(fieldPaths).toContain('page');
        expect(fieldPaths).toContain('limit');
        expect(fieldPaths).toContain('sortBy');
        expect(fieldPaths).toContain('sortOrder');
      }
    });
  });
});

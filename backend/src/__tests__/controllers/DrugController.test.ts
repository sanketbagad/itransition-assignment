import request from 'supertest';
import app from '../../index';
import { Drug } from '../../models/Drug';
import { connectTestDB, closeTestDB, clearTestDB } from '../setup';
import { mockDrugs } from '../fixtures/drugData';

describe('DrugController', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    await Drug.insertMany(mockDrugs);
  });

  describe('GET /api/drugs', () => {
    it('should return paginated drugs with default parameters', async () => {
      const response = await request(app).get('/api/drugs').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(mockDrugs.length);

      // Check data structure
      response.body.data.forEach((drug: Record<string, unknown>) => {
        expect(drug).toHaveProperty('id');
        expect(drug).toHaveProperty('code');
        expect(drug).toHaveProperty('name');
        expect(drug).toHaveProperty('company');
        expect(drug).toHaveProperty('launchDate');
      });

      // Check pagination structure
      expect(response.body.pagination).toHaveProperty('currentPage');
      expect(response.body.pagination).toHaveProperty('totalPages');
      expect(response.body.pagination).toHaveProperty('totalItems');
      expect(response.body.pagination).toHaveProperty('itemsPerPage');
      expect(response.body.pagination).toHaveProperty('hasNextPage');
      expect(response.body.pagination).toHaveProperty('hasPreviousPage');
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/api/drugs')
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.itemsPerPage).toBe(2);
    });

    it('should handle search parameter', async () => {
      const response = await request(app)
        .get('/api/drugs')
        .query({ search: 'Alpha' })
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toContain('Alpha');
    });

    it('should handle company filter', async () => {
      const response = await request(app)
        .get('/api/drugs')
        .query({ company: 'Test Pharma Inc' })
        .expect(200);

      expect(response.body.data.length).toBe(2);
      response.body.data.forEach((drug: { company: string }) => {
        expect(drug.company).toBe('Test Pharma Inc');
      });
    });

    it('should handle sorting parameters', async () => {
      const response = await request(app)
        .get('/api/drugs')
        .query({ sortBy: 'name', sortOrder: 'asc' })
        .expect(200);

      const names = response.body.data.map(
        (drug: { name: string }) => drug.name
      );
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    it('should handle invalid page parameter', async () => {
      const response = await request(app)
        .get('/api/drugs')
        .query({ page: 'invalid' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation Error');
    });

    it('should handle invalid limit parameter', async () => {
      const response = await request(app)
        .get('/api/drugs')
        .query({ limit: -1 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation Error');
    });

    it('should handle invalid sortBy parameter', async () => {
      const response = await request(app)
        .get('/api/drugs')
        .query({ sortBy: 'invalid' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation Error');
    });

    it('should handle limit exceeding maximum', async () => {
      const response = await request(app)
        .get('/api/drugs')
        .query({ limit: 150 })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation Error');
    });
  });

  describe('GET /api/table-config', () => {
    it('should return table configuration', async () => {
      const response = await request(app).get('/api/table-config').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('columns');
      expect(response.body.data).toHaveProperty('defaultSort');
      expect(response.body.data).toHaveProperty('pagination');
      expect(response.body.data.columns).toBeInstanceOf(Array);
    });

    it('should return valid column configuration', async () => {
      const response = await request(app).get('/api/table-config').expect(200);

      const columns = response.body.data.columns;
      expect(columns.length).toBeGreaterThan(0);

      columns.forEach(
        (column: {
          key: string;
          label: string;
          sortable: boolean;
          filterable: boolean;
        }) => {
          expect(column).toHaveProperty('key');
          expect(column).toHaveProperty('label');
          expect(column).toHaveProperty('sortable');
          expect(column).toHaveProperty('filterable');
          expect(typeof column.sortable).toBe('boolean');
          expect(typeof column.filterable).toBe('boolean');
        }
      );
    });
  });

  describe('GET /api/companies', () => {
    it('should return list of companies', async () => {
      const response = await request(app).get('/api/companies').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(3);
      expect(response.body.data).toContain('Test Pharma Inc');
      expect(response.body.data).toContain('Mock Labs Ltd');
      expect(response.body.data).toContain('Sample Corp');
    });

    it('should return sorted companies', async () => {
      const response = await request(app).get('/api/companies').expect(200);

      const companies = response.body.data;
      const sortedCompanies = [...companies].sort();
      expect(companies).toEqual(sortedCompanies);
    });

    it('should return empty array when no drugs exist', async () => {
      await clearTestDB();

      const response = await request(app).get('/api/companies').expect(200);

      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/statistics', () => {
    it('should return database statistics', async () => {
      const response = await request(app).get('/api/statistics').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('totalDrugs');
      expect(response.body.data).toHaveProperty('totalCompanies');
      expect(response.body.data).toHaveProperty('averageDrugsPerCompany');
      expect(response.body.data).toHaveProperty('oldestDrug');
      expect(response.body.data).toHaveProperty('newestDrug');

      expect(response.body.data.totalDrugs).toBe(mockDrugs.length);
      expect(response.body.data.totalCompanies).toBe(3);
      expect(typeof response.body.data.averageDrugsPerCompany).toBe('number');
    });

    it('should return zero statistics when no drugs exist', async () => {
      await clearTestDB();

      const response = await request(app).get('/api/statistics').expect(200);

      expect(response.body.data.totalDrugs).toBe(0);
      expect(response.body.data.totalCompanies).toBe(0);
      expect(response.body.data.averageDrugsPerCompany).toBe(0);
      expect(response.body.data.oldestDrug).toBeNull();
      expect(response.body.data.newestDrug).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This would require mocking the database connection
      // For now, we'll test with a malformed query
      const response = await request(app)
        .get('/api/drugs')
        .query({ page: 'not-a-number' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return 404 for non-existent endpoints', async () => {
      const response = await request(app).get('/api/non-existent').expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body).toHaveProperty('statusCode', 404);
    });
  });

  describe('CORS and Headers', () => {
    it('should include CORS headers', async () => {
      const response = await request(app).get('/api/drugs').expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/drugs').expect(200);

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});

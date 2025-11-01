import request from 'supertest';
import app from '../../index';
import { Drug } from '../../models/Drug';
import { connectTestDB, closeTestDB, clearTestDB } from '../setup';

describe('API Integration Tests', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Complete Workflow', () => {
    it('should handle complete drug management workflow', async () => {
      // 1. Initially should have no drugs
      let response = await request(app).get('/api/drugs').expect(200);

      expect(response.body.data).toHaveLength(0);
      expect(response.body.pagination.totalItems).toBe(0);

      // 2. Add some test drugs
      const testDrugs = [
        {
          code: 'WORKFLOW001',
          genericName: 'Workflow Drug A',
          brandName: 'Brand A',
          company: 'Test Company A',
          launchDate: new Date('2020-01-01'),
        },
        {
          code: 'WORKFLOW002',
          genericName: 'Workflow Drug B',
          brandName: 'Brand B',
          company: 'Test Company B',
          launchDate: new Date('2021-01-01'),
        },
      ];

      await Drug.insertMany(testDrugs);

      // 3. Should now return the drugs
      response = await request(app).get('/api/drugs').expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.totalItems).toBe(2);

      // 4. Test filtering by company
      response = await request(app)
        .get('/api/drugs')
        .query({ company: 'Test Company A' })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].company).toBe('Test Company A');

      // 5. Test search functionality
      response = await request(app)
        .get('/api/drugs')
        .query({ search: 'Workflow Drug A' })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toContain('Workflow Drug A');

      // 6. Test companies endpoint
      response = await request(app).get('/api/companies').expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toContain('Test Company A');
      expect(response.body.data).toContain('Test Company B');

      // 7. Test statistics endpoint
      response = await request(app).get('/api/statistics').expect(200);

      expect(response.body.data.totalDrugs).toBe(2);
      expect(response.body.data.totalCompanies).toBe(2);

      // 8. Test table configuration
      response = await request(app).get('/api/table-config').expect(200);

      expect(response.body.data).toHaveProperty('columns');
      expect(response.body.data.columns).toBeInstanceOf(Array);
    });

    it('should handle complex search and filtering scenarios', async () => {
      const complexTestData = [
        {
          code: 'COMPLEX001',
          genericName: 'Acetaminophen',
          brandName: 'Tylenol',
          company: 'Johnson & Johnson',
          launchDate: new Date('2000-01-01'),
        },
        {
          code: 'COMPLEX002',
          genericName: 'Ibuprofen',
          brandName: 'Advil',
          company: 'Pfizer',
          launchDate: new Date('2001-01-01'),
        },
        {
          code: 'COMPLEX003',
          genericName: 'Aspirin',
          brandName: 'Bayer Aspirin',
          company: 'Bayer',
          launchDate: new Date('2002-01-01'),
        },
        {
          code: 'COMPLEX004',
          genericName: 'Omeprazole',
          brandName: 'Prilosec',
          company: 'Pfizer',
          launchDate: new Date('2003-01-01'),
        },
      ];

      await Drug.insertMany(complexTestData);

      // Test multi-field search
      let response = await request(app)
        .get('/api/drugs')
        .query({ search: 'Pfizer' })
        .expect(200);

      expect(response.body.data).toHaveLength(2);

      // Test search by brand name
      response = await request(app)
        .get('/api/drugs')
        .query({ search: 'Tylenol' })
        .expect(200);

      expect(response.body.data).toHaveLength(1);

      // Test search by code
      response = await request(app)
        .get('/api/drugs')
        .query({ search: 'COMPLEX003' })
        .expect(200);

      expect(response.body.data).toHaveLength(1);

      // Test company filter with Pfizer
      response = await request(app)
        .get('/api/drugs')
        .query({ company: 'Pfizer' })
        .expect(200);

      expect(response.body.data).toHaveLength(2);

      // Test sorting by name
      response = await request(app)
        .get('/api/drugs')
        .query({ sortBy: 'name', sortOrder: 'asc' })
        .expect(200);

      const names = response.body.data.map(
        (drug: { name: string }) => drug.name
      );
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);

      // Test sorting by launch date
      response = await request(app)
        .get('/api/drugs')
        .query({ sortBy: 'launchDate', sortOrder: 'desc' })
        .expect(200);

      const dates = response.body.data.map(
        (drug: { launchDate: string }) => new Date(drug.launchDate)
      );
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1].getTime()).toBeGreaterThanOrEqual(
          dates[i].getTime()
        );
      }
    });

    it('should handle pagination edge cases', async () => {
      // Create 25 test drugs
      const manyDrugs = Array.from({ length: 25 }, (_, i) => ({
        code: `MANY${String(i + 1).padStart(3, '0')}`,
        genericName: `Drug ${i + 1}`,
        brandName: `Brand ${i + 1}`,
        company: `Company ${(i % 5) + 1}`,
        launchDate: new Date(2020 + (i % 5), 0, 1),
      }));

      await Drug.insertMany(manyDrugs);

      // Test first page
      let response = await request(app)
        .get('/api/drugs')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.hasNextPage).toBe(true);
      expect(response.body.pagination.hasPreviousPage).toBe(false);

      // Test middle page
      response = await request(app)
        .get('/api/drugs')
        .query({ page: 2, limit: 10 })
        .expect(200);

      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination.currentPage).toBe(2);
      expect(response.body.pagination.hasNextPage).toBe(true);
      expect(response.body.pagination.hasPreviousPage).toBe(true);

      // Test last page
      response = await request(app)
        .get('/api/drugs')
        .query({ page: 3, limit: 10 })
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.pagination.currentPage).toBe(3);
      expect(response.body.pagination.hasNextPage).toBe(false);
      expect(response.body.pagination.hasPreviousPage).toBe(true);

      // Test beyond last page
      response = await request(app)
        .get('/api/drugs')
        .query({ page: 10, limit: 10 })
        .expect(200);

      expect(response.body.data).toHaveLength(0);
      expect(response.body.pagination.currentPage).toBe(10);
      expect(response.body.pagination.hasNextPage).toBe(false);
      expect(response.body.pagination.hasPreviousPage).toBe(true);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle malformed requests gracefully', async () => {
      // Test invalid JSON in query params (simulated)
      const response = await request(app)
        .get('/api/drugs')
        .query({ page: 'not-a-number', limit: 'also-not-a-number' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.statusCode).toBe(400);
    });

    it('should handle non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-endpoint')
        .expect(404);

      expect(response.body.error).toBe('Not Found');
      expect(response.body.statusCode).toBe(404);
    });

    it('should handle unsupported HTTP methods', async () => {
      const response = await request(app).post('/api/drugs').expect(404);

      expect(response.body.statusCode).toBe(404);
    });
  });

  describe('Response Format Consistency', () => {
    beforeEach(async () => {
      const testDrug = {
        code: 'FORMAT001',
        genericName: 'Format Test Drug',
        brandName: 'Format Brand',
        company: 'Format Company',
        launchDate: new Date('2020-01-01'),
      };

      await new Drug(testDrug).save();
    });

    it('should have consistent success response format', async () => {
      const endpoints = [
        '/api/drugs',
        '/api/table-config',
        '/api/companies',
        '/api/statistics',
      ];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint).expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('timestamp');
        expect(typeof response.body.timestamp).toBe('string');
      }
    });

    it('should have consistent error response format', async () => {
      const response = await request(app)
        .get('/api/drugs')
        .query({ page: 'invalid' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('statusCode');
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.timestamp).toBe('string');
    });
  });
});

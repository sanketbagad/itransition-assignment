import { IDrug } from '../../models/Drug';

export const mockDrugs: Partial<IDrug>[] = [
  {
    code: 'TEST001',
    genericName: 'Test Drug Alpha',
    brandName: 'Alpha Brand',
    company: 'Test Pharma Inc',
    launchDate: new Date('2020-01-15'),
  },
  {
    code: 'TEST002',
    genericName: 'Test Drug Beta',
    brandName: 'Beta Brand',
    company: 'Test Pharma Inc',
    launchDate: new Date('2021-03-22'),
  },
  {
    code: 'TEST003',
    genericName: 'Test Drug Gamma',
    brandName: 'Gamma Brand',
    company: 'Mock Labs Ltd',
    launchDate: new Date('2019-08-10'),
  },
  {
    code: 'TEST004',
    genericName: 'Test Drug Delta',
    brandName: 'Delta Brand',
    company: 'Mock Labs Ltd',
    launchDate: new Date('2022-11-05'),
  },
  {
    code: 'TEST005',
    genericName: 'Test Drug Epsilon',
    brandName: 'Epsilon Brand',
    company: 'Sample Corp',
    launchDate: new Date('2020-06-18'),
  },
];

export const createMockDrug = (
  overrides: Partial<IDrug> = {}
): Partial<IDrug> => ({
  code: 'MOCK001',
  genericName: 'Mock Generic Drug',
  brandName: 'Mock Brand',
  company: 'Mock Company',
  launchDate: new Date('2021-01-01'),
  ...overrides,
});

export const expectDrugResponse = {
  toHaveValidStructure: (drug: Record<string, unknown>) => {
    expect(drug).toHaveProperty('id');
    expect(drug).toHaveProperty('code');
    expect(drug).toHaveProperty('genericName');
    expect(drug).toHaveProperty('brandName');
    expect(drug).toHaveProperty('company');
    expect(drug).toHaveProperty('launchDate');
    expect(typeof drug.id).toBe('number');
    expect(typeof drug.code).toBe('string');
    expect(typeof drug.genericName).toBe('string');
    expect(typeof drug.brandName).toBe('string');
    expect(typeof drug.company).toBe('string');
    expect(typeof drug.launchDate).toBe('string');
  },
};

export const expectPaginationResponse = {
  toHaveValidStructure: (pagination: Record<string, unknown>) => {
    expect(pagination).toHaveProperty('page');
    expect(pagination).toHaveProperty('limit');
    expect(pagination).toHaveProperty('totalItems');
    expect(pagination).toHaveProperty('totalPages');
    expect(pagination).toHaveProperty('hasNextPage');
    expect(pagination).toHaveProperty('hasPrevPage');
    expect(typeof pagination.page).toBe('number');
    expect(typeof pagination.limit).toBe('number');
    expect(typeof pagination.totalItems).toBe('number');
    expect(typeof pagination.totalPages).toBe('number');
    expect(typeof pagination.hasNextPage).toBe('boolean');
    expect(typeof pagination.hasPrevPage).toBe('boolean');
  },
};

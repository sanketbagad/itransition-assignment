export interface IDrug {
  _id?: string;
  code: string;
  genericName: string;
  brandName: string;
  company: string;
  launchDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface IDrugStats {
  totalDrugs: number;
  totalCompanies: number;
  companiesWithMostDrugs: Array<{
    company: string;
    count: number;
  }>;
  averageDrugsPerCompany: number;
  distributionByYear: Array<{
    year: number;
    count: number;
  }>;
}

export interface IQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  company?: string;
}

export interface ITableColumn {
  key: string;
  label: string;
  sortable: boolean;
}

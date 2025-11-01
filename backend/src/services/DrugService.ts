import { Drug, IDrug } from '../models/Drug';
import {
  DrugResponseDTO,
  GetDrugsQuery,
  PaginatedResponse,
} from '../types/dto';
import {
  defaultTableConfiguration,
  TableConfiguration,
} from '../config/tableConfig';

export class DrugService {
  /**
   * Transform a drug document to response DTO
   */
  private transformDrugToDTO(drug: IDrug, index: number): DrugResponseDTO {
    return {
      id: index + 1, // Sequential ID based on sorted order
      code: drug.code,
      name: `${drug.genericName} (${drug.brandName})`,
      company: drug.company,
      launchDate: drug.launchDate.toISOString(),
    };
  }

  /**
   * Get paginated drugs with filtering and sorting
   */
  async getDrugs(
    query: GetDrugsQuery
  ): Promise<PaginatedResponse<DrugResponseDTO>> {
    const { page, limit, company, sortBy, sortOrder, search } = query;

    // Ensure page and limit are positive
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));

    // Build filter
    const filter: Record<string, unknown> = {};

    if (company) {
      filter.company = company;
    }

    if (search) {
      filter.$or = [
        { genericName: { $regex: search, $options: 'i' } },
        { brandName: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    } // Build sort query
    const sortField = sortBy === 'name' ? 'genericName' : sortBy;
    const sortQuery: Record<string, 1 | -1> = {};
    sortQuery[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Add secondary sort by _id for consistent ordering when sort fields are equal
    sortQuery._id = 1;

    // Execute queries
    const skip = (safePage - 1) * safeLimit;

    const [drugs, totalItems] = await Promise.all([
      Drug.find(filter)
        .sort(sortQuery as Record<string, 1 | -1>)
        .skip(skip)
        .limit(safeLimit),
      Drug.countDocuments(filter).exec(),
    ]);

    // Transform to DTOs with proper sequential IDs
    const data = drugs.map((drug, index) =>
      this.transformDrugToDTO(drug, skip + index)
    );

    const totalPages = Math.ceil(totalItems / safeLimit);

    return {
      data,
      pagination: {
        currentPage: safePage,
        totalPages,
        totalItems,
        itemsPerPage: safeLimit,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
      },
    };
  } /**
   * Get all unique companies for filter dropdown
   */
  async getCompanies(): Promise<string[]> {
    const companies = await Drug.distinct('company').exec();
    return companies.sort();
  }

  /**
   * Get table configuration
   */
  getTableConfiguration(): TableConfiguration {
    return defaultTableConfiguration;
  }

  /**
   * Get drug statistics
   */
  async getStatistics() {
    const [totalDrugs, companies, oldestDrug, newestDrug] = await Promise.all([
      Drug.countDocuments().exec(),
      Drug.distinct('company').exec(),
      Drug.findOne().sort({ launchDate: 1 }).exec(),
      Drug.findOne().sort({ launchDate: -1 }).exec(),
    ]);

    const totalCompanies = companies.length;
    const averageDrugsPerCompany =
      totalCompanies > 0 ? totalDrugs / totalCompanies : 0;

    return {
      totalDrugs,
      totalCompanies,
      averageDrugsPerCompany,
      oldestDrug: oldestDrug?.launchDate || null,
      newestDrug: newestDrug?.launchDate || null,
    };
  }
}

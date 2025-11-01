import { Request, Response, NextFunction } from 'express';
import { DrugService } from '../services/DrugService';
import { getDrugsQuerySchema } from '../types/dto';
import { ZodError } from 'zod';

export class DrugController {
  private drugService: DrugService;

  constructor() {
    this.drugService = new DrugService();
  }

  /**
   * Get drugs with pagination, filtering, and sorting
   * GET /api/drugs
   */
  getDrugs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate query parameters
      const query = getDrugsQuerySchema.parse(req.query);

      // Get drugs from service
      const result = await this.drugService.getDrugs(query);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid query parameters',
          details: error.issues,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      next(error);
    }
  };

  /**
   * Get table configuration
   * GET /api/table-config
   */
  getTableConfiguration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const config = this.drugService.getTableConfiguration();
      res.status(200).json({
        success: true,
        data: config,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all companies for filter dropdown
   * GET /api/companies
   */
  getCompanies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const companies = await this.drugService.getCompanies();
      res.status(200).json({
        success: true,
        data: companies,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get database statistics
   * GET /api/statistics
   */
  getStatistics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const stats = await this.drugService.getStatistics();
      res.status(200).json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };
}

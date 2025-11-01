import { Router } from 'express';
import { DrugController } from '../controllers/DrugController';

const router = Router();
const drugController = new DrugController();

/**
 * @route GET /api/drugs
 * @description Get drugs with filtering, sorting, and pagination
 * @query {string} search - Search term for drug name or company
 * @query {string} company - Filter by company name
 * @query {string} sortBy - Field to sort by (code, genericName, brandName, company, launchDate)
 * @query {string} sortOrder - Sort order (asc, desc)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 50, max: 100)
 */
router.get('/drugs', drugController.getDrugs.bind(drugController));

/**
 * @route GET /api/table-config
 * @description Get table configuration for frontend
 * @returns {Object} Table configuration with columns, sorting, pagination settings
 */
router.get('/table-config', drugController.getTableConfiguration.bind(drugController));

/**
 * @route GET /api/companies
 * @description Get list of all unique companies
 * @returns {Array<string>} List of company names
 */
router.get('/companies', drugController.getCompanies.bind(drugController));

/**
 * @route GET /api/statistics
 * @description Get database statistics
 * @returns {Object} Statistics including total drugs count and companies count
 */
router.get('/statistics', drugController.getStatistics.bind(drugController));

export default router;
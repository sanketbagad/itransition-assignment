import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateTime,
  debounce,
  parseDrugName,
  validateDrugCode,
  truncateText,
  getCompanyInitials,
} from '../../utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2023-12-25T10:30:00.000Z';
      const result = formatDate(date);
      expect(result).toMatch(/Dec 25, 2023/);
    });

    it('should handle invalid date', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime correctly', () => {
      const date = '2023-12-25T10:30:00.000Z';
      const result = formatDateTime(date);
      expect(result).toMatch(/Dec 25, 2023/);
    });

    it('should handle invalid datetime', () => {
      const result = formatDateTime('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let callCount = 0;
      const fn = () => callCount++;
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(callCount).toBe(0);

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(callCount).toBe(1);
    });
  });

  describe('parseDrugName', () => {
    it('should parse drug name with brand name in parentheses', () => {
      const result = parseDrugName('Ibuprofen (Advil)');
      expect(result).toEqual({
        genericName: 'Ibuprofen',
        brandName: 'Advil',
      });
    });

    it('should handle drug name without brand name', () => {
      const result = parseDrugName('Ibuprofen');
      expect(result).toEqual({
        genericName: 'Ibuprofen',
        brandName: '',
      });
    });

    it('should handle complex drug names', () => {
      const result = parseDrugName('Acetaminophen Extra Strength (Tylenol ES)');
      expect(result).toEqual({
        genericName: 'Acetaminophen Extra Strength',
        brandName: 'Tylenol ES',
      });
    });
  });

  describe('validateDrugCode', () => {
    it('should validate correct drug codes', () => {
      expect(validateDrugCode('12345-678')).toBe(true);
      expect(validateDrugCode('ABC123')).toBe(true);
      expect(validateDrugCode('0006-0568')).toBe(true);
    });

    it('should reject invalid drug codes', () => {
      expect(validateDrugCode('')).toBe(false);
      expect(validateDrugCode('12')).toBe(false);
      expect(validateDrugCode('12 345')).toBe(false);
      expect(validateDrugCode('12345@678')).toBe(false);
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that needs to be truncated';
      const result = truncateText(longText, 20);
      expect(result).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      const result = truncateText(shortText, 20);
      expect(result).toBe('Short text');
    });
  });

  describe('getCompanyInitials', () => {
    it('should get initials from company name', () => {
      expect(getCompanyInitials('Johnson & Johnson')).toBe('JJ');
      expect(getCompanyInitials('Pfizer Inc')).toBe('PI');
      expect(getCompanyInitials('Merck Sharp & Dohme Corp.')).toBe('MS');
    });

    it('should handle single word company', () => {
      expect(getCompanyInitials('Pfizer')).toBe('P');
    });

    it('should handle empty company name', () => {
      expect(getCompanyInitials('')).toBe('');
    });
  });
});

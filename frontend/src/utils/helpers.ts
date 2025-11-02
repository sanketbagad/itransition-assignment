import type { Drug } from '../types';

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const parseDrugName = (
  name: string
): { genericName: string; brandName: string } => {
  // Try to parse "GenericName (BrandName)" format
  const match = name.match(/^(.+?)\s*\((.+?)\)$/);
  if (match) {
    return {
      genericName: match[1].trim(),
      brandName: match[2].trim(),
    };
  }

  // If no parentheses, assume it's all generic name
  return {
    genericName: name.trim(),
    brandName: '',
  };
};

export const searchDrugs = (drugs: Drug[], searchTerm: string): Drug[] => {
  if (!searchTerm.trim()) return drugs;

  const term = searchTerm.toLowerCase();
  return drugs.filter(
    drug =>
      drug.name.toLowerCase().includes(term) ||
      drug.company.toLowerCase().includes(term) ||
      drug.code.toLowerCase().includes(term)
  );
};

export const sortDrugs = (
  drugs: Drug[],
  sortBy: 'name' | 'company' | 'launchDate',
  sortOrder: 'asc' | 'desc'
): Drug[] => {
  return [...drugs].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'company':
        aValue = a.company.toLowerCase();
        bValue = b.company.toLowerCase();
        break;
      case 'launchDate':
        aValue = new Date(a.launchDate).getTime();
        bValue = new Date(b.launchDate).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

export const validateDrugCode = (code: string): boolean => {
  // Basic validation for drug codes (format: XXXXX-XXX or similar)
  const codePattern = /^[0-9A-Za-z-]+$/;
  return codePattern.test(code) && code.length >= 3;
};

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getCompanyInitials = (companyName: string): string => {
  return companyName
    .split(' ')
    .filter(word => word.length > 0 && !/^[&-.，]/.test(word)) // Filter out symbols and empty words
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

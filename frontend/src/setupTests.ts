import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock MUI icons to prevent file handle issues
vi.mock('@mui/icons-material', () => ({
  Search: () => 'SearchIcon',
  Clear: () => 'ClearIcon',
  FilterList: () => 'FilterListIcon',
  Sort: () => 'SortIcon',
  MoreVert: () => 'MoreVertIcon',
  Edit: () => 'EditIcon',
  Delete: () => 'DeleteIcon',
  Info: () => 'InfoIcon',
  Business: () => 'BusinessIcon',
  DateRange: () => 'DateRangeIcon',
  QrCode: () => 'QrCodeIcon',
  Visibility: () => 'VisibilityIcon',
  ArrowUpward: () => 'ArrowUpwardIcon',
  ArrowDownward: () => 'ArrowDownwardIcon',
  Add: () => 'AddIcon',
  Close: () => 'CloseIcon',
  Menu: () => 'MenuIcon',
  ExpandMore: () => 'ExpandMoreIcon',
  ChevronLeft: () => 'ChevronLeftIcon',
  ChevronRight: () => 'ChevronRightIcon',
}));

// Mock @mui/icons-material/esm specifically to prevent EMFILE errors
vi.mock('@mui/icons-material/esm', () => ({
  Search: () => 'SearchIcon',
  Clear: () => 'ClearIcon',
  FilterList: () => 'FilterListIcon',
  Sort: () => 'SortIcon',
  MoreVert: () => 'MoreVertIcon',
  Edit: () => 'EditIcon',
  Delete: () => 'DeleteIcon',
  Info: () => 'InfoIcon',
  Business: () => 'BusinessIcon',
  DateRange: () => 'DateRangeIcon',
  QrCode: () => 'QrCodeIcon',
  Visibility: () => 'VisibilityIcon',
  ArrowUpward: () => 'ArrowUpwardIcon',
  ArrowDownward: () => 'ArrowDownwardIcon',
  Add: () => 'AddIcon',
  Close: () => 'CloseIcon',
  Menu: () => 'MenuIcon',
  ExpandMore: () => 'ExpandMoreIcon',
  ChevronLeft: () => 'ChevronLeftIcon',
  ChevronRight: () => 'ChevronRightIcon',
}));

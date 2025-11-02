import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchAndFilter from '../../components/SearchAndFilter';
import type { SearchParams } from '../../types';

const mockProps = {
  onParamsChange: vi.fn(),
  currentParams: {
    page: 1,
    limit: 20,
    sortOrder: 'asc' as const,
  } as SearchParams,
  totalItems: 100,
};

describe('SearchAndFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and filter controls', () => {
    render(<SearchAndFilter {...mockProps} />);

    expect(
      screen.getByPlaceholderText(/search drugs, companies, or codes/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
    expect(screen.getByLabelText('Order')).toBeInTheDocument();
    expect(screen.getByLabelText('Per page')).toBeInTheDocument();
    expect(screen.getByText('Showing 100 results')).toBeInTheDocument();
  });

  it('calls onParamsChange when search term changes', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilter {...mockProps} />);

    const searchInput = screen.getByPlaceholderText(
      /search drugs, companies, or codes/i
    );
    await user.type(searchInput, 'ibuprofen');

    // Wait for debounced search
    await waitFor(
      () => {
        expect(mockProps.onParamsChange).toHaveBeenCalledWith({
          search: 'ibuprofen',
          page: 1,
        });
      },
      { timeout: 1000 }
    );
  });

  it('handles sort by selection', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilter {...mockProps} />);

    const sortBySelect = screen.getByLabelText('Sort by');
    await user.click(sortBySelect);

    const nameOption = screen.getByText('Name');
    await user.click(nameOption);

    expect(mockProps.onParamsChange).toHaveBeenCalledWith({
      sortBy: 'name',
      page: 1,
    });
  });

  it('handles sort order selection', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilter {...mockProps} />);

    const sortOrderSelect = screen.getByLabelText('Order');
    await user.click(sortOrderSelect);

    const descOption = screen.getByText('Z → A');
    await user.click(descOption);

    expect(mockProps.onParamsChange).toHaveBeenCalledWith({
      sortOrder: 'desc',
      page: 1,
    });
  });

  it('handles items per page selection', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilter {...mockProps} />);

    const limitSelect = screen.getByLabelText('Per page');
    await user.click(limitSelect);

    const fiftyOption = screen.getByText('50');
    await user.click(fiftyOption);

    expect(mockProps.onParamsChange).toHaveBeenCalledWith({
      limit: '50',
      page: 1,
    });
  });

  it('shows active filters as chips', () => {
    const propsWithFilters = {
      ...mockProps,
      currentParams: {
        ...mockProps.currentParams,
        search: 'ibuprofen',
        sortBy: 'name' as const,
        sortOrder: 'desc' as const,
      },
    };

    render(<SearchAndFilter {...propsWithFilters} />);

    expect(screen.getByText('Search: "ibuprofen"')).toBeInTheDocument();
    expect(screen.getByText('Sort: name (desc)')).toBeInTheDocument();
  });

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup();
    const propsWithSearch = {
      ...mockProps,
      currentParams: {
        ...mockProps.currentParams,
        search: 'ibuprofen',
      },
    };

    render(<SearchAndFilter {...propsWithSearch} />);

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    expect(mockProps.onParamsChange).toHaveBeenCalledWith({
      search: undefined,
      page: 1,
    });
  });

  it('clears all filters when clear filters button is clicked', async () => {
    const user = userEvent.setup();
    const propsWithFilters = {
      ...mockProps,
      currentParams: {
        ...mockProps.currentParams,
        search: 'ibuprofen',
        sortBy: 'name' as const,
      },
    };

    render(<SearchAndFilter {...propsWithFilters} />);

    // The clear all filters button should be visible since we have active filters
    const clearFiltersButton = screen.getByRole('button', {
      name: /clear all filters/i,
    });
    await user.click(clearFiltersButton);

    expect(mockProps.onParamsChange).toHaveBeenCalledWith({
      page: 1,
      search: undefined,
      sortBy: undefined,
      sortOrder: 'asc',
    });
  });

  it('displays correct results count', () => {
    render(<SearchAndFilter {...mockProps} totalItems={0} />);
    expect(screen.getByText('No results found')).toBeInTheDocument();

    render(<SearchAndFilter {...mockProps} totalItems={1} />);
    expect(screen.getByText('Showing 1 result')).toBeInTheDocument();

    render(<SearchAndFilter {...mockProps} totalItems={100} />);
    expect(screen.getByText('Showing 100 results')).toBeInTheDocument();
  });
});

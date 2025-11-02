import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  Typography,
} from '@mui/material';
import { Search, Clear, Sort, FilterList } from '@mui/icons-material';
import type { SearchParams } from '../types';

interface SearchAndFilterProps {
  onParamsChange: (params: Partial<SearchParams>) => void;
  currentParams: SearchParams;
  totalItems?: number;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onParamsChange,
  currentParams,
  totalItems = 0,
}) => {
  const [searchTerm, setSearchTerm] = React.useState(
    currentParams.search || ''
  );

  // Simple debounced search without complex dependencies
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== (currentParams.search || '')) {
        onParamsChange({
          search: searchTerm || undefined,
          page: 1, // Reset to first page on search
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]); // Only depend on searchTerm to avoid loops

  const handleSortChange = (field: string, value: string) => {
    onParamsChange({
      [field]: value,
      page: 1, // Reset to first page on sort change
    });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onParamsChange({
      search: undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    onParamsChange({
      search: undefined,
      sortBy: undefined,
      sortOrder: 'asc',
      page: 1,
    });
  };

  const hasActiveFilters = Boolean(
    currentParams.search ||
      currentParams.sortBy ||
      currentParams.sortOrder !== 'asc'
  );

  return (
    <Paper elevation={1} sx={{ p: { xs: 2, sm: 2 }, mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1, sm: 2 },
          flexWrap: 'wrap',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        {/* Search Field */}
        <TextField
          placeholder="Search drugs, companies, or codes..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            flexGrow: 1,
            minWidth: { xs: '100%', sm: 250, md: 300 },
            order: { xs: 1, sm: 1 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <Tooltip title="Clear search">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <Clear />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />

        {/* Filter Controls Container */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            flexWrap: 'wrap',
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-start' },
            order: { xs: 2, sm: 2 },
          }}
        >
          {/* Sort By */}
          <FormControl size="small" sx={{ minWidth: { xs: 120, sm: 140 } }}>
            <InputLabel id="sort-by-label">Sort by</InputLabel>
            <Select
              labelId="sort-by-label"
              value={currentParams.sortBy || ''}
              label="Sort by"
              onChange={e => handleSortChange('sortBy', e.target.value)}
              startAdornment={<Sort sx={{ mr: 1, color: 'action.active' }} />}
            >
              <MenuItem value="">
                <em>Default</em>
              </MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="company">Company</MenuItem>
              <MenuItem value="launchDate">Launch Date</MenuItem>
            </Select>
          </FormControl>

          {/* Sort Order */}
          <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 120 } }}>
            <InputLabel id="sort-order-label">Order</InputLabel>
            <Select
              labelId="sort-order-label"
              value={currentParams.sortOrder || 'asc'}
              label="Order"
              onChange={e => handleSortChange('sortOrder', e.target.value)}
            >
              <MenuItem value="asc">A → Z</MenuItem>
              <MenuItem value="desc">Z → A</MenuItem>
            </Select>
          </FormControl>

          {/* Items per page */}
          <FormControl size="small" sx={{ minWidth: { xs: 80, sm: 100 } }}>
            <InputLabel id="limit-label">Per page</InputLabel>
            <Select
              labelId="limit-label"
              value={currentParams.limit || 20}
              label="Per page"
              onChange={e => handleSortChange('limit', String(e.target.value))}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Tooltip title="Clear all filters">
              <IconButton
                onClick={handleClearFilters}
                color="primary"
                sx={{
                  alignSelf: 'center',
                  order: { xs: 1, sm: 4 },
                }}
              >
                <FilterList />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Active filters display */}
      {hasActiveFilters && (
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {currentParams.search && (
            <Chip
              label={`Search: "${currentParams.search}"`}
              size="small"
              onDelete={handleClearSearch}
              color="primary"
              variant="outlined"
            />
          )}
          {currentParams.sortBy && (
            <Chip
              label={`Sort: ${currentParams.sortBy} (${currentParams.sortOrder || 'asc'})`}
              size="small"
              onDelete={() => {
                onParamsChange({
                  sortBy: undefined,
                  sortOrder: 'asc',
                });
              }}
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Results summary */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {totalItems > 0
            ? `Showing ${totalItems} result${totalItems !== 1 ? 's' : ''}`
            : 'No results found'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SearchAndFilter;

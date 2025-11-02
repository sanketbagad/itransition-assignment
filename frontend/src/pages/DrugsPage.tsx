import React from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Pagination,
  Fab,
  Zoom,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add, ViewModule, ViewList } from '@mui/icons-material';
import { useDrugs, useDeleteDrug } from '../hooks/useDrugs';
import { usePagination } from '../hooks/usePagination';
import SearchAndFilter from '../components/SearchAndFilter';
import DrugCard from '../components/DrugCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import type { Drug } from '../types';

const DrugsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  // Use the new pagination hook
  const pagination = usePagination({
    initialParams: { page: 1, limit: 20, sortOrder: 'asc' },
  });

  const { data, isLoading, error, isError } = useDrugs(pagination.params);
  const deleteMutation = useDeleteDrug();

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    pagination.setPage(page);
  };

  const handleEdit = (_drug: Drug) => {
    // TODO: Open edit dialog
  };

  const handleDelete = async (drug: Drug) => {
    if (window.confirm(`Are you sure you want to delete "${drug.name}"?`)) {
      try {
        await deleteMutation.mutateAsync(drug.id);
      } catch {
        // Error handling can be implemented here
      }
    }
  };

  const handleView = (_drug: Drug) => {
    // TODO: Open view dialog
  };

  const handleCreate = () => {
    // TODO: Open create dialog
  };

  if (isError) {
    return (
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2 }}>
        <Alert severity="error" sx={{ mt: 3 }}>
          {error instanceof Error
            ? error.message
            : 'Failed to load drugs. Please try again.'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 2, sm: 3 },
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          Drug Inventory
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setViewMode('grid')}
            startIcon={<ViewModule />}
            sx={{ minWidth: { xs: 'auto', sm: 'unset' } }}
          >
            <Box
              component="span"
              sx={{ display: { xs: 'none', sm: 'inline' } }}
            >
              Grid
            </Box>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setViewMode('list')}
            startIcon={<ViewList />}
            sx={{ minWidth: { xs: 'auto', sm: 'unset' } }}
          >
            <Box
              component="span"
              sx={{ display: { xs: 'none', sm: 'inline' } }}
            >
              List
            </Box>
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{
              ml: { xs: 0, sm: 2 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            <Box
              component="span"
              sx={{ display: { xs: 'none', sm: 'inline' } }}
            >
              Add Drug
            </Box>
            <Box
              component="span"
              sx={{ display: { xs: 'inline', sm: 'none' } }}
            >
              Add
            </Box>
          </Button>
        </Box>
      </Box>

      {/* Search and Filter */}
      <SearchAndFilter
        onParamsChange={pagination.updateParams}
        currentParams={pagination.params}
        totalItems={data?.pagination.totalItems}
      />

      {/* Debug Panel - Remove in production */}
      {data && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Debug: Current page: {pagination.params.page}, Total pages:{' '}
            {data.pagination.totalPages}, Total items:{' '}
            {data.pagination.totalItems}, Items per page:{' '}
            {data.pagination.itemsPerPage}
          </Typography>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <LoadingSkeleton variant="card" count={pagination.params.limit || 20} />
      )}

      {/* Drugs Grid/List */}
      {!isLoading && data && (
        <>
          {data.data.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm:
                    viewMode === 'grid'
                      ? 'repeat(auto-fit, minmax(280px, 1fr))'
                      : '1fr',
                  md:
                    viewMode === 'grid'
                      ? 'repeat(auto-fit, minmax(300px, 1fr))'
                      : '1fr',
                  lg:
                    viewMode === 'grid'
                      ? 'repeat(auto-fit, minmax(320px, 1fr))'
                      : '1fr',
                },
                gap: { xs: 2, sm: 3 },
                mb: 4,
                width: '100%',
              }}
            >
              {data.data.map(drug => (
                <DrugCard
                  key={drug.id}
                  drug={drug}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: { xs: 4, sm: 8 },
                px: 2,
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                No drugs found
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 3,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  maxWidth: '500px',
                  mx: 'auto',
                }}
              >
                {pagination.params.search
                  ? `No results for "${pagination.params.search}". Try adjusting your search terms.`
                  : 'No drugs available. Add some drugs to get started.'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreate}
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Add First Drug
              </Button>
            </Box>
          )}

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
                pb: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {/* Debug info */}
                <Typography variant="caption" color="text.secondary">
                  Page {data.pagination.currentPage} of{' '}
                  {data.pagination.totalPages}({data.pagination.totalItems}{' '}
                  total items)
                </Typography>

                <Pagination
                  count={data.pagination.totalPages}
                  page={data.pagination.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? 'small' : 'large'}
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPagination-ul': {
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <Zoom in={!isLoading && data && data.data.length > 0}>
        <Fab
          color="primary"
          aria-label="add drug"
          onClick={handleCreate}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            zIndex: 1000,
          }}
        >
          <Add />
        </Fab>
      </Zoom>

      {/* Delete confirmation loading */}
      {deleteMutation.isPending && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Deleting drug...
        </Alert>
      )}
    </Box>
  );
};

export default DrugsPage;

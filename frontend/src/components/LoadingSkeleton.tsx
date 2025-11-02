import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'list';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 6,
}) => {
  if (variant === 'card') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(auto-fit, minmax(280px, 1fr))',
            md: 'repeat(auto-fit, minmax(300px, 1fr))',
            lg: 'repeat(auto-fit, minmax(320px, 1fr))',
          },
          gap: { xs: 2, sm: 3 },
          width: '100%',
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} elevation={2} sx={{ minWidth: 0 }}>
            <CardContent
              sx={{
                px: { xs: 2, sm: 2 },
                py: { xs: 2, sm: 2 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  gap: { xs: 1, sm: 2 },
                }}
              >
                <Skeleton
                  variant="circular"
                  sx={{
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Skeleton
                    variant="text"
                    width="80%"
                    sx={{
                      height: { xs: 20, sm: 24 },
                      mb: 0.5,
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    sx={{
                      height: { xs: 16, sm: 20 },
                    }}
                  />
                </Box>
              </Box>

              <Skeleton
                variant="text"
                width="90%"
                sx={{
                  height: { xs: 16, sm: 20 },
                  mb: 1,
                }}
              />
              <Skeleton
                variant="text"
                width="70%"
                sx={{
                  height: { xs: 16, sm: 20 },
                  mb: 1,
                }}
              />
              <Skeleton
                variant="text"
                width="50%"
                sx={{
                  height: { xs: 16, sm: 20 },
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 0.5, sm: 1 },
                  mt: 2,
                  justifyContent: { xs: 'space-around', sm: 'flex-start' },
                }}
              >
                <Skeleton
                  variant="circular"
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                  }}
                />
                <Skeleton
                  variant="circular"
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                  }}
                />
                <Skeleton
                  variant="circular"
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (variant === 'table') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, index) => (
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'center', py: 2 }}
          >
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              sx={{ mr: 2 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={16} />
            </Box>
            <Skeleton
              variant="rectangular"
              width={80}
              height={32}
              sx={{ mr: 1 }}
            />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        ))}
      </Box>
    );
  }

  // List variant
  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
      ))}
    </Box>
  );
};

export default LoadingSkeleton;

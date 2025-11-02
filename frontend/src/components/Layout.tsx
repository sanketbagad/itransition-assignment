import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  LocalPharmacy,
  GitHub,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useHealthCheck } from '../hooks/useDrugs';

interface LayoutProps {
  children: React.ReactNode;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  darkMode = false,
  onToggleDarkMode,
}) => {
  const { data: health, isError: healthError } = useHealthCheck();
  const [showHealthAlert, setShowHealthAlert] = React.useState(false);

  React.useEffect(() => {
    if (healthError) {
      setShowHealthAlert(true);
    }
  }, [healthError]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <LocalPharmacy sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            Drug Inventory System
          </Typography>

          {health && (
            <Typography
              variant="body2"
              sx={{
                mr: 2,
                opacity: 0.8,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {health.status === 'OK' ? '🟢' : '🔴'} API Status
            </Typography>
          )}

          <Tooltip title="Toggle Dark Mode">
            <IconButton color="inherit" onClick={onToggleDarkMode}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Tooltip title="View Source Code">
            <IconButton
              color="inherit"
              href="https://github.com/sanketbagad/itransition-assignment"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              <GitHub />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          width: '100%',
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          py: { xs: 1, sm: 2 },
          px: { xs: 2, sm: 3 },
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          © 2025 Drug Inventory System. Built by Sanket Bagad
        </Typography>
      </Box>

      <Snackbar
        open={showHealthAlert}
        autoHideDuration={6000}
        onClose={() => setShowHealthAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowHealthAlert(false)}
          severity="error"
          variant="filled"
        >
          API connection failed. Please check if the backend server is running.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout;

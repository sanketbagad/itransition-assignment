import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import Layout from './components/Layout';
import DrugsPage from './pages/DrugsPage';
import './App.css';

// Create a custom theme
const createAppTheme = (darkMode: boolean) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: blue[600],
        light: blue[400],
        dark: blue[800],
      },
      secondary: {
        main: grey[600],
        light: grey[400],
        dark: grey[800],
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: '8px',
            paddingRight: '8px',
            '@media (min-width: 600px)': {
              paddingLeft: '16px',
              paddingRight: '16px',
            },
            '@media (min-width: 900px)': {
              paddingLeft: '24px',
              paddingRight: '24px',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            '@media (max-width: 600px)': {
              '& .MuiToolbar-root': {
                minHeight: '56px',
                paddingLeft: '8px',
                paddingRight: '8px',
              },
            },
          },
        },
      },
    },
  });

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const [darkMode, setDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const theme = React.useMemo(() => createAppTheme(darkMode), [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout darkMode={darkMode} onToggleDarkMode={toggleDarkMode}>
            <Routes>
              <Route path="/" element={<DrugsPage />} />
              <Route path="/drugs" element={<DrugsPage />} />
              {/* Future routes can be added here */}
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

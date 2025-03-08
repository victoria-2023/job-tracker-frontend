import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Button,
  Stack,
  AppBar,
  Toolbar,
  Box,
  Paper,
  alpha,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Add as AddIcon, Work as WorkIcon } from '@mui/icons-material';
import { Toaster, toast } from 'react-hot-toast';
import JobList from './components/JobList';
import { JobForm } from './components/JobForm';
import { Job, JobFormData } from './types/job';
import { jobApi } from './api/jobApi';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Modern blue
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: '#7c3aed', // Modern purple
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>();

  const handleCreateJob = async (jobData: JobFormData) => {
    try {
      await jobApi.create(jobData);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsFormOpen(false);
      toast.success('Job application created successfully', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.dark,
          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          borderRadius: '16px',
          padding: '16px',
          fontWeight: 500,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      });
    } catch (error) {
      toast.error('Failed to create job application', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.dark,
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          borderRadius: '16px',
          padding: '16px',
          fontWeight: 500,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      });
    }
  };

  const handleUpdateJob = async (jobData: JobFormData) => {
    try {
      await jobApi.update(jobData);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsFormOpen(false);
      setSelectedJob(undefined);
      toast.success('Job application updated successfully', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.dark,
          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          borderRadius: '16px',
          padding: '16px',
          fontWeight: 500,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      });
    } catch (error) {
      toast.error('Failed to update job application', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.dark,
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          borderRadius: '16px',
          padding: '16px',
          fontWeight: 500,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      });
    }
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Box 
          sx={{ 
            minHeight: '100vh',
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            pb: 4,
          }}
        >
          <Toaster
            toastOptions={{
              style: {
                fontFamily: theme.typography.fontFamily,
              },
            }}
          />
          <AppBar 
            position="sticky" 
            elevation={0}
            sx={{
              borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              backdropFilter: 'blur(20px)',
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Container maxWidth="lg">
              <Toolbar 
                disableGutters 
                sx={{ 
                  height: 80,
                }}
              >
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={2} 
                  sx={{ 
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: 'white',
                      boxShadow: `0 8px 16px -4px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  >
                    <WorkIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h1" 
                    sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Job Tracker
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setSelectedJob(undefined);
                    setIsFormOpen(true);
                  }}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    px: 4,
                    py: 1.5,
                    borderRadius: '14px',
                    boxShadow: `0 8px 16px -4px ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 20px -4px ${alpha(theme.palette.primary.main, 0.3)}`,
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  Add New Job
                </Button>
              </Toolbar>
            </Container>
          </AppBar>

          <Container 
            maxWidth="lg" 
            sx={{ 
              mt: 4,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3 },
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                bgcolor: 'background.paper',
                flex: 1,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: `0 8px 24px -4px ${alpha(theme.palette.primary.main, 0.12)}`,
                  borderColor: alpha(theme.palette.primary.main, 0.16),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <JobList onEdit={handleEdit} />
            </Paper>

            <JobForm
              open={isFormOpen}
              onClose={() => {
                setIsFormOpen(false);
                setSelectedJob(undefined);
              }}
              onSubmit={selectedJob ? handleUpdateJob : handleCreateJob}
              initialData={selectedJob}
            />
          </Container>
        </Box>
      </QueryClientProvider>
    </ThemeProvider>
  );
} 
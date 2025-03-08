import { useState } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    ButtonGroup,
    Button,
    Stack,
    Typography,
    useTheme,
    alpha,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Business as BusinessIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';

const STATUS_COLORS = {
    APPLIED: "primary",
    INTERVIEWING: "warning",
    ACCEPTED: "success",
    REJECTED: "error",
} as const;

interface JobListProps {
    onEdit: (job: any) => void;
}

export default function JobList({ onEdit }: JobListProps) {
    const theme = useTheme();
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const { data: jobs = [], isLoading, error } = useQuery({
        queryKey: ['jobs', selectedStatus],
        queryFn: async () => {
            const url = selectedStatus
                ? `/api/jobs/status/${selectedStatus}`
                : '/api/jobs';
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch jobs');
            return response.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`/api/jobs/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete job');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            toast.success('Job deleted successfully');
            setDeleteDialogOpen(false);
        },
        onError: () => {
            toast.error('Failed to delete job');
        },
    });

    const handleDeleteClick = (id: number) => {
        setJobToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (jobToDelete) {
            deleteMutation.mutate(jobToDelete);
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress 
                    size={48}
                    sx={{
                        color: theme.palette.primary.main,
                    }}
                />
            </Box>
        );
    }

    if (error) {
        toast.error('Failed to load jobs');
        return null;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Stack spacing={4}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 600,
                            background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.7)})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Job Applications
                    </Typography>
                    <ButtonGroup 
                        variant="outlined" 
                        sx={{ 
                            background: alpha(theme.palette.background.paper, 0.6),
                            backdropFilter: 'blur(8px)',
                            borderRadius: 3,
                            p: 0.5,
                            gap: 0.5,
                            '& .MuiButton-root': {
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                borderColor: 'transparent',
                                '&:hover': {
                                    borderColor: 'transparent',
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                },
                                '&.Mui-selected': {
                                    borderColor: 'transparent',
                                },
                            }
                        }}
                    >
                        {Object.keys(STATUS_COLORS).map((status) => (
                            <Button
                                key={status}
                                onClick={() => setSelectedStatus(status)}
                                variant={selectedStatus === status ? "contained" : "outlined"}
                                color={STATUS_COLORS[status as keyof typeof STATUS_COLORS]}
                                sx={{
                                    minWidth: 120,
                                    transition: 'all 0.2s ease-in-out',
                                    ...(selectedStatus === status && {
                                        boxShadow: `0 4px 12px -2px ${alpha(theme.palette[STATUS_COLORS[status as keyof typeof STATUS_COLORS]].main, 0.3)}`,
                                    }),
                                }}
                            >
                                {status}
                            </Button>
                        ))}
                        {selectedStatus && (
                            <Button
                                onClick={() => setSelectedStatus(null)}
                                sx={{
                                    minWidth: 100,
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                Clear
                            </Button>
                        )}
                    </ButtonGroup>
                </Box>

                <TableContainer 
                    component={Paper} 
                    elevation={0}
                    sx={{ 
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        overflow: 'hidden',
                        background: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, py: 2 }}>Company</TableCell>
                                <TableCell sx={{ fontWeight: 600, py: 2 }}>Position</TableCell>
                                <TableCell sx={{ fontWeight: 600, py: 2 }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, py: 2 }}>Application Date</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobs.map((job: any) => (
                                <TableRow
                                    key={job.id}
                                    sx={{
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                                            '& .actions': {
                                                opacity: 1,
                                                transform: 'translateX(0)',
                                            },
                                        },
                                    }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                    color: 'white',
                                                }}
                                            >
                                                <BusinessIcon sx={{ fontSize: 20 }} />
                                            </Box>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                {job.company}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ color: theme.palette.text.secondary }}>
                                            {job.position}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                                            <Typography sx={{ color: theme.palette.text.secondary }}>
                                                {job.location}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={job.status}
                                            color={STATUS_COLORS[job.status as keyof typeof STATUS_COLORS]}
                                            size="small"
                                            sx={{ 
                                                borderRadius: 1.5,
                                                minWidth: 110,
                                                height: 28,
                                                fontWeight: 500,
                                                boxShadow: `0 2px 8px -2px ${alpha(theme.palette[STATUS_COLORS[job.status as keyof typeof STATUS_COLORS]].main, 0.3)}`,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalendarIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                                            <Typography sx={{ color: theme.palette.text.secondary }}>
                                                {format(new Date(job.applicationDate), 'MMM dd, yyyy')}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack 
                                            direction="row" 
                                            spacing={1} 
                                            justifyContent="flex-end"
                                            className="actions"
                                            sx={{
                                                opacity: { xs: 1, sm: 0 },
                                                transform: { xs: 'none', sm: 'translateX(10px)' },
                                                transition: 'all 0.2s ease-in-out',
                                            }}
                                        >
                                            <Tooltip title="Edit">
                                                <IconButton 
                                                    onClick={() => onEdit(job)}
                                                    sx={{ 
                                                        color: theme.palette.primary.main,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                        '&:hover': {
                                                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                        },
                                                    }}
                                                >
                                                    <EditIcon sx={{ fontSize: 20 }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton 
                                                    onClick={() => handleDeleteClick(job.id)}
                                                    sx={{ 
                                                        color: theme.palette.error.main,
                                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                                        '&:hover': {
                                                            bgcolor: alpha(theme.palette.error.main, 0.2),
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon sx={{ fontSize: 20 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {jobs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                        <Stack spacing={2} alignItems="center">
                                            <Box
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 3,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                                                }}
                                            >
                                                <SearchIcon 
                                                    sx={{ 
                                                        fontSize: 40, 
                                                        color: alpha(theme.palette.text.primary, 0.3),
                                                    }} 
                                                />
                                            </Box>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 600,
                                                    color: alpha(theme.palette.text.primary, 0.7),
                                                }}
                                            >
                                                No jobs found
                                            </Typography>
                                            <Typography 
                                                color="text.secondary"
                                                sx={{ maxWidth: 300, textAlign: 'center' }}
                                            >
                                                {selectedStatus 
                                                    ? `No ${selectedStatus.toLowerCase()} applications found`
                                                    : 'Start by adding your first job application'}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Delete Job Application"
                message="Are you sure you want to delete this job application? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onClose={() => setDeleteDialogOpen(false)}
            />
        </Box>
    );
} 
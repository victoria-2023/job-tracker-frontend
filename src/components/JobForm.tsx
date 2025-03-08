import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Stack,
    useTheme,
    alpha,
    IconButton,
    Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { JobFormData, JobStatus } from '../types/job';

interface JobFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: JobFormData) => void;
    initialData?: JobFormData;
}

const STATUS_OPTIONS: JobStatus[] = ['APPLIED', 'INTERVIEWING', 'ACCEPTED', 'REJECTED'];

export function JobForm({ open, onClose, onSubmit, initialData }: JobFormProps) {
    const theme = useTheme();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<JobFormData & { applicationDate: string }>({
        defaultValues: {
            company: '',
            position: '',
            location: '',
            applicationUrl: '',
            status: 'APPLIED',
            notes: '',
            applicationDate: new Date().toISOString().split('T')[0],
        },
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const onSubmitForm = handleSubmit(async (data) => {
        const { applicationDate, ...jobData } = data;
        await onSubmit(jobData);
        reset();
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: theme.shadows[3],
                },
            }}
        >
            <DialogTitle
                sx={{
                    m: 0,
                    p: 2,
                    bgcolor: 'background.default',
                    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
            >
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    {initialData ? 'Edit Job Application' : 'Add New Job Application'}
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'text.secondary',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={onSubmitForm}>
                <DialogContent
                    sx={{
                        p: 3,
                        '& .MuiTextField-root': {
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                },
                                '&:hover fieldset': {
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                },
                            },
                        },
                    }}
                >
                    <Stack spacing={2.5}>
                        <Controller
                            name="company"
                            control={control}
                            rules={{ required: 'Company is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Company"
                                    fullWidth
                                    error={!!errors.company}
                                    helperText={errors.company?.message}
                                />
                            )}
                        />

                        <Controller
                            name="position"
                            control={control}
                            rules={{ required: 'Position is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Position"
                                    fullWidth
                                    error={!!errors.position}
                                    helperText={errors.position?.message}
                                />
                            )}
                        />

                        <Controller
                            name="location"
                            control={control}
                            rules={{ required: 'Location is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Location"
                                    fullWidth
                                    error={!!errors.location}
                                    helperText={errors.location?.message}
                                />
                            )}
                        />

                        <Controller
                            name="applicationUrl"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Application URL"
                                    fullWidth
                                    error={!!errors.applicationUrl}
                                    helperText={errors.applicationUrl?.message}
                                />
                            )}
                        />

                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: 'Status is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Status"
                                    fullWidth
                                    error={!!errors.status}
                                    helperText={errors.status?.message}
                                >
                                    {STATUS_OPTIONS.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status.charAt(0) + status.slice(1).toLowerCase()}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Controller
                            name="applicationDate"
                            control={control}
                            rules={{ required: 'Application date is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="date"
                                    label="Application Date"
                                    fullWidth
                                    error={!!errors.applicationDate}
                                    helperText={errors.applicationDate?.message}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        />

                        <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Notes"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    error={!!errors.notes}
                                    helperText={errors.notes?.message}
                                />
                            )}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        bgcolor: 'background.default',
                        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                >
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                            '&:hover': {
                                borderColor: alpha(theme.palette.primary.main, 0.5),
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            px: 3,
                            py: 1,
                            ml: 2,
                        }}
                    >
                        {initialData ? 'Update' : 'Add'} Job
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
} 
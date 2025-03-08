export type JobStatus = 'APPLIED' | 'INTERVIEWING' | 'ACCEPTED' | 'REJECTED';

export interface Job {
    id?: number;
    company: string;
    position: string;
    location: string;
    applicationUrl?: string;
    status: JobStatus;
    notes?: string;
    applicationDate?: string;
    lastUpdated?: string;
    createdAt?: string;
    createdBy?: string;
    modifiedAt?: string;
    modifiedBy?: string;
}

export type JobFormData = Omit<Job, 'id' | 'applicationDate' | 'lastUpdated' | 'createdAt' | 'createdBy' | 'modifiedAt' | 'modifiedBy'> & {
    id?: number;
}; 
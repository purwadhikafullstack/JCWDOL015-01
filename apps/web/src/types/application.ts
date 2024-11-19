// job.ts (TypeScript interface)

export interface Job {
    id: number;
    title: string;
    description: string;
    location: string;
    salary: number | null;
    createdAt: string;  // ISO string format date
    expiryDate: string; // ISO string format date
    tags: string | null;
    remoteOption: boolean;
    companyName: string;
    companyLogoUrl?: string;
  }
  
  // application.ts (for application data, if needed)
  
  export interface Application {
    id: number;
    jobId: number;
    userId: number;
    cvUrl: string;
    expectedSalary: number;
    status: 'Pending' | 'Accepted' | 'Rejected';
    interviewDate?: string;
    feedback?: string;
  }
  
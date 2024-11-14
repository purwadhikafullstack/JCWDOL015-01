'use client';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/utils/utils';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Job, columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from '@/components/ui/button';


const JobPostings = () => {
    const [data, setData] = useState<Job[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6">
                <div className="mb-4">
                <Button asChild>
                    <Link href="/dashboard/job-postings/create-job-posting">Create Job</Link>
                </Button>
                </div>
                <DataTable columns={columns} data={data} totalItems={totalItems} />
            </div>
        </DashboardLayout>
    );
};

export default JobPostings;

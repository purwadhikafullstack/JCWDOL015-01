'use client'

import DashboardLayout from '@/components/DashboardLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const [totalApplicants, setTotalApplicants] = useState(0);
    const [totalAcceptedApplicants, setTotalAcceptedApplicants] = useState(0);
    const [totalRejectedApplicants, setTotalRejectedApplicants] = useState(0);
    const [totalJobPosting, setTotalJobPosting] = useState(0);
    const [incomingInterviews, setIncomingInterviews] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:8000/api/analytics/total-applicants`)
            .then(response => response.json())
            .then(data => {
                setTotalApplicants(data.totalApplicants);
            })
            .catch(error => {
                console.error('Error fetching total applicants:', error);
            });

        fetch(`http://localhost:8000/api/analytics/total-accepted-applicants`)
            .then(response => response.json())
            .then(data => {
                setTotalAcceptedApplicants(data.totalApplicants);
            })
            .catch(error => {
                console.error('Error fetching total accepted applicants:', error);
            });

        fetch(`http://localhost:8000/api/analytics/total-rejected-applicants`)
            .then(response => response.json())
            .then(data => {
                setTotalRejectedApplicants(data.totalApplicants);
            })
            .catch(error => {
                console.error('Error fetching total rejected applicants:', error);
            });

        fetch(`http://localhost:8000/api/analytics/total-job-posting`)
            .then(response => response.json())
            .then(data => {
                setTotalJobPosting(data.totalJobs);
            })
            .catch(error => {
                console.error('Error fetching total job postings:', error);
            });
        fetch(`http://localhost:8000/api/analytics/incoming-interviews`)
            .then(response => response.json())
            .then(data => {
                setIncomingInterviews(data.interviews);
            })
            .catch(error => {
                console.error('Error fetching incoming interviews:', error);
            });
    },[])
    return (
        <DashboardLayout>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>

                <div className="flex flex-wrap justify-between gap-5">
                    <div className="flex-grow p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold">Total Applicant Registered</h2>
                        <p className="text-xl font-bold">{totalApplicants}</p>
                    </div>
                    <div className="flex-grow p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold">Total Applicant Accepted</h2>
                        <p className="text-xl font-bold">{totalAcceptedApplicants}</p>
                    </div>
                    <div className="flex-grow p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold">Total Applicant Rejected</h2>
                        <p className="text-xl font-bold">{totalRejectedApplicants}</p>
                    </div>
                    <div className="flex-grow p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold">Total Job Posting</h2>
                        <p className="text-xl font-bold">{totalJobPosting}</p>
                    </div>
                </div>

                <h1 className="text-3xl font-bold mt-8">Daftar Wawancara</h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Tanggal dan Waktu</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {incomingInterviews && incomingInterviews.length > 0 ? (
                            incomingInterviews.map((interview: any) => (
                                <TableRow key={interview.id}>
                                    <TableHead>{interview.applicant.user.name}</TableHead>
                                    <TableHead>{interview.applicant.job.title}</TableHead>
                                    <TableHead>{new Date(interview.date_time).toLocaleString()}</TableHead>
                                    <TableHead>{interview.status}</TableHead>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    Tidak ada wawancara yang akan datang.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;

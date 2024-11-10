"use client";
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

interface JobPosting {
    id: number;
    title: string;
    location: string;
    applicantCount: number;
    isPublished: boolean;
}

const JobPostingDashboard = () => {
    const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [filterText, setFilterText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/jobs/');
                if (!response.ok) {
                    throw new Error('Failed to fetch job postings');
                }
                const data: any[] = await response.json();
                const jobPostingsData: JobPosting[] = data.map(job => ({
                    id: job.id,
                    title: job.title,
                    location: job.location,
                    applicantCount: job.applicantCount,
                    isPublished: job.published,
                }));
                setJobPostings(jobPostingsData);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchJobPostings();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    const filteredJobPostings = jobPostings.filter(job => {
        const matchesTitle = job.title.toLowerCase().includes(filterText.toLowerCase());
        const matchesCategory = selectedCategory === '' || job.location === selectedCategory;
        return matchesTitle && matchesCategory;
    });

    const deleteJobPosting = async (id: number) => {
        if (confirm("Are you sure you want to delete this job posting?")) {
            try {
                const response = await fetch(`http://localhost:8000/api/jobs/${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    setJobPostings(jobPostings.filter(job => job.id !== id));
                    alert('Job posting deleted successfully.');
                } else {
                    alert('Failed to delete the job posting.');
                }
            } catch (error) {
                console.error('Error deleting job posting:', error);
                alert('An error occurred while deleting the job posting.');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <DashboardLayout>
            <div className="flex">
                <div className="flex-1 p-4 bg-gray-500">
                    <h1 className="text-2xl font-bold mb-4">Job Posting Management</h1>

                    <div className="mt-4 flex justify-between items-center">
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="Filter by title"
                                className="p-2 border border-gray-300 rounded"
                                value={filterText}
                                onChange={handleFilterChange}
                            />
                            <select
                                className="p-2 border border-gray-300 rounded"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            >
                                <option value="">Select Category</option>
                                <option value="Technology">Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Manufacturing">Manufacturing</option>
                            </select>
                            <button
                                className="p-2 bg-green-500 text-white rounded"
                                onClick={() => { /* Optionally handle additional actions */ }}
                            >
                                Filter
                            </button>
                        </div>

                        <Link href="/dashboard/job-postings/create-job-posting">
                            <button className="p-2 bg-blue-500 text-white rounded">
                                Create Job Posting
                            </button>
                        </Link>
                    </div>

                    <div className="mt-4 overflow-x-auto rounded-lg shadow">
                        <table className="w-full bg-white border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-4 px-6 text-left border-b border-gray-300">Job Title</th>
                                    <th className="py-4 px-6 text-left border-b border-gray-300">Location</th>
                                    <th className="py-4 px-6 text-left border-b border-gray-300">Applicants</th>
                                    <th className="py-4 px-6 text-left border-b border-gray-300">Published</th>
                                    <th className="py-4 px-6 text-left border-b border-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobPostings.length > 0 ? (
                                    filteredJobPostings.map((job) => (
                                        <tr key={job.id} className="odd:bg-white even:bg-gray-50">
                                            <td className="py-4 px-6 border-b border-gray-300">{job.title}</td>
                                            <td className="py-4 px-6 border-b border-gray-300">{job.location}</td>
                                            <td className="py-4 px-6 border-b border-gray-300">{job.applicantCount}</td>
                                            <td className="py-4 px-6 border-b border-gray-300">
                                                {job.isPublished ? 'Yes' : 'No'}
                                            </td>
                                            <td className="py-4 px-6 border-b border-gray-300 space-x-2">
                                                <Link href={`/dashboard/job-postings/${job.id}`}>
                                                    <button className="text-blue-500 hover:underline">Details</button>
                                                </Link>
                                                <Link href={`/dashboard/job-postings/${job.id}/edit`}>
                                                    <button className="text-yellow-500 hover:underline">Edit</button>
                                                </Link>
                                                <button className="text-red-500 hover:underline" onClick={() => deleteJobPosting(job.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-4 px-6 text-center text-gray-500">
                                            No job postings available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default JobPostingDashboard;

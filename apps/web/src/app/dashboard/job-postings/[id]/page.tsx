"use client";
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency, formatDate } from '@/utils/utils';
import Link from 'next/link';

interface Applicant {
  id: number;
  applied_at: string;
  cv_url?: string;
  user: {
    name: string;
  };
  result?: {
    score: number; 
  }[];
}

interface Job {
  id: number;
  title: string;
  description: string;
  banner?: string;
  category: string;
  location: string;
  salary?: number;
  tags?: string;
  expiry_date: string;
  published: boolean;
  requires_test: boolean;
  remote_option: boolean;
  created_at: string;
  updated_at: string;
  applicant: Applicant[];
}
const JobPostingDetail = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const [job, setJob] = useState<Job | null>(null);

    useEffect(() => {
        const fetchJobDetail = async () => {
            if (!id) return; 
            try {
                const response = await fetch(`http://localhost:8000/api/jobs/${id}`);
                if (!response.ok) {
                    const errorMessage = await response.text(); 
                    throw new Error(`Network response was not ok: ${errorMessage}`);
                }
                const data = await response.json();
                setJob(data);
            } catch (error) {
                console.error('Failed to fetch job details:', error);
            }
        };        

        fetchJobDetail();
    }, [id]);

    if (!job) return <p>Loading...</p>; 

    const applicants = job.applicant || []; 

    return (
      <DashboardLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">{job.title}</h1>
          
          {/* Job Details */}
          <div className="mb-6">
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Category:</strong> {job.category}</p>
            <p><strong>Salary:</strong> {formatCurrency(job.salary ?? 0)}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Status:</strong> {job.published ? "Published" : "Not Published"}</p>
            <p>
              <strong>Requires Test:</strong> {job.requires_test ? "Yes" : "No"}
              {job.requires_test && <Link className="ml-2 text-blue-500 underline " href={`/dashboard/job-postings/${job.id}/manage-test`}>Manage Test</Link>}
            </p>
            <p>
              <strong>Remote Option:</strong> {job.remote_option ? "Yes" : "No"}
            </p>
            <p>
              <strong>Published:</strong> {job.published ? "Yes" : "No"}
            </p>

            <Link href={`/dashboard/job-postings/${job.id}/edit`} className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Edit Job Posting
            </Link>
          <button
            onClick={async () => {
              if (confirm('Apakah Anda yakin ingin menghapus postingan pekerjaan ini?')) {
                try {
                  const response = await fetch(`http://localhost:8000/api/jobs/${id}`, {
                    method: 'DELETE',
                  });
                  if (response.ok) {
                    alert('Postingan pekerjaan berhasil dihapus!');
                    window.location.href = '/dashboard/job-postings';
                  } else {
                    throw new Error('Gagal menghapus postingan pekerjaan');
                  }
                } catch (error) {
                  console.error('Failed to delete job posting:', error);
                }
              }
            }}
            className="mt-4 inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Hapus Job Posting
          </button>
          </div>

          {/* Applicants Section */}
          <h2 className="text-xl font-semibold mb-4">Applicants</h2>
          <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
              <thead>
                  <tr>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Applied Date</th>
                  <th className="px-4 py-2 border-b">Test Result</th>
                  </tr>
              </thead>
              <tbody>
                  {applicants.map((applicant) => (
                  <tr key={applicant.id} className="odd:bg-white even:bg-gray-50">
                      <td className="px-4 py-2 border-b">{applicant.user.name}</td>
                      <td className="px-4 py-2 border-b">{formatDate(applicant.applied_at)}</td>
                      <td className="px-4 py-2 border-b">{applicant.result?.[0]?.score ?? "N/A"}</td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </DashboardLayout>
    );
};

export default JobPostingDetail;

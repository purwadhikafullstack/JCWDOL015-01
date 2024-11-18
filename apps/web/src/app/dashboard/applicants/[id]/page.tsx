'use client'; 

import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/utils/utils';
import { useSearchParams } from 'next/navigation';  
import { useEffect, useState } from 'react';

type ApplicantDetail = {
  id: number;
  user: {
    name: string;
    age: number;
    education: string;
    profile_picture_url: string;
    birth_date: string;
  };
  job: {
    title: string;
  }
  expected_salary: number;
  cv_url: string;
  applied_at: string;
  status: string;
};

const ApplicantDetailPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [applicant, setApplicant] = useState<ApplicantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return; // Ensure 'id' is defined before proceeding

    const fetchApplicantDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/applicants/${id}`);
        if (!response.ok) throw new Error('Failed to fetch applicant details');
        const data = await response.json();
        setApplicant(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load applicant details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantDetail();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const age = today.getFullYear() - birthDateObj.getFullYear();
    return age;
  };

  return (
    <DashboardLayout>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Applicant Detail</h1>
          <div className="p-6">
            {applicant && (
              <div>
                <h1 className="text-2xl font-bold mb-4">{applicant.user.name}</h1>
                <img src={applicant.user.profile_picture_url} alt="Profile" className="h-20 w-20 rounded-full mb-4" />
                <p>Age: {calculateAge(applicant.user.birth_date)}</p>
                <p>Education: {applicant.user.education}</p>
                <p>Applied At: {new Date(applicant.applied_at).toLocaleString()}</p>
                <p>Job Title: {applicant.job.title}</p>
                <p>Expected Salary: {formatCurrency(applicant.expected_salary)}</p>
                <p>Status: {applicant.status}</p>
                <a href={applicant.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View CV
                </a>
              </div>
            )}
          </div>
        </div>
    </DashboardLayout>
  );
};

export default ApplicantDetailPage;

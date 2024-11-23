"use client";
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/utils/utils';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Applicant = {
  job: any;
  id: number;
  user: {
    name: string;
    age: number;
    education: string;
    profile_picture_url: string;
    birthDate: string;
  };
  expected_salary: number;
  cv_url: string;
  applied_at: string;
  status: string;
};

const ApplicantList = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [filters, setFilters] = useState({
    name: '',
    age: '',
    expected_salary: '',
    education: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/applicants`);
      if (!response.ok) throw new Error('Failed to fetch applicants');
      const data = await response.json();
      setApplicants(data);
      setFilteredApplicants(data); // Initialize with all applicants
    } catch (err) {
      setError('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    // Apply filters on client side
    const filtered = applicants.filter((applicant) => {
      const age = calculateAge(applicant.user.birthDate);
      return (
        (filters.name === '' || applicant.user.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.age === '' || age.toString() === filters.age) &&
        (filters.education === '' || applicant.user.education.toLowerCase().includes(filters.education.toLowerCase())) &&
        (filters.expected_salary === '' || (applicant.expected_salary && applicant.expected_salary.toString().includes(filters.expected_salary.toString())))
      );
    });
    setFilteredApplicants(filtered);
  }, [filters, applicants]);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="filter-form mb-4">
          <input
            type="text"
            name="name"
            value={filters.name}
            placeholder="Filter by Name"
            onChange={handleFilterChange}
            className="border p-2 rounded mr-2"
          />
          <input
            type="text"
            name="age"
            value={filters.age}
            placeholder="Filter by Age"
            onChange={handleFilterChange}
            className="border p-2 rounded mr-2"
          />
          <input
            type="text"
            name="education"
            value={filters.education}
            placeholder="Filter by Education"
            onChange={handleFilterChange}
            className="border p-2 rounded mr-2"
          />
          <input
            type="number"
            name="expected_salary"
            value={filters.expected_salary}
            placeholder="Filter by Expected Salary"
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b">Job Title</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Age</th>
              <th className="px-4 py-2 border-b">Education</th>
              <th className="px-4 py-2 border-b">Expected Salary</th>
              <th className="px-4 py-2 border-b">CV</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.map((applicant) => {
              const age = calculateAge(applicant.user.birthDate);
              const handleAction = async (id: number, action: string) => {
                try {
                  const response = await fetch(`http://localhost:8000/api/applicants/${id}/${action}/${applicant.job.id}`, {
                    method: 'PUT',
                  });
                  if (response.ok) {
                    alert(`Applicant ${action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : action === 'interview' ? 'interview scheduled' : 'in process'}!`);
                    fetchApplicants();
                  }
                } catch (error) {
                  console.error(`Failed to ${action} applicant`, error);
                }
              };

              return (
                <tr key={applicant.id}>
                  <td className="px-4 py-2 border-b">{applicant.job.title}</td>
                  <td className="px-4 py-2 border-b flex items-center space-x-2">
                    <img src={applicant.user.profile_picture_url} alt="Profile" className="h-10 w-10 rounded-full" />
                    <Link href={`/dashboard/applicants/${applicant.id}`} className="text-blue-500 hover:underline">
                      {applicant.user.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 border-b">{age}</td>
                  <td className="px-4 py-2 border-b">{applicant.user.education}</td>
                  <td className="px-4 py-2 border-b">{formatCurrency(applicant.expected_salary ?? 0)}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => window.open(applicant.cv_url, '_blank')}
                      className="text-blue-500 hover:underline"
                    >
                      View CV
                    </button>
                  </td>
                  
                  <td className='px-4 py-2 border-b'>
                    <label className={`whitespace-nowrap text-${applicant.status === 'accepted' ? 'green-500' : applicant.status === 'rejected' ? 'red-500' : applicant.status === 'interview' ? 'yellow-500' : 'gray-500'}`}>
                      {applicant.status.replace('_', ' ').toUpperCase()}
                    </label>
                  </td>
                  <td className="px-4 py-2 border-b space-x-2">
                    <button
                      onClick={() => handleAction(applicant.id, 'in_process')}
                      className="text-gray-500 hover:underline"
                    >
                      Processed
                    </button>
                    <button
                      onClick={() => handleAction(applicant.id, 'interview')}
                      className="text-yellow-500 hover:underline"
                    >
                      Interview
                    </button>
                    <button
                      onClick={() => handleAction(applicant.id, 'accept')}
                      className="text-green-500 hover:underline"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(applicant.id, 'reject')}
                      className="text-red-500 hover:underline"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplicantList;

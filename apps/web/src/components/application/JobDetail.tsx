'use client';
import { fetchJobDetail } from '@/lib/application';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';


const JobDetailPage = ({ jobId }: { jobId: number }) => {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const { result, ok } = await fetchJobDetail();
        if (ok) {
          setJob(result);
        } else {
          setError(result);
        }
      } catch (err) {
        setError('Failed to fetch job details');
      }
      setLoading(false);
    };

    fetchJobDetails();
  }, [jobId]);

  const handleApplyClick = () => {
    // Redirect to application page with the job ID
    router.push(`/apply-job/${jobId}`);
  };

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{job?.title}</h1>
      <p>{job?.description}</p>
      <p><strong>Location:</strong> {job?.location}</p>
      <p><strong>Salary:</strong> {job?.salary}</p>

      <button
        onClick={handleApplyClick}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Apply for this Job
      </button>
    </div>
  );
};

export default JobDetailPage;

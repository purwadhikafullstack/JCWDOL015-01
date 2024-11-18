'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const ApplyJobPage = ({ jobId }: { jobId: number }) => {
  const router = useRouter();
  const [cvUrl, setCvUrl] = useState<string>('');
  const [expectedSalary, setExpectedSalary] = useState<number | string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvUrl(e.target.value);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpectedSalary(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cvUrl || !expectedSalary) {
      setError('Please provide your CV URL and expected salary.');
      return;
    }

    try {
      const res = await axios.post('/api/apply', {
        jobId,
        cvUrl,
        expectedSalary,
      });

      if (res.data.ok) {
        setSuccessMessage('Your application has been submitted successfully!');
        router.push('/user-dashboard'); // Redirect to user dashboard after successful submission
      } else {
        setError('Failed to submit your application.');
      }
    } catch (err) {
      setError('Failed to submit your application.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Apply for Job {jobId}</h1>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-lg mb-2">CV URL:</label>
          <input
            type="url"
            value={cvUrl}
            onChange={handleUrlChange}
            className="mb-4"
            placeholder="Enter your CV URL"
          />
        </div>
        <div>
          <label className="block text-lg mb-2">Expected Salary:</label>
          <input
            type="number"
            value={expectedSalary}
            onChange={handleSalaryChange}
            className="mb-4"
            placeholder="Enter your expected salary"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyJobPage;

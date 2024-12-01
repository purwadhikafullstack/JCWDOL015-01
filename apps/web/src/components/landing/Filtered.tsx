'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getJobs } from '@/lib/job'; 

export default function JobList() {
  const [jobs, setJobs] = useState<any[]>([]); 

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs(); 
        setJobs(response.result.jobs.slice(0, 5)); 
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Newest Jobs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {jobs.map((job, index) => (
          <div key={index} className="bg-white p-4 border rounded-lg shadow-md">
            <div className="mb-4">
              <Image
                src={job.companyLogo || '/default-logo.png'}
                alt={job.companyName}
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
            </div>
            <div className="job-details">
              <h3 className="text-lg font-medium mb-2">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.companyName}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

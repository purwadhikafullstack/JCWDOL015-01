'use client'
import React, { useEffect } from 'react'
import { Job } from '../dashboard/job-postings/columns';

function Jobs() {
    const [jobs, setJobs] = React.useState<Job[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/jobs?published=true")
            .then((response) => response.json())
            .then((data) => {
                console.log(data.data);
                setJobs(data.data);
            });
    }, []);

  const handleApplyClick = async (jobId: number) => {
    
      const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: '13' }), // Assuming '10' is the user ID, replace with actual user ID logic
      }).then((res) => {
        if (!res.ok) {
          // check if there was JSON
          const contentType = res.headers.get('Content-Type')
          if (contentType && contentType.includes('application/json')) {
            // return a rejected Promise that includes the JSON
            return res.json().then((json) => Promise.reject(json))
          }
          // no JSON, just throw an error
          throw new Error('Something went horribly wrong 💩')
        }
  
        return res.json();
      })
      .then((data) => {
        alert('Application submitted successfully!');
      })
      .catch((error) => {
        if(error.message=="Job posting requires a test.") {
            window.location.href = `/preselection-test/${jobId}`;
        } else {
            console.error('Failed to submit test:', error);
            alert(error.error || error.message);
        }
      });  
  };
    
  return (
    <div className="flex flex-wrap justify-center gap-4">
        {jobs && jobs.map((job) => (
            <div key={job.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 flex flex-col">
                <div className="px-6 py-4 flex-grow">
                    <div className="font-bold text-xl mb-2">{job.title}</div>
                    <p className="text-gray-700 text-base">
                        {job.description}
                    </p>
                    {job.requires_test && (
                        <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Preselection Test Required
                            </span>
                        </div>
                    )}
                </div>
                <div className="px-6 pt-4 pb-2">
                    <button onClick={() => handleApplyClick(job.id)} className="inline-block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Apply
                    </button>
                </div>
            </div>
        ))}
    </div>
  )
}

export default Jobs
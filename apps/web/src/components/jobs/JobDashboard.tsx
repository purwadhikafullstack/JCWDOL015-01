'use client';
import { fetchJobsByFilter, fetchJobsByGeolocation } from '@/lib/job';
import { IFilters, IJob } from '@/types/job';
import { result } from 'cypress/types/lodash';
import { useState, useEffect } from 'react';

const JobsDashboard = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [filters, setFilters] = useState<IFilters>({
    title: '',
    location: '',
    tags: '',
    remote_option: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getLocations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/jobs/locations');
        const data = await response.json();
        setLocations(data.map((loc: any) => loc.location));
      } catch (error) {
        console.error('Error fetching locations', error);
      }
    };

    getLocations();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const result = await fetchJobsByFilter(filters);
        
        setJobs(result.data);
      } catch (error) {
        console.error('Error fetching jobs with filters', error);
      }
      setLoading(false);
    };

    fetchJobs();
  }, [filters]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

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
      if(error.message=="Postingan pekerjaan memerlukan tes.") {
          window.location.href = `/preselection-test/${jobId}`;
      } else {
          console.error('Failed to submit test:', error);
          alert(error.error || error.message);
      }
    });  
};

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Job Listings</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap justify-start gap-4">
        <div className="w-full sm:w-1/2 lg:w-1/4">
          <input
            type="text"
            name="title"
            placeholder="Search by title"
            value={filters.title}
            onChange={handleFilterChange}
            className="w-full p-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4">
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="w-full p-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 flex items-center">
          <input
            type="checkbox"
            name="remote_option"
            checked={filters.remote_option}
            onChange={handleFilterChange}
            className="mr-2"
          />
          <label className="text-lg">Remote</label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin w-8 h-8 border-t-2 border-blue-500 rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {job.title}
              </h2>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <p className="text-gray-800 mb-2">
                <strong>Location:</strong> {job.location}
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Salary:</strong> ${job.salary}
              </p>
              <p className="text-gray-800 mb-4">
                <strong>Remote:</strong> {job.remote_option ? 'Yes' : 'No'}
              </p>
              <div className="flex justify-between mt-4">
                <button onClick={() => handleApplyClick(job.id)} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none">
                  Apply
                </button>
                <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none">
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsDashboard;

'use client';
import { getJobs, jobApplication } from '@/lib/job';
import { IJob } from '@/types/job';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { fetchCookie } from '@/lib/cookie';
import { getDistance } from 'geolib';
import { forwardGeocoding, reverseGeocoding } from '../geolocation/OpenCage';
import { useAuth } from '../authContext/Provider';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/store/hooks';
import { savedJobs, removeSavedJob, getSavedJobs } from '@/lib/user';

const JobsDashboard = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredJobs, setFilteredJobs] = useState<IJob[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [userLocation, setUserLocation] = useState<string>('');
  const [userCoordinates, setUserCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set()); // Track saved jobs
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  const { onVerified, verified } = useAuth();
  const profile = useAppSelector((state) => state.user.profile);
  const router = useRouter();

  const jobsPerPage = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const location = await fetchCookie('userLocation');
        setUserLocation(location || '');

        if (location) {
          const [latitude, longitude] = location.split(',').map(Number);
          const { result, ok } = await reverseGeocoding(latitude, longitude);
          if (ok && result) {
            setUserCoordinates({ lat: latitude, lng: longitude });
          }
        }

        const { result, ok } = await getJobs();
        if (ok && Array.isArray(result.jobs)) {
          setJobs(result.jobs);
          setFilteredJobs(result.jobs);
        } else {
          console.error('Error fetching jobs or invalid data structure');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (profile?.id) {
      const fetchSavedJobs = async () => {
        const { result, ok } = await getSavedJobs(profile.id);
        if (ok) {
          setSavedJobIds(new Set(result.savedJobs.map((job: any) => job.id)));
        }
      };

      fetchSavedJobs();
    }
  }, [profile]);

  const handleApply = async (jobId: string) => {
    onVerified();
    if (!verified) {
      return router.push('/user/login');
    }

    if (!profile) {
      return;
    }

    const { result, ok } = await jobApplication(profile?.id, jobId);
    if (ok) {
      toast.success('Redirecting to job application page...');
      setTimeout(() => {
        router.push(`/application/${jobId}`);
      }, 3000);
    } else {
      toast.error(result.message);
    }
  };

  const handleSavedJobs = async (jobId: string) => {
    onVerified();
    if (!verified) {
      return router.push('/user/login');
    }

    if (!profile) {
      return;
    }

    if (savedJobIds.has(jobId)) {
      const { result, ok } = await removeSavedJob(profile.id, Number(jobId));
      if (ok) {
        setSavedJobIds((prev) => {
          const updated = new Set(prev);
          updated.delete(jobId);
          return updated;
        });
        toast.success('Job removed from saved jobs');
      } else {
        toast.error(result.message);
      }
    } else {
      const { result, ok } = await savedJobs(profile.id, Number(jobId));
      if (ok) {
        setSavedJobIds((prev) => new Set(prev).add(jobId));
        toast.success('Job saved successfully');
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleTitleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value.toLowerCase());
  };

  useEffect(() => {
    const filterJobs = async () => {
      if (jobs.length === 0) return;

      const filtered = await Promise.all(
        jobs.map(async (job) => {
          const matchesTitle = job.title
            .toLowerCase()
            .includes(searchTitle.toLowerCase());

          if (!userCoordinates) {
            return matchesTitle;
          }

          const { result, ok } = await forwardGeocoding(job.location);
          if (ok && result) {
            const distance = getDistance(
              { latitude: userCoordinates.lat, longitude: userCoordinates.lng },
              { latitude: result.latitude, longitude: result.longitude },
            );
            const withinRange = distance <= 50000;
            return matchesTitle && withinRange;
          }
          return matchesTitle;
        }),
      );

      const jobsFiltered = jobs.filter((_, index) => filtered[index]);

      setFilteredJobs(jobsFiltered.length > 0 ? jobsFiltered : jobs);
      setCurrentPage(1);
    };

    filterJobs();
  }, [searchTitle, userCoordinates, jobs]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setIsPageTransitioning(true);
      setTimeout(() => {
        setCurrentPage(page);
        setIsPageTransitioning(false);
      }, 300);
    }
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(salary);
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Job Listings</h1>

      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search by Job Title"
          className="p-2 border rounded-lg"
          value={searchTitle}
          onChange={handleTitleSearch}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin w-8 h-8 border-t-2 border-blue-500 rounded-full"></div>
        </div>
      ) : currentJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="flex-1 mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {job.title}
                </h2>
                <p className="text-gray-600 mb-2">{job.description}</p>
                <p className="text-gray-800 mb-1">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="text-gray-800 mb-1">
                  <strong>Salary:</strong> {formatSalary(job.salary)} per month
                </p>
                <p className="text-gray-800 mb-2">
                  <strong>Remote:</strong> {job.remoteOption ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApply(job.id.toString())}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => handleSavedJobs(job.id.toString())}
                    className={`${
                      savedJobIds.has(job.id.toString())
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    } text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none`}
                  >
                    {savedJobIds.has(job.id.toString()) ? 'Saved' : 'Save Job'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg">No jobs found.</p>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-md mx-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-md mx-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobsDashboard;

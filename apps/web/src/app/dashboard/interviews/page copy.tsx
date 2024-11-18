'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

interface Application {
  id: number;
  user: {
    name: string;
  };
}

const CreateInterviewSchedule = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await axios.get('http://localhost:8000/api/applications?status=accepted');
      setApplications(response.data);
    };
    fetchApplications();
  }, []);

  const handleSubmit = async () => {
    if (!selectedApplication || !dateTime || !location) {
      setError('Please fill in all fields before creating the schedule.');
      return;
    }

    setError('');

    try {
      await axios.post('/api/interviews', {
        applicationIds: [selectedApplication],
        dateTime,
        location,
      });

      // Redirect to confirmation page upon successful submission
      router.push('/dashboard/interviews/confirmation');
    } catch (err) {
      setError('Failed to create interview schedule. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Create Interview Schedule
          </h2>

          <div className="mb-6">
            <label htmlFor="dateTime" className="block text-gray-700 font-medium mb-2">
              Date & Time
            </label>
            <input
              id="dateTime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Applicant:</h3>
            <select
              value={selectedApplication || ''}
              onChange={(e) => setSelectedApplication(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select an applicant</option>
              {applications.map((application) => (
                <option key={application.id} value={application.id}>
                  {application.user.name}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Schedule
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateInterviewSchedule;

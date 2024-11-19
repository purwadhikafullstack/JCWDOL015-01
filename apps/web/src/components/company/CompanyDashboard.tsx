'use client';
import { useState, useEffect } from 'react';
import { getCompanyInfo } from '@/lib/company';  // Import the function you created
import Image from 'next/image';  // Import the Image component from Next.js

const CompanyDashboard = () => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');  // For error handling
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);  // Track which company is selected

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      const { result, ok } = await getCompanyInfo();  // Call the function to fetch data
      if (ok) {
        setCompanyData(result);  // Store the result if the request is successful
      } else {
        setError(result);  // Set error if the request fails
      }
      setLoading(false);
    };

    fetchCompanyData();  // Call function to fetch data on component mount
  }, []);  // Empty dependency array ensures this only runs once on page load

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleCompanyClick = (companyId: number) => {
    setSelectedCompanyId(prevId => (prevId === companyId ? null : companyId));  // Toggle dropdown
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Companies</h1>

      {companyData && companyData.length > 0 ? (
        companyData.map((company: any) => (
          <div key={company.id} className="border-b mb-4 pb-4">
            {/* Company Logo and Name */}
            <div 
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => handleCompanyClick(company.id)} // Toggle dropdown
            >
              {company.companyLogoUrl && (
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={company.companyLogoUrl}
                    alt={`${company.companyName} Logo`}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold">{company.companyName}</h2>
            </div>

            {/* Show description if the company is selected */}
            {selectedCompanyId === company.id && (
              <div className="mt-4 space-y-4">
                <p className="text-gray-700">{company.companyDescription || 'No description available.'}</p>

                <h3 className="text-lg font-semibold mb-2">Available Jobs</h3>
                {company.jobs.length > 0 ? (
                  company.jobs.slice(0, 3).map((job: any) => (
                    <div key={job.id} className="border p-4 rounded shadow-md">
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-gray-600">{job.description}</p>
                      <p><strong>Location:</strong> {job.location}</p>
                      <p><strong>Salary:</strong> {job.salary}</p>
                      <p><strong>Remote:</strong> {job.remoteOption ? 'Yes' : 'No'}</p>
                    </div>
                  ))
                ) : (
                  <p>No jobs available for this company.</p>
                )}
                {/* Button to see more jobs */}
                {company.jobs.length > 3 && (
                  <button className="text-blue-500 mt-4 hover:underline">
                    See More Jobs
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No company data available.</p>
      )}
    </div>
  );
};

export default CompanyDashboard;

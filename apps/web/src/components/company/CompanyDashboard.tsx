'use client';
import { useState, useEffect } from 'react';
import { getCompanyInfo } from '@/lib/company';
import Image from 'next/image';

const CompanyDashboard = () => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      const { result, ok } = await getCompanyInfo();
      if (ok) {
        setCompanyData(result.companies);
      } else {
        setError(result);
      }
      setLoading(false);
    };

    fetchCompanyData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const openModal = (company: any) => {
    setSelectedCompany(company);
    setTimeout(() => setIsModalVisible(true), 0);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedCompany(null), 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const formatSalary = (salary: number) => {
    return (
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(salary) + ' / month'
    );
  };

  const filteredCompanies = companyData
    ? companyData.filter((company: any) =>
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  return (
    <div className="container mx-auto p-4 w-full items-center text-center mt-5">
      <h1 className="text-3xl font-bold mb-6">Companies</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for a company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 w-full md:w-1/3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company: any) => (
            <div
              key={company.id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition bg-white cursor-pointer"
              onClick={() => openModal(company)}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <Image
                    src={company.companyLogo || '/default-logo.png'}
                    alt={`${company.companyName} Logo`}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <h2 className="text-lg font-semibold text-center">
                  {company.companyName}
                </h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No company data available.</p>
      )}

      {/* Modal */}
      {selectedCompany && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
            isModalVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleBackdropClick}
        >
          <div
            className={`bg-white rounded-lg w-full max-w-2xl p-6 transform transition-transform duration-300 ${
              isModalVisible ? 'scale-100' : 'scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {selectedCompany.companyName}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-3xl"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>

            <p className="text-gray-700 mb-4">
              {selectedCompany.companyDescription ||
                'No description available.'}
            </p>

            <h3 className="text-lg font-semibold mb-2">Available Jobs</h3>
            {selectedCompany.jobs.length > 0 ? (
              selectedCompany.jobs
                .sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .slice(0, 3)
                .map((job: any) => (
                  <div
                    key={job.id}
                    className="border p-4 rounded shadow-md mb-4"
                  >
                    <h4 className="font-semibold">{job.title}</h4>
                    <p className="text-gray-600">{job.description}</p>
                    <p>
                      <strong>Location:</strong> {job.location}
                    </p>
                    <p>
                      <strong>Salary:</strong> {formatSalary(job.salary)}
                    </p>
                    <p>
                      <strong>Remote:</strong> {job.remoteOption ? 'Yes' : 'No'}
                    </p>
                    <div className="flex space-x-4 mt-4">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Apply
                      </button>
                      <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                        Save
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <p>No jobs available for this company.</p>
            )}

            {selectedCompany.jobs.length > 3 && (
              <button className="text-blue-500 hover:underline mt-4">
                See More Jobs
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;

"use client";

import React, { useEffect, useState } from 'react';

interface TestResult {
  applicantId: string;
  applicantName: string;
  score: number;
  status: string;
}

const TestResults: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestResults = async () => {
    try {
      const response = await fetch('/api/applicants/test-results'); // Adjust endpoint as needed
      const data: TestResult[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch test results", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestResults();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Test Results</h2>
      {loading ? (
        <p>Loading test results...</p>
      ) : results.length === 0 ? (
        <p>No test results available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Applicant ID</th>
              <th className="border border-gray-300 p-2">Applicant Name</th>
              <th className="border border-gray-300 p-2">Score</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.applicantId} className="text-center">
                <td className="border border-gray-300 p-2">{result.applicantId}</td>
                <td className="border border-gray-300 p-2">{result.applicantName}</td>
                <td className="border border-gray-300 p-2">{result.score}%</td>
                <td className="border border-gray-300 p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${result.status === 'Pass' ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    {result.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TestResults;

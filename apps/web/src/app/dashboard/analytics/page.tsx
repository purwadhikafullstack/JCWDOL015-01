import DashboardLayout from '@/components/DashboardLayout';
import React from 'react';
import UserAgeChart from '@/components/analytics/UserAgeChart';
import UserGenderChart from '@/components/analytics/UserGenderChart';
import UserLocationChart from '@/components/analytics/UserLocationChart';
import SalaryTrendChart from '@/components/analytics/SalaryTrendChart';
import JobInterestdChart from '@/components/analytics/JobInterestChart';

function Analytics() {
    
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Analytics</h1>
        {/* Add your analytics content here */}
        <p>This is the Analytics page.</p>

      <div className="flex flex-col">
        <div className="text-2xl font-bold">User Demographics</div>
        <div className="flex">
          <div className="flex-grow">
            <UserAgeChart />
          </div>
          <div className="flex-grow">
            <UserGenderChart />
          </div>
          <div className="flex-grow">
            <UserLocationChart />
          </div>
        </div>

        <div className="text-2xl font-bold">Salary Trends</div>
        <div className="flex">
          <div className="flex-grow">
            <SalaryTrendChart />
          </div>
        </div>
        
        <div className="text-2xl font-bold">Applicant Interest</div>
        <div className="flex">
          <div className="flex-grow">
            <JobInterestdChart />
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}

export default Analytics;
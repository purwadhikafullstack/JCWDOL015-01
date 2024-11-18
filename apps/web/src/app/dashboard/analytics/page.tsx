import DashboardLayout from '@/components/DashboardLayout';
import React from 'react';
import UserAgeChart from '@/components/analytics/UserAgeChart';
import UserGenderChart from '@/components/analytics/UserGenderChart';
import UserLocationChart from '@/components/analytics/UserLocationChart';
import SalaryTrendChart from '@/components/analytics/SalaryTrendChart';

function Analytics() {
    
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Analytics</h1>
        {/* Add your analytics content here */}
        <p>This is the Analytics page.</p>

      <div className="flex flex-col space-y-4">
        <div className="text-2xl font-bold">User Demographics</div>
        <div className="flex space-x-4">
          <div className="w-1/3">
            <UserAgeChart />
          </div>
          <div className="w-1/3">
            <UserGenderChart />
          </div>
          <div className="w-1/3">
            <UserLocationChart />
          </div>
        </div>
        
        <div className="text-2xl font-bold">Applicant Interest</div>
        <div className="flex space-x-4">
          <div className="w-1/3">
            <canvas id="jobInterestChart"></canvas>
          </div>
          <div className="w-1/3">
            <canvas id="industryInterestChart"></canvas>
          </div>
          <div className="w-1/3">
            <canvas id="companyInterestChart"></canvas>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}

export default Analytics;

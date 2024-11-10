import Dashboard from '@/app/dashboard/page';
import React from 'react';


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex">
            <Dashboard />
            <div className="flex-grow p">
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;

import React from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaBriefcase, FaUsers, FaCalendarAlt, FaChartPie } from 'react-icons/fa';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex">
            <div className="flex flex-col w-52 h-screen bg-gray-900 text-white shadow-md"> 
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <h1 className="text-xl font-bold">Dashboard</h1> 
            </div>
            <nav className="flex-grow">
                <ul className="flex flex-col">
                    <li className="group">
                        <Link href="/dashboard" className="flex items-center p-3 hover:bg-gray-700 transition duration-200"> 
                            <FaTachometerAlt className="mr-3 text-lg" /> 
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className="group">
                        <Link href="/dashboard/job-postings" className="flex items-center p-3 hover:bg-gray-700 transition duration-200">
                            <FaBriefcase className="mr-3 text-lg" />
                            <span>Job Postings</span>
                        </Link>
                    </li>
                    <li className="group">
                        <Link href="/dashboard/applicants" className="flex items-center p-3 hover:bg-gray-700 transition duration-200"> 
                            <FaUsers className="mr-3 text-lg" /> 
                            <span>Applicants</span>
                        </Link>
                    </li>
                    <li className="group">
                        <Link href="/dashboard/interviews" className="flex items-center p-3 hover:bg-gray-700 transition duration-200"> 
                            <FaCalendarAlt className="mr-3 text-lg" />
                            <span>Interviews</span>
                        </Link>
                    </li>
                    <li className="group">
                        <Link href="/dashboard/analytics" className="flex items-center p-3 hover:bg-gray-700 transition duration-200"> 
                            <FaChartPie className="mr-3 text-lg" /> 
                            <span>Analytics</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
            <div className="flex-grow p">
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;

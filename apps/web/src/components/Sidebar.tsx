import Link from 'next/link';
import { FaTachometerAlt, FaBriefcase, FaUsers, FaCalendarAlt, FaChartPie } from 'react-icons/fa';

const Sidebar = () => {
    return (
        <div className="flex flex-col w-64 h-screen bg-gray-900 text-white shadow-md">
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <nav className="flex-grow">
                <ul className="flex flex-col">
                    <li className="group">
                        <Link href="/dashboard" className="flex items-center p-4 hover:bg-gray-700 transition duration-200">
                            <FaTachometerAlt className="mr-3 text-xl" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className="group">
                        <Link href="/job-postings" className="flex items-center p-4 hover:bg-gray-700 transition duration-200">
                            <FaBriefcase className="mr-3 text-xl" />
                            <span>Job Postings</span>
                        </Link>
                    </li>
                    <li className="group">
                        <Link href="/applicants" className="flex items-center p-4 hover:bg-gray-700 transition duration-200">
                            <FaUsers className="mr-3 text-xl" />
                            <span>Applicants</span>
                        </Link>
                    </li>
                    <li className="group">
                        <Link href="/interviews" className="flex items-center p-4 hover:bg-gray-700 transition duration-200">
                            <FaCalendarAlt className="mr-3 text-xl" />
                            <span>Interviews</span>
                        </Link>
                    </li>
                    <li className="group">
                        <Link href="/analytics" className="flex items-center p-4 hover:bg-gray-700 transition duration-200">
                            <FaChartPie className="mr-3 text-xl" />
                            <span>Analytics</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;

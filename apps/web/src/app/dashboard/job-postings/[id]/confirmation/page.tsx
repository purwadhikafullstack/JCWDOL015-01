// "use client"

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import DashboardLayout from '@/components/DashboardLayout';

// const Confirmation = () => {
//     const router = useRouter();

//     return (
//         <DashboardLayout>
//             <div className="flex flex-col p-4 bg-gray-500">
//                 <h1 className="text-2xl font-bold mb-6">Job Posting Updated Successfully!</h1>
//                 <p className="mb-4">Your job posting has been updated. You can view your postings in the dashboard.</p>
//                 <button
//                     onClick={() => router.push('/dashboard/job-postings')}
//                     className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
//                     Go to Job Postings
//                 </button>
//             </div>
//         </DashboardLayout>
//     );
// };

// export default Confirmation;

"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

const Confirmation = () => {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="flex flex-col p-8 bg-white shadow-xl rounded-lg max-w-lg mx-auto mt-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Job Posting Updated Successfully!</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">Your job posting has been successfully updated. You can view your job postings in the dashboard.</p>
        <button
          onClick={() => router.push('/dashboard/job-postings')}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go to Job Postings
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Confirmation;

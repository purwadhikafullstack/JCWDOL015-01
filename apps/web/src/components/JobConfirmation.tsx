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
      <div className="flex flex-col p-8 bg-white shadow-lg rounded-xl max-w-xl mx-auto mt-12">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Posting Pekerjaan Diperbarui dengan Sukses!</h1>
        <p className="text-lg text-gray-600 mb-6 text-center">Postingan pekerjaan Anda telah diperbarui. Anda dapat melihat postingan Anda di dasbor.</p>
        <button
          onClick={() => router.push('/dashboard/job-postings')}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-105">
          Go to Job Postings
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Confirmation;

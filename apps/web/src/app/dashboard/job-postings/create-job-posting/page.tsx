// "use client";
// import React, { useState } from 'react';
// import DashboardLayout from '@/components/DashboardLayout';
// import { useRouter } from 'next/navigation';

// const CreateJobPosting = () => {
//     const router = useRouter();

//     const [jobData, setJobData] = useState({
//         title: '',
//         description: '',
//         banner: null as File | null,
//         category: '',
//         location: '',
//         salary: '',
//         tags: '',
//         expiryDate: '',
//         requiresTest: true,
//         remoteOption: false
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setJobData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setJobData((prevData) => ({ ...prevData, banner: file }));
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append('title', jobData.title);
//         formData.append('description', jobData.description);
//         if (jobData.banner) {
//             formData.append('banner', jobData.banner);
//         }
//         formData.append('category', jobData.category);
//         formData.append('location', jobData.location);
//         if (jobData.salary) {
//             formData.append('salary', parseFloat(jobData.salary).toString());
//         }
//         formData.append('tags', `[${jobData.tags.split(',').map(tag => tag.trim()).join(', ')}]`);
//         formData.append('expiry_date', new Date(jobData.expiryDate).toString());
//         formData.append('requires_test', String(jobData.requiresTest));
//         formData.append('remote_option', String(jobData.remoteOption));
//         formData.append('created_at', new Date().toString());

//         const response = await fetch('/api/job-postings', {
//             method: 'POST',
//             body: formData,
//         });

//         if (response.ok) {
//             router.push('/dashboard/job-postings');
//         } else {
//             console.error('Failed to create job posting');
//         }
//     };

//     return (
//         <DashboardLayout>
//             <div className="flex flex-col p-4 bg-gray-500">
//                 <h1 className="text-2xl font-bold mb-6">Create Job Posting</h1>
//                 <form onSubmit={handleSubmit} className="w-full mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300">
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Job Title</label>
//                         <input
//                             type="text"
//                             name="title"
//                             value={jobData.title}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Description</label>
//                         <textarea
//                             name="description"
//                             value={jobData.description}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Banner (Optional)</label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleFileChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Category</label>
//                         <select
//                             name="category"
//                             value={jobData.category}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required
//                         >
//                             <option value="">Select a category</option>
//                             <option value="Technology">Technology</option>
//                             <option value="Finance">Finance</option>
//                             <option value="Healthcare">Healthcare</option>
//                             <option value="Education">Education</option>
//                             <option value="Marketing">Marketing</option>
//                             <option value="Manufacturing">Manufacturing</option>
//                         </select>
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Location</label>
//                         <input
//                             type="text"
//                             name="location"
//                             value={jobData.location}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Salary (Optional)</label>
//                         <input
//                             type="number"
//                             name="salary"
//                             step="0.01"
//                             value={jobData.salary}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Tags (separate with commas)</label>
//                         <input
//                             type="text"
//                             name="tags"
//                             value={jobData.tags}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
//                         <input
//                             type="date"
//                             name="expiryDate"
//                             value={jobData.expiryDate}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 name="requiresTest"
//                                 checked={jobData.requiresTest}
//                                 onChange={(e) => setJobData((prevData) => ({ ...prevData, requiresTest: e.target.checked }))}
//                                 className="mr-2"
//                             />
//                             Requires Test
//                         </label>
//                     </div>

//                     <div className="mb-4">
//                         <label className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 name="remoteOption"
//                                 checked={jobData.remoteOption}
//                                 onChange={(e) => setJobData((prevData) => ({ ...prevData, remoteOption: e.target.checked }))}
//                                 className="mr-2"
//                             />
//                             Remote Option
//                         </label>
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
//                     >
//                         Create Job Posting
//                     </button>
//                 </form>
//             </div>
//         </DashboardLayout>
//     );
// };

// export default CreateJobPosting;

// "use client"
// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import DashboardLayout from '@/components/DashboardLayout';

// const CreateJobPosting = () => {
//     const router = useRouter();

//     const [jobData, setJobData] = useState({
//         title: '',
//         description: '',
//         banner: null as File | null,
//         category: '',
//         location: '',
//         salary: '',
//         tags: '',
//         expiryDate: '',
//         requiresTest: true,
//         remoteOption: false,
//         isPublished: false, 
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setJobData((prevData) => ({
//             ...prevData,
//             [name]: name === 'salary' ? parseFloat(value) : value,
//         }));
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setJobData((prevData) => ({ ...prevData, banner: file }));
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append('title', jobData.title);
//         formData.append('description', jobData.description);
//         if (jobData.banner) {
//             formData.append('banner', jobData.banner);
//         }
//         formData.append('category', jobData.category);
//         formData.append('location', jobData.location);
//         if (jobData.salary) {
//             formData.append('salary', parseFloat(jobData.salary).toString());
//         }
//         formData.append('tags', `[${jobData.tags.split(',').map((tag: string) => tag.trim()).join(', ')}]`);
//         formData.append('expiry_date', new Date(jobData.expiryDate).toISOString());
//         formData.append('requires_test', String(jobData.requiresTest));
//         formData.append('remote_option', String(jobData.remoteOption));
//         formData.append('is_published', String(jobData.isPublished)); // Append published status
//         formData.append('created_at', new Date().toString());

//         const response = await fetch('/api/job-postings', {
//             method: 'POST',
//             body: formData,
//         });

//         if (response.ok) {
//             router.push('/job-postings/create-job-posting/confirmation?status=posted');
//         } else {
//             console.error('Failed to create job posting');
//         }
//     };

//     return (
//         <DashboardLayout>
//             <div className="flex flex-col p-4 bg-gray-500">
//                 <h1 className="text-2xl font-bold mb-6">Create Job Posting</h1>
//                 <form onSubmit={handleSubmit} className="w-full mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300">
//                      <div className="mb-4">
//                          <label className="block text-sm font-medium text-gray-700">Job Title</label>
//                          <input
//                             type="text"
//                             name="title"
//                             value={jobData.title}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Description</label>
//                         <textarea
//                             name="description"
//                             value={jobData.description}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Banner (Optional)</label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleFileChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Category</label>
//                         <select
//                             name="category"
//                             value={jobData.category}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required
//                         >
//                             <option value="">Select a category</option>
//                             <option value="Technology">Technology</option>
//                             <option value="Finance">Finance</option>
//                             <option value="Healthcare">Healthcare</option>
//                             <option value="Education">Education</option>
//                             <option value="Marketing">Marketing</option>
//                             <option value="Manufacturing">Manufacturing</option>
//                         </select>
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Location</label>
//                         <input
//                             type="text"
//                             name="location"
//                             value={jobData.location}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required
//                         />
//                     </div>

//                     {/* <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Salary (Optional)</label>
//                         <input
//                             type="number"
//                             name="salary"
//                             step="0.01"
//                             value={jobData.salary}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                         />
//                     </div> */}

// <div className="mb-4">
//       <label className="block text-sm font-medium text-gray-700">Salary (Optional)</label>
//       <input
//         type="text"  // Use text instead of number to control input format
//         name="salary"
//         value={jobData.salary}
//         onChange={handleChange}
//         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//       />
//     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Tags (separate with commas)</label>
//                         <input
//                             type="text"
//                             name="tags"
//                             value={jobData.tags}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
//                         <input
//                             type="date"
//                             name="expiryDate"
//                             value={jobData.expiryDate}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 name="requiresTest"
//                                 checked={jobData.requiresTest}
//                                 onChange={(e) => setJobData((prevData) => ({ ...prevData, requiresTest: e.target.checked }))}
//                                 className="mr-2"
//                             />
//                             Requires Test
//                         </label>
//                     </div>

//                     <div className="mb-4">
//                         <label className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 name="remoteOption"
//                                 checked={jobData.remoteOption}
//                                 onChange={(e) => setJobData((prevData) => ({ ...prevData, remoteOption: e.target.checked }))}
//                                 className="mr-2"
//                             />
//                             Remote Option
//                         </label>
//                     </div>

//                     <div className="mb-4">
//                         <label className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 name="isPublished"
//                                 checked={jobData.isPublished}
//                                 onChange={(e) => setJobData((prevData: any) => ({ ...prevData, isPublished: e.target.checked }))} // Update the published state
//                                 className="mr-2"
//                             />
//                             Publish Immediately
//                         </label>
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
//                     >
//                         Create Job Posting
//                     </button>
//                 </form>
//             </div>
//         </DashboardLayout>
//     );
// };

// export default CreateJobPosting;

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { formatInputWithCommas } from '@/utils/utils';


const CreateJobPosting = () => {
    const router = useRouter();

    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        banner: null as File | null,
        category: '',
        location: '',
        salary: '',
        tags: '',
        expiryDate: '',
        requiresTest: true,
        remoteOption: false,
        isPublished: false, 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const formattedValue = name === 'salary' ? formatInputWithCommas(value) : value;

        setJobData((prevData) => ({
            ...prevData,
            [name]: formattedValue, // Update state with the formatted value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setJobData((prevData) => ({ ...prevData, banner: file }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', jobData.title);
        formData.append('description', jobData.description);
        if (jobData.banner) {
            formData.append('banner', jobData.banner);
        }
        formData.append('category', jobData.category);
        formData.append('location', jobData.location);
        if (jobData.salary) {
            formData.append('salary', parseFloat(jobData.salary.replace(/,/g, '')).toString()); // Remove commas before submitting
        }
        formData.append('tags', `[${jobData.tags.split(',').map((tag: string) => tag.trim()).join(', ')}]`);
        formData.append('expiry_date', new Date(jobData.expiryDate).toISOString());
        formData.append('requires_test', String(jobData.requiresTest));
        formData.append('remote_option', String(jobData.remoteOption));
        formData.append('is_published', String(jobData.isPublished)); // Append published status
        formData.append('created_at', new Date().toString());

        const response = await fetch('/api/job-postings', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            router.push('/job-postings/create-job-posting/confirmation?status=posted');
        } else {
            console.error('Failed to create job posting');
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col p-4 bg-gray-500">
                <h1 className="text-2xl font-bold mb-6">Create Job Posting</h1>
                <form onSubmit={handleSubmit} className="w-full mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300">
                     <div className="mb-4">
                         <label className="block text-sm font-medium text-gray-700">Job Title</label>
                         <input
                            type="text"
                            name="title"
                            value={jobData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={jobData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Banner (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category"
                            value={jobData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Technology">Technology</option>
                            <option value="Finance">Finance</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Education">Education</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Manufacturing">Manufacturing</option>
                        </select>
                    </div>

                    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Salary (Optional)</label>
      <input
        type="text"  // Use text instead of number to control input format
        name="salary"
        value={jobData.salary}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
      />
    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Tags (separate with commas)</label>
                        <input
                            type="text"
                            name="tags"
                            value={jobData.tags}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={jobData.expiryDate}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="requiresTest"
                                checked={jobData.requiresTest}
                                onChange={(e) => setJobData((prevData) => ({ ...prevData, requiresTest: e.target.checked }))} 
                                className="mr-2"
                            />
                            Requires Test
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="remoteOption"
                                checked={jobData.remoteOption}
                                onChange={(e) => setJobData((prevData) => ({ ...prevData, remoteOption: e.target.checked }))} 
                                className="mr-2"
                            />
                            Remote Option
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={jobData.isPublished}
                                onChange={(e) => setJobData((prevData) => ({ ...prevData, isPublished: e.target.checked }))} 
                                className="mr-2"
                            />
                            Publish Immediately
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        Create Job Posting
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateJobPosting;

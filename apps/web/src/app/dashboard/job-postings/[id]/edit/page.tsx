// "use client";
// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import DashboardLayout from '@/components/DashboardLayout';

// const EditJobPosting = () => {
//     const { id } = useParams();
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
//     const [loading, setLoading] = useState(true); // State to handle loading
//     const [error, setError] = useState<string | null>(null); // State to handle errors

//     useEffect(() => {
//         if (id) {
//             fetch(`http://localhost:8000/api/jobs/${id}`)
//                 .then((res) => {
//                     if (!res.ok) {
//                         throw new Error("Network response was not ok");
//                     }
//                     return res.json();
//                 })
//                 .then((data) => {
//                     console.log("Fetched job data:", data); 
//                     setJobData({
//                         title: data.title,
//                         description: data.description,
//                         banner: null,
//                         category: data.category,
//                         location: data.location,
//                         salary: data.salary,
//                         tags: data.tags || '',
//                         expiryDate: data.expiry_date ? new Date(data.expiry_date).toISOString().split('T')[0] : '',
//                         requiresTest: data.requires_test || false, 
//                         remoteOption: data.remote_option || false, 
//                         isPublished: data.published || false, 
//                     });
//                 })
//                 .catch((error) => {
//                     console.error("Failed to fetch job data:", error);
//                     setError("Failed to load job data. Please try again.");
//                 })
//                 .finally(() => setLoading(false)); 
//         }
//     }, [id]);
    
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setJobData((prevData) => ({
//             ...prevData,
//             [name]: name === 'expiryDate' ? new Date(value).toISOString()
//                 : name === 'salary' ? parseFloat(value)
//                 : value,
//         }));
//     };

//     const handleBoxChange = (name: string, value: boolean) => {
//         setJobData((prevData) => ({
//             ...prevData,
//             [name]: value,
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
//         formData.append('tags', `[${jobData.tags.split(',').map((tag) => tag.trim()).join(', ')}]`);
//         formData.append('expiry_date', new Date(jobData.expiryDate).toString());
//         formData.append('requires_test', String(jobData.requiresTest)); 
//         formData.append('remote_option', String(jobData.remoteOption)); 
//         formData.append('is_published', String(jobData.isPublished));
    
//         try {
//             const response = await fetch(`/api/job-postings/${id}`, {
//                 method: 'PUT',
//                 body: formData,
//             });
    
//             if (response.ok) {
//                 router.push(`/dashboard/job-postings/${id}/confirmation`);
//             } else {
//                 console.error('Failed to update job posting');
//             }
//         } catch (error) {
//             console.error('Error during job posting update:', error);
//         }
//     };
    

//     return (
//         <DashboardLayout>
//             <div className="flex flex-col p-4 bg-gray-500">
//                 <h1 className="text-2xl font-bold mb-6">Edit Job Posting</h1>
//                 <form onSubmit={handleSubmit} className="w-full mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300">
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Job Title</label>
//                         <input
//                             type="text"
//                             name="title"
//                             value={jobData.title}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required/>
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Description</label>
//                         <textarea
//                             name="description"
//                             value={jobData.description}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required/>
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Banner (Optional)</label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleFileChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Category</label>
//                         <select
//                             name="category"
//                             value={jobData.category}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required>
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
//                             required/>
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Salary (Optional)</label>
//                         <input
//                             type="number"
//                             name="salary"
//                             step="0.01"
//                             value={jobData.salary}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Tags (separate with commas)</label>
//                         <input
//                             type="text"
//                             name="tags"
//                             value={jobData.tags}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
//                         <input
//                             type="date"
//                             name="expiryDate"
//                             value={jobData.expiryDate}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                             required/>
//                     </div>

//                     <div className="mb-4">
//                         <label className="flex items-center">
//                         <input
//                             type="checkbox"
//                             name="requiresTest"
//                             checked={jobData.requiresTest}
//                             onChange={(e) => handleBoxChange('requiresTest', e.target.checked)}
//                             className="mr-2"/>
//                         Requires Test
//                         </label>
//                     </div>

//                     <div className="mb-4">
//                         <label className="flex items-center">
//                         <input
//                             type="checkbox"
//                             name="remoteOption"
//                             checked={jobData.remoteOption}
//                             onChange={(e) => handleBoxChange('remoteOption', e.target.checked)}
//                             className="mr-2"/>
//                         Remote Option
//                         </label>
//                     </div>

//                     <div className="mb-4">
//                         <label className="flex items-center">
//                         <input
//                             type="checkbox"
//                             name="isPublished"
//                             checked={jobData.isPublished}
//                             onChange={(e) => handleBoxChange('isPublished', e.target.checked)}
//                             className="mr-2"/>
//                         Publish Job Posting
//                         </label>
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
//                         Update Job Posting
//                     </button>
//                 </form>
//             </div>
//         </DashboardLayout>
//     );
// };
// export default EditJobPosting;

"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { formatInputWithCommas } from '@/utils/utils';


const EditJobPosting = () => {
    const { id } = useParams();
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:8000/api/jobs/${id}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return res.json();
                })
                .then((data) => {
                    const formattedSalary = data.salary ? formatInputWithCommas(data.salary.toString()) : '';
                    setJobData({
                        title: data.title,
                        description: data.description,
                        banner: null,
                        category: data.category,
                        location: data.location,
                        salary: formattedSalary, // Set the formatted salary here
                        tags: data.tags || '',
                        expiryDate: data.expiry_date ? new Date(data.expiry_date).toISOString().split('T')[0] : '',
                        requiresTest: data.requires_test || false, 
                        remoteOption: data.remote_option || false, 
                        isPublished: data.published || false, 
                    });
                })
                .catch((error) => {
                    console.error("Failed to fetch job data:", error);
                    setError("Failed to load job data. Please try again.");
                })
                .finally(() => setLoading(false)); 
        }
    }, [id]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setJobData((prevData) => ({
            ...prevData,
            [name]: name === 'expiryDate' ? new Date(value).toISOString()
                : name === 'salary' ? formatInputWithCommas(value) // Apply formatting here
                : value,
        }));
    };

    const handleBoxChange = (name: string, value: boolean) => {
        setJobData((prevData) => ({
            ...prevData,
            [name]: value,
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
        
        // Remove commas before submission
        if (jobData.salary) {
            const salaryValue = jobData.salary.replace(/,/g, ''); // Remove commas before submission
            formData.append('salary', parseFloat(salaryValue).toString());
        }
        
        formData.append('tags', `[${jobData.tags.split(',').map((tag) => tag.trim()).join(', ')}]`);
        formData.append('expiry_date', new Date(jobData.expiryDate).toString());
        formData.append('requires_test', String(jobData.requiresTest)); 
        formData.append('remote_option', String(jobData.remoteOption)); 
        formData.append('is_published', String(jobData.isPublished));
    
        try {
            const response = await fetch(`http://localhost:8000/api/jobs/${id}`, {
                method: 'PUT',
                body: formData,
            });
    
            if (response.ok) {
                router.push(`/dashboard/job-postings/${id}/confirmation`);
            } else {
                console.error('Failed to update job posting');
            }
        } catch (error) {
            console.error('Error during job posting update:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col p-4 bg-gray-500">
                <h1 className="text-2xl font-bold mb-6">Edit Job Posting</h1>
                <form onSubmit={handleSubmit} className="w-full mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-300">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Job Title</label>
                        <input
                            type="text"
                            name="title"
                            value={jobData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required/>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={jobData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required/>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Banner (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category"
                            value={jobData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required>
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
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={jobData.location}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required/>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Salary (Optional)</label>
                        <input
                            type="text"
                            name="salary"
                            value={jobData.salary}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Tags (separate with commas)</label>
                        <input
                            type="text"
                            name="tags"
                            value={jobData.tags}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={jobData.expiryDate}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required/>
                    </div>

                    {/* <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Requires Test</label>
                        <input
                            type="checkbox"
                            name="requiresTest"
                            checked={jobData.requiresTest}
                            onChange={() => handleBoxChange('requiresTest', !jobData.requiresTest)}
                            className="mt-1"/>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Remote Option</label>
                        <input
                            type="checkbox"
                            name="remoteOption"
                            checked={jobData.remoteOption}
                            onChange={() => handleBoxChange('remoteOption', !jobData.remoteOption)}
                            className="mt-1"/>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Publish</label>
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={jobData.isPublished}
                            onChange={() => handleBoxChange('isPublished', !jobData.isPublished)}
                            className="mt-1"/>
                    </div> */}
                    <div className="mb-4">
                         <label className="flex items-center">
                         <input
                            type="checkbox"
                            name="requiresTest"
                            checked={jobData.requiresTest}
                            onChange={(e) => handleBoxChange('requiresTest', e.target.checked)}
                            className="mr-2"/>
                        Requires Test
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="remoteOption"
                            checked={jobData.remoteOption}
                            onChange={(e) => handleBoxChange('remoteOption', e.target.checked)}
                            className="mr-2"/>
                        Remote Option
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={jobData.isPublished}
                            onChange={(e) => handleBoxChange('isPublished', e.target.checked)}
                            className="mr-2"/>
                        Publish Job Posting
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
                        Save Changes
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditJobPosting;

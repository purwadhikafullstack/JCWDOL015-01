'use client'

import { useState } from "react";

interface Job {
    jobTitle: string;
    jobUrl: string;
    description: string; // New property for job description
}

interface JobShareProps {
    jobs?: Job[];
}

const JobShareButtons: React.FC<JobShareProps> = ({ jobs = [] }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const jobsPerPage = 1; // Show one job per page

    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    // Get the single job for the current page
    const currentJob = jobs[(currentPage - 1) * jobsPerPage];

    const [customMessage, setCustomMessage] = useState<string>('');
    const handleCustomMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomMessage(e.target.value);
    };

    const shareOnPlatform = (
        platform: 'LinkedIn' | 'Facebook' | 'Twitter' | 'WhatsApp',
        job: Job
    ) => {
        const message = encodeURIComponent(`${customMessage} ${job.jobTitle}`);
        const encodedJobURL = encodeURIComponent(job.jobUrl);
        let shareURL = '';

        switch (platform) {
            case 'LinkedIn':
                shareURL = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedJobURL}&title=${message}`;
                break;
            case 'Facebook':
                shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodedJobURL}`;
                break;
            case 'Twitter':
                shareURL = `https://twitter.com/intent/tweet?text=${message}&url=${encodedJobURL}`;
                break;
            case 'WhatsApp':
                shareURL = `https://wa.me/?text=${message}%20${encodedJobURL}`;
                break;
        }

        window.open(shareURL, '_blank');
    };

    if (jobs.length === 0) {
        return <p>No jobs available to share.</p>;
    }

    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Add a Message"
                value={customMessage}
                onChange={handleCustomMessage}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="space-y-2">
                <h3 className="text-xl font-bold">{currentJob.jobTitle}</h3>
                <p className="text-gray-600">{currentJob.description}</p>

                <div className="flex space-x-4">
                    <button
                        onClick={() => shareOnPlatform('LinkedIn', currentJob)}
                        className="px-4 py-2 text-white bg-blue-700 rounded hover:bg-blue-800"
                    >
                        Share on LinkedIn
                    </button>
                    <button
                        onClick={() => shareOnPlatform('Facebook', currentJob)}
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Share on Facebook
                    </button>
                    <button
                        onClick={() => shareOnPlatform('Twitter', currentJob)}
                        className="px-4 py-2 text-white bg-blue-400 rounded hover:bg-blue-500"
                    >
                        Share on Twitter
                    </button>
                    <button
                        onClick={() => shareOnPlatform('WhatsApp', currentJob)}
                        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                    >
                        Share on WhatsApp
                    </button>
                </div>
            </div>

            <div className="flex justify-between mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default JobShareButtons;
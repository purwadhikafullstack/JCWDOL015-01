'use client'

import { useState } from "react";

interface JobShareProps {
    jobTitle: string;
    jobUrl: string;
}

const JobShareButtons: React.FC<JobShareProps> = ({ jobTitle, jobUrl }) => {
    const [customMessage, setCustomMessage] = useState<string>('')
    const HandlingCustomMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomMessage(e.target.value)
    }

    const shareOnPlatform = (platform: 'LinkedIn' | 'Facebook' | 'Twitter' | 'WhatsApp') => {
        const message = encodeURIComponent(`${customMessage} ${jobTitle}`)
        const encodedJobURL = encodeURIComponent(jobUrl)
        let ShareURL = ''

        switch (platform) {
            case "LinkedIn":
                ShareURL = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedJobURL}&title=${message}`
                break
            case "Facebook":
                ShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodedJobURL}`
                break
            case "Twitter":
                ShareURL = `https://twitter.com/intent/tweet?text=${message}&url=${encodedJobURL}`
                break
            case "WhatsApp":
                ShareURL = `https://wa.me/?text=${message}%20${encodedJobURL}`
                break
        }

        window.open(ShareURL, '_blank')
    }

    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Add a Message"
                value={customMessage}
                onChange={HandlingCustomMessage}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-4">
                <button
                    onClick={() => shareOnPlatform('LinkedIn')}
                    className="px-4 py-2 text-white bg-blue-700 rounded hover:bg-blue-800"
                >
                    Share on LinkedIn
                </button>
                <button
                    onClick={() => shareOnPlatform('Facebook')}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    Share on Facebook
                </button>
                <button
                    onClick={() => shareOnPlatform('Twitter')}
                    className="px-4 py-2 text-white bg-blue-400 rounded hover:bg-blue-500"
                >
                    Share on Twitter
                </button>
                <button
                    onClick={() => shareOnPlatform('WhatsApp')}
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                    Share on WhatsApp
                </button>
            </div>
        </div>
    )
}

export default JobShareButtons
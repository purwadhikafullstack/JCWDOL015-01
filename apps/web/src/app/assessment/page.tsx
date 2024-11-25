'use client'

import UserAssessments from "@/components/Assessment/assessmentPage"
import Link from "next/link"

export default function Assessment() {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Back Link */}
            <Link
                href="/"
                className="inline-flex items-center text-blue-500 hover:text-blue-600 transition duration-150"
            >
                <svg
                    className="w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Go Back
            </Link>

            {/* Header */}
            <p className="text-2xl font-semibold text-gray-800 mt-6">User Assessment</p>

            {/* User Assessments Component */}
            <div className="mt-6">
                <UserAssessments userId={1} />
            </div>
        </div>

    )
}
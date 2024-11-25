'use client'

import UserAssessments from "@/components/Assessment/assessmentPage"
import Link from "next/link"

export default function Assessment() {
    return (
        <div>
            <Link href={'/'}>Go Back</Link>
            <p>Here's of User Assessment</p>
            <UserAssessments userId={1} />
        </div>
    )
}
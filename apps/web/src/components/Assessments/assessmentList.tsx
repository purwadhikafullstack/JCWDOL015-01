// components/AssessmentList.tsx
import { useState, useEffect } from 'react';
import { getUserAssessments } from '@/services/assessmentService';
import { useRouter } from 'next/router';

interface Assessment {
    id: number;
    title: string;
    description: string;
}

interface AssessmentListProps {
    userId: number;
}

const AssessmentList: React.FC<AssessmentListProps> = ({ userId }) => {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const data = await getUserAssessments(userId);
                setAssessments(data);
            } catch (error) {
                console.error("Error fetching assessments:", error);
            }
        };

        fetchAssessments();
    }, [userId]);

    const startAssessment = (assessmentId: number) => {
        router.push(`/assessments/${assessmentId}`);
    };

    return (
        <div>
            <h2>Your Assessments</h2>
            {assessments.map((assessment) => (
                <div key={assessment.id}>
                    <h3>{assessment.title}</h3>
                    <p>{assessment.description}</p>
                    <button onClick={() => startAssessment(assessment.id)}>Start Assessment</button>
                </div>
            ))}
        </div>
    );
};

export default AssessmentList;

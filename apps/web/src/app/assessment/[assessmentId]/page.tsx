'use client'
import { useRouter } from 'next/navigation';
import AssessmentQuestions from '@/components/Assessments/assessmentForm';

const AssessmentPage: React.FC = () => {
    const router = useRouter();
    const assessmentId  = router.push;

    if (!assessmentId) {
        return <div>Loading...</div>;
    }

    return <AssessmentQuestions assessmentId={Number(assessmentId)} />;
};

export default AssessmentPage;

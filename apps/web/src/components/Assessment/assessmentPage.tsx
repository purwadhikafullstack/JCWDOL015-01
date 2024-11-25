import { fetchUserAssessments, completeAssessment } from "@/services/assessmentService";
import { Assessment, CompleteAssessmentPayload } from "@/types/assessments";
import { useState, useEffect } from "react";

interface UserAssessmentsPageProps {
    userId: number;
}

const UserAssessmentsPage: React.FC<UserAssessmentsPageProps> = ({ userId }) => {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadAssessments = async () => {
            try {
                const data = await fetchUserAssessments(userId);
                setAssessments(data);
            } catch (error) {
                console.error('Error fetching assessments:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAssessments();
    }, [userId]);

    const handleCompleteAssessment = async () => {
        if (!selectedAssessment || !userId) return;

        const payload: CompleteAssessmentPayload = {
            assessmentId: selectedAssessment.id,
            answers,
            userId,
        };

        try {
            const response = await completeAssessment(userId, payload);
            setResult(response);
            setSelectedAssessment(null); // Reset selected assessment after completion
        } catch (error) {
            console.error('Error completing assessment:', error);
        }
    };

    if (loading) return <p>Loading assessments...</p>;

    return (
        <div>
            <h1>User Assessments</h1>
            {!selectedAssessment ? (
                <>
                    <ul>
                        {assessments.map((assessment) => (
                            <li key={assessment.id}>
                                <h2>{assessment.title}</h2>
                                <p>{assessment.description}</p>
                                <button onClick={() => setSelectedAssessment(assessment)}>Start Assessment</button>
                            </li>
                        ))}
                    </ul>
                    {result && (
                        <div>
                            <h3>Assessment Result</h3>
                            <p>Score: {result.score}</p>
                            <p>{result.passed ? 'You Passed!' : 'Try Again!'}</p>
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <h2>{selectedAssessment.title}</h2>
                    <ul>
                        {selectedAssessment.questions.map((question, index) => (
                            <li key={index}>
                                <p>{question.content}</p>
                                {question.options.map((option, idx) => (
                                    <label key={idx}>
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={option}
                                            onChange={() => {
                                                const updatedAnswers = [...answers];
                                                updatedAnswers[index] = option;
                                                setAnswers(updatedAnswers);
                                            }}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleCompleteAssessment}>Complete Assessment</button>
                </div>
            )}
        </div>
    );
};

export default UserAssessmentsPage;
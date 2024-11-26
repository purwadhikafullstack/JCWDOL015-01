import { fetchUserAssessments, completeAssessment } from "@/services/assessmentService";
import { Assessment, CompleteAssessmentPayload } from "@/types/assessments";
import { useState, useEffect } from "react";

interface UserAssessmentsPageProps {
    userId: number;
}

const UserAssessmentsPage: React.FC<UserAssessmentsPageProps> = ({ userId }) => {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [subscription, setSubscription] = useState<any>(null);
    const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadAssessments = async () => {
            try {
                const { Assessments, Subs } = await fetchUserAssessments(userId);
                setAssessments(Assessments);
                setSubscription(Subs);
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
        };

        try {
            const response = await completeAssessment(userId, payload);
            setResult(response);
            setSelectedAssessment(null);
        } catch (error: any) {
            console.error('Error completing assessment:', error);
            if (error.response?.status === 403) {
                alert('You have reached the maximum number of assessments for your subscription.');
            } else {
                alert('An error occurred while completing the assessment.');
            }
        }
    };

    if (loading) return <p>Loading assessments...</p>;

    const isStandard = subscription?.type === 'STANDARD';
    const remainingAssessments = 2 - (subscription?.completedAssessments || 0);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">User Assessments</h1>

            {isStandard && (
                <p className="mb-4 text-gray-700">
                    You have <strong>{remainingAssessments}</strong> assessments remaining.
                </p>
            )}

            {!selectedAssessment ? (
                <>
                    {/* Only map through assessments if it is an array */}
                    {Array.isArray(assessments) && assessments.length > 0 ? (
                        <ul className="space-y-6">
                            {assessments.map((assessment) => (
                                <li
                                    key={assessment.id}
                                    className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                                >
                                    <h2 className="text-xl font-semibold text-gray-800">{assessment.title}</h2>
                                    <p className="text-gray-600 mb-4">{assessment.description}</p>
                                    <button
                                        onClick={() => {
                                            if (isStandard && remainingAssessments <= 0) {
                                                alert('You have no remaining assessments.');
                                                return;
                                            }
                                            setSelectedAssessment(assessment);
                                        }}
                                        disabled={isStandard && remainingAssessments <= 0}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isStandard && remainingAssessments <= 0 ? 'No Remaining Assessments' : 'Start Assessment'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No assessments available.</p> // Show this if assessments is not an array or is empty
                    )}
                </>
            ) : (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">{selectedAssessment.title}</h2>

                    <ul className="space-y-6">
                        {selectedAssessment.questions.map((question, index) => (
                            <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <p className="text-lg text-gray-800 font-medium mb-4">{question.content}</p>
                                <div className="space-y-2">
                                    {question.options.map((option, idx) => (
                                        <label key={idx} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name={`question-${index}`}
                                                value={option}
                                                onChange={() => {
                                                    const updatedAnswers = [...answers];
                                                    updatedAnswers[index] = option;
                                                    setAnswers(updatedAnswers);
                                                }}
                                                className="text-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleCompleteAssessment}
                        className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                        Complete Assessment
                    </button>
                </div>
            )}

            {result && (
                <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200 shadow-md">
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Assessment Result</h3>
                    <p className="text-lg text-gray-700 mb-1">Score: <span className="font-semibold">{result.score}</span></p>
                    <p className="text-lg font-medium text-gray-800">
                        {result.passed ? '🎉 You Passed!' : '❌ Try Again!'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default UserAssessmentsPage;

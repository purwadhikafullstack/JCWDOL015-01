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
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">User Assessments</h1>

            {!selectedAssessment ? (
                <>
                    {/* Assessment List */}
                    <ul className="space-y-6">
                        {assessments.map((assessment) => (
                            <li
                                key={assessment.id}
                                className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                            >
                                <h2 className="text-xl font-semibold text-gray-800">{assessment.title}</h2>
                                <p className="text-gray-600 mb-4">{assessment.description}</p>
                                <button
                                    onClick={() => setSelectedAssessment(assessment)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    Start Assessment
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Assessment Result */}
                    {result && (
                        <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200 shadow-md">
                            <h3 className="text-2xl font-bold text-green-600 mb-2">Assessment Result</h3>
                            <p className="text-lg text-gray-700 mb-1">Score: <span className="font-semibold">{result.score}</span></p>
                            <p className="text-lg font-medium text-gray-800">
                                {result.passed ? '🎉 You Passed!' : '❌ Try Again!'}
                            </p>
                        </div>
                    )}
                </>
            ) : (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">{selectedAssessment.title}</h2>

                    {/* Questions */}
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

                    {/* Complete Assessment Button */}
                    <button
                        onClick={handleCompleteAssessment}
                        className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                    >
                        Complete Assessment
                    </button>
                </div>
            )}
        </div>

    );
};

export default UserAssessmentsPage;
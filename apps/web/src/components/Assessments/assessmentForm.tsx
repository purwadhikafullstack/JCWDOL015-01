// components/AssessmentQuestions.tsx
import { useState, useEffect } from 'react';
import { completeAssessment, getAssessmentQuestions } from '@/services/assessmentService';

interface Question {
    id: number;
    content: string;
    options: string[];
}

interface AssessmentQuestionsProps {
    assessmentId: number;
}

const AssessmentQuestions: React.FC<AssessmentQuestionsProps> = ({ assessmentId }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getAssessmentQuestions(assessmentId);
                setQuestions(data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [assessmentId]);

    const handleAnswerChange = (questionId: number, answer: string) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answer,
        });
    };

    const handleSubmitAssessment = async () => {
        try {
            const answers = Object.values(selectedAnswers);
            const result = await completeAssessment(assessmentId, answers);
            alert(`Your score is: ${result.score}`);
        } catch (error) {
            alert("Error submitting your answers");
        }
    };

    return (
        <div>
            <h2>Assessment Questions</h2>
            {questions.map((question) => (
                <div key={question.id}>
                    <p>{question.content}</p>
                    {question.options.map((option, idx) => (
                        <label key={idx}>
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option}
                                checked={selectedAnswers[question.id] === option}
                                onChange={() => handleAnswerChange(question.id, option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmitAssessment}>Submit Answers</button>
        </div>
    );
};

export default AssessmentQuestions;

"use client"

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";


// Define interfaces for Test and Question
interface Question {
  _id: string;
  question: string;
  options: string[];
}

interface Test {
  testTitle: string;
  questions: Question[];
}

const TestTakingPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>(); // Typing for route parameter
  const [test, setTest] = useState<Test | null>(null); // Explicitly set test type
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      const response = await fetch(`/api/tests/${testId}`);
      const data: Test = await response.json(); // Specify type here for response
      setTest(data);
    };

    fetchTest();
  }, [testId]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    const response = await fetch(`/api/tests/${testId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "user123", answers }),
    });
    if (response.ok) setSubmitted(true);
  };

  if (!test) return <p>Loading...</p>;
  if (submitted) return <p>Test submitted successfully!</p>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-lg w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">{test.testTitle}</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          {test.questions.map((q, index) => (
            <div key={q._id} className="mb-4 border p-4 rounded-lg shadow">
              <h2 className="font-medium text-lg">Question {index + 1}</h2>
              <p className="mt-1 mb-3">{q.question}</p>
              {q.options.map((option, optionIndex) => (
                <label key={optionIndex} className="block">
                  <input
                    type="radio"
                    name={`question-${q._id}`}
                    value={option}
                    onChange={() => handleAnswerChange(q._id, option)}
                    required
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          ))}
          <button
            type="submit"
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Submit Test
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestTakingPage;

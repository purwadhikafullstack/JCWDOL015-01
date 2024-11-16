"use client"

import { JobWithApplicants } from "@/app/dashboard/job-postings/columns";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";


// Define interfaces for Test and Question
interface Test {
  id: number;
  job_id: number;
  title: string;
  questions: Question[];
}
interface Question {
  id: number;
  question_text: string;
  choices: Choices[];
}

interface Choices {
  id: number;
  choice_text: string;
  is_correct: boolean;
}

const TestTakingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Typing for route parameter
  const { testId } = useParams<{ testId: string }>(); // Typing for route parameter
  const [test, setTest] = useState<Test | null>(null); // Explicitly set test type
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const [job, setJob] = useState<JobWithApplicants | null>(null);
  const [questions, setQuestions] = useState<Question[]>();

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:8000/api/jobs/${id}`);
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Network response was not ok: ${errorMessage}`);
        }
        const data = await response.json();
        setJob(data);

        // Fetch job's tests
        const testResponse = await fetch(`http://localhost:8000/api/jobs/${id}/test`);
        if (!testResponse.ok) {
          const errorMessage = await testResponse.text();
          throw new Error(`Network response was not ok: ${errorMessage}`);
        }
        const testData = await testResponse.json();
        setQuestions(testData.questions);
        setTest(testData);
        
      } catch (error) {
        console.error('Failed to fetch job details:', error);
      }
    };

    fetchJobDetail();
  }, [id]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    const response = await fetch(`http://localhost:8000/api/tests/${test?.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "13", answers }),
    }).then((res) => {
      if (!res.ok) {
        // check if there was JSON
        const contentType = res.headers.get('Content-Type')
        if (contentType && contentType.includes('application/json')) {
          // return a rejected Promise that includes the JSON
          return res.json().then((json) => Promise.reject(json))
        }
        // no JSON, just throw an error
        throw new Error('Something went horribly wrong 💩')
      }

      return res.json();
    })
    .then((data) => {
      setSubmitted(true);
    })
    .catch((error) => {
      console.error('Failed to submit test:', error);
      alert(error.message);
    });    
  };

  if (!test) return <p>Loading...</p>;
  if (submitted) return <div className="card text-center bg-green-200 p-4">Test submitted successfully!</div>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-lg w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">{test.title}</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          {test.questions.map((q, index) => (
            <div key={q.id} className="mb-4 border p-4 rounded-lg shadow">
              <h2 className="font-medium text-lg">Question {index + 1}</h2>
              <p className="mt-1 mb-3">{q.question_text}</p>
              {q.choices.map((option, optionIndex) => (
                <label key={optionIndex} className="block">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option.choice_text}
                    onChange={() => handleAnswerChange(q.id.toString(), option.choice_text)}
                    required
                  />
                  <span className="ml-2">{option.choice_text}</span>
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

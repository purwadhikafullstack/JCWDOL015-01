"use client";

import React, { useEffect, useState } from "react";

interface Job {
  id: string;
  title: string;
}

const CreateTest: React.FC = () => {
  const [testTitle, setTestTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: "" }]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = async () => {
    const response = await fetch("http://localhost:8000/api/jobs/");
    const jobs: Job[] = await response.json();
    return jobs;
  };

  useEffect(() => {
    const loadJobs = async () => {
      const jobList = await fetchJobs();
      setJobs(jobList);
    };

    loadJobs();
  }, []);

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, answer: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answer = answer;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    if (questions.length < 25) {
      setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const allQuestionsFilled = questions.every(
      (q) => q.question && q.options.every((option) => option)
    );

    if (questions.length < 25 || !allQuestionsFilled) {
      alert("Please make sure all 25 questions are filled with four options each.");
      return;
    }

    const testData = { testTitle, questions, jobId: selectedJobId };

    await fetch("/api/tests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log("Test created:", testData);
    setTestTitle("");
    setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);
    setSelectedJobId("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-lg w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Pre-Selection Test</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="testTitle" className="block text-md font-medium">Test Title</label>
            <input
              type="text"
              id="testTitle"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="jobSelect" className="block text-md font-medium">Select Job Posting</label>
            <select
              id="jobSelect"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select a job</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-lg font-semibold pb-2">Questions</h2>
            {questions.map((q, questionIndex) => (
              <div key={questionIndex} className="mb-4 border p-4 rounded-lg shadow">
                <label className="block text-md font-medium">Question {questionIndex + 1}</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter question"
                  required
                />
                <h3 className="mt-2 font-md">Options</h3>
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 mr-2"
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor={`correctAnswer${questionIndex}`} className="block text-md font-medium mt-2">Correct Answer</label>
                  <select
                    id={`correctAnswer${questionIndex}`}
                    value={q.answer}
                    onChange={(e) => handleCorrectAnswerChange(questionIndex, e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="">Select the correct answer</option>
                    {q.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={questions.length >= 25}
            >
              Add Question
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={questions.length < 25 || !questions.every((q) => q.question && q.options.every((option) => option) && q.answer)}
          >
            Submit Test
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTest;

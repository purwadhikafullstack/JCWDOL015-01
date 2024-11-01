// "use client"
// import QuestionInput from '@/components/Questions';
// import { useState } from 'react';


// const TestCreationForm = () => {
//   const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);

//   const handleAddQuestion = () => {
//     setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
//   };

//   const handleSubmit = async () => {
//     // Save the test to the database
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-gray-100 rounded-lg shadow-lg mt-10">
//       <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Create Pre-Selection Test</h1>
//       <p className="text-lg text-gray-600 mb-10 text-center">
//         Add 25 multiple-choice questions related to the job. Each question should have four options with one correct answer.
//       </p>

//       <div className="space-y-8">
//         {questions.map((question, index) => (
//           <QuestionInput
//             key={index}
//             questionIndex={index}
//             question={question}
//             setQuestions={setQuestions}
//             questions={questions}
//           />
//         ))}
//       </div>

//       <div className="flex justify-between items-center mt-10">
//         <button
//           onClick={handleAddQuestion}
//           className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-500 transition-colors duration-200"
//         >
//           Add Another Question
//         </button>
//         <button
//           onClick={handleSubmit}
//           className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-green-500 transition-colors duration-200"
//         >
//           Save Test
//         </button>
//       </div>
//     </div>
//   );
// };

"use client"
import React, { useState } from 'react';

const CreateTest = () => {
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''] }]);

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

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''] }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ testTitle, testDescription, questions });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Create Pre-Selection Test</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="testTitle" className="block text-lg font-medium">Test Title</label>
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
          <label htmlFor="testDescription" className="block text-lg font-medium">Description</label>
          <textarea
            id="testDescription"
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold">Questions</h2>
          {questions.map((q, questionIndex) => (
            <div key={questionIndex} className="mb-4 border p-4 rounded-lg shadow">
              <label className="block text-lg font-medium">Question {questionIndex + 1}</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter question"
                required
              />
              <h3 className="mt-2 font-medium">Options</h3>
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
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Question
          </button>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Submit Test
        </button>
      </form>
    </div>
  );
};

export default CreateTest;

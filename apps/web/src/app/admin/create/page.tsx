'use client';

import { useState } from 'react';

interface Question {
    text: string;
    options: string[];
    correct: string;
}

export default function CreateTest() {
    const [questions, setQuestions] = useState<Question[]>([]);

    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', '', '', ''], correct: '' }]);
    };

    const handleQuestionChange = (index: number, field: keyof Question, value: string, optionIndex?: number) => {
        const updatedQuestions = [...questions];
        if (field === 'text') {
            updatedQuestions[index].text = value;
        } else if (field === 'options' && optionIndex !== undefined) {
            updatedQuestions[index].options[optionIndex] = value; // Update specific option
        }
        setQuestions(updatedQuestions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(questions);
        alert('Test saved successfully!');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Create Pre-Selection Test</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((question, index) => (
                    <div key={index} className="bg-white border border-gray-300 rounded shadow-md p-6">
                        <label className="block mb-2 font-semibold" htmlFor={`question-${index}`}>
                            Question {index + 1}
                        </label>
                        <input
                            type="text"
                            id={`question-${index}`}
                            placeholder="Enter your question here"
                            value={question.text}
                            onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <label className="block mb-2 font-semibold">Options:</label>
                        {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="mb-4">
                                <input
                                    type="text"
                                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                    value={option}
                                    onChange={(e) => handleQuestionChange(index, 'options', e.target.value, optIndex)}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        ))}
                    </div>
                ))}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Add Question
                    </button>
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
                    >
                        Save Test
                    </button>
                </div>
            </form>
        </div>
    );
}

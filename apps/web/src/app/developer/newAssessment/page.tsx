'use client'

import { createAssessment } from '@/services/assessmentService'
import { CreateAssessmentPayload, Question } from '@/types/assessments'
import { useState } from 'react';

export default function CreateNewAssessment() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [difficultyLevel, setDifficultyLevel] = useState('EASY')
  const developerId = 1

  const addQuestion = () => {
    setQuestions([...questions, { content: '', options: [], correctAnswer: '' }])
  }

  const handleQuestionChange = (index: number, key: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    try {
      const assessmentData: CreateAssessmentPayload = {
        title,
        description,
        difficultyLevel,
        questions,
        developerId,
      };

      const response = await createAssessment(assessmentData)
      console.log('Assessment Created:', response)
      alert('Assessment created successfully!');
      setTitle('');
      setDescription('');
      setQuestions([]);
      setDifficultyLevel('EASY');
    } catch (error) {
      console.error('Error creating assessment:', error)
      alert('Failed to create assessment. Please try again.')
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Create New Assessment</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter assessment title"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter assessment description"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Difficulty Level:</label>
          <select
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Questions</h3>
          <button
            type="button"
            onClick={addQuestion}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Add Question
          </button>
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={index}
                className="p-4 border rounded-md shadow-sm bg-gray-50"
              >
                <label className="block text-gray-700 font-medium mb-2">
                  Question Content:
                </label>
                <input
                  type="text"
                  value={question.content}
                  onChange={(e) =>
                    handleQuestionChange(index, 'content', e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  placeholder={`Enter question ${index + 1} content`}
                />

                <label className="block text-gray-700 font-medium mb-2">
                  Options (comma-separated):
                </label>
                <input
                  type="text"
                  value={question.options.join(', ')}
                  onChange={(e) =>
                    handleQuestionChange(
                      index,
                      'options',
                      e.target.value.split(',').map((opt) => opt.trim())
                    )
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  placeholder="Enter options separated by commas"
                />

                <label className="block text-gray-700 font-medium mb-2">
                  Correct Answer:
                </label>
                <input
                  type="text"
                  value={question.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(index, 'correctAnswer', e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the correct answer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Create Assessment
        </button>
      </form>
    </div>
  )
}

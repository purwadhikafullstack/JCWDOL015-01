'use client'

import { createAssessment } from "@/services/assessmentService"
import { Question } from "@/types/assessments"
import { useState } from "react"

export default function CreateNewAssessment() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])

  const addQuestion = () => {
    setQuestions([...questions, { content: '', options: [], correctAnswer: '' }])
  }

  const HandleQuestionChange = (index: number, key: keyof Question, value: any) => {
    const updatedQuestion = [...questions]
    updatedQuestion[index][key] = value
    setQuestions(updatedQuestion)
  }

  const HandleSubmit = async () => {
    try {
      const AssessmentData = {
        title,
        description,
        questions,
        developerId: userId
      }

      const response = await createAssessment(AssessmentData)
      console.log('Assessment Created: ', response)
    } catch (error) {
      console.error('Error creating Assessment: ', error)
    }
  }


  return (
    <div>
      <h1>Create Assessment</h1>
      <form>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <h3>Questions</h3>
          <button type="button" onClick={addQuestion}>
            Add Question
          </button>
          {questions.map((question, index) => (
            <div key={index}>
              <label>Question Content:</label>
              <input
                type="text"
                value={question.content}
                onChange={(e) =>
                  HandleQuestionChange(index, 'content', e.target.value)
                }
              />
              <label>Options (comma-separated):</label>
              <input
                type="text"
                value={question.options.join(', ')}
                onChange={(e) =>
                  HandleQuestionChange(
                    index,
                    'options',
                    e.target.value.split(',').map((opt) => opt.trim())
                  )
                }
              />
              <label>Correct Answer:</label>
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) =>
                  HandleQuestionChange(index, 'correctAnswer', e.target.value)
                }
              />
            </div>
          ))}
        </div>
        <button type="button" onClick={HandleSubmit}>
          Create Assessment
        </button>
      </form>
    </div>
  )
}
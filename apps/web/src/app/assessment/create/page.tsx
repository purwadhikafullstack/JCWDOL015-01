'use client'
import { Question, Assessment } from "@/lib/assessments";
import { useState } from "react";
import { createAssesment, getUserAssessments } from "@/lib/assessments";

export default function CreateAssessments() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficultyLevel, setDifficultyLevel] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState<Question>({ content: '', options: [], correctAnswer: '' })

  const addQuestion = () => {
    setQuestions([...questions, newQuestion])
    setNewQuestion({ content: '', options: [], correctAnswer: '' })
  }

  const handleSubmit = async () => {
    const assessmentData = { title, description, difficultyLevel, questions }
    await createAssesment(assessmentData);
    alert('Assessment created successfully!')
  }

  return (
    <div>
      <h2>Create Assessment</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="Difficulty Level" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)} />
      
      <h3>Add Question</h3>
      <input type="text" placeholder="Question content" value={newQuestion.content} onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })} />
      <textarea placeholder="Options (comma separated)" onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value.split(',') })} />
      <input type="text" placeholder="Correct Answer" onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })} />
      <button onClick={addQuestion}>Add Question</button>

      <button onClick={handleSubmit}>Create Assessment</button>
    </div>
  )
}
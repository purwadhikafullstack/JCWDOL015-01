'use client';

import DashboardLayout from '@/components/DashboardLayout';
import React, { use, useEffect, useState } from 'react';
import { JobWithApplicants } from '../../columns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Test {
  id: number;
  job_id: number;
  title: string;
}
interface Question {
  question_text: string;
  choices: Choices[];
}

interface Choices {
  choice_text: string;
  is_correct: boolean;
}

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [job, setJob] = useState<JobWithApplicants | null>(null);
  const [questions, setQuestions] = useState<Question[]>();
  const [test, setTest] = useState<Test>();

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
        const testResponse = await fetch(
          `http://localhost:8000/api/jobs/${id}/test`,
        );
        if (!testResponse.ok) {
          const errorMessage = await testResponse.text();
          throw new Error(`Network response was not ok: ${errorMessage}`);
        }
        const testData = await testResponse.json();
        if (testData?.questions) {
          setQuestions(testData.questions);
        }
        setTest(testData);
      } catch (error) {
        console.error('Failed to fetch job details:', error);
      }
    };

    fetchJobDetail();
  }, [id]);

  if (!job) return <p>Loading...</p>;

  // Add a new question with 4 blank choices
  const addQuestion = () => {
    setQuestions((prevQuestions) => {
      if (prevQuestions) {
        return [
          ...prevQuestions,
          {
            question_text: '',
            choices: [
              { choice_text: '', is_correct: false },
              { choice_text: '', is_correct: false },
              { choice_text: '', is_correct: false },
              { choice_text: '', is_correct: false },
            ],
          },
        ];
      } else {
        return [
          {
            question_text: '',
            choices: [
              { choice_text: '', is_correct: false },
              { choice_text: '', is_correct: false },
              { choice_text: '', is_correct: false },
              { choice_text: '', is_correct: false },
            ],
          },
        ];
      }
    });
  };

  // Remove a question
  const removeQuestion = (index: number) => {
    if (questions) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  // Update question text
  const handleQuestionChange = (index: number, text: string) => {
    if (questions) {
      const newQuestions = [...questions];
      newQuestions[index].question_text = text;
      setQuestions(newQuestions);
    }
  };

  // Update choice text or correct answer status
  const handleChoiceChange = (
    questionIndex: number,
    choiceIndex: number,
    text: string,
    isCorrect?: boolean,
  ) => {
    if (questions) {
      const newQuestions = [...questions];
      const choice = newQuestions[questionIndex].choices[choiceIndex];

      // Update choice text or toggle is_correct
      if (text !== undefined) choice.choice_text = text;
      //   if (isCorrect !== undefined) choice.is_correct = isCorrect;

      setQuestions(newQuestions);
    }
  };
  const setCorrectChoice = (questionIndex: number, choiceIndex: number) => {
    if (questions) {
      questions[questionIndex].choices.forEach((choice, index) => {
        if (index === choiceIndex) {
          choice.is_correct = true;
        } else {
          choice.is_correct = false;
        }
      });
      setQuestions([...questions]);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission

    // API endpoint URL (replace with your actual API endpoint)
    const apiUrl = `http://localhost:8000/api/tests${test?.id ? `/${test.id}` : ''}`;

    try {
      // Get user login
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // Get token
      const token = localStorage.getItem('tokenAdmin');

      // Create a FormData object
      const response = await fetch(apiUrl, {
        method: test?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questions, job_id: job.id, test_id: test?.id }), // Send the questions array and job.id
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 400) {
            // Handle 400 Bad Request
            response.json().then((errorResponse) => {
              alert(`Error submitting form: ${errorResponse.message}`);
            });
          } else {
            console.error('Error submitting form:', response.statusText);
            alert('Error submitting form. Please try again.');
          }
        })
        .then((data) => {
          console.log('Form submitted successfully:', data);
          alert('Form submitted successfully!');
          window.location.href = `/dashboard/job-postings/${job.id}`;
          return data;
        })
        .catch((error) => {
          console.error('Error submitting form:', error);
          // alert('Error submitting form. Please try again.');
        });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDeleteTest = async () => {
    if (!test?.id) {
      alert('Test ID is required to delete the test.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this test?')) {
      return;
    }

    // Get token
    const token = localStorage.getItem('tokenAdmin');

    try {
      const response = await fetch(
        `http://localhost:8000/api/tests/${test.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        alert('Test successfully deleted.');
        window.location.href = `/dashboard/job-postings/${job.id}`;
      } else {
        console.error('Failed to delete test:', response.statusText);
        alert('Failed to delete test. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Error deleting test. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          Manage Test for Job: {job.title}
        </h1>

        <h2 className="text-lg font-semibold">Multiple Choice Questions</h2>
        <Button onClick={addQuestion}>Add Question</Button>
        {test?.id && (
          <Button onClick={handleDeleteTest} variant="destructive">
            Delete Test
          </Button>
        )}

        {questions &&
          questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="mt-4">
              <CardContent>
                <div>
                  <div className="flex items-center">
                    <span className="mr-2">{questionIndex + 1}.</span>
                    <Input
                      placeholder="Enter question text"
                      value={question.question_text}
                      onChange={(e) =>
                        handleQuestionChange(questionIndex, e.target.value)
                      }
                    />
                  </div>
                  <Button
                    onClick={() => removeQuestion(questionIndex)}
                    className="ml-2"
                    variant="destructive"
                  >
                    Remove Question
                  </Button>
                </div>

                <div className="mt-4">
                  {question.choices.map((choice, choiceIndex) => (
                    <div key={choiceIndex} className="flex items-center mt-2">
                      <input
                        type="radio"
                        name={`correctChoice${questionIndex}`} // Group radio buttons by question
                        checked={choice.is_correct}
                        onChange={() =>
                          setCorrectChoice(questionIndex, choiceIndex)
                        }
                        className="mr-2"
                      />
                      <Input
                        placeholder={`Option ${choiceIndex + 1}`}
                        value={choice.choice_text}
                        onChange={(e) =>
                          handleChoiceChange(
                            questionIndex,
                            choiceIndex,
                            e.target.value,
                          )
                        }
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

        {questions && (
          <Button type="submit" className="mt-4" onClick={handleSubmit}>
            Submit Questions
          </Button>
        )}

        <Button
          className="mt-4"
          variant="outline"
          onClick={() =>
            (window.location.href = `/dashboard/job-postings/${job.id}`)
          }
        >
          Cancel
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default page;

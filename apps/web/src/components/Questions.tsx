// components/QuestionInput.tsx
import { Dispatch, SetStateAction } from 'react';

interface QuestionInputProps {
  questionIndex: number;
  question: { question: string; options: string[]; answer: string };
  setQuestions: Dispatch<SetStateAction<any[]>>;
  questions: any[];
}

const QuestionInput = ({ questionIndex, question, setQuestions, questions }: QuestionInputProps) => {
  const handleChange = (field: string, value: string, optionIndex?: number) => {
    const updatedQuestions = [...questions];
    
    if (field === 'question') {
      updatedQuestions[questionIndex].question = value;
    } else if (field === 'options' && optionIndex !== undefined) {
      updatedQuestions[questionIndex].options[optionIndex] = value;
    } else if (field === 'answer') {
      updatedQuestions[questionIndex].answer = value;
    }
    
    setQuestions(updatedQuestions);
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <label className="block text-lg font-semibold text-gray-800 mb-4">
        Question {questionIndex + 1}
      </label>
      <input
        type="text"
        value={question.question}
        onChange={(e) => handleChange('question', e.target.value)}
        placeholder="Enter your question here"
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      />

      <div className="space-y-3">
        {question.options.map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center space-x-3">
            <input
              type="radio"
              name={`answer${questionIndex}`}
              onChange={() => handleChange('answer', option)}
              checked={question.answer === option}
              className="text-blue-600 focus:ring-blue-500"
            />
            <input
              type="text"
              value={option}
              onChange={(e) => handleChange('options', e.target.value, optionIndex)}
              placeholder={`Option ${optionIndex + 1}`}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionInput;

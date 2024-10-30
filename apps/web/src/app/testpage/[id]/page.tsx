// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// interface Question {
//     text: string;
//     options: string[];
// }

// export default function TestPage(){
//     const router = useRouter();
//     const { id } = router.query; // Fetch test ID from URL
//     const [questions, setQuestions] = useState<Question[]>([]);

//     useEffect(() => {
//         if (id) {
//             // Fetch test questions based on the ID
//             // This is a placeholder for fetching data, replace with your actual API call
//             const fetchedQuestions: Question[] = [
//                 { text: 'What is X?', options: ['A', 'B', 'C', 'D'] },
//                 { text: 'What is Y?', options: ['A', 'B', 'C', 'D'] },
//             ];
//             setQuestions(fetchedQuestions);
//         }
//     }, [id]);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         const responses: Record<string, string | undefined> = {};

//         questions.forEach((question, index) => {
//             const selectedOption = e.currentTarget[`question-${index}`]?.value;
//             responses[question.text] = selectedOption;
//         });

//         console.log(responses);
//         // Handle sending responses to your backend API
//         alert('Test submitted successfully!');
//     };

//     return (
//         <div className="container flex flex-col min-h-screen p-4 mx-auto mt-8">
//             <h1 className="text-2xl font-bold mb-4">Pre Selection Test</h1>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 {questions.map((question, index) => (
//                     <div key={index} className="border border-gray-300 rounded p-4">
//                         <p className="font-semibold">{question.text}</p>
//                         {question.options.map((option, optIndex) => (
//                             <label key={optIndex} className="block">
//                                 <input type="radio" name={`question-${index}`} value={option} />
//                                 {option}
//                             </label>
//                         ))}
//                     </div>
//                 ))}
//                 <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
//                     Submit Test
//                 </button>
//             </form>
//         </div>
//     );
// };


// import { Request, Response } from 'express';
// import { Fields, Files, IncomingForm } from 'formidable';
// import prisma from '@/prisma';
// import path from 'path';
// import fs from 'fs';

import prisma from "@/prisma";



// interface CustomFile {
//     filepath?: string; // Ensure filepath is optional
//     newFilename?: string; // You might need this if you are renaming the file
// }

// export const createPreSelectionTest = async (req: Request, res: Response) => {
//     const uploadDir = path.resolve(__dirname, '../../../web/public');

//     const form = new IncomingForm({
//         uploadDir: uploadDir,
//         keepExtensions: true,
//         multiples: false,
//     });

//     form.parse(req, async (err: any, fields: Fields, files: Files) => {
//         if (err) {
//             return res.status(400).json({ message: 'Error parsing the form', error: err.message });
//         }

//         if (!files.test_file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         const fileArray = files.test_file as unknown as CustomFile[];
//         const file = fileArray && fileArray.length > 0 ? fileArray[0] : undefined;
//         if (!file) {
//             return res.status(400).json({ message: 'File upload failed or file is missing' });
//         }

//         // Ensure that filepath is defined
//         const filePath = file.filepath; // It's possible for this to be undefined
//         if (!filePath) {
//             return res.status(500).json({ message: 'File path is missing or undefined' });
//         }

//         const fullFilePath = path.join(uploadDir, path.basename(filePath));
//         fs.rename(filePath, fullFilePath, async (err) => { // Use filePath directly, as it's guaranteed to be defined now
//             if (err) {
//                 return res.status(500).json({ msg: 'Error saving the file', error: err.message });
//             }

//             const testTitle = Array.isArray(fields.test_title) ? fields.test_title[0] : fields.test_title;
//             const jobId = Array.isArray(fields.job_id) ? fields.job_id[0] : fields.job_id;

//             if (!testTitle || !jobId) {
//                 return res.status(400).json({ message: 'Test title and job ID are required' });
//             }

//             const createdBy = req.user?.id; // Get user ID from request

//             if (!createdBy) {
//                 return res.status(403).json({ message: 'User not authenticated' });
//             }

//             // Convert jobId and createdBy to numbers
//             const parsedJobId = parseInt(jobId, 10);
//             const parsedCreatedBy = parseInt(createdBy, 10);

//             // Check if parsed values are valid numbers
//             if (isNaN(parsedJobId) || isNaN(parsedCreatedBy)) {
//                 return res.status(400).json({ message: 'Invalid job ID or created by ID format. Both must be numbers.' });
//             }

//             const createdTest = await prisma.test.create({
//                 data: {
//                     job_id: parsedJobId,
//                     created_by: parsedCreatedBy,
//                     title: testTitle as string,
//                     test_file: file.newFilename, // Assuming you have this defined
//                     created_at: new Date(),
//                 },
//             });

//             if (!createdTest) {
//                 return res.status(500).json({ msg: 'Error saving the pre-selection test' });
//             }

//             res.status(201).send({
//                 status: 'ok',
//                 msg: 'Pre-selection test created successfully!',
//                 test: createdTest,
//             });
//         });
//     });
// };


// import prisma from '@/prisma';

// export const createPreSelectionTest = async (data: any) => {
//     const { questions, ...testData } = data;
  
//     return await prisma.test.create({
//         data: {
//             ...testData,
//             questions: {
//                 create: questions.map((question: any) => ({
//                     question_text: question.question_text,
//                     choices: {
//                         create: question.choices.map((choice: any) => ({
//                             choice_text: choice.choice_text,
//                             is_correct: choice.is_correct,
//                         })),
//                     },
//                 })),
//             },
//         },
//     });
// };


// export const updatePreSelectionTest = async (testId: number, updateData: any) => {
//     return await prisma.test.update({
//         where: { id: testId },
//         data: {
//             ...updateData,
//             updated_at: new Date(),
//         },
//     });
// };

// export const linkTestToJobApplication = async (jobId: number, testId: number) => {
//     return await prisma.job.update({
//         where: { id: jobId },
//         data: {
//             test: { connect: { id: testId } },
//         },
//     });
// };

// export const submitPreSelectionTest = async (applicantId: number, testId: number, score: number) => {
//     return await prisma.result.create({
//         data: {
//             applicant_id: applicantId,
//             test_id: testId,
//             score,
//             completed_at: new Date(),
//         },
//     });
// };

// export const getTestResults = async (testId: number) => {
//     return await prisma.result.findMany({
//         where: { test_id: testId },
//         include: { applicant: true },
//     });
// };

// export const getTestsByJobId = async (jobId: number) => {
//     return await prisma.test.findMany({
//         where: { job_id: jobId },
//     });
// };

// // New function to get a specific test by ID
// export const getTestById = async (testId: number) => {
//     return await prisma.test.findUnique({
//         where: { id: testId },
//         include: {
//             questions: {
//                 include: { choices: true }, // Include choices for each question
//             },
//         },
//     });
// };


// // CREATE TEST WITH QUESTION AND CHOICE
// export async function createTestWithQuestions(data: any) {
//   const { test, questions } = data;

//   try {
//     return await prisma.$transaction(async (tx) => {
//       // Create the test without passing 'id' since it's auto-generated
//       const createdTest = await tx.test.create({
//         data: {
//           job_id: test.job_id,
//           created_by: test.created_by,
//           title: test.title,
//           // Do not include 'id', 'created_at', or 'updated_at'
//           // as those are handled by MySQL
//         },
//       });

//       // Create questions and their associated choices
//       for (const question of questions) {
//         const createdQuestion = await tx.question.create({
//           data: {
//             test_id: createdTest.id,  // Automatically associates the question with the test
//             question_text: question.question_text, // Text of the question
//           },
//         });
      
//         // Create choices for the question
//         for (const choice of question.choices) {
//           await tx.choice.create({
//             data: {
//               question_id: createdQuestion.id,  // Associates the choice with the created question
//               choice_text: choice.choice_text, // Text for the choice
//               is_correct: choice.is_correct,   // Whether this choice is correct
//             },
//           });
//         }
//       }
      

//       // Return the created test with its ID
//       return createdTest;
//     });
//   } catch (error) {
//     console.error("Error creating test with questions:", error);
//     throw new Error("Failed to create test");
//   }
// }




// Service to create a pre-selection test with associated questions and choices
export const createPreSelectionTest = async (data: any) => {
    const { questions, job_id } = data;

    // get job data
    const job = await prisma.job.findUnique({ where: { id: job_id } });
    
    const testData = { job_id, created_by: 1, title: `Pre-selection Test for ${job?.title}`, created_at: new Date() };

    // return false;
    return await prisma.test.create({
        data: {
            ...testData,
            questions: {
                create: questions.map((question: any) => ({
                    question_text: question.question_text,
                    choices: {
                        create: question.choices.map((choice: any) => ({
                            choice_text: choice.choice_text,
                            is_correct: choice.is_correct,
                        })),
                    },
                })),
            },
        },
    });
};

// Service to update an existing pre-selection test by testId
export const updatePreSelectionTest = async (testId: number, updateData: any) => {
    console.log(testId);
    return await prisma.test.update({
        where: { id: testId },
        data: {
            questions: {
                update: updateData.questions.map((question: any) => ({
                    where: { id: question.id },
                    data: {
                        question_text: question.question_text,
                        choices: {
                            update: question.choices.map((choice: any) => ({
                                where: { id: choice.id },
                                data: {
                                    choice_text: choice.choice_text,
                                    is_correct: choice.is_correct,
                                },
                            })),
                        },
                    },
                })),
            },
            updated_at: new Date(), // Updating the `updated_at` timestamp
        },
    });
};

// Service to link a test to a job application by jobId and testId
export const linkTestToJobApplication = async (jobId: number, testId: number) => {
    return await prisma.job.update({
        where: { id: jobId },
        data: {
            test: { connect: { id: testId } },
        },
    });
};

// Service to submit the result of a pre-selection test
export const submitPreSelectionTest = async (requestBody: any, testId: string, applicantId: number) => {

    const test = await prisma.test.findUnique({
        where: { id: Number(testId) },
        include: {
            questions: {
                include: { choices: true }, // Include choices for each question
            },
        },
    });
    
    // reformat the test to be an answer sheet
    const answerSheet = test?.questions.reduce((acc, question) => {
        const correctChoice = question.choices.find((choice) => choice.is_correct);
        acc[question.id] = correctChoice ? correctChoice.choice_text : {};
        return acc;
    }, {} as Record<number, string | {}>);

    let correctCount = 0;
    let incorrectCount = 0;
    if (answerSheet) {
        Object.keys(answerSheet).forEach((questionId: string) => {
            if (answerSheet[Number(questionId)] === requestBody.answers[Number(questionId)]) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        });
    }
    
    if (answerSheet) {
        const totalQuestions = Object.keys(answerSheet).length;
        const score = (correctCount / totalQuestions) * 100;
        console.log(`Correct answers: ${correctCount}, Incorrect answers: ${incorrectCount}, Score: ${score}%`);

        return await prisma.result.create({
            data: {
                test_id: Number(testId),
                applicant_id: applicantId,
                score,
                passed: score >= 50,
                completed_at: new Date(), // Adding the date when the test was completed
            },
        });
    } else {
        throw new Error('Answer sheet not found');
    }
    
    //         applicant_id: applicantId,
    //         test_id: testId,
    //         score,
    //         completed_at: new Date(), // Adding the date when the test was completed
    //     },
    // });
};

// Service to get all test results for a specific test by testId
export const getTestResults = async (testId: number) => {
    return await prisma.result.findMany({
        where: { test_id: testId },
        include: { applicant: true }, // Include applicant details in the results
    });
};

// Service to get all tests associated with a specific job by jobId
export const getTestsByJobId = async (jobId: number) => {
    return await prisma.test.findFirst({
        where: { job_id: jobId },
        include: { questions: { include: { choices: true } } },
    });
};

// Service to get a specific test by its testId, including questions and choices
export const getTestById = async (testId: number) => {
    return await prisma.test.findUnique({
        where: { id: testId },
        include: {
            questions: {
                include: { choices: true }, // Include choices for each question
            },
        },
    });
};

// get Job by testId
export const getJobByTestId = async (testId: number) => {
    return await prisma.test.findUnique({
        where: { id: testId },
        include: { job: true },
    });
};
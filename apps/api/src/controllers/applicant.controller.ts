// import { Request, Response } from 'express';
// import { getApplicantsByJobPosting, acceptApplicant, rejectApplicant, getApplicantTestResults } from '@/services/applicant.service';

// export class ApplicantController {
//   // Fetch applicants by job posting ID
//   public async getApplicantsByJobPosting(req: Request, res: Response): Promise<Response> {
//     const { jobId } = req.params;
//     try {
//       const applicants = await getApplicantsByJobPosting(Number(jobId));
//       return res.json(applicants);
//     } catch (error: any) { // Specify 'any' or a more specific type if desired
//       console.error('Error fetching applicants:', error);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//   }

//   // Accept an applicant
//   public async acceptApplicant(req: Request, res: Response): Promise<Response> {
//     const { id } = req.params; // applicantId
//     const { jobId } = req.body; // Expecting jobId to be passed in the request body
//     try {
//       const result = await acceptApplicant(Number(id), Number(jobId));
//       return res.status(200).json(result);
//     } catch (error: any) {
//       console.error('Error accepting applicant:', error);
//       return res.status(404).json({ message: error.message }); // Returning 404 for not found
//     }
//   }

//   // Reject an applicant
//   public async rejectApplicant(req: Request, res: Response): Promise<Response> {
//     const { id } = req.params; // applicantId
//     const { jobId } = req.body; // Expecting jobId to be passed in the request body
//     try {
//       const result = await rejectApplicant(Number(id), Number(jobId));
//       return res.status(200).json(result);
//     } catch (error: any) {
//       console.error('Error rejecting applicant:', error);
//       return res.status(404).json({ message: error.message }); // Returning 404 for not found
//     }
//   }

//   // Fetch applicant test results
//   public async fetchApplicantTestResults(req: Request, res: Response): Promise<Response> {
//     try {
//       const results = await getApplicantTestResults();
//       return res.status(200).json(results);
//     } catch (error: any) {
//       console.error('Failed to fetch applicant test results:', error);
//       return res.status(500).json({ message: 'Failed to fetch applicant test results' });
//     }
//   }
// }

import { Request, Response } from 'express';
import { 
  getAllApplicants, 
  getApplicantsByJobPosting, 
  getApplicantById, 
  acceptApplicant, 
  rejectApplicant, 
  inProcessApplicant,
  interviewApplicant,
  getApplicantTestResults 
} from '@/services/applicant.service';

export async function getAllApplicantsController(req: Request, res: Response): Promise<void> {
  try {
    const applicants = await getAllApplicants({...req.query});
    res.status(200).json(applicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Error fetching applicants" });
  }
}

export async function getApplicantsByJobPostingController(req: Request, res: Response): Promise<void> {
  const { jobId } = req.params;
  const { name, age, salary, education } = req.query; // query params for filtering

  try {
    const applicants = await getApplicantsByJobPosting(
      parseInt(jobId, 10),
      { name, age, salary, education }
    );
    res.status(200).json(applicants);
  } catch (error) {
    console.error("Error fetching applicants for job posting:", error);
    res.status(500).json({ message: "Error fetching applicants for job posting" });
  }
}

export async function getApplicantByIdController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const applicant = await getApplicantById(parseInt(id, 10));
    if (!applicant) {
      res.status(404).json({ message: "Applicant not found" });
    } else {
      res.status(200).json(applicant);
    }
  } catch (error) {
    console.error("Error fetching applicant:", error);
    res.status(500).json({ message: "Error fetching applicant" });
  }
}

export async function acceptApplicantController(req: Request, res: Response): Promise<void> {
  const { id, jobId } = req.params;  // Extract applicantId and jobId from URL params

  try {
    await acceptApplicant(parseInt(id, 10), parseInt(jobId, 10));  // Pass both params
    res.status(200).json({ message: "Applicant accepted" });
  } catch (error) {
    console.error("Error accepting applicant:", error);
    res.status(500).json({ message: "Error accepting applicant" });
  }
}

export async function rejectApplicantController(req: Request, res: Response): Promise<void> {
  const { id, jobId } = req.params;  // Extract applicantId and jobId from URL params

  try {
    await rejectApplicant(parseInt(id, 10), parseInt(jobId, 10));  // Pass both params
    res.status(200).json({ message: "Applicant rejected" });
  } catch (error) {
    console.error("Error rejecting applicant:", error);
    res.status(500).json({ message: "Error rejecting applicant" });
  }
}

export async function inProcessApplicantController(req: Request, res: Response): Promise<void> {
  const { id, jobId } = req.params;  // Extract applicantId and jobId from URL params

  try {
    await inProcessApplicant(parseInt(id, 10), parseInt(jobId, 10));  // Pass both params
    res.status(200).json({ message: "Applicant inProcessed" });
  } catch (error) {
    console.error("Error inProcessing applicant:", error);
    res.status(500).json({ message: "Error inProcessing applicant" });
  }
}

export async function interviewApplicantController(req: Request, res: Response): Promise<void> {
  const { id, jobId } = req.params;  // Extract applicantId and jobId from URL params

  try {
    await interviewApplicant(parseInt(id, 10), parseInt(jobId, 10));  // Pass both params
    res.status(200).json({ message: "Applicant interviewed" });
  } catch (error) {
    console.error("Error interviewing applicant:", error);
    res.status(500).json({ message: "Error interviewing applicant" });
  }
}

export async function fetchApplicantTestResultsController(req: Request, res: Response): Promise<void> {
  try {
    const testResults = await getApplicantTestResults();
    res.status(200).json(testResults);
  } catch (error) {
    console.error("Error fetching applicant test results:", error);
    res.status(500).json({ message: "Error fetching applicant test results" });
  }
}

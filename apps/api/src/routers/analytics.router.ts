import express from "express";
import {
  getIncomingInterviewController,
  getJobInterestController,
  getSalaryTrendsController,
  getTotalAcceptedController,
  getTotalApplicantController,
  getTotalJobController,
  getTotalRejectedController,
  getUserAgeController,
  getUserGenderController,
  getUserLocationController,
} from "../controllers/analytics.controller";

const router = express.Router();

router.get("/age-distribution", getUserAgeController);
router.get("/gender-distribution", getUserGenderController);
router.get("/location-distribution", getUserLocationController);
router.get("/salary-trends", getSalaryTrendsController);
router.get("/job-interests", getJobInterestController);
router.get("/total-applicants", getTotalApplicantController);
router.get("/total-accepted-applicants", getTotalAcceptedController);
router.get("/total-rejected-applicants", getTotalRejectedController);
router.get("/total-job-posting", getTotalJobController);
router.get('/incoming-interviews', getIncomingInterviewController);

export default router;

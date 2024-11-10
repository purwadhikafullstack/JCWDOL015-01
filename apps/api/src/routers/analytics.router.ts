import express from "express";
import {
  getUserDemographicsController,
  getSalaryTrendsController,
  getApplicantInterestsController,
  addUserInterestController,
} from "../controllers/analytics.controller";

const router = express.Router();

router.get("/demographics", getUserDemographicsController);
router.get("/salary-trends", getSalaryTrendsController);
router.get("/applicant-interests", getApplicantInterestsController);
router.post("/user/:userId/interest", addUserInterestController);

export default router;

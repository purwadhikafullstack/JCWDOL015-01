import express from "express";
import {
  getJobInterestController,
  getSalaryTrendsController,
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
// router.post("/user/:userId/interest", addUserInterestController);

export default router;

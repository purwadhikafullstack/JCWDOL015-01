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

export class AnalyticsRouter {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/age-distribution", getUserAgeController);
    this.router.get("/gender-distribution", getUserGenderController);
    this.router.get("/location-distribution", getUserLocationController);
    this.router.get("/salary-trends", getSalaryTrendsController);
    this.router.get("/job-interests", getJobInterestController);
    this.router.get("/total-applicants", getTotalApplicantController);
    this.router.get("/total-accepted-applicants", getTotalAcceptedController);
    this.router.get("/total-rejected-applicants", getTotalRejectedController);
    this.router.get("/total-job-posting", getTotalJobController);
    this.router.get('/incoming-interviews', getIncomingInterviewController);
  }

  getRouter(): express.Router {
    return this.router;
  }
}

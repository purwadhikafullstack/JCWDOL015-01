import { Request, Response } from "express";
import { getIncomingInterviewSchedule, getJobInterest, getSalaryTrends, getTotalAcceptedApplicant, getTotalApplicant, getTotalJob, getTotalRejectedApplicant, getUserAgeDistribution, getUserGenderDistribution, getUserLocationDistribution } from "../services/analytics.service";

export async function getUserAgeController(req: Request, res: Response) {
  try {
    const ageDistribution = await getUserAgeDistribution();
    const formatedLabels = Object.keys(ageDistribution).map(key => `${key}-${Number(key) + 9}`);
    const labels = formatedLabels;
    const series = Object.values(ageDistribution);
    res.status(200).json({ labels, series });
  } catch (error) {
    console.error("Error fetching user age distribution:", error);
    res.status(500).json({ message: "Error fetching user age distribution" });
  }
}

export async function getUserGenderController(req: Request, res: Response) {
  try {
    const genderDistribution = await getUserGenderDistribution();
    const labels = Object.keys(genderDistribution).map(key => (key==="0" ? "Female" : "Male"));
    const series = genderDistribution.map(item => item._count._all);
    res.status(200).json({ labels, series });
  } catch (error) {
    console.error("Error fetching user age distribution:", error);
    res.status(500).json({ message: "Error fetching user age distribution" });
  }
}

export async function getUserLocationController(req: Request, res: Response) {
  try {
    const locationDistribution = await getUserLocationDistribution();
    const labels = Object.keys(locationDistribution);
    const series = Object.values(locationDistribution);
    res.status(200).json({ labels, series });
  } catch (error) {
    console.error("Error fetching user age distribution:", error);
    res.status(500).json({ message: "Error fetching user age distribution" });
  }
}

export async function getSalaryTrendsController(req: Request, res: Response) {
  try {
    const salaryTrends = await getSalaryTrends();
    const labels = salaryTrends.map(item => item.expected_salary);
    const series = salaryTrends.map(item => item._count._all);
    res.status(200).json({ labels, series });
  } catch (error) {
    console.error("Error fetching salary trends:", error);
    res.status(500).json({ message: "Error fetching salary trends" });
  }
}

export async function getJobInterestController(req: Request, res: Response) {
  try {
    const jobInterest = await getJobInterest();
    const labels = Object.values(jobInterest).map(item => item.category);
    const series = Object.values(jobInterest).map(item => item.count);
    res.status(200).json({ labels, series });
  } catch (error) {
    console.error("Error fetching salary trends:", error);
    res.status(500).json({ message: "Error fetching salary trends" });
  }
}

export async function getTotalApplicantController(req: Request, res: Response) {
  try {
    const totalApplicants = await getTotalApplicant();
    res.status(200).json({ totalApplicants });
  } catch (error) {
    console.error("Error fetching total applicants:", error);
    res.status(500).json({ message: "Error fetching total applicants" });
  }
}

export async function getTotalAcceptedController(req: Request, res: Response) {
  try {
    const totalApplicants = await getTotalAcceptedApplicant();
    res.status(200).json({ totalApplicants });
  } catch (error) {
    console.error("Error fetching total applicants:", error);
    res.status(500).json({ message: "Error fetching total applicants" });
  }
}

export async function getTotalRejectedController(req: Request, res: Response) {
  try {
    const totalApplicants = await getTotalRejectedApplicant();
    res.status(200).json({ totalApplicants });
  } catch (error) {
    console.error("Error fetching total applicants:", error);
    res.status(500).json({ message: "Error fetching total applicants" });
  }
}

export async function getTotalJobController(req: Request, res: Response) {
  try {
    const totalJobs = await getTotalJob();
    res.status(200).json({ totalJobs });
  } catch (error) {
    console.error("Error fetching total applicants:", error);
    res.status(500).json({ message: "Error fetching total applicants" });
  }
}

export async function getIncomingInterviewController(req: Request, res: Response) {
  try {
    const interviews = await getIncomingInterviewSchedule();
    res.status(200).json({ interviews });
  } catch (error) {
    console.error("Error fetching incomming interviews:", error);
    res.status(500).json({ message: "Error fetching incomming interviews" });
  }
}
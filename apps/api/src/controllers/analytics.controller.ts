import { Request, Response } from "express";
import { getUserDemographics, getSalaryTrends, getApplicantInterests, addUserInterest } from "../services/analytics.service";

export async function getUserDemographicsController(req: Request, res: Response) {
  try {
    const demographics = await getUserDemographics();
    res.status(200).json(demographics);
  } catch (error) {
    console.error("Error fetching user demographics:", error);
    res.status(500).json({ message: "Error fetching user demographics" });
  }
}

export async function getSalaryTrendsController(req: Request, res: Response) {
  try {
    const salaryTrends = await getSalaryTrends();
    res.status(200).json(salaryTrends);
  } catch (error) {
    console.error("Error fetching salary trends:", error);
    res.status(500).json({ message: "Error fetching salary trends" });
  }
}

export async function getApplicantInterestsController(req: Request, res: Response) {
  try {
    const interests = await getApplicantInterests();
    res.status(200).json(interests);
  } catch (error) {
    console.error("Error fetching applicant interests:", error);
    res.status(500).json({ message: "Error fetching applicant interests" });
  }
}

export async function addUserInterestController(req: Request, res: Response) {
  const userId = req.params.userId;
  const { interest } = req.body;

  if (!interest) {
    return res.status(400).json({ message: "Interest is required" });
  }

  try {
    await addUserInterest(Number(userId), interest);
    res.status(200).json({ message: "User interest added successfully" });
  } catch (error) {
    console.error("Error adding user interest:", error);
    res.status(500).json({ message: "Error adding user interest" });
  }
}

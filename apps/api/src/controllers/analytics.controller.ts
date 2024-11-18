import { Request, Response } from "express";
import { getJobInterest, getSalaryTrends, getUserAgeDistribution, getUserGenderDistribution, getUserLocationDistribution } from "../services/analytics.service";

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
    const labels = Object.keys(salaryTrends);
    const series = Object.values(salaryTrends);
    res.status(200).json({ labels, series });
  } catch (error) {
    console.error("Error fetching salary trends:", error);
    res.status(500).json({ message: "Error fetching salary trends" });
  }
}

export async function getJobInterestController(req: Request, res: Response) {
  try {
    const jobInterest = await getJobInterest();
    const labels = Object.keys(jobInterest);
    const series = Object.values(jobInterest);
    res.status(200).json({ labels, series });
  } catch (error) {
    console.error("Error fetching salary trends:", error);
    res.status(500).json({ message: "Error fetching salary trends" });
  }
}

// export async function addUserInterestController(req: Request, res: Response) {
//   const userId = req.params.userId;
//   const { interest } = req.body;

//   if (!interest) {
//     return res.status(400).json({ message: "Interest is required" });
//   }

//   try {
//     await addUserInterest(Number(userId), interest);
//     res.status(200).json({ message: "User interest added successfully" });
//   } catch (error) {
//     console.error("Error adding user interest:", error);
//     res.status(500).json({ message: "Error adding user interest" });
//   }
// }

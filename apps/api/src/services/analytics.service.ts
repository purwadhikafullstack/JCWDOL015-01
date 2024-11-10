import prisma from "@/prisma";

// Fetch user demographics, e.g., age, gender, location
export async function getUserDemographics() {
  try {
    const demographics = await prisma.analytics.groupBy({
      by: ["age", "gender", "location"],
      _count: { _all: true },
    });
    return demographics;
  } catch (error) {
    console.error("Error fetching user demographics:", error);
    throw new Error("Error fetching user demographics");
  }
}

// Fetch salary trends, e.g., average salary per location or job type
export async function getSalaryTrends() {
  try {
    const salaryTrends = await prisma.analytics.groupBy({
      by: ["location"],
      _avg: { salary: true },
    });
    return salaryTrends;
  } catch (error) {
    console.error("Error fetching salary trends:", error);
    throw new Error("Error fetching salary trends");
  }
}

// Fetch popular applicant interests
export async function getApplicantInterests() {
  try {
    const interestsData = await prisma.analytics.findMany({
      select: { interests: true },
    });

    const interestCounts: Record<string, number> = {};

    interestsData.forEach((record) => {
      record.interests.forEach((interest: string) => {
        interestCounts[interest] = (interestCounts[interest] || 0) + 1;
      });
    });

    const sortedInterests = Object.entries(interestCounts)
      .map(([interest, count]) => ({ interest, count }))
      .sort((a, b) => b.count - a.count);

    return sortedInterests;
  } catch (error) {
    console.error("Error fetching applicant interests:", error);
    throw new Error("Error fetching applicant interests");
  }
}

// Add a new interest to a user’s analytics record
export async function addUserInterest(userId: number, newInterest: string) {
  try {
    const userAnalytics = await prisma.analytics.findUnique({
      where: { user_id: userId },
    });

    if (userAnalytics) {
      const updatedInterests = [...new Set([...userAnalytics.interests, newInterest])];
      await prisma.analytics.update({
        where: { user_id: userId },
        data: { interests: updatedInterests },
      });
    } else {
      // Create a new analytics entry if none exists for the user
      await prisma.analytics.create({
        data: { user_id: userId, interests: [newInterest], age: userAnalytics?.age || null }, // Include age if required
      });
    }
  } catch (error) {
    console.error("Error adding user interest:", error);
    throw new Error("Error adding user interest");
  }
}

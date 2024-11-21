import prisma from "@/prisma";

// Fetch user age distribution
export async function getUserAgeDistribution() {
  try {
    const userAgeData = await prisma.user.findMany({
      select: { birthDate: true },
    });

    const ageDistribution: Record<string, number> = {};

    userAgeData.forEach((user) => {
      // calculate age
      if(user.birthDate === null) return
      const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear();
      const decade = Math.floor(age / 10) * 10;
      if (ageDistribution[decade.toString()]) {
        ageDistribution[decade.toString()] += 1;
      } else {
        ageDistribution[decade.toString()] = 1;
      }
    });

    return ageDistribution;
  } catch (error) {
    console.error("Error fetching user age distribution:", error);
    throw new Error("Error fetching user age distribution");
  }
}

// fetch user gender distribution
export async function getUserGenderDistribution() {
  try {
    const genderDistribution = await prisma.user.groupBy({
      by: ["gender"],
      _count: { _all: true },
    });
    return genderDistribution;
  } catch (error) {
    console.error("Error fetching user gender distribution:", error);
    throw new Error("Error fetching user gender distribution");
  }
}

// fetch user location distribution
export async function getUserLocationDistribution() {
  try {
    const locationDistribution = await prisma.user.findMany({
      select: { address: true },
    }).then((users) => {
      const locationCounts: Record<string, number> = {};
      users.forEach((user) => {
        // get city from address
        const location = user.address;
        if(location === null) return
        if (locationCounts[location]) {
          locationCounts[location] += 1;
        } else {
          locationCounts[location] = 1;
        }
      });
      return locationCounts;
    })
    return locationDistribution;
  } catch (error) {
    console.error("Error fetching user location distribution:", error);
    throw new Error("Error fetching user location distribution");
  }
}

// Fetch salary trends, e.g., average salary per location or job type
export async function getSalaryTrends() {
  try {
    const salaryTrends = await prisma.applicant.groupBy({
      by: ["expected_salary"],
      _count: { _all: true },
    });
    return salaryTrends;
  } catch (error) {
    console.error("Error fetching salary trends:", error);
    throw new Error("Error fetching salary trends");
  }
}

// Fetch popular job interests by category
export async function getJobInterest() {
  try {
    const applicantData = await prisma.applicant.findMany({
      include: {
        job: true
      }
    });

    const categoryDistribution: Record<string, number> = {};

    for (const applicant of applicantData) {
      const job = applicant.job;
      if (job) {
        const category = job.category;
        if (categoryDistribution[category]) {
          categoryDistribution[category] += 1;
        } else {
          categoryDistribution[category] = 1;
        }
      }
    }

    const sortedJobInterests = Object.entries(categoryDistribution)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({ category, count }));

    return sortedJobInterests;
  } catch (error) {
    console.error("Error fetching job interests:", error);
    throw new Error("Error fetching job interests");
  }
}

export async function getTotalApplicant() {
  try {
    const totalApplicant = await prisma.applicant.count();
    return totalApplicant;
  } catch (error) {
    console.error("Error fetching total applicant:", error);
    throw new Error("Error fetching total applicant");
  }
}

export async function getTotalAcceptedApplicant() {
  try {
    const totalAcceptedApplicant = await prisma.applicant.count({
      where: {
        status: "ACCEPTED"
      }
    });
    return totalAcceptedApplicant;
  } catch (error) {
    console.error("Error fetching total accepted applicant:", error);
    throw new Error("Error fetching total accepted applicant");
  }
}

export async function getTotalRejectedApplicant() {
  try {
    const totalRejectedApplicant = await prisma.applicant.count({
      where: {
        status: "REJECTED"
      }
    });
    return totalRejectedApplicant;
  } catch (error) {
    console.error("Error fetching total rejected applicant:", error);
    throw new Error("Error fetching total rejected applicant");
  }
}

export async function getTotalJob() {
  try {
    const totalJob = await prisma.job.count();
    return totalJob;
  } catch (error) {
    console.error("Error fetching total job:", error);
    throw new Error("Error fetching total job");
  }
}

export async function getIncomingInterviewSchedule() {
  try {
    const incomingInterviewSchedule = await prisma.interviewSchedule.findMany({
      where: {
        date_time: {
          gte: new Date()
        }
      },
      take: 10,
      include: {
        applicant: {
          include: {
            user: true,
            job: true
          }
        }
      }
    });
    return incomingInterviewSchedule;
  } catch (error) {
    console.error("Error fetching incoming interview schedule:", error);
    throw new Error("Error fetching incoming interview schedule");
  }
}

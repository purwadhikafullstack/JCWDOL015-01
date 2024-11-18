import prisma from "@/prisma";

// Fetch user age distribution
export async function getUserAgeDistribution() {
  try {
    const userAgeData = await prisma.user.findMany({
      select: { birth_date: true },
    });

    const ageDistribution: Record<string, number> = {};

    userAgeData.forEach((user) => {
      const age = new Date().getFullYear() - new Date(user.birth_date).getFullYear();
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

// // Add a new interest to a user’s analytics record
// export async function addUserInterest(userId: number, newInterest: string) {
//   try {
//     const userAnalytics = await prisma.analytics.findUnique({
//       where: { user_id: userId },
//     });

//     if (userAnalytics) {
//       const updatedInterests = [...new Set([...userAnalytics.interests, newInterest])];
//       await prisma.analytics.update({
//         where: { user_id: userId },
//         data: { interests: updatedInterests },
//       });
//     } else {
//       // Create a new analytics entry if none exists for the user
//       await prisma.analytics.create({
//         data: { user_id: userId, interests: [newInterest], age: userAnalytics?.age || null }, // Include age if required
//       });
//     }
//   } catch (error) {
//     console.error("Error adding user interest:", error);
//     throw new Error("Error adding user interest");
//   }
// }

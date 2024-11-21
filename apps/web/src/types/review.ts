export interface Review {
    id: number;
    userId: number;
    companyId: number;
    rating: number;
    comment: string;
    position: string;
    salaryEstimate: number;
    cultureScore: number;
    workLifeBalanceScore: number;
    facilitiesScore: number;
    careerOpportunitiesScore: number;
    createdAt: string;
}

export interface ReviewPayload {
    userId: number;
    companyId: number;
    position: string;
    rating: number;
    comment: string;
    salaryEstimate: number;
    cultureScore: number;
    workLifeBalanceScore: number;
    facilitiesScore: number;
    careerOpportunitiesScore: number;
}

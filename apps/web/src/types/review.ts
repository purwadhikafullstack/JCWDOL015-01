export interface Reviews {
    id: number;
    companyId: number;
    userId?: number;
    position?: string;
    rating?: number;
    salaryEstimate?: number;
    cultureScore?: number;
    workLifeBalanceScore?: number;
    facilitiesScore?: number;
    careerOpportunitiesScore?: number;
    comment?: string;
    createdAt: Date;
}

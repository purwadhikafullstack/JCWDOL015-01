import { addAnonymousReview, addCompanyRating, salaryReview } from "@/controllers/companyRev.controller";
import { generateCV } from "@/controllers/cvGen.controller";
import { createAssessment } from "@/controllers/skillAssesment.controller";
import { approvePayment, getAllSubscriptions, getSubscriptionCategories, purchaseSubscription } from "@/controllers/subs.controller";
import { getEndingSubscriptions } from "@/controllers/subsExpiry.controller";
import { verifyEmployeeStatus } from "@/controllers/verifyEmployee.controller";
import { checkSubscription } from "@/middlewares/checkSubs";
import { verifyDeveloperRole } from "@/middlewares/verifyDevRole";
import { verifyUserStatus } from "@/middlewares/verifyUserStatus";
import { Router } from "express";

const router = Router()

router.get('/subscriptions', getAllSubscriptions);
router.post('/subscriptions/purchase', purchaseSubscription);
router.get('/subscriptions/category', getSubscriptionCategories)
router.post('/subscriptions/approve', approvePayment);
router.get('/ending-subscriptions', getEndingSubscriptions);
router.get('/generate-cv', checkSubscription, generateCV)
router.post('/company-review', verifyUserStatus, addAnonymousReview)
router.post('/company-review/salary-estimate', verifyUserStatus, salaryReview)
router.post('/company-review/rating', verifyUserStatus, addCompanyRating)
router.post('/company-review/rating',  verifyUserStatus, verifyEmployeeStatus, addCompanyRating)
router.post('/assessment', verifyDeveloperRole, createAssessment)

export default router

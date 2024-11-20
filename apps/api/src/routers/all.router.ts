import { addAnonymousReview, addCompanyRating, salaryReview } from "@/controllers/companyRev.controller";
import { generateCV } from "@/controllers/cvGen.controller";
import { completeAssessment, createAssessment, getUserAssessments } from "@/controllers/skillAssesment.controller";
import { approvePayment, getAllSubscriptions, getSubscriptionCategories, getUserSubsandPayDetails, purchaseSubscription } from "@/controllers/subs.controller";
import { verifyEmployeeStatus } from "@/controllers/verifyEmployee.controller";
import { checkSubscription } from "@/middlewares/checkSubs";
import { verifyDeveloperRole } from "@/middlewares/verifyDevRole";
import { verifyUserStatus } from "@/middlewares/verifyUserStatus";
import { Router } from "express";

const router = Router()

router.get('/subscriptions', getAllSubscriptions)
router.post('/subscriptions/purchase', purchaseSubscription)
router.put('/subscriptions/approve', verifyDeveloperRole, approvePayment)
router.get('/subscriptions/categories', getSubscriptionCategories)
router.get('/subscriptions/user/:id', getUserSubsandPayDetails)

router.get('/generate-cv', checkSubscription, generateCV)
router.post('/company-review', verifyUserStatus, addAnonymousReview)
router.post('/company-review/salary-estimate', verifyUserStatus, salaryReview)
router.post('/company-review/rating', verifyUserStatus, addCompanyRating)
router.post('/company-review/rating',  verifyUserStatus, verifyEmployeeStatus, addCompanyRating)
router.post('/assessments', createAssessment)
router.post('/assessments/complete', completeAssessment)
router.get('/assessments/user', getUserAssessments)

export default router

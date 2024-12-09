import { addAnonymousReview, getReviewsByCompany } from "@/controllers/companyRev.controller";
import { generateCV } from "@/controllers/cvGen.controller";
import { completeAssessment, createAssessment, getUserAssessments } from "@/controllers/skillAssesment.controller";
import { approvePayment, getPendingSubscriptions, getSubscriptionCategories, getUserSubsandPayDetails, purchaseSubscription } from "@/controllers/subs.controller";
import { VerifyEmployee } from "@/middlewares/verifyEmployee"
import { checkSubscription } from "@/middlewares/checkSubs";
import { verifyDeveloperRole } from "@/middlewares/verifyDevRole";
import { verifyUserStatus } from "@/middlewares/verifyUserStatus";
import { Router } from "express";
import { shareJobs } from "@/controllers/share.controller";

const router = Router()

/** User Routes */
router.get('/subscriptions', getSubscriptionCategories)
router.post('/subscriptions/purchase', purchaseSubscription)
router.get('/subscriptions/user/:id', getUserSubsandPayDetails)
router.get('/generate-cv', checkSubscription, generateCV)
router.post('/reviews/anonymous', verifyUserStatus, addAnonymousReview);
router.post('/assessments/complete', verifyUserStatus, completeAssessment)
router.get('/assessments/user/:userId', getUserAssessments)
router.post('/shareJob', verifyUserStatus, shareJobs)

/** Developer Routes */
router.put('/subscriptions/approve', verifyDeveloperRole, approvePayment)
router.get('/subscriptions/pending', verifyDeveloperRole, getPendingSubscriptions)
router.post('/assessments', verifyDeveloperRole, createAssessment)

/** Admin Routes */
router.get('/subscriptions/categories', VerifyEmployee, getSubscriptionCategories)
router.get('/reviews/:companyId', getReviewsByCompany);

export default router

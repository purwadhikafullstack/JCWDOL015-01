import { addAnonymousReview, addCompanyRating, getReviewsByCompany, salaryReview, submitReview } from "@/controllers/companyRev.controller";
import { generateCV } from "@/controllers/cvGen.controller";
import { completeAssessment, createAssessment, getUserAssessments } from "@/controllers/skillAssesment.controller";
import { approvePayment, getAllSubscriptions, getPendingSubscriptions, getSubscriptionCategories, getUserSubsandPayDetails, purchaseSubscription } from "@/controllers/subs.controller";
import { VerifyEmployee } from "@/middlewares/verifyEmployee"
import { checkSubscription } from "@/middlewares/checkSubs";
import { verifyDeveloperRole } from "@/middlewares/verifyDevRole";
import { verifyUserStatus } from "@/middlewares/verifyUserStatus";
import { Router } from "express";

const router = Router()

/** User Routes */
router.get('/subscriptions', getSubscriptionCategories)
router.post('/subscriptions/purchase', purchaseSubscription)
router.get('/subscriptions/user/:id', getUserSubsandPayDetails)
router.get('/generate-cv', checkSubscription, generateCV)

router.post('/reviews/anonymous', addAnonymousReview);
router.post('/reviews/company', verifyUserStatus, addCompanyRating);
router.post('/reviews/salary', verifyUserStatus, salaryReview);
router.post('/reviews/submit', verifyUserStatus, submitReview);

router.get('/reviews/:companyId', getReviewsByCompany);

router.post('/assessments/complete', completeAssessment)
router.get('/assessments/user', getUserAssessments)

/** Developer Routes */
router.put('/subscriptions/approve/:developerId', verifyDeveloperRole, approvePayment)
router.get('/subscriptions/pending/:developerId', verifyDeveloperRole, getPendingSubscriptions);
router.post('/assessments', verifyDeveloperRole, createAssessment)

/** Admin Routes */
router.get('/subscriptions/categories', verifyDeveloperRole, getSubscriptionCategories)

export default router

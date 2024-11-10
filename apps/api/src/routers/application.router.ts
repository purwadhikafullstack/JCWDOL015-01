import express from 'express';
import { ApplicationsController } from '@/controllers/application.controller';

const router = express.Router();
const applicationsController = new ApplicationsController();

router.get('/', (req, res) => applicationsController.getApplications(req, res));

export default router;

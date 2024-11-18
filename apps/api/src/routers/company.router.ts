import { CompanyController } from "@/controllers/company.controller";
import { Router } from "express";

export class CompanyRouter {
  private router: Router;
  private companyController: CompanyController;

  constructor() {
    this.companyController = new CompanyController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.companyController.getCompanyAndJobs);
  }

  getRouter(): Router {
    return this.router;
  }
}
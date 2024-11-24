import { AdminController } from "@/controllers/admin.controller";
import { verifyAdminToken } from "@/middleware/token";
import { uploader } from "@/middleware/uploader";
import { validateRegisterAdmin } from "@/middleware/validator";
import { Router } from "express";

export class AdminRouter{
    private router: Router
    private adminController: AdminController

    constructor(){
        this.adminController = new AdminController()
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes(): void{
        this.router.post('/', validateRegisterAdmin, this.adminController.register)
        this.router.post('/login', this.adminController.login)
        this.router.post('/check-email', this.adminController.checkEmail)
        this.router.post('/reset-password', verifyAdminToken, this.adminController.resetPassword)
        this.router.post('/update-profile', verifyAdminToken, this.adminController.updateProfile)
        this.router.post('/change-password', verifyAdminToken, this.adminController.changePassword)
        this.router.post('/change-email', verifyAdminToken, this.adminController.changeEmail)
        this.router.post('/change-company-logo', verifyAdminToken, uploader("companyLogo", "/company-logo").single('companyLogo'), this.adminController.changeCompanyLogo)

    }

    getRouter(): Router{
        return this.router
    }
}
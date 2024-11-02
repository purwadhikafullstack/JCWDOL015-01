import { AdminController } from "@/controllers/admin.controller";
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
    }

    getRouter(): Router{
        return this.router
    }
}
import { Router } from "express";
import {verifyJWT} from "../middleware/authMiddleware.js"
import {getDashboardStats} from "../controller/dashboard.controller.js"

const router = Router();
router.use(verifyJWT)

router.route("/").get(getDashboardStats)

export default router
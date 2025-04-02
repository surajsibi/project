import { Router } from "express";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { loginUser, registerUser, logoutUser } from "../controller/user.controller.js";


const router =Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)


//secure route

router.route("/logout").post(verifyJWT,logoutUser)

export default router
import { Router } from "express";
import { shortenUrl, redirectUrl } from "../controller/url.controller.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();
router.use(verifyJWT)


router.post("/shorten", shortenUrl);
router.get("/id/:shortUrl", redirectUrl);

export default router;
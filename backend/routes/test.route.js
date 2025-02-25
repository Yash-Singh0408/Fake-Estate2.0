import exress from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = exress.Router();

router.get("/should-be-Logged-In",verifyToken,shouldBeLoggedIn );
router.get("/should-be-Admin",shouldBeAdmin );

export default router;
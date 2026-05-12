import { Router } from "express";
import {
  authLogin,
  authLogout,
  authRegister,
  authenticated,
  currentUser,
} from "../controllers/authController";
import verifyToken from "../middleware/authMiddleware";

const router = Router();

router.get("/current-user", verifyToken, currentUser);
router.get("/authenticated", verifyToken, authenticated);
router.post("/register", authRegister);
router.post("/login", authLogin);
router.post("/logout", authLogout);

export default router;

import express from "express";
import * as UserController from "../controllers/usersController";
import { requiresAuth } from "../middlewares/auth";

const router = express.Router();

//SignUp
router.post("/signup", UserController.signUp);
//Login
router.post("/login", UserController.login);

//Edit User
router.put("/edit/:userId", requiresAuth, UserController.editUserProfile);

export default router;

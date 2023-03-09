import express from "express";
import * as UserController from "../controllers/usersController";

const router = express.Router();

//SignUp
router.post("/signup", UserController.signUp);
//Login
router.post("/login", UserController.login);
//Edit User
router.put("/edit/:userId", UserController.editUserProfile);

export default router;

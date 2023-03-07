import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { assertIsDefined } from "../utils/assertIsDefined";

interface SignUpBody {
    username?: string;
    displayName?: string;
    email?: string;
    password?: string;
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const displayName = req.body.displayName;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();
        if (existingUsername) {
            throw createHttpError(409, "Username already exists");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();
        if (existingEmail) {
            throw createHttpError(409, "Email already exists");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            displayName: displayName,
            email: email,
            password: passwordHashed
        });

        res.status(201).json({ status: true, user: newUser });
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    username?: string;
    password?: string;
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        //Try to retrieve user from db along with password and email field
        //password and email field are set to select false in userSchema
        const user = await UserModel.findOne({ username: username }).select("+password +email").exec();
        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;

        res.status(201).json({ status: true, user: user });
    } catch (error) {
        next(error);
    }
};

interface EditUserParams {
    userId?: string;
}

interface EditUserParams {
    displayName?: string;
    password?: string;
}

export const editUserProfile: RequestHandler<EditUserParams, unknown, EditUserParams, unknown> = async (req, res, next) => {
    const userId = req.params.userId;
    const newDisplayName = req.body.displayName;
    const newPasswordRaw = req.body.password;
    const authenticatedUserId = req.session.userId;

    try {
        if (!newPasswordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        assertIsDefined(authenticatedUserId);
        if (!mongoose.isValidObjectId(userId)) {
            console.log("error here", userId);
            console.log("error here", authenticatedUserId);
            throw createHttpError(400, "Invalid User Id.");
        }

        const user = await UserModel.findById(userId).exec();

        if (!user) {
            throw createHttpError(404, "User not found.");
        }

        if (!user._id.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this user");
        }

        const newPasswordHashed = await bcrypt.hash(newPasswordRaw, 10);

        user.displayName = newDisplayName;
        user.password = newPasswordHashed;

        const updatedUser = await user.save();

        res.status(201).json({ status: true, user: updatedUser });
    } catch (error) {
        next(error);
    }
};

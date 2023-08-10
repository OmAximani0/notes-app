import { Request, Response } from "express";
import { User } from "../models";
import { Error } from "mongoose";
import { signJWT } from "../utils/jwt";
import { compare } from "bcrypt";

export async function regsiterUser(req: Request, res: Response) {
    let response: CustomResponse = {};

    checkFields(req.body, ["name", "email", "password"], response);
    if (response.error) {
        return res.status(400).json(response);
    }

    // Check for password length
    if (req.body.password.length < 6) {
        response["error"] = ["Password must be at least 6"];
        return res.status(400).json(response);
    }

    // Check user exist with the email given
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
        response["error"] = ["Email is already in use"];
        return res.status(400).json(response);
    }

    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
        });
        newUser.password = await newUser.hashPassword(req.body.password);
        await newUser.save();
        const token = signJWT({ _id: newUser._id, email: newUser.email });
        response["message"] = "User registered successfully!";
        response["token"] = token;
    } catch (error: any) {
        if (error instanceof Error.ValidationError) {
            for (let i in error.errors) {
                if (!response.error) {
                    response["error"] = [error.errors[i].message];
                } else {
                    response.error.push(error.errors[i].message);
                }
            }
            return res.status(400).json(response);
        } else {
            response["error"] = error;
        }
        if (error.name === "MongoServerError" && error.code === 11000) {
            response["error"] = ["Email is already in use"];
            return res.status(400).json(response);
        }
        return res.status(500).json(response);
    }

    res.status(201).json(response);
}

export async function loginUser(req: Request, res: Response) {
    let response: CustomResponse = {};

    checkFields(req.body, ["email", "password"], response);
    if (response.error) {
        return res.status(400).json(response);
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        response["error"] = ["Email is not registered"];
        return res.status(400).json(response);
    }

    if (await compare(req.body.password, user.password)) {
        response["token"] = signJWT({ _id: user._id, email: user.email });
        response["message"] = "User login successfull";
        return res.status(200).json(response);
    }

    response["error"] = ["Email with password not match"];
    return res.status(400).json(response);
}

// Helper Functions
function checkFields(
    body: object,
    requiredFields: string[],
    response: CustomResponse
) {
    for (let i = 0; i < requiredFields.length; i++) {
        if (requiredFields[i] in body) {
            continue;
        } else {
            if (!response["error"]) {
                response["error"] = [`${requiredFields[i]} is required!`];
            } else {
                response["error"].push(`${requiredFields[i]} is required!`);
            }
        }
    }
}

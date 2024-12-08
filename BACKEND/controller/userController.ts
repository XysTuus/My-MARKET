import bcrypt from "bcrypt";
import crypto from "crypto";
import env from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel";

env.config();

export const createAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, name, password, confirm_Password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(4).toString("hex");
    if (confirm_Password === password) {
      const user = await userModel.create({
        email,
        name,
        password: hashed,
        verifiedToken: token,
      });
      return res.status(201).json({
        message: "User created successfully",
        data: user,
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "password and confirm_Password do not match",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error creating Account",
      status: 404,
    });
  }
};

export const loginAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findById({ email });
    if (user) {
      const check = await bcrypt.compare(password, user?.password);
      if (check) {
        if (user?.isVerified && user?.verifiedToken === "") {
          const token = jwt.sign(
            { id: user?.id },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_TIMEOUT as string }
          );
          return res.status(201).json({
            message: "Login successful",
            data: user,
            status: 201,
          });
        } else {
          return res.status(404).json({
            message: "please verify your account",
            statu: 404,
          });
        }
      } else {
        return res.status(404).json({
          message: "incorrect password",
          status: 404,
        });
      }
    } else {
      return res.status(404).json({
        message: "user not found",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error encountered while logging in",
      status: 404,
    });
  }
};

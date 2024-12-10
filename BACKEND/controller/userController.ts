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

export const verifyAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user = await userModel.findByIdAndUpdate(
      userID,
      {
        isVerified: true,
        verifiedToken: "",
      },
      { new: true }
    );
    return res.status(201).json({
      message: `${user?.userName} account is successfully verified`,
      data: user?.userName,
      status: 201,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error Verifying Account",
      status: 404,
    });
  }
};

export const readOneAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const user = await userModel.findById(userID);

    return res.status(200).json({
      message: `${user?.userName}'s account exists in the database`,
      data: user,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "user no found",
      status: 404,
    });
  }
};

export const readAllAccounts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await userModel.find();

    return res.status(200).json({
      message: "All accounts have been read successfully",
      data: user,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error reading Accounts",
      status: 404,
    });
  }
};

export const forgetAccountPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    const token = crypto.randomBytes(6).toString("hex");
    if (user) {
      await userModel.findByIdAndUpdate(
        user?._id,
        {
          verifiedToken: token,
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Request is being processed",
        status: 200,
      });
    } else {
      return res.status(404).json({
        message: "No email with this password",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying Account Account",
      status: 404,
    });
  }
};

export const changeAccountPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    if (userID) {
      await userModel.findByIdAndUpdate(
        userID,
        {
          password: hashed,
          verifiedToken: "",
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Your password as been updated, please go login!",
        status: 200,
      });
    } else {
      return res.status(404).json({
        message: "No email with such Account",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying Account",
      status: 404,
    });
  }
};

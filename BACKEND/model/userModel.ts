import { Document, model, Schema } from "mongoose";

interface iUser {
  email: string;
  userName: string;
  password: string;
  avatarUrl: string;
  isVerified: boolean;
  verifiedToken: string;
}

interface iUserData extends iUser, Document {}

const userModel = new Schema<iUserData>({
  email: {
    type: String,
    unique: true,
  },
  userName: {
    type: String,
  },
  password: {
    type: String,
  },
  avatarUrl: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedToken: {
    type: String,
  },
});

export default model<iUserData>("users", userModel);

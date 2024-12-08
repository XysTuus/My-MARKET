import { connect } from "mongoose";
import env from "dotenv";

export const dbConfig = async () => {
  try {
    console.log("starting database......");
    await connect(process.env.MONGO_URL as string).then(() => {
      console.log("Connected to database 💖💖🚀🚀");
    });
  } catch (error) {
    return error;
    throw error;
  }
};

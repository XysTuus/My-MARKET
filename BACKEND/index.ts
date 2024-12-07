import express, { Application } from "express";
import env from "dotenv";
import cors from "cors";
import { dbConfig } from "./utils/dbConfig";

env.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

const port = parseInt(process.env.PORT as string);

app.listen(port, async () => {
  try {
    console.log("starting server connection......");
    await dbConfig().then(() => {
      console.log(`server is currently running on ${port} 🔑🔐`);
    });
  } catch (error) {
    return error;
  }
});

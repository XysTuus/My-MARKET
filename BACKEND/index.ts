import express, { Application } from "express";
import env from "dotenv";
import cors from "cors";
import { dbConfig } from "./utils/dbConfig";
import { mainApp } from "./mainApp";

env.config();

const app: Application = express();

app.use(express.json());
app.use(cors());
mainApp(app);
const port = parseInt(process.env.PORT as string);

app.listen(port, async () => {
  try {
    console.log("starting server connection......");
    await dbConfig();
    // console.log(`server is currently running on ${port} 🔑🔐`);
  } catch (error) {
    return error;
    process.exit(1);
  }
});

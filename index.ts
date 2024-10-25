import dotenv from "dotenv";
dotenv.config({ path: "./Config/.env" });

import express from "express";
import cors from "cors";
import connectToDb from "./Config/dbConnection";
import userRoutes from "./Routes/UserRoutes";
import commenRoutes from "./Routes/CommenRoute";
import errorHandler from "./Middlewares/ErrorHandler";
import cookieParser from "cookie-parser";
import hospitalRoutes from "./Routes/HospitalRoute";
require("./Node-Cron/nodeCron");

const app = express();

app.use(
  cors({
    origin: [
      process.env.UserSide_URL as string,
      process.env.HospitalSide_URL as string,
      process.env.LocalHost as string,
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Fix route paths with leading '/'
app.use("/api", userRoutes);
app.use("/api", commenRoutes);
app.use("/api", hospitalRoutes);

connectToDb();

app.use(errorHandler);

app.listen(process.env.Port, () => {
  console.log("App is running");
});

export default app;
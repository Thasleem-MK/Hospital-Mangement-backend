import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDb from "./Config/dbConnection";
import userRoutes from "./Routes/UserRoutes";
import commenRoutes from "./Routes/CommenRoute";

const app = express();

dotenv.config({ path: "./Config/.env" });

app.use(
  cors({
    origin: [
      "https://hospital-managements.vercel.app",
      "https://hospital-management-hospital-side.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Fix route paths with leading '/'
app.use("/api", userRoutes);
app.use("/api", commenRoutes);

connectToDb();

app.listen(3000, () => {
  console.log("App is running");
});

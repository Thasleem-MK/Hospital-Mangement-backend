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
import AmbulanceRoutes from "./Routes/AmbulanceRoutes";

const app = express();

app.use(
  cors({
    origin: [
      process.env.UserSide_URL as string,
      process.env.AmbulanceSide_URL as string,
      process.env.HospitalSide_URL as string,
    ],
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Check if the origin is in the allowed list
//       const allowedOrigins = [
//         process.env.UserSide_URL,
//         process.env.AmbulanceSide_URL,
//         process.env.HospitalSide_URL,
//       ];
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// app.use(
//   cors({
//     origin: "*", // Allow all origins
//     credentials: true, // Allow credentials
//   })
// );



app.use(express.json());
app.use(cookieParser());

// Fix route paths with leading '/'
app.use("/api", userRoutes);
app.use("/api", commenRoutes);
app.use("/api", hospitalRoutes);
app.use("/api", AmbulanceRoutes);

connectToDb();

app.use(errorHandler);

app.listen(process.env.Port, () => {
  console.log("App is running");
});

export default app;
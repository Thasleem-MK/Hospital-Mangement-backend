import express from "express";
import dotenv from "dotenv";
import cors from "cors"

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("App is running");
});

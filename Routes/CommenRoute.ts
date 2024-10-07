import Express from "express";
import { trycatch } from "../Utils/TryCatch";
import { sendMail } from "../Controllers/Commen";

const commenRoutes = Express.Router();

commenRoutes.post("/email", trycatch(sendMail))

export default commenRoutes;
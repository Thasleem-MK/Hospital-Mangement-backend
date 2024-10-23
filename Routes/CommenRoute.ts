import Express from "express";
import { trycatch } from "../Utils/TryCatch";
import { Refresh, sendMail } from "../Controllers/Commen";

const commenRoutes = Express.Router();

commenRoutes.post("/email", trycatch(sendMail));
commenRoutes.get("/refresh", trycatch(Refresh));

export default commenRoutes;

import Express from "express";
import { trycatch } from "../Utils/TryCatch";
import { Logout, Refresh, sendMail } from "../Controllers/Commen";
import Authenticator from "../Middlewares/Authenticator";

const commenRoutes = Express.Router();

commenRoutes.post("/email", trycatch(sendMail));
commenRoutes.get("/refresh", trycatch(Refresh));
commenRoutes.get("/logout", Authenticator, trycatch(Logout));

export default commenRoutes;

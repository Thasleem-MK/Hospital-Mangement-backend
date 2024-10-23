import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";

const Auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new createError.Unauthorized("No token provided. Please login.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded) {
      throw new createError.Unauthorized("Invalid token. Please login.");
    }

    next();
  } catch (err: any) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new createError.Unauthorized("Invalid or expired token."));
    }
    next(err);
  }
};

export default Auth;

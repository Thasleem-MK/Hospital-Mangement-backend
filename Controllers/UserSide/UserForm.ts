import { Request, Response } from "express";
import Joi from "joi";
import HttpError from "http-errors";
import bcrypt from "bcrypt";
import Jwt, { JwtPayload } from "jsonwebtoken";
import User from "../../Model/UserSchema";
import { ObjectId } from "mongodb";
import Hospital from "../../Model/HospitalSchema";

// Joi schema to validate the Registration data of users
const joiSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required",
  }),

  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.empty": "Password is required",
  }),

  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid 10-digit phone number",
      "string.empty": "Phone number is required",
    }),
});

// User Registration
export const userRegister = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { error } = joiSchema.validate(req.body);
  if (error) {
    throw new HttpError.BadRequest(error.details[0].message);
  }

  const existingUser = await User.findOne({
    email: req.body.email,
  });
  if (existingUser) {
    throw new HttpError.Conflict("Email is already registered, Please login");
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    ...req.body,
    password: hashedPassword,
  });

  await newUser.save();

  return res.status(201).json({
    staus: "Success",
    message: "User created successfully",
  });
};

// User's login
// user interface
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export const userLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;
  const user: User | null = await User.findOne({ email: email });
  if (user === null) {
    throw new HttpError.NotFound("You email is not found, Please Register");
  }
  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    throw new HttpError.BadRequest("Incorrect password, try again!");
  }
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const generateToken = Jwt.sign(
    { id: user._id, email: user.email },
    jwtSecret,
    { expiresIn: "10h" }
  );
  return res
    .status(200)
    .cookie("token", generateToken, { maxAge: 36000000 })
    .json({
      status: "success",
      data: user,
    });
};

// Get user data
export const userData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const token = req.cookies.token;
  if (!token) {
    throw new HttpError.Unauthorized("You are not logged in");
  }
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const { id } = Jwt.verify(token, jwtSecret) as JwtPayload;

  const data = await User.findById(id);
  return res.status(200).json({
    status: "success",
    data: data,
  });
};

// User Logout
export const userLogout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log("Logout");

  return res.status(200).clearCookie("token").json({
    status: "success",
    message: "Logedout successfully",
  });
};

// Reset Password
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError.NotFound("User not found");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();
  return res.status(200).json({ message: "Password reset successful." });
};

// Get details of all hospitals
export const getHospitals = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const hospitals = await Hospital.find();
  return res.status(200).json({ data: hospitals });
};

// Post a review
export const postReview = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { user_id, rating, comment, date } = req.body;
  const { id } = req.params;
  const hospital = await Hospital.findById(id);
  if (!hospital) {
    throw new HttpError.NotFound("Hospital not found");
  }
  hospital?.reviews.push({ user_id, rating, comment, date });
  await hospital?.save();
  return res.status(200).json({
    message: "Review posted successfully",
    data: hospital,
  });
};

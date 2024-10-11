import { Request, Response } from "express";
import createError from "http-errors";
import bcrypt from "bcrypt";
import Joi from "joi";
import Jwt from "jsonwebtoken";
import Hospital from "../../Model/HospitalSchema";

// Joi validation for initial hospital registration
const RegistrationSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Hospital name is required",
    "any.required": "Hospital name is required",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required",
    "any.required": "Phone number is required",
  }),
  address: Joi.string().required().messages({
    "string.empty": "Address is required",
    "any.required": "Address is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

export const HospitalRegistration = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  const { error } = await RegistrationSchema.validate(req.body);
  if (error) {
    throw new createError.BadRequest(error.details[0].message);
  }

  const existingHospital = await Hospital.findOne({ email: email });
  if (existingHospital) {
    throw new createError.Conflict("Email is already exist. Please login");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newHospital = new Hospital({
    ...req.body,
    password: hashedPassword,
  });

  await newHospital.save();
  return res.status(201).json({ message: "Hospital registered successfully." });
};

//Hospital login
export const HospitalLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;
  const hospital = await Hospital.findOne({ email: email });
  if (!hospital) {
    throw new createError.Unauthorized("User not found!");
  }
  const isValidPassword = await bcrypt.compare(password, hospital.password);
  if (!isValidPassword) {
    throw new createError.Unauthorized("Invalid email or password");
  }
  const jwtKey = process.env.JWT_SECRET;
  if (!jwtKey) {
    throw new Error("JWT_SECRET is not defined");
  }
  // Generate JWT token
  const token = Jwt.sign({ id: hospital._id }, jwtKey, {
    expiresIn: "1h",
  });
  return res.status(200).cookie("token", token).json({
    status: "Success",
    message: "Hospital logged in successfully.",
  });
};

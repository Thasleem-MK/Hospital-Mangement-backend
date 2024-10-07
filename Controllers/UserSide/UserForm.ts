import { Request, Response } from "express";
import Joi from "joi";
import HttpError from "http-errors";
import bcrypt from "bcrypt";
import User from "../../Model/UserSchema";

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

export const userRegister = async (req: Request, res: Response) => {
  const { error } = joiSchema.validate(req.body);
  if (error) {
    throw new HttpError.BadRequest(error.details[0].message);
  }

  const existingUser = await User.findOne({
    email: req.body.email,
  });
  console.log(existingUser);
  if (existingUser) {
    throw new HttpError.Conflict("Email is already registered");
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    ...req.body,
    password: hashedPassword,
  });

  await newUser.save();

  res.status(201).json({
    staus: "Success",
    message: "User created successfully",
  });
};

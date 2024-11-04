import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Ambulance from "../../Model/AmbulanceSchema";
import createError from "http-errors";
import Jwt from "jsonwebtoken";

export const Registeration = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    serviceName,
    address,
    latitude,
    longitude,
    phone,
    email,
    password,
    vehicleType,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const exist = await Ambulance.findOne({ email: email });
  if (exist) {
    throw new createError.Conflict("Your email is already exist");
  }
  const newAmbulace = new Ambulance({
    serviceName: serviceName,
    Address: address,
    email: email,
    latitude: latitude,
    Longitude: longitude,
    password: hashedPassword,
    Phone: phone,
    vehicleType: vehicleType,
  });
  await newAmbulace.save();
  return res
    .status(201)
    .json({ message: "Registeration completed successfully" });
};

//Ambulance Login
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  const user = await Ambulance.findOne({ email: email });
  if (!user) {
    throw new createError.NotFound("User not found! Please register");
  }
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    throw new createError.BadRequest("Wrong password, Plese try again");
  }
  const jwtKey = process.env.JWT_SECRET;
  if (!jwtKey) {
    throw new Error("JWT_SECRET is not defined");
  }
  // Generate JWT tokens
  const token = Jwt.sign({ id: user._id, name: user.serviceName }, jwtKey, {
    expiresIn: "15m",
  });

  const refreshToken = Jwt.sign(
    { id: user._id, name: user.serviceName },
    jwtKey,
    {
      expiresIn: "7d",
    }
  );

  const sevenDayInMs = 7 * 24 * 60 * 60 * 1000;
  const expirationDate = new Date(Date.now() + sevenDayInMs);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    expires: expirationDate,
    secure: true,
    sameSite: "none",
  });
  return res.status(200).json({
    message: "Loggedin successfully",
    token: token,
    data: user,
  });
};
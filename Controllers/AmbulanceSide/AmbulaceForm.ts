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
    address: address,
    email: email,
    latitude: latitude,
    longitude: longitude,
    password: hashedPassword,
    phone: phone,
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

// Get a specific ambulance details
export const getanAmbulace = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new createError.NotFound("User not found!");
  }
  const { id } = Jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: string;
  };
  const user = await Ambulance.findOne({ _id: id });
  if (!user) {
    throw new createError.NotFound("User not found!");
  }
  return res.status(200).json({
    status: "Success",
    data: user,
  });
};

//Update Ambulance Data
export const updateData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { serviceName, address, latitude, longitude, phone, vehicleType } =
    req.body;
  const user = await Ambulance.findById(id);
  if (!user) {
    throw new createError.NotFound("User not found!");
  }
  user.serviceName = serviceName || user.serviceName;
  user.address = address || user.address;
  user.latitude = latitude || user.latitude;
  user.longitude = longitude || user.longitude;
  user.phone = phone || user.phone;
  user.vehicleType = vehicleType || user.vehicleType;

  await user.save();
  return res.status(200).json({
    message: "Updated data successfully",
    data: user,
  });
};

// Delete Ambulance
export const ambulanceDelete = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params as { id: string };

  if (req.cookies.refreshToken) {
    const expirationDate = new Date(0);
    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: expirationDate,
      secure: true,
      sameSite: "none",
    });
  }
  const hospital = await Ambulance.findById(id);
  if (!hospital) {
    throw new createError.NotFound("Hospital not found!");
  }
  await Ambulance.deleteOne({ _id: id });
  return res.status(200).send("Your account deleted successfully");
};

// Get all ambulances
export const getAmbulaces = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const ambulances = await Ambulance.find();
  if (ambulances.length === 0) {
    throw new createError.NotFound("No Data Found!");
  }
  return res.status(200).json({
    status: "Success",
    data: ambulances,
  });
};

import { Request, Response } from "express";
import createError from "http-errors";
import bcrypt from "bcrypt";
import Jwt, { JwtPayload } from "jsonwebtoken";
import Hospital from "../../Model/HospitalSchema";
import { RegistrationSchema } from "./RegistrationJoiSchema";

// Hospital Registration
interface WorkingHours {
  Monday: { open: string; close: string; isHoliday: boolean };
  Tuesday: { open: string; close: string; isHoliday: boolean };
  Wednesday: { open: string; close: string; isHoliday: boolean };
  Thursday: { open: string; close: string; isHoliday: boolean };
  Friday: { open: string; close: string; isHoliday: boolean };
  Saturday: { open: string; close: string; isHoliday: boolean };
  Sunday: { open: string; close: string; isHoliday: boolean };
}

interface HospitalRequestBody {
  name: string;
  email: string;
  mobile: string;
  address: string;
  latitude: number;
  longitude: number;
  password: string;
  workingHours: WorkingHours;
}
export const HospitalRegistration = async (
  req: Request<{}, {}, HospitalRequestBody>,
  res: Response
): Promise<Response> => {
  const {
    name,
    email,
    mobile,
    address,
    latitude,
    longitude,
    password,
    workingHours,
  } = req.body;

  // Validate the request body using Joi
  const data = {
    name,
    email,
    mobile,
    address,
    latitude,
    longitude,
    password,
    workingHours,
  };
  const { error } = await RegistrationSchema.validate(data);
  if (error) {
    console.log(error);

    throw new createError.BadRequest(error?.details[0].message);
  }

  // Check if the hospital already exists with the same email
  const existingHospital = await Hospital.findOne({ email });
  if (existingHospital) {
    throw new createError.Conflict("Email already exists. Please login.");
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Prepare the hospital data
  const newHospital = new Hospital({
    name,
    email,
    phone: mobile,
    address,
    latitude,
    longitude,

    password: hashedPassword,
    working_hours: Object.entries(workingHours).map(([day, hours]) => ({
      day,
      opening_time: hours.isHoliday ? null : hours.open,
      closing_time: hours.isHoliday ? null : hours.close,
      is_holiday: hours.isHoliday,
    })),
  });

  // Save the hospital to the database
  await newHospital.save();

  // Respond with a success message
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
  return res.status(200).cookie("token", token,{sameSite:"strict"}).json({
    status: "Success",
    message: "Hospital logged in successfully.",
  });
};

// Reset pasword
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;
  const hospital = await Hospital.findOne({ email: email });
  if (!hospital) {
    throw new createError.NotFound("No user found");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  hospital.password = hashedPassword;
  hospital.save();
  return res.status(200).json({
    message: "Password updated successfully",
  });
};

// Get Hospital(DashBoard) Details
export const getHospitalDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const token = req.cookies.token;
  if (!token) {
    throw new createError.Unauthorized("Please login to access this route");
  }
  const jwtKey = process.env.JWT_SECRET;
  if (!jwtKey) {
    throw new Error("JWT_SECRET is not defined");
  }

  // Verify and decode token
  const decoded = Jwt.verify(token, jwtKey) as JwtPayload;

  // Now you can safely access `id`
  const { id } = decoded;
  const hospital = await Hospital.findById(id);

  return res.status(200).json({
    status: "Success",
    data: hospital,
  });
};

//Update hospital details
export const updateHospitalDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const {
    name,
    email,
    mobile,
    address,
    latitude,
    longitude,
    workingHours,
    emergencyContact,
    about,
  } = req.body;
  const token = req.cookies.token;
  if (!token) {
    throw new createError.Unauthorized("Please login!");
  }
  const hospital = await Hospital.findById(id);
  if (!hospital) {
    throw new createError.NotFound("Hospital not found. Wrong input");
  }
  // Update the hospital fields
  hospital.name = name || hospital.name;
  hospital.email = email || hospital.email;
  hospital.phone = mobile || hospital.phone;
  hospital.address = address || hospital.address;
  hospital.latitude = latitude || hospital.latitude;
  hospital.longitude = longitude || hospital.longitude;
  hospital.working_hours = workingHours || hospital.working_hours;
  hospital.emergencyContact = emergencyContact || hospital.emergencyContact;
  hospital.about = about || hospital.about;

  // Save the updated hospital data
  await hospital.save();

  return res.status(200).json({
    status: "Success",
    message: "Hospital details updated successfully",
  });
};

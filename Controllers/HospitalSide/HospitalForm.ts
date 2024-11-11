import { Request, Response } from "express";
import createError from "http-errors";
import bcrypt from "bcrypt";
import Jwt, { JwtPayload } from "jsonwebtoken";
import Hospital from "../../Model/HospitalSchema";
import { RegistrationSchema } from "./RegistrationJoiSchema";
import { v2 as cloudinary } from "cloudinary";

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
  type: string;
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
    type,
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
    type,
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
  // Generate JWT tokens
  const token = Jwt.sign({ id: hospital._id, name: hospital.name }, jwtKey, {
    expiresIn: "15m",
  });

  const refreshToken = Jwt.sign(
    { id: hospital._id, name: hospital.name },
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
    status: "Success",
    token: token,
    data: hospital,
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
interface CustomJwtPayload extends JwtPayload {
  id: string;
  name: string;
}
export const getHospitalDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new createError.Unauthorized("No token provided. Please login.");
  }

  const decoded = Jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as CustomJwtPayload;
  if (!decoded) {
    throw new createError.Unauthorized("Invalid token. Please login.");
  }

  const hospital = await Hospital.findById(decoded.id);

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
    image,
    currentPassword,
    newPassword,
  } = req.body;
  const hospital = await Hospital.findById(id);
  if (!hospital) {
    throw new createError.NotFound("Hospital not found. Wrong input");
  }
  if (currentPassword) {
    await bcrypt.compare(currentPassword, hospital.password).catch(() => {
      throw new createError.BadRequest("Current password is wrong");
    });
  }

  // Update the hospital fields
  if (newPassword) {
    const Password = await bcrypt.hash(newPassword, 10);
    hospital.password = Password;
  }
  hospital.name = name || hospital.name;
  hospital.email = email || hospital.email;
  hospital.phone = mobile || hospital.phone;
  hospital.address = address || hospital.address;
  hospital.latitude = latitude || hospital.latitude;
  hospital.longitude = longitude || hospital.longitude;
  hospital.working_hours = workingHours || hospital.working_hours;
  hospital.emergencyContact = emergencyContact || hospital.emergencyContact;
  hospital.about = about || hospital.about;
  hospital.image = image || hospital.image;

  // Save the updated hospital data
  await hospital.save();

  return res.status(200).json({
    status: "Success",
    message: "Hospital details updated successfully",
  });
};

// Add a new specialty
export const addSpecialty = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { department_info, description, doctors, name, phone } = req.body;
  const { id } = req.params;

  const hospital = await Hospital.findById(id);
  if (!hospital) {
    throw new createError.NotFound("Hospital not found. Wrong input");
  }

  // Check the spectilty already exist
  const isExist = hospital.specialties.find(
    (element) =>
      element.name?.trim().toLowerCase() ===
      name.toString().trim().toLowerCase()
  );

  if (isExist) {
    throw new createError.Conflict("Specialty is already exist!");
  }

  hospital.specialties.push({
    name: name as string,
    department_info: department_info as string,
    description: description as string,
    phone: phone as string,
    doctors: doctors,
  });

  await hospital.save();

  return res.status(201).json({
    status: "Successsss",
    message: "Specialty added successfully",
    data: hospital.specialties,
  });
};

// Update Specialty
export const updateSpecialty = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { department_info, description, doctors, name, phone } = req.body;
  const { id } = req.params;
  const hospital = await Hospital.findById(id);
  if (!hospital) {
    throw new createError.NotFound("Hospital not found. Wrong input");
  }
  // Check the spectilty
  const specialty = hospital.specialties.find(
    (element) => element.name === name
  );
  if (!specialty) {
    throw new createError.NotFound("Specialty not found.");
  }

  // Update the fields
  if (department_info !== undefined) {
    specialty.department_info = department_info;
  }
  if (description !== undefined) {
    specialty.description = description;
  }
  if (phone !== undefined) {
    specialty.phone = phone;
  }
  if (doctors !== undefined) {
    specialty.doctors = doctors;
  }
  if (name !== undefined) {
    specialty.name = name;
  }
  await hospital.save();

  return res.status(201).json({
    status: "Success",
    message: "Specialty updated successfully",
    data: hospital.specialties,
  });
};

// Delete a specialty
export const deleteSpecialty = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name } = req.query as { name: string };
  const { id } = req.params;

  const hospital = await Hospital.findById(id);
  if (!hospital) {
    throw new createError.NotFound("Hospital not found. Wrong input");
  }

  // Check the spectilty
  const index = hospital.specialties.findIndex(
    (element) =>
      element.name?.trim().toLowerCase() === name.trim().toLowerCase()
  );
  if (index === -1) {
    throw new createError.NotFound("Specialty not found.");
  }
  hospital.specialties.splice(index, 1);

  await hospital.save();

  return res.status(201).json({
    status: "Success",
    message: "Specialty deleted successfully",
    data: hospital.specialties,
  });
};

// Add a doctor
export const addDoctor = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { name, specialty, consulting, qualification } = req.body;
  const data = { name, consulting, qualification };

  const hospital = await Hospital.findById(id);
  hospital?.specialties
    .filter((Specialty) => {
      return Specialty.name === specialty;
    })[0]
    .doctors.push(data);
  await hospital?.save();
  return res.status(201).json({
    message: `Added new doctor in ${specialty}`,
    data: hospital?.specialties,
  });
};

// Update Doctor
export const updateDoctor = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { _id, name, specialty, consulting, qualification } = req.body;
  const data = { name, consulting, qualification };

  const hospital = await Hospital.findById(id);

  if (!hospital) {
    return res.status(404).json({ message: "Hospital not found" });
  }

  const targetSpecialty = hospital.specialties.find(
    (s) => s.name === specialty
  );

  if (!targetSpecialty) {
    throw new createError.NotFound(`Specialty ${specialty} not found`);
  }

  const targetDoctor = targetSpecialty.doctors.find((d) => d._id == _id);

  if (!targetDoctor) {
    throw new createError.NotFound(
      `Doctor with ID ${_id} not found in specialty ${specialty}`
    );
  }

  targetDoctor.name = data.name;
  targetDoctor.consulting = data.consulting;

  await hospital.save();

  return res.status(200).json({
    message: `Doctor in ${specialty} updated successfully`,
    data: hospital.specialties,
  });
};

// Delete Doctor
export const deleteDoctor = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { hospital_id, doctor_id } = req.params;
  const { specialty_name } = req.query as { specialty_name: string };

  const hospital = await Hospital.findById(hospital_id);
  if (!hospital) {
    throw new createError.NotFound("Hospital not found!");
  }

  const targetSpecialty = hospital.specialties.find(
    (s) => s.name?.trim().toLowerCase() === specialty_name.trim().toLowerCase()
  );

  targetSpecialty?.doctors.forEach((doctor, index) => {
    if (doctor._id.toString() == doctor_id) {
      targetSpecialty.doctors.splice(index, 1);
    }
  });

  await hospital.save();

  return res.status(200).json({
    message: `Doctor in ${specialty_name} deleted successfully`,
    data: hospital.specialties,
  });
};

export const hospitalDelete = async (
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
  const hospital = await Hospital.findById(id);
  if (!hospital) {
    throw new createError.NotFound("Hospital not found!");
  }
  if (hospital.image?.public_id) {
    await cloudinary.uploader.destroy(hospital.image.public_id);
  }
  await Hospital.deleteOne({ _id: id });
  return res.status(200).send("Your account deleted successfully");
};
import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Doctor Schema
const doctorSchema = new Schema({
  name: { type: String},
  consulting: [
    {
      day: { type: String },
      time: { type: String },
    },
  ],
});

// Speciality Schema
const specialtySchema = new Schema({
  name: { type: String}, // 'Cardiology'
  description: { type: String },
  department_info: { type: String },
  doctors: [doctorSchema], // List of doctors under this specialty
});

// Review Schema
const reviewSchema = new Schema({
  user_name: { type: String, required: true }, // Name of the user who gave the review
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1-5
  comment: { type: String },
});

// Working Hours Schema
const workingHoursSchema = new Schema({
  day: { type: String, required: true },
  opening_time: { type: String, required: true }, 
  closing_time: { type: String, required: true },
});

// Booking Schema
const bookingSchema = new Schema({
  user_name: { type: String },
  mobile: { type: String },
  email: { type: String },
  specialty: { type: String }, // Specialty name (optional if booking a specific doctor)
  doctor_name: { type: String }, // Doctor's name (optional if only booking by specialty)
  booking_date: { type: Date }, // Date of the booking
});

// Hospital Schema
const hospitalSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  about: { type: String },
  working_hours: [workingHoursSchema],
  reviews: [reviewSchema],
  specialties: [specialtySchema],
  booking: [bookingSchema],
});

// Create the model
const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Doctor Schema
const doctorSchema = new Schema({
  name: { type: String, required: true },
  consulting: [
    {
      day: { type: String, required: true },
      time: { type: String, required: true },
    },
  ],
});

// Speciality Schema
const specialtySchema = new Schema({
  name: { type: String, required: true }, // 'Cardiology'
  description: { type: String, required: true },
  department_info: { type: String, required: true }, // Any relevant department info
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
  day: { type: String, required: true }, // 'Monday', 'Tuesday'
  opening_time: { type: String, required: true }, // '9:00 AM'
  closing_time: { type: String, required: true }, // '5:00 PM'
});

// Booking Schema
const bookingSchema = new Schema({
  user_name: { type: String, required: true }, // User's name
  mobile: { type: String, required: true }, // Mobile number
  email: { type: String, required: true }, // Email address
  specialty: { type: String }, // Specialty name (optional if booking a specific doctor)
  doctor_name: { type: String }, // Doctor's name (optional if only booking by specialty)
  booking_date: { type: Date, required: true }, // Date of the booking
});

// Hospital Schema
const hospitalSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  about: { type: String, required: true },
  working_hours: [workingHoursSchema],
  reviews: [reviewSchema],
  specialties: [specialtySchema],
  booking: [bookingSchema],
});

// Create the model
const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
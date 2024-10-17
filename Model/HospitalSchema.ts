import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Doctor Schema
const doctorSchema = new Schema({
  name: { type: String },
  consulting: [
    {
      day: { type: String },
      start_time: { type: String },
      end_time: { type: String },
    },
  ],
});

// Speciality Schema
const specialtySchema = new Schema({
  name: { type: String },
  description: { type: String },
  department_info: { type: String },
  phone: { type: String },
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
  opening_time: {
    type: String,
    validate: {
      validator: function (this: any) {
        return (
          this.is_holiday || (this.opening_time && this.opening_time.length > 0)
        );
      },
      message: "Opening time is required unless it's a holiday.",
    },
  },
  closing_time: {
    type: String,
    validate: {
      validator: function (this: any) {
        // If it's not a holiday, closing_time should be required
        return (
          this.is_holiday || (this.closing_time && this.closing_time.length > 0)
        );
      },
      message: "Closing time is required unless it's a holiday.",
    },
  },
  is_holiday: { type: Boolean, default: false },
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
  emergencyContact: { type: String },
  image: { imageUrl: { type: String }, public_id: { type: String } },
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

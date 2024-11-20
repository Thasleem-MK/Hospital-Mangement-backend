import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Doctor Schema
const doctorSchema = new Schema({
  name: { type: String },
  qualification: { type: String },
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
  doctors: [doctorSchema],
});

// Review Schema
const reviewSchema = new Schema({
  user_id: { type: String, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  date: { type: String },
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
  specialty: { type: String },
  doctor_name: { type: String },
  booking_date: { type: Date },
  booking_time: { type: String },
  status: {
    type: String,
    enum: ["pending", "accepted", "declained"],
  },
});

// Hospital Schema
const hospitalSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Homeo, Alopathy
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

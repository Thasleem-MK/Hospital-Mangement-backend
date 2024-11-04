import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ambulanceSchema = new Schema({
  serviceName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
  },
});
const Ambulance = mongoose.model("Ambulance", ambulanceSchema);
export default Ambulance;

import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ambulanceSchema = new Schema({
  serviceName: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
  },
  Longitude: {
    type: String,
  },
  Phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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

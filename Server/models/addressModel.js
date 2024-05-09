import mongoose from 'mongoose';
const addressSchema = new mongoose.Schema(
  {
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: Number, required: true },
    },
  },
  { timestamps: true }
);
const Address = mongoose.model('Address', addressSchema);
export default Address;

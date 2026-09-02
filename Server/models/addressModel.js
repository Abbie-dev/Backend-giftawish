import mongoose from 'mongoose';
const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    street: {
      type: String,
      default: 'N/A',
    },
    city: {
      type: String,
      default: 'N/A',
    },
    state: {
      type: String,
      default: 'N/A',
    },
    country: {
      type: String,
      default: 'N/A',
    },
    postalCode: {
      type: mongoose.Schema.Types.Mixed,
      default: 'N/A',
    },
  },
  { timestamps: true }
);
const Address = mongoose.model('Address', addressSchema);
export default Address;

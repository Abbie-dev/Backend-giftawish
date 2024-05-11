import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const vendorSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailIsVerified: { type: Boolean, default: false },
    firstName: { type: String },
    lastName: { type: String },
    businessRegistration: { type: String }, // Business registration document or number
    identificationDocument: { type: String }, // Identification document (passport, national ID, driver's license)
    bankDetails: {
      accountNumber: { type: String },
      bankName: { type: String },
      accountName: { type: String },
    },
    shippingLocation: { type: String }, // Where products will be shipped from
    guarantor: { type: String }, // Name of the guarantor
    guarantorDocument: { type: String }, // Guarantor's identification document
    orders: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        status: {
          type: String,
          enum: ['pending', 'processing', 'shipped', 'delivered'],
        },
      },
    ],
    balance: { type: Number, default: 0 }, // Available balance
  },
  { timestamps: true }
);

vendorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

vendorSchema.methods.isPasswordMatched = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;

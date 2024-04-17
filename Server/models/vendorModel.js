import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const vendorSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  productCategories: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  ],
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});

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

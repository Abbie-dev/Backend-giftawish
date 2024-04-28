import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    numberOfOrders: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
// Create a compound unique index on 'slug' and 'vendor'
productSchema.index({ slug: 1, vendor: 1 }, { unique: true });

productSchema.virtual('available-quantity').get(function () {
  return this.quantity - this.numberOfOrders;
});
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, strict: true });
  this.inStock = this.available - quantity > 0;
  next();
});
const Product = mongoose.model('Product', productSchema);

export default Product;

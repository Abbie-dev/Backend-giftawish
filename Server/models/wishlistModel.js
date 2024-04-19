import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
                required: true
            },
            priority: {
                type: Number,
                required: true
            }
        }
    ]
}, { timestamps: true })

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
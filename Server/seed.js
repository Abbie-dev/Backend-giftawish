import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/categoryModel.js';
import Product from './models/productModel.js';
import User from './models/userModel.js';
import Vendor from './models/vendorModel.js';
import dbConnect from './config/dbConnect.js';

dotenv.config();
const mockCategories = [
  { name: 'Electronics', description: 'Gadgets and electronic items', slug: 'electronics' },
  { name: 'Fashion', description: 'Clothes and fashion items', slug: 'fashion' },
  { name: 'Home', description: 'Household appliances and decor', slug: 'home' },
  { name: 'Books', description: 'Novels and textbooks', slug: 'books' },
];
const mockProducts = [
  {
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones', // Added product slug just in case your product schema requires it too!
    description: 'Noise-cancelling wireless Bluetooth headphones with 30-hour battery life.',
    price: 199,
    quantity: 50,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    tags: ['electronics', 'gadget', 'audio'],
  },
  {
    name: 'Mechanical Gaming Keyboard',
    slug: 'mechanical-gaming-keyboard',
    description: 'RGB backlighting, tactile switches, double-shot keycaps.',
    price: 120,
    quantity: 30,
    images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500'],
    tags: ['electronics', 'gaming', 'keyboard'],
  },
  {
    name: 'Minimalist Leather Wallet',
    slug: 'minimalist-leather-wallet',
    description: 'Handcrafted full-grain leather wallet with RFID blocking.',
    price: 45,
    quantity: 100,
    // Copying the working keyboard link here to fix the broken image display:
    images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500'], 
    tags: ['fashion', 'wallet', 'accessory'],
  },
  {
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description: 'Breathable mesh back, adjustable armrests and lumbar support.',
    price: 250,
    quantity: 20,
    images: ['https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500'],
    tags: ['home', 'furniture', 'office'],
  },
  {
    name: 'Retro Coffee Maker',
    slug: 'retro-coffee-maker',
    description: 'Programmable drip coffee machine with 12-cup glass carafe.',
    price: 89,
    quantity: 15,
    images: ['https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500'],
    tags: ['home', 'appliances', 'coffee'],
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO || 'mongodb://localhost:27017/giftawish';
    console.log('Connecting to database:', mongoUri);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Vendor.deleteMany({});
    await User.deleteMany({});

    console.log('Creating mock vendor...');
    const vendor = new Vendor({
      firstname: 'Alice',
      lastname: 'Store',
      email: 'vendor@giftawish.com',
      password: 'password123',
      companyName: 'Gift & Co.',
      phoneNumber: '1234567890',
      isIdentityVerified: true,
      emailIsVerified: true,
    });
    const savedVendor = await vendor.save();

    console.log('Creating categories...');
    const categoryDocs = [];
    for (const cat of mockCategories) {
      const c = new Category(cat);
      categoryDocs.push(await c.save());
    }

    console.log('Creating products...');
    for (let i = 0; i < mockProducts.length; i++) {
      const prod = mockProducts[i];
      // Randomly allocate category
      const category = categoryDocs[i % categoryDocs.length];
      const p = new Product({
        ...prod,
        category: category._id,
        vendor: savedVendor._id,
      });
      await p.save();
    }

    console.log('Creating mock users...');
    const user1 = new User({
      firstname: 'Nancy',
      lastname: 'Drew',
      username: 'nancy',
      email: 'nancy@giftawish.com',
      password: 'password123',
      emailIsVerified: true,
    });
    await user1.save();

    const user2 = new User({
      firstname: 'Bob',
      lastname: 'Smith',
      username: 'bob',
      email: 'bob@giftawish.com',
      password: 'password123',
      emailIsVerified: true,
    });
    await user2.save();

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();

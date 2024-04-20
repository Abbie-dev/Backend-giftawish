import cloudinaryConfig from './cloudinaryConfig.js'
import multer from 'multer';
import multerCloudinary from 'multer-storage-cloudinary'

//configure cloudinary storage for file uploads

const profileImageStorage = new multerCloudinary.CloudinaryStorage({
  cloudinary: cloudinaryConfig.v2,
  params: {
    folder: 'profile-images',
    format: async (req, file) => 'jpg',
  }
})

const productImageStorage = new multerCloudinary.CloudinaryStorage({
  cloudinary: cloudinaryConfig.v2,
  params: {
    folder: 'product-images',
    format: async (req, file) => 'jpg',
  }
})
//multer configuration for profile image upload 
export const profileImageUpload = multer({ storage: profileImageStorage }).single('profileImage')

export const productImageUpload = multer({ storage: productImageStorage }).array('productImages', 6)


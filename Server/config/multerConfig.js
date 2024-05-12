import cloudinaryConfig from './cloudinaryConfig.js';
import multer from 'multer';
import multerCloudinary from 'multer-storage-cloudinary';

//function to check if the file is JPEG or PNG

const isJpegOrPng = (file) => {
  return file.mimetype === 'image/jpeg' || file.mimetype === 'image/png';
};
//configure cloudinary storage for file uploads

const profileImageStorage = new multerCloudinary.CloudinaryStorage({
  cloudinary: cloudinaryConfig.v2,
  params: {
    folder: 'profile-images',
    format: async (req, file) => {
      if (isJpegOrPng(file)) {
        return null;
      }
      //reject other formats
      throw new Error('Invalid file format. Only JPEG and PNG are supported');
    },
  },
});

const productImageStorage = new multerCloudinary.CloudinaryStorage({
  cloudinary: cloudinaryConfig.v2,
  params: {
    folder: 'product-images',
    format: async (req, file) => {
      if (isJpegOrPng(file)) {
        return null;
      }
      //reject other formats
      throw new Error('Invalid file format. Only JPEG and PNG are supported');
    },
  },
});

//multer configuration for profile image upload
export const profileImageUpload = multer({
  storage: profileImageStorage,
  limits: { fileSize: 1024 * 1024 },
}).single('profileImage');

//product image upload
export const productImageUpload = multer({
  storage: productImageStorage,
  limits: { fileSize: 1024 * 1024 },
}).array('images', 6);

export const uploadIdentificationDocument = (vendorId) => {
  const identificationDocumentStorage = new multerCloudinary.CloudinaryStorage({
    cloudinary: cloudinaryConfig.v2,
    params: {
      folder: `vendor-documents/${vendorId}`,
      format: async (req, file) => {
        if (isJpegOrPng(file)) {
          return null;
        }
        //reject other formats
        throw new Error('Invalid file format. Only JPEG and PNG are supported');
      },
    },
  });
  return multer({
    storage: identificationDocumentStorage,
    limits: { fileSize: 1024 * 1024 },
  }).single('identificationDocument');
};

export const uploadBusinessRegistration = (vendorId) => {
  const businessRegistrationStorage = new multerCloudinary.CloudinaryStorage({
    cloudinary: cloudinaryConfig.v2,
    params: {
      folder: `vendor-documents/${vendorId}`,
      format: async (req, file) => {
        if (isJpegOrPng(file)) {
          return null;
        }
        //reject other formats
        throw new Error('Invalid file format. Only JPEG and PNG are supported');
      },
    },
  });
  return multer({
    storage: businessRegistrationStorage,
    limits: { fileSize: 1024 * 1024 },
  }).single('registrationCertificate');
};

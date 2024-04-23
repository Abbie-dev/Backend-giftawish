import cloudinary from 'cloudinary';
import cloudinaryConfig from '../config/cloudinaryConfig';

cloudinary.config(cloudinaryConfig.v2);

export const deleteResourcesFromCloudinary = async (folder, publicIds) => {
  try {
    const resources = publicIds.map((publicId) => `${folder}/${publicId}`);
    const deleteResult = await cloudinary.v2.uploader.remove_by_prefix(
      resources,
      { resource_type: 'image' }
    );
    console.log('Deleted resources:', deleteResult);
  } catch (error) {
    console.error('Error deleting resources from Cloudinary:', error);
  }
};

import cloudinary from '../config/cloudinaryConfig.js';

export const deleteResourcesFromCloudinary = async (folder, publicIds) => {
  try {
    const resources = publicIds.map((publicId) => `${folder}/${publicId}`);
    const deleteResult = await cloudinary.api.delete_resources(resources, {
      resource_type: 'image',
    });
    console.log('Deleted resources:', deleteResult);
  } catch (error) {
    console.error('Error deleting resources from Cloudinary:', error);
  }
};


import { uploadImage } from '../integrations/cloudinary/config';

// Function to handle image file uploads to Cloudinary
export const handleImageUpload = async (file: File): Promise<string> => {
  try {
    const imageUrl = await uploadImage(file);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

// Function to get a Cloudinary thumbnail URL with transformations
export const getImageThumbnail = (imageUrl: string, width = 100, height = 100): string => {
  if (!imageUrl) return '';
  
  if (imageUrl.includes('cloudinary')) {
    // Split URL to insert transformation
    const parts = imageUrl.split('/upload/');
    return `${parts[0]}/upload/c_fill,w_${width},h_${height}/${parts[1]}`;
  }
  
  return imageUrl;
};

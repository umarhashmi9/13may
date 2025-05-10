
// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: 'dsvyw6god',
  apiKey: '227747349747546',
  uploadPreset: 'medpulse' // You may need to create an upload preset in your Cloudinary dashboard
};

// Function to upload an image to Cloudinary
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, UploadResult } from 'firebase/storage';

/**
 * Upload an image file to Firebase Storage
 * @param file The file to upload
 * @param path Optional custom path, defaults to 'ads/{timestamp}_{filename}'
 * @returns Promise<string> The download URL of the uploaded file
 */
export const uploadImage = async (file: File, path?: string): Promise<string> => {
  try {
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
    const storagePath = path || `ads/${timestamp}_${filename}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, storagePath);
    
    // Upload the file
    const snapshot: UploadResult = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};


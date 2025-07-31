import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { 
  GetSignedUrlDto, 
  SignedUrlResponseDto, 
  DeleteFileResponseDto,
  GetUploadSignatureDto,
  UploadSignatureResponse 
} from '@/types/api';

// Hook for getting signed URL for file upload (S3 - deprecated)
export function useGetSignedUrl() {
  return useMutation({
    mutationFn: (fileInfo: GetSignedUrlDto) => apiClient.getSignedUrl(fileInfo),
    onError: (error) => {
      // Error handling is managed by the component using this hook
      throw error;
    },
  });
}

// Hook for getting Cloudinary upload signature
export function useGetUploadSignature() {
  return useMutation({
    mutationFn: (fileInfo: GetUploadSignatureDto) => apiClient.getUploadSignature(fileInfo),
    onError: (error) => {
      // Error handling is managed by the component using this hook
      throw error;
    },
  });
}

// Hook for deleting a file
export function useDeleteFile() {
  return useMutation({
    mutationFn: (key: string) => apiClient.deleteFile(key),
    onError: (error) => {
      // Error handling is managed by the component using this hook
      throw error;
    },
  });
}

// Utility function for uploading file to S3 (deprecated)
export async function uploadFileToS3(signedUrl: string, file: File): Promise<void> {
  try {
    await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  } catch (error) {
    throw new Error('Failed to upload file to S3');
  }
}

// Utility function for uploading file to Cloudinary
export async function uploadToCloudinary(
  file: File,
  uploadSignature: UploadSignatureResponse
): Promise<string> {
  const formData = new FormData();
  
  // Add the file
  formData.append('file', file);
  
  // Add Cloudinary required parameters
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
  formData.append('signature', uploadSignature.signature);
  formData.append('timestamp', uploadSignature.timestamp.toString());
  formData.append('upload_preset', uploadSignature.folder);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${uploadSignature.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    throw new Error('Failed to upload image to Cloudinary');
  }
} 
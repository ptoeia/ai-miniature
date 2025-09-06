/**
 * File validation utilities for image uploads
 */

export interface FileValidationOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  file?: File;
}

/**
 * Default validation options for image uploads
 */
export const DEFAULT_IMAGE_VALIDATION: FileValidationOptions = {
  maxSizeInMB: 5,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
};

/**
 * Validate uploaded file against specified criteria
 */
export function validateFile(file: File, options: FileValidationOptions = DEFAULT_IMAGE_VALIDATION): FileValidationResult {
  const { maxSizeInMB, allowedTypes, allowedExtensions } = { ...DEFAULT_IMAGE_VALIDATION, ...options };

  // Check file size
  if (maxSizeInMB && file.size > maxSizeInMB * 1024 * 1024) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeInMB}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    };
  }

  // Check file type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not supported. Allowed types: ${allowedTypes.map(type => type.replace('image/', '')).join(', ')}`
    };
  }

  // Check file extension as backup
  if (allowedExtensions) {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: `File extension not supported. Allowed extensions: ${allowedExtensions.join(', ')}`
      };
    }
  }

  return {
    isValid: true,
    file
  };
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get accepted file types for input element
 */
export function getAcceptedFileTypes(options: FileValidationOptions = DEFAULT_IMAGE_VALIDATION): string {
  return options.allowedTypes?.join(',') || 'image/*';
}

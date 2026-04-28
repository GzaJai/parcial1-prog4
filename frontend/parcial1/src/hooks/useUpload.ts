import { useMutation } from '@tanstack/react-query';
import { uploadService } from '../services/uploadService';

export function useUpload() {
  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadService.uploadImage(file),
    onError: (error) => {
      console.error('Error al subir imagen:', error);
    }
  });

  return {
    uploadImage: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error,
    reset: uploadMutation.reset
  };
}

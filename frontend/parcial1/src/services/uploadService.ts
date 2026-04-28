import api from './api';

export const uploadService = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<{ url: string }>('/upload/imagen/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  }
};

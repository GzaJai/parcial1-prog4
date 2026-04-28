import React, { useState } from 'react';
import { Upload, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useUpload } from '../../hooks/useUpload';
import { getImageUrl } from '../../utils/format';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ onUploadSuccess, label = "Seleccionar imagen" }: ImageUploaderProps) {
  const { uploadImage, isUploading } = useUpload();
  const [preview, setPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Crear vista previa local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setSuccess(false);
      const result = await uploadImage(file);
      onUploadSuccess(result.url);
      setSuccess(true);
    } catch (err) {
      setPreview(null);
      alert("Error al subir la imagen. Intente nuevamente.");
    }
  };

  const clearImage = () => {
    setPreview(null);
    setSuccess(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      
      <div className={`relative group border-2 border-dashed rounded-2xl transition-all duration-300 min-h-[140px] flex flex-col items-center justify-center p-4 ${
        preview 
          ? 'border-brand/30 bg-brand/5' 
          : 'border-slate-100 dark:border-slate-800 hover:border-brand bg-slate-50/50 dark:bg-slate-950/30'
      }`}>
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="text-brand animate-spin" size={32} />
            <p className="text-[10px] font-black text-brand animate-pulse tracking-widest">SUBIENDO...</p>
          </div>
        ) : preview ? (
          <div className="relative w-full flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand/20 shadow-xl shadow-brand/10">
              <img src={getImageUrl(preview)} alt="Preview" className="w-full h-full object-cover" />
            </div>
            
            {success && (
              <div className="flex items-center gap-1.5 text-brand text-[10px] font-bold uppercase animate-in zoom-in duration-300">
                <CheckCircle2 size={12} />
                Imagen cargada con éxito
              </div>
            )}

            <button 
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-3 w-full h-full py-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 group-hover:rotate-3 transition-all">
              <Upload className="text-slate-400 group-hover:text-brand" size={28} />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Click para subir</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">JPG, PNG o WEBP (Máx 5MB)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

export type ImageFolder = 'branding' | 'courses' | 'blogs' | 'recordings' | 'mentors' | 'students' | 'reviews';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: ImageFolder;
  maxDimension?: number;
  recommendedSize?: string;
  recommendedFormat?: string;
  recommendedWeight?: string;
  previewClassName?: string;
  aspectRatio?: number;
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function ImageUploader({
  label,
  value,
  onChange,
  folder = 'branding',
  maxDimension,
  recommendedSize,
  recommendedFormat,
  recommendedWeight,
  previewClassName = 'max-w-[200px] h-auto object-contain',
  aspectRatio
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine max dimension per folder if not provided explicitly
  const effectiveMaxDimension = maxDimension ?? (
    folder === 'branding' ? 400 :
    folder === 'mentors' ? 600 :
    folder === 'students' || folder === 'reviews' ? 400 :
    1200 // courses, blogs, recordings
  );

  const processImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'image/svg+xml') {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > effectiveMaxDimension || height > effectiveMaxDimension) {
            if (width > height) {
              height = Math.floor(height * (effectiveMaxDimension / width));
              width = effectiveMaxDimension;
            } else {
              width = Math.floor(width * (effectiveMaxDimension / height));
              height = effectiveMaxDimension;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas to Blob conversion failed'));
            }, 'image/webp', 0.85);
          } else {
            reject(new Error('Canvas context creation failed'));
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (file: File) => {
    setErrorMsg('');
    setSuccessMsg('');
    setProgress(0);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMsg('Unsupported format. Use PNG, JPG, WEBP, or SVG.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg('File too large. Maximum 10 MB allowed.');
      return;
    }
    if (!storage) {
      setErrorMsg('Firebase Storage is not configured.');
      return;
    }

    setIsUploading(true);
    try {
      const optimizedBlob = await processImage(file);
      const ext = file.type === 'image/svg+xml' ? 'svg' : 'webp';
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const storageRef = ref(storage, filename);
      const contentType = file.type === 'image/svg+xml' ? 'image/svg+xml' : 'image/webp';
      const uploadTask = uploadBytesResumable(storageRef, optimizedBlob, { contentType });

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        (error) => {
          console.error('Upload error:', error);
          setErrorMsg('Upload failed. Check CORS or Storage configuration.');
          setIsUploading(false);
          setProgress(0);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onChange(downloadURL);
            setSuccessMsg('Uploaded successfully');
            setTimeout(() => setSuccessMsg(''), 4000);
          } catch {
            setErrorMsg('Upload succeeded but failed to retrieve URL.');
          } finally {
            setIsUploading(false);
            setProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMsg('Failed to process or upload image.');
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="space-y-3 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">{label}</h3>
          {(recommendedSize || recommendedFormat || recommendedWeight) && (
            <div className="text-xs text-slate-500 space-y-0.5">
              {recommendedSize && <p>Recommended: {recommendedSize}</p>}
              {recommendedFormat && <p>Format: {recommendedFormat}</p>}
              {recommendedWeight && <p>Max Size: {recommendedWeight}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start pt-2">
        {value ? (
          <div className="relative group overflow-hidden border border-slate-200 rounded-lg bg-slate-50 p-2 flex items-center justify-center flex-shrink-0 min-w-[120px] min-h-[80px]">
            <img src={value} alt={label} className={previewClassName} />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                title="Replace Image"
                disabled={isUploading}
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={() => { onChange(''); setSuccessMsg(''); setErrorMsg(''); }}
                className="p-2 bg-white/20 hover:bg-red-500/80 rounded-full text-white transition-colors"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            disabled={isUploading}
            className={`w-40 h-28 border-2 border-dashed rounded-lg transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-50 ${
              isDragging
                ? 'border-[#1763B6] bg-blue-50 text-[#1763B6]'
                : 'border-slate-300 hover:border-[#1763B6] hover:bg-blue-50 text-slate-500 hover:text-[#1763B6]'
            }`}
          >
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-xs font-medium text-center px-1">
                  {isDragging ? 'Drop here' : 'Upload or Drag & Drop'}
                </span>
              </>
            )}
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".png,.jpg,.jpeg,.webp,.svg"
          className="hidden"
        />

        {isUploading && (
          <div className="flex-1 self-center space-y-2 min-w-[160px]">
            <div className="flex items-center justify-between text-sm font-medium text-[#1763B6]">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1763B6] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {successMsg && !isUploading && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 self-center">
            <CheckCircle className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && !isUploading && (
          <div className="flex items-center gap-2 self-center">
            <div className="flex items-center gap-1.5 text-sm font-medium text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => { setErrorMsg(''); fileInputRef.current?.click(); }}
              className="text-xs font-semibold text-[#1763B6] hover:underline ml-1"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

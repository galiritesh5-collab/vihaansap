import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../../config/firebase';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  recommendedSize?: string;
  recommendedFormat?: string;
  recommendedWeight?: string;
  previewClassName?: string;
  aspectRatio?: number;
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function ImageUploader({
  label,
  value,
  onChange,
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize raster images on a canvas, keeping aspect ratio
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

          // Scale down if larger than 1600px on either side
          const maxDim = 1600;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.floor(height * (maxDim / width));
              width = maxDim;
            } else {
              width = Math.floor(width * (maxDim / height));
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas to Blob conversion failed'));
              }
            }, 'image/webp', 0.85);
          } else {
            reject(new Error('Canvas context creation failed'));
          }
        };
        img.onerror = () => reject(new Error('Failed to load image for processing'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setSuccessMsg('');
    setProgress(0);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMsg('Unsupported format. Use PNG, JPG, WEBP, or SVG.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg('File too large. Maximum 5 MB allowed.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);

    try {
      // Verify Firebase Storage is initialized
      if (!storage) {
        setErrorMsg('Firebase Storage is not configured. Check your environment variables.');
        setIsUploading(false);
        return;
      }

      // Step 2: Process/optimize image
      const optimizedBlob = await processImage(file);
      const ext = file.type === 'image/svg+xml' ? 'svg' : 'webp';
      const filename = `branding/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const storageRef = ref(storage, filename);

      // Step 3: Upload with progress
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
            setSuccessMsg('Logo uploaded successfully');
            setTimeout(() => setSuccessMsg(''), 4000);
          } catch (urlError) {
            console.error('Failed to get download URL:', urlError);
            setErrorMsg('Upload succeeded but failed to retrieve URL.');
          } finally {
            setIsUploading(false);
            setProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }
        }
      );
    } catch (error) {
      console.error('Upload process initialization error:', error);
      setErrorMsg('Failed to process or authenticate upload.');
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
            disabled={isUploading}
            className="w-40 h-28 border-2 border-dashed border-slate-300 rounded-lg hover:border-[#1763B6] hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-[#1763B6] disabled:opacity-50"
          >
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-xs font-medium">Upload Image</span>
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
          <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 self-center animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && !isUploading && (
          <div className="flex items-center gap-2 self-center animate-in fade-in">
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

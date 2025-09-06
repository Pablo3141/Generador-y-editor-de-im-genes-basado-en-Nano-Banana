
import React, { useCallback, useRef } from 'react';
import { ImageData } from '../types';

interface UploadAreaProps {
  id: string;
  image: ImageData | null;
  setImage: (image: ImageData | null) => void;
  text: string;
  subtext?: string;
}

const UploadArea: React.FC<UploadAreaProps> = ({ id, image, setImage, text, subtext }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setImage({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  return (
    <div 
        className="upload-area w-full h-full bg-slate-700 border-2 border-dashed border-slate-500 rounded-lg flex items-center justify-center text-center p-4 cursor-pointer hover:border-indigo-500 hover:bg-slate-600/50 transition relative overflow-hidden"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
      <input
        type="file"
        id={id}
        ref={inputRef}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      {image ? (
        <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Preview" className="image-preview absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center text-slate-400">
          <div className="text-3xl mb-1">📁</div>
          <p className="font-semibold text-sm">{text}</p>
          {subtext && <p className="upload-text text-xs mt-1">{subtext}</p>}
        </div>
      )}
    </div>
  );
};

export default UploadArea;

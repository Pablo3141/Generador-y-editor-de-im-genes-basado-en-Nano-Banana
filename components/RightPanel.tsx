import React from 'react';
import { ImageData, Mode } from '../types';

interface RightPanelProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  setPrompt: (prompt: string) => void;
  setImage1: (image: ImageData | null) => void;
  setGeneratedImage: (image: string | null) => void;
  setMode: (mode: Mode) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ 
  generatedImage, isLoading, error, setPrompt, setImage1, setGeneratedImage, setMode 
}) => {
  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImage}`;
    link.download = `ai_image_${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const editCurrentImage = () => {
    if (!generatedImage) return;
    setImage1({ base64: generatedImage, mimeType: 'image/png' });
    setMode(Mode.Edit);
  }

  const newImage = () => {
    setGeneratedImage(null);
    setPrompt('');
    setImage1(null);
    setMode(Mode.Create);
  }

  return (
    <div className="flex-1 p-6 flex items-center justify-center bg-slate-900">
      <div className="w-full h-full max-w-2xl max-h-[80vh] flex flex-col items-center justify-center relative">
        {isLoading && (
          <div id="loadingContainer" className="text-center">
            <div className="loading-spinner w-16 h-16 border-4 border-t-indigo-500 border-slate-600 rounded-full animate-spin mx-auto"></div>
            <p className="loading-text text-slate-300 mt-4">Generando tu imagen...</p>
          </div>
        )}

        {!isLoading && !generatedImage && (
          <div id="resultPlaceholder" className="text-center text-slate-500">
            <div className="result-placeholder-icon text-7xl">🎨</div>
            <p className="mt-4 text-xl">Tu obra de arte aparecerá aquí</p>
          </div>
        )}

        {error && !isLoading && (
           <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg">
             <div className="text-5xl mb-4">😢</div>
             <h3 className="font-bold mb-2">Ocurrió un error</h3>
             <p className="text-sm">{error}</p>
           </div>
        )}

        {!isLoading && generatedImage && (
          <div id="imageContainer" className="w-full h-full flex flex-col items-center justify-center">
            <img 
              id="generatedImage" 
              src={`data:image/png;base64,${generatedImage}`} 
              alt="Generated Art" 
              className="generated-image object-contain w-full h-full rounded-lg shadow-2xl"
            />
            <div className="image-actions mt-4 flex space-x-3 bg-slate-800 p-2 rounded-lg">
               <button className="action-btn text-2xl p-2 rounded-md hover:bg-slate-700 transition" title="Nueva Imagen" onClick={newImage}>✨</button>
               <button className="action-btn text-2xl p-2 rounded-md hover:bg-slate-700 transition" title="Editar" onClick={editCurrentImage}>✏️</button>
               <button className="action-btn text-2xl p-2 rounded-md hover:bg-slate-700 transition" title="Descargar" onClick={downloadImage}>💾</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
import React, { useState, useEffect } from 'react';
import { Mode, CreateFunction, EditFunction, ImageData, AspectRatio } from '../types';
import FunctionCard from './FunctionCard';
import UploadArea from './UploadArea';
import { Spinner } from './Spinner';

interface LeftPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  createFunction: CreateFunction;
  setCreateFunction: (func: CreateFunction) => void;
  editFunction: EditFunction;
  setEditFunction: (func: EditFunction) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  image1: ImageData | null;
  setImage1: (image: ImageData | null) => void;
  image2: ImageData | null;
  setImage2: (image: ImageData | null) => void;
  isLoading: boolean;
  onGenerate: () => void;
  clearImages: () => void;
}

const createFunctions = [
  { id: CreateFunction.Free, icon: '✨', name: 'Prompt' },
  { id: CreateFunction.Sticker, icon: '🏷️', name: 'Stickers' },
  { id: CreateFunction.Text, icon: '📝', name: 'Logo' },
  { id: CreateFunction.Comic, icon: '💭', name: 'Cómic' },
];

const editFunctions = [
  { id: EditFunction.AddRemove, icon: '➕', name: 'Añadir/Quitar' },
  { id: EditFunction.Retouch, icon: '🎯', name: 'Retocar' },
  { id: EditFunction.Style, icon: '🎨', name: 'Estilo' },
  { id: EditFunction.Compose, icon: '🖼️', name: 'Combinar' },
];

const aspectRatios: { value: AspectRatio, label: string }[] = [
    { value: '1:1', label: '1:1' },
    { value: '16:9', label: '16:9' },
    { value: '9:16', label: '9:16' },
    { value: '4:3', label: '4:3' },
    { value: '3:4', label: '3:4' },
];

const LeftPanel: React.FC<LeftPanelProps> = ({
  prompt, setPrompt, mode, setMode, createFunction, setCreateFunction,
  editFunction, setEditFunction, aspectRatio, setAspectRatio, image1, setImage1, image2, setImage2,
  isLoading, onGenerate, clearImages
}) => {
  const [showComposeUploads, setShowComposeUploads] = useState(false);

  useEffect(() => {
    if (mode === Mode.Create) {
      clearImages();
      setShowComposeUploads(false);
    } else {
      if (editFunction !== EditFunction.Compose) {
        setShowComposeUploads(false);
      }
    }
  }, [mode, editFunction, clearImages]);
  
  const handleEditFunctionSelect = (func: EditFunction) => {
    setEditFunction(func);
    if (func === EditFunction.Compose) {
      setShowComposeUploads(true);
    } else {
      setShowComposeUploads(false);
    }
  };

  const needsImageUpload = mode === Mode.Edit && !showComposeUploads;

  return (
    <div className="w-full md:w-[400px] bg-slate-800 p-6 flex flex-col space-y-6 md:h-screen md:overflow-y-auto shrink-0">
      <header>
        <h1 className="text-2xl font-bold text-white">🎨 AI Image Studio</h1>
        <p className="text-slate-400">Generador profesional de imágenes</p>
      </header>

      <div className="prompt-section">
        <label className="section-title text-slate-300 font-semibold mb-2 block">💭 Describe tu idea</label>
        <textarea
          id="prompt"
          className="prompt-input w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 h-28 resize-none"
          placeholder="Describe la imagen que deseas crear..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="mode-toggle grid grid-cols-2 gap-2 bg-slate-700 p-1 rounded-lg">
        <button
          className={`mode-btn py-2 px-4 rounded-md text-sm font-semibold transition ${mode === Mode.Create ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-600'}`}
          onClick={() => setMode(Mode.Create)}
        >
          Crear
        </button>
        <button
          className={`mode-btn py-2 px-4 rounded-md text-sm font-semibold transition ${mode === Mode.Edit ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-600'}`}
          onClick={() => setMode(Mode.Edit)}
        >
          Editar
        </button>
      </div>

      {mode === Mode.Create && (
        <>
          <div className="aspect-ratio-section">
             <label className="section-title text-slate-300 font-semibold mb-2 block">📐 Relación de Aspecto</label>
             <div className="grid grid-cols-5 gap-2">
                {aspectRatios.map((ratio) => (
                    <button 
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      className={`py-2 px-1 text-xs font-semibold rounded-md transition ${aspectRatio === ratio.value ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    >
                        {ratio.label}
                    </button>
                ))}
             </div>
          </div>
          <div id="createFunctions" className="functions-section">
            <div className="functions-grid grid grid-cols-2 gap-3">
              {createFunctions.map((func) => (
                <FunctionCard
                  key={func.id}
                  icon={func.icon}
                  name={func.name}
                  isActive={createFunction === func.id}
                  onClick={() => setCreateFunction(func.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {mode === Mode.Edit && !showComposeUploads && (
        <div id="editFunctions" className="functions-section">
          <div className="functions-grid grid grid-cols-2 gap-3">
            {editFunctions.map((func) => (
              <FunctionCard
                key={func.id}
                icon={func.icon}
                name={func.name}
                isActive={editFunction === func.id}
                onClick={() => handleEditFunctionSelect(func.id)}
              />
            ))}
          </div>
        </div>
      )}

      {showComposeUploads && (
        <div id="twoImagesSection" className="functions-section bg-slate-700/50 p-4 rounded-lg">
           <h3 className="section-title text-slate-300 font-semibold mb-3 text-center">📸 Se necesitan dos imágenes</h3>
           <div className="grid grid-cols-2 gap-3 mb-4">
              <UploadArea id="imageUpload1" image={image1} setImage={setImage1} text="Primera imagen"/>
              <UploadArea id="imageUpload2" image={image2} setImage={setImage2} text="Segunda imagen"/>
           </div>
           <p className="text-xs text-slate-400 text-center mb-4">La primera imagen será editada. La segunda sirve como referencia de estilo o contenido para tu descripción.</p>
           <button className="back-btn w-full text-center text-sm text-indigo-400 hover:text-indigo-300" onClick={() => setShowComposeUploads(false)}>
             ← Volver a edición
           </button>
        </div>
      )}

      {needsImageUpload && (
         <div className="dynamic-content">
           <UploadArea id="imageUpload" image={image1} setImage={setImage1} text="Haz clic o arrastra una imagen" subtext="PNG, JPG, WebP (máx. 10 MB)"/>
         </div>
      )}
      
      <div className="flex-grow"></div>

      <button
        id="generateBtn"
        className="generate-btn w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition duration-200 disabled:bg-slate-500 disabled:cursor-not-allowed"
        onClick={onGenerate}
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : <span className="btn-text">🚀 Generar Imagen</span>}
      </button>
    </div>
  );
};

export default LeftPanel;

import React, { useState, useCallback } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import { Mode, CreateFunction, EditFunction, ImageData, AspectRatio } from './types';
import { generateImage, editImage } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [mode, setMode] = useState<Mode>(Mode.Create);
  const [createFunction, setCreateFunction] = useState<CreateFunction>(CreateFunction.Free);
  const [editFunction, setEditFunction] = useState<EditFunction>(EditFunction.AddRemove);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [image1, setImage1] = useState<ImageData | null>(null);
  const [image2, setImage2] = useState<ImageData | null>(null);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      let finalPrompt = prompt;
      let resultBase64: string;

      if (mode === Mode.Create) {
        switch (createFunction) {
          case CreateFunction.Sticker:
            finalPrompt = `sticker of ${prompt}, white background, die-cut`;
            break;
          case CreateFunction.Text:
            finalPrompt = `a professional logo featuring the text "${prompt}", vector art, minimalist design`;
            break;
          case CreateFunction.Comic:
            finalPrompt = `a comic book style panel showing ${prompt}, dynamic action, vibrant colors`;
            break;
        }
        if (!finalPrompt) {
          throw new Error("El campo de descripción no puede estar vacío.");
        }
        resultBase64 = await generateImage(finalPrompt, aspectRatio);
      } else { // Mode.Edit
        if (!image1) {
          throw new Error("Por favor, sube una imagen para editar.");
        }
        if (editFunction === EditFunction.Compose && !prompt) {
           finalPrompt = "Combine the style or subject of the second image with the first image.";
        }
        if (!finalPrompt) {
          throw new Error("El campo de descripción no puede estar vacío para esta función de edición.");
        }
        resultBase64 = await editImage(finalPrompt, image1);
      }

      setGeneratedImage(resultBase64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, mode, createFunction, editFunction, image1, aspectRatio]);

  const clearImages = () => {
    setImage1(null);
    setImage2(null);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col md:flex-row">
      <LeftPanel
        prompt={prompt}
        setPrompt={setPrompt}
        mode={mode}
        setMode={setMode}
        createFunction={createFunction}
        setCreateFunction={setCreateFunction}
        editFunction={editFunction}
        setEditFunction={setEditFunction}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        image1={image1}
        setImage1={setImage1}
        image2={image2}
        setImage2={setImage2}
        isLoading={isLoading}
        onGenerate={handleGenerate}
        clearImages={clearImages}
      />
      <RightPanel
        generatedImage={generatedImage}
        isLoading={isLoading}
        error={error}
        setPrompt={setPrompt}
        setImage1={setImage1}
        setGeneratedImage={setGeneratedImage}
        setMode={setMode}
      />
    </div>
  );
};

export default App;

import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { ImageData, AspectRatio } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png',
      aspectRatio: aspectRatio,
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return base64ImageBytes;
  }
  throw new Error("Failed to generate image.");
};

export const editImage = async (prompt: string, image: ImageData): Promise<string> => {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: image.base64,
            mimeType: image.mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
  
  // Fallback or error if no image is returned
  const textResponse = response.text;
  if (textResponse.includes("don't have the ability to help with that")) {
     throw new Error("El modelo no pudo realizar la edición solicitada. Intenta con una descripción diferente.");
  }
  throw new Error(`La edición de la imagen falló. Respuesta del modelo: ${textResponse}`);
};

// Types for Gemini API

export interface GeminiTextPart {
  text: string;
}

export interface GeminiImagePart {
  inline_data: {
    mime_type: string;
    data: string;
  };
}

export type GeminiPart = GeminiTextPart | GeminiImagePart;

export interface GeminiContent {
  parts: GeminiPart[];
}

export interface GeminiRequest {
  contents: GeminiContent[];
}

export interface GeminiCandidate {
  content: {
    parts: GeminiPart[];
  };
  finishReason: string;
  index: number;
  safetyRatings: any[];
}

export interface GeminiResponse {
  candidates: GeminiCandidate[];
  promptFeedback?: any;
}
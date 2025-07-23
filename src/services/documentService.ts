// Document processing service
import { truncateDocumentContent } from '@/utils/documentUtils';

// Get API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=" + GEMINI_API_KEY;

// Process document with LLM and get a short description
export async function processDocumentWithLLM(documentContent: string): Promise<string> {
  console.log("Processing document with LLM, content length:", documentContent.length);
  
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key not set");
    return "API key not set. Please set VITE_GEMINI_API_KEY in your .env file.";
  }
  
  // Truncate document content if it's too large
  const processedContent = truncateDocumentContent(documentContent);

  try {
    // Create system prompt
    const systemPrompt = {
      role: 'model',
      parts: [{ text: `You are an intelligent document analyzer. Read the document carefully and provide a very concise 2-3 sentence summary of what it's about. Be specific about the document's main topic and purpose.` }]
    };

    // Create user message with document content
    const userMessage = {
      role: 'user',
      parts: [{ text: `Please read this document and provide a brief description of what it's about: \n\n${processedContent}` }]
    };

    // Create request body
    const requestBody = {
      contents: [systemPrompt, userMessage]
    };

    // Make API call
    console.log("Sending request to Gemini API");
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log("Received response from Gemini API:", data);
    const description = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (description) {
      return description;
    } else {
      return "Unable to generate document description.";
    }
  } catch (error) {
    console.error("Error processing document:", error);
    return "Error processing document. Please try again.";
  }
}
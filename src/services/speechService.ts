// Speech service using ElevenLabs API for better AI voices

// Get API key from environment variables
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Log that the API key is configured
console.log('ElevenLabs API key configured:', ELEVENLABS_API_KEY ? 'Yes' : 'No');

// Default voice ID for ElevenLabs (Rachel - a natural female voice)
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

/**
 * Speaks text using ElevenLabs API
 * @param text Text to speak
 * @param voiceId Voice ID to use (optional)
 */
export async function speakWithAI(text: string, voiceId: string = DEFAULT_VOICE_ID): Promise<void> {
  // Clean text for speech
  const cleanText = text.replace(/[*#`]/g, '').replace(/\n+/g, ' ');
  
  // If no API key, fall back to browser's speech synthesis
  if (!ELEVENLABS_API_KEY) {
    console.warn('ElevenLabs API key not set, falling back to browser speech synthesis');
    speakWithBrowser(cleanText);
    return;
  }
  
  console.log('Using ElevenLabs AI voice:', voiceId);
  
  try {
    // Call ElevenLabs API
    const response = await fetch(`${ELEVENLABS_API_URL}/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }
    
    // Get audio blob
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Play audio
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error('Error using ElevenLabs TTS:', error);
    // Fall back to browser's speech synthesis
    speakWithBrowser(cleanText);
  }
}

/**
 * Speaks text using browser's speech synthesis
 * @param text Text to speak
 */
export function speakWithBrowser(text: string): void {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
}

/**
 * Stops any ongoing speech
 */
export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}
import { useState, useEffect } from 'react';
import { Volume2, VolumeX, MessageSquare, Minimize2, Maximize2, Send, Scissors } from 'lucide-react';
import { VoiceSelector } from '@/components/VoiceSelector';
import { ScreenshotCapture } from '@/components/ScreenshotCapture';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { truncateDocumentContent } from '@/utils/documentUtils';
import { renderMarkdown } from '@/utils/markdownUtils';
import { speakWithAI, stopSpeech } from '@/services/speechService';
import '@/styles/markdown.css';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  imageData?: string;
}

interface AIExplanationPanelProps {
  selectedText: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  documentContent?: string;
  documentDescription?: string;
}

export const AIExplanationPanel = ({ 
  selectedText, 
  isVisible, 
  onToggleVisibility,
  documentContent,
  documentDescription 
}: AIExplanationPanelProps) => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScreenshotTool, setShowScreenshotTool] = useState(false);
  const [processedDocContent, setProcessedDocContent] = useState<string | undefined>(undefined);
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM'); // Default voice (Rachel)
  
  // Process document content once when it's available
  useEffect(() => {
    if (documentContent && !processedDocContent) {
      const processed = truncateDocumentContent(documentContent);
      setProcessedDocContent(processed);
      console.log("Document content processed and stored for AI context");
    }
  }, [documentContent, processedDocContent]);

  // Add welcome message when panel first opens
  useEffect(() => {
    if (isVisible && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'ai',
        content: 'Hello! I\'m your AI learning assistant. I\'m analyzing your document and will provide a brief description of what it\'s about. You can highlight specific text for explanations, take screenshots of visual elements, or ask questions about any part of the document. I\'ll provide concise, relevant answers with references to related sections when helpful. I\'ll remember our conversation, so feel free to ask follow-up questions!',
        timestamp: new Date()
      }]);
    }
  }, [isVisible, messages.length]);

  // Auto-explain selected text
  useEffect(() => {
    if (selectedText && selectedText.length > 10) {
      handleTextExplanation(selectedText);
    }
  }, [selectedText]);
  
  // Send document content to AI when first loaded
  useEffect(() => {
    if (messages.length === 1) { // Only the welcome message exists
      try {
        // If we already have a description, use it
        if (documentDescription) {
          // Add an AI message with the description
          const descriptionMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: `I've analyzed your document. Here's what it's about:\n\n${documentDescription}\n\n**Ask me any questions** about the content.`,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, descriptionMessage]);
        } else if (documentContent) {
          // If no description but we have content, get a description
          setIsLoading(true);
          
          // Process content safely and store for reuse
          const processedContent = truncateDocumentContent(documentContent);
          setProcessedDocContent(processedContent);
          
          // Request a description directly
          const descriptionPrompt = "Please provide a very short description (2-3 sentences) of what this document is about: \n\n" + processedContent;
          
          // Fetch request with document context
          fetch("https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=" + import.meta.env.VITE_GEMINI_API_KEY, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "model",
                  parts: [{ text: "You are an intelligent document analyzer. Read the document carefully and provide a concise 2-3 sentence summary of what it's about. Format important terms using **bold text**." }]
                },
                {
                  role: "user",
                  parts: [{ text: descriptionPrompt }]
                }
              ]
            })
          })
          .then(res => res.json())
          .then(data => {
            const description = data?.candidates?.[0]?.content?.parts?.[0]?.text || "This is a document that contains information you can ask me about.";
            
            const descriptionMessage: Message = {
              id: Date.now().toString(),
              type: 'ai',
              content: `I've analyzed your document. Here's what it's about:\n\n${description}\n\n**Ask me any questions** about the content.`,
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, descriptionMessage]);
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error getting document description:', error);
            setIsLoading(false);
            
            // Add fallback message
            const fallbackMessage: Message = {
              id: Date.now().toString(),
              type: 'ai',
              content: "I've analyzed your document. **Ask me any questions** about the content.",
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, fallbackMessage]);
          });
        }
      } catch (error) {
        console.error('Error in document processing:', error);
        setIsLoading(false);
      }
    }
  }, [documentContent, documentDescription, messages.length]);

  // Gemini API call function - now includes document content in every request
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=" + GEMINI_API_KEY;

  async function fetchGeminiResponse(question: string, imageData?: string) {
    if (!GEMINI_API_KEY) {
      return "[Gemini API key not set. Please set VITE_GEMINI_API_KEY in your .env file.]";
    }
    try {
      // Add system prompt with document content
      const systemPrompt = {
        role: 'model',
        parts: [{ text: `You are an intelligent document tutor. Here is the document content you should remember and use to answer questions:\n\n${processedDocContent || (documentContent ? truncateDocumentContent(documentContent) : 'No document content available.')}\n\nWhen answering questions:\n1. Always refer to the document content above\n2. Be specific and cite relevant parts of the document\n3. Keep answers concise but informative\n4. Use bullet points when appropriate\n5. Format important headings and key points using **bold text**\n6. Use markdown formatting for better readability (e.g., **bold**, *italic*, # headers, - bullet points)` }]
      };
      
      // Convert previous messages for context
      const previousMessages = messages.slice(-3).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      // Current question
      const currentMessage = {
        role: 'user',
        parts: [{ text: question }]
      };
      
      // Complete request with system prompt and conversation history
      const requestBody = {
        contents: [systemPrompt, ...previousMessages, currentMessage]
      };
      
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      
      const data = await res.json();
      const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (geminiText) return geminiText;
      return `[No response from Gemini. Please try again.]`;
    } catch (err) {
      return `[Gemini API error. Please try again.]`;
    }
  }

  const handleTextExplanation = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Please explain this text: "${text}"`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Gemini API call
    const aiText = await fetchGeminiResponse(userMessage.content);
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);

    // If voice mode is enabled, speak the response
    if (isVoiceMode) {
      speakText(aiResponse.content);
    }
  };

  const handleSendQuestion = async (imageData?: string) => {
    if (!currentQuestion.trim() && !imageData) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentQuestion || "Please analyze this screenshot:",
      timestamp: new Date(),
      imageData: imageData
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentQuestion('');
    setIsLoading(true);
    setShowScreenshotTool(false);

    // Gemini API call
    const aiText = await fetchGeminiResponse(userMessage.content, imageData);
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);

    if (isVoiceMode) {
      speakText(aiResponse.content);
    }
  };

  const speakText = (text: string) => {
    // Use the AI speech service with selected voice
    speakWithAI(text, selectedVoice);
    
    // Find the voice name for the notification
    const voiceName = [
      { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
      { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella' },
      { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli' },
      { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh' },
      { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold' },
      { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },
    ].find(v => v.id === selectedVoice)?.name || 'AI';
    
    // Add a message to show which voice is being used
    setMessages(prev => [...prev, {
      id: Date.now().toString() + '-voice',
      type: 'ai',
      content: `*Speaking with ${voiceName}'s voice...*`,
      timestamp: new Date()
    }]);
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (isVoiceMode) {
      stopSpeech();
    }
  };
  
  const handleImageCapture = (imageData: string) => {
    handleSendQuestion(imageData);
  };
  
  const toggleScreenshotTool = () => {
    setShowScreenshotTool(!showScreenshotTool);
  };

  if (!isVisible) return null;

  return (
    <Card className={`h-full flex flex-col shadow-learning ${isMinimized ? 'max-h-16' : ''}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold bg-gradient-learning bg-clip-text text-transparent">
            AI Learning Assistant
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoiceMode}
              className={isVoiceMode ? 'bg-primary-soft text-primary' : ''}
            >
              {isVoiceMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </Button>
          </div>
        </div>
        {!isMinimized && (
          <div>
            <p className="text-sm text-muted-foreground">
              {isVoiceMode ? 'Voice explanations enabled' : 'Text explanations mode'}
            </p>
            {isVoiceMode && (
              <VoiceSelector 
                selectedVoice={selectedVoice}
                onChange={setSelectedVoice}
              />
            )}
          </div>
        )}
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 flex flex-col p-4 pt-2 overflow-hidden">
            <ScrollArea className="flex-1 h-0 pr-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                      max-w-[85%] p-3 rounded-lg text-sm
                      ${message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground border'
                      }
                    `}>
                      <div 
                        className="whitespace-pre-wrap markdown-content" 
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                      ></div>
                      {message.imageData && (
                        <div className="mt-2 mb-2">
                          <img 
                            src={message.imageData} 
                            alt="Screenshot" 
                            className="max-w-full rounded border border-border"
                          />
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground border p-3 rounded-lg text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span>AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            {showScreenshotTool ? (
              <div className="mb-4">
                <ScreenshotCapture onImageCapture={handleImageCapture} />
              </div>
            ) : (
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Ask a question about your document..."
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendQuestion();
                    }
                  }}
                  className="flex-1 min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <div className="flex flex-col space-y-2 self-end">
                  <Button
                    onClick={toggleScreenshotTool}
                    variant="outline"
                    size="sm"
                    title="Capture and analyze a screenshot"
                    disabled={isLoading}
                  >
                    <Scissors size={16} />
                  </Button>
                  <Button
                    onClick={() => handleSendQuestion()}
                    disabled={!currentQuestion.trim() || isLoading}
                    variant="learning"
                    size="sm"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};
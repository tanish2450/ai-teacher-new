import { useState, useEffect } from 'react';
import { Volume2, VolumeX, MessageSquare, Minimize2, Maximize2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIExplanationPanelProps {
  selectedText: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  documentContent?: string;
}

export const AIExplanationPanel = ({ 
  selectedText, 
  isVisible, 
  onToggleVisibility,
  documentContent 
}: AIExplanationPanelProps) => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Add welcome message when panel first opens
  useEffect(() => {
    if (isVisible && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'ai',
        content: 'Hello! I\'m your AI learning assistant. I\'ve analyzed your document and I\'m ready to help explain any concepts, answer questions, or provide detailed explanations about any text you highlight. Just select some text or ask me a question!',
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

  // Gemini API call function
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY;

  async function fetchGeminiResponse(question: string) {
    if (!GEMINI_API_KEY) {
      return "[Gemini API key not set. Please set VITE_GEMINI_API_KEY in your .env file.]";
    }
    try {
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }]
        })
      });
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "[No response from Gemini]";
    } catch (err) {
      return `[Gemini API error: ${err}]`;
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

  const handleSendQuestion = async () => {
    if (!currentQuestion.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentQuestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentQuestion('');
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

    if (isVoiceMode) {
      speakText(aiResponse.content);
    }
  };

  const speakText = (text: string) => {
    // Remove markdown formatting for speech
    const cleanText = text.replace(/[*#`]/g, '').replace(/\n+/g, ' ');
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (isVoiceMode) {
      speechSynthesis.cancel();
    }
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
          <p className="text-sm text-muted-foreground">
            {isVoiceMode ? 'Voice explanations enabled' : 'Text explanations mode'}
          </p>
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
                      <div className="whitespace-pre-wrap">{message.content}</div>
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
              <Button
                onClick={handleSendQuestion}
                disabled={!currentQuestion.trim() || isLoading}
                variant="learning"
                size="sm"
                className="self-end"
              >
                <Send size={16} />
              </Button>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};
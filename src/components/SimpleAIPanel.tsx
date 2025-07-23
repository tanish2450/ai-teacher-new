import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send } from 'lucide-react';
import { truncateDocumentContent } from '@/utils/documentUtils';

// Get API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=" + GEMINI_API_KEY;

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface SimpleAIPanelProps {
  documentContent?: string;
  documentDescription?: string;
  selectedText?: string;
}

export const SimpleAIPanel = ({ 
  documentContent,
  documentDescription,
  selectedText
}: SimpleAIPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Add welcome message when panel first opens
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'ai',
        content: 'Hello! I\'m your AI learning assistant. Ask me any questions about your document.',
        timestamp: new Date()
      }]);
    }
  }, []);

  // Add document description when available
  useEffect(() => {
    if (messages.length === 1 && documentDescription) {
      const descriptionMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `I've analyzed your document. Here's what it's about:\n\n${documentDescription}\n\nYou can ask me any questions about the content.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, descriptionMessage]);
    }
  }, [documentDescription, messages.length]);

  // Handle selected text
  useEffect(() => {
    if (selectedText && selectedText.length > 10) {
      handleTextExplanation(selectedText);
    }
  }, [selectedText]);

  // Send document content to AI
  useEffect(() => {
    if (messages.length === 1 && documentContent && !documentDescription) {
      setIsLoading(true);
      
      try {
        // Process content safely
        const processedContent = truncateDocumentContent(documentContent);
        
        // Request a description
        const descriptionPrompt = "Please provide a very short description (2-3 sentences) of what this document is about: \n\n" + processedContent;
        
        fetchGeminiResponse(descriptionPrompt).then(description => {
          const descriptionMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: `I've analyzed your document. Here's what it's about:\n\n${description}\n\nYou can ask me any questions about the content.`,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, descriptionMessage]);
          setIsLoading(false);
        }).catch(error => {
          console.error('Error getting document description:', error);
          setIsLoading(false);
          
          // Add fallback message
          const fallbackMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: "I've analyzed your document. You can ask me any questions about the content.",
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, fallbackMessage]);
        });
      } catch (error) {
        console.error('Error processing document:', error);
        setIsLoading(false);
      }
    }
  }, [documentContent, documentDescription, messages.length]);

  async function fetchGeminiResponse(question: string) {
    if (!GEMINI_API_KEY) {
      return "[Gemini API key not set. Please set VITE_GEMINI_API_KEY in your .env file.]";
    }
    
    try {
      // Add system prompt to guide the AI's responses
      const systemPrompt = {
        role: 'model',
        parts: [{ text: `You are an intelligent document tutor. When answering questions about the document:

1. Read the entire document carefully to understand the context.
2. When asked to provide a description of the document, give a very concise 2-3 sentence summary of what the document is about.
3. When answering questions about specific parts, make references to other relevant sections of the document to provide a complete understanding.
4. Keep your answers concise and to the point - not too long that they become overwhelming, but not too short that they lack necessary detail.
5. Use bullet points or numbered lists when appropriate to organize information.
6. If the document contains technical content, explain it in clear, accessible language.
7. When referencing specific parts of the document, mention the section or page number if available.
8. Be precise and accurate in your responses.

Now, please help the user understand their document.` }]
      };
      
      // Convert previous messages to Gemini format
      const previousMessages = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      // Current message
      const currentMessage = {
        role: 'user',
        parts: [{ text: question }]
      };
      
      // Combine all messages
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
      return `[No response from Gemini. Full response: ${JSON.stringify(data)}]`;
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
    try {
      const aiText = await fetchGeminiResponse(userMessage.content);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
    try {
      const aiText = await fetchGeminiResponse(userMessage.content);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-learning">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-semibold bg-gradient-learning bg-clip-text text-transparent">
          AI Learning Assistant
        </CardTitle>
      </CardHeader>

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
    </Card>
  );
};
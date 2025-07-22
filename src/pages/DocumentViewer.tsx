import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDFViewer } from '@/components/PDFViewer';
import { AIExplanationPanel } from '@/components/AIExplanationPanel';
import { Card } from '@/components/ui/card';

export const DocumentViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, content } = location.state || {};
  
  const [selectedText, setSelectedText] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(true);

  if (!file) {
    navigate('/');
    return null;
  }

  const handleTextSelect = (text: string) => {
    setSelectedText(text);
    if (!showAIPanel) {
      setShowAIPanel(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-16 border-b bg-card flex items-center px-6 shadow-soft">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Upload
          </Button>
          <div className="h-6 w-px bg-border" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Home size={20} className="mr-2" />
            AI Learning Assistant
          </Button>
        </div>

        <div className="flex-1" />

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground mr-4">
            {file.name}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIPanel(!showAIPanel)}
            className={showAIPanel ? 'bg-primary-soft text-primary' : ''}
          >
            {showAIPanel ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="ml-2">{showAIPanel ? 'Hide' : 'Show'} AI Assistant</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer - Takes up 70% of the width */}
        <div className={`${showAIPanel ? 'w-[70%]' : 'w-full'} border-r bg-background transition-all duration-300`}>
          {file.type === 'application/pdf' ? (
            <PDFViewer 
              file={file} 
              onTextSelect={handleTextSelect} 
            />
          ) : (
            <div className="h-full p-6 overflow-auto">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-learning bg-clip-text text-transparent">
                  {file.name}
                </h2>
                <div 
                  className="prose max-w-none text-foreground leading-relaxed"
                  onMouseUp={() => {
                    const selection = window.getSelection();
                    if (selection && selection.toString().trim()) {
                      handleTextSelect(selection.toString().trim());
                    }
                  }}
                  style={{ userSelect: 'text' }}
                >
                  {typeof content === 'string' ? (
                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name?.endsWith('.docx') ? (
                      <div className="whitespace-pre-wrap leading-relaxed text-base">{content}</div>
                    ) : (
                      <pre className="whitespace-pre-wrap font-sans">{content}</pre>
                    )
                  ) : (
                    <p>Unable to display file content</p>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* AI Explanation Panel - Takes up 30% of the width */}
        {showAIPanel && (
          <div className="w-[30%] bg-background">
            <AIExplanationPanel
              selectedText={selectedText}
              isVisible={showAIPanel}
              onToggleVisibility={() => setShowAIPanel(!showAIPanel)}
              documentContent={typeof content === 'string' ? content : undefined}
            />
          </div>
        )}
      </div>

      {/* Footer with quick info */}
      <footer className="h-10 border-t bg-card flex items-center px-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>💡 Highlight any text to get AI explanations</span>
          <div className="h-4 w-px bg-border" />
          <span>🎯 Ask questions in the AI panel</span>
          <div className="h-4 w-px bg-border" />
          <span>🔊 Toggle voice mode for audio explanations</span>
        </div>
      </footer>
    </div>
  );
};
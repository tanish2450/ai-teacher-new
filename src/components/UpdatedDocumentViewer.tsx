import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDFViewer } from '@/components/PDFViewer';
import { AIExplanationPanel } from '@/components/AIExplanationPanelFix';
import { Card } from '@/components/ui/card';

export const DocumentViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, content, description: initialDescription } = location.state || {};
  
  const [selectedText, setSelectedText] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [documentContent, setDocumentContent] = useState(content);
  
  // Early return must come after all hook calls
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
  
  const handleDocumentLoaded = (fullContent: string) => {
    console.log("Document loaded with content length:", fullContent.length);
    setDocumentLoaded(true);
    setDocumentContent(fullContent);
    
    // Process the document content with the LLM to get a description
    if (fullContent && fullContent.length > 0) {
      // Import the document service dynamically to avoid circular dependencies
      import('@/services/documentService').then(({ processDocumentWithLLM }) => {
        processDocumentWithLLM(fullContent).then(newDescription => {
          console.log("Generated description for PDF:", newDescription);
          
          // Update state with the new description
          if (newDescription) {
            setDescription(newDescription);
          }
        }).catch(error => {
          console.error("Error processing document with LLM:", error);
        });
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background rounded-custom">
      {/* Header */}
      <header className="border-b bg-card flex px-6 shadow-soft sticky-header">
        <div className="h-16 flex items-center w-full">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="btn-glow text-white"
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
            className={showAIPanel ? 'bg-gradient-accent text-white' : ''}
          >
            {showAIPanel ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="ml-2">{showAIPanel ? 'Hide' : 'Show'} AI Assistant</span>
          </Button>
        </div>
        </div>
        {/* Document description section removed */}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer - Takes up 70% of the width */}
        <div className={`${showAIPanel ? 'w-[70%]' : 'w-full'} border-r bg-background transition-all duration-300`}>
          {file.type === 'application/pdf' ? (
            <PDFViewer 
              file={file} 
              onTextSelect={handleTextSelect}
              onDocumentLoaded={handleDocumentLoaded}
            />
          ) : (
            <div className="h-full p-6 overflow-auto">
              <Card className="p-6 card">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
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
              documentContent={documentContent}
              documentDescription={description}
            />
          </div>
        )}
      </div>

      {/* Footer with quick info */}
      <footer className="h-10 border-t bg-card flex items-center px-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>💡 Select text directly from the PDF to get AI explanations</span>
          <div className="h-4 w-px bg-border" />
          <span>✂️ Use Win+Shift+S to capture and analyze screenshots</span>
          <div className="h-4 w-px bg-border" />
          <span>🎯 Ask questions about any part of the document</span>
          <div className="h-4 w-px bg-border" />
          <span>📚 AI analyzes the entire document for better context</span>
        </div>
      </footer>
    </div>
  );
};
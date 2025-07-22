import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Remove problematic CSS imports - we'll handle styling differently

// Set up the worker - using CDN version for better compatibility
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File;
  onTextSelect: (selectedText: string) => void;
}

export const PDFViewer = ({ file, onTextSelect }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [rotation, setRotation] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const { toast } = useToast();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    toast({
      title: "Document loaded successfully!",
      description: `PDF with ${numPages} pages is ready. You can now highlight text for AI explanations.`,
    });
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    toast({
      title: "Error loading PDF",
      description: "There was an issue loading your PDF file.",
      variant: "destructive",
    });
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const text = selection.toString().trim();
      setSelectedText(text);
      onTextSelect(text);
      
      // Clear selection after a brief moment
      setTimeout(() => {
        selection.removeAllRanges();
      }, 500);
    }
  }, [onTextSelect]);

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      return Math.min(Math.max(1, newPage), numPages || 1);
    });
  };

  const changeScale = (factor: number) => {
    setScale(prevScale => Math.min(Math.max(0.5, prevScale + factor), 3));
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm font-medium px-3">
            Page {pageNumber} of {numPages || '--'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(1)}
            disabled={pageNumber >= (numPages || 1)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeScale(-0.2)}
            disabled={scale <= 0.5}
          >
            <ZoomOut size={16} />
          </Button>
          <span className="text-sm font-medium px-2">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeScale(0.2)}
            disabled={scale >= 3}
          >
            <ZoomIn size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRotation(prev => (prev + 90) % 360)}
          >
            <RotateCw size={16} />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-muted/20">
        <div className="flex justify-center p-4">
          <Card className="shadow-learning">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3">Loading PDF...</span>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                onGetTextSuccess={handleTextSelection}
                className="shadow-soft"
                canvasBackground="white"
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </Card>
        </div>
      </div>

      {/* Selection Indicator */}
      {selectedText && (
        <div className="p-2 bg-primary-soft border-t">
          <div className="text-sm text-primary font-medium">
            Selected: "{selectedText.substring(0, 100)}..."
          </div>
        </div>
      )}
    </div>
  );
};
import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import './PDFStyles.css';
import { truncateDocumentContent } from '@/utils/documentUtils';

// Set up the worker - using local import for better compatibility
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PDFViewerProps {
  file: File;
  onTextSelect: (selectedText: string) => void;
  onDocumentLoaded?: (fullContent: string) => void;
}

export const PDFViewer = ({ file, onTextSelect, onDocumentLoaded }: PDFViewerProps) => {
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
    
    // Extract text from the PDF if onDocumentLoaded is provided
    if (onDocumentLoaded) {
      extractTextFromPDF().catch(error => {
        console.error("Error extracting text from PDF:", error);
      });
    }
  };
  
  // Extract text from the PDF
  const extractTextFromPDF = async () => {
    try {
      // Get the PDF document
      const loadingTask = pdfjs.getDocument(URL.createObjectURL(file));
      const pdfDoc = await loadingTask.promise;
      
      let extractedText = '';
      
      // Extract text from each page (limit to 10 pages for performance)
      const pagesToExtract = Math.min(pdfDoc.numPages, 10);
      
      toast({
        title: "Analyzing document...",
        description: `Extracting text from ${pagesToExtract} pages for AI analysis...`,
      });
      
      for (let i = 1; i <= pagesToExtract; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        extractedText += `Page ${i}:\n${pageText}\n\n`;
      }
      
      console.log("Extracted text from PDF, length:", extractedText.length);
      
      // Truncate if needed
      const processedText = truncateDocumentContent(extractedText);
      
      if (processedText && onDocumentLoaded) {
        onDocumentLoaded(processedText);
      }
      
      return processedText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return '';
    }
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    toast({
      title: "Error loading PDF",
      description: "There was an issue loading your PDF file.",
      variant: "destructive",
    });
  };

  // Helper function to clean up selected text
  const cleanSelectedText = (text: string): string => {
    // Remove any [object Object] instances
    let cleaned = text.replace(/\[object Object\]/g, '');
    // Remove excessive whitespace
    cleaned = cleaned.replace(/\s+/g, ' ');
    return cleaned.trim();
  };

  // Handle text selection on mouse up
  const handleMouseUp = useCallback(() => {
    // Small delay to ensure the selection is complete
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        // Get the selected text and clean it
        let text = selection.toString();
        text = cleanSelectedText(text);
        
        if (!text) return; // Skip if text is empty after cleaning
        
        setSelectedText(text);
        onTextSelect(text);
        
        // Visual feedback for selection
        toast({
          title: "Text selected",
          description: `"${text.substring(0, 50)}${text.length > 50 ? '...' : ''}" sent to AI for analysis.`,
        });
      }
    }, 100);
  }, [onTextSelect, toast]);

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      return Math.min(Math.max(1, newPage), numPages || 1);
    });
  };

  const changeScale = (factor: number) => {
    setScale(prevScale => Math.min(Math.max(0.5, prevScale + factor), 3));
  };

  // Re-run PDF.js rendering when file changes
  useEffect(() => {
    if (file) {
      setPageNumber(1);
      setNumPages(null);
      setScale(1.2);
      setRotation(0);
      setSelectedText('');
    }
  }, [file]);
  
  // Add event listener to text layer after it's rendered
  useEffect(() => {
    const addTextLayerEventListener = () => {
      // Find all text layers in the document
      const textLayers = document.querySelectorAll('.textLayer');
      
      textLayers.forEach(layer => {
        // Remove existing listeners to avoid duplicates
        layer.removeEventListener('mouseup', handleMouseUp);
        // Add mouseup listener directly to the text layer
        layer.addEventListener('mouseup', handleMouseUp);
      });
    };
    
    // Wait a bit for the text layer to be rendered
    const timeoutId = setTimeout(addTextLayerEventListener, 1000);
    
    return () => {
      clearTimeout(timeoutId);
      // Clean up event listeners
      const textLayers = document.querySelectorAll('.textLayer');
      textLayers.forEach(layer => {
        layer.removeEventListener('mouseup', handleMouseUp);
      });
    };
  }, [handleMouseUp, pageNumber]);

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
      <div className="flex-1 overflow-auto bg-muted/20" onMouseUp={handleMouseUp} style={{ userSelect: 'text' }}>
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
                className="shadow-soft"
                canvasBackground="white"
                renderTextLayer={true}
                renderAnnotationLayer={true}
                textLayerProps={{
                  className: 'textLayer',
                  enablePermissions: true
                }}
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
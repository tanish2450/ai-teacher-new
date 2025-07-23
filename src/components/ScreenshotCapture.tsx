import { useState, useRef, useCallback, useEffect } from 'react';
import { Scissors, Crop, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ScreenshotCaptureProps {
  onImageCapture: (imageData: string) => void;
}

export const ScreenshotCapture = ({ onImageCapture }: ScreenshotCaptureProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectionRect, setSelectionRect] = useState({ startX: 0, startY: 0, width: 0, height: 0 });
  const [clipboardImage, setClipboardImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // Handle clipboard paste event
  const handleClipboardPaste = useCallback((e: ClipboardEvent) => {
    console.log('Paste event detected');
    const items = e.clipboardData?.items;
    if (!items) {
      console.log('No clipboard data found');
      return;
    }

    let foundImage = false;
    for (let i = 0; i < items.length; i++) {
      console.log(`Clipboard item ${i}: ${items[i].type}`);
      if (items[i].type.indexOf('image') !== -1) {
        foundImage = true;
        const blob = items[i].getAsFile();
        if (!blob) {
          console.log('Failed to get file from clipboard item');
          continue;
        }

        console.log('Processing image from clipboard');
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setClipboardImage(dataUrl);
          setIsCapturing(false);
          
          toast({
            title: "Image captured!",
            description: "Now draw a box around the area you want to analyze."
          });
        };
        reader.onerror = (error) => {
          console.error('Error reading clipboard image:', error);
          toast({
            title: "Error processing image",
            description: "Failed to process the pasted image. Please try again.",
            variant: "destructive"
          });
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
    
    if (!foundImage && isCapturing) {
      toast({
        title: "No image found",
        description: "The clipboard doesn't contain an image. Please capture a screenshot first.",
        variant: "destructive"
      });
    }
  }, [toast, isCapturing]);

  // Take screenshot function
  const takeScreenshot = useCallback(() => {
    setIsCapturing(true);
    
    toast({
      title: "Taking screenshot...",
      description: "Press Win+Shift+S to capture a region of your screen, then press Ctrl+V to paste."
    });
    
    // We can't programmatically trigger Win+Shift+S, but we can show instructions
    // After 30 seconds, reset the capturing state if no image was pasted
    setTimeout(() => {
      if (isCapturing && !clipboardImage) {
        setIsCapturing(false);
        toast({
          title: "Screenshot timeout",
          description: "No screenshot was detected. Please try again.",
          variant: "destructive"
        });
      }
    }, 30000);
  }, [toast, isCapturing, clipboardImage]);

  // Handle mouse down event to start drawing selection rectangle
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSelectionRect({ startX: x, startY: y, width: 0, height: 0 });
    setIsDrawing(true);
  }, []);

  // Handle mouse move event to update selection rectangle
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSelectionRect(prev => ({
      ...prev,
      width: x - prev.startX,
      height: y - prev.startY
    }));
    
    // Redraw the canvas with the selection rectangle
    drawImageWithSelection();
  }, [isDrawing]);

  // Handle mouse up event to finish drawing selection rectangle
  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Draw the clipboard image with selection rectangle on canvas
  const drawImageWithSelection = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !clipboardImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    
    // Draw the selection rectangle
    ctx.strokeStyle = '#3b82f6'; // Blue color
    ctx.lineWidth = 2;
    ctx.strokeRect(
      selectionRect.startX, 
      selectionRect.startY, 
      selectionRect.width, 
      selectionRect.height
    );
    
    // Add semi-transparent overlay
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'; // Light blue with opacity
    ctx.fillRect(
      selectionRect.startX, 
      selectionRect.startY, 
      selectionRect.width, 
      selectionRect.height
    );
  }, [clipboardImage, selectionRect]);

  // Process the selected area and send it to the AI model
  const processSelectedArea = () => {
    if (!canvasRef.current || !clipboardImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create a new canvas for the cropped area
    const croppedCanvas = document.createElement('canvas');
    
    // Ensure we have positive width and height (handle drawing in any direction)
    const x = selectionRect.width > 0 ? selectionRect.startX : selectionRect.startX + selectionRect.width;
    const y = selectionRect.height > 0 ? selectionRect.startY : selectionRect.startY + selectionRect.height;
    const width = Math.abs(selectionRect.width);
    const height = Math.abs(selectionRect.height);
    
    // Set the cropped canvas dimensions
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    
    // Draw only the selected portion to the new canvas
    const croppedCtx = croppedCanvas.getContext('2d');
    if (!croppedCtx) return;
    
    croppedCtx.drawImage(
      canvas, 
      x, y, width, height,  // Source coordinates and dimensions
      0, 0, width, height   // Destination coordinates and dimensions
    );
    
    // Convert the cropped canvas to a data URL
    const croppedDataUrl = croppedCanvas.toDataURL('image/png');
    
    // Send the cropped image to the parent component
    onImageCapture(croppedDataUrl);
    
    // Reset the state
    setClipboardImage(null);
    setSelectionRect({ startX: 0, startY: 0, width: 0, height: 0 });
    
    toast({
      title: "Image sent to AI",
      description: "The selected area has been sent for analysis."
    });
  };

  // Cancel the image selection process
  const cancelImageSelection = () => {
    setClipboardImage(null);
    setIsCapturing(false);
    setSelectionRect({ startX: 0, startY: 0, width: 0, height: 0 });
  };

  // When the image loads, set up the canvas
  const handleImageLoad = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    // Set canvas dimensions to match the image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the initial image
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  // Add and remove event listener for clipboard paste
  useEffect(() => {
    // Always listen for paste events when the component is mounted
    document.addEventListener('paste', handleClipboardPaste);
    
    return () => {
      document.removeEventListener('paste', handleClipboardPaste);
    };
  }, [handleClipboardPaste]);
  
  // Direct paste function using Clipboard API
  const handleDirectPaste = useCallback(async () => {
    try {
      // Try to read from clipboard directly
      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        // Check if there's an image in the clipboard
        if (clipboardItem.types.includes('image/png') || 
            clipboardItem.types.includes('image/jpeg') || 
            clipboardItem.types.includes('image/gif')) {
          
          // Get the image type
          const imageType = clipboardItem.types.find(type => type.startsWith('image/')) || 'image/png';
          
          // Get the image blob
          const blob = await clipboardItem.getType(imageType);
          
          // Convert blob to data URL
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setClipboardImage(dataUrl);
            setIsCapturing(false);
            
            toast({
              title: "Image pasted!",
              description: "Now draw a box around the area you want to analyze."
            });
          };
          reader.readAsDataURL(blob);
          return; // Exit after processing the first image
        }
      }
      
      // If we get here, no image was found
      toast({
        title: "No image found",
        description: "The clipboard doesn't contain an image. Please capture a screenshot first.",
        variant: "destructive"
      });
      
    } catch (error) {
      console.error('Error accessing clipboard:', error);
      toast({
        title: "Clipboard access failed",
        description: "Please press Ctrl+V manually to paste your screenshot.",
        variant: "destructive"
      });
    }
  }, [toast]);

  return (
    <div className="relative">
      {!clipboardImage ? (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button 
              onClick={takeScreenshot} 
              variant="outline"
              className="flex items-center"
              disabled={isCapturing}
            >
              {isCapturing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Waiting for paste...
                </>
              ) : (
                <>
                  <Scissors size={16} className="mr-2" />
                  Take Screenshot
                </>
              )}
            </Button>
            
            <Button
              onClick={handleDirectPaste}
              variant="primary"
              disabled={!isCapturing}
            >
              Paste Screenshot (Ctrl+V)
            </Button>
            
            {isCapturing && (
              <Button
                onClick={() => setIsCapturing(false)}
                variant="destructive"
                size="sm"
              >
                <X size={16} className="mr-1" />
                Cancel
              </Button>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>1. Press Win+Shift+S to capture a region of your screen</p>
            <p>2. Press Ctrl+V or click "Paste Screenshot" button</p>
            {isCapturing && <p className="text-primary font-bold">Waiting for you to paste screenshot...</p>}
          </div>
        </div>
      ) : (
        <Card className="relative overflow-hidden">
          <CardContent className="p-0 relative">
            {/* Hidden image for reference */}
            <img 
              ref={imageRef}
              src={clipboardImage}
              onLoad={handleImageLoad}
              className="hidden"
              alt="Clipboard image"
            />
            
            {/* Canvas for drawing selection */}
            <canvas
              ref={canvasRef}
              className="w-full cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            
            {/* Controls overlay */}
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={cancelImageSelection}
              >
                <X size={16} className="mr-1" />
                Cancel
              </Button>
              
              <Button 
                size="sm" 
                variant="primary" 
                onClick={processSelectedArea}
                disabled={!selectionRect.width || !selectionRect.height}
              >
                <Send size={16} className="mr-1" />
                Send to AI
              </Button>
            </div>
            
            <div className="absolute bottom-2 left-2 bg-background/80 p-2 rounded text-sm">
              <div className="flex items-center">
                <Crop size={14} className="mr-1" />
                Draw a box around the area you want to analyze
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
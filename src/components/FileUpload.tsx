import { useState, useCallback } from "react";
import { Upload, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import mammoth from "mammoth";

interface FileUploadProps {
  onFileUpload: (file: File, content?: string | ArrayBuffer) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const isWordDoc = file.name.endsWith('.docx') || file.name.endsWith('.doc');
    
    if (!allowedTypes.includes(file.type) && !isWordDoc) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a PDF, TXT, or Word document (.docx).",
        variant: "destructive",
      });
      return;
    }
    
    // Check for .doc files and suggest .docx
    if (file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
      toast({
        title: "File format not fully supported",
        description: "For best results, please convert your .doc file to .docx format.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (file.type === 'application/pdf') {
        // For PDF files, we'll pass the file directly to react-pdf
        onFileUpload(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        // For .docx files, extract text using mammoth
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        onFileUpload(file, result.value);
      } else {
        // For text files, read the content
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;
          if (content) {
            onFileUpload(file, content);
          }
        };
        reader.readAsText(file);
      }

      toast({
        title: "File uploaded successfully!",
        description: `${file.name} is ready for AI analysis.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onFileUpload, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <Card 
      className={`
        relative overflow-hidden transition-all duration-300 cursor-pointer
        ${isDragging ? 'border-primary border-2 bg-primary-soft/20' : 'border-border hover:border-primary/50'}
        ${isProcessing ? 'animate-pulse' : ''}
      `}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
    >
      <CardContent className="p-12 text-center space-y-6">
        <div className="relative">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="p-6 rounded-full bg-gradient-learning text-white animate-float">
              <Upload size={32} />
            </div>
            <div className="p-6 rounded-full bg-gradient-wisdom text-white animate-float" style={{ animationDelay: '0.5s' }}>
              <FileText size={32} />
            </div>
            <div className="p-6 rounded-full bg-gradient-focus text-white animate-float" style={{ animationDelay: '1s' }}>
              <BookOpen size={32} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold bg-gradient-learning bg-clip-text text-transparent">
            Upload Your Learning Material
          </h3>
          <p className="text-muted-foreground text-lg">
            Drop your PDF, TXT, or Word document here, or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Supports PDF, TXT, and Word documents (.docx) up to 10MB
          </p>
        </div>

        <div className="space-y-4">
                <input
                  type="file"
                  accept=".pdf,.txt,.docx"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={isProcessing}
          />
          <label htmlFor="file-upload">
            <Button 
              variant="hero" 
              size="xl"
              disabled={isProcessing}
              className="cursor-pointer"
              asChild
            >
              <span>
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2" size={20} />
                    Choose File
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>

        {isDragging && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <div className="text-2xl font-bold text-primary">
              Drop your file here!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
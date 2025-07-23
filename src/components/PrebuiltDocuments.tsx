import { useState } from 'react';
import { prebuiltDocuments, PrebuiltDocument } from '@/data/prebuiltDocuments';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, FileText, Code } from 'lucide-react';

interface PrebuiltDocumentsProps {
  onSelectDocument: (document: PrebuiltDocument) => void;
}

export const PrebuiltDocuments = ({ onSelectDocument }: PrebuiltDocumentsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter documents by category if one is selected
  const filteredDocuments = selectedCategory 
    ? prebuiltDocuments.filter(doc => doc.category === selectedCategory)
    : prebuiltDocuments;

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4 mb-6">
        <Button 
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        <Button 
          variant={selectedCategory === 'academic' ? "default" : "outline"}
          onClick={() => setSelectedCategory('academic')}
        >
          <Book className="mr-2 h-4 w-4" />
          Academic
        </Button>
        <Button 
          variant={selectedCategory === 'business' ? "default" : "outline"}
          onClick={() => setSelectedCategory('business')}
        >
          <FileText className="mr-2 h-4 w-4" />
          Business
        </Button>
        <Button 
          variant={selectedCategory === 'technical' ? "default" : "outline"}
          onClick={() => setSelectedCategory('technical')}
        >
          <Code className="mr-2 h-4 w-4" />
          Technical
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card 
            key={doc.id} 
            className="cursor-pointer hover:shadow-md transition-shadow rounded-custom overflow-hidden"
            onClick={() => onSelectDocument(doc)}
          >
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>
              <Button variant="outline" className="w-full">
                Select Document
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
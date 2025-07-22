import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';
import { GraduationCap, Brain, Sparkles, BookOpen, Lightbulb, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import heroImage from '@/assets/hero-learning.jpg';

const Index = () => {
  const navigate = useNavigate();

  const handleFileUpload = (file: File, content?: string | ArrayBuffer) => {
    navigate('/document', { 
      state: { file, content }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/10 to-accent/10">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-learning text-white shadow-learning">
              <GraduationCap size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-learning bg-clip-text text-transparent">
                AI Learning Assistant
              </h1>
              <p className="text-sm text-muted-foreground">
                Your personal AI tutor for document analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image and Title */}
          <div className="text-center mb-12">
            <div className="relative mb-8">
              <img 
                src={heroImage} 
                alt="AI Learning Assistant" 
                className="w-full max-w-3xl mx-auto rounded-2xl shadow-glow"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-2xl"></div>
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-learning bg-clip-text text-transparent leading-tight">
              Learn Smarter with AI
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload any document and get instant AI explanations for highlighted text. 
              Your personal tutor understands context and answers questions about your materials.
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-16">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="relative overflow-hidden hover:shadow-learning transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-gradient-learning text-white w-fit mx-auto mb-4">
                  <Brain size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Context Understanding</h3>
                <p className="text-muted-foreground text-sm">
                  AI reads your entire document and provides explanations that reference other sections
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-learning transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-gradient-wisdom text-white w-fit mx-auto mb-4">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Explanations</h3>
                <p className="text-muted-foreground text-sm">
                  Highlight any text to get immediate, detailed explanations and clarifications
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-learning transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-gradient-focus text-white w-fit mx-auto mb-4">
                  <MessageCircle size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Voice & Text Options</h3>
                <p className="text-muted-foreground text-sm">
                  Choose between text responses or voice explanations for your learning style
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How it works */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-8 text-foreground">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Upload", desc: "Upload your PDF or text document", icon: FileUpload },
                { step: "2", title: "Analyze", desc: "AI reads and understands your content", icon: BookOpen },
                { step: "3", title: "Highlight", desc: "Select any text you want explained", icon: Sparkles },
                { step: "4", title: "Learn", desc: "Get instant AI explanations and answers", icon: Brain },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground text-center">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

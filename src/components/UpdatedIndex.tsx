import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';
import { PrebuiltDocuments } from '@/components/PrebuiltDocuments';
import { GraduationCap, Brain, Sparkles, BookOpen, Lightbulb, MessageCircle, Library } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-learning.jpg';
import { initFadeAnimations } from '@/utils/animationUtils';

const Index = () => {
  const navigate = useNavigate();

  // Initialize fade animations
  useEffect(() => {
    const cleanup = initFadeAnimations();
    return cleanup;
  }, []);

  const handleFileUpload = (file: File, content?: string | ArrayBuffer, description?: string) => {
    navigate('/document', { 
      state: { file, content, description }
    });
  };

  const handlePrebuiltDocumentSelect = (document: any) => {
    // Create a file object from the pre-built document
    const file = new File(
      [document.content], 
      `${document.title}.md`, 
      { type: 'text/markdown' }
    );
    
    // Navigate to document viewer with the pre-built document
    navigate('/document', {
      state: {
        file,
        content: document.content,
        description: document.description
      }
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="p-6 sticky-header">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-accent text-white shadow-learning">
              <GraduationCap size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
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
          <div className="text-center mb-12 fade-in">
            <div className="relative mb-8">
              <img 
                src={heroImage} 
                alt="AI Learning Assistant" 
                className="w-full max-w-3xl mx-auto rounded-2xl shadow-glow"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-2xl"></div>
            </div>
            <h2 className="hero-heading mb-6">
              Learn Smarter with AI
            </h2>
            <p className="hero-subheading">
              Upload any document and get instant AI explanations for highlighted text. 
              Your personal tutor understands context and answers questions about your materials.
            </p>
            <Button className="btn-glow mt-6 px-8 py-6 text-lg">
              Get Started
            </Button>
          </div>

          {/* Upload Section */}
          <div className="mb-16 fade-in">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          {/* Pre-built Documents Section */}
          <div className="mb-16 fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-accent text-white shadow-learning">
                <Library size={24} />
              </div>
              <h3 className="text-2xl font-bold">Pre-built Documents</h3>
            </div>
            <p className="text-muted-foreground mb-6">Select from our collection of pre-built documents to get started quickly.</p>
            <PrebuiltDocuments onSelectDocument={handlePrebuiltDocumentSelect} />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 fade-in">
            <Card className="card hover-lift">
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-gradient-accent text-white w-fit mx-auto mb-4">
                  <Brain size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Context Understanding</h3>
                <p className="text-muted-foreground text-sm">
                  AI reads your entire document and provides explanations that reference other sections
                </p>
              </CardContent>
            </Card>

            <Card className="card hover-lift">
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-gradient-accent text-white w-fit mx-auto mb-4">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Explanations</h3>
                <p className="text-muted-foreground text-sm">
                  Highlight any text to get immediate, detailed explanations and clarifications
                </p>
              </CardContent>
            </Card>

            <Card className="card hover-lift">
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-gradient-accent text-white w-fit mx-auto mb-4">
                  <MessageCircle size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Voice & Text Options</h3>
                <p className="text-muted-foreground text-sm">
                  Choose between text responses or voice explanations for your learning style
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Testimonial Section */}
          <div className="mb-16 fade-in">
            <h3 className="text-2xl font-bold mb-8 text-center">What Our Users Say</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="testimonial-card hover-lift">
                <CardContent className="p-6">
                  <p className="italic mb-4">
                    "This AI tutor has completely transformed how I study. The explanations are clear and contextual, making complex topics much easier to understand."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">Computer Science Student</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="testimonial-card hover-lift">
                <CardContent className="p-6">
                  <p className="italic mb-4">
                    "The voice feature is a game-changer for auditory learners like me. I can listen to explanations while reviewing my notes, which has improved my retention significantly."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">Michael Chen</p>
                      <p className="text-xs text-muted-foreground">Engineering Graduate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How it works */}
          <div className="text-center fade-in">
            <h3 className="text-2xl font-bold mb-8">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Upload", desc: "Upload your PDF or text document", icon: FileUpload },
                { step: "2", title: "Analyze", desc: "AI reads and understands your content", icon: BookOpen },
                { step: "3", title: "Highlight", desc: "Select any text you want explained", icon: Sparkles },
                { step: "4", title: "Learn", desc: "Get instant AI explanations and answers", icon: Brain },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center space-y-3 hover-lift">
                  <div className="w-12 h-12 rounded-full bg-gradient-accent text-white flex items-center justify-center font-bold text-lg">
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
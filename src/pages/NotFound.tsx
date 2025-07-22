import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary-soft/10 to-accent/10 p-6">
      <Card className="max-w-md w-full shadow-learning">
        <CardContent className="p-8 text-center space-y-6">
          <div className="p-6 rounded-full bg-gradient-learning text-white w-fit mx-auto">
            <BookOpen size={48} />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-6xl font-bold bg-gradient-learning bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-xl font-semibold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground">
              Oops! The page you're looking for doesn't exist. Let's get you back to learning!
            </p>
          </div>

          <Button 
            variant="learning" 
            size="lg"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            <Home className="mr-2" size={20} />
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

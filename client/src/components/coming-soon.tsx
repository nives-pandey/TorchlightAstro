import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Home, Star, Calendar, Clock } from "lucide-react";

interface ComingSoonProps {
  feature: string;
  description?: string;
  expectedDate?: string;
}

export default function ComingSoon({ feature, description, expectedDate }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="bg-purple-900/40 border-white/20 backdrop-blur-sm rounded-2xl max-w-md w-full">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <CardTitle className="text-white text-2xl">
            {feature}
          </CardTitle>
          <div className="text-pink-200/80 text-sm mt-2">
            Coming Soon ✨
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {description && (
            <p className="text-gray-300 leading-relaxed">
              {description}
            </p>
          )}
          
          {expectedDate && (
            <div className="flex items-center justify-center gap-2 text-purple-300">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Expected: {expectedDate}</span>
            </div>
          )}
          
          <div className="pt-4">
            <Link href="/home">
              <Button className="cosmic-button">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="text-gray-400 text-xs mt-4">
            In the meantime, try our chart generation and lifestyle intelligence features!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
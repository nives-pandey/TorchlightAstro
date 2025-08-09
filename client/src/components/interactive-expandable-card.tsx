import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExpandableCardProps {
  title: string;
  description?: string;
  preview: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export default function InteractiveExpandableCard({
  title,
  description,
  preview,
  children,
  icon,
  className = ""
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`feature-card transition-all duration-300 ${className}`}>
      <CardHeader 
        className="cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-600/20 to-pink-500/20 border border-yellow-500/30">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-semibold text-white flex items-center">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-purple-200 mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-300 hover:text-white hover:bg-yellow-600/20 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {!isExpanded && (
          <div className="mt-3 text-sm text-gray-300 line-clamp-2">
            {preview}
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="border-t border-yellow-500/20 pt-4">
            {children}
          </div>
          
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-purple-300 hover:text-white hover:bg-yellow-600/20"
            >
              Show Less
              <ChevronUp className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
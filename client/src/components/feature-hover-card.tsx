import { useState, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star, AlertCircle } from "lucide-react";

interface FeatureHoverCardProps {
  children: ReactNode;
  title: string;
  status: "available" | "coming-soon" | "in-development" | "planned";
  description?: string;
  expectedDate?: string;
  completionPercentage?: number;
  features?: string[];
  className?: string;
}

export default function FeatureHoverCard({
  children,
  title,
  status,
  description,
  expectedDate,
  completionPercentage,
  features,
  className = ""
}: FeatureHoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "available":
        return {
          color: "bg-green-500",
          text: "Available Now",
          icon: Star,
          textColor: "text-green-400"
        };
      case "coming-soon":
        return {
          color: "bg-yellow-500",
          text: "Coming Soon",
          icon: Calendar,
          textColor: "text-yellow-400"
        };
      case "in-development":
        return {
          color: "bg-blue-500",
          text: "In Development",
          icon: Clock,
          textColor: "text-blue-400"
        };
      case "planned":
        return {
          color: "bg-yellow-600",
          text: "Planned",
          icon: AlertCircle,
          textColor: "text-yellow-500"
        };
      default:
        return {
          color: "bg-gray-500",
          text: "Unknown",
          icon: AlertCircle,
          textColor: "text-gray-400"
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Original content with subtle overlay for non-available features */}
      <div className={`relative ${status !== "available" ? "opacity-75" : ""}`}>
        {children}
        
        {/* Status indicator overlay */}
        {status !== "available" && (
          <div className="absolute top-2 right-2">
            <div className={`w-3 h-3 rounded-full ${statusConfig.color} animate-pulse`} />
          </div>
        )}
      </div>

      {/* Hover card */}
      {isHovered && (
        <div className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 w-80">
          <Card className="bg-teal-900/95 backdrop-blur-lg border border-pink-300/30 shadow-2xl">
            <CardContent className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold text-lg">{title}</h4>
                <Badge 
                  variant="outline" 
                  className={`${statusConfig.textColor} border-current`}
                >
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig.text}
                </Badge>
              </div>

              {/* Description */}
              {description && (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {description}
                </p>
              )}

              {/* Progress bar for in-development features */}
              {status === "in-development" && completionPercentage && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-blue-400">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Expected date */}
              {expectedDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-300">Expected: {expectedDate}</span>
                </div>
              )}

              {/* Feature list */}
              {features && features.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-400">Features:</div>
                  <ul className="space-y-1">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action message */}
              {status !== "available" && (
                <div className="mt-3 pt-2 border-t border-white/10">
                  <p className="text-xs text-gray-400 text-center">
                    {status === "coming-soon" 
                      ? "Feature launching soon! Stay tuned for updates."
                      : status === "in-development"
                      ? "Currently in active development. Check back soon!"
                      : "Planned for future release. Let us know if you're interested!"
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
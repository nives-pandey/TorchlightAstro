import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Stars, Sun, Moon, Sparkles } from "lucide-react";
import Navigation from "@/components/navigation";

interface MagicalLoadingProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function MagicalLoading({ isVisible, onComplete }: MagicalLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    { text: "Connecting to cosmic energies...", icon: <Sparkles className="w-6 h-6" /> },
    { text: "Calculating planetary positions...", icon: <Sun className="w-6 h-6" /> },
    { text: "Drawing your astrological wheel...", icon: <div className="w-6 h-6 border-2 border-yellow-400 rounded-full animate-spin" /> },
    { text: "Consulting ancient wisdom traditions...", icon: <Moon className="w-6 h-6" /> },
    { text: "Generating personalized insights...", icon: <Stars className="w-6 h-6" /> },
    { text: "Your cosmic blueprint is ready!", icon: <Sparkles className="w-6 h-6 animate-pulse" /> }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update phase based on progress
        const phaseIndex = Math.floor((newProgress / 100) * phases.length);
        if (phaseIndex !== currentPhase && phaseIndex < phases.length) {
          setCurrentPhase(phaseIndex);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.();
          }, 1000);
          return 100;
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, currentPhase, onComplete, phases.length]);

  if (!isVisible) return null;

  return (
    <>
      <Navigation />
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-gradient-to-br from-teal-900/90 to-pink-900/90 border-yellow-500/30 backdrop-blur-md max-w-md mx-4">
        <CardContent className="p-8 text-center">
          {/* Animated Astrological Wheel */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Outer circle with constellations */}
            <div className="absolute inset-0 border-2 border-yellow-400/30 rounded-full animate-spin" style={{animationDuration: '8s'}} />
            <div className="absolute inset-2 border border-yellow-500/40 rounded-full animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}} />
            
            {/* Zodiac symbols */}
            <div className="absolute inset-4 flex items-center justify-center">
              <div className="text-2xl text-yellow-400 animate-pulse">
                {currentPhase < 2 ? '♈' : currentPhase < 4 ? '♉' : '♊'}
              </div>
            </div>
            
            {/* Planetary positions */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <Sun className="w-4 h-4 text-yellow-500 animate-bounce" />
            </div>
            <div className="absolute bottom-2 right-2">
              <Moon className="w-3 h-3 text-blue-300 animate-pulse" />
            </div>
            
            {/* Stars */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                style={{
                  top: `${20 + (i * 10)}%`,
                  left: `${15 + (i * 8)}%`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-teal-800/30 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-600 to-pink-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Current Phase */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="text-yellow-400 animate-pulse">
              {phases[currentPhase]?.icon}
            </div>
            <h3 className="text-white font-medium">
              {phases[currentPhase]?.text}
            </h3>
          </div>

          <p className="text-teal-300 text-sm">
            {progress}% complete
          </p>

          {/* Magical particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400/60 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          25% { opacity: 1; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
          75% { opacity: 0.6; }
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
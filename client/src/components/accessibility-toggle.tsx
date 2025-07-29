import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function AccessibilityToggle() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('highContrast');
    if (saved === 'true') {
      setHighContrast(true);
      document.body.classList.add('high-contrast');
    }
  }, []);

  const toggleHighContrast = () => {
    const newState = !highContrast;
    setHighContrast(newState);
    
    if (newState) {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    } else {
      document.body.classList.remove('high-contrast');
      localStorage.setItem('highContrast', 'false');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleHighContrast}
      className="fixed top-4 right-4 z-50 bg-slate-800/90 hover:bg-slate-700 text-white border-2 border-purple-400 shadow-lg"
      title={highContrast ? "Disable High Contrast" : "Enable High Contrast"}
    >
      {highContrast ? (
        <>
          <EyeOff className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Normal View</span>
        </>
      ) : (
        <>
          <Eye className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">High Contrast</span>
        </>
      )}
    </Button>
  );
}
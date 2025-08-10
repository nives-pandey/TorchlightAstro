import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Check } from 'lucide-react';
import { useTheme, Theme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-gray-900 border-yellow-300 hover:border-yellow-200 transition-all duration-200 hover:scale-105 font-semibold shadow-lg"
        >
          <Palette className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-900/95 border border-white/20 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-400" />
            Choose Your Cosmic Palette
          </DialogTitle>
          <p className="text-white/70 text-sm">
            Personalize your astrological journey with colors that resonate with your energy
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {Object.entries(themes).map(([themeKey, themeConfig]) => {
            const isSelected = theme === themeKey;
            return (
              <Card 
                key={themeKey}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected 
                    ? 'ring-2 ring-white/50 bg-white/10' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => handleThemeChange(themeKey as Theme)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{themeConfig.icon}</span>
                      <div>
                        <h3 className="text-white font-semibold text-sm">
                          {themeConfig.name}
                        </h3>
                        <p className="text-white/60 text-xs">
                          {themeConfig.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="bg-green-500 rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Color Preview */}
                  <div 
                    className="h-16 rounded-lg border border-white/20 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.colors.gradientFrom}, ${themeConfig.colors.gradientTo})`
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex gap-2">
                        <div 
                          className="w-3 h-3 rounded-full border border-white/30"
                          style={{ backgroundColor: themeConfig.colors.primaryAccent }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border border-white/30"
                          style={{ backgroundColor: themeConfig.colors.secondaryAccent }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border border-white/30"
                          style={{ backgroundColor: themeConfig.colors.textPrimary }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-300 text-xs">
                      Currently Active
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center pt-4 border-t border-white/20">
          <p className="text-white/60 text-xs">
            Your theme preference is saved automatically and will persist across sessions
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
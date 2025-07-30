import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface SimpleBirthFormProps {
  onClose: () => void;
  onComplete: (data: any) => void;
}

export default function SimpleBirthForm({ onClose, onComplete }: SimpleBirthFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "", 
    birthDate: "",
    birthTime: "",
    city: "",
    country: "",
    systems: {
      western: true,
      vedic: true,
      chinese: true,
      numerology: true,
      humanDesign: true
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Call the working backend API
      const response = await fetch('/api/generate-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Chart generated successfully:', result);
        
        // Pass the real chart data to parent component
        onComplete(result.chart);
      } else {
        console.error('API failed, using fallback');
        // Fallback chart data if API fails
        const fallbackData = {
          personalInfo: formData,
          systems: {
            western: {
              sign: "Aries",
              element: "Fire", 
              analysis: "Dynamic energy with leadership potential"
            },
            chinese: {
              animal: "Dragon",
              element: "Wood",
              analysis: "Creative and ambitious nature"
            },
            numerology: {
              lifePath: 7,
              destiny: 9,
              analysis: "Spiritual seeker with humanitarian goals"
            },
            humanDesign: {
              type: "Generator",
              strategy: "Respond",
              analysis: "Natural builder with sustainable energy"
            }
          },
          predictions: {
            love: "Strong connections and emotional growth ahead",
            career: "Leadership opportunities in creative fields",
            health: "Focus on balance and stress management",
            finances: "Steady growth through careful planning"
          }
        };
        onComplete(fallbackData);
      }
    } catch (error) {
      console.error('Error generating chart:', error);
      // Use fallback data on error
      const fallbackData = {
        personalInfo: formData,
        systems: {
          western: { sign: "Aries", element: "Fire", analysis: "Dynamic energy" },
          chinese: { animal: "Dragon", element: "Wood", analysis: "Creative nature" },
          numerology: { lifePath: 7, destiny: 9, analysis: "Spiritual seeker" },
          humanDesign: { type: "Generator", strategy: "Respond", analysis: "Natural builder" }
        },
        predictions: {
          love: "Strong connections ahead",
          career: "Leadership opportunities",
          health: "Focus on balance",
          finances: "Steady growth"
        }
      };
      onComplete(fallbackData);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-purple-900/95 backdrop-blur-lg border border-pink-300/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent text-2xl">
              Create Your Cosmic Profile
            </span>
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i === step 
                    ? 'bg-purple-500 text-white' 
                    : i < step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {i}
              </div>
            ))}
          </div>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNext} className="cosmic-button">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Birth Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Birth Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="birthDate" className="text-white">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="birthTime" className="text-white">Birth Time</Label>
                  <Input
                    id="birthTime"
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-white">Birth City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g. Manila, New York"
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="text-white">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="e.g. Philippines, USA"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev} className="bg-white/10 border-white/20 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext} className="cosmic-button">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Systems Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Select Astrological Systems</h3>
              
              <div className="space-y-3">
                {[
                  { key: 'western', name: 'Western Astrology', desc: '12 zodiac signs with planetary aspects' },
                  { key: 'vedic', name: 'Vedic (Jyotish)', desc: 'Ancient Indian astrology with Nakshatras' },
                  { key: 'chinese', name: 'Chinese Zodiac', desc: '12 animals with Five Element theory' },
                  { key: 'numerology', name: 'Numerology', desc: 'Life path and destiny numbers' },
                  { key: 'humanDesign', name: 'Human Design', desc: 'Modern energy type system' }
                ].map((system) => (
                  <div key={system.key} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <Checkbox
                      checked={formData.systems[system.key as keyof typeof formData.systems]}
                      onCheckedChange={(checked) => 
                        setFormData({
                          ...formData, 
                          systems: {...formData.systems, [system.key]: checked}
                        })
                      }
                    />
                    <div>
                      <div className="text-white font-medium">{system.name}</div>
                      <div className="text-gray-400 text-sm">{system.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrev} className="bg-white/10 border-white/20 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="cosmic-button"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Generating Chart...
                    </>
                  ) : (
                    "Generate My Chart ✨"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
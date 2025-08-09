import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Sun, Moon, Calendar, Clock, MapPin } from "lucide-react";
import MobileNavigation from "@/components/mobile-navigation";

interface InstantOnboardingProps {
  onComplete: (formData: any) => void;
  loading?: boolean;
}

export default function InstantOnboarding({ onComplete, loading }: InstantOnboardingProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthTime: "",
    birthCity: "",
    birthCountry: ""
  });

  const handleSubmit = () => {
    if (formData.firstName && formData.birthDate && formData.birthTime && formData.birthCity) {
      onComplete({
        ...formData,
        timezone: "America/New_York", // Default timezone, can be enhanced
        systems: {
          western: true,
          vedic: true,
          chinese: true,
          numerology: true,
          humanDesign: true
        }
      });
    }
  };

  const isValid = formData.firstName && formData.birthDate && formData.birthTime && formData.birthCity;

  return (
    <>
      <MobileNavigation />
      <div className="min-h-screen flex items-center justify-center p-4 pt-20" style={{background: 'var(--wellness-gradient-1)'}}>
        <div className="w-full max-w-2xl mx-auto">
        {/* Hero Section with Immediate Value Proposition */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-300 to-yellow-300 bg-clip-text text-transparent">
              Discover Your Cosmic Blueprint
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          
          <p className="text-lg text-teal-200 mb-6 max-w-xl mx-auto">
            Unlock personalized insights from 10+ ancient wisdom traditions. 
            Your complete astrological profile in under 60 seconds.
          </p>

          <div className="text-center mb-8">
            <p className="text-lg font-medium text-white">
              Western, Vedic, Chinese & Human Design
            </p>
          </div>
        </div>

        {/* Instant Form - Value First Approach */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-white text-xl flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Enter Your Birth Details
            </CardTitle>
            <CardDescription className="text-teal-200">
              We'll create your personalized cosmic analysis instantly
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-white text-sm">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white text-sm">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                />
              </div>
            </div>

            {/* Birth Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthDate" className="text-white text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Birth Date
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="birthTime" className="text-white text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Birth Time
                </Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* Birth Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthCity" className="text-white text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Birth City
                </Label>
                <Input
                  id="birthCity"
                  type="text"
                  placeholder="e.g., New York"
                  value={formData.birthCity}
                  onChange={(e) => setFormData({...formData, birthCity: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                />
              </div>
              <div>
                <Label htmlFor="birthCountry" className="text-white text-sm">Country</Label>
                <Input
                  id="birthCountry"
                  type="text"
                  placeholder="e.g., United States"
                  value={formData.birthCountry}
                  onChange={(e) => setFormData({...formData, birthCountry: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                />
              </div>
            </div>

            {/* Magical Generate Button */}
            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!isValid || loading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Your Cosmic Blueprint...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate My Cosmic Profile
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 text-center">
              <p className="text-xs text-white/70 mb-2">
                Free forever • Results in 30 seconds • Your data stays private
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/60">
                <span>Swiss Ephemeris Precision</span>
                <span>•</span>
                <span>10+ Astrological Systems</span>
                <span>•</span>
                <span>AI-Enhanced Insights</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </>
  );
}
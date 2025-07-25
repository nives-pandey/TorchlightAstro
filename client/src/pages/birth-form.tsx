import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Stars } from "lucide-react";
import EnhancedBirthForm from '@/components/enhanced-birth-form';
import { useLocation } from "wouter";

export default function BirthFormPage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFormComplete = async (formData: any) => {
    setLoading(true);
    
    // Validate all required fields are present
    const requiredFields = [
      'firstName', 'lastName', 'genderAtBirth', 'birthDate', 
      'birthTime', 'birthCity', 'birthCountry', 'timezone'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      setLoading(false);
      return;
    }

    // Ensure at least one system is selected
    const systemsSelected = Object.values(formData.systems).some(system => system === true);
    if (!systemsSelected) {
      console.error('No astrological systems selected');
      setLoading(false);
      return;
    }

    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store the validated birth data
      localStorage.setItem('validatedBirthData', JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
        validated: true
      }));
      
      setSubmitted(true);
      
      // After successful submission, redirect to comprehensive analysis
      setTimeout(() => {
        setLocation('/comprehensive-analysis');
      }, 3000);
      
    } catch (error) {
      console.error('Error processing birth data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center p-6">
        <Card className="cosmic-card max-w-md mx-auto text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Birth Data Validated!</h2>
            <p className="text-gray-300 mb-4">
              All required information has been confirmed and your comprehensive analysis is being prepared.
            </p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-sm text-gray-400 mt-4">Redirecting to your analysis...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-gradient">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="text-purple-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-purple-400 rounded-full flex items-center justify-center">
                <Stars className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Torchlight
              </h1>
            </div>
          </div>
          <Badge className="bg-purple-600/20 text-purple-300 border-purple-400/30">
            Birth Data Collection
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Complete Birth Information
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Provide accurate birth details for precise astrological analysis across all systems
            </p>
          </div>

          {/* Requirements Notice */}
          <Card className="cosmic-card mb-8">
            <CardHeader>
              <CardTitle className="text-orange-400 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Required Information
              </CardTitle>
              <CardDescription className="text-gray-300">
                All fields marked with * are required for accurate astrological calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-purple-300 mb-3">Personal Details</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• First and last name</li>
                    <li>• Gender at birth (for calculations)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-purple-300 mb-3">Birth Details</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Exact date of birth</li>
                    <li>• Precise time of birth</li>
                    <li>• Birth city and country</li>
                    <li>• Timezone information</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Accuracy Notice:</strong> Even small errors in birth time (±4 minutes) or location 
                  can significantly affect your astrological analysis. Please verify all information with 
                  your birth certificate if possible.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Birth Form */}
          <EnhancedBirthForm 
            onComplete={handleFormComplete}
            loading={loading}
          />

          {/* Security Notice */}
          <Card className="cosmic-card mt-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <h4 className="font-medium text-green-400 mb-2">Privacy & Security</h4>
                <p className="text-sm text-gray-400">
                  Your birth information is processed securely and used only for astrological calculations. 
                  We do not share your personal data with third parties.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
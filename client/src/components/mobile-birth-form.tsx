import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Heart,
  Star,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Info
} from "lucide-react";

const birthFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  genderAtBirth: z.enum(["Male", "Female"], {
    required_error: "Please select your gender at birth"
  }),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthCity: z.string().min(1, "Birth city is required"),
  birthCountry: z.string().min(1, "Birth country is required"),
  timezone: z.string().min(1, "Timezone is required"),
  systems: z.object({
    western: z.boolean().default(true),
    vedic: z.boolean().default(true),
    chinese: z.boolean().default(true),
    humanDesign: z.boolean().default(true),
    numerology: z.boolean().default(true),
    kp: z.boolean().default(false),
    lal: z.boolean().default(false)
  })
});

type BirthFormData = z.infer<typeof birthFormSchema>;

interface MobileBirthFormProps {
  onComplete: (data: BirthFormData) => void;
  loading?: boolean;
}

const FORM_STEPS = [
  { id: 'personal', title: 'About You', icon: User, description: 'Basic information' },
  { id: 'birth', title: 'Birth Details', icon: Calendar, description: 'When you were born' },
  { id: 'location', title: 'Birth Location', icon: MapPin, description: 'Where you were born' },
  { id: 'systems', title: 'Astrology Systems', icon: Sparkles, description: 'Choose your analysis' },
  { id: 'confirm', title: 'Confirm', icon: CheckCircle, description: 'Review & confirm all details' }
];

export default function MobileBirthForm({ onComplete, loading }: MobileBirthFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const form = useForm<BirthFormData>({
    resolver: zodResolver(birthFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      genderAtBirth: undefined,
      birthDate: "",
      birthTime: "",
      birthCity: "",
      birthCountry: "",
      timezone: "",
      systems: {
        western: true,
        vedic: true,
        chinese: true,
        humanDesign: true,
        numerology: true,
        kp: false,
        lal: false
      }
    }
  });

  const { handleSubmit, formState: { errors }, setValue, watch } = form;

  const watchedValues = watch();
  const progress = ((currentStep + 1) / FORM_STEPS.length) * 100;

  const validateCurrentStep = (): boolean => {
    const stepValidations = {
      0: () => watchedValues.firstName && watchedValues.lastName && watchedValues.email && watchedValues.genderAtBirth,
      1: () => watchedValues.birthDate && watchedValues.birthTime,
      2: () => watchedValues.birthCity && watchedValues.birthCountry && watchedValues.timezone,
      3: () => Object.values(watchedValues.systems).some(Boolean), // At least one system selected
      4: () => true // Confirmation step - allow user to review
    };
    
    return stepValidations[currentStep as keyof typeof stepValidations]?.() || false;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < FORM_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: BirthFormData) => {
    // Add final validation and confirmation
    if (!data.firstName || !data.lastName || !data.genderAtBirth || !data.birthDate || 
        !data.birthTime || !data.birthCity || !data.birthCountry || !data.timezone) {
      console.error('Missing required birth data fields');
      return;
    }
    onComplete(data);
  };

  const currentStepData = FORM_STEPS[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-purple-400 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">🔆</span>
            </div>
            <h1 className="text-2xl font-bold text-white">MyTorchlight</h1>
          </div>
          <p className="text-purple-200 text-sm">Discover your cosmic blueprint</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-200">Step {currentStep + 1} of {FORM_STEPS.length}</span>
            <span className="text-sm text-purple-200">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-purple-800" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {FORM_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = index === currentStep;
            const isPast = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    isCompleted || isPast
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-purple-400 text-black'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {isCompleted || isPast ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < FORM_STEPS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 ${
                      isPast ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <Card className="cosmic-card mb-6">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-3">
              <currentStepData.icon className="w-8 h-8 text-purple-400" />
            </div>
            <CardTitle className="text-purple-400 text-xl">{currentStepData.title}</CardTitle>
            <CardDescription className="text-purple-200">
              {currentStepData.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Personal Information */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName" className="text-white text-sm">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Your first name"
                        className="cosmic-input mt-1"
                        value={watchedValues.firstName}
                        onChange={(e) => setValue('firstName', e.target.value)}
                      />
                      {errors.firstName && (
                        <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white text-sm">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Your last name"
                        className="cosmic-input mt-1"
                        value={watchedValues.lastName}
                        onChange={(e) => setValue('lastName', e.target.value)}
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white text-sm">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="cosmic-input mt-1"
                      value={watchedValues.email}
                      onChange={(e) => setValue('email', e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="genderAtBirth" className="text-white text-sm">
                      Gender at Birth
                      <Info className="w-3 h-3 inline ml-1 text-purple-300" />
                    </Label>
                    <Select onValueChange={(value) => setValue('genderAtBirth', value as "Male" | "Female")}>
                      <SelectTrigger className="cosmic-input mt-1">
                        <SelectValue placeholder="Select gender at birth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.genderAtBirth && (
                      <p className="text-red-400 text-xs mt-1">{errors.genderAtBirth.message}</p>
                    )}
                    <p className="text-xs text-purple-300 mt-1">
                      Used for traditional astrological calculations
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Birth Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="birthDate" className="text-white text-sm flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Birth Date
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      className="cosmic-input mt-1"
                      value={watchedValues.birthDate}
                      onChange={(e) => setValue('birthDate', e.target.value)}
                    />
                    {errors.birthDate && (
                      <p className="text-red-400 text-xs mt-1">{errors.birthDate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="birthTime" className="text-white text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Birth Time
                    </Label>
                    <Input
                      id="birthTime"
                      type="time"
                      className="cosmic-input mt-1"
                      value={watchedValues.birthTime}
                      onChange={(e) => setValue('birthTime', e.target.value)}
                    />
                    {errors.birthTime && (
                      <p className="text-red-400 text-xs mt-1">{errors.birthTime.message}</p>
                    )}
                    <p className="text-xs text-purple-300 mt-1">
                      Exact time improves accuracy significantly
                    </p>
                  </div>

                  <div className="bg-blue-900/30 p-3 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div className="text-xs text-blue-200">
                        <p className="font-medium mb-1">Why birth time matters:</p>
                        <p>Your exact birth time determines your rising sign, house placements, and precise planetary positions - essential for accurate analysis across all systems.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Location */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="birthCity" className="text-white text-sm flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Birth City
                    </Label>
                    <Input
                      id="birthCity"
                      placeholder="City where you were born"
                      className="cosmic-input mt-1"
                      value={watchedValues.birthCity}
                      onChange={(e) => setValue('birthCity', e.target.value)}
                    />
                    {errors.birthCity && (
                      <p className="text-red-400 text-xs mt-1">{errors.birthCity.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="birthCountry" className="text-white text-sm">Country</Label>
                    <Input
                      id="birthCountry"
                      placeholder="Country where you were born"
                      className="cosmic-input mt-1"
                      value={watchedValues.birthCountry}
                      onChange={(e) => setValue('birthCountry', e.target.value)}
                    />
                    {errors.birthCountry && (
                      <p className="text-red-400 text-xs mt-1">{errors.birthCountry.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="timezone" className="text-white text-sm">Timezone</Label>
                    <Select onValueChange={(value) => setValue('timezone', value)}>
                      <SelectTrigger className="cosmic-input mt-1">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">Greenwich Time (UTC+0)</SelectItem>
                        <SelectItem value="UTC+1">Central European (UTC+1)</SelectItem>
                        <SelectItem value="UTC+5:30">India Standard (UTC+5:30)</SelectItem>
                        <SelectItem value="UTC+8">China Standard (UTC+8)</SelectItem>
                        <SelectItem value="UTC+9">Japan Standard (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.timezone && (
                      <p className="text-red-400 text-xs mt-1">{errors.timezone.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Systems Selection */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-white mb-2">Choose Your Analysis Systems</h3>
                    <p className="text-sm text-purple-200">Select which astrological traditions to include</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'western', name: 'Western Astrology', description: 'Zodiac signs, planets, houses', accuracy: '92%', recommended: true },
                      { key: 'vedic', name: 'Vedic (Jyotish)', description: 'Nakshatras, dashas, karmic insights', accuracy: '96%', recommended: true },
                      { key: 'chinese', name: 'Chinese Zodiac', description: 'Animal signs, five elements', accuracy: '89%', recommended: true },
                      { key: 'humanDesign', name: 'Human Design', description: 'Energy types, authority, strategy', accuracy: '85%', recommended: true },
                      { key: 'numerology', name: 'Numerology', description: 'Life path, destiny numbers', accuracy: '78%', recommended: true },
                      { key: 'kp', name: 'KP Astrology', description: 'Krishnamurti Paddhati system', accuracy: '94%', recommended: false },
                      { key: 'lal', name: 'Lal Kitab', description: 'Red book astrology & remedies', accuracy: '88%', recommended: false }
                    ].map((system) => (
                      <div key={system.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={system.key}
                            checked={!!(watchedValues.systems as any)[system.key]}
                            onChange={(e) => setValue(`systems.${system.key}` as any, e.target.checked)}
                            className="rounded border-gray-600 text-purple-400 focus:ring-yellow-400"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <label htmlFor={system.key} className="text-white font-medium text-sm">
                                {system.name}
                              </label>
                              {system.recommended && (
                                <Badge className="bg-purple-500 text-black text-xs">Recommended</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-400">{system.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                          {system.accuracy}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="bg-purple-900/30 p-3 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-purple-400 mt-0.5" />
                      <div className="text-xs text-purple-200">
                        <p className="font-medium mb-1">Recommended combination:</p>
                        <p>The first 5 systems provide comprehensive coverage across cultures and methodologies for the most complete analysis.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between space-x-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex-1 cosmic-button-outline"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {currentStep < FORM_STEPS.length - 1 ? (
            <Button
              onClick={nextStep}
              disabled={!validateCurrentStep()}
              className="flex-1 cosmic-button"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="flex-1 cosmic-button"
            >
              {loading ? (
                <>
                  <div className="cosmic-spinner mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1" />
                  Create My Chart
                </>
              )}
            </Button>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-purple-300">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Swiss Ephemeris Precision</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
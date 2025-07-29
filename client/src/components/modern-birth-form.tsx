import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Calendar, MapPin, Clock, User, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { WORLD_TIMEZONES } from "@/lib/timezone-handler";

const birthFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
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
  }),
  confirmed: z.boolean().refine(val => val === true, {
    message: "Please confirm that all information is accurate"
  })
});

type BirthFormData = z.infer<typeof birthFormSchema>;

interface ModernBirthFormProps {
  onClose: () => void;
  onComplete?: (data: BirthFormData) => void;
}

export default function ModernBirthForm({ onClose, onComplete }: ModernBirthFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeAccuracyWarnings, setTimeAccuracyWarnings] = useState<string[]>([]);

  // Create comprehensive city list with Manila and Philippines cities
  const globalCities = [
    // Philippines - Comprehensive coverage
    "Manila", "Quezon City", "Makati", "Pasig", "Taguig", "Cebu City", "Davao", "Zamboanga", 
    "Antipolo", "Pasay", "Caloocan", "Las Piñas", "Marikina", "Muntinlupa", "Parañaque", 
    "Valenzuela", "Bacoor", "General Santos", "Iloilo City", "Cagayan de Oro", "Bacolod", 
    "Baguio", "Butuan", "Cotabato", "Dumaguete", "Iligan", "Legazpi", "Lucena", "Naga", 
    "Olongapo", "San Pablo", "Tacloban", "Tagaytay", "Tuguegarao",
    
    // Major world cities
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio",
    "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus",
    "London", "Manchester", "Birmingham", "Liverpool", "Edinburgh", "Glasgow", "Cardiff",
    "Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Strasbourg", "Bordeaux", "Lille",
    "Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf",
    "Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo", "Kyoto", "Kobe", "Fukuoka",
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
    "Shanghai", "Beijing", "Guangzhou", "Shenzhen", "Tianjin", "Wuhan", "Chengdu", "Nanjing",
    "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra", "Darwin", "Hobart",
    "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Halifax",
    "São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte",
    "Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Hat Yai", "Krabi", "Hua Hin",
    "Singapore", "Kuala Lumpur", "George Town", "Ipoh", "Johor Bahru", "Kuching",
    "Jakarta", "Surabaya", "Bandung", "Bekasi", "Medan", "Tangerang", "Semarang"
  ].sort();

  const form = useForm<BirthFormData>({
    resolver: zodResolver(birthFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
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
      },
      confirmed: false
    }
  });

  const { handleSubmit, watch, setValue, getValues } = form;
  const watchedValues = watch();

  // Auto-detect timezone when city changes
  const handleCityChange = (city: string) => {
    const cityTimezoneMap: Record<string, string> = {
      // Philippines cities
      'manila': 'Asia/Manila', 'quezon': 'Asia/Manila', 'makati': 'Asia/Manila',
      'cebu': 'Asia/Manila', 'davao': 'Asia/Manila', 'zamboanga': 'Asia/Manila',
      
      // Major world cities
      'new york': 'America/New_York', 'los angeles': 'America/Los_Angeles',
      'chicago': 'America/Chicago', 'houston': 'America/Chicago',
      'london': 'Europe/London', 'paris': 'Europe/Paris', 'berlin': 'Europe/Berlin',
      'tokyo': 'Asia/Tokyo', 'mumbai': 'Asia/Kolkata', 'delhi': 'Asia/Kolkata',
      'shanghai': 'Asia/Shanghai', 'beijing': 'Asia/Shanghai',
      'sydney': 'Australia/Sydney', 'melbourne': 'Australia/Sydney',
      'bangkok': 'Asia/Bangkok', 'singapore': 'Asia/Singapore',
      'kuala lumpur': 'Asia/Kuala_Lumpur', 'jakarta': 'Asia/Jakarta'
    };
    
    const normalizedCity = city.toLowerCase();
    for (const [key, timezone] of Object.entries(cityTimezoneMap)) {
      if (normalizedCity.includes(key)) {
        setValue('timezone', timezone);
        break;
      }
    }

    // Auto-set country for Philippines cities
    const philippinesCities = ['manila', 'quezon', 'makati', 'cebu', 'davao', 'zamboanga', 'antipolo', 'pasay', 'caloocan', 'las piñas'];
    if (philippinesCities.some(phCity => normalizedCity.includes(phCity))) {
      setValue('birthCountry', 'Philippines');
    }
  };

  // Validate time accuracy
  const validateTimeAccuracy = () => {
    const { birthTime } = getValues();
    const warnings = [];
    if (birthTime && (birthTime.endsWith(':00') || birthTime.endsWith(':30'))) {
      warnings.push('Rounded times may affect rising sign accuracy. Try to get exact birth time from birth certificate.');
    }
    setTimeAccuracyWarnings(warnings);
  };

  const onSubmit = async (data: BirthFormData) => {
    console.log('Birth form data:', data);
    
    // Generate comprehensive astrological analysis
    try {
      const response = await fetch('/api/generate-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const chartData = await response.json();
        onComplete?.(chartData);
      } else {
        console.error('Failed to generate chart');
        onComplete?.(data);
      }
    } catch (error) {
      console.error('Error generating chart:', error);
      onComplete?.(data);
    }
    
    onClose();
  };

  const steps = [
    { title: "Personal Info", icon: User },
    { title: "Birth Details", icon: Calendar },
    { title: "Systems", icon: CheckCircle2 }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-black/40 border-white/20 backdrop-blur-md">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <CardTitle className="text-white text-xl text-center mb-4">
            Create Your Cosmic Profile
          </CardTitle>

          {/* Progress Steps */}
          <div className="flex justify-center space-x-4 mb-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep 
                    ? 'bg-purple-500 border-purple-500 text-white' 
                    : 'border-white/30 text-white/50'
                }`}>
                  <step.icon className="h-4 w-4" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-purple-500' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Step 0: Personal Information */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-white font-medium mb-2">Personal Information</h3>
                    <p className="text-gray-300 text-sm">Tell us about yourself</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="cosmic-label">First Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your first name" 
                              className="cosmic-input text-lg"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="cosmic-label">Last Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your last name" 
                              className="cosmic-input text-lg"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="genderAtBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="cosmic-label">Gender at Birth *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="cosmic-select text-white">
                              <SelectValue placeholder="Select your gender at birth" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 1: Birth Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-white font-medium mb-2">Birth Details</h3>
                    <p className="text-gray-300 text-sm">When and where were you born?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="cosmic-label">Birth Date *</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              className="cosmic-input text-lg"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="cosmic-label">Birth Time *</FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              className="cosmic-input text-lg"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                validateTimeAccuracy();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="birthCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="cosmic-label">Birth City *</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          handleCityChange(value);
                        }} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="cosmic-select text-white">
                              <SelectValue placeholder="Select your birth city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {globalCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                                {city.includes("Manila") || city.includes("Quezon") || city.includes("Cebu") ? (
                                  <Badge variant="outline" className="ml-2 text-xs">Philippines</Badge>
                                ) : null}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="cosmic-label">Birth Country *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your birth country" 
                            className="cosmic-input text-lg"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="cosmic-label">Timezone *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="cosmic-select text-white">
                              <SelectValue placeholder="Select your timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {WORLD_TIMEZONES.map((tz) => (
                              <SelectItem key={tz.id} value={tz.id}>
                                {tz.name} ({tz.cities[0]}) - UTC{tz.offset >= 0 ? '+' : ''}{tz.offset}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {timeAccuracyWarnings.length > 0 && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-center text-yellow-400 text-sm font-medium mb-1">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Time Accuracy Notice
                      </div>
                      {timeAccuracyWarnings.map((warning, index) => (
                        <p key={index} className="text-xs text-yellow-300">
                          • {warning}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Systems Selection */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-white font-medium mb-2">Analysis Systems</h3>
                    <p className="text-gray-300 text-sm">Choose which astrological systems to include</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { key: 'western', label: 'Western Astrology', desc: 'Tropical zodiac with personality insights' },
                      { key: 'vedic', label: 'Vedic (Jyotish)', desc: 'Ancient Indian system with karma insights' },
                      { key: 'chinese', label: 'Chinese Zodiac', desc: 'Animal signs and element analysis' },
                      { key: 'humanDesign', label: 'Human Design', desc: 'Energy type and decision strategy' },
                      { key: 'numerology', label: 'Numerology', desc: 'Life path and destiny numbers' }
                    ].map((system) => (
                      <FormField
                        key={system.key}
                        control={form.control}
                        name={`systems.${system.key}` as keyof BirthFormData['systems']}
                        render={({ field }) => (
                          <Card className="bg-white/5 border-white/20 p-4">
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-white font-medium">
                                  {system.label}
                                </FormLabel>
                                <p className="text-gray-300 text-sm">{system.desc}</p>
                              </div>
                            </FormItem>
                          </Card>
                        )}
                      />
                    ))}
                  </div>

                  <FormField
                    control={form.control}
                    name="confirmed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white/5 border border-white/20 rounded-lg p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white">
                            I confirm that all information is accurate *
                          </FormLabel>
                          <p className="text-gray-300 text-xs">
                            Accurate birth details ensure precise astrological calculations
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Previous
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="cosmic-button text-lg px-8 py-3"
                  >
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="cosmic-button text-lg px-8 py-3"
                  >
                    Generate My Cosmic Profile ✨
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
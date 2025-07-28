import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Clock, Settings, User, CheckCircle2, AlertTriangle, ChevronRight, ChevronLeft, Globe } from "lucide-react";
import { detectTimezoneFromCity, getTimezonesByRegion, validateBirthTimeAccuracy, WORLD_TIMEZONES, type TimezoneInfo } from "@/lib/timezone-handler";

const enhancedBirthSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  genderAtBirth: z.enum(["Male", "Female"], {
    required_error: "Please select your gender at birth"
  }),
  birthDate: z.string().min(1, "Birth date is required").refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 120;
  }, "Please enter a valid birth date"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthCity: z.string().min(1, "Birth city is required"),
  birthCountry: z.string().min(1, "Birth country is required"),
  timezone: z.string().min(1, "Timezone is required"),
  timezoneAutoDetected: z.boolean().default(false),
  systems: z.object({
    western: z.boolean().default(true),
    vedic: z.boolean().default(true),
    chinese: z.boolean().default(true),
    humanDesign: z.boolean().default(true),
    numerology: z.boolean().default(true),
  }),
  confirmed: z.boolean().refine(val => val === true, {
    message: "Please confirm that all information is accurate"
  }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Please accept the terms and conditions"
  })
});

type EnhancedBirthFormData = z.infer<typeof enhancedBirthSchema>;

interface EnhancedBirthFormProps {
  onComplete: (data: EnhancedBirthFormData) => void;
  loading?: boolean;
}

const FORM_STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User, description: 'Basic information' },
  { id: 'birth', title: 'Birth Details', icon: Calendar, description: 'Date, time & location' },
  { id: 'systems', title: 'Systems', icon: Settings, description: 'Analysis preferences' },
  { id: 'confirm', title: 'Confirm', icon: CheckCircle2, description: 'Review & submit' }
];

export default function EnhancedBirthForm({ onComplete, loading }: EnhancedBirthFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [timezoneGroups] = useState(() => getTimezonesByRegion());
  const [timeAccuracyWarnings, setTimeAccuracyWarnings] = useState<string[]>([]);
  const [detectedTimezone, setDetectedTimezone] = useState<string>('');

  const form = useForm<EnhancedBirthFormData>({
    resolver: zodResolver(enhancedBirthSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      genderAtBirth: undefined,
      birthDate: "",
      birthTime: "",
      birthCity: "",
      birthCountry: "",
      timezone: "",
      timezoneAutoDetected: false,
      systems: {
        western: true,
        vedic: true,
        chinese: true,
        humanDesign: true,
        numerology: true,
      },
      confirmed: false,
      acceptTerms: false
    }
  });

  const { handleSubmit, formState: { errors }, watch, setValue, getValues } = form;
  const watchedValues = watch();
  const progress = ((currentStep + 1) / FORM_STEPS.length) * 100;

  // Auto-detect timezone when city changes
  const handleCityChange = (city: string) => {
    if (city.length > 2) {
      const detected = detectTimezoneFromCity(city, watchedValues.birthCountry);
      if (detected && detected !== watchedValues.timezone) {
        setDetectedTimezone(detected);
        setValue('timezone', detected);
        setValue('timezoneAutoDetected', true);
      }
    }
  };

  // Validate time accuracy when birth time or timezone changes
  const validateTimeAccuracy = () => {
    const { birthDate, birthTime, timezone } = getValues();
    if (birthDate && birthTime && timezone) {
      try {
        const birthDateTime = `${birthDate}T${birthTime}:00`;
        const validation = validateBirthTimeAccuracy(birthDateTime, timezone);
        setTimeAccuracyWarnings(validation.warnings);
      } catch (error) {
        setTimeAccuracyWarnings(['Unable to validate timezone. Please check your selection.']);
      }
    }
  };

  const validateCurrentStep = (): boolean => {
    const stepValidations = {
      0: () => watchedValues.firstName && watchedValues.lastName && watchedValues.genderAtBirth,
      1: () => watchedValues.birthDate && watchedValues.birthTime && watchedValues.birthCity && watchedValues.birthCountry && watchedValues.timezone,
      2: () => Object.values(watchedValues.systems).some(system => system === true),
      3: () => watchedValues.confirmed && watchedValues.acceptTerms
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

  const onSubmit = (data: EnhancedBirthFormData) => {
    onComplete(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Header */}
      <Card className="cosmic-card mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-orange-400">Birth Information</CardTitle>
            <Badge variant="outline" className="text-purple-300 border-purple-400">
              Step {currentStep + 1} of {FORM_STEPS.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {FORM_STEPS.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    index <= currentStep ? 'text-orange-400' : 'text-gray-500'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 mb-1 ${
                    completedSteps.includes(index) ? 'text-green-400' : ''
                  }`} />
                  <span className="text-xs hidden md:block">{step.title}</span>
                </div>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      {/* Form Content */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center">
            {(() => {
              const IconComponent = FORM_STEPS[currentStep].icon;
              return <IconComponent className="mr-2 h-5 w-5" />;
            })()}
            {FORM_STEPS[currentStep].title}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {FORM_STEPS[currentStep].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Step 0: Personal Information */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">First Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your first name"
                              className="cosmic-input"
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
                          <FormLabel className="text-white">Last Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your last name"
                              className="cosmic-input"
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
                        <FormLabel className="text-white">Gender at Birth *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="cosmic-input">
                              <SelectValue placeholder="Select your gender at birth" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        <p className="text-xs text-gray-400 mt-1">
                          Required for accurate astrological calculations
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 1: Birth Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            Birth Date *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              className="cosmic-input"
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
                          <FormLabel className="text-white flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            Birth Time *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              step="60"
                              className="cosmic-input"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setTimeout(validateTimeAccuracy, 100);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-400 mt-1">
                            Check your birth certificate for exact time
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="birthCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            Birth City *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Paris, New York, Mumbai"
                              className="cosmic-input"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleCityChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                          {detectedTimezone && (
                            <div className="text-xs text-green-400 mt-1 flex items-center">
                              <Globe className="mr-1 h-3 w-3" />
                              Auto-detected timezone: {WORLD_TIMEZONES.find(tz => tz.identifier === detectedTimezone)?.displayName}
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Birth Country *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., United States, France, India"
                              className="cosmic-input"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Advanced Timezone Selection */}
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white flex items-center">
                          <Globe className="mr-2 h-4 w-4" />
                          Timezone * 
                          {watchedValues.timezoneAutoDetected && (
                            <Badge variant="outline" className="ml-2 text-green-400 border-green-400/30">
                              Auto-detected
                            </Badge>
                          )}
                        </FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          setValue('timezoneAutoDetected', false);
                          validateTimeAccuracy();
                        }} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="cosmic-input">
                              <SelectValue placeholder="Select your timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-96">
                            {Object.entries(timezoneGroups).map(([region, timezones]) => (
                              <div key={region}>
                                <div className="px-2 py-1.5 text-sm font-semibold text-gray-400 bg-gray-800">
                                  {region}
                                </div>
                                {timezones.map((tz) => (
                                  <SelectItem key={tz.identifier} value={tz.identifier}>
                                    <div className="flex items-center justify-between w-full">
                                      <span>{tz.displayName}</span>
                                      <span className="text-xs text-gray-400 ml-2">
                                        UTC{tz.utcOffset >= 0 ? '+' : ''}{tz.utcOffset}
                                        {tz.hasDST && ' (DST)'}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        
                        {/* Time Accuracy Warnings */}
                        {timeAccuracyWarnings.length > 0 && (
                          <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <div className="flex items-center text-yellow-400 text-sm font-medium mb-1">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Time Accuracy Notices
                            </div>
                            {timeAccuracyWarnings.map((warning, index) => (
                              <p key={index} className="text-xs text-yellow-300 mb-1">
                                • {warning}
                              </p>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-400 mt-2">
                          💡 DST (Daylight Saving) is automatically calculated for your birth date.
                          <br />
                          The system adjusts for historical timezone changes and leap years.
                        </p>
                      </FormItem>
                    )}
                  />
                          <FormLabel className="text-white flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            Birth City *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your birth city"
                              className="cosmic-input"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Birth Country *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your birth country"
                              className="cosmic-input"
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
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Timezone *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="cosmic-input">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PST)</SelectItem>
                            <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                            <SelectItem value="Europe/Berlin">Central European Time (CET)</SelectItem>
                            <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                            <SelectItem value="Australia/Sydney">Australian Eastern Time</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Astrological Systems */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-white font-medium mb-2">Choose Analysis Systems</h3>
                    <p className="text-gray-400 text-sm">Select which astrological systems to include in your analysis</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="systems.western"
                      render={({ field }) => (
                        <Card className="bg-slate-800/50 border-purple-400/30 p-4">
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-white font-medium">Western Astrology</FormLabel>
                              <p className="text-xs text-gray-400">Tropical zodiac, planets & houses</p>
                            </div>
                          </FormItem>
                        </Card>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="systems.vedic"
                      render={({ field }) => (
                        <Card className="bg-slate-800/50 border-orange-400/30 p-4">
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-white font-medium">Vedic Astrology</FormLabel>
                              <p className="text-xs text-gray-400">Sidereal zodiac, nakshatras & dashas</p>
                            </div>
                          </FormItem>
                        </Card>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="systems.chinese"
                      render={({ field }) => (
                        <Card className="bg-slate-800/50 border-red-400/30 p-4">
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-white font-medium">Chinese Zodiac</FormLabel>
                              <p className="text-xs text-gray-400">Animal signs & elements</p>
                            </div>
                          </FormItem>
                        </Card>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="systems.humanDesign"
                      render={({ field }) => (
                        <Card className="bg-slate-800/50 border-blue-400/30 p-4">
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-white font-medium">Human Design</FormLabel>
                              <p className="text-xs text-gray-400">Type, strategy & authority</p>
                            </div>
                          </FormItem>
                        </Card>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="systems.numerology"
                      render={({ field }) => (
                        <Card className="bg-slate-800/50 border-green-400/30 p-4">
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-white font-medium">Numerology</FormLabel>
                              <p className="text-xs text-gray-400">Life path & destiny numbers</p>
                            </div>
                          </FormItem>
                        </Card>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-orange-400 font-medium mb-2">Review Your Information</h3>
                    <p className="text-gray-400 text-sm">Please verify all details before proceeding</p>
                  </div>

                  {/* Information Summary */}
                  <Card className="bg-slate-800/50 border-purple-400/30">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Name:</span>
                          <div className="text-white font-medium">{watchedValues.firstName} {watchedValues.lastName}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Gender:</span>
                          <div className="text-white font-medium">{watchedValues.genderAtBirth}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Birth Date:</span>
                          <div className="text-white font-medium">{watchedValues.birthDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Birth Time:</span>
                          <div className="text-white font-medium">{watchedValues.birthTime}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Birth Location:</span>
                          <div className="text-white font-medium">{watchedValues.birthCity}, {watchedValues.birthCountry}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Timezone:</span>
                          <div className="text-white font-medium">{watchedValues.timezone}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <span className="text-gray-400">Selected Systems:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {watchedValues.systems.western && <Badge className="bg-purple-600">Western</Badge>}
                          {watchedValues.systems.vedic && <Badge className="bg-orange-600">Vedic</Badge>}
                          {watchedValues.systems.chinese && <Badge className="bg-red-600">Chinese</Badge>}
                          {watchedValues.systems.humanDesign && <Badge className="bg-blue-600">Human Design</Badge>}
                          {watchedValues.systems.numerology && <Badge className="bg-green-600">Numerology</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Accuracy Warning */}
                  <Card className="bg-yellow-900/20 border-yellow-500/30">
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-400 mb-2">Accuracy Notice</h4>
                          <p className="text-yellow-200 text-sm">
                            Astrological calculations require precise birth information. Small errors in time or location 
                            can significantly affect your analysis. Please verify all details are correct.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Confirmation Checkboxes */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="confirmed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-white font-medium">
                              I confirm that all birth information above is accurate to the best of my knowledge
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-white font-medium">
                              I accept the terms and understand this is for entertainment purposes
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6">
                {currentStep > 0 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                )}
                
                {currentStep < FORM_STEPS.length - 1 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="cosmic-button flex-1 flex items-center justify-center"
                    disabled={!validateCurrentStep()}
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="cosmic-button flex-1"
                    disabled={loading || !validateCurrentStep()}
                  >
                    {loading ? "Generating Analysis..." : "Generate Astrological Analysis"}
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
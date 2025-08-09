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
import { Calendar, MapPin, Clock, Settings, User, CheckCircle2, AlertTriangle } from "lucide-react";
import CitySearch from "@/components/city-search";
import { type CityData, getTimezoneForDate } from "@/lib/city-timezone";

const birthDataSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  genderAtBirth: z.enum(["Male", "Female"], {
    required_error: "Please select your gender at birth"
  }),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  location: z.object({
    city: z.string(),
    country: z.string(), 
    timezone: z.string(),
    latitude: z.number(),
    longitude: z.number()
  }).optional(),
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

type BirthDataFormData = z.infer<typeof birthDataSchema>;

interface BirthDataFormProps {
  onSubmit?: (data: BirthDataFormData) => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export default function BirthDataForm({ onSubmit, onClose, isLoading = false }: BirthDataFormProps) {
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  
  const form = useForm<BirthDataFormData>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      genderAtBirth: undefined,
      birthDate: "",
      birthTime: "",
      location: undefined,
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

  const watchedValues = form.watch();

  const validateRequiredFields = () => {
    const { firstName, lastName, genderAtBirth, birthDate, birthTime, location } = watchedValues;
    return firstName && lastName && genderAtBirth && birthDate && birthTime && location;
  };

  const handleCitySelect = (city: CityData) => {
    setSelectedCity(city);
    const birthDate = form.getValues('birthDate');
    const actualTimezone = birthDate ? getTimezoneForDate(city, new Date(birthDate)) : city.utcOffset;
    
    form.setValue('location', {
      city: city.city,
      country: city.country,
      timezone: city.timezone,
      latitude: city.latitude,
      longitude: city.longitude
    });
  };

  return (
    <Card className="sanctuary-card cosmic-glow max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-yellow-600 text-2xl text-center">
          Enter Your Birth Information
        </CardTitle>
        <CardDescription className="text-gray-400 text-center">
          Provide accurate birth details for precise astrological calculations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => {
            onSubmit?.(data);
            // Navigate to analysis page
            window.location.href = '/analysis';
            onClose?.();
          })} className="space-y-6">

            {step === 'input' && (
              <>
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-300 flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personal Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">First Name</FormLabel>
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
                          <FormLabel className="text-white">Last Name</FormLabel>
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
                        <FormLabel className="text-white">Gender at Birth</FormLabel>
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
                      </FormItem>
                    )}
                  />
                </div>
                {/* Birth Date and Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-300 flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Birth Date & Time
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Birth Date
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
                      Birth Time
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        className="cosmic-input"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-300 flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Birth Location
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      City
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your birth city"
                        className="cosmic-input"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Country</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your birth country"
                        className="cosmic-input"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Timezone */}
            <FormField
              control={form.control}
              name="location.timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Timezone</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
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

            {/* Astrological Systems */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-yellow-600" />
                <h3 className="text-white font-medium">Select Astrological Systems</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="systems.western"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">Western Astrology</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="systems.vedic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">Vedic Astrology</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="systems.chinese"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">Chinese Zodiac</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="systems.humanDesign"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">Human Design</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="systems.numerology"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">Numerology</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full sanctuary-button"
              disabled={isLoading}
            >
              {isLoading ? "Calculating Your Chart..." : "Generate My Chart"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
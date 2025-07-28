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
  }).nullable(),
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

interface ModernBirthFormProps {
  onSubmit?: (data: BirthDataFormData) => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export default function ModernBirthForm({ onSubmit, onClose, isLoading = false }: ModernBirthFormProps) {
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
      location: null,
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

  const handleSubmit = (data: BirthDataFormData) => {
    if (step === 'input') {
      setStep('confirm');
    } else {
      onSubmit?.(data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-2" style={{borderColor: 'var(--cosmic-purple)', background: 'var(--cosmic-indigo)'}}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{color: 'var(--cosmic-lavender)'}}>
            <User className="h-5 w-5" style={{color: 'var(--cosmic-gold)'}} />
            {step === 'input' ? 'Enter Your Birth Details' : 'Confirm Your Information'}
          </CardTitle>
          <CardDescription style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
            {step === 'input' 
              ? 'Accurate birth details ensure precise astrological calculations. Every 4 minutes of birth time affects your chart.'
              : 'Please review your information before generating your cosmic profile.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {step === 'input' ? (
                <>
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center" style={{color: 'var(--cosmic-gold)'}}>
                      <User className="mr-2 h-5 w-5" />
                      Personal Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel style={{color: 'var(--cosmic-lavender)'}}>First Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your first name"
                                style={{
                                  background: 'var(--cosmic-navy)',
                                  borderColor: 'var(--cosmic-purple)',
                                  color: 'var(--cosmic-lavender)'
                                }}
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
                            <FormLabel style={{color: 'var(--cosmic-lavender)'}}>Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your last name"
                                style={{
                                  background: 'var(--cosmic-navy)',
                                  borderColor: 'var(--cosmic-purple)',
                                  color: 'var(--cosmic-lavender)'
                                }}
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
                          <FormLabel style={{color: 'var(--cosmic-lavender)'}}>Gender at Birth</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger style={{
                                background: 'var(--cosmic-navy)',
                                borderColor: 'var(--cosmic-purple)',
                                color: 'var(--cosmic-lavender)'
                              }}>
                                <SelectValue placeholder="Select your gender at birth" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent style={{background: 'var(--cosmic-navy)', borderColor: 'var(--cosmic-purple)'}}>
                              <SelectItem value="Male" style={{color: 'var(--cosmic-lavender)'}}>Male</SelectItem>
                              <SelectItem value="Female" style={{color: 'var(--cosmic-lavender)'}}>Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Birth Date and Time */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center" style={{color: 'var(--cosmic-gold)'}}>
                      <Calendar className="mr-2 h-5 w-5" />
                      Birth Date & Time
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center" style={{color: 'var(--cosmic-lavender)'}}>
                              <Calendar className="mr-2 h-4 w-4" />
                              Birth Date
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                style={{
                                  background: 'var(--cosmic-navy)',
                                  borderColor: 'var(--cosmic-purple)',
                                  color: 'var(--cosmic-lavender)'
                                }}
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
                            <FormLabel className="flex items-center" style={{color: 'var(--cosmic-lavender)'}}>
                              <Clock className="mr-2 h-4 w-4" />
                              Birth Time
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                style={{
                                  background: 'var(--cosmic-navy)',
                                  borderColor: 'var(--cosmic-purple)',
                                  color: 'var(--cosmic-lavender)'
                                }}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs mt-1" style={{color: 'var(--cosmic-lavender)', opacity: 0.7}}>
                              Accurate birth time is crucial - every 4 minutes affects your rising sign and house placements
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center" style={{color: 'var(--cosmic-gold)'}}>
                      <MapPin className="mr-2 h-5 w-5" />
                      Birth Location
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center" style={{color: 'var(--cosmic-lavender)'}}>
                            <MapPin className="mr-2 h-4 w-4" />
                            Birth Location (City & Country)
                          </FormLabel>
                          <FormControl>
                            <CitySearch
                              value={selectedCity}
                              onSelect={handleCitySelect}
                              birthDate={form.getValues('birthDate') ? new Date(form.getValues('birthDate')) : undefined}
                              placeholder="Search for your birth city..."
                            />
                          </FormControl>
                          <FormMessage />
                          {selectedCity && (
                            <div className="text-sm mt-2 p-2 rounded" style={{background: 'var(--cosmic-navy)', color: 'var(--cosmic-lavender)'}}>
                              📍 {selectedCity.city}, {selectedCity.country} <br />
                              🕒 Timezone: {form.getValues('birthDate') ? 
                                `UTC${getTimezoneForDate(selectedCity, new Date(form.getValues('birthDate'))) >= 0 ? '+' : ''}${getTimezoneForDate(selectedCity, new Date(form.getValues('birthDate')))}` : 
                                `UTC${selectedCity.utcOffset >= 0 ? '+' : ''}${selectedCity.utcOffset}`
                              } 
                              {form.getValues('birthDate') && selectedCity.dstOffset && 
                               getTimezoneForDate(selectedCity, new Date(form.getValues('birthDate'))) === selectedCity.dstOffset && 
                               ' (Daylight Saving Time)'}
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Astrological Systems */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center" style={{color: 'var(--cosmic-gold)'}}>
                      <Settings className="mr-2 h-5 w-5" />
                      Astrological Systems to Include
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { key: 'western' as const, label: 'Western Astrology', icon: '☉' },
                        { key: 'vedic' as const, label: 'Vedic (Jyotish)', icon: 'ॐ' },
                        { key: 'chinese' as const, label: 'Chinese Zodiac', icon: '☯' },
                        { key: 'humanDesign' as const, label: 'Human Design', icon: '◊' },
                        { key: 'numerology' as const, label: 'Numerology', icon: '∞' }
                      ].map(system => (
                        <FormField
                          key={system.key}
                          control={form.control}
                          name={`systems.${system.key}`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  style={{borderColor: 'var(--cosmic-purple)'}}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm" style={{color: 'var(--cosmic-lavender)'}}>
                                  <span className="mr-2">{system.icon}</span>
                                  {system.label}
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // Confirmation step
                <div className="space-y-6">
                  <div className="grid gap-4" style={{background: 'var(--cosmic-navy)', padding: '1rem', borderRadius: '0.5rem'}}>
                    <div>
                      <h4 className="font-semibold" style={{color: 'var(--cosmic-gold)'}}>Personal Information</h4>
                      <p style={{color: 'var(--cosmic-lavender)'}}>{watchedValues.firstName} {watchedValues.lastName}</p>
                      <p style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>Gender at birth: {watchedValues.genderAtBirth}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold" style={{color: 'var(--cosmic-gold)'}}>Birth Details</h4>
                      <p style={{color: 'var(--cosmic-lavender)'}}>{watchedValues.birthDate} at {watchedValues.birthTime}</p>
                      {watchedValues.location && (
                        <p style={{color: 'var(--cosmic-lavender)', opacity: 0.8}}>
                          {watchedValues.location.city}, {watchedValues.location.country}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold" style={{color: 'var(--cosmic-gold)'}}>Selected Systems</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(watchedValues.systems)
                          .filter(([_, enabled]) => enabled)
                          .map(([system]) => (
                            <span key={system} className="px-2 py-1 rounded text-xs" style={{background: 'var(--cosmic-purple)', color: 'var(--cosmic-lavender)'}}>
                              {system.charAt(0).toUpperCase() + system.slice(1)}
                            </span>
                          ))
                        }
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="confirmed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4" style={{borderColor: 'var(--cosmic-purple)'}}>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            style={{borderColor: 'var(--cosmic-purple)'}}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel style={{color: 'var(--cosmic-lavender)'}}>
                            I confirm that all the information provided is accurate to the best of my knowledge
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {step === 'confirm' && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('input')}
                    style={{borderColor: 'var(--cosmic-purple)', color: 'var(--cosmic-lavender)'}}
                  >
                    Back to Edit
                  </Button>
                )}
                
                <Button 
                  type="submit" 
                  disabled={!validateRequiredFields() || isLoading}
                  className="flex-1"
                  style={{background: 'var(--cosmic-gradient-2)', color: 'var(--cosmic-lavender)'}}
                >
                  {isLoading ? (
                    <>Loading...</>
                  ) : step === 'input' ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Review Details
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Generate Cosmic Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
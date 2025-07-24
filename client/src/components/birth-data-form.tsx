import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const birthDataSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  timezone: z.string().min(1, "Timezone is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  systems: z.object({
    western: z.boolean(),
    vedic: z.boolean(),
    chinese: z.boolean(),
    humanDesign: z.boolean(),
  }),
});

type BirthDataForm = z.infer<typeof birthDataSchema>;

interface BirthDataFormProps {
  onClose: () => void;
}

export default function BirthDataForm({ onClose }: BirthDataFormProps) {
  const [step, setStep] = useState(1);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<BirthDataForm>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      fullName: "",
      email: "",
      birthDate: "",
      birthTime: "",
      timezone: "",
      city: "",
      country: "",
      latitude: undefined,
      longitude: undefined,
      systems: {
        western: true,
        vedic: true,
        chinese: true,
        humanDesign: true,
      },
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: { fullName: string; email: string }) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  const createBirthDataMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/birth-data", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/birth-data"] });
      toast({
        title: "Birth data saved successfully!",
        description: "Your cosmic blueprint is ready for analysis.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save birth data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: BirthDataForm) => {
    try {
      // Create user first
      const user = await createUserMutation.mutateAsync({
        fullName: data.fullName,
        email: data.email,
      });

      // Then create birth data
      const birthDataPayload = {
        userId: user.id,
        birthDate: data.birthDate,
        birthTime: data.birthTime,
        timezone: data.timezone,
        city: data.city,
        country: data.country,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        systems: data.systems,
      };

      createBirthDataMutation.mutate(birthDataPayload);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const timezones = [
    { value: "EST", label: "Eastern (EST)" },
    { value: "CST", label: "Central (CST)" },
    { value: "MST", label: "Mountain (MST)" },
    { value: "PST", label: "Pacific (PST)" },
    { value: "GMT", label: "Greenwich (GMT)" },
    { value: "CET", label: "Central European (CET)" },
    { value: "JST", label: "Japan (JST)" },
    { value: "AEST", label: "Australian Eastern (AEST)" },
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="cosmic-card max-w-4xl max-h-[90vh] overflow-y-auto border-yellow-500/20">
        <DialogHeader>
          <DialogTitle className="text-yellow-500 text-2xl font-serif">
            Secure Birth Data Collection
          </DialogTitle>
          <p className="text-gray-400">
            Precision is paramount in authentic astrology. Provide your exact birth details for the most accurate cosmic analysis.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-500 font-medium">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-500 font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="cosmic-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Birth Date and Time */}
            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-500 font-medium">Birth Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="cosmic-input" {...field} />
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
                    <FormLabel className="text-yellow-500 font-medium">Birth Time</FormLabel>
                    <FormControl>
                      <Input type="time" className="cosmic-input" {...field} />
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
                    <FormLabel className="text-yellow-500 font-medium">Time Zone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="cosmic-input">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="cosmic-card border-yellow-500/20">
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Birth Location */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-500 font-medium">City</FormLabel>
                    <FormControl>
                      <Input placeholder="Birth city" className="cosmic-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-500 font-medium">Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Birth country" className="cosmic-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Coordinate Precision */}
            <Card className="cosmic-card border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-yellow-500 font-medium text-lg flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  Precise Coordinates (Optional but Recommended)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-sm">Latitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="40.7128"
                            className="cosmic-input"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400 text-sm">Longitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="-74.0060"
                            className="cosmic-input"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Selection */}
            <div>
              <FormLabel className="text-yellow-500 font-medium mb-4 block">
                Astrological Systems to Include
              </FormLabel>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="systems.western"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-yellow-500 data-[state=checked]:bg-yellow-500"
                        />
                      </FormControl>
                      <FormLabel className="text-white cursor-pointer">
                        Western Astrology
                      </FormLabel>
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
                          className="border-yellow-500 data-[state=checked]:bg-yellow-500"
                        />
                      </FormControl>
                      <FormLabel className="text-white cursor-pointer">
                        Vedic (Jyotish)
                      </FormLabel>
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
                          className="border-yellow-500 data-[state=checked]:bg-yellow-500"
                        />
                      </FormControl>
                      <FormLabel className="text-white cursor-pointer">
                        Chinese Zodiac
                      </FormLabel>
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
                          className="border-yellow-500 data-[state=checked]:bg-yellow-500"
                        />
                      </FormControl>
                      <FormLabel className="text-white cursor-pointer">
                        Human Design
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Privacy Notice */}
            <Card className="cosmic-card border-yellow-500/20">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="text-yellow-500 font-medium mb-1">Your Privacy is Sacred</h4>
                    <p className="text-gray-400 text-sm">
                      Your birth data is encrypted and stored securely. We never share personal information and you can delete your data at any time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <Button
                type="submit"
                className="cosmic-button px-12 py-4 text-lg h-auto"
                disabled={createUserMutation.isPending || createBirthDataMutation.isPending}
              >
                {(createUserMutation.isPending || createBirthDataMutation.isPending) 
                  ? "Generating Your Cosmic Blueprint..." 
                  : "Generate My Cosmic Blueprint"
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

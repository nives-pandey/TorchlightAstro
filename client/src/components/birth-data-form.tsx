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
import { Calendar, MapPin, Clock, Settings } from "lucide-react";

const birthDataSchema = z.object({
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  timezone: z.string().min(1, "Timezone is required"),
  systems: z.object({
    western: z.boolean().default(true),
    vedic: z.boolean().default(true),
    chinese: z.boolean().default(true),
    humanDesign: z.boolean().default(true),
  })
});

type BirthDataFormData = z.infer<typeof birthDataSchema>;

interface BirthDataFormProps {
  onSubmit: (data: BirthDataFormData) => void;
  isLoading?: boolean;
}

export default function BirthDataForm({ onSubmit, isLoading = false }: BirthDataFormProps) {
  const form = useForm<BirthDataFormData>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      birthDate: "",
      birthTime: "",
      city: "",
      country: "",
      timezone: "UTC",
      systems: {
        western: true,
        vedic: true,
        chinese: true,
        humanDesign: true,
      }
    }
  });

  return (
    <Card className="cosmic-card cosmic-glow max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-yellow-500 text-2xl text-center">
          Enter Your Birth Information
        </CardTitle>
        <CardDescription className="text-gray-400 text-center">
          Provide accurate birth details for precise astrological calculations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Birth Date and Time */}
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

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
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
                        {...field} 
                      />
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
                    <FormLabel className="text-white">Country</FormLabel>
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

            {/* Timezone */}
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Timezone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="cosmic-input">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                      <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                      <SelectItem value="CET">Central European Time</SelectItem>
                      <SelectItem value="JST">Japan Standard Time</SelectItem>
                      <SelectItem value="IST">India Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Astrological Systems */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-yellow-500" />
                <h3 className="text-white font-medium">Select Astrological Systems</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full cosmic-button"
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
import { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchCities, getTimezoneForDate, type CityData } from "@/lib/city-timezone";

interface CitySearchProps {
  value?: CityData | null;
  onSelect: (city: CityData) => void;
  birthDate?: Date;
  placeholder?: string;
  className?: string;
}

export default function CitySearch({ value, onSelect, birthDate, placeholder = "Search city...", className }: CitySearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CityData[]>([]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchCities(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const formatTimezone = (city: CityData) => {
    if (!birthDate) return `UTC${city.utcOffset >= 0 ? '+' : ''}${city.utcOffset}`;
    
    const actualOffset = getTimezoneForDate(city, birthDate);
    const isDST = city.dstOffset && actualOffset === city.dstOffset;
    
    return `UTC${actualOffset >= 0 ? '+' : ''}${actualOffset}${isDST ? ' (DST)' : ''}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          style={{
            background: 'var(--cosmic-indigo)',
            borderColor: 'var(--cosmic-purple)',
            color: 'var(--cosmic-lavender)'
          }}
        >
          {value ? (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{color: 'var(--cosmic-gold)'}} />
              <span>{value.city}, {value.country}</span>
              {birthDate && (
                <span className="text-xs opacity-70 ml-auto" style={{color: 'var(--cosmic-gold)'}}>
                  {formatTimezone(value)}
                </span>
              )}
            </div>
          ) : (
            <span className="opacity-70">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{background: 'var(--cosmic-indigo)', borderColor: 'var(--cosmic-purple)'}}>
        <Command>
          <CommandInput 
            placeholder="Search cities..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            style={{color: 'var(--cosmic-lavender)'}}
          />
          <CommandList>
            <CommandEmpty style={{color: 'var(--cosmic-lavender)', opacity: 0.7}}>
              {searchQuery.length < 2 ? "Type at least 2 characters..." : "No cities found."}
            </CommandEmpty>
            <CommandGroup>
              {searchResults.map((city) => (
                <CommandItem
                  key={`${city.city}-${city.country}`}
                  value={`${city.city}-${city.country}`}
                  onSelect={() => {
                    onSelect(city);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className="cursor-pointer hover:bg-purple-900/30"
                  style={{color: 'var(--cosmic-lavender)'}}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value?.city === city.city && value?.country === city.country
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                        style={{color: 'var(--cosmic-gold)'}}
                      />
                      <MapPin className="w-4 h-4" style={{color: 'var(--cosmic-gold)'}} />
                      <div>
                        <div className="font-medium">{city.city}</div>
                        <div className="text-xs opacity-70">{city.country}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{color: 'var(--cosmic-gold)'}}>
                      <Clock className="w-3 h-3" />
                      {formatTimezone(city)}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
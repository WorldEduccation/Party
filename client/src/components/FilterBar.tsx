import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Globe, Flag } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filters: {
    country?: string;
    eventType?: string;
    hashtags?: string[];
  }) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<{
    country?: string;
    eventType?: string;
    hashtags?: string[];
  }>({});

  const countries = [
    { value: "USA", label: "USA", icon: "🇺🇸" },
    { value: "Brazil", label: "Brazil", icon: "🇧🇷" },
    { value: "Germany", label: "Germany", icon: "🇩🇪" },
    { value: "UK", label: "UK", icon: "🇬🇧" },
    { value: "France", label: "France", icon: "🇫🇷" },
    { value: "Spain", label: "Spain", icon: "🇪🇸" },
  ];

  const eventTypes = [
    { value: "Nightclub", label: "Nightclub", icon: "🎵" },
    { value: "Festival", label: "Festival", icon: "🎪" },
    { value: "Rooftop", label: "Rooftop", icon: "🏢" },
    { value: "Beach Party", label: "Beach", icon: "🏖️" },
    { value: "Underground", label: "Underground", icon: "🚇" },
    { value: "VIP Lounge", label: "VIP", icon: "💎" },
  ];

  const handleFilterClick = (type: 'country' | 'eventType', value: string) => {
    const newFilters = { ...activeFilters };
    
    if (newFilters[type] === value) {
      delete newFilters[type];
    } else {
      newFilters[type] = value;
    }
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-pink-500" />
            <span className="font-medium text-gray-900 dark:text-white">Filters:</span>
          </div>
          
          <Button
            variant={!activeFilters.country && !activeFilters.eventType ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick('country', 'global')}
            className={`${
              !activeFilters.country && !activeFilters.eventType
                ? "bg-pink-500 text-white hover:bg-pink-600"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <Globe className="w-4 h-4 mr-2" />
            Global
          </Button>
          
          {Object.keys(activeFilters).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear All
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <Flag className="w-4 h-4 mr-1" />
            Countries:
          </span>
          {countries.map((country) => (
            <Button
              key={country.value}
              variant={activeFilters.country === country.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick('country', country.value)}
              className={`${
                activeFilters.country === country.value
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <span className="mr-2">{country.icon}</span>
              {country.label}
            </Button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            Events:
          </span>
          {eventTypes.map((eventType) => (
            <Button
              key={eventType.value}
              variant={activeFilters.eventType === eventType.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick('eventType', eventType.value)}
              className={`${
                activeFilters.eventType === eventType.value
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <span className="mr-2">{eventType.icon}</span>
              {eventType.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

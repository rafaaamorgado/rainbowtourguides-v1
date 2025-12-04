import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Star } from "lucide-react";

export interface FilterOptions {
  languages: string[];
  themes: string[];
  minDuration: number;
  maxDuration: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  targetDate?: string;
  onlyAvailable?: boolean;
}

interface FilterPanelProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onClear: () => void;
}

const AVAILABLE_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Italian",
  "Japanese",
  "Mandarin",
  "Korean",
  "Thai",
];

const AVAILABLE_THEMES = [
  "LGBTQ+ History",
  "Nightlife",
  "Food & Dining",
  "Art & Culture",
  "Architecture",
  "Local Secrets",
  "Shopping",
  "Nature & Parks",
  "Photography",
  "Historical",
];

export default function FilterPanel({ filters, onChange, onClear }: FilterPanelProps) {
  const [languageExpanded, setLanguageExpanded] = useState(true);
  const [themeExpanded, setThemeExpanded] = useState(true);
  const [durationExpanded, setDurationExpanded] = useState(true);
  const [ratingExpanded, setRatingExpanded] = useState(true);
  const [dateExpanded, setDateExpanded] = useState(true);

  const handleLanguageToggle = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter(l => l !== language)
      : [...filters.languages, language];
    onChange({ ...filters, languages: newLanguages });
  };

  const handleThemeToggle = (theme: string) => {
    const newThemes = filters.themes.includes(theme)
      ? filters.themes.filter(t => t !== theme)
      : [...filters.themes, theme];
    onChange({ ...filters, themes: newThemes });
  };

  const handleDurationChange = (values: number[]) => {
    onChange({
      ...filters,
      minDuration: values[0],
      maxDuration: values[1],
    });
  };

  const activeFilterCount =
    filters.languages.length +
    filters.themes.length +
    ((filters.minDuration !== 2 || filters.maxDuration !== 12) ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.targetDate ? 1 : 0) +
    (filters.onlyAvailable ? 1 : 0);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <i className="fas fa-filter text-primary"></i>
          Filters
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-sm"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Languages Filter */}
      <Collapsible open={languageExpanded} onOpenChange={setLanguageExpanded}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between py-2 hover:text-primary transition-colors">
            <div className="flex items-center gap-2">
              <i className="fas fa-language"></i>
              <span className="font-medium">Languages</span>
              {filters.languages.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({filters.languages.length})
                </span>
              )}
            </div>
            <i className={`fas fa-chevron-${languageExpanded ? 'up' : 'down'} text-sm`}></i>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          {AVAILABLE_LANGUAGES.map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${language}`}
                checked={filters.languages.includes(language)}
                onCheckedChange={() => handleLanguageToggle(language)}
              />
              <Label
                htmlFor={`lang-${language}`}
                className="text-sm cursor-pointer flex-1"
              >
                {language}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border"></div>

      {/* Interests/Themes Filter */}
      <Collapsible open={themeExpanded} onOpenChange={setThemeExpanded}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between py-2 hover:text-primary transition-colors">
            <div className="flex items-center gap-2">
              <i className="fas fa-heart"></i>
              <span className="font-medium">Interests</span>
              {filters.themes.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({filters.themes.length})
                </span>
              )}
            </div>
            <i className={`fas fa-chevron-${themeExpanded ? 'up' : 'down'} text-sm`}></i>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          {AVAILABLE_THEMES.map((theme) => (
            <div key={theme} className="flex items-center space-x-2">
              <Checkbox
                id={`theme-${theme}`}
                checked={filters.themes.includes(theme)}
                onCheckedChange={() => handleThemeToggle(theme)}
              />
              <Label
                htmlFor={`theme-${theme}`}
                className="text-sm cursor-pointer flex-1"
              >
                {theme}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border"></div>

      {/* Duration Filter */}
      <Collapsible open={durationExpanded} onOpenChange={setDurationExpanded}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between py-2 hover:text-primary transition-colors">
            <div className="flex items-center gap-2">
              <i className="fas fa-clock"></i>
              <span className="font-medium">Tour Duration</span>
            </div>
            <i className={`fas fa-chevron-${durationExpanded ? 'up' : 'down'} text-sm`}></i>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <div className="px-2">
            <Slider
              min={2}
              max={12}
              step={1}
              value={[filters.minDuration, filters.maxDuration]}
              onValueChange={handleDurationChange}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {filters.minDuration} {filters.minDuration === 1 ? 'hour' : 'hours'}
            </span>
            <span className="text-muted-foreground">
              {filters.maxDuration} {filters.maxDuration === 1 ? 'hour' : 'hours'}
            </span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border"></div>

      {/* Rating Filter */}
      <Collapsible open={ratingExpanded} onOpenChange={setRatingExpanded}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between py-2 hover:text-primary transition-colors">
            <div className="flex items-center gap-2">
              <i className="fas fa-star"></i>
              <span className="font-medium">Minimum Rating</span>
              {filters.minRating && (
                <span className="text-xs text-muted-foreground">
                  ({filters.minRating}+ stars)
                </span>
              )}
            </div>
            <i className={`fas fa-chevron-${ratingExpanded ? 'up' : 'down'} text-sm`}></i>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => onChange({
                  ...filters,
                  minRating: filters.minRating === rating ? undefined : rating
                })}
                className={`w-full flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                  filters.minRating === rating
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary'
                }`}
              >
                <div className="flex">
                  {[...Array(rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  {[...Array(5 - rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-gray-300"
                    />
                  ))}
                </div>
                <span className="text-sm">& up</span>
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="border-t border-border"></div>

      {/* Date & Availability Filter */}
      <Collapsible open={dateExpanded} onOpenChange={setDateExpanded}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between py-2 hover:text-primary transition-colors">
            <div className="flex items-center gap-2">
              <i className="fas fa-calendar"></i>
              <span className="font-medium">Date & Availability</span>
            </div>
            <i className={`fas fa-chevron-${dateExpanded ? 'up' : 'down'} text-sm`}></i>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <div>
            <Label htmlFor="target-date" className="text-sm mb-2 block">
              Target Date
            </Label>
            <Input
              id="target-date"
              type="date"
              value={filters.targetDate || ''}
              onChange={(e) => onChange({ ...filters, targetDate: e.target.value || undefined })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          {filters.targetDate && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="only-available"
                checked={filters.onlyAvailable || false}
                onCheckedChange={(checked) => onChange({ ...filters, onlyAvailable: checked as boolean })}
              />
              <Label
                htmlFor="only-available"
                className="text-sm cursor-pointer"
              >
                Only show available guides
              </Label>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

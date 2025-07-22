import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Repeat, Archive } from "lucide-react";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filter: string) => void;
  activeFilter: string;
  searchQuery: string;
}

const filters = [
  { id: "all", label: "All", icon: Calendar },
  { id: "today", label: "Today", icon: Calendar },
  { id: "recurring", label: "Recurring", icon: Repeat },
  { id: "expired", label: "Past", icon: Archive },
];

export function SearchAndFilter({ 
  onSearch, 
  onFilter, 
  activeFilter, 
  searchQuery 
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search meetings..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 bg-background/50 border-border/50 focus:bg-background transition-colors"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onFilter(filter.id)}
              className={`flex items-center gap-2 whitespace-nowrap ${
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "border-border/50 hover:bg-muted/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {filter.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
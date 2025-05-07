import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PriorityLevel, CategoryType } from "@shared/schema";
import { PRIORITY_COLORS, CATEGORY_COLORS, CATEGORY_LABELS, STATUS_OPTIONS, SORT_OPTIONS } from "@/lib/constants";

interface MobileFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPriorities: string[];
  onPriorityChange: (priority: string, checked: boolean) => void;
  selectedCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  onApplyFilters: () => void;
}

export default function MobileFilterPanel({
  isOpen,
  onClose,
  selectedStatus,
  onStatusChange,
  selectedPriorities,
  onPriorityChange,
  selectedCategories,
  onCategoryChange,
  sortBy,
  onSortChange,
  onApplyFilters
}: MobileFilterPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters & Sorting</SheetTitle>
        </SheetHeader>
        
        <div className="py-4 space-y-6">
          {/* Status filter */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Status</h3>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(option => (
                <button
                  key={option.value}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedStatus === option.value
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => onStatusChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority filter */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Priority</h3>
            <div className="space-y-1">
              <label className="flex items-center">
                <Checkbox 
                  checked={selectedPriorities.includes(PriorityLevel.HIGH)}
                  onCheckedChange={(checked) => 
                    onPriorityChange(PriorityLevel.HIGH, checked === true)
                  }
                />
                <span className="ml-2 text-sm flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full ${PRIORITY_COLORS[PriorityLevel.HIGH]} mr-1`}></span>
                  High
                </span>
              </label>
              <label className="flex items-center">
                <Checkbox 
                  checked={selectedPriorities.includes(PriorityLevel.MEDIUM)}
                  onCheckedChange={(checked) => 
                    onPriorityChange(PriorityLevel.MEDIUM, checked === true)
                  }
                />
                <span className="ml-2 text-sm flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full ${PRIORITY_COLORS[PriorityLevel.MEDIUM]} mr-1`}></span>
                  Medium
                </span>
              </label>
              <label className="flex items-center">
                <Checkbox 
                  checked={selectedPriorities.includes(PriorityLevel.LOW)}
                  onCheckedChange={(checked) => 
                    onPriorityChange(PriorityLevel.LOW, checked === true)
                  }
                />
                <span className="ml-2 text-sm flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full ${PRIORITY_COLORS[PriorityLevel.LOW]} mr-1`}></span>
                  Low
                </span>
              </label>
            </div>
          </div>

          {/* Category filter */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Categories</h3>
            <div className="space-y-1">
              {Object.entries(CategoryType).map(([key, value]) => (
                <label key={value} className="flex items-center">
                  <Checkbox 
                    checked={selectedCategories.includes(value)}
                    onCheckedChange={(checked) => 
                      onCategoryChange(value, checked === true)
                    }
                  />
                  <span className="ml-2 text-sm flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full ${CATEGORY_COLORS[value as keyof typeof CATEGORY_COLORS]} mr-1`}></span>
                    {CATEGORY_LABELS[value as keyof typeof CATEGORY_LABELS]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort options */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Sort By</h3>
            <RadioGroup 
              value={sortBy} 
              onValueChange={onSortChange}
              className="space-y-2"
            >
              {SORT_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`mobile-sort-${option.value}`} />
                  <Label htmlFor={`mobile-sort-${option.value}`} className="text-sm">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="pt-4">
            <Button 
              className="w-full"
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

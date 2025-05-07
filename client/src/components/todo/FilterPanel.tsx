import { Checkbox } from "@/components/ui/checkbox";
import { PriorityLevel, CategoryType } from "@shared/schema";
import { PRIORITY_COLORS, CATEGORY_COLORS, CATEGORY_LABELS, STATUS_OPTIONS } from "@/lib/constants";

interface FilterPanelProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPriorities: string[];
  onPriorityChange: (priority: string, checked: boolean) => void;
  selectedCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
}

export default function FilterPanel({
  selectedStatus,
  onStatusChange,
  selectedPriorities,
  onPriorityChange,
  selectedCategories,
  onCategoryChange
}: FilterPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h2 className="text-lg font-medium text-gray-800">Filters</h2>
      
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
    </div>
  );
}

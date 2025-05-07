import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SORT_OPTIONS } from "@/lib/constants";

interface SortPanelProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export default function SortPanel({ sortBy, onSortChange }: SortPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h2 className="text-lg font-medium text-gray-800">Sort By</h2>
      <RadioGroup 
        value={sortBy} 
        onValueChange={onSortChange}
        className="space-y-2"
      >
        {SORT_OPTIONS.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
            <Label htmlFor={`sort-${option.value}`} className="text-sm">{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

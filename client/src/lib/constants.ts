import { PriorityLevel, CategoryType } from "@shared/schema";

export const PRIORITY_COLORS = {
  [PriorityLevel.HIGH]: "bg-[#ef4444]",
  [PriorityLevel.MEDIUM]: "bg-[#f59e0b]",
  [PriorityLevel.LOW]: "bg-[#10b981]",
};

export const PRIORITY_BORDER_COLORS = {
  [PriorityLevel.HIGH]: "border-[#ef4444]",
  [PriorityLevel.MEDIUM]: "border-[#f59e0b]",
  [PriorityLevel.LOW]: "border-[#10b981]",
};

export const PRIORITY_LABELS = {
  [PriorityLevel.HIGH]: "High Priority",
  [PriorityLevel.MEDIUM]: "Medium Priority",
  [PriorityLevel.LOW]: "Low Priority",
};

export const CATEGORY_COLORS = {
  [CategoryType.WORK]: "bg-[#6366f1]",
  [CategoryType.PERSONAL]: "bg-[#ec4899]",
  [CategoryType.STUDY]: "bg-[#8b5cf6]",
  [CategoryType.HEALTH]: "bg-[#10b981]",
  [CategoryType.FINANCE]: "bg-[#f59e0b]",
};

export const CATEGORY_LABELS = {
  [CategoryType.WORK]: "Work",
  [CategoryType.PERSONAL]: "Personal",
  [CategoryType.STUDY]: "Study",
  [CategoryType.HEALTH]: "Health",
  [CategoryType.FINANCE]: "Finance",
};

export const SORT_OPTIONS = [
  { value: "dueDate", label: "Due date (earliest first)" },
  { value: "priority", label: "Priority (high to low)" },
  { value: "createdAt", label: "Creation date (newest first)" },
  { value: "title", label: "Alphabetical (A-Z)" }
];

export const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" }
];

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Todo } from "@shared/schema";
import { Pencil, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { PRIORITY_BORDER_COLORS, PRIORITY_COLORS, CATEGORY_COLORS, PRIORITY_LABELS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export default function TodoItem({ todo, onEdit }: TodoItemProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async (updatedTodo: Partial<Todo>) => {
      await apiRequest(
        "PATCH", 
        `/api/todos/${todo.id}`, 
        updatedTodo
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update the todo",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      setIsDeleting(true);
      await apiRequest("DELETE", `/api/todos/${todo.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      toast({
        title: "Success",
        description: "Todo deleted successfully"
      });
    },
    onError: () => {
      setIsDeleting(false);
      toast({
        title: "Error",
        description: "Failed to delete the todo",
        variant: "destructive"
      });
    }
  });

  const handleToggleComplete = () => {
    updateMutation.mutate({ completed: !todo.completed });
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const getDateFormatted = (date: Date | null) => {
    if (!date) return "";
    return format(new Date(date), "MMM d, yyyy");
  };

  // Determine border color based on completion status and priority
  const borderColorClass = todo.completed 
    ? "border-gray-300" 
    : PRIORITY_BORDER_COLORS[todo.priority as keyof typeof PRIORITY_BORDER_COLORS];

  // Apply opacity and strikethrough for completed todos
  const completedClasses = todo.completed 
    ? "opacity-75" 
    : "";

  const titleClasses = todo.completed 
    ? "line-through text-gray-500" 
    : "";

  const descriptionClasses = todo.completed 
    ? "line-through text-gray-500" 
    : "text-gray-600";

  return (
    <div className={`bg-white rounded-lg shadow hover:shadow-md transition-all ${completedClasses} ${isDeleting ? 'opacity-50' : ''}`}>
      <div className={`p-4 border-l-4 ${borderColorClass} rounded-l-lg`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id={`todo-${todo.id}`}
              checked={todo.completed}
              disabled={updateMutation.isPending || isDeleting}
              onCheckedChange={handleToggleComplete}
              className="mt-1"
            />
            <div>
              <h3 className={`text-lg font-medium ${titleClasses}`}>{todo.title}</h3>
              <div className="flex flex-wrap items-center mt-1 text-sm text-gray-600">
                {todo.dueDate && (
                  <span className="flex items-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Due: {getDateFormatted(todo.dueDate)}
                  </span>
                )}
                <span className="flex items-center mr-3">
                  <span className={`inline-block w-3 h-3 rounded-full ${PRIORITY_COLORS[todo.priority as keyof typeof PRIORITY_COLORS]} mr-1`}></span>
                  {PRIORITY_LABELS[todo.priority as keyof typeof PRIORITY_LABELS]}
                </span>
                <Badge 
                  variant={todo.category as any}
                  className="mt-1 md:mt-0"
                >
                  {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
                </Badge>
              </div>
              {todo.description && (
                <p className={`mt-2 text-sm ${descriptionClasses}`}>{todo.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              className="text-gray-400 hover:text-primary"
              onClick={() => onEdit(todo)}
              disabled={updateMutation.isPending || isDeleting}
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button 
              className="text-gray-400 hover:text-red-500"
              onClick={handleDelete}
              disabled={deleteMutation.isPending || isDeleting}
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

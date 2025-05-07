import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Todo, insertTodoSchema, PriorityLevel, CategoryType } from "@shared/schema";
import { CATEGORY_LABELS } from "@/lib/constants";
import { format } from "date-fns";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTodo: Todo | null;
}

export default function TaskModal({ isOpen, onClose, editTodo }: TaskModalProps) {
  const { toast } = useToast();
  const isEditing = !!editTodo;

  // Define form with validation schema
  const form = useForm({
    resolver: zodResolver(insertTodoSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: PriorityLevel.MEDIUM,
      category: CategoryType.WORK,
      completed: false
    }
  });

  // Update form values when editing a todo
  useEffect(() => {
    if (editTodo) {
      // Format the date to YYYY-MM-DD for the date input
      const formattedDate = editTodo.dueDate 
        ? format(new Date(editTodo.dueDate), "yyyy-MM-dd") 
        : "";
        
      form.reset({
        title: editTodo.title,
        description: editTodo.description || "",
        dueDate: formattedDate,
        priority: editTodo.priority,
        category: editTodo.category,
        completed: editTodo.completed
      });
    } else {
      form.reset({
        title: "",
        description: "",
        dueDate: "",
        priority: PriorityLevel.MEDIUM,
        category: CategoryType.WORK,
        completed: false
      });
    }
  }, [editTodo, form]);

  // Create or update todo mutation
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing && editTodo) {
        await apiRequest(
          "PATCH", 
          `/api/todos/${editTodo.id}`, 
          data
        );
      } else {
        await apiRequest(
          "POST", 
          "/api/todos", 
          data
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      toast({
        title: "Success",
        description: isEditing ? "Todo updated successfully" : "Todo created successfully"
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: isEditing ? "Failed to update todo" : "Failed to create todo",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Task description" 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PriorityLevel.HIGH}>High</SelectItem>
                        <SelectItem value={PriorityLevel.MEDIUM}>Medium</SelectItem>
                        <SelectItem value={PriorityLevel.LOW}>Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CategoryType).map(([_, value]) => (
                        <SelectItem key={value} value={value}>
                          {CATEGORY_LABELS[value as keyof typeof CATEGORY_LABELS]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {isEditing ? "Update Task" : "Add Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

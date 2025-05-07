import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Todo } from "@shared/schema";
import TodoItem from "./TodoItem";
import { Skeleton } from "@/components/ui/skeleton";

interface TodoListProps {
  selectedStatus: string;
  selectedPriorities: string[];
  selectedCategories: string[];
  sortBy: string;
  searchQuery: string;
  onEditTodo: (todo: Todo) => void;
}

export default function TodoList({
  selectedStatus,
  selectedPriorities,
  selectedCategories,
  sortBy,
  searchQuery,
  onEditTodo
}: TodoListProps) {
  const { data: todos, isLoading, isError } = useQuery<Todo[]>({
    queryKey: ["/api/todos"]
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start space-x-3">
              <Skeleton className="h-5 w-5 rounded mt-1" />
              <div className="w-full">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        Error loading todos. Please try again later.
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No todos found. Add your first todo!</p>
      </div>
    );
  }

  // Filter by search query
  let filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter by status
  if (selectedStatus !== "all") {
    filteredTodos = filteredTodos.filter(todo => 
      selectedStatus === "completed" ? todo.completed : !todo.completed
    );
  }

  // Filter by priorities
  if (selectedPriorities.length > 0) {
    filteredTodos = filteredTodos.filter(todo => 
      selectedPriorities.includes(todo.priority)
    );
  }

  // Filter by categories
  if (selectedCategories.length > 0) {
    filteredTodos = filteredTodos.filter(todo => 
      selectedCategories.includes(todo.category)
    );
  }

  // Sort todos
  filteredTodos = [...filteredTodos].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - 
               priorityOrder[b.priority as keyof typeof priorityOrder];
      case "createdAt":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      {filteredTodos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No todos match your filters.</p>
        </div>
      ) : (
        filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onEdit={onEditTodo} />
        ))
      )}
    </div>
  );
}

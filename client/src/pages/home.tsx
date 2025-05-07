import { useState, useEffect } from "react";
import { Search, Plus, Filter, ArrowDownAZ } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Todo, PriorityLevel, CategoryType } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FilterPanel from "@/components/todo/FilterPanel";
import SortPanel from "@/components/todo/SortPanel";
import TodoList from "@/components/todo/TodoList";
import TaskModal from "@/components/todo/TaskModal";
import MobileFilterPanel from "@/components/todo/MobileFilterPanel";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();
  
  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    PriorityLevel.HIGH, 
    PriorityLevel.MEDIUM, 
    PriorityLevel.LOW
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    CategoryType.WORK,
    CategoryType.PERSONAL,
    CategoryType.STUDY,
    CategoryType.HEALTH,
    CategoryType.FINANCE
  ]);
  const [sortBy, setSortBy] = useState("dueDate");
  
  // UI state
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  // Handle priority filter changes
  const handlePriorityChange = (priority: string, checked: boolean) => {
    if (checked) {
      setSelectedPriorities(prev => [...prev, priority]);
    } else {
      setSelectedPriorities(prev => prev.filter(p => p !== priority));
    }
  };

  // Handle category filter changes
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
  };

  // Handle opening the new task modal
  const handleNewTask = () => {
    setEditTodo(null);
    setIsTaskModalOpen(true);
  };

  // Handle opening the edit task modal
  const handleEditTask = (todo: Todo) => {
    setEditTodo(todo);
    setIsTaskModalOpen(true);
  };

  // Handle closing the task modal
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditTodo(null);
  };

  // Toggle sidebar visibility on mobile
  const toggleMobileMenu = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenMobileMenu={toggleMobileMenu} onNewTask={handleNewTask} />

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Sidebar for filters and sorting (hidden on mobile by default) */}
          <aside 
            className={`${
              isSidebarVisible 
                ? "block mt-4" 
                : "hidden"
              } lg:block lg:col-span-3 space-y-6`}
          >
            <FilterPanel 
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedPriorities={selectedPriorities}
              onPriorityChange={handlePriorityChange}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
            <SortPanel sortBy={sortBy} onSortChange={setSortBy} />
          </aside>

          {/* Main content area */}
          <div className="lg:col-span-9 space-y-6 mt-6 lg:mt-0">
            {/* Task Management */}
            <div className="flex justify-between items-center">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  type="text" 
                  placeholder="Search tasks..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleNewTask}
                className="hidden md:flex items-center"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Task
              </Button>
            </div>

            {/* Mobile filters trigger */}
            <div className="lg:hidden flex justify-between items-center">
              <Button 
                variant="ghost" 
                className="flex items-center text-gray-700 hover:text-primary p-0"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <Filter className="h-5 w-5 mr-1" />
                Filters
              </Button>

              <div className="flex space-x-3">
                <Button 
                  variant="ghost" 
                  className="flex items-center text-gray-700 hover:text-primary p-0"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  <ArrowDownAZ className="h-5 w-5 mr-1" />
                  Sort
                </Button>

                <Button 
                  size="icon" 
                  className="flex md:hidden h-8 w-8 rounded-full"
                  onClick={handleNewTask}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Todo List */}
            <TodoList 
              selectedStatus={selectedStatus}
              selectedPriorities={selectedPriorities}
              selectedCategories={selectedCategories}
              sortBy={sortBy}
              searchQuery={searchQuery}
              onEditTodo={handleEditTask}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Task Modal */}
      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        editTodo={editTodo}
      />

      {/* Mobile Filter Panel */}
      <MobileFilterPanel 
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriorities={selectedPriorities}
        onPriorityChange={handlePriorityChange}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onApplyFilters={() => {}}
      />
    </div>
  );
}

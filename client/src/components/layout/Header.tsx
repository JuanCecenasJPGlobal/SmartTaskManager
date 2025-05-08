import { useState } from "react";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onNewTask: () => void;
}

export default function Header({ onOpenMobileMenu, onNewTask }: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-primary">
          Smart Task Manager
        </h1>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMobileMenu}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}

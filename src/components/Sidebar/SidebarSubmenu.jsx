import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SidebarSubmenu = ({
  icon: Icon,
  label,
  items,
  isCollapsed,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();

  const hasActiveItem = items.some(item => 
    location.pathname === item.href || location.pathname.startsWith(item.href + '/')
  );

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
          hasActiveItem
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Icon className={cn("h-4 w-4 flex-shrink-0", hasActiveItem && "text-primary")} />
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate">{label}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </>
        )}
      </button>
      
      {!isCollapsed && (
        <div
          className={cn(
            "mt-1 space-y-1 overflow-hidden transition-all duration-200",
            isOpen ? "max-h-96" : "max-h-0"
          )}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 pl-8 text-sm transition-all duration-200",
                location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarSubmenu;

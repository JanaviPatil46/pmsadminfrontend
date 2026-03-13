import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  icon: Icon,
  label,
  badge,
  isActive,
  isCollapsed,
  onClick,
}) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("h-4 w-4 flex-shrink-0", isActive && "text-primary")} />
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge && badge > 0 && (
            <Badge variant="secondary" className="ml-auto h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
              {badge > 99 ? "99+" : badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );
};

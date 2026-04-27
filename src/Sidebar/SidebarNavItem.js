import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Circle } from "lucide-react";
import { cn } from "../lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../components/ui/tooltip";
import { useSidebar } from "../components/ui/sidebar";

export function SidebarNavItem({ item, iconMapping, openMenu, setOpenMenu }) {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive =
    (item.path !== "/" && location.pathname.startsWith(item.path)) ||
    (item.path === "/" && location.pathname === "/") ||
    (item.submenu || []).some((sub) => location.pathname.startsWith(sub.path));

  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isOpen = openMenu === item._id;

  const IconComponent = iconMapping[item.icon];
  const icon = IconComponent ? (
    <IconComponent className="h-4 w-4 shrink-0" />
  ) : (
    <Circle className="h-[5px] w-[5px] shrink-0 fill-current" />
  );

  const buttonBase = cn(
    "group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150 ease-in-out outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    isActive
      ? "bg-primary/10 text-primary font-semibold"
      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
  );

  const content = (
    <>
      {/* Active left accent */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
      )}
      <span className={cn("shrink-0 transition-colors duration-150", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>
        {icon}
      </span>
      {!isCollapsed && (
        <span className="flex-1 truncate leading-none">{item.label}</span>
      )}
      {!isCollapsed && hasSubmenu && (
        <ChevronRight
          className={cn(
            "ml-auto h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-in-out",
            isActive ? "text-primary/60" : "text-muted-foreground/50",
            isOpen && "rotate-90"
          )}
        />
      )}
    </>
  );

  const trigger = isCollapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>
        {hasSubmenu ? (
          <CollapsibleTrigger className={buttonBase}>
            {content}
          </CollapsibleTrigger>
        ) : (
          <Link to={item.path} className={buttonBase}>
            {content}
          </Link>
        )}
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs font-medium">
        {item.label}
      </TooltipContent>
    </Tooltip>
  ) : hasSubmenu ? (
    <CollapsibleTrigger className={buttonBase}>{content}</CollapsibleTrigger>
  ) : (
    <Link to={item.path} className={buttonBase}>
      {content}
    </Link>
  );

  if (!hasSubmenu) {
    return <div className="relative">{trigger}</div>;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => setOpenMenu(open ? item._id : null)}
    >
      <div className="relative">{trigger}</div>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-none">
        <div className={cn("mt-0.5", !isCollapsed && "ml-3 pl-3 border-l border-border/50")}>
          {item.submenu.map((sub) => {
            const isSubActive = location.pathname.startsWith(sub.path);
            const SubIcon = iconMapping[sub.icon];
            return (
              <Link
                key={sub.path}
                to={sub.path}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-all duration-150 ease-in-out outline-none mb-0.5",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isSubActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground font-medium"
                )}
              >
                {isSubActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r-full bg-primary" />
                )}
                {SubIcon ? (
                  <SubIcon className={cn("h-3.5 w-3.5 shrink-0", isSubActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground")} />
                ) : (
                  <Circle className={cn("h-[4px] w-[4px] shrink-0 fill-current", isSubActive ? "text-primary" : "text-muted-foreground/40")} />
                )}
                <span className="truncate">{sub.label}</span>
              </Link>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

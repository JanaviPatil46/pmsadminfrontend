import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutTemplate } from "lucide-react";

const NAV_LINKS = [
  { to: "/firmtemp/templates/tasks", label: "Tasks" },
  { to: "/firmtemp/templates/emails", label: "Emails" },
  { to: "/firmtemp/templates/clientfacing", label: "Client-Facing Statuses" },
  { to: "/firmtemp/templates/jobs", label: "Jobs" },
  { to: "/firmtemp/templates/chats", label: "Chats" },
  { to: "/firmtemp/templates/folders", label: "Folders" },
  { to: "/firmtemp/templates/invoices", label: "Invoices" },
  { to: "/firmtemp/templates/proposals", label: "Proposals & ELs" },
  { to: "/firmtemp/templates/organizers", label: "Organizers" },
];

const Templates = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-20 bg-background border-b border-border/40">

        {/* ── Top bar: title + (future actions slot) ── */}
        <div className="flex items-center gap-3 px-6 h-14 border-b border-border/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shrink-0">
            <LayoutTemplate className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-foreground leading-none">Firm Templates</h1>
            <p className="text-xs text-muted-foreground mt-0.5 leading-none">
              Manage and configure your firm's template library
            </p>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <nav
          className="flex items-end gap-0 px-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Template sections"
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "relative shrink-0 whitespace-nowrap px-3 py-2.5 text-sm font-medium",
                  "transition-colors duration-150 select-none outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-t-sm",
                  "border-b-2",
                  isActive
                    ? "text-foreground border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* ── Page content ── */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Templates;

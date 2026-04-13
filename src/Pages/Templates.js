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
    <div className="min-h-screen bg-slate-50/40">
      {/* Page header */}
      <div className="border-b border-slate-100 bg-white px-6 pt-6 pb-0 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
            <LayoutTemplate className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Firm Templates</h1>
            <p className="text-xs text-slate-500">Manage and configure your firm's template library</p>
          </div>
        </div>

        {/* Animated nav tabs */}
        <nav className="flex items-center gap-0.5 overflow-x-auto -mb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors duration-150 rounded-t-lg select-none outline-none focus:outline-none",
                  isActive
                    ? "text-indigo-600 bg-indigo-50/60 border-b-2 border-indigo-600"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-b-2 border-transparent",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Page content */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Templates;

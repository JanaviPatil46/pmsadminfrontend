import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Jobs = () => {
  const tabClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
      isActive
        ? "bg-white text-primary shadow-sm font-semibold"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Jobs</h1>

      <div className="inline-flex items-center gap-1 rounded-xl bg-muted p-1">
        <NavLink to="/jobs/activejob" className={tabClass}>Active</NavLink>
        <NavLink to="/jobs/archivedjob" className={tabClass}>Archived</NavLink>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Jobs;
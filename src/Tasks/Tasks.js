import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import NewTaskDrawer from "./NewTaskDrawer";

const Tasks = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onclose = () => {
    setDrawerOpen(false);
  };

  const tabClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
      isActive
        ? "bg-white text-primary shadow-sm font-semibold"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Tasks</h1>
        <Button onClick={() => setDrawerOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          New Task
        </Button>
      </div>

      <div className="inline-flex items-center gap-1 rounded-xl bg-muted p-1">
        <NavLink to="/tasks/pending" className={tabClass}>Pending</NavLink>
        <NavLink to="/tasks/completed" className={tabClass}>Completed</NavLink>
      </div>

      <div>
        <Outlet />
      </div>

      <NewTaskDrawer open={drawerOpen} onClose={onclose} />
    </div>
  );
};

export default Tasks;

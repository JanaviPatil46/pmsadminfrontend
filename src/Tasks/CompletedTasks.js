import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../components/ui/dropdown-menu";
import { DataTable } from "../components/data-table/data-table";
import { DataTableToolbar } from "../components/data-table/toolbar";
import NewTaskDrawer from "./NewTaskDrawer";
const CompletedTasks = () => {
  const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
  const [taskData, setTasksData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onclose = () => {
    setDrawerOpen(false);
    fetchCompletedTasks();
  };
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTaskData, setSelectedTaskData] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  
    const fetchCompletedTasks =()=>{
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch(`${ACCOUNT_TASKS_API}/accountstasks/tasks/tasklist/completed`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const formattedTasks = result.taskList.map((task) => ({
        ...task,
        startDate: task.StartDate
          ? new Date(task.StartDate).toLocaleDateString("en-US")
          : "",
        dueDate: task.EndDate
          ? new Date(task.EndDate).toLocaleDateString("en-US")
          : "",
        description: task.Description.replace(/<[^>]+>/g, ""), // Remove HTML tags
      }));

      console.log(formattedTasks);
      setTasksData(formattedTasks);
    })
    .catch((error) => console.error(error));
  }
  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const handleMenuClick = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };
  const handleClose = () => {
    setOpenMenuId(null);
  };
  const handleDeleteTask = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected tasks? This action cannot be undone."
    );
    if (isConfirmed) {
      try {
        await Promise.all(
          selectedIds.map((id) =>
            fetch(`${ACCOUNT_TASKS_API}/accountstasks/taskdelete/` + id, {
              method: "DELETE",
              redirect: "follow",
            })
          )
        );
        toast.success("Tasks deleted successfully!");
        setSelectedIds([]);
        fetchCompletedTasks();
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete selected tasks");
      }
    }
  };

  const statusOptions = [
    { value: "No status", label: "No status", color: "#C4AEAD" },
    { value: "Planned", label: "Planned", color: "#4169E1" },
    { value: "In review", label: "In review", color: "#F6BE00" },
    { value: "In progress", label: "In progress", color: "#F6BE00" },
    { value: "On hold", label: "On hold", color: "#BCC6CC" },
    { value: "Extended", label: "Extended", color: "#82CAFF" },
    {
      value: "Waiting for Client",
      label: "Waiting for Client",
      color: "#566D7E",
    },
    {
      value: "Waiting for Signatures",
      label: "Waiting for Signatures",
      color: "#566D7E",
    },
    {
      value: "Waiting for agency",
      label: "Waiting for agency",
      color: "#566D7E",
    },
    { value: "Completed", label: "Completed", color: "#00FF00" },
    { value: "Canceled", label: "Canceled", color: "#EB5406" },
  ];

  const priorityOptions = [
    { value: "Urgent", label: "Urgent", color: "#0E0402" },
    { value: "High", label: "High", color: "#fe676e" },
    { value: "Medium", label: "Medium", color: "#FFC300" },
    { value: "Low", label: "Low", color: "#56c288" },
  ];

  const tableColumns = useMemo(() => [
    {
      accessorKey: "Name",
      header: "Name",
      size: 180,
      cell: ({ row, getValue }) => (
        <button
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors text-left truncate max-w-[165px] block"
          onClick={(e) => { e.stopPropagation(); handleClick(row.original.id); }}
        >
          {getValue() || "\u2014"}
        </button>
      ),
    },
    {
      accessorKey: "AccountName",
      header: "Account",
      size: 140,
      cell: ({ getValue }) => <span className="text-xs text-foreground/80">{getValue() || <span className="text-muted-foreground">\u2014</span>}</span>,
    },
    {
      accessorKey: "Assignees",
      header: "Assignee",
      size: 120,
      cell: ({ getValue }) => <span className="text-xs text-foreground/80">{getValue() || <span className="text-muted-foreground">\u2014</span>}</span>,
    },
    {
      accessorKey: "Status",
      header: "Status",
      size: 130,
      cell: ({ getValue }) => {
        const val = getValue();
        if (!val) return null;
        const color = statusOptions.find((s) => s.value === val)?.color || "#ccc";
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold text-white" style={{ backgroundColor: color }}>
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "Priority",
      header: "Priority",
      size: 100,
      cell: ({ getValue }) => {
        const val = getValue();
        if (!val) return null;
        const color = priorityOptions.find((p) => p.value === val)?.color || "#ccc";
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold text-white" style={{ backgroundColor: color }}>
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "SubtaskCount",
      header: "Subtasks",
      size: 80,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() ?? "\u2014"}</span>,
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      size: 105,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() || "\u2014"}</span>,
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      size: 105,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() || "\u2014"}</span>,
    },
    {
      accessorKey: "JobName",
      header: "Job Name",
      size: 130,
      cell: ({ getValue }) => <span className="text-xs text-foreground/80">{getValue() || <span className="text-muted-foreground">\u2014</span>}</span>,
    },
    {
      accessorKey: "PipelineName",
      header: "Pipeline",
      size: 120,
      cell: ({ getValue }) => <span className="text-xs text-foreground/80">{getValue() || <span className="text-muted-foreground">\u2014</span>}</span>,
    },
    {
      accessorKey: "StageNames",
      header: "Stage",
      size: 110,
      cell: ({ getValue }) => <span className="text-xs text-foreground/80">{getValue() || <span className="text-muted-foreground">\u2014</span>}</span>,
    },
    {
      accessorKey: "TaskTags",
      header: "Tags",
      size: 140,
      enableSorting: false,
      cell: ({ getValue }) => {
        const tags = getValue();
        if (!tags || tags.length === 0) return <span className="text-xs text-muted-foreground">\u2014</span>;
        return (
          <TooltipProvider>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: tags[0].tagColour }}>
                {tags[0].tagName}
              </span>
              {tags.length > 1 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground cursor-pointer">
                      +{tags.length - 1}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="space-y-1">
                    {tags.slice(1).map((tag) => (
                      <span key={tag._id || tag.id} className="block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: tag.tagColour }}>
                        {tag.tagName}
                      </span>
                    ))}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 180,
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground truncate block max-w-[170px]">{getValue() || "\u2014"}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 50,
      enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu
          open={openMenuId === row.original.id}
          onOpenChange={(open) => setOpenMenuId(open ? row.original.id : null)}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost" size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleClick(row.original.id); }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); handleClose(); setSelectedIds([row.original.id]); handleDeleteTask(); }}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [openMenuId, statusOptions, priorityOptions]);

  const handleClick = async (id) => {
    try {
      const response = await fetch(`${ACCOUNT_TASKS_API}/accountstasks/task/listbyid/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task data");
      }

      const taskToEdit = await response.json(); // Assuming response is JSON
      setSelectedTaskData(taskToEdit);
      handleClose();
      setIsEditMode(true);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const bulkActions = selectedIds.length > 0 ? (
    <button
      onClick={handleDeleteTask}
      className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-md border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
    >
      <Trash2 className="h-3.5 w-3.5" /> Delete
    </button>
  ) : null;

  return (
    <div className="space-y-3">
      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        selectedCount={selectedIds.length}
        bulkActions={bulkActions}
      />

      <DataTable
        columns={tableColumns}
        data={taskData}
        loading={false}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection
        onRowSelectionChange={(sel) =>
          setSelectedIds(Object.keys(sel).filter((k) => sel[k]))
        }
        getRowId={(row) => row.id}
        emptyMessage="No completed tasks found"
        emptyDescription="Tasks marked as complete will appear here"
        pageSize={25}
      />

      <NewTaskDrawer
        open={drawerOpen}
        onClose={onclose}
        fetchCompletedTasks={fetchCompletedTasks}
        isEditMode={isEditMode}
        taskData={selectedTaskData}
      />
    </div>
  );
};

export default CompletedTasks;
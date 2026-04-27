import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MoreVertical, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../components/ui/dropdown-menu";
import { DataTable } from "../components/data-table/data-table";
import { DataTableToolbar } from "../components/data-table/toolbar";
import NewTaskDrawer from "./NewTaskDrawer";
import Status from "../Templates/Status/Status";
const PendingTasks = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onclose = () => {
    setDrawerOpen(false);
    fetchTasksData();
  };
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTaskData, setSelectedTaskData] = useState(null);
  const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [taskData, setTasksData] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [status, setStatus] = useState("No status");

  // const fetchTasksData = () => {
  //   const requestOptions = {
  //     method: "GET",
  //     redirect: "follow",
  //   };

  //   fetch(`${ACCOUNT_TASKS_API}/accountstasks/tasklist/true`, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       const formattedTasks = result.taskList.map((task) => ({
  //         ...task,
  //         startDate: task.StartDate
  //           ? new Date(task.StartDate).toLocaleDateString("en-US")
  //           : "",
  //         dueDate: task.EndDate
  //           ? new Date(task.EndDate).toLocaleDateString("en-US")
  //           : "",
  //         description: task.Description.replace(/<[^>]+>/g, ""), // Remove HTML tags
  //       }));

  //       console.log(formattedTasks);
  //       setTasksData(formattedTasks);
  //     })
  //     .catch((error) => console.error(error));
  // };

  const [filterStatus, setFilterStatus] = useState("active"); 
  
const fetchTasksData = async () => {
  try {
    // ✅ Step 1: Fetch active accounts
    const accountsResponse = await axios.get(
      // `${ACCOUNT_API}/accounts/account/accountdetailslist/true`
           `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`
 );

    const accountsData = accountsResponse.data.accountlist || [];
    console.log("Active accounts:", accountsData);

    // ✅ Step 2: Collect account IDs
    const accountIds = accountsData.map((account) => account._id).join(",");
    console.log("Account IDs string:", accountIds);

    // ✅ Step 3: Fetch tasks by all accountIds
    const tasksResponse = await axios.get(
      `${ACCOUNT_TASKS_API}/accountstasks/tasks/taskslist/byaccount/${accountIds}`
    );

    const taskList = tasksResponse.data.taskList || [];

    // ✅ Step 4: Format tasks
    const formattedTasks = taskList.map((task) => ({
      ...task,
      startDate: task.StartDate
        ? new Date(task.StartDate).toLocaleDateString("en-US")
        : "",
      dueDate: task.EndDate
        ? new Date(task.EndDate).toLocaleDateString("en-US")
        : "",
      description: task.Description?.replace(/<[^>]+>/g, "") || "",
    }));

    console.log("Formatted Tasks:", formattedTasks);
    setTasksData(formattedTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};
  useEffect(() => {
    fetchTasksData();
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
        fetchTasksData();
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete selected tasks");
      }
    }
  };
  const handleStatusChange = async (newStatus) => {
    const tasksToUpdate = taskData.filter(
      (task) => selectedIds.includes(task.id) && task.Status !== newStatus
    );
    if (tasksToUpdate.length === 0) {
      toast.info(`All selected tasks are already ${newStatus}.`);
      return;
    }
    const confirm = window.confirm(`Update ${tasksToUpdate.length} task(s) status to ${newStatus}?`);
    if (!confirm) return;
    try {
      const response = await fetch(`${ACCOUNT_TASKS_API}/accountstasks/tasks/updatestatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskIds: tasksToUpdate.map((t) => t.id), status: newStatus }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Update failed");
      toast.success(`Tasks status updated to ${newStatus}!`);
      setSelectedIds([]);
      fetchTasksData();
    } catch (err) {
      console.error("Status Update Error:", err);
      toast.error("Failed to update tasks status.");
    }
  };
  const handleMarkComplete = async () => {
    const tasksToComplete = taskData.filter(
      (task) => selectedIds.includes(task.id) && task.Status !== "Completed"
    );
    if (tasksToComplete.length === 0) {
      toast.info("All selected tasks are already complete.");
      return;
    }
    const confirm = window.confirm(`Mark ${tasksToComplete.length} task(s) as Completed?`);
    if (!confirm) return;
    try {
      const response = await fetch(`${ACCOUNT_TASKS_API}/accountstasks/tasks/updatestatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskIds: tasksToComplete.map((t) => t.id), status: "Completed" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Update failed");
      toast.success("Tasks marked as completed!");
      setSelectedIds([]);
      fetchTasksData();
    } catch (err) {
      console.error("Mark Complete Error:", err);
      toast.error("Failed to mark tasks as completed.");
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

  const handleClick = async (id) => {
    try {
      const response = await fetch(
        `${ACCOUNT_TASKS_API}/accountstasks/task/listbyid/${id}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error("Failed to fetch task data");
      const taskToEdit = await response.json();
      setSelectedTaskData(taskToEdit);
      handleClose();
      setIsEditMode(true);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

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
          {getValue() || "—"}
        </button>
      ),
    },
    {
      accessorKey: "AccountName",
      header: "Account",
      size: 140,
      cell: ({ getValue }) => <span className="text-xs text-foreground/80">{getValue() || <span className="text-muted-foreground">—</span>}</span>,
    },
    {
      accessorKey: "Assignees",
      header: "Assignee",
      size: 120,
      cell: ({ getValue }) => <span className="text-xs text-foreground/80">{getValue() || <span className="text-muted-foreground">—</span>}</span>,
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
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() ?? "—"}</span>,
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      size: 105,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() || "—"}</span>,
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      size: 105,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() || "—"}</span>,
    },
    {
      accessorKey: "JobName",
      header: "Job Name",
      size: 130,
      cell: ({ getValue }) => <span className="text-xs text-foreground/80">{getValue() || <span className="text-muted-foreground">—</span>}</span>,
    },
    {
      accessorKey: "PipelineName",
      header: "Pipeline",
      size: 120,
      cell: ({ getValue }) => <span className="text-xs text-foreground/80">{getValue() || <span className="text-muted-foreground">—</span>}</span>,
    },
    {
      accessorKey: "StageNames",
      header: "Stage",
      size: 110,
      cell: ({ getValue }) => <span className="text-xs text-foreground/80">{getValue() || <span className="text-muted-foreground">—</span>}</span>,
    },
    {
      accessorKey: "TaskTags",
      header: "Tags",
      size: 140,
      enableSorting: false,
      cell: ({ getValue }) => {
        const tags = getValue();
        if (!tags || tags.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
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
        <span className="text-xs text-muted-foreground truncate block max-w-[170px]">{getValue() || "—"}</span>
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

  const bulkActions = selectedIds.length > 0 ? (
    <>
      <Status onStatusChange={handleStatusChange} selectedStatus={status} />
      <button
        onClick={handleMarkComplete}
        className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors"
      >
        <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
      </button>
      <button
        onClick={handleDeleteTask}
        className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-md border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
    </>
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
        emptyMessage="No pending tasks found"
        emptyDescription="All tasks have been completed or none assigned yet"
        pageSize={25}
      />

      <NewTaskDrawer
        open={drawerOpen}
        onClose={onclose}
        fetchTasksData={fetchTasksData}
        isEditMode={isEditMode}
        taskData={selectedTaskData}
      />
    </div>
  );
};

export default PendingTasks;

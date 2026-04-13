import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MoreVertical, Trash2 } from "lucide-react";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../components/ui/dropdown-menu";
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
  const [selected, setSelected] = useState([]);
  const handleSelect = (id) => {
    const currentIndex = selected.indexOf(id);
    const newSelected =
      currentIndex === -1
        ? [...selected, id]
        : selected.filter((item) => item !== id);
    setSelected(newSelected);
  };

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
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleMenuClick = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };
  const handleClose = () => {
    setOpenMenuId(null);
  };

  const handleDelete = () => {
    handleClose();
    handleDeleteTask(selectedTask);
    console.log("Deleted:", selectedTask);
  };
  const handleDeleteTask = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected tasks? This action cannot be undone."
    );
    if (isConfirmed) {
      try {
        // Make delete requests for each selected job
        await Promise.all(
          selected.map((id) =>
            fetch(`${ACCOUNT_TASKS_API}/accountstasks/taskdelete/` + id, {
              method: "DELETE",
              redirect: "follow",
            })
          )
        );

        toast.success("task deleted successfully!");
        setSelected([]); // Clear the selected jobs
        fetchTasksData(); // Refresh the data after deletion
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete selected jobs");
      }
    }
  };
  const handleStatusChange = async (newStatus) => {
    const tasksToUpdate = taskData.filter(
      (task) =>
        selected.includes(task.id || task.id) && task.Status !== newStatus
    );
    console.log("newStatus", newStatus);
    if (tasksToUpdate.length === 0) {
      toast.info(`All selected tasks are already ${newStatus}.`);
      return;
    }

    const confirm = window.confirm(
      `Update ${tasksToUpdate.length} task(s) status to ${newStatus}?`
    );
    if (!confirm) return;

    try {
      const taskIds = tasksToUpdate.map((task) => task.id);

      const response = await fetch(
        `${ACCOUNT_TASKS_API}/accountstasks/tasks/updatestatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskIds: taskIds,
            status: newStatus,
          }),
        }
      );

      const result = await response.json();
      console.log("API response:", result);

      if (!response.ok) throw new Error(result.message || "Update failed");

      toast.success(`Tasks status updated to ${newStatus}!`);
      setSelected([]);
      fetchTasksData(); // Refresh updated task list
    } catch (err) {
      console.error("Status Update Error:", err);
      toast.error("Failed to update tasks status.");
    }
  };
  const handleMarkComplete = async () => {
    const tasksToComplete = taskData.filter(
      (task) =>
        selected.includes(task.id || task.id) && task.Status !== "Completed"
    );

    if (tasksToComplete.length === 0) {
      toast.info("All selected tasks are already complete.");
      return;
    }

    const confirm = window.confirm(
      `Mark ${tasksToComplete.length} task(s) as Completed?`
    );
    if (!confirm) return;

    try {
      const taskIds = tasksToComplete.map((task) => task.id);
      console.log("taskIds", taskIds);
      const response = await fetch(
        `${ACCOUNT_TASKS_API}/accountstasks/tasks/updatestatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskIds: taskIds,
            status: "Completed",
          }),
        }
      );

      const result = await response.json();
      console.log("API response:", result);

      if (!response.ok) throw new Error(result.message || "Update failed");

      toast.success("Tasks marked as completed!");
      setSelected([]);
      fetchTasksData(); // Refresh updated task list
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
    console.log(id);
    try {
      const response = await fetch(
        `${ACCOUNT_TASKS_API}/accountstasks/task/listbyid/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

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
  const [status, setStatus] = useState("No status");

  const columns = [
    { key: "Name", label: "Name", sticky: true },
    { key: "AccountName", label: "Account" },
    { key: "Assignees", label: "Assignee" },
    { key: "Status", label: "Status" },
    { key: "Priority", label: "Priority" },
    { key: "SubtaskCount", label: "Subtasks" },
    { key: "startDate", label: "Start Date" },
    { key: "dueDate", label: "Due Date" },
    { key: "JobName", label: "Job Name" },
    { key: "PipelineName", label: "Pipeline" },
    { key: "StageNames", label: "Stage" },
    { key: "TaskTags", label: "Tags" },
    { key: "description", label: "Description" },
  ];

  const renderCell = (row, col) => {
    switch (col.key) {
      case "Name":
        return (
          <button
            className="text-sm font-medium text-primary hover:underline transition-colors text-left"
            onClick={(e) => { e.stopPropagation(); handleClick(row.id); }}
          >
            {row.Name}
          </button>
        );
      case "Status":
        if (!row.Status) return null;
        return (
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
            style={{ backgroundColor: statusOptions.find((s) => s.value === row.Status)?.color || "#ccc" }}
          >
            {row.Status}
          </span>
        );
      case "Priority":
        if (!row.Priority) return null;
        return (
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
            style={{ backgroundColor: priorityOptions.find((p) => p.value === row.Priority)?.color || "#ccc" }}
          >
            {row.Priority}
          </span>
        );
      case "TaskTags":
        if (!row.TaskTags || row.TaskTags.length === 0) return <span className="text-xs text-muted-foreground">No Tags</span>;
        return (
          <TooltipProvider>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: row.TaskTags[0].tagColour }}>
                {row.TaskTags[0].tagName}
              </span>
              {row.TaskTags.length > 1 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground cursor-pointer">
                      +{row.TaskTags.length - 1}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="space-y-1">
                    {row.TaskTags.slice(1).map((tag) => (
                      <span key={tag.id} className="block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: tag.tagColour }}>
                        {tag.tagName}
                      </span>
                    ))}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        );
      default:
        return <span className="text-xs text-foreground">{row[col.key] || ""}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {selected.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">{selected.length} selected</span>
          <Status onStatusChange={handleStatusChange} selectedStatus={status} />
          <Button variant="ghost" size="icon" onClick={handleDeleteTask} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="sticky left-0 z-10 bg-muted/40 w-10 px-3 py-3">
                  <Checkbox
                    checked={taskData.length > 0 && selected.length === taskData.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelected(taskData.map((item) => item.id));
                      } else {
                        setSelected([]);
                      }
                    }}
                  />
                </th>
                {columns.map((col) => (
                  <th key={col.key} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap ${col.sticky ? "sticky left-10 z-10 bg-muted/40" : ""}`}>
                    {col.label}
                  </th>
                ))}
                <th className="sticky right-0 z-10 bg-muted/40 w-14 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {taskData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No pending tasks found.
                  </td>
                </tr>
              ) : (
                taskData.map((row) => {
                  const isSelected = selected.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => handleSelect(row.id)}
                      className={`cursor-pointer transition-colors hover:bg-muted/30 ${isSelected ? "bg-primary/5" : ""}`}
                    >
                      <td className="sticky left-0 z-[5] bg-card px-3 py-2.5">
                        <Checkbox checked={isSelected} onCheckedChange={() => handleSelect(row.id)} />
                      </td>
                      {columns.map((col) => (
                        <td key={col.key} className={`px-4 py-2.5 whitespace-nowrap ${col.sticky ? "sticky left-10 z-[5] bg-card" : ""}`}>
                          {renderCell(row, col)}
                        </td>
                      ))}
                      <td className="sticky right-0 z-[5] bg-card px-2 py-2.5">
                        <DropdownMenu open={openMenuId === row.id} onOpenChange={(open) => setOpenMenuId(open ? row.id : null)}>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleMenuClick(row.id); }}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleClick(row.id); }}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleClose(); handleDeleteTask(selectedTask); }} className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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

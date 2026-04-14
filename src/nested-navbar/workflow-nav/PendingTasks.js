import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { MoreVertical } from "lucide-react";
import NewTaskDrawer from "../../Tasks/NewTaskDrawer";
import { useParams } from "react-router-dom";
const PendingTasks = () => {
    const { data } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onclose =()=>{
    setDrawerOpen(false)
    fetchTasksData(data)
   }
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTaskData, setSelectedTaskData] = useState(null);
  const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
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
    // Log all selected row IDs
    // console.log("Selected IDs:", newSelected); // Log all selected IDs
  };
  
  const fetchTasksData = (data) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${ACCOUNT_TASKS_API}/accountstasks/tasks/taskslist/byaccount/${data}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const formattedTasks = result.taskList.map((task) => ({
          ...task,
          startDate: task.StartDate
            ? new Date(task.StartDate).toLocaleDateString("en-GB")
            : "",
          dueDate: task.EndDate
            ? new Date(task.EndDate).toLocaleDateString("en-GB")
            : "",
          description: task.Description.replace(/<[^>]+>/g, "")
        }));

        setTasksData(formattedTasks);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchTasksData(data);
  }, [data]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(id);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleDelete = () => {
    handleClose();
    handleDeleteTask(selectedTask);
  };
  const handleDeleteTask = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected tasks? This action cannot be undone."
    );
    if (isConfirmed) {
      try {
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
        fetchTasksData(data); // Refresh the data after deletion
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete selected jobs");
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


  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const handleClick = async (id) => {
    
    try {
      const response = await fetch(`${ACCOUNT_API}/accountstasks/task/listbyid/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch task data");
      }
  
      const taskToEdit = await response.json(); // Assuming response is JSON
      setSelectedTaskData(taskToEdit);
      handleClose()
      setIsEditMode(true);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };
  

  return (
    <div>
      <div className="mt-2">
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-2 py-3 w-10 sticky left-0 z-10 bg-gray-50">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 accent-[var(--color-save-btn)] cursor-pointer"
                    checked={taskData.length > 0 && selected.length === taskData.length}
                    onChange={() => {
                      if (selected.length === taskData.length) {
                        setSelected([]);
                      } else {
                        setSelected(taskData.map((item) => item.id));
                      }
                    }}
                  />
                </th>
                {["Name","Account","Assignee","Status","Priority","Subtasks","Start Date","Due Date","Job Name","Pipeline","Stage","Tags","Description","Settings"].map((col) => (
                  <th key={col} className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {taskData.map((row) => {
                const isSelected = selected.indexOf(row.id) !== -1;
                return (
                  <tr
                    key={row.id}
                    onClick={() => handleSelect(row.id)}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-2 py-2.5 sticky left-0 z-10 bg-white" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 accent-[var(--color-save-btn)] cursor-pointer"
                        checked={isSelected}
                        onChange={() => handleSelect(row.id)}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-xs sticky left-10 z-10 bg-white whitespace-nowrap">
                      <span
                        className="text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={(e) => { e.stopPropagation(); handleClick(row.id); }}
                      >
                        {row.Name}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{row.AccountName}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{row.Assignees}</td>
                    <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                      {row.Status && (
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: statusOptions.find((s) => s.value === row.Status)?.color || "#ccc" }}
                        >
                          {row.Status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                      {row.Priority && (
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: priorityOptions.find((p) => p.value === row.Priority)?.color || "#ccc" }}
                        >
                          {row.Priority}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{row.SubtaskCount}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{row.startDate}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{row.dueDate}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{row.JobName}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{row.PipelineName}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{row.StageNames}</td>
                    <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                      {row.TaskTags && row.TaskTags.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span
                            className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold text-white"
                            style={{ backgroundColor: row.TaskTags[0].tagColour }}
                          >
                            {row.TaskTags[0].tagName}
                          </span>
                          {row.TaskTags.length > 1 && (
                            <div className="relative group">
                              <span className="inline-block bg-gray-200 text-gray-600 px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer">
                                +{row.TaskTags.length - 1}
                              </span>
                              <div className="absolute left-0 bottom-6 z-50 hidden group-hover:flex flex-col gap-1 bg-gray-800 rounded-xl p-2 shadow-xl min-w-[120px]">
                                {row.TaskTags.slice(1).map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold text-white"
                                    style={{ backgroundColor: tag.tagColour }}
                                  >
                                    {tag.tagName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[10px]">No Tags</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-700">{row.description}</td>
                    <td className="px-4 py-2.5 text-xs sticky right-0 z-10 bg-white" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block">
                        <button
                          type="button"
                          className="p-1 rounded hover:bg-gray-100 transition-colors"
                          onClick={(e) => { e.stopPropagation(); handleMenuClick(e, row.id); }}
                        >
                          <MoreVertical size={15} className="text-gray-500" />
                        </button>
                        {Boolean(anchorEl) && selectedTask === row.id && (
                          <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-xl shadow-xl w-36 py-1 overflow-hidden">
                            <div className="fixed inset-0 z-30" onClick={handleClose} />
                            <div className="relative z-40">
                              <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => handleClick(row.id)}>Edit</button>
                              <button type="button" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" onClick={handleDelete}>Delete</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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

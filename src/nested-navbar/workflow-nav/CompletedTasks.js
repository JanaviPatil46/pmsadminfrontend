
import React,{useState,useEffect,useRef} from 'react'
import { toast } from "react-toastify";
import { MoreVertical } from "lucide-react";
import NewTaskDrawer from "../../Tasks/NewTaskDrawer";
import { useParams } from "react-router-dom";
const CompletedTasks = () => {
   const { data } = useParams();
  const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
    const [taskData, setTasksData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
    const onclose =()=>{
      setDrawerOpen(false)
      fetchCompletedTasks(data)
     }
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedTaskData, setSelectedTaskData] = useState(null);
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
  
    const fetchCompletedTasks =(data)=>{
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch(`${ACCOUNT_TASKS_API}/accountstasks/tasks/tasklist/byaccount/completed/${data}`, requestOptions)
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
        description: task.Description.replace(/<[^>]+>/g, ""), // Remove HTML tags
      }));

      console.log(formattedTasks);
      setTasksData(formattedTasks);
    })
    .catch((error) => console.error(error));
  }
  useEffect(() => {
    fetchCompletedTasks(data);
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
  
          // Optionally, you can remove the deleted jobs from the UI (if needed)
          // If you're using jobData in state, for example:
          // setJobData((prevJobs) => prevJobs.filter((job) => !selected.includes(job.id)));
  
          toast.success("task deleted successfully!");
          setSelected([]); // Clear the selected jobs
          fetchCompletedTasks(); // Refresh the data after deletion
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
  
  
    // const handleClick = (id) => {
    // console.log(id)
    // };
  
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
        handleClose()
        setIsEditMode(true);
        setDrawerOpen(true);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const thClass = "px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap";
  const tdClass = "px-3 py-2 text-xs text-gray-700 whitespace-nowrap";

  return (
    <div className="mt-4">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-3 text-center sticky left-0 bg-gray-50 z-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                  checked={selected.length === taskData.length && taskData.length > 0}
                  onChange={() => {
                    if (selected.length === taskData.length) {
                      setSelected([]);
                    } else {
                      setSelected(taskData.map((item) => item.id));
                    }
                  }}
                />
              </th>
              <th className={`${thClass} sticky left-10 bg-gray-50 z-10`}>Name</th>
              <th className={thClass}>Account</th>
              <th className={thClass}>Assignee</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Priority</th>
              <th className={thClass}>Subtasks</th>
              <th className={thClass}>Start Date</th>
              <th className={thClass}>Due Date</th>
              <th className={thClass}>Job Name</th>
              <th className={thClass}>Pipeline</th>
              <th className={thClass}>Stage</th>
              <th className={thClass}>Tags</th>
              <th className={thClass}>Description</th>
              <th className={`${thClass} sticky right-0 bg-gray-50 z-10`}>Settings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {taskData.map((row) => {
              const isSelected = selected.indexOf(row.id) !== -1;
              const isMenuOpen = openMenuId === row.id;
              return (
                <tr
                  key={row.id}
                  onClick={() => handleSelect(row.id)}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""}`}
                >
                  <td className="px-3 py-2 text-center sticky left-0 bg-white z-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                      checked={isSelected}
                      onChange={() => handleSelect(row.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-3 py-2 text-xs sticky left-10 bg-white z-10">
                    <span
                      className="text-blue-600 cursor-pointer hover:underline font-medium"
                      onClick={(e) => { e.stopPropagation(); handleClick(row.id); }}
                    >
                      {row.Name}
                    </span>
                  </td>
                  <td className={tdClass}>{row.AccountName}</td>
                  <td className={tdClass}>{row.Assignees}</td>
                  <td className="px-3 py-2">
                    {row.Status && (
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-white text-xs font-semibold"
                        style={{ backgroundColor: statusOptions.find((s) => s.value === row.Status)?.color || "#ccc" }}
                      >
                        {row.Status}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {row.Priority && (
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-white text-xs font-semibold"
                        style={{ backgroundColor: priorityOptions.find((p) => p.value === row.Priority)?.color || "#ccc" }}
                      >
                        {row.Priority}
                      </span>
                    )}
                  </td>
                  <td className={tdClass}>{row.SubtaskCount}</td>
                  <td className={tdClass}>{row.startDate}</td>
                  <td className={tdClass}>{row.dueDate}</td>
                  <td className={tdClass}>{row.JobName}</td>
                  <td className={tdClass}>{row.PipelineName}</td>
                  <td className={tdClass}>{row.StageNames}</td>
                  <td className="px-3 py-2">
                    {row.TaskTags && row.TaskTags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        <span
                          className="inline-block px-2 py-0.5 rounded-lg text-white text-xs font-semibold"
                          style={{ backgroundColor: row.TaskTags[0].tagColour }}
                        >
                          {row.TaskTags[0].tagName}
                        </span>
                        {row.TaskTags.length > 1 && (
                          <span
                            title={row.TaskTags.slice(1).map((t) => t.tagName).join(", ")}
                            className="inline-block px-2 py-0.5 rounded-lg bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer"
                          >
                            +{row.TaskTags.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No Tags</span>
                    )}
                  </td>
                  <td className={tdClass}>{row.description}</td>
                  <td className="px-3 py-2 sticky right-0 bg-white z-10">
                    <div className="relative inline-block" ref={isMenuOpen ? menuRef : null}>
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(isMenuOpen ? null : row.id); setSelectedTask(row.id); setAnchorEl(e.currentTarget); }}
                      >
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>
                      {isMenuOpen && (
                        <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                          <button
                            type="button"
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={(e) => { e.stopPropagation(); handleClick(row.id); setOpenMenuId(null); }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
                            onClick={(e) => { e.stopPropagation(); handleDelete(); setOpenMenuId(null); }}
                          >
                            Delete
                          </button>
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
      <NewTaskDrawer
        open={drawerOpen}
        onClose={onclose}
        fetchCompletedTasks={fetchCompletedTasks}
        isEditMode={isEditMode}
        taskData={selectedTaskData}
      />
    </div>
  )
}

export default CompletedTasks
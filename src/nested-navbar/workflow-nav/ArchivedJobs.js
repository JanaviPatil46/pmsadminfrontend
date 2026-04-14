import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
const ArchivedJobs = () => {
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const [jobData, setJobData] = useState([]);
  const { data } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchJobList(data);
  }, [data]);

  const fetchJobList = (data) => {
    const url = `${JOBS_API}/workflow/jobs/job/joblist/list/false/${data}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setJobData(result.jobList || []);
      })
      .catch((error) => {
        console.error("Error fetching job list:", error);
      });
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Formats date as dd/mm/yyyy
  };
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for menu
  const [selectedJobId, setSelectedJobId] = useState(null); // Store selected Job ID
  const handleSettingsClick = (event, jobId) => {
    setAnchorEl(event.currentTarget); // Open the menu
    setSelectedJobId(jobId); // Store the selected job ID
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Close the menu
  };

  
  const [actionType, setActionType] = useState(""); // Archive or Delete
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state
  const openConfirmationDialog = (type) => {
    setActionType(type);
    setIsDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmAction = () => {
    if (actionType === "active") {
      handleActive();
    } else if (actionType === "delete") {
      handleDelete();
    }
    handleCloseDialog();
  };

  const handleActive = () => {
    if (!selectedJobId) return;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ active: true });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const archiveUrl = `${JOBS_API}/workflow/jobs/job/${selectedJobId}`;

    fetch(archiveUrl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        toast.success("Job activated  successfully");
        navigate(`/clients/accounts/accountsdash/workflow/${data}/activejobs`)
        setJobData((prevJobs) =>
          prevJobs.filter((job) => job.id !== selectedJobId)
        ); // Remove archived job from the table
      })
      .catch((error) => {
        console.error("Error activing job:", error);
        toast.error("Error activing job")
      });
  };

  const handleDelete = () => {
    if (!selectedJobId) return;

    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    const deleteUrl = `${JOBS_API}/workflow/jobs/job/${selectedJobId}`;

    fetch(deleteUrl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        toast.success("Job deleted successfully")
        setJobData((prevJobs) =>
          prevJobs.filter((job) => job.id !== selectedJobId)
        ); // Remove deleted job from the table
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
        toast.error("Error deleting job")
      });
  };
  return (
    <div className="p-4">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Name","Job Assignee(s)","Pipeline","Stage","Starts In","Due In","Status","Settings"].map((col) => (
                <th key={col} className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobData.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2.5 text-xs text-gray-800 whitespace-nowrap">{job.Name}</td>
                <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{job.JobAssignee.join(", ")}</td>
                <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{job.Pipeline}</td>
                <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{job.Stages?.map(stage => stage.name).join(", ")}</td>
                <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{formatDate(job.StartDate)}</td>
                <td className="px-4 py-2.5 text-xs text-gray-700 whitespace-nowrap">{formatDate(job.DueDate)}</td>
                <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                  {job.ClientFacingStatus ? (
                    <div className="flex items-center gap-1.5">
                      <GoDotFill style={{ color: job.ClientFacingStatus.statusColor, fontSize: "18px" }} />
                      <span className="text-gray-700">{job.ClientFacingStatus.statusName}</span>
                    </div>
                  ) : ""}
                </td>
                <td className="px-4 py-2.5 text-xs">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                      onClick={(e) => { e.stopPropagation(); handleSettingsClick(e, job.id); }}
                    >
                      <MoreVertical size={15} className="text-gray-500" />
                    </button>
                    {Boolean(anchorEl) && selectedJobId === job.id && (
                      <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-xl shadow-xl w-40 py-1 overflow-hidden">
                        <div className="fixed inset-0 z-30" onClick={handleCloseMenu} />
                        <div className="relative z-40">
                          <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => openConfirmationDialog("active")}>Active</button>
                          <button type="button" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" onClick={() => openConfirmationDialog("delete")}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseDialog} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">Confirm Action</h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-600">Are you sure you want to {actionType} this job?</p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
              <button type="button" onClick={handleCloseDialog} className="rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="button" onClick={handleConfirmAction} className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] transition-colors">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivedJobs;

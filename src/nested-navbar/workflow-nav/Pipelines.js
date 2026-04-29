


import React, { useEffect, useState, useContext } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./style.css"
import EditJobDrawer from "../../Workflow/updateJobCard"
import { Trash2, Archive, X } from "lucide-react";
import { differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
import { LoginContext } from "../../Sidebar/Context/Context";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
const ItemTypes = {
  JOB: "job",
};

const Pipelines = () => {
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;

  const [jobData, setJobData] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data } = useParams();
  
  // Automation drawer state
  const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [automationData, setAutomationData] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [currentTargetStage, setCurrentTargetStage] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");
  
  useEffect(() => {
    fetchJobList(data);
  }, [data]);

  const fetchJobList = (data) => {
    const url = `${JOBS_API}/workflow/jobs/job/joblist/list/true/${data}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setJobData(result.jobList || []);
        console.log("joblist",result.jobList)
        const pipelineIds = result.jobList.map((job) => job.PipelineId);
        console.log("Pipeline IDs:", pipelineIds);
        pipelineIds.forEach((id) => fetchPipelineData(id));
      })
      .catch((error) => {
        console.error("Error fetching job list:", error);
      });
  };

  const fetchPipelineData = async (pipelineId) => {
    console.log("test",pipelineId)
    setLoading(true);
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("pipeline detils",data)
      setPipelineData((prevData) => [
        ...prevData,
        { ...data.pipeline, stages: data.pipeline.stages || [] },
      ]);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (jobId, targetStageName) => {
    const job = jobData.find((job) => job.id === jobId);
    const pipeline = pipelineData.find((p) => p._id === job.PipelineId);
    const targetStage = pipeline?.stages?.find((stage) => stage.name === targetStageName);

    if (job) {
      setAccountName(job.Account.join(", "));
      setAccountId(job.AccountId);
    }

    // If the target stage has automations, show the drawer
    if (targetStage?.automations?.length > 0) {
      setAutomationData(targetStage.automations);
      setCurrentJobId(jobId);
      setCurrentTargetStage(targetStage);
      setAutomationDrawerOpen(true);
    } else {
      // If no automations, immediately update the job's stage
      moveJob(jobId, targetStageName, targetStage);
    }
  };

  const moveJob = async (jobId, targetStageName, stage, automations = {}) => {
  try {
    // First, update the job's stage
    await updateJobStage(stage, { id: jobId });

    // Then handle any additional automations
    if (automations.clientStatus || automations.assignees) {
      await handleJobUpdates(jobId, automations);
    }

    // Update local state
    const updatedJobs = jobData.map((job) => {
      if (job.id === jobId) {
        const updatedStages = [{ name: targetStageName }];
        return { ...job, Stages: updatedStages };
      }
      return job;
    });
    setJobData(updatedJobs);

    setTimeout(() => {
      fetchJobList(data);
    }, 1000);
  } catch (error) {
    console.error("Error moving job:", error);
  }
};

const handleJobUpdates = async (jobId, automations) => {
  try {
    // First, get the current job data to work with the existing assignees
    const currentJobResponse = await axios.get(`${JOBS_API}/workflow/jobs/job/${jobId}`);
    const currentJob = currentJobResponse.data;
    const currentAssignees = currentJob.jobassignees || [];

    // Prepare the data object with updates
    const data = {};

    if (automations.clientStatus) {
      const { status, selectedClientStatus, statusDescription } = automations.clientStatus;
      Object.assign(data, {
        showinclientportal: status, // This matches the 'status' property from automation
        clientfacingstatus: selectedClientStatus, // This is already the ID, no need for .value
        clientfacingDescription: statusDescription,
      });
      
      console.log("Updating client-facing status:", {
        showinclientportal: status,
        clientfacingstatus: selectedClientStatus,
        clientfacingDescription: statusDescription
      });
    }
    // Handle assignee updates if automation exists
    if (automations.assignees) {
      const { addAssignees = [], removeAssignees = [] } = automations.assignees;
  
      const newAssignees = [
        ...currentAssignees.filter(
          assigneeId => !removeAssignees.some(ra => ra._id === assigneeId)
        ),
        ...addAssignees
          .map(a => a._id)
          .filter(newId => !currentAssignees.includes(newId))
      ];

      Object.assign(data, {
        jobassignees: newAssignees
      });
    }

    // Make the API call to update the job
    await axios.patch(
      `${JOBS_API}/workflow/jobs/job/${jobId}`,
      data
    );

    console.log("Job updated successfully with automation data");
  } catch (error) {
    console.error("Error updating job with automation data:", error);
    throw error;
  }
};
  const updateJobStage = async (stage, item) => {
    const data = JSON.stringify({ stageid: stage._id });
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${item.id}`,
      headers: { "Content-Type": "application/json" },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleAutomationComplete = (selectedAutomationIndices) => {
  // Handle both array and object parameters
  let selectedIndices;
  
  if (Array.isArray(selectedAutomationIndices)) {
    // Direct array passed from AutomationDrawer
    selectedIndices = selectedAutomationIndices;
  } else {
    // Object with additional data - extract what we need
    const { clientStatus, assignees, ...rest } = selectedAutomationIndices;
    // You might need to adjust this based on what data you actually need
    selectedIndices = rest.selectedIndices || [];
  }
  
  const selectedAutomations = selectedIndices.map(index => automationData[index]);
  
  // Find specific automations if needed
  const clientStatusAutomation = selectedAutomations.find(a => a.type === "Update client-facing job status");
  const assigneeAutomation = selectedAutomations.find(a => a.type === "Update job assignees");

  if (currentJobId && currentTargetStage) {
    moveJob(currentJobId, currentTargetStage.name, currentTargetStage, {
      clientStatus: clientStatusAutomation,
      assignees: assigneeAutomation
    });
  }
  setAutomationDrawerOpen(false);
};

//   const handleAutomationComplete = (selectedAutomationIndices) => {
//   // Get the selected automations
//   const selectedAutomations = selectedAutomationIndices.map(index => automationData[index]);
  
//   // Find specific automations if needed
//   const clientStatusAutomation = selectedAutomations.find(a => a.type === "Update client-facing job status");
//   const assigneeAutomation = selectedAutomations.find(a => a.type === "Update job assignees");

//   if (currentJobId && currentTargetStage) {
//     // Pass the automation data to moveJob
//     moveJob(currentJobId, currentTargetStage.name, currentTargetStage, {
//       clientStatus: clientStatusAutomation,
//       assignees: assigneeAutomation
//     });
//   }
//   setAutomationDrawerOpen(false);
// };
  const uniquePipelines = Array.from(
    new Map(pipelineData.map((pipeline) => [pipeline._id, pipeline])).values()
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {loading && <p>Loading pipeline data...</p>}
        {uniquePipelines.map((pipeline, index) => (
          <Pipeline
            key={index}
            pipeline={pipeline}
            jobData={jobData}
            moveJob={moveJob}
            fetchJobList={fetchJobList}
            data={data}
            handleDrop={handleDrop}
          />
        ))}
      </div>
      
      {/* Automation Drawer */}
      <AutomationDrawer
        open={automationDrawerOpen}
        automations={automationData}
        onClose={() => setAutomationDrawerOpen(false)}
        onMoveJob={handleAutomationComplete}
        jobId={currentJobId}
        targetStage={currentTargetStage?.name}
        accountName={accountName}
        accountId={accountId}
      />
    </DndProvider>
  );
};

const Pipeline = ({ pipeline, jobData, moveJob, fetchJobList, data, handleDrop }) => {
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const [checkedJobIds, setCheckedJobIds] = useState([]);
  const handleJobCheckboxChange = (isChecked, jobId) => {
    setCheckedJobIds((prevIds) =>
      isChecked ? [...prevIds, jobId] : prevIds.filter((id) => id !== jobId)
    );
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const handleDialogOpen = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleDelete = () => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    Promise.all(
      checkedJobIds.map((jobId) =>
        fetch(`${JOBS_API}/workflow/jobs/job/${jobId}`, requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to delete job ID: ${jobId}`);
            }
            return response.json();
          })
      )
    )
      .then(() => {
        console.log("Jobs deleted successfully:", checkedJobIds);
        toast.success("Jobs deleted successfully");
        setOpenDialog(false)
        fetchJobList(data); 
      })
      .catch((error) => {
        console.error("Error deleting jobs:", error);
        toast.error("Failed to delete some jobs");
      });
  };
  const navigate = useNavigate();
  const handleArchive = async () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active: false,
      }),
      redirect: "follow",
    };
  
    try {
      const archivePromises = checkedJobIds.map((jobId) =>
        fetch(
          `${JOBS_API}/workflow/jobs/job/${jobId}`,
          requestOptions
        ).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to archive job ID: ${jobId}`);
          }
          return response.json();
        })
      );
  
      await Promise.all(archivePromises);
      toast.success("Jobs archived successfully");
       setOpenDialog(false)
      fetchJobList(data);
     
      navigate(`/clients/accounts/accountsdash/workflow/${data}/archivedjobs`);
    } catch (error) {
      console.error("Error archiving jobs:", error);
      toast.error("Failed to archive some jobs");
    }
  };

  return (
    <div className="border border-border rounded-xl mb-4">
      <h3 className="ml-4 mt-3 font-semibold text-sm text-foreground">{pipeline.pipelineName}</h3>
      {checkedJobIds.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1" onClick={() => handleDialogOpen("delete")}>
              <Trash2 size={14} /> Delete
            </Button>
            <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1" onClick={() => handleDialogOpen("archive")}>
              <Archive size={14} /> Archive
            </Button>
          </div>

          {openDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40" onClick={handleDialogClose} />
              <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-sm border border-border">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">
                    {dialogType === "delete" ? "Confirm Delete" : "Confirm Archive"}
                  </h2>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to {dialogType === "delete" ? "delete" : "archive"} these jobs?
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
                  <Button type="button" variant="outline" size="sm" onClick={handleDialogClose}>Cancel</Button>
                  <Button type="button" size="sm" variant={dialogType === "delete" ? "destructive" : "default"} onClick={dialogType === "delete" ? handleDelete : handleArchive}>Confirm</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="stage-container flex gap-4 p-4 overflow-x-auto whitespace-nowrap">
        {pipeline.stages.map((stage, stageIndex) => (
          <Stage
            key={stageIndex}
            stage={stage}
            jobs={jobData.filter(
              (job) =>
                job.PipelineId === pipeline._id &&
                job.Stages &&
                job.Stages.some(s => s.name === stage.name)
            )}
            moveJob={(jobId, targetStage) => moveJob(jobId, targetStage, stage)}
            onCheckboxChange={handleJobCheckboxChange}
            handleDrop={handleDrop}
            fetchJobList={fetchJobList}
            data={data}
          />
        ))}
      </div>
    </div>
  );
};

const Stage = ({ stage, jobs, moveJob, onCheckboxChange, handleDrop,data,fetchJobList }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.JOB,
    drop: (item) => handleDrop(item.id, stage.name),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // State for tracking how many jobs to show
  const [visibleJobsCount, setVisibleJobsCount] = useState(50);

  // Function to load more jobs
  const loadMoreJobs = () => {
    setVisibleJobsCount(prevCount => prevCount + 50);
  };
  return (
    <div
      ref={drop}
      className={cn("stage min-w-[250px] bg-muted/50 rounded-lg p-3 mr-3 border border-border", isOver && "ring-2 ring-primary/40")}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm text-foreground">{stage.name}</span>
        {jobs.length > 0 && <span className="text-xs text-muted-foreground">({jobs.length})</span>}
      </div>

      <div className="mt-2">
        {jobs.slice(0, visibleJobsCount).map((job) => (
          <Job fetchJobList={fetchJobList} data={data} key={job.id} job={job} onCheckboxChange={onCheckboxChange} />
        ))}
      </div>

      {jobs.length > visibleJobsCount && (
        <Button type="button" variant="outline" size="sm" onClick={loadMoreJobs} className="w-full mt-2">
          Load More ({jobs.length - visibleJobsCount} more)
        </Button>
      )}
    </div>
  );
};

const Job = ({ job, onCheckboxChange,data,fetchJobList }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.JOB,
    item: { id: job.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const truncateName = (name) => {
    const maxLength = 15;
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + "...";
    }
    return name;
  };
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  const truncateDescription = (description, maxLength = 20) => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + "...";
    }
    return description;
  };

  const getPriorityClass = (priority) => {
    switch ((priority || "").toLowerCase()) {
      case "urgent": return "bg-foreground text-background";
      case "high":   return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-yellow-400 text-yellow-950";
      case "low":    return "bg-green-500 text-white";
      default:       return "bg-muted text-muted-foreground";
    }
  };
  const formatDate = (date) => {
    if (!date) return "";
    const options = { month: "short", day: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };
  const timeAgo = (date) => {
    if (!date) return "N/A";
    const currentTime = new Date();
    const jobTime = new Date(date);
    const minutesDiff = differenceInMinutes(currentTime, jobTime);
    const hoursDiff = differenceInHours(currentTime, jobTime);
    const daysDiff = differenceInDays(currentTime, jobTime);
    if (minutesDiff < 1) {
      return "just now";
    } else if (minutesDiff < 60) {
      return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"} ago`;
    } else if (hoursDiff < 24) {
      return `${hoursDiff} hour${hoursDiff === 1 ? "" : "s"} ago`;
    } else {
      return `${daysDiff} day${daysDiff === 1 ? "" : "s"} ago`;
    }
  };
  const [isHovered, setIsHovered] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    onCheckboxChange(checked, job.id);
    if (checked) {
      console.log("Checked Job ID:", job.id);
    }
  };
   const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  // Add these state variables and functions for the edit functionality
  const [accountOptions, setAccountOptions] = useState([]);
  const [pipelineOptions, setPipelineOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [clientFacingOptions, setClientFacingOptions] = useState([]);
   const [jobData, setJobData] = useState([]);
  // API endpoints
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;

  // Fetch data for edit drawer
  useEffect(() => {
    fetchAccountData();
    fetchPipelineData();
    fetchTagData();
    fetchUserData();
    fetchClientFacingData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails`);
      const data = await response.json();
      const options = data.accounts.map(account => ({
        value: account._id,
        label: account.accountName,
      }));
      setAccountOptions(options);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const fetchPipelineData = async () => {
    try {
      const response = await fetch(`${PIPELINE_API}/workflow/pipeline/pipelines`);
      const data = await response.json();
      const options = data.pipeline.map(pipeline => ({
        value: pipeline._id,
        label: pipeline.pipelineName,
      }));
      setPipelineOptions(options);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    }
  };

  const fetchTagData = async () => {
    try {
      const response = await fetch(`${TAGS_API}/tags/`);
      const data = await response.json();
      const options = data.tags.map(tag => ({
        value: tag._id,
        label: tag.tagName,
        colour: tag.tagColour,
      }));
      setTagOptions(options);
    } catch (error) {
      console.error("Error fetching tag data:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`);
      const data = await response.json();
      const options = data.map(user => ({
        value: user._id,
        label: user.username,
      }));
      setUserOptions(options);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchClientFacingData = async () => {
    try {
      const response = await fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`);
      const data = await response.json();
      const options = data.clientFacingJobStatues.map(status => ({
        value: status._id,
        label: status.clientfacingName,
        clientfacingColour: status.clientfacingColour,
      }));
      setClientFacingOptions(options);
    } catch (error) {
      console.error("Error fetching client facing data:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditDrawerOpen(true);
  };
 

  return (
    <>
      <div
        className={cn(
          "job-card relative border border-border rounded-lg p-3 mt-2 text-left transition-all duration-200 cursor-pointer",
          isDragging ? "opacity-50 bg-muted" : "bg-card hover:shadow-md"
        )}
        ref={drag}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {(isHovered || isChecked) && (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="absolute top-2.5 right-2.5 cursor-pointer scale-125 accent-primary"
          />
        )}
        <p className="text-xs text-muted-foreground mb-0.5">{job.Account.join(", ")}</p>
        <strong className="text-primary text-xs block mb-1 cursor-pointer" onClick={handleEditClick}>
          {truncateName(job.Name)}
        </strong>
        <p className="text-xs text-muted-foreground mb-1 break-words whitespace-normal leading-relaxed">
          {job.JobAssignee.join(", ")}
        </p>
        <p className="text-xs text-muted-foreground mb-1">{truncateDescription(stripHtmlTags(job.Description))}</p>
        <span className={cn("text-[11px] font-medium rounded-full px-2 py-0.5", getPriorityClass(job.Priority))}>{job.Priority}</span>
        <p className="text-xs text-muted-foreground mt-1">Start Date: {formatDate(job.StartDate)}</p>
        <p className="text-xs text-muted-foreground">Due Date: {formatDate(job.DueDate)}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">{timeAgo(job.updatedAt)}</p>
      </div>
      <EditJobDrawer
        open={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        jobId={job.id}
        fetchJobData={() => fetchJobList(data)}
        accountOptions={accountOptions}
        pipelineOptions={pipelineOptions}
        tagOptions={tagOptions}
        userOptions={userOptions}
        clientFacingOptions={clientFacingOptions}
        theme={{ breakpoints: { down: () => false } }}
        isSmallScreen={false}
      />
    </>
  );
};
const AutomationDrawer = ({
  open,
  automations,
  onClose,
  onMoveJob,
  jobId,
  targetStage,
  accountId,
  accountName,
}) => {
  console.log("selected account name", jobId);

  // API endpoints
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
  const PROPOSAL_ACCOUNT_API = process.env.REACT_APP_PROPOSAL_URL;
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const AUTOMATION_API = process.env.REACT_APP_AUTOMATION_API;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
  const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
const [clientFacingJobs, setClientFacingJobs] = useState([]);
const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  const fetchClientFacingJobsData = async () => {
    try {
      const response = await fetch(
        `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setClientFacingJobs(data.clientFacingJobStatues);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const clientStatusOptions = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));
   useEffect(() => {
    fetchClientFacingJobsData();
  }, []);
  // State
  const [tags, setTags] = useState([]);
  const [accountTags, setAccountTags] = useState([]);
  const [accountsWithTags, setAccountsWithTags] = useState([]);
  const [selectedAutomationIndices, setSelectedAutomationIndices] = useState([]);
  const [templateData, setTemplateData] = useState({});
  const [tagData, setTagData] = useState({});
  const [loading, setLoading] = useState(false);
const { logindata } = useContext(LoginContext);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [loginuserid, setLoginUserId] = useState("");
  const [username, setUsername] = useState("");
  const fetchUserData = async (id) => {
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("id", result);

        // console.log(userData)
        setUsername(result.username);
      });
  };
  useEffect(() => {
    if (logindata?.user?.id) {
      // Check if logindata and user.id exist
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  useEffect(() => {
    fetchUserData(loginuserid);
  }, []);
  // Fetch tags
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("tags data", data.tags);
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch account tags
  const AccountsTag = async (accountId) => {
    console.log("accountId for tags", accountId);
    try {
      const response = await fetch(
        `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyid/${accountId}`
      );
      const result = await response.json();
      console.log(result);
      if (result.accountlist && result.accountlist.Tags) {
        setAccountTags(result.accountlist.Tags);
      }
    } catch (error) {
      console.error("Error fetching account tags:", error);
    }
  };

  useEffect(() => {
    if (accountId) {
      AccountsTag(accountId);
    }
  }, [accountId]);

  // Fetch complete account data with tags
  useEffect(() => {
    const fetchAccountsWithTags = async () => {
      if (!accountId) return;
      
      setLoading(true);
      try {
        const response = await fetch('https://www.snptaxes.com/api/accounts/multiple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: [accountId] })
        });

        if (!response.ok) throw new Error('Failed to fetch accounts');
        
        const accountsData = await response.json();
        setAccountsWithTags(accountsData);
        console.log('Fetched accounts with tags:', accountsData);
      } catch (error) {
        console.error('Error fetching accounts with tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountsWithTags();
  }, [accountId]);

  // Get tags for account
  const getAccountTags = (accountId) => {
    const account = accountsWithTags.find(acc => acc._id === accountId);
    return account ? account.tags || [] : [];
  };

  // Check if automation tags match account tags
  const checkTagMatch = (automationSelectedTags, accountId) => {
    if (!automationSelectedTags || automationSelectedTags.length === 0) {
      return true; // No condition tags means always match
    }

    const accountTags = getAccountTags(accountId);
    console.log(`Checking tags for account ${accountId}:`, {
      automationTags: automationSelectedTags,
      accountTags: accountTags
    });

    // Check if at least one automation tag exists in account tags
    const hasMatch = automationSelectedTags.some(automationTagId => 
      accountTags.includes(automationTagId)
    );

    console.log(`Tag match result for account ${accountId}:`, hasMatch);
    return hasMatch;
  };

  // Initialize selected automations
  useEffect(() => {
    if (automations.length > 0) {
      setSelectedAutomationIndices(automations.map((_, index) => index));
    }
  }, [automations]);

  // Fetch template data for display
  const fetchTemplateData = async (templateId, templateType) => {
    if (!templateId) return null;

    try {
      let url = "";
      let response;

      switch (templateType) {
         case "EmailTemplate":
            url = `${EMAIL_API}/workflow/emailtemplate/${templateId}`;
            break;
        case "TaskTemplate":
          url = `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${templateId}`;
          break;
        case "InvoiceTemplate":
          url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${templateId}`;
          break;
        case "ChatTemplate":
          url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${templateId}`;
          break;
        case "ProposalTemplate":
          url = `https://www.snptaxes.com/api/proposals/${templateId}`;
          break;
        case "OrganizerTemplate":
          url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${templateId}`;
          break;
        case "FolderTemplate":
          url = `https://www.snptaxes.com/api/foldertemp/${templateId}`;
          break;
        default:
          return null;
      }

      const requestOptions = { method: "GET", redirect: "follow" };
      response = await fetch(url, requestOptions);
      const result = await response.json();

      switch (templateType) {
         case "EmailTemplate":
            return (
              result.emailTemplate?.templatename || "Unknown Email Template"
            );
        case "TaskTemplate":
          return result.taskTemplate?.templatename || "Unknown Task Template";
        case "InvoiceTemplate":
          return result.invoiceTemplate?.templatename || "Unknown Invoice Template";
        case "ChatTemplate":
          return result.chatTemplate?.templatename || "Unknown Chat Template";
        case "ProposalTemplate":
          return result.templatename || "Unknown Proposal Template";
        case "OrganizerTemplate":
          return result.organizerTemplate?.templatename || "Unknown Organizer Template";
        case "FolderTemplate":
          return result.template?.templatename || "Unknown Folder Template";
        default:
          return "Unknown Template";
      }
    } catch (error) {
      console.error(`Error fetching ${templateType}:`, error);
      return "Error loading template";
    }
  };

  // Fetch tag details for display
  const fetchTagDetails = async (tagIds) => {
    if (!tagIds || tagIds.length === 0) return [];

    try {
      const tagDetails = await Promise.all(
        tagIds.map(async (tagId) => {
          try {
            const response = await fetch(`${TAGS_API}/tags/${tagId}`);
            const result = await response.json();
            return result.tag;
          } catch (error) {
            console.error(`Error fetching tag ${tagId}:`, error);
            return null;
          }
        })
      );
      return tagDetails.filter((tag) => tag !== null);
    } catch (error) {
      console.error("Error fetching tag details:", error);
      return [];
    }
  };

  // Initialize template and tag data
  useEffect(() => {
    const initializeAutomationData = async () => {
      const templatePromises = automations.map(async (automation, index) => {
        if (automation.selectedtemp && automation.refModel) {
          const templateName = await fetchTemplateData(
            automation.selectedtemp,
            automation.refModel
          );
          return { index, templateName };
        }
        return { index, templateName: null };
      });

      const tagPromises = automations.map(async (automation, index) => {
        const selectedTags = await fetchTagDetails(automation.selectedTags);
        const addTags = await fetchTagDetails(automation.addTags);
        const removeTags = await fetchTagDetails(automation.removeTags);

        return {
          index,
          selectedTags,
          addTags,
          removeTags,
        };
      });

      const templateResults = await Promise.all(templatePromises);
      const tagResults = await Promise.all(tagPromises);

      const newTemplateData = {};
      templateResults.forEach((result) => {
        newTemplateData[result.index] = result.templateName;
      });

      const newTagData = {};
      tagResults.forEach((result) => {
        newTagData[result.index] = {
          selectedTags: result.selectedTags,
          addTags: result.addTags,
          removeTags: result.removeTags,
        };
      });

      setTemplateData(newTemplateData);
      setTagData(newTagData);
    };

    if (automations.length > 0) {
      initializeAutomationData();
    }
  }, [automations]);

  // Checkbox handler
  const handleAutomationSelection = (index) => {
    setSelectedAutomationIndices((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  // API functions (keep your existing functions)
  const fetchinvoicetempbyid = async (automationTemp) => {
    const requestOptions = { method: "GET", redirect: "follow" };
    const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${automationTemp}`;
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log("Fetched invoice template:", result.invoiceTemplate);
      return result.invoiceTemplate;
    } catch (error) {
      console.error("Error fetching invoice template:", error);
      throw error;
    }
  };

  const fetchchattempbyid = async (automationTemp) => {
    const requestOptions = { method: "GET", redirect: "follow" };
    const url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${automationTemp}`;
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log("Fetched chat template:", result.chatTemplate);
      return result.chatTemplate;
    } catch (error) {
      console.error("Error fetching chat template:", error);
      throw error;
    }
  };

  const fetchtasktempbyid = async (automationTemp) => {
    const requestOptions = { method: "GET", redirect: "follow" };
    const url = `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${automationTemp}`;
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log("Fetched task template:", result.taskTemplate);
      return result.taskTemplate;
    } catch (error) {
      console.error("Error fetching task template:", error);
      throw error;
    }
  };

  const fetchproposalbyid = async (automationTemp) => {
    const requestOptions = { method: "GET", redirect: "follow" };
    const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels/${automationTemp}`;
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log("Fetched proposal template:", result.proposalesAndElsTemplate);
      return result.proposalesAndElsTemplate;
    } catch (error) {
      console.error("Error fetching proposal template:", error);
      throw error;
    }
  };

  const fetchorganizertempbyid = async (automationTemp) => {
    const requestOptions = { method: "GET", redirect: "follow" };
    const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${automationTemp}`;
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log("Fetched organizer template:", result.organizerTemplate);
      return result.organizerTemplate;
    } catch (error) {
      console.error("Error fetching organizer template:", error);
      throw error;
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Assignment functions (simplified versions)
  const assignInvoiceToAccount = (invoiceData, automationTemp, accountId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      account: accountId,
      invoicenumber: "",
      invoicedate: getCurrentDate(),
      description: invoiceData.description || "",
      invoicetemplate: automationTemp,
      paymentMethod: invoiceData.paymentMethod || "",
      teammember: loginuserid,
      payInvoicewithcredits: invoiceData.payInvoicewithcredits || false,
      emailinvoicetoclient: invoiceData.sendEmailWhenInvCreated || false,
      reminders: invoiceData.sendReminderstoClients || false,
      daysuntilnextreminder: invoiceData.daysuntilnextreminder || null,
      numberOfreminder: invoiceData.numberOfreminder || null,
      scheduleinvoice: false,
      scheduleinvoicedate: new Date(),
      scheduleinvoicetime: new Date().toLocaleTimeString("en-US", { hour12: false }),
      lineItems: invoiceData.lineItems?.map((item) => ({
        productorService: item.productorService || "",
        description: item.description || "",
        rate: item.rate || "",
        quantity: item.quantity || "",
        amount: item.amount || "",
        tax: item.tax || false,
      })) || [],
      summary: {
        subtotal: invoiceData.summary?.subtotal || "",
        taxRate: invoiceData.summary?.taxRate || "",
        taxTotal: invoiceData.summary?.taxTotal || "",
        total: invoiceData.summary?.total || "",
      },
      paidAmount: "",
      invoiceStatus: "Pending",
      balanceDueAmount: "",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${INVOICE_NEW}/workflow/invoices/invoice`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log("Invoice assigned successfully:", result))
      .catch((error) => console.error("Error assigning invoice:", error));
  };

  const sendChatToAccount = (chatData, automationTemp, accountId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const subtaskData = chatData.clienttasks?.map(({ id, text, checked }) => ({
      id,
      text,
      checked: checked !== undefined ? checked : false,
    })) || [];

    const messageData = [
      {
        message: chatData.description,
        fromwhome: "Admin",
        senderid: username,
        isRead: false,
      },
    ];

    const raw = JSON.stringify({
      accountids: [accountId],
      chattemplateid: automationTemp,
      chatsubject: chatData.chatsubject,
      description: messageData || "",
      templatename: chatData.templatename,
      from: username,
      sendreminderstoclient: chatData.sendreminderstoclient,
      daysuntilnextreminder: chatData.daysuntilnextreminder,
      numberofreminders: chatData.numberofreminders,
      clienttasks: subtaskData,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log("Send chat to account successfully:", result))
      .catch((error) => console.error("Error assigning chat:", error));
  };

  const assignTaskToAccount = (taskData, automationTemp, accountId, jobId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accounts: accountId,
      job: jobId,
      templatename: automationTemp,
      taskname: taskData.templatename,
      status: taskData.status,
      taskassignees: taskData.taskassignees,
      priority: taskData.priority,
      description: taskData.description,
      tasktags: taskData.tasktags,
      issubtaskschecked: taskData.issubtaskschecked,
      startdate: taskData.startdate,
      enddate: taskData.enddate,
      subtasks: taskData.subtasks,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_TASKS_API}/accountstasks/newtask`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log("Task created:", result))
      .catch((error) => console.error("Error creating task:", error));
  };

  const assignProposalToAccount = async (automationTemp, accountId) => {
    console.log("Assigning proposal to account:", automationTemp, accountId);
    try {
      const response = await fetch(
        "https://www.snptaxes.com/account/proposals/automation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proposalTemp: automationTemp,
            account: [accountId],
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      console.log("✅ Success:", result);
    } catch (error) {
      console.error("❌ Error sending proposal automation:", error);
    }
  };

  const assignOrganizerToAccount = (organizerData, automationTemp, accountId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountid: accountId,
      organizertemplateid: automationTemp,
      organizerName: organizerData.organizerName,
      reminders: organizerData.reminders,
      noofreminders: organizerData.noOfReminder,
      daysuntilnextreminder: organizerData.daysuntilNextReminder,
      sections: organizerData.sections,
      status: "Pending",
      active: true,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/org`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => console.log("Organizer assigned:", result))
      .catch((error) => console.error("Error assigning organizer:", error));
  };

  const assignfoldertemp = (accountId, automationTemp) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountId: accountId,
      templateId: automationTemp,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `https://www.snptaxes.com/api/docManagement/apply-template`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => console.log("Folder template applied:", result))
      .catch((error) => console.error("Error applying folder template:", error));
  };

  // Account tags update handler
  const handleAccountTagsUpdate = async (accountId, automation) => {
    console.log(`Updating account tags for Account ID: ${accountId}`);

    try {
      const res = await axios.get(`https://www.snptaxes.com/api/accounts/${accountId}`);
      const accountsData = res.data;

      let currentTags = accountsData.tags || [];
      const addTagIds = automation?.addTags?.map((tag) => tag._id) || [];
      const removeTagIds = automation?.removeTags?.map((tag) => tag._id) || [];

      let updatedTags = currentTags.filter(
        (tagId) => !removeTagIds.includes(tagId)
      );
      updatedTags = [...new Set([...updatedTags, ...addTagIds])];

      const updateResponse = await fetch(
        `https://www.snptaxes.com/api/accounts/accountdetails/updateaccounttags/${accountId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tags: updatedTags }),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to update account tags");
      console.log("Account tags updated successfully");
    } catch (error) {
      console.error("Error updating account tags:", error);
      throw error;
    }
  };

  // Main automation execution function
  const selectAutomationApi = async (
    automationType,
    automationTemp,
    automationAccountId,
    automation,
    jobId = null
  ) => {
    console.log("Processing automation:", automationType, automation);

    if (!automationType || !automationAccountId) {
      console.error("Missing required parameters");
      return;
    }

    try {
      switch (automationType) {
        case "Update account tags":
          await handleAccountTagsUpdate(automationAccountId, automation);
          break;

        case "Send Invoice":
          const invoiceData = await fetchinvoicetempbyid(automationTemp);
          assignInvoiceToAccount(invoiceData, automationTemp, automationAccountId);
          break;

        case "Send message":
          const chatData = await fetchchattempbyid(automationTemp);
          sendChatToAccount(chatData, automationTemp, automationAccountId);
          break;

        case "Create Task":
          const taskData = await fetchtasktempbyid(automationTemp);
          assignTaskToAccount(taskData, automationTemp, automationAccountId, jobId);
          break;

        case "Apply folder template":
          await assignfoldertemp(automationAccountId, automationTemp);
          break;

        case "Create Organizer":
          const organizerData = await fetchorganizertempbyid(automationTemp);
          assignOrganizerToAccount(organizerData, automationTemp, automationAccountId);
          break;

        case "Send Proposal/Els":
          await assignProposalToAccount(automationTemp, automationAccountId);
          break;

        case "Send Email":
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          const raw = JSON.stringify({
            automationType,
            templateId: automationTemp,
            accountId: automationAccountId,
          });

          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          await fetch(`${AUTOMATION_API}/automations/`, requestOptions);
          break;

        default:
          console.warn(`Unhandled automation type: ${automationType}`);
          break;
      }
    } catch (error) {
      console.error(`Error processing ${automationType}:`, error);
      throw error;
    }
  };

  // Handle move action
  const handleMove = async () => {
    try {
      const selectedAutomationsList = selectedAutomationIndices
        .map((index) => automations[index])
        .filter((automation) => {
          // Filter based on tags if applicable
          if (!automation.tags || automation.tags.length === 0) {
            return true;
          }
          return checkTagMatch(automation.selectedTags, accountId);
        });

      // Find specific automations if needed
      const clientStatusAutomation = selectedAutomationsList.find(
        (a) => a.type === "Update client-facing job status"
      );
      const assigneeAutomation = selectedAutomationsList.find(
        (a) => a.type === "Update job assignees"
      );

      // Process all selected automations
      if (selectedAutomationsList.length > 0) {
        for (const automation of selectedAutomationsList) {
          const { type, selectedtemp } = automation;

          if (type && accountId) {
            try {
              await selectAutomationApi(
                type,
                selectedtemp,
                accountId,
                automation,
                jobId
              );
            } catch (error) {
              console.error("Error processing automation:", error);
            }
          }
        }
      }

      // Move the job with any relevant automations
      // onMoveJob(jobId, targetStage, {
      //   clientStatus: clientStatusAutomation,
      //   assignees: assigneeAutomation
      // });
          onMoveJob(selectedAutomationIndices);


      onClose();
    } catch (error) {
      console.error("Error in handleMove:", error);
    }
  };

  // Calculate width for tag options
  const calculateWidth = (label) => Math.min(label.length * 8, 200);

  const tagsoptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.tagName,
    colour: tag.tagColour,
    customStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      borderRadius: "8px",
      alignItems: "center",
      textAlign: "center",
      marginBottom: "5px",
      padding: "2px,8px",
      fontSize: "10px",
      width: `${calculateWidth(tag.tagName)}px`,
      margin: "7px",
      cursor: "pointer",
    },
    customTagStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      alignItems: "center",
      textAlign: "center",
      padding: "2px,8px",
      fontSize: "10px",
      cursor: "pointer",
    },
  }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-[500px] h-full bg-background shadow-2xl flex flex-col overflow-hidden border-l border-border">

        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
          <h2 className="text-sm font-semibold text-foreground">Automations for {accountName}</h2>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {automations.length > 0 ? (
            automations.map((automation, index) => {
              const currentTagData = tagData[index] || {};
              const templateName = templateData[index] || "Loading...";
              const hasMatchingTags = checkTagMatch(automation.selectedTags, accountId);

              return (
                <div key={index} className={cn("rounded-xl border p-4 space-y-2 transition-opacity", !hasMatchingTags && "opacity-60", "border-border bg-card")}>

                  {/* Row header */}
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                      checked={selectedAutomationIndices.includes(index)}
                      onChange={() => handleAutomationSelection(index)}
                      disabled={!hasMatchingTags}
                    />
                    <span className="text-sm font-semibold text-foreground">{automation.type}</span>
                    {!hasMatchingTags && (
                      <span className="text-xs text-destructive italic ml-1">Tags don\'t match account</span>
                    )}
                  </label>

                  {/* Template */}
                  {automation.selectedtemp && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">Template</p>
                      <p className="text-xs text-foreground">{templateName}</p>
                    </div>
                  )}

                  {/* Condition tags */}
                  {currentTagData.selectedTags?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Condition Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {currentTagData.selectedTags.map((tag) => (
                          <span key={tag._id} className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium text-white" style={{ backgroundColor: tag.tagColour }}>
                            {tag.tagName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add / Remove tags */}
                  {automation.type === "Update account tags" && currentTagData.addTags?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-green-600 mb-1">Add Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {currentTagData.addTags.map((tag) => (
                          <span key={tag._id} className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium text-white ring-1 ring-green-400" style={{ backgroundColor: tag.tagColour }}>
                            {tag.tagName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {automation.type === "Update account tags" && currentTagData.removeTags?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-destructive mb-1">Remove Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {currentTagData.removeTags.map((tag) => (
                          <span key={tag._id} className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium text-white ring-1 ring-destructive line-through" style={{ backgroundColor: tag.tagColour }}>
                            {tag.tagName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Client-facing status */}
                  {automation.type === "Update client-facing job status" && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Client Status</p>
                      {automation.selectedClientStatus && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: clientStatusOptions?.find(o => o.value === automation.selectedClientStatus)?.clientfacingColour || "hsl(var(--muted))" }} />
                          <span className="text-xs text-foreground">
                            {clientStatusOptions?.find(o => o.value === automation.selectedClientStatus)?.label || automation.selectedClientStatus || "Not set"}
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">Visibility: {automation.status ? "Visible to client" : "Hidden from client"}</p>
                      {automation.statusDescription && (
                        <p className="text-xs text-muted-foreground mt-0.5">Description: {automation.statusDescription}</p>
                      )}
                    </div>
                  )}

                  {/* Job assignees */}
                  {automation.type === "Update job assignees" && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Job Assignees</p>
                      {automation.addAssignees?.length > 0 && (
                        <div>
                          <p className="text-xs text-green-600 font-medium mb-1">Add</p>
                          <div className="flex flex-wrap gap-1">
                            {automation.addAssignees.map((a) => (
                              <span key={a._id} className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500 text-white">
                                {a.name || a.username || "Unknown"}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {automation.removeAssignees?.length > 0 && (
                        <div>
                          <p className="text-xs text-destructive font-medium mb-1">Remove</p>
                          <div className="flex flex-wrap gap-1">
                            {automation.removeAssignees.map((a) => (
                              <span key={a._id} className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-destructive text-destructive-foreground line-through">
                                {a.name || a.username || "Unknown"}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tag-order warning */}
                  {automation.type === "Update account tags" && (
                    <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                      <span className="text-yellow-500 text-sm mt-0.5">&#9888;</span>
                      <p className="text-xs text-yellow-700">This automation can affect conditions for automations below</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No automations available</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex items-center gap-3 shrink-0">
          <Button type="button" onClick={handleMove}>Move</Button>
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default Pipelines;

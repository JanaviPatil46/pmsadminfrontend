import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import Priority from "../Templates/Priority/Priority";
import Editor from "../Templates/Texteditor/Editor";
import MultiSelectDropdown from "../Templates/MultiSelectDropdown";

const EditJobDrawer = ({
  open,
  onClose,
  jobId,
  fetchJobData,
  accountOptions,
  pipelineOptions,
  tagOptions,
  userOptions,
  clientFacingOptions,
}) => {
  // API endpoints
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;

  // State variables
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [pipelineId, setPipelineId] = useState("");
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [combinedTagsValues, setCombinedTagsValues] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
  const [inputText, setInputText] = useState("");
  const [clientDescription, setClientDescription] = useState("");
  const [clientFacingStatus, setClientFacingStatus] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const charLimit = 500;
  const [dataAccountjob, setDataAccountjob] = useState("");
  const [jobName, setJobName] = useState("");
  // Fetch job data when component mounts or jobId changes
  useEffect(() => {
    if (jobId) {
      fetchJobDetails(jobId);
    }
  }, [jobId]);

  const fetchJobDetails = async (jobId) => {
    try {
      const url = `${JOBS_API}/workflow/jobs/job/joblist/listbyid/${jobId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("jobasdata", data);

      const jobData = data.jobList;
      console.log("joblist", jobData);
      // Set account data
      if (jobData.Account && jobData.Account.length > 0) {
        const { _id, accountName } = jobData.Account[0];
        setSelectedAccount(accountName);
        setAccountId(_id);
      }
      setJobName(jobData.Name);
      // Set pipeline data
      if (jobData.Pipeline) {
        const pipelineData = {
          value: jobData.Pipeline._id,
          label: jobData.Pipeline.Name,
        };
        setSelectedPipeline(pipelineData);
        setPipelineId(jobData.Pipeline._id);
        fetchPipelineStages(jobData.Pipeline._id);
      }

      // Set dates
      setDueDate(jobData.DueDate ? dayjs(jobData.DueDate) : null);
      setStartDate(jobData.StartDate ? dayjs(jobData.StartDate) : null);

      // Set stage data
      if (jobData.Stage && jobData.Stage.length > 0) {
        const stageData = {
          value: jobData.Stage[0]._id,
          label: jobData.Stage[0].name,
        };
        setSelectedStage(stageData);
      }

      // Set other fields
      setPriority(jobData.Priority || "");
      setDescription(jobData.Description || "");
      setClientFacingStatus(jobData.ShowinClientPortal || false);
      setInputText(jobData.jobClientName || "");
      setClientDescription(jobData.ClientFacingDecription || "");
      setCharCount(
        jobData.ClientFacingDecription
          ? jobData.ClientFacingDecription.length
          : 0
      );

      // Set client facing status
      if (jobData.ClientFacingStatus) {
        const clientStatusData = {
          value: jobData.ClientFacingStatus._id,
          label: jobData.ClientFacingStatus.clientfacingName,
          clientfacingColour: jobData.ClientFacingStatus.clientfacingColour,
        };
        setSelectedJob(clientStatusData);
      }

      // Set account name
      if (jobData.Account) {
        setDataAccountjob(jobData.Account[0].accountName);
      }

      // Set tags
      if (jobData.Account && jobData.Account[0].tags) {
        const tagsData = jobData.Account[0].tags
          .flatMap((tagArray) => tagArray)
          .map((tag) => ({
            value: tag._id,
            label: tag.tagName,
            colour: tag.tagColour,
          }));
        setSelectedTags(tagsData);
        setCombinedTagsValues(tagsData.map((option) => option.value));
      }

      // Set assignees
      if (jobData.JobAssignee) {
        const assigneesData = jobData.JobAssignee.map((assignee) => ({
          value: assignee._id,
          label: assignee.username,
        }));
        setSelectedUser(assigneesData);
        setCombinedValues(assigneesData.map((option) => option.value));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPipelineStages = async (pipelineId) => {
    try {
      const response = await fetch(
        `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`
      );
      const data = await response.json();

      if (data.pipeline && data.pipeline.stages) {
        const stagesData = data.pipeline.stages.map((stage) => ({
          value: stage._id,
          label: stage.name,
        }));
        setStages(stagesData);
      }
    } catch (error) {
      console.error("Error fetching pipeline stages:", error);
    }
  };

  const handlePipelineChange = (selectedOption) => {
    setSelectedPipeline(selectedOption);
    fetchPipelineStages(selectedOption.value);
    setSelectedStage(null);
  };

  const handleStageChange = (selectedOption) => {
    setSelectedStage(selectedOption);
  };

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
  };

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const handleTagChange = (event) => {
    const { value } = event.target;
    setSelectedTags(
      tagOptions.filter((option) => value.includes(option.value))
    );
    setCombinedTagsValues(value);
  };

  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    setCombinedValues(newSelectedUsers.map((option) => option.value));
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleDueDateChange = (date) => {
    setDueDate(date);
  };

  const handleInputTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleClientDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= charLimit) {
      setClientDescription(value);
      setCharCount(value.length);
    }
  };

  const handleJobChange = (event, newValue) => {
    setSelectedJob(newValue);
  };

  const handleClientFacingToggle = (event) => {
    setClientFacingStatus(event.target.checked);
  };

  const handleSave = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipeline: selectedPipeline?.value,
      stageid: selectedStage?.value,
      jobname: jobName,
      jobassignees: combinedValues,
      priority: priority,
      description: description,
      startdate: startDate,
      enddate: dueDate,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${JOBS_API}/workflow/jobs/job/` + jobId, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Job updated successfully");
        handleSaveTags();
        fetchJobData();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update Job");
      });
  };

  const handleSaveAndExit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipeline: selectedPipeline?.value,
      stageid: selectedStage?.value,
      jobname: jobName,
      jobassignees: combinedValues,
      priority: priority,
      description: description,
      startdate: startDate,
      enddate: dueDate,
      showinclientportal: clientFacingStatus,
      jobnameforclient: inputText,
      clientfacingstatus: selectedJob?.value,
      clientfacingDescription: clientDescription,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${JOBS_API}/workflow/jobs/job/` + jobId, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Job updated successfully");
        handleSaveTags();
        onClose();
        fetchJobData();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update Job");
      });
  };

  const handleSaveTags = () => {
    if (!accountId) return;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      tags: combinedTagsValues,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/accounts/accountdetails/${accountId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Tags updated successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="ml-auto relative z-50 w-full max-w-[500px] sm:rounded-l-xl bg-background h-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-xl font-bold">Edit Job</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bulk-job-form">
          <div>
            <label className="text-sm font-medium">Account</label>
            <Input value={selectedAccount} readOnly className="mt-1 bg-white" />
          </div>

          <div>
            <label className="text-sm font-medium">Job Name</label>
            <Input value={jobName} onChange={(e) => setJobName(e.target.value)} className="mt-1 bg-white" />
          </div>

          <div>
            <label className="text-sm font-medium">Pipeline</label>
            <select
              value={selectedPipeline?.value || ""}
              disabled
              className="w-full mt-1 rounded-lg border border-input bg-muted px-3 py-2 text-sm opacity-70 cursor-not-allowed"
            >
              <option value="" disabled>Pipeline</option>
              {pipelineOptions?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Account Tags</label>
            <div className="mt-1 rounded-lg border border-input bg-background p-2 min-h-[40px]">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {combinedTagsValues.map((value) => {
                  const option = tagOptions?.find((opt) => opt.value === value);
                  return (
                    <span
                      key={value}
                      className="text-[10px] text-white font-medium px-2 py-0.5 rounded-full shadow-sm cursor-pointer"
                      style={{ backgroundColor: option?.colour }}
                      onClick={() => {
                        const newValues = combinedTagsValues.filter((v) => v !== value);
                        setCombinedTagsValues(newValues);
                        setSelectedTags(tagOptions?.filter((opt) => newValues.includes(opt.value)) || []);
                      }}
                    >
                      {option?.label} ×
                    </span>
                  );
                })}
              </div>
              <select
                value=""
                onChange={(e) => {
                  const val = e.target.value;
                  if (!combinedTagsValues.includes(val)) {
                    const newValues = [...combinedTagsValues, val];
                    setCombinedTagsValues(newValues);
                    setSelectedTags(tagOptions?.filter((opt) => newValues.includes(opt.value)) || []);
                  }
                }}
                className="w-full text-sm bg-transparent border-0 focus:outline-none"
              >
                <option value="" disabled>Select tags...</option>
                {tagOptions?.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mr-2.5">
            <label className="text-sm font-medium">Job Assignee</label>
            <MultiSelectDropdown
              value={selectedUser}
              onChange={handleUserChange}
              placeholder="Job Assignees"
              options={userOptions}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Stage</label>
            <select
              value={selectedStage?.value || ""}
              onChange={(e) => {
                const opt = stages.find((o) => o.value === e.target.value);
                handleStageChange(opt);
              }}
              className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>Select stages</option>
              {stages.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <Priority
              onPriorityChange={handlePriorityChange}
              selectedPriority={priority}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={startDate ? dayjs(startDate).format("YYYY-MM-DD") : ""}
              onChange={(e) => handleStartDateChange(e.target.value ? dayjs(e.target.value) : null)}
              className="mt-1 bg-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              value={dueDate ? dayjs(dueDate).format("YYYY-MM-DD") : ""}
              onChange={(e) => handleDueDateChange(e.target.value ? dayjs(e.target.value) : null)}
              className="mt-1 bg-white"
            />
          </div>

          <div className="mb-5">
            <Editor
              initialContent={description}
              onChange={handleEditorChange}
            />
          </div>

          <div className="mt-6 flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm">Client-facing status</p>
              <div className="flex items-center gap-2">
                <Switch
                  checked={clientFacingStatus}
                  onCheckedChange={(checked) => setClientFacingStatus(checked)}
                />
                <span className="text-sm">Show in Client portal</span>
              </div>
            </div>

            {clientFacingStatus && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Job name for client</label>
                  <Input
                    name="subject"
                    value={inputText}
                    onChange={handleInputTextChange}
                    placeholder="Job name for client"
                    className="mt-1 bg-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={selectedJob?.value || ""}
                    onChange={(e) => {
                      const opt = clientFacingOptions?.find((o) => o.value === e.target.value);
                      handleJobChange(e, opt);
                    }}
                    className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="" disabled>Select Client Facing Job</option>
                    {clientFacingOptions?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={clientDescription}
                    onChange={handleClientDescriptionChange}
                    placeholder="Description"
                    className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-y"
                  />
                  <span className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {charCount}/{charLimit}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-6 pb-4">
            <Button onClick={handleSaveAndExit}>Save & Exit</Button>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJobDrawer;

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  InputLabel,
  TextField,
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  Chip,
  Button,
  FormControlLabel,
  Switch,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import Priority from '../Templates/Priority/Priority'; // Adjust path as needed
import Editor from '../Templates/Texteditor/Editor'; // Adjust path as needed
import MultiSelectDropdown from '../Templates/MultiSelectDropdown'; // Adjust path as needed

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
  theme,
  isSmallScreen
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
      
      // Set account data
      if (jobData.Account && jobData.Account.length > 0) {
        const { _id, accountName } = jobData.Account[0];
        setSelectedAccount(accountName);
        setAccountId(_id);
      }
      
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
      setCharCount(jobData.ClientFacingDecription ? jobData.ClientFacingDecription.length : 0);
      
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
          .flatMap(tagArray => tagArray)
          .map(tag => ({
            value: tag._id,
            label: tag.tagName,
            colour: tag.tagColour,
          }));
        setSelectedTags(tagsData);
        setCombinedTagsValues(tagsData.map(option => option.value));
      }
      
      // Set assignees
      if (jobData.JobAssignee) {
        const assigneesData = jobData.JobAssignee.map(assignee => ({
          value: assignee._id,
          label: assignee.username,
        }));
        setSelectedUser(assigneesData);
        setCombinedValues(assigneesData.map(option => option.value));
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPipelineStages = async (pipelineId) => {
    try {
      const response = await fetch(`${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`);
      const data = await response.json();

      if (data.pipeline && data.pipeline.stages) {
        const stagesData = data.pipeline.stages.map(stage => ({
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
      tagOptions.filter(option => value.includes(option.value))
    );
    setCombinedTagsValues(value);
  };

  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    setCombinedValues(newSelectedUsers.map(option => option.value));
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
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(result => {
        toast.success("Job updated successfully");
        handleSaveTags();
        fetchJobData();
      })
      .catch(error => {
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
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(result => {
        toast.success("Job updated successfully");
        handleSaveTags();
        onClose();
        fetchJobData();
      })
      .catch(error => {
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
      .then(response => response.json())
      .then(result => {
        console.log("Tags updated successfully");
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
            width: isSmallScreen ? "100%" : 500,
            maxWidth: "100%",
            [theme.breakpoints.down("sm")]: {
              width: "100%",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            ml: 1,
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
            Edit Job
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box
          padding={2}
          height="83vh"
          sx={{ overflowY: "auto" }}
          className="bulk-job-form"
        >
          <Box>
            <InputLabel sx={{ color: "black" }}>Account</InputLabel>
            <TextField
              value={selectedAccount}
              size="small"
              fullWidth
              margin="normal"
            />
          </Box>

          <Box>
            <InputLabel sx={{ color: "black" }}>Pipeline</InputLabel>
            <Autocomplete
              options={pipelineOptions}
              getOptionLabel={(option) => option.label}
              value={selectedPipeline}
              onChange={(event, newValue) => handlePipelineChange(newValue)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ cursor: "pointer", margin: "5px 10px" }}
                >
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ backgroundColor: "#fff" }}
                  placeholder="Pipeline"
                  variant="outlined"
                  size="small"
                />
              )}
              sx={{ width: "100%", marginTop: "8px" }}
              clearOnEscape
            />
          </Box>

          <Box mt={2}>
            <InputLabel sx={{ color: "black", mb: 1 }}>Account Tags</InputLabel>
            <FormControl sx={{ width: "100%" }}>
              <Select
                multiple
                multiline
                size="small"
                input={<OutlinedInput />}
                displayEmpty
                value={combinedTagsValues}
                onChange={handleTagChange}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <span style={{ color: "#aaa" }}>Select tags...</span>;
                  }
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        padding: "6px",
                      }}
                    >
                      {selected.map((value) => {
                        const option = tagOptions.find(
                          (opt) => opt.value === value
                        );
                        return (
                          <Chip
                            key={value}
                            label={option?.label}
                            sx={{
                              backgroundColor: option?.colour,
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: "10px",
                              borderRadius: "16px",
                              height: "20px",
                              cursor: "pointer",
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                            }}
                          />
                        );
                      })}
                    </Box>
                  );
                }}
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 250 },
                  },
                }}
                sx={{
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                }}
              >
                {tagOptions.map((option) => {
                  const dynamicWidth = Math.min(
                    option.label.length * 8 + 16,
                    150
                  );
                  return (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      sx={{
                        backgroundColor: option.colour,
                        color: "#fff",
                        fontSize: "10px",
                        borderRadius: "10px",
                        margin: "5px",
                        textAlign: "center",
                        padding: "4px 9px",
                        minWidth: `${dynamicWidth}px`,
                        maxWidth: `${dynamicWidth}px`,
                        "&:hover": {
                          backgroundColor: option.colour,
                          color: "#fff",
                        },
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>

          <Box mt={2} mr={2.5}>
            <InputLabel sx={{ color: "black" }}>Job Assignee</InputLabel>
            <MultiSelectDropdown 
              value={selectedUser}
              onChange={handleUserChange}
              placeholder="Job Assignees"
              options={userOptions}
            />
          </Box>

          <Box mt={2}>
            <InputLabel sx={{ color: "black" }}>Stage</InputLabel>
            <Autocomplete
              options={stages}
              getOptionLabel={(option) => option.label}
              value={selectedStage}
              onChange={(event, newValue) => handleStageChange(newValue)}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ cursor: "pointer", margin: "5px 10px" }}
                >
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ backgroundColor: "#fff" }}
                  placeholder="Select stages"
                  variant="outlined"
                  size="small"
                />
              )}
              clearOnEscape
              sx={{ width: "100%", marginTop: "8px" }}
            />
          </Box>

          <Box mt={2}>
            <Priority
              onPriorityChange={handlePriorityChange}
              selectedPriority={priority}
            />
          </Box>

          <Box mt={2}>
            <InputLabel sx={{ color: "black" }}>Start Date</InputLabel>
            <DatePicker
              format="MM/DD/YYYY"
              sx={{ width: "100%", backgroundColor: "#fff", mt: 2 }}
              value={startDate}
              onChange={handleStartDateChange}
              renderInput={(params) => (
                <TextField {...params} size="small" />
              )}
            />
          </Box>

          <Box mt={2}>
            <InputLabel sx={{ color: "black" }}>Due Date</InputLabel>
            <DatePicker
              format="MM/DD/YYYY"
              sx={{ width: "100%", backgroundColor: "#fff", mt: 2 }}
              value={dueDate}
              onChange={handleDueDateChange}
              renderInput={(params) => (
                <TextField {...params} size="small" />
              )}
            />
          </Box>

          <Box mt={2} mb={5}>
            <Editor
              initialContent={description}
              onChange={handleEditorChange}
            />
          </Box>

          <Box mt={3}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body">
                    <b>Client-facing status</b>
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={handleClientFacingToggle}
                        checked={clientFacingStatus}
                        color="primary"
                      />
                    }
                    label="Show in Client portal"
                  />
                </Box>
                <Box>
                  {clientFacingStatus && (
                    <>
                      <InputLabel sx={{ color: "black" }}>
                        Job name for client
                      </InputLabel>
                      <TextField
                        fullWidth
                        name="subject"
                        value={inputText}
                        onChange={handleInputTextChange}
                        placeholder="Job name for client"
                        size="small"
                        sx={{ background: "#fff", mt: 2 }}
                      />

                      <Box mt={2}>
                        <InputLabel sx={{ color: "black" }}>
                          Status
                        </InputLabel>
                        <Autocomplete
                          options={clientFacingOptions}
                          size="small"
                          sx={{ mt: 1 }}
                          value={selectedJob}
                          onChange={handleJobChange}
                          getOptionLabel={(option) => option.label}
                          isOptionEqualToValue={(option, value) =>
                            option.value === value.value
                          }
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              <Chip
                                size="small"
                                style={{
                                  backgroundColor: option.clientfacingColour,
                                  marginRight: 8,
                                  marginLeft: 8,
                                  borderRadius: "50%",
                                  height: "15px",
                                }}
                              />
                              {option.label}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Client Facing Job"
                              InputProps={{
                                ...params.InputProps,
                                startAdornment:
                                  params.inputProps.value &&
                                  clientFacingOptions.length > 0 ? (
                                    <Chip
                                      size="small"
                                      style={{
                                        backgroundColor:
                                          clientFacingOptions.find(
                                            (job) =>
                                              job.clientfacingName ===
                                              params.inputProps.value
                                          )?.clientfacingColour,
                                        marginRight: 8,
                                        marginLeft: 2,
                                        borderRadius: "50%",
                                        height: "15px",
                                      }}
                                    />
                                  ) : null,
                              }}
                            />
                          )}
                        />
                      </Box>
                      <Box sx={{ position: "relative", mt: 2 }}>
                        <InputLabel sx={{ color: "black" }}>
                          Description
                        </InputLabel>
                        <TextField
                          fullWidth
                          size="small"
                          margin="normal"
                          type="text"
                          multiline
                          value={clientDescription}
                          onChange={handleClientDescriptionChange}
                          placeholder="Description"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Typography
                                  sx={{
                                    color: "gray",
                                    fontSize: "12px",
                                    position: "absolute",
                                    bottom: "15px",
                                    right: "15px",
                                  }}
                                >
                                  {charCount}/{charLimit}
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box mt={5} display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              onClick={handleSaveAndExit}
              sx={{
                backgroundColor: "var(--color-save-btn)",
                "&:hover": {
                  backgroundColor: "var(--color-save-hover-btn)",
                },
                borderRadius: "15px",
              }}
            >
              Save & Exit
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                backgroundColor: "var(--color-save-btn)",
                "&:hover": {
                  backgroundColor: "var(--color-save-hover-btn)",
                },
                width: "80px",
                borderRadius: "15px",
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: "var(--color-border-cancel-btn)",
                color: "var(--color-save-btn)",
                "&:hover": {
                  backgroundColor: "var(--color-save-hover-btn)",
                  color: "#fff",
                  border: "none",
                },
                width: "80px",
                borderRadius: "15px",
                ml: 2,
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
};

export default EditJobDrawer;
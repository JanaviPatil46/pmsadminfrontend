import { useState } from "react";
import { useEffect } from "react";

import {
  Box,
  Button,
  Typography,
  Autocomplete,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
} from "@mui/material";
import StagesSection from "./StagesSection";
import { toast } from "react-toastify";
const PipelineForm = () => {
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const SORTJOBS_API = process.env.REACT_APP_SORTJOBS_URL;
 const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const [pipelineName, setPipelineName] = useState("");

  // sort jobs
  const [sortbyjobs, setSortbyJobs] = useState([]);
  const [selectedSortByJob, setSelectedSortByJob] = useState(null);
 const [loading, setLoading] = useState(false);
  const handleSortingByJobs = (selectedOptions) => {
    setSelectedSortByJob(selectedOptions);
    console.log(selectedOptions);
  };

  useEffect(() => {
    fetchSortByJob();
  }, []);

  const fetchSortByJob = async () => {
    try {
      const url = `${SORTJOBS_API}/sortjobs/sortjobby`;
      const response = await fetch(url);
      const data = await response.json();
      setSortbyJobs(data.sortJobsBy);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const optionsort = sortbyjobs.map((sort) => ({
    value: sort._id,
    label: sort.description,
  }));

  const [Account_id, setAccount_id] = useState(false);
  const handleAccount_idChange = (event) => {
    setAccount_id(event.target.checked);
  };
  const [Days_on_stage, setDays_on_stage] = useState(false);
  const handleDays_on_stageChange = (event) => {
    setDays_on_stage(event.target.checked);
  };
  const [Account_tags, setAccount_tags] = useState(false);
  const handleAccount_tagsChange = (event) => {
    setAccount_tags(event.target.checked);
  };
  const [clientFacing_status, setClientFacing_status] = useState(false);
  const handleClientFacing_status = (event) => {
    setClientFacing_status(event.target.checked);
  };
  const [startDate, setStartDate] = useState(false);
  const handleStartDateChange = (event) => {
    setStartDate(event.target.checked);
  };
  const [Name, setName] = useState(false);
  const handleNameSwitchChange = (event) => {
    setName(event.target.checked);
  };
  const [Due_date, setDue_date] = useState(false);
  const handleDue_dateChange = (event) => {
    setDue_date(event.target.checked);
  };
  const [Priority, setPriority] = useState(false);
  const [Description, setDescription] = useState(false);
  const [Assignees, setAssignees] = useState(false);
  const handlePriorityChange = (event) => {
    setPriority(event.target.checked);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.checked);
  };
  const handleAssigneesChange = (event) => {
    setAssignees(event.target.checked);
  };

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedValues(selectedValues);
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  //Default Jobt template get
  const [Defaulttemp, setDefaultTemp] = useState([]);
  const [selectedJobtemp, setselectedJobTemp] = useState();
  const handleJobtemp = (selectedOptions) => {
    setselectedJobTemp(selectedOptions);
    console.log(selectedOptions);
  };
  useEffect(() => {
    fetchtemp();
  }, []);

  const fetchtemp = async () => {
    try {
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setDefaultTemp(data.JobTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optiontemp = Defaulttemp.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  // Stages functionality
  const [stages, setStages] = useState([]);
  const [stageNameErrors, setStageNameErrors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [stageSelected, setStageSelected] = useState(null);
  const [automationSelect, setAutomationSelect] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAddStage = (index) => {
    const newStage = {
      name: "",
      conditions: [],
      automations: [],
      autoMove: false,
      showDropdown: false,
      activeAction: null,
    };

    // Insert new stage at the specified index
    const updatedStages = [...stages];
    updatedStages.splice(index, 0, newStage);

    setStages(updatedStages);
    setStageNameErrors([...stageNameErrors]);
  };

  const handleStageNameChange = (e, index) => {
    const updatedStages = [...stages];
    updatedStages[index].name = e.target.value;
    setStages(updatedStages);

    // Clear error when user starts typing
    const updatedErrors = [...stageNameErrors];
    updatedErrors[index] = "";
    setStageNameErrors(updatedErrors);
  };

  const handleDeleteStage = (index) => {
    const updatedStages = stages.filter((_, i) => i !== index);
    setStages(updatedStages);

    const updatedErrors = stageNameErrors.filter((_, i) => i !== index);
    setStageNameErrors(updatedErrors);
  };

  const handleSaveAutomations = (stageIndex, automations) => {
    setStages((prevStages) => {
      const updatedStages = [...prevStages];
      updatedStages[stageIndex] = {
        ...updatedStages[stageIndex],
        automations: automations,
      };
      return updatedStages;
    });
  };
// Save pipeline to backend
  // Validate form before saving
  const validateForm = () => {
    const errors = {};

    if (!pipelineName.trim()) {
      errors.pipelineName = "Pipeline name is required";
    }

    if (stages.length === 0) {
      errors.stages = "At least one stage is required";
    }

    // Validate stage names
    const stageErrors = stages.map((stage, index) => {
      if (!stage.name.trim()) {
        return `Stage ${index + 1} name is required`;
      }
      return "";
    });

    if (stageErrors.some(error => error !== "")) {
      errors.stageNames = stageErrors;
    }

    return errors;
  };

const handleSavePipeline = async (exitAfterSave = false) => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      // Set stage name errors if any
      if (errors.stageNames) {
        setStageNameErrors(errors.stageNames);
      }
      
    //   // Show error message
    //   setSnackbar({
    //     open: true,
    //     message: "Please fix the form errors before saving",
    //     severity: "error"
    //   });
      return;
    }

    setLoading(true);

    try {
      // Prepare pipeline data matching backend schema
      const pipelineData = {
        pipelineName: pipelineName.trim(),
        availableTo: selectedUser.map(user => user.value),
        sortJobsBy: selectedSortByJob ? selectedSortByJob.value : null,
        defaultJobTemplate: selectedJobtemp ? selectedJobtemp.value : null,
        jobCardFields: {
          accountId: Account_id,
          daysInStage: Days_on_stage,
          accountTags: Account_tags,
          clientFacingStatus: clientFacing_status,
          startDate: startDate,
          name: Name,
          dueDate: Due_date,
          description: Description,
          assignees: Assignees,
          priority: Priority
        },
        stages: stages.map((stage, index) => ({
          name: stage.name.trim(),
          order: stage.order || index + 1,
          conditions: stage.conditions || [],
          automations: stage.automations ? stage.automations.map(auto => ({
            type: auto.type,
            index: auto.index,
            selectedtemp: auto.selectedtemp ? {
              value: auto.selectedtemp.value,
              label: auto.selectedtemp.label
            } : null,
            selectedTags: auto.selectedTags ? auto.selectedTags.map(tag => ({
              _id: tag._id || tag.id,
              tagName: tag.tagName || tag.name,
              tagColour: tag.tagColour || tag.color
            })) : [],
            reminderChecked: auto.reminderChecked || false,
            daysuntilNextReminder: auto.daysuntilNextReminder || "",
            noOfReminder: auto.noOfReminder || "",
            addTags: auto.addTags || [],
            removeTags: auto.removeTags || [],
            selectedAssignees: auto.selectedAssignees || [],
            assigneesToRemove: auto.assigneesToRemove || [],
            status: auto.status || null,
            selectedClientStatus: auto.selectedClientStatus ? {
              value: auto.selectedClientStatus.value,
              label: auto.selectedClientStatus.label,
              clientfacingColour: auto.selectedClientStatus.clientfacingColour
            } : null,
            clientDescription: auto.clientDescription || "",
            template: auto.template ? {
              id: auto.template.id,
              name: auto.template.name
            } : null,
            tags: auto.tags ? auto.tags.map(tag => ({
              id: tag.id,
              name: tag.name,
              color: tag.color
            })) : []
          })) : [],
          autoMove: stage.autoMove || false
        })),
        active: true
      };

      console.log("Saving pipeline data:", pipelineData);

      // Make API call to save pipeline - UPDATED URL
      const response = await fetch(`${PIPELINE_API}/workflow/pipeline/createpipeline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pipelineData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Pipeline saved successfully:", result);

toast.success("Pipeline saved successfully!");
      // If exit after save, you can redirect or close the form
      if (exitAfterSave) {
        setTimeout(() => {
          // Redirect to pipelines list or close the form
          window.location.href = "/firmtemp/pipelines"; // Update with your actual route
        }, 1500);
      }

    } catch (error) {
      console.error("Error saving pipeline:", error);
  
    toast.error(error.message || "Failed to save pipeline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle save (without exiting)
  const handleSave = () => {
    handleSavePipeline(false);
  };

  // Handle save and exit
  const handleSaveAndExit = () => {
    handleSavePipeline(true);
  };
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Create Pipelines
      </Typography>
      <Divider />
      <Box p={3}>
        <Grid container spacing={4} mt={1}>
          {/* RIGHT SIDE – FORM INPUTS */}
          <Grid item xs={12} md={6} p={2}>
            <Box>
              <Box>
                <label className="pipeline-lable">Pipeline Name</label>
                <TextField
                  fullWidth
                  value={pipelineName}
                  onChange={(e) => setPipelineName(e.target.value)}
                  size="small"
                  sx={{ mt: 1, background: "#fff" }}
                  placeholder="Pipeline Name"
                />
              </Box>

              <Box mt={3}>
                <label className="pipeline-lable">Available To</label>
                <Autocomplete
                  multiple
                  options={options}
                  value={selectedUser}
                  onChange={handleUserChange}
                  size="small"
                  sx={{ mt: 1, background: "#fff" }}
                  getOptionLabel={(o) => o.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Available To" />
                  )}
                />
              </Box>

              <Box mt={3}>
                <label className="pipeline-lable">Sort jobs by</label>
                <Autocomplete
                  options={optionsort}
                  value={selectedSortByJob}
                  onChange={(e, v) => handleSortingByJobs(v)}
                  size="small"
                  sx={{ mt: 1, background: "#fff" }}
                  getOptionLabel={(o) => o.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Sort By Job" />
                  )}
                />
              </Box>

              <Box mt={3}>
                <label className="pipeline-lable">Default job template</label>
                <Autocomplete
                  options={optiontemp}
                  value={selectedJobtemp}
                  onChange={(e, v) => handleJobtemp(v)}
                  size="small"
                  sx={{ mt: 1, background: "#fff" }}
                  getOptionLabel={(o) => o.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Default job template" />
                  )}
                />
              </Box>
            </Box>
          </Grid>
          {/* LEFT SIDE – JOB CARD FIELDS */}
          <Grid item xs={12} md={6} p={2}>
            <Box p={2} sx={{ background: "#fff", borderRadius: "10px" }}>
              <Typography variant="h6" mb={2}>
                Job card fields
              </Typography>

              <Grid container spacing={2}>
                {/* COLUMN 1 */}
                <Grid item xs={12} sm={4}>
                  <Box sx={{ width: 200, pt: 1, pb: 1 }}>
                    {" "}
                    {/* Fixed width */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Account_id}
                          onChange={handleAccount_idChange}
                        />
                      }
                      label="Account ID"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Days_on_stage}
                          onChange={handleDays_on_stageChange}
                        />
                      }
                      label="Days in stage"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Account_tags}
                          onChange={handleAccount_tagsChange}
                        />
                      }
                      label="Account tags"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={clientFacing_status}
                          onChange={handleClientFacing_status}
                        />
                      }
                      label="Client-facing Status"
                    />
                  </Box>
                </Grid>

                {/* COLUMN 2 */}
                <Grid item xs={12} sm={4}>
                  <Box sx={{ width: 200, pt: 1, pb: 1 }}>
                    {" "}
                    {/* Same fixed width */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={startDate}
                          onChange={handleStartDateChange}
                        />
                      }
                      label="Start date"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Name}
                          onChange={handleNameSwitchChange}
                        />
                      }
                      label="Name"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Due_date}
                          onChange={handleDue_dateChange}
                        />
                      }
                      label="Due date"
                    />
                  </Box>
                </Grid>

                {/* COLUMN 3 */}
                <Grid item xs={12} sm={4}>
                  <Box sx={{ width: 200, pt: 1, pb: 1 }}>
                    {" "}
                    {/* Same fixed width */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Description}
                          onChange={handleDescriptionChange}
                        />
                      }
                      label="Description"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Assignees}
                          onChange={handleAssigneesChange}
                        />
                      }
                      label="Assignees"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Priority}
                          onChange={handlePriorityChange}
                        />
                      }
                      label="Priority"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* STAGES SECTION */}
        <Box m={2}>
          {" "}
          <StagesSection
            stages={stages}
            stageNameErrors={stageNameErrors}
            handleAddStage={handleAddStage}
            handleDeleteStage={handleDeleteStage}
            handleStageNameChange={handleStageNameChange}
            handleSaveAutomations={handleSaveAutomations}
          />
        </Box>
      </Box>
      {/* ACTION BUTTONS */}
      <Box display="flex" gap={2} mt={4}>
        <Button 
          variant="contained" 
          sx={{ borderRadius: "15px" }}
          onClick={handleSaveAndExit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save & exit"}
        </Button>
        <Button 
          variant="contained" 
          sx={{ borderRadius: "15px" }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button variant="outlined" sx={{ borderRadius: "15px" }}>
          Cancel
        </Button>
      
      </Box>
    </Box>
  );
};

export default PipelineForm;

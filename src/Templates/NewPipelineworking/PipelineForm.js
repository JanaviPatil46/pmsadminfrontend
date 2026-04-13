import { useState } from "react";
import { useEffect } from "react";
import StagesSection from "./StagesSection";
import { toast } from "react-toastify";
import MultiSelectDropdown from "../MultiSelectDropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Loader2, ChevronLeft } from "lucide-react";
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

  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  //Default Jobt template get
  const [Defaulttemp, setDefaultTemp] = useState([]);
  const [selectedJobtemp, setselectedJobTemp] = useState(null);
  const handleJobtemp = (selectedOptions) => {
    setselectedJobTemp(selectedOptions);
    console.log("selcted job template", selectedOptions);
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

    if (stages.length < 2) {
      errors.stages = "Please add at least 2 stages";
    }

    // Validate stage names
    const stageErrors = stages.map((stage, index) => {
      if (!stage.name.trim()) {
        return `Stage ${index + 1} name is required`;
      }
      return "";
    });

    if (stageErrors.some((error) => error !== "")) {
      errors.stageNames = stageErrors;
    }

    return errors;
  };
  const [isEditMode, setIsEditMode] = useState(false);
  const [pipelineId, setPipelineId] = useState(null);

  // Get URL parameters for edit mode
  const location = useLocation();

  // Add this useEffect to handle edit mode
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get("edit");

    if (editId) {
      setIsEditMode(true);
      setPipelineId(editId);
      fetchPipelineData(editId);
    }
  }, [location]);

  // Fetch pipeline data for editing
  const fetchPipelineData = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${PIPELINE_API}/workflow/pipeline/pipeline/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pipeline data");
      }

      const data = await response.json();
      const pipeline = data.pipeline;

      // Populate form with existing data
      setPipelineName(pipeline.pipelineName);

      if (pipeline && pipeline.availableto) {
        const assigneesData = pipeline.availableto.map((assignee) => ({
          value: assignee._id,
          label: assignee.username,
        }));
        console.log("assigneesData", assigneesData);
        setSelectedUser(assigneesData);

        const selectedValues = assigneesData.map((option) => option.value);
        setCombinedValues(selectedValues);
      }

      if (pipeline && pipeline.sortjobsby) {
        const sortjobsbyData = {
          value: pipeline.sortjobsby._id,
          label: pipeline.sortjobsby.description,
        };

        setSelectedSortByJob(sortjobsbyData);
      }

      if (pipeline && pipeline.defaultjobtemplate) {
        const defaultjobtemplateData = {
          value: pipeline.defaultjobtemplate._id,
          label: pipeline.defaultjobtemplate.templatename,
        };

        setselectedJobTemp(defaultjobtemplateData);
        console.log("defaultjobtemplateData", defaultjobtemplateData);
      }
      // Set job card fields
      setAccount_id(pipeline.accountId || false);
      setDays_on_stage(pipeline.days_on_Stage || false);
      setAccount_tags(pipeline.accounttags || false);
      setClientFacing_status(pipeline.clientFacing_status || false);
      setStartDate(pipeline.startdate || false);
      setName(pipeline.name || false);
      setDue_date(pipeline.duedate || false);
      setPriority(pipeline.priority || false);
      setDescription(pipeline.description || false);
      setAssignees(pipeline.assignees || false);

      // Set stages - FIXED: Properly handle automations with selectedtemp
      if (pipeline.stages && pipeline.stages.length > 0) {
        const formattedStages = pipeline.stages.map((stage, index) => ({
          _id: stage._id,
          name: stage.name,
          order: stage.order || index + 1,
          conditions: stage.conditions || [],
          automations: stage.automations
            ? stage.automations.map((auto) => ({
                type: auto.type,
                index: auto.index,
                selectedtemp: auto.selectedtemp, // Keep as string ID, not object
                refModel: auto.refModel, // Include refModel
                templateRefModel: auto.templateRefModel, // Include templateRefModel
                selectedTags: auto.selectedTags || [],
                reminderChecked: auto.reminderChecked || false,
                daysuntilNextReminder: auto.daysuntilNextReminder || "",
                noOfReminder: auto.noOfReminder || "",
                addTags: auto.addTags || [],
                removeTags: auto.removeTags || [],
                selectedAssignees: auto.selectedAssignees || [],
                assigneesToRemove: auto.assigneesToRemove || [],
                status: auto.status || null,
                selectedClientStatus: auto.selectedClientStatus || null,
                clientDescription: auto.clientDescription || "",
                template: auto.template || null,
                tags: auto.tags || [],
                _id: auto._id, // Include the automation ID if it exists
              }))
            : [],
          autoMove: stage.autoMove || false,
          showDropdown: false,
          activeAction: null,
        }));
        setStages(formattedStages);
      }
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
      toast.error("Failed to load pipeline data");
    } finally {
      setLoading(false);
    }
  };
  const handleSavePipeline = async (exitAfterSave = false) => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      // Show toast for pipeline name error
      if (errors.pipelineName) {
        toast.error("Pipeline name is required");
      }

      // Show toast for stages count error
      if (errors.stages) {
        toast.error("Please add at least 2 stages");
      }

      // Show toast for stage names error
      if (errors.stageNames) {
        setStageNameErrors(errors.stageNames);
        const emptyStageCount = errors.stageNames.filter(
          (error) => error !== ""
        ).length;
        if (emptyStageCount > 0) {
          toast.error(`${emptyStageCount} stage name(s) are required`);
        }
      }

      return;
    }

    setLoading(true);

    try {
      const pipelineData = {
        pipelineName: pipelineName.trim(),
        availableto: combinedValues,
        sortjobsby: selectedSortByJob?.value,
        defaultjobtemplate: selectedJobtemp?.value,
        accountId: Account_id,
        description: Description,
        duedate: Due_date,
        accounttags: Account_tags,
        priority: Priority,
        days_on_Stage: Days_on_stage,
        assignees: Assignees,
        name: Name,
        clientFacing_status: clientFacing_status,
        startdate: startDate,
        stages: stages.map((stage, index) => ({
          ...(stage._id && { _id: stage._id }),
          name: stage.name.trim(),
          order: stage.order || index + 1,
          conditions: stage.conditions || [],
          automations: stage.automations
            ? stage.automations.map((auto) => ({
                type: auto.type,
                index: auto.index,
                selectedtemp: auto.selectedtemp
                  ? auto.selectedtemp.value || auto.selectedtemp
                  : null,
                selectedTags: auto.selectedTags || [],
                reminderChecked: auto.reminderChecked || false,
                daysuntilNextReminder: auto.daysuntilNextReminder || "",
                noOfReminder: auto.noOfReminder || "",
                addTags: auto.addTags || [],
                removeTags: auto.removeTags || [],
                selectedAssignees: auto.selectedAssignees || [],
                assigneesToRemove: auto.assigneesToRemove || [],
                status: auto.status || null,
                selectedClientStatus: auto.selectedClientStatus
                  ? auto.selectedClientStatus
                  : null,
                clientDescription: auto.clientDescription || "",
                refModel: auto.refModel || null,
                templateRefModel: auto.templateRefModel || null,
              }))
            : [],
          autoMove: stage.autoMove || false,
        })),
        active: true,
      };

      console.log(
        "Pipeline data being sent:",
        JSON.stringify(pipelineData, null, 2)
      );

      let url, method;

      // FIX: Check if we're in edit mode OR if we already have a pipelineId
      // This ensures that after creating a pipeline, subsequent saves will update it
      if (isEditMode || pipelineId) {
        // Use the pipelineId for update (either from edit mode or from previous creation)
        const idToUpdate = pipelineId;
        url = `${PIPELINE_API}/workflow/pipeline/pipeline/${idToUpdate}`;
        method = "PATCH";
      } else {
        // Create new pipeline
        url = `${PIPELINE_API}/workflow/pipeline/createpipeline`;
        method = "POST";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pipelineData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Pipeline saved successfully:", result);

      // FIX: Store the pipeline ID after creation so future saves will update
      if (!pipelineId && result.pipeline && result.pipeline._id) {
        setPipelineId(result.pipeline._id);
        setIsEditMode(true); // Set to edit mode after creation
      }

      const successMessage = isEditMode || pipelineId ? "updated" : "created";
      toast.success(`Pipeline ${successMessage} successfully!`);

      if (exitAfterSave) {
        navigate("/firmtemp/pipelines");
      }
    } catch (error) {
      console.error("Error saving pipeline:", error);
      toast.error(
        error.message ||
          `Failed to ${isEditMode ? "update" : "save"} pipeline. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };
 
  const navigate = useNavigate();
  // Update the cancel handler
  const handleCancel = () => {
    // window.location.href = "/firmtemp/pipelines";
    navigate("/firmtemp/pipelines");
  };

  // Handle save (without exiting)
  const handleSave = () => {
    handleSavePipeline(false);
  };

  // Handle save and exit
  const handleSaveAndExit = () => {
    handleSavePipeline(true);
  };

  const SwitchRow = ({ checked, onChange, label }) => (
    <label className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
      <span className="text-sm text-slate-700 group-hover:text-slate-900 select-none">{label}</span>
      <Switch checked={checked} onCheckedChange={(val) => onChange({ target: { checked: val } })} />
    </label>
  );

  const NativeSelect = ({ value, onChange, options, placeholder }) => (
    <select
      value={value?.value ?? ""}
      onChange={(e) => {
        const found = options.find((o) => o.value === e.target.value);
        onChange(null, found ?? null);
      }}
      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {isEditMode ? "Edit Pipeline" : "Create Pipeline"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Configure pipeline settings and stages</p>
        </div>
      </div>

      {/* Main form grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT – Pipeline settings */}
        <div className="space-y-5 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Pipeline Details</h2>

          {/* Pipeline Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Pipeline Name</label>
            <input
              type="text"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              placeholder="Pipeline Name"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Available To */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Available To</label>
            <MultiSelectDropdown
              value={selectedUser}
              onChange={handleUserChange}
              placeholder="Job Assignees"
            />
          </div>

          {/* Sort jobs by */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Sort jobs by</label>
            <NativeSelect
              value={selectedSortByJob}
              onChange={(e, v) => handleSortingByJobs(v)}
              options={optionsort}
              placeholder="Sort By Job"
            />
          </div>

          {/* Default job template */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Default job template</label>
            <NativeSelect
              value={selectedJobtemp}
              onChange={(e, v) => handleJobtemp(v)}
              options={optiontemp}
              placeholder="Default job template"
            />
          </div>
        </div>

        {/* RIGHT – Job card fields */}
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Job Card Fields</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
            {/* Column 1 */}
            <div className="space-y-1">
              <SwitchRow checked={Account_id} onChange={handleAccount_idChange} label="Account ID" />
              <SwitchRow checked={Days_on_stage} onChange={handleDays_on_stageChange} label="Days in stage" />
              <SwitchRow checked={Account_tags} onChange={handleAccount_tagsChange} label="Account tags" />
              <SwitchRow checked={clientFacing_status} onChange={handleClientFacing_status} label="Client-facing Status" />
            </div>
            {/* Column 2 */}
            <div className="space-y-1">
              <SwitchRow checked={startDate} onChange={handleStartDateChange} label="Start date" />
              <SwitchRow checked={Name} onChange={handleNameSwitchChange} label="Name" />
              <SwitchRow checked={Due_date} onChange={handleDue_dateChange} label="Due date" />
            </div>
            {/* Column 3 */}
            <div className="space-y-1">
              <SwitchRow checked={Description} onChange={handleDescriptionChange} label="Description" />
              <SwitchRow checked={Assignees} onChange={handleAssigneesChange} label="Assignees" />
              <SwitchRow checked={Priority} onChange={handlePriorityChange} label="Priority" />
            </div>
          </div>
        </div>
      </div>

      {/* Stages Section */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <StagesSection
          stages={stages}
          stageNameErrors={stageNameErrors}
          handleAddStage={handleAddStage}
          handleDeleteStage={handleDeleteStage}
          handleStageNameChange={handleStageNameChange}
          handleSaveAutomations={handleSaveAutomations}
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
        <Button
          onClick={handleSaveAndExit}
          disabled={loading}
          className="gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Saving..." : isEditMode || pipelineId ? "Update & Exit" : "Save & Exit"}
        </Button>
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={loading}
          className="gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Saving..." : isEditMode || pipelineId ? "Update" : "Save"}
        </Button>
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default PipelineForm;

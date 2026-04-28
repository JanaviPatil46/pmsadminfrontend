import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import StagesSection from "./StagesSection";
import { toast } from "react-toastify";
import MultiSelectDropdown from "../MultiSelectDropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Loader2, ChevronLeft } from "lucide-react";

const pipelineSchema = z.object({
  pipelineName: z.string().min(1, "Pipeline name is required"),
  availableto: z.array(z.any()).optional(),
  sortjobsby: z.any().optional(),
  defaultjobtemplate: z.any().optional(),
  accountId: z.boolean().optional(),
  days_on_Stage: z.boolean().optional(),
  accounttags: z.boolean().optional(),
  clientFacing_status: z.boolean().optional(),
  startdate: z.boolean().optional(),
  name: z.boolean().optional(),
  duedate: z.boolean().optional(),
  description: z.boolean().optional(),
  assignees: z.boolean().optional(),
  priority: z.boolean().optional(),
});
const PipelineForm = () => {
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const SORTJOBS_API = process.env.REACT_APP_SORTJOBS_URL;
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;

  const form = useForm({
    resolver: zodResolver(pipelineSchema),
    defaultValues: {
      pipelineName: "",
      availableto: [],
      sortjobsby: null,
      defaultjobtemplate: null,
      accountId: false, days_on_Stage: false, accounttags: false,
      clientFacing_status: false, startdate: false, name: false,
      duedate: false, description: false, assignees: false, priority: false,
    },
  });

  // sort jobs
  const [sortbyjobs, setSortbyJobs] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  //Default Jobt template get
  const [Defaulttemp, setDefaultTemp] = useState([]);
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
      const patchValues = {
        pipelineName: pipeline.pipelineName,
        availableto: pipeline.availableto
          ? pipeline.availableto.map((a) => ({ value: a._id, label: a.username }))
          : [],
        sortjobsby: pipeline.sortjobsby
          ? { value: pipeline.sortjobsby._id, label: pipeline.sortjobsby.description }
          : null,
        defaultjobtemplate: pipeline.defaultjobtemplate
          ? { value: pipeline.defaultjobtemplate._id, label: pipeline.defaultjobtemplate.templatename }
          : null,
        accountId: pipeline.accountId || false,
        days_on_Stage: pipeline.days_on_Stage || false,
        accounttags: pipeline.accounttags || false,
        clientFacing_status: pipeline.clientFacing_status || false,
        startdate: pipeline.startdate || false,
        name: pipeline.name || false,
        duedate: pipeline.duedate || false,
        priority: pipeline.priority || false,
        description: pipeline.description || false,
        assignees: pipeline.assignees || false,
      };
      form.reset(patchValues);

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
  const handleSavePipeline = async (formValues, exitAfterSave = false) => {
    if (stages.length < 2) {
      toast.error("Please add at least 2 stages");
      return;
    }

    const stageErrors = stages.map((stage, i) =>
      !stage.name.trim() ? `Stage ${i + 1} name is required` : ""
    );
    if (stageErrors.some((e) => e !== "")) {
      setStageNameErrors(stageErrors);
      toast.error(`${stageErrors.filter((e) => e !== "").length} stage name(s) are required`);
      return;
    }

    setLoading(true);

    try {
      const pipelineData = {
        pipelineName: formValues.pipelineName.trim(),
        availableto: (formValues.availableto || []).map((o) => o.value),
        sortjobsby: formValues.sortjobsby?.value,
        defaultjobtemplate: formValues.defaultjobtemplate?.value,
        accountId: formValues.accountId,
        description: formValues.description,
        duedate: formValues.duedate,
        accounttags: formValues.accounttags,
        priority: formValues.priority,
        days_on_Stage: formValues.days_on_Stage,
        assignees: formValues.assignees,
        name: formValues.name,
        clientFacing_status: formValues.clientFacing_status,
        startdate: formValues.startdate,
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

  const handleSave = form.handleSubmit((values) => handleSavePipeline(values, false));
  const handleSaveAndExit = form.handleSubmit((values) => handleSavePipeline(values, true));

  const SwitchRow = ({ name, label }) => (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <label className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
          <span className="text-sm text-foreground select-none">{label}</span>
          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
        </label>
      )}
    />
  );

  return (
    <Form {...form}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-5">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {isEditMode ? "Edit Pipeline" : "Create Pipeline"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Configure pipeline settings and stages</p>
          </div>
        </div>

        {/* Main form grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT – Pipeline settings */}
          <div className="space-y-5 rounded-xl border border-border bg-background p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Pipeline Details</h2>

            <FormField
              control={form.control}
              name="pipelineName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Pipeline Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availableto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available To</FormLabel>
                  <FormControl>
                    <MultiSelectDropdown
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Job Assignees"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sortjobsby"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort jobs by</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={field.value?.value ?? ""}
                      onChange={(e) => {
                        const found = optionsort.find((o) => o.value === e.target.value);
                        field.onChange(found ?? null);
                      }}
                    >
                      <option value="">Sort By Job</option>
                      {optionsort.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultjobtemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default job template</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={field.value?.value ?? ""}
                      onChange={(e) => {
                        const found = optiontemp.find((o) => o.value === e.target.value);
                        field.onChange(found ?? null);
                      }}
                    >
                      <option value="">Default job template</option>
                      {optiontemp.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* RIGHT – Job card fields */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Job Card Fields</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
              <div className="space-y-1">
                <SwitchRow name="accountId" label="Account ID" />
                <SwitchRow name="days_on_Stage" label="Days in stage" />
                <SwitchRow name="accounttags" label="Account tags" />
                <SwitchRow name="clientFacing_status" label="Client-facing Status" />
              </div>
              <div className="space-y-1">
                <SwitchRow name="startdate" label="Start date" />
                <SwitchRow name="name" label="Name" />
                <SwitchRow name="duedate" label="Due date" />
              </div>
              <div className="space-y-1">
                <SwitchRow name="description" label="Description" />
                <SwitchRow name="assignees" label="Assignees" />
                <SwitchRow name="priority" label="Priority" />
              </div>
            </div>
          </div>
        </div>

        {/* Stages Section */}
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
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
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <Button onClick={handleSaveAndExit} disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : isEditMode || pipelineId ? "Update & Exit" : "Save & Exit"}
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : isEditMode || pipelineId ? "Update" : "Save"}
          </Button>
          <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </Form>
  );
};

export default PipelineForm;

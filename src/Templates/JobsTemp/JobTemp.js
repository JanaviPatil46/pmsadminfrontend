import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import Priority from "../Priority/Priority";
import EditorShortcodes from "../Texteditor/EditorShortcodes";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import MultiSelectDropdown from "../MultiSelectDropdown";
import axios from "axios";
import debounce from "lodash.debounce";
import { FormPage, FormSection, FormRow, FormActions, FormGrid, ShortcodePopover, FormDatePicker, FormSelect } from "../../components/ui/form-layout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Plus } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Trash2, MessageSquarePlus, FileText, Calendar, Users, Globe, Pencil, Loader2 } from "lucide-react";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
dayjs.extend(customParseFormat);

const jobSchema = z.object({
  templatename: z.string().min(1, "Template name is required"),
  jobName: z.string().min(1, "Job name is required"),
  assignees: z.array(z.any()).optional(),
  priority: z.string().optional(),
  description: z.string().optional(),
  absoluteDate: z.boolean().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  startsin: z.string().optional(),
  startsInDuration: z.string().optional(),
  duein: z.string().optional(),
  dueinduration: z.string().optional(),
  clientFacingStatus: z.boolean().optional(),
  inputText: z.string().optional(),
  selectedJob: z.any().optional(),
  clientDescription: z.string().optional(),
});

const JobTemp = ({ charLimit = 4000 }) => {
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
  const [showDropdownDescription, setShowDropdownDescription] = useState(false);
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const [description, setDescription] = useState("");

  const form = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      templatename: "",
      jobName: "",
      assignees: [],
      priority: "",
      description: "",
      absoluteDate: false,
      startDate: "",
      dueDate: "",
      startsin: "",
      startsInDuration: "Days",
      duein: "",
      dueinduration: "Days",
      clientFacingStatus: false,
      inputText: "",
      selectedJob: null,
      clientDescription: "",
    },
  });
  const fetchClientFacingJobsData = async () => {
    try {
      const response = await fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setClientFacingJobs(data.clientFacingJobStatues);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optionstatus = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));

  // useEffect to fetch jobs when the component mounts
  useEffect(() => {
    fetchClientFacingJobsData();
  }, []);

  const handleJobChange = async (newValue) => {
    form.setValue("selectedJob", newValue, { shouldDirty: true });
    if (newValue && newValue.value) {
      try {
        const response = await fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${newValue.value}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        form.setValue("clientDescription", data.clientfacingjobstatuses.clientfacingdescription, { shouldDirty: true });
        setCharCount((data.clientfacingjobstatuses.clientfacingdescription || "").length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const descriptionFieldRef = useRef(null);
  const handleDescriptionAddShortcut = (shortcut) => {
    const prev = form.getValues("clientDescription") || "";
    const newText = prev.slice(0, cursorPosition) + `[${shortcut}]` + prev.slice(cursorPosition);
    if (newText.length <= charLimit) {
      form.setValue("clientDescription", newText, { shouldDirty: true });
      setCharCount(newText.length);
    }
    setTimeout(() => {
      if (descriptionFieldRef.current) {
        descriptionFieldRef.current.focus();
        descriptionFieldRef.current.setSelectionRange(cursorPosition + shortcut.length + 2, cursorPosition + shortcut.length + 2);
      }
    }, 0);
    setShowDropdownDescription(false);
  };

  const handleJobAddShortcut = (shortcut) => {
    const prev = form.getValues("inputText") || "";
    const newText = prev.slice(0, cursorPosition) + `[${shortcut}]` + prev.slice(cursorPosition);
    form.setValue("inputText", newText, { shouldDirty: true });
    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(cursorPosition + shortcut.length + 2, cursorPosition + shortcut.length + 2);
      }
    }, 0);
    setShowDropdownClientJob(false);
  };

  const handleEditorChange = (content) => {
    setDescription(content);
    form.setValue("description", content, { shouldDirty: true });
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };
  // handleDescriptionAddShortcut


  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);

  const handleAddShortcut = (shortcut) => {
    const prev = form.getValues("jobName") || "";
    const newText = prev.slice(0, cursorPosition) + `[${shortcut}]` + prev.slice(cursorPosition);
    form.setValue("jobName", newText, { shouldDirty: true });
    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(cursorPosition + shortcut.length + 2, cursorPosition + shortcut.length + 2);
      }
    }, 0);
    setShowDropdown(false);
  };
  const handleCreateJobTemplate = () => {
    setShowForm(true); // Show the form when button is clicked
  };

  const handleCloseJobTemp = () => {
    if (form.formState.isDirty) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmClose) return;
    }
    setShowForm(false);
    form.reset();
    setDescription("");
  };

  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
  }, [shortcuts]);
useEffect(() => {
  {
    const accountShortcuts = [
      { title: "Account Shortcodes", isBold: true },
      { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
      // { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
      { title: "Date Shortcodes", isBold: true },
      { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
      { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
      { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
      { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
      { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
      { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
      { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
      { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
      { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
      { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
      { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
      { title: "Last week", isBold: false, value: "LAST_WEEK" },
      { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
      { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
      { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
      { title: "Last_year", isBold: false, value: "LAST_YEAR" },
      { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
      { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
      { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
      { title: "Next week", isBold: false, value: "NEXT_WEEK" },
      { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
      { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
      { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
      { title: "Next year", isBold: false, value: "NEXT_YEAR" },
    ];
    setShortcuts(accountShortcuts);
  }
}, []);

  const handleCloseDropdown = () => {
    setShowDropdown(false);
    setAnchorEl(null);
  };

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
  //get all templateName Record
  const [JobTemplates, setJobTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
   
  useEffect(() => {
    fetchJobTemplatesData();
  }, []);
  const fetchJobTemplatesData = async () => {
    setLoading(true);
    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch job templates");
      }
      const data = await response.json();
      setJobTemplates(data.JobTemplates);
    } catch (error) {
      console.error("Error fetching job templates:", error);
    }
    finally {
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };

  const submitJob = async (values, exitAfterSave) => {
    const payload = values.absoluteDate
      ? {
          templatename: values.templatename,
          jobname: values.jobName,
          jobassignees: (values.assignees || []).map((o) => o.value),
          addshortcode: "",
          priority: values.priority,
          description: description,
          absolutedates: true,
          comments,
          showinclientportal: values.clientFacingStatus,
          jobnameforclient: values.inputText,
          clientfacingstatus: values.selectedJob?.value,
          startdate: values.startDate,
          enddate: values.dueDate,
          clientfacingDescription: values.clientDescription,
        }
      : {
          templatename: values.templatename,
          jobname: values.jobName,
          jobassignees: (values.assignees || []).map((o) => o.value),
          addshortcode: "",
          priority: values.priority,
          description: description,
          absolutedates: false,
          startsin: values.startsin,
          startsinduration: values.startsInDuration,
          duein: values.duein,
          dueinduration: values.dueinduration,
          comments,
          showinclientportal: values.clientFacingStatus,
          jobnameforclient: values.inputText,
          clientfacingstatus: values.selectedJob?.value,
          clientfacingDescription: values.clientDescription,
        };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      const response = await fetch(`${JOBS_API}/workflow/jobtemplate/jobtemplate`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(payload),
        redirect: "follow",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      toast.success("Job Template created successfully");
      if (exitAfterSave) {
        setShowForm(false);
        form.reset();
        setDescription("");
        setComments([]);
      }
      fetchJobTemplatesData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Job Template");
    }
  };

  const createjobtemp = form.handleSubmit((values) => submitJob(values, true));
  const createsavejobtemp = form.handleSubmit((values) => submitJob(values, false));

  //delete template
  const handleEdit = (_id) => {
    navigate("JobTemplateUpdate/" + _id);
  };
  //delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this Job template?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then(() => {
          toast.success("Item deleted successfully");
          setShowForm(false);
          fetchJobTemplatesData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };

  const [globalFilter, setGlobalFilter] = useState("");

  const jobColumns = useMemo(() => [
    {
      accessorKey: "templatename",
      header: "Name",
      cell: ({ getValue, row }) => (
        <button
          onClick={() => handleEdit(row.original._id)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
        >
          {getValue()}
        </button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => handleEdit(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], []);
   

  const [comments, setComments] = useState([]);

  const addCommentField = () => {
    setComments([...comments, ""]); // Add a new empty comment field
  };
  const handleCommentChange = (index, value) => {
    const updatedComments = [...comments];
    updatedComments[index] = value; // Update the specific comment field
    setComments(updatedComments);
  };
  const deleteCommentField = (index) => {
    const updatedComments = comments.filter((_, i) => i !== index); // Remove the comment at the specified index
    setComments(updatedComments);
  };


  
  const checkTemplateName = async (name) => {
    try {
      const res = await axios.get(`${JOBS_API}/workflow/jobtemplate/check-name`, { params: { name } });
      if (res.data.exists) {
        form.setError("templatename", { type: "manual", message: "Template name already exists" });
      } else {
        form.clearErrors("templatename");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedCheck = debounce((name) => {
    if (name.trim()) checkTemplateName(name);
    else form.clearErrors("templatename");
  }, 500);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "templatename") debouncedCheck(value.templatename);
    });
    return () => { subscription.unsubscribe(); debouncedCheck.cancel(); };
  }, [form.watch]);
  
     return (
      <div>
        {!showForm ? (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <Button size="sm" onClick={handleCreateJobTemplate}>
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Job
              </Button>
            </div>
            <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
            <DataTable
              columns={jobColumns}
              data={JobTemplates}
              loading={loading}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              enableRowSelection={false}
              getRowId={(row) => row._id}
              emptyMessage="No job templates found"
              emptyDescription="Create your first job template to get started"
              pageSize={30}
            />
          </div>
        ) : (
          <Form {...form}>
            <FormPage
              title="Create Job Template"
              subtitle="Configure your new job template"
              actions={
                <>
                  <Button type="button" variant="outline" onClick={handleCloseJobTemp}>Cancel</Button>
                  <Button type="button" variant="secondary" onClick={createsavejobtemp}>Save</Button>
                  <Button type="button" onClick={createjobtemp}>Save & Exit</Button>
                </>
              }
            >
              <FormGrid>
                {/* ===== LEFT COLUMN ===== */}
                <FormGrid.Main>
                  <FormSection title="General Information">
                    <FormField
                      control={form.control}
                      name="templatename"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Template Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="jobName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Name</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                placeholder="Job Name"
                                ref={textFieldRef}
                                onClick={(e) => setCursorPosition(e.target.selectionStart)}
                                {...field}
                                onChange={(e) => { setCursorPosition(e.target.selectionStart); field.onChange(e); }}
                              />
                              <ShortcodePopover shortcuts={filteredShortcuts} onSelect={handleAddShortcut} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormSection>

                  <FormSection title="Assignment">
                    <FormField
                      control={form.control}
                      name="assignees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Assignees</FormLabel>
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
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <FormControl>
                            <Priority
                              onPriorityChange={(val) => field.onChange(val)}
                              selectedPriority={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormSection>

                  <FormSection title="Description">
                    <EditorShortcodes onChange={handleEditorChange} content={description} />
                  </FormSection>

                  <FormSection title="Start and Due Date">
                    <FormField
                      control={form.control}
                      name="absoluteDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">Use Absolute Dates</Label>
                              <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("absoluteDate") && (
                      <FormRow cols={2}>
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <FormDatePicker {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due Date</FormLabel>
                              <FormControl>
                                <FormDatePicker {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </FormRow>
                    )}

                    {!form.watch("absoluteDate") && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Label className="w-16 shrink-0 text-sm">Start In</Label>
                          <FormField
                            control={form.control}
                            name="startsin"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl><Input className="flex-1" {...field} /></FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="startsInDuration"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-28"><SelectValue placeholder="Unit" /></SelectTrigger>
                                    <SelectContent>
                                      {dayOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Label className="w-16 shrink-0 text-sm">Due In</Label>
                          <FormField
                            control={form.control}
                            name="duein"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl><Input className="flex-1" {...field} /></FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dueinduration"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-28"><SelectValue placeholder="Unit" /></SelectTrigger>
                                    <SelectContent>
                                      {dayOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </FormSection>
                </FormGrid.Main>

                {/* ===== RIGHT COLUMN ===== */}
                <FormGrid.Sidebar>
                  <FormSection title="Client-Facing Status">
                    <FormField
                      control={form.control}
                      name="clientFacingStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">Show in Client Portal</Label>
                              <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("clientFacingStatus") && (
                      <div className="space-y-4 pt-2">
                        <FormField
                          control={form.control}
                          name="inputText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Name for Client</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Input
                                    placeholder="Job name for client"
                                    ref={textFieldRef}
                                    onClick={(e) => setCursorPosition(e.target.selectionStart)}
                                    {...field}
                                    onChange={(e) => { setCursorPosition(e.target.selectionStart); field.onChange(e); }}
                                  />
                                  <ShortcodePopover shortcuts={filteredShortcuts} onSelect={handleJobAddShortcut} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="selectedJob"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                                <FormSelect
                                  value={field.value?.value || ""}
                                  onChange={(e) => {
                                    const selected = optionstatus.find((s) => s.value === e.target.value) || null;
                                    handleJobChange(selected);
                                  }}
                                >
                                  <option value="">Select Client Facing Job</option>
                                  {optionstatus.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </FormSelect>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="clientDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Textarea
                                    ref={descriptionFieldRef}
                                    placeholder="Description"
                                    rows={4}
                                    onClick={(e) => setCursorPosition(e.target.selectionStart)}
                                    {...field}
                                    onChange={(e) => {
                                      if (e.target.value.length <= charLimit) {
                                        setCharCount(e.target.value.length);
                                        field.onChange(e);
                                      }
                                    }}
                                  />
                                  <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                                    {charCount}/{charLimit}
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <ShortcodePopover shortcuts={filteredShortcuts} onSelect={handleDescriptionAddShortcut} />
                      </div>
                    )}
                  </FormSection>

                  <FormSection title="Comments">
                    <div className="space-y-3">
                      {comments.map((comment, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Textarea
                            value={comment}
                            onChange={(e) => handleCommentChange(index, e.target.value)}
                            placeholder={`Comment ${index + 1}`}
                            rows={2}
                            className="flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => deleteCommentField(index)}
                            className="mt-1 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={addCommentField} className="w-full">
                        <MessageSquarePlus className="h-3.5 w-3.5" />
                        Add Comment
                      </Button>
                    </div>
                  </FormSection>
                </FormGrid.Sidebar>
              </FormGrid>
            </FormPage>
          </Form>
        )}
      </div>
  );
};

export default JobTemp;

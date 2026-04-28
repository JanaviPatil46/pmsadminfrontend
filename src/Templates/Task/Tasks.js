import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import Editor from "../Texteditor/Editor";
import Priority from "../Priority/Priority";
import Status from "../Status/Status";
import { toast } from "react-toastify";
import axios from "axios";
import debounce from "lodash.debounce";
import MultiSelectDropdown from "../MultiSelectDropdown";
import TagsMultiSelectDropDown from "../TagsMultiSelectDropDown";
import { FormPage, FormSection, FormRow, FormGrid, FormSwitchRow, FormSubtaskItem, FormSubtaskAdd } from "../../components/ui/form-layout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { FileText, Calendar, ListChecks, Pencil, Loader2, Plus, Trash2 } from "lucide-react";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";

const taskSchema = z.object({
  templatename: z.string().min(1, "Template name is required"),
  status: z.string().optional(),
  assignees: z.array(z.any()).optional(),
  priority: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.any()).optional(),
  absoluteDate: z.boolean().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  startsin: z.string().optional(),
  startsInDuration: z.string().optional(),
  duein: z.string().optional(),
  dueinduration: z.string().optional(),
  SubtaskSwitch: z.boolean().optional(),
});

const Tasks = () => {
  const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState([]);
  const [checkedSubtasks, setCheckedSubtasks] = useState([]);

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      templatename: "",
      status: "No status",
      assignees: [],
      priority: "Medium",
      description: "",
      tags: [],
      absoluteDate: false,
      startDate: "",
      dueDate: "",
      startsin: "",
      startsInDuration: "Days",
      duein: "",
      dueinduration: "Days",
      SubtaskSwitch: false,
    },
  });

  const handleCheckboxChange = (id) => {
    setCheckedSubtasks((prevChecked) =>
      prevChecked.includes(id)
        ? prevChecked.filter((checkedId) => checkedId !== id)
        : [...prevChecked, id]
    );
  };

  const [subtasks, setSubtasks] = useState([{ id: "1", text: "" }]);

  const handleAddSubtask = () => {
    const newId = String(subtasks.length + 1);
    setSubtasks([...subtasks, { id: newId, text: "" }]);
  };
  const handleInputChange = (id, value) => {
    setSubtasks((prevSubtasks) =>
      prevSubtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, text: value } : subtask
      )
    );
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const handleSubtaskSwitch = (checked) => {
    if (checked && subtasks.length === 0) {
      setSubtasks([{ id: "1", text: "", checked: false }]);
    }
  };
  const handleDragEnd = (result) => {
    // Ensure a valid drop location
    if (!result.destination) return;
    // Reorder subtasks based on the drag-and-drop result
    const newSubtasks = Array.from(subtasks);
    const [reorderedItem] = newSubtasks.splice(result.source.index, 1);
    newSubtasks.splice(result.destination.index, 0, reorderedItem);
    // Update the state with the new order of subtasks
    setSubtasks(newSubtasks);
  };
  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];

  const handleCreateTask = () => {
    setShowForm(true);
  };

  const handleEditorChange = (content) => {
    form.setValue("description", content);
  };

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

  //Tag FetchData ================
  const [tags, setTags] = useState([]);
  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [TaskTemplates, setTaskTemplates] = useState([]);
  useEffect(() => {
    fetchTaskData();
  }, []);
  const [loading, setLoading] = useState(true);
  const fetchTaskData = async () => {
    setLoading(true); // Start loader

    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch task templates");
      }
      const data = await response.json();
      setTaskTemplates(data.TaskTemplates);
    } catch (error) {
      console.error("Error fetching task templates:", error);
    } finally {
      // Wait for the fetch and the 3-second timer to complete
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };
  const submitTask = async (values, exitAfterSave) => {
    const subtaskData = subtasks.map(({ id, text }) => ({
      id,
      text,
      checked: checkedSubtasks.includes(id),
    }));

    const payload = values.absoluteDate
      ? {
          templatename: values.templatename,
          status: values.status,
          taskassignees: (values.assignees || []).map((o) => o.value),
          tasktags: (values.tags || []).map((o) => o.value),
          priority: values.priority,
          description: values.description,
          absolutedates: true,
          startdate: values.startDate,
          enddate: values.dueDate,
          subtasks: subtaskData,
          issubtaskschecked: values.SubtaskSwitch,
        }
      : {
          templatename: values.templatename,
          status: values.status,
          taskassignees: (values.assignees || []).map((o) => o.value),
          tasktags: (values.tags || []).map((o) => o.value),
          priority: values.priority,
          description: values.description,
          absolutedates: false,
          startsin: values.startsin,
          startsinduration: values.startsInDuration,
          duein: values.duein,
          dueinduration: values.dueinduration,
          subtasks: subtaskData,
          issubtaskschecked: values.SubtaskSwitch,
        };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
      const response = await fetch(`${TASK_API}/workflow/tasks/tasktemplate/`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(payload),
        redirect: "follow",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      toast.success("Task Template created successfully");
      if (exitAfterSave) {
        setShowForm(false);
        form.reset();
        setSubtasks([]);
        setCheckedSubtasks([]);
      }
      fetchTaskData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Task Template");
    }
  };

  const createTaskTemp = form.handleSubmit((values) => submitTask(values, true));
  const createSaveTaskTemp = form.handleSubmit((values) => submitTask(values, false));

  const handleEdit = (_id) => {
    navigate("taskTempUpdate/" + _id);
  };
  //delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task template?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.text();
        })
        .then((result) => {
          toast.success("Item deleted successfully");
          fetchTaskData();
          // setshowOrganizerTemplateForm(false):
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };
  const [globalFilter, setGlobalFilter] = useState("");

  const taskColumns = useMemo(() => [
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
  const handleTaskCancel = () => {
    if (form.formState.isDirty) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmClose) return;
    }
    setShowForm(false);
    form.reset();
  };

  // Debounced async name check — sets RHF error directly
  const checkTemplateName = async (name) => {
    try {
      const res = await axios.get(`${TASK_API}/workflow/tasks/check-name`, { params: { name } });
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
              <Button size="sm" onClick={handleCreateTask}>
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Task
              </Button>
            </div>

            <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
            <DataTable
              columns={taskColumns}
              data={TaskTemplates}
              loading={loading}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              enableRowSelection={false}
              getRowId={(row) => row._id}
              emptyMessage="No task templates found"
              emptyDescription="Create your first task template to get started"
              pageSize={30}
            />
          </div>
        ) : (
          <Form {...form}>
            <FormPage
              title="Create Task Template"
              subtitle="Configure your task template settings"
              actions={
                <>
                  <Button type="button" variant="outline" onClick={handleTaskCancel}>Cancel</Button>
                  <Button type="button" variant="secondary" onClick={createSaveTaskTemp}>Save</Button>
                  <Button type="button" onClick={createTaskTemp}>Save & Exit</Button>
                </>
              }
            >
              <FormGrid sidebarWidth="sm">
                {/* ===== LEFT COLUMN (70%): Main form ===== */}
                <FormGrid.Main>

                  {/* ── General ── */}
                  <FormSection title="General" icon={<FileText className="h-4 w-4" />}>
                    <FormRow cols={2}>
                      <FormField
                        control={form.control}
                        name="templatename"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Template Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter template name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <Status
                                onStatusChange={(val) => field.onChange(val)}
                                selectedStatus={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </FormRow>

                    <FormRow cols={2}>
                      <FormField
                        control={form.control}
                        name="assignees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assignees</FormLabel>
                            <FormControl>
                              <MultiSelectDropdown
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder="Select assignees"
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
                    </FormRow>
                  </FormSection>

                  {/* ── Description ── */}
                  <FormSection title="Description">
                    <Editor onChange={handleEditorChange} content={form.watch("description")} />
                  </FormSection>

                  {/* ── Tags ── */}
                  <FormSection title="Tags">
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <TagsMultiSelectDropDown
                              value={field.value || []}
                              onChange={field.onChange}
                              placeholder="Select or search tags"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormSection>

                  {/* ── Dates ── */}
                  <FormSection title="Dates" icon={<Calendar className="h-4 w-4" />}>
                    <FormField
                      control={form.control}
                      name="absoluteDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FormSwitchRow
                              label="Use absolute dates"
                              description="Set fixed calendar dates instead of relative offsets"
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("absoluteDate") ? (
                      <FormRow cols={2}>
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <input
                                  type="date"
                                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
                                  {...field}
                                />
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
                                <input
                                  type="date"
                                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </FormRow>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-[80px_1fr_140px] items-end gap-3">
                          <span className="text-sm font-medium text-foreground pb-2">Start in</span>
                          <FormField
                            control={form.control}
                            name="startsin"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="0" type="number" min="0" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="startsInDuration"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    {...field}
                                  >
                                    <option value="">Unit</option>
                                    {dayOptions.map((opt) => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-[80px_1fr_140px] items-end gap-3">
                          <span className="text-sm font-medium text-foreground pb-2">Due in</span>
                          <FormField
                            control={form.control}
                            name="duein"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="0" type="number" min="0" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dueinduration"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    {...field}
                                  >
                                    <option value="">Unit</option>
                                    {dayOptions.map((opt) => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </FormSection>

                </FormGrid.Main>

                {/* ===== RIGHT COLUMN (30%): Controls panel ===== */}
                <FormGrid.Sidebar>
                  <FormSection
                    title="Subtasks"
                    icon={<ListChecks className="h-4 w-4" />}
                    description="Add checklist items to this task template"
                  >
                    <FormField
                      control={form.control}
                      name="SubtaskSwitch"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FormSwitchRow
                              label="Enable subtasks"
                              description="Show a subtask checklist on every task created from this template"
                              checked={!!field.value}
                              onCheckedChange={(val) => { field.onChange(val); handleSubtaskSwitch(val); }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("SubtaskSwitch") && (
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="subtaskList">
                          {(provided) => (
                            <div
                              className="space-y-2 mt-1"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {subtasks.map((subtask, index) => (
                                <Draggable key={subtask.id} draggableId={subtask.id} index={index}>
                                  {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps}>
                                      <FormSubtaskItem
                                        text={subtask.text}
                                        checked={checkedSubtasks.includes(subtask.id)}
                                        onTextChange={(val) => handleInputChange(subtask.id, val)}
                                        onCheckedChange={() => handleCheckboxChange(subtask.id)}
                                        onDelete={() => handleDeleteSubtask(subtask.id)}
                                        dragHandleProps={provided.dragHandleProps}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              <FormSubtaskAdd onClick={handleAddSubtask} />
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    )}
                  </FormSection>
                </FormGrid.Sidebar>
              </FormGrid>
            </FormPage>
          </Form>
        )}
      </div>
  );
};

export default Tasks;

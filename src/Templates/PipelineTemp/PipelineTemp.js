import React, { useState, useEffect, useMemo } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPenLine } from "react-icons/lu";
import { FiPlusCircle } from "react-icons/fi";
import { RxDragHandleDots2 } from "react-icons/rx";
import { toast } from "react-toastify";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import AddAutomationDrawer from "./AddAutomationDrawer";
import EditAutomationDrawer from "./EditAutomationDrawer";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import TagAutomationComponent from "../TagAutomationComponent";
import TagsMultiSelectDropDown from "../TagsMultiSelectDropDown";
import { GoDotFill } from "react-icons/go";
import debounce from "lodash.debounce";
const PipelineTemp = () => {
  const LOGIN_API = process.env.REACT_APP_LOGIN_URL;
  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const SORTJOBS_API = process.env.REACT_APP_SORTJOBS_URL;
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [pipelineName, setPipelineName] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);
  const handleCreatePipeline = () => {
    setShowForm(true); // Show the form when button is clicked
  };

  // sort jobs
  const [sortbyjobs, setSortbyJobs] = useState([]);
  const [selectedSortByJob, setSelectedSortByJob] = useState("");

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
  const [clientFacing_status, setClientFacing_status]= useState(false);
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

  const [stages, setStages] = useState([]);

  // const handleAddStage = () => {
  // const newStage = {
  //   name: "",
  //   conditions: [],
  //   automations: [],
  //   autoMove: false,
  //   showDropdown: false,
  //   activeAction: null,
  // };
  //   setStages([...stages, newStage]);
  // };
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
  };

  //Automation code
  const [anchorEl, setAnchorEl] = useState(null);

  // const handleClick = (event, index) => {
  //   setAnchorEl(event.currentTarget);
  //   SetStageSelected(index);  // Save the selected stage index
  //   console.log(index)
  // };
  const [ehitAnchorEl, setEditAnchorEl] = useState(null);
  const [isConditionsEditFormOpen, setIsConditionsEditFormOpen] =
    useState(false);
  const [addNewAutomation, setAddNewAutomation] = useState(null);
  const handleAddAutomationClick = (event) => {
    setAddNewAutomation(event.currentTarget);
  };
  const handleEditClick = (event, index) => {
    setEditAnchorEl(event.currentTarget);
    SetStageSelected(index); // Save the selected stage index
    console.log(index);
  };
  const handleEditConditions = (index) => {
    const currentAutomation = selectedAutomationData[index];
    console.log("stageindex", currentAutomation);
    setSelectedAutomationIndex(index);
    setStageAutomationTags(currentAutomation?.tags || []); // Use existing tags or default to an empty array
    console.log(currentAutomation.tags);
    setIsConditionsEditFormOpen(true); // Open the drawer
  };
  const handleDeleteAutomation = (index) => {
    const updatedAutomations = selectedAutomationData.filter(
      (_, i) => i !== index
    );
    setSelectedAutomationData(updatedAutomations);
  };
  const handleEditGoBack = () => {
    setIsConditionsEditFormOpen(false);
  };



  const handleTagSelectionChange = (index, field, selectedValues) => {
    setSelectedAutomationData((prevData) =>
      prevData.map((automation, i) =>
        i === index
          ? {
              ...automation,
              [field]: tagsoptions.filter((tag) =>
                selectedValues.includes(tag.value)
              ),
            }
          : automation
      )
    );
  };

  const handleTagChange = (index, type, event) => {
    const { value } = event.target; // Array of selected tag IDs

    setSelectedAutomationData((prev) => {
      const updatedAutomations = [...prev];

      // Get the correct tag options list
      const tagOptions = tagsoptions;

      // Map selected tag IDs to tag objects with _id, tagName, and tagColour
      const selectedTags = value
        .map((tagId) => {
          const tag = tagOptions.find((t) => t.value === tagId);
          return tag
            ? { _id: tag.value, tagName: tag.label, tagColour: tag.colour }
            : null;
        })
        .filter(Boolean); // Remove null values

      // Prevent duplicate selections
      const uniqueTags = selectedTags.filter(
        (tag, idx, self) => self.findIndex((t) => t._id === tag._id) === idx
      );

      // Ensure the tag is removed from the opposite category
      if (type === "addTags") {
        updatedAutomations[index].removeTags = updatedAutomations[
          index
        ].removeTags.filter(
          (tag) => !uniqueTags.some((t) => t._id === tag._id)
        );
      } else if (type === "removeTags") {
        updatedAutomations[index].addTags = updatedAutomations[
          index
        ].addTags.filter((tag) => !uniqueTags.some((t) => t._id === tag._id));
      }

      updatedAutomations[index] = {
        ...updatedAutomations[index],
        [type]: uniqueTags,
      };

      return updatedAutomations;
    });
  };

   const handleAssigneeChange = (index, type, event) => {
    const { value } = event.target; // Array of selected tag IDs

    setSelectedAutomationData((prev) => {
      const updatedAutomations = [...prev];

      // Get the correct tag options list
      const assigneeoptions = assigneeOptions;

      // Map selected tag IDs to tag objects with _id, tagName, and tagColour
      const selectedTags = value
        .map((assId) => {
          const ass = assigneeoptions.find((t) => t.value === assId);
          return ass
            ? { _id: ass.value, username: ass.label,  }
            : null;
        })
        .filter(Boolean); // Remove null values

      // Prevent duplicate selections
      const uniqueTags = selectedTags.filter(
        (ass, idx, self) => self.findIndex((t) => t._id === ass._id) === idx
      );

      // Ensure the tag is removed from the opposite category
      if (type === "addAssignees") {
        updatedAutomations[index].removeAssignees = updatedAutomations[
          index
        ].removeAssignees.filter(
          (ass) => !uniqueTags.some((t) => t._id === ass._id)
        );
      } else if (type === "removeAssignees") {
        updatedAutomations[index].addAssignees = updatedAutomations[
          index
        ].addAssignees.filter((tag) => !uniqueTags.some((t) => t._id === tag._id));
      }

      updatedAutomations[index] = {
        ...updatedAutomations[index],
        [type]: uniqueTags,
      };

      return updatedAutomations;
    });
  };
  const handleMenuItemSelect = (type) => {
    let newAutomation = {};

    switch (type) {
      case "Create Task":
        newAutomation = { type: "Create Task", template: null, tags: [] };
        break;
      case "Send message":
        newAutomation = { type: "Send message", template: null, tags: [] };
        break;
      case "Send Email":
        newAutomation = { type: "Send Email", template: null, tags: [] };
        break;
      case "Send Invoice":
        newAutomation = { type: "Send Invoice", template: null, tags: [] };
        break;
      case "Send Proposal/Els":
        newAutomation = { type: "Send Proposal/Els", template: null, tags: [] };
        break;
      case "Create Organizer":
        newAutomation = { type: "Create Organizer", template: null, tags: [] };
        break;
      case "Apply folder template":
        newAutomation = {
          type: "Apply folder template",
          template: null,
          tags: [],
        };
        break;
      // Update account tags
      case "Update account tags":
        // Initialize addTags and removeTags as separate empty arrays
        newAutomation = {
          type: "Update account tags",
          addTags: [], // Independent array for addTags
          removeTags: [], // Independent array for removeTags
          tags: [],
        };
        break;
        case "Update job assignees":
        // Initialize addTags and removeTags as separate empty arrays
        newAutomation = {
          type: "Update job assignees",
          addAssignees: [], // Independent array for addTags
          removeAssignees: [], // Independent array for removeTags
          tags: [],
        };
        break;
      // Update client-facing job status
      case "Update client-facing job status":
        // Initialize addTags and removeTags as separate empty arrays
        newAutomation = {
          type: "Update client-facing job status",
          visibiltyforClient: true, // Independent array for addTags
          selecteStatus: null, // Independent array for removeTags
          statusDescription: "",
        };
        break;
      default:
        break;
    }

    setSelectedAutomationData([...selectedAutomationData, newAutomation]);

    setEditAnchorEl(null); // Close the menu

    setIsEditDrawerOpen(true); // Open the edit drawer
  };
  const handleEditClose = () => {
    setEditAnchorEl(null);
  };
  const handleAddNewClose = () => {
    setAddNewAutomation(null);
  };

  const handleAutomationOptionClick = (actionType) => {
    SetAutomationSelect(actionType); // Perform the action based on the selected option
    handleAddNewClose(); // Close the dropdown
  };
  const handleEditTemplateChange = (index, newValue) => {
    const updatedData = [...selectedAutomationData];
    updatedData[index].template = newValue;
    setSelectedAutomationData(updatedData);
  };

  const[ editClientDescription, setEditClientDescripation]=useState("")
  const handleEditClientChange = async (index, newValue) => {
  const updatedData = [...selectedAutomationData];
  
  // Update the selected status immediately
  updatedData[index].selectedClientStatus = newValue;
  
  // Clear the existing description while we fetch the new one
  updatedData[index].statusDescription = "";
  
  // Update the state immediately (optional, but provides better UX)
  setSelectedAutomationData(updatedData);

  if (newValue && newValue.value) {
    const clientjobId = newValue.value;
    try {
      const response = await fetch(
        `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${clientjobId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Create a new copy of the data to update
      const updatedDataWithDescription = [...selectedAutomationData];
      
      // Update both the status and description
      updatedDataWithDescription[index].selectedClientStatus = newValue;
      updatedDataWithDescription[index].statusDescription = 
        data.clientfacingjobstatuses.clientfacingdescription || "";
      
      // Update the state
      setSelectedAutomationData(updatedDataWithDescription);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally set an error state or default description
      const updatedDataWithError = [...selectedAutomationData];
      updatedDataWithError[index].statusDescription = "Error loading description";
      setSelectedAutomationData(updatedDataWithError);
    }
  }
};

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedAutomationData, setSelectedAutomationData] = useState([]);
  const [editingStageIndex, setEditingStageIndex] = useState(null);
  const handleClick = (event, index, actionType) => {
    setAnchorEl(event.currentTarget); // Opens the menu
    SetStageSelected(index); // Stores the selected stage index

    if (actionType === "edit") {
      const automations = stages[index]?.automations || [];
      if (automations.length > 0) {
        // Only proceed if automations exist
        setSelectedAutomationData(automations); // Populate drawer with automations
        setIsEditDrawerOpen(true); // Open the edit automation drawer
        setAnchorEl(null);
        setEditingStageIndex(index);
      } else {
        console.log("No automations available to edit for this stage.");
      }
    }
    console.log("Stage Index:", index);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditCheckboxChange = (tag) => {
    setStageAutomationTags((prevTags) => {
      const isTagSelected = prevTags.some(
        (existingTag) => existingTag._id === tag._id
      );

      if (isTagSelected) {
        return prevTags.filter((existingTag) => existingTag._id !== tag._id);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const [updateDrawer, setupdateDrawer] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [automationSelect, SetAutomationSelect] = useState();
  const [stageSelected, SetStageSelected] = useState();
  const handleDrawerOpen = (option, index) => {
    setIsDrawerOpen(true);
    SetAutomationSelect(option);
    SetStageSelected(index);
    console.log(index);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const handleUpdateDrawer = () => {
    setupdateDrawer(true);
  };
  const handleUpdateDrawerClose = () => {
    setupdateDrawer(false);
  };
  const handleAddAutomation = (stageSelected, option) => {
    // Handle option action here
    console.log("Adding automation to stage index:", stageSelected);
    console.log("automation  clicked!");

    console.log("Added automation to stage", stageSelected, option);
    handleDrawerOpen(option, stageSelected);
    handleClose();
  };

  const [addEmailTemplates, setAddEmailTemplates] = useState([]);
  const [addInvoiceTemplates, setAddInvoiceTemplates] = useState([]);
  const [addProposalsandElsTeplates, setAddProposalsandElsTeplates] = useState(
    []
  );
  const [addOrganizerTemplates, setAddOrganizerTemplates] = useState([]);
  const [addTaskTemplates, setAddTaskTemplates] = useState([]);
  const [addChatTemplates, setAddChatTemplates] = useState([]);
  useEffect(() => {
    fetchEmailTemplates();
    fectInvoiceTemplates();
    fectProposalandElsTemp();
    fetchOrganizerTemplates();
    fetchTaskTemplates();
    fetchChatTemplates();
  }, []);
  const fetchChatTemplates = async () => {
    try {
      const url = `${CHAT_API}/workflow/chats/chattemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddChatTemplates(data.chatTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const chatTemplateOptions = addChatTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  const fetchTaskTemplates = async () => {
    try {
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      const response = await fetch(url);
      const data = await response.json();
      setAddTaskTemplates(data.TaskTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const taskTemplateOptions = addTaskTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  const fetchEmailTemplates = async () => {
    try {
      const url = `${EMAIL_API}/workflow/emailtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddEmailTemplates(data.emailTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const emailTemplateOptions = addEmailTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  const fectInvoiceTemplates = async () => {
    try {
      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddInvoiceTemplates(data.invoiceTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const invoiceTemplateOptions = addInvoiceTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const fectProposalandElsTemp = async () => {
    try {
      const url = `https://www.snptaxes.com/api/proposals`;
      const response = await fetch(url);
      const data = await response.json();
      setAddProposalsandElsTeplates(data.proposallist);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const proposalElsOptions = addProposalsandElsTeplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const fetchOrganizerTemplates = async () => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddOrganizerTemplates(data.OrganizerTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const organizerOptions = addOrganizerTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  // folder templates
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  const [folderTemplates, setFolderTemplates] = useState([]);

  useEffect(() => {
    fetchFolderData();
  }, []);

  const fetchFolderData = async () => {
    try {
      // const url = `${API_KEY}/foldertemp/folder`;
       const url = `https://www.snptaxes.com/api/foldertemp/templatelist`;
      const response = await fetch(url);
      const data = await response.json();
      setFolderTemplates(data.folderTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const optionfolder = folderTemplates.map((folderTemplates) => ({
    value: folderTemplates._id,
    label: folderTemplates.templatename,
  }));
  const [selectedtemp, setselectedTemp] = useState();
  const handletemp = (selectedOptions, automationSelect) => {
    setselectedTemp(selectedOptions);
    console.log(selectedOptions);
    if (automationSelect === "Send message") {
      fetchTaskTempbyid(selectedOptions.value);
    }
  };

  //get id wise template Record
  const fetchTaskTempbyid = async (_id) => {
    try {
      const url = `${CHAT_API}/Workflow/chats/chattemplate/chattemplateList/${_id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("chattemp", data);

      // setTempValues(data.taskTemplate);
      setReminderChecked(data.chatTemplate.sendreminderstoclient || false);
      setNoOfReminder(data.chatTemplate.numberofreminders || "1");
      setDaysuntilNextReminder(data.chatTemplate.daysuntilnextreminder || "3");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // condition tags
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [isConditionsFormOpen, setIsConditionsFormOpen] = useState(false);
  const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedTags, setTempSelectedTags] = useState([]);

  const [stageAutomationTags, setStageAutomationTags] = useState([]);
  const handleAddConditions = () => {
    setIsConditionsFormOpen(!isConditionsFormOpen);
  };

  const handleGoBack = () => {
    setIsConditionsFormOpen(false);
  };

  const handleCheckboxChange = (tag) => {
    const updatedSelectedTags = tempSelectedTags.includes(tag)
      ? tempSelectedTags.filter((t) => t._id !== tag._id)
      : [...tempSelectedTags, tag];
    setTempSelectedTags(updatedSelectedTags);
    setIsAnyCheckboxChecked(updatedSelectedTags.length > 0);
  };


  const handleAddTags = () => {
    setSelectedTags([
      ...selectedTags,
      ...tempSelectedTags.filter(
        (tag) => !selectedTags.some((t) => t._id === tag._id)
      ),
    ]);
    setIsConditionsFormOpen(false);
    setTempSelectedTags([]);
  };
  const [tags, setTags] = useState([]);
  console.log(selectedTags);
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("tags dtata", data.tags);
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateWidth = (label) => Math.min(label.length * 8, 200);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredTags = tags.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedTagElements = selectedTags.map((tag) => (
    <span
      key={tag._id}
      className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white mr-1 mb-1"
      style={{ backgroundColor: tag.tagColour }}
    >
      {tag.tagName}
    </span>
  ));

  const [addTags, setAddTags] = useState([]); // Separate state for Add Tags
  const [removeTags, setRemoveTags] = useState([]); // Separate state for Remove Tags

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


  const [assignee, setAssignee] = useState([]);
const [selectedAssignees, setSelectedAssignees] = useState([]);
const [assigneesToRemove, setAssigneesToRemove] = useState([]);
useEffect(() => {
  const fetchAssignees = async () => {
    try {
      const response = await axios.get(`${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`);
      console.log("assigness data",response.data)
      setAssignee(response.data);
    } catch (error) {
      console.error("Error fetching assignees:", error);
    }
  };
  
  fetchAssignees();
}, []);
const assigneeOptions = assignee.map((ass)=>({
   value: ass._id,
    label: ass.username,
}))



  const handleAddTagChange = (event) => {
    const selectedValues = event.target.value;
    setAddTags(selectedValues);

    // Send selectedValues array to your backend
    console.log("Selected Values:", selectedValues);
  };

 
  const handleRemoveTagChange = (event) => {
    const selectedValues = event.target.value;
    setRemoveTags(selectedValues);

    // Send selectedValues array to your backend
    console.log("Selected Values:", selectedValues);
  };


  const filteredAddTagsOptions = tagsoptions.filter(
    (tag) => !removeTags.includes(tag.value)
  );

  const filteredRemoveTagsOptions = tagsoptions.filter(
    (tag) => !addTags.includes(tag.value)
  );
  const [selectedAddTags, setSelectedAddTags] = useState([]);
  const [reminderChecked, setReminderChecked] = useState(false);
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
  const [noOfReminder, setNoOfReminder] = useState(1);
  const handleReminderChange = (checked) => {
    setReminderChecked(checked);
  };
  const statusOptions = [
    { value: true, label: "Show status" },
    { value: false, label: "Hide status" },
  ];
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  const [status, setStatus] = useState(
    statusOptions.find((option) => option.value === true)
  );
  const handleStatusChange = (event, newValue) => {
  setStatus(newValue);
};
  const [clientDescription, setClientDescription] = useState("");
  const maxDescriptionLength = 150;
  const [selectedClientStatus, setSelectedClientStatus] = useState(null);
  console.log("upadte clientfacing status", status.value);
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const fetchClientFacingJobsData = async () => {
    try {
      const response = await fetch(
        `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setClientFacingJobs(data.clientFacingJobStatues); // Ensure data is set correctly
      console.log(data);
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
  const handleClientStatusChange = async (event, newValue) => {
    setSelectedClientStatus(newValue);

    if (newValue && newValue.value) {
      const clientjobId = newValue.value;
      try {
        const response = await fetch(
          `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${clientjobId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log(data);
        setClientDescription(
          data.clientfacingjobstatuses.clientfacingdescription
        );
        console.log(data.clientfacingjobstatuses.clientfacingdescription);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleClientDescriptionChange = (e) => {
    if (e.target.value.length <= maxDescriptionLength) {
      setClientDescription(e.target.value);
    }
  };
  const renderActionContent = (automationSelect, index) => {
    const conditionsPanel = isConditionsFormOpen && (
      <div className="fixed inset-0 z-[60] flex">
        <div className="fixed inset-0 bg-black/40" onClick={handleGoBack} />
        <div className="ml-auto relative z-50 w-full max-w-[550px] bg-white h-full overflow-y-auto shadow-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <button type="button" onClick={handleGoBack} className="rounded p-1 text-blue-600 hover:bg-blue-50">
              <IoMdArrowRoundBack className="h-5 w-5" />
            </button>
            <h3 className="text-base font-semibold">Add conditions</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Apply automation only for accounts with these tags</p>
          <div className="relative">
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded border border-gray-200 pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mt-3 h-[68vh] overflow-y-auto space-y-1">
            {filteredTags.map((tag) => (
              <div key={tag._id} className="flex items-center gap-3 border-b border-gray-200 pb-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={tempSelectedTags.includes(tag)}
                  onChange={() => handleCheckboxChange(tag)}
                />
                <span className="rounded-full px-3 py-0.5 text-xs text-white font-medium" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              disabled={!isAnyCheckboxChecked}
              onClick={handleAddTags}
              className="rounded-full bg-[var(--color-save-btn)] px-5 py-1.5 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors disabled:opacity-50"
            >
              Add
            </button>
            <button
              type="button"
              onClick={handleGoBack}
              className="rounded-full border border-[var(--color-border-cancel-btn)] px-5 py-1.5 text-sm text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white hover:border-transparent transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );

    const saveBtn = (
      <button
        type="button"
        onClick={handleSaveAutomation(stageSelected)}
        className="mt-3 rounded-full bg-[var(--color-save-btn)] px-5 py-1.5 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors"
      >
        Save Automation
      </button>
    );

    const getOptions = (type) => {
      if (type === "Create Task") return taskTemplateOptions;
      if (type === "Send message") return chatTemplateOptions;
      if (type === "Send Invoice") return invoiceTemplateOptions;
      if (type === "Send Proposal/Els") return proposalElsOptions;
      if (type === "Send Email") return emailTemplateOptions;
      if (type === "Apply folder template") return optionfolder;
      if (type === "Create Organizer") return organizerOptions;
      return [];
    };

    switch (automationSelect) {
      case "Create Task":
      case "Send message":
      case "Send Invoice":
      case "Send Proposal/Els":
      case "Send Email":
      case "Apply folder template":
      case "Create Organizer":
        return (
          <>
            <div className="rounded-lg border-2 border-gray-200 p-3 space-y-2">
              <p className="text-sm font-medium">1. {automationSelect || "No Type"}</p>
              <p className="text-xs text-gray-500">Select template</p>
              <select
                className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={selectedtemp?.value || ""}
                onChange={(e) => {
                  const opt = getOptions(automationSelect).find((o) => o.value === e.target.value);
                  handletemp(opt, automationSelect);
                }}
              >
                <option value="">Select Template</option>
                {getOptions(automationSelect).map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {automationSelect === "Send message" && (
                <div className="flex items-center justify-between mt-2">
                  <button type="button" onClick={handleAddConditions} className="text-sm text-blue-600 hover:underline">Add Conditions</button>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="relative inline-flex items-center">
                      <input type="checkbox" className="sr-only peer" checked={reminderChecked} onChange={(e) => handleReminderChange(e.target.checked)} />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </span>
                    <span className="text-sm font-medium">Reminders</span>
                  </label>
                </div>
              )}

              {automationSelect !== "Send message" && (
                <button type="button" onClick={handleAddConditions} className="text-sm text-blue-600 hover:underline">Add Conditions</button>
              )}

              {automationSelect === "Send message" && reminderChecked && (
                <div className="flex gap-4 mt-2">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-600">Days until next reminder</label>
                    <input
                      type="text"
                      value={daysuntilNextReminder}
                      onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                      placeholder="Days until next reminder"
                      className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-600">No. of reminders</label>
                    <input
                      type="text"
                      value={noOfReminder}
                      onChange={(e) => setNoOfReminder(e.target.value)}
                      placeholder="No. of reminders"
                      className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              )}

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  <span className="text-xs text-gray-500">Only for:</span>
                  {selectedTagElements}
                </div>
              )}
            </div>
            {saveBtn}
            {conditionsPanel}
          </>
        );

      case "Update account tags":
        return (
          <>
            <div className="rounded-lg border-2 border-gray-200 p-3 space-y-3">
              <p className="text-sm font-medium">1. {automationSelect || "No Type"}</p>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">Add Tags</p>
                  <select
                    multiple
                    className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={addTags}
                    onChange={(e) => handleAddTagChange({ target: { value: Array.from(e.target.selectedOptions, (o) => o.value) } })}
                  >
                    {filteredAddTagsOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} style={{ backgroundColor: opt.colour, color: "#fff" }}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {addTags.map((v) => {
                      const opt = tagsoptions.find((o) => o.value === v);
                      return opt ? <span key={v} className="rounded-full px-2 py-0.5 text-xs text-white font-medium" style={{ backgroundColor: opt.colour }}>{opt.label}</span> : null;
                    })}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">Remove Tags</p>
                  <select
                    multiple
                    className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={removeTags}
                    onChange={(e) => handleRemoveTagChange({ target: { value: Array.from(e.target.selectedOptions, (o) => o.value) } })}
                  >
                    {filteredRemoveTagsOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} style={{ backgroundColor: opt.colour, color: "#fff" }}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {removeTags.map((v) => {
                      const opt = tagsoptions.find((o) => o.value === v);
                      return opt ? <span key={v} className="rounded-full px-2 py-0.5 text-xs text-white font-medium" style={{ backgroundColor: opt.colour }}>{opt.label}</span> : null;
                    })}
                  </div>
                </div>
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs text-gray-500">Only for:</span>
                  {selectedTagElements}
                </div>
              )}
              <button type="button" onClick={handleAddConditions} className="text-sm text-blue-600 hover:underline">Add Conditions</button>
            </div>
            {saveBtn}
            {conditionsPanel}
          </>
        );

      case "Update job assignees":
        return (
          <>
            <div className="rounded-lg border-2 border-gray-200 p-3 space-y-3">
              <p className="text-sm font-medium">1. {automationSelect || "No Type"}</p>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">Add Assignees</p>
                  <select
                    multiple
                    className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={selectedAssignees}
                    onChange={(e) => setSelectedAssignees(Array.from(e.target.selectedOptions, (o) => o.value))}
                  >
                    {assigneeOptions.filter((opt) => !assigneesToRemove.includes(opt.value)).map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAssignees.map((v) => {
                      const opt = assigneeOptions.find((o) => o.value === v);
                      return opt ? <span key={v} className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium">{opt.label}</span> : null;
                    })}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-600 mb-1">Remove Assignees</p>
                  <select
                    multiple
                    className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={assigneesToRemove}
                    onChange={(e) => setAssigneesToRemove(Array.from(e.target.selectedOptions, (o) => o.value))}
                  >
                    {assigneeOptions.filter((opt) => !selectedAssignees.includes(opt.value)).map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {assigneesToRemove.map((v) => {
                      const opt = assigneeOptions.find((o) => o.value === v);
                      return opt ? <span key={v} className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium">{opt.label}</span> : null;
                    })}
                  </div>
                </div>
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs text-gray-500">Only for:</span>
                  {selectedTagElements}
                </div>
              )}
              <button type="button" onClick={handleAddConditions} className="text-sm text-blue-600 hover:underline">Add Conditions</button>
            </div>
            {saveBtn}
            {conditionsPanel}
          </>
        );

      case "Update client-facing job status":
        return (
          <>
            <div className="rounded-lg border-2 border-gray-200 p-3 space-y-3">
              <p className="text-sm font-medium">1. {automationSelect || "No Type"}</p>
              <p className="text-xs text-gray-500">The client-facing status will update automatically as soon as the job enters the stage. Your clients will see it in their client portal.</p>
              <div>
                <label className="text-xs font-medium text-gray-600">Visibility for client</label>
                <select
                  className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={status?.value ?? ""}
                  onChange={(e) => {
                    const opt = statusOptions.find((o) => String(o.value) === e.target.value);
                    handleStatusChange(null, opt);
                  }}
                >
                  <option value="">Select status</option>
                  {statusOptions.map((opt) => (
                    <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {status?.value === true && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">Select status</label>
                  <select
                    className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={selectedClientStatus?.value || ""}
                    onChange={(e) => {
                      const opt = optionstatus.find((o) => o.value === e.target.value);
                      handleClientStatusChange(null, opt);
                    }}
                  >
                    <option value="">Select status</option>
                    {optionstatus.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <label className="text-xs font-medium text-gray-600">Status description for client</label>
                  <textarea
                    rows={4}
                    className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    placeholder="Status description for client"
                    value={clientDescription}
                    onChange={handleClientDescriptionChange}
                  />
                  <p className="text-xs text-gray-400">{clientDescription.length}/{maxDescriptionLength}</p>
                </div>
              )}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs text-gray-500">Only for:</span>
                  {selectedTagElements}
                </div>
              )}
              <button type="button" onClick={handleAddConditions} className="text-sm text-blue-600 hover:underline">Add Conditions</button>
            </div>
            {saveBtn}
            {conditionsPanel}
          </>
        );

      default:
        return null;
    }
  };

  
  const handleSaveAutomation = () => {
    return () => {
      if (stageSelected === null || stageSelected === undefined) {
        console.error("No stage selected for automation.");
        return;
      }
      console.log("stage index for automations:", stageSelected);
      const updatedStages = [...stages];

      // Define automation object based on type
      const selectedAutomation = {
        type: automationSelect, // The type of automation (e.g., "Send Email", "Update account tags")
        template: selectedtemp
          ? { label: selectedtemp.label, value: selectedtemp.value }
          : null, // Store label and value of selected template
        tags: selectedTags.map((tag) => ({
          _id: tag._id,
          tagName: tag.tagName,
          tagColour: tag.tagColour,
        })),
      };

      // If automation type is "Update account tags", include addTags and removeTags fields
      if (automationSelect === "Update account tags") {
        selectedAutomation.addTags = addTags.map((tagId) => {
          const tag = tags.find((t) => t._id === tagId);
          return tag
            ? {
                _id: tag._id,
                tagName: tag.tagName,
                tagColour: tag.tagColour,
              }
            : null;
        });

        selectedAutomation.removeTags = removeTags.map((tagId) => {
          const tag = tags.find((t) => t._id === tagId);
          return tag
            ? {
                _id: tag._id,
                tagName: tag.tagName,
                tagColour: tag.tagColour,
              }
            : null;
        });
      } else if (automationSelect === "Update job assignees") {
      selectedAutomation.addAssignees = selectedAssignees.map((userId) => {
        const user = assignee.find((u) => u._id === userId);
        return user ? { _id: user._id, username: user.username } : null;
      });
      
      selectedAutomation.removeAssignees = assigneesToRemove.map((userId) => {
        const user = assignee.find((u) => u._id === userId);
        return user ? { _id: user._id, username: user.username } : null;
      });
    } else if (automationSelect === "Update client-facing job status") {
        selectedAutomation.visibilityForClient = status.value; // true/false
        selectedAutomation.selectedClientStatus = selectedClientStatus
          ? {
              label: selectedClientStatus.label,
              value: selectedClientStatus.value,
              clientfacingColour: selectedClientStatus.clientfacingColour,
            }
          : null;
        selectedAutomation.statusDescription = clientDescription || null;
      }

      // Ensure selected stage exists before adding automation
      updatedStages[stageSelected] = {
        ...updatedStages[stageSelected], // Keep other stage properties
        automations: [
          ...updatedStages[stageSelected].automations,
          selectedAutomation,
        ], // Add the new automation
      };

      setStages(updatedStages);
      console.log("updatedstages", updatedStages);
      console.log(
        "Automation saved for stage:",
        stageSelected,
        selectedAutomation
      );

      // Reset states after saving
       setSelectedAssignees([]);
    setAssigneesToRemove([]);
      setselectedTemp(null);
      setSelectedTags([]);
      setIsAnyCheckboxChecked(false);
      setAddTags([]); // Reset addTags
      setRemoveTags([]); // Reset removeTags
      setClientDescription("");
      setStatus(statusOptions.find((option) => option.value === true));
      setSelectedClientStatus(null);
      handleDrawerClose();
    };
  };

  const handleSaveTagsAutomation = (index) => {
    return () => {
      const updatedStages = [...stages];
      console.log("Updated Stages before update:", updatedStages);

      const selectedAutomation = {
        type: automationSelect,
        addTags: addTags
          .map((tagId) => {
            const tag = tags.find((t) => t._id === tagId);
            return tag
              ? {
                  _id: tag._id,
                  tagName: tag.tagName,
                  tagColour: tag.tagColour,
                }
              : null;
          })
          .filter(Boolean), // Filter out any null values
        removeTags: removeTags
          .map((tagId) => {
            const tag = tags.find((t) => t._id === tagId);
            return tag
              ? {
                  _id: tag._id,
                  tagName: tag.tagName,
                  tagColour: tag.tagColour,
                }
              : null;
          })
          .filter(Boolean), // Filter out any null values

        // template: selectedtemp ? { label: selectedtemp.label, value: selectedtemp.value } : null,
        tags: selectedTags.map((tag) => ({
          _id: tag._id,
          tagName: tag.tagName,
          tagColour: tag.tagColour,
        })),
      };

      // Make sure the right stage is getting updated
      updatedStages[index] = {
        // ...updatedStages[index], // Ensure we keep the other properties of the stage intact
        automations: [...updatedStages[index].automations, selectedAutomation], // Add the new automation to automations
      };

      setStages(updatedStages);
      console.log("Automation saved for stage:", index, selectedAutomation);

      // Reset form fields
      // setselectedTemp(null);
      setSelectedTags([]);
      setAddTags([]);
      setRemoveTags([]);
      setIsAnyCheckboxChecked(false);
      handleDrawerClose();
    };
  };
  const [selectedAutomationIndex, setSelectedAutomationIndex] = useState(null);


  const handleEditAddTags = () => {
    if (selectedAutomationIndex !== null) {
      setSelectedAutomationData((prevData) => {
        const updatedData = [...prevData];
        updatedData[selectedAutomationIndex] = {
          ...updatedData[selectedAutomationIndex],
          tags: stageAutomationTags, // Save selected tags
        };
        return updatedData;
      });
    }
    setIsConditionsEditFormOpen(false);
  };


  const handleEditSaveAutomation = () => {
    if (editingStageIndex === null) return; // Ensure the stage index is valid

    console.log("Save automation for stage:", editingStageIndex);

    // Process automation data to ensure "Update account tags" includes correct addTags and removeTags
    const updatedAutomationData = selectedAutomationData.map((automation) => {
      if (automation.type === "Update account tags") {
        return {
          ...automation,
          addTags: automation.addTags
            .map((tag) => {
              if (typeof tag === "string") {
                const foundTag = tags.find((t) => t._id === tag);
                return foundTag
                  ? {
                      _id: foundTag._id,
                      tagName: foundTag.tagName,
                      tagColour: foundTag.tagColour,
                    }
                  : null;
              }
              return tag; // Keep existing tag objects
            })
            .filter(Boolean), // Remove any null values

          removeTags: automation.removeTags
            .map((tag) => {
              if (typeof tag === "string") {
                const foundTag = tags.find((t) => t._id === tag);
                return foundTag
                  ? {
                      _id: foundTag._id,
                      tagName: foundTag.tagName,
                      tagColour: foundTag.tagColour,
                    }
                  : null;
              }
              return tag; // Keep existing tag objects
            })
            .filter(Boolean),
        };
      } else if (automation.type === "Update job assignees") {
        return {
          ...automation,
          addAssignees: automation.addAssignees
            .map((tag) => {
              if (typeof tag === "string") {
                const foundTag = assignee.find((t) => t._id === tag);
                return foundTag
                  ? {
                      _id: foundTag._id,
                      label: foundTag.username,
                     
                    }
                  : null;
              }
              return tag; // Keep existing tag objects
            })
            .filter(Boolean), // Remove any null values

          removeAssignees: automation.removeAssignees
            .map((tag) => {
              if (typeof tag === "string") {
                const foundTag = assignee.find((t) => t._id === tag);
                return foundTag
                  ? {
                      _id: foundTag._id,
                      label: foundTag.username,
                      
                    }
                  : null;
              }
              return tag; // Keep existing tag objects
            })
            .filter(Boolean),
        };
      }
      return automation;
    });

    console.log("Processed automation data:", updatedAutomationData);

    // Update the automations for the selected stage
    const updatedStages = [...stages];
    updatedStages[editingStageIndex].automations = updatedAutomationData;

    console.log("Updated Stages:", updatedStages);

    // Update the stages state
    setStages(updatedStages);

    // Close the drawer and show success message
    setIsEditDrawerOpen(false);
    toast.success("Automation edited successfully");
  };

  const handleStageNameChange = (e, index) => {
    const newStages = [...stages]; // Create a copy of the stages array
    newStages[index].name = e.target.value; // Update the name of the specific stage
    setStages(newStages); // Update the state with the modified stages array

    // Clear error when user types
    const newStageErrors = [...stageNameErrors];
    newStageErrors[index] = e.target.value ? "" : "Stage name is required";
    setStageNameErrors(newStageErrors);
  };

  const handleDeleteStage = (index) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    setStages(updatedStages);
  };

  const handleAutoMoveChange = (index) => {
    const updatedStages = stages.map((stage, idx) =>
      idx === index ? { ...stage, autoMove: !stage.autoMove } : stage
    );
    setStages(updatedStages);
  };

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
  const [userData, setUserData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  const USER_LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchData = async () => {
    try {
      const url = `${USER_LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
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

  const createPipe = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    console.log(stages);

    const data = {
      pipelineName: pipelineName,
      availableto: combinedValues,
      sortjobsby: selectedSortByJob.value,
      defaultjobtemplate: selectedJobtemp.value,
      accountId: Account_id,
      description: Description,
      duedate: Due_date,
      accounttags: Account_tags,
      priority: Priority,
      days_on_Stage: Days_on_stage,
      assignees: Assignees,
      name: Name,
       clientFacing_status:clientFacing_status,
      startdate: startDate,
      stages: stages,
    };
    console.log(data);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${PIPELINE_API}/workflow/pipeline/createpipeline`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // Display success toast
        fetchPipelineData();
        toast.success("Pipeline created successfully");
        setShowForm(false);
        clearForm();
        // Additional success handling here
      })
      .catch((error) => {
        console.log(error);
        // Display error toast
        toast.error("Failed to create pipeline");
        // Additional error handling here
      });
  };
  const createSavePipe = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    const data = {
      pipelineName: pipelineName,
      availableto: combinedValues,
      sortjobsby: selectedSortByJob.value,
      defaultjobtemplate: selectedJobtemp.value,
      accountId: Account_id,
      description: Description,
      duedate: Due_date,
      accounttags: Account_tags,
      priority: Priority,
      days_on_Stage: Days_on_stage,
      assignees: Assignees,
      name: Name,
       clientFacing_status:clientFacing_status,
      startdate: startDate,
      stages: stages,
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${PIPELINE_API}/workflow/pipeline/createpipeline`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // Display success toast
        fetchPipelineData();
        toast.success("Pipeline created successfully");

        // Additional success handling here
      })
      .catch((error) => {
        console.log(error);
        // Display error toast
        toast.error("Failed to create pipeline");
        // Additional error handling here
      });
  };
  const clearForm = () => {
    setPipelineName("");
    setSelectedUser([]);
    setCombinedValues([]);
    setSelectedSortByJob("");
    setselectedJobTemp(null);

    setAccount_id(false);
    setDays_on_stage(false);
    setAccount_tags(false);
    setStartDate(false);
    setName(false);
    setDue_date(false);
    setPriority(false);
    setDescription(false);
    setAssignees(false);

    setStages([]);
  };

  const [pipelineData, setPipelineData] = useState([]);

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch pipeline data");
      }
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    }
  };
  const handleEdit = (_id) => {
    // Implement logic for editing here
    // console.log("Edit action triggered for template id: ", templateId);
    // navigate("PipelineTemplateUpdate/" + _id);
    navigate("/PipelineTemplateUpdate/" + _id);
  };

  //delete template
  const handleDelete = async (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this pipeline?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${PIPELINE_API}/workflow/pipeline/pipeline/${_id}`,
        headers: {},
      };

      try {
        const response = await axios.request(config);
        console.log("Delete response:", response.data);
        toast.success("Pipeline deleted successfully");
        handleMenuClose()
        fetchPipelineData();
        // Optionally, you can refresh the data or update the state to reflect the deletion
      } catch (error) {
        console.error("Error deleting pipeline:", error);
      }
    }
  };

  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  // const toggleMenu = (_id) => {
  //   setOpenMenuId(openMenuId === _id ? null : _id);
  //   setTempIdGet(_id);
  // };
  const toggleMenu = (event, _id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(_id);
    setTempIdGet(_id);
  };
    const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
    setTempIdGet(null);
  };
 
  
  
  const handleClosePipelineTemp = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmClose) {
        return;
      }
    }
    setShowForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (pipelineName || Assignees || selectedJobtemp || selectedSortByJob) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [pipelineName, Assignees, selectedJobtemp, selectedSortByJob]);

  const [pipelineNameError, setPipelineNameError] = useState("");
  const [sortByJobError, setSortByJobError] = useState("");
  const [templateError, setTemplateError] = useState("");
  const [userError, setUserError] = useState("");
  const [stageNameErrors, setStageNameErrors] = useState([]);
const [isPipelineNameValid, setIsPipelineNameValid] = useState(true);

  const validateForm = () => {
  let isValid = true;

  // pipeline name
  if (!pipelineName.trim()) {
    setPipelineNameError("Pipeline name is required");
    isValid = false;
  } else if (!isPipelineNameValid) {
    // 🚫 stop if API says name exists
    setPipelineNameError("Pipeline name already exists");
    isValid = false;
  } else {
    setPipelineNameError("");
  }

  // Sort by Job
  if (!selectedSortByJob) {
    setSortByJobError("Sort By Job is required.");
    isValid = false;
  } else {
    setSortByJobError("");
  }

  // Job Template
  if (!selectedJobtemp) {
    setTemplateError("Job Template is required.");
    isValid = false;
  } else {
    setTemplateError("");
  }

  // Users
  if (selectedUser.length === 0) {
    setUserError("At least one user must be selected.");
    isValid = false;
  } else {
    setUserError("");
  }

  // Stage names
  const newStageErrors = stages.map((stage) =>
    stage.name ? "" : "Stage name is required"
  );
  setStageNameErrors(newStageErrors);

  if (newStageErrors.some((error) => error !== "")) {
    isValid = false;
  }

  return isValid;
};
  
  const [searchQuery, setSearchQuery] = useState("");
  // Filter pipelineData based on searchQuery
  const filteredPipelines = pipelineData.filter((row) =>
    row.pipelineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30); // Default rows per page

  // Pagination: Slice the filtered data
  const paginatedPipelines = filteredPipelines.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
// ✅ Debounced function to check template/pipeline name existence
const checkTemplateName = async (name) => {
  try {
    const res = await axios.get(`${PIPELINE_API}/workflow/pipeline/check-name`, {
      params: { name },
    });

    if (res.data.exists) {
      setPipelineNameError("Pipeline name already exists");
      setIsPipelineNameValid(false);
    } else {
      setPipelineNameError("");
      setIsPipelineNameValid(true);
    }
  } catch (err) {
    console.error(err);
    setIsPipelineNameValid(true); // avoid blocking form
  }
};

// ✅ debounced
const debouncedCheck = debounce((name) => {
  if (name.trim()) checkTemplateName(name);
  else {
    setPipelineNameError("");
    setIsPipelineNameValid(false);
  }
}, 500);

// ✅ Call debounce whenever name changes
useEffect(() => {
  debouncedCheck(pipelineName);
  return debouncedCheck.cancel;
}, [pipelineName]);


// ✅ Update validateForm function


  const automationMenuItems = [
    "Send Email", "Send Invoice", "Send Proposal/Els", "Create Organizer",
    "Apply folder template", "Update account tags", "Update job assignees",
    "Create Task", "Send message", "Update client-facing job status",
  ];

  const SwitchField = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-2 cursor-pointer mt-2">
      <span className="relative inline-flex items-center">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
        <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
      </span>
      <span className="text-sm">{label}</span>
    </label>
  );

  return (
    <div>
      {!showForm ? (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handleCreatePipeline}
              className="rounded-full bg-[var(--color-save-btn)] px-5 py-2 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors"
            >
              Create Pipeline
            </button>
            <input
              type="text"
              placeholder="Search Pipeline"
              value={searchQuery}
              onChange={handleSearch}
              className="w-[300px] rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left w-64">Pipeline Name</th>
                  <th className="px-4 py-3 text-left w-24">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedPipelines.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <span
                        className="cursor-pointer text-[#3f51b5] text-xs hover:underline"
                        onClick={() => handleEdit(row._id)}
                      >
                        {row.pipelineName}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={(e) => toggleMenu(e, row._id)}
                        className="rounded p-1 text-[#2c59fa] hover:bg-gray-100"
                      >
                        <CiMenuKebab />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kebab dropdown menu */}
          {Boolean(anchorEl) && (
            <div className="fixed inset-0 z-50" onClick={handleMenuClose}>
              <div
                className="absolute bg-white rounded-lg shadow-lg border border-gray-200 min-w-[120px] py-1 z-50"
                style={{ top: anchorEl?.getBoundingClientRect().bottom + 8, left: anchorEl?.getBoundingClientRect().right - 120 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => { handleEdit(tempIdget); handleMenuClose(); }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => { handleDelete(tempIdget); handleMenuClose(); }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-end gap-4 mt-3 text-xs text-gray-600">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none"
            >
              {[30, 40, 50, 60, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>{page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, filteredPipelines.length)} of {filteredPipelines.length}</span>
            <button type="button" disabled={page === 0} onClick={(e) => handleChangePage(e, page - 1)} className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40">‹</button>
            <button type="button" disabled={(page + 1) * rowsPerPage >= filteredPipelines.length} onClick={(e) => handleChangePage(e, page + 1)} className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40">›</button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <form>
            <div>
              <h2 className="text-xl font-semibold mb-2">Create Pipelines</h2>
              <hr className="mb-4" />

              <div className="flex flex-col sm:flex-row gap-6">
                {/* Left column */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="pipeline-lable">Pipeline Name</label>
                    <input
                      type="text"
                      value={pipelineName}
                      onChange={(e) => setPipelineName(e.target.value)}
                      placeholder="Pipeline Name"
                      className={`mt-1.5 w-full rounded border px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${pipelineNameError ? "border-red-400" : "border-gray-200"}`}
                    />
                    {!!pipelineNameError && (
                      <p className="mt-1 rounded-b bg-red-600 px-3 py-0.5 text-xs text-white">{pipelineNameError}</p>
                    )}
                  </div>

                  <div>
                    <label className="pipeline-lable">Available To</label>
                    <select
                      multiple
                      className={`mt-2 w-full rounded border px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${userError ? "border-red-400" : "border-gray-200"}`}
                      value={selectedUser.map((u) => u.value)}
                      onChange={(e) => {
                        const vals = Array.from(e.target.selectedOptions, (o) => o.value);
                        const selected = options.filter((o) => vals.includes(o.value));
                        handleUserChange(null, selected);
                      }}
                    >
                      {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedUser.map((u) => (
                        <span key={u.value} className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs">{u.label}</span>
                      ))}
                    </div>
                    {!!userError && <p className="mt-1 rounded-b bg-red-600 px-3 py-0.5 text-xs text-white">{userError}</p>}
                  </div>

                  <div>
                    <label className="pipeline-lable">Sort jobs by</label>
                    <select
                      className={`mt-2 w-full rounded border px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${sortByJobError ? "border-red-400" : "border-gray-200"}`}
                      value={selectedSortByJob?.value || ""}
                      onChange={(e) => {
                        const opt = optionsort.find((o) => o.value === e.target.value);
                        handleSortingByJobs(opt);
                      }}
                    >
                      <option value="">Sort By Job</option>
                      {optionsort.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    {!!sortByJobError && <p className="mt-1 rounded-b bg-red-600 px-3 py-0.5 text-xs text-white">{sortByJobError}</p>}
                  </div>

                  <div>
                    <label className="pipeline-lable">Default job template</label>
                    <select
                      className={`mt-2 w-full rounded border px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${templateError ? "border-red-400" : "border-gray-200"}`}
                      value={selectedJobtemp?.value || ""}
                      onChange={(e) => {
                        const opt = optiontemp.find((o) => o.value === e.target.value);
                        handleJobtemp(opt);
                      }}
                    >
                      <option value="">Default job template</option>
                      {optiontemp.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    {!!templateError && <p className="mt-1 rounded-b bg-red-600 px-3 py-0.5 text-xs text-white">{templateError}</p>}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-base font-semibold mb-2">Job card fields</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <SwitchField checked={Account_id} onChange={handleAccount_idChange} label="Account ID" />
                        <SwitchField checked={Days_on_stage} onChange={handleDays_on_stageChange} label="Days in stage" />
                        <SwitchField checked={Account_tags} onChange={handleAccount_tagsChange} label="Account tags" />
                        <SwitchField checked={clientFacing_status} onChange={handleClientFacing_status} label="Client-facing Status" />
                      </div>
                      <div>
                        <SwitchField checked={startDate} onChange={handleStartDateChange} label="Start date" />
                        <SwitchField checked={Name} onChange={handleNameSwitchChange} label="Name" />
                        <SwitchField checked={Due_date} onChange={handleDue_dateChange} label="Due date" />
                      </div>
                      <div>
                        <SwitchField checked={Description} onChange={handleDescriptionChange} label="Description" />
                        <SwitchField checked={Assignees} onChange={handleAssigneesChange} label="Assignees" />
                        <SwitchField checked={Priority} onChange={handlePriorityChange} label="Priority" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px bg-black mx-2" />

                {/* Right column */}
                <div className="flex-1">
                  <p className="text-sm">Default recurrence setting</p>
                </div>
              </div>

              {/* Stages header */}
              <div className="flex items-center justify-between mt-8 mb-2">
                <h3 className="text-base font-semibold">Stages</h3>
                <button
                  type="button"
                  onClick={() => handleAddStage(stages.length)}
                  className="flex items-center gap-1 rounded-full bg-[var(--color-save-btn)] px-4 py-1.5 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors"
                >
                  <FiPlusCircle className="h-4 w-4" /> Add stage
                </button>
              </div>
              <hr className="mb-4" />

              {/* Stages kanban */}
              <div className="flex gap-6 mb-4 flex-col sm:flex-row">
                <div className="flex gap-3 overflow-x-auto pb-2 items-start min-h-[300px] max-h-[500px] stage-scroll">
                  {stages.map((stage, index) => (
                    <React.Fragment key={index}>
                      <div className="min-w-[250px] max-w-[270px] flex-shrink-0 rounded-xl bg-[#F5F5F7] p-5 shadow-md">
                        <div className="flex items-center gap-2 mb-3">
                          <RxDragHandleDots2 className="text-gray-400 flex-shrink-0" />
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              placeholder="Stage Name"
                              value={stage.name}
                              onChange={(e) => handleStageNameChange(e, index)}
                              className={`w-full border-b bg-transparent text-sm font-medium focus:outline-none pr-5 ${stageNameErrors[index] ? "border-red-400" : "border-gray-300"}`}
                            />
                            <LuPenLine className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                            {stageNameErrors[index] && <p className="text-xs text-red-500 mt-0.5">{stageNameErrors[index]}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteStage(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <RiDeleteBin6Line className="h-4 w-4" />
                          </button>
                        </div>

                        <hr className="border-gray-300 mb-3" />

                        <div>
                          <p className="text-xs font-bold">Stage conditions</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {index === 0
                              ? "First stage can't have conditions"
                              : index === stages.length - 1
                              ? "Last stage can't have conditions"
                              : "Job enters this stage if conditions are met"}
                          </p>

                          <p className="text-xs font-bold mt-3">Automations</p>
                          <p className="text-xs text-gray-500">Triggered when job enters stage</p>
                          <button
                            type="button"
                            className="mt-1 text-xs font-bold text-blue-600 hover:underline"
                            onClick={(e) => handleClick(e, index, "edit")}
                          >
                            {stage.automations.length > 0 ? "Edit automation" : "Add automation"}
                          </button>

                          {/* Automation dropdown */}
                          {Boolean(anchorEl) && stageSelected === index && (
                            <div className="fixed inset-0 z-50" onClick={handleClose}>
                              <div
                                className="absolute bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 max-h-[200px] overflow-y-auto min-w-[200px]"
                                style={{ top: anchorEl?.getBoundingClientRect().bottom + 4, left: anchorEl?.getBoundingClientRect().left }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {automationMenuItems.map((item) => (
                                  <button
                                    key={item}
                                    type="button"
                                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50"
                                    onClick={() => handleAddAutomation(stageSelected, item)}
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <AddAutomationDrawer
                            isDrawerOpen={isDrawerOpen}
                            handleDrawerClose={handleDrawerClose}
                            renderActionContent={renderActionContent}
                            automationSelect={automationSelect}
                            index={index}
                            handleEditClick={handleEditClick}
                            handleEditSaveAutomation={handleEditSaveAutomation}
                            ehitAnchorEl={ehitAnchorEl}
                            handleEditClose={handleEditClose}
                            handleMenuItemSelect={handleMenuItemSelect}
                          />
                          <EditAutomationDrawer
                            setSelectedAddTags={setSelectedAddTags}
                            selectedAddTags={selectedAddTags}
                            isEditDrawerOpen={isEditDrawerOpen}
                            setIsEditDrawerOpen={setIsEditDrawerOpen}
                            selectedAutomationData={selectedAutomationData}
                            setSelectedAutomationData={setSelectedAutomationData}
                            handleDeleteAutomation={handleDeleteAutomation}
                            handleEditTemplateChange={handleEditTemplateChange}
                            emailTemplateOptions={emailTemplateOptions}
                            invoiceTemplateOptions={invoiceTemplateOptions}
                            organizerOptions={organizerOptions}
                            proposalElsOptions={proposalElsOptions}
                            optionfolder={optionfolder}
                            setSelectedAutomationIndex={setSelectedAutomationIndex}
                            handleEditConditions={handleEditConditions}
                            handleEditClick={handleEditClick}
                            handleEditSaveAutomation={handleEditSaveAutomation}
                            ehitAnchorEl={ehitAnchorEl}
                            handleEditClose={handleEditClose}
                            handleMenuItemSelect={handleMenuItemSelect}
                            isConditionsEditFormOpen={isConditionsEditFormOpen}
                            setIsConditionsEditFormOpen={setIsConditionsEditFormOpen}
                            selectedAutomationIndex={selectedAutomationIndex}
                            handleEditGoBack={handleEditGoBack}
                            handleEditCheckboxChange={handleEditCheckboxChange}
                            handleEditAddTags={handleEditAddTags}
                            searchTerm={searchTerm}
                            handleSearchChange={handleSearchChange}
                            filteredTags={filteredTags}
                            stageAutomationTags={stageAutomationTags}
                            setTempSelectedTags={setTempSelectedTags}
                            filteredAddTagsOptions={filteredAddTagsOptions}
                            tagsoptions={tagsoptions}
                            assigneeOptions={assigneeOptions}
                            taskTemplateOptions={taskTemplateOptions}
                            chatTemplateOptions={chatTemplateOptions}
                            handleTagChange={handleTagChange}
                            statusOptions={statusOptions}
                            handleAssigneeChange={handleAssigneeChange}
                            handleStatusChange={handleStatusChange}
                            setStatus={setStatus}
                            optionstatus={optionstatus}
                            setClientDescription={setClientDescription}
                            setEditClientDescripation={setEditClientDescripation}
                            setSelectedClientStatus={setSelectedClientStatus}
                            maxDescriptionLength={maxDescriptionLength}
                            handleClientDescriptionChange={handleClientDescriptionChange}
                            clientFacingJobs={clientFacingJobs}
                            setClientFacingJobs={setClientFacingJobs}
                            handleClientStatusChange={handleClientStatusChange}
                            handleEditClientChange={handleEditClientChange}
                          />

                          {/* Automation summary cards */}
                          {stage.automations.length > 0 && (
                            <div className="mt-3 flex flex-col gap-2">
                              {stage.automations.map((automation, idx) => (
                                <div key={idx} className="rounded-lg bg-white border border-gray-200 p-3 shadow-sm">
                                  <p className="text-xs font-bold">{idx + 1}. {automation.type}</p>
                                  {automation.template && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {automation.template.label.length > 25
                                        ? `${automation.template.label.slice(0, 25)}...`
                                        : automation.template.label}
                                    </p>
                                  )}
                                  {automation.addTags?.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs text-gray-500">Add Tags:</p>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {automation.addTags.map((tag) => (
                                          <span key={tag._id} className="rounded-full px-2 py-0.5 text-xs text-white font-semibold" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {automation.removeTags?.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs text-gray-500">Remove Tags:</p>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {automation.removeTags.map((tag) => (
                                          <span key={tag._id} className="rounded-full px-2 py-0.5 text-xs text-white font-semibold" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {automation.addAssignees?.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs text-gray-500">Add Assignees:</p>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {automation.addAssignees.map((a) => (
                                          <span key={a._id} className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium">{a.username}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {automation.removeAssignees?.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs text-gray-500">Remove Assignees:</p>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {automation.removeAssignees.map((a) => (
                                          <span key={a._id} className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium">{a.username}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {automation.type === "Update client-facing job status" && (
                                    <div className="mt-1">
                                      {automation.visibilityForClient === false ? (
                                        <p className="text-xs text-gray-500">Don't show status</p>
                                      ) : (
                                        <div className="flex items-center gap-1">
                                          <GoDotFill style={{ color: automation.selectedClientStatus?.clientfacingColour, fontSize: "16px" }} />
                                          <span className="text-xs">{automation.selectedClientStatus?.label}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {automation.tags?.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      <span className="text-xs text-gray-500">Conditions:</span>
                                      {automation.tags.map((tag) => (
                                        <span key={tag._id} className="rounded-full px-2 py-0.5 text-xs text-white font-semibold" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Plus between stages */}
                      {index < stages.length - 1 && (
                        <button type="button" onClick={() => handleAddStage(index + 1)} className="flex-shrink-0 mt-4">
                          <FiPlusCircle style={{ color: "var(--color-save-btn)", width: "25px", height: "25px" }} />
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex-shrink-0 mt-3">
                  <button
                    type="button"
                    onClick={() => handleAddStage(stages.length)}
                    className="flex items-center gap-1 rounded-full bg-[var(--color-save-btn)] px-4 py-1.5 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors"
                  >
                    <FiPlusCircle className="h-4 w-4" /> Add stage
                  </button>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center gap-4 mt-6">
                <button type="button" onClick={createPipe} className="rounded-full bg-[var(--color-save-btn)] px-5 py-1.5 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors">
                  Save & exit
                </button>
                <button type="button" onClick={createSavePipe} className="w-20 rounded-full bg-[var(--color-save-btn)] px-5 py-1.5 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors">
                  Save
                </button>
                <button type="button" onClick={handleClosePipelineTemp} className="w-20 rounded-full border border-[var(--color-border-cancel-btn)] px-5 py-1.5 text-sm text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white hover:border-transparent transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PipelineTemp;

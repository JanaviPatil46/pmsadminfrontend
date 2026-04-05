



import React, { useState ,useEffect} from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Drawer,
  Grid,Chip,Autocomplete,Checkbox,InputLabel
} from "@mui/material";
import { FiPlusCircle } from "react-icons/fi";
import {  LuPenLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2, RxDragHandleDots2 } from "react-icons/rx";
import {IoMdArrowRoundBack} from "react-icons/io";
import  {AiOutlineSearch} from "react-icons/ai";
import TagsMultiSelectDropDown from "../TagsMultiSelectDropDown";
import MultiSelectDropdown from "../MultiSelectDropdown"; 
const StagesSection = ({
  stages,
  stageNameErrors,
  handleAddStage,
  handleDeleteStage,
  handleStageNameChange,
  handleSaveAutomations,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [stageSelected, setStageSelected] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [automationSelect, setAutomationSelect] = useState();
  const [drawerAutomations, setDrawerAutomations] = useState([]);
  const [drawerAnchorEl, setDrawerAnchorEl] = useState(null);
  // State for conditions drawer (shared across all automations)
  const [isConditionsFormOpen, setIsConditionsFormOpen] = useState(false);
  const [currentAutomationIndex, setCurrentAutomationIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedTags, setTempSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
//  const [conditionsFilterTags, setConditionsFilterTags] = useState([]);
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const [addTaskTemplates, setAddTaskTemplates] = useState([]);
  const [addEmailTemplates, setAddEmailTemplates] = useState([]);
  const [addChatTemplates, setAddChatTemplates] = useState([]);
  const [addInvoiceTemplates, setAddInvoiceTemplates] = useState([]);
  const [addProposalsandElsTeplates, setAddProposalsandElsTeplates] = useState([]);
  const [addOrganizerTemplates, setAddOrganizerTemplates] = useState([]);
  const [folderTemplates, setFolderTemplates] = useState([]);
  
  useEffect(() => {
    fetchTags();
  }, []);
  
  const [tags, setTags] = useState([]);
  const fetchTags = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("tags data", data.tags);
      setFilteredTags(data.tags);
      // Set tags for the dropdown in the correct format with null checks
      const tagsOptions = (data.tags || []).map(tag => ({
        value: tag._id || '',
        label: tag.tagName || '',
        colour: tag.tagColour || '#cccccc',
      })).filter(tag => tag.value && tag.label); // Filter out any invalid entries
      
      setTags(tagsOptions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const filteredConditionTags = filteredTags.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );
    const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  
    const [users, setUsers] = useState([]);
   
  
    // Fetch Users
    useEffect(() => {
      const fetchData = async () => {
        try {
          const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
          const response = await fetch(url);
          const data = await response.json();
  
          const userOptions = data.map((u) => ({
            value: u._id,
            label: u.username,
            // email: u.email,
          }));
  
          setUsers(userOptions);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
  
      fetchData();
    }, [LOGIN_API]);
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
  
  const fetchFolderData = async () => {
    try {
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
  
  const statusOptions = [
    { value: true, label: "Show status" },
    { value: false, label: "Hide status" },
  ];
  
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  const [status, setStatus] = useState(
    statusOptions.find((option) => option.value === true)
  );
  
  // const handleStatusChange = (event, newValue) => {
  //   setStatus(newValue);
  // };
  // Add this function with your other handlers
const handleClientStatusSelection = async (event, newValue, automationIndex) => {
  updateAutomationState(automationIndex, { selectedClientStatus: newValue });

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

      console.log("Fetched client status data:", data);
      
      // Update the automation with the fetched description
      updateAutomationState(automationIndex, {
        selectedClientStatus: newValue,
        clientDescription: data.clientfacingjobstatuses?.clientfacingdescription || ""
      });
      
    } catch (error) {
      console.error("Error fetching client status data:", error);
    }
  } else {
    // Clear the description if no status is selected
    updateAutomationState(automationIndex, {
      selectedClientStatus: null,
      clientDescription: ""
    });
  }
};
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
      setClientFacingJobs(data.clientFacingJobStatues);
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
  
  const [clientDescription, setClientDescription] = useState("");
  const maxDescriptionLength = 150;
  const [selectedClientStatus, setSelectedClientStatus] = useState(null);
  
 
  
  useEffect(() => {
    fetchEmailTemplates();
    fetchChatTemplates();
    fetchTaskTemplates();
    fectInvoiceTemplates();
    fectProposalandElsTemp();
    fetchOrganizerTemplates();
    fetchFolderData();
    fetchClientFacingJobsData();
  }, []);

  // State for each automation type

  const handleAutomationMenuOpen = (event, stageIndex) => {
    setAnchorEl(event.currentTarget);
    setStageSelected(stageIndex);
  };

  const handleAutomationMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddAutomation = (stageSelected, option) => {
    console.log("Adding automation to stage index:", stageSelected);
    console.log("Automation clicked:", option);
    
    // Initialize drawer with the first automation
    const newAutomation = { 
      type: option, 
      index: 1,
      id: Date.now(),
      // Initialize automation-specific state
      selectedtemp: null,
      selectedTags: [],
      reminderChecked: false,
      daysuntilNextReminder: "",
      noOfReminder: "",
      addTags: [],
      removeTags: [],
      selectedAssignees: [],
      assigneesToRemove: [],
      status: null,
      selectedClientStatus: null,
      clientDescription: ""
    };
    
    setDrawerAutomations([newAutomation]);
    setAutomationSelect(option);
    setIsDrawerOpen(true);
    handleAutomationMenuClose();
  };

  // const handleEditAutomations = (stageIndex) => {
  //   const stage = stages[stageIndex];
  //   if (stage && stage.automations && stage.automations.length > 0) {
  //     // Restore automations with proper template and tag objects
  //     const restoredAutomations = stage.automations.map(automation => {
  //       const restoredAutomation = { ...automation };
        
  //       // Restore template object based on automation type
  //       if (automation.selectedtemp) {
  //         let templateOptions = [];
  //         switch (automation.type) {
  //           case "Create Task":
  //             templateOptions = taskTemplateOptions;
  //             break;
  //           case "Send Email":
  //             templateOptions = emailTemplateOptions;
  //             break;
  //           case "Send message":
  //             templateOptions = chatTemplateOptions;
  //             break;
  //           case "Send Invoice":
  //             templateOptions = invoiceTemplateOptions;
  //             break;
  //           case "Send Proposal/Els":
  //             templateOptions = proposalElsOptions;
  //             break;
  //           case "Apply folder template":
  //             templateOptions = optionfolder;
  //             break;
  //           case "Create Organizer":
  //             templateOptions = organizerOptions;
  //             break;
  //           default:
  //             templateOptions = [];
  //         }
          
  //         // Find the template object
  //         const templateObj = templateOptions.find(opt => opt.value === automation.selectedtemp);
  //         restoredAutomation.selectedtemp = templateObj || null;
  //       }
        
  //       // Restore tags as objects (not just IDs)
  //       if (automation.selectedTags && Array.isArray(automation.selectedTags)) {
  //         restoredAutomation.selectedTags = automation.selectedTags.map(tagId => 
  //           filteredTags.find(tag => tag._id === tagId)
  //         ).filter(Boolean);
  //       }
        
  //       // SPECIAL: Restore addTags and removeTags for "Update account tags"
  //       if (automation.type === "Update account tags") {
  //         if (automation.addTags && Array.isArray(automation.addTags)) {
  //           restoredAutomation.addTags = automation.addTags.map(tagId => 
  //             tags.find(tag => tag.value === tagId || tag._id === tagId)
  //           ).filter(Boolean);
  //         }
          
  //         if (automation.removeTags && Array.isArray(automation.removeTags)) {
  //           restoredAutomation.removeTags = automation.removeTags.map(tagId => 
  //             tags.find(tag => tag.value === tagId || tag._id === tagId)
  //           ).filter(Boolean);
  //         }
  //       }
  //        // SPECIAL: Restore addTags and removeTags for "Update account tags"
  //       if (automation.type === "Update account tags") {
  //         if (automation.addTags && Array.isArray(automation.addTags)) {
  //           restoredAutomation.addTags = automation.addTags.map(tagId => 
  //             tags.find(tag => tag.value === tagId || tag._id === tagId)
  //           ).filter(Boolean);
  //         }
          
  //         if (automation.removeTags && Array.isArray(automation.removeTags)) {
  //           restoredAutomation.removeTags = automation.removeTags.map(tagId => 
  //             tags.find(tag => tag.value === tagId || tag._id === tagId)
  //           ).filter(Boolean);
  //         }
  //       }
        
  //       // SPECIAL: Restore job assignees for "Update job assignees"
  //       if (automation.type === "Update job assignees") {
  //         if (automation.selectedJobAssignees && Array.isArray(automation.selectedJobAssignees)) {
  //           restoredAutomation.selectedJobAssignees = automation.selectedJobAssignees.map(assigneeId => 
  //             // Assuming you have a users/teamMembers array to search from
  //             users.find(user => user._id === assigneeId || user.value === assigneeId)
  //           ).filter(Boolean);
  //         }
  //       }
  //       // Restore client status
  //       if (automation.selectedClientStatus) {
  //         const statusObj = optionstatus.find(opt => opt.value === automation.selectedClientStatus);
  //         restoredAutomation.selectedClientStatus = statusObj || null;
  //       }
        
  //       // Restore status
  //       if (automation.status !== undefined && automation.status !== null) {
  //         const statusObj = statusOptions.find(opt => opt.value === automation.status);
  //         restoredAutomation.status = statusObj || null;
  //       }
        
  //       return restoredAutomation;
  //     });
  //     console.log("Restored automations for editing:", restoredAutomations);
  //     setDrawerAutomations(restoredAutomations);
  //     setStageSelected(stageIndex);
  //     setIsDrawerOpen(true);
  //   } else {
  //     console.log("No existing automations to edit");
  //   }
  // };
const handleEditAutomations = (stageIndex) => {
  const stage = stages[stageIndex];
  if (stage && stage.automations && stage.automations.length > 0) {
    // Restore automations with proper template and tag objects
    const restoredAutomations = stage.automations.map(automation => {
      const restoredAutomation = { ...automation };
      
      // Restore template object based on automation type
      if (automation.selectedtemp) {
        let templateOptions = [];
        switch (automation.type) {
          case "Create Task":
            templateOptions = taskTemplateOptions;
            break;
          case "Send Email":
            templateOptions = emailTemplateOptions;
            break;
          case "Send message":
            templateOptions = chatTemplateOptions;
            break;
          case "Send Invoice":
            templateOptions = invoiceTemplateOptions;
            break;
          case "Send Proposal/Els":
            templateOptions = proposalElsOptions;
            break;
          case "Apply folder template":
            templateOptions = optionfolder;
            break;
          case "Create Organizer":
            templateOptions = organizerOptions;
            break;
          default:
            templateOptions = [];
        }
        
        // Find the template object
        const templateObj = templateOptions.find(opt => opt.value === automation.selectedtemp);
        restoredAutomation.selectedtemp = templateObj || null;
      }
      
      // Restore tags as objects (not just IDs)
      if (automation.selectedTags && Array.isArray(automation.selectedTags)) {
        restoredAutomation.selectedTags = automation.selectedTags.map(tagId => 
          filteredTags.find(tag => tag._id === tagId)
        ).filter(Boolean);
      }
      
      // SPECIAL: Restore addTags and removeTags for "Update account tags"
      if (automation.type === "Update account tags") {
        if (automation.addTags && Array.isArray(automation.addTags)) {
          restoredAutomation.addTags = automation.addTags.map(tagId => 
            tags.find(tag => tag.value === tagId || tag._id === tagId)
          ).filter(Boolean);
        }
        
        if (automation.removeTags && Array.isArray(automation.removeTags)) {
          restoredAutomation.removeTags = automation.removeTags.map(tagId => 
            tags.find(tag => tag.value === tagId || tag._id === tagId)
          ).filter(Boolean);
        }
      }
      
      // FIX: Restore job assignees for "Update job assignees" - CORRECT FIELD NAMES
      if (automation.type === "Update job assignees") {
        console.log("Restoring Update job assignees automation:", automation);
        
        // Restore selectedAssignees (to add)
        if (automation.selectedAssignees && Array.isArray(automation.selectedAssignees)) {
          restoredAutomation.selectedAssignees = automation.selectedAssignees.map(assigneeId => 
            users.find(user => user._id === assigneeId || user.value === assigneeId)
          ).filter(Boolean);
          console.log("Restored selectedAssignees:", restoredAutomation.selectedAssignees);
        }
        
        // Restore assigneesToRemove (to remove)  
        if (automation.assigneesToRemove && Array.isArray(automation.assigneesToRemove)) {
          restoredAutomation.assigneesToRemove = automation.assigneesToRemove.map(assigneeId => 
            users.find(user => user._id === assigneeId || user.value === assigneeId)
          ).filter(Boolean);
          console.log("Restored assigneesToRemove:", restoredAutomation.assigneesToRemove);
        }
      }
      
      // Restore client status
      if (automation.selectedClientStatus) {
        const statusObj = optionstatus.find(opt => opt.value === automation.selectedClientStatus);
        restoredAutomation.selectedClientStatus = statusObj || null;
      }
      
      // Restore status
      if (automation.status !== undefined && automation.status !== null) {
        const statusObj = statusOptions.find(opt => opt.value === automation.status);
        restoredAutomation.status = statusObj || null;
      }
      
      return restoredAutomation;
    });
    console.log("Restored automations for editing:", restoredAutomations);
    setDrawerAutomations(restoredAutomations);
    setStageSelected(stageIndex);
    setIsDrawerOpen(true);
  } else {
    console.log("No existing automations to edit");
  }
};
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setAutomationSelect(null);
    setDrawerAutomations([]);
  };

  // Drawer menu handlers
  const handleDrawerMenuOpen = (event) => {
    setDrawerAnchorEl(event.currentTarget);
  };

  const handleDrawerMenuClose = () => {
    setDrawerAnchorEl(null);
  };

  const handleDrawerMenuItemSelect = (option) => {
    const newIndex = drawerAutomations.length + 1;
    const newAutomation = { 
      type: option, 
      index: newIndex,
      id: Date.now() + Math.random(),
      // Initialize automation-specific state
      selectedtemp: null,
      selectedTags: [],
      reminderChecked: false,
      daysuntilNextReminder: "",
      noOfReminder: "",
      addTags: [],
      removeTags: [],
      selectedAssignees: [],
      assigneesToRemove: [],
      status: null,
      selectedClientStatus: null,
      clientDescription: ""
    };
    
    setDrawerAutomations(prev => [...prev, newAutomation]);
    handleDrawerMenuClose();
  };

  // Delete automation from drawer
  const handleDeleteAutomation = (automationIndex) => {
    setDrawerAutomations(prev => {
      const updatedAutomations = prev.filter((_, idx) => idx !== automationIndex);
      return updatedAutomations.map((automation, idx) => ({
        ...automation,
        index: idx + 1
      }));
    });
  };

  // Update automation state
  const updateAutomationState = (automationIndex, updates) => {
    setDrawerAutomations(prev => 
      prev.map((automation, idx) => 
        idx === automationIndex ? { ...automation, ...updates } : automation
      )
    );
  };

  // Conditions handlers
  const handleAddConditions = (automationIndex) => {
    const automation = drawerAutomations[automationIndex];
    // Set the current automation index and pre-populate with existing tags
    setCurrentAutomationIndex(automationIndex);
    setTempSelectedTags(automation.selectedTags || []);
    setSearchTerm("");
    setIsConditionsFormOpen(true);
  };

  const handleGoBack = () => {
    setIsConditionsFormOpen(false);
    setCurrentAutomationIndex(null);
    setTempSelectedTags([]);
    setSearchTerm("");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (tag) => {
    setTempSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddTags = () => {
    if (currentAutomationIndex !== null) {
      updateAutomationState(currentAutomationIndex, {
        selectedTags: tempSelectedTags
      });
    }
    handleGoBack();
  };

  // Template selection handler
  const handletemp = (newValue, automationType, automationIndex) => {
    updateAutomationState(automationIndex, { selectedtemp: newValue });
  };

  const handleSaveAllAutomations = () => {
    if (stageSelected === null) {
      console.error("No stage selected!");
      return;
    }
    
    if (drawerAutomations.length === 0) {
      console.error("No automations to save!");
      return;
    }
    
    console.log("Saving all automations to stage:", stageSelected);
    console.log("Automations to save:", drawerAutomations);
    
    // Map automation types to their corresponding ref models
    const automationTypeToRefModel = {
      "Create Task": "TaskTemplate",
      "Send Email": "EmailTemplate", 
      "Send message": "ChatTemplate",
      "Send Invoice": "InvoiceTemplate",
      "Send Proposal/Els": "ProposalTemplate",
      "Apply folder template": "FolderTemplate",
      "Create Organizer": "OrganizerTemplate",
      "Update client-facing job status": null,
      "Update account tags": null,
      "Update job assignees": null
    };
     
    // Prepare automations with template, tags, and refModel
    const automationsWithDetails = drawerAutomations.map(automation => {
      const refModel = automationTypeToRefModel[automation.type];
      
      // Base automation object
      const automationData = {
        ...automation,
        // Store template details and refModel
        selectedtemp: automation.selectedtemp ? automation.selectedtemp.value : null,
        refModel: refModel,
        templateRefModel: refModel,
        // Store tag IDs for conditions
        selectedTags: automation.selectedTags ? automation.selectedTags.map(tag => tag._id) : [],
          // Store client status and description
      selectedClientStatus: automation.selectedClientStatus ? automation.selectedClientStatus.value : null,
      status: automation.status ? automation.status.value : null,
      clientDescription: automation.clientDescription || ""
      };
console.log("Preparing automation for saving:", automationData);
      // SPECIAL HANDLING FOR "Update account tags" AUTOMATION
      if (automation.type === "Update account tags") {
        // Store addTags and removeTags as arrays of tag IDs
        automationData.addTags = automation.addTags ? automation.addTags.map(tag => tag.value || tag._id) : [];
        automationData.removeTags = automation.removeTags ? automation.removeTags.map(tag => tag.value || tag._id) : [];
        
        console.log("Update account tags automation data:", {
          addTags: automationData.addTags,
          removeTags: automationData.removeTags,
          originalAddTags: automation.addTags,
          originalRemoveTags: automation.removeTags
        });
      } else {
        // For other automation types, ensure these fields are empty arrays
        automationData.addTags = [];
        automationData.removeTags = [];
      }

      // Store assignee IDs (for "Update job assignees" automation)
        // Store assignee IDs (for "Update job assignees" automation)
    automationData.selectedAssignees = automation.selectedAssignees ? automation.selectedAssignees.map(user => user.value || user._id) : [];
    automationData.assigneesToRemove = automation.assigneesToRemove ? automation.assigneesToRemove.map(user => user.value || user._id) : [];

      return automationData;
    });

    console.log("Automations prepared for saving:", automationsWithDetails);
    
    // Call the parent function to save automations to the stage
    if (handleSaveAutomations) {
      handleSaveAutomations(stageSelected, automationsWithDetails);
    }
    
    alert(`Successfully saved ${drawerAutomations.length} automation(s) to stage ${stageSelected + 1}`);
    
    // Close the drawer after saving
    handleDrawerClose();
  };

  

  // Delete saved automation from stage
  const handleDeleteSavedAutomation = (stageIndex, automationIndex) => {
    if (handleSaveAutomations) {
      const stage = stages[stageIndex];
      if (stage && stage.automations) {
        const updatedAutomations = stage.automations.filter((_, idx) => idx !== automationIndex);
        handleSaveAutomations(stageIndex, updatedAutomations);
      }
    }
  };

  // Your complex renderActionContent function
  const renderActionContent = (automation, index) => {
    const automationSelect = automation.type;
    const automationIndex = index;

    // Helper function to get selected tags for this automation
    const selectedTags = automation.selectedTags || [];
    const selectedTagElements = selectedTags.map((tag, idx) => (
      <Chip
        key={idx}
        label={tag.tagName}
        sx={{
          backgroundColor: tag.tagColour,
          color: "#fff",
          fontWeight: "500",
          borderRadius: "20px",
          marginRight: 1,
        }}
      />
    ));

    switch (automationSelect) {
      case "Create Task":
        return (
          <>
            <Grid item>
              <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
                <Typography gutterBottom>{automationSelect}</Typography>
                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={taskTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={automation.selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue, automationSelect, automationIndex)}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ backgroundColor: "#fff" }}
                      placeholder="Select Template"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape
                />
                <Box mt={2}>
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </Button>
              </Box>
            </Grid>
          </>
        );

      case "Send Email":
        return (
          <>
            <Grid item>
              <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
                <Typography gutterBottom>{automationSelect}</Typography>
                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={emailTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={automation.selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue, automationSelect, automationIndex)}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ backgroundColor: "#fff" }}
                      placeholder="Select Template"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape
                />
                <Box mt={2}>
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </Button>
              </Box>
            </Grid>
          </>
        );

      case "Send message":
        return (
          <>
            <Grid item>
              <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
                <Typography gutterBottom>{automationSelect}</Typography>
                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={chatTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={automation.selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue, automationSelect, automationIndex)}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ backgroundColor: "#fff" }}
                      placeholder="Select Template"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape
                />
                <Box mt={2}>
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </Button>
              </Box>
            </Grid>
          </>
        );

      case "Send Invoice":
        return (
          <>
            <Grid item>
              <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
                <Typography gutterBottom>{automationSelect}</Typography>
                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={invoiceTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={automation.selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue, automationSelect, automationIndex)}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ backgroundColor: "#fff" }}
                      placeholder="Select Template"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape
                />
                <Box mt={2}>
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </Button>
              </Box>
            </Grid>
          </>
        );

      case "Send Proposal/Els":
        return (
          <>
            <Grid item>
              <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
                <Typography gutterBottom>{automationSelect}</Typography>
                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={proposalElsOptions}
                  getOptionLabel={(option) => option.label}
                  value={automation.selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue, automationSelect, automationIndex)}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ backgroundColor: "#fff" }}
                      placeholder="Select Template"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape
                />
                <Box mt={2}>
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </Button>
              </Box>
            </Grid>
          </>
        );

      case "Apply folder template":
        return (
          <>
            <Grid item>
              <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
                <Typography gutterBottom>{automationSelect}</Typography>
                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={optionfolder}
                  getOptionLabel={(option) => option.label}
                  value={automation.selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue, automationSelect, automationIndex)}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ backgroundColor: "#fff" }}
                      placeholder="Select Template"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape
                />
                <Box mt={2}>
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </Button>
              </Box>
            </Grid>
          </>
        );

      case "Create Organizer":
        return (
          <>
            <Grid item>
              <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
                <Typography gutterBottom>{automationSelect}</Typography>
                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={organizerOptions}
                  getOptionLabel={(option) => option.label}
                  value={automation.selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue, automationSelect, automationIndex)}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ backgroundColor: "#fff" }}
                      placeholder="Select Template"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape
                />
                <Box mt={2}>
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </Button>
              </Box>
            </Grid>
          </>
        );

      // case "Update client-facing job status":
      //   return (
      //     <>
      //       <Grid item>
      //         <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
      //           <Typography gutterBottom>{automationSelect}</Typography>
                
      //           <Typography gutterBottom fontSize={"12px"}>
      //             The client-facing status will update automatically as soon as
      //             the job enters the stage. Your clients will see it in their
      //             client portal.
      //           </Typography>
               
      //           <InputLabel sx={{ color: "black", mb: 1,mt:2 }}>
      //             Visibility for client
      //           </InputLabel>
      //           <Autocomplete
      //             options={statusOptions}
      //             getOptionLabel={(option) => option.label}
      //             value={automation.status || status}
      //             onChange={(event, newValue) => updateAutomationState(automationIndex, { status: newValue })}
      //             renderInput={(params) => (
      //               <TextField
      //                 {...params}
      //                 size="small"
      //                 variant="outlined"
      //                 placeholder="Select status"
      //               />
      //             )}
      //             fullWidth
      //           />
               
      //           {(automation.status?.value === true || status?.value === true) && (
      //             <Box>
      //               <Box>
      //                 <InputLabel sx={{ color: "black", mb: 1, mt: 1 }}>
      //                   Select status
      //                 </InputLabel>
      //                 <Autocomplete
      //                   options={optionstatus}
      //                   size="small"
      //                   sx={{ mt: 1 }}
      //                   value={automation.selectedClientStatus || selectedClientStatus}
      //                   onChange={(event, newValue) => updateAutomationState(automationIndex, { selectedClientStatus: newValue })}
      //                   getOptionLabel={(option) => option.label}
      //                   isOptionEqualToValue={(option, value) =>
      //                     option.value === value.value
      //                   }
      //                   renderOption={(props, option) => (
      //                     <Box component="li" {...props}>
      //                       <Chip
      //                         size="small"
      //                         style={{
      //                           backgroundColor: option.clientfacingColour,
      //                           marginRight: 8,
      //                           marginLeft: 8,
      //                           borderRadius: "50%",
      //                           height: "15px",
      //                         }}
      //                       />
      //                       {option.label}
      //                     </Box>
      //                   )}
      //                   renderInput={(params) => (
      //                     <TextField
      //                       {...params}
      //                       placeholder="Select status"
      //                       InputProps={{
      //                         ...params.InputProps,
      //                         startAdornment:
      //                           params.inputProps.value &&
      //                           clientFacingJobs.length > 0 ? (
      //                             <Chip
      //                               size="small"
      //                               style={{
      //                                 backgroundColor: clientFacingJobs.find(
      //                                   (job) =>
      //                                     job.clientfacingName ===
      //                                     params.inputProps.value
      //                                 )?.clientfacingColour,
      //                                 marginRight: 8,
      //                                 marginLeft: 2,
      //                                 borderRadius: "50%",
      //                                 height: "15px",
      //                               }}
      //                             />
      //                           ) : null,
      //                       }}
      //                     />
      //                   )}
      //                 />
      //               </Box>
      //               <Box mt={1}>
      //                 <InputLabel sx={{ color: "black", mb: 1 }}>
      //                   Status description for client
      //                 </InputLabel>
      //                 <TextField
      //                   fullWidth
      //                   multiline
      //                   rows={4}
      //                   variant="outlined"
      //                   value={automation.clientDescription || clientDescription}
      //                   onChange={(e) => updateAutomationState(automationIndex, { clientDescription: e.target.value })}
      //                   placeholder="Status description for client"
      //                 />
      //                 <Typography variant="caption" color="textSecondary">
      //                   {(automation.clientDescription || clientDescription).length}/{maxDescriptionLength}
      //                 </Typography>
      //               </Box>
      //             </Box>
      //           )}

      //           <Box mt={2}>
      //             {selectedTags.length > 0 && (
      //               <Grid container alignItems="center" gap={1}>
      //                 <Typography>Only for:</Typography>
      //                 <Grid item>{selectedTagElements}</Grid>
      //               </Grid>
      //             )}
      //           </Box>
      //           <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
      //             {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
      //           </Button>
      //         </Box>
      //       </Grid>
      //     </>
      //   );
case "Update client-facing job status":
  return (
    <>
      <Grid item>
        <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
          <Typography gutterBottom>{automationSelect}</Typography>
          
          <Typography gutterBottom fontSize={"12px"}>
            The client-facing status will update automatically as soon as
            the job enters the stage. Your clients will see it in their
            client portal.
          </Typography>
         
          <InputLabel sx={{ color: "black", mb: 1,mt:2 }}>
            Visibility for client
          </InputLabel>
          <Autocomplete
            options={statusOptions}
            getOptionLabel={(option) => option.label}
            value={automation.status || status}
            onChange={(event, newValue) => updateAutomationState(automationIndex, { status: newValue })}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="outlined"
                placeholder="Select status"
              />
            )}
            fullWidth
          />
         
          {(automation.status?.value === true || status?.value === true) && (
            <Box>
              <Box>
                <InputLabel sx={{ color: "black", mb: 1, mt: 1 }}>
                  Select status
                </InputLabel>
                <Autocomplete
                  options={optionstatus}
                  size="small"
                  sx={{ mt: 1 }}
                  value={automation.selectedClientStatus || selectedClientStatus}
                  onChange={(event, newValue) => handleClientStatusSelection(event, newValue, automationIndex)}
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
                      placeholder="Select status"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment:
                          params.inputProps.value &&
                          clientFacingJobs.length > 0 ? (
                            <Chip
                              size="small"
                              style={{
                                backgroundColor: clientFacingJobs.find(
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
              
              {/* Show selected status preview */}
              {/* {automation.selectedClientStatus && (
                <Box sx={{ mt: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Selected Status Preview:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Chip 
                      label={automation.selectedClientStatus.label}
                      size="small"
                      sx={{
                        backgroundColor: automation.selectedClientStatus.clientfacingColour,
                        color: "#fff"
                      }}
                    />
                  </Box>
                </Box>
              )} */}
              
              <Box mt={1}>
                <InputLabel sx={{ color: "black", mb: 1 }}>
                  Status description for client
                </InputLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={automation.clientDescription || clientDescription}
                  onChange={(e) => updateAutomationState(automationIndex, { clientDescription: e.target.value })}
                  placeholder="Status description for client"
                />
                <Typography variant="caption" color="textSecondary">
                  {(automation.clientDescription || clientDescription).length}/{maxDescriptionLength}
                </Typography>
              </Box>
            </Box>
          )}

          <Box mt={2}>
            {selectedTags.length > 0 && (
              <Grid container alignItems="center" gap={1}>
                <Typography>Only for:</Typography>
                <Grid item>{selectedTagElements}</Grid>
              </Grid>
            )}
          </Box>
          <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
            {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
          </Button>
        </Box>
      </Grid>
    </>
  );
      case "Update account tags":
        return (
          <>
            <Grid item>
              <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
                <Typography gutterBottom>{automationSelect}</Typography>
                
                {/* Add Tags Section */}
                <Typography fontWeight={600} mt={1}>Add Tags</Typography>
                <TagsMultiSelectDropDown
                  value={automation.addTags || []}
                  onChange={(newValue) => updateAutomationState(automationIndex, { addTags: newValue })}
                  options={tags.filter(tag => 
                    tag && 
                    tag.value && 
                    tag.label &&
                    !(automation.removeTags || []).some(removeTag => removeTag && removeTag.value === tag.value)
                  )}
                  placeholder="Select tags to ADD"
                />

                {/* Remove Tags Section */}
                <Typography fontWeight={600} mt={3}>Remove Tags</Typography>
                <TagsMultiSelectDropDown
                  value={automation.removeTags || []}
                  onChange={(newValue) => updateAutomationState(automationIndex, { removeTags: newValue })}
                  options={tags.filter(tag => 
                    tag && 
                    tag.value && 
                    tag.label &&
                    !(automation.addTags || []).some(addTag => addTag && addTag.value === tag.value)
                  )}
                  placeholder="Select tags to REMOVE"
                />

                {/* Conditions Section */}
                <Box mt={2}>
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </Button>
              </Box>
            </Grid>
          </>
        );
  case "Update job assignees":
        return (
          <>
            <Grid item>
              <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
                <Typography gutterBottom>{automationSelect}</Typography>
                
                {/* Add Tags Section */}
                <Typography fontWeight={600} mt={1}>Add Job Assignes</Typography>
                <MultiSelectDropdown
                  value={automation.selectedAssignees || []}
                  onChange={(newValue) => updateAutomationState(automationIndex, { selectedAssignees: newValue })}
                  options={users.filter(user => 
                    user && 
                    user.value && 
                    user.label &&
                    !(automation.assigneesToRemove || []).some(assigneesToRemove => assigneesToRemove && assigneesToRemove.value === user.value)
                  )}
                  placeholder="Select Assignees to ADD"
                />

                {/* Remove Tags Section */}
                <Typography fontWeight={600} mt={3}>Remove Job Assignes</Typography>
                <MultiSelectDropdown
                  value={automation.assigneesToRemove || []}
                  onChange={(newValue) => updateAutomationState(automationIndex, { assigneesToRemove: newValue })}
                  options={users.filter(user => 
                    user && 
                    user.value && 
                    user.label &&
                    !(automation.selectedAssignees || []).some(selectedAssignees => selectedAssignees && selectedAssignees.value === user.value)
                  )}
                  placeholder="Select Assignees to REMOVE"
                />

                {/* Conditions Section */}
                <Box mt={2}>
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </Button>
              </Box>
            </Grid>
          </>
        );
      default:
        return (
          <Box>
            <Typography variant="h6">{automationSelect} Automation</Typography>
            <Typography>Configure your {automationSelect.toLowerCase()} automation settings here...</Typography>
          </Box>
        );
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Stages</Typography>

        <Button
          variant="contained"
          startIcon={<FiPlusCircle />}
          onClick={() => handleAddStage(stages.length)}
          sx={{
            backgroundColor: "var(--color-save-btn)",
            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)",
            },
            borderRadius: "15px",
          }}
        >
          Add stage
        </Button>
      </Box>

      {/* Scroll Area */}
      <Box
        sx={{
          display: "flex",
          gap: "25px",
          flexDirection: { xs: "column", sm: "row" },
          marginBottom: "10px",
        }}
      >
        <Box
          className="stage-scroll"
          sx={{
            display: "flex",
            gap: "15px",
            overflowX: "auto",
            whiteSpace: "nowrap",
            paddingBottom: "8px",
            maxWidth: "100%",
            maxHeight: "500px",
          }}
        >
          {stages.map((stage, index) => (
            <React.Fragment key={index}>
              {/* Stage Card */}
              <Box
                sx={{
                  minWidth: "250px",
                  height: "auto",
                  maxWidth: "270px",
                  padding: "20px",
                  backgroundColor: "#f2f2f7ff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  flexShrink: 0,
                  maxHeight: "500px",
                  overflowY: "auto",
                }}
              >
                <Box>
                  {/* Header With Edit/Delete */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <RxDragHandleDots2 />

                    <TextField
                      variant="standard"
                      placeholder="Stage Name"
                      fullWidth
                      size="small"
                      value={stage.name}
                      onChange={(e) => handleStageNameChange(e, index)}
                      error={!!stageNameErrors[index]}
                      helperText={stageNameErrors[index]}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <LuPenLine style={{ fontSize: "12px" }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <IconButton
                      onClick={() => handleDeleteStage(index)}
                      sx={{ color: "red" }}
                    >
                      <RiDeleteBin6Line />
                    </IconButton>
                  </Box>

                  <Divider />

                  {/* Content */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Stage conditions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {index === 0
                        ? "First stage can't have conditions"
                        : index === stages.length - 1
                        ? "Last stage can't have conditions"
                        : "Job enters this stage if conditions are met"}
                    </Typography>

                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ mt: 2 }}
                    >
                      Automations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Triggered when job enters stage
                    </Typography>

                    <Box sx={{ mt: 1, mb: 1 }}>
                      {stage.automations && stage.automations.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {stage.automations.map((automation, autoIndex) => {
                            // Get template name based on automation type
                            const getTemplateName = () => {
                              if (!automation.selectedtemp) return null;
                              
                              switch (automation.type) {
                                case "Create Task":
                                  return taskTemplateOptions.find(opt => opt.value === automation.selectedtemp)?.label;
                                case "Send Email":
                                  return emailTemplateOptions.find(opt => opt.value === automation.selectedtemp)?.label;
                                case "Send message":
                                  return chatTemplateOptions.find(opt => opt.value === automation.selectedtemp)?.label;
                                case "Send Invoice":
                                  return invoiceTemplateOptions.find(opt => opt.value === automation.selectedtemp)?.label;
                                case "Send Proposal/Els":
                                  return proposalElsOptions.find(opt => opt.value === automation.selectedtemp)?.label;
                                case "Apply folder template":
                                  return optionfolder.find(opt => opt.value === automation.selectedtemp)?.label;
                                case "Create Organizer":
                                  return organizerOptions.find(opt => opt.value === automation.selectedtemp)?.label;
                                default:
                                  return null;
                              }
                            };

                            // Get tag details by ID
                            const getTagDetails = (tagId) => {
                              return filteredTags.find(tag => tag._id === tagId);
                            };

                            // Get tag details for addTags and removeTags (for Update account tags)
                            const getAddRemoveTagDetails = (tagIds) => {
                              if (!tagIds || !Array.isArray(tagIds)) return [];
                              return tagIds.map(tagId => filteredTags.find(tag => tag._id === tagId)).filter(Boolean);
                            };
                             // Get client-facing status details
      const getClientStatusDetails = () => {
        if (!automation.selectedClientStatus) return null;
        return optionstatus.find(opt => opt.value === automation.selectedClientStatus);
      };

                            const templateName = getTemplateName();
                            const tagDetails = automation.selectedTags ? automation.selectedTags.map(getTagDetails).filter(Boolean) : [];
                             const clientStatusDetails = getClientStatusDetails();
                            // SPECIAL: For "Update account tags", get addTags and removeTags details
                            const addTagDetails = automation.type === "Update account tags" ? 
                              getAddRemoveTagDetails(automation.addTags) : [];
                            const removeTagDetails = automation.type === "Update account tags" ? 
                              getAddRemoveTagDetails(automation.removeTags) : [];

                            return (
                              <Box 
                                key={automation.id || autoIndex}
                                sx={{
                                  p: 1.5,
                                  backgroundColor: 'white',
                                  borderRadius: '6px',
                                  border: '1px solid #e0e0e0',
                                  '&:hover': {
                                    backgroundColor: '#f9f9f9'
                                  }
                                }}
                              >
                                {/* Automation Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box 
                                      sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        backgroundColor: 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      {automation.index}
                                    </Box>
                                    <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                                      {automation.type}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    {/* <IconButton 
                                      size="small"
                                      onClick={() => handleEditAutomation(index, autoIndex)}
                                      sx={{ color: 'primary.main' }}
                                    >
                                      <LuPenLine size={14} />
                                    </IconButton> */}
                                    <IconButton 
                                      size="small"
                                      onClick={() => handleDeleteSavedAutomation(index, autoIndex)}
                                      sx={{ color: 'error.main' }}
                                    >
                                      <RiDeleteBin6Line size={14} />
                                    </IconButton>
                                  </Box>
                                </Box>

                                {/* Template Information */}
                                {templateName && (
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                      Template:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                      <Chip 
                                        label={templateName}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem' }}
                                      />
                                    </Box>
                                  </Box>
                                )}
  {/* SPECIAL: Display Client-Facing Status for "Update client-facing job status" */}
          {automation.type === "Update client-facing job status" && clientStatusDetails && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                Client Status:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: clientStatusDetails.clientfacingColour,
          }}
        />
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '0.7rem',
            fontWeight: '500'
          }}
        >
          {clientStatusDetails.label}
        </Typography>
      </Box>
      
                {automation.status === true && (
                  <Chip 
                    label="Visible to Client"
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontSize: '0.6rem' }}
                  />
                )}
              </Box>
              
              
            </Box>
          )}
                                {/* SPECIAL: Display Add Tags for "Update account tags" */}
                                {automation.type === "Update account tags" && addTagDetails.length > 0 && (
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                      Add Tags:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                      {addTagDetails.map((tag, tagIndex) => (
                                        <Chip
                                          key={tag._id}
                                          label={tag.tagName}
                                          size="small"
                                          sx={{
                                            backgroundColor: tag.tagColour,
                                            color: "#fff",
                                            fontWeight: "500",
                                            borderRadius: "20px",
                                            fontSize: '0.7rem'
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  </Box>
                                )}

                                {/* SPECIAL: Display Remove Tags for "Update account tags" */}
                                {automation.type === "Update account tags" && removeTagDetails.length > 0 && (
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                      Remove Tags:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                      {removeTagDetails.map((tag, tagIndex) => (
                                        <Chip
                                          key={tag._id}
                                          label={tag.tagName}
                                          size="small"
                                          sx={{
                                            backgroundColor: tag.tagColour,
                                            color: "#fff",
                                            fontWeight: "500",
                                            borderRadius: "20px",
                                            fontSize: '0.7rem'
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  </Box>
                                )}

   {/* Add Assignees - For "Update job assignees" */}
            {automation.type === "Update job assignees" && automation.selectedAssignees && automation.selectedAssignees.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  Add Assignees:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {automation.selectedAssignees.map((userId, userIndex) => {
                    const user = users.find(u => u.value === userId);
                    return user ? (
                      <Chip
                        key={user.value}
                        label={user.label}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.7rem'
                        }}
                      />
                    ) : null;
                  })}
                </Box>
              </Box>
            )}

            {/* Remove Assignees - For "Update job assignees" */}
            {automation.type === "Update job assignees" && automation.assigneesToRemove && automation.assigneesToRemove.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  Remove Assignees:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {automation.assigneesToRemove.map((userId, userIndex) => {
                    const user = users.find(u => u.value === userId);
                    return user ? (
                      <Chip
                        key={user.value}
                        label={user.label}
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{
                          fontSize: '0.7rem'
                        }}
                      />
                    ) : null;
                  })}
                </Box>
              </Box>
            )}

                                {/* Conditions Tags */}
                                {tagDetails.length > 0 && (
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                      Conditions:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                      {tagDetails.map((tag, tagIndex) => (
                                        <Chip
                                          key={tag._id}
                                          label={tag.tagName}
                                          size="small"
                                          sx={{
                                            backgroundColor: tag.tagColour,
                                            color: "#fff",
                                            fontWeight: "500",
                                            borderRadius: "20px",
                                            fontSize: '0.7rem'
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  </Box>
                                )}

                                {/* Additional automation details */}
                                {automation.reminderChecked && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                      Reminders:
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {automation.daysuntilNextReminder} days, {automation.noOfReminder} times
                                    </Typography>
                                  </Box>
                                )}

                                {/* Show refModel if available */}
                                {automation.refModel && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                      Ref Model:
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {automation.refModel}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No automations configured
                        </Typography>
                      )}
                    </Box>

                    {stage.automations && stage.automations.length > 0 ? (
                      <Button
                        variant="outlined"
                        startIcon={<LuPenLine />}
                        fullWidth
                        sx={{ 
                          mt: 1, 
                          borderRadius: "8px",
                          borderColor: "primary.main",
                          color: "primary.main",
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white'
                          }
                        }}
                        onClick={() => handleEditAutomations(index)}
                      >
                        Edit Automations ({stage.automations.length})
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        startIcon={<FiPlusCircle />}
                        fullWidth
                        sx={{ mt: 1, borderRadius: "8px" }}
                        onClick={(event) => handleAutomationMenuOpen(event, index)}
                      >
                        Add Automation
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>

              {index < stages.length - 1 && (
                <IconButton onClick={() => handleAddStage(index + 1)}>
                  <FiPlusCircle
                    style={{
                      color: "var(--color-save-btn)",
                      width: "25px",
                      height: "25px",
                    }}
                  />
                </IconButton>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Automation Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAutomationMenuClose}
        PaperProps={{
          style: {
            maxHeight: 200,
            overflowY: "auto",
          },
        }}
      >
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Email")}>
          Send Email
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Invoice")}>
          Send Invoice
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Proposal/Els")}>
          Send Proposal/Els
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Organizer")}>
          Create Organizer
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Apply folder template")}>
          Apply folder template
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update account tags")}>
          Update account tags
        </MenuItem>
        {/* <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update job assignees")}>
          Update job assignees
        </MenuItem> */}
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Task")}>
          Create Task
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send message")}>
          Send message
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update client-facing job status")}>
          Update client-facing job status
        </MenuItem>
      </Menu>

      {/* Automation Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{ 
          sx: { 
            width: { xs: "100%", sm: "600px", md: "700px" },
            padding: 2
          } 
        }}
      >
        <Box sx={{  display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5">
              {stageSelected !== null && stages[stageSelected]?.automations?.length > 0 
                ? `Edit Automations - Stage ${stageSelected + 1}` 
                : `Add Automations - Stage ${stageSelected !== null ? stageSelected + 1 : 'Loading...'}`
              }
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              <RiDeleteBin6Line />
            </IconButton>
          </Box>
          
          {/* Automation List - Scrollable area */}
          <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
            {drawerAutomations.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No automations added yet. Click "Add Another Automation" to get started.
                </Typography>
              </Box>
            ) : (
              drawerAutomations.map((automation, idx) => (
                <Box 
                  key={automation.id || idx} 
                  sx={{ 
                    mb: 3, 
                    p: 2, 
                    border: "1px solid #e0e0e0", 
                    borderRadius: "8px",
                    position: "relative"
                  }}
                >
                  <IconButton
                    onClick={() => handleDeleteAutomation(idx)}
                    sx={{ 
                      position: "absolute", 
                      top: 8, 
                      right: 8,
                      color: "red",
                      backgroundColor: "rgba(255,255,255,0.8)",
                      '&:hover': {
                        backgroundColor: "rgba(255,0,0,0.1)"
                      }
                    }}
                    size="small"
                  >
                    <RiDeleteBin6Line />
                  </IconButton>
                  
                  <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>
                    Automation {automation.index}: {automation.type}
                  </Typography>
                  {renderActionContent(automation, idx)}
                </Box>
              ))
            )}
          </Box>

          {/* Footer with Action Buttons */}
          <Box sx={{ borderTop: "1px solid #e0e0e0", pb:5,pt: 2 }}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" ,}}>
              <Button
                variant="outlined"
                startIcon={<FiPlusCircle />}
                onClick={handleDrawerMenuOpen}
                sx={{ borderRadius: "8px" }}
              >
                Add Another Automation
              </Button>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleSaveAllAutomations}
              disabled={drawerAutomations.length === 0 || stageSelected === null}
              sx={{
                backgroundColor: "var(--color-save-btn)",
                "&:hover": {
                  backgroundColor: "var(--color-save-hover-btn)",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                  color: "#666"
                },
                borderRadius: "8px",
                py: 1.5
              }}
            >
              {stageSelected === null 
                ? 'No Stage Selected' 
                : stages[stageSelected]?.automations?.length > 0 
                  ? `Update Automations (${drawerAutomations.length})`
                  : `Save Automations (${drawerAutomations.length})`
              }
            </Button>
          </Box>

          {/* Drawer Menu for Adding More Automations */}
          <Menu
            anchorEl={drawerAnchorEl}
            open={Boolean(drawerAnchorEl)}
            onClose={handleDrawerMenuClose}
            PaperProps={{
              style: {
                maxHeight: 200,
                overflowY: "auto",
              },
            }}
          >
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Email")}>
              Send Email
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Invoice")}>
              Send Invoice
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Proposal/Els")}>
              Send Proposal/Els
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Organizer")}>
              Create Organizer
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Apply folder template")}>
              Apply folder template
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Update account tags")}>
              Update account tags
            </MenuItem>
            {/* <MenuItem onClick={() => handleDrawerMenuItemSelect("Update job assignees")}>
              Update job assignees
            </MenuItem> */}
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Task")}>
              Create Task
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Send message")}>
              Send message
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Update client-facing job status")}>
              Update client-facing job status
            </MenuItem>
          </Menu>
        </Box>
      </Drawer>
     
      <Drawer
        anchor="right"
        open={isConditionsFormOpen}
        onClose={handleGoBack}
        BackdropProps={{ invisible: true }}
        PaperProps={{ sx: { width: "550px", padding: 2 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handleGoBack}>
            <IoMdArrowRoundBack fontSize="large" color="blue" />
          </IconButton>
          <Typography variant="h6">Add conditions</Typography>
        </Box>

        <Box sx={{ padding: 2 }}>
          <Typography variant="body1">
            Apply automation only for accounts with these tags
          </Typography>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
            }}
            sx={{ marginTop: 2 }}
          />

          <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
            {filteredConditionTags.map((tag) => (
              <Box
                key={tag._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  borderBottom: "1px solid grey",
                  paddingBottom: 1,
                }}
              >
                <Checkbox
                  checked={tempSelectedTags.some(selectedTag => selectedTag._id === tag._id)}
                  onChange={() => handleCheckboxChange(tag)}
                />
                <Chip
                  label={tag.tagName}
                  sx={{
                    backgroundColor: tag.tagColour,
                    color: "#fff",
                    fontWeight: "500",
                    borderRadius: "20px",
                    marginRight: 1,
                  }}
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={tempSelectedTags.length === 0}
              onClick={handleAddTags}
              sx={{
                backgroundColor: "var(--color-save-btn)",
                "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
                borderRadius: "15px",
                width: "80px",
              }}
            >
              {currentAutomationIndex !== null && drawerAutomations[currentAutomationIndex]?.selectedTags?.length > 0 ? "Update" : "Add"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleGoBack}
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
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default StagesSection;




import React, { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, GripVertical, X, ChevronLeft, Search } from "lucide-react";
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
      <span
        key={idx}
        className="inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold text-white mr-1 mb-1"
        style={{ backgroundColor: tag.tagColour }}
      >
        {tag.tagName}
      </span>
    ));

    switch (automationSelect) {
      case "Create Task":
        return (
          <>
            <div className="rounded-xl border-2 border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">{automationSelect}</p>
                <p className="text-xs text-slate-500 mb-1">Select template</p>
                <select
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={automation.selectedtemp?.value || ""}
                  onChange={(e) => { const opt = taskTemplateOptions.find(o => o.value === e.target.value); handletemp(opt || null, automationSelect, automationIndex); }}
                >
                  <option value="">Select Template</option>
                  {taskTemplateOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {selectedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    <span className="text-xs text-slate-500">Only for:</span>{selectedTagElements}
                  </div>
                )}
                <button type="button" onClick={() => handleAddConditions(automationIndex)} className="mt-2 text-xs text-indigo-600 hover:underline">
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </button>
            </div>
          </>
        );

      case "Send Email":
        return (
          <>
            <div className="rounded-xl border-2 border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">{automationSelect}</p>
                <p className="text-xs text-slate-500 mb-1">Select template</p>
                <select
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={automation.selectedtemp?.value || ""}
                  onChange={(e) => { const opt = emailTemplateOptions.find(o => o.value === e.target.value); handletemp(opt || null, automationSelect, automationIndex); }}
                >
                  <option value="">Select Template</option>
                  {emailTemplateOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {selectedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    <span className="text-xs text-slate-500">Only for:</span>{selectedTagElements}
                  </div>
                )}
                <button type="button" onClick={() => handleAddConditions(automationIndex)} className="mt-2 text-xs text-indigo-600 hover:underline">
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </button>
            </div>
          </>
        );

      case "Send message":
        return (
          <>
            <div className="rounded-xl border-2 border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">{automationSelect}</p>
                <p className="text-xs text-slate-500 mb-1">Select template</p>
                <select
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={automation.selectedtemp?.value || ""}
                  onChange={(e) => { const opt = chatTemplateOptions.find(o => o.value === e.target.value); handletemp(opt || null, automationSelect, automationIndex); }}
                >
                  <option value="">Select Template</option>
                  {chatTemplateOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {selectedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    <span className="text-xs text-slate-500">Only for:</span>{selectedTagElements}
                  </div>
                )}
                <button type="button" onClick={() => handleAddConditions(automationIndex)} className="mt-2 text-xs text-indigo-600 hover:underline">
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </button>
            </div>
          </>
        );

      case "Send Invoice":
        return (
          <>
            <div className="rounded-xl border-2 border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">{automationSelect}</p>
                <p className="text-xs text-slate-500 mb-1">Select template</p>
                <select
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={automation.selectedtemp?.value || ""}
                  onChange={(e) => { const opt = invoiceTemplateOptions.find(o => o.value === e.target.value); handletemp(opt || null, automationSelect, automationIndex); }}
                >
                  <option value="">Select Template</option>
                  {invoiceTemplateOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {selectedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    <span className="text-xs text-slate-500">Only for:</span>{selectedTagElements}
                  </div>
                )}
                <button type="button" onClick={() => handleAddConditions(automationIndex)} className="mt-2 text-xs text-indigo-600 hover:underline">
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </button>
            </div>
          </>
        );

      case "Send Proposal/Els":
        return (
          <>
            <div className="rounded-xl border-2 border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">{automationSelect}</p>
                <p className="text-xs text-slate-500 mb-1">Select template</p>
                <select
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={automation.selectedtemp?.value || ""}
                  onChange={(e) => { const opt = proposalElsOptions.find(o => o.value === e.target.value); handletemp(opt || null, automationSelect, automationIndex); }}
                >
                  <option value="">Select Template</option>
                  {proposalElsOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {selectedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    <span className="text-xs text-slate-500">Only for:</span>{selectedTagElements}
                  </div>
                )}
                <button type="button" onClick={() => handleAddConditions(automationIndex)} className="mt-2 text-xs text-indigo-600 hover:underline">
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </button>
            </div>
          </>
        );

      case "Apply folder template":
        return (
          <>
            <div className="rounded-xl border-2 border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">{automationSelect}</p>
                <p className="text-xs text-slate-500 mb-1">Select template</p>
                <select
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={automation.selectedtemp?.value || ""}
                  onChange={(e) => { const opt = optionfolder.find(o => o.value === e.target.value); handletemp(opt || null, automationSelect, automationIndex); }}
                >
                  <option value="">Select Template</option>
                  {optionfolder.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {selectedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    <span className="text-xs text-slate-500">Only for:</span>{selectedTagElements}
                  </div>
                )}
                <button type="button" onClick={() => handleAddConditions(automationIndex)} className="mt-2 text-xs text-indigo-600 hover:underline">
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </button>
            </div>
          </>
        );

      case "Create Organizer":
        return (
          <>
            <div className="rounded-xl border-2 border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">{automationSelect}</p>
                <p className="text-xs text-slate-500 mb-1">Select template</p>
                <select
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={automation.selectedtemp?.value || ""}
                  onChange={(e) => { const opt = organizerOptions.find(o => o.value === e.target.value); handletemp(opt || null, automationSelect, automationIndex); }}
                >
                  <option value="">Select Template</option>
                  {organizerOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {selectedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    <span className="text-xs text-slate-500">Only for:</span>{selectedTagElements}
                  </div>
                )}
                <button type="button" onClick={() => handleAddConditions(automationIndex)} className="mt-2 text-xs text-indigo-600 hover:underline">
                  {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
                </button>
            </div>
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
      <div className="rounded-xl border-2 border-slate-200 p-4 space-y-3">
        <p className="text-sm font-semibold text-slate-700">{automationSelect}</p>
        <p className="text-xs text-slate-500">The client-facing status will update automatically as soon as the job enters the stage.</p>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Visibility for client</label>
          <select
            className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={automation.status?.value !== undefined ? String(automation.status.value) : ""}
            onChange={(e) => { const opt = statusOptions.find(o => String(o.value) === e.target.value); updateAutomationState(automationIndex, { status: opt || null }); }}
          >
            <option value="">Select status</option>
            {statusOptions.map(o => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
          </select>
        </div>
        {(automation.status?.value === true || status?.value === true) && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Select status</label>
              <select
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={automation.selectedClientStatus?.value || ""}
                onChange={(e) => { const opt = optionstatus.find(o => o.value === e.target.value); handleClientStatusSelection(null, opt || null, automationIndex); }}
              >
                <option value="">Select status</option>
                {optionstatus.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status description for client</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                value={automation.clientDescription || clientDescription}
                onChange={(e) => updateAutomationState(automationIndex, { clientDescription: e.target.value })}
                placeholder="Status description for client"
              />
              <p className="text-xs text-slate-400 text-right">{(automation.clientDescription || clientDescription).length}/{maxDescriptionLength}</p>
            </div>
          </div>
        )}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-slate-500">Only for:</span>{selectedTagElements}
          </div>
        )}
        <button type="button" onClick={() => handleAddConditions(automationIndex)} className="text-xs text-indigo-600 hover:underline">
          {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
        </button>
      </div>
    </>
  );
      case "Update account tags":
        return (
          <>
            <div className="rounded-xl border-2 border-slate-200 p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-700">{automationSelect}</p>
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">Add Tags</p>
                <TagsMultiSelectDropDown
                  value={automation.addTags || []}
                  onChange={(newValue) => updateAutomationState(automationIndex, { addTags: newValue })}
                  options={tags.filter(tag => tag && tag.value && tag.label && !(automation.removeTags || []).some(r => r && r.value === tag.value))}
                  placeholder="Select tags to ADD"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">Remove Tags</p>
                <TagsMultiSelectDropDown
                  value={automation.removeTags || []}
                  onChange={(newValue) => updateAutomationState(automationIndex, { removeTags: newValue })}
                  options={tags.filter(tag => tag && tag.value && tag.label && !(automation.addTags || []).some(a => a && a.value === tag.value))}
                  placeholder="Select tags to REMOVE"
                />
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs text-slate-500">Only for:</span>{selectedTagElements}
                </div>
              )}
              <button type="button" onClick={() => handleAddConditions(automationIndex)} className="text-xs text-indigo-600 hover:underline">
                {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
              </button>
            </div>
          </>
        );
  case "Update job assignees":
        return (
          <>
            <div className="rounded-xl border-2 border-slate-200 p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-700">{automationSelect}</p>
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">Add Job Assignees</p>
                <MultiSelectDropdown
                  value={automation.selectedAssignees || []}
                  onChange={(newValue) => updateAutomationState(automationIndex, { selectedAssignees: newValue })}
                  options={users.filter(u => u && u.value && u.label && !(automation.assigneesToRemove || []).some(r => r && r.value === u.value))}
                  placeholder="Select Assignees to ADD"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">Remove Job Assignees</p>
                <MultiSelectDropdown
                  value={automation.assigneesToRemove || []}
                  onChange={(newValue) => updateAutomationState(automationIndex, { assigneesToRemove: newValue })}
                  options={users.filter(u => u && u.value && u.label && !(automation.selectedAssignees || []).some(s => s && s.value === u.value))}
                  placeholder="Select Assignees to REMOVE"
                />
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs text-slate-500">Only for:</span>{selectedTagElements}
                </div>
              )}
              <button type="button" onClick={() => handleAddConditions(automationIndex)} className="text-xs text-indigo-600 hover:underline">
                {selectedTags.length > 0 ? "Edit Conditions" : "Add Conditions"}
              </button>
            </div>
          </>
        );
      default:
        return (
          <div className="p-3">
            <p className="text-sm font-semibold">{automationSelect} Automation</p>
            <p className="text-xs text-slate-500">Configure your {automationSelect.toLowerCase()} automation settings here...</p>
          </div>
        );
    }
  };

  const menuRef = useRef(null);
  const drawerMenuRef = useRef(null);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-slate-800">Stages</h2>
        <button
          type="button"
          onClick={() => handleAddStage(stages.length)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Stage
        </button>
      </div>

      {/* Stages Scroll Area */}
      <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
          {stages.map((stage, index) => (
            <React.Fragment key={index}>
              {/* Stage Card */}
              <div className="flex-shrink-0 w-[260px] bg-slate-100 rounded-xl p-4 shadow-sm border border-slate-200 max-h-[520px] overflow-y-auto">
                  {/* Header With Edit/Delete */}
                  <div className="flex items-center gap-2 mb-3">
                    <GripVertical className="h-4 w-4 text-slate-400 cursor-grab" />
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2 pr-7 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Stage Name"
                        value={stage.name}
                        onChange={(e) => handleStageNameChange(e, index)}
                      />
                      <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteStage(index)}
                      className="p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {stageNameErrors[index] && (
                    <p className="text-xs text-red-500 mb-2">{stageNameErrors[index]}</p>
                  )}

                  <hr className="border-slate-200 mb-3" />

                  {/* Content */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-700">Stage conditions</p>
                    <p className="text-xs text-slate-500">
                      {index === 0
                        ? "First stage can't have conditions"
                        : index === stages.length - 1
                        ? "Last stage can't have conditions"
                        : "Job enters this stage if conditions are met"}
                    </p>

                    <p className="text-xs font-semibold text-slate-700 pt-2">Automations</p>
                    <p className="text-xs text-slate-500">Triggered when job enters stage</p>

                    <div className="mt-2 mb-2 space-y-2">
                      {stage.automations && stage.automations.length > 0 ? (
                        <div className="flex flex-col gap-2">
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
                              <div
                                key={automation.id || autoIndex}
                                className="p-2.5 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                              >
                                {/* Automation Header */}
                                <div className="flex items-center justify-between mb-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                                      {automation.index}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-700">{automation.type}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSavedAutomation(index, autoIndex)}
                                    className="p-0.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {templateName && (
                                  <div className="mb-1">
                                    <span className="text-[10px] font-semibold text-slate-500">Template: </span>
                                    <span className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-700">{templateName}</span>
                                  </div>
                                )}
                                {automation.type === "Update client-facing job status" && clientStatusDetails && (
                                  <div className="mb-1 flex items-center gap-2">
                                    <span className="text-[10px] font-semibold text-slate-500">Client Status:</span>
                                    <span className="inline-flex items-center gap-1">
                                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: clientStatusDetails.clientfacingColour }} />
                                      <span className="text-[10px] font-medium text-slate-700">{clientStatusDetails.label}</span>
                                    </span>
                                    {automation.status === true && (
                                      <span className="rounded-full border border-indigo-300 px-1.5 text-[10px] text-indigo-600">Visible</span>
                                    )}
                                  </div>
                                )}
                                {automation.type === "Update account tags" && addTagDetails.length > 0 && (
                                  <div className="mb-1">
                                    <span className="text-[10px] font-semibold text-slate-500">Add Tags: </span>
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                      {addTagDetails.map(tag => (
                                        <span key={tag._id} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {automation.type === "Update account tags" && removeTagDetails.length > 0 && (
                                  <div className="mb-1">
                                    <span className="text-[10px] font-semibold text-slate-500">Remove Tags: </span>
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                      {removeTagDetails.map(tag => (
                                        <span key={tag._id} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {automation.type === "Update job assignees" && automation.selectedAssignees?.length > 0 && (
                                  <div className="mb-1">
                                    <span className="text-[10px] font-semibold text-slate-500">Add: </span>
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                      {automation.selectedAssignees.map(userId => { const u = users.find(x => x.value === userId); return u ? <span key={u.value} className="rounded-full border border-slate-300 px-2 py-0.5 text-[10px]">{u.label}</span> : null; })}
                                    </div>
                                  </div>
                                )}
                                {automation.type === "Update job assignees" && automation.assigneesToRemove?.length > 0 && (
                                  <div className="mb-1">
                                    <span className="text-[10px] font-semibold text-slate-500">Remove: </span>
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                      {automation.assigneesToRemove.map(userId => { const u = users.find(x => x.value === userId); return u ? <span key={u.value} className="rounded-full border border-red-300 px-2 py-0.5 text-[10px] text-red-600">{u.label}</span> : null; })}
                                    </div>
                                  </div>
                                )}
                                {tagDetails.length > 0 && (
                                  <div>
                                    <span className="text-[10px] font-semibold text-slate-500">Conditions: </span>
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                      {tagDetails.map(tag => (
                                        <span key={tag._id} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {automation.reminderChecked && (
                                  <p className="text-[10px] text-slate-500 mt-1">Reminders: {automation.daysuntilNextReminder} days, {automation.noOfReminder} times</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No automations configured</p>
                      )}
                    </div>

                    {stage.automations && stage.automations.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => handleEditAutomations(index)}
                        className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-indigo-500 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit Automations ({stage.automations.length})
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(event) => handleAutomationMenuOpen(event, index)}
                        className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Automation
                      </button>
                    )}
                  </div>
              </div>

              {index < stages.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleAddStage(index + 1)}
                  className="flex-shrink-0 self-center p-1 rounded-full text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                >
                  <Plus className="h-6 w-6" />
                </button>
              )}
            </React.Fragment>
          ))}
      </div>

      {/* Automation Menu */}
      {Boolean(anchorEl) && (() => {
        const AUTOMATION_TYPES = ["Send Email","Send Invoice","Send Proposal/Els","Create Organizer","Apply folder template","Update account tags","Create Task","Send message","Update client-facing job status"];
        return (
          <>
            <div className="fixed inset-0 z-40" onClick={handleAutomationMenuClose} />
            <div className="fixed z-50 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-xl overflow-y-auto max-h-56" style={{ top: anchorEl.getBoundingClientRect().bottom + 4, left: anchorEl.getBoundingClientRect().left }}>
              {AUTOMATION_TYPES.map(type => (
                <button key={type} type="button" onClick={() => handleAddAutomation(stageSelected, type)} className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left">{type}</button>
              ))}
            </div>
          </>
        );
      })()}

      {/* Automation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/30" onClick={handleDrawerClose} />
          <div className="relative z-50 flex flex-col bg-white shadow-2xl w-full max-w-[680px] h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                {stageSelected !== null && stages[stageSelected]?.automations?.length > 0
                  ? `Edit Automations — Stage ${stageSelected + 1}`
                  : `Add Automations — Stage ${stageSelected !== null ? stageSelected + 1 : '...'}`}
              </h2>
              <button type="button" onClick={handleDrawerClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Automations */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {drawerAutomations.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-sm text-slate-400">
                  No automations added yet. Click "Add Another Automation" to start.
                </div>
              ) : (
                drawerAutomations.map((automation, idx) => (
                  <div key={automation.id || idx} className="relative rounded-xl border border-slate-200 p-4">
                    <button
                      type="button"
                      onClick={() => handleDeleteAutomation(idx)}
                      className="absolute top-3 right-3 p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <p className="text-sm font-semibold text-slate-700 mb-3 pr-8">Automation {automation.index}: {automation.type}</p>
                    {renderActionContent(automation, idx)}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 px-5 py-4 space-y-3">
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleDrawerMenuOpen}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Automation
                </button>
              </div>
              <button
                type="button"
                onClick={handleSaveAllAutomations}
                disabled={drawerAutomations.length === 0 || stageSelected === null}
                className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
              >
                {stageSelected === null
                  ? 'No Stage Selected'
                  : stages[stageSelected]?.automations?.length > 0
                    ? `Update Automations (${drawerAutomations.length})`
                    : `Save Automations (${drawerAutomations.length})`}
              </button>
            </div>

            {/* Add More Menu */}
            {Boolean(drawerAnchorEl) && (() => {
              const AUTOMATION_TYPES = ["Send Email","Send Invoice","Send Proposal/Els","Create Organizer","Apply folder template","Update account tags","Create Task","Send message","Update client-facing job status"];
              const rect = drawerAnchorEl.getBoundingClientRect();
              return (
                <>
                  <div className="fixed inset-0 z-40" onClick={handleDrawerMenuClose} />
                  <div className="fixed z-50 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-xl overflow-y-auto max-h-56" style={{ top: rect.bottom + 4, left: rect.left }}>
                    {AUTOMATION_TYPES.map(type => (
                      <button key={type} type="button" onClick={() => handleDrawerMenuItemSelect(type)} className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left">{type}</button>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      {/* Conditions Drawer */}
      {isConditionsFormOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="fixed inset-0 bg-transparent" onClick={handleGoBack} />
          <div className="relative z-[60] flex flex-col bg-white shadow-2xl w-full max-w-[550px] h-full">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200">
              <button type="button" onClick={handleGoBack} className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-base font-semibold text-slate-800">Add conditions</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="text-sm text-slate-600 mb-3">Apply automation only for accounts with these tags</p>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="space-y-2 max-h-[68vh] overflow-y-auto">
                {filteredConditionTags.map((tag) => (
                  <div key={tag._id} className="flex items-center gap-3 border-b border-slate-100 pb-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                      checked={tempSelectedTags.some(s => s._id === tag._id)}
                      onChange={() => handleCheckboxChange(tag)}
                    />
                    <span className="rounded-full px-3 py-0.5 text-sm font-medium text-white" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-4 border-t border-slate-200">
              <button
                type="button"
                disabled={tempSelectedTags.length === 0}
                onClick={handleAddTags}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
              >
                {currentAutomationIndex !== null && drawerAutomations[currentAutomationIndex]?.selectedTags?.length > 0 ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={handleGoBack}
                className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StagesSection;
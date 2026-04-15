import React, { useState, useEffect, useRef, useCallback } from "react";
import Section from "./organizertempSection";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import debounce from "lodash.debounce";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FormPage, FormSection, FormField, FormRow, FormGrid, FormDrawer, FormDrawerFooter, ShortcodePopover } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { GripVertical, Settings, Eye, Plus, ChevronLeft, ChevronRight, X, MoreVertical, Pencil, Trash2, Loader2, ClipboardList } from "lucide-react";

// Section Item Component (Draggable)
// Section Item Component (Draggable)
const SectionItem = ({
  section,
  onClick,
  onDrop,
  index,
  truncateText,
  isSelected,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "SECTION",
    item: { id: section.id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: "SECTION",
    hover: (item) => {
      if (item.index !== index) {
        onDrop(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 mb-2 cursor-move transition-colors ${
        isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-white hover:bg-accent/50"
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onClick(section)}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-sm truncate flex-1">{truncateText(section.text, 5)}</span>
    </div>
  );
};
const OrganizersTemp = () => {
  const moveSection = (fromIndex, toIndex) => {
    const newSections = [...sections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);
    setSections(newSections);
  };
  const truncateText = (text, maxWords) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + " ..";
    }
    return text;
  };

  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const navigate = useNavigate();

  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
  }, [shortcuts]);
  useEffect(() => {
    if (selectedOption === "contacts" || selectedOption === "account") {
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        // { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
        { title: "Date Shortcodes", isBold: true },
        {
          title: "Current day full date",
          isBold: false,
          value: "CURRENT_DAY_FULL_DATE",
        },
        {
          title: "Current day number",
          isBold: false,
          value: "CURRENT_DAY_NUMBER",
        },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        {
          title: "Current month number",
          isBold: false,
          value: "CURRENT_MONTH_NUMBER",
        },
        {
          title: "Current month name",
          isBold: false,
          value: "CURRENT_MONTH_NAME",
        },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        {
          title: "Last day full date",
          isBold: false,
          value: "LAST_DAY_FULL_DATE",
        },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        {
          title: "Last month number",
          isBold: false,
          value: "LAST_MONTH_NUMBER",
        },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        {
          title: "Next day full date",
          isBold: false,
          value: "NEXT_DAY_FULL_DATE",
        },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        {
          title: "Next month number",
          isBold: false,
          value: "NEXT_MONTH_NUMBER",
        },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);

  // useEffect(() => {
  //   // Set shortcuts based on selected option
  //   if (selectedOption === "contacts") {
  //     const contactShortcuts = [
  //       { title: "Account Shortcodes", isBold: true },
  //       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
  //       { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
  //       { title: "Contact Shortcodes", isBold: true },
  //       { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
  //       { title: "First Name", isBold: false, value: "FIRST_NAME" },
  //       { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
  //       { title: "Last Name", isBold: false, value: "LAST_NAME" },
  //       { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
  //       { title: "Country", isBold: false, value: "COUNTRY" },
  //       { title: "Company name", isBold: false, value: "COMPANY_NAME " },
  //       { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
  //       { title: "City", isBold: false, value: "CITY" },
  //       { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
  //       { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
  //       { title: "Custom field:Email", isBold: false, value: "CONTACT_CUSTOM_FIELD:Email" },
  //       { title: "Date Shortcodes", isBold: true },
  //       { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
  //       { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
  //       { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
  //       { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
  //       { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
  //       { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
  //       { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
  //       { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
  //       { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
  //       { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
  //       { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
  //       { title: "Last week", isBold: false, value: "LAST_WEEK" },
  //       { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
  //       { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
  //       { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
  //       { title: "Last_year", isBold: false, value: "LAST_YEAR" },
  //       { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
  //       { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
  //       { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
  //       { title: "Next week", isBold: false, value: "NEXT_WEEK" },
  //       { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
  //       { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
  //       { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
  //       { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  //     ];
  //     setShortcuts(contactShortcuts);
  //   } else if (selectedOption === "account") {
  //     const accountShortcuts = [
  //       { title: "Account Shortcodes", isBold: true },
  //       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
  //       { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
  //       { title: "Date Shortcodes", isBold: true },
  //       { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
  //       { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
  //       { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
  //       { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
  //       { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
  //       { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
  //       { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
  //       { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
  //       { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
  //       { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
  //       { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
  //       { title: "Last week", isBold: false, value: "LAST_WEEK" },
  //       { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
  //       { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
  //       { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
  //       { title: "Last_year", isBold: false, value: "LAST_YEAR" },
  //       { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
  //       { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
  //       { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
  //       { title: "Next week", isBold: false, value: "NEXT_WEEK" },
  //       { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
  //       { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
  //       { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
  //       { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  //     ];
  //     setShortcuts(accountShortcuts);
  //   }
  // }, [selectedOption]);
  const handleCloseDropdown = () => {
    setShowDropdown(false);
    setAnchorEl(null);
  };
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
  const handlejobName = (e) => {
    const { value, selectionStart } = e.target;
    setOrganizerName(value);
    setCursorPosition(selectionStart);
  };
  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleAddShortcut = (shortcut) => {
    setOrganizerName((prevText) => {
      const newText =
        prevText.slice(0, cursorPosition) +
        `[${shortcut}]` +
        prevText.slice(cursorPosition);
      return newText;
    });

    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(
          cursorPosition + shortcut.length + 2,
          cursorPosition + shortcut.length + 2
        );
      }
    }, 0);

    setShowDropdown(false);
  };
  const [templateName, setTemplateName] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  // const [sectionSettings, setSectionSettings] = useState({});
  const handleSectionSaveData = (settings) => {
    // Update the specific section with the new settings
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === selectedSection.id
          ? { ...section, sectionsettings: settings }
          : section
      )
    );
  };
  const addSection = () => {
    const newSection = {
      id: Date.now(),
      name: `Section ${sections.length + 1}`,
      text: "",
      formElements: [],
      sectionSettings: {
        sectionRepeatingMode: false,
        buttonName: "",
        conditional: false,
        mode: "",
        conditions: [
          {
            question: "",
            answer: "",
          },
        ],
      },
    };
    setSections([...sections, newSection]);
    setSelectedSection(newSection);
  };
  console.log(sections);
  // console.log(selectedSection)

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const handleDeleteSection = (id) => {
    const newSections = sections.filter((section) => section.id !== id);
    setSections(newSections);
    if (selectedSection && selectedSection.id === id) {
      setSelectedSection(null);
    }
  };
  const handleUpdateSection = (
    id,
    newText,
    newFormElements,
    newSectionSettings
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id
          ? {
              ...section,
              text: newText,
              formElements: newFormElements,
              sectionSettings: {
                ...section.sectionSettings, // retain existing settings
                ...newSectionSettings, // apply updates
              },
            }
          : section
      )
    );
  };

  const handleDuplicateSection = (sectionId) => {
    const sectionToDuplicate = sections.find(
      (section) => section.id === sectionId
    );

    if (sectionToDuplicate) {
      const newSectionId = Date.now(); // Or use a UUID generator for better uniqueness

      const duplicatedFormElements = sectionToDuplicate.formElements.map(
        (element) => ({
          ...element,
          id: Date.now() + Math.floor(Math.random() * 1000), // Ensure unique ID
          sectionid: newSectionId,
        })
      );

      const duplicatedSection = {
        ...sectionToDuplicate,
        id: newSectionId,
        text: `${sectionToDuplicate.text} (Copy)`,
        formElements: duplicatedFormElements,
      };

      setSections([...sections, duplicatedSection]);
    }
  };

  const [showOrganizerTemplateForm, setShowOrganizerTemplateForm] =
    useState(false);

  const handleCreateInvoiceClick = () => {
    setShowOrganizerTemplateForm(true);
  };
  // function truncateText(text, maxWords) {
  //   const words = text.split(' ');
  //   if (words.length > maxWords) {
  //     return words.slice(0, maxWords).join(' ') + ' ..';
  //   }
  //   return text;
  // }
  const handleFormSave = (elementId, formData) => {
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        formElements: section.formElements.map((el) =>
          el.id === elementId
            ? { ...el, questionsectionsettings: formData }
            : el
        ),
      }))
    );
  };
  const saveandexitOrganizerTemp = () => {
    console.log(sections);
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const organizersettings = {
      notifyaboutdocumentupload: loginChecked, // Example state
      organizerselfservice: notifyChecked, // Example state
      automaticallysealaftersubmission: emailSyncChecked, // Example state
      sendreminderstoclient: autoSaveChecked, // Example state
      daysuntilnextreminder: daysuntilNextReminder, // Example state
      numberofreminders: noOfReminder, // Example state
    };

    const raw = JSON.stringify({
      templatename: templateName,
      organizerName: organizerName,

      sections: sections.map((section) => ({
        name: section.text,
        text: section.text,
        id: section.id.toString(),
        sectionsettings: section.sectionsettings || {},
        formElements: section.formElements.map((element) => ({
          type: element.type,
          id: element.id,
          sectionid: element.sectionid,
          options: element.options.map((option) => ({
            id: option.id,
            text: option.text,
          })),
          text: element.text,

          questionsectionsettings: element.questionsectionsettings || {},
        })),
      })),
      organizersettings: organizersettings,
      active: true,
    });

    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (
          result &&
          result.message === "Organizer Template created successfully"
        ) {
          toast.success("Organizer Template created successfully");
          handleMenuClose();
          setShowOrganizerTemplateForm(false);
          setTemplateName("");
          setOrganizerName("");
          setSections([]);
          setSelectedSection(null);
          fetchOrganizerTemplates();
          setNotifyChecked(false);
          setLoginChecked(false);
          setAutoSaveChecked(false);
          setEmailSyncChecked(false);
          setNoOfReminder(1);
          setDaysuntilNextReminder(3);
        } else {
          toast.error(result.error || "Failed to create Organizer Template");
        }
      })
      .catch((error) => console.error(error));
  };
  const saveOrganizerTemp = () => {
    console.log(sections);
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const organizersettings = {
      notifyaboutdocumentupload: loginChecked, // Example state
      organizerselfservice: notifyChecked, // Example state
      automaticallysealaftersubmission: emailSyncChecked, // Example state
      sendreminderstoclient: autoSaveChecked, // Example state
      daysuntilnextreminder: daysuntilNextReminder, // Example state
      numberofreminders: noOfReminder, // Example state
    };

    const raw = JSON.stringify({
      templatename: templateName,
      organizerName: organizerName,
      sections: sections.map((section) => ({
        name: section.text,
        text: section.text,
        id: section.id.toString(),
        sectionsettings: section.sectionsettings || {},
        formElements: section.formElements.map((element) => ({
          type: element.type,
          id: element.id,
          sectionid: element.sectionid,
          options: element.options.map((option) => ({
            id: option.id,
            text: option.text,
          })),
          text: element.text,
          questionsectionsettings: element.questionsectionsettings || {},
        })),
      })),
      organizersettings: organizersettings,
      active: true,
    });

    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (
          result &&
          result.message === "Organizer Template created successfully"
        ) {
          toast.success("Organizer Template created successfully");
        } else {
          toast.error(result.error || "Failed to create Organizer Template");
        }
      })
      .catch((error) => console.error(error));
  };
  const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchOrganizerTemplates = async () => {
    setLoading(true);
    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();

      setOrganizerTemplatesData(data.OrganizerTemplates);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    } finally {
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };
  const handleEdit = (_id) => {
    navigate("OrganizerTempUpdate/" + _id);
  };
  //delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this organizer template?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.text();
        })
        .then((result) => {
          console.log(result);
          toast.success("Item deleted successfully");
          handleMenuClose();
          fetchOrganizerTemplates();
          // setshowOrganizerTemplateForm(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };
  useEffect(() => {
    fetchOrganizerTemplates();
  }, []);
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

  const [isFormDirty, setIsFormDirty] = useState(false);
  const handleCancel = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmClose) {
        return;
      }
    }
    setShowOrganizerTemplateForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (templateName || organizerName) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [templateName, organizerName]);

  const [templateNameError, setTemplateNameError] = useState("");
  const [organizerError, setOrganizerError] = useState("");

  const validateForm = () => {
    let isValid = true;
    if (!templateName) {
      setTemplateNameError("Template name is required");

      isValid = false;
    } else {
      setTemplateNameError("");
    }

    if (!organizerName) {
      setOrganizerError("Organizer name is required");
      isValid = false;
    } else {
      setOrganizerError("");
    }
    return isValid;
  };

  const handleDuplicateTemplate = async (templateId) => {
    try {
      const response = await fetch(
        `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/duplicate/${templateId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (result.message === "Organizer Template duplicated successfully") {
        toast.success("Template duplicated successfully");
        fetchOrganizerTemplates(); // Refresh the list after duplication
      } else {
        toast.error(result.error || "Failed to duplicate template");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error duplicating template");
    }
  };

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const handlePreview = () => {
    setPreviewDialogOpen(true); // Open the dialog
    const data = {
      sections, // This contains all your sections and their elements
    };

    // You can also use any other required data from your state here
    console.log("Data for preview:", data);
  };

  const handleClosePreview = () => {
    setPreviewDialogOpen(false); // Close the dialog
  };

  const [startDate, setStartDate] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  // const totalSteps = sections.length;

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleDropdownChange = (event) => {
    const selectedIndex = event.target.value;
    setActiveStep(selectedIndex);
  };

  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [answeredElements, setAnsweredElements] = useState({});

  const handleRadioChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setRadioValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  const handleCheckboxChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [key]: {
        ...prevValues[key],
        [value]: !prevValues[key]?.[value],
      },
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
  const handleYesNoChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedYesNoValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const [inputValues, setInputValues] = useState({});
  const handleInputChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    const { value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
  const handleDropdownValueChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: event.target.value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent || "";
  };
  // const shouldShowElement = (element, sectionId) => {
  //   const settings = element.questionsectionsettings;
  //   if (!settings?.conditional) return true;
  //   const conditions = settings?.conditions || [];

  //   for (const condition of conditions) {
  //     const { question, answer } = condition;
  //     if (!question || !answer) continue;

  //     // Check all possible sections for the answer
  //     let conditionMet = false;

  //     // Check radio values
  //     for (const key in radioValues) {
  //       if (key.endsWith(`_${question}`) && radioValues[key] === answer) {
  //         conditionMet = true;
  //         break;
  //       }
  //     }
  //     if (conditionMet) continue;

  //     // Check checkbox values
  //     for (const key in checkboxValues) {
  //       if (key.endsWith(`_${question}`) && checkboxValues[key]?.[answer]) {
  //         conditionMet = true;
  //         break;
  //       }
  //     }
  //     if (conditionMet) continue;

  //     // Check dropdown values
  //     for (const key in selectedDropdownValues) {
  //       if (
  //         key.endsWith(`_${question}`) &&
  //         selectedDropdownValues[key] === answer
  //       ) {
  //         conditionMet = true;
  //         break;
  //       }
  //     }
  //     if (conditionMet) continue;
  //     // Check Yes/No values
  //     for (const key in selectedYesNoValues) {
  //       if (
  //         key.endsWith(`_${question}`) &&
  //         selectedYesNoValues[key] === answer
  //       ) {
  //         conditionMet = true;
  //         break;
  //       }
  //     }
  //     if (conditionMet) continue;
  //     // If we get here, no condition was met
  //     return false;
  //   }

  //   return true;
  // };
  // const shouldShowSection = (section) => {
  //   console.log("Evaluating section:", section);
  //   if (!section.sectionsettings?.conditional) return true;
  //   const conditions = section.sectionsettings.conditions || [];

  //   return conditions.every((condition) => {
  //     if (!condition.question || !condition.answer) return false;

  //     // Check all possible sections for the answer
  //     for (const key in radioValues) {
  //       if (
  //         key.endsWith(`_${condition.question}`) &&
  //         radioValues[key] === condition.answer
  //       ) {
  //         return true;
  //       }
  //     }

  //     for (const key in checkboxValues) {
  //       if (
  //         key.endsWith(`_${condition.question}`) &&
  //         checkboxValues[key]?.[condition.answer]
  //       ) {
  //         return true;
  //       }
  //     }

  //     for (const key in selectedDropdownValues) {
  //       if (
  //         key.endsWith(`_${condition.question}`) &&
  //         selectedDropdownValues[key] === condition.answer
  //       ) {
  //         return true;
  //       }
  //     }
  //     // Check Yes/No values
  //     for (const key in selectedYesNoValues) {
  //       if (
  //         key.endsWith(`_${condition.question}`) &&
  //         selectedYesNoValues[key] === condition.answer
  //       ) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   });
  // };
const [repeatedSections, setRepeatedSections] = useState({});

 const shouldShowElement = (element, sectionId) => {
    const settings = element.questionsectionsettings;
    if (!settings?.conditional) return true;
    
    const conditions = settings?.conditions || [];
    const mode = settings?.mode || "All";

    if (conditions.length === 0) return true;

    let matchedConditions = 0;

    for (const condition of conditions) {
      const { question, answer } = condition;
      if (!question || !answer) continue;

      let conditionMet = false;

      for (const key in radioValues) {
        const [keySectionId] = key.split('_');
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
        
        if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && radioValues[key] === answer) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in checkboxValues) {
        const [keySectionId] = key.split('_');
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
        
        if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && checkboxValues[key]?.[answer]) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in selectedDropdownValues) {
        const [keySectionId] = key.split('_');
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
        
        if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && selectedDropdownValues[key] === answer) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in selectedYesNoValues) {
        const [keySectionId] = key.split('_');
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId = typeof sectionId === 'string' ? Number(sectionId) : sectionId;
        
        if (numericKeySectionId === numericCurrentSectionId && key.endsWith(`_${question}`) && selectedYesNoValues[key] === answer) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      if (mode === "All" && !conditionMet) {
        return false;
      }
    }

    if (mode === "Any") {
      return matchedConditions > 0;
    } else {
      return matchedConditions === conditions.length;
    }
  };

  // const shouldShowSection = (section) => {
  //   if (!section.sectionsettings?.conditional) return true;
    
  //   const conditions = section.sectionsettings.conditions || [];
  //   const mode = section.sectionsettings.mode || "All";

  //   if (conditions.length === 0) return true;

  //   let matchedConditions = 0;

  //   conditions.forEach((condition) => {
  //     if (!condition.question || !condition.answer) return;

  //     let conditionMet = false;

  //     for (const key in radioValues) {
  //       const [checkSectionId] = key.split('_');
  //       const numericCheckSectionId = Number(checkSectionId);
  //       if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
  //         if (
  //           key.endsWith(`_${condition.question}`) &&
  //           radioValues[key] === condition.answer
  //         ) {
  //           conditionMet = true;
  //           break;
  //         }
  //       }
  //     }
  //     if (conditionMet) {
  //       matchedConditions++;
  //       if (mode === "Any") return;
  //       return;
  //     }

  //     for (const key in checkboxValues) {
  //       const [checkSectionId] = key.split('_');
  //       const numericCheckSectionId = Number(checkSectionId);
  //       if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
  //         if (
  //           key.endsWith(`_${condition.question}`) &&
  //           checkboxValues[key]?.[condition.answer]
  //         ) {
  //           conditionMet = true;
  //           break;
  //         }
  //       }
  //     }
  //     if (conditionMet) {
  //       matchedConditions++;
  //       if (mode === "Any") return;
  //       return;
  //     }

  //     for (const key in selectedDropdownValues) {
  //       const [checkSectionId] = key.split('_');
  //       const numericCheckSectionId = Number(checkSectionId);
  //       if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
  //         if (
  //           key.endsWith(`_${condition.question}`) &&
  //           selectedDropdownValues[key] === condition.answer
  //         ) {
  //           conditionMet = true;
  //           break;
  //         }
  //       }
  //     }
  //     if (conditionMet) {
  //       matchedConditions++;
  //       if (mode === "Any") return;
  //       return;
  //     }

  //     for (const key in selectedYesNoValues) {
  //       const [checkSectionId] = key.split('_');
  //       const numericCheckSectionId = Number(checkSectionId);
  //       if (!Object.values(repeatedSections).flat().includes(numericCheckSectionId)) {
  //         if (
  //           key.endsWith(`_${condition.question}`) &&
  //           selectedYesNoValues[key] === condition.answer
  //         ) {
  //           conditionMet = true;
  //           break;
  //         }
  //       }
  //     }
  //     if (conditionMet) {
  //       matchedConditions++;
  //       if (mode === "Any") return;
  //     }
  //   });

  //   if (mode === "Any") {
  //     return matchedConditions > 0;
  //   } else {
  //     return matchedConditions === conditions.length;
  //   }
  // };
  // const getVisibleSections = () => sections.filter(shouldShowSection);

  // const visibleSections = getVisibleSections();
  // const totalSteps = visibleSections.length;
// Track previous visible sections
  const [previousVisibleSections, setPreviousVisibleSections] = useState([]);

  // Helper function to clear all values for a specific section
  const clearSectionValues = useCallback((sectionId) => {
    console.log(`Clearing values for section ${sectionId}`);
    
    // Clear radio values for this section
    setRadioValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (keySectionId === sectionId.toString()) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    // Clear checkbox values for this section
    setCheckboxValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (keySectionId === sectionId.toString()) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    // Clear dropdown values for this section
    setSelectedDropdownValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (keySectionId === sectionId.toString()) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    // Clear yes/no values for this section
    setSelectedYesNoValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (keySectionId === sectionId.toString()) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    // Clear input values for this section
    setInputValues(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (keySectionId === sectionId.toString()) {
          delete newValues[key];
        }
      });
      return newValues;
    });

    // Clear answered elements for this section
    setAnsweredElements(prev => {
      const newValues = { ...prev };
      Object.keys(newValues).forEach(key => {
        const [keySectionId] = key.split('_');
        if (keySectionId === sectionId.toString()) {
          delete newValues[key];
        }
      });
      return newValues;
    });
  }, []);

  // Helper function to check section visibility
  const checkSectionVisibility = useCallback((section) => {
    if (!section.sectionsettings?.conditional) return true;

    const conditions = section.sectionsettings.conditions || [];
    const mode = section.sectionsettings.mode || "All";

    if (conditions.length === 0) return true;

    let matchedConditions = 0;

    conditions.forEach((condition) => {
      if (!condition.question || !condition.answer) return;

      let conditionMet = false;

      // Check radio values
      for (const key in radioValues) {
        const [checkSectionId] = key.split('_');
        const numericCheckSectionId = Number(checkSectionId);
        // Check if this section is a repeated section
        const isRepeatedSection = Object.values(repeatedSections).flat().includes(numericCheckSectionId);
        
        // Only check non-repeated sections for conditions
        if (!isRepeatedSection) {
          if (key.endsWith(`_${condition.question}`) && radioValues[key] === condition.answer) {
            conditionMet = true;
            break;
          }
        }
      }
      
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      // Check checkbox values
      for (const key in checkboxValues) {
        const [checkSectionId] = key.split('_');
        const numericCheckSectionId = Number(checkSectionId);
        const isRepeatedSection = Object.values(repeatedSections).flat().includes(numericCheckSectionId);
        
        if (!isRepeatedSection) {
          if (key.endsWith(`_${condition.question}`) && checkboxValues[key]?.[condition.answer]) {
            conditionMet = true;
            break;
          }
        }
      }
      
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      // Check dropdown values
      for (const key in selectedDropdownValues) {
        const [checkSectionId] = key.split('_');
        const numericCheckSectionId = Number(checkSectionId);
        const isRepeatedSection = Object.values(repeatedSections).flat().includes(numericCheckSectionId);
        
        if (!isRepeatedSection) {
          if (key.endsWith(`_${condition.question}`) && selectedDropdownValues[key] === condition.answer) {
            conditionMet = true;
            break;
          }
        }
      }
      
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      // Check yes/no values
      for (const key in selectedYesNoValues) {
        const [checkSectionId] = key.split('_');
        const numericCheckSectionId = Number(checkSectionId);
        const isRepeatedSection = Object.values(repeatedSections).flat().includes(numericCheckSectionId);
        
        if (!isRepeatedSection) {
          if (key.endsWith(`_${condition.question}`) && selectedYesNoValues[key] === condition.answer) {
            conditionMet = true;
            break;
          }
        }
      }
      
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
      }
    });

    if (mode === "Any") {
      return matchedConditions > 0;
    } else {
      return matchedConditions === conditions.length;
    }
  }, [radioValues, checkboxValues, selectedDropdownValues, selectedYesNoValues, repeatedSections]);

  const shouldShowSection = useCallback((section) => {
    console.log("Checking visibility for section:", section);
    
    // Check current visibility
    const isCurrentlyVisible = checkSectionVisibility(section);
    
    return isCurrentlyVisible;
  }, [checkSectionVisibility]);

  // Use effect to update visible sections and clear hidden ones
  useEffect(() => {
    const currentlyVisible = sections.filter(section => shouldShowSection(section));
    
    // Find sections that were visible before but are not visible now
    const sectionsToClear = previousVisibleSections.filter(
      prevSection => !currentlyVisible.some(currSection => currSection.id === prevSection.id)
    );
    
    // Clear values for sections that became hidden
    sectionsToClear.forEach(section => {
      clearSectionValues(section.id);
    });
    
    // Update previous visible sections
    setPreviousVisibleSections(currentlyVisible);
  }, [sections, shouldShowSection, clearSectionValues, previousVisibleSections]);

  // Get visible sections (without side effects)
  const getVisibleSections = useCallback(() => {
    return sections.filter(section => shouldShowSection(section));
  }, [sections, shouldShowSection]);

  const visibleSections = getVisibleSections();
  const totalSteps = visibleSections.length;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const [loginChecked, setLoginChecked] = useState(false);
  const [notifyChecked, setNotifyChecked] = useState(false);
  const [emailSyncChecked, setEmailSyncChecked] = useState(false);
  const [autoSaveChecked, setAutoSaveChecked] = useState(false);

  // Handlers for toggling switches
  const handleLoginToggle = (checked) => {
    setLoginChecked(checked);
  };

  const handleNotifyToggle = (checked) => {
    setNotifyChecked(checked);
  };

  const handleEmailSyncToggle = (checked) => {
    setEmailSyncChecked(checked);
  };

  const handleAutoSaveToggle = (checked) => {
    setAutoSaveChecked(checked);
  };
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
  const [noOfReminder, setNoOfReminder] = useState(1);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Compute paginated tasks
  const paginatedOrganizers = organizerTemplatesData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Debounced function to check template name existence
  const checkTemplateName = async (name) => {
    try {
      const res = await axios.get(
        `${ORGANIZER_TEMP_API}/workflow/organizers/check-name`,
        {
          params: { name },
        }
      );
      if (res.data.exists) {
        setTemplateNameError("Template name already exists");
      } else {
        setTemplateNameError("");
      }
    } catch (err) {
      console.error(err);
      setTemplateNameError("");
    }
  };

  const debouncedCheck = debounce((name) => {
    if (name.trim()) checkTemplateName(name);
    else setTemplateNameError("");
  }, 500);

  useEffect(() => {
    debouncedCheck(templateName);
    return debouncedCheck.cancel;
  }, [templateName]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        {!showOrganizerTemplateForm && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button onClick={handleCreateInvoiceClick}>
                <Plus className="h-4 w-4" /> Create New Organizer
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60">
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Template Name</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Used in Pipelines</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedOrganizers.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-5 py-10 text-center text-sm text-slate-400">No organizer templates found.</td>
                        </tr>
                      ) : (
                        paginatedOrganizers.map((row) => (
                          <tr key={row._id} className="group transition-colors hover:bg-slate-50/70">
                            <td className="px-5 py-3">
                              <button
                                onClick={() => handleEdit(row._id)}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                              >
                                {row.templatename}
                              </button>
                            </td>
                            <td className="px-5 py-3 text-sm text-slate-500">—</td>
                            <td className="px-5 py-3 text-right">
                              <div className="relative inline-block">
                                <button
                                  onClick={(event) => toggleMenu(event, row._id)}
                                  className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                                {openMenuId === row._id && (
                                  <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-in fade-in-0 zoom-in-95">
                                    <button
                                      onClick={() => { handleEdit(tempIdget); handleMenuClose(); }}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                      <Pencil className="h-3.5 w-3.5" /> Edit
                                    </button>
                                    <button
                                      onClick={() => { handleDuplicateTemplate(tempIdget); handleMenuClose(); }}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                                    >
                                      <ClipboardList className="h-3.5 w-3.5" /> Duplicate
                                    </button>
                                    <button
                                      onClick={() => { handleDelete(tempIdget); }}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {organizerTemplatesData.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-3">
                    <p className="text-xs text-slate-500">
                      Showing <span className="font-semibold text-slate-700">{page * rowsPerPage + 1}</span>–<span className="font-semibold text-slate-700">{Math.min((page + 1) * rowsPerPage, organizerTemplatesData.length)}</span> of{" "}
                      <span className="font-semibold text-slate-700">{organizerTemplatesData.length}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <select
                        value={rowsPerPage}
                        onChange={(e) => handleChangeRowsPerPage({ target: { value: e.target.value } })}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {[30, 40, 50, 60, 100].map((opt) => (
                          <option key={opt} value={opt}>{opt} / page</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleChangePage(null, page - 1)}
                          disabled={page === 0}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="min-w-[3rem] text-center text-xs font-medium text-slate-600">
                          {page + 1} / {Math.max(1, Math.ceil(organizerTemplatesData.length / rowsPerPage))}
                        </span>
                        <button
                          onClick={() => handleChangePage(null, page + 1)}
                          disabled={(page + 1) * rowsPerPage >= organizerTemplatesData.length}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {showOrganizerTemplateForm && (
          <>
            <FormPage
              title="Create Template"
              subtitle="Customize your organizer template"
              actions={
                <>
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={handleDrawerOpen}
                    className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button variant="secondary" onClick={saveOrganizerTemp}>Save</Button>
                  <Button onClick={saveandexitOrganizerTemp}>Save & Exit</Button>
                </>
              }
            >
              <FormSection title="General">
                <FormField label="Template Name" error={templateNameError}>
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Template name"
                    error={!!templateNameError}
                  />
                </FormField>
                <FormField label="Organizer Name" error={organizerError}>
                  <Input
                    ref={textFieldRef}
                    value={organizerName}
                    onChange={handlejobName}
                    onClick={(e) => setCursorPosition(e.target.selectionStart)}
                    placeholder="Organizer name"
                    error={!!organizerError}
                  />
                </FormField>
                <ShortcodePopover
                  shortcuts={filteredShortcuts}
                  onSelect={handleAddShortcut}
                  selectedOption={selectedOption}
                  onOptionChange={setSelectedOption}
                />
              </FormSection>

              {/* Sections Builder */}
              <div className="flex gap-6 mt-6">
                {/* Left: Section list */}
                <div className="w-[30%] space-y-2">
                  <FormSection title="Sections">
                    {sections.map((section, index) => (
                      <SectionItem
                        key={section.id}
                        section={section}
                        index={index}
                        onClick={handleSectionClick}
                        onDrop={moveSection}
                        truncateText={truncateText}
                        isSelected={selectedSection?.id === section.id}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSection}
                      className="mt-3 w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      New section
                    </Button>
                  </FormSection>
                </div>

                {/* Right: Section editor */}
                <div className="w-[70%]">
                  {selectedSection && (
                    <Section
                      key={selectedSection.id}
                      section={selectedSection}
                      onDelete={handleDeleteSection}
                      onUpdate={handleUpdateSection}
                      onDuplicate={handleDuplicateSection}
                      onSaveFormData={handleFormSave}
                      onSaveSectionData={handleSectionSaveData}
                      sections={sections}
                    />
                  )}
                </div>
              </div>
            </FormPage>

            {/* ===== SETTINGS DRAWER ===== */}
            <FormDrawer open={isDrawerOpen} onClose={handleDrawerClose} title="Organizer Settings" width="md">
              <div className="space-y-4 p-1">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Notify about document upload</Label>
                  <Switch checked={loginChecked} onCheckedChange={handleLoginToggle} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Organizer self service</Label>
                  <Switch checked={notifyChecked} onCheckedChange={handleNotifyToggle} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Automatically seal after submission</Label>
                  <Switch checked={emailSyncChecked} onCheckedChange={handleEmailSyncToggle} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Send reminders to clients</Label>
                  <Switch checked={autoSaveChecked} onCheckedChange={handleAutoSaveToggle} />
                </div>
                {autoSaveChecked && (
                  <div className="space-y-4 pl-1 pt-2">
                    <FormRow cols={2}>
                      <FormField label="Days until next reminder">
                        <Input
                          value={daysuntilNextReminder}
                          onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                          placeholder="Days until next reminder"
                        />
                      </FormField>
                      <FormField label="No. of reminders">
                        <Input
                          value={noOfReminder}
                          onChange={(e) => setNoOfReminder(e.target.value)}
                          placeholder="No. of reminders"
                        />
                      </FormField>
                    </FormRow>
                  </div>
                )}
              </div>
            </FormDrawer>

            {/* ===== PREVIEW DIALOG (full-screen overlay) ===== */}
            {previewDialogOpen && (
              <div className="fixed inset-0 z-50 bg-white overflow-auto">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="max-w-4xl mx-auto p-6">
                    {/* Preview banner */}
                    <div className="flex items-center justify-between rounded-lg border-2 border-blue-400 bg-blue-200/60 p-4 mb-6">
                      <div>
                        <p className="font-bold text-sm">Preview mode</p>
                        <p className="text-sm text-muted-foreground">The client sees your organizer like this</p>
                      </div>
                      <Button variant="ghost" onClick={handleClosePreview}>Back to edit</Button>
                    </div>

                    <h2 className="text-lg font-medium mb-3">{organizerName}</h2>

                    {/* Section selector */}
                    <select
                      className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mb-3"
                      value={activeStep}
                      onChange={handleDropdownChange}
                    >
                      {visibleSections.map((section, index) => {
                        const visibleElements = section.formElements.filter(
                          (el) => shouldShowElement(el, section.id)
                        );
                        const answeredCount = visibleElements.reduce(
                          (count, element) => {
                            const key = `${section.id}_${element.text}`;
                            return count + (answeredElements[key] ? 1 : 0);
                          },
                          0
                        );
                        const totalVisibleElements = visibleElements.length;
                        return (
                          <option key={section.id} value={index}>
                            {section.text} ({answeredCount}/{totalVisibleElements})
                          </option>
                        );
                      })}
                    </select>

                    {/* Progress bar */}
                    <div className="w-full bg-muted rounded-full h-2 mb-6">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${((activeStep + 1) / totalSteps) * 100}%` }}
                      />
                    </div>

                    {/* Form elements */}
                    <div className="space-y-4">
                      {visibleSections.map(
                        (section, sectionIndex) =>
                          sectionIndex === activeStep && (
                            <div key={section.id} className="space-y-4">
                              {section.formElements.map(
                                (element) =>
                                  shouldShowElement(element, section.id) && (
                                    <div key={`${section.id}_${element.id}`}>
                                      {/* Text Editor */}
                                      {element.type === "Text Editor" && (
                                        <p className="text-sm my-2">{stripHtmlTags(element.text)}</p>
                                      )}

                                      {/* Free Entry or Email */}
                                      {(element.type === "Free Entry" || element.type === "Email") && (
                                        <div>
                                          <Label className="text-base mb-1 block">{element.text}</Label>
                                          <textarea
                                            className="flex min-h-[60px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            placeholder={`${element.type} Answer`}
                                            rows={3}
                                            value={inputValues[`${section.id}_${element.text}`] || ""}
                                            onChange={(e) => handleInputChange(e, element.text, section.id)}
                                          />
                                        </div>
                                      )}

                                      {/* Number */}
                                      {element.type === "Number" && (
                                        <div>
                                          <Label className="text-base mb-1 block">{element.text}</Label>
                                          <Input
                                            placeholder={`${element.type} Answer`}
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={inputValues[`${section.id}_${element.text}`] || ""}
                                            onChange={(e) => {
                                              const numericValue = e.target.value.replace(/\D/g, "");
                                              handleInputChange({ target: { value: numericValue } }, element.text, section.id);
                                            }}
                                          />
                                        </div>
                                      )}

                                      {/* Radio Buttons */}
                                      {element.type === "Radio Buttons" && (
                                        <div>
                                          <Label className="text-base mb-2 block">{element.text}</Label>
                                          <div className="flex flex-wrap gap-2">
                                            {element.options.map((option) => (
                                              <Button
                                                key={option.text}
                                                type="button"
                                                variant={radioValues[`${section.id}_${element.text}`] === option.text ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleRadioChange(option.text, element.text, section.id)}
                                              >
                                                {option.text}
                                              </Button>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Checkboxes */}
                                      {element.type === "Checkboxes" && (
                                        <div>
                                          <Label className="text-base mb-2 block">{element.text}</Label>
                                          <div className="flex flex-wrap gap-2">
                                            {element.options.map((option) => (
                                              <Button
                                                key={option.text}
                                                type="button"
                                                variant={checkboxValues[`${section.id}_${element.text}`]?.[option.text] ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleCheckboxChange(option.text, element.text, section.id)}
                                              >
                                                {option.text}
                                              </Button>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Yes/No */}
                                      {element.type === "Yes/No" && (
                                        <div>
                                          <Label className="text-base mb-2 block">{element.text}</Label>
                                          <div className="flex gap-2">
                                            {element.options.map((option) => (
                                              <Button
                                                key={option.text}
                                                type="button"
                                                variant={selectedYesNoValues[`${section.id}_${element.text}`] === option.text ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleYesNoChange(option.text, element.text, section.id)}
                                              >
                                                {option.text}
                                              </Button>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Dropdown */}
                                      {element.type === "Dropdown" && (
                                        <div>
                                          <Label className="text-base mb-1 block">{element.text}</Label>
                                          <select
                                            className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={selectedDropdownValues[`${section.id}_${element.text}`] || ""}
                                            onChange={(event) => handleDropdownValueChange(event, element.text, section.id)}
                                          >
                                            <option value="">Select...</option>
                                            {element.options.map((option) => (
                                              <option key={option.text} value={option.text}>{option.text}</option>
                                            ))}
                                          </select>
                                        </div>
                                      )}

                                      {/* Date */}
                                      {element.type === "Date" && (
                                        <div>
                                          <Label className="text-base mb-1 block">{element.text}</Label>
                                          <DatePicker
                                            format="MM/DD/YYYY"
                                            sx={{ width: "100%", backgroundColor: "#fff" }}
                                            selected={startDate}
                                            onChange={handleStartDateChange}
                                            onOpen={() =>
                                              setAnsweredElements((prevAnswered) => ({
                                                ...prevAnswered,
                                                [`${section.id}_${element.text}`]: true,
                                              }))
                                            }
                                          />
                                        </div>
                                      )}

                                      {/* File Upload */}
                                      {element.type === "File Upload" && (
                                        <div>
                                          <Label className="text-base mb-1 block">{element.text}</Label>
                                          <div className="relative" title="Unavailable in preview mode">
                                            <Input disabled placeholder="Add Document" className="cursor-not-allowed" />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                              )}
                            </div>
                          )
                      )}
                      <div className="mt-6 flex gap-3 items-center">
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          variant="outline"
                          size="sm"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" /> Back
                        </Button>
                        <Button
                          onClick={handleNext}
                          disabled={activeStep === totalSteps - 1}
                          size="sm"
                        >
                          Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </LocalizationProvider>
              </div>
            )}
          </>
        )}
      </div>
    </DndProvider>
  );
};

export default OrganizersTemp;

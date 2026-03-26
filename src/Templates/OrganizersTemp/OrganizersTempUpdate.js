import React, { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Section from "./organizertempSection";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FormPage, FormSection, FormField, FormRow, FormGrid, FormDrawer, FormDrawerFooter, ShortcodePopover } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { GripVertical, Settings, Eye, Plus, ChevronLeft, ChevronRight, X } from "lucide-react";

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
const OrganizersTempUpdate = () => {
  const moveSection = (fromIndex, toIndex) => {
    const newSections = [...sections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);
    setSections(newSections);
  };

  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;

  const { id } = useParams();
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
  // const [templateData, setTemplateData] = useState(null);

  const [loginChecked, setLoginChecked] = useState(false);
  const [notifyChecked, setNotifyChecked] = useState(false);
  const [emailSyncChecked, setEmailSyncChecked] = useState(false);
  const [autoSaveChecked, setAutoSaveChecked] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  
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
  useEffect(() => {
    fetchidwiseData();
  }, []);

  const fetchidwiseData = async () => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
      // setTemplateData(data.organizerTemplate);
      setTemplateName(data.organizerTemplate.templatename);
      // console.log(data.organizerTemplate.templatename)
      setOrganizerName(data.organizerTemplate.organizerName);
      // console.log(data.organizerTemplate.sections)
      setSections(data.organizerTemplate.sections || []);

      const organizerSettings = data.organizerTemplate.organizersettings;
      console.log("Organizer Settings:", organizerSettings);
      // Example of how to set organizer settings into state
      setLoginChecked(organizerSettings.notifyaboutdocumentupload);
      setNotifyChecked(organizerSettings.organizerselfservice);
      setEmailSyncChecked(organizerSettings.automaticallysealaftersubmission);
      setAutoSaveChecked(organizerSettings.sendreminderstoclient);
      setDaysuntilNextReminder(organizerSettings.daysuntilnextreminder);
      setNoOfReminder(organizerSettings.numberofreminders);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  function truncateText(text, maxWords) {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + " ..";
    }
    return text;
  }
  const addSection = () => {
    // const newSection = { id: Date.now(), name: `Section ${sections.length + 1}`, text: '', formElements: [] };
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
    setSelectedSection(newSection); // Select the newly added section
  };
  console.log(sections);
  console.log(selectedSection);

  const handleSectionClick = (section) => {
    // const newSection = {
    //     id: section.sectionId, name: section.sectionname, text: section.sectionname, formElements: section.questions
    // };
    setSelectedSection(section);
  };
  const handleDeleteSection = (sectionId) => {
    const newSections = sections.filter((section) => section.id !== sectionId);
    setSections(newSections);
    if (selectedSection && selectedSection.id === sectionId) {
      setSelectedSection(null); // Clear selected section if it's deleted
    }
  };

  const handleUpdateSection = (id, newText, newFormElements) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id
          ? { ...section, text: newText, formElements: newFormElements }
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

  const saveOrganizerTemp = () => {
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

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log(raw);
    const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (
          result &&
          result.message === "OrganizerTemplate Updated successfully"
        ) {
          toast.success("Organizer Template Updated successfully");
          // navigate('/firmtemp/templates/organizers');
        } else {
          toast.error(result.error || "Failed to Update Organizer Template");
        }
      })
      .catch((error) => console.error(error));
  };

  const saveandexitOrganizerTemp = () => {
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

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log(raw);
    const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (
          result &&
          result.message === "OrganizerTemplate Updated successfully"
        ) {
          toast.success("Organizer Template Updated successfully");
          navigate("/firmtemp/templates/organizers");
        } else {
          toast.error(result.error || "Failed to Update Organizer Template");
        }
      })
      .catch((error) => console.error(error));
  };

  const [isFormFilled, setIsFormFilled] = useState(false);
  const handleBackButton = () => {
    if (isFormFilled) {
      const confirmCancel = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (confirmCancel) {
        navigate("/firmtemp/templates/organizers");
      }
    } else {
      navigate("/firmtemp/templates/organizers");
    }
  };

  useEffect(() => {
    // Check if form is filled
    const checkIfFormFilled = () => {
      if (organizerName || templateName || sections) {
        setIsFormFilled(true);
      } else {
        setIsFormFilled(false);
      }
    };

    checkIfFormFilled();
  }, [organizerName, templateName, sections]);
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
  const handleSectionSaveData = (settings) => {
    console.log("gfg selected section org", settings);
    // Update the specific section with the new settings
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === selectedSection.id
          ? { ...section, sectionsettings: settings }
          : section
      )
    );
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
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId =
          typeof sectionId === "string" ? Number(sectionId) : sectionId;

        if (
          numericKeySectionId === numericCurrentSectionId &&
          key.endsWith(`_${question}`) &&
          radioValues[key] === answer
        ) {
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
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId =
          typeof sectionId === "string" ? Number(sectionId) : sectionId;

        if (
          numericKeySectionId === numericCurrentSectionId &&
          key.endsWith(`_${question}`) &&
          checkboxValues[key]?.[answer]
        ) {
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
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId =
          typeof sectionId === "string" ? Number(sectionId) : sectionId;

        if (
          numericKeySectionId === numericCurrentSectionId &&
          key.endsWith(`_${question}`) &&
          selectedDropdownValues[key] === answer
        ) {
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
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId =
          typeof sectionId === "string" ? Number(sectionId) : sectionId;

        if (
          numericKeySectionId === numericCurrentSectionId &&
          key.endsWith(`_${question}`) &&
          selectedYesNoValues[key] === answer
        ) {
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

  const [repeatedSections, setRepeatedSections] = useState({});

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
  
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <FormPage
          title="Edit Template"
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
              <Button variant="outline" onClick={handleBackButton}>Cancel</Button>
              <Button variant="secondary" onClick={saveOrganizerTemp}>Save</Button>
              <Button onClick={saveandexitOrganizerTemp}>Save & Exit</Button>
            </>
          }
        >
          <FormSection title="General">
            <FormField label="Template Name">
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name"
              />
            </FormField>
            <FormField label="Organizer Name">
              <Input
                ref={textFieldRef}
                value={organizerName}
                onChange={handlejobName}
                onClick={(e) => setCursorPosition(e.target.selectionStart)}
                placeholder="Organizer name"
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
                                      <div title="Unavailable in preview mode">
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
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3 mt-6">
                  <Button
                    type="button"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outline"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    disabled={activeStep === totalSteps - 1}
                    onClick={handleNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </LocalizationProvider>
          </div>
        )}
      </DndProvider>
    </>
  );
};
// const OrganizersTempUpdate = () => {
//   const moveSection = (fromIndex, toIndex) => {
//     const newSections = [...sections];
//     const [movedSection] = newSections.splice(fromIndex, 1);
//     newSections.splice(toIndex, 0, movedSection);
//     setSections(newSections);
//   };

//   const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [shortcuts, setShortcuts] = useState([]);
//   const [filteredShortcuts, setFilteredShortcuts] = useState([]);
//   const [selectedOption, setSelectedOption] = useState("contacts");
//   const [selectedShortcut, setSelectedShortcut] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);
//   useEffect(() => {
//     // Simulate filtered shortcuts based on some logic (e.g., search)
//     setFilteredShortcuts(
//       shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
//     );
//   }, [shortcuts]);
//   useEffect(() => {
//     if (selectedOption === "contacts" || selectedOption === "account") {
//       const accountShortcuts = [
//         { title: "Account Shortcodes", isBold: true },
//         { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
//         // { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
//         { title: "Date Shortcodes", isBold: true },
//         {
//           title: "Current day full date",
//           isBold: false,
//           value: "CURRENT_DAY_FULL_DATE",
//         },
//         {
//           title: "Current day number",
//           isBold: false,
//           value: "CURRENT_DAY_NUMBER",
//         },
//         { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
//         { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
//         {
//           title: "Current month number",
//           isBold: false,
//           value: "CURRENT_MONTH_NUMBER",
//         },
//         {
//           title: "Current month name",
//           isBold: false,
//           value: "CURRENT_MONTH_NAME",
//         },
//         { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
//         { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
//         {
//           title: "Last day full date",
//           isBold: false,
//           value: "LAST_DAY_FULL_DATE",
//         },
//         { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
//         { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
//         { title: "Last week", isBold: false, value: "LAST_WEEK" },
//         {
//           title: "Last month number",
//           isBold: false,
//           value: "LAST_MONTH_NUMBER",
//         },
//         { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
//         { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
//         { title: "Last_year", isBold: false, value: "LAST_YEAR" },
//         {
//           title: "Next day full date",
//           isBold: false,
//           value: "NEXT_DAY_FULL_DATE",
//         },
//         { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
//         { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
//         { title: "Next week", isBold: false, value: "NEXT_WEEK" },
//         {
//           title: "Next month number",
//           isBold: false,
//           value: "NEXT_MONTH_NUMBER",
//         },
//         { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
//         { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
//         { title: "Next year", isBold: false, value: "NEXT_YEAR" },
//       ];
//       setShortcuts(accountShortcuts);
//     }
//   }, [selectedOption]);

//   const handleCloseDropdown = () => {
//     setShowDropdown(false);
//     setAnchorEl(null);
//   };

//   const [cursorPosition, setCursorPosition] = useState(0);
//   const textFieldRef = useRef(null);
//   const handlejobName = (e) => {
//     const { value, selectionStart } = e.target;
//     setOrganizerName(value);
//     setCursorPosition(selectionStart);
//   };
//   const toggleDropdown = (event) => {
//     setAnchorEl(event.currentTarget);
//     setShowDropdown(!showDropdown);
//   };

//   const handleAddShortcut = (shortcut) => {
//     setOrganizerName((prevText) => {
//       const newText =
//         prevText.slice(0, cursorPosition) +
//         `[${shortcut}]` +
//         prevText.slice(cursorPosition);
//       return newText;
//     });

//     setTimeout(() => {
//       if (textFieldRef.current) {
//         textFieldRef.current.focus();
//         textFieldRef.current.setSelectionRange(
//           cursorPosition + shortcut.length + 2,
//           cursorPosition + shortcut.length + 2
//         );
//       }
//     }, 0);

//     setShowDropdown(false);
//   };
//   const [templateName, setTemplateName] = useState("");
//   const [organizerName, setOrganizerName] = useState("");
//   const [sections, setSections] = useState([]);
//   const [selectedSection, setSelectedSection] = useState(null);
//   // const [templateData, setTemplateData] = useState(null);

//   const [loginChecked, setLoginChecked] = useState(false);
//   const [notifyChecked, setNotifyChecked] = useState(false);
//   const [emailSyncChecked, setEmailSyncChecked] = useState(false);
//   const [autoSaveChecked, setAutoSaveChecked] = useState(false);

//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const handleDrawerOpen = () => {
//     setIsDrawerOpen(true);
//   };
//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//   };
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   // Handlers for toggling switches
//   const handleLoginToggle = (checked) => {
//     setLoginChecked(checked);
//   };

//   const handleNotifyToggle = (checked) => {
//     setNotifyChecked(checked);
//   };

//   const handleEmailSyncToggle = (checked) => {
//     setEmailSyncChecked(checked);
//   };

//   const handleAutoSaveToggle = (checked) => {
//     setAutoSaveChecked(checked);
//   };
//   const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
//   const [noOfReminder, setNoOfReminder] = useState(1);
//   useEffect(() => {
//     fetchidwiseData();
//   }, []);

//   const fetchidwiseData = async () => {
//     try {
//       const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${id}`;
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const data = await response.json();
//       console.log(data);
//       // setTemplateData(data.organizerTemplate);
//       setTemplateName(data.organizerTemplate.templatename);
//       // console.log(data.organizerTemplate.templatename)
//       setOrganizerName(data.organizerTemplate.organizerName);
//       // console.log(data.organizerTemplate.sections)
//       setSections(data.organizerTemplate.sections || []);

//       const organizerSettings = data.organizerTemplate.organizersettings;
//       console.log("Organizer Settings:", organizerSettings);
//       // Example of how to set organizer settings into state
//       setLoginChecked(organizerSettings.notifyaboutdocumentupload);
//       setNotifyChecked(organizerSettings.organizerselfservice);
//       setEmailSyncChecked(organizerSettings.automaticallysealaftersubmission);
//       setAutoSaveChecked(organizerSettings.sendreminderstoclient);
//       setDaysuntilNextReminder(organizerSettings.daysuntilnextreminder);
//       setNoOfReminder(organizerSettings.numberofreminders);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   function truncateText(text, maxWords) {
//     const words = text.split(" ");
//     if (words.length > maxWords) {
//       return words.slice(0, maxWords).join(" ") + " ..";
//     }
//     return text;
//   }
//   const addSection = () => {
//     // const newSection = { id: Date.now(), name: `Section ${sections.length + 1}`, text: '', formElements: [] };
//     const newSection = {
//       id: Date.now(),
//       name: `Section ${sections.length + 1}`,
//       text: "",
//       formElements: [],
//       sectionSettings: {
//         sectionRepeatingMode: false,
//         buttonName: "",
//         conditional: false,
//         mode: "",
//         conditions: [
//           {
//             question: "",
//             answer: "",
//           },
//         ],
//       },
//     };
//     setSections([...sections, newSection]);
//     setSelectedSection(newSection); // Select the newly added section
//   };
//   console.log(sections);
//   console.log(selectedSection);

//   const handleSectionClick = (section) => {
//     // const newSection = {
//     //     id: section.sectionId, name: section.sectionname, text: section.sectionname, formElements: section.questions
//     // };
//     setSelectedSection(section);
//   };
//   const handleDeleteSection = (sectionId) => {
//     const newSections = sections.filter((section) => section.id !== sectionId);
//     setSections(newSections);
//     if (selectedSection && selectedSection.id === sectionId) {
//       setSelectedSection(null); // Clear selected section if it's deleted
//     }
//   };

//   const handleUpdateSection = (id, newText, newFormElements) => {
//     setSections((prevSections) =>
//       prevSections.map((section) =>
//         section.id === id
//           ? { ...section, text: newText, formElements: newFormElements }
//           : section
//       )
//     );
//   };

//   const handleDuplicateSection = (sectionId) => {
//     const sectionToDuplicate = sections.find(
//       (section) => section.id === sectionId
//     );

//     if (sectionToDuplicate) {
//       const newSectionId = Date.now(); // Or use a UUID generator for better uniqueness

//       const duplicatedFormElements = sectionToDuplicate.formElements.map(
//         (element) => ({
//           ...element,
//           id: Date.now() + Math.floor(Math.random() * 1000), // Ensure unique ID
//           sectionid: newSectionId,
//         })
//       );

//       const duplicatedSection = {
//         ...sectionToDuplicate,
//         id: newSectionId,
//         text: `${sectionToDuplicate.text} (Copy)`,
//         formElements: duplicatedFormElements,
//       };

//       setSections([...sections, duplicatedSection]);
//     }
//   };

//   const saveOrganizerTemp = () => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const organizersettings = {
//       notifyaboutdocumentupload: loginChecked, // Example state
//       organizerselfservice: notifyChecked, // Example state
//       automaticallysealaftersubmission: emailSyncChecked, // Example state
//       sendreminderstoclient: autoSaveChecked, // Example state
//       daysuntilnextreminder: daysuntilNextReminder, // Example state
//       numberofreminders: noOfReminder, // Example state
//     };

//     const raw = JSON.stringify({
//       templatename: templateName,
//       organizerName: organizerName,
//       sections: sections.map((section) => ({
//         name: section.text,
//         text: section.text,
//         id: section.id.toString(),
//         sectionsettings: section.sectionsettings || {},
//         formElements: section.formElements.map((element) => ({
//           type: element.type,
//           id: element.id,
//           sectionid: element.sectionid,
//           options: element.options.map((option) => ({
//             id: option.id,
//             text: option.text,
//           })),
//           text: element.text,
//           questionsectionsettings: element.questionsectionsettings || {},
//         })),
//       })),
//       organizersettings: organizersettings,
//       active: true,
//     });

//     const requestOptions = {
//       method: "PATCH",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };

//     console.log(raw);
//     const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${id}`;
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result);
//         if (
//           result &&
//           result.message === "OrganizerTemplate Updated successfully"
//         ) {
//           toast.success("Organizer Template Updated successfully");
//           // navigate('/firmtemp/templates/organizers');
//         } else {
//           toast.error(result.error || "Failed to Update Organizer Template");
//         }
//       })
//       .catch((error) => console.error(error));
//   };

//   const saveandexitOrganizerTemp = () => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const organizersettings = {
//       notifyaboutdocumentupload: loginChecked, // Example state
//       organizerselfservice: notifyChecked, // Example state
//       automaticallysealaftersubmission: emailSyncChecked, // Example state
//       sendreminderstoclient: autoSaveChecked, // Example state
//       daysuntilnextreminder: daysuntilNextReminder, // Example state
//       numberofreminders: noOfReminder, // Example state
//     };

//     const raw = JSON.stringify({
//       templatename: templateName,
//       organizerName: organizerName,
//       sections: sections.map((section) => ({
//         name: section.text,
//         text: section.text,
//         id: section.id.toString(),
//         sectionsettings: section.sectionsettings || {},
//         formElements: section.formElements.map((element) => ({
//           type: element.type,
//           id: element.id,
//           sectionid: element.sectionid,
//           options: element.options.map((option) => ({
//             id: option.id,
//             text: option.text,
//           })),
//           text: element.text,
//           questionsectionsettings: element.questionsectionsettings || {},
//         })),
//       })),
//       organizersettings: organizersettings,
//       active: true,
//     });

//     const requestOptions = {
//       method: "PATCH",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };

//     console.log(raw);
//     const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${id}`;
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result);
//         if (
//           result &&
//           result.message === "OrganizerTemplate Updated successfully"
//         ) {
//           toast.success("Organizer Template Updated successfully");
//           navigate("/firmtemp/templates/organizers");
//         } else {
//           toast.error(result.error || "Failed to Update Organizer Template");
//         }
//       })
//       .catch((error) => console.error(error));
//   };

//   const [isFormFilled, setIsFormFilled] = useState(false);
//   const handleBackButton = () => {
//     if (isFormFilled) {
//       const confirmCancel = window.confirm(
//         "You have unsaved changes. Are you sure you want to cancel?"
//       );
//       if (confirmCancel) {
//         navigate("/firmtemp/templates/organizers");
//       }
//     } else {
//       navigate("/firmtemp/templates/organizers");
//     }
//   };

//   useEffect(() => {
//     // Check if form is filled
//     const checkIfFormFilled = () => {
//       if (organizerName || templateName || sections) {
//         setIsFormFilled(true);
//       } else {
//         setIsFormFilled(false);
//       }
//     };

//     checkIfFormFilled();
//   }, [organizerName, templateName, sections]);
//   const handleFormSave = (elementId, formData) => {
//     setSections((prevSections) =>
//       prevSections.map((section) => ({
//         ...section,
//         formElements: section.formElements.map((el) =>
//           el.id === elementId
//             ? { ...el, questionsectionsettings: formData }
//             : el
//         ),
//       }))
//     );
//   };
//   const handleSectionSaveData = (settings) => {
//     console.log("gfg selected section org", settings);
//     // Update the specific section with the new settings
//     setSections((prevSections) =>
//       prevSections.map((section) =>
//         section.id === selectedSection.id
//           ? { ...section, sectionsettings: settings }
//           : section
//       )
//     );
//   };

//   const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
//   const handlePreview = () => {
//     setPreviewDialogOpen(true); // Open the dialog
//     const data = {
//       sections, // This contains all your sections and their elements
//     };

//     // You can also use any other required data from your state here
//     console.log("Data for preview:", data);
//   };

//   const handleClosePreview = () => {
//     setPreviewDialogOpen(false); // Close the dialog
//   };
//   const [startDate, setStartDate] = useState(null);
//   const [activeStep, setActiveStep] = useState(0);
//   // const totalSteps = sections.length;

//   const handleStartDateChange = (date) => {
//     setStartDate(date);
//   };

//   const handleNext = () => {
//     if (activeStep < totalSteps - 1) {
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     }
//   };

//   const handleDropdownChange = (event) => {
//     const selectedIndex = event.target.value;
//     setActiveStep(selectedIndex);
//   };

//   const [radioValues, setRadioValues] = useState({});
//   const [checkboxValues, setCheckboxValues] = useState({});
//   const [answeredElements, setAnsweredElements] = useState({});

//   const handleRadioChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setRadioValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };
//   const handleCheckboxChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setCheckboxValues((prevValues) => ({
//       ...prevValues,
//       [key]: {
//         ...prevValues[key],
//         [value]: !prevValues[key]?.[value],
//       },
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const [selectedValue, setSelectedValue] = useState(null);

//   const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
//   const handleYesNoChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setSelectedYesNoValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const [inputValues, setInputValues] = useState({});

//   const handleInputChange = (event, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     const { value } = event.target;
//     setInputValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };
//   const [selectedDropdownValues, setSelectedDropdownValues] = useState({});

//   const handleDropdownValueChange = (event, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setSelectedDropdownValues((prevValues) => ({
//       ...prevValues,
//       [key]: event.target.value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
//   };

//   const stripHtmlTags = (html) => {
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = html;
//     return tempDiv.innerText || tempDiv.textContent || "";
//   };

//   const shouldShowElement = (element, sectionId) => {
//     const settings = element.questionsectionsettings;
//     if (!settings?.conditional) return true;

//     const conditions = settings?.conditions || [];
//     const mode = settings?.mode || "All";

//     if (conditions.length === 0) return true;

//     let matchedConditions = 0;

//     for (const condition of conditions) {
//       const { question, answer } = condition;
//       if (!question || !answer) continue;

//       let conditionMet = false;

//       for (const key in radioValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId =
//           typeof sectionId === "string" ? Number(sectionId) : sectionId;

//         if (
//           numericKeySectionId === numericCurrentSectionId &&
//           key.endsWith(`_${question}`) &&
//           radioValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       for (const key in checkboxValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId =
//           typeof sectionId === "string" ? Number(sectionId) : sectionId;

//         if (
//           numericKeySectionId === numericCurrentSectionId &&
//           key.endsWith(`_${question}`) &&
//           checkboxValues[key]?.[answer]
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       for (const key in selectedDropdownValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId =
//           typeof sectionId === "string" ? Number(sectionId) : sectionId;

//         if (
//           numericKeySectionId === numericCurrentSectionId &&
//           key.endsWith(`_${question}`) &&
//           selectedDropdownValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       for (const key in selectedYesNoValues) {
//         const [keySectionId] = key.split("_");
//         const numericKeySectionId = Number(keySectionId);
//         const numericCurrentSectionId =
//           typeof sectionId === "string" ? Number(sectionId) : sectionId;

//         if (
//           numericKeySectionId === numericCurrentSectionId &&
//           key.endsWith(`_${question}`) &&
//           selectedYesNoValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") continue;
//         else continue;
//       }

//       if (mode === "All" && !conditionMet) {
//         return false;
//       }
//     }

//     if (mode === "Any") {
//       return matchedConditions > 0;
//     } else {
//       return matchedConditions === conditions.length;
//     }
//   };

//   const [repeatedSections, setRepeatedSections] = useState({});

//   const shouldShowSection = (section) => {
//     console.log("Checking visibility for section:", section);
//     if (!section.sectionsettings?.conditional) return true;

//     const conditions = section.sectionsettings.conditions || [];
//     const mode = section.sectionsettings.mode || "All";

//     if (conditions.length === 0) return true;

//     let matchedConditions = 0;

//     conditions.forEach((condition) => {
//       if (!condition.question || !condition.answer) return;

//       let conditionMet = false;

//       for (const key in radioValues) {
//         const [checkSectionId] = key.split("_");
//         const numericCheckSectionId = Number(checkSectionId);
//         if (
//           !Object.values(repeatedSections)
//             .flat()
//             .includes(numericCheckSectionId)
//         ) {
//           if (
//             key.endsWith(`_${condition.question}`) &&
//             radioValues[key] === condition.answer
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       for (const key in checkboxValues) {
//         const [checkSectionId] = key.split("_");
//         const numericCheckSectionId = Number(checkSectionId);
//         if (
//           !Object.values(repeatedSections)
//             .flat()
//             .includes(numericCheckSectionId)
//         ) {
//           if (
//             key.endsWith(`_${condition.question}`) &&
//             checkboxValues[key]?.[condition.answer]
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       for (const key in selectedDropdownValues) {
//         const [checkSectionId] = key.split("_");
//         const numericCheckSectionId = Number(checkSectionId);
//         if (
//           !Object.values(repeatedSections)
//             .flat()
//             .includes(numericCheckSectionId)
//         ) {
//           if (
//             key.endsWith(`_${condition.question}`) &&
//             selectedDropdownValues[key] === condition.answer
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//         return;
//       }

//       for (const key in selectedYesNoValues) {
//         const [checkSectionId] = key.split("_");
//         const numericCheckSectionId = Number(checkSectionId);
//         if (
//           !Object.values(repeatedSections)
//             .flat()
//             .includes(numericCheckSectionId)
//         ) {
//           if (
//             key.endsWith(`_${condition.question}`) &&
//             selectedYesNoValues[key] === condition.answer
//           ) {
//             conditionMet = true;
//             break;
//           }
//         }
//       }
//       if (conditionMet) {
//         matchedConditions++;
//         if (mode === "Any") return;
//       }
//     });

//     if (mode === "Any") {
//       return matchedConditions > 0;
//     } else {
//       return matchedConditions === conditions.length;
//     }
//   };



//   const getVisibleSections = () => sections.filter(shouldShowSection);

//   const visibleSections = getVisibleSections();
//   const totalSteps = visibleSections.length;
//   return (
//     <>
//       <DndProvider backend={HTML5Backend}>
//         <Box>
//           <Box
//             sx={{
//               display: "flex",
//               alighItems: "center",
//               justifyContent: "space-between",
//               mb: 3,
//             }}
//           >
//             <Typography variant="h4">Edit Template</Typography>
//             <Box>
//               <Button variant="text" onClick={handlePreview}>
//                 Preview
//               </Button>
//               <Button variant="text" onClick={handleDrawerOpen}>
//                 Setting
//               </Button>
//             </Box>
//             {/* <Button variant="text" onClick={handlePreview} >Preview</Button> */}
//           </Box>
//           <Box>
//             <label className="organizer-input-label">Template Name</label>
//             <TextField
//               value={templateName}
//               onChange={(e) => setTemplateName(e.target.value)}
//               fullWidth
//               size="small"
//               margin="normal"
//               placeholder="Template name"
//               sx={{ backgroundColor: "#fff" }}
//               className="organizer-input-label"
//             />
//           </Box>
//           <Box mt={2}>
//             <label className="organizer-input-label">Organizer name</label>
//             <TextField
//               // value={organizerName + selectedShortcut}
//               // onChange={handlejobName}
//               inputRef={textFieldRef}
//               value={organizerName}
//               onChange={handlejobName}
//               onClick={(e) => setCursorPosition(e.target.selectionStart)}
//               fullWidth
//               size="small"
//               margin="normal"
//               placeholder="Organizer name"
//               className="organizer-input-label"
//               sx={{ backgroundColor: "#fff" }}
//             />
//             <Box>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={toggleDropdown}
//                 sx={{
//                   backgroundColor: "var(--color-save-btn)", // Normal background

//                   "&:hover": {
//                     backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//                   },
//                   borderRadius: "15px",
//                   mt: 2,
//                 }}
//               >
//                 Add Shortcode
//               </Button>

//               <Popover
//                 open={showDropdown}
//                 anchorEl={anchorEl}
//                 onClose={handleCloseDropdown}
//                 anchorOrigin={{
//                   vertical: "bottom",
//                   horizontal: "left",
//                 }}
//                 transformOrigin={{
//                   vertical: "top",
//                   horizontal: "left",
//                 }}
//               >
//                 <Box>
//                   <List
//                     className="dropdown-list"
//                     sx={{ width: "300px", height: "300px", cursor: "pointer" }}
//                   >
//                     {filteredShortcuts.map((shortcut, index) => (
//                       <ListItem
//                         key={index}
//                         onClick={() => handleAddShortcut(shortcut.value)}
//                       >
//                         <ListItemText
//                           primary={shortcut.title}
//                           primaryTypographyProps={{
//                             style: {
//                               fontWeight: shortcut.isBold ? "bold" : "normal",
//                             },
//                           }}
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Box>
//               </Popover>
//             </Box>
//           </Box>
//         </Box>
//         <Box
//           className="organizer-container"
//           sx={{
//             display: "flex",
//             marginTop: "40px",
//             height: "auto",
//             width: "100%",
//             gap: 3,
//           }}
//         >
//           <Box
//             className="left-org-container"
//             sx={{ padding: "10px", width: "30%", height: "auto", p: 2 }}
//           >
//             <Box>
//               {sections.map((section, index) => (
//                 <SectionItem
//                   key={section.id}
//                   section={section}
//                   index={index}
//                   onClick={handleSectionClick}
//                   onDrop={moveSection}
//                   truncateText={truncateText}
//                   isSelected={selectedSection?.id === section.id}
//                 />
//               ))}
//             </Box>
//             <Box sx={{ width: "50%", height: "25px", marginTop: "20px" }}>
//               <Button
//                 variant="contained"
//                 onClick={addSection}
//                 sx={{
//                   backgroundColor: "var(--color-save-btn)", // Normal background

//                   "&:hover": {
//                     backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//                   },
//                   borderRadius: "15px",
//                 }}
//               >
//                 New section
//               </Button>
//             </Box>
//           </Box>
//           <Box
//             className="right-container"
//             sx={{ borderRadius: "20px", width: "70%", height: "auto" }}
//           >
//             {selectedSection && (
//               <Section
//                 key={selectedSection.id}
//                 section={selectedSection}
//                 onDelete={handleDeleteSection}
//                 onUpdate={handleUpdateSection}
//                 onDuplicate={handleDuplicateSection}
//                 onSaveFormData={handleFormSave}
//                 onSaveSectionData={handleSectionSaveData}
//                 sections={sections}
//               />
//             )}
//           </Box>
//         </Box>
//         <Box
//           sx={{
//             display: "flex",
//             gap: "10px",
//             marginLeft: "10px",
//             marginBottom: "20px",
//             marginTop: "20px",
//           }}
//         >
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             onClick={saveandexitOrganizerTemp}
//             sx={{
//               backgroundColor: "var(--color-save-btn)", // Normal background

//               "&:hover": {
//                 backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//               },
//               borderRadius: "15px",
//             }}
//           >
//             Save & exit
//           </Button>
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             onClick={saveOrganizerTemp}
//             sx={{
//               backgroundColor: "var(--color-save-btn)", // Normal background

//               "&:hover": {
//                 backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//               },
//               borderRadius: "15px",
//               width: "80px",
//             }}
//           >
//             Save
//           </Button>
//           <Button
//             type="button"
//             variant="outlined"
//             color="primary"
//             onClick={handleBackButton}
//             sx={{
//               borderColor: "var(--color-border-cancel-btn)", // Normal background
//               color: "var(--color-save-btn)",
//               "&:hover": {
//                 backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//                 color: "#fff",
//                 border: "none",
//               },
//               width: "80px",
//               borderRadius: "15px",
//             }}
//           >
//             Cancel
//           </Button>
//         </Box>

//         <Drawer
//           anchor="right"
//           open={isDrawerOpen}
//           onClose={handleDrawerClose}
//           PaperProps={{
//             id: "tag-drawer",
//             sx: {
//               borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//               width: isSmallScreen ? "100%" : 500,
//               maxWidth: "100%",
//               [theme.breakpoints.down("sm")]: {
//                 width: "100%",
//               },
//             },
//           }}
//         >
//           <Box
//             sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}
//             role="presentation"
//           >
//             <Box>
//               <Box
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   padding: "15px",
//                   background: "#EEEEEE",
//                 }}
//               >
//                 <Typography variant="h6">Organizer settings</Typography>
//                 <IoClose
//                   onClick={handleDrawerClose}
//                   style={{ cursor: "pointer" }}
//                 />
//               </Box>
//               <Box sx={{ pr: 2, pl: 2, pt: 2 }}>
//                 <FormGroup>
//                   {/* Switch for Login */}
//                   <FormControlLabel
//                     control={
//                       <Switch
//                         checked={loginChecked}
//                         onChange={(event) =>
//                           handleLoginToggle(event.target.checked)
//                         }
//                       />
//                     }
//                     label="Notify about document upload"
//                   />
//                   {/* Switch for Notify */}
//                   <FormControlLabel
//                     control={
//                       <Switch
//                         checked={notifyChecked}
//                         onChange={(event) =>
//                           handleNotifyToggle(event.target.checked)
//                         }
//                       />
//                     }
//                     label="Organizer self service"
//                   />
//                   {/* Switch for Email Sync */}
//                   <FormControlLabel
//                     control={
//                       <Switch
//                         checked={emailSyncChecked}
//                         onChange={(event) =>
//                           handleEmailSyncToggle(event.target.checked)
//                         }
//                       />
//                     }
//                     label="Automatically seal after submission"
//                   />
//                   {/* Switch for Auto-Save */}
//                   <FormControlLabel
//                     control={
//                       <Switch
//                         checked={autoSaveChecked}
//                         onChange={(event) =>
//                           handleAutoSaveToggle(event.target.checked)
//                         }
//                       />
//                     }
//                     label="Send reminders to clients"
//                   />

//                   {autoSaveChecked && (
//                     <Box mb={3}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 3,
//                           mt: 2,
//                         }}
//                       >
//                         <Box>
//                           <InputLabel sx={{ color: "black" }}>
//                             Days until next reminder
//                           </InputLabel>
//                           <TextField
//                             // margin="normal"
//                             fullWidth
//                             name="Daysuntilnextreminder"
//                             value={daysuntilNextReminder}
//                             onChange={(e) =>
//                               setDaysuntilNextReminder(e.target.value)
//                             }
//                             placeholder="Days until next reminder"
//                             size="small"
//                             sx={{ mt: 2 }}
//                           />
//                         </Box>

//                         <Box>
//                           <InputLabel sx={{ color: "black" }}>
//                             No Of reminders
//                           </InputLabel>
//                           <TextField
//                             fullWidth
//                             name="No Of reminders"
//                             value={noOfReminder}
//                             onChange={(e) => setNoOfReminder(e.target.value)}
//                             placeholder="NoOfreminders"
//                             size="small"
//                             sx={{ mt: 2 }}
//                           />
//                         </Box>
//                       </Box>
//                     </Box>
//                   )}
//                 </FormGroup>
//               </Box>
//             </Box>
//           </Box>
//         </Drawer>

//         <Dialog
//           open={previewDialogOpen}
//           onClose={handleClosePreview}
//           fullScreen
//         >
//           <DialogContent>
//             <Box>
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <Box>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       border: "2px solid #3FA2F6",
//                       p: 2,
//                       mb: 3,
//                       borderRadius: "10px",
//                       backgroundColor: "#96C9F4",
//                     }}
//                   >
//                     <Box>
//                       <Typography fontWeight="bold">Preview mode</Typography>
//                       <Typography>
//                         The client sees your organizer like this
//                       </Typography>
//                     </Box>
//                     <Button variant="text" onClick={handleClosePreview}>
//                       Back to edit
//                     </Button>
//                   </Box>
//                   <Typography variant="text" gutterBottom>
//                     {organizerName}
//                   </Typography>

//                   <FormControl
//                     fullWidth
//                     sx={{ marginBottom: "10px", marginTop: "10px" }}
//                   >
//                     <Select
//                       value={activeStep}
//                       onChange={handleDropdownChange}
//                       size="small"
//                     >
//                       {visibleSections.map((section, index) => {
//                         // Filter form elements that are actually visible
//                         const visibleElements = section.formElements.filter(
//                           (el) => shouldShowElement(el, section.id)
//                         );

//                         // Count answered visible elements
//                         const answeredCount = visibleElements.reduce(
//                           (count, element) => {
//                             const key = `${section.id}_${element.text}`;
//                             return count + (answeredElements[key] ? 1 : 0);
//                           },
//                           0
//                         );

//                         const totalVisibleElements = visibleElements.length;

//                         return (
//                           <MenuItem key={section.id} value={index}>
//                             {section.text} ({answeredCount}/
//                             {totalVisibleElements})
//                           </MenuItem>
//                         );
//                       })}
//                     </Select>
//                   </FormControl>

//                   <Box mt={2} mb={2}>
//                     <LinearProgress
//                       variant="determinate"
//                       value={((activeStep + 1) / totalSteps) * 100}
//                     />
//                   </Box>

//                   <Box sx={{ pl: 20, pr: 20 }}>
//                     {visibleSections.map(
//                       (section, sectionIndex) =>
//                         sectionIndex === activeStep && (
//                           <Box key={section.id}>
//                             {section.formElements.map(
//                               (element) =>
//                                 shouldShowElement(element, section.id) && (
//                                   <Box key={`${section.id}_${element.id}`}>
//                                     {/* Text Editor */}
//                                     {element.type === "Text Editor" && (
//                                       <Box mt={2} mb={2}>
//                                         <Typography>
//                                           {stripHtmlTags(element.text)}
//                                         </Typography>
//                                       </Box>
//                                     )}

//                                     {/* Free Entry or Email */}
//                                     {(element.type === "Free Entry" ||
//                                       element.type === "Email") && (
//                                       <Box>
//                                         <Typography
//                                           fontSize="18px"
//                                           mb={1}
//                                           mt={1}
//                                         >
//                                           {element.text}
//                                         </Typography>
//                                         <TextField
//                                           variant="outlined"
//                                           size="small"
//                                           multiline
//                                           fullWidth
//                                           placeholder={`${element.type} Answer`}
//                                           inputProps={{
//                                             type:
//                                               element.type === "Free Entry"
//                                                 ? "text"
//                                                 : element.type.toLowerCase(),
//                                           }}
//                                           maxRows={8}
//                                           style={{ display: "block" }}
//                                           value={
//                                             inputValues[
//                                               `${section.id}_${element.text}`
//                                             ] || ""
//                                           }
//                                           onChange={(e) =>
//                                             handleInputChange(
//                                               e,
//                                               element.text,
//                                               section.id
//                                             )
//                                           }
//                                         />
//                                       </Box>
//                                     )}

//                                     {/* Number */}
//                                     {element.type === "Number" && (
//                                       <Box>
//                                         <Typography
//                                           fontSize="18px"
//                                           mb={1}
//                                           mt={1}
//                                         >
//                                           {element.text}
//                                         </Typography>
//                                         <TextField
//                                           variant="outlined"
//                                           size="small"
//                                           multiline
//                                           fullWidth
//                                           placeholder={`${element.type} Answer`}
//                                           inputProps={{
//                                             type: "text",
//                                             inputMode: "numeric",
//                                             pattern: "[0-9]*",
//                                           }}
//                                           maxRows={8}
//                                           style={{
//                                             display: "block",
//                                             marginTop: "15px",
//                                           }}
//                                           value={
//                                             inputValues[
//                                               `${section.id}_${element.text}`
//                                             ] || ""
//                                           }
//                                           onChange={(e) => {
//                                             const numericValue =
//                                               e.target.value.replace(/\D/g, "");
//                                             handleInputChange(
//                                               {
//                                                 target: { value: numericValue },
//                                               },
//                                               element.text,
//                                               section.id
//                                             );
//                                           }}
//                                         />
//                                       </Box>
//                                     )}

//                                     {/* Radio Buttons */}
//                                     {element.type === "Radio Buttons" && (
//                                       <Box>
//                                         <Typography
//                                           fontSize="18px"
//                                           mb={1}
//                                           mt={1}
//                                         >
//                                           {element.text}
//                                         </Typography>
//                                         <Box
//                                           sx={{
//                                             display: "flex",
//                                             gap: 1,
//                                             flexWrap: "wrap",
//                                           }}
//                                         >
//                                           {element.options.map((option) => (
//                                             <Button
//                                               key={option.text}
//                                               variant={
//                                                 radioValues[
//                                                   `${section.id}_${element.text}`
//                                                 ] === option.text
//                                                   ? "contained"
//                                                   : "outlined"
//                                               }
//                                               onClick={() =>
//                                                 handleRadioChange(
//                                                   option.text,
//                                                   element.text,
//                                                   section.id
//                                                 )
//                                               }
//                                               sx={{
//                                                 borderRadius: "15px",
//                                                 ...(radioValues[
//                                                   `${section.id}_${element.text}`
//                                                 ] === option.text
//                                                   ? {
//                                                       backgroundColor:
//                                                         "var(--color-save-btn)",
//                                                       "&:hover": {
//                                                         backgroundColor:
//                                                           "var(--color-save-hover-btn)",
//                                                       },
//                                                     }
//                                                   : {
//                                                       borderColor:
//                                                         "var(--color-border-cancel-btn)",
//                                                       color:
//                                                         "var(--color-save-btn)",
//                                                       "&:hover": {
//                                                         backgroundColor:
//                                                           "var(--color-save-hover-btn)",
//                                                         color: "#fff",
//                                                         border: "none",
//                                                       },
//                                                     }),
//                                               }}
//                                             >
//                                               {option.text}
//                                             </Button>
//                                           ))}
//                                         </Box>
//                                       </Box>
//                                     )}

//                                     {/* Checkboxes */}
//                                     {element.type === "Checkboxes" && (
//                                       <Box>
//                                         <Typography fontSize="18px">
//                                           {element.text}
//                                         </Typography>
//                                         <Box
//                                           sx={{
//                                             display: "flex",
//                                             gap: 1,
//                                             flexWrap: "wrap",
//                                           }}
//                                         >
//                                           {element.options.map((option) => (
//                                             <Button
//                                               key={option.text}
//                                               variant={
//                                                 checkboxValues[
//                                                   `${section.id}_${element.text}`
//                                                 ]?.[option.text]
//                                                   ? "contained"
//                                                   : "outlined"
//                                               }
//                                               onClick={() =>
//                                                 handleCheckboxChange(
//                                                   option.text,
//                                                   element.text,
//                                                   section.id
//                                                 )
//                                               }
//                                               sx={{
//                                                 borderRadius: "15px",
//                                                 ...(checkboxValues[
//                                                   `${section.id}_${element.text}`
//                                                 ]?.[option.text]
//                                                   ? {
//                                                       backgroundColor:
//                                                         "var(--color-save-btn)",
//                                                       "&:hover": {
//                                                         backgroundColor:
//                                                           "var(--color-save-hover-btn)",
//                                                       },
//                                                     }
//                                                   : {
//                                                       borderColor:
//                                                         "var(--color-border-cancel-btn)",
//                                                       color:
//                                                         "var(--color-save-btn)",
//                                                       "&:hover": {
//                                                         backgroundColor:
//                                                           "var(--color-save-hover-btn)",
//                                                         color: "#fff",
//                                                         border: "none",
//                                                       },
//                                                     }),
//                                               }}
//                                             >
//                                               {option.text}
//                                             </Button>
//                                           ))}
//                                         </Box>
//                                       </Box>
//                                     )}

//                                     {/* Yes/No */}
//                                     {element.type === "Yes/No" && (
//                                       <Box>
//                                         <Typography fontSize="18px">
//                                           {element.text}
//                                         </Typography>
//                                         <Box sx={{ display: "flex", gap: 1 }}>
//                                           {element.options.map((option) => (
//                                             <Button
//                                               key={option.text}
//                                               variant={
//                                                 selectedYesNoValues[
//                                                   `${section.id}_${element.text}`
//                                                 ] === option.text
//                                                   ? "contained"
//                                                   : "outlined"
//                                               }
//                                               onClick={() =>
//                                                 handleYesNoChange(
//                                                   option.text,
//                                                   element.text,
//                                                   section.id
//                                                 )
//                                               }
//                                               sx={{
//                                                 borderRadius: "15px",
//                                                 ...(selectedYesNoValues[
//                                                   `${section.id}_${element.text}`
//                                                 ] === option.text
//                                                   ? {
//                                                       backgroundColor:
//                                                         "var(--color-save-btn)",
//                                                       "&:hover": {
//                                                         backgroundColor:
//                                                           "var(--color-save-hover-btn)",
//                                                       },
//                                                     }
//                                                   : {
//                                                       borderColor:
//                                                         "var(--color-border-cancel-btn)",
//                                                       color:
//                                                         "var(--color-save-btn)",
//                                                       "&:hover": {
//                                                         backgroundColor:
//                                                           "var(--color-save-hover-btn)",
//                                                         color: "#fff",
//                                                         border: "none",
//                                                       },
//                                                     }),
//                                               }}
//                                             >
//                                               {option.text}
//                                             </Button>
//                                           ))}
//                                         </Box>
//                                       </Box>
//                                     )}

//                                     {/* Dropdown */}
//                                     {element.type === "Dropdown" && (
//                                       <Box>
//                                         <Typography fontSize="18px">
//                                           {element.text}
//                                         </Typography>
//                                         <FormControl fullWidth>
//                                           <Select
//                                             value={
//                                               selectedDropdownValues[
//                                                 `${section.id}_${element.text}`
//                                               ] || ""
//                                             }
//                                             onChange={(event) =>
//                                               handleDropdownValueChange(
//                                                 event,
//                                                 element.text,
//                                                 section.id
//                                               )
//                                             }
//                                             size="small"
//                                           >
//                                             {element.options.map((option) => (
//                                               <MenuItem
//                                                 key={option.text}
//                                                 value={option.text}
//                                               >
//                                                 {option.text}
//                                               </MenuItem>
//                                             ))}
//                                           </Select>
//                                         </FormControl>
//                                       </Box>
//                                     )}

//                                     {/* Date */}
//                                     {element.type === "Date" && (
//                                       <Box>
//                                         <Typography fontSize="18px">
//                                           {element.text}
//                                         </Typography>
//                                         <DatePicker
//                                           format="MM/DD/YYYY"
//                                           sx={{
//                                             width: "100%",
//                                             backgroundColor: "#fff",
//                                           }}
//                                           selected={startDate}
//                                           onChange={handleStartDateChange}
//                                           renderInput={(params) => (
//                                             <TextField
//                                               {...params}
//                                               size="small"
//                                             />
//                                           )}
//                                           onOpen={() =>
//                                             setAnsweredElements(
//                                               (prevAnswered) => ({
//                                                 ...prevAnswered,
//                                                 [`${section.id}_${element.text}`]: true,
//                                               })
//                                             )
//                                           }
//                                         />
//                                       </Box>
//                                     )}

//                                     {/* File Upload */}
//                                     {element.type === "File Upload" && (
//                                       <Box>
//                                         <Typography
//                                           fontSize="18px"
//                                           mb={1}
//                                           mt={2}
//                                         >
//                                           {element.text}
//                                         </Typography>
//                                         <Tooltip
//                                           title="Unavailable in preview mode"
//                                           placement="top"
//                                         >
//                                           <Box
//                                             sx={{
//                                               position: "relative",
//                                               width: "100%",
//                                             }}
//                                           >
//                                             <TextField
//                                               variant="outlined"
//                                               size="small"
//                                               fullWidth
//                                               disabled
//                                               placeholder="Add Document"
//                                               sx={{
//                                                 cursor: "not-allowed",
//                                                 "& .MuiInputBase-input": {
//                                                   pointerEvents: "none",
//                                                   cursor: "not-allowed",
//                                                 },
//                                               }}
//                                             />
//                                           </Box>
//                                         </Tooltip>
//                                       </Box>
//                                     )}
//                                   </Box>
//                                 )
//                             )}
//                           </Box>
//                         )
//                     )}

//                     <Box mt={3} display="flex" gap={3} alignItems="center">
//                       <Button
//                         disabled={activeStep === 0}
//                         onClick={handleBack}
//                         variant="contained"
//                         sx={{
//                           backgroundColor: "var(--color-save-btn)", // Normal background

//                           "&:hover": {
//                             backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//                           },
//                           width: "80px",
//                           borderRadius: "15px",
//                         }}
//                       >
//                         Back
//                       </Button>
//                       <Button
//                         onClick={handleNext}
//                         disabled={activeStep === totalSteps - 1}
//                         variant="contained"
//                         sx={{
//                           backgroundColor: "var(--color-save-btn)", // Normal background

//                           "&:hover": {
//                             backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//                           },
//                           width: "80px",
//                           borderRadius: "15px",
//                         }}
//                       >
//                         Next
//                       </Button>
//                     </Box>
//                   </Box>
//                 </Box>
//               </LocalizationProvider>
//             </Box>
//           </DialogContent>
//         </Dialog>
//       </DndProvider>
//     </>
//   );
// };


export default OrganizersTempUpdate;

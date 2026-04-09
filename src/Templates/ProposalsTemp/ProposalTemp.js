import React, { useState, useEffect, useMemo, useRef } from "react";
import Editor from "../Texteditor/Editor";
import TermEditor from "../Texteditor/TermEditor";
import CreatableSelect from "react-select/creatable";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import Invoice from "./Invoice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import EditorShortcodes from "../Texteditor/EditorShortcodes";
import MultiSelectDropdown from "../MultiSelectDropdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../components/ui/sheet";

const MyStepper = () => {
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;

  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const [activeStep, setActiveStep] = useState(0);
  const [showStepper, setShowStepper] = useState(false);
  const [introductionContent, setIntroductionContent] = useState("");
  const [termsContent, setTermsContent] = useState("");
  const [servicedata, setServiceData] = useState([]);
  const [activeOption, setActiveOption] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const [invoiceData, setInvoiceData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const serviceandinvoiceSettings = (data) => {
    console.log("Invoice data received:", data);

    const newInvoiceData = {
      servicesandinvoicetempid: data.invoiceTempId,
      invoicetemplatename: data.invoiceTempName,
      invoiceteammember: data.invoiceTeamMember,
      issueinvoice: data.issueInvoiceSelect,
      specificdate: data.specificDate,
      specifictime: data.specificTime,
      description: data.descriptionData,
      lineItems: data.lineItems,
      summary: data.summary,
      isUpdating: isUpdating,
      notetoclient: data.noteToClient,
    };
    setInvoiceData(newInvoiceData);
  };
  console.log(invoiceData);

  const [addInvoice, setAddInvoice] = useState("");
  const [addInvoiceitemized, setAddInvoiceitemized] = useState("");

  const handleShowInvoiceForm = () => {
    setActiveOption("invoice");
    setAddInvoice("invoice");
  };

  const handleShowServiceForm = () => {
    setActiveOption("service");
    setAddInvoiceitemized("service");
  };

  const [stepsVisibility, setStepsVisibility] = useState({
    Introduction: true,
    Terms: true,
    ServicesInvoices: true,
    CustomEmailMessage: true,
    Reminders: true,
  });

  const steps = ["General"].concat(
    stepsVisibility.Introduction ? ["Introduction"] : [],
    stepsVisibility.Terms ? ["Terms"] : [],
    stepsVisibility.ServicesInvoices ? ["Services & Invoices"] : [],
    activeOption === "invoice" ? ["Payments"] : []
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleReset = () => {
  //   createsaveProposaltemp();
  //   setActiveStep(0);
  //   setShowStepper(false); // Hide stepper and show the create template button
  // };
  const handleReset = () => {
    const isSaved = createsaveProposaltemp();
    if (isSaved) {
      setActiveStep(0);
      setShowStepper(false); // only hide stepper if validation & save passed
    }
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  const handleCreateTemplateClick = () => {
    setShowStepper(true);
  };

  const handleSwitchChange = (step) => (event) => {
    setStepsVisibility((prev) => ({
      ...prev,
      [step]: event.target.checked,
    }));
  };

  const handleIntroductionChange = (content) => {
    setIntroductionContent(content);
  };

  const handleTermsChange = (content) => {
    setTermsContent(content);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [proposalName, setProposalName] = useState("");
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [customMessageInEmail, setCustomMessageInEmail] = useState("");
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
  const [noOfReminder, setNoOfReminder] = useState(1);

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  // const handleAddShortcut = (shortcut) => {
  //   setProposalName((prevText) => prevText + `[${shortcut}]`);
  //   setShowDropdown(false);
  // };
  const handleAddShortcut = (shortcut) => {
    setProposalName((prevText) => {
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

  const handleAddShortcutforCustomEmail = (shortcut) => {
    setCustomMessageInEmail((prevText) => prevText + `[${shortcut}]`);
    setShowDropdown(false);
  };

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
  }, [shortcuts]);

  // useEffect(() => {
  //   // Set shortcuts based on selected option
  //   if (selectedOption === "contacts") {
  //     const contactShortcuts = [
  //       { title: "Account Shortcodes", isBold: true },
  //       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
  //       {
  //         title: "Custom field:Website",
  //         isBold: false,
  //         value: "ACCOUNT_CUSTOM_FIELD:Website",
  //       },
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
  //       {
  //         title: "Custom field:Email",
  //         isBold: false,
  //         value: "CONTACT_CUSTOM_FIELD:Email",
  //       },
  //       { title: "Date Shortcodes", isBold: true },
  //       {
  //         title: "Current day full date",
  //         isBold: false,
  //         value: "CURRENT_DAY_FULL_DATE",
  //       },
  //       {
  //         title: "Current day number",
  //         isBold: false,
  //         value: "CURRENT_DAY_NUMBER",
  //       },
  //       { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
  //       { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
  //       {
  //         title: "Current month number",
  //         isBold: false,
  //         value: "CURRENT_MONTH_NUMBER",
  //       },
  //       {
  //         title: "Current month name",
  //         isBold: false,
  //         value: "CURRENT_MONTH_NAME",
  //       },
  //       { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
  //       { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
  //       {
  //         title: "Last day full date",
  //         isBold: false,
  //         value: "LAST_DAY_FULL_DATE",
  //       },
  //       { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
  //       { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
  //       { title: "Last week", isBold: false, value: "LAST_WEEK" },
  //       {
  //         title: "Last month number",
  //         isBold: false,
  //         value: "LAST_MONTH_NUMBER",
  //       },
  //       { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
  //       { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
  //       { title: "Last_year", isBold: false, value: "LAST_YEAR" },
  //       {
  //         title: "Next day full date",
  //         isBold: false,
  //         value: "NEXT_DAY_FULL_DATE",
  //       },
  //       { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
  //       { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
  //       { title: "Next week", isBold: false, value: "NEXT_WEEK" },
  //       {
  //         title: "Next month number",
  //         isBold: false,
  //         value: "NEXT_MONTH_NUMBER",
  //       },
  //       { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
  //       { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
  //       { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  //     ];
  //     setShortcuts(contactShortcuts);
  //   } else if (selectedOption === "account") {
  //     const accountShortcuts = [
  //       { title: "Account Shortcodes", isBold: true },
  //       { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
  //       {
  //         title: "Custom field:Website",
  //         isBold: false,
  //         value: "ACCOUNT_CUSTOM_FIELD:Website",
  //       },
  //       { title: "Date Shortcodes", isBold: true },
  //       {
  //         title: "Current day full date",
  //         isBold: false,
  //         value: "CURRENT_DAY_FULL_DATE",
  //       },
  //       {
  //         title: "Current day number",
  //         isBold: false,
  //         value: "CURRENT_DAY_NUMBER",
  //       },
  //       { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
  //       { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
  //       {
  //         title: "Current month number",
  //         isBold: false,
  //         value: "CURRENT_MONTH_NUMBER",
  //       },
  //       {
  //         title: "Current month name",
  //         isBold: false,
  //         value: "CURRENT_MONTH_NAME",
  //       },
  //       { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
  //       { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
  //       {
  //         title: "Last day full date",
  //         isBold: false,
  //         value: "LAST_DAY_FULL_DATE",
  //       },
  //       { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
  //       { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
  //       { title: "Last week", isBold: false, value: "LAST_WEEK" },
  //       {
  //         title: "Last month number",
  //         isBold: false,
  //         value: "LAST_MONTH_NUMBER",
  //       },
  //       { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
  //       { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
  //       { title: "Last_year", isBold: false, value: "LAST_YEAR" },
  //       {
  //         title: "Next day full date",
  //         isBold: false,
  //         value: "NEXT_DAY_FULL_DATE",
  //       },
  //       { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
  //       { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
  //       { title: "Next week", isBold: false, value: "NEXT_WEEK" },
  //       {
  //         title: "Next month number",
  //         isBold: false,
  //         value: "NEXT_MONTH_NUMBER",
  //       },
  //       { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
  //       { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
  //       { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  //     ];
  //     setShortcuts(accountShortcuts);
  //   }
  // }, [selectedOption]);
useEffect(() => {
  if (selectedOption === "contacts" || selectedOption === "account") {
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
}, [selectedOption]);

  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
  const handleProposalName = (e) => {
    const { value, selectionStart } = e.target;
    setProposalName(value);
    setCursorPosition(selectionStart);
  };

  const handleCustomMessageInEmail = (e) => {
    const { value } = e.target;
    setCustomMessageInEmail(value);
  };

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedTeamMemberValues, setCombinedTeamMemberValues] = useState([]);
  const [userData, setUserData] = useState([]);

  // console.log(combinedValues)
  useEffect(() => {
    fetchUserData();
    setIsUpdating(false);
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchUserData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleUserChange = (event, selectedOptions) => {
  //   setSelectedUser(selectedOptions);
  //   const selectedValues = selectedOptions.map((option) => option.value);
  //   setCombinedTeamMemberValues(selectedValues);
  // };
  const [combinedValues, setCombinedValues] = useState();
  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  // services data
  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      const url = `${SERVICE_API}/workflow/services/servicetemplate`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.serviceTemplate);
      setServiceData(data.serviceTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const serviceoptions = servicedata.map((service) => ({
    value: service._id,
    label: service.serviceName,
  }));
  const [selectedservice, setselectedService] = useState();

  const fetchservicebyid = async (id, rowIndex) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${SERVICE_API}/workflow/services/servicetemplate/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        const service = Array.isArray(result.serviceTemplate)
          ? result.serviceTemplate[0]
          : result.serviceTemplate;
        // Ensure rate is correctly parsed
        const rawRate = service.rate || "0.00"; // Fallback to "0.00" if undefined
        const numericRate = parseFloat(rawRate.replace(/[^0-9.]/g, "")); // Remove $ and other non-numeric chars

        const rate = !isNaN(numericRate) ? numericRate.toFixed(2) : "0.00";
        const amount = rate; // Assuming amount is same as rate
        const updatedRow = {
          productName: service.serviceName || "", // Assuming serviceName corresponds to productName
          description: service.description || "",
          // rate: service.rate ? `$${service.rate.toFixed(2)}` : '$0.00',
          rate: `$${rate}`,
          qty: "1", // Default quantity is 1
          amount: `$${amount}`, // Use formatted amount with $
          tax: service.tax || false,
          isDiscount: false, // Default value if not present in the service object
        };

        const updatedRows = [...rows];
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updatedRow };

        console.log(updatedRows);
        setRows(updatedRows);
      })
      .catch((error) => console.error(error));
  };

  const handleServiceChange = (index, selectedOptions) => {
    setselectedService(selectedOptions);
    fetchservicebyid(selectedOptions.value, index);
  };

  const handleServiceInputChange = (inputValue, actionMeta, index) => {
    if (actionMeta.action === "input-change") {
      const newRows = [...rows];
      newRows[index].productName = inputValue;
      setRows(newRows);
    }
  };
  // add row
  const [rows, setRows] = useState([
    {
      productName: "",
      description: "",
      rate: "$0.00",
      qty: "1",
      amount: "$0.00",
      tax: false,
      isDiscount: false,
    },
  ]);
  const addRow = (isDiscountRow = false) => {
    const newRow = isDiscountRow
      ? {
          productName: "",
          description: "",
          rate: "$-10.00",
          qty: "1",
          amount: "$-10.00",
          tax: false,
          isDiscount: true,
        }
      : {
          productName: "",
          description: "",
          rate: "$0.00",
          qty: "1",
          amount: "$0.00",
          tax: false,
          isDiscount: false,
        };
    setRows([...rows, newRow]);
  };
  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };
  const handleInputChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    const newRows = [...rows];

    if (name === "rate" || name === "qty") {
      newRows[index][name] = newValue;

      const rate = parseFloat(newRows[index].rate.replace("$", "")) || 0;
      const qty = parseInt(newRows[index].qty) || 0;
      const amount = (rate * qty).toFixed(2);
      newRows[index].amount = `$${amount}`;
    } else {
      newRows[index][name] = newValue;
    }
    setRows(newRows);
  };

  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);

  const handleSubtotalChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setSubtotal(value);
    calculateTotal(value, taxRate);
  };

  const handleTaxRateChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setTaxRate(value);
    calculateTotal(subtotal, value);
  };

  const calculateTotal = (subtotal, taxRate) => {
    const tax = subtotal * (taxRate / 100);
    setTaxTotal(tax);
    setTotalAmount((subtotal + tax).toFixed(2));
  };
  useEffect(() => {
    const calculateSubtotal = () => {
      let subtotal = 0;
      rows.forEach((row) => {
        subtotal += parseFloat(row.amount.replace("$", "")) || 0;
      });
      console.log(subtotal);
      setSubtotal(subtotal);
      calculateTotal(subtotal, taxRate);
    };
    calculateSubtotal();
  }, [rows, taxRate]);

  const [ProposalsTemplates, setProposalsTemplates] = useState([]);

  useEffect(() => {
    fetchPrprosalsAllData();
  }, []);
  const [loading, setLoading] = useState(true); // Loader state
  const fetchPrprosalsAllData = async () => {
    setLoading(true); // Start loader

    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch Proposals templates");
      }
      const data = await response.json();
      setProposalsTemplates(data.proposalesAndElsTemplates);
      console.log(data);
    } catch (error) {
      console.error("Error fetching Proposals  templates:", error);
    } finally {
      // Wait for the fetch and the 3-second timer to complete
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };

  const [templatename, settemplatename] = useState("");
  const [errors, setErrors] = useState({});
  const [introductionname, setIntroductionName] = useState("");
  const [termsandconditionname, setTermsandConditionName] = useState("");
  const handleIntroductionName = (e) => {
    const { value } = e.target;
    setIntroductionName(value);
  };
  const handleTermsandConditionName = (e) => {
    const { value } = e.target;
    setTermsandConditionName(value);
  };
  const [proposalNameError, setProposalNameError] = useState("");

  const [introductionBodyError, setIntroductionBodyError] = useState("");
  const [termsBodyError, setTermsBodyError] = useState("");
  const [selctedOptionError, setSelectedOptionError] = useState("");
  // const validateForm = () => {
  //   let tempErrors = {};
  //   let isValid = true;
  //   if (!templatename) tempErrors.templatename = "Template name is required";
  //   // if (!jobName) tempErrors.jobName = "Job name is required";
  //   setErrors(tempErrors);
  //   // return isValid;
  //   return Object.keys(tempErrors).length === 0;
  // };
  const validateForm = () => {
    let isValid = true;
    const currentStep = steps[activeStep];

    // Common validation for all steps
    if (!proposalName) {
      setProposalNameError("Name is required");
      isValid = false;
    } else {
      setProposalNameError("");
    }

    // Step-specific validation
    if (currentStep === "Introduction" && !introductionContent) {
      setIntroductionBodyError("Body is required");
      isValid = false;
    } else {
      setIntroductionBodyError("");
    }

    if (currentStep === "Terms" && !termsContent) {
      setTermsBodyError("Body is required");
      isValid = false;
    } else {
      setTermsBodyError("");
    }

    if (
      (currentStep === "Services & Invoices" || currentStep === "Payments") &&
      !activeOption
    ) {
      setSelectedOptionError("An option must be selected");
      isValid = false;
    } else {
      setSelectedOptionError("");
    }

    return isValid;
  };
  const createsaveProposaltemp = () => {
    if (!validateForm()) {
      return false;
    }
    console.log(invoiceData);
    const currentStep = steps[activeStep];
    // if (activeStep !== 3) {
    if (["General", "Introduction", "Terms"].includes(currentStep)) {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templatename: templatename,
          teammember: combinedValues,
          proposalname: proposalName,
          introduction: stepsVisibility.Introduction,
          terms: stepsVisibility.Terms,
          servicesandinvoices: stepsVisibility.ServicesInvoices,
          introductiontext: introductionContent,
          // servicesandinvoiceid: "66fa83ffe6e0f4ca11c2204d",
          custommessageinemail: stepsVisibility.CustomEmailMessage,
          custommessageinemailtext: description,
          reminders: stepsVisibility.Reminders,
          daysuntilnextreminder: daysuntilNextReminder,
          numberofreminder: noOfReminder,
          introductiontextname: introductionname,
          introductiontext: introductionContent,
          termsandconditionsname: termsandconditionname,
          termsandconditions: termsContent,
          active: true,
        }),
      };
      console.log(options.body);
      fetch(
        `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels`,
        options
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result.message);
          // toast.success("Invoice created successfully");
          if (
            result &&
            result.message === "ProposalesAndEls Template created successfully"
          ) {
            fetchPrprosalsAllData();
            toast.success("ProposalesAndEls Template created successfully");
          } else {
            toast.error(
              result.message || "Failed to create ProposalesAndEls Template"
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (
      currentStep === "Services & Invoices" ||
      currentStep === "Payments"
    ) {
      if (activeOption === "invoice") {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            templatename: templatename,
            teammember: combinedValues,
            proposalname: proposalName,
            introduction: stepsVisibility.Introduction,
            terms: stepsVisibility.Terms,
            servicesandinvoices: stepsVisibility.ServicesInvoices,
            introductiontext: introductionContent,
            // servicesandinvoiceid: "66fa83ffe6e0f4ca11c2204d",
            custommessageinemail: stepsVisibility.CustomEmailMessage,
            custommessageinemailtext: description,
            reminders: stepsVisibility.Reminders,
            daysuntilnextreminder: daysuntilNextReminder,
            numberofreminder: noOfReminder,
            introductiontextname: introductionname,
            introductiontext: introductionContent,
            termsandconditionsname: termsandconditionname,
            termsandconditions: termsContent,

            servicesandinvoicetempid: invoiceData.servicesandinvoicetempid,
            invoicetemplatename: invoiceData.invoicetemplatename,
            invoiceteammember: invoiceData.invoiceteammember,
            issueinvoice: invoiceData.issueinvoice,
            specificdate: invoiceData.specificdate,
            specifictime: invoiceData.specifictime,
            description: invoiceData.description,
            lineItems: invoiceData.lineItems,
            summary: invoiceData.summary,
            notetoclient: invoiceData.notetoclient,

            Addinvoiceoraskfordeposit: addInvoice,
            Additemizedserviceswithoutcreatinginvoices: addInvoiceitemized,
            paymentterms: paymentterms,
            paymentduedate: paymentduedate,
            paymentamount: paymentamount,
            active: true,
          }),
        };
        console.log(options.body);
        fetch(
          `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels`,
          options
        )
          .then((response) => response.json())
          .then((result) => {
            console.log(result.message);
            // toast.success("Invoice created successfully");
            if (
              result &&
              result.message ===
                "ProposalesAndEls Template created successfully"
            ) {
              fetchPrprosalsAllData();
              toast.success("ProposalesAndEls Template created successfully");
            } else {
              toast.error(
                result.message || "Failed to create ProposalesAndEls Template"
              );
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }

      if (activeOption === "service") {
        const lineItems = rows.map((item) => ({
          productorService: item.productName, // Assuming productName maps to productorService
          description: item.description,
          rate: item.rate.replace("$", ""), // Removing '$' sign from rate
          quantity: item.qty,
          amount: item.amount.replace("$", ""), // Removing '$' sign from amount
          tax: item.tax.toString(), // Converting boolean to string
        }));

        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            templatename: templatename,
            teammember: combinedValues,
            proposalname: proposalName,
            introduction: stepsVisibility.Introduction,
            terms: stepsVisibility.Terms,
            servicesandinvoices: stepsVisibility.ServicesInvoices,
            introductiontext: introductionContent,

            custommessageinemail: stepsVisibility.CustomEmailMessage,
            custommessageinemailtext: description,
            reminders: stepsVisibility.Reminders,
            daysuntilnextreminder: daysuntilNextReminder,
            numberofreminder: noOfReminder,
            introductiontextname: introductionname,
            introductiontext: introductionContent,
            termsandconditionsname: termsandconditionname,
            termsandconditions: termsContent,
            servicesandinvoicetempid: invoiceData.servicesandinvoicetempid,

            lineItems: lineItems,
            summary: {
              subtotal: subtotal,
              taxRate: taxRate,
              taxTotal: taxTotal,
              total: totalAmount,
            },

            Addinvoiceoraskfordeposit: addInvoice,
            Additemizedserviceswithoutcreatinginvoices: addInvoiceitemized,

            active: true,
          }),
        };
        console.log(options.body);
        fetch(
          `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels`,
          options
        )
          .then((response) => response.json())
          .then((result) => {
            console.log(result.message);
            // toast.success("Invoice created successfully");
            if (
              result &&
              result.message ===
                "ProposalesAndEls Template created successfully"
            ) {
              fetchPrprosalsAllData();
              toast.success("ProposalesAndEls Template created successfully");
            } else {
              toast.error(
                result.message || "Failed to create ProposalesAndEls Template"
              );
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }

    return true;
  };

  // const handleDuplicateProposal = async (id) => {
  //   try {
  //     // Find the template you're duplicating
  //     const originalData = ProposalsTemplates.find((row) => row._id === id);
  //     console.log(originalData);
  //     if (!originalData) {
  //       toast.error("Template not found");
  //       return;
  //     }

  //     // Duplicate the template (you can modify it here if needed)
  //     const duplicatedTemplate = {
  //       ...originalData,
  //       _id: generateNewId(), // Generate a new ID for the duplicated template
  //       templatename: `${originalData.templatename} copy`, // Modify the template name
  //     }; // Generate a new ID for the duplicated template

  //     console.log(duplicatedTemplate);

  //     // Call the API to save the duplicated template
  //     const response = await fetch(`${PROPOSAL_API}/workflow/proposalesandels/proposalesandels`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         templatename: duplicatedTemplate.templatename,
  //         proposalname: duplicatedTemplate.proposalname,
  //         teammember: duplicatedTemplate.teammember,
  //         introduction: duplicatedTemplate.introduction,
  //         terms: duplicatedTemplate.terms,
  //         servicesandinvoices: duplicatedTemplate.servicesandinvoices,
  //         introductiontext: duplicatedTemplate.introductiontext,
  //         custommessageinemail: duplicatedTemplate.custommessageinemail,
  //         custommessageinemailtext: duplicatedTemplate.custommessageinemailtext,
  //         reminders: duplicatedTemplate.reminders,
  //         daysuntilnextreminder: duplicatedTemplate.daysuntilnextreminder,
  //         numberofreminder: duplicatedTemplate.numberofreminder,
  //         introductiontextname: duplicatedTemplate.introductiontextname,
  //         termsandconditionsname: duplicatedTemplate.termsandconditionsname,
  //         termsandconditions: duplicatedTemplate.termsandconditions,
  //         // other fields you want to duplicate...

  //         servicesandinvoicetempid: duplicatedTemplate.servicesandinvoicetempid,
  //         invoicetemplatename: duplicatedTemplate.invoicetemplatename,
  //         invoiceteammember: duplicatedTemplate.invoiceteammember,
  //         issueinvoice: duplicatedTemplate.issueinvoice,
  //         specificdate: duplicatedTemplate.specificdate,
  //         specifictime: duplicatedTemplate.specifictime,
  //         description: duplicatedTemplate.description,
  //         lineItems: duplicatedTemplate.lineItems,
  //         summary: duplicatedTemplate.summary,
  //         notetoclient: duplicatedTemplate.notetoclient,
  //         Addinvoiceoraskfordeposit: duplicatedTemplate.Addinvoiceoraskfordeposit,
  //         Additemizedserviceswithoutcreatinginvoices: duplicatedTemplate.Additemizedserviceswithoutcreatinginvoices,
  //         active: true,
  //         paymentamount: duplicatedTemplate.paymentamount,
  //         paymentduedate: duplicatedTemplate.paymentduedate,
  //         paymentterms: duplicatedTemplate.paymentterms,
  //       }),
  //     });

  //     const result = await response.json();

  //     if (result && result.message === "ProposalesAndEls Template created successfully") {
  //       fetchPrprosalsAllData(); // Fetch the updated data
  //       toast.success("Template duplicated successfully");
  //     } else {
  //       toast.error(result.message || "Failed to duplicate template");
  //     }
  //   } catch (error) {
  //     console.error("Error duplicating template:", error);
  //     toast.error("An error occurred while duplicating the template");
  //   }
  // };

  // Function to generate a new unique ID for the duplicated template
  const generateNewId = () => {
    return Math.random().toString(36).substr(2, 9); // Generates a simple random ID
  };

  //delete template
  const handleEdit = (_id) => {
    navigate("ProposalTempUpdate/" + _id);
    console.log(_id);
  };

  //delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Job template?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          toast.success("Item deleted successfully");
          handleCloseOptions();
          setShowForm(false);
          fetchPrprosalsAllData();
          fetchServiceData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };
  const [description, setDescription] = useState("");
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };

  const handleEditorChange = (content) => {
    setDescription(content);
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
  const handleCloseOptions = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
    setTempIdGet(null);
  };
  // const [anchorEl, setAnchorEl] = useState(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (!event.target.closest(".menu-container")) {
  //       setOpenMenuId(null);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  //*****Payments */

  const [paymentterms, setPaymentTerms] = useState("");
  const handlePaymentTerms = (e) => {
    const { value } = e.target;
    setPaymentTerms(value);
  };
  const [paymentduedate, setPaymentDueDate] = useState("");
  const handlePaymentDueDate = (e) => {
    const { value } = e.target;
    setPaymentDueDate(value);
  };
  const [paymentamount, setPaymentAmount] = useState("");
  const handlePaymentAmount = (e) => {
    const { value } = e.target;
    setPaymentAmount(value);
  };

  const [anchorElNew, setAnchorElNew] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuOpen = (event, index) => {
    setAnchorElNew(event.currentTarget);
    setSelectedRow(index);
  };

  const handleMenuClose = () => {
    setAnchorElNew(null);
    setSelectedRow(null);
  };

  // const handleEditService = (row) => {
  //   console.log("Row data:", row);

  //   setSelectedRowData(row);
  //   handleMenuClose();
  //   setIsEditDrawerOpen(true);
  // };
  const handleEditService = (row, index) => {
    console.log("Row data:", row);

    setSelectedRowData(row);
    setSelectedRowIndex(index); // Save the index of the selected row
    handleMenuClose();
    setIsEditDrawerOpen(true);
  };
  // const handleSaveChanges = () => {
  //   if (selectedRowIndex !== null) {
  //     const updatedRows = [...rows];
  //     updatedRows[selectedRowIndex] = { ...selectedRowData }; // Update the row with new data
  //     setRows(updatedRows); // Update the state with the new rows

  //     console.log("Updated Rows:", updatedRows);
  //   }

  //   handleEditDrawerClose();
  // };
  const handleSaveChanges = () => {
    if (selectedRowIndex !== null) {
      const updatedRows = [...rows];

      // Calculate the amount based on rate and qty
      const rateValue = parseFloat(
        selectedRowData.rate.replace(/[^0-9.-]+/g, "")
      ); // Removing currency symbol
      const qtyValue = parseInt(selectedRowData.qty) || 0; // Convert to integer

      const amount = (rateValue * qtyValue).toFixed(2); // Calculate amount
      updatedRows[selectedRowIndex] = {
        ...selectedRowData,
        amount: `$${amount}`, // Store amount in the correct format
      }; // Update the row with new data including the calculated amount

      setRows(updatedRows); // Update the state with the new rows

      console.log("Updated Rows:", updatedRows);
    }

    handleEditDrawerClose();
  };

  const handleDeleteService = () => {
    console.log("Delete row:", selectedRow);
    deleteRow(selectedRow);
    handleMenuClose();
  };

  const handleDuplicate = () => {
    if (selectedRow !== null) {
      const duplicatedRow = {
        ...rows[selectedRow],
        productName: rows[selectedRow].productName
          ? `${rows[selectedRow].productName} Copy`
          : "Copy",
      };
      const updatedRows = [...rows, duplicatedRow];
      setRows(updatedRows); // Update the state with the duplicated row
      console.log("Duplicated row:", duplicatedRow);
    }
    handleMenuClose();
  };

  const CATEGORY_API = process.env.REACT_APP_CATEGORY_URL;
  const [servicename, setservicename] = useState("");
  const [discription, setdiscription] = useState("");
  const [rate, setrate] = useState("$ 0.00");
  const [service, setService] = useState(false);
  const handleRateChange = (e) => {
    // Remove the dollar sign and any non-numeric characters, and keep the input as a number
    const value = e.target.value.replace(/[^0-9.]/g, "");

    // Update the rate, ensuring it includes the $ symbol
    setrate(`$ ${value}`);
  };
  const Rateoptions = [
    // { label: "Select Rate Type", value: "" },
    { label: "Item", value: "item" },
    { label: "Hour", value: "hour" },
  ];
  const [selectedRateOption, setSelectedRateOption] = useState("");

  const handleRateTypeChange = (event, newValue) => {
    setSelectedRateOption(newValue);
    console.log("Selected rate type:", newValue);
  };
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };
  const handleServiceSwitch = (checked) => {
    setSelectedRowData((prevState) => ({
      ...prevState,
      tax: checked, // Update the tax value when switch is toggled
    }));
  };

  //category right side form
  const createservicetemp = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      serviceName: selectedRowData?.productName,
      description: selectedRowData?.description,
      rate: selectedRowData?.rate,
      ratetype: selectedRateOption?.value,
      tax: selectedRowData?.tax,

      category: selectedCategory ? selectedCategory.value : null,
      active: "true",
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${SERVICE_API}/workflow/services/servicetemplate`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.message);

        if (
          result &&
          result.message === "ServiceTemplate created successfully"
        ) {
          toast.success("ServiceTemplate created successfully");
          handleNewDrawerClose();
          // fetchServicesData();
          // Clear form fields
          setservicename("");
          setdiscription("");
          setrate("");
          setSelectedRateOption("");
          setService(false);
          setSelectedCategory(null);
        } else {
          toast.error(result.message || "Failed to create Service Template");
        }
      })
      .catch((error) => {
        console.log(error);
        const errorMessage =
          error.response && error.response.message
            ? error.response.message
            : "Failed to create invoice";
        toast.error(errorMessage);
      });
  };
  const [categorycreate, setcategorycreate] = useState();
  const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
  const handleCategoryFormClose = () => {
    setCategoryFormOpen(false);
  };
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const handleNewDrawerClose = () => {
    setIsNewDrawerOpen(false);
  };
  // category create

  const [categoryData, setCategoryData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // const url = `${API_KEY}/common/user/`;
      const url = `${CATEGORY_API}/workflow/category/categorys`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setCategoryData(data.category);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const categoryoptions = categoryData.map((category) => ({
    value: category._id,
    label: category.categoryName,
  }));
  const createCategory = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      categoryName: categorycreate,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${CATEGORY_API}/workflow/category/newcategory`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result && result.message === "Category created successfully") {
          toast.success("Category created successfully");
          handleCategoryFormClose(false);
          fetchData();
          setcategorycreate();
        } else {
          toast.error(result.message || "Failed to create Service Template");
        }
      })
      .catch((error) => console.error(error));
  };
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handleSaveAsNewService = (row) => {
    console.log("Row data:", row);
    setSelectedRowData(row);
    setIsNewDrawerOpen(true); // Open the drawer if required
    handleMenuClose();
  };

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const handleEditDrawerClose = () => {
    setIsEditDrawerOpen(false);
  };
  const [tax, setTax] = useState(false);
  // const handleServiceWitch = (checked) => {
  //   setTax(checked);
  // };
  const handleServiceWitch = (checked) => {
    setSelectedRowData({ ...selectedRowData, tax: checked });
  };
  const [totalamount, setTotalamount] = useState("");

  useEffect(() => {
    const rate = parseFloat(selectedRowData?.rate?.replace("$", "")) || 0;
    const qty = selectedRowData?.qty || 0;
    const calculatedAmount = rate * qty;

    console.log(
      "Rate: ",
      rate,
      "Qty: ",
      qty,
      "Total Amount: $",
      calculatedAmount.toFixed(2)
    );
    setTotalamount(`$${calculatedAmount.toFixed(2)}`);
  }, [selectedRowData?.rate, selectedRowData?.qty]);

  console.log(totalamount);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-800">General</h3>

            {/* Template Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Template name (not visible to clients)</label>
              <input
                type="text"
                placeholder="Template name (not visible to clients)"
                value={templatename}
                onChange={(e) => settemplatename(e.target.value)}
                className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.templatename ? 'border-red-400' : 'border-slate-200'}`}
              />
              {!!errors.templatename && (
                <p className="text-xs text-red-500 mt-1">{errors.templatename}</p>
              )}
            </div>

            {/* Team Member & Proposal Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Team Member</label>
                <MultiSelectDropdown
                  value={selectedUser}
                  onChange={handleUserChange}
                  placeholder="TeamMember"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Proposal name (visible to clients)</label>
                <input
                  type="text"
                  ref={textFieldRef}
                  value={proposalName}
                  onChange={handleProposalName}
                  onClick={(e) => setCursorPosition(e.target.selectionStart)}
                  placeholder="Proposal name (visible to clients)"
                  className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${proposalNameError ? 'border-red-400' : 'border-slate-200'}`}
                />
                {!!proposalNameError && (
                  <p className="text-xs text-red-500 mt-1">{proposalNameError}</p>
                )}
                <div className="relative mt-2">
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                  >
                    Add Shortcode
                  </button>
                  {showDropdown && (
                    <div className="absolute left-0 top-full z-50 mt-1 w-72 max-h-72 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                      {filteredShortcuts.map((shortcut, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddShortcut(shortcut.value)}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 ${shortcut.isBold ? 'font-bold text-slate-800' : 'text-slate-600'}`}
                        >
                          {shortcut.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Steps Configuration */}
            <div className="mt-6 space-y-3">
              <h3 className="text-base font-bold text-slate-800">Steps</h3>

              {/* Introduction Toggle */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={stepsVisibility.Introduction}
                    onChange={handleSwitchChange("Introduction")}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Introduction</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 ml-7">
                  Explain to your clients who you are, what services you provide, the value you bring, and any other information you want to share
                </p>
              </div>

              {/* Terms Toggle */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={stepsVisibility.Terms}
                    onChange={handleSwitchChange("Terms")}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Terms</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 ml-7">
                  Engagement letter or contractual agreement that outlines the terms of the relationship between your firm and clients. The section title can be renamed.
                </p>
              </div>

              {/* Services & Invoices Toggle */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={stepsVisibility.ServicesInvoices}
                    onChange={handleSwitchChange("ServicesInvoices")}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Services & Invoices</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-500 ml-7">
                  Specify the services your firm will provide. Add one-time or recurring invoices to get paid automatically.
                </p>
              </div>

              {/* Custom Email Message Toggle */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={stepsVisibility.CustomEmailMessage}
                      onChange={handleSwitchChange("CustomEmailMessage")}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Custom message in email</span>
                  </div>
                  <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">Best practice</span>
                </div>
                <p className="text-xs text-slate-500 ml-7">
                  Your client will receive a link via email to view and sign this proposal.
                </p>
                {stepsVisibility.CustomEmailMessage && (
                  <div className="mt-3">
                    <EditorShortcodes
                      onChange={handleEditorChange}
                      content={description}
                    />
                  </div>
                )}
              </div>

              {/* Reminders Toggle */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={stepsVisibility.Reminders}
                    onChange={handleSwitchChange("Reminders")}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Reminders</span>
                </div>
                {stepsVisibility.Reminders && (
                  <div className="flex items-center gap-4 mt-3 ml-7">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Days until next reminder</label>
                      <input
                        type="text"
                        value={daysuntilNextReminder}
                        onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                        placeholder="Days"
                        className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">No. of reminders</label>
                      <input
                        type="text"
                        value={noOfReminder}
                        onChange={(e) => setNoOfReminder(e.target.value)}
                        placeholder="Count"
                        className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case steps.indexOf("Introduction"):
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Introduction</h3>
            <input
              type="text"
              placeholder="Introduction"
              value={introductionname}
              onChange={handleIntroductionName}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Editor
              onChange={handleIntroductionChange}
              content={introductionContent}
            />
            {!!introductionBodyError && (
              <p className="text-xs text-red-500 mt-1">{introductionBodyError}</p>
            )}
          </div>
        );
      case steps.indexOf("Terms"):
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Terms and Conditions</h3>
            <input
              type="text"
              placeholder="Engagement letter"
              value={termsandconditionname}
              onChange={handleTermsandConditionName}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <TermEditor onChange={handleTermsChange} content={termsContent} />
            {!!termsBodyError && (
              <p className="text-xs text-red-500 mt-1">{termsBodyError}</p>
            )}
          </div>
        );
      case steps.indexOf("Services & Invoices"):
        return (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800">Choose one of the options</h3>

            {/* Invoice Option */}
            <div
              onClick={handleShowInvoiceForm}
              className={`rounded-xl border p-4 cursor-pointer transition-all ${activeOption === "invoice" ? "border-indigo-400 bg-indigo-50 shadow-md ring-1 ring-indigo-200" : "border-slate-200 hover:border-slate-300"}`}
            >
              <p className="text-sm font-bold text-slate-800">Add invoice or ask for deposit</p>
              <p className="text-xs text-slate-500 mt-1">Create one-time or recurring invoice, or ask for deposit to sign</p>
            </div>

            {/* Service Option */}
            <div
              onClick={handleShowServiceForm}
              className={`rounded-xl border p-4 cursor-pointer transition-all ${activeOption === "service" ? "border-indigo-400 bg-indigo-50 shadow-md ring-1 ring-indigo-200" : "border-slate-200 hover:border-slate-300"}`}
            >
              <p className="text-sm font-bold text-slate-800">Add itemized services without creating invoices</p>
              <p className="text-xs text-slate-500 mt-1">No invoice or deposit request will be created</p>
            </div>

            {!!selctedOptionError && (
              <p className="text-xs text-red-500">{selctedOptionError}</p>
            )}

            {/* Invoice Form */}
            {activeOption === "invoice" && (
              <div className="mt-4">
                <Invoice serviceandinvoiceSettings={serviceandinvoiceSettings} />
              </div>
            )}

            {/* Service Form - Line Items */}
            {activeOption === "service" && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-slate-800">Line items</h4>
                  <p className="text-xs text-slate-500">Client-facing itemized list of products and services</p>
                </div>

                {/* Line Items Table */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/60">
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Product / Service</th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Rate</th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Qty</th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</th>
                          <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tax</th>
                          <th className="px-4 py-3 w-10"></th>
                          <th className="px-4 py-3 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rows.map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50/70">
                            <td className="px-4 py-2 min-w-[200px]">
                              <CreatableSelect
                                placeholder="Product or Service"
                                options={serviceoptions}
                                value={serviceoptions.find((option) => option.label === row.productName) || { label: row.productName, value: row.productName }}
                                onChange={(selectedOption) => handleServiceChange(index, selectedOption)}
                                onInputChange={(inputValue, actionMeta) => handleServiceInputChange(inputValue, actionMeta, index)}
                                isClearable
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input type="text" name="description" value={row.description} onChange={(e) => handleInputChange(index, e)} placeholder="Description" className="w-full border-0 bg-transparent text-sm focus:outline-none focus:ring-0" />
                            </td>
                            <td className="px-4 py-2">
                              <input type="text" name="rate" value={row.rate} onChange={(e) => handleInputChange(index, e)} className="w-20 border-0 bg-transparent text-sm focus:outline-none focus:ring-0" />
                            </td>
                            <td className="px-4 py-2">
                              <input type="text" name="qty" value={row.qty} onChange={(e) => handleInputChange(index, e)} className="w-16 border-0 bg-transparent text-sm focus:outline-none focus:ring-0" />
                            </td>
                            <td className={`px-4 py-2 text-sm text-slate-600 ${row.isDiscount ? "text-red-500" : ""}`}>{row.amount}</td>
                            <td className="px-4 py-2">
                              <input type="checkbox" name="tax" checked={row.tax} onChange={(e) => handleInputChange(index, e)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            </td>
                            <td className="px-4 py-2">
                              <div className="relative">
                                <button onClick={(event) => handleMenuOpen(event, index)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                  <BsThreeDotsVertical className="h-4 w-4" />
                                </button>
                                {Boolean(anchorElNew) && selectedRow === index && (
                                  <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                                    <button onClick={() => handleEditService(row, index)} className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit</button>
                                    <button onClick={handleDeleteService} className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                                    <button onClick={() => handleSaveAsNewService(row)} className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Save as new service</button>
                                    <button onClick={handleDuplicate} className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Duplicate</button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <button onClick={() => deleteRow(index)} className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-500">
                                <RiCloseLine className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Row Buttons */}
                <div className="flex items-center gap-4">
                  <button onClick={() => addRow()} className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    <AiOutlinePlusCircle className="h-4 w-4" /> Line item
                  </button>
                  <button onClick={() => addRow(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    <CiDiscount1 className="h-4 w-4" /> Discount
                  </button>
                </div>

                {/* Summary Table */}
                <h4 className="text-base font-semibold text-slate-800">Summary</h4>
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60">
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Subtotal</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tax Rate</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tax Total</th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-3"><input type="number" value={subtotal} onChange={handleSubtotalChange} className="w-24 border-0 bg-transparent text-sm focus:outline-none" /></td>
                        <td className="px-4 py-3"><input type="number" value={taxRate} onChange={handleTaxRateChange} className="w-16 border-0 bg-transparent text-sm focus:outline-none" />%</td>
                        <td className="px-4 py-3 text-sm text-slate-600">${taxTotal.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">${totalAmount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Create Service Sheet */}
                <Sheet open={isNewDrawerOpen} onOpenChange={(open) => { if (!open) handleNewDrawerClose(); }}>
                  <SheetContent className="sm:max-w-lg overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Create Service</SheetTitle>
                    </SheetHeader>
                    <form className="mt-4 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Service Name</label>
                        <input type="text" placeholder="Service Name" value={selectedRowData?.productName || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Description</label>
                        <input type="text" placeholder="Description" value={selectedRowData?.description || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Rate</label>
                          <input type="text" placeholder="Rate" value={selectedRowData?.rate || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Rate Type</label>
                          <select value={selectedRateOption?.value || ""} onChange={(e) => { const opt = options.find(o => o.value === e.target.value); handleRateTypeChange(null, opt); }} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">Select Rate Type</option>
                            {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" checked={selectedRowData?.tax || false} onChange={(event) => handleServiceSwitch(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <label className="text-sm text-slate-700">Tax</label>
                      </div>

                      <h4 className="text-base font-bold text-slate-800 pt-2">Category</h4>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Category Name</label>
                        <select value={selectedCategory?.value || ""} onChange={(e) => { const opt = categoryoptions.find(o => o.value === e.target.value); handleCategoryChange(null, opt); }} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option value="">Category Name</option>
                          {categoryoptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      </div>
                      <button type="button" onClick={setCategoryFormOpen} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 mt-2">
                        Create category
                      </button>

                      <div className="flex items-center gap-3 pt-4">
                        <button type="button" onClick={createservicetemp} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">Save</button>
                        <button type="button" onClick={handleNewDrawerClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                      </div>
                    </form>
                  </SheetContent>
                </Sheet>

                {/* Category Sheet */}
                <Sheet open={isCategoryFormOpen} onOpenChange={(open) => { if (!open) handleCategoryFormClose(); }}>
                  <SheetContent className="sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Create Category</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Category Name</label>
                        <input type="text" placeholder="Category Name" value={categorycreate} onChange={(e) => setcategorycreate(e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={createCategory} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">Create</button>
                        <button type="button" onClick={handleCategoryFormClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Edit Service Sheet */}
                <Sheet open={isEditDrawerOpen} onOpenChange={(open) => { if (!open) handleEditDrawerClose(); }}>
                  <SheetContent className="sm:max-w-lg overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Edit Item</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-800">Product or service</label>
                        <input type="text" value={selectedRowData?.productName || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Description</label>
                        <textarea value={selectedRowData?.description || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Rate</label>
                          <input type="text" value={selectedRowData?.rate || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">QTY</label>
                          <input type="text" value={selectedRowData?.qty || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, qty: e.target.value })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">Amount</label>
                          <input type="text" disabled value={totalamount} className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm text-slate-500" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={selectedRowData?.tax} onChange={(event) => handleServiceWitch(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                        <label className="text-sm text-slate-700">Tax</label>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <button type="button" onClick={handleSaveChanges} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">Save</button>
                        <button type="button" onClick={handleEditDrawerClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        );
      case steps.indexOf("Payments"):
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Payment Information</h3>
            <input
              type="text"
              placeholder="Payment terms"
              value={paymentterms}
              onChange={handlePaymentTerms}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Payment due date"
              value={paymentduedate}
              onChange={handlePaymentDueDate}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Payment amount"
              value={paymentamount}
              onChange={handlePaymentAmount}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        );
      default:
        return <p className="text-sm text-slate-500">Unknown Step</p>;
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Compute paginated tasks
  const paginatedTasks = ProposalsTemplates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <div className="w-full">
      {showStepper ? (
        <div className="space-y-6">
          {/* Stepper Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5">
            <div className="flex-1 w-full">
              <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
                <nav className="flex items-center justify-between">
                  {steps.map((label, index) => {
                    const isError =
                      (index === 0 && !!proposalNameError) ||
                      (index === 1 && !!introductionBodyError) ||
                      (index === 2 && !!termsBodyError) ||
                      (index === 3 && !!selctedOptionError);
                    const isActive = index === activeStep;
                    const isCompleted = index < activeStep;

                    return (
                      <button
                        key={index}
                        onClick={() => handleStepClick(index)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                            : isCompleted
                            ? 'text-green-600'
                            : 'text-slate-400 hover:text-slate-600'
                        } ${isError ? 'text-red-600 bg-red-50 ring-1 ring-red-200' : ''}`}
                      >
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          isActive ? 'bg-indigo-600 text-white' : isCompleted ? 'bg-green-500 text-white' : isError ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {isCompleted ? '✓' : index + 1}
                        </span>
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={activeStep === steps.length - 1 ? handleReset : handleNext}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 w-48"
              >
                {activeStep === steps.length - 1 ? "Save Template" : "Next"}
              </button>
              <button
                disabled={activeStep === 0}
                onClick={handleBack}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed w-48"
              >
                Back
              </button>
            </div>
          </div>
          {/* Step Content */}
          <div className="px-4 lg:px-6">{renderStepContent(activeStep)}</div>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCreateTemplateClick}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              <AiOutlinePlusCircle className="h-4 w-4" /> Create Template
            </button>
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
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedTasks.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-5 py-10 text-center text-sm text-slate-400">No proposal templates found.</td>
                      </tr>
                    ) : (
                      paginatedTasks.map((row) => (
                        <tr key={row._id} className="group transition-colors hover:bg-slate-50/70">
                          <td className="px-5 py-3">
                            <button
                              onClick={() => handleEdit(row._id)}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                            >
                              {row.templatename}
                            </button>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="relative inline-block">
                              <button
                                onClick={(event) => toggleMenu(event, row._id)}
                                className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                              >
                                <BsThreeDotsVertical className="h-4 w-4" />
                              </button>
                              {openMenuId === row._id && (
                                <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                                  <button
                                    onClick={() => { handleEdit(tempIdget); handleCloseOptions(); }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => { handleDelete(tempIdget); }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    Delete
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

              {ProposalsTemplates.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-3">
                  <p className="text-xs text-slate-500">
                    Showing <span className="font-semibold text-slate-700">{page * rowsPerPage + 1}</span>–<span className="font-semibold text-slate-700">{Math.min((page + 1) * rowsPerPage, ProposalsTemplates.length)}</span> of{" "}
                    <span className="font-semibold text-slate-700">{ProposalsTemplates.length}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <select
                      value={rowsPerPage}
                      onChange={(e) => handleChangeRowsPerPage({ target: { value: e.target.value } })}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {[5, 10, 25, 50].map((opt) => (
                        <option key={opt} value={opt}>{opt} / page</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleChangePage(null, page - 1)}
                        disabled={page === 0}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span className="text-xs">&#8249;</span>
                      </button>
                      <span className="min-w-[3rem] text-center text-xs font-medium text-slate-600">
                        {page + 1} / {Math.max(1, Math.ceil(ProposalsTemplates.length / rowsPerPage))}
                      </span>
                      <button
                        onClick={() => handleChangePage(null, page + 1)}
                        disabled={(page + 1) * rowsPerPage >= ProposalsTemplates.length}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span className="text-xs">&#8250;</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyStepper;

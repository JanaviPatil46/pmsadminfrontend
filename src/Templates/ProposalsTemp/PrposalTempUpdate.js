import React, { useState, useEffect, useRef } from "react";
import Editor from "../Texteditor/Editor";
import TermEditor from "../Texteditor/TermEditor";
import CreatableSelect from "react-select/creatable";
import Invoice from "./Invoice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EditorShortcodes from "../Texteditor/EditorShortcodes";
import MultiSelectDropdown from "../MultiSelectDropdown";
import { FormPage, FormSection, FormField, FormRow, FormGrid, FormDrawer, FormDrawerFooter, FormSteps, ShortcodePopover } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Plus, Percent, MoreVertical, X, ChevronLeft, ChevronRight, FileText, Receipt, CreditCard } from "lucide-react";
const MyStepperUpdate = () => {
  const { _id } = useParams();
  console.log(_id);
  const navigate = useNavigate();
  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
  const [activeStep, setActiveStep] = useState(0);
  const [introductionContent, setIntroductionContent] = useState("");
  const [termsContent, setTermsContent] = useState("");
  const [servicedata, setServiceData] = useState([]);
  const [activeOption, setActiveOption] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [templatename, settemplatename] = useState("");
  const [errors, setErrors] = useState({});
  const [introductionname, setIntroductionName] = useState("");
  const [termsandconditionname, setTermsandConditionName] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedTeamMemberValues, setCombinedTeamMemberValues] = useState([]);
  const [userData, setUserData] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [proposalName, setProposalName] = useState("");
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
  const [noOfReminder, setNoOfReminder] = useState(1);
  const [description, setDescription] = useState("");
  const [selectedservice, setselectedService] = useState();

  const [invoiceDataUpdate, setInvoiceDataUpdate] = useState({});

  useEffect(() => {
    console.log("Invoice data received:", serviceandinvoiceSettingonupdate);
  }, []);

  const serviceandinvoiceSettingonupdate = (serviceAndInvoiceData) => {
    console.log("Invoice data received:", serviceAndInvoiceData);

    const newInvoiceData = {
      servicesandinvoicetempid: serviceAndInvoiceData.invoiceTempId,
      invoicetemplatename: serviceAndInvoiceData.invoiceTempName,
      invoiceteammember: serviceAndInvoiceData.invoiceTeamMember,
      issueinvoice: serviceAndInvoiceData.issueInvoiceSelect,
      specificdate: serviceAndInvoiceData.specificDate,
      specifictime: serviceAndInvoiceData.specificTime,
      description: serviceAndInvoiceData.descriptionData,
      lineItems: serviceAndInvoiceData.lineItems,
      summary: serviceAndInvoiceData.summary,
      notetoclient: serviceAndInvoiceData.noteToClient,
    };
    setInvoiceDataUpdate(newInvoiceData);
  };
  console.log(invoiceDataUpdate);

  // console.log(combinedValues)

  useEffect(() => {
    fetchUserData();
    // console.log('Invoice data received:', serviceAndInvoiceData);
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
      console.log(newSelectedUsers)
      const selectedValues = newSelectedUsers.map((option) => option.value);
      setCombinedValues(selectedValues);
      console.log(selectedValues)
    };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));
useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
  }, [shortcuts]);
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

//  useEffect(() => {
//     // Set shortcuts based on selected option
//     if (selectedOption === "contacts") {
//       const contactShortcuts = [
//         { title: "Account Shortcodes", isBold: true },
//         { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
//         { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
//         { title: "Contact Shortcodes", isBold: true },
//         { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
//         { title: "First Name", isBold: false, value: "FIRST_NAME" },
//         { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
//         { title: "Last Name", isBold: false, value: "LAST_NAME" },
//         { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
//         { title: "Country", isBold: false, value: "COUNTRY" },
//         { title: "Company name", isBold: false, value: "COMPANY_NAME " },
//         { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
//         { title: "City", isBold: false, value: "CITY" },
//         { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
//         { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
//         { title: "Custom field:Email", isBold: false, value: "CONTACT_CUSTOM_FIELD:Email" },
//         { title: "Date Shortcodes", isBold: true },
//         { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
//         { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
//         { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
//         { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
//         { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
//         { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
//         { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
//         { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
//         { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
//         { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
//         { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
//         { title: "Last week", isBold: false, value: "LAST_WEEK" },
//         { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
//         { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
//         { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
//         { title: "Last_year", isBold: false, value: "LAST_YEAR" },
//         { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
//         { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
//         { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
//         { title: "Next week", isBold: false, value: "NEXT_WEEK" },
//         { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
//         { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
//         { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
//         { title: "Next year", isBold: false, value: "NEXT_YEAR" },
//       ];
//       setShortcuts(contactShortcuts);
//     } else if (selectedOption === "account") {
//       const accountShortcuts = [
//         { title: "Account Shortcodes", isBold: true },
//         { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
//         { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
//         { title: "Date Shortcodes", isBold: true },
//         { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
//         { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
//         { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
//         { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
//         { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
//         { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
//         { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
//         { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
//         { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
//         { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
//         { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
//         { title: "Last week", isBold: false, value: "LAST_WEEK" },
//         { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
//         { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
//         { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
//         { title: "Last_year", isBold: false, value: "LAST_YEAR" },
//         { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
//         { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
//         { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
//         { title: "Next week", isBold: false, value: "NEXT_WEEK" },
//         { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
//         { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
//         { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
//         { title: "Next year", isBold: false, value: "NEXT_YEAR" },
//       ];
//       setShortcuts(accountShortcuts);
//     }
//   }, [selectedOption]);
  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

  // const handleProposalName = (e) => {
  //   const { value } = e.target;
  //   setProposalName(value);
  // };
 const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
  const handleProposalName = (e) => {
    const { value,selectionStart  } = e.target;
    setProposalName(value);
    setCursorPosition(selectionStart);
  };
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
            prevText.slice(0, cursorPosition) + `[${shortcut}]` + prevText.slice(cursorPosition);
        return newText;
    });

    setTimeout(() => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
            textFieldRef.current.setSelectionRange(cursorPosition + shortcut.length + 2, cursorPosition + shortcut.length + 2);
        }
    }, 0);

    setShowDropdown(false);
};
  const [stepsVisibility, setStepsVisibility] = useState({
    Introduction: true,
    Terms: true,
    ServicesInvoices: true,
    CustomEmailMessage: true,
    Reminders: true,
  });

  const steps = ["General"].concat(stepsVisibility.Introduction ? ["Introduction"] : [], stepsVisibility.Terms ? ["Terms"] : [], stepsVisibility.ServicesInvoices ? ["Services & Invoices"] : [], activeOption === "invoice" ? ["Payments"] : []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = (serviceAndInvoiceData) => {
    if (!serviceAndInvoiceData) {
      console.error("Error: serviceAndInvoiceData is undefined");
      return;
    }
    // onupdateserviceandinvoiceSettings(serviceAndInvoiceData);
    updatesaveProposaltemp();
    setActiveStep(0);
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
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

  const handleServiceInputChange = (inputValue, actionMeta, index) => {
    if (actionMeta.action === "input-change") {
      const newRows = [...rows];
      newRows[index].productName = inputValue;
      setRows(newRows);
    }
  };
  // add row
  const [rows, setRows] = useState([{ productName: "", description: "", rate: "$0.00", qty: "1", amount: "$0.00", tax: false, isDiscount: false }]);
  const addRow = (isDiscountRow = false) => {
    const newRow = isDiscountRow ? { productName: "", description: "", rate: "$-10.00", qty: "1", amount: "$-10.00", tax: false, isDiscount: true } : { productName: "", description: "", rate: "$0.00", qty: "1", amount: "$0.00", tax: false, isDiscount: false };
    setRows([...rows, newRow]);
  };
  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    if (!templatename) tempErrors.templatename = "Template name is required";
    // if (!jobName) tempErrors.jobName = "Job name is required";

    setErrors(tempErrors);
    // return isValid;
    return Object.keys(tempErrors).length === 0;
  };

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const handleIntroductionName = (e) => {
    const { value } = e.target;
    setIntroductionName(value);
  };
  const handleTermsandConditionName = (e) => {
    const { value } = e.target;
    setTermsandConditionName(value);
  };
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

  const handleServiceChange = (index, selectedOptions) => {
    setselectedService(selectedOptions);
    fetchservicebyid(selectedOptions.value, index);
  };

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

  const fetchservicebyid = async (id, rowIndex) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${SERVICE_API}/workflow/services/servicetemplate/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.serviceTemplate);

        const service = Array.isArray(result.serviceTemplate) ? result.serviceTemplate[0] : result.serviceTemplate;
      // Ensure rate is correctly parsed
      const rawRate = service.rate || "0.00";  // Fallback to "0.00" if undefined
      const numericRate = parseFloat(rawRate.replace(/[^0-9.]/g, "")); // Remove $ and other non-numeric chars

      const rate = !isNaN(numericRate) ? numericRate.toFixed(2) : "0.00";
      const amount = rate; // Assuming amount is same as rate
        const updatedRow = {
          productName: service.serviceName || "", // Assuming serviceName corresponds to productName
          description: service.description || "",
          // rate: service.rate ? `$${service.rate.toFixed(2)}` : "$0.00",
          // qty: "1", // Default quantity is 1
          // amount: service.rate ? `$${service.rate.toFixed(2)}` : "$0.00", // Assuming amount is calculated as rate
          rate: `$${rate}`,
          qty: "1", // Default quantity is 1
          amount: `$${amount}`,
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
  }, [rows,taxRate]);

  const [option, setOptions] = useState([]);
  const [invoiceData, setInvoiceData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchproposalbyid = async () => {
    try {
      const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandelslist/${_id}`;
      const response = await fetch(url);
      const result = await response.json();

      const proposalesandelsTemplate = result.proposalesAndElsTemplate;
      console.log(proposalesandelsTemplate);
      // Set template name and proposal name
      settemplatename(proposalesandelsTemplate.templatename);
      setProposalName(proposalesandelsTemplate.proposalname);

      // Map team members for Autocomplete
      const mappedOptions = proposalesandelsTemplate.teammember.map((member) => ({
        label: member.username, // Display username
        value: member._id, // Use _id as the value
      }));
      setOptions(mappedOptions);
      setSelectedUser(mappedOptions);

      const selectedValues = mappedOptions.map((option) => option.value);
      setCombinedValues(selectedValues);
      // Set the visibility of sections
      setStepsVisibility({
        Introduction: proposalesandelsTemplate.introduction,
        Terms: proposalesandelsTemplate.terms,
        ServicesInvoices: proposalesandelsTemplate.servicesandinvoices,
        CustomEmailMessage: proposalesandelsTemplate.custommessageinemail,
        Reminders: proposalesandelsTemplate.reminders,
      });

      // Set introduction and terms content
      setIntroductionName(proposalesandelsTemplate.introductiontextname);
      setIntroductionContent(proposalesandelsTemplate.introductiontext);
      setTermsContent(proposalesandelsTemplate.termsandconditions);
      setTermsandConditionName(proposalesandelsTemplate.termsandconditionsname);
      setDescription(proposalesandelsTemplate.custommessageinemailtext);
      setDaysuntilNextReminder(proposalesandelsTemplate.daysuntilnextreminder);
      setNoOfReminder(proposalesandelsTemplate.numberofreminder);
      setPaymentTerms(proposalesandelsTemplate.paymentterms);
      setPaymentDueDate(proposalesandelsTemplate.paymentduedate);
      setPaymentAmount(proposalesandelsTemplate.paymentamount);
      // Set invoice data
      console.log(proposalesandelsTemplate.servicesandinvoices);
      // if (proposalesandelsTemplate.servicesandinvoices === "true") {
      console.log(proposalesandelsTemplate.servicesandinvoices);
      if (proposalesandelsTemplate.Additemizedserviceswithoutcreatinginvoices === "service") {
        console.log(proposalesandelsTemplate.lineItems);

        const mappedLineItems = proposalesandelsTemplate.lineItems.map((item) => ({
          productName: item.productorService || "", // Map productorService to productName
          description: item.description || "",
          rate: item.rate ? `$${parseFloat(item.rate).toFixed(2)}` : "$0.00", // Ensure rate is properly formatted
          qty: item.quantity ? item.quantity.toString() : "1", // Ensure quantity is a string
          amount: item.amount ? `$${parseFloat(item.amount).toFixed(2)}` : "$0.00", // Ensure amount is properly formatted
          tax: item.tax || false, // Default to false if tax is not provided
          isDiscount: false, // Assuming isDiscount is not part of the response, default to false
        }));

        setRows(mappedLineItems);
        // summary(proposalesandelsTemplate.summary)
      }
      setTaxRate(proposalesandelsTemplate.summary.taxRate);
      const invoiceData = {
        servicesandinvoicetempid: proposalesandelsTemplate.servicesandinvoicetempid,
        invoicetemplatename: proposalesandelsTemplate.invoicetemplatename,
        invoiceteammember: proposalesandelsTemplate.invoiceteammember,
        issueinvoice: proposalesandelsTemplate.issueinvoice,
        specificdate: proposalesandelsTemplate.specificdate,
        specifictime: proposalesandelsTemplate.specifictime,
        description: proposalesandelsTemplate.description,
        lineItems: proposalesandelsTemplate.lineItems,
        summary: proposalesandelsTemplate.summary,
        notetoclient: proposalesandelsTemplate.notetoclient,
      };

      setInvoiceData(invoiceData);

      console.log(invoiceData);
      // Conditionally set the active option
      if (proposalesandelsTemplate.Addinvoiceoraskfordeposit === "invoice") {
        setActiveOption("invoice");
        setAddInvoice(proposalesandelsTemplate.Addinvoiceoraskfordeposit);
      } else if (proposalesandelsTemplate.Additemizedserviceswithoutcreatinginvoices === "service") {
        setActiveOption("service");
        setAddInvoiceitemized(proposalesandelsTemplate.Additemizedserviceswithoutcreatinginvoices);
      }
      // }
      setIsUpdating(true);
      // Set the rows (line items)
      // setRows(proposalesandelsTemplate.lineItems);
    } catch (error) {
      console.error("Error fetching proposal by id:", error);
    }
  };

  // Define service and invoice settings outside of fetchData
  const serviceandinvoiceSettings = {
    servicesandinvoicetempid: invoiceData?.servicesandinvoicetempid,
    invoicetemplatename: invoiceData?.invoicetemplatename,
    invoiceteammember: invoiceData?.invoiceteammember,
    issueinvoice: invoiceData?.issueinvoice,
    specificdate: invoiceData?.specificdate,
    specifictime: invoiceData?.specifictime,
    description: invoiceData?.description,
    lineItems: invoiceData?.lineItems,
    summary: invoiceData?.summary,
    notetoclient: invoiceData?.notetoclient,

    isUpdating: isUpdating,
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchproposalbyid();
    };

    fetchData();
  }, []); // Empty dependency array to run only once on mount

  console.log(serviceandinvoiceSettings);

  const updatesaveProposaltemp = () => {
    if (!validateForm()) {
      // toast.error("Please fix the validation errors.");
      return;
    }
    const currentStep = steps[activeStep];
    if (["General", "Introduction", "Terms"].includes(currentStep)) {
      const options = {
        method: "PATCH",
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
      fetch(`${PROPOSAL_API}/workflow/proposalesandels/proposalesandels/${_id}`, options)
        .then((response) => response.json())
        .then((result) => {
          console.log(result.message);
          // toast.success("Invoice created successfully");
          if (result && result.message === "ProposalesAndEls Template Updated successfully") {
            // fetchPrprosalsAllData();
            navigate("/firmtemp/templates/proposals");
            toast.success("ProposalesAndEls Template Updated successfully");
          } else {
            toast.error(result.message || "Failed to Updated ProposalesAndEls Template");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    else if (currentStep === "Services & Invoices" || currentStep === "Payments") {
    if (activeOption === "invoice") {
      const lineItems = invoiceDataUpdate.lineItems.map((item) => ({
        productorService: item.productName, // Assuming productName maps to productorService
        description: item.description,
        rate: item.rate.replace("$", ""), // Removing '$' sign from rate
        quantity: item.qty,
        amount: item.amount.replace("$", ""), // Removing '$' sign from amount
        tax: item.tax.toString(), // Converting boolean to string
      }));
      const options = {
        method: "PATCH",
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
          servicesandinvoicetempid: invoiceDataUpdate.servicesandinvoicetempid,
          invoicetemplatename: invoiceDataUpdate.invoicetemplatename,
          invoiceteammember: invoiceDataUpdate.invoiceteammember,
          issueinvoice: invoiceDataUpdate.issueinvoice,
          specificdate: invoiceDataUpdate.specificdate,
          specifictime: invoiceDataUpdate.specifictime,
          description: invoiceDataUpdate.description,
          lineItems: lineItems,
          summary: invoiceDataUpdate.summary,
          notetoclient: invoiceDataUpdate.notetoclient,
          Addinvoiceoraskfordeposit: addInvoice,
          Additemizedserviceswithoutcreatinginvoices: addInvoiceitemized,
          paymentterms: paymentterms,
          paymentduedate: paymentduedate,
          paymentamount: paymentamount,
          active: true,
        }),
      };
      console.log(options.body);
      fetch(`${PROPOSAL_API}/workflow/proposalesandels/proposalesandels/${_id}`, options)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result && result.message === "ProposalesAndEls Template Updated successfully") {
            // fetchPrprosalsAllData();
            navigate("/firmtemp/templates/proposals");
            toast.success("ProposalesAndEls Template Updated successfully");
          } else {
            toast.error(result.message || "Failed to create ProposalesAndEls Template");
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
        method: "PATCH",
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
          // invoicetemplatename: invoiceData.invoicetemplatename,
          // invoiceteammember: invoiceData.invoiceteammember,
          // issueinvoice: invoiceData.issueinvoice,
          // specificdate: invoiceData.specificdate,
          // specifictime: invoiceData.specifictime,
          // description: invoiceData.description,
          lineItems: lineItems,
          summary: {
            subtotal: subtotal,
            taxRate: taxRate,
            taxTotal: taxTotal,
            total: totalAmount,
          },
          // notetoclient: invoiceData.notetoclient,
          Addinvoiceoraskfordeposit: addInvoice,
          Additemizedserviceswithoutcreatinginvoices: addInvoiceitemized,
          // paymentterms: paymentterms,
          // paymentduedate: paymentduedate,
          // paymentamount: paymentamount,
          active: true,
        }),
      };
      console.log(options.body);
      fetch(`${PROPOSAL_API}/workflow/proposalesandels/proposalesandels/${_id}`, options)
        .then((response) => response.json())
        .then((result) => {
          console.log(result.message);
          // toast.success("Invoice created successfully");
          if (result && result.message === "ProposalesAndEls Template Updated successfully") {
            // fetchPrprosalsAllData();
            navigate("/firmtemp/templates/proposals");
            toast.success("ProposalesAndEls Template Updated successfully");
          } else {
            toast.error(result.message || "Failed to update ProposalesAndEls Template");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
  };

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

  //*******ServiceUpdate */

  //   const handleSaveInvoice = () => {
  //     const serviceAndInvoice = {
  //         // invoiceTempId: selectInvoiceTemp.value,
  //         // invoiceTempName: selectInvoiceTemp.label,
  //         // invoiceTeamMember: selecteduser.value,
  //         // issueInvoiceSelect: issueInvoice,
  //         // specificDate: startDate,
  //         // specificTime: selectedTime,
  //         descriptionData: description,
  //         lineItems: rows,
  //         summary: {
  //             subtotal: subtotal,
  //             taxRate: taxRate,
  //             taxTotal: taxTotal,
  //             total: totalAmount,
  //         },
  //         // noteToClient: clientNote,
  //     };

  //     console.log('Service and Invoice Settings:', serviceAndInvoice);

  //     if (typeof serviceandinvoiceSettings === 'function') {
  //         serviceandinvoiceSettings(serviceAndInvoice);
  //     }
  // };

  // const handleSaveInvoiceonUpdate = () => {
  //     const serviceAndInvoice = {
  //         // invoiceTempId: selectInvoiceTemp.value,
  //         // invoiceTempName: selectInvoiceTemp.label,
  //         // invoiceTeamMember: selecteduser.value,
  //         // issueInvoiceSelect: issueInvoice,
  //         // specificDate: startDate,
  //         // specificTime: selectedTime,
  //         descriptionData: description,
  //         lineItems: rows,
  //         summary: {
  //             subtotal: subtotal,
  //             taxRate: taxRate,
  //             taxTotal: taxTotal,
  //             total: totalAmount,
  //         },
  //         // noteToClient: clientNote,
  //     };
  //     console.log('Service and Invoice Settings:', serviceAndInvoice);
  //     if (typeof serviceandinvoiceSettingonupdate === 'function') {
  //         serviceandinvoiceSettingonupdate(serviceAndInvoice);
  //     }
  //     setRows(rows)
  // };

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
      const rateValue = parseFloat(selectedRowData.rate.replace(/[^0-9.-]+/g, "")); // Removing currency symbol
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
        productName: rows[selectedRow].productName ? `${rows[selectedRow].productName} Copy` : "Copy",
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

        if (result && result.message === "ServiceTemplate created successfully") {
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
        const errorMessage = error.response && error.response.message ? error.response.message : "Failed to create invoice";
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

    console.log("Rate: ", rate, "Qty: ", qty, "Total Amount: $", calculatedAmount.toFixed(2));
    setTotalamount(`$${calculatedAmount.toFixed(2)}`);
  }, [selectedRowData?.rate, selectedRowData?.qty]);

  console.log(totalamount);
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <FormSection title="General" icon={<FileText className="h-4 w-4" />}>
              <FormField label="Template name (not visible to clients)">
                <Input
                  placeholder="Template name (not visible to clients)"
                  value={templatename}
                  onChange={(e) => settemplatename(e.target.value)}
                  error={!!errors.templatename}
                />
                {!!errors.templatename && (
                  <p className="text-sm text-destructive mt-1">{errors.templatename}</p>
                )}
              </FormField>

              <FormRow cols={2}>
                <FormField label="Team Member">
                  <MultiSelectDropdown
                    value={selectedUser}
                    onChange={handleUserChange}
                    placeholder="TeamMember"
                  />
                </FormField>
                <FormField label="Proposal name (visible to clients)">
                  <Input
                    ref={textFieldRef}
                    value={proposalName}
                    onChange={handleProposalName}
                    onClick={(e) => setCursorPosition(e.target.selectionStart)}
                    placeholder="Proposal name (visible to clients)"
                  />
                  <ShortcodePopover
                    shortcuts={filteredShortcuts}
                    onSelect={handleAddShortcut}
                    selectedOption={selectedOption}
                    onOptionChange={setSelectedOption}
                  />
                </FormField>
              </FormRow>
            </FormSection>

            <FormSection title="Steps">
              <div className="space-y-3">
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Introduction</Label>
                    <Switch checked={stepsVisibility.Introduction} onCheckedChange={(checked) => handleSwitchChange("Introduction")({ target: { checked } })} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Explain to your clients who you are, what services you provide, the value you bring, and any other information you want to share</p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Terms</Label>
                    <Switch checked={stepsVisibility.Terms} onCheckedChange={(checked) => handleSwitchChange("Terms")({ target: { checked } })} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Engagement letter or contractual agreement that outlines the terms of the relationship between your firm and clients.</p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Services & Invoices</Label>
                    <Switch checked={stepsVisibility.ServicesInvoices} onCheckedChange={(checked) => handleSwitchChange("ServicesInvoices")({ target: { checked } })} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Specify the services your firm will provide. Add one-time or recurring invoices to get paid automatically.</p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Custom message in email</Label>
                      <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">Best practice</span>
                    </div>
                    <Switch checked={stepsVisibility.CustomEmailMessage} onCheckedChange={(checked) => handleSwitchChange("CustomEmailMessage")({ target: { checked } })} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Your client will receive a link via email to view and sign this proposal.</p>
                  {stepsVisibility.CustomEmailMessage && (
                    <div className="mt-3">
                      <EditorShortcodes onChange={handleEditorChange} initialContent={description} />
                    </div>
                  )}
                </div>
              </div>
            </FormSection>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Reminders</Label>
                <Switch checked={stepsVisibility.Reminders} onCheckedChange={(checked) => handleSwitchChange("Reminders")({ target: { checked } })} />
              </div>
              {stepsVisibility.Reminders && (
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
              )}
            </div>
          </div>
        );
      case steps.indexOf("Introduction"):
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Introduction</h3>
            <Input
              placeholder="Introduction"
              onChange={handleIntroductionName}
              value={introductionname}
            />
            <Editor onChange={handleIntroductionChange} initialContent={introductionContent} />
          </div>
        );
      case steps.indexOf("Terms"):
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Terms and Conditions</h3>
            <Input
              placeholder="Engagement letter"
              onChange={handleTermsandConditionName}
              value={termsandconditionname}
            />
            <TermEditor onChange={handleTermsChange} initialContent={termsContent} />
          </div>
        );
      case steps.indexOf("Services & Invoices"):
        return (
          <div className="space-y-6">
            <h3 className="text-base font-semibold">Choose one of the options</h3>

            <div
              className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                activeOption === "invoice" ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:border-primary/50"
              }`}
              onClick={handleShowInvoiceForm}
            >
              <p className="font-medium">Add invoice or ask for deposit</p>
              <p className="text-sm text-muted-foreground mt-1">Create one-time or recurring invoice, or ask for deposit to sign</p>
            </div>

            <div
              className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                activeOption === "service" ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:border-primary/50"
              }`}
              onClick={handleShowServiceForm}
            >
              <p className="font-medium">Add itemized services without creating invoices</p>
              <p className="text-sm text-muted-foreground mt-1">No invoice or deposit request will be created</p>
            </div>

            {activeOption === "invoice" && invoiceData && Object.keys(invoiceData).length > 0 && (
              <Invoice serviceandinvoiceSettings={serviceandinvoiceSettings} serviceandinvoiceSettingonupdate={serviceandinvoiceSettingonupdate} />
            )}

            {activeOption === "service" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold">Line items</h4>
                  <p className="text-sm text-muted-foreground">Client-facing itemized list of products and services</p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="sticky left-0 bg-muted/50 px-3 py-2 text-left font-medium text-muted-foreground">Product/Service</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Rate</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Qty</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Amount</th>
                        <th className="px-3 py-2 text-center font-medium text-muted-foreground">Tax</th>
                        <th className="px-3 py-2 w-10" />
                        <th className="px-3 py-2 w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index} className="border-b border-border last:border-0">
                          <td className="sticky left-0 bg-white px-2 py-1.5" style={{ minWidth: 180 }}>
                            <CreatableSelect
                              placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
                              options={serviceoptions}
                              value={row.productName ? serviceoptions.find((option) => option.label === row.productName) || { label: row.productName, value: row.productName } : null}
                              onChange={(selectedOption) => handleServiceChange(index, selectedOption)}
                              onInputChange={(inputValue, actionMeta) => handleServiceInputChange(inputValue, actionMeta, index)}
                              isClearable
                              styles={{
                                container: (provided) => ({ ...provided, minWidth: "160px" }),
                                control: (provided) => ({ ...provided, minHeight: "34px", borderColor: "#e2e8f0" }),
                                menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                              }}
                              menuPortalTarget={document.body}
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <input type="text" name="description" value={row.description} onChange={(e) => handleInputChange(index, e)} className="w-full rounded border-0 bg-transparent px-1 py-1 text-sm outline-none focus:ring-1 focus:ring-ring" placeholder="Description" />
                          </td>
                          <td className="px-2 py-1.5">
                            <input type="text" name="rate" value={row.rate} onChange={(e) => handleInputChange(index, e)} className="w-20 rounded border-0 bg-transparent px-1 py-1 text-sm outline-none focus:ring-1 focus:ring-ring" />
                          </td>
                          <td className="px-2 py-1.5">
                            <input type="text" name="qty" value={row.qty} onChange={(e) => handleInputChange(index, e)} className="w-14 rounded border-0 bg-transparent px-1 py-1 text-sm outline-none focus:ring-1 focus:ring-ring" />
                          </td>
                          <td className="px-2 py-1.5 text-sm">{row.amount}</td>
                          <td className="px-2 py-1.5 text-center">
                            <input type="checkbox" name="tax" checked={row.tax} onChange={(e) => handleInputChange(index, e)} className="h-4 w-4 rounded border-gray-300" />
                          </td>
                          <td className="px-1 py-1.5">
                            <div className="relative">
                              <button type="button" onClick={(event) => handleMenuOpen(event, index)} className="rounded p-1 text-muted-foreground hover:bg-accent">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {Boolean(anchorElNew) && selectedRow === index && (
                                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border bg-white py-1 shadow-lg">
                                  <button type="button" onClick={() => handleEditService(row, index)} className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent">Edit</button>
                                  <button type="button" onClick={handleDeleteService} className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent text-destructive">Delete</button>
                                  <button type="button" onClick={() => handleSaveAsNewService(row)} className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent">Save as new service</button>
                                  <button type="button" onClick={handleDuplicate} className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent">Duplicate</button>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-1 py-1.5">
                            <button type="button" onClick={() => deleteRow(index)} className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-4">
                  <Button type="button" variant="ghost" size="sm" onClick={() => addRow()} className="text-primary">
                    <Plus className="h-4 w-4 mr-1" /> Line item
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => addRow(true)} className="text-primary">
                    <Percent className="h-4 w-4 mr-1" /> Discount
                  </Button>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-base font-semibold mb-3">Summary</h4>
                  <div className="overflow-x-auto rounded-lg border border-border bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground">Subtotal</th>
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground">Tax Rate</th>
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground">Tax Total</th>
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              <span>$</span>
                              <input value={subtotal} onChange={handleSubtotalChange} className="w-20 rounded border-0 bg-transparent px-1 py-0.5 text-sm outline-none focus:ring-1 focus:ring-ring" />
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              <input value={taxRate} onChange={handleTaxRateChange} className="w-16 rounded border-0 bg-transparent px-1 py-0.5 text-sm outline-none focus:ring-1 focus:ring-ring" />
                              <span>%</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-sm">${taxTotal.toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm font-semibold">${totalAmount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Drawers rendered outside the service table flow */}
                <FormDrawer open={isNewDrawerOpen} onClose={handleNewDrawerClose} title="Create Service" width="lg">
                  <FormSection title="Service Details">
                    <FormField label="Service Name">
                      <Input placeholder="Service Name" value={selectedRowData?.productName || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
                    </FormField>
                    <FormField label="Description">
                      <Input placeholder="Description" value={selectedRowData?.description || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
                    </FormField>
                    <FormRow cols={2}>
                      <FormField label="Rate">
                        <Input placeholder="Rate" value={selectedRowData?.rate || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
                      </FormField>
                      <FormField label="Rate Type">
                        <select
                          className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={selectedRateOption?.value || ""}
                          onChange={(e) => {
                            const opt = options.find(o => o.value === e.target.value);
                            handleRateTypeChange(null, opt);
                          }}
                        >
                          <option value="">Select Rate Type</option>
                          {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </FormField>
                    </FormRow>
                    <div className="flex items-center justify-between mt-2">
                      <Label className="text-sm">Tax</Label>
                      <Switch checked={selectedRowData?.tax || false} onCheckedChange={handleServiceSwitch} />
                    </div>
                  </FormSection>
                  <FormSection title="Category">
                    <FormField label="Category Name">
                      <select
                        className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={selectedCategory?.value || ""}
                        onChange={(e) => {
                          const opt = categoryoptions.find(o => o.value === e.target.value);
                          handleCategoryChange(null, opt || null);
                        }}
                      >
                        <option value="">Select Category</option>
                        {categoryoptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </FormField>
                    <Button type="button" variant="outline" size="sm" onClick={setCategoryFormOpen} className="mt-2">
                      <Plus className="h-4 w-4 mr-1" /> Create category
                    </Button>
                  </FormSection>
                  <FormDrawerFooter>
                    <Button variant="outline" onClick={handleNewDrawerClose}>Cancel</Button>
                    <Button onClick={createservicetemp}>Save</Button>
                  </FormDrawerFooter>
                </FormDrawer>

                <FormDrawer open={isCategoryFormOpen} onClose={handleCategoryFormClose} title="Create Category" width="md">
                  <FormSection>
                    <FormField label="Category Name">
                      <Input placeholder="Category Name" value={categorycreate} onChange={(e) => setcategorycreate(e.target.value)} />
                    </FormField>
                  </FormSection>
                  <FormDrawerFooter>
                    <Button variant="outline" onClick={handleCategoryFormClose}>Cancel</Button>
                    <Button onClick={createCategory}>Create</Button>
                  </FormDrawerFooter>
                </FormDrawer>

                <FormDrawer open={isEditDrawerOpen} onClose={handleEditDrawerClose} title="Edit Item" width="lg">
                  <FormSection title="Product or Service">
                    <FormField label="Product Name">
                      <Input value={selectedRowData?.productName || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
                    </FormField>
                    <FormField label="Description">
                      <Input value={selectedRowData?.description || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
                    </FormField>
                    <div className="grid grid-cols-3 gap-3">
                      <FormField label="Rate">
                        <Input value={selectedRowData?.rate || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
                      </FormField>
                      <FormField label="QTY">
                        <Input value={selectedRowData?.qty || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, qty: e.target.value })} />
                      </FormField>
                      <FormField label="Amount">
                        <Input disabled value={totalamount} />
                      </FormField>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Label className="text-sm">Tax</Label>
                      <Switch checked={selectedRowData?.tax || false} onCheckedChange={handleServiceWitch} />
                    </div>
                  </FormSection>
                  <FormDrawerFooter>
                    <Button variant="outline" onClick={handleEditDrawerClose}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save</Button>
                  </FormDrawerFooter>
                </FormDrawer>
              </div>
            )}
          </div>
        );

      case steps.indexOf("Payments"):
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <FormField label="Payment Terms">
              <Input placeholder="Payment terms" onChange={handlePaymentTerms} value={paymentterms} />
            </FormField>
            <FormField label="Payment Due Date">
              <Input placeholder="Payment due date" onChange={handlePaymentDueDate} value={paymentduedate} />
            </FormField>
            <FormField label="Payment Amount">
              <Input placeholder="Payment amount" onChange={handlePaymentAmount} value={paymentamount} />
            </FormField>
          </div>
        );

      default:
        return <p className="text-sm text-muted-foreground">Unknown Step</p>;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-start gap-6 p-5">
        {/* Stepper */}
        <div className="flex-1">
          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center gap-2">
              {steps.map((label, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleStepClick(index)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    index === activeStep
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : index < activeStep
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    index === activeStep
                      ? "bg-white text-primary"
                      : index < activeStep
                      ? "bg-primary text-white"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}>
                    {index + 1}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button onClick={activeStep === steps.length - 1 ? handleReset : handleNext}>
            {activeStep === steps.length - 1 ? "Save Template" : "Next"}
            {activeStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
          <Button variant="outline" disabled={activeStep === 0} onClick={handleBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
      </div>

      {/* Step Content */}
      <div className="px-5 pb-8">{renderStepContent(activeStep)}</div>
    </div>
  );
};

export default MyStepperUpdate;

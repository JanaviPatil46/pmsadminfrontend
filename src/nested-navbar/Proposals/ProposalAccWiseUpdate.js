import React, { useState, useEffect,  } from "react";
import Editor from "../../Templates/Texteditor/Editor";
import TermEditor from "../../Templates/Texteditor/TermEditor";
import CreatableSelect from "react-select/creatable";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import Invoice from "./Invoice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { IoArrowBackSharp, IoArrowBack } from "react-icons/io5";
import EditorShortcodes from "../../Templates/Texteditor/EditorShortcodes";

const MyStepperUpdateAcc = () => {

  const { data, _id } = useParams();
  console.log(_id);
  console.log(data);

  const navigate = useNavigate();
  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
  const PROPOSAL_ACCOUNT_API = process.env.REACT_APP_PROPOSAL_URL;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;

  const isSmallScreen = window.innerWidth < 600;
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
    fetchProposalTemplateData();
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

  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedTeamMemberValues(selectedValues);
  };

  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

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

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
  }, [shortcuts]);

  useEffect(() => {
    // Set shortcuts based on selected option
    if (selectedOption === "contacts") {
      const contactShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
        { title: "Contact Shortcodes", isBold: true },
        { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
        { title: "First Name", isBold: false, value: "FIRST_NAME" },
        { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
        { title: "Last Name", isBold: false, value: "LAST_NAME" },
        { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
        { title: "Country", isBold: false, value: "COUNTRY" },
        { title: "Company name", isBold: false, value: "COMPANY_NAME " },
        { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
        { title: "City", isBold: false, value: "CITY" },
        { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
        { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
        { title: "Custom field:Email", isBold: false, value: "CONTACT_CUSTOM_FIELD:Email" },
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
      setShortcuts(contactShortcuts);
    } else if (selectedOption === "account") {
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
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

  const handleProposalName = (e) => {
    const { value } = e.target;
    setProposalName(value);
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleAddShortcut = (shortcut) => {
    setProposalName((prevText) => prevText + `[${shortcut}]`);
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
  // console.log(steps)
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
        const rate = service.rate ? parseFloat(service.rate.replace("$", "")) : 0;
        const updatedRow = {
          productName: service.serviceName || "", // Assuming serviceName corresponds to productName
          description: service.description || "",
          // rate: service.rate ? `$${service.rate.toFixed(2)}` : "$0.00",
          // qty: "1", // Default quantity is 1
          // amount: service.rate ? `$${service.rate.toFixed(2)}` : "$0.00", // Assuming amount is calculated as rate
          rate: `$${rate.toFixed(2)}`,
          qty: "1", // Default quantity is 1
          amount: `$${rate.toFixed(2)}`,
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
  }, [rows]);

  const [option, setOptions] = useState([]);
  const [invoiceData, setInvoiceData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchproposalbyid = async (_id) => {
    try {
      const url = `${PROPOSAL_ACCOUNT_API}/proposalandels/proposalaccountwise/proposallist/${_id}`;
      const response = await fetch(url);
      const result = await response.json();
      const proposalesandelsTemplate = result.proposalesandelsAccountwise;
      console.log(proposalesandelsTemplate);
      // Set template name and proposal name

      const accountData = proposalesandelsTemplate.accountid;

      if (accountData && accountData._id) {
        const selectedAccount = [{
          label: accountData.accountName, // Map `accountName` to `label`
          value: accountData._id,         // Map `_id` to `value`
        }];
        setSelectedAccount(selectedAccount);
      } else {
        setSelectedAccount(null); // Clear if no matching account found
      }

      const selectedProposal = {
        label: proposalesandelsTemplate.proposaltemplateid?.templatename,
        value: proposalesandelsTemplate.proposaltemplateid?._id,
      };

      setSelectedProposalTemp(selectedProposal);
      // settemplatename(proposalesandelsTemplate.templatename);
      setProposalName(proposalesandelsTemplate.proposalname);
      // Map team members for Autocomplete
      const mappedOptions = proposalesandelsTemplate.teammember.map((member) => ({
        label: member.username, // Display username
        value: member._id, // Use _id as the value
      }));
      setOptions(mappedOptions);
      setSelectedUser(mappedOptions);

      const selectedValues = mappedOptions.map((option) => option.value);
      setCombinedTeamMemberValues(selectedValues);
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

      if (proposalesandelsTemplate.Additemizedserviceswithoutcreatinginvoices === "service") {
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

      setTaxRate(proposalesandelsTemplate.summary.taxRate || '');

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
      await fetchproposalbyid(_id);
    };

    fetchData();
  }, []); // Empty dependency array to run only once on mount

  console.log(serviceandinvoiceSettings);

  const handleReset = (serviceAndInvoiceData) => {
    // console.log(serviceAndInvoiceData)
    if (!serviceAndInvoiceData) {
      console.error("Error: serviceAndInvoiceData is undefined");
      return;
    }
    // onupdateserviceandinvoiceSettings(serviceAndInvoiceData);
    updatesaveProposaltemp();
    setActiveStep(0);
    navigate(`/clients/accounts/accountsdash/proposals/${data}`);
  };

  const updatesaveProposaltemp = () => {
    // if (!validateForm()) {
    //   // toast.error("Please fix the validation errors.");
    //   return;
    // }
    const currentStep = steps[activeStep];

    if (["General", "Introduction", "Terms"].includes(currentStep)) {
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountids: [data],
          proposaltemplateid: selectedProposalTemp.value,
          templatename: templatename,
          teammember: combinedTeamMemberValues,
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
          active: true,
        }),
      };

      const url = `${PROPOSAL_ACCOUNT_API}/proposalandels/proposalaccountwise/${_id}`;
      console.log(url); // Log the URL for debugging
      console.log(options.body); // Log request body for debugging

      fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          console.log(result.message);
          if (result?.message === "Proposalesandels Accountwise Updated successfully") {
            toast.success("Proposalesandels Accountwise Updated successfully");
            
          } else {
            toast.error(result.message || "Failed to update ProposalesAndEls");
          }
        })
        .catch((error) => {
          console.error("Fetch Error:", error);
          toast.error("An error occurred while updating ProposalesAndEls.");
        });
    }
    else if (currentStep === "Services & Invoices" || currentStep === "Payments") {
      if (activeOption === "invoice") {
        const lineItems = invoiceData.lineItems.map((item) => ({
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
            accountids: [data],
            proposaltemplateid: selectedProposalTemp.value,
            templatename: templatename,
            teammember: combinedTeamMemberValues,
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
        const url = `${PROPOSAL_ACCOUNT_API}/proposalandels/proposalaccountwise/${_id}`;
        console.log(url); // Log the URL for debugging
        console.log(options.body); // Log request body for debugging

        fetch(url, options)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
          })
          .then((result) => {
            console.log(result.message);
            if (result?.message === "Proposalesandels Accountwise Updated successfully") {
              toast.success("Proposalesandels Accountwise Updated successfully");
            } else {
              toast.error(result.message || "Failed to update ProposalesAndEls");
            }
          })
          .catch((error) => {
            console.error("Fetch Error:", error);
            toast.error("An error occurred while updating ProposalesAndEls.");
          });
      }

      if (activeOption === "service") {
        console.log(rows)
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
            accountids: [data],
            proposaltemplateid: selectedProposalTemp.value,
            templatename: templatename,
            teammember: combinedTeamMemberValues,
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
        const url = `${PROPOSAL_ACCOUNT_API}/proposalandels/proposalaccountwise/${_id}`;
        console.log(url); // Log the URL for debugging
        console.log(options.body); // Log request body for debugging

        fetch(url, options)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
          })
          .then((result) => {
            console.log(result.message);
            if (result?.message === "Proposalesandels Accountwise Updated successfully") {
              toast.success("Proposalesandels Accountwise Updated successfully");
            } else {
              toast.error(result.message || "Failed to update ProposalesAndEls");
            }
          })
          .catch((error) => {
            console.error("Fetch Error:", error);
            toast.error("An error occurred while updating ProposalesAndEls.");
          });
      }
    }
  };




  

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


  const [accountData, setAccountData] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState([]);
  console.log(selectedAccount)

  const fetchAccountsData = async () => {
    try {
      const url = `${ACCOUNT_API}/accounts/account/accountdetailslist/`;
      const response = await fetch(url);
      const result = await response.json();

      if (Array.isArray(result.accountlist)) {
        setAccountData(result.accountlist);
        console.log(result.accountlist);

        // Assuming `data` contains the selected account ID(s) as a string or array of IDs

        // Adjust _id to the actual selected ID or IDs you need
        // console.log(data)
        // const selectedAccountData = result.accountlist.find((account) => account.id === data);
        // console.log(selectedAccountData)
        // if (selectedAccountData) {
        //   const selectedAccount = [{
        //     label: selectedAccountData.Name,
        //     value: selectedAccountData.id,
        //   }];
        //   setSelectedAccount(selectedAccount); // Set single account
        // } else {
        //   setSelectedAccount(null); // Clear if no matching account found
        // }
      } else {
        console.error("Account list is not an array", result.accountlist);
      }

    } catch (error) {
      console.log("Error:", error);
    }
  };

  const AccountsOptions = (accountData || []).map((account) => ({
    value: account.id,
    label: account.Name,
  }));
  // console.log(combinedValues)
  const [proposalTempData, setProposalTempData] = useState([]);
  // const [selectedProposalTemp, setSelectedProposalTemp] = useState();

  const [selectedProposalTemp, setSelectedProposalTemp] = useState({ label: "", value: "" });

  const [combinedProposalTempValues, setCombinedProposalTempValues] = useState();


  const fetchProposalTemplateData = async () => {
    try {
      const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setProposalTempData(data.proposalesAndElsTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const templateOptions = proposalTempData.map((proposaltemp) => ({
    value: proposaltemp._id,
    label: proposaltemp.templatename,
  }));



  const fetchproposalTemplatbyid = async (templateid) => {
    try {
      const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandelslist/${templateid}`;
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
      setCombinedTeamMemberValues(selectedValues);
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

  const handleProposalTempChange = (event, selectedOption) => {
    console.log(selectedOption); // Single selected object
    setSelectedProposalTemp(selectedOption); // Update the selected template
    setCombinedProposalTempValues(selectedOption ? [selectedOption.value] : []); // Store value as an array with one element or an empty array if no selection
    fetchproposalTemplatbyid(selectedOption.value)
  };

  console.log(totalamount);
  const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder:text-gray-400 transition-colors";
  const labelCls = "block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5";
  const btnPrimary = "rounded-lg px-4 py-2 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] transition-colors";
  const btnOutline = "rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors";
  const switchEl = (checked, onChange) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e)} className="sr-only peer" />
      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
    </label>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-gray-800">General</h2>
              <p className="text-xs text-gray-400 mt-0.5">Configure the proposal settings</p>
            </div>

            {/* Account */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className={labelCls}>Account</label>
              <div className="flex flex-wrap gap-2 min-h-[38px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                {selectedAccount.map(a => (
                  <span key={a.value} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 border border-blue-200 text-blue-700">{a.label}</span>
                ))}
                {selectedAccount.length === 0 && <span className="text-gray-400 text-sm">Account</span>}
              </div>
            </div>

            {/* Template */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className={labelCls}>Template (not visible to clients)</label>
              <select value={selectedProposalTemp?.value || ""}
                onChange={(e) => { const opt = templateOptions.find(o => o.value === e.target.value); handleProposalTempChange(e, opt); }}
                className={inputCls + (errors.templatename ? " border-red-400 ring-1 ring-red-300" : "")}>
                <option value="">Select a template</option>
                {templateOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Team Member + Proposal Name */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Team Member</label>
                  <div className="flex flex-wrap gap-1 min-h-[38px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                    {selectedUser.map(u => (
                      <span key={u.value} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">{u.label}</span>
                    ))}
                    {selectedUser.length === 0 && <span className="text-gray-400 text-sm">Assignees</span>}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Proposal Name (visible to clients)</label>
                  <input type="text" value={proposalName + selectedShortcut} onChange={handleProposalName}
                    placeholder="Proposal name" className={inputCls} />
                  <div className="relative mt-2">
                    <button type="button" onClick={toggleDropdown} className={btnPrimary}>
                      Add Shortcode
                    </button>
                    {showDropdown && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={handleCloseDropdown} />
                        <div className="absolute left-0 z-40 bg-white border border-gray-200 rounded-xl shadow-xl w-[300px] max-h-[280px] overflow-y-auto">
                          <ul className="py-1">
                            {filteredShortcuts.map((shortcut, index) => (
                              <li key={index} onClick={() => handleAddShortcut(shortcut.value)}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                                  shortcut.isBold ? "font-semibold text-gray-700" : "text-gray-600"
                                }`}>
                                {shortcut.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Steps</p>
              <div className="space-y-3">
                {[
                  { key: "Introduction", label: "Introduction", desc: "Explain who you are, what services you provide, and the value you bring." },
                  { key: "Terms", label: "Terms", desc: "Engagement letter or contractual agreement outlining the relationship terms." },
                  { key: "ServicesInvoices", label: "Services & Invoices", desc: "Specify services your firm will provide. Add invoices to get paid automatically." },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    {switchEl(stepsVisibility[key], handleSwitchChange(key))}
                  </div>
                ))}

                {/* Custom Email Message */}
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-700">Custom message in email</p>
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Best practice</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">Your client receives a link via email to view and sign this proposal.</p>
                    </div>
                    {switchEl(stepsVisibility.CustomEmailMessage, handleSwitchChange("CustomEmailMessage"))}
                  </div>
                  {stepsVisibility.CustomEmailMessage && (
                    <div className="mt-3">
                      <EditorShortcodes onChange={handleEditorChange} initialContent={description} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reminders */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Reminders</p>
                  <p className="text-xs text-gray-400 mt-0.5">Automatically remind clients about pending proposals</p>
                </div>
                {switchEl(stepsVisibility.Reminders, handleSwitchChange("Reminders"))}
              </div>
              {stepsVisibility.Reminders && (
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className={labelCls}>Days until next reminder</label>
                    <input type="text" name="Daysuntilnextreminder" value={daysuntilNextReminder}
                      onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                      placeholder="e.g. 3" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Number of reminders</label>
                    <input type="text" name="noOfReminder" value={noOfReminder}
                      onChange={(e) => setNoOfReminder(e.target.value)}
                      placeholder="e.g. 5" className={inputCls} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case steps.indexOf("Introduction"):
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-gray-800">Introduction</h2>
              <p className="text-xs text-gray-400 mt-0.5">Describe your firm and the value you bring to clients</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className={labelCls}>Section Title</label>
              <input type="text" placeholder="Introduction title" className={inputCls}
                onChange={handleIntroductionName} value={introductionname} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className={labelCls}>Content</label>
              <Editor onChange={handleIntroductionChange} initialContent={introductionContent} />
            </div>
          </div>
        );
      case steps.indexOf("Terms"):
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-gray-800">Terms and Conditions</h2>
              <p className="text-xs text-gray-400 mt-0.5">Engagement letter or contractual agreement</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className={labelCls}>Section Title</label>
              <input type="text" placeholder="Engagement letter title" className={inputCls}
                onChange={handleTermsandConditionName} value={termsandconditionname} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className={labelCls}>Content</label>
              <TermEditor onChange={handleTermsChange} initialContent={termsContent} />
            </div>
          </div>
        );
      case steps.indexOf("Services & Invoices"):
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-gray-800">Services &amp; Invoices</h2>
              <p className="text-xs text-gray-400 mt-0.5">Choose how to handle billing for this proposal</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div onClick={handleShowInvoiceForm} className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                activeOption === "invoice" ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white"
              }`}>
                <p className="font-semibold text-sm text-gray-800">Add invoice or ask for deposit</p>
                <p className="text-xs text-gray-400 mt-1">Create one-time or recurring invoice, or ask for deposit to sign</p>
              </div>
              <div onClick={handleShowServiceForm} className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                activeOption === "service" ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white"
              }`}>
                <p className="font-semibold text-sm text-gray-800">Add itemized services without invoices</p>
                <p className="text-xs text-gray-400 mt-1">No invoice or deposit request will be created</p>
              </div>
            </div>

            {activeOption === "invoice" && invoiceData && Object.keys(invoiceData).length > 0 && (
              <div>
                <Invoice serviceandinvoiceSettings={serviceandinvoiceSettings} serviceandinvoiceSettingonupdate={serviceandinvoiceSettingonupdate} />
              </div>
            )}
            {activeOption === "service" && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">Line Items</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Client-facing itemized list of products and services</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-2 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Product / Service</th>
                        <th className="text-left px-2 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Description</th>
                        <th className="text-left px-2 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Rate</th>
                        <th className="text-left px-2 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Qty</th>
                        <th className="text-left px-2 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                        <th className="text-left px-2 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Tax</th>
                        <th className="px-2 py-2"></th>
                        <th className="px-2 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {rows.map((row, index) => (
                        <tr key={index} className="relative">
                          <td className="px-2 py-1">
                            <CreatableSelect
                              placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
                              options={serviceoptions}
                              value={row.productName ? serviceoptions.find((option) => option.label === row.productName) || { label: row.productName, value: row.productName } : null}
                              onChange={(selectedOption) => handleServiceChange(index, selectedOption)}
                              onInputChange={(inputValue, actionMeta) => handleServiceInputChange(inputValue, actionMeta, index)}
                              isClearable
                              styles={{
                                container: (provided) => ({ ...provided, width: "180px" }),
                                control: (provided) => ({ ...provided, width: "180px" }),
                                menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                              }}
                              menuPortalTarget={document.body}
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input type="text" name="description" value={row.description} onChange={(e) => handleInputChange(index, e)} className="border-none outline-none text-sm w-full" placeholder="Description" />
                          </td>
                          <td className="px-2 py-1">
                            <input type="text" name="rate" value={row.rate} onChange={(e) => handleInputChange(index, e)} className="border-none outline-none text-sm w-20" />
                          </td>
                          <td className="px-2 py-1">
                            <input type="text" name="qty" value={row.qty} onChange={(e) => handleInputChange(index, e)} className="border-none outline-none text-sm w-12" />
                          </td>
                          <td className={`px-2 py-1 text-sm ${row.isDiscount ? "text-red-500" : ""}`}>{row.amount}</td>
                          <td className="px-2 py-1">
                            <input type="checkbox" name="tax" checked={row.tax} onChange={(e) => handleInputChange(index, e)} className="h-4 w-4" />
                          </td>
                          <td className="px-2 py-1 relative">
                            <button type="button" onClick={(e) => handleMenuOpen(e, index)} className="p-1 text-gray-500 hover:text-gray-700">
                              <BsThreeDotsVertical />
                            </button>
                            {Boolean(anchorElNew) && selectedRow === index && (
                              <>
                                <div className="fixed inset-0 z-30" onClick={handleMenuClose} />
                                <div className="absolute right-0 z-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                                  <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => handleEditService(row, index)}>Edit</button>
                                  <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={handleDeleteService}>Delete</button>
                                  <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => handleSaveAsNewService(row)}>Save as new service</button>
                                  <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={handleDuplicate}>Duplicate</button>
                                </div>
                              </>
                            )}
                          </td>
                          <td className="px-2 py-1">
                            <button type="button" onClick={() => deleteRow(index)} className="p-1 text-gray-400 hover:text-red-500">
                              <RiCloseLine />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-50">
                  <button type="button" onClick={() => addRow()} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <AiOutlinePlusCircle size={15} /> Line item
                  </button>
                  <button type="button" onClick={() => addRow(true)} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <CiDiscount1 size={15} /> Discount
                  </button>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Summary</h3>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Subtotal</p>
                      <div className="flex items-center text-sm text-gray-700">$<input type="number" value={subtotal} onChange={handleSubtotalChange} className="bg-transparent border-none outline-none text-sm w-20 ml-1" /></div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Tax Rate</p>
                      <div className="flex items-center text-sm text-gray-700"><input type="number" value={taxRate} onChange={handleTaxRateChange} className="bg-transparent border-none outline-none text-sm w-16" />%</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Tax Total</p>
                      <p className="text-sm text-gray-700">${taxTotal.toFixed(2)}</p>
                    </div>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                      <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide mb-1">Total</p>
                      <p className="text-sm font-bold text-blue-700">${totalAmount}</p>
                    </div>
                  </div>
                </div>

                {/* Create Service Drawer */}
                {isNewDrawerOpen && (
                  <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={handleNewDrawerClose} />
                    <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-2xl flex flex-col">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                        <div>
                          <h2 className="text-sm font-semibold text-gray-800">Create Service</h2>
                          <p className="text-xs text-gray-400 mt-0.5">Save this line item as a reusable service</p>
                        </div>
                        <button type="button" onClick={handleNewDrawerClose} className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                          <RxCross2 size={15} />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                        <div>
                          <label className={labelCls}>Service Name</label>
                          <input type="text" placeholder="Service Name" className={inputCls}
                            value={selectedRowData?.productName || ""}
                            onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
                        </div>
                        <div>
                          <label className={labelCls}>Description</label>
                          <input type="text" placeholder="Description" className={inputCls}
                            value={selectedRowData?.description || ""}
                            onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>Rate</label>
                            <input type="text" placeholder="Rate" className={inputCls}
                              value={selectedRowData?.rate || ""}
                              onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
                          </div>
                          <div>
                            <label className={labelCls}>Rate Type</label>
                            <select value={selectedRateOption?.value || ""}
                              onChange={(e) => { const opt = Rateoptions.find(o => o.value === e.target.value); handleRateTypeChange(e, opt); }}
                              className={inputCls}>
                              <option value="">Select Rate Type</option>
                              {Rateoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
                          <span className="text-sm font-medium text-gray-700">Apply Tax</span>
                          {switchEl(selectedRowData?.tax || false, (e) => handleServiceSwitch(e.target.checked))}
                        </div>
                        <div className="pt-2">
                          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Category</p>
                          <label className={labelCls}>Category</label>
                          <select value={selectedCategory?.value || ""}
                            onChange={(e) => { const opt = categoryoptions.find(o => o.value === e.target.value); handleCategoryChange(e, opt); }}
                            className={inputCls}>
                            <option value="">Select category</option>
                            {categoryoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                          <button type="button" onClick={() => setCategoryFormOpen(true)} className={btnOutline + " mt-2 text-xs"}>
                            + Create new category
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 shrink-0">
                        <button type="button" onClick={handleNewDrawerClose} className={btnOutline}>Cancel</button>
                        <button type="button" onClick={createservicetemp} className={btnPrimary}>Save Service</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Category Drawer */}
                {isCategoryFormOpen && (
                  <div className="fixed inset-0 z-[60] overflow-hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={handleCategoryFormClose} />
                    <div className="absolute right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl flex flex-col">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={handleCategoryFormClose} className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                            <IoArrowBack size={15} />
                          </button>
                          <h2 className="text-sm font-semibold text-gray-800">Create Category</h2>
                        </div>
                      </div>
                      <div className="flex-1 px-5 py-4">
                        <label className={labelCls}>Category Name</label>
                        <input type="text" placeholder="Category Name" className={inputCls}
                          value={categorycreate} onChange={(e) => setcategorycreate(e.target.value)} />
                      </div>
                      <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 shrink-0">
                        <button type="button" onClick={handleCategoryFormClose} className={btnOutline}>Cancel</button>
                        <button type="button" onClick={createCategory} className={btnPrimary}>Create</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Service Drawer */}
                {isEditDrawerOpen && (
                  <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={handleEditDrawerClose} />
                    <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-2xl flex flex-col">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                        <div>
                          <h2 className="text-sm font-semibold text-gray-800">Edit Line Item</h2>
                          <p className="text-xs text-gray-400 mt-0.5">Update the details for this service row</p>
                        </div>
                        <button type="button" onClick={handleEditDrawerClose} className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                          <RxCross2 size={15} />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                        <div>
                          <label className={labelCls}>Product or Service</label>
                          <input type="text" className={inputCls} value={selectedRowData?.productName || ""}
                            onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
                        </div>
                        <div>
                          <label className={labelCls}>Description</label>
                          <textarea className={inputCls} rows={2} value={selectedRowData?.description || ""}
                            onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className={labelCls}>Rate</label>
                            <input type="text" className={inputCls} value={selectedRowData?.rate || ""}
                              onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
                          </div>
                          <div>
                            <label className={labelCls}>QTY</label>
                            <input type="text" className={inputCls} value={selectedRowData?.qty || ""}
                              onChange={(e) => setSelectedRowData({ ...selectedRowData, qty: e.target.value })} />
                          </div>
                          <div>
                            <label className={labelCls}>Amount</label>
                            <input type="text" className={inputCls + " opacity-60 cursor-not-allowed"} disabled value={totalamount} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
                          <span className="text-sm font-medium text-gray-700">Apply Tax</span>
                          {switchEl(selectedRowData?.tax || false, (e) => handleServiceWitch(e.target.checked))}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 shrink-0">
                        <button type="button" onClick={handleEditDrawerClose} className={btnOutline}>Cancel</button>
                        <button type="button" onClick={handleSaveChanges} className={btnPrimary}>Save Changes</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case steps.indexOf("Payments"):
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-gray-800">Payment Information</h2>
              <p className="text-xs text-gray-400 mt-0.5">Configure payment details for this proposal</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
              <div>
                <label className={labelCls}>Payment Terms</label>
                <input type="text" placeholder="e.g. Net 30" className={inputCls} onChange={handlePaymentTerms} value={paymentterms} />
              </div>
              <div>
                <label className={labelCls}>Payment Due Date</label>
                <input type="text" placeholder="e.g. 2024-12-31" className={inputCls} onChange={handlePaymentDueDate} value={paymentduedate} />
              </div>
              <div>
                <label className={labelCls}>Payment Amount</label>
                <input type="text" placeholder="e.g. $500.00" className={inputCls} onChange={handlePaymentAmount} value={paymentamount} />
              </div>
            </div>
          </div>
        );

      default:
        return <p className="text-sm">Unknown Step</p>;
    }
  };

  const handleBackToProposalTable = () => {
    navigate(`/clients/accounts/accountsdash/proposals/${data}`);
  };

  return (
    <div className="w-full p-4 md:p-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-5">
        <button type="button" onClick={handleBackToProposalTable}
          className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
          <IoArrowBackSharp size={18} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-gray-800">Update Proposal / Engagement Letter</h1>
          <p className="text-xs text-gray-400 mt-0.5">Edit and save your proposal settings</p>
        </div>
      </div>

      {/* Stepper + Actions bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 bg-white rounded-xl border border-gray-200 px-4 py-3">
        {/* Steps */}
        <div className="flex items-center flex-wrap gap-1 overflow-x-auto">
          {steps.map((label, index) => (
            <div key={index} className="flex items-center">
              <button type="button" onClick={() => handleStepClick(index)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeStep === index
                    ? "bg-[var(--color-save-btn)] text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeStep === index ? "bg-white/30" : "bg-gray-300 text-gray-600"
                }`}>{index + 1}</span>
                {label}
              </button>
              {index < steps.length - 1 && <div className="w-5 h-px bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>
        {/* Nav buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" disabled={activeStep === 0} onClick={handleBack}
            className={btnOutline + " disabled:opacity-40 disabled:cursor-not-allowed"}>
            Back
          </button>
          <button type="button"
            onClick={activeStep === steps.length - 1 ? handleReset : handleNext}
            className={btnPrimary}>
            {activeStep === steps.length - 1 ? "Save Template" : "Next"}
          </button>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-3xl">{renderStepContent(activeStep)}</div>
    </div>
  );
};

export default MyStepperUpdateAcc;

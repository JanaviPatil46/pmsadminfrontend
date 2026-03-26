import React, { useState, useEffect, useMemo, useRef } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField as MuiTextField } from "@mui/material";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import "./invoices.css";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { RxCross2 } from "react-icons/rx";
import { FormPage, FormSection, FormField, FormRow, FormDrawer, FormDrawerFooter } from "../components/ui/form-layout";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Checkbox } from "../components/ui/checkbox";
import { FileSearch, HelpCircle, X, Plus } from "lucide-react";

const Invoices = ({ charLimit = 4000 }) => {
  const navigate = useNavigate();
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
  const CONTACT_API= process.env.REACT_APP_CONTACTS_URL;
  const { _id } = useParams();
  console.log("new id",_id)
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [payInvoice, setIsPayInvoice] = useState(false);
  const [emailInvoice, setIsEmailInvoice] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [scheduledInvoice, setScheduledInvoice] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [invoicenumber, setinvoicenumber] = useState();

  const handlePayInvoiceChange = (checked) => {
    setIsPayInvoice(checked);
  };
  const handleEmailInvoiceChange = (checked) => {
    setIsEmailInvoice(checked);
  };
  const handleRemindersChange = (checked) => {
    setReminders(checked);
  };
  const handleScheduledInvoiceChange = (checked) => {
    setScheduledInvoice(checked);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length <= charLimit) {
      setDescription(value);
      setCharCount(value.length);
    }
  };
  //for shortcodes
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");

  const handleAddShortcut = (shortcut) => {
    const updatedTextValue = description + `[${shortcut}]`;
    if (updatedTextValue.length <= charLimit) {
      setDescription(updatedTextValue);
      setCharCount(updatedTextValue.length);
    }
    setShowDropdown(false);
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

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
  };
  //for table
  const [rows, setRows] = useState([]);
  const [servicedata, setServiceData] = useState([]);

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

  const handleServiceChange = (index, selectedOptions) => {
    const newRows = [...rows];
    newRows[index].productName = selectedOptions ? selectedOptions.label : "";
    setRows(newRows);
  };

  const handleServiceInputChange = (inputValue, actionMeta, index) => {
    if (actionMeta.action === "input-change") {
      const newRows = [...rows];
      newRows[index].productName = inputValue;
      setRows(newRows);
    }
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

  const addRow = (isDiscountRow = false) => {
    const newRow = isDiscountRow ? { productName: "", description: "", rate: "$-10.00", qty: "1", amount: "$-10.00", tax: false, isDiscount: true } : { productName: "", description: "", rate: "$0.00", qty: "1", amount: "$0.00", tax: false, isDiscount: false };
    setRows([...rows, newRow]);
  };

  const deleteRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const [paymentMode, setPaymentMode] = useState("");
  const paymentsOptions = [
    { value: "Bank Debits", label: "Bank Debits" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Credit Card or Bank Debits", label: "Credit Card or Bank Debits" },
  ];
  const handlePaymentOptionChange = (event, selectedOption) => {
    setPaymentMode(selectedOption);
  };

  //****************Accounts */
  const [accountdata, setaccountdata] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState(null);

  const handleAccountChange = (event, newValue) => {
    setSelectedaccount(newValue);
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails`);
      const data = await response.json();
      setaccountdata(data.accounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // console.log(userdata);
  const accountoptions = accountdata.map((account) => ({
    value: account._id,
    label: account.accountName,
  }));

  // team member
  const USER_API = process.env.REACT_APP_USER_URL;
  const [selecteduser, setSelectedUser] = useState("");

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

  const handleuserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  //get all templateName Record
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);

  const fetchInvoiceTemplates = async () => {
    try {
      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch InvoiceTemplate");
      }
      const data = await response.json();
      setInvoiceTemplates(data.invoiceTemplate);
      console.log(data);
    } catch (error) {
      console.error("Error fetching Invoice Templates:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceTemplates();
  }, []);

  const invoiceoptions = invoiceTemplates.map((invoice) => ({
    value: invoice._id,
    label: invoice.templatename,
  }));

  const [selectInvoiceTemp, setSelectedInvoiceTemp] = useState("");
  const handleInvoiceTempChange = (event, selectedOptions) => {
    setSelectedInvoiceTemp(selectedOptions);
    fetchinvoicetempbyid(selectedOptions.value);
  };

  const fetchinvoicetempbyid = async (id) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("invoiceTemplate",result.invoiceTemplate);
        setDescription(result.invoiceTemplate.description);
        setIsPayInvoice(result.invoiceTemplate.payInvoicewithcredits);
        setIsEmailInvoice(result.invoiceTemplate.sendEmailWhenInvCreated);
        setReminders(result.invoiceTemplate.sendReminderstoClients);

        const paymentMethod = {
          value: result.invoiceTemplate.paymentMethod,
          label: result.invoiceTemplate.paymentMethod,
        };
        setPaymentMode(paymentMethod);
        // Assuming lineitems is an array of objects and each object matches the structure needed for rows
        console.log(result.invoiceTemplate.lineItems);
        const lineitems = result.invoiceTemplate.lineItems.map((item) => ({
          productName: item.productorService || "",
          description: item.description || "",
          rate: String(item.rate || "$0.00"), // Convert rate to string
          qty: String(item.quantity || "1"), // Convert qty to string
          amount: String(item.amount || "$0.00"), // Convert amount to string
          tax: item.tax || false,
          isDiscount: item.isDiscount || false,
        }));
        setRows(lineitems);
        setSubtotal(result.invoiceTemplate.summary.subtotal);
        setTaxRate(result.invoiceTemplate.summary.taxRate);
        console.log(result.invoiceTemplate.summary.taxRate);
        setTaxTotal(result.invoiceTemplate.summary.taxTotal);
        setTotalAmount(result.invoiceTemplate.summary.total);
      })
      .catch((error) => console.error(error));
  };
  const [startDate, setStartDate] = useState();
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
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

  // useEffect(() => {
  //   const calculateSubtotal = () => {
  //     let subtotal = 0;

  //     rows.forEach((row) => {
  //       // if (row.tax) {
  //       //   subtotal += parseFloat(row.amount.replace("$", "")) || 0;
  //       // }
  //       subtotal += parseFloat(row.amount.replace("$", "")) || 0;
  //     });
  //     console.log(subtotal);
  //     setSubtotal(subtotal);
  //     calculateTotal(subtotal, taxRate);
  //   };
  //   calculateSubtotal();
  // }, [rows,taxRate]);
   useEffect(() => {
      const calculateSummary = () => {
        let subtotal = 0;
        let taxableAmount = 0;
  
        rows.forEach((row) => {
          const amount = parseFloat(row.amount.replace("$", "")) || 0;
          subtotal += amount;
          if (row.tax) {
            taxableAmount += amount;
          }
        });
  
        const tax = taxableAmount * (taxRate / 100);
        setSubtotal(subtotal);
        setTaxTotal(tax);
        setTotalAmount((subtotal + tax).toFixed(2));
      };
  
      calculateSummary();
    }, [rows, taxRate]);
  const lineItems = rows.map((item) => ({
    productorService: item.productName, // Assuming productName maps to productorService
    description: item.description,
    rate: item.rate.replace("$", ""), // Removing '$' sign from rate
    quantity: item.qty,
    amount: item.amount.replace("$", ""), // Removing '$' sign from amount
    tax: item.tax.toString(), // Converting boolean to string
  }));
  //
  const createinvoice = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      account: selectedaccount.value,
      invoicenumber: invoicenumber,
      invoicedate: startDate,
      description: description,
      invoicetemplate: selectInvoiceTemp.value,
      paymentMethod: paymentMode.value,
      teammember: selecteduser.value,
      emailinvoicetoclient: emailInvoice,
      scheduleinvoicedate: new Date(), // Current date and time
      scheduleinvoicetime: new Date().toLocaleTimeString('en-US', { hour12: false }), 
      payInvoicewithcredits: payInvoice,
      reminders: reminders,
      scheduleinvoice: scheduledInvoice,
      daysuntilnextreminder: "",
      numberOfreminder: "",
      lineItems: lineItems,
      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },
      active: "true",
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${INVOICE_NEW}/workflow/invoices/invoice/${_id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result && result.message === "Invoice Updated successfully") {
          toast.success("Invoice Updated successfully");
          navigate("/billing/Invoices");
        } else {
          toast.error(result.message || "Failed to Updated InvoiceTemplate");
        }
      })
      .catch((error) => console.error(error));
  };
  const handleCloseInvoice = () => {
    navigate("/billing/Invoices");
  };
  const [billingInvoice, setBillingInvoice] = useState([]);
  const fetchInvoiceData = async () => {
    try {
      const url = `${INVOICE_NEW}/workflow/invoices/invoice`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();

      setBillingInvoice(data.invoice);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };

  //shortcode for  switch btn

  const [showSwitchDropdown, setshowSwitchDropdown] = useState(false);
  const [switchfilteredShortcuts, setSwitchFilteredShortcuts] = useState([]);
  const [clientmsg, setClientmsg] = useState("");
  const [switchanchorEl, setSwitchAnchorEl] = useState(null);
  const [emailToClient, setEmailToClient] = useState(false);

  const toggleSwitchDropdown = (event) => {
    setSwitchAnchorEl(event.currentTarget);
    setshowSwitchDropdown(!showSwitchDropdown);
  };

  const handleSwitchAddShortcut = (shortcut) => {
    setClientmsg((prevText) => prevText + `[${shortcut}]`);
    setshowSwitchDropdown(false);
  };

  useEffect(() => {
    fetchinvoicebyid(_id);
  }, []);

  const [invoiceidetails, setinvoicedetails] = useState();
  const [selectedDate, setSelectedDate] = useState(null);

  // const fetchinvoicebyid = (id) => {

  //     const requestOptions = {
  //         method: "GET",
  //         redirect: "follow"
  //     };

  //     //const url = `${API_KEY}/workflow/invoice/invoicelist/invoicelistbyid/${id}`;
  //     //    const url = `http://127.0.0.1:7650/workflow/invoices/invoice/${id}`
  //     const url = `http://127.0.0.1:7650/workflow/invoices/invoice/invoicelist/invoicelistbyid/${id}`;
  //     console.log(url)
  //     fetch(url, requestOptions)
  //         .then((response) => response.json())
  //         .then((result) => {
  //             console.log(result)
  //             // setinvoicedetails(result.invoice)
  //             setinvoicenumber(result.invoice.invoicenumber)

  //             setStartDate(result.invoice.invoicedate)
  //             console.log(result.invoice.account)
  //             const account = ({
  //                 value: result.invoice.account._id,
  //                 label: result.invoice.account.accountName,
  //             });
  //             setSelectedaccount(account)
  //             console.log(account)
  //             const invoicetemplate = ({
  //                 value: result.invoice.invoicetemplate._id,
  //                 label: result.invoice.invoicetemplate,
  //             });
  //             setSelectedInvoiceTemp(invoicetemplate)
  //             const paymentMethod = ({
  //                 value: result.invoice.paymentMethod,
  //                 label: result.invoice.paymentMethod,
  //             });
  //             setPaymentMode(paymentMethod)
  //             const teammember = ({
  //                 value: result.invoice.teammember._id,
  //                 label: result.invoice.teammember,
  //             });
  //             setSelectedUser(teammember)
  //             setDescription(result.invoice.description)
  //             setEmailToClient(result.invoice.emailinvoicetoclient)
  //             // setPayUsingCredits(result.invoice.payInvoicewithcredits)
  //             // setInvoiceReminders(result.invoice.reminders)
  //             setScheduledInvoice(result.invoice.scheduleinvoicetime)
  //             setIsPayInvoice(result.invoice.payInvoicewithcredits)
  //             setIsEmailInvoice(result.invoice.emailinvoicetoclient)
  //             setReminders(result.invoice.reminders)

  //             const lineItems = result.invoice.lineItems.map(item => ({
  //                 productName: item.productorService || '',
  //                 description: item.description || '',
  //                 rate: String(item.rate || '$0.00'), // Convert rate to string
  //                 qty: String(item.quantity || '1'), // Convert qty to string
  //                 amount: String(item.amount || '$0.00'), // Convert amount to string
  //                 tax: item.tax || false,
  //                 isDiscount: item.isDiscount || false
  //             }));

  //             setRows(lineItems)
  //         })
  //         .catch((error) => console.error(error));
  // }

  const fetchinvoicebyid = (id) => {
    console.log("id",id)
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const url = `${INVOICE_NEW}/workflow/invoices/invoice/invoicelist/invoicelistbyid/${id}`;
    console.log(url);

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("invoices ",result);

        // Check if result and invoice exist before setting state
        if (result && result.invoice) {
          // Set invoice number
          setinvoicenumber(result.invoice.invoicenumber);

          // Set invoice date
          // setStartDate(new Date(result.invoice.invoicedate));
          const invoiceDate = dayjs(result.invoice.invoicedate);
          setStartDate(invoiceDate);
          // Set account
          const account = {
            value: result.invoice.account._id,
            label: result.invoice.account.accountName,
          };
          console.log(account);
          setSelectedaccount(account);

          // Set invoice template
          // const invoicetemplate = {
          //   value: result.invoice.invoicetemplate._id,
          //   label: result.invoice.invoicetemplate.templatename, // Use "templatename" field
          // };
          // setSelectedInvoiceTemp(invoicetemplate);
if (result?.invoice?.invoicetemplate) {
  const invoicetemplate = {
    value: result.invoice.invoicetemplate._id,
    label: result.invoice.invoicetemplate.templatename,
  };
  setSelectedInvoiceTemp(invoicetemplate);
} else {
  // No template found – clear state
  setSelectedInvoiceTemp(null);
}
          // Set payment method
          const paymentMethod = {
            value: result.invoice.paymentMethod,
            label: result.invoice.paymentMethod,
          };
          setPaymentMode(paymentMethod);

          // // Set team member
          // const teammember = {
          //   value: result.invoice.teammember._id,
          //   label: result.invoice.teammember.username, // Use "username" field for the label
          // };
          // setSelectedUser(teammember);
          // Set team member
if (result.invoice.teammember) {
  const teammember = {
    value: result.invoice.teammember._id,
    label: result.invoice.teammember.username,
  };
  setSelectedUser(teammember);
} else {
  setSelectedUser(null); // Or leave it unset, or set a default
}


          // Set invoice description
          setDescription(result.invoice.description);
          console.log("test", result.invoice.description)

          // Set email invoice to client
          setEmailToClient(result.invoice.emailinvoicetoclient);

          // Set scheduled invoice time
          setScheduledInvoice(result.invoice.scheduleinvoice);

          // Set pay invoice with credits
          setIsPayInvoice(result.invoice.payInvoicewithcredits);

          // Set email invoice flag
          setIsEmailInvoice(result.invoice.emailinvoicetoclient);

          // Set reminders flag
          setReminders(result.invoice.reminders);

          // Set line items
          const lineItems = result.invoice.lineItems.map((item) => ({
            productName: item.productorService || "",
            description: item.description || "",
            rate: String(item.rate || "0.00"), // Convert rate to string
            qty: String(item.quantity || "1"), // Convert quantity to string
            amount: String(item.amount || "0.00"), // Convert amount to string
            tax: item.tax || false,
            isDiscount: item.isDiscount || false,
          }));

          setRows(lineItems);
          setSubtotal(result.invoice.summary.subtotal);
          setTaxRate(result.invoice.summary.taxRate);
          console.log(result.invoice.summary.taxRate);
          setTaxTotal(result.invoice.summary.taxTotal);
          setTotalAmount(result.invoice.summary.total);
        }
      })
      .catch((error) => console.error(error));
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
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
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



   //preview drawer
   const [previewDrawerOpen, setpreviewDrawerOpen] = useState(false);
   const handleOpenpreviewDrawer = () => setpreviewDrawerOpen(true);
   const handleClosepreviewDrawer = () => setpreviewDrawerOpen(false);
 
 
   const [firstContactEmail, setFirstContactEmail] = useState("");
   
   const contactMail = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    console.log("Calling API with ID:", selectedaccount?.value); // Debug log

    fetch(
      // `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyid/${selectedaccount?.value}`,
       `https://www.snptaxes.com/api/accounts/${selectedaccount?.value}`,
      requestOptions
    )
      .then((response) => {
        console.log("Response status:", response.status); // Debug log
        return response.json();
      })
      .then((result) => {
        console.log("API Result:", result); // Debug log

        // Check for `contacts` array
      if (Array.isArray(result.contacts) && result.contacts.length > 0) {
        const email = result.contacts[0]?.contact?.email;

        if (email) {
          console.log("First Contact Email:", email);
          setFirstContactEmail(email);
        } else {
          console.error("First contact does not have an email.");
          setFirstContactEmail("[CONTACT EMAIL]");
        }
      } else {
        console.error("No contacts found.");
        setFirstContactEmail("[CONTACT EMAIL]");
      }
    })
    .catch((error) => {
      console.error("Error fetching contacts:", error);
      setFirstContactEmail("Error fetching email");
    });
  };
   
   useEffect(() => {
     if (selectedaccount?.value) {
       contactMail();
     }
   }, [selectedaccount]);

  return (
    <FormPage
      title="Edit Invoice"
      actions={
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleOpenpreviewDrawer} className="flex items-center gap-1 text-primary hover:underline text-sm">
            <FileSearch className="h-4 w-4" /> Preview
          </button>
          <Button variant="outline" onClick={handleCloseInvoice}>Cancel</Button>
          <Button onClick={createinvoice}>Save</Button>
        </div>
      }
    >
      <form>
        <div className="space-y-5">
          <FormRow cols={2}>
            <FormField label="Account name, ID or email">
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedaccount?.value || ""}
                onChange={(e) => {
                  const opt = accountoptions.find(o => o.value === e.target.value);
                  setSelectedaccount(opt || null);
                }}
              >
                <option value="">Select Account</option>
                {accountoptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Invoice Template">
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectInvoiceTemp?.value || ""}
                onChange={(e) => {
                  const opt = invoiceoptions.find(o => o.value === e.target.value);
                  if (opt) handleInvoiceTempChange(null, opt);
                }}
              >
                <option value="">Invoice Template</option>
                {invoiceoptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormField>
          </FormRow>

          <FormRow cols={2}>
            <FormField label="Invoice Number">
              <Input disabled value={invoicenumber} onChange={(e) => setinvoicenumber(e.target.value)} placeholder="Invoice Number" />
            </FormField>
            <FormField label="Choose payment method">
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={paymentMode?.value || ""}
                onChange={(e) => {
                  const opt = paymentsOptions.find(o => o.value === e.target.value);
                  handlePaymentOptionChange(null, opt || null);
                }}
              >
                <option value="">Select Payment Mode</option>
                {paymentsOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormField>
          </FormRow>

          <FormRow cols={2}>
            <FormField label="Date">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={startDate}
                  onChange={handleStartDateChange}
                  format="MM/DD/YYYY"
                  sx={{ width: "100%", backgroundColor: "#fff" }}
                  renderInput={(params) => <MuiTextField {...params} size="small" sx={{ width: "100%" }} />}
                />
              </LocalizationProvider>
            </FormField>
            <FormField label="Team Member">
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selecteduser?.value || ""}
                onChange={(e) => {
                  const opt = options.find(o => o.value === e.target.value);
                  handleuserChange(null, opt || null);
                }}
              >
                <option value="">Team Member</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormField>
          </FormRow>

          <FormField label="Description">
            <div className="relative">
              <Input value={description} onChange={handleChange} placeholder="Description" />
              <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">{charCount}/{charLimit}</span>
            </div>
          </FormField>

          <div className="relative inline-block">
            <Button type="button" variant="secondary" size="sm" onClick={toggleDropdown}>Add Shortcode</Button>
            {showDropdown && (
              <div className="absolute z-50 mt-1 w-[300px] max-h-[300px] overflow-y-auto rounded-lg border bg-white shadow-lg">
                {filteredShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    onClick={() => handleAddShortcut(shortcut.value)}
                    className={`px-3 py-2 cursor-pointer hover:bg-muted text-sm ${shortcut.isBold ? "font-bold" : ""}`}
                  >
                    {shortcut.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional */}
          <FormSection title="Additional">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Pay invoice using client credits</Label>
              <Switch checked={payInvoice} onCheckedChange={handlePayInvoiceChange} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Email invoice to client</Label>
                <Switch checked={emailInvoice} onCheckedChange={handleEmailInvoiceChange} />
              </div>
              {emailInvoice && (
                <div className="space-y-2 pl-2">
                  <Input placeholder="Client message" />
                  <div className="relative inline-block">
                    <Button type="button" variant="secondary" size="sm" onClick={toggleSwitchDropdown}>Add Shortcode</Button>
                    {showSwitchDropdown && (
                      <div className="absolute z-50 mt-1 w-[300px] max-h-[300px] overflow-y-auto rounded-lg border bg-white shadow-lg">
                        {switchfilteredShortcuts.map((shortcut, index) => (
                          <div
                            key={index}
                            onClick={() => handleSwitchAddShortcut(shortcut.value)}
                            className={`px-3 py-2 cursor-pointer hover:bg-muted text-sm ${shortcut.isBold ? "font-bold" : ""}`}
                          >
                            {shortcut.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Reminders</Label>
              <Switch checked={reminders} onCheckedChange={handleRemindersChange} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Label className="text-sm">Scheduled invoice</Label>
                <HelpCircle className="h-4 w-4 text-primary" />
              </div>
              <Switch checked={scheduledInvoice} onCheckedChange={handleScheduledInvoiceChange} />
            </div>
          </FormSection>

          {/* Line Items */}
          <FormSection title="Line Items">
            <p className="text-sm text-muted-foreground">Client-facing itemized list of products and services</p>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-2 font-medium">PRODUCT OR SERVICE</th>
                    <th className="text-left p-2 font-medium">DESCRIPTION</th>
                    <th className="text-left p-2 font-medium">RATE</th>
                    <th className="text-left p-2 font-medium">QTY</th>
                    <th className="text-left p-2 font-medium">AMOUNT</th>
                    <th className="text-left p-2 font-medium">TAX</th>
                    <th className="p-2" />
                    <th className="p-2" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
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
                      <td className="p-2">
                        <input type="text" name="description" value={row.description} onChange={(e) => handleInputChange(index, e)} className="border-none outline-none bg-transparent w-full" placeholder="Description" />
                      </td>
                      <td className="p-2">
                        <input type="text" name="rate" value={row.rate} onChange={(e) => handleInputChange(index, e)} className="border-none outline-none bg-transparent w-20" />
                      </td>
                      <td className="p-2">
                        <input type="text" name="qty" value={row.qty} onChange={(e) => handleInputChange(index, e)} className="border-none outline-none bg-transparent w-16" />
                      </td>
                      <td className={`p-2 ${row.isDiscount ? "discount-amount" : ""}`}>{row.amount}</td>
                      <td className="p-2">
                        <Checkbox
                          checked={row.tax}
                          onCheckedChange={(checked) => handleInputChange(index, { target: { name: "tax", value: checked, type: "checkbox", checked } })}
                        />
                      </td>
                      <td className="p-2 relative">
                        <button type="button" onClick={(event) => handleMenuOpen(event, index)} className="p-1 rounded hover:bg-muted">
                          <BsThreeDotsVertical />
                        </button>
                        {Boolean(anchorElNew) && selectedRow === index && (
                          <div className="absolute right-0 top-full z-50 w-48 rounded-lg border bg-white shadow-lg py-1">
                            <button type="button" onClick={() => handleEditService(row, index)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted">Edit</button>
                            <button type="button" onClick={handleDeleteService} className="w-full text-left px-4 py-2 text-sm hover:bg-muted">Delete</button>
                            <button type="button" onClick={() => handleSaveAsNewService(row)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted">Save as new service</button>
                            <button type="button" onClick={handleDuplicate} className="w-full text-left px-4 py-2 text-sm hover:bg-muted">Duplicate</button>
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        <button type="button" onClick={() => deleteRow(index)} className="p-1 rounded hover:bg-muted text-destructive">
                          <RiCloseLine />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-5 mt-4">
              <button type="button" onClick={() => addRow()} className="flex items-center gap-1 text-primary text-sm cursor-pointer hover:underline">
                <AiOutlinePlusCircle /> Line item
              </button>
              <button type="button" onClick={() => addRow(true)} className="flex items-center gap-1 text-primary text-sm cursor-pointer hover:underline">
                <CiDiscount1 /> Discount
              </button>
            </div>
          </FormSection>

          {/* Summary */}
          <FormSection title="Summary">
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white rounded-lg border">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-3 font-medium">SUBTOTAL</th>
                    <th className="text-left p-3 font-medium">TAX RATE</th>
                    <th className="text-left p-3 font-medium">TAX TOTAL</th>
                    <th className="text-left p-3 font-medium">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3"><input type="number" value={subtotal} onChange={handleSubtotalChange} className="border-none outline-none bg-transparent w-24" /></td>
                    <td className="p-3"><input type="number" value={taxRate} onChange={handleTaxRateChange} className="border-none outline-none bg-transparent w-20" />%</td>
                    <td className="p-3">${taxTotal.toFixed(2)}</td>
                    <td className="p-3 font-semibold">${totalAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FormSection>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <Button onClick={createinvoice}>Save</Button>
              <Button variant="outline" onClick={handleCloseInvoice}>Cancel</Button>
            </div>
            <p className="text-sm">Total: <strong>${totalAmount}</strong></p>
          </div>
        </div>
      </form>

      {/* Preview Drawer */}
      <FormDrawer open={previewDrawerOpen} onClose={handleClosepreviewDrawer} title="Preview" width="lg">
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-bold text-orange-500 mb-4">Invoice</h3>
            <div className="flex justify-between text-sm mb-2">
              <span>{selectedaccount?.label || 'Default Text'}</span>
              <span>Invoice number: {invoicenumber || "[INVOICE_NUMBER]"}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>{firstContactEmail || "No email available"}</span>
              <span>Date: {startDate ? startDate.format('YYYY-MM-DD') : ''}</span>
            </div>
            <p className="text-sm mb-6">Description: {description}</p>
            <table className="w-full text-sm mb-8">
              <thead>
                <tr className="bg-orange-50 border-b">
                  <th className="text-left p-2 font-semibold">Product/Service</th>
                  <th className="text-left p-2 font-semibold">Description</th>
                  <th className="text-right p-2 font-semibold">Rate ($)</th>
                  <th className="text-right p-2 font-semibold">Qty</th>
                  <th className="text-right p-2 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{row.productName}</td>
                    <td className="p-2">{row.description}</td>
                    <td className="p-2 text-right">{row.rate || '$0.00'}</td>
                    <td className="p-2 text-right">{row.qty || '1'}</td>
                    <td className="p-2 text-right">{row.amount || '$0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <table className="w-1/2 ml-auto text-sm">
            <tbody>
              <tr className="border-b"><td className="p-2 font-semibold">Subtotal:</td><td className="p-2">${subtotal || "0.00"}</td></tr>
              <tr className="border-b"><td className="p-2 font-semibold">Tax Rate:</td><td className="p-2">{taxRate || "0.00"}%</td></tr>
              <tr className="border-b"><td className="p-2 font-semibold">Tax Total:</td><td className="p-2">${taxTotal?.toFixed(2) || "0.00"}</td></tr>
              <tr><td className="p-2 font-bold">Total:</td><td className="p-2 font-bold">${totalAmount || "0.00"}</td></tr>
            </tbody>
          </table>

          <Button onClick={createinvoice}>Save & Exit</Button>
        </div>
      </FormDrawer>

      {/* Save as New Service Drawer */}
      <FormDrawer open={isNewDrawerOpen} onClose={handleNewDrawerClose} title="Create Service" width="md">
        <div className="space-y-4">
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
                  const opt = Rateoptions.find(o => o.value === e.target.value);
                  handleRateTypeChange(null, opt);
                }}
              >
                <option value="">Select Rate Type</option>
                {Rateoptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormField>
          </FormRow>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Tax</Label>
            <Switch checked={selectedRowData?.tax || false} onCheckedChange={handleServiceSwitch} />
          </div>

          <h4 className="text-lg font-semibold mt-4">Category</h4>
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
          <Button type="button" variant="outline" size="sm" onClick={setCategoryFormOpen}>
            <Plus className="h-4 w-4 mr-1" /> Create category
          </Button>
        </div>
        <FormDrawerFooter>
          <Button variant="outline" onClick={handleNewDrawerClose}>Cancel</Button>
          <Button onClick={createservicetemp}>Save</Button>
        </FormDrawerFooter>
      </FormDrawer>

      {/* Category Drawer */}
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

      {/* Edit Service Drawer */}
      <FormDrawer open={isEditDrawerOpen} onClose={handleEditDrawerClose} title="Edit Item" width="md">
        <div className="space-y-4">
          <FormField label="Product or service">
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
          <div className="flex items-center justify-between">
            <Label className="text-sm">Tax</Label>
            <Switch checked={selectedRowData?.tax || false} onCheckedChange={handleServiceWitch} />
          </div>
        </div>
        <FormDrawerFooter>
          <Button variant="outline" onClick={handleEditDrawerClose}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save</Button>
        </FormDrawerFooter>
      </FormDrawer>
    </FormPage>
  );
};

export default Invoices;

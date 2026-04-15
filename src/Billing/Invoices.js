import React, { useState, useEffect, useMemo } from "react";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import "./invoices.css";
import { MoreHorizontal, X, ChevronLeft, FileText, Plus, Percent } from "lucide-react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import CreatableSelect from "react-select/creatable";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { useContext } from "react";
import { LoginContext } from "../Sidebar/Context/Context";
const Invoices = ({ charLimit = 4000 }) => {
  const navigate = useNavigate();
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [payInvoice, setIsPayInvoice] = useState(false);
  const [emailInvoice, setIsEmailInvoice] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [scheduledInvoice, setScheduledInvoice] = useState(false);
  const [charCount, setCharCount] = useState(0);
   const [invoicenumber, setinvoicenumber] = useState("");
    const [isLoadingInvoiceNumber, setIsLoadingInvoiceNumber] = useState(true);
  const handlePayInvoiceChange = (event) => {
    setIsPayInvoice(event.target.checked);
  };
  const handleEmailInvoiceChange = (event) => {
    setIsEmailInvoice(event.target.checked);
  };
  const handleRemindersChange = (event) => {
    setReminders(event.target.checked);
  };
  const handleScheduledInvoiceChange = (event) => {
    setScheduledInvoice(event.target.checked);
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
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
  }, [shortcuts]);

  useEffect(() => {
    // Set shortcuts based on selected option
    if (selectedOption === "contacts") {
      const contactShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        {
          title: "Custom field:Website",
          isBold: false,
          value: "ACCOUNT_CUSTOM_FIELD:Website",
        },
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
        {
          title: "Custom field:Email",
          isBold: false,
          value: "CONTACT_CUSTOM_FIELD:Email",
        },
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
      setShortcuts(contactShortcuts);
    } else if (selectedOption === "account") {
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        {
          title: "Custom field:Website",
          isBold: false,
          value: "ACCOUNT_CUSTOM_FIELD:Website",
        },
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
    setAnchorEl(null);
     setShowDropdown(false);
  };
  //for table
  const [rows, setRows] = useState([]);
  const [servicedata, setServiceData] = useState([]);

  useEffect(() => {
    fetchServiceData();
     fetchNextInvoiceNumber()
  }, []);
  // Function to fetch the next invoice number
    const fetchNextInvoiceNumber = async () => {
      try {
        setIsLoadingInvoiceNumber(true);
        const url = `${INVOICE_NEW}/workflow/invoices/next-invoice-number`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch next invoice number');
        }
        
        const data = await response.json();
        setinvoicenumber(data.nextInvoiceNumber.toString());
      } catch (error) {
        console.error('Error fetching next invoice number:', error);
        // If there's an error, set a placeholder or handle appropriately
        setinvoicenumber("Auto-generated");
        toast.error('Failed to load invoice number');
      } finally {
        setIsLoadingInvoiceNumber(false);
      }
    };
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

        const service = Array.isArray(result.serviceTemplate)
          ? result.serviceTemplate[0]
          : result.serviceTemplate;
        // const rate = typeof service.rate === 'number' ? service.rate : 0;
        const rate = service.rate
          ? parseFloat(service.rate.replace("$", ""))
          : 0;
        const updatedRow = {
          productName: service.serviceName || "", // Assuming serviceName corresponds to productName
          description: service.description || "",
          // rate: service.rate ? `$${rate.toFixed(2)} ` : '$0.00',
          rate: `$${rate.toFixed(2)}`,
          qty: "1", // Default quantity is 1
          amount: `$${rate.toFixed(2)}`,
          // amount: service.rate ? `$${service.rate.toFixed(2)}` : '$0.00', // Assuming amount is calculated as rate
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
  const [selectedservice, setselectedService] = useState();
  const handleServiceChange = (index, selectedOptions) => {
    const newRows = [...rows];
    newRows[index].productName = selectedOptions ? selectedOptions.label : "";
    setRows(newRows);
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
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

 const [paymentMode, setPaymentMode] = useState({
   value: "Bank Debits", 
   label: "Bank Debits"
 });
  const paymentsOptions = [
    { value: "Bank Debits", label: "Bank Debits" },
    { value: "Credit Card", label: "Credit Card" },
    {
      value: "Credit Card or Bank Debits",
      label: "Credit Card or Bank Debits",
    },
  ];
  const handlePaymentOptionChange = (event, selectedOption) => {
    setPaymentMode(selectedOption);
  };

  //****************Accounts */
  const [accountdata, setaccountdata] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState();

  const handleAccountChange = (event, newValue) => {
    setSelectedaccount(newValue);
  };

  // useEffect(() => {
  //   fetchAccountData();
  // }, []);

  // const fetchAccountData = async () => {
  //   try {
  //     // const response = await fetch(
  //     //   `${ACCOUNT_API}/accounts/account/accountdetailslist/true`
  //     // );
  //     const url = "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
  //         const response = await fetch(url);
  //     const data = await response.json();
  //     setaccountdata(data.accounts);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // console.log(userdata);
  // const accountoptions = accountdata.map((account) => ({
  //   value: account._id,
  //   label: account.accountName,
  // }));
useEffect(() => {
  fetchAccountData();
}, []);

const fetchAccountData = async () => {
  try {
    const storedUserRole = localStorage.getItem("userRole");
    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    const loginuserid = storedData?.teammember?.userid;
    const viewAllAccounts = storedData?.teammember?.viewallAccounts;

    let url = "";

    // === ROLE-BASED URL LOGIC ===
    if (storedUserRole === "Admin") {
      url =
        "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
    } else {
      // Team Member
      url =
        viewAllAccounts === true
          ? "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
          : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=true`;
    }

    console.log("Fetching accounts from:", url);

    const response = await fetch(url);
    const data = await response.json();

    // Handle both response formats (Admin & TeamMember)
    const accounts = Array.isArray(data.accountlist)
      ? data.accountlist
      : Array.isArray(data.teamAccounts)
      ? data.teamAccounts
      : [];

    console.log("Account list:", accounts);

    setaccountdata(accounts);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Convert to dropdown options
const accountoptions = accountdata.map((account) => ({
  value: account._id,
  label: account.accountName,
}));
  // team member
  const USER_API = process.env.REACT_APP_USER_URL;
  const [selecteduser, setSelectedUser] = useState("");

  const [userData, setUserData] = useState([]);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const { logindata } = useContext(LoginContext);
   console.log("logindata", logindata);
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
       setDefaultTeamMember(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
// Function to set default team member based on logged-in user
const setDefaultTeamMember = (users) => {
  if (logindata && logindata.user && logindata.user.id && Array.isArray(users)) {
    // Find the user in the users array that matches the logged-in user ID
    const currentUser = users.find(user => user._id === logindata.user.id);
    
    if (currentUser) {
      const userOption = {
        value: currentUser._id,
        label: currentUser.username
      };
      setSelectedUser(userOption);
      console.log('Default team member set to logged-in user:', userOption);
    } else {
      console.log('Logged in user not found in team members list');
      console.log('Looking for ID:', logindata.user.id);
      console.log('Available users:', users.map(u => ({ id: u._id, username: u.username })));
    }
  } else {
    console.log('No logged in user data available');
  }
};
  const handleuserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
  };
  const useroptions = userData.map((user) => ({
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
        console.log(result.invoiceTemplate);
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
        const rate = service.rate
          ? parseFloat(service.rate.replace("$", ""))
          : 0;
        const lineitems = result.invoiceTemplate.lineItems.map((item) => ({
          productName: item.productorService || "",
          description: item.description || "",
          rate: `$${parseFloat(item.rate || "0.00").toFixed(2)}`,
          //   rate: String(item.rate || "$0.00"), // Convert rate to string
          qty: String(item.quantity || "1"), // Convert qty to string
          //   amount: String(item.amount || "$0.00"), // Convert amount to string
          amount: `$${parseFloat(item.amount || "0.00").toFixed(2)}`,
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
   const [startDate, setStartDate] = useState(dayjs());
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
  // }, [rows, taxRate]);

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
      // scheduleinvoicedate:
      //   "Wed May 08 2024 00:00:00 GMT+0530 (India Standard Time)",
      // scheduleinvoicetime: "12.00",
      scheduleinvoicedate: new Date(), // Current date and time
      scheduleinvoicetime: new Date().toLocaleTimeString("en-US", {
        hour12: false,
      }),
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
      paidAmount: "0",
      invoiceStatus: "Pending",
      balanceDueAmount: "",
    });

    // console.log(raw)
    // console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${INVOICE_NEW}/workflow/invoices/invoice`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result && result.message === "Invoice created successfully") {
          toast.success("Invoice created successfully");
          handleClose();
          fetchInvoiceData();
        } else {
          toast.error(result.message || "Failed to create InvoiceTemplate");
        }
      })
      .catch((error) => console.error(error));
  };

  const [billingInvoice, setBillingInvoice] = useState([]);
    const handleAccountDash = (_id, data) => {
    navigate(`/clients/accounts/accountsdash/overview/${data}`);
  };

  // Overdue detection helper
  const isInvoiceOverdue = (invoice, paymentTermDays = 5) => {
    if (!invoice.invoicedate || invoice.invoiceStatus === "Paid") return false;

    const invoiceDate = new Date(invoice.invoicedate);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + paymentTermDays);
    
    const today = new Date();
    const isUnpaid = invoice.invoiceStatus === "Pending";
    const hasBalanceDue = invoice.balanceDueAmount === null || invoice.balanceDueAmount > 0;
    
    return today > dueDate && isUnpaid && hasBalanceDue;
  };
  // const fetchInvoiceData = async () => {
  //   try {
  //     const url = `${INVOICE_NEW}/workflow/invoices/invoice`;
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch email templates");
  //     }
  //     const data = await response.json();

  //     // setBillingInvoice(data.invoice);
  //      if (data.invoice) {
  //     const updatedInvoices = await Promise.all(
  //       data.invoice.map(async (invoice) => {
  //         if (isInvoiceOverdue(invoice)) {
  //           await fetch(
  //             `${INVOICE_NEW}/workflow/invoices/invoicestatus/${invoice.invoicenumber}`,
  //             {
  //               method: "PATCH",
  //               headers: { "Content-Type": "application/json" },
  //               body: JSON.stringify({ invoiceStatus: "Overdue" }),
  //             }
  //           );
  //           return { ...invoice, invoiceStatus: "Overdue" };
  //         }
  //         return invoice;
  //       })
  //     );
  //     setBillingInvoice(updatedInvoices);
  //   }
  //   } catch (error) {
  //     console.error("Error fetching email templates:", error);
  //   }
  // };
  const [filterStatus, setFilterStatus] = useState("active"); // active | archived


const fetchInvoiceData = async () => {
  try {
    // ✅ Step 1: Get active accounts
    const accountsResponse = await axios.get(
`https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`    );

    const accountsData = accountsResponse.data.accountlist || [];
    if (!accountsData.length) {
      console.log("No active accounts found");
      return;
    }

    // ✅ Step 2: Prepare accountIds string
    const accountIds = accountsData.map((account) => account._id).join(",");
    console.log("Active Account IDs:", accountIds);

    // ✅ Step 3: Fetch invoices for these accounts
    const url = `${INVOICE_NEW}/workflow/invoices/invoice/invoicelistby/accountid/${accountIds}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch invoices");
    }

    const data = await response.json();

    if (data.invoice) {
      // ✅ Step 4: Check overdue status & update
      const updatedInvoices = await Promise.all(
        data.invoice.map(async (invoice) => {
          if (isInvoiceOverdue(invoice)) {
            await fetch(
              `${INVOICE_NEW}/workflow/invoices/invoicestatus/${invoice.invoicenumber}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ invoiceStatus: "Overdue" }),
              }
            );
            return { ...invoice, invoiceStatus: "Overdue" };
          }
          return invoice;
        })
      );

      setBillingInvoice(updatedInvoices);
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
};

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  //  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for menu
  // const [selectedJobId, setSelectedJobId] = useState(null); // Store selected Job ID
  const handleSettingsClick = (event, invoiceId) => {
    setAnchorEl(event.currentTarget); // Open the menu
    setTempIdGet(invoiceId); // Store the selected job ID
  };
  const handleCloseMenu = () => {
    setAnchorEl(null); // Close the menu
  };
  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };
  // tempIdget
  const handleEdit = (_id) => {
    navigate("Updateinvoice/" + _id);
  };

  // const columns = useMemo(
  //   () => [
  //     {
  //       accessorKey: "invoicenumber",
  //       header: "Invoice Number",
  //       Cell: ({ row }) => (
  //         <Typography
  //           sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }}
  //           onClick={() => handleEdit(row.original._id)}
  //         >
  //           {row.original.invoicenumber}
  //         </Typography>
  //       ),
  //     },

  //     {
  //       accessorKey: "Setting",
  //       header: "Setting",
  //       Cell: ({ row }) => (
  //         <IconButton
  //           onClick={() => toggleMenu(row.original._id)}
  //           style={{ color: "#2c59fa" }}
  //         >
  //           <CiMenuKebab style={{ fontSize: "25px" }} />
  //           {openMenuId === row.original._id && (
  //             <Box
  //               sx={{
  //                 position: "absolute",
  //                 zIndex: 1,
  //                 backgroundColor: "#fff",
  //                 boxShadow: 1,
  //                 borderRadius: 1,
  //                 p: 1,
  //                 left: "30px",
  //                 m: 2,
  //               }}
  //             >
  //               <Typography
  //                 sx={{ fontSize: "12px", fontWeight: "bold" }}
  //                 onClick={() => handleEdit(row.original._id)}
  //               >
  //                 Edit
  //               </Typography>
  //               <Typography
  //                 sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }}
  //                 onClick={() => handleDelete(row.original._id)}
  //               >
  //                 Delete
  //               </Typography>
  //             </Box>
  //           )}
  //         </IconButton>
  //       ),
  //     },
  //   ],
  //   [openMenuId]
  // );

  // const table = useMaterialReactTable({
  //   columns,
  //   data: billingInvoice,
  //   enableBottomToolbar: true,
  //   enableStickyHeader: true,
  //   columnFilterDisplayMode: "custom", // Render own filtering UI
  //   enableRowSelection: true, // Enable row selection
  //   enablePagination: true,
  //   muiTableContainerProps: { sx: { maxHeight: "400px" } },
  //   initialState: {
  //     columnPinning: {
  //       left: ["mrt-row-select", "tagName"],
  //       right: ["settings"],
  //     },
  //   },
  //   muiTableBodyCellProps: {
  //     sx: (theme) => ({
  //       backgroundColor:
  //         theme.palette.mode === "dark-theme"
  //           ? theme.palette.grey[900]
  //           : theme.palette.grey[50],
  //     }),
  //   },
  // });

  const handleDelete = (_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice? This action cannot be undone."
    );
    if (!confirmDelete) return;
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };
    const url = `${INVOICE_NEW}/workflow/invoices/invoice/`;
    fetch(url + _id, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete item");
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Data deleted successfully");
        fetchInvoiceData();
      })
      .catch((error) => {
        console.error(error);
      });
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
  const options = [
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

  const [firstContactEmail, setFirstContactEmail] = useState("");

  const contactMail = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    console.log("Calling API with ID:", selectedaccount?.value); // Debug log

    fetch(
      `${CONTACT_API}/accounts/accountdetails/accountdetailslist/listbyid/${selectedaccount?.value}`,
      requestOptions
    )
      .then((response) => {
        console.log("Response status:", response.status); // Debug log
        return response.json();
      })
      .then((result) => {
        console.log("API Result:", result); // Debug log

        if (
          result?.accountlist?.Contacts &&
          Array.isArray(result.accountlist.Contacts)
        ) {
          const email = result.accountlist.Contacts[0]?.email;
          if (email) {
            console.log("First Contact Email:", email); // Debug log
            setFirstContactEmail(email); // Update state
          } else {
            console.error("First contact does not have an email.");
            setFirstContactEmail("[CONTACT EMAIL]"); // Handle missing email
          }
        } else {
          console.error("No contacts found in the response.");
          setFirstContactEmail("[CONTACT EMAIL]"); // Handle missing contacts
        }
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setFirstContactEmail("Error fetching email"); // Handle fetch error
      });
  };

  useEffect(() => {
    if (selectedaccount?.value) {
      contactMail();
    }
  }, [selectedaccount]);
  //preview drawer
  const [previewDrawerOpen, setpreviewDrawerOpen] = useState(false);
  const handleOpenpreviewDrawer = () => setpreviewDrawerOpen(true);
  const handleClosepreviewDrawer = () => setpreviewDrawerOpen(false);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Invoices</h1>
        <Button
          type="button"
          onClick={handleOpen}
          className="rounded-full px-5
          bg-primary text-white hover:bg-primary/90"
        >
          Create Invoice
        </Button>
      </div>

      {/* Invoices Table */}
      <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/40">
              {["Client", "Invoice #", "Status", "Posted", "Total", "Amount Paid", "Balance Due", "Last Paid", "Description", "Settings"].map((h) => (
                <th key={h} className="text-xs font-semibold text-left px-4 py-3 text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {billingInvoice.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-12 text-sm text-muted-foreground">No invoices found.</td></tr>
            ) : billingInvoice.map((row) => (
              <tr key={row._id} className="border-b hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="text-sm text-primary cursor-pointer hover:underline font-medium" onClick={() => handleAccountDash(row._id, row.account._id)}>
                    {row.account.accountName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-primary cursor-pointer hover:underline font-medium" onClick={() => handleEdit(row._id)}>
                    {row.invoicenumber}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    row.invoiceStatus === "Paid" ? "bg-success/10 text-success border-success/20" :
                    row.invoiceStatus === "Overdue" ? "bg-destructive/10 text-destructive border-destructive/20" :
                    "bg-warning/10 text-warning border-warning/20"
                  }`}>{row.invoiceStatus}</span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(row.createdAt))}
                </td>
                <td className="px-4 py-3 text-sm font-medium">${row.summary.total}</td>
                <td className="px-4 py-3 text-sm">${row.paidAmount}</td>
                <td className="px-4 py-3 text-sm">${row.summary.total - row.paidAmount}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{row.lastPaid || "—"}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{row.description}</td>
                <td className="px-4 py-3 relative">
                  <button onClick={() => toggleMenu(row._id)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {openMenuId === row._id && (
                    <div className="absolute right-6 top-8 z-50 min-w-[120px] bg-background border rounded-lg shadow-lg py-1">
                      <button className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted transition-colors" onClick={() => handleEdit(row._id)}>Edit</button>
                      <button className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors" onClick={() => handleDelete(row._id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Invoice Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={handleClose} />
          <div className="ml-auto relative z-50 w-full max-w-[60%] bg-background h-full flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Create Invoice</h2>
              <div className="flex items-center gap-3">
                <button onClick={handleOpenpreviewDrawer} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
                  <FileText className="h-4 w-4" /> Preview
                </button>
                <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 create-invoice">
              {/* Row 1: Account + Invoice Template */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Account name, ID or email</label>
                  <select
                    value={selectedaccount?.value || ""}
                    onChange={(e) => {
                      const found = accountoptions.find(o => o.value === e.target.value);
                      handleAccountChange(null, found || null);
                    }}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select Account</option>
                    {accountoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Invoice Template</label>
                  <select
                    value={selectInvoiceTemp?.value || ""}
                    onChange={(e) => {
                      const found = invoiceoptions.find(o => o.value === e.target.value);
                      if (found) handleInvoiceTempChange(null, found);
                    }}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Invoice Template</option>
                    {invoiceoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 2: Invoice Number + Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Invoice Number</label>
                  <input
                    type="text"
                    value={isLoadingInvoiceNumber ? "Loading..." : invoicenumber}
                    readOnly
                    disabled={isLoadingInvoiceNumber}
                    className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground focus:outline-none"
                  />
                  <p className="text-xs text-muted-foreground">Auto-generated invoice number</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Payment Method</label>
                  <select
                    value={paymentMode?.value || ""}
                    onChange={(e) => {
                      const found = paymentsOptions.find(o => o.value === e.target.value);
                      handlePaymentOptionChange(null, found || null);
                    }}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select Payment Mode</option>
                    {paymentsOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 3: Date + Team Member */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Date</label>
                  <input
                    type="date"
                    value={startDate ? startDate.format("YYYY-MM-DD") : ""}
                    onChange={(e) => handleStartDateChange(dayjs(e.target.value))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Team Member</label>
                  <select
                    value={selecteduser?.value || ""}
                    onChange={(e) => {
                      const found = useroptions.find(o => o.value === e.target.value);
                      handleuserChange(null, found || null);
                    }}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select Team Member</option>
                    {useroptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 relative">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={description}
                  onChange={handleChange}
                  placeholder="Description"
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">{charCount}/{charLimit}</span>
              </div>

              {/* Shortcode */}
              <div className="relative">
                <Button
                  onClick={toggleDropdown}
                  variant="outline"
                  className="rounded-full px-4 text-sm"
                >
                  Add Shortcode
                </Button>
                {showDropdown && (
                  <div className="absolute left-0 top-10 z-50 w-72 max-h-72 overflow-y-auto bg-background border rounded-lg shadow-lg py-1">
                    {filteredShortcuts.map((shortcut, index) => (
                      <button
                        key={index}
                        className={`w-full text-left px-4 py-1.5 text-sm hover:bg-muted transition-colors ${shortcut.isBold ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                        onClick={() => shortcut.value && handleAddShortcut(shortcut.value)}
                      >
                        {shortcut.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">Additional</h3>
                {[
                  { label: "Pay invoice using client credits", checked: payInvoice, onChange: handlePayInvoiceChange },
                  { label: "Email invoice to client", checked: emailInvoice, onChange: handleEmailInvoiceChange },
                  { label: "Reminders", checked: reminders, onChange: handleRemindersChange },
                  { label: "Scheduled invoice", checked: scheduledInvoice, onChange: handleScheduledInvoiceChange },
                ].map(({ label, checked, onChange }) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer">
                    <Switch checked={checked} onCheckedChange={(val) => onChange({ target: { checked: val } })} />
                    <span className="text-sm text-foreground">{label}</span>
                  </label>
                ))}
              </div>

              {/* Line Items */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Line Items</h3>
                  <p className="text-sm text-muted-foreground">Client-facing itemized list of products and services</p>
                </div>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        {["Product / Service", "Description", "Rate", "Qty", "Amount", "Tax", "Actions"].map(h => (
                          <th key={h} className="text-xs font-semibold text-left px-3 py-2.5 text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index} className="border-b hover:bg-muted/20 transition-colors">
                          <td className="px-3 py-2">
                            <CreatableSelect
                              placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
                              options={serviceoptions}
                              value={row.productName ? serviceoptions.find(o => o.label === row.productName) || { label: row.productName, value: row.productName } : null}
                              onChange={(sel) => handleServiceChange(index, sel)}
                              onInputChange={(val, meta) => handleServiceInputChange(val, meta, index)}
                              isClearable
                              styles={{
                                container: (p) => ({ ...p, minWidth: "160px" }),
                                control: (p) => ({ ...p, minWidth: "160px", fontSize: "13px" }),
                                menuPortal: (p) => ({ ...p, zIndex: 9999 }),
                              }}
                              menuPortalTarget={document.body}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" name="description" value={row.description} onChange={(e) => handleInputChange(index, e)} placeholder="Description" className="w-full border-0 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" name="rate" value={row.rate} onChange={(e) => handleInputChange(index, e)} className="w-20 border-0 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" name="qty" value={row.qty} onChange={(e) => handleInputChange(index, e)} className="w-14 border-0 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" />
                          </td>
                          <td className="px-3 py-2 text-sm font-medium">{row.amount}</td>
                          <td className="px-3 py-2">
                            <input type="checkbox" name="tax" checked={row.tax} onChange={(e) => handleInputChange(index, e)} className="w-4 h-4 accent-primary" />
                          </td>
                          <td className="px-3 py-2">
                            <div className="relative">
                              <button onClick={(e) => handleMenuOpen(e, index)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                              {Boolean(anchorElNew) && selectedRow === index && (
                                <div className="absolute right-0 top-7 z-50 min-w-[160px] bg-background border rounded-lg shadow-lg py-1">
                                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => handleEditService(row, index)}>Edit</button>
                                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={handleDeleteService}>Delete</button>
                                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => handleSaveAsNewService(row)}>Save as new service</button>
                                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={handleDuplicate}>Duplicate</button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add row buttons */}
                <div className="flex items-center gap-5">
                  <button onClick={() => addRow()} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
                    <Plus className="h-4 w-4" /> Line item
                  </button>
                  <button onClick={() => addRow(true)} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
                    <Percent className="h-4 w-4" /> Discount
                  </button>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">Summary</h3>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/40">
                          {["Subtotal", "Tax Rate", "Tax Total", "Total"].map(h => (
                            <th key={h} className="text-xs font-semibold text-left px-4 py-2.5 text-muted-foreground uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 text-sm">
                            <span className="mr-1 text-muted-foreground">$</span>
                            <input type="number" value={subtotal} onChange={handleSubtotalChange} className="w-20 border-0 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" />
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <input type="number" value={taxRate} onChange={handleTaxRateChange} className="w-16 border-0 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" />
                            <span className="ml-1 text-muted-foreground">%</span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">${taxTotal.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm font-bold">${totalAmount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="flex items-center gap-3 px-5 py-4 border-t border-border">
              <Button onClick={createinvoice} className="rounded-full px-5 bg-primary text-white hover:bg-primary/90">Save</Button>
              <Button onClick={handleClose} variant="outline" className="rounded-full px-5">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Drawer */}
      {previewDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="fixed inset-0 bg-black/40" onClick={handleClosepreviewDrawer} />
          <div className="ml-auto relative z-[61] w-full max-w-[800px] bg-background h-full flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold">Preview</h2>
              <button onClick={handleClosepreviewDrawer} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-primary">Invoice</h2>
              <div className="flex items-center justify-between">
                <span className="text-sm">{selectedaccount?.label || "[ACCOUNT NAME]"}</span>
                <span className="text-sm text-muted-foreground">Invoice number: <span className="text-foreground font-medium">{invoicenumber || "[INVOICE_NUMBER]"}</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{firstContactEmail || "[CONTACT EMAIL]"}</span>
                <span className="text-sm text-muted-foreground">Date: <span className="text-foreground font-medium">{startDate ? startDate.format("YYYY-MM-DD") : ""}</span></span>
              </div>
              <p className="text-sm text-muted-foreground">Description: {description}</p>
              <div className="rounded-xl border border-border overflow-hidden mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted">
                      {["Product/Service", "Description", "Rate ($)", "Qty", "Amount"].map(h => (
                        <th key={h} className="text-xs font-semibold text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className="border-b hover:bg-muted/20">
                        <td className="px-4 py-2.5 text-sm">{row.productName}</td>
                        <td className="px-4 py-2.5 text-sm">{row.description}</td>
                        <td className="px-4 py-2.5 text-sm text-right">{row.rate || "$0.00"}</td>
                        <td className="px-4 py-2.5 text-sm text-right">{row.qty || "1"}</td>
                        <td className="px-4 py-2.5 text-sm text-right">{row.amount || "$0.00"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end pt-2">
                <div className="space-y-1 text-sm text-right">
                  <div className="flex justify-between gap-8"><span className="text-muted-foreground">Subtotal</span><span>${subtotal}</span></div>
                  <div className="flex justify-between gap-8"><span className="text-muted-foreground">Tax ({taxRate}%)</span><span>${taxTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between gap-8 font-bold text-base"><span>Total</span><span>${totalAmount}</span></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-border">
              <Button onClick={createinvoice} className="rounded-full px-5 bg-primary text-white hover:bg-primary/90">Save &amp; Exit</Button>
            </div>
          </div>
        </div>
      )}

      {/* Save as New Service Drawer */}
      {isNewDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="fixed inset-0 bg-black/40" onClick={handleNewDrawerClose} />
          <div className="ml-auto relative z-[61] w-full max-w-[650px] bg-background h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-lg font-semibold">Create Service</h2>
              <button onClick={handleNewDrawerClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Service Name</label>
                <input type="text" placeholder="Service Name" value={selectedRowData?.productName || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea placeholder="Description" value={selectedRowData?.description || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Rate</label>
                  <input type="text" placeholder="Rate" value={selectedRowData?.rate || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Rate Type</label>
                  <select value={selectedRateOption?.value || ""} onChange={(e) => { const found = options.find(o => o.value === e.target.value); setSelectedRateOption(found || null); }} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select Rate Type</option>
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <Switch checked={selectedRowData?.tax || false} onCheckedChange={(val) => handleServiceSwitch(val)} />
                <span className="text-sm text-foreground">Tax</span>
              </label>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">Category</h3>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Category Name</label>
                  <select value={selectedCategory?.value || ""} onChange={(e) => { const found = categoryoptions.find(o => o.value === e.target.value); handleCategoryChange(null, found || null); }} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select Category</option>
                    {categoryoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <Button onClick={() => setCategoryFormOpen(true)} variant="outline" className="rounded-full px-4 text-sm">Create Category</Button>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-4 border-t border-border">
              <Button onClick={createservicetemp} className="rounded-full px-5 bg-primary text-white hover:bg-primary/90">Save</Button>
              <Button onClick={handleNewDrawerClose} variant="outline" className="rounded-full px-5">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Category Form Drawer */}
      {isCategoryFormOpen && (
        <div className="fixed inset-0 z-[70] flex">
          <div className="fixed inset-0 bg-black/40" onClick={handleCategoryFormClose} />
          <div className="ml-auto relative z-[71] w-full max-w-[650px] bg-background h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <button onClick={handleCategoryFormClose} className="text-muted-foreground hover:text-foreground"><ChevronLeft className="h-5 w-5" /></button>
              <h2 className="text-lg font-semibold">Create Category</h2>
              <div className="w-5" />
            </div>
            <div className="flex-1 p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Category Name</label>
                <input type="text" placeholder="Category Name" value={categorycreate || ""} onChange={(e) => setcategorycreate(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-4 border-t border-border">
              <Button onClick={createCategory} className="rounded-full px-5 bg-primary text-white hover:bg-primary/90">Create</Button>
              <Button onClick={handleCategoryFormClose} variant="outline" className="rounded-full px-5">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Line Item Drawer */}
      {isEditDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="fixed inset-0 bg-black/40" onClick={handleEditDrawerClose} />
          <div className="ml-auto relative z-[61] w-full max-w-[650px] bg-background h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-lg font-semibold">Edit Item</h2>
              <button onClick={handleEditDrawerClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Product or Service</label>
                <input type="text" value={selectedRowData?.productName || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea value={selectedRowData?.description || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Rate</label>
                  <input type="text" value={selectedRowData?.rate || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Qty</label>
                  <input type="text" value={selectedRowData?.qty || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, qty: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Amount</label>
                  <input type="text" value={totalamount} disabled className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <Switch checked={selectedRowData?.tax || false} onCheckedChange={(val) => handleServiceWitch(val)} />
                <span className="text-sm text-foreground">Tax</span>
              </label>
            </div>
            <div className="flex items-center gap-3 px-5 py-4 border-t border-border">
              <Button onClick={handleSaveChanges} className="rounded-full px-5 bg-primary text-white hover:bg-primary/90">Save</Button>
              <Button onClick={handleEditDrawerClose} variant="outline" className="rounded-full px-5">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;

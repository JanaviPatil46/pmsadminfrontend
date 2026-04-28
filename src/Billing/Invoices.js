import React, { useState, useEffect, useMemo } from "react";
import { MoreHorizontal, X, ChevronLeft, FileText, Plus, Percent, Pencil, Trash2, ChevronsUpDown, Check, Copy, Save, Trash } from "lucide-react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Input } from "../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { SideSheet } from "../components/ui/side-sheet";
import { DataTable } from "../components/data-table/data-table";
import { DataTableToolbar } from "../components/data-table/toolbar";
import { toast } from "react-toastify";
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
  const [openComboboxIndex, setOpenComboboxIndex] = useState(null);
  const [comboboxSearch, setComboboxSearch] = useState({});

  const handleComboboxOpen = (index, isOpen) => {
    setOpenComboboxIndex(isOpen ? index : null);
    if (isOpen) {
      setComboboxSearch((prev) => ({ ...prev, [index]: rows[index]?.productName || "" }));
    }
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

  const STATUS_CLASSES = {
    Paid: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
    Overdue: "bg-destructive/10 text-destructive border-destructive/20",
    Pending: "bg-amber-500/15 text-amber-700 border-amber-500/20",
  };

  const invoiceColumns = useMemo(() => [
    {
      accessorKey: "account",
      header: "Client",
      size: 160,
      cell: ({ getValue }) => {
        const acc = getValue();
        return (
          <button
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors text-left truncate max-w-[150px] block"
            onClick={() => handleAccountDash(null, acc?._id)}
          >
            {acc?.accountName || "—"}
          </button>
        );
      },
    },
    {
      accessorKey: "invoicenumber",
      header: "Invoice #",
      size: 120,
      cell: ({ getValue, row }) => (
        <button
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          onClick={() => handleEdit(row.original._id)}
        >
          {getValue() || "—"}
        </button>
      ),
    },
    {
      accessorKey: "invoiceStatus",
      header: "Status",
      size: 100,
      cell: ({ getValue }) => {
        const status = getValue();
        const cls = STATUS_CLASSES[status] || "bg-muted text-muted-foreground border-border";
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>
            {status || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Posted",
      size: 100,
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground">
          {getValue() ? new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).format(new Date(getValue())) : "—"}
        </span>
      ),
    },
    {
      accessorKey: "summary",
      id: "total",
      header: "Total",
      size: 90,
      cell: ({ getValue }) => (
        <span className="text-sm font-medium">${getValue()?.total ?? "—"}</span>
      ),
    },
    {
      accessorKey: "paidAmount",
      header: "Amount Paid",
      size: 110,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">${getValue() ?? "—"}</span>,
    },
    {
      id: "balanceDue",
      header: "Balance Due",
      size: 110,
      enableSorting: false,
      cell: ({ row }) => {
        const total = row.original.summary?.total ?? 0;
        const paid = row.original.paidAmount ?? 0;
        return <span className="text-xs text-muted-foreground">${(total - paid).toFixed ? (total - paid).toFixed(2) : total - paid}</span>;
      },
    },
    {
      accessorKey: "lastPaid",
      header: "Last Paid",
      size: 100,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() || "—"}</span>,
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 180,
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground truncate block max-w-[170px]">{getValue() || "—"}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => handleEdit(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], []);

  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Invoices</h1>
        <Button size="sm" onClick={handleOpen}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Invoice
        </Button>
      </div>

      {/* Invoices DataTable */}
      <div className="space-y-3">
        <DataTableToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
        />
        <DataTable
          columns={invoiceColumns}
          data={billingInvoice}
          loading={false}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          enableRowSelection={false}
          getRowId={(row) => row._id}
          emptyMessage="No invoices found"
          emptyDescription="Create your first invoice to get started"
          pageSize={25}
        />
      </div>

      {/* Create Invoice Drawer */}
      <SideSheet
        open={open}
        onOpenChange={(o) => !o && handleClose()}
        title="Create Invoice"
        size="xl"
        hideDefaultFooter
        footer={
          <div className="flex items-center gap-2">
            <button onClick={handleOpenpreviewDrawer} className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors mr-2">
              <FileText className="h-4 w-4" /> Preview
            </button>
            <Button variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
            <Button size="sm" onClick={createinvoice}>Save</Button>
          </div>
        }
      >
            <div className="space-y-5">
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
                          <td className="px-3 py-2 min-w-[180px]">
                            <Popover open={openComboboxIndex === index} onOpenChange={(open) => handleComboboxOpen(index, open)}>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className="flex w-full min-w-[160px] items-center justify-between rounded-md border border-input bg-background px-2.5 py-1.5 text-sm text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                >
                                  <span className={row.productName ? "text-foreground truncate" : "text-muted-foreground"}>
                                    {row.productName || (row.isDiscount ? "Reason for discount" : "Product or Service")}
                                  </span>
                                  <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 p-0" align="start">
                                <div className="p-2 border-b border-border">
                                  <Input
                                    autoFocus
                                    placeholder="Search or type new..."
                                    value={comboboxSearch[index] ?? ""}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setComboboxSearch((prev) => ({ ...prev, [index]: val }));
                                      handleServiceInputChange(val, { action: "input-change" }, index);
                                    }}
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div className="max-h-52 overflow-y-auto py-1">
                                  {serviceoptions
                                    .filter((o) =>
                                      o.label.toLowerCase().includes((comboboxSearch[index] ?? "").toLowerCase())
                                    )
                                    .map((opt) => (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted transition-colors text-left"
                                        onClick={() => {
                                          handleServiceChange(index, opt);
                                          setOpenComboboxIndex(null);
                                        }}
                                      >
                                        <Check className={`h-3.5 w-3.5 shrink-0 ${row.productName === opt.label ? "opacity-100 text-primary" : "opacity-0"}`} />
                                        {opt.label}
                                      </button>
                                    ))}
                                  {comboboxSearch[index] &&
                                    !serviceoptions.some((o) => o.label.toLowerCase() === (comboboxSearch[index] ?? "").toLowerCase()) && (
                                      <button
                                        type="button"
                                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted transition-colors text-left text-primary"
                                        onClick={() => {
                                          handleServiceChange(index, { value: comboboxSearch[index], label: comboboxSearch[index] });
                                          setOpenComboboxIndex(null);
                                        }}
                                      >
                                        <Plus className="h-3.5 w-3.5 shrink-0" />
                                        Create "{comboboxSearch[index]}"
                                      </button>
                                    )}
                                  {serviceoptions.filter((o) =>
                                    o.label.toLowerCase().includes((comboboxSearch[index] ?? "").toLowerCase())
                                  ).length === 0 && !comboboxSearch[index] && (
                                    <p className="px-3 py-2 text-xs text-muted-foreground">No services found</p>
                                  )}
                                </div>
                                {row.productName && (
                                  <div className="border-t border-border p-2">
                                    <button
                                      type="button"
                                      className="flex w-full items-center gap-2 px-2 py-1 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                                      onClick={() => {
                                        handleServiceChange(index, { value: "", label: "" });
                                        setOpenComboboxIndex(null);
                                      }}
                                    >
                                      <X className="h-3 w-3" /> Clear
                                    </button>
                                  </div>
                                )}
                              </PopoverContent>
                            </Popover>
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" side="bottom" className="w-44">
                                <DropdownMenuItem onClick={() => handleEditService(row, index)}>
                                  <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDuplicate}>
                                  <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSaveAsNewService(row)}>
                                  <Save className="mr-2 h-3.5 w-3.5" /> Save as new service
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => { setSelectedRow(index); handleDeleteService(); }}
                                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                  <Trash className="mr-2 h-3.5 w-3.5" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                <div className="flex justify-end pt-2">
                  <div className="w-full max-w-xs rounded-xl border border-border bg-muted/30 divide-y divide-border overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-sm text-muted-foreground">Subtotal</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">$</span>
                        <input
                          type="number"
                          value={subtotal}
                          onChange={handleSubtotalChange}
                          className="w-20 bg-transparent text-sm text-right focus:outline-none focus:ring-1 focus:ring-ring rounded px-1"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-sm text-muted-foreground">Tax Rate</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={taxRate}
                          onChange={handleTaxRateChange}
                          className="w-16 bg-transparent text-sm text-right focus:outline-none focus:ring-1 focus:ring-ring rounded px-1"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-sm text-muted-foreground">Tax</span>
                      <span className="text-sm font-medium">${taxTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 bg-muted/60">
                      <span className="text-sm font-semibold text-foreground">Total</span>
                      <span className="text-base font-bold text-foreground">${totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </SideSheet>

      {/* Preview Drawer */}
      <SideSheet
        open={previewDrawerOpen}
        onOpenChange={(o) => !o && handleClosepreviewDrawer()}
        title="Preview"
        size="xl"
        hideDefaultFooter
        footer={
          <Button size="sm" onClick={createinvoice}>Save &amp; Exit</Button>
        }
      >
            <div className="space-y-4">
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
      </SideSheet>

      {/* Save as New Service Drawer */}
      <SideSheet
        open={isNewDrawerOpen}
        onOpenChange={(o) => !o && handleNewDrawerClose()}
        title="Create Service"
        size="lg"
        onCancel={handleNewDrawerClose}
        onConfirm={createservicetemp}
        confirmLabel="Save"
      >
            <div className="space-y-4">
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
      </SideSheet>

      {/* Category Form Drawer */}
      <SideSheet
        open={isCategoryFormOpen}
        onOpenChange={(o) => !o && handleCategoryFormClose()}
        title="Create Category"
        size="lg"
        onCancel={handleCategoryFormClose}
        onConfirm={createCategory}
        confirmLabel="Create"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Category Name</label>
            <input type="text" placeholder="Category Name" value={categorycreate || ""} onChange={(e) => setcategorycreate(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </SideSheet>

      {/* Edit Line Item Drawer */}
      <SideSheet
        open={isEditDrawerOpen}
        onOpenChange={(o) => !o && handleEditDrawerClose()}
        title="Edit Item"
        size="lg"
        onCancel={handleEditDrawerClose}
        onConfirm={handleSaveChanges}
        confirmLabel="Save"
      >
            <div className="space-y-4">
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
      </SideSheet>
    </div>
  );
};

export default Invoices;

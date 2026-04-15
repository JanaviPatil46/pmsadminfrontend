import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../Sidebar/Context/Context";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { MdOutlinePreview } from "react-icons/md";
import { X, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import CreatableSelect from "react-select/creatable";
import { useParams } from "react-router-dom";
const CreateInvoice = ({ charLimit = 4000, onClose }) => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
 
  const { data } = useParams();
  //   const navigate = useNavigate();
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState(null);
  const [accountdata, setaccountdata] = useState([]);
  const [description, setDescription] = useState("");
  const [payInvoice, setIsPayInvoice] = useState(false);
  const [emailInvoice, setIsEmailInvoice] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [scheduledInvoice, setScheduledInvoice] = useState(false);
  const [charCount, setCharCount] = useState(0);
   const [invoicenumber, setinvoicenumber] = useState("");
  const [isLoadingInvoiceNumber, setIsLoadingInvoiceNumber] = useState(true);
  // const [paymentMode, setPaymentMode] = useState("");
  const [paymentMode, setPaymentMode] = useState({
  value: "Bank Debits", 
  label: "Bank Debits"
});
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");

  useEffect(() => {
    fetchAccountData();
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
      const accdata = await response.json();

      // Handle both response formats (Admin & TeamMember)
      const accounts = Array.isArray(accdata.accountlist)
        ? accdata.accountlist
        : Array.isArray(accdata.teamAccounts)
          ? accdata.teamAccounts
          : [];

      console.log("Account list:", accounts);

      setaccountdata(accounts);
      const selectedAccount = accounts.find((account) => account._id === data); // Assume data contains the account ID
      console.log("selectedAccount", selectedAccount);

      if (selectedAccount) {
        const account = {
          label: selectedAccount.accountName,
          value: selectedAccount._id,
        };
        console.log(account);
        setSelectedaccount(account);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Convert to dropdown options
  const accountoptions = accountdata.map((account) => ({
    value: account._id,
    label: account.accountName,
  }));
  const handleAccountChange = (event, newValue) => {
    console.log(newValue);
    setSelectedaccount(newValue);
  };

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

  // team member
  const USER_API = process.env.REACT_APP_USER_URL;
  const [selecteduser, setSelectedUser] = useState("");
  const [userData, setUserData] = useState([]);
const { logindata } = useContext(LoginContext);
 console.log("logindata", logindata);
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
       // Set default team member after fetching user data
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
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  useEffect(() => {
    fetchServiceData();
  }, []);

  const [rows, setRows] = useState([]);
  const [servicedata, setServiceData] = useState([]);

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
        const service = Array.isArray(result.serviceTemplate)
          ? result.serviceTemplate[0]
          : result.serviceTemplate;
        const rate = service.rate
          ? parseFloat(service.rate.replace("$", ""))
          : 0;
        const updatedRow = {
          productName: service.serviceName || "",
          description: service.description || "",
          rate: `$${rate.toFixed(2)}`,
          qty: "1",
          amount: `$${rate.toFixed(2)}`,
          tax: service.tax || false,
          isDiscount: false,
        };

        const updatedRows = [...rows];
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updatedRow };
        setRows(updatedRows);
      })
      .catch((error) => console.error(error));
  };
  const handleServiceChange = (index, selectedOptions) => {
    const newRows = [...rows];
    newRows[index].productName = selectedOptions ? selectedOptions.label : "";
    setRows(newRows);
    setselectedService(selectedOptions);
    // fetchservicebyid(selectedOptions.value, index);
    // Call fetch only if an option is actually selected
    if (selectedOptions && selectedOptions.value) {
      fetchservicebyid(selectedOptions.value, index);
    }
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
  const [daysuntilnextreminder, setDaysuntilnextreminder] = useState(3);
  const [numberOfreminder, setNumberOfreminder] = useState(1);
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
        setDaysuntilnextreminder(result.invoiceTemplate.daysuntilnextreminder);
        setNumberOfreminder(result.invoiceTemplate.numberOfreminder);
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

  const [startDate, setStartDate] = useState(dayjs());
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length <= charLimit) {
      setDescription(value);
      setCharCount(value.length);
    }
  };

  const handleAddShortcut = (shortcut) => {
    const updatedTextValue = description + `[${shortcut}]`;
    if (updatedTextValue.length <= charLimit) {
      setDescription(updatedTextValue);
      setCharCount(updatedTextValue.length);
    }
    setShowDropdown(false);
    setAnchorEl(null);
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
    setAnchorEl(null);
       setShowDropdown(false);
  };

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
 
  const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
  const lineItems = rows.map((item) => ({
    productorService: item.productName, // Assuming productName maps to productorService
    description: item.description,
    rate: item.rate.replace("$", ""), // Removing '$' sign from rate
    quantity: item.qty,
    amount: item.amount.replace("$", ""), // Removing '$' sign from amount
    tax: item.tax.toString(), // Converting boolean to string
  }));
  const [errors, setErrors] = useState({
    invoiceTemplate: "",
    lineItems: "",
  });
  const validateInvoice = () => {
    let valid = true;
    let newErrors = { invoiceTemplate: "", lineItems: "" };


    if (!lineItems || lineItems.length === 0) {
      newErrors.lineItems = "At least one line item is required";
      valid = false;
    }

    setErrors(newErrors); // ✅ updates error state (clears if fields are valid)
    return valid;
  };

  const createinvoice = () => {
    if (!validateInvoice()) {
      return; // stop if invalid
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      account: selectedaccount.value,
      invoicenumber: invoicenumber,
      invoicedate: startDate,
      description: description,
      invoicetemplate: selectInvoiceTemp?.value,
      paymentMethod: paymentMode.value,
      teammember: selecteduser.value,
      emailinvoicetoclient: emailInvoice,
      scheduleinvoicedate: new Date(), // Current date and time
      scheduleinvoicetime: new Date().toLocaleTimeString("en-US", {
        hour12: false,
      }),
      payInvoicewithcredits: payInvoice,
      reminders: reminders,
      scheduleinvoice: scheduledInvoice,
      daysuntilnextreminder: daysuntilnextreminder,
      numberOfreminder: numberOfreminder,
      lineItems: lineItems,
      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },
      active: "true",
      paidAmount: 0,
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
          onClose();
          fetchInvoiceData();
        } else {
          toast.error(result.message || "Failed to create InvoiceTemplate");
        }
      })
      .catch((error) => console.error(error));
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
  //preview drawer
  const [previewDrawerOpen, setpreviewDrawerOpen] = useState(false);
  const handleOpenpreviewDrawer = () => setpreviewDrawerOpen(true);
  const handleClosepreviewDrawer = () => setpreviewDrawerOpen(false);

  const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "block text-sm font-medium text-foreground mb-1";
  const btnPrimary = "px-4 py-2 rounded-full text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50";
  const btnOutline = "px-4 py-2 rounded-full text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">Create Invoice</h2>
        <div className="flex items-center gap-3">
          <button onClick={handleOpenpreviewDrawer} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80">
            <MdOutlinePreview className="text-base" /> Preview
          </button>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      {/* Preview Drawer */}
      {previewDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={handleClosepreviewDrawer} />
          <div className="ml-auto relative z-50 w-full max-w-[800px] bg-background h-full overflow-y-auto shadow-2xl p-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-foreground">Preview</h3>
              <button onClick={handleClosepreviewDrawer} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <hr className="border-border mb-6" />
            <h2 className="text-xl font-bold text-primary mb-4">Invoice</h2>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">{selectedaccount?.label || "[ACCOUNT NAME]"}</span>
              <span className="text-sm text-muted-foreground mr-2">Invoice number: <span className="text-foreground">{invoicenumber || "[INVOICE_NUMBER]"}</span></span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">{firstContactEmail || "[CONTACT EMAIL]"}</span>
              <span className="text-sm text-muted-foreground mr-2">Date: <span className="text-foreground">{startDate ? startDate.format("YYYY-MM-DD") : ""}</span></span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Description: {description}</p>
            <div className="overflow-x-auto rounded-lg border border-border mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-2 text-xs font-bold text-foreground">Product/Service</th>
                    <th className="text-left px-4 py-2 text-xs font-bold text-foreground">Description</th>
                    <th className="text-right px-4 py-2 text-xs font-bold text-foreground">Rate ($)</th>
                    <th className="text-right px-4 py-2 text-xs font-bold text-foreground">Qty</th>
                    <th className="text-right px-4 py-2 text-xs font-bold text-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row, index) => (
                    <tr key={index} className={`hover:bg-muted/20 ${index % 2 === 0 ? "bg-card" : "bg-muted/10"}`}>
                      <td className="px-4 py-2 text-sm text-foreground">{row.productName}</td>
                      <td className="px-4 py-2 text-sm text-muted-foreground">{row.description}</td>
                      <td className="px-4 py-2 text-sm text-foreground text-right">{row.rate || "$0.00"}</td>
                      <td className="px-4 py-2 text-sm text-foreground text-right">{row.qty || "1"}</td>
                      <td className="px-4 py-2 text-sm text-foreground text-right">{row.amount || "$0.00"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ml-auto w-full max-w-xs border border-border rounded-lg overflow-hidden mb-6">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  <tr><td className="px-4 py-2 font-semibold text-foreground">Subtotal</td><td className="px-4 py-2 text-right text-foreground">${subtotal || "0.00"}</td></tr>
                  <tr><td className="px-4 py-2 font-semibold text-foreground">Tax Rate</td><td className="px-4 py-2 text-right text-foreground">{taxRate || "0.00"}%</td></tr>
                  <tr><td className="px-4 py-2 font-semibold text-foreground">Tax Total</td><td className="px-4 py-2 text-right text-foreground">${taxTotal?.toFixed(2) || "0.00"}</td></tr>
                  <tr className="bg-muted/30"><td className="px-4 py-2 font-bold text-foreground">Total</td><td className="px-4 py-2 text-right font-bold text-foreground">${totalAmount || "0.00"}</td></tr>
                </tbody>
              </table>
            </div>
            <button onClick={createinvoice} className={btnPrimary}>Save &amp; Exit</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Account name, ID or email</label>
            <select
              className={inputCls}
              value={selectedaccount?.value || ""}
              onChange={(e) => {
                const opt = accountoptions.find(o => o.value === e.target.value);
                handleAccountChange(null, opt || null);
              }}
            >
              <option value="">Select Account</option>
              {accountoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Invoice Template</label>
            <select
              className={inputCls}
              value={selectInvoiceTemp?.value || ""}
              onChange={(e) => {
                const opt = invoiceoptions.find(o => o.value === e.target.value);
                if (opt) handleInvoiceTempChange(null, opt);
              }}
            >
              <option value="">Invoice Template</option>
              {invoiceoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {errors.invoiceTemplate && <p className="text-xs text-destructive mt-1">{errors.invoiceTemplate}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Invoice Number</label>
            <input
              type="text"
              className={`${inputCls} bg-muted/40 cursor-not-allowed`}
              value={isLoadingInvoiceNumber ? "Loading..." : invoicenumber}
              readOnly
              disabled={isLoadingInvoiceNumber}
              placeholder="Invoice Number"
            />
            <p className="text-xs text-muted-foreground mt-1">Auto-generated invoice number</p>
          </div>
          <div>
            <label className={labelCls}>Choose payment method</label>
            <select
              className={inputCls}
              value={paymentMode?.value || ""}
              onChange={(e) => {
                const opt = paymentsOptions.find(o => o.value === e.target.value);
                handlePaymentOptionChange(null, opt || null);
              }}
            >
              <option value="">Select Payment Mode</option>
              {paymentsOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Date</label>
            <input
              type="date"
              className={inputCls}
              value={startDate ? startDate.format("YYYY-MM-DD") : ""}
              onChange={(e) => handleStartDateChange(dayjs(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls}>Team Member</label>
            <select
              className={inputCls}
              value={selecteduser?.value || ""}
              onChange={(e) => {
                const opt = options.find(o => o.value === e.target.value);
                handleuserChange(null, opt || null);
              }}
            >
              <option value="">Team Member</option>
              {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        <div className="relative">
          <label className={labelCls}>Description</label>
          <textarea
            className={`${inputCls} min-h-[80px] resize-none pb-6`}
            value={description}
            onChange={handleChange}
            placeholder="Description"
          />
          <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">{charCount}/{charLimit}</span>
        </div>
        <div className="relative">
          <button onClick={toggleDropdown} className={`${btnPrimary} mt-1`}>Add Shortcode</button>
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-20" onClick={handleCloseDropdown} />
              <div className="absolute z-30 mt-1 w-72 h-72 overflow-y-auto bg-card border border-border rounded-lg shadow-lg">
                {filteredShortcuts.map((shortcut, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddShortcut(shortcut.value)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${shortcut.isBold ? "font-bold text-foreground" : "text-muted-foreground"}`}
                  >
                    {shortcut.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-foreground">Additional</h3>
          {[
            { label: "Pay invoice using client credits", checked: payInvoice, onChange: handlePayInvoiceChange },
            { label: "Email invoice to client", checked: emailInvoice, onChange: handleEmailInvoiceChange },
            { label: "Reminders", checked: reminders, onChange: handleRemindersChange },
            { label: "Scheduled invoice", checked: scheduledInvoice, onChange: handleScheduledInvoiceChange },
          ].map(({ label, checked, onChange }) => (
            <label key={label} className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => onChange({ target: { checked: !checked } })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-1"}`} />
              </div>
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
        </div>

        {/* Line Items */}
        <div>
          <h3 className="text-base font-bold text-foreground">Line Items</h3>
          <p className="text-xs text-muted-foreground mb-3">Client-facing itemized list of products and services</p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-3 py-2 text-xs font-bold text-foreground w-48">Product or Service</th>
                  <th className="text-left px-3 py-2 text-xs font-bold text-foreground">Description</th>
                  <th className="text-left px-3 py-2 text-xs font-bold text-foreground w-24">Rate</th>
                  <th className="text-left px-3 py-2 text-xs font-bold text-foreground w-16">Qty</th>
                  <th className="text-left px-3 py-2 text-xs font-bold text-foreground w-24">Amount</th>
                  <th className="text-center px-3 py-2 text-xs font-bold text-foreground w-12">Tax</th>
                  <th className="w-10" />
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? "bg-card" : "bg-muted/10"} hover:bg-primary/5`}>
                    <td className="px-3 py-2">
                      <CreatableSelect
                        placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
                        options={serviceoptions}
                        value={row.productName ? (serviceoptions.find(o => o.label === row.productName) || { label: row.productName, value: row.productName }) : null}
                        onChange={(sel) => handleServiceChange(index, sel)}
                        onInputChange={(val, meta) => handleServiceInputChange(val, meta, index)}
                        isClearable
                        styles={{ container: (p) => ({ ...p, width: "180px" }), control: (p) => ({ ...p, width: "180px" }), menuPortal: (p) => ({ ...p, zIndex: 9999 }) }}
                        menuPortalTarget={document.body}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input type="text" name="description" value={row.description} onChange={(e) => handleInputChange(index, e)} placeholder="Description" className="w-full bg-transparent text-sm text-foreground outline-none border-b border-border focus:border-primary" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="text" name="rate" value={row.rate} onChange={(e) => handleInputChange(index, e)} className="w-20 bg-transparent text-sm text-foreground outline-none border-b border-border focus:border-primary" />
                    </td>
                    <td className="px-3 py-2">
                      <input type="text" name="qty" value={row.qty} onChange={(e) => handleInputChange(index, e)} className="w-12 bg-transparent text-sm text-foreground outline-none border-b border-border focus:border-primary" />
                    </td>
                    <td className={`px-3 py-2 text-sm text-foreground ${row.isDiscount ? "text-destructive" : ""}`}>{row.amount}</td>
                    <td className="px-3 py-2 text-center">
                      <input type="checkbox" name="tax" checked={row.tax} onChange={(e) => handleInputChange(index, e)} className="accent-primary h-4 w-4 cursor-pointer" />
                    </td>
                    <td className="px-2 py-2 relative">
                      <button onClick={(e) => handleMenuOpen(e, index)} className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <BsThreeDotsVertical className="text-sm" />
                      </button>
                      {Boolean(anchorElNew) && selectedRow === index && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={handleMenuClose} />
                          <div className="absolute right-0 z-40 mt-1 w-40 bg-card border border-border rounded-lg shadow-lg py-1">
                            <button onClick={() => handleEditService(row, index)} className="w-full text-left px-4 py-2 text-xs text-foreground hover:bg-muted">Edit</button>
                            <button onClick={handleDeleteService} className="w-full text-left px-4 py-2 text-xs text-destructive hover:bg-destructive/10">Delete</button>
                            <button onClick={() => handleSaveAsNewService(row)} className="w-full text-left px-4 py-2 text-xs text-foreground hover:bg-muted">Save as new service</button>
                            <button onClick={handleDuplicate} className="w-full text-left px-4 py-2 text-xs text-foreground hover:bg-muted">Duplicate</button>
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <button onClick={() => deleteRow(index)} className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <RiCloseLine className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-5 mt-3">
            <button onClick={() => addRow()} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
              <AiOutlinePlusCircle className="text-base" /> Line item
            </button>
            <button onClick={() => addRow(true)} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
              <CiDiscount1 className="text-base" /> Discount
            </button>
          </div>
          {errors.lineItems && <p className="text-xs text-destructive mt-1">{errors.lineItems}</p>}
        </div>

        {/* Summary */}
        <div>
          <h3 className="text-base font-bold text-foreground mb-3">Summary</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-2 text-xs font-bold text-foreground">Subtotal</th>
                  <th className="text-left px-4 py-2 text-xs font-bold text-foreground">Tax Rate</th>
                  <th className="text-left px-4 py-2 text-xs font-bold text-foreground">Tax Total</th>
                  <th className="text-left px-4 py-2 text-xs font-bold text-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 text-foreground">$<input type="number" value={subtotal} onChange={handleSubtotalChange} className="w-20 bg-transparent outline-none border-b border-border focus:border-primary" /></td>
                  <td className="px-4 py-2 text-foreground"><input type="number" value={taxRate} onChange={handleTaxRateChange} className="w-16 bg-transparent outline-none border-b border-border focus:border-primary" />%</td>
                  <td className="px-4 py-2 text-foreground">${taxTotal.toFixed(2)}</td>
                  <td className="px-4 py-2 font-semibold text-foreground">${totalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center gap-4 pt-2 pb-6">
          <button onClick={createinvoice} className={btnPrimary}>Save</button>
          <button onClick={onClose} className={btnOutline}>Cancel</button>
        </div>

        {/* Create Service Drawer */}
        {isNewDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/40" onClick={handleNewDrawerClose} />
            <div className="ml-auto relative z-50 w-full max-w-[650px] bg-background h-full overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-base font-semibold text-foreground">Create Service</h3>
                <button onClick={handleNewDrawerClose} className="text-muted-foreground hover:text-foreground"><RxCross2 /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className={labelCls}>Service Name</label>
                  <input type="text" className={inputCls} placeholder="Service Name" value={selectedRowData?.productName || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <input type="text" className={inputCls} placeholder="Description" value={selectedRowData?.description || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Rate</label>
                    <input type="text" className={inputCls} placeholder="Rate" value={selectedRowData?.rate || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Rate Type</label>
                    <select className={inputCls} value={selectedRateOption?.value || ""} onChange={(e) => { const opt = Rateoptions.find(o => o.value === e.target.value); handleRateTypeChange(null, opt || null); }}>
                      <option value="">Select Rate Type</option>
                      {Rateoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div onClick={() => handleServiceSwitch(!(selectedRowData?.tax || false))} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${selectedRowData?.tax ? "bg-primary" : "bg-muted"}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${selectedRowData?.tax ? "translate-x-4" : "translate-x-1"}`} />
                  </div>
                  <span className="text-sm text-foreground">Tax</span>
                </label>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2">Category</h4>
                  <label className={labelCls}>Category Name</label>
                  <select className={inputCls} value={selectedCategory?.value || ""} onChange={(e) => { const opt = categoryoptions.find(o => o.value === e.target.value); handleCategoryChange(null, opt || null); }}>
                    <option value="">Category Name</option>
                    {categoryoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <button onClick={() => setCategoryFormOpen(true)} className={`${btnPrimary} mt-2`}>Create category</button>
                <div className="flex gap-4 pt-4">
                  <button onClick={createservicetemp} className={btnPrimary}>Save</button>
                  <button onClick={handleNewDrawerClose} className={btnOutline}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Form Drawer */}
        {isCategoryFormOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/40" onClick={handleCategoryFormClose} />
            <div className="ml-auto relative z-50 w-full max-w-[650px] bg-background h-full overflow-y-auto shadow-2xl">
              <div className="flex items-center px-4 py-3 border-b border-border">
                <button onClick={handleCategoryFormClose} className="text-muted-foreground hover:text-foreground mr-3"><ChevronLeft className="h-5 w-5" /></button>
                <h3 className="text-base font-semibold text-foreground">Create Category</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className={labelCls}>Category Name</label>
                  <input type="text" className={inputCls} placeholder="Category Name" value={categorycreate || ""} onChange={(e) => setcategorycreate(e.target.value)} />
                </div>
                <div className="flex gap-4 pt-2">
                  <button onClick={createCategory} className={btnPrimary}>Create</button>
                  <button onClick={handleCategoryFormClose} className={btnOutline}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Item Drawer */}
        {isEditDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/40" onClick={handleEditDrawerClose} />
            <div className="ml-auto relative z-50 w-full max-w-[650px] bg-background h-full overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-base font-semibold text-foreground">Edit Item</h3>
                <button onClick={handleEditDrawerClose} className="text-muted-foreground hover:text-foreground"><RxCross2 /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className={labelCls}>Product or service</label>
                  <input type="text" className={inputCls} value={selectedRowData?.productName || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea className={`${inputCls} min-h-[80px] resize-none`} value={selectedRowData?.description || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Rate</label>
                    <input type="text" className={inputCls} value={selectedRowData?.rate || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>QTY</label>
                    <input type="text" className={inputCls} value={selectedRowData?.qty || ""} onChange={(e) => setSelectedRowData({ ...selectedRowData, qty: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Amount</label>
                    <input type="text" className={`${inputCls} bg-muted/40 cursor-not-allowed`} value={totalamount} disabled readOnly />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div onClick={() => handleServiceWitch(!(selectedRowData?.tax))} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${selectedRowData?.tax ? "bg-primary" : "bg-muted"}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${selectedRowData?.tax ? "translate-x-4" : "translate-x-1"}`} />
                  </div>
                  <span className="text-sm text-foreground">Tax</span>
                </label>
                <div className="flex gap-4 pt-2">
                  <button onClick={handleSaveChanges} className={btnPrimary}>Save</button>
                  <button onClick={handleEditDrawerClose} className={btnOutline}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateInvoice;

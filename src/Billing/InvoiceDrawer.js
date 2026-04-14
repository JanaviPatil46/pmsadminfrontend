import React, { useState, useEffect, useContext } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import { MdOutlinePreview } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { LoginContext } from "../Sidebar/Context/Context";
import { RxCross2 } from "react-icons/rx";
const InvoiceDrawer = ({
  isDrawerOpen,
  setDrawerOpen,
  selectedAccount,
  handleDrawerClose,
  charLimit = 4000,
  leftsidebarDrawer
}) => {
  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const CATEGORY_API = process.env.REACT_APP_CATEGORY_URL;
  const [description, setDescription] = useState("");
  const [payInvoice, setIsPayInvoice] = useState(false);
  const [emailInvoice, setIsEmailInvoice] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [scheduledInvoice, setScheduledInvoice] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [invoicenumber, setinvoicenumber] = useState("");
   const [isLoadingInvoiceNumber, setIsLoadingInvoiceNumber] = useState(true);
  const [rows, setRows] = useState([]);
  const [servicedata, setServiceData] = useState([]);
  const [selectedservice, setselectedService] = useState();
  const [paymentMode, setPaymentMode] = useState({
   value: "Bank Debits", 
   label: "Bank Debits"
 });
 
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [selectInvoiceTemp, setSelectedInvoiceTemp] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [anchorElNew, setAnchorElNew] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [firstContactEmail, setFirstContactEmail] = useState("");
  const [previewDrawerOpen, setpreviewDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [categorycreate, setcategorycreate] = useState();
  const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
  
  const handleCategoryFormClose = () => {
    setCategoryFormOpen(false);
  };
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const handleNewDrawerClose = () => {
    setIsNewDrawerOpen(false);
  };
  const [categoryData, setCategoryData] = useState([]);
  useEffect(() => {
    fetchData();
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
  const fetchData = async () => {
    try {
      const url = `${CATEGORY_API}/workflow/category/categorys`;
      const response = await fetch(url);
      const data = await response.json();
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

  const options = [
    { label: "Item", value: "item" },
    { label: "Hour", value: "hour" },
  ];
  const [selectedRateOption, setSelectedRateOption] = useState("");

  const handleRateTypeChange = (event, newValue) => {
    setSelectedRateOption(newValue);
  };
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const [servicename, setservicename] = useState("");
  const [discription, setdiscription] = useState("");
  const [rate, setrate] = useState("$ 0.00");
  const [service, setService] = useState(false);
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

        if (
          result &&
          result.message === "ServiceTemplate created successfully"
        ) {
          toast.success("ServiceTemplate created successfully");
          handleNewDrawerClose();
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
        const errorMessage =
          error.response && error.response.message
            ? error.response.message
            : "Failed to create invoice";
        toast.error(errorMessage);
      });
  };
  const navigate = useNavigate();

  const paymentsOptions = [
    { value: "Bank Debits", label: "Bank Debits" },
    { value: "Credit Card", label: "Credit Card" },
    {
      value: "Credit Card or Bank Debits",
      label: "Credit Card or Bank Debits",
    },
  ];
  const [accountData, setAccountData] = useState([]);
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

      if (storedUserRole === "Admin") {
        url =
          "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
      } else {
        url =
          viewAllAccounts === true
            ? "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
            : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=true`;
      }

      const response = await fetch(url);
      const data = await response.json();

      const accounts = Array.isArray(data.accountlist)
        ? data.accountlist
        : Array.isArray(data.teamAccounts)
        ? data.teamAccounts
        : [];

      setAccountData(accounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const accountOptions = accountData.map((account) => ({
    value: account._id,
    label: account.accountName,
  }));


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

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length <= 4000) {
      setDescription(value);
      setCharCount(value.length);
    }
  };

  const handleAddShortcut = (shortcut) => {
    const updatedTextValue = description + `[${shortcut}]`;
    if (updatedTextValue.length <= 4000) {
      setDescription(updatedTextValue);
      setCharCount(updatedTextValue.length);
    }
    setShowDropdown(false);
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
     setShowDropdown(false);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handlePaymentOptionChange = (event, selectedOption) => {
    setPaymentMode(selectedOption);
  };

  const handleuserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
  };

  const handleInvoiceTempChange = (event, selectedOptions) => {
    setSelectedInvoiceTemp(selectedOptions);
    fetchinvoicetempbyid(selectedOptions.value);
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

  const handleMenuOpen = (event, index) => {
    setAnchorElNew(event.currentTarget);
    setSelectedRow(index);
  };

  const handleMenuClose = () => {
    setAnchorElNew(null);
    setSelectedRow(null);
  };

  const handleEditService = (row, index) => {
    setSelectedRowData(row);
    setSelectedRowIndex(index);
    handleMenuClose();
    setIsEditDrawerOpen(true);
  };

  const handleSaveChanges = () => {
    if (selectedRowIndex !== null) {
      const updatedRows = [...rows];
      const rateValue = parseFloat(
        selectedRowData.rate.replace(/[^0-9.-]+/g, "")
      );
      const qtyValue = parseInt(selectedRowData.qty) || 0;
      const amount = (rateValue * qtyValue).toFixed(2);
      updatedRows[selectedRowIndex] = {
        ...selectedRowData,
        amount: `$${amount}`,
      };
      setRows(updatedRows);
    }
    handleEditDrawerClose();
  };

  const handleDeleteService = () => {
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
      setRows([...rows, duplicatedRow]);
    }
    handleMenuClose();
  };

  const handleSaveAsNewService = (row) => {
    console.log("Row data:", row);
    setSelectedRowData(row);
    setIsNewDrawerOpen(true); // Open the drawer if required
    handleMenuClose();
  };

  const handleEditDrawerClose = () => {
    setIsEditDrawerOpen(false);
  };

  const handleOpenpreviewDrawer = () => setpreviewDrawerOpen(true);
  const handleClosepreviewDrawer = () => setpreviewDrawerOpen(false);

  const contactMail = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://www.snptaxes.com/api/accounts/${selectedAccount?.value}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (Array.isArray(result.contacts) && result.contacts.length > 0) {
          const email = result.contacts[0]?.contact?.email;
          if (email) {
            setFirstContactEmail(email);
          } else {
            setFirstContactEmail("[CONTACT EMAIL]");
          }
        } else {
          setFirstContactEmail("[CONTACT EMAIL]");
        }
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setFirstContactEmail("Error fetching email");
      });
  };
  useEffect(() => {
    if (selectedAccount?.value) {
      contactMail();
    }
  }, [selectedAccount]);

  useEffect(() => {
    const calculateSubtotal = () => {
      let subtotal = 0;
      rows.forEach((row) => {
        subtotal += parseFloat(row.amount.replace("$", "")) || 0;
      });
      setSubtotal(subtotal);
      calculateTotal(subtotal, taxRate);
    };
    calculateSubtotal();
  }, [rows, taxRate]);

  useEffect(() => {
    fetchServiceData();
    fetchInvoiceTemplates();
  }, []);

  const fetchServiceData = async () => {
    try {
      const url = `${SERVICE_API}/workflow/services/servicetemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setServiceData(data.serviceTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
  const { logindata } = useContext(LoginContext);
  const [selecteduser, setSelectedUser] = useState("");
  const [userData, setUserData] = useState([]);
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
 useEffect(() => {
  if (isDrawerOpen) {
    fetchUserData();      // Fetch only when drawer opens
  }
}, [isDrawerOpen]);        // Dependency

  // Function to set default team member based on logged-in user
  const setDefaultTeamMember = (users) => {
    if (logindata && logindata.user && logindata.user.id && Array.isArray(users)) {
      const currentUser = users.find((user) => user._id === logindata.user.id);
      if (currentUser) {
        setSelectedUser({ value: currentUser._id, label: currentUser.username });
      }
    }
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
    } catch (error) {
      console.error("Error fetching Invoice Templates:", error);
    }
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
        setDescription(result.invoiceTemplate.description);
        setIsPayInvoice(result.invoiceTemplate.payInvoicewithcredits);
        setIsEmailInvoice(result.invoiceTemplate.sendEmailWhenInvCreated);
        setReminders(result.invoiceTemplate.sendReminderstoClients);

        const paymentMethod = {
          value: result.invoiceTemplate.paymentMethod,
          label: result.invoiceTemplate.paymentMethod,
        };
        setPaymentMode(paymentMethod);
        const rate = service.rate
          ? parseFloat(service.rate.replace("$", ""))
          : 0;
        const lineitems = result.invoiceTemplate.lineItems.map((item) => ({
          productName: item.productorService || "",
          description: item.description || "",
          rate: `$${parseFloat(item.rate || "0.00").toFixed(2)}`,
            qty: String(item.quantity || "1"),
          amount: `$${parseFloat(item.amount || "0.00").toFixed(2)}`,
          tax: item.tax || false,
          isDiscount: item.isDiscount || false,
        }));
        setRows(lineitems);
        setSubtotal(result.invoiceTemplate.summary.subtotal);
        setTaxRate(result.invoiceTemplate.summary.taxRate);
        setTaxTotal(result.invoiceTemplate.summary.taxTotal);
        setTotalAmount(result.invoiceTemplate.summary.total);
      })
      .catch((error) => console.error(error));
  };

  const serviceoptions = servicedata.map((service) => ({
    value: service._id,
    label: service.serviceName,
  }));

  const useroptions = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const invoiceoptions = invoiceTemplates.map((invoice) => ({
    value: invoice._id,
    label: invoice.templatename,
  }));
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
    productorService: item.productName,
    description: item.description,
    rate: item.rate.replace("$", ""),
    quantity: item.qty,
    amount: item.amount.replace("$", ""),
    tax: item.tax.toString(),
  }));
 const [templateNameError, setTemplateNameError] = useState("");
const [lineItemsError, setLineItemsError]= useState("")
  const validateForm = () => {
    let isValid = true;
    // if (!selectInvoiceTemp) {
    //   setTemplateNameError("Name can't be blank");
    
    //   isValid = false;
    // } else {
    //   setTemplateNameError("");
    // }
    // if (!selectedservice){
    //   setLineItemsError("selecte the Line Items");
    //   isValid = false;
    // }
    // else{
    //   setLineItemsError("")
    // }

    return isValid;
  };
  const createinvoice = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      account: selectedAccount?.value,
     invoicenumber: invoicenumber,
      invoicedate: startDate,
      description: description,
      invoicetemplate: selectInvoiceTemp?.value,
      paymentMethod: paymentMode.value,
      teammember: selecteduser.value,
      emailinvoicetoclient: emailInvoice,
      scheduleinvoicedate: new Date(),
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
      paidAmount: "",
      invoiceStatus: "Pending",
      balanceDueAmount: "",
    });
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
        if (result && result.message === "Invoice created successfully") {
          toast.success("Invoice created successfully");
          setDrawerOpen(false);
          handleDrawerClose();
           navigate(
            `/clients/accounts/accountsdash/invoices/${selectedAccount.value}/invoice`
          );
          Cookies.remove("accountId");
          Cookies.remove("accountName");
          leftsidebarDrawer()
         
        } else {
          toast.error(result.message || "Failed to create InvoiceTemplate");
        }
      })
      .catch((error) => console.error(error));
  };


  const handleServiceWitch = (checked) => {
    setSelectedRowData({ ...selectedRowData, tax: checked });
  };
  const [totalamount, setTotalamount] = useState("");

  useEffect(() => {
    const rate = parseFloat(selectedRowData?.rate?.replace("$", "")) || 0;
    const qty = selectedRowData?.qty || 0;
    setTotalamount(`$${(rate * qty).toFixed(2)}`);
  }, [selectedRowData?.rate, selectedRowData?.qty]);
  const inputCls = "w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-400";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";
  const btnPrimary = "rounded-full px-5 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] transition-colors";
  const btnOutline = "rounded-full px-5 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white hover:border-transparent transition-colors";
  const switchEl = (checked, onChange) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
    </label>
  );

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Main Invoice Drawer */}
      <div className="fixed inset-0 z-40 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
        <div className="absolute right-0 top-0 h-full bg-white shadow-2xl overflow-y-auto w-full md:w-[60%]">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-lg font-bold text-gray-800">Create Invoice</h2>
            <div className="flex items-center gap-4">
              <button type="button" onClick={handleOpenpreviewDrawer}
                className="flex items-center gap-1.5 text-blue-600 text-sm hover:text-blue-800">
                <MdOutlinePreview size={18} /> Preview
              </button>
              <button type="button" onClick={handleDrawerClose} className="text-gray-400 hover:text-gray-700">
                <RxCross2 size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5 create-invoice">

            {/* Row 1: Account + Invoice Template */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Account name, ID or email</label>
                <input readOnly value={selectedAccount?.label || ""} placeholder="Select Account" className={inputCls + " bg-gray-50 cursor-default"} />
              </div>
              <div>
                <label className={labelCls}>Invoice Template</label>
                <select value={selectInvoiceTemp?.value || ""}
                  onChange={(e) => { const opt = invoiceoptions.find(o => o.value === e.target.value); if (opt) handleInvoiceTempChange(null, opt); }}
                  className={inputCls}>
                  <option value="">Invoice Template</option>
                  {invoiceoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2: Invoice Number + Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Invoice Number</label>
                <input readOnly value={isLoadingInvoiceNumber ? "Loading..." : invoicenumber}
                  placeholder="Invoice Number" className={inputCls + " bg-gray-50 cursor-default"} />
                <p className="text-xs text-gray-400 mt-1">Auto-generated invoice number</p>
              </div>
              <div>
                <label className={labelCls}>Payment Method</label>
                <select value={paymentMode?.value || ""}
                  onChange={(e) => { const opt = paymentsOptions.find(o => o.value === e.target.value); handlePaymentOptionChange(null, opt || null); }}
                  className={inputCls}>
                  <option value="">Select Payment Mode</option>
                  {paymentsOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Row 3: Date + Team Member */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" className={inputCls}
                  value={startDate ? startDate.format("YYYY-MM-DD") : ""}
                  onChange={(e) => handleStartDateChange(dayjs(e.target.value))} />
              </div>
              <div>
                <label className={labelCls}>Team Member</label>
                <select value={selecteduser?.value || ""}
                  onChange={(e) => { const opt = useroptions.find(o => o.value === e.target.value); handleuserChange(null, opt || null); }}
                  className={inputCls}>
                  <option value="">Team Member</option>
                  {useroptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Description + Shortcode */}
            <div className="relative">
              <label className={labelCls}>Description</label>
              <textarea value={description} onChange={handleChange} placeholder="Description" rows={3} className={inputCls} />
              <p className="text-xs text-gray-400 text-right mt-1">{charCount}/{charLimit}</p>
              <div className="relative mt-1">
                <button type="button" onClick={toggleDropdown} className={btnPrimary + " !rounded-full px-4 py-1.5 text-xs"}>
                  Add Shortcode
                </button>
                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={handleCloseDropdown} />
                    <div className="absolute left-0 z-40 bg-white border border-gray-200 rounded-lg shadow-lg w-[300px] h-[300px] overflow-y-auto">
                      <ul>
                        {filteredShortcuts.map((shortcut, index) => (
                          <li key={index} onClick={() => handleAddShortcut(shortcut.value)}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
                            style={{ fontWeight: shortcut.isBold ? "bold" : "normal" }}>
                            {shortcut.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Additional toggles */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Additional</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  {switchEl(payInvoice, handlePayInvoiceChange)}
                  <span className="text-sm text-gray-700">Pay invoice using client credits</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  {switchEl(emailInvoice, handleEmailInvoiceChange)}
                  <span className="text-sm text-gray-700">Email invoice to client</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  {switchEl(reminders, handleRemindersChange)}
                  <span className="text-sm text-gray-700">Reminders</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  {switchEl(scheduledInvoice, handleScheduledInvoiceChange)}
                  <span className="text-sm text-gray-700">Scheduled invoice</span>
                </label>
              </div>
            </div>

            {/* Line Items */}
            <div className="invoice-section-three">
              <h3 className="text-base font-bold text-gray-800 mb-1">Line Items</h3>
              <p className="text-xs text-gray-500 mb-3">Client-facing itemized list of products and services</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium sticky left-0 bg-gray-50">Product or Service</th>
                      <th className="text-left px-3 py-2 font-medium">Description</th>
                      <th className="text-left px-3 py-2 font-medium">Rate</th>
                      <th className="text-left px-3 py-2 font-medium">Qty</th>
                      <th className="text-left px-3 py-2 font-medium">Amount</th>
                      <th className="text-left px-3 py-2 font-medium">Tax</th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <td className="px-2 py-1 sticky left-0 bg-white">
                          <CreatableSelect
                            placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
                            options={serviceoptions}
                            value={row.productName ? serviceoptions.find(o => o.label === row.productName) || { label: row.productName, value: row.productName } : null}
                            onChange={(selectedOption) => handleServiceChange(index, selectedOption)}
                            onInputChange={(inputValue, actionMeta) => handleServiceInputChange(inputValue, actionMeta, index)}
                            isClearable
                            styles={{
                              container: (p) => ({ ...p, width: "180px" }),
                              control: (p) => ({ ...p, width: "180px" }),
                              menuPortal: (p) => ({ ...p, zIndex: 9999 }),
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
                        <td className={`px-2 py-1 text-sm ${row.isDiscount ? "text-red-500 discount-amount" : ""}`}>{row.amount}</td>
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

              <div className="flex items-center gap-5 mt-3">
                <button type="button" onClick={() => addRow()} className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800">
                  <AiOutlinePlusCircle /> Line item
                </button>
                <button type="button" onClick={() => addRow(true)} className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800">
                  <CiDiscount1 /> Discount
                </button>
              </div>

              {/* Summary */}
              <div className="mt-5">
                <h3 className="text-base font-bold text-gray-800 mb-2">Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm bg-white border border-gray-100 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium">SUBTOTAL</th>
                        <th className="text-left px-3 py-2 font-medium">TAX RATE</th>
                        <th className="text-left px-3 py-2 font-medium">TAX TOTAL</th>
                        <th className="text-left px-3 py-2 font-medium">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2"><div className="flex items-center">$<input type="number" value={subtotal} onChange={handleSubtotalChange} className="border-none outline-none text-sm w-20 ml-1" /></div></td>
                        <td className="px-3 py-2"><div className="flex items-center"><input type="number" value={taxRate} onChange={handleTaxRateChange} className="border-none outline-none text-sm w-16" />%</div></td>
                        <td className="px-3 py-2">${taxTotal.toFixed(2)}</td>
                        <td className="px-3 py-2 font-semibold">${totalAmount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-4 pt-4 pb-6">
              <button type="button" className={btnPrimary} onClick={createinvoice}>Save</button>
              <button type="button" className={btnOutline} onClick={handleDrawerClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Drawer */}
      {previewDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" onClick={handleClosepreviewDrawer} />
          <div className="absolute right-0 top-0 h-full bg-[#f8fafc] shadow-2xl overflow-y-auto w-full md:w-[800px]">
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-semibold text-gray-700">Preview</span>
                <button type="button" onClick={handleClosepreviewDrawer} className="text-blue-600 hover:text-blue-800">
                  <RxCross2 size={18} />
                </button>
              </div>
              <hr className="border-gray-200 mb-6" />

              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-[#ff6700] mb-4">Invoice</h2>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{selectedAccount?.label || "[ACCOUNT NAME]"}</span>
                  <span>Invoice number: <span className="text-gray-400">{invoicenumber || "[INVOICE_NUMBER]"}</span></span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{firstContactEmail || "[CONTACT EMAIL]"}</span>
                  <span>Date: {startDate ? startDate.format("YYYY-MM-DD") : ""}</span>
                </div>
                <p className="text-sm text-gray-600 mb-5">Description: {description}</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm mb-4">
                    <thead className="bg-[#fff8f5]">
                      <tr>
                        <th className="text-left px-3 py-2 font-semibold">Product/Service</th>
                        <th className="text-left px-3 py-2 font-semibold">Description</th>
                        <th className="text-right px-3 py-2 font-semibold">Rate ($)</th>
                        <th className="text-right px-3 py-2 font-semibold">Qty</th>
                        <th className="text-right px-3 py-2 font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rows.map((row, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2">{row.productName}</td>
                          <td className="px-3 py-2">{row.description}</td>
                          <td className="px-3 py-2 text-right">{row.rate || "$0.00"}</td>
                          <td className="px-3 py-2 text-right">{row.qty || "1"}</td>
                          <td className="px-3 py-2 text-right">{row.amount || "$0.00"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <table className="ml-auto w-1/2 text-sm">
                  <tbody>
                    <tr><td className="px-3 py-1 font-semibold">Subtotal:</td><td className="px-3 py-1">${subtotal || "0.00"}</td></tr>
                    <tr><td className="px-3 py-1 font-semibold">Tax Rate:</td><td className="px-3 py-1">{taxRate || "0.00"}%</td></tr>
                    <tr><td className="px-3 py-1 font-semibold">Tax Total:</td><td className="px-3 py-1">${taxTotal?.toFixed(2) || "0.00"}</td></tr>
                    <tr className="font-bold"><td className="px-3 py-1">Total:</td><td className="px-3 py-1">${totalAmount || "0.00"}</td></tr>
                  </tbody>
                </table>
              </div>

              <button type="button" className={btnPrimary} onClick={createinvoice}>Save &amp; Exit</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Service Drawer */}
      {isNewDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" onClick={handleNewDrawerClose} />
          <div className="absolute right-0 top-0 h-full bg-white shadow-2xl overflow-y-auto w-full md:w-[650px]">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-base font-semibold">Create Service</h2>
              <RxCross2 onClick={handleNewDrawerClose} className="cursor-pointer text-gray-500" />
            </div>
            <form className="p-4 space-y-4">
              <div>
                <label className={labelCls}>Service Name</label>
                <input placeholder="Service Name" className={inputCls}
                  value={selectedRowData?.productName || ""}
                  onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <input placeholder="Description" className={inputCls}
                  value={selectedRowData?.description || ""}
                  onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className={labelCls}>Rate</label>
                  <input placeholder="Rate" className={inputCls}
                    value={selectedRowData?.rate || ""}
                    onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
                </div>
                <div className="w-1/2">
                  <label className={labelCls}>Rate Type</label>
                  <select value={selectedRateOption?.value || ""}
                    onChange={(e) => { const opt = options.find(o => o.value === e.target.value); handleRateTypeChange(null, opt); }}
                    className={inputCls}>
                    <option value="">Select Rate Type</option>
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                {switchEl(selectedRowData?.tax || false, (e) => handleServiceSwitch(e.target.checked))}
                <span className="text-sm text-gray-700">Tax</span>
              </label>
              <div>
                <h3 className="text-lg font-bold mt-3 mb-2">Category</h3>
                <label className={labelCls}>Category Name</label>
                <select value={selectedCategory?.value || ""}
                  onChange={(e) => { const opt = categoryoptions.find(o => o.value === e.target.value); handleCategoryChange(null, opt || null); }}
                  className={inputCls}>
                  <option value="">Category Name</option>
                  {categoryoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <button type="button" onClick={() => setCategoryFormOpen(true)} className={btnPrimary + " !rounded-full px-4 py-1.5 text-xs"}>
                Create category
              </button>
              <div className="flex gap-4 pt-2">
                <button type="button" className={btnPrimary} onClick={createservicetemp}>Save</button>
                <button type="button" className={btnOutline} onClick={handleNewDrawerClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Drawer */}
      {isCategoryFormOpen && (
        <div className="fixed inset-0 z-[60] overflow-hidden">
          <div className="absolute inset-0 bg-black/30" onClick={handleCategoryFormClose} />
          <div className="absolute right-0 top-0 h-full bg-white shadow-2xl overflow-y-auto w-full md:w-[650px]">
            <div className="flex items-center p-5">
              <button type="button" onClick={handleCategoryFormClose} className="text-gray-500 hover:text-gray-700">
                <IoArrowBack size={20} />
              </button>
            </div>
            <hr className="border-gray-200" />
            <div className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Category Name</label>
                <input placeholder="Category Name" className={inputCls}
                  value={categorycreate} onChange={(e) => setcategorycreate(e.target.value)} />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" className={btnPrimary} onClick={createCategory}>Create</button>
                <button type="button" className={btnOutline} onClick={handleCategoryFormClose}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Drawer */}
      {isEditDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" onClick={handleEditDrawerClose} />
          <div className="absolute right-0 top-0 h-full bg-white shadow-2xl overflow-y-auto w-full md:w-[650px]">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-base font-semibold">Edit Item</h2>
              <RxCross2 onClick={handleEditDrawerClose} className="cursor-pointer text-gray-500" />
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-bold mb-1">Product or service</p>
                <input className={inputCls} value={selectedRowData?.productName || ""}
                  onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
              </div>
              <div>
                <p className="text-sm mb-1">Description</p>
                <textarea className={inputCls} rows={2} value={selectedRowData?.description || ""}
                  onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm mb-1">Rate</p>
                  <input className={inputCls} value={selectedRowData?.rate || ""}
                    onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">QTY</p>
                  <input className={inputCls} value={selectedRowData?.qty || ""}
                    onChange={(e) => setSelectedRowData({ ...selectedRowData, qty: e.target.value })} />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">Amount</p>
                  <input className={inputCls + " bg-gray-100 cursor-not-allowed"} disabled value={totalamount} />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                {switchEl(selectedRowData?.tax || false, (e) => handleServiceWitch(e.target.checked))}
                <span className="text-sm text-gray-700">Tax</span>
              </label>
              <div className="flex gap-3 mt-4">
                <button type="button" className={btnPrimary} onClick={handleSaveChanges}>Save</button>
                <button type="button" className={btnOutline} onClick={handleEditDrawerClose}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceDrawer;

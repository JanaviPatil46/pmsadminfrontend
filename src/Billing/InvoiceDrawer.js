import React, { useState, useEffect, useContext } from "react";
import { Plus, Tag, Pencil, Trash2, X, Eye, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { LoginContext } from "../Sidebar/Context/Context";
import { SideSheet } from "../components/ui/side-sheet";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
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
  const [openServiceDropdown, setOpenServiceDropdown] = useState(null);
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

  const handleServiceChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].productName = value;
    setRows(newRows);
    const matched = serviceoptions.find(o => o.label === value);
    if (matched) {
      setselectedService(matched);
      fetchservicebyid(matched.value, index);
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

  const handleEditService = (row, index) => {
    setSelectedRowData(row);
    setSelectedRowIndex(index);
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

  const handleSaveAsNewService = (row) => {
    setSelectedRowData(row);
    setIsNewDrawerOpen(true);
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
  const selectCls = "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <>
      {/* ══════════ Main Invoice Sheet ══════════ */}
      <SideSheet
        open={isDrawerOpen}
        onOpenChange={(v) => { if (!v) { setDrawerOpen(false); handleDrawerClose(); } }}
        title="Create Invoice"
        description={`Account: ${selectedAccount?.label || "—"}`}
        size="xl"
        hideDefaultFooter
        footer={
          <div className="flex items-center gap-2 w-full">
            <Button variant="outline" size="sm" onClick={handleOpenpreviewDrawer}>
              <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setDrawerOpen(false); handleDrawerClose(); }}>Cancel</Button>
              <Button size="sm" onClick={createinvoice}>Save Invoice</Button>
            </div>
          </div>
        }
      >
        <div className="space-y-5">

          {/* ── Invoice Info ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Invoice Info</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Account</Label>
                <Input readOnly value={selectedAccount?.label || ""} placeholder="Select Account" className="bg-muted cursor-default" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="id-inv-temp">Invoice Template</Label>
                <select id="id-inv-temp" value={selectInvoiceTemp?.value || ""}
                  onChange={(e) => { const opt = invoiceoptions.find(o => o.value === e.target.value); if (opt) handleInvoiceTempChange(null, opt); }}
                  className={selectCls}>
                  <option value="">Select template</option>
                  {invoiceoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Invoice Number</Label>
                <Input readOnly value={isLoadingInvoiceNumber ? "Loading..." : invoicenumber} className="bg-muted cursor-default" />
                <p className="text-xs text-muted-foreground">Auto-generated</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="id-payment">Payment Method</Label>
                <select id="id-payment" value={paymentMode?.value || ""}
                  onChange={(e) => { const opt = paymentsOptions.find(o => o.value === e.target.value); handlePaymentOptionChange(null, opt || null); }}
                  className={selectCls}>
                  <option value="">Select payment mode</option>
                  {paymentsOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="id-date">Invoice Date</Label>
                <Input id="id-date" type="date"
                  value={startDate ? startDate.format("YYYY-MM-DD") : ""}
                  onChange={(e) => handleStartDateChange(dayjs(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="id-member">Team Member</Label>
                <select id="id-member" value={selecteduser?.value || ""}
                  onChange={(e) => { const opt = useroptions.find(o => o.value === e.target.value); handleuserChange(null, opt || null); }}
                  className={selectCls}>
                  <option value="">Select team member</option>
                  {useroptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Description ── */}
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={handleChange} placeholder="Invoice description" rows={3} />
            <div className="flex items-center justify-between">
              <div className="relative">
                <Button type="button" variant="outline" size="sm" onClick={toggleDropdown}>
                  Add Shortcode <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
                </Button>
                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={handleCloseDropdown} />
                    <div className="absolute left-0 z-40 bg-popover border border-border rounded-lg shadow-lg w-72 max-h-72 overflow-y-auto">
                      {filteredShortcuts.map((s, i) => (
                        <div key={i} onClick={() => handleAddShortcut(s.value)}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-muted transition-colors ${
                            s.isBold ? "font-semibold text-foreground" : "text-muted-foreground"
                          }`}>
                          {s.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{charCount}/{charLimit}</p>
            </div>
          </div>

          {/* ── Settings ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Settings</p>
            <div className="space-y-3">
              {[
                { label: "Pay invoice using client credits", checked: payInvoice, onChange: handlePayInvoiceChange },
                { label: "Email invoice to client", checked: emailInvoice, onChange: handleEmailInvoiceChange },
                { label: "Send reminders", checked: reminders, onChange: handleRemindersChange },
                { label: "Scheduled invoice", checked: scheduledInvoice, onChange: handleScheduledInvoiceChange },
              ].map(({ label, checked, onChange }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{label}</span>
                  <Switch checked={checked} onCheckedChange={onChange} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Line Items ── */}
          <div>
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Line Items</p>
              <p className="text-xs text-muted-foreground mt-0.5">Client-facing itemized list of products and services</p>
            </div>

            <div className="rounded-lg border border-border">
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[22%]" />
                  <col className="w-[10%]" />
                  <col className="w-[8%]" />
                  <col className="w-[12%]" />
                  <col className="w-[6%]" />
                  <col className="w-[12%]" />
                </colgroup>
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product / Service</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rate</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tax</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-2 py-1.5 relative">
                        <Input
                          value={row.productName}
                          placeholder={row.isDiscount ? "Reason for discount" : "Product or Service"}
                          className="h-8 text-xs"
                          onChange={(e) => {
                            handleServiceChange(index, e.target.value);
                            setOpenServiceDropdown(index);
                          }}
                          onFocus={() => setOpenServiceDropdown(index)}
                          onBlur={() => setTimeout(() => setOpenServiceDropdown(null), 150)}
                        />
                        {openServiceDropdown === index && serviceoptions.length > 0 && (
                          <div className="absolute left-0 top-full mt-1 z-50 w-full min-w-[200px] rounded-md border border-border bg-card shadow-md overflow-y-auto max-h-48">
                            {serviceoptions
                              .filter(o =>
                                !row.productName ||
                                o.label.toLowerCase().includes(row.productName.toLowerCase())
                              )
                              .map(o => (
                                <div
                                  key={o.value}
                                  onMouseDown={() => {
                                    handleServiceChange(index, o.label);
                                    setOpenServiceDropdown(null);
                                  }}
                                  className="px-3 py-2 text-sm text-foreground cursor-pointer hover:bg-muted transition-colors"
                                >
                                  {o.label}
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="text" name="description" value={row.description} onChange={(e) => handleInputChange(index, e)}
                          className="w-full border-none outline-none text-sm bg-transparent text-foreground placeholder:text-muted-foreground" placeholder="Description" />
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="text" name="rate" value={row.rate} onChange={(e) => handleInputChange(index, e)}
                          className="w-full border-none outline-none text-sm bg-transparent text-foreground" />
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="text" name="qty" value={row.qty} onChange={(e) => handleInputChange(index, e)}
                          className="w-full border-none outline-none text-sm bg-transparent text-foreground" />
                      </td>
                      <td className={`px-2 py-1.5 text-sm font-medium ${row.isDiscount ? "text-destructive" : "text-foreground"}`}>
                        {row.amount}
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="checkbox" name="tax" checked={row.tax} onChange={(e) => handleInputChange(index, e)} className="h-4 w-4 accent-primary" />
                      </td>
                      <td className="px-2 py-1.5">
                        <div className="flex items-center justify-end gap-0.5">
                          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10" title="Edit" onClick={() => handleEditService(row, index)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="Delete" onClick={() => deleteRow(index)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <button type="button" onClick={() => addRow()} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                <Plus className="h-4 w-4" /> Line item
              </button>
              <button type="button" onClick={() => addRow(true)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                <Tag className="h-4 w-4" /> Discount
              </button>
            </div>

            {/* Summary */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Summary</p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border">
                      <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subtotal</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tax Rate</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tax Total</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-0.5 text-foreground">
                          $<input type="number" value={subtotal} onChange={handleSubtotalChange}
                            className="border-none outline-none text-sm w-20 ml-1 bg-transparent text-foreground" />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center text-foreground">
                          <input type="number" value={taxRate} onChange={handleTaxRateChange}
                            className="border-none outline-none text-sm w-16 bg-transparent text-foreground" />%
                        </div>
                      </td>
                      <td className="px-3 py-2 text-foreground">${taxTotal.toFixed(2)}</td>
                      <td className="px-3 py-2 font-semibold text-foreground">${totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </SideSheet>

      {/* ══════════ Preview Sheet ══════════ */}
      <SideSheet
        open={previewDrawerOpen}
        onOpenChange={(v) => !v && handleClosepreviewDrawer()}
        title="Invoice Preview"
        description={selectedAccount?.label}
        size="xl"
        hideDefaultFooter
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="ghost" size="sm" onClick={handleClosepreviewDrawer}>Close</Button>
            <Button size="sm" onClick={createinvoice}>Save &amp; Exit</Button>
          </div>
        }
      >
        <div className="bg-background border border-border rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-bold text-primary">Invoice</h2>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{selectedAccount?.label || "[ACCOUNT NAME]"}</span>
            <span>Invoice #: <span className="font-medium text-foreground">{invoicenumber || "—"}</span></span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{firstContactEmail || "[CONTACT EMAIL]"}</span>
            <span>Date: {startDate ? startDate.format("YYYY-MM-DD") : "—"}</span>
          </div>
          {description && <p className="text-sm text-muted-foreground border-t border-border pt-3">{description}</p>}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product/Service</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                  <th className="text-right px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rate</th>
                  <th className="text-right px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                  <th className="text-right px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2">{row.productName}</td>
                    <td className="px-3 py-2">{row.description}</td>
                    <td className="px-3 py-2 text-right">{row.rate || "$0.00"}</td>
                    <td className="px-3 py-2 text-right">{row.qty || "1"}</td>
                    <td className={`px-3 py-2 text-right ${row.isDiscount ? "text-destructive" : ""}`}>{row.amount || "$0.00"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <table className="ml-auto w-48 text-sm">
            <tbody>
              <tr><td className="py-1 font-medium">Subtotal:</td><td className="py-1 text-right">${subtotal || "0.00"}</td></tr>
              <tr><td className="py-1 font-medium">Tax Rate:</td><td className="py-1 text-right">{taxRate || "0.00"}%</td></tr>
              <tr><td className="py-1 font-medium">Tax Total:</td><td className="py-1 text-right">${taxTotal?.toFixed(2) || "0.00"}</td></tr>
              <tr className="border-t border-border font-bold"><td className="py-1">Total:</td><td className="py-1 text-right">${totalAmount || "0.00"}</td></tr>
            </tbody>
          </table>
        </div>
      </SideSheet>

      {/* ══════════ Create Service Sheet ══════════ */}
      <SideSheet
        open={isNewDrawerOpen}
        onOpenChange={(v) => !v && handleNewDrawerClose()}
        title="Create Service"
        description="Save this line item as a reusable service template"
        size="md"
        hideDefaultFooter
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="ghost" size="sm" onClick={handleNewDrawerClose}>Cancel</Button>
            <Button size="sm" onClick={createservicetemp}>Save Service</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Service Name</Label>
            <Input placeholder="Service Name"
              value={selectedRowData?.productName || ""}
              onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input placeholder="Description"
              value={selectedRowData?.description || ""}
              onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Rate</Label>
              <Input placeholder="Rate"
                value={selectedRowData?.rate || ""}
                onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cs-rate-type">Rate Type</Label>
              <select id="cs-rate-type" value={selectedRateOption?.value || ""}
                onChange={(e) => { const opt = options.find(o => o.value === e.target.value); handleRateTypeChange(null, opt); }}
                className={selectCls}>
                <option value="">Select rate type</option>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Taxable</Label>
            <Switch checked={selectedRowData?.tax || false} onCheckedChange={(checked) => handleServiceSwitch(checked)} />
          </div>

          <div className="space-y-2 pt-2 border-t border-border/40">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</p>
            <div className="space-y-1.5">
              <Label htmlFor="cs-category">Category Name</Label>
              <select id="cs-category" value={selectedCategory?.value || ""}
                onChange={(e) => { const opt = categoryoptions.find(o => o.value === e.target.value); handleCategoryChange(null, opt || null); }}
                className={selectCls}>
                <option value="">Select category</option>
                {categoryoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setCategoryFormOpen(true)}>
              + Create Category
            </Button>
          </div>
        </div>
      </SideSheet>

      {/* ══════════ Category Sheet ══════════ */}
      <SideSheet
        open={isCategoryFormOpen}
        onOpenChange={(v) => !v && handleCategoryFormClose()}
        title="Create Category"
        size="sm"
        hideDefaultFooter
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="ghost" size="sm" onClick={handleCategoryFormClose}>Cancel</Button>
            <Button size="sm" onClick={createCategory}>Create</Button>
          </div>
        }
      >
        <div className="space-y-1.5">
          <Label htmlFor="cat-name">Category Name</Label>
          <Input id="cat-name" placeholder="e.g. Consulting"
            value={categorycreate} onChange={(e) => setcategorycreate(e.target.value)} />
        </div>
      </SideSheet>

      {/* ══════════ Edit Item Sheet ══════════ */}
      <SideSheet
        open={isEditDrawerOpen}
        onOpenChange={(v) => !v && handleEditDrawerClose()}
        title="Edit Line Item"
        size="sm"
        hideDefaultFooter
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="ghost" size="sm" onClick={handleEditDrawerClose}>Cancel</Button>
            <Button size="sm" onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Product or Service</Label>
            <Input value={selectedRowData?.productName || ""}
              onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={2} value={selectedRowData?.description || ""}
              onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Rate</Label>
              <Input value={selectedRowData?.rate || ""}
                onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>QTY</Label>
              <Input value={selectedRowData?.qty || ""}
                onChange={(e) => setSelectedRowData({ ...selectedRowData, qty: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input disabled value={totalamount} className="bg-muted cursor-not-allowed" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Taxable</Label>
            <Switch checked={selectedRowData?.tax || false} onCheckedChange={(checked) => handleServiceWitch(checked)} />
          </div>
        </div>
      </SideSheet>
    </>
  );
};

export default InvoiceDrawer;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Editor from "../Texteditor/Editor";
import axios from "axios";
import debounce from "lodash.debounce";
import { FormPage, FormSection, FormField, FormRow, FormGrid, FormDrawer, FormDrawerFooter, ShortcodePopover } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";

import { Eye, X, Plus, Percent, Pencil, Trash2, MoreVertical } from "lucide-react";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
const InvoiceTemp = () => {
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [clientNote, setClientNote] = useState("");
  const handleEditorChange = (content) => {
    setClientNote(content);
  };

  const handleCreateInvoiceTemp = () => {
    setShowForm(true);
  };
  const paymentsOptions = [
    { value: "Bank Debits", label: "Bank Debits" },
    { value: "Credit Card", label: "Credit Card" },
    { value: "Credit Card or Bank Debits", label: "Credit Card or Bank Debits" },
  ];

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

  //  for shortcodes
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [description, setDescription] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
 const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
  const handleDescriptions = (e) => {
    const { value,selectionStart  } = e.target;
    setDescription(value);
    setCursorPosition(selectionStart);
  };
  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  // const handleAddShortcut = (shortcut) => {
  //   setDescription((prevText) => prevText + `[${shortcut}]`);
  //   setShowDropdown(false);
  // };
  const handleAddShortcut = (shortcut) => {
    setDescription((prevText) => {
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

  //Integration

  const handleEdit = (_id) => {
    navigate("invoiceTempUpdate/" + _id);
  };
  //get all templateName Record
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchInvoiceTemplates = async () => {
    setLoading(true);
    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
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
    finally {
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };

  useEffect(() => {
    fetchInvoiceTemplates();
  }, []);

  const createInvoiceTemp = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      templatename: templatename,
      description: description,
      paymentMethod: paymentMode.value,
      sendEmailWhenInvCreated: emailToClient,
      messageForClient: clientmsg,
      payInvoicewithcredits: payUsingCredits,
      sendReminderstoClients: invoiceReminders,
      daysuntilnextreminder: daysNextReminder,
      numberOfreminder: numOfReminder,
      lineItems: lineItems,
      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },
      clientNote: clientNote,

      active: "true",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate`;
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((result) => {
        toast.success("InvoiceTemplate created successfully");

        if (result && result.message === "InvoiceTemplate created successfully") {
          setShowForm(false);
          fetchInvoiceTemplates();
          handleClear();
        }
      })
      .catch((error) => {
        const errorMessage = error.response && error.response.message ? error.response.message : "Failed to create InvoiceTemplate";
        toast.error(errorMessage);
      });
  };
  const createSaveInvoiceTemp = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      templatename: templatename,
      description: description,
      paymentMethod: paymentMode.value,
      sendEmailWhenInvCreated: emailToClient,
      messageForClient: clientmsg,
      payInvoicewithcredits: payUsingCredits,
      sendReminderstoClients: invoiceReminders,
      daysuntilnextreminder: daysNextReminder,
      numberOfreminder: numOfReminder,
      lineItems: lineItems,
      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },
      clientNote: clientNote,

      active: "true",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate`;
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Invoice created successfully");

        if (result && result.message === "InvoiceTemplate created successfully") {
          fetchInvoiceTemplates();
        }
      })
      .catch((error) => {
        const errorMessage = error.response && error.response.message ? error.response.message : "Failed to create InvoiceTemplate";
        toast.error(errorMessage);
      });
  };
  const [templatename, setTemplatename] = useState();

  const [paymentMode, setPaymentMode] = useState("");

  const handlePaymentOptionChange = (event, selectedOption) => {
    setPaymentMode(selectedOption);
  };
  const [emailToClient, setEmailToClient] = useState(false);
  const handleEmailToClient = (event) => {
    setEmailToClient(event.target.checked);
  };
  const [payUsingCredits, setPayUsingCredits] = useState(false);
  const handlePayUsingCredits = (event) => {
    setPayUsingCredits(event.target.checked);
  };
  const [invoiceReminders, setInvoiceReminders] = useState(false);
  const handleInvoiceReminders = (event) => {
    setInvoiceReminders(event.target.checked);
  };

  const lineItems = rows.map((item) => ({
    productorService: item.productName, // Assuming productName maps to productorService
    description: item.description,
    rate: item.rate.replace("$", ""), // Removing '$' sign from rate
    quantity: item.qty,
    amount: item.amount.replace("$", ""), // Removing '$' sign from amount
    tax: item.tax.toString(), // Converting boolean to string
  }));
  const [totalAmount, setTotalAmount] = useState(0);

  const [servicedata, setServiceData] = useState([]);
  const [daysNextReminder, setDaysNextReminder] = useState("3");
  const [numOfReminder, setnumOfReminder] = useState("1");

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
  }, [rows]);

  //delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this invoice template?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${_id}`;

      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          toast.success("Item deleted successfully");
          fetchInvoiceTemplates();
        })
        .catch((error) => {
          console.error(error);

          toast.error("Failed to delete item");
        });
    }
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
        const service = Array.isArray(result.serviceTemplate) ? result.serviceTemplate[0] : result.serviceTemplate;
        // const rate = typeof service.rate === 'number' ? service.rate : 0;
        const rate = service.rate ? parseFloat(service.rate.replace("$", "")) : 0;
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

        setRows(updatedRows);
      })
      .catch((error) => console.error(error));
  };
  const [serviceName, setServiceName] = useState("");
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

  const [subtotal, setSubtotal] = useState("");
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

  //shortcode for  switch btn

  const [showSwitchDropdown, setshowSwitchDropdown] = useState(false);
  const [switchfilteredShortcuts, setSwitchFilteredShortcuts] = useState([]);
  const [clientmsg, setClientmsg] = useState("");
  const [switchanchorEl, setSwitchAnchorEl] = useState(null);

  const toggleSwitchDropdown = (event) => {
    setSwitchAnchorEl(event.currentTarget);
    setshowSwitchDropdown(!showSwitchDropdown);
  };

  const handleSwitchAddShortcut = (shortcut) => {
    setClientmsg((prevText) => prevText + `[${shortcut}]`);
    setshowSwitchDropdown(false);
  };

  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setSwitchFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
  }, [shortcuts]);

  const handleClear = () => {
    setTemplatename("");
    setDescription("");
    setPaymentMode("");
    setPayUsingCredits(false);
    setEmailToClient(false);
    setInvoiceReminders(false);
    setClientmsg("");
    setselectedService("");
  };
  const [globalFilter, setGlobalFilter] = useState("");

  const invoiceColumns = useMemo(() => [
    {
      accessorKey: "templatename",
      header: "Name",
      cell: ({ getValue, row }) => (
        <button
          onClick={() => handleEdit(row.original._id)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
        >
          {getValue()}
        </button>
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
 
  const [templatenameError, setTemplatenameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const validateForm = () => {
    let isValid = true;

    if (!templatename) {
      setTemplatenameError("Template name is required");

      isValid = false;
    } else {
      setTemplatenameError("");
    }
    if (!description) {
      setDescriptionError("Please select a user");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    return isValid;
  };

  const [isFormDirty, setIsFormDirty] = useState(false);
  const handleCloseInvoiceTemp = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmClose) {
        return;
      }
    }
    setShowForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (templatename || description || paymentMode || emailToClient) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [templatename, description, paymentMode, emailToClient]);

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

      const rateValue = parseFloat(selectedRowData?.rate?.replace("$", "")) || 0;
      const qtyValue = parseInt(selectedRowData?.qty) || 0;
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
        productName: rows[selectedRow].productName ? `${rows[selectedRow].productName} Copy` : "Copy",
      };
      const updatedRows = [...rows, duplicatedRow];
      setRows(updatedRows);
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

    setTotalamount(`$${calculatedAmount.toFixed(2)}`);
  }, [selectedRowData?.rate, selectedRowData?.qty]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  
 const checkTemplateName = async (name) => {
     try {
       const res = await axios.get(`${INVOICE_API}/workflow/invoicetemp/check-name`, {
         params: { name },
       });
       if (res.data.exists) {
         setTemplatenameError('Template name already exists');
       } else {
         setTemplatenameError('');
       }
     } catch (err) {
       console.error(err);
       setTemplatenameError('');
     }
   };
 
  const debouncedCheck = debounce((name) => {
  if (typeof name === 'string' && name.trim()) {
    checkTemplateName(name);
  } else {
    setTemplatenameError('');
  }
}, 500);

 
   useEffect(() => {
     debouncedCheck(templatename);
     return debouncedCheck.cancel;
   }, [templatename]);
 
 
     return (
    <div>
      {!showForm ? (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <Button onClick={handleCreateInvoiceTemp}>
              {/* <Receipt className="mr-2 h-4 w-4" />  */}
               <Plus className="h-4 w-4" />
              Create New Invoice
            </Button>
          </div>

          <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
          <DataTable
            columns={invoiceColumns}
            data={invoiceTemplates}
            loading={loading}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            enableRowSelection={false}
            getRowId={(row) => row._id}
            emptyMessage="No invoice templates found"
            emptyDescription="Create your first invoice template to get started"
            pageSize={30}
          />
        </div>
      ) : (
        <>
        <FormPage
          title="Create Invoice Template"
          subtitle="Configure your invoice template settings"
          actions={
            <>
              <button
                type="button"
                onClick={handleOpen}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <Button variant="outline" onClick={handleCloseInvoiceTemp}>Cancel</Button>
              <Button variant="secondary" onClick={createSaveInvoiceTemp}>Save</Button>
              <Button onClick={createInvoiceTemp}>Save & Exit</Button>
            </>
          }
        >
          <FormGrid>
            {/* ===== LEFT COLUMN: Invoice Settings ===== */}
            <FormGrid.Main>
              <FormSection title="General">
                <FormField label="Template Name" error={templatenameError}>
                  <Input
                    name="TemplateName"
                    placeholder="Template Name"
                    value={templatename}
                    onChange={(e) => setTemplatename(e.target.value)}
                    error={!!templatenameError}
                  />
                </FormField>

                <FormField label="Description" error={descriptionError}>
                  <Input
                    ref={textFieldRef}
                    name="Description"
                    placeholder="Description"
                    value={description}
                    onChange={handleDescriptions}
                    onClick={(e) => setCursorPosition(e.target.selectionStart)}
                    maxLength={50000}
                    error={!!descriptionError}
                  />
                </FormField>

                <ShortcodePopover
                  shortcuts={filteredShortcuts}
                  onSelect={handleAddShortcut}
                  selectedOption={selectedOption}
                  onOptionChange={setSelectedOption}
                />

                <FormField label="Choose payment method">
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={paymentMode?.value || ""}
                    onChange={(e) => {
                      const selected = paymentsOptions.find(o => o.value === e.target.value);
                      handlePaymentOptionChange(null, selected);
                    }}
                  >
                    <option value="">Select Payment Mode</option>
                    {paymentsOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </FormField>
              </FormSection>

              <FormSection title="Email & Reminders">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Send email to client when invoice created</Label>
                    <Switch checked={emailToClient} onCheckedChange={(checked) => handleEmailToClient({ target: { checked } })} />
                  </div>
                  {emailToClient && (
                    <div className="space-y-3 pl-1">
                      <Input
                        value={clientmsg}
                        onChange={(e) => setClientmsg(e.target.value)}
                        placeholder="Message for client"
                      />
                      <ShortcodePopover
                        shortcuts={switchfilteredShortcuts}
                        onSelect={handleSwitchAddShortcut}
                        selectedOption={selectedOption}
                        onOptionChange={setSelectedOption}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Pay invoice with credits if available</Label>
                    <Switch checked={payUsingCredits} onCheckedChange={(checked) => handlePayUsingCredits({ target: { checked } })} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Send reminders to clients</Label>
                    <Switch checked={invoiceReminders} onCheckedChange={(checked) => handleInvoiceReminders({ target: { checked } })} />
                  </div>
                  {invoiceReminders && (
                    <div className="space-y-4 pl-1">
                      <FormField label="Days until next reminder">
                        <Input
                          placeholder="Days until next reminder"
                          value={daysNextReminder}
                          onChange={(e) => setDaysNextReminder(e.target.value)}
                        />
                      </FormField>
                      <FormField label="Number of reminders">
                        <Input
                          placeholder="Number of reminders"
                          value={numOfReminder}
                          onChange={(e) => setnumOfReminder(e.target.value)}
                        />
                      </FormField>
                    </div>
                  )}
                </div>
              </FormSection>
            </FormGrid.Main>

            {/* ===== RIGHT COLUMN: Line Items ===== */}
            <FormGrid.Sidebar>
              <FormSection title="Line Items">
                <p className="text-sm text-muted-foreground mb-4">Client-facing itemized list of products and services</p>

                <div className="overflow-x-auto rounded-lg border border-border bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="sticky left-0 bg-muted/50 px-3 py-2 text-left font-medium text-muted-foreground" style={{ minWidth: 180 }}>Product/Service</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground" style={{ minWidth: 140 }}>Description</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground" style={{ minWidth: 90 }}>Rate</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground" style={{ minWidth: 60 }}>Qty</th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground" style={{ minWidth: 90 }}>Amount</th>
                        <th className="px-3 py-2 text-center font-medium text-muted-foreground" style={{ minWidth: 48 }}>Tax</th>
                        <th className="px-3 py-2 w-10" />
                        <th className="px-3 py-2 w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index} className="border-b border-border last:border-0">
                          <td className="sticky left-0 bg-card px-2 py-1.5" style={{ minWidth: 180 }}>
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
                          <td className="px-2 py-1.5" style={{ minWidth: 140 }}>
                            <input type="text" name="description" value={row.description} onChange={(e) => handleInputChange(index, e)} className="w-full rounded border-0 bg-transparent px-1 py-1 text-sm outline-none focus:ring-1 focus:ring-ring" placeholder="Description" />
                          </td>
                          <td className="px-2 py-1.5 text-right" style={{ minWidth: 90 }}>
                            <input type="text" name="rate" value={row.rate} onChange={(e) => handleInputChange(index, e)} className="w-full rounded border-0 bg-transparent px-1 py-1 text-sm text-right outline-none focus:ring-1 focus:ring-ring" />
                          </td>
                          <td className="px-2 py-1.5 text-right" style={{ minWidth: 60 }}>
                            <input type="text" name="qty" value={row.qty} onChange={(e) => handleInputChange(index, e)} className="w-full rounded border-0 bg-transparent px-1 py-1 text-sm text-right outline-none focus:ring-1 focus:ring-ring" />
                          </td>
                          <td className="px-2 py-1.5 text-sm text-right font-medium" style={{ minWidth: 90 }}>{row.amount}</td>
                          <td className="px-2 py-1.5 text-center">
                            <input type="checkbox" name="tax" checked={row.tax} onChange={(e) => handleInputChange(index, e)} className="h-4 w-4 rounded border-gray-300" />
                          </td>
                          <td className="px-1 py-1.5">
                            <div className="relative">
                              <button type="button" onClick={(event) => handleMenuOpen(event, index)} className="rounded p-1 text-muted-foreground hover:bg-accent">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {Boolean(anchorElNew) && selectedRow === index && (
                                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border bg-card py-1 shadow-lg">
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

                <div className="flex items-center gap-4 mt-3">
                  <Button type="button" variant="ghost" size="sm" onClick={() => addRow()} className="text-primary">
                    <Plus className="h-4 w-4 mr-1" /> Line item
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => addRow(true)} className="text-primary">
                    <Percent className="h-4 w-4 mr-1" /> Discount
                  </Button>
                </div>

                {/* Summary */}
                <div className="mt-6">
                  <h4 className="text-base font-semibold mb-3">Summary</h4>
                  <div className="rounded-lg border border-border bg-card overflow-hidden">
                    <div className="grid grid-cols-4 divide-x divide-border">
                      <div className="px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Subtotal</p>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground">$</span>
                          <input
                            value={subtotal}
                            onChange={handleSubtotalChange}
                            className="w-full rounded border-0 bg-transparent px-0 py-0.5 text-sm font-medium text-foreground outline-none focus:ring-0"
                          />
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Tax Rate</p>
                        <div className="flex items-center gap-1">
                          <input
                            value={taxRate}
                            onChange={handleTaxRateChange}
                            className="w-full rounded border-0 bg-transparent px-0 py-0.5 text-sm font-medium text-foreground outline-none focus:ring-0"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Tax Total</p>
                        <p className="text-sm font-medium text-foreground">${taxTotal.toFixed(2)}</p>
                      </div>
                      <div className="px-4 py-3 bg-muted/40">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Total</p>
                        <p className="text-sm font-bold text-foreground">${totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Note to Client">
                <Editor onChange={handleEditorChange} initialContent={clientNote} />
              </FormSection>
            </FormGrid.Sidebar>
          </FormGrid>
        </FormPage>

        {/* ===== PREVIEW DRAWER ===== */}
        <FormDrawer open={open} onClose={handleClose} title="Preview" width="xl">
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-2xl font-bold text-orange-500 mb-4">Invoice</h2>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">[ACCOUNT_NAME]</span>
                <span className="text-sm">Invoice number: <span className="text-muted-foreground">[INVOICE_NUMBER]</span></span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">[CONTACT_NAME]</span>
                <span className="text-sm">Date: <span className="text-muted-foreground">[DATE]</span></span>
              </div>
              <p className="text-sm mt-4 mb-6">Description: {description}</p>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-orange-50/50">
                      <th className="px-3 py-2 text-left font-semibold">Product/Service</th>
                      <th className="px-3 py-2 text-left font-semibold">Description</th>
                      <th className="px-3 py-2 text-right font-semibold">Rate ($)</th>
                      <th className="px-3 py-2 text-right font-semibold">Qty</th>
                      <th className="px-3 py-2 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="px-3 py-2">{row.productName}</td>
                        <td className="px-3 py-2">{row.description}</td>
                        <td className="px-3 py-2 text-right">{row.rate || '$0.00'}</td>
                        <td className="px-3 py-2 text-right">{row.qty || '1'}</td>
                        <td className="px-3 py-2 text-right">{row.amount || '$0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-right space-y-1">
                <p className="text-sm"><strong>Subtotal:</strong> ${subtotal || '0.00'}</p>
                <p className="text-sm"><strong>Tax Rate:</strong> {taxRate || '0.00'}%</p>
                <p className="text-sm"><strong>Tax Total:</strong> ${taxTotal?.toFixed(2) || '0.00'}</p>
                <p className="text-sm font-bold mt-2"><strong>Total:</strong> ${totalAmount || '0.00'}</p>
              </div>

              <div className="mt-4 text-sm" dangerouslySetInnerHTML={{ __html: clientNote }} />
            </div>
          </div>
          <FormDrawerFooter>
            <Button onClick={createInvoiceTemp}>Save & Exit</Button>
          </FormDrawerFooter>
        </FormDrawer>

        {/* ===== CREATE SERVICE DRAWER ===== */}
        <FormDrawer open={isNewDrawerOpen} onClose={handleNewDrawerClose} title="Create Service" width="lg">
          <FormSection title="Service Details">
            <FormField label="Service Name">
              <Input
                placeholder="Service Name"
                value={selectedRowData?.productName || ""}
                onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })}
              />
            </FormField>
            <FormField label="Description">
              <Input
                placeholder="Description"
                value={selectedRowData?.description || ""}
                onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })}
              />
            </FormField>
            <FormRow cols={2}>
              <FormField label="Rate">
                <Input
                  placeholder="Rate"
                  value={selectedRowData?.rate || ""}
                  onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })}
                />
              </FormField>
              <FormField label="Rate Type">
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

        {/* ===== CATEGORY DRAWER ===== */}
        <FormDrawer open={isCategoryFormOpen} onClose={handleCategoryFormClose} title="Create Category" width="md">
          <FormSection>
            <FormField label="Category Name">
              <Input
                placeholder="Category Name"
                value={categorycreate}
                onChange={(e) => setcategorycreate(e.target.value)}
              />
            </FormField>
          </FormSection>
          <FormDrawerFooter>
            <Button variant="outline" onClick={handleCategoryFormClose}>Cancel</Button>
            <Button onClick={createCategory}>Create</Button>
          </FormDrawerFooter>
        </FormDrawer>

        {/* ===== EDIT ITEM DRAWER ===== */}
        <FormDrawer open={isEditDrawerOpen} onClose={handleEditDrawerClose} title="Edit Item" width="lg">
          <FormSection title="Product or Service">
            <FormField label="Product Name">
              <Input
                value={selectedRowData?.productName || ""}
                onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })}
              />
            </FormField>
            <FormField label="Description">
              <Input
                value={selectedRowData?.description || ""}
                onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })}
              />
            </FormField>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Rate">
                <Input
                  value={selectedRowData?.rate || ""}
                  onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })}
                />
              </FormField>
              <FormField label="QTY">
                <Input
                  value={selectedRowData?.qty || ""}
                  onChange={(e) => setSelectedRowData({ ...selectedRowData, qty: e.target.value })}
                />
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
        </>
      )}
    </div>
  );
};

export default InvoiceTemp;

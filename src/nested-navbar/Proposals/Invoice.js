import React, { useState, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import CreatableSelect from "react-select/creatable";
import Editor from "../../Templates/Texteditor/Editor";
import { RxCross2 } from "react-icons/rx";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
const Invoice = ({ charLimit = 4000, serviceandinvoiceSettings, serviceandinvoiceSettingonupdate }) => {
  //get all templateName Record

  const isSmallScreen = window.innerWidth < 600;
  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [description, setDescription] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [clientNote, setClientNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditorChange = (content) => {
    setClientNote(content);
  };

  const [servicedata, setServiceData] = useState([]);
  // add row
  const [rows, setRows] = useState([{ productName: "", description: "", rate: "$0.00", qty: "1", amount: "$0.00", tax: false, isDiscount: false }]);
  const addRow = (isDiscountRow = false) => {
    const newRow = isDiscountRow ? { productName: "", description: "", rate: "$-10.00", qty: "1", amount: "$-10.00", tax: false, isDiscount: true } : { productName: "", description: "", rate: "$0.00", qty: "1", amount: "$0.00", tax: false, isDiscount: false };
    setRows([...rows, newRow]);
    console.log("After adding row, rows:", [...rows, newRow]);
  };
  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length <= charLimit) {
      setDescription(value);
      setCharCount(value.length);
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
      console.log(data.invoiceTemplate);
    } catch (error) {
      console.error("Error fetching Invoice Templates:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceTemplates();
  }, []);

  // console.log(invoiceTemplates)
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
        console.log(result.invoiceTemplate.lineItems);
        setDescription(result.invoiceTemplate.description);
        setClientNote(result.invoiceTemplate.notetoclient);
        const lineitems = result.invoiceTemplate.lineItems.map((item) => ({
          // console.log(item);
          productName: item.productorService || "",
          description: item.description || "",
          rate: String(item.rate || "$0.00"), // Convert rate to string
          qty: String(item.quantity || "1"), // Convert qty to string
          amount: String(item.amount || "$0.00"), // Convert amount to string
          tax: item.tax || false,
          isDiscount: item.isDiscount || false,
        }));
        setRows(lineitems);

        if (result.invoiceTemplate.summary && result.invoiceTemplate.summary.taxRate) {
          setTaxRate(result.invoiceTemplate.summary.taxRate);
          console.log(result.invoiceTemplate.summary.taxRate);
        }
      })
      .catch((error) => console.error(error));
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
        console.log(result.serviceTemplate);

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

  // useEffect(() => {
  //   const calculateSubtotal = () => {
  //     let subtotal = 0;

  //     rows.forEach((row) => {
  //       subtotal += parseFloat(row.amount.replace("$", "")) || 0;
  //     });
  //     console.log(subtotal);
  //     setSubtotal(subtotal);
  //     calculateTotal(subtotal, taxRate);
  //   };
  //   calculateSubtotal();
  // }, [rows]);
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

  // const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  const invoiceissueoptions = ["on acceptance", "specific date"];
  const [issueInvoice, setIssueInvoice] = useState("on acceptance");
  const [dateTimeValue, setDateTimeValue] = useState(null);

  const handleIssueChange = (event, newValue) => {
    setIssueInvoice(newValue);
    // Reset dateTimeValue when switching back to "on acceptance"
    if (newValue === "on acceptance") {
      setDateTimeValue(null);
    }
  };

  const [startDate, setStartDate] = useState("");
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };
  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i === 0 ? 12 : i; // 12 AM for 0, otherwise use i
    const ampm = i < 12 ? "AM" : "PM";
    return `${hour}:00 ${ampm}`;
  });
  const [selectedTime, setSelectedTime] = useState(null);

  const [selecteduser, setSelectedUser] = useState("");
  const [userData, setUserData] = useState([]);
  const USER_API = process.env.REACT_APP_USER_URL;

  useEffect(() => {
    fetchUserData();
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchUserData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleuserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
  };
  const teammemberoption = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const lineItems = rows.map((item) => ({
    productorService: item.productName, // Assuming productName maps to productorService
    description: item.description,
    rate: item.rate.replace("$", ""), // Removing '$' sign from rate
    quantity: item.qty,
    amount: item.amount.replace("$", ""), // Removing '$' sign from amount
    tax: item.tax.toString(), // Converting boolean to string
  }));

  const handleSaveInvoice = () => {
    const serviceAndInvoice = {
      invoiceTempId: selectInvoiceTemp.value,
      invoiceTempName: selectInvoiceTemp.label,
      invoiceTeamMember: selecteduser.value,
      issueInvoiceSelect: issueInvoice,
      specificDate: startDate,
      specificTime: selectedTime,
      descriptionData: description,
      lineItems: lineItems,
      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },
      noteToClient: clientNote,
    };

    console.log("Service and Invoice Settings:", serviceAndInvoice);

    if (typeof serviceandinvoiceSettings === "function") {
      serviceandinvoiceSettings(serviceAndInvoice);
    }
  };

  // const handleSaveInvoice = () => {
  //   // Create an array to hold multiple invoices
  //   const invoicesArray = [];

  //   // Construct the serviceAndInvoice object
  //   const serviceAndInvoice = {
  //     invoiceTempId: selectInvoiceTemp.value,
  //     invoiceTempName: selectInvoiceTemp.label,
  //     invoiceTeamMember: selecteduser.value,
  //     issueInvoiceSelect: issueInvoice,
  //     specificDate: startDate,
  //     specificTime: selectedTime,
  //     descriptionData: description,
  //     lineItems: lineItems,
  //     summary: {
  //       subtotal: subtotal,
  //       taxRate: taxRate,
  //       taxTotal: taxTotal,
  //       total: totalAmount,
  //     },
  //     noteToClient: clientNote,
  //   };

  //   // Push the serviceAndInvoice object into the invoicesArray
  //   invoicesArray.push(serviceAndInvoice);

  //   console.log("Invoices Array:", invoicesArray);

  //   // If there's a function to handle the invoices array, pass the array to it
  //   if (typeof serviceandinvoiceSettings === "function") {
  //     serviceandinvoiceSettings(invoicesArray); // Send the array to the callback
  //   }
  // };

  const handleSaveInvoiceonUpdate = () => {
    const serviceAndInvoice = {
      invoiceTempId: selectInvoiceTemp.value,
      invoiceTempName: selectInvoiceTemp.label,
      invoiceTeamMember: selecteduser.value,
      issueInvoiceSelect: issueInvoice,
      specificDate: startDate,
      specificTime: selectedTime,
      descriptionData: description,
      lineItems: rows,
      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },
      noteToClient: clientNote,
    };
    console.log("Service and Invoice Settings:", serviceAndInvoice);
    if (typeof serviceandinvoiceSettingonupdate === "function") {
      serviceandinvoiceSettingonupdate(serviceAndInvoice);
    }
    setRows(rows);
  };

  console.log(isUpdating);

  useEffect(() => {
    fetchInvoiceTemplates();
    console.log(serviceandinvoiceSettings);

    if (!isUpdating && serviceandinvoiceSettings) {
      console.log("Received invoice settings:", serviceandinvoiceSettings);

      setIsUpdating(serviceandinvoiceSettings.isUpdating);
      setIssueInvoice(serviceandinvoiceSettings.issueinvoice);
      setDescription(serviceandinvoiceSettings.description);
      // setTaxRate(serviceandinvoiceSettings.summary.taxRate);
      setTaxRate(serviceandinvoiceSettings?.summary?.taxRate ?? 0);

      if (serviceandinvoiceSettings && Array.isArray(serviceandinvoiceSettings.lineItems)) {
        const formattedLineItems = serviceandinvoiceSettings.lineItems.map((item) => {
          console.log(item);
          // Declare variables outside the object literal
          const rate = !isNaN(parseFloat(item.rate)) ? parseFloat(item.rate).toFixed(2) : "0.00";
          const amount = !isNaN(parseFloat(item.amount)) ? parseFloat(item.amount).toFixed(2) : "0.00";

          console.log(rate);
          // Return the object literal
          return {
            productName: item.productorService || "", // Map productorService to productName
            description: item.description || "",
            rate: `$${rate}`, // Use formatted rate or fallback to '0.00'
            qty: String(item.quantity || "1"), // Convert quantity to string
            amount: `$${amount}`, // Use formatted amount or fallback to '0.00'
            tax: item.tax || false, // Tax is already a boolean
            isDiscount: false, // Add isDiscount field if needed
          };
        });
        setRows(formattedLineItems);
        
      } else {
        console.error("lineItems is either undefined or not an array");
      }
      setClientNote(serviceandinvoiceSettings.notetoclient);

      // Handle specific date and time if present
      if (serviceandinvoiceSettings.specificdate) {
        setStartDate(new Date(serviceandinvoiceSettings.specificdate));
      }
      if (serviceandinvoiceSettings.specifictime) {
        setSelectedTime(serviceandinvoiceSettings.specifictime);
      }

      // Set the invoice template name to dropdown
      if (serviceandinvoiceSettings.servicesandinvoicetempid) {
        const templateOption = {
          label: serviceandinvoiceSettings.servicesandinvoicetempid.templatename, // Display the template name
          value: serviceandinvoiceSettings.servicesandinvoicetempid._id, // Use _id as the value
        };
        setSelectedInvoiceTemp(templateOption); // Set this as the selected option
      } else {
        console.error("servicesandinvoicetempid is undefined");
      }

      // console.log(serviceandinvoiceSettings.invoiceteammember);

      // Handle invoiceteammember (single object)
      if (serviceandinvoiceSettings.invoiceteammember) {
        const userOption = {
          label: serviceandinvoiceSettings.invoiceteammember.username, // Display the username
          value: serviceandinvoiceSettings.invoiceteammember._id, // Use _id as the value
        };
        setSelectedUser(userOption); // Set this as the selected user option
      } else {
        console.error("invoiceteammember is undefined");
      }
    }

    // setIsUpdating(true);  // Mark as initialized
  }, [serviceandinvoiceSettings]);

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
  const inputCls = "w-full border border-gray-300 rounded px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-blue-400";
  const labelCls = "block text-sm text-gray-700 font-medium";
  const btnPrimary = "rounded-full px-5 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] w-20";
  const btnOutline = "rounded-full px-5 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white w-20";

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-2">Invoice</h2>
        <div className="p-4">
            {/* Invoice Template + Team Member */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>Invoice Template</label>
                <select value={selectInvoiceTemp?.value || ""}
                  onChange={(e) => { const opt = invoiceoptions.find(o => o.value === e.target.value); handleInvoiceTempChange(e, opt); }}
                  className={inputCls}>
                  <option value="">Invoice Template</option>
                  {invoiceoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Team Member</label>
                <select value={selecteduser?.value || ""}
                  onChange={(e) => { const opt = teammemberoption.find(o => o.value === e.target.value); handleuserChange(e, opt); }}
                  className={inputCls}>
                  <option value="">Team Member</option>
                  {teammemberoption.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Issue Invoice + Date + Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className={labelCls}>Issue invoice</label>
                <select value={issueInvoice} onChange={(e) => handleIssueChange(e, e.target.value)} className={inputCls}>
                  {invoiceissueoptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {issueInvoice === "specific date" && (
                <>
                  <div>
                    <label className={labelCls}>Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      className={inputCls + " mt-1"}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Time</label>
                    <select value={selectedTime || ""} onChange={(e) => setSelectedTime(e.target.value)} className={inputCls}>
                      <option value="">Select Time</option>
                      {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <div className="relative mt-3">
              <label className={labelCls}>Description</label>
              <textarea
                className={inputCls + " pr-16"}
                value={description}
                onChange={handleChange}
                placeholder="Description"
                rows={3}
              />
              <span className="absolute bottom-3 right-3 text-gray-400 text-xs">{charCount}/{charLimit}</span>
            </div>

            {/* Line Items */}
            <div className="mt-5 mb-2">
              <h3 className="text-base font-semibold">Line items</h3>
              <p className="text-xs text-gray-500">Client-facing itemized list of products and services</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 sticky left-0 bg-gray-50 font-medium">Product or service</th>
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
                    <tr key={index} className="relative">
                      <td className="px-2 py-1 sticky left-0 bg-white">
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
                      <td className="px-2 py-1 text-sm">{row.amount}</td>
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
              <button type="button" onClick={() => addRow()} className="flex items-center gap-1 text-blue-600 text-sm">
                <AiOutlinePlusCircle /> Line item
              </button>
              <button type="button" onClick={() => addRow(true)} className="flex items-center gap-1 text-blue-600 text-sm">
                <CiDiscount1 /> Discount
              </button>
            </div>

            {/* Summary */}
            <h3 className="text-base font-semibold mt-4 mb-2">Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium w-1/4">Subtotal</th>
                    <th className="text-left px-3 py-2 font-medium w-1/4">Tax Rate</th>
                    <th className="text-left px-3 py-2 font-medium w-1/4">Tax Total</th>
                    <th className="text-left px-3 py-2 font-medium w-1/4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2">
                      <div className="flex items-center">$
                        <input value={subtotal} onChange={handleSubtotalChange} className="border-none outline-none text-sm w-20 ml-1" />
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center">
                        <input value={taxRate} onChange={handleTaxRateChange} className="border-none outline-none text-sm w-16" />%
                      </div>
                    </td>
                    <td className="px-3 py-2">${taxTotal.toFixed(2)}</td>
                    <td className="px-3 py-2">${totalAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-1/2 mt-6 mb-8">
              <Editor onChange={handleEditorChange} initialContent={clientNote} />
            </div>

            <Button type="button" onClick={isUpdating ? handleSaveInvoiceonUpdate : handleSaveInvoice}>
              {isUpdating ? "Update Invoice" : "Save Invoice"}
            </Button>
          </div>
        </div>

      {/* Create Service Drawer */}
      {isNewDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" onClick={handleNewDrawerClose} />
          <div className={`absolute right-0 top-0 h-full bg-white shadow-xl overflow-y-auto ${isSmallScreen ? "w-full" : "w-[650px]"}`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <h2 className="text-base font-semibold">Create Service</h2>
              <RxCross2 onClick={handleNewDrawerClose} className="cursor-pointer text-gray-500" />
            </div>
            <form className="m-4 space-y-4">
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
              <div className="flex items-center gap-4">
                <div className="w-1/2">
                  <label className={labelCls}>Rate</label>
                  <input type="text" placeholder="Rate" className={inputCls}
                    value={selectedRowData?.rate || ""}
                    onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
                </div>
                <div className="w-1/2">
                  <label className={labelCls}>Rate Type</label>
                  <select value={selectedRateOption?.value || ""}
                    onChange={(e) => { const opt = options.find(o => o.value === e.target.value); handleRateTypeChange(e, opt); }}
                    className={inputCls}>
                    <option value="">Select Rate Type</option>
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedRowData?.tax || false}
                    onChange={(e) => handleServiceSwitch(e.target.checked)}
                    className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <span className="text-sm text-gray-700">Tax</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mt-4">Category</h3>
                <label className={labelCls + " mt-3"}>Category Name</label>
                <select value={selectedCategory?.value || ""}
                  onChange={(e) => { const opt = categoryoptions.find(o => o.value === e.target.value); handleCategoryChange(e, opt); }}
                  className={inputCls}>
                  <option value="">Category Name</option>
                  {categoryoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <Button type="button" size="sm" className="mt-4 ml-1" onClick={() => setCategoryFormOpen(true)}>
                  Create category
                </Button>
              </div>
              <div className="flex gap-4 pt-4 ml-1">
                <Button type="button" size="sm" onClick={createservicetemp}>Save</Button>
                <Button type="button" size="sm" variant="outline" onClick={handleNewDrawerClose}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Drawer */}
      {isCategoryFormOpen && (
        <div className="fixed inset-0 z-[60] overflow-hidden">
          <div className="absolute inset-0 bg-black/30" onClick={handleCategoryFormClose} />
          <div className={`absolute right-0 top-0 h-full bg-white shadow-xl overflow-y-auto ${isSmallScreen ? "w-full" : "w-[650px]"}`}>
            <div className="flex items-center justify-between p-5">
              <button type="button" onClick={handleCategoryFormClose} className="text-gray-500 hover:text-gray-700">
                <IoArrowBack size={20} />
              </button>
            </div>
            <hr className="border-gray-200" />
            <div className="p-6">
              <label className={labelCls + " mt-4"}>Category Name</label>
              <input type="text" placeholder="Category Name" className={inputCls}
                value={categorycreate} onChange={(e) => setcategorycreate(e.target.value)} />
            </div>
            <div className="flex gap-5 ml-6 pb-4">
              <Button type="button" size="sm" onClick={createCategory}>Create</Button>
              <Button type="button" size="sm" variant="outline" onClick={handleCategoryFormClose}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Drawer */}
      {isEditDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" onClick={handleEditDrawerClose} />
          <div className={`absolute right-0 top-0 h-full bg-white shadow-xl overflow-y-auto ${isSmallScreen ? "w-full" : "w-[650px]"}`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <h2 className="text-base font-semibold">Edit Item</h2>
              <RxCross2 onClick={handleEditDrawerClose} className="cursor-pointer text-gray-500" />
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-bold">Product or service</p>
                <input type="text" className={inputCls} value={selectedRowData?.productName || ""}
                  onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
              </div>
              <div>
                <p className="text-sm">Description</p>
                <textarea className={inputCls} rows={2} value={selectedRowData?.description || ""}
                  onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm">Rate</p>
                  <input type="text" className={inputCls} value={selectedRowData?.rate || ""}
                    onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
                </div>
                <div className="flex-1">
                  <p className="text-sm">QTY</p>
                  <input type="text" className={inputCls} value={selectedRowData?.qty || ""}
                    onChange={(e) => setSelectedRowData({ ...selectedRowData, qty: e.target.value })} />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Amount</p>
                  <input type="text" className={inputCls + " bg-gray-100 cursor-not-allowed"} disabled value={totalamount} />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={selectedRowData?.tax || false}
                    onChange={(e) => handleServiceWitch(e.target.checked)}
                    className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <span className="text-sm text-gray-700">Tax</span>
              </div>
              <div className="flex gap-3 mt-4">
                <Button type="button" size="sm" onClick={handleSaveChanges}>Save</Button>
                <Button type="button" size="sm" variant="outline" onClick={handleEditDrawerClose}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Invoice;

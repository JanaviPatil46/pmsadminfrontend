import React, { useState, useEffect, useContext, useRef } from "react";
import { LoginContext } from "../../Sidebar/Context/Context";
import { Plus, Tag, Pencil, Trash2, X, Eye, ChevronLeft, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { SideSheet } from "../../components/ui/side-sheet";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { cn } from "../../lib/utils";

const ServiceComboCell = ({ row, index, serviceoptions, onServiceChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-between rounded border border-transparent px-1.5 py-1 text-xs text-left transition-colors",
            "hover:border-input hover:bg-muted/30 focus:outline-none focus:ring-1 focus:ring-ring",
            !row.productName && "text-muted-foreground"
          )}
        >
          <span className="truncate">{row.productName || (row.isDiscount ? "Reason for discount" : "Product or Service")}</span>
          <ChevronsUpDown size={11} className="shrink-0 ml-1 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-56" align="start" sideOffset={2}>
        <Command>
          <CommandInput placeholder="Search…" className="h-8 text-xs" />
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty><span className="text-xs text-muted-foreground px-2">No services found</span></CommandEmpty>
            <CommandGroup>
              {serviceoptions.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => { onServiceChange(index, opt); setOpen(false); }}
                  className="text-xs cursor-pointer"
                >
                  <Check size={11} className={cn("mr-1.5 shrink-0", row.productName === opt.label ? "opacity-100" : "opacity-0")} />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const labelCls = "block text-sm font-medium text-foreground mb-1";

const CreateInvoice = ({ charLimit = 4000, onClose }) => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const SERVICE_API = process.env.REACT_APP_SERVICES_URL;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;

  const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
  const CATEGORY_API = process.env.REACT_APP_CATEGORY_URL;
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

  const { data } = useParams();
  const { logindata } = useContext(LoginContext);

  // ── Core form state ──────────────────────────────────────────────
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
  const [paymentMode, setPaymentMode] = useState("Bank Debits");
  const [selectInvoiceTemp, setSelectedInvoiceTemp] = useState(null);
  const [startDate, setStartDate] = useState(dayjs());
  const [selecteduser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [rows, setRows] = useState([]);
  const [servicedata, setServiceData] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState({ lineItems: "" });
  const [firstContactEmail, setFirstContactEmail] = useState("");

  // ── Sub-drawer state ─────────────────────────────────────────────
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [totalamount, setTotalamount] = useState("");
  const [selectedRateOption, setSelectedRateOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [categorycreate, setcategorycreate] = useState("");

  // ── Shortcode state ──────────────────────────────────────────────
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);

  const paymentsOptions = ["Bank Debits", "Credit Card", "Credit Card or Bank Debits"];
  const Rateoptions = [{ label: "Item", value: "item" }, { label: "Hour", value: "hour" }];

  // ── Fetch invoice number ─────────────────────────────────────────
  useEffect(() => {
    fetchAccountData();
    fetchNextInvoiceNumber();
    fetchInvoiceTemplates();
    fetchServiceData();
    fetchData();
    fetchCategoryData();
    fetchInvoiceData();
  }, []);

  const fetchNextInvoiceNumber = async () => {
    try {
      setIsLoadingInvoiceNumber(true);
      const res = await fetch(`${INVOICE_NEW}/workflow/invoices/next-invoice-number`);
      const d = await res.json();
      setinvoicenumber(d.nextInvoiceNumber.toString());
    } catch {
      setinvoicenumber("Auto-generated");
      toast.error("Failed to load invoice number");
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
      if (storedUserRole === "Admin") {
        url = "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
      } else {
        url = viewAllAccounts === true
          ? "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
          : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=true`;
      }
      const res = await fetch(url);
      const accdata = await res.json();
      const accounts = Array.isArray(accdata.accountlist)
        ? accdata.accountlist
        : Array.isArray(accdata.teamAccounts) ? accdata.teamAccounts : [];
      setaccountdata(accounts);
      const sel = accounts.find((a) => a._id === data);
      if (sel) setSelectedaccount({ label: sel.accountName, value: sel._id });
    } catch (e) { console.error(e); }
  };

  const fetchInvoiceTemplates = async () => {
    try {
      const res = await fetch(`${INVOICE_API}/workflow/invoicetemp/invoicetemplate`);
      const d = await res.json();
      setInvoiceTemplates(d.invoiceTemplate || []);
    } catch (e) { console.error(e); }
  };

  const fetchServiceData = async () => {
    try {
      const res = await fetch(`${SERVICE_API}/workflow/services/servicetemplate`);
      const d = await res.json();
      setServiceData(d.serviceTemplate || []);
    } catch (e) { console.error(e); }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`);
      const d = await res.json();
      setUserData(d);
      if (logindata?.user?.id && Array.isArray(d)) {
        const cur = d.find((u) => u._id === logindata.user.id);
        if (cur) setSelectedUser({ value: cur._id, label: cur.username });
      }
    } catch (e) { console.error(e); }
  };

  const fetchCategoryData = async () => {
    try {
      const res = await fetch(`${CATEGORY_API}/workflow/category/categorys`);
      const d = await res.json();
      setCategoryData(d.category || []);
    } catch (e) { console.error(e); }
  };

  const fetchInvoiceData = async () => {
    try {
      const res = await fetch(`${INVOICE_NEW}/workflow/invoices/invoice`);
      const d = await res.json();
    } catch (e) { console.error(e); }
  };

  const accountoptions = accountdata.map((a) => ({ value: a._id, label: a.accountName }));
  const invoiceoptions = invoiceTemplates.map((t) => ({ value: t._id, label: t.templatename }));
  const serviceoptions = servicedata.map((s) => ({ value: s._id, label: s.serviceName }));
  const useroptions = userData.map((u) => ({ value: u._id, label: u.username }));
  const categoryoptions = categoryData.map((c) => ({ value: c._id, label: c.categoryName }));

  // ── Invoice template apply ───────────────────────────────────────
  const fetchinvoicetempbyid = async (id) => {
    try {
      const res = await fetch(`${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${id}`);
      const d = await res.json();
      const t = d.invoiceTemplate;
      setDescription(t.description || "");
      setCharCount((t.description || "").length);
      setIsPayInvoice(t.payInvoicewithcredits || false);
      setIsEmailInvoice(t.sendEmailWhenInvCreated || false);
      setReminders(t.sendReminderstoClients || false);
      setPaymentMode(t.paymentMethod || "Bank Debits");
      const lineitems = (t.lineItems || []).map((item) => ({
        productName: item.productorService || "",
        description: item.description || "",
        rate: String(item.rate || "$0.00"),
        qty: String(item.quantity || "1"),
        amount: String(item.amount || "$0.00"),
        tax: item.tax || false,
        isDiscount: item.isDiscount || false,
      }));
      setRows(lineitems);
      setSubtotal(t.summary?.subtotal || 0);
      setTaxRate(t.summary?.taxRate || 0);
      setTaxTotal(t.summary?.taxTotal || 0);
      setTotalAmount(t.summary?.total || 0);
    } catch (e) { console.error(e); }
  };

  // ── Service row fetch ────────────────────────────────────────────
  const fetchservicebyid = async (id, rowIndex) => {
    try {
      const res = await fetch(`${SERVICE_API}/workflow/services/servicetemplate/${id}`);
      const result = await res.json();
      const service = Array.isArray(result.serviceTemplate) ? result.serviceTemplate[0] : result.serviceTemplate;
      const rate = service.rate ? parseFloat(service.rate.replace("$", "")) : 0;
      const updatedRow = {
        productName: service.serviceName || "",
        description: service.description || "",
        rate: `$${rate.toFixed(2)}`,
        qty: "1",
        amount: `$${rate.toFixed(2)}`,
        tax: service.tax || false,
        isDiscount: false,
      };
      setRows((prev) => { const r = [...prev]; r[rowIndex] = { ...r[rowIndex], ...updatedRow }; return r; });
    } catch (e) { console.error(e); }
  };

  const handleServiceChange = (index, opt) => {
    const newRows = [...rows];
    newRows[index].productName = opt ? opt.label : "";
    setRows(newRows);
    if (opt?.value) fetchservicebyid(opt.value, index);
  };

  // ── Input / row handlers ─────────────────────────────────────────
  const handleInputChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    const newRows = [...rows];
    if (name === "rate" || name === "qty") {
      newRows[index][name] = newValue;
      const r = parseFloat(newRows[index].rate.replace("$", "")) || 0;
      const q = parseInt(newRows[index].qty) || 0;
      newRows[index].amount = `$${(r * q).toFixed(2)}`;
    } else {
      newRows[index][name] = newValue;
    }
    setRows(newRows);
  };

  const addRow = (isDiscountRow = false) => {
    setRows([...rows, isDiscountRow
      ? { productName: "", description: "", rate: "$-10.00", qty: "1", amount: "$-10.00", tax: false, isDiscount: true }
      : { productName: "", description: "", rate: "$0.00", qty: "1", amount: "$0.00", tax: false, isDiscount: false }
    ]);
  };

  const deleteRow = (index) => setRows(rows.filter((_, i) => i !== index));

  // ── Summary auto-calc ────────────────────────────────────────────
  useEffect(() => {
    let sub = 0, taxable = 0;
    rows.forEach((row) => {
      const amount = parseFloat(row.amount.replace("$", "")) || 0;
      sub += amount;
      if (row.tax) taxable += amount;
    });
    const tax = taxable * (taxRate / 100);
    setSubtotal(sub);
    setTaxTotal(tax);
    setTotalAmount((sub + tax).toFixed(2));
  }, [rows, taxRate]);

  // ── Edit row drawer ──────────────────────────────────────────────
  const handleEditService = (row, index) => {
    setSelectedRowData(row);
    setSelectedRowIndex(index);
    setIsEditDrawerOpen(true);
  };

  useEffect(() => {
    const rate = parseFloat(selectedRowData?.rate?.replace("$", "")) || 0;
    const qty = selectedRowData?.qty || 0;
    setTotalamount(`$${(rate * qty).toFixed(2)}`);
  }, [selectedRowData?.rate, selectedRowData?.qty]);

  const handleSaveChanges = () => {
    if (selectedRowIndex !== null) {
      const updatedRows = [...rows];
      const rateValue = parseFloat(selectedRowData.rate.replace(/[^0-9.-]+/g, ""));
      const qtyValue = parseInt(selectedRowData.qty) || 0;
      updatedRows[selectedRowIndex] = { ...selectedRowData, amount: `$${(rateValue * qtyValue).toFixed(2)}` };
      setRows(updatedRows);
    }
    setIsEditDrawerOpen(false);
  };

  const handleSaveAsNewService = (row) => {
    setSelectedRowData(row);
    setIsNewDrawerOpen(true);
  };

  // ── Shortcodes ───────────────────────────────────────────────────
  const accountShortcuts = [
    { title: "Account Shortcodes", isBold: true },
    { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
    { title: "Date Shortcodes", isBold: true },
    { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
    { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
    { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
    { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
  ];

  useEffect(() => {
    setShortcuts(accountShortcuts);
    setFilteredShortcuts(accountShortcuts);
  }, []);

  const handleAddShortcut = (value) => {
    if (!value) return;
    const updated = description + `[${value}]`;
    if (updated.length <= charLimit) { setDescription(updated); setCharCount(updated.length); }
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    const v = e.target.value;
    if (v.length <= charLimit) { setDescription(v); setCharCount(v.length); }
  };

  // ── Contact email fetch ──────────────────────────────────────────
  useEffect(() => {
    if (!selectedaccount?.value) return;
    fetch(`https://www.snptaxes.com/api/accounts/${selectedaccount.value}`)
      .then((r) => r.json())
      .then((result) => {
        const email = result.contacts?.[0]?.contact?.email;
        setFirstContactEmail(email || "[CONTACT EMAIL]");
      })
      .catch(() => setFirstContactEmail("[CONTACT EMAIL]"));
  }, [selectedaccount]);

  // ── Create invoice ───────────────────────────────────────────────
  const lineItems = rows.map((item) => ({
    productorService: item.productName,
    description: item.description,
    rate: item.rate.replace("$", ""),
    quantity: item.qty,
    amount: item.amount.replace("$", ""),
    tax: item.tax.toString(),
  }));

  const validateInvoice = () => {
    if (!lineItems.length) { setErrors({ lineItems: "At least one line item is required" }); return false; }
    setErrors({ lineItems: "" });
    return true;
  };

  const createinvoice = () => {
    if (!validateInvoice()) return;
    const payload = {
      account: selectedaccount?.value,
      invoicenumber,
      invoicedate: startDate,
      description,
      invoicetemplate: selectInvoiceTemp?.value,
      paymentMethod: paymentMode,
      teammember: selecteduser?.value,
      emailinvoicetoclient: emailInvoice,
      scheduleinvoicedate: new Date(),
      scheduleinvoicetime: new Date().toLocaleTimeString("en-US", { hour12: false }),
      payInvoicewithcredits: payInvoice,
      reminders,
      scheduleinvoice: scheduledInvoice,
      daysuntilnextreminder: 3,
      numberOfreminder: 1,
      lineItems,
      summary: { subtotal, taxRate, taxTotal, total: totalAmount },
      active: "true",
      paidAmount: 0,
      invoiceStatus: "Pending",
      balanceDueAmount: "",
    };
    fetch(`${INVOICE_NEW}/workflow/invoices/invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result?.message === "Invoice created successfully") {
          toast.success("Invoice created successfully");
          onClose();
        } else {
          toast.error(result.message || "Failed to create invoice");
        }
      })
      .catch(console.error);
  };

  // ── Service template create ──────────────────────────────────────
  const createservicetemp = () => {
    fetch(`${SERVICE_API}/workflow/services/servicetemplate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceName: selectedRowData?.productName,
        description: selectedRowData?.description,
        rate: selectedRowData?.rate,
        ratetype: selectedRateOption,
        tax: selectedRowData?.tax,
        category: selectedCategory?.value || null,
        active: "true",
      }),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result?.message === "ServiceTemplate created successfully") {
          toast.success("ServiceTemplate created successfully");
          setIsNewDrawerOpen(false);
        } else {
          toast.error(result.message || "Failed to create service");
        }
      })
      .catch(console.error);
  };

  const createCategory = () => {
    fetch(`${CATEGORY_API}/workflow/category/newcategory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryName: categorycreate }),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result?.message === "Category created successfully") {
          toast.success("Category created successfully");
          setCategoryFormOpen(false);
          fetchCategoryData();
          setcategorycreate("");
        } else {
          toast.error(result.message || "Failed to create category");
        }
      })
      .catch(console.error);
  };

  const toggleSwitch = (setter) => (val) => setter(val);

  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-background">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Create Invoice</h2>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setPreviewOpen(true)} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
            <Eye size={14} /> Preview
          </button>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

        {/* ── Basic Info ── */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Account</label>
            <select className={inputCls} value={selectedaccount?.value || ""} onChange={(e) => {
              const opt = accountoptions.find((o) => o.value === e.target.value);
              setSelectedaccount(opt || null);
            }}>
              <option value="">Select Account</option>
              {accountoptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Invoice Template</label>
            <select className={inputCls} value={selectInvoiceTemp?.value || ""} onChange={(e) => {
              const opt = invoiceoptions.find((o) => o.value === e.target.value);
              setSelectedInvoiceTemp(opt || null);
              if (opt) fetchinvoicetempbyid(opt.value);
            }}>
              <option value="">Select template (optional)</option>
              {invoiceoptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Invoice Number</label>
            <input
              type="text"
              className={cn(inputCls, "bg-muted/40 cursor-not-allowed")}
              value={isLoadingInvoiceNumber ? "Loading…" : invoicenumber}
              readOnly
              disabled={isLoadingInvoiceNumber}
            />
            <p className="text-xs text-muted-foreground mt-1">Auto-generated</p>
          </div>
          <div>
            <label className={labelCls}>Payment Method</label>
            <select className={inputCls} value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
              {paymentsOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Date</label>
            <input type="date" className={inputCls} value={startDate ? startDate.format("YYYY-MM-DD") : ""} onChange={(e) => setStartDate(dayjs(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>Team Member</label>
            <select className={inputCls} value={selecteduser?.value || ""} onChange={(e) => {
              const opt = useroptions.find((o) => o.value === e.target.value);
              setSelectedUser(opt || null);
            }}>
              <option value="">Select team member</option>
              {useroptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* ── Description ── */}
        <div className="relative">
          <label className={labelCls}>Description</label>
          <textarea className={cn(inputCls, "min-h-[80px] resize-none pb-6")} value={description} onChange={handleChange} placeholder="Description" />
          <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">{charCount}/{charLimit}</span>
        </div>

        {/* Shortcode button */}
        <div className="relative">
          <Button type="button" variant="outline" size="sm" onClick={() => setShowDropdown((p) => !p)}>Add Shortcode</Button>
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowDropdown(false)} />
              <div className="absolute z-30 mt-1 w-64 max-h-64 overflow-y-auto bg-card border border-border rounded-lg shadow-lg py-1">
                {filteredShortcuts.map((sc, i) => (
                  <button key={i} type="button" onClick={() => handleAddShortcut(sc.value)}
                    className={cn("w-full text-left px-4 py-1.5 text-xs hover:bg-muted transition-colors", sc.isBold ? "font-semibold text-foreground" : "text-muted-foreground")}>
                    {sc.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Toggles ── */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Additional</p>
          {[
            { label: "Pay invoice using client credits", val: payInvoice, set: setIsPayInvoice },
            { label: "Email invoice to client", val: emailInvoice, set: setIsEmailInvoice },
            { label: "Reminders", val: reminders, set: setReminders },
            { label: "Scheduled invoice", val: scheduledInvoice, set: setScheduledInvoice },
          ].map(({ label, val, set }) => (
            <label key={label} className="flex items-center gap-3 cursor-pointer select-none">
              <div onClick={() => set(!val)} className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", val ? "bg-primary" : "bg-muted")}>
                <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform", val ? "translate-x-4" : "translate-x-1")} />
              </div>
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
        </div>

        {/* ── Line Items ── */}
        <div>
          <div className="mb-2">
            <p className="text-sm font-semibold text-foreground">Line Items</p>
            <p className="text-xs text-muted-foreground">Client-facing itemized list of products and services</p>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm table-fixed">
              <colgroup>
                <col className="w-[28%]" />
                <col className="w-[22%]" />
                <col className="w-[10%]" />
                <col className="w-[8%]" />
                <col className="w-[10%]" />
                <col className="w-[6%]" />
                <col className="w-[16%]" />
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
                    <td className="px-2 py-1.5">
                      <ServiceComboCell row={row} index={index} serviceoptions={serviceoptions} onServiceChange={handleServiceChange} />
                    </td>
                    <td className="px-2 py-1.5">
                      <input type="text" name="description" value={row.description} onChange={(e) => handleInputChange(index, e)}
                        className="w-full border-none outline-none text-xs bg-transparent text-foreground placeholder:text-muted-foreground" placeholder="Description" />
                    </td>
                    <td className="px-2 py-1.5">
                      <input type="text" name="rate" value={row.rate} onChange={(e) => handleInputChange(index, e)}
                        className="w-full border-none outline-none text-xs bg-transparent text-foreground" />
                    </td>
                    <td className="px-2 py-1.5">
                      <input type="text" name="qty" value={row.qty} onChange={(e) => handleInputChange(index, e)}
                        className="w-full border-none outline-none text-xs bg-transparent text-foreground" />
                    </td>
                    <td className={cn("px-2 py-1.5 text-xs font-medium", row.isDiscount ? "text-destructive" : "text-foreground")}>{row.amount}</td>
                    <td className="px-2 py-1.5">
                      <input type="checkbox" name="tax" checked={row.tax} onChange={(e) => handleInputChange(index, e)} className="h-4 w-4 accent-primary" />
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="flex items-center justify-end gap-0.5">
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10" title="Edit" onClick={() => handleEditService(row, index)}>
                          <Pencil size={13} />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="Save as service" onClick={() => handleSaveAsNewService(row)}>
                          <Tag size={13} />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10" title="Delete" onClick={() => deleteRow(index)}>
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-5 mt-3">
            <button type="button" onClick={() => addRow()} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
              <Plus size={13} /> Line item
            </button>
            <button type="button" onClick={() => addRow(true)} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
              <Tag size={13} /> Discount
            </button>
          </div>
          {errors.lineItems && <p className="text-xs text-destructive mt-1">{errors.lineItems}</p>}
        </div>

        {/* ── Summary ── */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">Summary</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subtotal</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tax Rate</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tax Total</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 text-foreground text-sm">
                    $<input type="number" value={subtotal} onChange={(e) => { const v = parseFloat(e.target.value) || 0; setSubtotal(v); const tax = v * (taxRate / 100); setTaxTotal(tax); setTotalAmount((v + tax).toFixed(2)); }}
                      className="w-20 bg-transparent outline-none border-b border-border focus:border-primary" />
                  </td>
                  <td className="px-4 py-2 text-foreground text-sm">
                    <input type="number" value={taxRate} onChange={(e) => { const v = parseFloat(e.target.value) || 0; setTaxRate(v); const tax = subtotal * (v / 100); setTaxTotal(tax); setTotalAmount((subtotal + tax).toFixed(2)); }}
                      className="w-16 bg-transparent outline-none border-b border-border focus:border-primary" />%
                  </td>
                  <td className="px-4 py-2 text-foreground text-sm">${typeof taxTotal === "number" ? taxTotal.toFixed(2) : taxTotal}</td>
                  <td className="px-4 py-2 font-semibold text-foreground text-sm">${totalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-3 pt-2 pb-6">
          <Button onClick={createinvoice}>Save</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>

      {/* ── Preview SideSheet ── */}
      <SideSheet
        open={previewOpen}
        onOpenChange={(o) => !o && setPreviewOpen(false)}
        title="Invoice Preview"
        size="lg"
        hideDefaultFooter
        footer={
          <Button onClick={createinvoice}>Save &amp; Exit</Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{selectedaccount?.label || "[ACCOUNT NAME]"}</p>
              <p className="text-xs text-muted-foreground">{firstContactEmail || "[CONTACT EMAIL]"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Invoice #: <span className="text-foreground">{invoicenumber}</span></p>
              <p className="text-xs text-muted-foreground">Date: <span className="text-foreground">{startDate ? startDate.format("YYYY-MM-DD") : ""}</span></p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Description: {description}</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Product/Service</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Description</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">Rate</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">Qty</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="px-4 py-2 text-sm text-foreground">{row.productName}</td>
                    <td className="px-4 py-2 text-sm text-muted-foreground">{row.description}</td>
                    <td className="px-4 py-2 text-sm text-foreground text-right">{row.rate}</td>
                    <td className="px-4 py-2 text-sm text-foreground text-right">{row.qty}</td>
                    <td className="px-4 py-2 text-sm text-foreground text-right">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ml-auto w-full max-w-xs rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm divide-y divide-border">
              <tbody>
                <tr><td className="px-4 py-2 font-medium text-foreground">Subtotal</td><td className="px-4 py-2 text-right text-foreground">${subtotal}</td></tr>
                <tr><td className="px-4 py-2 font-medium text-foreground">Tax Rate</td><td className="px-4 py-2 text-right text-foreground">{taxRate}%</td></tr>
                <tr><td className="px-4 py-2 font-medium text-foreground">Tax Total</td><td className="px-4 py-2 text-right text-foreground">${typeof taxTotal === "number" ? taxTotal.toFixed(2) : taxTotal}</td></tr>
                <tr className="bg-muted/30"><td className="px-4 py-2 font-bold text-foreground">Total</td><td className="px-4 py-2 text-right font-bold text-foreground">${totalAmount}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </SideSheet>

      {/* ── Edit Item SideSheet ── */}
      <SideSheet
        open={isEditDrawerOpen}
        onOpenChange={(o) => !o && setIsEditDrawerOpen(false)}
        title="Edit Item"
        size="md"
        onConfirm={handleSaveChanges}
        onCancel={() => setIsEditDrawerOpen(false)}
        confirmLabel="Save"
      >
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Product or Service</label>
            <input type="text" className={inputCls} value={selectedRowData?.productName || ""}
              onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea className={cn(inputCls, "min-h-[80px] resize-none")} value={selectedRowData?.description || ""}
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
              <input type="text" className={cn(inputCls, "bg-muted/40 cursor-not-allowed")} value={totalamount} disabled readOnly />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div onClick={() => setSelectedRowData({ ...selectedRowData, tax: !selectedRowData?.tax })}
              className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", selectedRowData?.tax ? "bg-primary" : "bg-muted")}>
              <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform", selectedRowData?.tax ? "translate-x-4" : "translate-x-1")} />
            </div>
            <span className="text-sm text-foreground">Tax</span>
          </label>
        </div>
      </SideSheet>

      {/* ── Save as New Service SideSheet ── */}
      <SideSheet
        open={isNewDrawerOpen}
        onOpenChange={(o) => !o && setIsNewDrawerOpen(false)}
        title="Create Service"
        size="md"
        onConfirm={createservicetemp}
        onCancel={() => setIsNewDrawerOpen(false)}
        confirmLabel="Save"
      >
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Service Name</label>
            <input type="text" className={inputCls} placeholder="Service Name" value={selectedRowData?.productName || ""}
              onChange={(e) => setSelectedRowData({ ...selectedRowData, productName: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <input type="text" className={inputCls} placeholder="Description" value={selectedRowData?.description || ""}
              onChange={(e) => setSelectedRowData({ ...selectedRowData, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Rate</label>
              <input type="text" className={inputCls} placeholder="Rate" value={selectedRowData?.rate || ""}
                onChange={(e) => setSelectedRowData({ ...selectedRowData, rate: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Rate Type</label>
              <select className={inputCls} value={selectedRateOption} onChange={(e) => setSelectedRateOption(e.target.value)}>
                <option value="">Select rate type</option>
                {Rateoptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div onClick={() => setSelectedRowData({ ...selectedRowData, tax: !selectedRowData?.tax })}
              className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", selectedRowData?.tax ? "bg-primary" : "bg-muted")}>
              <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform", selectedRowData?.tax ? "translate-x-4" : "translate-x-1")} />
            </div>
            <span className="text-sm text-foreground">Tax</span>
          </label>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Category</p>
            <label className={labelCls}>Category Name</label>
            <select className={inputCls} value={selectedCategory?.value || ""} onChange={(e) => {
              const opt = categoryoptions.find((o) => o.value === e.target.value);
              setSelectedCategory(opt || null);
            }}>
              <option value="">Select category</option>
              {categoryoptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setCategoryFormOpen(true)}>+ Create Category</Button>
        </div>
      </SideSheet>

      {/* ── Create Category SideSheet ── */}
      <SideSheet
        open={isCategoryFormOpen}
        onOpenChange={(o) => !o && setCategoryFormOpen(false)}
        title="Create Category"
        size="sm"
        onConfirm={createCategory}
        onCancel={() => setCategoryFormOpen(false)}
        confirmLabel="Create"
      >
        <div>
          <label className={labelCls}>Category Name</label>
          <input type="text" className={inputCls} placeholder="Category Name" value={categorycreate}
            onChange={(e) => setcategorycreate(e.target.value)} />
        </div>
      </SideSheet>

    </div>
  );
};

export default CreateInvoice;

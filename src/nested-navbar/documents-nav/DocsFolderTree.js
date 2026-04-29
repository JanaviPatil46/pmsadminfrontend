import React, { useState, useEffect } from "react";
import customCss from "./docuseal-dark-theme.css";
import { DocusealBuilder } from "@docuseal/react";
import FileUploadDrawer from "./drawers/FileUploadDrawer";
import CreteFolderDrawer from "./drawers/CreteFolderDrawer";
import FolderUploadDrawer from "./drawers/FolderUploadDrawer";
import RenameDrawer from "./drawers/RenameDrawer";
import MoveDrawer from "./drawers/MoveDrawer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Eye, PenTool, Stamp, Lock, FolderOpen as FolderOpenIcon, FolderClosed as FolderClosedIcon, Folder as FolderIcon, Upload, FolderPlus, Download, MoveRight, Trash2, LockOpen, X, ChevronDown, Loader2, MoreVertical, FileText, FileImage, FileType, FileSpreadsheet, File } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
const DocsFolderTree = () => {
  const { data } = useParams();
  console.log("acount id for the documentation", data);
  const [templates, setTemplates] = useState([]);

  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch templates list
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://www.snptaxes.com/api/foldertemp/templatelist"
        );
        setTemplates(response.data.folderTemplates);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const applyTemplateToAccount = () => {
    console.log("ghjh");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountId: data,
      templateId: selectedTemplate,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    fetch(
      `https://www.snptaxes.com/api/docManagement/apply-template`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        // alert("Folder Template Assign Successfully");
        toast.success("Folder Template Assign Successfully");
        setSelectedTemplate("");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error);
        alert("Failed to Assign Folder Template");
      });
  };

  const FolderTreeView = ({ accountId }) => {
    const [clientEmail, setClientEmail] = useState(""); // store client email
    // const [approvedFiles, setApprovedFiles] = useState(new Set());
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
    const fetchAccountDetails = async () => {
      try {
        const res = await fetch(
          `https://www.snptaxes.com/api/accounts/${accountId}`
        );
        const data = await res.json();
        console.log("accounts details", data);
        const email = data.contacts?.[0]?.contact?.email;

        setClientEmail(email);
        // setClientEmail(data.account.contacts[0].email);
        console.log("Client Email:", email); // adjust key if it's different
      } catch (err) {
        console.error("Failed to fetch account details", err);
      }
    };
    useEffect(() => {
      if (accountId) {
        fetchAccountDetails();
      }
    }, [accountId]);

    console.log("folder structure of account is", accountId);
    const [expandedFolders, setExpandedFolders] = useState({});
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
    const [newFolderDrawerOpen, setNewFolderDrawerOpen] = useState(null);
    const [folderUploaDrawerOpen, setFolderUploaDrawerOpen] = useState(null);
    const [renameDrawer, SetRenameDrawer] = useState(null);
    const [fileUploadDrawerOpen, setFileUploadDrawerOpen] = useState(null);
    const [moveDrawerOpen, setMoveDrawerOpen] = useState(null);
    const [description, setDescription] = useState("");
    const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
    const [folderTree, setFolderTree] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    // console.log("hgjhg",data)
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    // State for bulk operations
    const [bulkMoveDrawerOpen, setBulkMoveDrawerOpen] = useState(false);
    const [bulkLockDialogOpen, setBulkLockDialogOpen] = useState(false);
    const [bulkOperationLoading, setBulkOperationLoading] = useState(false);

    useEffect(() => {
      fetchFolderTree(accountId);
    }, [accountId]);

    // API call to fetch folder tree for a given template ID
    const fetchFolderTree = async (accountId) => {
      try {
        const res = await fetch(
          `https://www.snptaxes.com/api/accountsdoc/files/list?folderPath=${accountId}`
        );
        const data = await res.json();
        console.log("janavi patil", data);
        if (res.ok) {
          setFolderTree(data.contents);
        } else {
          setError("Failed to fetch folder tree");
        }
      } catch (err) {
        setError("Error fetching folder tree");
      }
    };
    const toggleFolder = (path, isReadOnly) => {
      // if (isReadOnly) return;
      setExpandedFolders((prev) => ({
        ...prev,
        [path]: !prev[path],
      }));
    };

    const handleMenuClose = () => {
      setMenuAnchorEl(null);
    };

    const SIGN_STATUSES = [
      "sendForSignature",
      "pendingSignature",
      "signatureCompleted",
    ];

    const statusTextMap = {
      sendForSignature: "Send for Sign",
      pendingSignature: "Waiting for Signature",
      signatureCompleted: "Signature Received",
    };

    const INVOICE_LOCK_STATUSES = ["pendingpayment", "paymentcompleted"];

    const invoiceStatusTextMap = {
      pendingpayment: "Pending Payment",
      paymentcompleted: "Payment Completed",
    };

    const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
    const [token, setToken] = useState("");
    const [showBuilderFor, setShowBuilderFor] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
   
    // Update getAllChildrenPaths to work with item.path
    const getAllChildrenPaths = (item) => {
      const paths = [item.path];
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          paths.push(...getAllChildrenPaths(child));
        });
      }
      return paths;
    };

    const handleSelectItem = (path) => {
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(path)) {
          newSet.delete(path);
        } else {
          newSet.add(path);
        }
        return newSet;
      });
    };
    // Update handleFolderSelect
    const handleFolderSelect = (item) => {
      const allChildPaths = getAllChildrenPaths(item);

      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        const allSelected = allChildPaths.every((path) => newSet.has(path));

        if (allSelected) {
          allChildPaths.forEach((path) => newSet.delete(path));
        } else {
          allChildPaths.forEach((path) => newSet.add(path));
        }
        return newSet;
      });
    };

    // Update isFolderPartiallySelected
    const isFolderPartiallySelected = (item) => {
      const allChildPaths = getAllChildrenPaths(item);
      const selectedCount = allChildPaths.filter((path) =>
        selectedItems.has(path)
      ).length;
      return selectedCount > 0 && selectedCount < allChildPaths.length;
    };
    // Update handleSelectAll
    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedItems(new Set());
      } else {
        const allPaths = new Set();
        const collectPaths = (items) => {
          items.forEach((item) => {
            allPaths.add(item.path);
            if (item.children && item.children.length > 0) {
              collectPaths(item.children);
            }
          });
        };
        collectPaths(folderTree);
        setSelectedItems(allPaths);
      }
      setSelectAll(!selectAll);
    };
    const [emails, setEmails] = useState([]);
     useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await axios.get(
          `https://snptaxes.com/api/accounts/contacts-emails/${accountId}`
        );
        setEmails(res.data.emails);
        console.log("Fetched emails:", res.data.emails);
      } catch (err) {
        console.error("Error fetching emails:", err);
      }
    };

    if (accountId) {
      fetchEmails();
    }
  }, [accountId]);
    // Toggle signature and request token
    const toggleSignStatus = async (item) => {
      try {
        //

        // Request token
        const fileUrl = `https://snptaxes.com/uploads/accounts/${item.path}`;
        const fileName = item.name;
        const res = await fetch(
          `${SIGNATURE_API}/api/generate-token?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}&accountId=${accountId}`
        );
        const data = await res.json();
        console.log("token data", data);
        setToken(data.token);
        setShowBuilderFor(item); // important: must match the Dialog condition
        setOpenDialog(true);
      } catch (err) {
        console.error(err);
      }
    };
    const cancelSignature = async (item) => {
      try {
        await axios.delete(
          `${SIGNATURE_API}/signature/cancel/${item.meta.esignRequestId}`,
          {
            data: {
              folder: item.meta.folder, // EXACT value from meta file
              name: item.meta.name, // "1.5MB.pdf"
            },
          }
        );

        alert("Signature request cancelled.");
        fetchFolderTree(accountId);
      } catch (err) {
        console.error(err);
        alert("Failed to cancel signature");
      }
    };

    const APPROVAL_STATUSES = [
      "sendForApproval",
      "pendingApproval",
      "canceledApproval",
      "approvalCompleted",
    ];

    const approvalStatusTextMap = {
      sendForApproval: "Send for Approval",
      pendingApproval: "Waiting for Approval",
      canceledApproval: "canceledApproval",
      approvalCompleted: "Approval Completed",
    };

    // 🔹 Step 1: Click menu item → open dialog
    const toggleApprovalStatus = (item) => {
      handleMenuClose(); // Close context menu
      setSelectedItem(item); // store the current item for later use
      setOpenApprovalDialog(true); // open the dialog
    };
    // ========================
    // Cancel Pending Approval
    // ========================
    const handleCancelApproval = async (item) => {
      try {
        const res = await fetch(
          `https://www.snptaxes.com/api/accountsdoc/file/approval-toggle`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              approvalId: item.meta?.approvalId,
              filePath: item.path,
              action: "cancel",
            }),
          }
        );

        if (!res.ok) throw new Error("Cancel failed");

        // await updateStatus(item, "authStatus", "canceledApproval", null, null);

        alert("Approval Request Cancelled");
        // fetchFiles?.();
        fetchFolderTree(accountId);
      } catch (err) {
        alert("Cancel request failed");
      }
    };
    // 🔹 Step 2: Close dialog
    const handleCloseDialog = () => {
      setOpenApprovalDialog(false);
      setDescription("");
      setSelectedItem(null);
    };
    const [sending, setSending] = useState(false);

    const handleRequestApproval = async () => {
      if (!selectedItem) return;
      console.log("selected item for approval", selectedItem);
      try {
        setSending(true);

        const fileUrl = `https://snptaxes.com/uploads/accounts/${selectedItem.path}`;

        const payload = {
          filePath: selectedItem.path, // required by backend
          action: "send",
          accountId,
          filename: selectedItem.name,
          fileUrl,
          clientEmail,
          description, // auto saved inside approval.description
        };

        const res = await fetch(
          `https://www.snptaxes.com/api/accountsdoc/file/approval-toggle`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to send approval");

        // const approvalId = result?.fileMeta?.approvalId;

        alert(`Approval request sent to ${clientEmail}`);

        handleCloseDialog();
        fetchFolderTree(accountId);
        // fetchFiles?.(); // refresh listing after action (optional)
      } catch (error) {
        console.error("Approval request failed:", error);
        alert("Failed to send approval.");
      } finally {
        setSending(false);
      }
    };

    // 🔹 Frontend: Update any status (read, sign, approval)
    const updateStatus = async (
      item,
      statusType,
      newValue,
      approvalId = null,
      esignRequestId = null
    ) => {
      try {
        if (!item?.path) return alert("Invalid item selected");

        const body = {
          targetPath: item.path,
          status: {
            [statusType]: newValue, // dynamic key
            ...(approvalId && { approvalId }),
            ...(esignRequestId && { esignRequestId }),
          },
        };

        const res = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/updateStatus",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        const data = await res.json();

        if (res.ok) {
          // alert(data.message || "Status updated successfully");
          toast.success(data.message);
          fetchFolderTree(accountId); // refresh folder tree to reflect change
        } else {
          alert(data.error || "Failed to update status");
          toast.error(data.error);
        }
      } catch (err) {
        console.error("Error updating status:", err);
        alert("Error updating status");
      }
    };
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [invoiceList, setInvoiceList] = useState([]);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    // Fetch invoices for invoice dialog
    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          `https://www.snptaxes.com/workflow/invoices/invoice/pending/invoicelistby/accountid/${accountId}`
        );
        const data = await response.json();
        setInvoiceList(data.invoice || []);
      } catch (err) {
        console.error("Error fetching invoices", err);
      }
    };

    useEffect(() => {
      if (invoiceDialogOpen) fetchInvoices();
    }, [invoiceDialogOpen]);
    const handleSubmit = () => {
      if (selectedInvoices.length === 0) {
        toast.warning("Select at least one invoice");
        return;
      }
      confirmInvoiceLock(selectedInvoices);
    };
    const confirmInvoiceLock = async (invoiceIds) => {
      try {
        const res = await axios.post(
          `https://www.snptaxes.com/api/accountsdoc/invoice/lock-unlock`,
          {
            filePath: selectedDoc.path,
            invoiceIds,
            action: "lock",
          }
        );

        toast.success("Invoice locked successfully");
        setInvoiceDialogOpen(false);
        // refreshTree();
        fetchFolderTree(accountId);
      } catch (err) {
        toast.error("Lock failed");
        console.log(err);
      }
    };

    
    const toggleInvoiceLock = async (item) => {
      const filePath = item.path;
      const invoiceIds = item.meta?.invoiceLock || [];
      const isLocked = item.meta?.lockInvoiceStatus === "pendingpayment";

      // ---------------------------------- UNLOCK ----------------------------------
      if (isLocked) {
        if (!invoiceIds.length) {
          toast.error("No invoice mapped!");
          return;
        }

        try {
          await axios.post(
            `https://www.snptaxes.com/api/accountsdoc/invoice/lock-unlock`,
            {
              filePath,
              invoiceIds,
              action: "unlock",
            }
          );

          toast.success("Invoice unlocked");
          fetchFolderTree(accountId);
        } catch (err) {
          toast.error("Unlock failed");
          console.log(err);
        }
        return;
      }

      // ---------------------------------- LOCK ----------------------------------
      try {
        // 🔹 Check pending invoices first
        const res = await fetch(
          `https://www.snptaxes.com/workflow/invoices/invoice/pending/invoicelistby/accountid/${accountId}`
        );
        const data = await res.json();
        const pendingInvoices = data.invoice || [];

        if (pendingInvoices.length === 0) {
          toast.info("No pending invoices available");
          return; // ❌ do NOT open dialog
        }

        // ✅ Open dialog only if invoices exist
        setInvoiceList(pendingInvoices);
        setSelectedDoc(item);
        setInvoiceDialogOpen(true);
      } catch (error) {
        toast.error("Failed to fetch invoices");
        console.error(error);
      }
    };

    const toggleReadOnly = async (item) => {
      try {
        const newStatus = !item.meta.readOnly;

        // 📍 Use correct backend endpoint
        const endpoint =
          item.type === "folder"
            ? "https://www.snptaxes.com/api/accountsdoc/folder/readonly"
            : "https://www.snptaxes.com/api/accountsdoc/file/readonly";

        const body =
          item.type === "folder"
            ? { folderPath: item.path, readOnly: newStatus }
            : { filePath: item.path, readOnly: newStatus };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.ok) {
          fetchFolderTree(accountId);

          // 🗂️ Collapse folder if it’s locked
          if (item.type === "folder" && newStatus) {
            setExpandedFolders((prev) => {
              const updated = { ...prev };
              delete updated[item.path];
              return updated;
            });
          }

          handleMenuClose();
          // alert(data.message || "Updated successfully");
          toast.success(data.message);
        } else {
          alert("Error: " + data.error);
        }
      } catch (err) {
        console.error(err);
        toast.error(err);
        alert("Failed to update read-only status");
      }
    };
    const handleDownload = async (item) => {
      try {
        const res = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/download",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paths: item.path, // backend already supports string or array
            }),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Download failed");
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = item.name || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download error:", err);
      }
    };
// 🗑️ Move File or Folder to Trash (Soft delete)
const trashItem = async (item) => {
  if (!item?.path) return alert("Invalid path");
console.log("trash path", item.path);
  const confirmTrash = window.confirm(
    `Are you sure you want to move "${item.name}" to Trash?`
  );
  if (!confirmTrash) return;

  try {
    const response = await fetch(
      "https://www.snptaxes.com/api/accountsdoc/trash",
      {
        method: "PATCH", // ✅ trash = PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetPath: item.path, trashedBy: "Admin" }),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      toast.success(data.message || "Moved to trash");
      setTimeout(() => {
        fetchFolderTree(accountId); // refresh tree
      }, 500);
    } else {
      toast.error(data.message || "Failed to move to trash");
    }
  } catch (err) {
    console.error("Error trashing item:", err);
    toast.error("Error moving item to trash");
  }

  handleMenuClose();
};

    // 🗑️ Delete File or Folder (Universal)
    const deleteItem = async (item) => {
      if (!item?.path) return alert("Invalid path");
      // console.log("delete path", item.path);
      // console.log("delete item", item);
      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${item.name}"? This cannot be undone!`
      );
      if (!confirmDelete) return;

      try {
        const response = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/delete",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetPath: item.path }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // alert(data.message);
          toast.success(data.message);
          setTimeout(() => {
            fetchFolderTree(accountId);
          }, 800);
          //  fetchFolderTree(accountId);
        } else {
          alert(data.message || "Failed to delete");
          toast.error(data.message);
        }
      } catch (err) {
        console.error("Error deleting item:", err);
        alert("Error deleting file or folder");
        toast.error(err);
      }

      handleMenuClose();
    };
    // Bulk Trash
const handleBulkTrash = async () => {
  if (selectedItems.size === 0) {
    toast.warning("Please select items to move to trash");
    return;
  }

  const confirmTrash = window.confirm(
    `Are you sure you want to move ${selectedItems.size} item(s) to trash?`
  );
  if (!confirmTrash) return;

  setBulkOperationLoading(true);

  try {
    const paths = Array.from(selectedItems);

    console.log("Trashing paths:", paths); // Debug log

    const response = await fetch(
      "https://www.snptaxes.com/api/accountsdoc/bulktrash",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetPaths: paths, trashedBy: "Admin" }),
      }
    );

    const data = await response.json();
    console.log("Bulk trash response:", data); // Debug log

    if (response.ok) {
      if (data.success) {
        toast.success(
          `${data.trashedItems.length} item(s) moved to trash successfully`
        );

        if (data.failedItems && data.failedItems.length > 0) {
          toast.warning(`${data.failedItems.length} item(s) failed`);
          console.log("Failed trash items:", data.failedItems);
        }
      } else {
        toast.error(data.message || "Failed to trash some items");
      }

      // Clear selection regardless of partial success
      setSelectedItems(new Set());
      fetchFolderTree(accountId);
    } else {
      toast.error(data.message || "Failed to trash items");
    }
  } catch (err) {
    console.error("Bulk trash error:", err);
    toast.error("Error moving items to trash: " + err.message);
  } finally {
    setBulkOperationLoading(false);
  }
};

    // Bulk delete
    const handleBulkDelete = async () => {
      if (selectedItems.size === 0) {
        toast.warning("Please select items to delete");
        return;
      }

      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${selectedItems.size} item(s)? This cannot be undone!`
      );
      if (!confirmDelete) return;

      setBulkOperationLoading(true);
      try {
        const paths = Array.from(selectedItems);

        console.log("Deleting paths:", paths); // Debug log

        const response = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/bulk-delete",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paths }),
          }
        );

        const data = await response.json();
        console.log("Bulk delete response:", data); // Debug log

        if (response.ok) {
          if (data.success) {
            toast.success(
              `${data.summary.success} item(s) deleted successfully`
            );
            if (data.errors && data.errors.length > 0) {
              toast.warning(`${data.errors.length} item(s) failed to delete`);
              console.log("Failed deletions:", data.errors);
            }
          } else {
            toast.error(data.message || "Failed to delete some items");
          }

          // Clear selection regardless of partial success
          setSelectedItems(new Set());
          fetchFolderTree(accountId);
        } else {
          toast.error(data.message || "Failed to delete items");
        }
      } catch (err) {
        console.error("Bulk delete error:", err);
        toast.error("Error deleting items: " + err.message);
      } finally {
        setBulkOperationLoading(false);
      }
    };

    // Bulk lock/unlock
    const handleBulkLock = async (lockStatus) => {
      if (selectedItems.size === 0) {
        toast.warning("Please select items to lock/unlock");
        return;
      }

      setBulkOperationLoading(true);
      try {
        const paths = Array.from(selectedItems);
        const response = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/bulk-lock",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paths,
              readOnly: lockStatus === "lock",
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          toast.success(
            `${data.summary.success} item(s) ${lockStatus === "lock" ? "locked" : "unlocked"} successfully`
          );
          setSelectedItems(new Set());
          fetchFolderTree(accountId);
          setBulkLockDialogOpen(false);
        } else {
          toast.error(data.message || `Failed to ${lockStatus} items`);
        }
      } catch (err) {
        console.error("Bulk lock error:", err);
        toast.error(`Error ${lockStatus}ing items`);
      } finally {
        setBulkOperationLoading(false);
      }
    };

    
    const handleBulkDownload = async () => {
      if (selectedItems.size === 0) {
        toast.warning("Please select items to download");
        return;
      }

      setBulkOperationLoading(true);
      try {
        const paths = Array.from(selectedItems);
        const res = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/download",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paths }),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Download failed");
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `selected_items_${new Date().getTime()}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Download started");
      } catch (err) {
        console.error("Bulk download error:", err);
        toast.error("Failed to download items");
      } finally {
        setBulkOperationLoading(false);
      }
    };

  
    const handleFileClick = async (fullPath, fileName, meta = {}) => {
      try {
        // 🔒 Prevent opening locked files
        if (meta.readOnly) {
          alert("This file is locked and cannot be opened.");
          return;
        }
        console.log("filepath", fullPath);
        console.log("meta", meta);
        // 🔔 Remove "New" tag (fire-and-forget)
        // 🔔 Remove "New" tag & refetch tree
        if (
          meta.tags?.some((tag) => tag.isSystemTag && tag.tagName === "New")
        ) {
          await fetch(
            "https://www.snptaxes.com/api/accountsdoc/remove-new-tag",
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ filePath: fullPath }),
            }
          );

          // 🔄 REFRESH folder tree so parent tags update
          await fetchFolderTree(accountId);
        }

        // ✅ Construct file URL
        const fileUrl = `https://www.snptaxes.com/uploads/accounts/${fullPath}`;

        // ✅ Detect file extension
        const fileExt = fileName.split(".").pop().toLowerCase();

        // ✅ Browser-viewable files
        const viewableExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "txt"];

        if (viewableExtensions.includes(fileExt)) {
          // Open in new tab
          window.open(fileUrl, "_blank", "noopener,noreferrer");
        } else {
          // Force download
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error("Error opening/downloading file:", error);
      }
    };

    // const handleFileClick = (fullPath, fileName, meta = {}) => {
    //   try {
    //     // 🔒 Prevent opening locked files
    //     if (meta.readOnly) {
    //       alert("This file is locked and cannot be opened.");
    //       return;
    //     }

    //     // ✅ Construct full file URL
    //     const fileUrl = `https://www.snptaxes.com/uploads/accounts/${fullPath}`;

    //     // ✅ Detect file extension (case-insensitive)
    //     const fileExt = fileName.split(".").pop().toLowerCase();

    //     // ✅ Extensions that can open in browser
    //     const viewableExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "txt"];

    //     if (viewableExtensions.includes(fileExt)) {
    //       // Open supported file types in a new tab
    //       window.open(fileUrl, "_blank", "noopener,noreferrer");
    //     } else {
    //       // Force download for unsupported types (e.g., docx, xlsx, zip, etc.)
    //       const link = document.createElement("a");
    //       link.href = fileUrl;
    //       link.download = fileName;
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //     }
    //   } catch (error) {
    //     console.error("Error opening/downloading file:", error);
    //   }
    // };
    const getFileIcon = (fileName) => {
      const ext = fileName.split(".").pop().toLowerCase();
      switch (ext) {
        case "pdf": return <FileText size={16} className="text-red-500 shrink-0" />;
        case "jpg": case "jpeg": case "png": case "gif": return <FileImage size={16} className="text-blue-500 shrink-0" />;
        case "doc": case "docx": return <FileType size={16} className="text-blue-700 shrink-0" />;
        case "xls": case "xlsx": return <FileSpreadsheet size={16} className="text-green-600 shrink-0" />;
        default: return <File size={16} className="text-muted-foreground shrink-0" />;
      }
    };
    const renderTree = (items, level = 0, parentPath = "") => {
      return (
        <ul className="list-none" style={{ paddingLeft: level * 16 }}>
          {items.map((item) => {
            const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;
            const meta = item.meta || {};
            const isLocked = meta.readOnly === true;
            const handleSafeFileClick = () => {
              if (meta.readOnly) { alert("This file is locked and cannot be opened."); return; }
              handleFileClick(fullPath, item.name, meta);
            };
            const menuItems = buildMenuItems({ ...item, fullPath });
            return (
              <li key={fullPath} className="mb-1">
                {item.type === "folder" ? (
                  <div
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => toggleFolder(fullPath, meta.readOnly)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {expandedFolders[fullPath] ? <FolderOpenIcon size={16} className="text-primary shrink-0" /> : <FolderClosedIcon size={16} className="text-muted-foreground shrink-0" />}
                      <span className="text-xs font-medium text-foreground">{item.name}</span>
                      {meta.readOnly && <span className="text-[10px] font-semibold text-destructive">(Locked)</span>}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted shrink-0">
                          <MoreVertical size={13} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        {menuItems.map(({ label, action, disabled: d, danger }, idx) => (
                          <DropdownMenuItem key={label + idx} disabled={(label !== "Unlock" && isLocked) || d}
                            onClick={() => { if (action) { setSelectedFolderForMenu({ ...item, fullPath }); action(); } }}
                            className={danger ? "text-destructive focus:text-destructive" : ""}>
                            {label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pl-8 pr-2 py-1 rounded-lg hover:bg-muted/40 group transition-colors">
                    <div className="flex items-center gap-2 flex-1">
                      {getFileIcon(item.name)}
                      <span
                        className={`text-xs ${meta.readOnly ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:underline cursor-pointer"}`}
                        onClick={handleSafeFileClick}
                      >
                        {item.name}
                      </span>
                      {meta.readOnly && <span className="text-[10px] font-semibold text-destructive">(Locked)</span>}
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto">
                      <div className="flex items-center gap-1">
                        <Eye size={13} className={meta.readStatus ? "text-primary" : "text-muted-foreground"} />
                        <PenTool size={13} className={meta.signStatus ? "text-primary" : "text-muted-foreground"} />
                        <Stamp size={13} className={meta.authStatus ? "text-primary" : "text-muted-foreground"} />
                        <Lock size={13} className={meta.readOnly ? "text-destructive" : "text-muted-foreground"} />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 shrink-0">
                            <MoreVertical size={13} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          {menuItems.map(({ label, action, disabled: d, danger }, idx) => (
                            <DropdownMenuItem key={label + idx} disabled={(label !== "Unlock" && isLocked) || d}
                              onClick={() => { if (action) { setSelectedFolderForMenu({ ...item, fullPath }); action(); } }}
                              className={danger ? "text-destructive focus:text-destructive" : ""}>
                              {label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )}
                {expandedFolders[fullPath] && item.children && item.children.length > 0 && (
                  <div className="ml-4 mt-0.5 border-l-2 border-dashed border-border pl-2">
                    {renderTree(item.children, level + 1, fullPath)}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      );
    };
    const formatUploadedAt = (dateValue) => {
      if (!dateValue) return "";

      // If already in "DEC-19 2025" format
      if (
        typeof dateValue === "string" &&
        /^[A-Z]{3}-\d{2} \d{4}$/.test(dateValue)
      ) {
        return dateValue;
      }

      const date = new Date(dateValue);
      if (isNaN(date)) return dateValue;

      return date
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toUpperCase()
        .replace(",", "") // remove comma
        .replace(" ", "-"); // replace first space with dash
    };
    const UploadedInfo = ({ meta }) => {
      if (!meta?.uploadedAt) return null;
      return <span className="text-[11px] font-semibold text-muted-foreground">{formatUploadedAt(meta.uploadedAt)}</span>;
    };
    const getStatusChip = (meta, isFolder) => {
      if (isFolder) return null;
      const badges = [];
      const signColorMap = { pendingSignature: "bg-amber-50 text-amber-700 border-amber-200", signatureCompleted: "bg-green-50 text-green-700 border-green-200" };
      const approvalColorMap = { pendingApproval: "bg-amber-50 text-amber-700 border-amber-200", approvalCompleted: "bg-green-50 text-green-700 border-green-200", canceledApproval: "bg-red-50 text-red-700 border-red-200" };
      const invoiceColorMap = { pendingpayment: "bg-amber-50 text-amber-700 border-amber-200", paymentcompleted: "bg-green-50 text-green-700 border-green-200" };
      const fallback = "bg-muted text-muted-foreground border-border";
      if (SIGN_STATUSES.includes(meta.signStatus)) badges.push(<span key="sign" className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${signColorMap[meta.signStatus] || fallback}`}>{statusTextMap[meta.signStatus]}</span>);
      if (APPROVAL_STATUSES.includes(meta.authStatus)) {
        const cls = approvalColorMap[meta.authStatus] || fallback;
        const label = meta.authStatus === "canceledApproval" && meta.cancelReason ? `Canceled: ${meta.cancelReason}` : approvalStatusTextMap[meta.authStatus];
        badges.push(<span key="approval" title={meta.cancelReason || ""} className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border cursor-default ${cls}`}>{label}</span>);
      }
      if (INVOICE_LOCK_STATUSES.includes(meta.lockInvoiceStatus)) badges.push(<span key="invoice" className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${invoiceColorMap[meta.lockInvoiceStatus] || fallback}`}>{invoiceStatusTextMap[meta.lockInvoiceStatus]}</span>);
      if (badges.length === 0) return null;
      return <div className="flex items-center gap-1">{badges}</div>;
    };
    const findNewSystemTag = (item) => {
      // console.log("Finding 'New' tag in item:", item);
      // Check current item
      const newTag = item.meta?.tags?.find(
        (tag) => tag.isSystemTag && tag.tagName === "New"
      );

      if (newTag) return newTag;

      // Check children recursively
      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          const childTag = findNewSystemTag(child);
          if (childTag) return childTag;
        }
      }

      return null;
    };

    const buildMenuItems = (item) => {
      const isFolder = item.type === "folder";
      const isLocked = item?.meta?.readOnly === true;
      const path = item.path.toLowerCase();
      let docType = "client";
      if (path.includes("firm")) docType = "firm";
      if (path.includes("private")) docType = "private";
      const PROTECTED_FOLDERS = ["Client Uploaded Documents", "Firm Documents Shared with Client", "Private"];
      const isProtectedFolder = isFolder && PROTECTED_FOLDERS.includes(item.name);
      const menuItems = [];
      if (isFolder) {
        if (docType === "client") {
          menuItems.push(
            { label: "New Folder", action: () => setNewFolderDrawerOpen(true) },
            { label: "Edit", action: () => SetRenameDrawer(true) },
            { label: "Move", action: () => setMoveDrawerOpen(true) },
            { label: "Delete", action: () => trashItem(item), disabled: isProtectedFolder, danger: true },
            { label: "Download", action: () => handleDownload(item) },
            { label: "New File", action: () => setFileUploadDrawerOpen(true) },
            { label: "Upload Folder", action: () => setFolderUploaDrawerOpen(true) },
            { label: isLocked ? "Unlock" : "Lock", action: () => toggleReadOnly(item) },
          );
        } else if (docType === "firm") {
          menuItems.push(
            { label: "New Folder", action: () => setNewFolderDrawerOpen(true) },
            { label: "Edit", action: () => SetRenameDrawer(true) },
            { label: "Move", action: () => setMoveDrawerOpen(true) },
            { label: "New File", action: () => setFileUploadDrawerOpen(true) },
            { label: "Download", action: () => handleDownload(item) },
            { label: "Upload Folder", action: () => setFolderUploaDrawerOpen(true) },
            { label: "Delete", action: () => trashItem(item), disabled: isProtectedFolder, danger: true },
          );
        } else if (docType === "private") {
          menuItems.push(
            { label: "New Folder", action: () => setNewFolderDrawerOpen(true) },
            { label: "New File", action: () => setFileUploadDrawerOpen(true) },
            { label: "Move", action: () => setMoveDrawerOpen(true) },
            { label: "Edit", action: () => SetRenameDrawer(true) },
            { label: "Delete", action: () => trashItem(item), disabled: isProtectedFolder, danger: true },
            { label: "Download", action: () => handleDownload(item) },
          );
        }
      } else {
        if (docType === "client") {
          menuItems.push(
            { label: "Edit", action: () => SetRenameDrawer(true) },
            { label: "Move", action: () => setMoveDrawerOpen(true) },
            { label: isLocked ? "Unlock" : "Lock", action: () => toggleReadOnly(item) },
            { label: "Delete", action: () => trashItem(item), danger: true },
            { label: "Download", action: () => handleDownload(item) },
          );
        } else if (docType === "firm") {
          const currentStatus = item.meta?.signStatus || "sendForSignature";
          const approvalStatus = item.meta?.authStatus || "sendForApproval";
          const invoiceStatus = item.meta?.lockInvoiceStatus;
          const isSignatureDisabled = currentStatus === "pendingSignature" || currentStatus === "signatureCompleted";
          const isApprovalCompleted = approvalStatus === "approvalCompleted";
          const isApprovalCanceled = approvalStatus === "canceledApproval";
          let invoiceLabel = "Lock Invoice";
          if (invoiceStatus === "pendingpayment") invoiceLabel = "Unlock Invoice";
          menuItems.push(
            { label: "Edit", action: () => SetRenameDrawer(true) },
            { label: "Move", action: () => setMoveDrawerOpen(true) },
          );
          if (currentStatus === "pendingSignature") {
            menuItems.push({ label: "Cancel Signature Request", action: () => cancelSignature(item) });
          } else {
            menuItems.push({ label: statusTextMap[currentStatus], action: () => toggleSignStatus(item), disabled: isSignatureDisabled });
          }
          if (approvalStatus === "sendForApproval") menuItems.push({ label: "Send For Approval", action: () => toggleApprovalStatus(item) });
          if (approvalStatus === "pendingApproval") menuItems.push({ label: "Cancel Approval Request", action: () => handleCancelApproval(item) });
          if (isApprovalCompleted) menuItems.push({ label: "Approved", disabled: true });
          if (isApprovalCanceled) menuItems.push({ label: "Approval Canceled", disabled: true });
          menuItems.push({ label: invoiceLabel, action: () => toggleInvoiceLock(item) });
          menuItems.push({ label: "Delete", action: () => trashItem(item), danger: true });
          menuItems.push({ label: "Download", action: () => handleDownload(item) });
        } else if (docType === "private") {
          menuItems.push(
            { label: "Edit", action: () => SetRenameDrawer(true) },
            { label: "Delete", action: () => trashItem(item), danger: true },
            { label: "Download", action: () => handleDownload(item) },
            { label: "Move", action: () => setMoveDrawerOpen(true) },
          );
        }
      }
      return menuItems;
    };

    const renderTableRows = (items, level = 0, parentPath = "") => {
      return items.map((item) => {
        const fullPath = item.path;
        const meta = item.meta || {};
        const isFolder = item.type === "folder";
        const isLocked = meta.readOnly === true;
        const isSelected = selectedItems.has(fullPath);
        const isPartiallySelected = isFolder ? isFolderPartiallySelected(item) : false;
        const inheritedNewTag = isFolder ? findNewSystemTag(item) : null;
        const handleSafeFileClick = () => {
          if (meta.readOnly) { alert("This file is locked and cannot be opened."); return; }
          if (!isFolder) handleFileClick(fullPath, item.name, meta);
        };
        const menuItems = buildMenuItems({ ...item, fullPath });
        return (
          <React.Fragment key={fullPath}>
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="px-2 py-1.5 align-middle">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    ref={(el) => { if (el) el.indeterminate = isPartiallySelected; }}
                    onChange={() => isFolder ? handleFolderSelect(item) : handleSelectItem(fullPath)}
                    className="h-3.5 w-3.5 rounded border-border cursor-pointer"
                  />
                </div>
              </td>
              <td className="px-2 py-1.5" style={{ paddingLeft: `${level * 16 + 8}px` }}>
                <div className="flex items-center gap-1.5">
                  {isFolder ? (
                    <>
                      <button type="button" onClick={() => toggleFolder(fullPath, meta.readOnly)} disabled={meta.readOnly} className="shrink-0 disabled:opacity-40">
                        {expandedFolders[fullPath] ? <FolderOpenIcon size={16} className="text-primary" /> : <FolderClosedIcon size={16} className="text-muted-foreground" />}
                      </button>
                      <button type="button" onClick={() => toggleFolder(fullPath, meta.readOnly)} className={`text-xs font-medium flex items-center gap-1 ${meta.readOnly ? "text-muted-foreground" : "text-foreground hover:text-primary"}`}>
                        {item.name}
                        {inheritedNewTag && <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: inheritedNewTag.tagColour || "hsl(var(--primary))" }}>{inheritedNewTag.tagName}</span>}
                        {meta.readOnly && <span className="text-[10px] font-semibold text-destructive">(Locked)</span>}
                      </button>
                    </>
                  ) : (
                    <>
                      {getFileIcon(item.name)}
                      <span
                        className={`text-xs flex items-center gap-1 flex-wrap ${meta.readOnly ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:underline cursor-pointer"}`}
                        onClick={handleSafeFileClick}
                      >
                        {item.name}
                        {meta.readOnly && <span className="text-[10px] font-semibold text-destructive">(Locked)</span>}
                        {meta.tags?.map((tag, idx) => <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white ml-1" style={{ backgroundColor: tag.tagColour || "hsl(var(--muted-foreground))" }}>{tag.tagName}</span>)}
                      </span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-2 py-1.5">{getStatusChip(meta, isFolder)}</td>
              <td className="px-2 py-1.5"><UploadedInfo meta={meta} /></td>
              <td className="px-2 py-1.5 text-xs text-muted-foreground">{meta.uploadedBy}</td>
              <td className="px-2 py-1.5">
                <div className="flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      {menuItems.map(({ label, action, disabled: d, danger }, idx) => (
                        <DropdownMenuItem
                          key={label + idx}
                          disabled={(label !== "Unlock" && isLocked) || d}
                          onClick={() => { if (action) { setSelectedFolderForMenu({ ...item, fullPath }); action(); } }}
                          className={danger ? "text-destructive focus:text-destructive" : ""}
                        >
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
            {isFolder && expandedFolders[fullPath] && item.children && item.children.length > 0 &&
              renderTableRows(item.children, level + 1, fullPath)}
          </React.Fragment>
        );
      });
    };

    return (
      <div className="mx-auto p-4">
        {/* Action Buttons */}
        <div className="px-3 pb-3 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto my-4">
            <Button
              size="sm"
              className="flex-1 gap-2"
              onClick={() => { setNewFolderDrawerOpen(true); handleMenuClose(); }}
            >
              <FolderPlus size={15} /> Create Folder
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => setFileUploadDrawerOpen(true)}
            >
              <Upload size={15} /> Upload File
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => setFolderUploaDrawerOpen(true)}
            >
              <FolderPlus size={15} /> Upload Folder
            </Button>
          </div>

          {/* Bulk operations toolbar */}
          {selectedItems.size > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 mb-4 rounded-xl bg-primary/5 border border-border">
              <span className="text-sm font-semibold text-primary">{selectedItems.size} item(s) selected</span>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled={bulkOperationLoading} onClick={() => setBulkMoveDrawerOpen(true)} className="gap-1.5"><MoveRight size={13} /> Move</Button>
                <Button size="sm" variant="outline" disabled={bulkOperationLoading} onClick={() => setBulkLockDialogOpen(true)} className="gap-1.5"><Lock size={13} /> Lock/Unlock</Button>
                <Button size="sm" variant="destructive" disabled={bulkOperationLoading} onClick={handleBulkTrash} className="gap-1.5"><Trash2 size={13} /> Delete</Button>
                <Button size="sm" variant="outline" disabled={bulkOperationLoading} onClick={handleBulkDownload} className="gap-1.5"><Download size={13} /> Download</Button>
                <Button size="sm" variant="ghost" disabled={bulkOperationLoading} onClick={() => setSelectedItems(new Set())} className="gap-1.5 text-muted-foreground">Clear</Button>
              </div>
            </div>
          )}

          {/* Drawers */}
          <FileUploadDrawer
            isOpen={fileUploadDrawerOpen}
            onClose={() => setFileUploadDrawerOpen(false)}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(data)}
            accountId={data}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <CreteFolderDrawer
            isOpen={newFolderDrawerOpen}
            onClose={() => {
              setNewFolderDrawerOpen(false);
            }}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(data)}
            accountId={data}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <FolderUploadDrawer
            isOpen={folderUploaDrawerOpen}
            onClose={() => setFolderUploaDrawerOpen(false)}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(data)}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <MoveDrawer
            isOpen={moveDrawerOpen}
            onClose={() => {
              setMoveDrawerOpen(false);
            }}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(data)}
            selectedFolderForMenu={selectedFolderForMenu}
          />

          <RenameDrawer
            isOpen={renameDrawer}
            onClose={() => {
              SetRenameDrawer(false);
            }}
            folderTree={folderTree}
            fetchFolderTree={() => fetchFolderTree(data)}
            selectedFolderForMenu={selectedFolderForMenu}
          />
          {/* 🔴 Bulk Move Drawer */}
          <MoveDrawer
            isOpen={bulkMoveDrawerOpen}
            onClose={() => setBulkMoveDrawerOpen(false)}
            folderTree={folderTree}
            fetchFolderTree={fetchFolderTree}
            // Bulk mode props
            isBulkOperation={true}
            selectedPaths={Array.from(selectedItems)} // Array of selected paths
            onMoveComplete={(targetPath) => {
              // Optional callback after successful move
              console.log("Bulk move completed to:", targetPath);
              setSelectedItems(new Set()); // Clear selection
            }}
          />
        </div>

        {/* Folder Explorer */}
        <div className="rounded-xl border border-border bg-background mt-4 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
            <FolderIcon size={14} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Folder Explorer</h3>
          </div>
          {folderTree && folderTree.length > 0 ? (
            <>
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[4%]" />
                  <col className="w-[38%]" />
                  <col className="w-[22%]" />
                  <col className="w-[12%]" />
                  <col className="w-[14%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-2 py-2.5 align-middle">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          ref={(el) => { if (el) el.indeterminate = selectedItems.size > 0 && !selectAll; }}
                          onChange={handleSelectAll}
                          className="h-3.5 w-3.5 rounded border-border cursor-pointer"
                        />
                      </div>
                    </th>
                    <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                    <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uploaded</th>
                    <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                    <th className="px-2 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">{renderTableRows(folderTree)}</tbody>
              </table>
              {selectedItems.size > 0 && (
                <div className="px-4 py-2 bg-primary/5 border-t border-border">
                  <span className="text-xs font-medium text-primary">{selectedItems.size} item(s) selected</span>
                </div>
              )}
            </>
          ) : (
            <p className="p-6 text-center text-sm text-muted-foreground">Loading folder data...</p>
          )}
        </div>
        {/* Bulk Lock Dialog */}
        {bulkLockDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setBulkLockDialogOpen(false)} />
            <div className="relative bg-card rounded-xl border border-border shadow-2xl w-full max-w-sm">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Lock/Unlock Selected Items</h2>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-muted-foreground">Do you want to lock or unlock the {selectedItems.size} selected item(s)?</p>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setBulkLockDialogOpen(false)}>Cancel</Button>
                <Button type="button" variant="outline" size="sm" disabled={bulkOperationLoading} onClick={() => handleBulkLock("unlock")}>Unlock</Button>
                <Button type="button" size="sm" disabled={bulkOperationLoading} onClick={() => handleBulkLock("lock")}>Lock</Button>
              </div>
            </div>
          </div>
        )}

        {/* DocuSeal Signature Dialog */}
        {openDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpenDialog(false)} />
            <div className="relative bg-card rounded-xl border border-border shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                <h2 className="text-sm font-semibold text-foreground">{selectedFolderForMenu?.name || "Document"}</h2>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setOpenDialog(false)}>
                  <X size={15} />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {token && showBuilderFor && (
                  <DocusealBuilder token={token} customCss={customCss} onComplete={() => { console.log("DocuSeal finished sending document"); setShowBuilderFor(null); setOpenDialog(false); }} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Approval Dialog */}
        {openApprovalDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={handleCloseDialog} />
            <div className="relative bg-card rounded-xl border border-border shadow-2xl w-full max-w-md flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Request Approval</h2>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={handleCloseDialog}><X size={15} /></Button>
              </div>
              <div className="px-5 py-4">
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Description / Note</label>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Type a short description or note..." className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none transition-colors" />
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={handleCloseDialog}>Cancel</Button>
                <Button type="button" size="sm" onClick={handleRequestApproval} disabled={!description.trim() || sending}>Send</Button>
              </div>
            </div>
          </div>
        )}
        {/* Invoice Lock Dialog */}
        {invoiceDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setInvoiceDialogOpen(false)} />
            <div className="relative bg-card rounded-xl border border-border shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                <h2 className="text-sm font-semibold text-foreground">Select Invoices To Lock</h2>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setInvoiceDialogOpen(false)}><X size={15} /></Button>
              </div>
              <div className="flex-1 overflow-auto">
                {invoiceList.length === 0 ? (
                  <p className="p-6 text-center text-sm text-muted-foreground">No invoices found</p>
                ) : (
                  <table className="w-full table-fixed text-sm">
                    <colgroup>
                      <col className="w-[6%]" />
                      <col className="w-[20%]" />
                      <col className="w-[34%]" />
                      <col className="w-[20%]" />
                      <col className="w-[20%]" />
                    </colgroup>
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-2 py-2.5 align-middle" />
                        <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Invoice #</th>
                        <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                        <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created At</th>
                        <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {invoiceList.map((inv) => {
                        const id = inv._id;
                        const checked = selectedInvoices.includes(id);
                        return (
                          <tr
                            key={id}
                            className={`cursor-pointer hover:bg-muted/30 transition-colors ${checked ? "bg-primary/5" : ""}`}
                            onClick={() => setSelectedInvoices((prev) => {
                              const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
                              console.log("Selected invoices:", updated);
                              return updated;
                            })}
                          >
                            <td className="px-2 py-1.5 align-middle"><div className="flex items-center justify-center"><input type="checkbox" checked={checked} readOnly className="h-3.5 w-3.5 rounded border-border cursor-pointer" /></div></td>
                            <td className="px-2 py-1.5 text-xs text-foreground">{inv.invoicenumber}</td>
                            <td className="px-2 py-1.5 text-xs text-muted-foreground truncate">{inv.description || "—"}</td>
                            <td className="px-2 py-1.5 text-xs text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString()}</td>
                            <td className="px-2 py-1.5 text-xs text-foreground">₹{inv.summary?.total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border shrink-0">
                <Button type="button" variant="outline" size="sm" onClick={() => setInvoiceDialogOpen(false)}>Cancel</Button>
                <Button type="button" size="sm" onClick={handleSubmit}>Lock Invoice</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Apply Template Card */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground tracking-tight">Apply Folder Template</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Assign a folder template structure to this account</p>
        </div>
        <div className="flex flex-col sm:flex-row items-end gap-3 max-w-lg">
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Select Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              <option value="">Choose a template...</option>
              {templates.map((template) => (
                <option key={template._id} value={template._id}>{template.templatename}</option>
              ))}
            </select>
          </div>
          <Button
            size="sm"
            disabled={loading || !selectedTemplate}
            onClick={applyTemplateToAccount}
            className="shrink-0 gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            Apply Template
          </Button>
        </div>
      </div>
      <FolderTreeView accountId={data} />
    </div>
  );
};

export default DocsFolderTree;

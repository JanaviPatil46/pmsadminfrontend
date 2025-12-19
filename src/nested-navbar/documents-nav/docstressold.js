import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Alert,
  Select,
  CircularProgress,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Chip,
  Tooltip,
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Table,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import customCss from "./docuseal-dark-theme.css";
import { DocusealBuilder } from "@docuseal/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import FileUploadDrawer from "./drawers/FileUploadDrawer";
import CreteFolderDrawer from "./drawers/CreteFolderDrawer";
import FolderUploadDrawer from "./drawers/FolderUploadDrawer";
import RenameDrawer from "./drawers/RenameDrawer";
import MoveDrawer from "./drawers/MoveDrawer";
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { Eye, PenTool, Stamp, Lock } from "lucide-react";
import {
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
} from "lucide-react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import { toast } from "react-toastify";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";

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

  const handleApplyTemplate = async () => {
    await applyTemplateToAccount();
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
      if (isReadOnly) return;
      setExpandedFolders((prev) => ({
        ...prev,
        [path]: !prev[path],
      }));
    };

    const handleMenuOpen = (event, folder) => {
      event.stopPropagation();
      setMenuAnchorEl(event.currentTarget);
      setSelectedFolderForMenu(folder);
    };

    const handleMenuClose = () => {
      setMenuAnchorEl(null);
    };
    // Toggle read/unread
    const toggleReadStatus = (item) => {
      const newValue = !(item.meta?.readStatus || false);
      updateStatus(item, "readStatus", newValue);
      // console.log("kujaki janavi", item.path);
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
    // const [currentExternalId, setCurrentExternalId] = useState(null);
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
        // esignRequestId = (data.esignRequestId);
        // // Cycle status (optional, keep your logic)
        // const currentStatus = item.meta?.signStatus || "sendForSignature";
        // const currentIndex = SIGN_STATUSES.indexOf(currentStatus);
        // const nextIndex = (currentIndex + 1) % SIGN_STATUSES.length;
        // const nextStatus = SIGN_STATUSES[nextIndex];
        // // await updateStatus(item, "signStatus", nextStatus,data.esignRequestId);
        // await updateStatus(
        //   item,
        //   "signStatus",
        //   nextStatus,
        //   null,
        //   data.esignRequestId
        // );
      } catch (err) {
        console.error(err);
      }
    };
    const cancelSignature = async (item) => {
  try {
    await axios.delete(`${SIGNATURE_API}/signature/cancel/${item.meta.esignRequestId}`, {
      data: {
        folder: item.meta.folder,    // EXACT value from meta file
        name: item.meta.name         // "1.5MB.pdf"
      }
    });

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
    const handleRequestApproval = async () => {
      if (!selectedItem) return;
console.log("selected item for approval", selectedItem);
      try {
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
      }
    };

    // const handleRequestApproval = async () => {
    //   if (!selectedItem) return;

    //   try {
    //     const fileUrl = `https://snptaxes.com/uploads/accounts/${selectedItem.path}`;

    //     const payload = {
    //       accountId,
    //       filename: selectedItem.name,
    //       fileUrl,
    //       clientEmail,
    //       description,
    //     };

    //     const res = await fetch(
    //       `${DOCS_MANAGMENTS}/approvals/request-approval`,
    //       {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(payload),
    //       }
    //     );

    //     const result = await res.json();

    //     if (!res.ok) throw new Error("Failed to send approval request.");

    //     // ⬅️ Backend must return approvalId
    //     const approvalId = result.approvalId;

    //     alert(`Approval request sent to ${payload.clientEmail}`);

    //     // Calculate next status
    //     const currentStatus =
    //       selectedItem.meta?.authStatus || "sendForApproval";
    //     const currentIndex = APPROVAL_STATUSES.indexOf(currentStatus);
    //     const nextIndex = (currentIndex + 1) % APPROVAL_STATUSES.length;
    //     const nextStatus = APPROVAL_STATUSES[nextIndex];

    //     // ⬅️ Send approvalId into updateStatus()
    //     // await updateStatus(selectedItem, "authStatus", nextStatus, approvalId);
    //     await updateStatus(
    //       selectedItem,
    //       "authStatus",
    //       nextStatus,
    //       approvalId,
    //       null
    //     );

    //     handleCloseDialog();
    //   } catch (err) {
    //     console.error("Approval request failed:", err);
    //     alert("Failed to send approval request.");
    //   }
    // };

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
      const invoiceIds = item.meta?.invoiceLock || []; // stored when locked
      const isLocked = item.meta?.lockInvoiceStatus === "pendingpayment";
      console.log("invoice ids", invoiceIds);
      // ---------------------------------- UNLOCK ----------------------------------
      if (isLocked) {
        if (!invoiceIds.length) {
          toast.error("No invoice mapped!");
          return;
        }

        try {
          const res = await axios.post(
            `https://www.snptaxes.com/api/accountsdoc/invoice/lock-unlock`,
            {
              filePath,
              invoiceIds,
              action: "unlock",
            }
          );

          toast.success("Invoice unlocked");
          fetchFolderTree(accountId); // your fetch tree function
        } catch (err) {
          toast.error("Unlock failed");
          console.log(err);
        }
        return;
      }

      // ---------------------------------- LOCK ----------------------------------
      // Open drawer or dialog to select invoiceIds
      setSelectedDoc(item);
      setInvoiceDialogOpen(true); // (open invoice selection popup)
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

    // 🗑️ Delete File or Folder (Universal)
    const deleteItem = async (item) => {
      if (!item?.path) return alert("Invalid path");
      console.log("delete path", item.path);
      console.log("delete item", item);
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

    const handleMoveFolder = async (folder) => {
      alert(`Move folder: ${folder.path}`); // implement backend
      handleMenuClose();
    };
//     const handleFileClick = (fullPath, fileName, meta = {}) => {
//   try {
//     if (meta.readOnly) {
//       alert("This file is locked and cannot be opened.");
//       return;
//     }

//     const fileUrl = `https://www.snptaxes.com/uploads/accounts/${data}/${fullPath}`;
//     const ext = fileName.split(".").pop().toLowerCase();

//     const viewable = ["pdf", "jpg", "jpeg", "png", "gif", "txt"];
//     const excel = ["xls", "xlsx"];
//     const word = ["doc", "docx"];

//     if (viewable.includes(ext)) {
//       // Normal view in browser
//       window.open(fileUrl, "_blank");
//     } 
//     else if (excel.includes(ext)) {
//       // 📄 Open Excel online (Google Sheets Viewer)
//       const gsheetUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
//       window.open(gsheetUrl, "_blank");
//     } 
//     else if (word.includes(ext)) {
//       // 📄 Open Word using Google Docs Viewer
//       const gdocUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
//       window.open(gdocUrl, "_blank");
//     }
//     else {
//       // download anything else
//       const a = document.createElement("a");
//       a.href = fileUrl;
//       a.download = fileName;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     }
//   } catch (e) {
//     console.error("open error:", e);
//   }
// };

    const handleFileClick = (fullPath, fileName, meta = {}) => {
      try {
        // 🔒 Prevent opening locked files
        if (meta.readOnly) {
          alert("This file is locked and cannot be opened.");
          return;
        }

        // ✅ Construct full file URL
        const fileUrl = `https://www.snptaxes.com/uploads/accounts/${data}/${fullPath}`;

        // ✅ Detect file extension (case-insensitive)
        const fileExt = fileName.split(".").pop().toLowerCase();

        // ✅ Extensions that can open in browser
        const viewableExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "txt"];

        if (viewableExtensions.includes(fileExt)) {
          // Open supported file types in a new tab
          window.open(fileUrl, "_blank", "noopener,noreferrer");
        } else {
          // Force download for unsupported types (e.g., docx, xlsx, zip, etc.)
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
    const getFileIcon = (fileName) => {
      const ext = fileName.split(".").pop().toLowerCase();

      switch (ext) {
        case "pdf":
          return <FaFilePdf color="#d32f2f" size={18} />;
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
          return <FaFileImage color="#1976d2" size={18} />;
        case "doc":
        case "docx":
          return <FaFileWord color="#1565c0" size={18} />;
        case "xls":
        case "xlsx":
          return <FaFileExcel color="#2e7d32" size={18} />;
        case "txt":
        case "md":
          return <FaFileAlt color="#616161" size={18} />;
        default:
          return <AiFillFileUnknown color="#757575" size={18} />;
      }
    };
    const renderTree = (items, level = 0, parentPath = "") => {
      const getStatusChip = (meta) => {
        console.log("meta status", meta);
        const chips = [];

        // ======= SIGNATURE STATUS =======
        if (SIGN_STATUSES.includes(meta.signStatus)) {
          let color = "default";

          if (meta.signStatus === "pendingSignature") color = "warning";
          if (meta.signStatus === "signatureCompleted") color = "success";

          chips.push(
            <Chip
              key="signChip"
              label={statusTextMap[meta.signStatus]}
              size="small"
              variant="outlined"
              color={color}
            />
          );
        }

        // ======= APPROVAL STATUS =======
        if (APPROVAL_STATUSES.includes(meta.authStatus)) {
          let color = "default";
          let chip = (
            <Chip
              key="approvalChip"
              label={approvalStatusTextMap[meta.authStatus]}
              size="small"
              variant="outlined"
              color={color}
            />
          );

          if (meta.authStatus === "pendingApproval") color = "warning";
          if (meta.authStatus === "approvalCompleted") color = "success";
          if (meta.authStatus === "canceledApproval") color = "error";

          // Handle tooltip only for canceled approval
          if (meta.authStatus === "canceledApproval" && meta.cancelReason) {
            chip = (
              <Tooltip title={meta.cancelReason} placement="top-end">
                <Chip
                  key="approvalCanceledChip"
                  label="Approval Canceled"
                  size="small"
                  variant="outlined"
                  color="error"
                  sx={{ cursor: "pointer" }}
                />
              </Tooltip>
            );
          } else {
            chip = (
              <Chip
                key="approvalChip"
                label={approvalStatusTextMap[meta.authStatus]}
                size="small"
                variant="outlined"
                color={color}
              />
            );
          }

          chips.push(chip);
        }
        // ⭐ NEW — INVOICE LOCK STATUS
        if (INVOICE_LOCK_STATUSES.includes(meta.lockInvoiceStatus)) {
          let color = "default";
          if (meta.lockInvoiceStatus === "pendingpayment") color = "warning";
          if (meta.lockInvoiceStatus === "paymentcompleted") color = "success";

          chips.push(
            <Chip
              key="invoiceLockChip"
              label={invoiceStatusTextMap[meta.lockInvoiceStatus]}
              size="small"
              variant="outlined"
              color={color}
            />
          );
        }
        // ======= SHOW NOTHING IF NO STATUS =======
        if (chips.length === 0) return null;

        return <Box sx={{ display: "flex", gap: 1, ml: 1 }}>{chips}</Box>;
      };

      return (
        <>
          <Box component="ul" sx={{ listStyle: "none", pl: level * 2, mb: 1 }}>
            {items.map((item) => {
              const fullPath = parentPath
                ? `${parentPath}/${item.name}`
                : item.name;
              const meta = item.meta || {};

              const getColor = (status) => (status ? "#1976d2" : "#9e9e9e");

              const StatusIcons = () => (
                <Box
                  sx={{ display: "flex", gap: 1, alignItems: "center", ml: 1 }}
                >
                  <Eye size={16} color={getColor(meta.readStatus)} />
                  <PenTool size={16} color={getColor(meta.signStatus)} />
                  <Stamp size={16} color={getColor(meta.authStatus)} />
                  <Lock
                    size={16}
                    color={meta.readOnly ? "#e53935" : "#9e9e9e"}
                  />
                </Box>
              );

              const handleSafeFileClick = () => {
                if (meta.readOnly) {
                  alert("This file is locked and cannot be opened.");
                  return;
                }
                handleFileClick(fullPath, item.name);
              };

              return (
                <li key={fullPath} style={{ marginBottom: 8 }}>
                  {item.type === "folder" ? (
                    <Box
                      sx={{
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: 2,
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        transition: "background-color 0.2s ease-in-out",
                      }}
                      onClick={() => toggleFolder(fullPath, meta.readOnly)}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{ flexGrow: 1, gap: 1 }}
                      >
                        {expandedFolders[fullPath] ? (
                          <FolderOpenIcon color="#1976d2" size={18} />
                        ) : (
                          <FolderClosedIcon color="#757575" size={18} />
                        )}

                        <Typography variant="body1" fontWeight="medium">
                          {item.name}
                          {meta.readOnly && (
                            <Typography
                              variant="caption"
                              sx={{ color: "red", fontWeight: "bold", ml: 1 }}
                            >
                              (Locked)
                            </Typography>
                          )}
                        </Typography>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={(e) =>
                          handleMenuOpen(e, { ...item, fullPath })
                        }
                      >
                        <MoreVertIcon size={16} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pl: 4,
                        mb: 1,
                        borderRadius: 2,
                        "&:hover .file-menu-icon": { opacity: 1 },
                      }}
                    >
                      <Box
                        sx={{
                          mr: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        {getFileIcon(item.name)}
                        <Typography
                          variant="body2"
                          sx={{
                            flex: 1,
                            wordBreak: "break-word",
                            color: meta.readOnly ? "#999" : "#1976d2",
                            textDecoration: meta.readOnly
                              ? "none"
                              : "underline",
                            cursor: meta.readOnly ? "not-allowed" : "pointer",
                          }}
                          onClick={handleSafeFileClick}
                        >
                          {item.name}
                        </Typography>
                      </Box>

                      <Box>
                        {" "}
                        {/* ⬇️ Added the chips here */}
                        {getStatusChip(meta)}
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <StatusIcons />

                        <Box
                          className="file-menu-icon"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "#1976d2",
                            opacity: 0,
                            transition: "opacity 0.2s",
                            cursor: "pointer",
                            mr: 1,
                            ml: 1,
                          }}
                          onClick={(e) =>
                            handleMenuOpen(e, { ...item, fullPath })
                          }
                        />
                      </Box>
                    </Box>
                  )}

                  {expandedFolders[fullPath] &&
                    item.children &&
                    item.children.length > 0 && (
                      <Box
                        sx={{
                          ml: 2,
                          mt: 1,
                          borderLeft: "2px dashed #ccc",
                          pl: 2,
                        }}
                      >
                        {renderTree(item.children, level + 1, fullPath)}
                      </Box>
                    )}
                </li>
              );
            })}
          </Box>

          {/* Your dialogs remain unchanged */}
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle>
              {items.name}
              <IconButton
                aria-label="close"
                onClick={() => setOpenDialog(false)}
                style={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              {token && showBuilderFor && (
                <DocusealBuilder
                  token={token}
                  customCss={customCss}
                  onComplete={() => {
                    console.log("DocuSeal finished sending document");
                    setShowBuilderFor(null);
                    setOpenDialog(false);
                  }}
                />
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={openApprovalDialog}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Request Approval</DialogTitle>
            <DialogContent>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Type a short description or note..."
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRequestApproval}
                disabled={!description.trim()}
              >
                Send
              </Button>
            </DialogActions>
          </Dialog>
        </>
      );
    };

    return (
      <Box sx={{ margin: "auto", p: 3 }}>
        {/* Action Buttons */}
        <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              maxWidth: "600px",
              width: "100%",
              mx: "auto",
              my: 3,
            }}
          >
            <Button
              variant="contained"
              fullWidth
              startIcon={<FolderIcon />}
              onClick={() => {
                setNewFolderDrawerOpen(true);
                handleMenuClose();
              }}
            >
              Create Folder
            </Button>

            <Button
              variant="contained"
              fullWidth
              startIcon={<UploadFileIcon />}
              onClick={() => setFileUploadDrawerOpen(true)}
            >
              Upload File
            </Button>

            <Button
              variant="contained"
              fullWidth
              startIcon={<DriveFolderUploadIcon />}
              onClick={() => setFolderUploaDrawerOpen(true)}
            >
              Upload Folder
            </Button>
          </Box>

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
        </Box>

        {/* Folder Explorer */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            📜 Folder Explorer
          </Typography>
          {folderTree ? (
            renderTree(folderTree)
          ) : (
            <Typography>Loading folder data...</Typography>
          )}
        </Paper>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {(() => {
            if (!selectedFolderForMenu) return null;

            const item = selectedFolderForMenu;
            const isFolder = item.type === "folder";
            const isLocked = item?.meta?.readOnly === true;

            // Determine doc category (adjust this logic if needed)
            const path = item.path.toLowerCase();
            let docType = "client"; // default
            if (path.includes("firm")) docType = "firm";
            if (path.includes("private")) docType = "private";

            const menuItems = [];

            // -------------------------------
            // 📁 FOLDER TYPE
            // -------------------------------
            if (isFolder) {
              if (docType === "client") {
                menuItems.push(
                  {
                    icon: <FolderIcon />,
                    label: "New Folder",
                    action: () => setNewFolderDrawerOpen(true),
                  },
                  {
                    icon: <DriveFileMoveIcon />,
                    label: "Edit",
                    action: () => SetRenameDrawer(true),
                  },
                  {
                    icon: <DriveFileMoveIcon />,
                    label: "Move",
                    action: () => setMoveDrawerOpen(true),
                  },
                  {
                    icon: <DeleteIcon />,
                    label: "Delete",
                    action: () => deleteItem(item),
                  },
                  {
                    icon: <UploadFileIcon />,
                    label: "New File",
                    action: () => setFileUploadDrawerOpen(true),
                  },
                  {
                    icon: <DriveFolderUploadIcon />,
                    label: "Upload Folder",
                    action: () => setFolderUploaDrawerOpen(true),
                  },
                  {
                    icon: <LockIcon />,
                    label: isLocked ? "Unlock" : "Lock",
                    action: () => toggleReadOnly(item),
                  }
                );
              } else if (docType === "firm") {
                menuItems.push(
                  {
                    icon: <FolderIcon />,
                    label: "New Folder",
                    action: () => setNewFolderDrawerOpen(true),
                  },
                  {
                    icon: <DriveFileMoveIcon />,
                    label: "Edit",
                    action: () => SetRenameDrawer(true),
                  },
                  {
                    icon: <DriveFileMoveIcon />,
                    label: "Move",
                    action: () => setMoveDrawerOpen(true),
                  },
                  {
                    icon: <UploadFileIcon />,
                    label: "New File",
                    action: () => setFileUploadDrawerOpen(true),
                  },
                  {
                    icon: <DriveFolderUploadIcon />,
                    label: "Upload Folder",
                    action: () => setFolderUploaDrawerOpen(true),
                  },
                  {
                    icon: <DeleteIcon />,
                    label: "Delete",
                    action: () => deleteItem(item),
                  }
                );
              } else if (docType === "private") {
                menuItems.push(
                  {
                    icon: <FolderIcon />,
                    label: "New Folder",
                    action: () => setNewFolderDrawerOpen(true),
                  },
                  {
                    icon: <UploadFileIcon />,
                    label: "New File",
                    action: () => setFileUploadDrawerOpen(true),
                  },
                  {
                    icon: <DriveFileMoveIcon />,
                    label: "Move",
                    action: () => setMoveDrawerOpen(true),
                  },
                  {
                    icon: <DriveFileMoveIcon />,
                    label: "Edit",
                    action: () => SetRenameDrawer(true),
                  },
                  {
                    icon: <DeleteIcon />,
                    label: "Delete",
                    action: () => deleteItem(item),
                  }
                );
              }
            }

            // -------------------------------
            // 📄 FILE TYPE
            // -------------------------------
            else {
              if (docType === "client") {
                menuItems.push(
                  {
                    icon: <DriveFileMoveIcon />,
                    label: "Edit",
                    action: () => SetRenameDrawer(true),
                  },
                  {
                    icon: <DriveFileMoveIcon />,
                    label: "Move",
                    action: () => setMoveDrawerOpen(true),
                  },
                  {
                    icon: <LockIcon />,
                    label: isLocked ? "Unlock" : "Lock",
                    action: () => toggleReadOnly(item),
                  },
                  {
                    icon: <DeleteIcon />,
                    label: "Delete",
                    action: () => deleteItem(item),
                  }
                );
              }

              // else if (docType === "firm") {
              //   const currentStatus =
              //     item.meta?.signStatus || "sendForSignature";
              //   const currentApprovalStatus =
              //     item.meta?.authStatus || "sendForApproval";

              //   const isSignatureDisabled =
              //     currentStatus === "pendingSignature" ||
              //     currentStatus === "signatureCompleted";

              //   const isApprovalDisabled =
              //     currentApprovalStatus === "pendingApproval" ||
              //     currentApprovalStatus === "cancledApproval" ||
              //     currentApprovalStatus === "approvalCompleted";

              //   const invoiceStatus = item.meta?.lockInvoiceStatus; // pendingPayment / paymentCompleted / null
              //   console.log("invoiceStatus", invoiceStatus);
              //   let invoiceLabel = "Lock with Invoice";
              //   // If invoice is pending payment → show UNLOCK (enabled)
              //   if (invoiceStatus === "pendingpayment") {
              //     invoiceLabel = "Unlock Invoice";
              //   }

              //   // If invoice is completed or not locked → show LOCK (enabled)
              //   if (invoiceStatus === "paymentcompleted" || !invoiceStatus) {
              //     invoiceLabel = "Lock Invoice";
              //   }
              //   menuItems.push(
              //     {
              //       icon: <DriveFileMoveIcon />,
              //       label: "Edit",
              //       action: () => SetRenameDrawer(true),
              //     },
              //     {
              //       icon: <DriveFileMoveIcon />,
              //       label: "Move",
              //       action: () => setMoveDrawerOpen(true),
              //     },

              //     {
              //       icon: <PenTool size={16} />,
              //       label: statusTextMap[currentStatus],
              //       action: () => toggleSignStatus(item),
              //       custom: true, // flag to handle differently
              //       currentStatus, // pass for icon color
              //       disabled: isSignatureDisabled,
              //     },
              //     {
              //       icon: <Stamp size={16} />,
              //       label: approvalStatusTextMap[currentApprovalStatus],
              //       action: () => toggleApprovalStatus(item),
              //       type: "approval",
              //       currentApprovalStatus,
              //       disabled: isApprovalDisabled,
              //     },
              //     {
              //       icon:
              //         invoiceStatus === "pendingpayment" ? (
              //           <LockOpenIcon />
              //         ) : (
              //           <LockIcon />
              //         ),
              //       label: invoiceLabel,
              //       action: () => toggleInvoiceLock(item),
              //       disabled: false, // Unlock should NOT be disabled when pending
              //     },

              //     {
              //       icon: <DeleteIcon />,
              //       label: "Delete",
              //       action: () => deleteItem(item),
              //     }
              //   );
              // }
              else if (docType === "firm") {
                const currentStatus =
                  item.meta?.signStatus || "sendForSignature";
                const approvalStatus =
                  item.meta?.authStatus || "sendForApproval";
                const invoiceStatus = item.meta?.lockInvoiceStatus;

                const isSignatureDisabled =
                  currentStatus === "pendingSignature" ||
                  currentStatus === "signatureCompleted";

                const isApprovalCompleted =
                  approvalStatus === "approvalCompleted";
                // const isApprovalPending = approvalStatus === "pendingApproval";
                const isApprovalCanceled =
                  approvalStatus === "canceledApproval";

                let invoiceLabel = "Lock Invoice";
                if (invoiceStatus === "pendingpayment")
                  invoiceLabel = "Unlock Invoice";
                if (invoiceStatus === "paymentcompleted" || !invoiceStatus)
                  invoiceLabel = "Lock Invoice";

                menuItems.push(
                  {
                    icon: <DriveFileMoveIcon />,
                    label: "Edit",
                    action: () => SetRenameDrawer(true),
                  },
                  {
                    icon: <DriveFileMoveIcon />,
                    label: "Move",
                    action: () => setMoveDrawerOpen(true),
                  },

                  // ---------------- SIGNATURE BUTTON ----------------
                  // {
                  //   icon: <PenTool size={16} />,
                  //   label: statusTextMap[currentStatus],
                  //   action: () => toggleSignStatus(item),
                  //   disabled: isSignatureDisabled,
                  // }
                );
// SIGNATURE MENU
if (currentStatus === "pendingSignature") {
  menuItems.push({
    icon: <CancelIcon />,
    label: "Cancel Signature Request",
    action: () => cancelSignature(item),
  });
} else {
  menuItems.push({
    icon: <PenTool size={16} />,
    label: statusTextMap[currentStatus],
    action: () => toggleSignStatus(item),
    disabled: isSignatureDisabled,
  });
}

                // ---------------- APPROVAL MENU LOGIC ----------------
                if (approvalStatus === "sendForApproval") {
                  menuItems.push({
                    icon: <Stamp size={16} />,
                    label: "Send For Approval",
                    action: () => toggleApprovalStatus(item),
                    // action: () => handleOpenApprovalDialog(item),
                  });
                }

                if (approvalStatus === "pendingApproval") {
                  menuItems.push({
                    icon: <CancelIcon />,
                    label: "Cancel Approval Request",
                    action: () => handleCancelApproval(item),
                  });
                }

                if (isApprovalCompleted) {
                  menuItems.push({
                    icon: <Stamp size={16} />,
                    label: "Approved",
                    disabled: true,
                  });
                }

                if (isApprovalCanceled) {
                  menuItems.push({
                    icon: <Stamp size={16} />,
                    label: "Approval Canceled",
                    disabled: true,
                  });
                }

                // ---------------- INVOICE LOCK ----------------
                menuItems.push({
                  icon:
                    invoiceStatus === "pendingpayment" ? (
                      <LockOpenIcon />
                    ) : (
                      <LockIcon />
                    ),
                  label: invoiceLabel,
                  action: () => toggleInvoiceLock(item),
                });

                // ---------------- DELETE ----------------
                menuItems.push({
                  icon: <DeleteIcon />,
                  label: "Delete",
                  action: () => deleteItem(item),
                });
              } else if (docType === "private") {
                menuItems.push(
                  {
                    icon: <DriveFileMoveIcon />,
                    label: "Edit",
                    action: () => SetRenameDrawer(true),
                  },
                  {
                    icon: <DeleteIcon />,
                    label: "Delete",
                    action: () => deleteItem(item),
                  }
                );
              }
            }

            return menuItems.map(({ icon, label, action, disabled }) => (
              <MenuItem
                key={label}
                disabled={(label !== "Unlock" && isLocked) || disabled}
                // disabled={label !== "Unlock" && isLocked} // allow unlock even if locked
                onClick={() => {
                  action();
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                {React.cloneElement(icon, { sx: { mr: 0.5, fontSize: 16 } })}
                {label}
              </MenuItem>
            ));
          })()}
        </Menu>
        <Dialog
          open={invoiceDialogOpen}
          onClose={() => setInvoiceDialogOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Select Invoices To Lock</DialogTitle>

          <DialogContent dividers>
            {invoiceList.length === 0 && (
              <Typography textAlign="center" color="text.secondary" p={2}>
                No invoices found
              </Typography>
            )}

            <Box sx={{ overflowX: "auto", mt: 1 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Select</TableCell>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {invoiceList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>No invoices found.</TableCell>
                    </TableRow>
                  ) : (
                    invoiceList.map((inv) => {
                      const id = inv._id;
                      const checked = selectedInvoices.includes(id);

                      return (
                        <TableRow
                          key={id}
                          hover
                          sx={{
                            cursor: "pointer",
                            bgcolor: checked ? "#e3f2fd" : "inherit",
                          }} // optional: highlight selected
                          onClick={() => {
                            setSelectedInvoices((prev) => {
                              const updated = prev.includes(id)
                                ? prev.filter((x) => x !== id)
                                : [...prev, id];

                              console.log("Selected invoices:", updated); // <-- log here
                              return updated;
                            });
                          }}
                        >
                          <TableCell>
                            <Checkbox checked={checked} />
                          </TableCell>
                          <TableCell>{inv.invoicenumber}</TableCell>
                          <TableCell>{inv.description || "—"}</TableCell>
                          <TableCell>
                            {new Date(inv.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>₹{inv.summary?.total}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setInvoiceDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Lock Invoice
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Apply Template to Account
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="template-label">Select Template</InputLabel>
        <Select
          labelId="template-label"
          value={selectedTemplate}
          label="Select Template"
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <MenuItem value="">
            <em>Choose a template</em>
          </MenuItem>
          {templates.map((template) => (
            <MenuItem key={template._id} value={template._id}>
              {template.templatename}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        disabled={loading || !selectedTemplate}
        onClick={applyTemplateToAccount}
        sx={{ textTransform: "none" }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Apply Template"
        )}
      </Button>

      <FolderTreeView accountId={data} />
    </Box>
  );
};

export default DocsFolderTree;
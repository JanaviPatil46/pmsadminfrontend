import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Menu,
  MenuItem,FormControl,Alert,Select,CircularProgress,InputLabel,Dialog,DialogTitle,DialogContent,TextField,DialogActions
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import customCss from "./docuseal-dark-theme.css";
import { DocusealBuilder } from "@docuseal/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import FileUploadDrawer from "./drawers/FileUploadDrawer"
import CreteFolderDrawer from "./drawers/CreteFolderDrawer"
import FolderUploadDrawer from "./drawers/FolderUploadDrawer"
import RenameDrawer from "./drawers/RenameDrawer";
import MoveDrawer from "./drawers/MoveDrawer";
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from 'axios';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { Eye, PenTool, Stamp, Lock } from "lucide-react";
import {
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
} from "lucide-react";
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from 'react-toastify';
const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
const DocsFolderTree = () => {
const { data } = useParams();
console.log("acount id for the documentation",data)
    const [templates, setTemplates] = useState([]);
  
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch templates list
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://www.snptaxes.com/api/foldertemp/templatelist");
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
        console.log("ghjh")
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
    fetch(`https://www.snptaxes.com/api/docManagement/apply-template`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
       
        // alert("Folder Template Assign Successfully");
        toast.success("Folder Template Assign Successfully")
        
      })
      .catch((error) => {
        console.error(error);
        toast.error(error)
        alert("Failed to Assign Folder Template");
      });
  };

  const handleApplyTemplate = async () => {
    await applyTemplateToAccount();
  };




  const FolderTreeView = ({accountId}) => {
  
  const [clientEmail, setClientEmail] = useState(""); // store client email
    // const [approvedFiles, setApprovedFiles] = useState(new Set());
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
    const fetchAccountDetails = async () => {
      try {
        const res = await fetch(
          `https://www.snptaxes.com/api/accounts/${accountId}`
        );
        const data = await res.json();
        console.log("accounts details",data)
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
    console.log("folder structure of account is",accountId)
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
   const[selectedItem,setSelectedItem]=useState("")
  // console.log("hgjhg",data)
   
  
    useEffect(() => {
       fetchFolderTree(accountId);
    }, [accountId]);
  
   // API call to fetch folder tree for a given template ID
    const fetchFolderTree = async (accountId) => {
      try {
        const res = await fetch(`https://www.snptaxes.com/api/accountsdoc/files/list?folderPath=${accountId}`);
        const data = await res.json();
        console.log("janavi patil",data)
        if (res.ok) {
          setFolderTree(data.contents);
        } else {
          setError('Failed to fetch folder tree');
        }
      } catch (err) {
        setError('Error fetching folder tree');
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
    const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
      const [token, setToken] = useState("");
  const [showBuilderFor, setShowBuilderFor] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); 
// Toggle signature and request token
const toggleSignStatus = async (item) => {
  try {
    // Cycle status (optional, keep your logic)
    const currentStatus = item.meta?.signStatus || "sendForSignature";
    const currentIndex = SIGN_STATUSES.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % SIGN_STATUSES.length;
    const nextStatus = SIGN_STATUSES[nextIndex];
    // 

    // Request token
    const fileUrl = `https://snptaxes.com/uploads/accounts/${item.path}`;
    const fileName = item.name;
    const res = await fetch(
      `${SIGNATURE_API}/api/generate-token?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}&accountId=${accountId}`
    );
    const data = await res.json();

    setToken(data.token);
    setShowBuilderFor(item); // important: must match the Dialog condition
    setOpenDialog(true);
    await updateStatus(item, "signStatus", nextStatus);
  } catch (err) {
    console.error(err);
  }
};

    // const toggleSignStatus = (item) => {
    //   console.log("signature item", item)
    //   
    //   const currentStatus = item.meta?.signStatus || "sendForSignature";
  
    //   // Find the next status in the cycle
    //   const currentIndex = SIGN_STATUSES.indexOf(currentStatus);
    //   const nextIndex = (currentIndex + 1) % SIGN_STATUSES.length; // loops back to start if at end
    //   const nextStatus = SIGN_STATUSES[nextIndex];
  
    //   // Update the item meta
    //   updateStatus(item, "signStatus", nextStatus);
    // };
    const APPROVAL_STATUSES = [
      "sendForApproval",
      "pendingApproval",
      "cancledApproval",,
      "approvalCompleted",
    ];
  
    const approvalStatusTextMap = {
      sendForApproval: "Send for Approval",
      pendingApproval: "Waiting for Approval",
      cancledApproval:"cancledApproval",
      approvalCompleted: "Approval Completed",
    };
  
    // const toggleApprovalStatus = (item) => {
    //   const currentStatus = item.meta?.authStatus || "sendForApproval";
  
    //   // Find the next status in the cycle
    //   const currentIndex = APPROVAL_STATUSES.indexOf(currentStatus);
    //   const nextIndex = (currentIndex + 1) % APPROVAL_STATUSES.length; // loops back to start if at end
    //   const nextStatus = APPROVAL_STATUSES[nextIndex];
  
    //   // Update the item meta
    //   updateStatus(item, "authStatus", nextStatus);
    // };
  
    // 🔹 Step 1: Click menu item → open dialog
const toggleApprovalStatus = (item) => {
  handleMenuClose(); // Close context menu
  setSelectedItem(item); // store the current item for later use
  setOpenApprovalDialog(true); // open the dialog
};
// 🔹 Step 2: Close dialog
const handleCloseDialog = () => {
  setOpenApprovalDialog(false);
  setDescription("");
  setSelectedItem(null);
};

// 🔹 Step 3: Send approval request
const handleRequestApproval = async () => {
  if (!selectedItem) return;
 console.log("signature path", selectedItem)
  try {
    const fileUrl = `https://snptaxes.com/uploads/accounts/${selectedItem.path}`;

    const payload = {
      accountId: accountId,
      filename: selectedItem.name,
      fileUrl,
      clientEmail: clientEmail,
      description: description,
    };

    console.log("payload", payload);

    const res = await fetch(`${DOCS_MANAGMENTS}/approvals/request-approval`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to send approval request.");

    alert(`Approval request sent to ${payload.clientEmail}`);

    // ✅ Update authStatus after successful request
    const currentStatus = selectedItem.meta?.authStatus || "sendForApproval";
    const currentIndex = APPROVAL_STATUSES.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % APPROVAL_STATUSES.length;
    const nextStatus = APPROVAL_STATUSES[nextIndex];

    await updateStatus(selectedItem, "authStatus", nextStatus);

   

    // ✅ Close dialog
    handleCloseDialog();
  } catch (err) {
    console.error("Approval request failed:", err);
    alert("Failed to send approval request.");
  }
};
    // 🔹 Frontend: Update any status (read, sign, approval)
    const updateStatus = async (item, statusType, newValue) => {
      try {
        if (!item?.path) return alert("Invalid item selected");
  
        const body = {
          targetPath: item.path,
          status: {
            [statusType]: newValue, // dynamic key
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
          toast.success(data.message)
          fetchFolderTree(accountId); // refresh folder tree to reflect change
        } else {
          alert(data.error || "Failed to update status");
          toast.error(data.error)
        }
      } catch (err) {
        console.error("Error updating status:", err);
        alert("Error updating status");
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
          toast.success(data.message)
        } else {
          alert("Error: " + data.error);
        }
      } catch (err) {
        console.error(err);
        toast.error(err)
        alert("Failed to update read-only status");
      }
    };
  
    // 🗑️ Delete File or Folder (Universal)
    const deleteItem = async (item) => {
      if (!item?.path) return alert("Invalid path");
  
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
          toast.success(data.message)
           setTimeout(() => {
    fetchFolderTree(accountId);
  }, 800); 
          //  fetchFolderTree(accountId);
        } else {
          alert(data.message || "Failed to delete");
                toast.error(data.message)
        }
      } catch (err) {
        console.error("Error deleting item:", err);
        alert("Error deleting file or folder");
              toast.error(err)
      }
  
      handleMenuClose();
    };
  
    const handleMoveFolder = async (folder) => {
      alert(`Move folder: ${folder.path}`); // implement backend
      handleMenuClose();
    };
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
  
   const renderTree = (items, level = 0, parentPath = "") => {
      return (
        <>
        <Box component="ul" sx={{ listStyle: "none", pl: level * 2, mb: 1 }}>
          {items.map((item) => {
            const fullPath = parentPath
              ? `${parentPath}/${item.name}`
              : item.name;
            const meta = item.meta || {};
  
            // 🎯 Define colors for statuses
            const getColor = (status) => (status ? "#1976d2" : "#9e9e9e");
  
            const StatusIcons = () => (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", ml: 1 }}>
                <Eye size={16} color={getColor(meta.readStatus)} />
                <PenTool size={16} color={getColor(meta.signStatus)} />
                <Stamp size={16} color={getColor(meta.authStatus)} />
                <Lock size={16} color={meta.readOnly ? "#e53935" : "#9e9e9e"} />
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
                  // 📁 Folder with open/close icon
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
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {item.name}
                      </Typography>
                      <StatusIcons />
                    </Box>
  
                    {/* Optional: Folder menu */}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                    >
                      <MoreVertIcon size={16} />
                    </IconButton>
                  </Box>
                ) : (
                  // 📄 File with single dot icon
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pl: 4,
                      mb: 1,
                      borderRadius: 2,
                      "&:hover .file-menu-icon": { opacity: 1 },
                    }}
                  >
                    <FileIcon
                      size={16}
                      color="#757575"
                      style={{ marginRight: 6 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ flex: 1, wordBreak: "break-word", color: meta.readOnly ? "#999" : "#1976d2", textDecoration: meta.readOnly ? "none" : "underline",
                      cursor: meta.readOnly ? "not-allowed" : "pointer", }}
                      onClick={handleSafeFileClick}
                    >
                      {item.name}
                    </Typography>
                    <StatusIcons />
  
                    {/* 🔵 Single blue dot icon for file menu */}
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
                      onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                    />
                  </Box>
                )}
  
                {/* Recursive children */}
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
        <Dialog
  open={openDialog} // must match exactly
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
    {token && showBuilderFor && ( <DocusealBuilder token={token} customCss={customCss} />)}
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
      placeholder="Type a short description or note for this approval..."
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
  
        {/* Context Menu */}
        {/* <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {(() => {
            const isLocked = selectedFolderForMenu?.meta?.readOnly === true;
            const isRead = selectedFolderForMenu?.meta?.readStatus === true;
            const currentStatus =
              selectedFolderForMenu?.meta?.signStatus || "sendForSignature";
            const isApproved = selectedFolderForMenu?.meta?.authStatus === true;
  
            return (
              <>
                <MenuItem
                  disabled={isLocked}
                  onClick={() => {
                    setMoveDrawerOpen(true);
                    handleMenuClose();
                  }}
                  sx={{ fontSize: "0.8rem", py: 0.5 }}
                >
                  <DriveFileMoveIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  Move
                </MenuItem>
  
                <MenuItem
                  disabled={isLocked}
                  onClick={() => {
                    deleteItem(selectedFolderForMenu);
                    handleMenuClose();
                  }}
                  sx={{ fontSize: "0.8rem", py: 0.5 }}
                >
                  <DeleteIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  Delete
                </MenuItem>
  
                <MenuItem
                  disabled={isLocked}
                  onClick={() => {
                    setNewFolderDrawerOpen(true);
                    handleMenuClose();
                  }}
                  sx={{ fontSize: "0.8rem", py: 0.5 }}
                >
                  <FolderIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  New Folder
                </MenuItem>
  
                <MenuItem
                  disabled={isLocked}
                  onClick={() => {
                    setFileUploadDrawerOpen(true);
                    handleMenuClose();
                  }}
                  sx={{ fontSize: "0.8rem", py: 0.5 }}
                >
                  <UploadFileIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  New File
                </MenuItem>
  
                <MenuItem
                  disabled={isLocked}
                  onClick={() => {
                    setFolderUploaDrawerOpen(true);
                    handleMenuClose();
                  }}
                  sx={{ fontSize: "0.8rem", py: 0.5 }}
                >
                  <DriveFolderUploadIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  Upload Folder
                </MenuItem>
  
                <MenuItem
                  disabled={isLocked}
                  onClick={() => {
                    SetRenameDrawer(true);
                    handleMenuClose();
                  }}
                  sx={{ fontSize: "0.8rem", py: 0.5 }}
                >
                  <DriveFileMoveIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  Edit
                </MenuItem>
  
                <MenuItem
                  disabled={isLocked}
                  onClick={() => {
                    toggleSignStatus(selectedFolderForMenu);
                    handleMenuClose();
                  }}
                  sx={{ fontSize: "0.8rem", py: 0.5 }}
                >
                  <PenTool
                    size={16}
                    color={
                      currentStatus === "signatureCompleted"
                        ? "#1976d2"
                        : "#807878ff"
                    }
                    style={{ marginRight: 6 }}
                  />
                  {statusTextMap[currentStatus]}
                </MenuItem>
  
                <MenuItem
                  disabled={isLocked}
                  onClick={() => {
                    toggleReadStatus(selectedFolderForMenu);
                    handleMenuClose();
                  }}
                  sx={{ fontSize: "0.8rem", py: 0.5 }}
                >
                  <Eye
                    size={16}
                    color={
                      isLocked
                        ? "#f5ecec"
                        : isRead
                        ? "#1976d2"
                        : "#807878ff"
                    }
                    style={{ marginRight: 6 }}
                  />
                  {isRead ? "Mark Unread" : "Mark Read"}
                </MenuItem>
  
                <MenuItem
                  disabled={isLocked}
                  onClick={() => {
                    toggleApprovalStatus(selectedFolderForMenu);
                    handleMenuClose();
                  }}
                  sx={{ fontSize: "0.8rem", py: 0.5 }}
                >
                  <Stamp
                    size={16}
                    color={
                      isApproved ? "#1976d2" : "#807878ff"
                    }
                    style={{ marginRight: 6 }}
                  />
                  {
                    approvalStatusTextMap[
                      selectedFolderForMenu?.meta?.authStatus ||
                        "sendForApproval"
                    ]
                  }
                </MenuItem>
  
                <MenuItem
                  onClick={() => {
                    toggleReadOnly(selectedFolderForMenu);
                    handleMenuClose();
                  }}
                  sx={{ fontSize: "0.8rem", py: 0.5 }}
                >
                  {isLocked ? (
                    <LockOpenIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  ) : (
                    <LockIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  )}
                  {isLocked ? "Unlock" : "Lock"}
                </MenuItem>
              </>
            );
          })()}
        </Menu> */}
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
          { icon: <FolderIcon />, label: "New Folder", action: () => setNewFolderDrawerOpen(true) },
          { icon: <DriveFileMoveIcon />, label: "Edit", action: () => SetRenameDrawer(true) },
          { icon: <DriveFileMoveIcon />, label: "Move", action: () => setMoveDrawerOpen(true) },
          { icon: <DeleteIcon />, label: "Delete", action: () => deleteItem(item) },
          { icon: <UploadFileIcon />, label: "New File", action: () => setFileUploadDrawerOpen(true) },
          { icon: <DriveFolderUploadIcon />, label: "Upload Folder", action: () => setFolderUploaDrawerOpen(true) },
          { icon: <LockIcon />, label: isLocked ? "Unlock" : "Lock", action: () => toggleReadOnly(item) }
        );
      } else if (docType === "firm") {
        menuItems.push(
          { icon: <FolderIcon />, label: "New Folder", action: () => setNewFolderDrawerOpen(true) },
          { icon: <DriveFileMoveIcon />, label: "Edit", action: () => SetRenameDrawer(true) },
          { icon: <DriveFileMoveIcon />, label: "Move", action: () => setMoveDrawerOpen(true) },
           { icon: <UploadFileIcon />, label: "New File", action: () => setFileUploadDrawerOpen(true) },
          { icon: <DriveFolderUploadIcon />, label: "Upload Folder", action: () => setFolderUploaDrawerOpen(true) },
          { icon: <DeleteIcon />, label: "Delete", action: () => deleteItem(item) }
        );
      } else if (docType === "private") {
        menuItems.push(
          { icon: <FolderIcon />, label: "New Folder", action: () => setNewFolderDrawerOpen(true) },
          { icon: <UploadFileIcon />, label: "New File", action: () => setFileUploadDrawerOpen(true) },
          { icon: <DriveFileMoveIcon />, label: "Move", action: () => setMoveDrawerOpen(true) },
          { icon: <DriveFileMoveIcon />, label: "Edit", action: () => SetRenameDrawer(true) },
          { icon: <DeleteIcon />, label: "Delete", action: () => deleteItem(item) }
        );
      }
    }

    // -------------------------------
    // 📄 FILE TYPE
    // -------------------------------
    else {
      if (docType === "client") {
        menuItems.push(
          { icon: <DriveFileMoveIcon />, label: "Edit", action: () => SetRenameDrawer(true) },
          { icon: <DriveFileMoveIcon />, label: "Move", action: () => setMoveDrawerOpen(true) },
          { icon: <LockIcon />, label: isLocked ? "Unlock" : "Lock", action: () => toggleReadOnly(item) },
          { icon: <DeleteIcon />, label: "Delete", action: () => deleteItem(item) }
        );
      } else if (docType === "firm") {
         const currentStatus = item.meta?.signStatus || "sendForSignature";
         const currentApprovalStatus = item.meta?.authStatus || "sendForApproval";
  const isApproved = currentApprovalStatus === "approvalCompleted";
         menuItems.push(
          { icon: <DriveFileMoveIcon />, label: "Edit", action: () => SetRenameDrawer(true) },
          { icon: <DriveFileMoveIcon />, label: "Move", action: () => setMoveDrawerOpen(true) },
          // { icon: <PenTool size={16} />, label: "Request Sign", action: () => toggleSignStatus(item) },
            {
      icon: <PenTool size={16} />,
      label: statusTextMap[currentStatus],
      action: () => toggleSignStatus(item),
      custom: true, // flag to handle differently
      currentStatus, // pass for icon color
    },
    {
      icon: <Stamp size={16} />,
      label: approvalStatusTextMap[currentApprovalStatus],
      action: () => toggleApprovalStatus(item),
      type: "approval",
      currentApprovalStatus,
    },
          // { icon: <Stamp size={16} />, label: "Send Approval", action: () => toggleApprovalStatus(item) },
          { icon: <DeleteIcon />, label: "Delete", action: () => deleteItem(item) },
          { icon: <DownloadIcon />, label: "Download", action: () => window.open(item.url, "_blank") }
        );
      } else if (docType === "private") {
        menuItems.push(
          { icon: <DriveFileMoveIcon />, label: "Edit", action: () => SetRenameDrawer(true) },
          { icon: <DeleteIcon />, label: "Delete", action: () => deleteItem(item) }
        );
      }
    }

    return menuItems.map(({ icon, label, action }) => (
      <MenuItem
        key={label}
        disabled={label !== "Unlock" && isLocked} // allow unlock even if locked
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

        {/* Context Menu */}
{/* <Menu
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
    const currentSignStatus = item?.meta?.signStatus || "sendForSignature";
    const isApproved = item?.meta?.authStatus === true;
    const isRead = item?.meta?.readStatus === true;

    // Determine doc category: firm / client / private
    // (You can adjust this logic based on your actual folder structure)
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
        // Client Uploaded Docs (Folder)
        menuItems.push(
          { icon: <FolderIcon />, label: "New Folder", action: () => setNewFolderDrawerOpen(true) },
          { icon: <DriveFileMoveIcon />, label: "Edit", action: () => SetRenameDrawer(true) },
          { icon: <DriveFileMoveIcon />, label: "Move", action: () => setMoveDrawerOpen(true) },
          { icon: <DeleteIcon />, label: "Delete", action: () => deleteItem(item) },
          { icon: <UploadFileIcon />, label: "New File", action: () => setFileUploadDrawerOpen(true) },
          { icon: <DriveFolderUploadIcon />, label: "Upload Folder", action: () => setFolderUploaDrawerOpen(true) },
          { icon: <PenTool size={16} />, label: "Seal", action: () => toggleSignStatus(item) }
        );
      } else if (docType === "firm") {
        // Firm Docs (Folder)
        menuItems.push(
          { icon: <FolderIcon />, label: "New Folder", action: () => setNewFolderDrawerOpen(true) },
          { icon: <DriveFileMoveIcon />, label: "Edit", action: () => SetRenameDrawer(true) },
          { icon: <DriveFileMoveIcon />, label: "Move", action: () => setMoveDrawerOpen(true) },
          { icon: <DeleteIcon />, label: "Delete", action: () => deleteItem(item) }
        );
      } else if (docType === "private") {
        // Private Folder (Folder)
        menuItems.push(
          { icon: <FolderIcon />, label: "New Folder", action: () => setNewFolderDrawerOpen(true) },
          { icon: <UploadFileIcon />, label: "New File", action: () => setFileUploadDrawerOpen(true) },
          { icon: <DriveFileMoveIcon />, label: "Move", action: () => setMoveDrawerOpen(true) },
          { icon: <DriveFileMoveIcon />, label: "Edit", action: () => SetRenameDrawer(true) },
          { icon: <DeleteIcon />, label: "Delete", action: () => deleteItem(item) }
        );
      }
    }

    // -------------------------------
    // 📄 FILE TYPE
    // -------------------------------
    else {
      if (docType === "client") {
        // Client Uploaded Docs (File)
        menuItems.push(
          { icon: <DriveFileMoveIcon />, label: "Edit", action: () => SetRenameDrawer(true) },
          { icon: <DriveFileMoveIcon />, label: "Move", action: () => setMoveDrawerOpen(true) },
          { icon: <PenTool size={16} />, label: "Seal", action: () => toggleSignStatus(item) },
          { icon: <DeleteIcon />, label: "Delete", action: () => deleteItem(item) }
        );
      } else if (docType === "firm") {
        // Firm Docs (File)
        menuItems.push(
          { icon: <DriveFileMoveIcon />, label: "Edit", action: () => SetRenameDrawer(true) },
          { icon: <DriveFileMoveIcon />, label: "Move", action: () => setMoveDrawerOpen(true) },
          { icon: <PenTool size={16} />, label: "Request Sign", action: () => toggleSignStatus(item) },
          { icon: <Stamp size={16} />, label: "Send Approval", action: () => toggleApprovalStatus(item) },
          { icon: <DownloadIcon />, label: "Download", action: () => window.open(item.url, "_blank") },
          { icon: <DeleteIcon />, label: "Delete", action: () => deleteItem(item) }
        );
      } else if (docType === "private") {
        // Private Folder (File)
        menuItems.push(
          { icon: <DriveFileMoveIcon />, label: "Edit", action: () => SetRenameDrawer(true) },
          { icon: <DeleteIcon />, label: "Delete", action: () => deleteItem(item) }
        );
      }
    }

    return menuItems.map(({ icon, label, action }) => (
      <MenuItem
        key={label}
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
</Menu> */}

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
        {loading ? <CircularProgress size={24} color="inherit" /> : "Apply Template"}
      </Button>

      


      <FolderTreeView accountId={data} />
    </Box>
  )
}

export default DocsFolderTree
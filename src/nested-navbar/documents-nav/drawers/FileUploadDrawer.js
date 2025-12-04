// import React, { useState, useEffect } from "react";
// import {
//   FaFilePdf,
//   FaFileWord,
//   FaFileExcel,
//   FaFileImage,
//   FaFileAlt,
// } from "react-icons/fa";
// import { AiFillFileUnknown } from "react-icons/ai";

// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
// } from "@mui/material";
// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import axios from "axios";
// import { toast } from "react-toastify";

// const FileUploadDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
//   accountId,
// }) => {
//   const [file, setFile] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSelectedFolder("");
//       setFile(null);
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   // const handleFileChange = (e) => setFile(e.target.files[0]);
//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const maxSize = 50 * 1024 * 1024; // 50 MB
//     const forbiddenTypes = ["video/", "audio/"];

//     const validFiles = selectedFiles.filter((file) => {
//       if (file.size > maxSize) {
//         alert(`❌ ${file.name} exceeds 50 MB limit.`);
//         return false;
//       }
//       if (forbiddenTypes.some((type) => file.type.startsWith(type))) {
//         alert(`❌ ${file.name} is an audio or video file — not allowed.`);
//         return false;
//       }
//       return true;
//     });

//     setFiles(validFiles);
//   };
//   const handleFolderSelect = (path) => setSelectedFolder(path);

//   const handleUpload = async () => {
//     if (files.length === 0 || !selectedFolder) {
//       setMessage("Please select files and a folder.");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       files.forEach((file) => formData.append("files", file));

//       const res = await axios.post(
//         `https://www.snptaxes.com/api/accountsdoc/file/upload?folderPath=${encodeURIComponent(
//           selectedFolder
//         )}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setMessage(`✅ ${res.data.message || "Files uploaded successfully"}`);
//       toast.success(`✅ ${res.data.message || "Files uploaded successfully"}`);
//       setFiles([]);
//       onClose();
//       fetchFolderTree();
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error uploading files");
//     }
//   };
//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose}>
//       <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           📄 Upload File jan v
//         </Typography>

//         <Button
//           variant="outlined"
//           component="label"
//           fullWidth
//           sx={{ mt: 1, mb: 2 }}
//         >
//           {files.length > 0
//             ? `${files.length} file(s) selected`
//             : "Select Files"}
//           <input type="file" hidden multiple onChange={handleFileChange} />
//         </Button>

//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleUpload}
//         >
//           Upload
//         </Button>

//         {message && (
//           <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
//         )}

//         <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
//           Close
//         </Button>

//         <Box sx={{ mt: 3 }}>
//           <Typography variant="subtitle1" gutterBottom>
//             Select Folder from Tree
//           </Typography>
//           <FolderTreeSelector
//             items={folderTree}
//             onSelect={handleFolderSelect}
//             selectedFolder={selectedFolder}
//           />
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };

// // Recursive Folder Tree with files and MUI
// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };
//   const getFileIcon = (fileName) => {
//     const ext = fileName.split(".").pop().toLowerCase();

//     switch (ext) {
//       case "pdf":
//         return <FaFilePdf color="#d32f2f" size={18} />;
//       case "jpg":
//       case "jpeg":
//       case "png":
//       case "gif":
//         return <FaFileImage color="#1976d2" size={18} />;
//       case "doc":
//       case "docx":
//         return <FaFileWord color="#1565c0" size={18} />;
//       case "xls":
//       case "xlsx":
//         return <FaFileExcel color="#2e7d32" size={18} />;
//       case "txt":
//       case "md":
//         return <FaFileAlt color="#616161" size={18} />;
//       default:
//         return <AiFillFileUnknown color="#757575" size={18} />;
//     }
//   };

//   return (
//     <List disablePadding>
//       {items?.map((item) => {
//         const isExpanded = expanded[item.path];
//         const isSelected = selectedFolder === item.path;

//         if (item.type !== "folder") return null;

//         return (
//           <React.Fragment key={item.path}>
//             <ListItem
//               sx={{
//                 pl: 2 + level * 2,
//                 bgcolor: isSelected ? "#b2d8ff" : "transparent",
//                 borderRadius: 1,
//                 mb: 0.5,
//                 "&:hover": { bgcolor: "#dbefff" },
//                 cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
//               }}
//               onClick={() => {
//                 if (!item.meta?.readOnly) onSelect(item.path);
//               }}
//             >
//               <ListItemIcon
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleExpand(item.path);
//                 }}
//               >
//                 {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
//               </ListItemIcon>

//               <ListItemText
//                 primary={item.name}
//                 sx={{
//                   fontWeight: isSelected ? "bold" : "normal",
//                   color: isSelected ? "#0056b3" : "inherit",
//                 }}
//               />

//               {item.children?.length > 0 &&
//                 (isExpanded ? (
//                   <ExpandLess
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                   />
//                 ) : (
//                   <ExpandMore
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                   />
//                 ))}
//             </ListItem>

//             <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//               {/* Render subfolders recursively */}
//               <FolderTreeSelector
//                 items={item.children}
//                 onSelect={onSelect}
//                 selectedFolder={selectedFolder}
//                 level={level + 1}
//               />

//               {/* Render files inside folder */}
//               {item.meta?.files?.length > 0 && (
//                 <List sx={{ pl: 4 }}>
//                   {item.meta.files.map((file) => (
//                     <ListItem key={file.name} sx={{ pl: 2 }}>
//                       <ListItemIcon>
//                         <Box sx={{ mr: 1 }}>{getFileIcon(file.name)}</Box>
//                       </ListItemIcon>
//                       <ListItemText
//                         primary={`${file.name}${
//                           file.readOnly ? " (Read Only)" : ""
//                         }`}
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//               )}
//             </Collapse>
//           </React.Fragment>
//         );
//       })}
//     </List>
//   );
// };

// export default FileUploadDrawer;

// import React, { useState, useEffect } from "react";
// import {
//   FaFilePdf,
//   FaFileWord,
//   FaFileExcel,
//   FaFileImage,
//   FaFileAlt,
// } from "react-icons/fa";
// import { AiFillFileUnknown } from "react-icons/ai";

// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
// } from "@mui/material";

// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";

// import axios from "axios";
// import { toast } from "react-toastify";

// const FileUploadDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
//   accountId,
// }) => {
//   const [files, setFiles] = useState([]);
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");
//   const [selectedInvoices, setSelectedInvoices] = useState([]);
//   const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false); // <-- Dialog
//   const [invoiceList, setInvoiceList] = useState([]); // <-- Invoices
//   useEffect(() => {
//     if (invoiceDialogOpen) {
//       fetchInvoices();
//     }
//   }, [invoiceDialogOpen]);

//   const fetchInvoices = async () => {
//     try {
//       const response = await fetch(
//         `https://www.snptaxes.com/workflow/invoices/invoice/pending/invoicelistby/accountid/${accountId}`
//       );
//       const data = await response.json();
//       setInvoiceList(data.invoice);
//     } catch (err) {
//       console.error("Error fetching invoices", err);
//     }
//   };

//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSelectedFolder("");
//       setFiles([]);
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   // Handle multiple file selection
//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const maxSize = 50 * 1024 * 1024; // 50MB

//     const validFiles = selectedFiles.filter((file) => {
//       if (file.size > maxSize) {
//         alert(`❌ ${file.name} exceeds 50 MB.`);
//         return false;
//       }
//       if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
//         alert(`❌ ${file.name} is audio/video — not allowed.`);
//         return false;
//       }
//       return true;
//     });

//     setFiles(validFiles);
//   };

//   const handleFolderSelect = (path) => setSelectedFolder(path);

//   // 🔵 Step 1: Open Dialog BEFORE Uploading
//   const handleUpload = () => {
//     if (files.length === 0 || !selectedFolder) {
//       setMessage("Please select files and a folder.");
//       return;
//     }
//     setInvoiceDialogOpen(true); // ← open invoice selection dialog
//   };

//   // 🔵 Step 2: Upload AFTER clicking OK in dialog
//   const performUpload = async () => {
//     try {
//       const formData = new FormData();
//       files.forEach((file) => formData.append("files", file));

//       const res = await axios.post(
//         `https://www.snptaxes.com/api/accountsdoc/file/upload?folderPath=${encodeURIComponent(
//           selectedFolder
//         )}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       toast.success(res.data.message || "Files uploaded successfully");

//       setInvoiceDialogOpen(false); // Close dialog
//       onClose(); // Close upload drawer
//       // onOpenInvoiceDrawer(); // 👉 Open RIGHT SIDE MAIN DRAWER

//       fetchFolderTree();
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error uploading files");
//     }
//   };

//   return (
//     <>
//       {/* MAIN FILE UPLOAD DRAWER */}
//       <Drawer anchor="right" open={isOpen} onClose={onClose}>
//         <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
//           <Typography variant="h6" gutterBottom>
//             📄 Upload File
//           </Typography>

//           <Button
//             variant="outlined"
//             component="label"
//             fullWidth
//             sx={{ mt: 1, mb: 2 }}
//           >
//             {files.length > 0
//               ? `${files.length} file(s) selected`
//               : "Select Files"}
//             <input type="file" hidden multiple onChange={handleFileChange} />
//           </Button>

//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             onClick={handleUpload}
//           >
//             Upload
//           </Button>

//           {message && (
//             <Typography sx={{ mt: 2, fontWeight: "bold" }}>
//               {message}
//             </Typography>
//           )}

//           <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
//             Close
//           </Button>

//           <Box sx={{ mt: 3 }}>
//             <Typography variant="subtitle1" gutterBottom>
//               Select Folder
//             </Typography>
//             <FolderTreeSelector
//               items={folderTree}
//               onSelect={handleFolderSelect}
//               selectedFolder={selectedFolder}
//             />
//           </Box>
//         </Box>
//       </Drawer>

//       {/* INVOICE DIALOG BEFORE UPLOAD */}
//       <Dialog
//         open={invoiceDialogOpen}
//         onClose={() => setInvoiceDialogOpen(false)}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>Select Invoice(s)</DialogTitle>

//         <DialogContent>
//           <Typography mb={2}>
//             Select one or more invoices before uploading.
//           </Typography>

//           <Box sx={{ overflowX: "auto", mt: 1 }}>
//             <Table sx={{ minWidth: 650 }}>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Select</TableCell>
//                   <TableCell>Invoice #</TableCell>
//                   <TableCell>Description</TableCell>
//                   <TableCell>Created At</TableCell>
//                   <TableCell>Amount</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {invoiceList.map((inv) => {
//                   const invoiceId = inv._id;
//                   const isChecked = selectedInvoices.includes(invoiceId);

//                   return (
//                     <TableRow
//                       key={invoiceId}
//                       hover
//                       sx={{ cursor: "pointer" }}
//                       onClick={() => {
//                         setSelectedInvoices((prev) =>
//                           prev.includes(invoiceId)
//                             ? prev.filter((id) => id !== invoiceId)
//                             : [...prev, invoiceId]
//                         );
//                       }}
//                     >
//                       <TableCell>
//                         <Checkbox checked={isChecked} />
//                       </TableCell>

//                       <TableCell>{inv.invoicenumber}</TableCell>

//                       <TableCell>{inv.description || "—"}</TableCell>

//                       <TableCell>
//                         {new Date(inv.createdAt).toLocaleDateString()}
//                       </TableCell>

//                       <TableCell>₹{inv.summary.total}</TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </Box>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setInvoiceDialogOpen(false)}>Cancel</Button>

//           <Button
//             variant="contained"
//             onClick={() => {
//               if (selectedInvoices.length === 0) {
//                 toast.warning("Please select at least one invoice");
//                 return;
//               }
//               performUpload();
//             }}
//           >
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// // ============ Folder Tree (unchanged) ============
// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   const getFileIcon = (fileName) => {
//     const ext = fileName.split(".").pop().toLowerCase();
//     switch (ext) {
//       case "pdf":
//         return <FaFilePdf color="#d32f2f" size={18} />;
//       case "jpg":
//       case "jpeg":
//       case "png":
//       case "gif":
//         return <FaFileImage color="#1976d2" size={18} />;
//       case "doc":
//       case "docx":
//         return <FaFileWord color="#1565c0" size={18} />;
//       case "xls":
//       case "xlsx":
//         return <FaFileExcel color="#2e7d32" size={18} />;
//       case "txt":
//       case "md":
//         return <FaFileAlt color="#616161" size={18} />;
//       default:
//         return <AiFillFileUnknown color="#757575" size={18} />;
//     }
//   };

//   return (
//     <List disablePadding>
//       {items?.map((item) => {
//         const isExpanded = expanded[item.path];
//         const isSelected = selectedFolder === item.path;

//         if (item.type !== "folder") return null;

//         return (
//           <React.Fragment key={item.path}>
//             <ListItem
//               sx={{
//                 pl: 2 + level * 2,
//                 bgcolor: isSelected ? "#b2d8ff" : "transparent",
//                 borderRadius: 1,
//                 mb: 0.5,
//                 "&:hover": { bgcolor: "#dbefff" },
//                 cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
//               }}
//               onClick={() => !item.meta?.readOnly && onSelect(item.path)}
//             >
//               <ListItemIcon
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleExpand(item.path);
//                 }}
//               >
//                 {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
//               </ListItemIcon>

//               <ListItemText
//                 primary={item.name}
//                 sx={{
//                   fontWeight: isSelected ? "bold" : "normal",
//                   color: isSelected ? "#0056b3" : "inherit",
//                 }}
//               />

//               {item.children?.length > 0 &&
//                 (isExpanded ? (
//                   <ExpandLess
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                   />
//                 ) : (
//                   <ExpandMore
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleExpand(item.path);
//                     }}
//                   />
//                 ))}
//             </ListItem>

//             <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//               <FolderTreeSelector
//                 items={item.children}
//                 onSelect={onSelect}
//                 selectedFolder={selectedFolder}
//                 level={level + 1}
//               />

//               {item.meta?.files?.length > 0 && (
//                 <List sx={{ pl: 4 }}>
//                   {item.meta.files.map((file) => (
//                     <ListItem key={file.name} sx={{ pl: 2 }}>
//                       <ListItemIcon>
//                         <Box sx={{ mr: 1 }}>{getFileIcon(file.name)}</Box>
//                       </ListItemIcon>
//                       <ListItemText
//                         primary={`${file.name}${file.readOnly ? " (Read Only)" : ""}`}
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//               )}
//             </Collapse>
//           </React.Fragment>
//         );
//       })}
//     </List>
//   );
// };

// export default FileUploadDrawer;


import React, { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";

import {
  Drawer,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import axios from "axios";
import { toast } from "react-toastify";

const FileUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  accountId,
}) => {
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Invoice dialogs & selection
  const [invoiceConfirmOpen, setInvoiceConfirmOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  // Reset on drawer open/close
  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFiles([]);
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

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

  // Handle multiple file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024; // 50 MB

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        alert(`❌ ${file.name} exceeds 50 MB.`);
        return false;
      }
      if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        alert(`❌ ${file.name} is audio/video — not allowed.`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  const handleFolderSelect = (path) => setSelectedFolder(path);

  // 🔹 Step 1: Open confirmation dialog
  const handleUpload = () => {
    if (files.length === 0 || !selectedFolder) {
      setMessage("Please select files and a folder.");
      return;
    }
    // setInvoiceConfirmOpen(true);
    // Check if folder contains "Firm Documents Shared with Client"
 if (selectedFolder.includes("Firm Documents Shared with Client")) {
  setInvoiceConfirmOpen(true);          // ask user Yes/No
} else {   performUpload();                      // directly upload without invoice dialog
 }
  };

  // 🔹 Step 2: Upload files (direct or after invoice selection)
  const performUpload = async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      formData.append("invoices", JSON.stringify(selectedInvoices));

      const res = await axios.post(
        `https://www.snptaxes.com/api/accountsdoc/file/upload?folderPath=${encodeURIComponent(
          selectedFolder
        )}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data.message || "Files uploaded successfully");

      setInvoiceDialogOpen(false);
      setSelectedInvoices([]);
      onClose();
      fetchFolderTree();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error uploading files");
    }
  };

  return (
    <>
      {/* ---------------------- MAIN UPLOAD DRAWER ---------------------- */}
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            📄 Upload File
          </Typography>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 1, mb: 2 }}
          >
            {files.length > 0
              ? `${files.length} file(s) selected`
              : "Select Files"}
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUpload}
          >
            Upload
          </Button>

          {message && (
            <Typography sx={{ mt: 2, fontWeight: "bold" }}>
              {message}
            </Typography>
          )}

          <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
            Close
          </Button>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Select Folder
            </Typography>
            <FolderTreeSelector
              items={folderTree}
              onSelect={handleFolderSelect}
              selectedFolder={selectedFolder}
            />
          </Box>
        </Box>
      </Drawer>

      {/* ---------------------- CONFIRMATION DIALOG ---------------------- */}
      <Dialog
        open={invoiceConfirmOpen}
        onClose={() => setInvoiceConfirmOpen(false)}
      >
        <DialogTitle>Invoice Lock</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to lock this file to an invoice?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setInvoiceConfirmOpen(false);
              performUpload(); // Direct upload
            }}
          >
            No
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setInvoiceConfirmOpen(false);
              // setInvoiceDialogOpen(true); // Open invoice selection
                // open invoice dialog only if path matches
  if (selectedFolder.includes("Firm Documents Shared with Client")) {
    setInvoiceDialogOpen(true);
  } else {
    performUpload();
  }
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------------------- INVOICE SELECTION DIALOG ---------------------- */}
      <Dialog
        open={invoiceDialogOpen}
        onClose={() => setInvoiceDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Select Invoice(s)</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            Select one or more invoices before uploading.
          </Typography>

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
              {/* <TableBody>
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
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          setSelectedInvoices((prev) =>
                            prev.includes(id)
                              ? prev.filter((x) => x !== id)
                              : [...prev, id]
                          )
                        }
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
              </TableBody> */}
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
          sx={{ cursor: "pointer", bgcolor: checked ? "#e3f2fd" : "inherit" }} // optional: highlight selected
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
          <Button
            variant="contained"
            onClick={() => {
              if (selectedInvoices.length === 0) {
                toast.warning("Please select at least one invoice.");
                return;
              }
              performUpload();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// ================= FOLDER TREE ===================
const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
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

  return (
    <List disablePadding>
      {items?.map((item) => {
        const isExpanded = expanded[item.path];
        const isSelected = selectedFolder === item.path;

        if (item.type !== "folder") return null;

        return (
          <React.Fragment key={item.path}>
            <ListItem
              sx={{
                pl: 2 + level * 2,
                bgcolor: isSelected ? "#b2d8ff" : "transparent",
                borderRadius: 1,
                mb: 0.5,
                "&:hover": { bgcolor: "#dbefff" },
                cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
              }}
              onClick={() => !item.meta?.readOnly && onSelect(item.path)}
            >
              <ListItemIcon
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.path);
                }}
              >
                {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
              </ListItemIcon>

              <ListItemText
                primary={item.name}
                sx={{
                  fontWeight: isSelected ? "bold" : "normal",
                  color: isSelected ? "#0056b3" : "inherit",
                }}
              />

              {item.children?.length > 0 &&
                (isExpanded ? (
                  <ExpandLess
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.path);
                    }}
                  />
                ) : (
                  <ExpandMore
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.path);
                    }}
                  />
                ))}
            </ListItem>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />
            </Collapse>
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default FileUploadDrawer;

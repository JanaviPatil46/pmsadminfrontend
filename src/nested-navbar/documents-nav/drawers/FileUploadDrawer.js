// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const drawerStyle = {
//   position: "fixed",
//   top: 0,
//   right: 0,
//   height: "100%",
//   width: "350px",
//   backgroundColor: "#8de066ff",
//   boxShadow: "-2px 0 5px rgba(0,0,0,0.3)",
//   padding: "20px",
//   transition: "transform 0.3s ease-in-out",
//   zIndex: 1000,
// };

// const overlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   backgroundColor: "rgba(0,0,0,0.3)",
//   zIndex: 999,
// };

// const FileUploadDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
// }) => {
//   const [file, setFile] = useState(null);
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");

//   const handleFileChange = (e) => setFile(e.target.files[0]);

//   const handleFolderSelect = (path) => setSelectedFolder(path);

//   useEffect(() => {
//     // Set selected folder only when drawer opens
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSelectedFolder(""); // reset internal selection when drawer closes
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   const handleUpload = async () => {
//     if (!file || !selectedFolder) {
//       setMessage("Please select a file and folder.");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await axios.post(
//         `https://www.snptaxes.com/api/accountsdoc/file/upload?folderPath=${encodeURIComponent(
//           selectedFolder
//         )}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setMessage(`✅ File uploaded: ${res.data.fileMeta.name}`);
//       setFile(null);
//       fetchFolderTree(); // refresh folder explorer
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Error uploading file");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div style={overlayStyle} onClick={onClose}></div>
//       <div
//         style={{
//           ...drawerStyle,
//           transform: isOpen ? "translateX(0)" : "translateX(100%)",
//         }}
//       >
//         <h3>📄 Upload File </h3>

//         <label>Selected Folder:</label>
//         <input
//           type="text"
//           value={selectedFolder}
//           onChange={(e) => setSelectedFolder(e.target.value)}
//           placeholder="Enter folder path or select from tree"
//           style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
//         />

//         <input
//           type="file"
//           onChange={handleFileChange}
//           style={{ width: "100%", marginBottom: "10px" }}
//         />

//         <button
//           onClick={handleUpload}
//           style={{
//             width: "100%",
//             padding: "10px",
//             backgroundColor: "#0b5ed7",
//             color: "#fff",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           Upload
//         </button>

//         {message && <p style={{ marginTop: "10px" }}>{message}</p>}

//         <button
//           onClick={onClose}
//           style={{
//             marginTop: "20px",
//             padding: "6px 10px",
//             backgroundColor: "#ccc",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           Close
//         </button>

//         <div style={{ marginTop: "20px" }}>
//           {!selectedFolder && ( // ✅ Show tree only if no folder is pre-selected
//             <>
//               <h4>Select Parent Folder from Tree</h4>
//               <FolderTreeSelector
//                 items={folderTree}
//                 onSelect={handleFolderSelect}
//                 selectedFolder={selectedFolder}
//               />
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// // 🔹 Recursive Folder Selector inside Drawer with Expand/Collapse
// const FolderTreeSelector = ({ items, onSelect, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   return (
//     <ul style={{ paddingLeft: `${level * 15}px`, listStyleType: "none" }}>
//       {items?.map((item) => (
//         <li key={item.path} style={{ marginBottom: "4px" }}>
//           {item.type === "folder" ? (
//             <>
//               {/* Folder name with expand/collapse */}
//               <span
//                 style={{ cursor: "pointer", color: "#0b5ed7" }}
//                 onClick={() => toggleExpand(item.path)}
//               >
//                 {expanded[item.path] ? "📂" : "📁"} {item.name}{" "}
//                 {item.meta?.readOnly}
//               </span>

//               {/* Select Folder Button (disabled if read-only) */}
//               <button
//                 onClick={() => onSelect(item.path)}
//                 disabled={item.meta?.readOnly}
//                 style={{
//                   marginLeft: "10px",
//                   padding: "2px 6px",
//                   cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
//                   opacity: item.meta?.readOnly ? 0.5 : 1,
//                 }}
//               >
//                 Select
//               </button>

//               {/* Expand children recursively */}
//               {expanded[item.path] &&
//                 item.children &&
//                 item.children.length > 0 && (
//                   <FolderTreeSelector
//                     items={item.children}
//                     onSelect={onSelect}
//                     level={level + 1}
//                   />
//                 )}

//               {/* Show files inside folder */}
//               {expanded[item.path] &&
//                 item.meta?.files &&
//                 item.meta.files.length > 0 && (
//                   <ul style={{ paddingLeft: "15px" }}>
//                     {item.meta.files.map((file) => (
//                       <li key={file.name}>
//                         📄 {file.name} {file.readOnly ? "(Read Only)" : ""}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//             </>
//           ) : (
//             <span>
//               📄 {item.name} {item.meta?.readOnly ? "(Read Only)" : ""}
//             </span>
//           )}
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default FileUploadDrawer;

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
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
}) => {
  const [file, setFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFile(null);
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleFolderSelect = (path) => setSelectedFolder(path);

  const handleUpload = async () => {
    if (!file || !selectedFolder) {
      setMessage("Please select a file and folder.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `https://www.snptaxes.com/api/accountsdoc/file/upload?folderPath=${encodeURIComponent(
          selectedFolder
        )}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(`✅ File uploaded: ${res.data.fileMeta.name}`);
      toast.success(`✅ File uploaded: ${res.data.fileMeta.name}`)
      setFile(null);
      onClose();
      fetchFolderTree();
    } catch (err) {
      console.error(err);
      toast.error(err)
      setMessage("❌ Error uploading file");
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📄 Upload File
        </Typography>

        {/* <TextField
          label="Selected Folder"
          placeholder="Enter folder path or select from tree"
          value={selectedFolder}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="dense"
        /> */}

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mt: 1, mb: 2 }}
        >
          {file ? file.name : "Select File"}
          <input type="file" hidden onChange={handleFileChange} />
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
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
        )}

        <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
          Close
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Folder from Tree
          </Typography>
          <FolderTreeSelector
            items={folderTree}
            onSelect={handleFolderSelect}
            selectedFolder={selectedFolder}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

// Recursive Folder Tree with files and MUI
const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
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
              onClick={() => {
                if (!item.meta?.readOnly) onSelect(item.path);
              }}
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
              {/* Render subfolders recursively */}
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />

              {/* Render files inside folder */}
              {item.meta?.files?.length > 0 && (
                <List sx={{ pl: 4 }}>
                  {item.meta.files.map((file) => (
                    <ListItem
                      key={file.name}
                      sx={{ pl: 2 }}
                    >
                      <ListItemIcon>
                        <InsertDriveFileIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${file.name}${
                          file.readOnly ? " (Read Only)" : ""
                        }`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Collapse>
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default FileUploadDrawer;


// import React, { useState, useEffect } from "react";

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

// const FolderUploadDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
// }) => {
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");
//   const [folderName, setFolderName] = useState("my-uploaded-folder");
//   const [files, setFiles] = useState([]);

//   const handleFolderSelect = (path) => setSelectedFolder(path);

//   useEffect(() => {
//     // Set selected folder only when drawer opens
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//       setFolderName("");
//     } else if (!isOpen) {
//       setSelectedFolder(""); // reset internal selection when drawer closes
//       setFolderName("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   // 📦 Handle folder selection
//   const handleUploadFolderSelect = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);

//     if (selectedFiles.length > 0) {
//       // Extract the top-level folder name from first file path
//       const firstPath = selectedFiles[0].webkitRelativePath;
//       const topLevelFolder = firstPath.split("/")[0];
//       setFolderName(topLevelFolder);
//     }
//   };

//   // 📤 Upload folder
//   const handleUpload = async () => {
//     if (files.length === 0) {
//       setMessage("Please select a folder first");
//       return;
//     }

//     // Combine selected folder path with the uploaded folder's original name
//     let targetFolderPath = selectedFolder
//       ? `${selectedFolder}/${folderName}`
//       : folderName;

//     // Normalize slashes (avoid double //)
//     targetFolderPath = targetFolderPath.replace(/\/+/g, "/");

//     const formData = new FormData();
//     files.forEach((file) => {
//       formData.append("files", file, file.webkitRelativePath);
//     });

//     try {
//       const res = await fetch(
//         `https://www.snptaxes.com/api/docManagement/folder/upload?folderPath=${encodeURIComponent(
//           targetFolderPath
//         )}`,
//         { method: "POST", body: formData }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         setMessage(
//           `✅ Folder uploaded successfully: ${data.files.length} files`
//         );
//         fetchFolderTree();
//       } else {
//         setMessage(`❌ Error: ${data.error}`);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("Upload failed");
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
//         <h3>Upload Folder</h3>

//         <label>Selected Folder:</label>
//         <input
//           type="text"
//           value={folderName}
//           onChange={(e) => setFolderName(e.target.value)}
//           placeholder="Enter folder path or select from tree"
//           style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
//         />
//         <label>Selected Path:</label>
//         <input
//           type="text"
//           value={selectedFolder}
//           onChange={(e) => setSelectedFolder(e.target.value)}
//           placeholder="Enter folder path or select from tree"
//           style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
//         />

//         <input
//           type="file"
//           webkitdirectory="true"
//           directory=""
//           multiple
//           onChange={handleUploadFolderSelect}
//         />

//         {/* Upload Button */}
//         <button
//           onClick={handleUpload}
//           style={{
//             width: "100%",
//             padding: "10px",
//             backgroundColor: "#0b5ed7",
//             color: "#fff",
//             border: "none",
//             borderRadius: "6px",
//             cursor: "pointer",
//           }}
//         >
//           🚀 Upload
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

// export default FolderUploadDrawer;


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
import { toast } from "react-toastify";

const FolderUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [folderName, setFolderName] = useState("my-uploaded-folder");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
      setFolderName("");
    } else if (!isOpen) {
      setSelectedFolder("");
      setFolderName("");
      setFiles([]);
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFolderSelect = (path) => setSelectedFolder(path);

  const handleUploadFolderSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    if (selectedFiles.length > 0) {
      const firstPath = selectedFiles[0].webkitRelativePath;
      const topLevelFolder = firstPath.split("/")[0];
      setFolderName(topLevelFolder);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("Please select a folder first");
      return;
    }

    let targetFolderPath = selectedFolder
      ? `${selectedFolder}/${folderName}`
      : folderName;

    targetFolderPath = targetFolderPath.replace(/\/+/g, "/");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file, file.webkitRelativePath);
    });

    try {
      const res = await fetch(
        `https://www.snptaxes.com/api/docManagement/folder/upload?folderPath=${encodeURIComponent(
          targetFolderPath
        )}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (res.ok) {
        // setMessage(`✅ Folder uploaded successfully: ${data.files.length} files`);
        toast.success(`Folder uploaded successfully: ${data.files.length} files`)
        fetchFolderTree();
        onClose()
        setFiles([]);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📁 Upload Folder
        </Typography>

        {/* <TextField
          label="Folder Name"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          fullWidth
          margin="dense"
        />

        <TextField
          label="Selected Path"
          placeholder="Select parent folder"
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
          {files.length > 0 ? `${files.length} files selected` : "Select Folder"}
          <input
            type="file"
            webkitdirectory="true"
            directory=""
            multiple
            hidden
            onChange={handleUploadFolderSelect}
          />
        </Button>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpload}
        >
          🚀 Upload
        </Button>

        {message && (
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
        )}

        <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
          Close
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Parent Folder from Tree
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

// Recursive folder tree
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
              {/* Subfolders */}
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />

              {/* Files inside folder */}
              {item.meta?.files?.length > 0 && (
                <List sx={{ pl: 4 }}>
                  {item.meta.files.map((file) => (
                    <ListItem key={file.name} sx={{ pl: 2 }}>
                      <ListItemIcon>
                        <InsertDriveFileIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${file.name}${file.readOnly ? " (Read Only)" : ""}`}
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

export default FolderUploadDrawer;


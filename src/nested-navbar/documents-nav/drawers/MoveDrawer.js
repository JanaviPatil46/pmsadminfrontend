// // ============================
// // 📁 Drawer: Create Folder (with highlight on selection)
// // ============================

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

// const MoveDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
// }) => {
//   const [destinationPath, setDestinationPath] = useState("");
//   const [sourcePath, setSourcePath] = useState("");
//   const [message, setMessage] = useState("");

//   const handleFolderSelect = (path) => setDestinationPath(path);
//   useEffect(() => {
//     // Set selected folder only when drawer opens
//     if (isOpen && selectedFolderForMenu) {
//       setSourcePath(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSourcePath(""); // reset internal selection when drawer closes
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   // 🔹 Function to move file/folder
//   const handleMove = async () => {
//     try {
//       setMessage("");

//       if (!sourcePath || !destinationPath) {
//         setMessage("Please enter both source and destination paths.");
//         return;
//       }

//       const res = await axios.post(
//         "https://www.snptaxes.com/api/accountsdoc/move",
//         {
//           sourcePath,
//           destinationPath,
//         }
//       );

//       setMessage(res.data.message);
//     } catch (err) {
//       if (err.response) setMessage(err.response.data.error || "Move failed");
//       else setMessage("Server not reachable");
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
//         <h3>📁 Move Folder / File</h3>

//         <label>Source Path:</label>
//         <input
//           type="text"
//           value={sourcePath}
//           readOnly
//           placeholder="Select from tree"
//           style={{
//             width: "100%",
//             marginBottom: "10px",
//             padding: "5px",
//             backgroundColor: "#f9f9f9",
//           }}
//         />

//         <label>Destination Path</label>
//         <input
//           type="text"
//           value={destinationPath}
//           onChange={(e) => setDestinationPath(e.target.value)}
//           placeholder="Enter new folder name"
//           style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
//         />

//         <button
//           onClick={handleMove}
//           style={{
//             width: "100%",
//             padding: "10px",
//             backgroundColor: "#0b5ed7",
//             color: "#fff",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           Move
//         </button>

//         {message && (
//           <p style={{ marginTop: "10px", fontWeight: "bold" }}>{message}</p>
//         )}

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
//           <>
//             <h4>Select Parent Folder from Tree</h4>
//             <FolderTreeSelector
//               items={folderTree}
//               onSelect={handleFolderSelect}
//               selectedFolder={sourcePath}
//             />
//           </>
//         </div>
//       </div>
//     </>
//   );
// };

// // 🔹 Recursive Folder Selector with Highlight
// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   return (
//     <ul style={{ paddingLeft: `${level * 15}px`, listStyleType: "none" }}>
//       {items?.map((item) => {
//         const isSelected = selectedFolder === item.path;

//         return (
//           <li
//             key={item.path}
//             style={{
//               marginBottom: "4px",
//               backgroundColor: isSelected ? "#b2d8ff" : "transparent",
//               borderRadius: "5px",
//               padding: "3px 5px",
//             }}
//           >
//             {item.type === "folder" ? (
//               <>
//                 <span
//                   style={{
//                     cursor: "pointer",
//                     color: isSelected ? "#0056b3" : "#0b5ed7",
//                     fontWeight: isSelected ? "bold" : "normal",
//                   }}
//                   onClick={() => toggleExpand(item.path)}
//                 >
//                   {expanded[item.path] ? "📂" : "📁"} {item.name}
//                 </span>
//                 <button
//                   onClick={() => onSelect(item.path)}
//                   disabled={item.meta?.readOnly}
//                   style={{
//                     marginLeft: "10px",
//                     padding: "2px 6px",
//                     cursor: item.meta?.readOnly ? "not-allowed" : "pointer",
//                     opacity: item.meta?.readOnly ? 0.5 : 1,
//                   }}
//                 >
//                   Select
//                 </button>

//                 {expanded[item.path] &&
//                   item.children &&
//                   item.children.length > 0 && (
//                     <FolderTreeSelector
//                       items={item.children}
//                       onSelect={onSelect}
//                       selectedFolder={selectedFolder}
//                       level={level + 1}
//                     />
//                   )}
//               </>
//             ) : null}
//           </li>
//         );
//       })}
//     </ul>
//   );
// };

// export default MoveDrawer;

// ============================
// 📁 Drawer: Move Folder / File (MUI Version)
// ============================

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Alert,ListItemIcon
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import axios from "axios";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
const MoveDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [destinationPath, setDestinationPath] = useState("");
  const [sourcePath, setSourcePath] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSourcePath(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSourcePath("");
      setDestinationPath("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleMove = async () => {
    try {
      setMessage("");

      if (!sourcePath || !destinationPath) {
        setMessage("Please select both source and destination paths.");
        return;
      }

      const res = await axios.post(
        "https://www.snptaxes.com/api/accountsdoc/move",
        { sourcePath, destinationPath }
      );

      setMessage(res.data.message);
      fetchFolderTree?.();
    } catch (err) {
      if (err.response) setMessage(err.response.data.error || "Move failed");
      else setMessage("Server not reachable");
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 360, p: 3, bgcolor: "#f8fff0", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📁 Move Folder / File
        </Typography>

        <TextField
          label="Source Path"
          value={sourcePath}
          fullWidth
          margin="dense"
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="Destination Path"
          value={destinationPath}
          onChange={(e) => setDestinationPath(e.target.value)}
          fullWidth
          margin="dense"
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleMove}
        >
          Move
        </Button>

        {message && (
          <Alert
            severity={message.includes("failed") ? "error" : "info"}
            sx={{ mt: 2 }}
          >
            {message}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Select Destination Folder
        </Typography>

        <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
          <FolderTreeSelector
            items={folderTree}
            onSelect={(path) => setDestinationPath(path)}
            selectedFolder={destinationPath}
          />
        </Box>

        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{ mt: 2, color: "#555" }}
        >
          Close
        </Button>
      </Box>
    </Drawer>
  );
};

// ============================
// 🔹 Recursive Folder Tree Selector (MUI)
// ============================

const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <List disablePadding>
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];

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
              <ListItemIcon onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }}>
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
                (isExpanded ? <ExpandLess onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }} /> : <ExpandMore onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }} />)}
            </ListItem>

            {item.children?.length > 0 && (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <FolderTreeSelector
                  items={item.children}
                  onSelect={onSelect}
                  selectedFolder={selectedFolder}
                  level={level + 1}
                />
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default MoveDrawer;


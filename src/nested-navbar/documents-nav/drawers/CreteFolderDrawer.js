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

// const CreateFolderDrawer = ({
//   isOpen,
//   onClose,
//   folderTree,
//   fetchFolderTree,
//   selectedFolderForMenu,
// }) => {
//   const [folderName, setFolderName] = useState("");
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [message, setMessage] = useState("");

//   const handleFolderSelect = (path) => setSelectedFolder(path);
//   useEffect(() => {
//     // Set selected folder only when drawer opens
//     if (isOpen && selectedFolderForMenu) {
//       setSelectedFolder(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSelectedFolder(""); // reset internal selection when drawer closes
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   // ✅ Create folder function
//   const handleCreateFolder = async () => {
//     if (!folderName) {
//       setMessage("⚠️ Folder name is required!");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "https://www.snptaxes.com/api/accountsdoc/folder",
//         {
//           name: folderName,
//           parentPath: selectedFolder || "",
//         }
//       );

//       setMessage(`✅ Folder created: ${res.data.metaData.name}`);
//       setFolderName("");
//       fetchFolderTree();
//     } catch (err) {
//       console.error(err);
//       setMessage(
//         `❌ Error creating folder: ${
//           err.response?.data?.error || "Server Error"
//         }`
//       );
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
//         <h3>📁 Create New Folder</h3>

//         <label>Folder Name:</label>
//         <input
//           type="text"
//           value={folderName}
//           onChange={(e) => setFolderName(e.target.value)}
//           placeholder="Enter new folder name"
//           style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
//         />

//         <label>Parent Folder Path:</label>
//         <input
//           type="text"
//           value={selectedFolder}
//           readOnly
//           placeholder="Select from tree"
//           style={{
//             width: "100%",
//             marginBottom: "10px",
//             padding: "5px",
//             backgroundColor: "#f9f9f9",
//           }}
//         />

//         <button
//           onClick={handleCreateFolder}
//           style={{
//             width: "100%",
//             padding: "10px",
//             backgroundColor: "#0b5ed7",
//             color: "#fff",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           Create Folder
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

// export default CreateFolderDrawer;

// ============================
// 📁 Drawer: Create Folder (MUI version)
// ============================

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,  Collapse,  ListItemIcon,
} from "@mui/material";
import axios from "axios";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
const CreateFolderDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [folderName, setFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");

  const handleFolderSelect = (path) => setSelectedFolder(path);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder(""); // reset selection when drawer closes
      setFolderName("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleCreateFolder = async () => {
    if (!folderName) {
      setMessage("⚠️ Folder name is required!");
      return;
    }
console.log("foldername",folderName)
console.log("selected path", selectedFolder)
    try {
      const res = await axios.post(
        "https://www.snptaxes.com/api/accountsdoc/folder",
        {
          name: folderName,
          parentPath: selectedFolder || "",
        }
      );
console.log("res",res)
      setMessage(`✅ Folder created: ${res.data.metaData.name}`);
      setFolderName("");
     
      // fetchFolderTree();
      // ✅ Wait for folder tree refresh
    await fetchFolderTree();
       onClose();
    } catch (err) {
      console.error(err);
      setMessage(
        `❌ Error creating folder: ${err.response?.data?.error || "Server Error"}`
      );
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 500, p: 3,  height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📁 Create New Folder
        </Typography>

        <TextField
         
          placeholder="Enter new folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          fullWidth
          margin="dense"
        />

       

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateFolder}
          fullWidth
          sx={{ mt: 2 }}
        >
          Create Folder
        </Button>

        {message && (
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
        )}

        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          Close
        </Button>

        {/* {!selectedFolder && ( */}
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
        {/* )} */}
      </Box>
    </Drawer>
  );
};

// 🔹 Recursive Folder Selector with Highlight (MUI)
// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   return (
//     <List sx={{ pl: level * 2 }}>
//       {items?.map((item) => {
//         const isSelected = selectedFolder === item.path;

//         return (
//           <ListItem
//             key={item.path}
//             sx={{
//               bgcolor: isSelected ? "#b2d8ff" : "transparent",
//               borderRadius: 1,
//               mb: 0.5,
//             }}
//             secondaryAction={
//               item.type === "folder" && (
//                 <Button
//                   size="small"
//                   onClick={() => onSelect(item.path)}
//                   disabled={item.meta?.readOnly}
//                   sx={{ ml: 1 }}
//                 >
//                   Select
//                 </Button>
//               )
//             }
//           >
//             {item.type === "folder" && (
//               <ListItemText
//                 primary={
//                   <span
//                     onClick={() => toggleExpand(item.path)}
//                     style={{
//                       cursor: "pointer",
//                       fontWeight: isSelected ? "bold" : "normal",
//                       color: isSelected ? "#0056b3" : "#0b5ed7",
//                     }}
//                   >
//                     {expanded[item.path] ? "📂" : "📁"} {item.name}
//                   </span>
//                 }
//               />
//             )}

//             {expanded[item.path] &&
//               item.children &&
//               item.children.length > 0 && (
//                 <FolderTreeSelector
//                   items={item.children}
//                   onSelect={onSelect}
//                   selectedFolder={selectedFolder}
//                   level={level + 1}
//                 />
//               )}
//           </ListItem>
//         );
//       })}
//     </List>
//   );
// };
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
export default CreateFolderDrawer;


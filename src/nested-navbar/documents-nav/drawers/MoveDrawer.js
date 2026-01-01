

// // ============================
// // 📁 Drawer: Move Folder / File (MUI Version)
// // ============================

// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Divider,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Collapse,
//   Alert,ListItemIcon
// } from "@mui/material";
// import FolderIcon from "@mui/icons-material/Folder";
// import FolderOpenIcon from "@mui/icons-material/FolderOpen";
// import axios from "axios";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import { toast } from "react-toastify";
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

//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setSourcePath(selectedFolderForMenu.path);
//     } else if (!isOpen) {
//       setSourcePath("");
//       setDestinationPath("");
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   const handleMove = async () => {
//     try {
//       setMessage("");

//       if (!sourcePath || !destinationPath) {
//         setMessage("Please select both source and destination paths.");
//         return;
//       }

//       const res = await axios.post(
//         "https://www.snptaxes.com/api/accountsdoc/move",
//         { sourcePath, destinationPath }
//       );

//       setMessage(res.data.message);
//       toast.success(res.data.message)
//       onClose();
//       fetchFolderTree?.();
//     } catch (err) {
//      if (err.response) {
//   toast.error(err.response.data.error || "Move failed");
// } else {
//   toast.error("Server not reachable");
// }
//     }
//   };

//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose}>
//       <Box sx={{ width: 360, p: 3, bgcolor: "#f8fff0", height: "100%" }}>
//         <Typography variant="h6" gutterBottom>
//           📁 Move Folder / File
//         </Typography>

//         {/* <TextField
//           label="Source Path"
//           value={sourcePath}
//           fullWidth
//           margin="dense"
//           InputProps={{ readOnly: true }}
//         />

//         <TextField
//           label="Destination Path"
//           value={destinationPath}
//           onChange={(e) => setDestinationPath(e.target.value)}
//           fullWidth
//           margin="dense"
//         /> */}

//         <Button
//           variant="contained"
//           fullWidth
//           sx={{ mt: 2 }}
//           onClick={handleMove}
//         >
//           Move
//         </Button>

//         {message && (
//           <Alert
//             severity={message.includes("failed") ? "error" : "info"}
//             sx={{ mt: 2 }}
//           >
//             {message}
//           </Alert>
//         )}

//         <Divider sx={{ my: 2 }} />

//         <Typography variant="subtitle1" gutterBottom>
//           Select Destination Folder
//         </Typography>

//         <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
//           <FolderTreeSelector
//             items={folderTree}
//             onSelect={(path) => setDestinationPath(path)}
//             selectedFolder={destinationPath}
//           />
//         </Box>

//         <Button
//           onClick={onClose}
//           variant="outlined"
//           fullWidth
//           sx={{ mt: 2, color: "#555" }}
//         >
//           Close
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// // ============================
// // 🔹 Recursive Folder Tree Selector (MUI)
// // ============================

// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   return (
//     <List disablePadding>
//       {items?.map((item) => {
//         if (item.type !== "folder") return null;

//         const isSelected = selectedFolder === item.path;
//         const isExpanded = expanded[item.path];

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
//               <ListItemIcon onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }}>
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
//                 (isExpanded ? <ExpandLess onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }} /> : <ExpandMore onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }} />)}
//             </ListItem>

//             {item.children?.length > 0 && (
//               <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//                 <FolderTreeSelector
//                   items={item.children}
//                   onSelect={onSelect}
//                   selectedFolder={selectedFolder}
//                   level={level + 1}
//                 />
//               </Collapse>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </List>
//   );
// };

// export default MoveDrawer;

// ============================
// 📁 Drawer: Move Folder / File (MUI Version) - Supports Single & Bulk
// ============================

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Alert,
  ListItemIcon,
  Chip,
  Stack,
  CircularProgress
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import axios from "axios";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import { toast } from "react-toastify";

const MoveDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  // New props for bulk operations
  isBulkOperation = false,
  selectedPaths = [],
  onMoveComplete
}) => {
  const [destinationPath, setDestinationPath] = useState("");
  const [sourcePaths, setSourcePaths] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isBulkOperation && selectedPaths.length > 0) {
        // Bulk mode: use provided paths
        setSourcePaths(selectedPaths);
      } else if (selectedFolderForMenu) {
        // Single mode: use selected item
        setSourcePaths([selectedFolderForMenu.path]);
      }
    } else {
      // Reset on close
      // setSourcePaths([]);
      setDestinationPath("");
      setMessage("");
      setLoading(false);
    }
  }, [isOpen, selectedFolderForMenu, isBulkOperation, selectedPaths]);

  const handleMove = async () => {
    try {
      setMessage("");
      setLoading(true);

      if (sourcePaths.length === 0) {
        setMessage("No source items selected.");
        toast.warning("No items selected");
        setLoading(false);
        return;
      }

      if (!destinationPath) {
        setMessage("Please select a destination folder.");
        toast.warning("Select destination folder");
        setLoading(false);
        return;
      }

      // Determine which API to use based on number of items
      const isBulk = sourcePaths.length > 1 || isBulkOperation;
      const endpoint = isBulk 
        ? "https://www.snptaxes.com/api/accountsdoc/bulk-move"
        : "https://www.snptaxes.com/api/accountsdoc/move";

      const requestData = isBulk
        ? { paths: sourcePaths, targetPath: destinationPath }
        : { sourcePath: sourcePaths[0], destinationPath };

      const res = await axios.post(endpoint, requestData);

      setMessage(res.data.message);
      toast.success(res.data.message);
      
      // Call onMoveComplete callback if provided (for bulk operations)
      if (onMoveComplete && typeof onMoveComplete === 'function') {
        onMoveComplete(destinationPath);
      }
      
      onClose();
      fetchFolderTree?.();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Move failed";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to get item name from path
  const getItemNameFromPath = (path) => {
    console.log("Getting item name from path:", path);
    return path.split('/').pop() || path;
  };

  // Check if destination is a subfolder of any source (to prevent circular moves)
  const isInvalidDestination = (destPath) => {
    // console.log("Checking invalid destination:", destPath, sourcePaths);
    return sourcePaths.some(sourcePath => {
      return destPath.startsWith(sourcePath + '/') || destPath === sourcePath;
    });
  };



  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 420, p: 3, bgcolor: "#f8fff0", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          {isBulkOperation ? "📦 Move Multiple Items" : "📁 Move Item"}
        </Typography>

        {/* Source Items Display */}
        <Box sx={{ mb: 3, p: 2, bgcolor: "#f0f8ff", borderRadius: 1 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            {isBulkOperation ? "Items to Move:" : "Item to Move:"}
          </Typography>
          
          {sourcePaths.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No items selected
            </Typography>
          ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {sourcePaths.slice(0, 5).map((path, index) => (
                <Chip
                  key={index}
                  label={getItemNameFromPath(path)}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
              {sourcePaths.length > 5 && (
                <Chip
                  label={`+${sourcePaths.length - 5} more`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
          )}
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Total: {sourcePaths.length} item(s)
          </Typography>
        </Box>

        {/* Move Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleMove}
          disabled={!destinationPath || sourcePaths.length === 0 || loading || isInvalidDestination(destinationPath)}
          startIcon={loading ? <CircularProgress size={20} /> : <MoveToInboxIcon />}
        >
          {loading ? "Moving..." : "Move Items"}
        </Button>

        {isInvalidDestination(destinationPath) && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Cannot move a folder into itself or its subfolder
          </Alert>
        )}

        {message && (
          <Alert
            severity={message.includes("failed") || message.includes("error") ? "error" : "info"}
            sx={{ mt: 2 }}
          >
            {message}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Select Destination Folder
        </Typography>

        <Box sx={{ maxHeight: "50vh", overflowY: "auto" }}>
          <FolderTreeSelector
            items={folderTree}
            onSelect={(path) => setDestinationPath(path)}
            selectedFolder={destinationPath}
            disabledPaths={sourcePaths} // Disable source folders from being selected
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          Selected destination: {destinationPath || "None"}
        </Typography>

        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{ mt: 2, color: "#555" }}
        >
          Cancel
        </Button>
      </Box>
    </Drawer>
  );
};

// ============================
// 🔹 Recursive Folder Tree Selector (MUI) - Enhanced
// ============================

const FolderTreeSelector = ({ 
  items, 
  onSelect, 
  selectedFolder, 
  disabledPaths = [],
  level = 0 
}) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  // Check if a folder should be disabled (is a source path or contains a source path)
  // const isFolderDisabled = (itemPath) => {
  //   return disabledPaths.some(disabledPath => 
  //     disabledPath === itemPath || 
  //     itemPath.startsWith(disabledPath + '/') ||
  //     disabledPath.startsWith(itemPath + '/')
  //   );
  // };
  const isFolderDisabled = (itemPath) => {
  return disabledPaths.includes(itemPath);
};


  return (
    <List disablePadding>
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];
        const isDisabled = isFolderDisabled(item.path) || item.meta?.readOnly;

        return (
          <React.Fragment key={item.path}>
            <ListItem
              sx={{
                pl: 2 + level * 2,
                bgcolor: isSelected ? "#b2d8ff" : "transparent",
                borderRadius: 1,
                mb: 0.5,
                "&:hover": { 
                  bgcolor: isDisabled ? "transparent" : "#dbefff" 
                },
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.5 : 1,
              }}
              onClick={() => {
                if (!isDisabled) onSelect(item.path);
              }}
            >
              <ListItemIcon 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (!isDisabled) toggleExpand(item.path); 
                }}
                sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
              >
                {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {item.name}
                    {item.meta?.readOnly && (
                      <Typography 
                        component="span" 
                        variant="caption" 
                        sx={{ color: "error.main", ml: 1 }}
                      >
                        (Locked)
                      </Typography>
                    )}
                  </Box>
                }
                sx={{
                  fontWeight: isSelected ? "bold" : "normal",
                  color: isSelected ? "#0056b3" : isDisabled ? "#999" : "inherit",
                }}
              />
              {item.children?.length > 0 && (
                <Box onClick={(e) => { 
                  e.stopPropagation(); 
                  if (!isDisabled) toggleExpand(item.path); 
                }}>
                  {isExpanded ? 
                    <ExpandLess sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }} /> : 
                    <ExpandMore sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }} />
                  }
                </Box>
              )}
            </ListItem>

            {item.children?.length > 0 && (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <FolderTreeSelector
                  items={item.children}
                  onSelect={onSelect}
                  selectedFolder={selectedFolder}
                  disabledPaths={disabledPaths}
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
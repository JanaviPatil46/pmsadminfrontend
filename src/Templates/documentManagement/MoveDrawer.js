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
//         "https://www.snptaxes.com/api/docManagement/move",
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
import axios from "axios";
import { toast } from "react-toastify";
import { FormDrawer, FormDrawerFooter, FormSection, FormField } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { FolderInput, ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";

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
        "https://www.snptaxes.com/api/docManagement/move",
        { sourcePath, destinationPath }
      );

      setMessage(res.data.message);
      toast.success(res.data.message);
      onClose();
      fetchFolderTree?.();
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error || "Move failed");
      } else {
        toast.error("Server not reachable");
      }
    }
  };

  return (
    <FormDrawer open={isOpen} onClose={onClose} title="Move Folder / File" width="md">
      <FormSection title="Move Details" icon={<FolderInput className="h-4 w-4" />}>
        <FormField label="Source Path">
          <Input value={sourcePath} readOnly className="bg-muted/40" />
        </FormField>

        <FormField label="Destination Path">
          <Input
            value={destinationPath}
            onChange={(e) => setDestinationPath(e.target.value)}
            placeholder="Select from tree or type path"
          />
        </FormField>

        {message && (
          <div className={`mt-3 rounded-lg border px-4 py-3 text-sm ${
            message.toLowerCase().includes("fail") || message.includes("Please")
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}>
            {message}
          </div>
        )}
      </FormSection>

      <FormSection title="Select Destination Folder">
        <div className="max-h-[45vh] overflow-y-auto rounded-lg border border-border bg-white p-2">
          <FolderTreeSelector
            items={folderTree}
            onSelect={(path) => setDestinationPath(path)}
            selectedFolder={destinationPath}
          />
        </div>
      </FormSection>

      <FormDrawerFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={handleMove}>Move</Button>
      </FormDrawerFooter>
    </FormDrawer>
  );
};

// ============================
// 🔹 Recursive Folder Tree Selector (MUI)
// ============================

// const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
//   const [expanded, setExpanded] = useState({});

//   const toggleExpand = (path) => {
//     setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   return (
//     <List disablePadding>
//       {items?.map((item) => {
//         const isSelected = selectedFolder === item.path;
//         const isExpanded = expanded[item.path] || false;

//         return (
//           <Box key={item.path} sx={{ pl: level * 2 }}>
//             <ListItem
//               disablePadding
//               sx={{
//                 bgcolor: isSelected ? "#cfe8fc" : "transparent",
//                 borderRadius: 1,
//                 mb: 0.5,
//               }}
//             >
//               <ListItemButton
//                 onClick={() =>
//                   item.type === "folder"
//                     ? toggleExpand(item.path)
//                     : onSelect(item.path)
//                 }
//                 sx={{ py: 0.5 }}
//               >
//                 {item.type === "folder" && (
//                   <>
//                     {isExpanded ? (
//                       <FolderOpenIcon sx={{ color: "#1976d2", mr: 1 }} />
//                     ) : (
//                       <FolderIcon sx={{ color: "#1976d2", mr: 1 }} />
//                     )}
//                     <ListItemText
//                       primary={item.name}
//                       primaryTypographyProps={{
//                         fontWeight: isSelected ? "bold" : "normal",
//                         color: isSelected ? "primary" : "text.primary",
//                       }}
//                     />
//                     <Button
//                       size="small"
//                       variant="outlined"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onSelect(item.path);
//                       }}
//                       disabled={item.meta?.readOnly}
//                       sx={{
//                         ml: 1,
//                         textTransform: "none",
//                         opacity: item.meta?.readOnly ? 0.5 : 1,
//                       }}
//                     >
//                       Select
//                     </Button>
//                   </>
//                 )}
//               </ListItemButton>
//             </ListItem>

//             {item.type === "folder" && (
//               <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//                 {item.children?.length > 0 && (
//                   <FolderTreeSelector
//                     items={item.children}
//                     onSelect={onSelect}
//                     selectedFolder={selectedFolder}
//                     level={level + 1}
//                   />
//                 )}
//               </Collapse>
//             )}
//           </Box>
//         );
//       })}
//     </List>
//   );
// };
const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (e, path) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div className="space-y-0.5" style={{ paddingLeft: level > 0 ? 16 : 0 }}>
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];

        return (
          <div key={item.path}>
            <div
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors ${
                isSelected
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-accent text-foreground"
              } ${item.meta?.readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (!item.meta?.readOnly) onSelect(item.path);
              }}
            >
              <button
                type="button"
                onClick={(e) => toggleExpand(e, item.path)}
                className="shrink-0 rounded p-0.5 hover:bg-accent"
              >
                {item.children?.length > 0 ? (
                  isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <span className="w-3.5" />
                )}
              </button>
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
              ) : (
                <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span className="truncate">{item.name}</span>
            </div>

            {isExpanded && item.children?.length > 0 && (
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MoveDrawer;

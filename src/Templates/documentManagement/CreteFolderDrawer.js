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
//         "https://www.snptaxes.com/api/docManagement/folder",
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
import axios from "axios";
import { toast } from "react-toastify";
import { FormDrawer, FormDrawerFooter, FormSection, FormField } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { FolderPlus, ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";

const CreateFolderDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu, templateId
}) => {
  const [folderName, setFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");

  const handleFolderSelect = (path) => setSelectedFolder(path);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFolderName("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleCreateFolder = async () => {
    if (!folderName) {
      setMessage("Folder name is required!");
      return;
    }

    try {
      const res = await axios.post(
        "https://www.snptaxes.com/api/docManagement/folder",
        {
          name: folderName,
          parentPath: selectedFolder || "",
          templateId: templateId
        }
      );

      setMessage(`Folder created: ${res.data.metaData.name}`);
      toast.success(`Folder created: ${res.data.metaData.name}`);
      setFolderName("");
      await fetchFolderTree();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err);
      setMessage(
        `Error creating folder: ${err.response?.data?.error || "Server Error"}`
      );
    }
  };

  return (
    <FormDrawer open={isOpen} onClose={onClose} title="Create New Folder" width="md">
      <FormSection title="Folder Details" icon={<FolderPlus className="h-4 w-4" />}>
        <FormField label="Folder Name">
          <Input
            placeholder="Enter new folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </FormField>

        {message && (
          <div className={`mt-3 rounded-lg border px-4 py-3 text-sm ${
            message.toLowerCase().includes("error") || message.includes("required")
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}>
            {message}
          </div>
        )}
      </FormSection>

      <FormSection title="Select Parent Folder">
        <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-border bg-white p-2">
          <FolderTreeSelector
            items={folderTree}
            onSelect={handleFolderSelect}
            selectedFolder={selectedFolder}
          />
        </div>
      </FormSection>

      <FormDrawerFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={handleCreateFolder}>Create Folder</Button>
      </FormDrawerFooter>
    </FormDrawer>
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

export default CreateFolderDrawer;


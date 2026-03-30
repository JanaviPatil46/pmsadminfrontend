// // ============================
// // ✏️ Drawer: Rename File or Folder
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

// const RenameDrawer = ({
//   isOpen,
//   onClose,
//   fetchFolderTree,
//   selectedFolderForMenu, // the selected file/folder to rename
// }) => {
//   const [newName, setNewName] = useState("");
//   const [currentPath, setCurrentPath] = useState("");
//   const [message, setMessage] = useState("");

//   // ✅ Pre-fill selected item info
//   useEffect(() => {
//     if (isOpen && selectedFolderForMenu) {
//       setCurrentPath(selectedFolderForMenu.path);
//       setNewName(selectedFolderForMenu.name);
//       setMessage("");
//     } else if (!isOpen) {
//       setCurrentPath("");
//       setNewName("");
//       setMessage("");
//     }
//   }, [isOpen, selectedFolderForMenu]);

//   // ✅ Rename function
//   const handleRename = async () => {
//     if (!newName.trim()) {
//       setMessage("⚠️ New name is required!");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "https://www.snptaxes.com/api/docManagement/rename",
//         {
//           currentPath,
//           newName,
//         }
//       );

//       setMessage(`✅ ${res.data.message}`);
//       fetchFolderTree(); // refresh folder structure
//       setTimeout(() => {
//         onClose();
//       }, 800);
//     } catch (err) {
//       console.error("Rename error:", err);
//       setMessage(`❌ Error: ${err.response?.data?.error || "Server Error"}`);
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
//         <h3>✏️ Rename Item</h3>

//         <label>Current Path:</label>
//         <input
//           type="text"
//           value={currentPath}
//           readOnly
//           style={{
//             width: "100%",
//             marginBottom: "10px",
//             padding: "5px",
//             backgroundColor: "#f9f9f9",
//           }}
//         />

//         <label>New Name:</label>
//         <input
//           type="text"
//           value={newName}
//           onChange={(e) => setNewName(e.target.value)}
//           placeholder="Enter new file or folder name"
//           style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
//         />

//         <button
//           onClick={handleRename}
//           style={{
//             width: "100%",
//             padding: "10px",
//             backgroundColor: "#0b5ed7",
//             color: "#fff",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           Rename
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
//       </div>
//     </>
//   );
// };

// export default RenameDrawer;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FormDrawer, FormDrawerFooter, FormSection, FormField } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { PenLine } from "lucide-react";

const RenameDrawer = ({
  isOpen,
  onClose,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [newName, setNewName] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setCurrentPath(selectedFolderForMenu.path);
      setNewName(selectedFolderForMenu.name);
      setMessage("");
    } else if (!isOpen) {
      setCurrentPath("");
      setNewName("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleRename = async () => {
    if (!newName.trim()) {
      setMessage("New name is required!");
      return;
    }

    try {
      const res = await axios.post(
        "https://www.snptaxes.com/api/docManagement/rename",
        {
          currentPath,
          newName,
        }
      );

      setMessage(res.data.message);
      toast.success(res.data.message);
      onClose();
      fetchFolderTree();
    } catch (err) {
      console.error("Rename error:", err);
      toast.error(err.response?.data?.error);
      setMessage(`Error: ${err.response?.data?.error || "Server Error"}`);
    }
  };

  return (
    <FormDrawer open={isOpen} onClose={onClose} title="Rename Item" width="sm">
      <FormSection title="Rename" icon={<PenLine className="h-4 w-4" />}>
        <FormField label="New Name">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new file or folder name"
          />
        </FormField>

        {message && (
          <div className={`mt-3 rounded-lg border px-4 py-3 text-sm ${
            message.toLowerCase().includes("error")
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}>
            {message}
          </div>
        )}
      </FormSection>

      <FormDrawerFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={handleRename}>Rename</Button>
      </FormDrawerFooter>
    </FormDrawer>
  );
};

export default RenameDrawer;


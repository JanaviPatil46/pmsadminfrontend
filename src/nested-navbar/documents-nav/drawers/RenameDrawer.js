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
//         "https://www.snptaxes.com/api/accountsdoc/rename",
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
import { Drawer, Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";

const RenameDrawer = ({
  isOpen,
  onClose,
  fetchFolderTree,
  selectedFolderForMenu, // the selected file/folder to rename
}) => {
  const [newName, setNewName] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Pre-fill selected item info
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

  // ✅ Rename function
  const handleRename = async () => {
    if (!newName.trim()) {
      setMessage("⚠️ New name is required!");
      return;
    }

    try {
      const res = await axios.post(
        "https://www.snptaxes.com/api/accountsdoc/rename",
        {
          currentPath,
          newName,
        }
      );

      setMessage(`✅ ${res.data.message}`);
         onClose();
      fetchFolderTree(); // refresh folder structure
     
    } catch (err) {
      console.error("Rename error:", err);
      setMessage(`❌ Error: ${err.response?.data?.error || "Server Error"}`);
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          ✏️ Rename Item
        </Typography>

        {/* <TextField
          label="Current Path"
          value={currentPath}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="dense"
        /> */}

        <TextField
          label="New Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new file or folder name"
          fullWidth
          margin="dense"
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRename}
        >
          Rename
        </Button>

        {message && (
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
        )}

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    </Drawer>
  );
};

export default RenameDrawer;


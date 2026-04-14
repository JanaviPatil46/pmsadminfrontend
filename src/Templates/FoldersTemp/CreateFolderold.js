// import { FaTimes } from "react-icons/fa";
// import {
//   Drawer,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import "./foldertemp.css";
// export default function CreateFolder({
//   isFolderFormOpen,
//   handleFormClose
// }) {
  
//   return (
//     <Drawer
//       anchor="right"
//       open={isFolderFormOpen}
//       onClose={handleFormClose}
//       PaperProps={{ sx: { width: 800 } }} // Set width of the Drawer
//     >
//       <div style={{ padding: 16 }}>
//         <Typography
//           variant="h6"
//           component="div"
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           Create Folder
//           <IconButton aria-label="close" onClick={handleFormClose}>
//             <FaTimes style={{ color: "#1976d3" }} />
//           </IconButton>
//         </Typography>

       
//       </div>
//     </Drawer>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { FaFolder, FaFolderOpen,  } from "react-icons/fa";

import "./foldertemp.css";

export default function CreateFolder({
  isFolderFormOpen,
  handleFormClose,
  API_KEY,
  templateId,
}) {
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState(null);
// console.log("folderslist",folders)
  useEffect(() => {
    // if (!isFolderFormOpen) return; 
    console.log(templateId)

    const fetchFolders = async () => {
      try {
        const url = `${API_KEY}/allFolders/${templateId}`;
        const response = await axios.get(url);

        const addIsOpenProperty = (folders, parentId = null) =>
          folders.map((folder, index) => ({
            ...folder,
            isOpen: true,
            id: `${parentId ? `${parentId}-` : ""}${index}`,
            contents: folder.contents
              ? addIsOpenProperty(
                  folder.contents,
                  `${parentId ? `${parentId}-` : ""}${index}`
                )
              : [],
          }));

        setFolders(addIsOpenProperty(response.data.folders || []));
      } catch (err) {
        console.error("Error fetching all folders:", err);
        setError(err.message || "An error occurred");
      }
    };

    fetchFolders();
  }, [ API_KEY, templateId]);

  const toggleFolder = (folderId) => {
    const updateFolders = (folders) =>
      folders.map((folder) =>
        folder.id === folderId
          ? { ...folder, isOpen: !folder.isOpen }
          : {
              ...folder,
              contents: folder.contents
                ? updateFolders(folder.contents)
                : folder.contents,
            }
      );

    setFolders(updateFolders(folders));
  };

  // const renderFolders = (folders) =>
  //   folders.map((folder) => (
  //     <React.Fragment key={folder.id}>
  //       <ListItem
         
  //         onClick={() => toggleFolder(folder.id)}
  //         sx={{ pl: folder.id.split("-").length * 2 }}
  //       >
  //         <ListItemIcon>
  //           {folder.isOpen ? "📂" :"📁"}
  //         </ListItemIcon>
  //         <ListItemText primary={folder.folder} />
  //       </ListItem>
  //       <Collapse in={folder.isOpen} timeout="auto" unmountOnExit>
  //         <List disablePadding>
  //           {folder.contents.length > 0
  //             ? renderFolders(folder.contents)
  //             : null}
  //         </List>
  //       </Collapse>
  //     </React.Fragment>
  //   ));


  const renderFolderOrFile = (item) => {
    const depth = item.id.split("-").length;
    if (item.file) {
      return (
        <div key={item.id} className="flex items-center gap-1 py-1 text-sm text-gray-600" style={{ paddingLeft: depth * 16 }}>
          <span>📄</span><span>{item.file}</span>
        </div>
      );
    } else if (item.folder) {
      return (
        <div key={item.id}>
          <div onClick={() => toggleFolder(item.id)}
            className="flex items-center gap-1 py-1 text-sm cursor-pointer hover:bg-gray-50"
            style={{ paddingLeft: depth * 16 }}>
            <span>{item.isOpen ? "📂" : "📁"}</span>
            <span>{item.folder}</span>
          </div>
          {item.isOpen && item.contents && item.contents.length > 0 && (
            <div>{item.contents.map((subItem) => renderFolderOrFile(subItem))}</div>
          )}
        </div>
      );
    }
    return null;
  };

  if (!isFolderFormOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div className="absolute inset-0 bg-black/30" onClick={handleFormClose} />
      <div className="absolute right-0 top-0 h-full w-[800px] bg-white shadow-xl overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Create Folder</h2>
          <button type="button" onClick={handleFormClose} className="text-blue-600 hover:text-blue-800">
            <FaTimes />
          </button>
        </div>
        <div>{folders.map((folder) => renderFolderOrFile(folder))}</div>
      </div>
    </div>
  );
}

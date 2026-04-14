import React, { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical, BsTrash, BsArrowsMove, BsFolderPlus, BsUpload, BsFolderSymlink, BsPencil } from "react-icons/bs";
import { MdLock, MdLockOpen, MdInsertDriveFile, MdFolder, MdFolderOpen, MdUploadFile, MdDriveFolderUpload } from "react-icons/md";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FileUploadDrawer from "./FileUploadDrawer";
import FolderUploadDrawer from "./FolderUploadDrawer";
import CreteFolderDrawer from "./CreteFolderDrawer";
import RenameDrawer from "./RenameDrawer";
import MoveDrawer from "./MoveDrawer";
import { Button } from "../../components/ui/button";
import { Eye, PenTool, Stamp, Lock, ArrowLeft, FolderPlus, Upload, FolderUp } from "lucide-react";
import {
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
} from "lucide-react";
const FolderTreeView = () => {
const { templateId } = useParams();
const location = useLocation();
const templateName = location.state?.templateName || "Unknown Template";
 const navigate = useNavigate();
  const decodedTemplateId = decodeURIComponent(templateId);
 const [expandedFolders, setExpandedFolders] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
  const [newFolderDrawerOpen, setNewFolderDrawerOpen] = useState(null);
  const [folderUploaDrawerOpen, setFolderUploaDrawerOpen] = useState(null);
  const [renameDrawer, SetRenameDrawer] = useState(null);
  const [fileUploadDrawerOpen, setFileUploadDrawerOpen] = useState(null);
  const [moveDrawerOpen, setMoveDrawerOpen] = useState(null);
  const [templatename, setTemplateName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [folderTree, setFolderTree] = useState([]);
 
console.log("hgjhg",templateId)
  // const fetchFolderTree = async () => {
  //   try {
  //     const res = await fetch(`https://www.snptaxes.com/api/docManagement/files/list?folderPath=${templateId}`);
  //     const data = await res.json();
  //     if (res.ok) {
  //       setFolderTree(data.contents);
  //     } else {
  //       setError("Failed to fetch folder tree");
  //     }
  //   } catch (err) {
  //     setError("Error fetching folder tree");
  //   }
  // };

  useEffect(() => {
    fetchFolderTree(templateId);
  }, [templateId]);

 // API call to fetch folder tree for a given template ID
  const fetchFolderTree = async (templateId) => {
    try {
      const res = await fetch(`https://www.snptaxes.com/api/docManagement/files/list?folderPath=${templateId}`);
      const data = await res.json();
      if (res.ok) {
        setFolderTree(data.contents);
      } else {
        setError('Failed to fetch folder tree');
      }
    } catch (err) {
      setError('Error fetching folder tree');
    }
  };
  const toggleFolder = (path, isReadOnly) => {
    if (isReadOnly) return;
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleMenuOpen = (event, folder) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedFolderForMenu(folder);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
// Toggle read/unread
  const toggleReadStatus = (item) => {
    const newValue = !(item.meta?.readStatus || false);
    updateStatus(item, "readStatus", newValue);
    console.log("kujaki janavi", item.path);
  };

  const SIGN_STATUSES = [
    "sendForSignature",
    "pendingSignature",
    "signatureCompleted",
  ];

  const statusTextMap = {
    sendForSignature: "Send for Sign",
    pendingSignature: "Waiting for Signature",
    signatureCompleted: "Signature Received",
  };

  const toggleSignStatus = (item) => {
    console.log("signature path", item)
    const currentStatus = item.meta?.signStatus || "sendForSignature";

    // Find the next status in the cycle
    const currentIndex = SIGN_STATUSES.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % SIGN_STATUSES.length; // loops back to start if at end
    const nextStatus = SIGN_STATUSES[nextIndex];

    // Update the item meta
    updateStatus(item, "signStatus", nextStatus);
  };
  const APPROVAL_STATUSES = [
    "sendForApproval",
    "pendingApproval",
    "approvalCompleted",
  ];

  const approvalStatusTextMap = {
    sendForApproval: "Send for Approval",
    pendingApproval: "Waiting for Approval",
    approvalCompleted: "Approval Completed",
  };

  const toggleApprovalStatus = (item) => {
    const currentStatus = item.meta?.authStatus || "sendForApproval";

    // Find the next status in the cycle
    const currentIndex = APPROVAL_STATUSES.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % APPROVAL_STATUSES.length; // loops back to start if at end
    const nextStatus = APPROVAL_STATUSES[nextIndex];

    // Update the item meta
    updateStatus(item, "authStatus", nextStatus);
  };

  // 🔹 Frontend: Update any status (read, sign, approval)
  const updateStatus = async (item, statusType, newValue) => {
    try {
      if (!item?.path) return alert("Invalid item selected");

      const body = {
        targetPath: item.path,
        status: {
          [statusType]: newValue, // dynamic key
        },
      };

      const res = await fetch(
        "https://www.snptaxes.com/api/docManagement/updateStatus",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Status updated successfully");
        fetchFolderTree(templateId); // refresh folder tree to reflect change
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status");
    }
  };

  const toggleReadOnly = async (item) => {
    try {
      const newStatus = !item.meta.readOnly;

      // 📍 Use correct backend endpoint
      const endpoint =
        item.type === "folder"
          ? "https://www.snptaxes.com/api/docManagement/folder/readonly"
          : "https://www.snptaxes.com/api/docManagement/file/readonly";

      const body =
        item.type === "folder"
          ? { folderPath: item.path, readOnly: newStatus }
          : { filePath: item.path, readOnly: newStatus };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchFolderTree(templateId);

        // 🗂️ Collapse folder if it’s locked
        if (item.type === "folder" && newStatus) {
          setExpandedFolders((prev) => {
            const updated = { ...prev };
            delete updated[item.path];
            return updated;
          });
        }

        handleMenuClose();
        alert(data.message || "Updated successfully");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update read-only status");
    }
  };

  // 🗑️ Delete File or Folder (Universal)
  const deleteItem = async (item) => {
    if (!item?.path) return alert("Invalid path");

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.name}"? This cannot be undone!`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        "https://www.snptaxes.com/api/docManagement/delete",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetPath: item.path }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message);
        await fetchFolderTree(); // refresh view
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Error deleting file or folder");
    }

    handleMenuClose();
  };

  const handleMoveFolder = async (folder) => {
    alert(`Move folder: ${folder.path}`); // implement backend
    handleMenuClose();
  };
  // Recursive render of folder tree structure
  //   const renderTree = (items, level = 0, parentPath = "") => {
  //   return (
  //     <Box component="ul" sx={{ listStyle: "none", pl: level * 2, mb: 1 }}>
  //       {items.map((item) => {
  //         const fullPath = parentPath
  //           ? `${parentPath}/${item.name}`
  //           : item.name;

  //         return (
  //           <li key={fullPath} style={{ marginBottom: 8 }}>
  //             {item.type === "folder" ? (
  //               // 🟡 FOLDER ITEM
  //               <Box
  //                 sx={{
  //                   p: 1,
  //                   display: "flex",
  //                   alignItems: "center",
  //                   justifyContent: "space-between",
  //                   borderRadius: 2,
  //                   cursor: "pointer",
  //                   backgroundColor: "#fff",
  //                   "&:hover": { backgroundColor: "#f5f5f5" },
  //                   transition: "background-color 0.2s ease-in-out",
  //                 }}
  //                 onClick={() => toggleFolder(fullPath, item.meta?.readOnly)}
  //               >
  //                 <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
  //                   <FolderIcon
  //                     color={expandedFolders[fullPath] ? "primary" : "action"}
  //                     sx={{ mr: 1 }}
  //                   />
  //                   <Typography
  //                     variant="body1"
  //                     fontWeight="medium"
  //                     sx={{ flexGrow: 1, wordBreak: "break-word" }}
  //                   >
  //                     {item.name}{" "}
  //                     {item.meta?.readOnly && (
  //                       <Typography
  //                         component="span"
  //                         sx={{
  //                           fontStyle: "italic",
  //                           fontSize: "0.9em",
  //                           color: "text.secondary",
  //                         }}
  //                       >
  //                         (Read Only)
  //                       </Typography>
  //                     )}
  //                   </Typography>
  //                 </Box>

  //                 {/* Folder menu */}
  //                 <IconButton
  //                   size="small"
  //                   onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
  //                 >
  //                   <MoreVertIcon fontSize="small" />
  //                 </IconButton>
  //               </Box>
  //             ) : (
  //               // 🔵 FILE ITEM (single dot)
  //               <Box
  //                 sx={{
  //                   display: "flex",
  //                   alignItems: "center",
  //                   pl: 4,
  //                   mb: 1,
  //                   borderRadius: 2,
  //                   position: "relative",
  //                   "&:hover .file-menu-icon": { opacity: 1 },
  //                 }}
  //               >
  //                 <FileIcon
  //                   fontSize="small"
  //                   sx={{ mr: 1, color: "text.secondary" }}
  //                 />
  //                 <Typography
  //                   variant="body2"
  //                   sx={{ flex: 1, wordBreak: "break-word" }}
  //                 >
  //                   {item.name}{" "}
  //                   {item.meta?.readOnly && (
  //                     <Typography
  //                       component="span"
  //                       sx={{
  //                         fontStyle: "italic",
  //                         fontSize: "0.8em",
  //                         color: "text.secondary",
  //                       }}
  //                     >
  //                       (Read Only)
  //                     </Typography>
  //                   )}
  //                 </Typography>

  //                 {/* Single-dot menu for files */}
  //                 <Box
  //                   className="file-menu-icon"
  //                   sx={{
  //                     opacity: 0,
  //                     transition: "opacity 0.2s",
  //                     cursor: "pointer",
  //                     pr: 1,
  //                   }}
  //                   onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
  //                 >
  //                   <Box
  //                     sx={{
  //                       width: 8,
  //                       height: 8,
  //                       borderRadius: "50%",
  //                       backgroundColor: "gray",
  //                       transition: "background-color 0.3s, transform 0.2s",
  //                       "&:hover": {
  //                         backgroundColor: "primary.main",
  //                         transform: "scale(1.3)",
  //                       },
  //                     }}
  //                   />
  //                 </Box>
  //               </Box>
  //             )}

  //             {/* Recursive rendering of children */}
  //             {expandedFolders[fullPath] &&
  //               item.children &&
  //               item.children.length > 0 && (
  //                 <Box
  //                   sx={{
  //                     ml: 2,
  //                     mt: 1,
  //                     borderLeft: "2px dashed #ccc",
  //                     pl: 2,
  //                   }}
  //                 >
  //                   {renderTree(item.children, level + 1, fullPath)}
  //                 </Box>
  //               )}
  //           </li>
  //         );
  //       })}
  //     </Box>
  //   );
  // };

 const renderTree = (items, level = 0, parentPath = "") => {
    return (
      <ul className="list-none mb-1" style={{ paddingLeft: level * 8 }}>
        {items.map((item) => {
          const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;
          const meta = item.meta || {};
          const getColor = (status) => (status ? "#1976d2" : "#9e9e9e");

          const StatusIcons = () => (
            <div className="flex gap-1 items-center ml-1">
              <Eye size={16} color={getColor(meta.readStatus)} />
              <PenTool size={16} color={getColor(meta.signStatus)} />
              <Stamp size={16} color={getColor(meta.authStatus)} />
              <Lock size={16} color={meta.readOnly ? "#e53935" : "#9e9e9e"} />
            </div>
          );

          return (
            <li key={fullPath} className="mb-2">
              {item.type === "folder" ? (
                <div
                  className="p-1 flex items-center justify-between rounded cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFolder(fullPath, meta.readOnly)}
                >
                  <div className="flex items-center gap-1 flex-1">
                    {expandedFolders[fullPath] ? (
                      <MdFolderOpen size={18} color="#1976d2" />
                    ) : (
                      <MdFolder size={18} color="#757575" />
                    )}
                    <span className="text-sm font-medium break-words">{item.name}</span>
                    <StatusIcons />
                  </div>
                  <button type="button" className="p-1 text-gray-500 hover:text-gray-700"
                    onClick={(e) => { e.stopPropagation(); handleMenuOpen(e, { ...item, fullPath }); }}>
                    <BsThreeDotsVertical size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center pl-8 mb-1 rounded group">
                  <MdInsertDriveFile size={16} color="#757575" style={{ marginRight: 6 }} />
                  <span className="text-xs flex-1 break-words">{item.name}</span>
                  <StatusIcons />
                  <button type="button"
                    className="w-2 h-2 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer mx-1"
                    onClick={(e) => handleMenuOpen(e, { ...item, fullPath })} />
                </div>
              )}
              {expandedFolders[fullPath] && item.children && item.children.length > 0 && (
                <div className="ml-4 mt-1 border-l-2 border-dashed border-gray-300 pl-2">
                  {renderTree(item.children, level + 1, fullPath)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };
  return (
    <div className="mx-auto p-4 md:p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors shadow-sm"
          onClick={() => navigate("/firmtemp/templates/folders")}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Template: {templateName}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage folders and files for this template</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            size="sm"
            className="flex-1 gap-2"
            onClick={() => { setNewFolderDrawerOpen(true); handleMenuClose(); }}
          >
            <FolderPlus className="h-4 w-4" />
            Create Folder
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => setFileUploadDrawerOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => setFolderUploaDrawerOpen(true)}
          >
            <FolderUp className="h-4 w-4" />
            Upload Folder
          </Button>
        </div>

        {/* Drawers */}
        <FileUploadDrawer
          isOpen={fileUploadDrawerOpen}
          onClose={() => setFileUploadDrawerOpen(false)}
          folderTree={folderTree}
          templateId={templateId}
          fetchFolderTree={() => fetchFolderTree(templateId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <CreteFolderDrawer
          isOpen={newFolderDrawerOpen}
          onClose={() => {
            setNewFolderDrawerOpen(false);
          }}
          folderTree={folderTree}
          templateId={templateId}
          fetchFolderTree={() => fetchFolderTree(templateId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <FolderUploadDrawer
          isOpen={folderUploaDrawerOpen}
          onClose={() => setFolderUploaDrawerOpen(false)}
          folderTree={folderTree}
          templateId={templateId}
          fetchFolderTree={() => fetchFolderTree(templateId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <MoveDrawer
          isOpen={moveDrawerOpen}
          onClose={() => {
            setMoveDrawerOpen(false);
          }}
          folderTree={folderTree}
          fetchFolderTree={() => fetchFolderTree(templateId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <RenameDrawer
          isOpen={renameDrawer}
          onClose={() => {
            SetRenameDrawer(false);
          }}
          folderTree={folderTree}
          fetchFolderTree={() => fetchFolderTree(templateId)}
          selectedFolderForMenu={selectedFolderForMenu}
        />
      </div>

      {/* Folder Explorer */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
          <FolderClosedIcon size={15} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">Folder Explorer</h2>
        </div>
        <div className="p-4">
          {folderTree && folderTree.length > 0 ? (
            renderTree(folderTree)
          ) : (
            <p className="text-sm text-gray-400 py-6 text-center">No folders yet. Create one to get started.</p>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {Boolean(menuAnchorEl) && (() => {
        const isLocked = selectedFolderForMenu?.meta?.readOnly === true;
        const restrictedNames = ["Client Uploaded Documents", "Firm Documents Shared with Client", "Private"];
        const isRestricted = restrictedNames.includes(selectedFolderForMenu?.name);
        return (
          <>
            <div className="fixed inset-0 z-30" onClick={handleMenuClose} />
            <div
              className="fixed z-40 bg-white border border-gray-100 rounded-xl shadow-xl w-48 py-1.5 overflow-hidden"
              style={{
                top: menuAnchorEl?.getBoundingClientRect().bottom + window.scrollY + 4,
                left: menuAnchorEl?.getBoundingClientRect().right - 192 + window.scrollX
              }}
            >
              <button type="button" disabled={isLocked || isRestricted}
                onClick={() => { setMoveDrawerOpen(true); handleMenuClose(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <BsArrowsMove size={13} /> Move
              </button>
              <button type="button" disabled={isLocked}
                onClick={() => { setNewFolderDrawerOpen(true); handleMenuClose(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <MdFolder size={13} /> New Folder
              </button>
              <button type="button" disabled={isLocked}
                onClick={() => { setFileUploadDrawerOpen(true); handleMenuClose(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <MdUploadFile size={13} /> New File
              </button>
              <button type="button" disabled={isLocked}
                onClick={() => { setFolderUploaDrawerOpen(true); handleMenuClose(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <MdDriveFolderUpload size={13} /> Upload Folder
              </button>
              <button type="button" disabled={isLocked}
                onClick={() => { SetRenameDrawer(true); handleMenuClose(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <BsPencil size={13} /> Rename
              </button>
              <div className="my-1 h-px bg-gray-100 mx-2" />
              <button type="button"
                onClick={() => { toggleReadOnly(selectedFolderForMenu); handleMenuClose(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                {isLocked ? <MdLockOpen size={13} /> : <MdLock size={13} />}
                {isLocked ? "Unlock" : "Lock"}
              </button>
              <button type="button" disabled={isLocked || isRestricted}
                onClick={() => { deleteItem(selectedFolderForMenu); handleMenuClose(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors">
                <BsTrash size={13} /> Delete
              </button>
            </div>
          </>
        );
      })()}
    </div>
  );
};

export default FolderTreeView;

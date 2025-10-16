import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material";

import FileUploadDrawer from "../FileUploadDrawer";
import FolderUploadDrawer from "../FolderUploadDrawer";
import CreteFolderDrawer from "../CreteFolderDrawer";
import MoveDrawer from "../MoveDrawer";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

const CreateFolderTemplate = () => {
  const [expandedFolders, setExpandedFolders] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
  const [newFolderDrawerOpen, setNewFolderDrawerOpen] = useState(null);
  const [folderUploaDrawerOpen, setFolderUploaDrawerOpen] = useState(null);
  const [fileUploadDrawerOpen, setFileUploadDrawerOpen] = useState(null);
  const [moveDrawerOpen, setMoveDrawerOpen] = useState(null);
  const [templatename, setTemplateName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [folderTree, setFolderTree] = useState([]);
const [templateId, setTemplateId] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('https://www.snptaxes.com/api/foldertemp/folder-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templatename }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Success! Folder template created: ${data.templatePath}`);
        setTemplateName('');
        // Fetch folder tree for the created template ID (extracted from templatePath)
        const templateId = data.templatePath.split('/')[0];
        console.log("te,plateid",templateId)
        setTemplateId(templateId)
        await fetchFolderTree(templateId);
      } 
      else {
        setError(data.error || 'Failed to create folder template');
      }
    } catch (err) {
      setError('Network error or server not reachable');
    } finally {
      setLoading(false);
    }
  };


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
        await fetchFolderTree();

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
    const renderTree = (items, level = 0, parentPath = "") => {
    return (
      <Box component="ul" sx={{ listStyle: "none", pl: level * 2, mb: 1 }}>
        {items.map((item) => {
          const fullPath = parentPath
            ? `${parentPath}/${item.name}`
            : item.name;

          return (
            <li key={fullPath} style={{ marginBottom: 8 }}>
              {item.type === "folder" ? (
                // 🟡 FOLDER ITEM
                <Box
                  sx={{
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 2,
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    transition: "background-color 0.2s ease-in-out",
                  }}
                  onClick={() => toggleFolder(fullPath, item.meta?.readOnly)}
                >
                  <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
                    <FolderIcon
                      color={expandedFolders[fullPath] ? "primary" : "action"}
                      sx={{ mr: 1 }}
                    />
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      sx={{ flexGrow: 1, wordBreak: "break-word" }}
                    >
                      {item.name}{" "}
                      {item.meta?.readOnly && (
                        <Typography
                          component="span"
                          sx={{
                            fontStyle: "italic",
                            fontSize: "0.9em",
                            color: "text.secondary",
                          }}
                        >
                          (Read Only)
                        </Typography>
                      )}
                    </Typography>
                  </Box>

                  {/* Folder menu */}
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                // 🔵 FILE ITEM (single dot)
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pl: 4,
                    mb: 1,
                    borderRadius: 2,
                    position: "relative",
                    "&:hover .file-menu-icon": { opacity: 1 },
                  }}
                >
                  <FileIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "text.secondary" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ flex: 1, wordBreak: "break-word" }}
                  >
                    {item.name}{" "}
                    {item.meta?.readOnly && (
                      <Typography
                        component="span"
                        sx={{
                          fontStyle: "italic",
                          fontSize: "0.8em",
                          color: "text.secondary",
                        }}
                      >
                        (Read Only)
                      </Typography>
                    )}
                  </Typography>

                  {/* Single-dot menu for files */}
                  <Box
                    className="file-menu-icon"
                    sx={{
                      opacity: 0,
                      transition: "opacity 0.2s",
                      cursor: "pointer",
                      pr: 1,
                    }}
                    onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "gray",
                        transition: "background-color 0.3s, transform 0.2s",
                        "&:hover": {
                          backgroundColor: "primary.main",
                          transform: "scale(1.3)",
                        },
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Recursive rendering of children */}
              {expandedFolders[fullPath] &&
                item.children &&
                item.children.length > 0 && (
                  <Box
                    sx={{
                      ml: 2,
                      mt: 1,
                      borderLeft: "2px dashed #ccc",
                      pl: 2,
                    }}
                  >
                    {renderTree(item.children, level + 1, fullPath)}
                  </Box>
                )}
            </li>
          );
        })}
      </Box>
    );
  };


  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Create Folder Template on server</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={templatename}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Enter template name"
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

      <h3>Folder Tree</h3>
     
        <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
     
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexWrap: "wrap",
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, // vertical on mobile, horizontal on desktop
            gap: 1,
            maxWidth: "600px",
            width: "100%",
            mx: "auto",
            my: 3,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setNewFolderDrawerOpen(true);
              handleMenuClose();
            }}
            startIcon={<FolderIcon />}
          >
            Create Folder
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => setFileUploadDrawerOpen(true)}
            startIcon={<UploadFileIcon />}
          >
            Upload File
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => setFolderUploaDrawerOpen(true)}
            startIcon={<DriveFolderUploadIcon />}
          >
            Upload Folder
          </Button>
        </Box>

        <FileUploadDrawer
          isOpen={fileUploadDrawerOpen}
          onClose={() => setFileUploadDrawerOpen(false)}
          folderTree={folderTree}
       
        fetchFolderTree={()=>{fetchFolderTree(templateId)}}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <CreteFolderDrawer
          isOpen={newFolderDrawerOpen}
          onClose={() => {
            setNewFolderDrawerOpen(false); // close drawer
            setSelectedFolderForMenu(null); // reset selection when drawer closes
          }}
          folderTree={folderTree}
          fetchFolderTree={()=>{fetchFolderTree(templateId)}}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <FolderUploadDrawer
          isOpen={folderUploaDrawerOpen}
          onClose={() => setFolderUploaDrawerOpen(false)}
          folderTree={folderTree}
     
        fetchFolderTree={()=>{fetchFolderTree(templateId)}}
          selectedFolderForMenu={selectedFolderForMenu}
        />

        <MoveDrawer
          isOpen={moveDrawerOpen}
          onClose={() => {
            setMoveDrawerOpen(false); // close drawer
            setSelectedFolderForMenu(null); // reset selection when drawer closes
          }}
          folderTree={folderTree}
      
        fetchFolderTree={()=>{fetchFolderTree(templateId)}}
          selectedFolderForMenu={selectedFolderForMenu}
        />
      </Box>

      {/* Folder Explorer */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          📜 Folder Explorer
        </Typography>
        {folderTree ? (
          renderTree(folderTree)
        ) : (
          <Typography>Loading folder data...</Typography>
        )}
      </Paper>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {(() => {
          const isLocked = selectedFolderForMenu?.meta?.readOnly === true;

          return (
            <>
              {/* Move */}
              <MenuItem
                disabled={isLocked}
                onClick={() => {
                 setMoveDrawerOpen(true);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <DriveFileMoveIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: "16px" }}
                />
                Move
              </MenuItem>

              {/* Delete */}
              <MenuItem
                disabled={isLocked}
                onClick={() => {
                  deleteItem(selectedFolderForMenu);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <DeleteIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: "16px" }}
                />
                Delete
              </MenuItem>

              {/* New Folder */}
              <MenuItem
                disabled={isLocked}
                onClick={() => {
                  setNewFolderDrawerOpen(true);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <DriveFileMoveIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: "16px" }}
                />
                New Folder
              </MenuItem>

              {/* New File */}
              <MenuItem
                disabled={isLocked}
                onClick={() => {
                  setFileUploadDrawerOpen(true);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <DriveFileMoveIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: "16px" }}
                />
                New File
              </MenuItem>

              {/* Upload Folder */}
              <MenuItem
                disabled={isLocked}
                onClick={() => {
                  setFolderUploaDrawerOpen(true);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <DriveFileMoveIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: "16px" }}
                />
                Upload Folder
              </MenuItem>

              {/* Edit */}
              <MenuItem
                disabled={isLocked}
                onClick={() => {
                  handleMoveFolder(selectedFolderForMenu);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                <DriveFileMoveIcon
                  fontSize="small"
                  sx={{ mr: 0.5, fontSize: "16px" }}
                />
                Edit
              </MenuItem>

              {/* Lock / Unlock */}
              <MenuItem
                onClick={() => {
                  toggleReadOnly(selectedFolderForMenu);
                  handleMenuClose();
                }}
                sx={{ fontSize: "0.8rem", py: 0.5 }}
              >
                {isLocked ? (
                  <LockOpenIcon
                    fontSize="small"
                    sx={{ mr: 0.5, fontSize: "16px" }}
                  />
                ) : (
                  <LockIcon
                    fontSize="small"
                    sx={{ mr: 0.5, fontSize: "16px" }}
                  />
                )}
                {isLocked ? "Unlock" : "Lock"}
              </MenuItem>
            </>
          );
        })()}
      </Menu>
    </Box>
    </div>
  );
};

export default CreateFolderTemplate;

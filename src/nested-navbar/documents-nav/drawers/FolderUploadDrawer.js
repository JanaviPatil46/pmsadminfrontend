


import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt } from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";
const FolderUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [folderName, setFolderName] = useState("my-uploaded-folder");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
      setFolderName("");
    } else if (!isOpen) {
      setSelectedFolder("");
      setFolderName("");
      setFiles([]);
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFolderSelect = (path) => setSelectedFolder(path);

 
  const handleUploadFolderSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    // ✅ Calculate total folder size
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    const maxFolderSize = 100 * 1024 * 1024; // 100 MB

    // 🚫 Restrict folder if total exceeds limit
    if (totalSize > maxFolderSize) {
      alert(
        `❌ Folder size exceeds 100 MB limit.\nSelected folder size: ${(
          totalSize /
          (1024 * 1024)
        ).toFixed(2)} MB`
      );
      e.target.value = null; // reset input
      setFiles([]); // clear files state
      return;
    }

    // ✅ Normal processing (unchanged)
    setFiles(selectedFiles);

    const firstPath = selectedFiles[0].webkitRelativePath;
    const topLevelFolder = firstPath.split("/")[0];
    setFolderName(topLevelFolder);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("Please select a folder first");
      return;
    }

    let targetFolderPath = selectedFolder
      ? `${selectedFolder}/${folderName}`
      : folderName;

    targetFolderPath = targetFolderPath.replace(/\/+/g, "/");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file, file.webkitRelativePath);
    });

    try {
      const res = await fetch(
        `https://www.snptaxes.com/api/accountsdoc/folder/upload?folderPath=${encodeURIComponent(
          targetFolderPath
        )}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Folder uploaded successfully: ${data.files.length} files`);
        toast.success(`✅ Folder uploaded successfully: ${data.files.length} files`)
        fetchFolderTree();
        onClose()
        setFiles([]);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };
  

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📁 Upload Folder
        </Typography>

       

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mt: 1, mb: 2 }}
        >
          {files.length > 0 ? `${files.length} files selected` : "Select Folder"}
          <input
            type="file"
            webkitdirectory="true"
            directory=""
            multiple
            hidden
            onChange={handleUploadFolderSelect}
          />
        </Button>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpload}
        >
          🚀 Upload
        </Button>

        {message && (
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
        )}

        <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
          Close
        </Button>

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
      </Box>
    </Drawer>
  );
};

// Recursive folder tree
const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };
const getFileIcon = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();

  switch (ext) {
    case "pdf":
      return <FaFilePdf color="#d32f2f" size={18} />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FaFileImage color="#1976d2" size={18} />;
    case "doc":
    case "docx":
      return <FaFileWord color="#1565c0" size={18} />;
    case "xls":
    case "xlsx":
      return <FaFileExcel color="#2e7d32" size={18} />;
    case "txt":
    case "md":
      return <FaFileAlt color="#616161" size={18} />;
    default:
      return <AiFillFileUnknown color="#757575" size={18} />;
  }
};
  return (
    <List disablePadding>
      {items?.map((item) => {
        const isExpanded = expanded[item.path];
        const isSelected = selectedFolder === item.path;

        if (item.type !== "folder") return null;

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
              <ListItemIcon
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.path);
                }}
              >
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
                (isExpanded ? (
                  <ExpandLess
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.path);
                    }}
                  />
                ) : (
                  <ExpandMore
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(item.path);
                    }}
                  />
                ))}
            </ListItem>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              {/* Subfolders */}
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />

              {/* Files inside folder */}
              {item.meta?.files?.length > 0 && (
                <List sx={{ pl: 4 }}>
                  {item.meta.files.map((file) => (
                    <ListItem key={file.name} sx={{ pl: 2 }}>
                      <ListItemIcon>
                     <Box sx={{ mr: 1 }}>{getFileIcon(file.name)}</Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={`${file.name}${file.readOnly ? " (Read Only)" : ""}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Collapse>
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default FolderUploadDrawer;




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
import axios from "axios";
import { toast } from "react-toastify";

const FileUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {

  console.log("foldertree",folderTree)
  const [file, setFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
   const [files, setFiles] = useState([]);
  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFile(null);
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);
const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024; // 50 MB
    const forbiddenTypes = ["video/", "audio/"];

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        alert(`❌ ${file.name} exceeds 50 MB limit.`);
        return false;
      }
      if (forbiddenTypes.some((type) => file.type.startsWith(type))) {
        alert(`❌ ${file.name} is an audio or video file — not allowed.`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };
  // const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleFolderSelect = (path) => setSelectedFolder(path);

  
 const handleUpload = async () => {
    if (files.length === 0 || !selectedFolder) {
      setMessage("Please select files and a folder.");
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await axios.post(
              `https://www.snptaxes.com/api/docManagement/file/upload?folderPath=${encodeURIComponent(
          selectedFolder
        )}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(`✅ ${res.data.message || "Files uploaded successfully"}`);
      toast.success(`✅ ${res.data.message || "Files uploaded successfully"}`)
      setFiles([]);
      onClose();
    await  fetchFolderTree();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error uploading files");
    }
  };
  
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📄 Upload File
        </Typography>

        {/* <TextField
          label="Selected Folder"
          placeholder="Enter folder path or select from tree"
          value={selectedFolder}
          InputProps={{ readOnly: true }}
          fullWidth
          margin="dense"
        /> */}

        {/* <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mt: 1, mb: 2 }}
        >
          {file ? file.name : "Select File"}
          <input type="file" hidden onChange={handleFileChange} />
        </Button> */}
 <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ mt: 1, mb: 2 }}
                >
                  {files.length > 0
                    ? `${files.length} file(s) selected`
                    : "Select Files"}
                  <input type="file" hidden multiple onChange={handleFileChange} />
                </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpload}
        >
          Upload
        </Button>

        {message && (
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>{message}</Typography>
        )}

        <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onClose}>
          Close
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Folder from Tree
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

// Recursive Folder Tree with files and MUI
const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
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
              {/* Render subfolders recursively */}
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />

              {/* Render files inside folder */}
              {item.meta?.files?.length > 0 && (
                <List sx={{ pl: 4 }}>
                  {item.meta.files.map((file) => (
                    <ListItem
                      key={file.name}
                      sx={{ pl: 2 }}
                    >
                      <ListItemIcon>
                        <InsertDriveFileIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${file.name}${
                          file.readOnly ? " (Read Only)" : ""
                        }`}
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

export default FileUploadDrawer;


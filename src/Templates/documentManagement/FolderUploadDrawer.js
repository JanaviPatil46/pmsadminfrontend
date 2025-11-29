


import React, { useState, useEffect ,useRef} from "react";
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
  Collapse,LinearProgress
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import JSZip from "jszip";
import axios from "axios";
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
  const hiddenFileInput = useRef(null);
  // open hidden input
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  
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
    setFiles(selectedFiles);

    if (selectedFiles.length > 0) {
      const firstPath = selectedFiles[0].webkitRelativePath;
      const topLevelFolder = firstPath.split("/")[0];
      setFolderName(topLevelFolder);
    }
  };

  // const handleUpload = async () => {
  //   if (files.length === 0) {
  //     setMessage("Please select a folder first");
  //     return;
  //   }

  //   let targetFolderPath = selectedFolder
  //     ? `${selectedFolder}/${folderName}`
  //     : folderName;

  //   targetFolderPath = targetFolderPath.replace(/\/+/g, "/");

  //   const formData = new FormData();
  //   files.forEach((file) => {
  //     formData.append("files", file, file.webkitRelativePath);
  //   });

  //   try {
  //     const res = await fetch(
  //       `https://www.snptaxes.com/api/docManagement/folder/upload?folderPath=${encodeURIComponent(
  //         targetFolderPath
  //       )}`,
  //       { method: "POST", body: formData }
  //     );
  //     const data = await res.json();
  //     if (res.ok) {
  //       // setMessage(`✅ Folder uploaded successfully: ${data.files.length} files`);
  //       toast.success(`Folder uploaded successfully: ${data.files.length} files`)
  //       fetchFolderTree();
  //       onClose()
  //       setFiles([]);
  //     } else {
  //       setMessage(`❌ Error: ${data.error}`);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("Upload failed");
  //   }
  // };
  const [progress, setProgress] = useState(0);

// const handleUpload = async () => {
//   if (files.length === 0) {
//     setMessage("Please select a folder first");
//     return;
//   }

//   let targetFolderPath = selectedFolder
//     ? `${selectedFolder}/${folderName}`
//     : folderName;

//   targetFolderPath = targetFolderPath.replace(/\/+/g, "/");

//   const CHUNK_SIZE = 30; // upload 30 files per request
//   const totalChunks = Math.ceil(files.length / CHUNK_SIZE);

//   setMessage("Uploading...");
//   let uploadedChunks = 0;

//   for (let i = 0; i < files.length; i += CHUNK_SIZE) {
//     const formData = new FormData();
//     const chunk = files.slice(i, i + CHUNK_SIZE);

//     chunk.forEach((file) => {
//       formData.append("files", file, file.webkitRelativePath);
//     });

//     try {
//       const res = await fetch(
//         `https://www.snptaxes.com/api/docManagement/folder/upload?folderPath=${encodeURIComponent(
//           targetFolderPath
//         )}`,
//         { method: "POST", body: formData }
//       );

//       if (!res.ok) {
//         const err = await res.json();
//         toast.error(`❌ Upload failed: ${err.error || "Unknown error"}`);
//         setMessage(`❌ Upload failed at chunk ${uploadedChunks + 1}`);
//         return;
//       }

//       uploadedChunks++;
//       const percent = Math.round((uploadedChunks / totalChunks) * 100);
//         setProgress(percent);
//       setMessage(`✅ Uploading... ${percent}% completed`);
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Upload failed due to network error");
//       return;
//     }
//   }

//   // All chunks uploaded
//   toast.success("✅ Folder uploaded successfully!");
//   setMessage(`✅ Folder uploaded (${files.length} files)`);

//  await fetchFolderTree();
//   setFiles([]);
//   onClose();
// };
 // Upload ZIP
 
  const handleUpload = async () => {
    if (!files.length) {
      alert("Please select a folder first!");
      return;
    }

     // ------------------------------
  // ⭐ Use targetFolderPath logic
  // ------------------------------
  let targetFolderPath = selectedFolder
    ? `${selectedFolder}/${folderName}`
    : folderName;

  targetFolderPath = targetFolderPath.replace(/\/+/g, "/");
console.log("Target Folder Path:", targetFolderPath);
    setMessage("Zipping folder...");

    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.webkitRelativePath, file);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });

    const formData = new FormData();
    formData.append("folderZip", zipBlob, `${folderName}.zip`);
    formData.append("folderName", folderName);
    formData.append("folderPath", targetFolderPath);

    setMessage("Uploading...");

    try {
      const res = await axios.post(
        "https://snptaxes.com/api/docManagement/upload-folder",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(res.data.message || "Uploaded successfully!");
      console.log(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed!");
    }
  };
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400, p: 3, bgcolor: "#f0f8ff", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          📁 Upload Folder
        </Typography>

        
        {/* <Button
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
        </Button> */}
  {/* MUI Button instead of File Input */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        sx={{ mb: 2 }}
      >
        Select Folder
      </Button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleUploadFolderSelect}
        style={{ display: "none" }}
        webkitdirectory="true"
        directory="true"
        multiple
      />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpload}
        >
          🚀 Upload
        </Button>
{progress > 0 && progress < 100 && (
  <Box sx={{ width: "100%", mt: 2 }}>
    <LinearProgress variant="determinate" value={progress} />
    <Typography align="center" sx={{ mt: 1 }}>
      {progress}%
    </Typography>
  </Box>
)}

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
                        <InsertDriveFileIcon fontSize="small" />
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


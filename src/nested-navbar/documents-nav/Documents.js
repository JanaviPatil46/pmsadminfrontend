

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Input,
  Menu,
  MenuItem,
  Collapse,
  Divider,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { FaRegFolderClosed } from "react-icons/fa6";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CreateFolder from "./AdminPortal/CreateFolder";
import UploadDrawer from "./AdminPortal/uploadDocumentWorking";
import UploadFolder from "./AdminPortal/folderUpload";
// import DocumentManager from "./DocumentManager"
import UploadDoc from "./Firm Docs Shared With Client/UplodDoc";
import CreateFolderInFirm from "./Firm Docs Shared With Client/CreateFolder";
import { Folder, FolderOpen, InsertDriveFile } from "@mui/icons-material";
import FileExplorer from "./FileExplorer";
import EditNameDrawer from "./EditNameDrawer";
import MoveFile from "./MoveFile";
const Documents = () => {
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const { data } = useParams();
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  const [file, setFile] = useState(null);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [isFolderCreate, setIsFolderCreate] = useState(false);
  const [isUploadFolderFormOpen, setIsUploadFolderFormOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [folderFiles, setFolderFiles] = useState([]);
  const [folderName, setFolderName] = useState("");
  const folderInputRef = useRef(null);
  const [uploadDocOpen, setUplaodDocOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMoveDocument, setIsMoveDocument] = useState(false);
    const [sourceFile, setSourceFile] = useState(null);

  console.log(refreshKey);
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleNewFileChange = (e) => setFile(e.target.files[0]);
  const handleFileUpload = () => setIsDocumentForm(true);
  const handleOpenDrawer = () => setUplaodDocOpen(true);
  const handleCreateFolderClick = () => setIsFolderFormOpen((prev) => !prev);
  const handleNewFolderClick = () => setIsFolderCreate((prev) => !prev);
  const handleFileMove = () => setIsMoveDocument(true);

  const [combinedFolderStructure, setCombinedFolderStructure] = useState(null);

  const handleMove = (item) => {
    console.log("Move Hi jan v kujaki", item.path);
    setSourceFile(item.path);

  };

  // const [contextItem, setContextItem] = useState(null);
  const [structFolder, setStructFolder] = useState(null);
  const [sealedStructFolder, setSealedStructFolder] = useState(null);
  const [privateStructFolder, setPrivateStructFolder] = useState(null);
  // const [firmDocsStruture,setFirmDocsStruture]= useState(null);
  // const [firmDocsFolder, setFirmDocsFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const openDrawer = () => {
    setIsUploadFolderFormOpen(true);
  };

  useEffect(() => {
    if (isDrawerOpen) openDrawer();
  }, [isDrawerOpen]);
  useEffect(() => {
    if (data) {
      fetchUnSealedFolders();
      fetchSealedFolders();
      fetchPrivateFolders();
      // fetchFrimDocsFolders();
    }
  }, [data]);
  const fetchPrivateFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/privateDocs/${data}`
      );
      const folders = res.data.folders || [];

      const addIsOpen = (items, parentId = "") =>
        items.map((folder, index) => ({
          ...folder,
          isOpen: false,
          id: `${parentId}${index}`,
          sealed: false,
          contents: folder.contents
            ? addIsOpen(folder.contents, `${parentId}${index}-`)
            : [],
        }));

      setPrivateStructFolder({ ...res.data, folders: addIsOpen(folders) });
    } catch (err) {
      setError(err.message || "Error fetching sealed folders.");
    }
  };
  const fetchUnSealedFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/unsealed/${data}`
      );
      const folders = res.data.folders || [];

      const addIsOpen = (items, parentId = "") =>
        items.map((folder, index) => ({
          ...folder,
          isOpen: false,
          id: `${parentId}${index}`,
          sealed: false,
          contents: folder.contents
            ? addIsOpen(folder.contents, `${parentId}${index}-`)
            : [],
        }));

      setStructFolder({ ...res.data, folders: addIsOpen(folders) });
    } catch (err) {
      setError(err.message || "Error fetching unsealed folders.");
    }
  };

  const fetchSealedFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/sealedFolders/${data}`
      );
      const folders = res.data.folders || [];

      const addIsOpen = (items, parentId = "") =>
        items.map((folder, index) => ({
          ...folder,
          isOpen: false,
          id: `${parentId}${index}`,
          sealed: true,
          contents: folder.contents
            ? addIsOpen(folder.contents, `${parentId}${index}-`)
            : [],
        }));

      setSealedStructFolder({ ...res.data, folders: addIsOpen(folders) });
    } catch (err) {
      setError(err.message || "Error fetching sealed folders.");
    }
  };

  useEffect(() => {
    fetchBothFolders();
  }, [data]);

  const fetchBothFolders = async () => {
    try {
      const [sealedRes, unsealedRes] = await Promise.all([
        axios.get(`${DOCS_MANAGMENTS}/admindocs/sealedFolders/${data}`),
        axios.get(`${DOCS_MANAGMENTS}/admindocs/unsealed/${data}`),
      ]);

      const addIsOpen = (items, parentId = "", sealed = false) =>
        items.map((folder, index) => ({
          ...folder,
          isOpen: false,
          id: `${parentId}${index}`,
          sealed,
          contents: folder.contents
            ? addIsOpen(folder.contents, `${parentId}${index}-`, sealed)
            : [],
        }));

      const sealedFolders = addIsOpen(sealedRes.data.folders || [], "", true);
      const unsealedFolders = addIsOpen(
        unsealedRes.data.folders || [],
        "",
        false
      );

      // Combine into a single parent folder
      const combinedFolders = [
        {
          folder: "Client Uploaded Documents",
          isOpen: false,
          id: "client-root",
          contents: [...sealedFolders, ...unsealedFolders],
        },
      ];

      // Set to a single state
      setCombinedFolderStructure(combinedFolders); // <- new unified state
      console.log("jaanvi patil", combinedFolders);
    } catch (err) {
      setError(err.message || "Error fetching folders.");
    }
  };
  const toggleFolder = (folderId, folders) => {
    return folders.map((item) => {
      if (item.id === folderId) {
        return { ...item, isOpen: !item.isOpen };
      } else if (item.contents?.length) {
        return { ...item, contents: toggleFolder(folderId, item.contents) };
      }
      return item;
    });
  };
  const handleToggle = (id) => {
    setCombinedFolderStructure((prev) => toggleFolder(id, prev));
  };
 

  const renderTree = (items) => {
    return items.map((item) => {
      if (item.folder) {
        return (
          <div key={item.id} style={{ paddingLeft: "20px" }}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: "8px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
                onClick={() => handleToggle(item.id)}
              >
                <span>{item.isOpen ? "📂" : "📁"}</span>
                <span>{item.folder}</span>
                {item.sealed && (
                  <span
                    style={{
                      backgroundColor: "#d50000",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  >
                    Sealed
                  </span>
                )}
              </div>
              {/* <div style={{ position: "relative" }}>
                <IconButton
                  onClick={(e) => handleMenuOpen(e, item)}
                  size="small"
                >
                  <BsThreeDotsVertical />
                </IconButton>
              </div> */}
               {item.folder !== "Client Uploaded Documents" && (
                <div style={{ position: "relative" }}>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, item)}
                    size="small"
                  >
                    <BsThreeDotsVertical />
                  </IconButton>
                </div>
              )}
            </div>
            {item.isOpen && item.contents?.length > 0 && (
              <div>{renderTree(item.contents)}</div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={item.id}
            style={{
              paddingLeft: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📄</span>
              <span
                onClick={() => handleFileOpen(item)}
                style={{ cursor: "pointer" }}
              >
                {item.file}
              </span>
              {item.sealed && (
                <span
                  style={{
                    backgroundColor: "#d50000",
                    color: "#fff",
                    padding: "2px 6px",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                >
                  Sealed
                </span>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <IconButton onClick={(e) => handleMenuOpen(e, item)} size="small">
                <BsThreeDotsVertical />
              </IconButton>
            </div>
          </div>
        );
      }
    });
  };

  const renderPrivateFolderContents = (contents, setContents) =>
    contents.map((item, index) => {
      if (item.folder) {
        const toggleFolder = () => {
          const updated = contents.map((f, i) =>
            i === index ? { ...f, isOpen: !f.isOpen } : f
          );
          setContents(updated);
        };

        const selectFolder = () => setSelectedFolderId(item.id);

        return (
          <div key={index} style={{ marginLeft: "20px", marginBottom: "4px" }}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                paddingRight: "8px",
                borderRadius: "4px",
              }}
              onClick={selectFolder}
            >
              <div
                onClick={toggleFolder}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>{item.isOpen ? "📂" : "📁"}</span>
                <span>{item.folder}</span>
              </div>
              {/* <IconButton
                onClick={(e) => handlePrivateMenuOpen(e, item)}
                size="small"
                style={{ marginLeft: "auto" }}
              >
                <BsThreeDotsVertical />
              </IconButton> */}
               {item.folder !== "Private" && (
                <IconButton
                  onClick={(e) => handlePrivateMenuOpen(e, item)}
                  size="small"
                  style={{ marginLeft: "auto" }}
                >
                  <BsThreeDotsVertical />
                </IconButton>
              )}
            </div>
            {item.isOpen && item.contents?.length > 0 && (
              <div style={{ marginTop: "4px" }}>
                {renderPrivateFolderContents(item.contents, (newContents) => {
                  const updated = contents.map((f, i) =>
                    i === index ? { ...f, contents: newContents } : f
                  );
                  setContents(updated);
                })}
              </div>
            )}
          </div>
        );
      } else if (item.file) {
        // return (
        //   <div
        //     key={index}
        //     style={{
        //       marginLeft: "40px",
        //       padding: "4px 8px",
        //       fontSize: "15px",

        //       display: "flex",
        //       alignItems: "center",
        //     }}
        //   >
        //     <span style={{ marginRight: "8px" }}>📄</span>

        //     <span
        //       onClick={() => handleFileOpen(item)}
        //       style={{
        //         cursor: "pointer",

        //       }}
        //     >
        //       {item.file}
        //     </span>

        //   </div>
        // );

        return (
          <div
            key={index}
            style={{
              marginLeft: "40px",
              padding: "4px 8px",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
              onClick={() => handleFileOpen(item)}
            >
              <span>📄</span>
              <span style={{ cursor: "pointer" }}>{item.file}</span>
            </div>
            <IconButton
              onClick={(e) => handlePrivateMenuOpen(e, item)}
              size="small"
            >
              <BsThreeDotsVertical />
            </IconButton>
          </div>
        );
      }
      return null;
    });

  const fetchData = async () => {
    try {
      const response = await fetch(`${DOCS_MANAGMENTS}/firmDocs/files/${data}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setFolderData(result);

      // Initialize open state for all folders
      const initialState = {};
      const initFolderState = (folder) => {
        initialState[folder.folderName] = true; // Open root by default
        folder.structure?.forEach((item) => {
          item.subfolders?.forEach((subfolder) => {
            initialState[subfolder.name] = false; // Closed by default
          });
        });
      };
      initFolderState(result);
      setOpenFolders(initialState);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [data]);

  const toggleFirmFolder = (folderName) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };
  const [folderData, setFolderData] = useState(null);
  const [openFolders, setOpenFolders] = useState({});
  const renderFolder = (folder) => {
    return (
      <Box key={folder.folderName} sx={{ ml: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            my: 1,
          }}
          onClick={() => toggleFirmFolder(folder.folderName)}
        >
          {openFolders[folder.folderName] ? (
            <FolderOpen color="primary" />
          ) : (
            <Folder color="primary" />
          )}
          <Typography variant="body1" sx={{ ml: 1 }}>
            {folder.folderName}
          </Typography>
        </Box>

        <Collapse in={openFolders[folder.folderName]}>
          <Box sx={{ ml: 3 }}>
            {folder.structure?.map((item, index) => (
              <React.Fragment key={index}>
                {item.subfolders?.map((subfolder) => (
                  <Box key={subfolder.name} sx={{ ml: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        my: 1,
                      }}
                      onClick={() => toggleFirmFolder(subfolder.name)}
                    >
                      {openFolders[subfolder.name] ? (
                        <FolderOpen color="primary" />
                      ) : (
                        <Folder color="primary" />
                      )}
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {subfolder.name}
                      </Typography>
                    </Box>

                    <Collapse in={openFolders[subfolder.name]}>
                      <Box sx={{ ml: 3 }}>
                        {subfolder.files.map((file, fileIndex) => (
                          <Box
                            key={fileIndex}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              my: 1,
                            }}
                          >
                            <InsertDriveFile color="action" />
                            <Typography
                              variant="body2"
                              sx={{ ml: 1, color: "text.secondary" }}
                            >
                              {file}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </React.Fragment>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  };

  const handleFolderSelection = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const folderNameFromPath = files[0].webkitRelativePath.split("/")[0];
      setFolderName(folderNameFromPath);
      setFolderFiles(files);
      setIsDrawerOpen(true);
    }
    e.target.value = "";
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [privateAnchorEl, setPrivateAnchorEl] = useState(null);

  const handlePrivateMenuOpen = (event, item) => {
    setPrivateAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };
  const handlePrivateCloseMenu = () => {
    setPrivateAnchorEl(null);
    setTimeout(() => setSelectedItem(null), 100);
  };
  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
    setActiveMenu(item.id);
  };
 const [drawerOpen, setDrawerOpen] = useState(false);
  const handleEdit = (item) => {
    console.log("Edit", item);
    setSelectedItem(item);
    setDrawerOpen(true);
  };
  const handleRename = async (item, newName, itemPath) => {
    console.log("path", item);
    try {
      const response = await fetch(
        `${DOCS_MANAGMENTS}/admindocs/rename-item`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPath: itemPath,
            newName,
            // id: item.id,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Renamed:", data);
        fetchBothFolders();
        fetchPrivateFolders();
        // Refresh your data list here
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Rename failed", error);
    }
  };

   const handleDelete = (item) => {
      console.log("Delete", item);
  
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({
        path: item.path, // dynamically from item
        id: item.id, // dynamically from item
      });
  
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
  
      fetch(`${DOCS_MANAGMENTS}/admindocs/delete-item`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log("Delete Result:", result);
          toast.success("Deleted successfully");
          fetchBothFolders();
          fetchPrivateFolders();
        })
        .catch((error) => console.error("Delete Error:", error));
    };
  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedItem(null);
    setTimeout(() => setSelectedItem(null), 100);
    setActiveMenu(null);
  };
  const [loading, setLoading] = useState(false);
  const handleAction = async (action, item) => {
    console.log(`Action: ${action} on`, item);
    setActiveMenu(null); // Close the action menu

    if (action === "seal" || action === "unseal") {
      try {
        setLoading(true);

        // Extract folder ID from item.path
        const pathParts = item.path.split("/");
        const folderId = pathParts[2]; // uploads/AccountId/{id}/...

        // Compute base path
        const basePath = `uploads/AccountId/${folderId}/Client Uploaded Documents`;

        // Get relative path inside unsealed/sealed
        const currentDir = action === "seal" ? "unsealed" : "sealed";
        const relativePath = item.path.replace(
          `${basePath}/${currentDir}/`,
          ""
        );

        // Call backend to move the item
        await axios.post(
          `${DOCS_MANAGMENTS}/admindocs/moveBetweenSealedUnsealed`,
          {
            id: folderId,
            itemPath: relativePath,
            direction: action === "seal" ? "toSealed" : "toUnsealed",
          }
        );

        // Refresh folders
        await fetchBothFolders();

        // Notify success
        alert(`Item ${action === "seal" ? "sealed" : "unsealed"} successfully`);
      } catch (error) {
        console.error("Error moving item:", error);
        alert(
          `Failed to ${action} item: ${error.response?.data?.error || error.message}`
        );
      } finally {
        setLoading(false);
      }
    } else {
      // Other actions if needed
    }
  };
  const handleMenuAction = (action) => {
    if (selectedItem) {
      handleAction(action, selectedItem); // This function must be defined by you
      handleMenuClose();
    }
  };
  const handleFileOpen = (fileItem) => {
   
    const baseUrl = `${DOCS_MANAGMENTS}`; // or http://localhost:8000 in dev
    const fileUrl = `${baseUrl}/${fileItem.path}`;

    // window.open(fileUrl, "_blank");
    window.location.href = fileUrl;
  };
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  useEffect(() => {
    fetchFolderData();
  }, []);
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  // const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const [folderTemplates, setFolderTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const fetchFolderData = async () => {
    try {
      const url = `${API_KEY}/foldertemp/folder`;
      const response = await fetch(url);
      const data = await response.json();
      setFolderTemplates(data.folderTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSelectTemplate = (selectedOptions) => {
    setSelectedTemplate(selectedOptions);
  };
  const optionFolders = folderTemplates.map((folderTemplates) => ({
    value: folderTemplates._id,
    label: folderTemplates.templatename,
  }));

  const assignfoldertemp = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountId: data,
      foldertempId: selectedTemplate.value,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    fetch(`${DOCS_MANAGMENTS}/clientdocs/accountfoldertemp`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // fetchFolders(data);
        setSelectedTemplate(null);
        fetchBothFolders();
        fetchData();
        toast.success("Folder Template Assign Successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to Assign Folder Template");
      });
  };

  if (error) return <div>Error: {error}</div>;
  if (!combinedFolderStructure || !privateStructFolder) return <div></div>;
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "16px",
          maxWidth: "800px",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              component="label"
              htmlFor="fileInput"
              sx={{ color: "#e87800" }}
            >
              <HiDocumentArrowUp size={24} />
            </IconButton>
            <Typography
              variant="body1"
              component="label"
              htmlFor="fileInput"
              sx={{ cursor: "pointer" }}
            >
              Upload Document
            </Typography>
            <Input
              type="file"
              id="fileInput"
              onChange={(e) => {
                handleFileChange(e);
                handleFileUpload();
              }}
              sx={{ display: "none" }}
            />
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            onClick={handleCreateFolderClick}
          >
            <IconButton sx={{ color: "#e87800" }}>
              <FaRegFolderClosed size={20} />
            </IconButton>
            <Typography variant="body1" sx={{ cursor: "pointer" }}>
              Create Folder
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() => folderInputRef.current.click()}
          >
            <IconButton sx={{ color: "#e87800" }}>
              <MdOutlineDriveFolderUpload size={24} />
            </IconButton>
            <Typography variant="body1">Upload Folder</Typography>
            <input
              type="file"
              ref={folderInputRef}
              style={{ display: "none" }}
              webkitdirectory="true"
              directory="true"
              onChange={handleFolderSelection}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowAutocomplete((prev) => !prev)}
            sx={{
              backgroundColor: "var(--color-save-btn)",
              "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
              borderRadius: "15px",
            }}
          >
            Assign Folder Template
          </Button>
        </Box>

        {showAutocomplete && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
            <Autocomplete
              options={optionFolders}
              getOptionLabel={(option) => option.label}
              value={selectedTemplate}
              onChange={(event, newValue) => handleSelectTemplate(newValue)}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                >
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ backgroundColor: "#fff" }}
                  placeholder="Select Folder "
                  variant="outlined"
                  size="small"
                />
              )}
              sx={{ width: "30%", marginTop: "8px" }}
              clearOnEscape // Enable clearable functionality
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={assignfoldertemp}
                disabled={!selectedTemplate}
                sx={{
                  backgroundColor: "var(--color-save-btn)", // Normal background

                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                  },
                  borderRadius: "15px",
                  width: "80px",
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <Box>
        <div>{renderTree(combinedFolderStructure)}</div>
      </Box>

      <Box>
        {renderPrivateFolderContents(
          privateStructFolder.folders,
          (newFolders) =>
            setPrivateStructFolder({
              ...privateStructFolder,
              folders: newFolders,
            })
        )}
      </Box>

      <Box sx={{ mt: 2, borderBottom: "2px solid grey" }}></Box>

      <Box>
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "16px",
            maxWidth: "800px",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                component="label"
                htmlFor="firmDocFileInput"
                sx={{ color: "#e87800" }}
              >
                <HiDocumentArrowUp size={24} />
              </IconButton>
              <Typography
                variant="body1"
                component="label"
                htmlFor="firmDocFileInput"
                sx={{ cursor: "pointer" }}
              >
                Upload Document in firm
              </Typography>
              <Input
                type="file"
                id="firmDocFileInput"
                onChange={(e) => {
                  handleNewFileChange(e);
                  handleOpenDrawer();
                }}
                sx={{ display: "none" }}
              />
            </Box>

            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
              onClick={handleNewFolderClick}
            >
              <IconButton sx={{ color: "#e87800" }}>
                <FaRegFolderClosed size={20} />
              </IconButton>
              <Typography variant="body1" sx={{ cursor: "pointer" }}>
                Create Folder in firm
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          
          <FileExplorer accountId={data} refreshTrigger={refreshKey} />
        </Box>
      </Box>

      {/* <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {selectedItem?.folder === "Client Uploaded Documents" ? (
          <>
            <MenuItem onClick={() => handleMenuAction("new-folder")} disabled>
              New Folder
            </MenuItem>
            <MenuItem disabled onClick={() => handleMenuAction("edit")}>
              Edit
            </MenuItem>
           
          </>
        ) : (
          <>
           
            <MenuItem onClick={() => {
           
              handleEdit(selectedItem);
              handleMenuClose();
           
          }}>Edit</MenuItem>
            <MenuItem onClick={() =>{ handleDelete(selectedItem); handleMenuClose();}}>
              Delete
            </MenuItem>

            <MenuItem
              onClick={() =>
                handleMenuAction(selectedItem?.sealed ? "unseal" : "seal")
              }
            >
              {selectedItem?.sealed ? "Unseal" : "Seal"}
            </MenuItem>

             

<MenuItem onClick={() => {
           
              handleFileMove();
              handleMenuClose();
              handleMove(selectedItem);
           
          }}>Move</MenuItem>

          </>
        )}
      </Menu> */}

     <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleMenuClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
  >
    {selectedItem?.folder === "Client Uploaded Documents" ? (
      // Disable all options for the parent folder
      <>
        <MenuItem disabled>New Folder</MenuItem>
        <MenuItem disabled>Edit</MenuItem>
        <MenuItem disabled>Move</MenuItem>
        <MenuItem disabled>Seal/Unseal</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </>
    ) : selectedItem?.folder ? (
      // Folder menu options (for non-parent folders)
      <>
        <MenuItem onClick={() => handleMenuAction("new-folder")}>
          New Folder
        </MenuItem>
        <MenuItem onClick={() => {
          handleEdit(selectedItem);
          handleMenuClose();
        }}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          handleFileMove();
          handleMenuClose();
          handleMove(selectedItem);
        }}>
          Move
        </MenuItem>
        <MenuItem onClick={() =>
          handleMenuAction(selectedItem?.sealed ? "unseal" : "seal")
        }>
          {selectedItem?.sealed ? "Unseal" : "Seal"}
        </MenuItem>
        <MenuItem onClick={() => { 
          handleDelete(selectedItem); 
          handleMenuClose();
        }}>
          Delete
        </MenuItem>
      </>
    ) : (
      // File menu options
      <>
        <MenuItem onClick={() => {
          handleEdit(selectedItem);
          handleMenuClose();
        }}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => { 
          handleDelete(selectedItem); 
          handleMenuClose();
        }}>
          Delete
        </MenuItem>
        <MenuItem onClick={() =>
          handleMenuAction(selectedItem?.sealed ? "unseal" : "seal")
        }>
          {selectedItem?.sealed ? "Unseal" : "Seal"}
        </MenuItem>
        <MenuItem onClick={() => {
          handleFileMove();
          handleMenuClose();
          handleMove(selectedItem);
        }}>
          Move
        </MenuItem>
        <MenuItem onClick={() => handleFileOpen(selectedItem)}>
          Download
        </MenuItem>
      </>
    )}
  </Menu>

      {/* <Menu
        anchorEl={privateAnchorEl}
        open={Boolean(privateAnchorEl)}
        onClose={handlePrivateCloseMenu}
      >
        <MenuItem
          onClick={() => {
            if (selectedItem?.folder !== "Private") {
              handleEdit(selectedItem);
              handlePrivateCloseMenu();
            }
          }}
          disabled={selectedItem?.folder === "Private"}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedItem?.folder !== "Private") {
              handleDelete(selectedItem);
              handlePrivateCloseMenu();
            }
          }}
          disabled={selectedItem?.folder === "Private"}
        >
          Delete
        </MenuItem>
         <MenuItem onClick={() => {
           
              handleFileMove();
              handleMenuClose();
              handleMove(selectedItem);
           
          }}>Move</MenuItem>
      </Menu> */}
      <Menu
    anchorEl={privateAnchorEl}
    open={Boolean(privateAnchorEl)}
    onClose={handlePrivateCloseMenu}
  >
    {selectedItem?.folder ? (
      // Private folder menu options
      <>
        <MenuItem onClick={() => {
          handleEdit(selectedItem);
          handlePrivateCloseMenu();
        }}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          handleFileMove();
          handlePrivateCloseMenu();
          handleMove(selectedItem);
        }}>
          Move
        </MenuItem>
        <MenuItem onClick={() => { 
          handleDelete(selectedItem); 
          handlePrivateCloseMenu();
        }}>
          Delete
        </MenuItem>
      </>
    ) : (
      // Private file menu options
      <>
        <MenuItem onClick={() => {
          handleEdit(selectedItem);
          handlePrivateCloseMenu();
        }}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => { 
          handleDelete(selectedItem); 
          handlePrivateCloseMenu();
        }}>
          Delete
        </MenuItem>
        <MenuItem onClick={() => {
          handleFileMove();
          handlePrivateCloseMenu();
          handleMove(selectedItem);
        }}>
          Move
        </MenuItem>
        <MenuItem onClick={() => handleFileOpen(selectedItem)}>
          Download
        </MenuItem>
      </>
    )}
  </Menu>

      <EditNameDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={selectedItem}
        onRename={handleRename}
      />
     
 <MoveFile
       open={isMoveDocument}
        onClose={() => setIsMoveDocument(false)}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        fetchBothFolders={fetchBothFolders}
        accountId={data}
         sourceFile={sourceFile}
         isMoveDocument={isMoveDocument}
      />
      <CreateFolder
        open={isFolderFormOpen}
        onClose={() => setIsFolderFormOpen(false)}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        fetchBothFolders={fetchBothFolders}
        accountId={data}
      />

      <UploadDrawer
        open={isDocumentForm}
        onClose={() => setIsDocumentForm(false)}
        file={file}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        accountId={data}
        fetchBothFolders={fetchBothFolders}
      />

      <UploadFolder
        open={isUploadFolderFormOpen}
        folderFiles={folderFiles}
        setFolderFiles={setFolderFiles}
        setFolderName={setFolderName}
        folderName={folderName}
        onClose={() => setIsUploadFolderFormOpen(false)}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        fetchBothFolders={fetchBothFolders}
        accountId={data}
      />

      {/* FIRM DOCS SHARED WITH CLIENT UPLOAD DOC DRAWER */}
      <UploadDoc
        open={uploadDocOpen}
        onClose={() => setUplaodDocOpen(false)}
        file={file}
        accountId={data}
        onUploadSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
      {/* FIRM DOCS SHARED WITH CLIENT CREATE FOLDER DRAWER */}
      <CreateFolderInFirm
        open={isFolderCreate}
        onClose={() => setIsFolderCreate(false)}
        accountId={data}
      />
    </Box>
  );
};

export default Documents;

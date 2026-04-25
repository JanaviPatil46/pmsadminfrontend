import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import FetchFolder from "./FetchFolder";
import CreateFolder from "./CreateFolder";
import UploadDrawer from "./uploadDocumentWorking";
import UploadFolder from "./folderUpload";
import { HiDocumentArrowUp } from "react-icons/hi2";
// import UploadDocument from "./uploadDocumentWorking";
import axios from "axios";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { FaRegFolderClosed } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import UploadDoc from "./Firm Docs Shared With Client/UplodDoc"
import CreateFolderInFirm from "./Firm Docs Shared With Client/CreateFolder"
import FileExplorer from "./FileExplorer"
import EditNameDrawer from './EditNameDrawer'
function FolderList({ tempName, fetchAllFolders, folderData, templateId }) {
  console.log("jjj", templateId);
  console.log("jjj temp", tempName);
  const API_KEY = process.env.REACT_APP_FOLDER_URL;

  const [refreshKey, setRefreshKey] = useState(0);
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
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [privateStructFolder, setPrivateStructFolder] = useState(null);
  const [structFolder, setStructFolder] = useState(null);
  const [sealedStructFolder, setSealedStructFolder] = useState(null);
  const [combinedFolderStructure, setCombinedFolderStructure] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // FileExplorer related state
  const [firmFiles, setFirmFiles] = useState([]);
  const firmfolderName = "Firm Docs Shared With Client";

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleNewFileChange = (e) => setFile(e.target.files[0]);
  const handleFileUpload = () => setIsDocumentForm(true);
  const handleOpenDrawer = () => setUplaodDocOpen(true);
  const handleCreateFolderClick = () => setIsFolderFormOpen((prev) => !prev);
  const handleNewFolderClick = () => setIsFolderCreate((prev) => !prev);

  const openDrawer = () => {
    setIsUploadFolderFormOpen(true);
  };

  useEffect(() => {
    if (isDrawerOpen) openDrawer();
  }, [isDrawerOpen]);

  useEffect(() => {
    if (templateId) {
      fetchUnSealedFolders();
      fetchSealedFolders();
      fetchPrivateFolders();
      fetchBothFolders();
      fetchFirmFiles(); // Fetch firm files when templateId changes
    }
  }, [templateId]);

  const fetchFirmFiles = async () => {
    try {
      const res = await fetch(`${API_KEY}/firmClientDocs/files/${templateId}`);
      const data = await res.json();
      setFirmFiles(data.files || []);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  const fetchUnSealedFolders = async () => {
    try {
      const res = await axios.get(
        `${API_KEY}/foldertemplates/unsealed/${templateId}`
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
        `${API_KEY}/foldertemplates/sealedFolders/${templateId}`
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

  const fetchPrivateFolders = async () => {
    try {
      const res = await axios.get(
        `${API_KEY}/foldertemplates/privateDocs/${templateId}`
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

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleEdit = (item) => {
    console.log("Edit", item);
    setSelectedItem(item);
    setDrawerOpen(true);
  };


  const handleRename = async (item, newName,itemPath) => {
    console.log("path", item)
    try {
      const response = await fetch(`${API_KEY}/foldertemplates/rename-item`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPath: itemPath,
          newName,
          // id: item.id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Renamed:", data);
        fetchBothFolders()
        fetchPrivateFolders()
        // Refresh your data list here
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Rename failed", error);
    }
  };
  // const handleDelete = (item) => {
  //   console.log("Delete", item);
  //   // Add your delete logic here
  // };
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

    fetch(`${API_KEY}/foldertemplates/delete-item`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log("Delete Result:", result);
        toast.success("Deleted successfully");
        fetchBothFolders();
      })
      .catch((error) => console.error("Delete Error:", error));
  };

  const handleMenuAction = (action) => {
    if (selectedItem) {
      handleAction(action, selectedItem);
      handleMenuClose();
    }
  };

  const handleFileOpen = (fileItem) => {
    const fileUrl = `${API_KEY}/${fileItem.path}`;
    window.location.href = fileUrl;
  };

  const fetchBothFolders = async () => {
    try {
      const [sealedRes, unsealedRes] = await Promise.all([
        axios.get(`${API_KEY}/foldertemplates/sealedFolders/${templateId}`),
        axios.get(`${API_KEY}/foldertemplates/unsealed/${templateId}`),
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

      const combinedFolders = [
        {
          folder: "Client Uploaded Documents",
          isOpen: false,
          id: "client-root",
          contents: [...sealedFolders, ...unsealedFolders],
        },
      ];

      setCombinedFolderStructure(combinedFolders);
    } catch (err) {
      setError(err.message || "Error fetching folders.");
    }
  };

  const handleAction = async (action, item) => {
    console.log(`Action: ${action} on`, item);
    setActiveMenu(null);

    if (action === "seal" || action === "unseal") {
      try {
        setLoading(true);
        const pathParts = item.path.split("/");
        const folderId = pathParts[2];
        const basePath = `uploads/FolderTemplates/${folderId}/Client Uploaded Documents`;
        const currentDir = action === "seal" ? "unsealed" : "sealed";
        const relativePath = item.path.replace(
          `${basePath}/${currentDir}/`,
          ""
        );

        await axios.post(
          `${API_KEY}/foldertemplates/moveBetweenSealedUnsealed`,
          {
            id: folderId,
            itemPath: relativePath,
            direction: action === "seal" ? "toSealed" : "toUnsealed",
          }
        );

        await fetchBothFolders();
        alert(`Item ${action === "seal" ? "sealed" : "unsealed"} successfully`);
      } catch (error) {
        console.error("Error moving item:", error);
        alert(
          `Failed to ${action} item: ${error.response?.data?.error || error.message}`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // FileExplorer related functions
  const buildFileTree = (files, folderStart) => {
    const root = {};

    const parts = folderStart.split("/");
    let current = root;
    parts.forEach((part) => {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    });

    files.forEach((file) => {
      let path = file.filePath.replace(/\\/g, "/");
      const index = path.toLowerCase().indexOf(folderStart.toLowerCase());

      if (index === -1) return;
      path = path.slice(index);

      const fileParts = path.split("/");

      let current = root;

      fileParts.forEach((part) => {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      });

      if (file.filename !== "#$default.txt") {
        current[file.filename] = file;
      }
    });

    return root;
  };

  const FirmFolder = ({ name, content, onSelectPath, currentPath = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isFile = content.filename;
    const fullPath = currentPath ? `${currentPath}/${name}` : name;

    if (isFile) {
      return (
        <div style={{ paddingLeft: 20 }}>
          📄 <span>{content.filename}</span>
        </div>
      );
    }

    const handleClick = () => {
      setIsOpen(!isOpen);
      if (onSelectPath) {
        onSelectPath(fullPath);
      }
    };

    return (
      <div style={{ paddingLeft: 20 }}>
        <div onClick={handleClick} style={{ cursor: "pointer" }}>
          {isOpen ? "📂" : "📁"} <span>{name}</span>
        </div>
        {isOpen &&
          Object.entries(content).map(([childName, childContent]) => (
            <FirmFolder
              key={childName}
              name={childName}
              content={childContent}
              onSelectPath={onSelectPath}
              currentPath={fullPath}
            />
          ))}
      </div>
    );
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
              <button type="button" onClick={(e) => handleMenuOpen(e, item)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                  <BsThreeDotsVertical className="h-4 w-4" />
                </button>
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
            <button type="button" onClick={(e) => handleMenuOpen(e, item)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <BsThreeDotsVertical className="h-4 w-4" />
              </button>
          </div>
        );
      }
    });
  };

  // const renderPrivateFolderContents = (contents, setContents) =>
  //   contents.map((item, index) => {
  //     if (item.folder) {
  //       const toggleFolder = () => {
  //         const updated = contents.map((f, i) =>
  //           i === index ? { ...f, isOpen: !f.isOpen } : f
  //         );
  //         setContents(updated);
  //       };

  //       const selectFolder = () => setSelectedFolderId(item.id);

  //       return (
  //         <div key={index} style={{ marginLeft: "20px", marginBottom: "4px" }}>
  //           <div
  //             style={{
  //               cursor: "pointer",
  //               display: "flex",
  //               alignItems: "center",
  //               paddingRight: "8px",
  //               borderRadius: "4px",
  //             }}
  //             onClick={selectFolder}
  //           >
  //             <div
  //               onClick={toggleFolder}
  //               style={{ display: "flex", alignItems: "center", gap: "8px" }}
  //             >
  //               <span>{item.isOpen ? "📂" : "📁"}</span>
  //               <span>{item.folder}</span>
  //             </div>
  //           </div>
  //           {item.isOpen && item.contents?.length > 0 && (
  //             <div style={{ marginTop: "4px" }}>
  //               {renderPrivateFolderContents(item.contents, (newContents) => {
  //                 const updated = contents.map((f, i) =>
  //                   i === index ? { ...f, contents: newContents } : f
  //                 );
  //                 setContents(updated);
  //               })}
  //             </div>
  //           )}
  //         </div>
  //       );
  //     } else if (item.file) {
  //       return (
  //         <div
  //           key={index}
  //           style={{
  //             marginLeft: "40px",
  //             padding: "4px 8px",
  //             fontSize: "15px",
  //             display: "flex",
  //             alignItems: "center",
  //           }}
  //         >
  //           <span style={{ marginRight: "8px" }}>📄</span>
  //           <span
  //             onClick={() => handleFileOpen(item)}
  //             style={{ cursor: "pointer" }}
  //           >
  //             {item.file}
  //           </span>
  //         </div>
  //       );
  //     }
  //     return null;
  //   });

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
                  justifyContent: "space-between",
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
                <button type="button" onClick={(e) => handleMenuOpen(e, item)} className="ml-auto p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                  <BsThreeDotsVertical className="h-4 w-4" />
                </button>
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
              <button type="button" onClick={(e) => handleMenuOpen(e, item)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <BsThreeDotsVertical className="h-4 w-4" />
              </button>
            </div>
          );
        }
        return null;
      });
  if (error) return <div>Error: {error}</div>;
  if (!combinedFolderStructure || !privateStructFolder) return <div></div>;

  const fileTree = buildFileTree(firmFiles, firmfolderName);

  return (
    <div className="p-4 space-y-4">
      <p className="text-sm font-semibold text-slate-700">Template Name: <strong>{tempName}</strong></p>
      {/* <Divider sx={{ marginY: 2 }} />
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
        </Box>
      </Box>
      <Box>
      {renderTree(combinedFolderStructure)}
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

           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} onClick={handleNewFolderClick}>
             <IconButton
               
               sx={{ color: "#e87800" }}
             >
               <FaRegFolderClosed size={20} />
             </IconButton>
             <Typography variant="body1" sx={{ cursor: "pointer" }}>
               Create Folder in firm
             </Typography>
           </Box>
         </Box>
       </Box>
       <Box>
        

         
         <FileExplorer accountId={templateId} refreshTrigger={refreshKey} />


       </Box>
     </Box>

            <CreateFolder
             fetchBothFolders={fetchBothFolders}
        open={isFolderFormOpen}
        onClose={() => setIsFolderFormOpen(false)}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        templateId={templateId}
      />

      <UploadDrawer
        open={isDocumentForm}
        onClose={() => setIsDocumentForm(false)}
        file={file}
        fetchBothFolders={fetchBothFolders}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        templateId={templateId}
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
        templateId={templateId}
      />





    
        <UploadDoc
        open={uploadDocOpen}
        onClose={() => setUplaodDocOpen(false)}
        file={file}
        accountId={templateId}
        onUploadSuccess={() => setRefreshKey(prev => prev + 1)}
      />
     
      <CreateFolderInFirm
        open={isFolderCreate}
        onClose={() => setIsFolderCreate(false)}
        accountId={templateId}
      /> */}

      <hr className="border-slate-200" />

      {/* Client Uploaded Documents toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <label htmlFor="fileInput" className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <HiDocumentArrowUp className="h-4 w-4 text-orange-500" />
          Upload Document
          <input type="file" id="fileInput" className="hidden" onChange={(e) => { handleFileChange(e); handleFileUpload(); }} />
        </label>
        <button type="button" onClick={handleCreateFolderClick} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <FaRegFolderClosed className="h-4 w-4 text-orange-500" />
          Create Folder
        </button>
        <button type="button" onClick={() => folderInputRef.current.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <MdOutlineDriveFolderUpload className="h-4 w-4 text-orange-500" />
          Upload Folder
          <input type="file" ref={folderInputRef} className="hidden" webkitdirectory="true" directory="true" onChange={handleFolderSelection} />
        </button>
      </div>

      {/* Folder tree */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {renderTree(combinedFolderStructure)}
      </div>

      {/* Context menu */}
      {Boolean(anchorEl) && (() => {
        const rect = anchorEl.getBoundingClientRect();
        const isDisabled = selectedItem?.folder === "Client Uploaded Documents" || selectedItem?.folder === "Private";
        return (
          <>
            <div className="fixed inset-0 z-40" onClick={handleMenuClose} />
            <div className="fixed z-50 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-xl" style={{ top: rect.bottom + 4, left: rect.left }}>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => { if (!isDisabled) { handleEdit(selectedItem); handleMenuClose(); } }}
                className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-500 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
              >Edit</button>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => { if (!isDisabled) { handleDelete(selectedItem); handleMenuClose(); } }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
              >Delete</button>
            </div>
          </>
        );
      })()}

      {/* Private folder contents */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {renderPrivateFolderContents(
          privateStructFolder.folders,
          (newFolders) => setPrivateStructFolder({ ...privateStructFolder, folders: newFolders })
        )}
      </div>

      <hr className="border-slate-200" />

      {/* Firm Docs toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <label htmlFor="firmDocFileInput" className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <HiDocumentArrowUp className="h-4 w-4 text-orange-500" />
          Upload Document in firm
          <input type="file" id="firmDocFileInput" className="hidden" onChange={(e) => { handleNewFileChange(e); handleOpenDrawer(); }} />
        </label>
        <button type="button" onClick={handleNewFolderClick} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <FaRegFolderClosed className="h-4 w-4 text-orange-500" />
          Create Folder in firm
        </button>
      </div>

      {/* Firm file tree */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {Object.entries(fileTree).map(([name, content]) => (
          <FirmFolder key={name} name={name} content={content} />
        ))}
      </div>

      <hr className="border-slate-200" />
      {/* <Box mt={5}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            borderColor: "var(--color-border-cancel-btn)", // Normal background
            color: "var(--color-save-btn)",
            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)", // Hover background color
              color: "#fff",
              border: "none",
            },
            width: "80px",
            borderRadius: "15px",
          }}
        >
          Cancel
        </Button>
      </Box> */}
      {/* <Box display="flex" gap={2} mt={5}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveTemplate}
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
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            borderColor: "var(--color-border-cancel-btn)", // Normal background
            color: "var(--color-save-btn)",
            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)", // Hover background color
              color: "#fff",
              border: "none",
            },
            width: "80px",
            borderRadius: "15px",
          }}
        >
          Cancel
        </Button>
      </Box> */}

<EditNameDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={selectedItem}
        onRename={handleRename}
      />
      <CreateFolder
        open={isFolderFormOpen}
        onClose={() => setIsFolderFormOpen(false)}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        fetchBothFolders={fetchBothFolders}
        accountId={templateId}
      />

      <UploadDrawer
        open={isDocumentForm}
        onClose={() => setIsDocumentForm(false)}
        file={file}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        accountId={templateId}
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
        accountId={templateId}
        fetchBothFolders={fetchBothFolders}
      />

      <UploadDoc
        open={uploadDocOpen}
        onClose={() => setUplaodDocOpen(false)}
        file={file}
        accountId={templateId}
        onUploadSuccess={() => setRefreshKey((prev) => prev + 1)}
        fetchFirmFiles={fetchFirmFiles}
      />

      <CreateFolderInFirm
        open={isFolderCreate}
        onClose={() => setIsFolderCreate(false)}
        accountId={templateId}
        fetchFirmFiles={fetchFirmFiles}
      />
    
    </div>
  );
}

export default FolderList;

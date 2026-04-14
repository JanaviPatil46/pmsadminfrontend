import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import CreateFolder from "./CreateFolder";
import UploadDrawer from "./uploadDocumentWorking";
import UploadFolder from "./folderUpload";
import { HiDocumentArrowUp } from "react-icons/hi2";
import axios from "axios";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { FaRegFolderClosed } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import UploadDoc from "./Firm Docs Shared With Client/UplodDoc";
import CreateFolderInFirm from "./Firm Docs Shared With Client/CreateFolder";
import EditNameDrawer from "./EditNameDrawer";

function FolderTempEdit({ templateId, handleCancel, fetchFolderTemplates }) {
  const [templateName, setTemplateName] = useState("");
  const API_KEY = process.env.REACT_APP_FOLDER_URL;

  useEffect(() => {
    if (!templateId) return;

    const fetchTemplateName = async () => {
      try {
        const response = await fetch(
          `${API_KEY}/foldertemp/folder/${templateId}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setTemplateName(data.folderTemplate.templatename);
      } catch (error) {
        console.error("Error fetching template name:", error);
      }
    };

    fetchTemplateName();
  }, [templateId]);

  const handleSaveTemplate = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      templatename: templateName,
    });
    console.log(raw);

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${API_KEY}/foldertemp/folder/${templateId}`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.id);
        fetchFolderTemplates();
        // fetchAllFolders(result.id);
        // setTemplateId(result.id);

        // Display success toast
        toast.success("Template Updated successfully");
        // Reset the form
        handleCancel();
      })
      .catch((error) => {
        console.error(error);
        // Display error toast
        toast.error("Failed to save template");
      });

    // window.location.reload();
    // setFolderList(true);
    // setTemplateName(false);
  };

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
      console.log("docs", data)
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
    // setSelectedItem(null);
    setTimeout(() => setSelectedItem(null), 100);
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
        `${API_KEY}/foldertemplates/rename-item`,
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
        fetchPrivateFolders();
      })
      .catch((error) => console.error("Delete Error:", error));
  };

  const handleFileOpen = (fileItem) => {
    const fileUrl = `${API_KEY}/${fileItem.path}`;
    // window.location.href = fileUrl;
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
    // if (isFile) {
    //   const { canDelete, canUpdate } = content.permissions || {};
    
    //   return (
    //     <div style={{ paddingLeft: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    //       <div>
    //         📄 <span>{content.filename}</span>
    //       </div>
    //       <div>
    //         {canUpdate && (
    //           <IconButton size="small" >
    //               <EditIcon fontSize="small" />
    //           </IconButton>
    //         )}
    //         {canDelete && (
    //           <IconButton size="small" >
    //            <DeleteIcon fontSize="small" />
    //           </IconButton>
    //         )}
    //       </div>
    //     </div>
    //   );
    // }
    

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
              <button type="button" onClick={(e) => handleMenuOpen(e, item)}
                className="p-1 text-gray-500 hover:text-gray-700 ml-auto">
                <BsThreeDotsVertical />
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
            <button type="button" onClick={(e) => handleMenuOpen(e, item)}
              className="p-1 text-gray-500 hover:text-gray-700">
              <BsThreeDotsVertical />
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
              <button type="button" onClick={(e) => handleMenuOpen(e, item)}
                className="p-1 text-gray-500 hover:text-gray-700 ml-auto">
                <BsThreeDotsVertical />
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
            <button type="button" onClick={(e) => handleMenuOpen(e, item)}
              className="p-1 text-gray-500 hover:text-gray-700">
              <BsThreeDotsVertical />
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
    <div>
      <p className="text-sm font-medium mb-2">Edit folder template</p>
      <div className="mt-2">
        <label className="block text-xs text-black font-medium mb-1">Template Name</label>
        <input
          type="text"
          placeholder="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      <hr className="border-gray-200 my-4" />

      <div className="bg-white rounded-lg p-4 max-w-3xl">
        <div className="flex gap-4">
          <label htmlFor="fileInput" className="flex items-center gap-1 cursor-pointer text-sm">
            <span className="text-[#e87800]"><HiDocumentArrowUp size={24} /></span>
            Upload Document
            <input type="file" id="fileInput" className="hidden"
              onChange={(e) => { handleFileChange(e); handleFileUpload(); }} />
          </label>

          <button type="button" onClick={handleCreateFolderClick}
            className="flex items-center gap-1 text-sm cursor-pointer">
            <span className="text-[#e87800]"><FaRegFolderClosed size={20} /></span>
            Create Folder
          </button>

          <button type="button" onClick={() => folderInputRef.current.click()}
            className="flex items-center gap-1 text-sm cursor-pointer">
            <span className="text-[#e87800]"><MdOutlineDriveFolderUpload size={24} /></span>
            Upload Folder
            <input type="file" ref={folderInputRef} className="hidden"
              webkitdirectory="true" directory="true" onChange={handleFolderSelection} />
          </button>
        </div>
      </div>

      <div>{renderTree(combinedFolderStructure)}</div>
      <div>
        {renderPrivateFolderContents(
          privateStructFolder.folders,
          (newFolders) => setPrivateStructFolder({ ...privateStructFolder, folders: newFolders })
        )}
      </div>

      {Boolean(anchorEl) && (
        <>
          <div className="fixed inset-0 z-30" onClick={handleMenuClose} />
          <div className="absolute z-40 bg-white border border-gray-200 rounded shadow-lg py-1 min-w-[120px]"
            style={{ top: anchorEl?.getBoundingClientRect().bottom + window.scrollY,
                     left: anchorEl?.getBoundingClientRect().left + window.scrollX }}>
            <button type="button"
              disabled={selectedItem?.folder === "Client Uploaded Documents" || selectedItem?.folder === "Private"}
              onClick={() => { if (selectedItem?.folder !== "Client Uploaded Documents" && selectedItem?.folder !== "Private") { handleEdit(selectedItem); handleMenuClose(); } }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-40">
              Edit
            </button>
            <button type="button"
              disabled={selectedItem?.folder === "Client Uploaded Documents" || selectedItem?.folder === "Private"}
              onClick={() => { if (selectedItem?.folder !== "Client Uploaded Documents" && selectedItem?.folder !== "Private") { handleDelete(selectedItem); handleMenuClose(); } }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40">
              Delete
            </button>
          </div>
        </>
      )}

      <hr className="border-gray-300 mt-2 mb-0" />

      <div>
        <div className="bg-white rounded-lg p-4 max-w-3xl">
          <div className="flex gap-4">
            <label htmlFor="firmDocFileInput" className="flex items-center gap-1 cursor-pointer text-sm">
              <span className="text-[#e87800]"><HiDocumentArrowUp size={24} /></span>
              Upload Document in firm
              <input type="file" id="firmDocFileInput" className="hidden"
                onChange={(e) => { handleNewFileChange(e); handleOpenDrawer(); }} />
            </label>

            <button type="button" onClick={handleNewFolderClick}
              className="flex items-center gap-1 text-sm cursor-pointer">
              <span className="text-[#e87800]"><FaRegFolderClosed size={20} /></span>
              Create Folder in firm
            </button>
          </div>
        </div>
        <div>
          {Object.entries(fileTree).map(([name, content]) => (
            <FirmFolder key={name} name={name} content={content} />
          ))}
        </div>
      </div>

      <hr className="border-gray-300 mt-2" />

      <div className="flex gap-2 mt-8">
        <button type="button" onClick={handleSaveTemplate}
          className="rounded-full px-5 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)]">
          Save
        </button>
        <button type="button" onClick={handleCancel}
          className="rounded-full px-5 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white">
          Cancel
        </button>
      </div>
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

export default FolderTempEdit;

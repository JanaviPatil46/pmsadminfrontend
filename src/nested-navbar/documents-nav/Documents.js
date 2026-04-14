

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { FaRegFolderClosed } from "react-icons/fa6";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CreateFolder from "./AdminPortal/CreateFolder";
import UploadDrawer from "./AdminPortal/uploadDocumentWorking";
import UploadFolder from "./AdminPortal/folderUpload";
// import DocumentManager from "./DocumentManager"
import UploadDoc from "./Firm Docs Shared With Client/UplodDoc";
import CreateFolderInFirm from "./Firm Docs Shared With Client/CreateFolder";
import { FolderOpen as FolderOpenIcon, FolderClosed as FolderClosedIcon, FileText } from "lucide-react";
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
          <div key={item.id} className="pl-5">
            <div className="flex items-center justify-between pr-2">
              <div
                className="flex items-center gap-2 cursor-pointer py-1.5 hover:bg-gray-50 rounded-lg px-2 flex-1 transition-colors"
                onClick={() => handleToggle(item.id)}
              >
                <span className="text-sm">{item.isOpen ? "📂" : "📁"}</span>
                <span className="text-sm font-medium text-gray-700">{item.folder}</span>
                {item.sealed && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-600 text-white">
                    Sealed
                  </span>
                )}
              </div>
              {item.folder !== "Client Uploaded Documents" && (
                <button
                  type="button"
                  onClick={(e) => handleMenuOpen(e, item)}
                  className="h-6 w-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <BsThreeDotsVertical size={13} />
                </button>
              )}
            </div>
            {item.isOpen && item.contents?.length > 0 && (
              <div>{renderTree(item.contents)}</div>
            )}
          </div>
        );
      } else {
        return (
          <div key={item.id} className="pl-10 flex items-center justify-between pr-2 py-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">📄</span>
              <span
                onClick={() => handleFileOpen(item)}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
              >
                {item.file}
              </span>
              {item.sealed && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-600 text-white">
                  Sealed
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => handleMenuOpen(e, item)}
              className="h-6 w-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <BsThreeDotsVertical size={13} />
            </button>
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
          <div key={index} className="ml-5 mb-1">
            <div className="flex items-center justify-between pr-2" onClick={selectFolder}>
              <div
                className="flex items-center gap-2 cursor-pointer py-1.5 hover:bg-gray-50 rounded-lg px-2 flex-1 transition-colors"
                onClick={toggleFolder}
              >
                <span className="text-sm">{item.isOpen ? "📂" : "📁"}</span>
                <span className="text-sm font-medium text-gray-700">{item.folder}</span>
              </div>
              {item.folder !== "Private" && (
                <button
                  type="button"
                  onClick={(e) => handlePrivateMenuOpen(e, item)}
                  className="h-6 w-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <BsThreeDotsVertical size={13} />
                </button>
              )}
            </div>
            {item.isOpen && item.contents?.length > 0 && (
              <div className="mt-1">
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
          <div key={index} className="ml-10 flex items-center justify-between py-1 pr-2">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleFileOpen(item)}
            >
              <span className="text-sm">📄</span>
              <span className="text-sm text-blue-600 hover:underline">{item.file}</span>
            </div>
            <button
              type="button"
              onClick={(e) => handlePrivateMenuOpen(e, item)}
              className="h-6 w-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <BsThreeDotsVertical size={13} />
            </button>
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
      <div key={folder.folderName} className="ml-3">
        <div
          className="flex items-center gap-2 cursor-pointer py-1.5 hover:bg-gray-50 rounded-lg px-2 transition-colors"
          onClick={() => toggleFirmFolder(folder.folderName)}
        >
          {openFolders[folder.folderName] ? (
            <FolderOpenIcon size={16} className="text-amber-400 shrink-0" />
          ) : (
            <FolderClosedIcon size={16} className="text-amber-400 shrink-0" />
          )}
          <span className="text-sm font-medium text-gray-700">{folder.folderName}</span>
        </div>

        {openFolders[folder.folderName] && (
          <div className="ml-5">
            {folder.structure?.map((item, index) => (
              <React.Fragment key={index}>
                {item.subfolders?.map((subfolder) => (
                  <div key={subfolder.name} className="ml-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer py-1.5 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                      onClick={() => toggleFirmFolder(subfolder.name)}
                    >
                      {openFolders[subfolder.name] ? (
                        <FolderOpenIcon size={15} className="text-amber-400 shrink-0" />
                      ) : (
                        <FolderClosedIcon size={15} className="text-amber-400 shrink-0" />
                      )}
                      <span className="text-sm text-gray-700">{subfolder.name}</span>
                    </div>

                    {openFolders[subfolder.name] && (
                      <div className="ml-5">
                        {subfolder.files.map((file, fileIndex) => (
                          <div key={fileIndex} className="flex items-center gap-2 py-1 px-2">
                            <FileText size={14} className="text-gray-400 shrink-0" />
                            <span className="text-xs text-gray-600">{file}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
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
         toast.success("Renamed successfully")
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

  if (error) return <div className="p-4 text-sm text-red-600">Error: {error}</div>;
  if (!combinedFolderStructure || !privateStructFolder) return <div></div>;

  return (
    <div className="space-y-5">
      {/* Client Docs toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="fileInput" className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            <HiDocumentArrowUp size={18} className="text-orange-500" />
            Upload Document
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={(e) => { handleFileChange(e); handleFileUpload(); }}
            />
          </label>

          <button
            type="button"
            onClick={handleCreateFolderClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <FaRegFolderClosed size={16} className="text-orange-500" />
            Create Folder
          </button>

          <button
            type="button"
            onClick={() => folderInputRef.current.click()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <MdOutlineDriveFolderUpload size={18} className="text-orange-500" />
            Upload Folder
            <input
              type="file"
              ref={folderInputRef}
              className="hidden"
              webkitdirectory="true"
              directory="true"
              onChange={handleFolderSelection}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowAutocomplete((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] transition-colors"
          >
            Assign Folder Template
          </button>
        </div>

        {showAutocomplete && (
          <div className="flex items-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="w-72">
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Folder Template</label>
              <select
                value={selectedTemplate?.value || ""}
                onChange={(e) => {
                  const opt = optionFolders.find(o => o.value === e.target.value);
                  handleSelectTemplate(opt || null);
                }}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
              >
                <option value="">Select Folder Template</option>
                {optionFolders.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <button
              type="button"
              onClick={assignfoldertemp}
              disabled={!selectedTemplate}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] disabled:opacity-50 transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Client uploaded documents tree */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Client Uploaded Documents</p>
        <div>{renderTree(combinedFolderStructure)}</div>
      </div>

      {/* Private folders tree */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Private Documents</p>
        {renderPrivateFolderContents(
          privateStructFolder.folders,
          (newFolders) => setPrivateStructFolder({ ...privateStructFolder, folders: newFolders })
        )}
      </div>

      <div className="border-t border-gray-200" />

      {/* Firm docs section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <label htmlFor="firmDocFileInput" className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            <HiDocumentArrowUp size={18} className="text-orange-500" />
            Upload Document in firm
            <input
              type="file"
              id="firmDocFileInput"
              className="hidden"
              onChange={(e) => { handleNewFileChange(e); handleOpenDrawer(); }}
            />
          </label>

          <button
            type="button"
            onClick={handleNewFolderClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <FaRegFolderClosed size={16} className="text-orange-500" />
            Create Folder in firm
          </button>
        </div>
        <FileExplorer accountId={data} refreshTrigger={refreshKey} />
      </div>

      {/* Client docs context menu */}
      {Boolean(anchorEl) && (
        <>
          <div className="fixed inset-0 z-30" onClick={handleMenuClose} />
          <div
            className="fixed z-40 bg-white border border-gray-200 rounded-xl shadow-xl w-48 py-1 overflow-hidden"
            style={{ top: anchorEl?.getBoundingClientRect?.()?.bottom ?? 0, left: anchorEl?.getBoundingClientRect?.()?.left ?? 0 }}
          >
            {selectedItem?.folder === "Client Uploaded Documents" ? (
              <>
                {["New Folder", "Edit", "Move", "Seal/Unseal", "Delete"].map((label) => (
                  <button key={label} type="button" disabled className="w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed">{label}</button>
                ))}
              </>
            ) : selectedItem?.folder ? (
              <>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { handleEdit(selectedItem); handleMenuClose(); }}>Edit</button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { handleFileMove(); handleMenuClose(); handleMove(selectedItem); }}>Move</button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => handleMenuAction(selectedItem?.sealed ? "unseal" : "seal")}>{selectedItem?.sealed ? "Unseal" : "Seal"}</button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => { handleDelete(selectedItem); handleMenuClose(); }}>Delete</button>
              </>
            ) : (
              <>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { handleEdit(selectedItem); handleMenuClose(); }}>Edit</button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => handleMenuAction(selectedItem?.sealed ? "unseal" : "seal")}>{selectedItem?.sealed ? "Unseal" : "Seal"}</button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { handleFileMove(); handleMenuClose(); handleMove(selectedItem); }}>Move</button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => handleFileOpen(selectedItem)}>Download</button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => { handleDelete(selectedItem); handleMenuClose(); }}>Delete</button>
              </>
            )}
          </div>
        </>
      )}

      {/* Private docs context menu */}
      {Boolean(privateAnchorEl) && (
        <>
          <div className="fixed inset-0 z-30" onClick={handlePrivateCloseMenu} />
          <div
            className="fixed z-40 bg-white border border-gray-200 rounded-xl shadow-xl w-48 py-1 overflow-hidden"
            style={{ top: privateAnchorEl?.getBoundingClientRect?.()?.bottom ?? 0, left: privateAnchorEl?.getBoundingClientRect?.()?.left ?? 0 }}
          >
            {selectedItem?.folder ? (
              <>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { handleEdit(selectedItem); handlePrivateCloseMenu(); }}>Edit</button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { handleFileMove(); handlePrivateCloseMenu(); handleMove(selectedItem); }}>Move</button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => { handleDelete(selectedItem); handlePrivateCloseMenu(); }}>Delete</button>
              </>
            ) : (
              <>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { handleEdit(selectedItem); handlePrivateCloseMenu(); }}>Edit</button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { handleFileMove(); handlePrivateCloseMenu(); handleMove(selectedItem); }}>Move</button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => handleFileOpen(selectedItem)}>Download</button>
                <button type="button" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => { handleDelete(selectedItem); handlePrivateCloseMenu(); }}>Delete</button>
              </>
            )}
          </div>
        </>
      )}

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
    </div>
  );
};

export default Documents;

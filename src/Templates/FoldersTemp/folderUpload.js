

import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { FolderOpen, FolderClosed, FileText } from "lucide-react";
import axios from "axios";
import JSZip from "jszip";
const UploadDocument = ({
  open,
  onClose,folderFiles,
  fetchUnSealedFolders,
  fetchAdminPrivateFolders,
  accountId,fetchBothFolders
}) => {

  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  useEffect(() => {
    console.log(accountId);
  }, [accountId]);

  // const [newFolderName, setNewFolderName] = useState("");

  const [structFolder, setStructFolder] = useState(null);
  const [privateStructFolder, setPrivateStructFolder] = useState(null);
  const [privateFolderPath, setPrivateFolderPath] = useState("");
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderPath, setNewFolderPath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const fetchFolders = async () => {
    try {
      const url = `${API_KEY}/foldertemplates/clientDocs/${accountId}`;
      const response = await axios.get(url);
      const addIsOpenProperty = (folders, parentId = null) =>
        folders.map((folder, index) => ({
          ...folder,
          isOpen: false, // Set to false to close all folders initially
          id: `${parentId ? `${parentId}-` : ""}${index}`,
          contents: folder.contents
            ? addIsOpenProperty(
                folder.contents,
                `${parentId ? `${parentId}-` : ""}${index}`
              )
            : [],
        }));

      const processedData = {
        ...response.data,
        folders: addIsOpenProperty(response.data.folders || []),
      };

      setStructFolder(processedData);
    } catch (err) {
      console.error("Error fetching all folders:", err);
      setError(err.message || "An error occurred");
    }
  };
  const fetchPrivateFolders = async () => {
    try {
      const res = await axios.get(
        `${API_KEY}/foldertemplates/privateDocs/${accountId}`
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
 useEffect(() => {
    if (open) { // Only fetch when the drawer is open
      fetchFolders();
      fetchPrivateFolders();
    }
  }, [open]); 

  useEffect(() => {
    if (selectedFolderId) {
      console.log("The selected folder ID has been updated:", selectedFolderId);
      handleSelectFolderPath(); // Call your function that depends on the updated state
    }
  }, [selectedFolderId]);

  const [selectedType, setSelectedType] = useState(null); // "public" or "private"

  const renderContents = (contents, setContents) => {
    return contents.map((item, index) => {
      if (item.folder) {
        const toggleFolder = () => {
          const updatedContents = contents.map((folder, i) =>
            i === index ? { ...folder, isOpen: !folder.isOpen } : folder
          );
          setContents(updatedContents);
        };

        // const selectFolder = () => setSelectedFolderId(item.id);
        const selectFolder = () => {
          setSelectedFolderId(item.id);
          setSelectedType("public");
        };

        const isSelectedPublic = selectedFolderId === item.id && selectedType === "public";
        return (
          <div key={index} className="ml-5 mb-1">
            <div
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                isSelectedPublic ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
              }`}
              onClick={selectFolder}
            >
              <button type="button" onClick={(e) => { e.stopPropagation(); toggleFolder(); }} className="flex items-center gap-2 w-full text-left">
                {item.isOpen
                  ? <FolderOpen size={15} className="text-amber-400 shrink-0" />
                  : <FolderClosed size={15} className="text-amber-400 shrink-0" />}
                <span className={`text-sm ${ isSelectedPublic ? "font-semibold text-blue-700" : "font-medium text-gray-700" }`}>
                  {item.folder}
                </span>
              </button>
            </div>
            {item.isOpen && item.contents && item.contents.length > 0 && (
              <div className="mt-0.5">
                {renderContents(item.contents, (newContents) => {
                  const updatedFolders = contents.map((folder, i) =>
                    i === index ? { ...folder, contents: newContents } : folder
                  );
                  setContents(updatedFolders);
                })}
              </div>
            )}
          </div>
        );
      } else if (item.file) {
        return (
          <div key={index} className="ml-10 flex items-center gap-2 px-2 py-1 text-sm text-gray-500">
            <FileText size={13} className="text-gray-300 shrink-0" />
            {item.file}
          </div>
        );
      }
      return null;
    });
  };

  const renderPrivateContents = (contents, setContents) => {
    return contents.map((item, index) => {
      if (item.folder) {
        const toggleFolder = () => {
          const updatedContents = contents.map((folder, i) =>
            i === index ? { ...folder, isOpen: !folder.isOpen } : folder
          );
          setContents(updatedContents);
        };

        // const selectFolder = () => setSelectedFolderId(item.id);
        const selectFolder = () => {
          setSelectedFolderId(item.id);
          setSelectedType("private");
        };

        const isSelectedPrivate = selectedFolderId === item.id && selectedType === "private";
        return (
          <div key={index} className="ml-5 mb-1">
            <div
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                isSelectedPrivate ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
              }`}
              onClick={selectFolder}
            >
              <button type="button" onClick={(e) => { e.stopPropagation(); toggleFolder(); }} className="flex items-center gap-2 w-full text-left">
                {item.isOpen
                  ? <FolderOpen size={15} className="text-amber-400 shrink-0" />
                  : <FolderClosed size={15} className="text-amber-400 shrink-0" />}
                <span className={`text-sm ${ isSelectedPrivate ? "font-semibold text-blue-700" : "font-medium text-gray-700" }`}>
                  {item.folder}
                </span>
              </button>
            </div>
            {item.isOpen && item.contents && item.contents.length > 0 && (
              <div className="mt-0.5">
                {renderPrivateContents(item.contents, (newContents) => {
                  const updatedFolders = contents.map((folder, i) =>
                    i === index ? { ...folder, contents: newContents } : folder
                  );
                  setContents(updatedFolders);
                })}
              </div>
            )}
          </div>
        );
      } else if (item.file) {
        return (
          <div key={index} className="ml-10 flex items-center gap-2 px-2 py-1 text-sm text-gray-500">
            <FileText size={13} className="text-gray-300 shrink-0" />
            {item.file}
          </div>
        );
      }
      return null;
    });
  };

  
  const handleSubmitFolder = async () => {
    if (!folderFiles || folderFiles.length === 0 || !destinationPath) {
      alert("Please select a folder and destination path before uploading.");
      return;
    }
  
    const firstFile = folderFiles[0];
    const folderPath = firstFile.webkitRelativePath;
    const folderName = folderPath.split("/")[0]; // Extract folder name
  
    console.log("Uploading folder...");
    console.log("folderFiles:", folderFiles);
    console.log("folderName:", folderName);
    console.log("destinationPath:", destinationPath);
  
    const zip = new JSZip();
    Array.from(folderFiles).forEach((file) => {
      const relativePath = file.webkitRelativePath.replace(`${folderName}/`, ""); // Maintain structure
      zip.file(relativePath, file);
    });
  
    const zipBlob = await zip.generateAsync({ type: "blob" });
  
    const formData = new FormData();
    formData.append("folderZip", zipBlob, `${folderName}.zip`); // Name ZIP after the folder
    formData.append("folderName", folderName);
    formData.append("destinationPath", destinationPath); // Add missing destination path
  
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]); // Log formData entries
    }
  
    try {
      const response = await axios.post(`${API_KEY}/uploadfolderintemplate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert(response.data.message);
      fetchFolders()
      onClose()
      fetchBothFolders()
      console.log("Folder uploaded to:", response.data.path);
      fetchAdminPrivateFolders()
      fetchUnSealedFolders()
    } catch (error) {
      console.error("Error uploading folder:", error);
      alert("Folder upload failed!");
    }
  };
  const handleSelectFolderPath = () => {
    const getFolderPath = (folders, parentPath = "") => {
      for (let folder of folders) {
        const currentPath = `${parentPath}/${folder.folder}`;

        if (folder.id === selectedFolderId) {
          return currentPath;
        }

        if (folder.contents) {
          const nestedPath = getFolderPath(folder.contents, currentPath);
          if (nestedPath) {
            return nestedPath;
          }
        }
      }
      return null;
    };

    if (!selectedFolderId || !selectedType) {
      console.log("No folder selected or type not defined.");
      return;
    }

    // if (selectedType === "public" && structFolder?.folders) {
    //   const selectedPath = getFolderPath(structFolder.folders);
    //   setNewFolderPath(selectedPath);
    //   console.log("Selected public path:", selectedPath);
    // }

    if (selectedType === "public" && structFolder?.folders) {
      let selectedPath = getFolderPath(structFolder.folders);

      // Append /unsealed if the selected folder is "Client Uploaded Documents"
      // if (selectedPath === "/Client Uploaded Documents") {
      //   selectedPath += "/unsealed";
      // }
      // Inject "unsealed" if path starts with "/Client Uploaded Documents"
      if (selectedPath?.startsWith("/Client Uploaded Documents")) {
        selectedPath = selectedPath.replace(
          "/Client Uploaded Documents",
          "/Client Uploaded Documents/unsealed"
        );
      }

      setNewFolderPath(selectedPath);
      console.log("Selected public path:", selectedPath);
    }

    if (selectedType === "private" && privateStructFolder?.folders) {
      const selectedPath = getFolderPath(privateStructFolder.folders);
      setPrivateFolderPath(selectedPath);
      console.log("Selected private path:", selectedPath);
    }
  };

  useEffect(() => {
    if (newFolderPath && selectedType === "public") {
      setDestinationPath(
        `uploads/FolderTemplates/${accountId}${newFolderPath}`
      );
    }
  }, [newFolderPath, selectedType]);

  useEffect(() => {
    if (privateFolderPath && selectedType === "private") {
      setDestinationPath(
        `uploads/FolderTemplates/${accountId}${privateFolderPath}`
      );
    }
  }, [privateFolderPath, selectedType]);

  if (error) {
    return <div className="p-4 text-sm text-red-500">Error: {error}</div>;
  }

  if (!structFolder || !privateStructFolder) {
    return null;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Upload Folder</h2>
            <p className="text-xs text-gray-400 mt-0.5">Select a destination folder to upload into</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MdClose size={16} />
          </button>
        </div>

        {/* Folder tree */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {/* Public section */}
          <div className="mb-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1.5">Client Folders</p>
            {renderContents(structFolder.folders, (newFolders) =>
              setStructFolder({ ...structFolder, folders: newFolders })
            )}
          </div>

          <div className="border-t border-gray-100 pt-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1.5">Private Folders</p>
            {renderPrivateContents(privateStructFolder.folders, (newFolders) =>
              setPrivateStructFolder({ ...privateStructFolder, folders: newFolders })
            )}
          </div>
        </div>

        {/* Selected destination info */}
        {destinationPath && (
          <div className="px-5 py-2 border-t border-gray-100 bg-blue-50">
            <p className="text-[11px] text-blue-600 font-medium truncate">
              Destination: <span className="font-semibold">{destinationPath}</span>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmitFolder}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] transition-colors"
          >
            Upload to Selected Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;

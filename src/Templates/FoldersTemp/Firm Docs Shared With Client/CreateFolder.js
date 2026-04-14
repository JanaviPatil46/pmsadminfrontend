
import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import FileExplorer from "../FileExplorer";
const CreateFolder = ({ open, onClose,accountId,fetchFirmFiles }) => {


  useEffect(() => {
    console.log(accountId);
  }, [accountId]);
  const API_KEY = process.env.REACT_APP_FOLDER_URL;

  const [structFolder, setStructFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderPath, setNewFolderPath] = useState("");

 
  const [destinationPath, setDestinationPath] = useState("");

  const handleCreateFolder = async () => {
    if (!newFolderName || !destinationPath) {
      alert("Please enter a folder name and select a destination.");
      return;
    }
  
    const fullPath = `uploads/FolderTemplates/${accountId}/${destinationPath}`;
    const url = `${API_KEY}/firmClientDocs/createFolderinfirm?path=${encodeURIComponent(fullPath)}&foldername=${encodeURIComponent(newFolderName)}`;
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accountId:accountId,
          permissions: {
            canView: true,
            canDownload: true,
            canDelete: false,
            canUpdate: false
          }
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("✅ Folder created:", data);
        alert("Folder created successfully!");
        setNewFolderName(""); // clear input
        onClose()
        fetchFirmFiles()
        // Optional: refresh folder list
      } else {
        console.error("❌ Failed to create folder:", data);
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("⚠️ Error:", error);
      alert("Something went wrong!");
    }
  };
  const [data, setData] = useState({ folder: "", contents: [] });
  const [selectedPath, setSelectedPath] = useState("");

 
  // const [selectedPath, setSelectedPath] = useState("");

const handlePathSelect = (path) => {
  console.log("Selected path:", path); // for debugging
  setSelectedPath(path);
  setDestinationPath(path); 
};
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[600px] bg-white shadow-xl flex flex-col p-4"
        style={{ fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Create folder</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <MdClose size={18} />
          </button>
        </div>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Folder Name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button type="button"
          onClick={handleCreateFolder}
          disabled={!newFolderName || !destinationPath}
          className="mb-3 px-4 py-1.5 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40">
          Create Folder
        </button>
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 500 }}>
          <FileExplorer onPathSelect={handlePathSelect} accountId={accountId} />
        </div>
      </div>
    </div>
  );
};

export default CreateFolder;

import { FaTimes } from "react-icons/fa";

import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CreateFolder({
  setIsFolderFormOpen,
  isFolderFormOpen,
  templateId,
  // handleFormClose,
  
}) {
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  const [structFolder, setStructFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderPath, setNewFolderPath] = useState("");
  const handleFormClose = () => {
    setIsFolderFormOpen(false);
    fetchFolders()
  };
  useEffect(() => {
    fetchFolders();
  }, []);
  const fetchFolders = async () => {
    try {
      const url = `${API_KEY}/allFolders/${templateId}`;
      const response = await axios.get(url);
      const addIsOpenProperty = (folders, parentId = null) =>
        folders.map((folder, index) => ({
          ...folder,
          isOpen: false, // Initially close all folders
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
  const renderContents = (contents, setContents) => {
    return contents.map((item, index) => {
      if (item.folder) {
        const toggleFolder = () => {
          const updatedContents = contents.map((folder, i) =>
            i === index ? { ...folder, isOpen: !folder.isOpen } : folder
          );
          setContents(updatedContents);
        };
        const selectFolder = () => setSelectedFolderId(item.id);
        return (
          <div key={index} style={{ marginLeft: "20px" }}>
            <div
              style={{ cursor: "pointer", display: "flex", alignItems: "center",
                backgroundColor: selectedFolderId === item.id ? "#e0f7fa" : "transparent" }}
              onClick={selectFolder}
            >
              <div onClick={toggleFolder}>
                {item.isOpen ? "📂" : "📁"}{" "}
                <strong style={{ marginLeft: "5px" }}>{item.folder}</strong>
              </div>
            </div>
            {item.isOpen && item.contents && item.contents.length > 0 && (
              <div>
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
          <div key={index} style={{ marginLeft: "40px" }}>📄 {item.file}</div>
        );
      }
      return null;
    });
  };
  const createFolderAPI = async (newFolderPath) => {
    try {
      const response = await axios.get(
        `${API_KEY}/createFolder/?path=uploads/FolderTemplates/${templateId}/${newFolderPath}&foldername=${newFolderName}`
      );
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.log("API Error:", error);
      throw error;
    }
  };
  // const handleCreateFolder = () => {
  //   if (!newFolderName.trim()) return;

  //   const addFolderToSelected = (folders, parentPath = "") => {
  //     return folders.map((folder) => {
  //       if (folder.id === selectedFolderId) {
  //         const newFolder = {
  //           folder: newFolderName.trim(),
  //           isOpen: false, // New folder initially closed
  //           id: `${folder.id}-${folder.contents.length}`,
  //           contents: [],
  //         };
  //         // Construct the full path to the new folder
  //         const newPath = `${parentPath}/${folder.folder}`;
  //         setNewFolderPath(newPath); // Update state
  //         // Add the new folder to the contents of the parent folder
  //         const updatedFolder = {
  //           ...folder,
  //           contents: [...folder.contents, newFolder],
  //         };
  //         return updatedFolder;
  //       }
  //       return folder.contents
  //         ? {
  //             ...folder,
  //             contents: addFolderToSelected(
  //               folder.contents,
  //               `${parentPath ? `${parentPath}/` : ""}${folder.folder}`
  //             ),
  //           }
  //         : folder;
  //     });
  //   };
  //   const updatedFolderStructure = addFolderToSelected(structFolder.folders);
  //   setStructFolder((prev) => ({
  //     ...prev,
  //     folders: updatedFolderStructure,
  //   }));
  // };

  // useEffect(() => {
  //   if (newFolderPath) {
  //     createFolderAPI(newFolderPath)
  //       .then((data) => {
  //         console.log("Folder created successfully:", data);
  //       })
  //       .catch((error) => {
  //         console.log("Error creating folder:", error);
  //       });
  //   }
  // }, [newFolderPath]);


  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
  
    const addFolderToSelected = (folders, parentPath = "") => {
      return folders.map((folder) => {
        if (folder.id === selectedFolderId) {
          const newFolder = {
            folder: newFolderName.trim(),
            isOpen: false, // New folder initially closed
            id: `${folder.id}-${folder.contents.length}`,
            contents: [],
          };
          // Construct the full path to the new folder
          const newPath = `${parentPath}/${folder.folder}`;
          setNewFolderPath(newPath); // Update state
          // Add the new folder to the contents of the parent folder
          const updatedFolder = {
            ...folder,
            contents: [...folder.contents, newFolder],
          };
          return updatedFolder;
        }
        return folder.contents
          ? {
              ...folder,
              contents: addFolderToSelected(
                folder.contents,
                `${parentPath ? `${parentPath}/` : ""}${folder.folder}`
              ),
            }
          : folder;
      });
    };
    const updatedFolderStructure = addFolderToSelected(structFolder.folders);
    setStructFolder((prev) => ({
      ...prev,
      folders: updatedFolderStructure,
    }));
  };
  
  useEffect(() => {
    if (newFolderPath) {
      createFolderAPI(newFolderPath)
        .then((data) => {
          console.log("Folder created successfully:", data);
          // Clear text field and close the drawer
          setNewFolderName(""); // Clear the text field
          setSelectedFolderId(null); // Clear the selected folder
          setIsFolderFormOpen(false); // Close the drawer
        })
        .catch((error) => {
          console.log("Error creating folder:", error);
        });
    }
  }, [newFolderPath]);
  
  if (error) return <div>Error: {error}</div>;
  if (!structFolder) return <div></div>;
  if (!isFolderFormOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div className="absolute inset-0 bg-black/30" onClick={handleFormClose} />
      <div className="absolute right-0 top-0 h-full w-[600px] bg-white shadow-xl p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Create Folder</h2>
          <button type="button" onClick={handleFormClose} className="text-blue-600 hover:text-blue-800">
            <FaTimes />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Create Folder"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </div>
        <div className="mt-2">
          {renderContents(structFolder.folders, (newFolders) =>
            setStructFolder({ ...structFolder, folders: newFolders })
          )}
        </div>
        <div className="mt-4">
          <button
            type="button"
            disabled={!selectedFolderId}
            onClick={handleCreateFolder}
            className="px-4 py-1.5 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40"
          >
            Create and Save
          </button>
        </div>
      </div>
    </div>
  );
}

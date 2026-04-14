import { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const UploadDocument = ({ open, onClose, file ,onUploadSuccess,onUploadError,accountId,organizer,uploadedFiles,setUploadedFiles}) => {
 
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
 const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const [structFolder, setStructFolder] = useState(null);
  const [privateStructFolder, setPrivateStructFolder] = useState(null);
 
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderPath, setNewFolderPath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");

  
  const fetchFolders = async () => {
  try {
    const url = `${DOCS_MANAGMENTS}/admindocs/clientDocs/${accountId}`;
    const response = await axios.get(url);
    
    const addIsOpenProperty = (folders, parentId = null) =>
      folders.map((folder, index) => ({
        ...folder,
        isOpen: false,
        id: `${parentId ? `${parentId}-` : ""}${index}`,
        sealed: folder.folder === "sealed", // Add sealed property
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
        `${DOCS_MANAGMENTS}/admindocs/privateDocs/${accountId}`
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
    if (open) {
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
    // Skip both "sealed" and "unsealed" folder names
    if (item.folder === "sealed") {
      return null; // Don't render sealed folder or its contents at all
    }

    // Skip rendering the "unsealed" folder name but show its contents
    if (item.folder === "unsealed") {
      return (
        <div key={index}>
          {item.contents && item.contents.length > 0 && (
            <div style={{ marginLeft: "0px" }}> {/* Remove left margin */}
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
    }

    // Normal folder rendering for all other folders
    if (item.folder) {
      const toggleFolder = () => {
        const updatedContents = contents.map((folder, i) =>
          i === index ? { ...folder, isOpen: !folder.isOpen } : folder
        );
        setContents(updatedContents);
      };

      const selectFolder = () => {
        setSelectedFolderId(item.id);
        setSelectedType("public");
      };

      return (
        <div key={index} style={{ marginLeft: "20px", marginBottom: "4px" }}>
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "6px 8px",
              borderRadius: "4px",
              backgroundColor:
                selectedFolderId === item.id && selectedType === "public" 
                  ? "#f0f7ff" 
                  : "transparent",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={selectFolder}
          >
            <div
              onClick={toggleFolder}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span style={{ marginRight: "8px" }}>
                {item.isOpen ? "📂" : "📁"}
              </span>
              <strong
                style={{
                  fontWeight: 500,
                  color: "#333",
                  fontSize: "14px",
                }}
              >
                {item.folder}
              </strong>
            </div>
          </div>
          {item.isOpen && item.contents && item.contents.length > 0 && (
            <div style={{ marginTop: "4px" }}>
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
        <div
          key={index}
          style={{
            marginLeft: "40px",
            padding: "4px 8px",
            fontSize: "14px",
            color: "#555",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "8px" }}>📄</span>
          {item.file}
        </div>
      );
    }
    return null;
  });
};

  
//   const handleSubmitfile = async (e) => {
   
  
//     let data = new FormData();
//     data.append("destinationPath", destinationPath);
//     data.append("file", file);
// //   data.append("accountName", accountName);
// //   data.append("accountEmailSync", accountEmailSync)
//     let config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: `${DOCS_MANAGMENTS}/uploadfiledocument`,
//       data: data,
//     };
  
//     axios
//       .request(config)
//       .then((response) => {
//         console.log(JSON.stringify(response.data));
//         alert("File uploaded successfully!");
//         onClose();
       
//         // fetchBothFolders()
      
//         setSelectedFolderId(null);
//       })
//       .catch((error) => {
//         console.error(error);
//         alert("Failed to upload the file.");
//       });
//   };

const handleSubmitfile = async (e) => {
  try {
    if (!file) {
      throw new Error("No file selected");
    }

    if (!destinationPath) {
      throw new Error("No destination folder selected");
    }

    // 1. First upload the file to the document management system
    let data = new FormData();
    data.append("destinationPath", destinationPath);
    data.append("file", file);
    
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${DOCS_MANAGMENTS}/uploadfiledocument`,
      data: data,
    };

    const uploadResponse = await axios.request(config);
    console.log("File upload response:", uploadResponse.data);
    
    // 2. Get the uploaded file details from the response
    const uploadedFile = uploadResponse.data;
    
    // 3. Update the organizer with the file information
    const organizerUpdateResponse = await updateOrganizerWithFile(uploadedFile.fileName);
    console.log("Organizer update response:", organizerUpdateResponse);
    
    // 4. Update local state
    const key = Object.keys(uploadedFiles).find(
      k => uploadedFiles[k] === file?.name
    );
    
    if (key) {
      setUploadedFiles(prev => ({
        ...prev,
        [key]: uploadedFile.fileName
      }));
    }
    
    // 5. Handle success
    alert("File uploaded and organizer updated successfully!");
    onClose();
    setSelectedFolderId(null);
    
    // 6. Call the success callback if provided
    if (onUploadSuccess) {
      onUploadSuccess(uploadedFile);
    }
    
  } catch (error) {
    console.error("File upload error:", error);
    alert(error.message || "Failed to upload the file or update organizer.");
    
    // Call the error callback if provided
    if (onUploadError) {
      onUploadError(error);
    }
  }
};
const updateOrganizerWithFile = async (fileName) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    // Find which section and element this file belongs to
    const key = Object.keys(uploadedFiles).find(
      k => uploadedFiles[k] === file?.name
    );
    
    if (!key) {
      throw new Error("Could not find the corresponding form element for this file");
    }

    // Split the key to get sectionId and elementText
    const [sectionId, elementText] = key.split('_').slice(1);
    
    // Prepare the update data
    const updateData = {
      sections: organizer.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            formElements: section.formElements.map(element => {
              if (element.text === elementText && element.type === "File Upload") {
                return {
                  ...element,
                  textvalue: fileName,
                  fileMetadata: {
                    fileName: fileName,
                    filePath: destinationPath,
                    uploadedAt: new Date().toISOString()
                  }
                };
              }
              return element;
            })
          };
        }
        return section;
      }),
      lastSaved: new Date().toISOString()
    };

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify(updateData),
      redirect: "follow"
    };

    const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update organizer with file info");
    }

    return result;
  } catch (error) {
    console.error("Error updating organizer:", error);
    throw error;
  }
};
// const updateOrganizerWithFile = async (fileName) => {
//   try {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
    
//     // Find which section and element this file belongs to
//     const key = Object.keys(uploadedFiles).find(
//       k => uploadedFiles[k] === file?.name
//     );
//     console.log("key",key)
//     if (!key) {
//       throw new Error("Could not find the corresponding form element for this file");
//     }

//     // Prepare the update data to include the file in the specific form element
//     const updateData = {
//       sections: organizer.sections.map(section => {
//         // Find the section that contains this file
//         if (key.startsWith(`${section.id}_`)) {
//           return {
//             ...section,
//             formElements: section.formElements.map(element => {
//               // Find the specific form element (File Upload type)
//               if (key.endsWith(`_${element.text}`) && element.type === "File Upload") {
//                 return {
//                   ...element,
//                   textvalue: fileName, // Store the file name in textvalue
//                   fileMetadata: {    // Add file metadata
//                     fileName: fileName,
//                     filePath: destinationPath,
//                     uploadedAt: new Date().toISOString()
//                   }
//                 };
//               }
//               return element;
//             })
//           };
//         }
//         return section;
//       }),
//       lastSaved: new Date().toISOString()
//     };
// console.log("updateData",updateData)
//     const requestOptions = {
//       method: "PATCH",
//       headers: myHeaders,
//       body: JSON.stringify(updateData),
//       redirect: "follow"
//     };

//     const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
//     const response = await fetch(url, requestOptions);
//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || "Failed to update organizer with file info");
//     }

//     return result;
//   } catch (error) {
//     console.error("Error updating organizer:", error);
//     throw error;
//   }
// };




// nbdfgdg



// const updateOrganizerWithFile = async (fileName) => {
//   try {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
    
//     // Prepare the update data
//     const updateData = {
//       fileMetadata: {
//         fileName: fileName,
//         uploadedAt: new Date().toISOString()
//       },
//       lastSaved: new Date().toISOString()
//     };

//     const requestOptions = {
//       method: "PATCH",
//       headers: myHeaders,
//       body: JSON.stringify(updateData),
//       redirect: "follow"
//     };

//     const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
//     const response = await fetch(url, requestOptions);
//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || "Failed to update organizer with file info");
//     }

//     return result;
//   } catch (error) {
//     console.error("Error updating organizer:", error);
//     throw error;
//   }
// };
const handleSelectFolderPath = () => {
  const getFolderPath = (folders, parentPath = "") => {
    for (let folder of folders) {
      // Skip "sealed" folder entirely
      if (folder.folder === "sealed") continue;

      // Skip "unsealed" in path building but include its contents
      const currentPath = folder.folder === "unsealed" 
        ? parentPath 
        : `${parentPath}/${folder.folder}`;

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

  if (selectedType === "public" && structFolder?.folders) {
    let selectedPath = getFolderPath(structFolder.folders);
    
    // Automatically prepend "/unsealed" since we're hiding the folder name
    if (selectedPath?.startsWith("/Client Uploaded Documents")) {
      selectedPath = `/Client Uploaded Documents/unsealed${selectedPath.substring(
        "/Client Uploaded Documents".length
      )}`;
    }
    
    setNewFolderPath(selectedPath);
    console.log("Selected public path:", selectedPath);
  }
};

  useEffect(() => {
    if (newFolderPath && selectedType === "public") {
      setDestinationPath(`uploads/AccountId/${accountId}/${newFolderPath}`);
    }
  }, [newFolderPath, selectedType]);
  
  


  if (error) {
    return <div className="p-4 text-red-600 text-sm">Error: {error}</div>;
  }

  if (!structFolder || !privateStructFolder) {
    return <div />;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1300] overflow-hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[600px] bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h2 className="text-base font-semibold">Select Folder to upload</h2>
          <FaTimes className="cursor-pointer text-gray-500" onClick={onClose} />
        </div>
        <div className="flex-1 overflow-y-auto max-h-[500px] p-2">
          {renderContents(structFolder.folders, (newFolders) =>
            setStructFolder({ ...structFolder, folders: newFolders })
          )}
        </div>
        <div className="flex gap-3 p-4 border-t border-gray-100">
          <button
            type="button"
            disabled={!file}
            onClick={() => { handleSelectFolderPath(); handleSubmitfile(); }}
            className="px-4 py-1.5 text-sm rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            Upload
          </button>
          <button type="button" onClick={onClose}
            className="px-4 py-1.5 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

 export default UploadDocument;


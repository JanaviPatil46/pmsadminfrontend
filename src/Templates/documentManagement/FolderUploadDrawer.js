


import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import JSZip from "jszip";
import axios from "axios";
import { FormDrawer, FormDrawerFooter, FormSection, FormField } from "../../components/ui/form-layout";
import { Button } from "../../components/ui/button";
import { FolderUp, ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from "lucide-react";

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
    <FormDrawer open={isOpen} onClose={onClose} title="Upload Folder" width="md">
      <FormSection title="Folder Selection" icon={<FolderUp className="h-4 w-4" />}>
        <FormField label="Select Folder to Upload">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleClick}>
              <FolderUp className="h-4 w-4 mr-2" />
              Select Folder
            </Button>
            {files.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {files.length} file(s) from <strong>{folderName}</strong>
              </span>
            )}
          </div>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleUploadFolderSelect}
            style={{ display: "none" }}
            webkitdirectory="true"
            directory="true"
            multiple
          />
        </FormField>

        {progress > 0 && progress < 100 && (
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-1">{progress}%</p>
          </div>
        )}

        {message && (
          <div className={`mt-3 rounded-lg border px-4 py-3 text-sm ${
            message.toLowerCase().includes("fail") || message.toLowerCase().includes("error")
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}>
            {message}
          </div>
        )}
      </FormSection>

      <FormSection title="Select Parent Folder">
        <div className="max-h-[40vh] overflow-y-auto rounded-lg border border-border bg-white p-2">
          <FolderTreeSelector
            items={folderTree}
            onSelect={handleFolderSelect}
            selectedFolder={selectedFolder}
          />
        </div>
      </FormSection>

      <FormDrawerFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={handleUpload}>Upload</Button>
      </FormDrawerFooter>
    </FormDrawer>
  );
};

const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (e, path) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div className="space-y-0.5" style={{ paddingLeft: level > 0 ? 16 : 0 }}>
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];

        return (
          <div key={item.path}>
            <div
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors ${
                isSelected
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-accent text-foreground"
              } ${item.meta?.readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (!item.meta?.readOnly) onSelect(item.path);
              }}
            >
              <button
                type="button"
                onClick={(e) => toggleExpand(e, item.path)}
                className="shrink-0 rounded p-0.5 hover:bg-accent"
              >
                {item.children?.length > 0 ? (
                  isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <span className="w-3.5" />
                )}
              </button>
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
              ) : (
                <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span className="truncate">{item.name}</span>
            </div>

            {isExpanded && item.children?.length > 0 && (
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />
            )}

            {isExpanded && item.meta?.files?.length > 0 && (
              <div className="space-y-0.5" style={{ paddingLeft: 32 }}>
                {item.meta.files.map((file) => (
                  <div key={file.name} className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{file.name}{file.readOnly ? " (Read Only)" : ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FolderUploadDrawer;


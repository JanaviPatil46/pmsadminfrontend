import React, { useState, useEffect, useRef } from "react";
import JSZip from "jszip";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "../../../components/ui/button";
import { Folder, FolderOpen, ChevronDown, ChevronRight, X, FolderUp, Upload } from "lucide-react";

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

  const handleUpload = async () => {
    if (!files.length) {
      alert("Please select a folder first!");
      return;
    }
    if (!selectedFolder || selectedFolder.trim() === "") {
      alert("Please select target path first!");
      return;
    }

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
        "https://snptaxes.com/api/accountsdoc/upload-folder",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(res.data.message || "Uploaded successfully!");
      console.log(res.data.message);
      toast.success("Folder uploaded successfully");
      fetchFolderTree();
      onClose();
    } catch (err) {
      console.error(err);
      setMessage("Upload failed!");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      {/* Drawer panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <FolderUp className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-gray-900">Upload Folder</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Folder picker */}
          <div>
            <button
              onClick={handleClick}
              className="flex items-center gap-2.5 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-primary/50 hover:bg-primary/5 transition-colors w-full justify-center"
            >
              <Upload className="h-4 w-4 text-gray-400" />
              {files.length > 0 ? `${files.length} file(s) selected — ${folderName}` : "Select Folder"}
            </button>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleUploadFolderSelect}
              className="hidden"
              webkitdirectory="true"
              directory="true"
              multiple
            />
          </div>

          {/* Selected folder name */}
          {folderName && files.length > 0 && (
            <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
              <p className="text-xs font-medium text-amber-700 mb-0.5">Folder to upload</p>
              <p className="text-sm text-amber-900 font-medium">{folderName}</p>
              <p className="text-xs text-amber-600 mt-0.5">{files.length} file(s)</p>
            </div>
          )}

          {/* Selected destination */}
          {selectedFolder && (
            <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
              <p className="text-xs font-medium text-blue-600 mb-0.5">Uploading to</p>
              <p className="text-sm text-blue-800 break-all">{selectedFolder}</p>
            </div>
          )}

          {/* Message */}
          {message && <p className="text-sm font-medium text-gray-700">{message}</p>}

          {/* Folder tree */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Select Parent Folder</p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-auto max-h-80">
              <FolderTreeSelector
                items={folderTree}
                onSelect={handleFolderSelect}
                selectedFolder={selectedFolder}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-4 flex gap-3">
          <Button onClick={handleUpload} className="flex-1">Upload</Button>
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        </div>
      </div>
    </>
  );
};

const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  console.log("FolderTreeSelector items:", items);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <ul className="py-1">
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isExpanded = expanded[item.path];
        const isSelected = selectedFolder === item.path;
        const hasChildren = item.children?.length > 0;
        const isReadOnly = item.meta?.readOnly;

        return (
          <li key={item.path}>
            <div
              className={`flex items-center gap-2 py-1.5 rounded-md mx-1 mb-0.5 cursor-pointer transition-colors text-sm
                ${isSelected ? "bg-blue-100 text-blue-800 font-medium" : "text-gray-700 hover:bg-gray-100"}
                ${isReadOnly ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
              `}
              style={{ paddingLeft: `${12 + level * 16}px` }}
              onClick={() => !isReadOnly && onSelect(item.path)}
            >
              <button
                className="shrink-0 text-gray-400 hover:text-gray-600"
                onClick={(e) => { e.stopPropagation(); toggleExpand(item.path); }}
              >
                {hasChildren
                  ? isExpanded
                    ? <ChevronDown className="h-3.5 w-3.5" />
                    : <ChevronRight className="h-3.5 w-3.5" />
                  : <span className="w-3.5 inline-block" />}
              </button>
              {isExpanded
                ? <FolderOpen className="h-4 w-4 text-amber-400 shrink-0" />
                : <Folder className="h-4 w-4 text-amber-400 shrink-0" />}
              <span className="truncate">{item.name}</span>
            </div>

            {hasChildren && isExpanded && (
              <FolderTreeSelector
                items={item.children}
                onSelect={onSelect}
                selectedFolder={selectedFolder}
                level={level + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default FolderUploadDrawer;

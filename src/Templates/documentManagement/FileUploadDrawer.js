import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FormDrawer, FormDrawerFooter, FormSection, FormField } from "../../components/ui/form-layout";
import { Button } from "../../components/ui/button";
import { Upload, ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from "lucide-react";

const FileUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
}) => {
  console.log("foldertree", folderTree);
  const [file, setFile] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFile(null);
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024;
    const forbiddenTypes = ["video/", "audio/"];

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        alert(`${file.name} exceeds 50 MB limit.`);
        return false;
      }
      if (forbiddenTypes.some((type) => file.type.startsWith(type))) {
        alert(`${file.name} is an audio or video file — not allowed.`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  const handleFolderSelect = (path) => setSelectedFolder(path);

  const handleUpload = async () => {
    if (files.length === 0 || !selectedFolder) {
      setMessage("Please select files and a folder.");
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await axios.post(
        `https://www.snptaxes.com/api/docManagement/file/upload?folderPath=${encodeURIComponent(
          selectedFolder
        )}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(res.data.message || "Files uploaded successfully");
      toast.success(res.data.message || "Files uploaded successfully");
      setFiles([]);
      onClose();
      await fetchFolderTree();
    } catch (err) {
      console.error(err);
      setMessage("Error uploading files");
    }
  };

  return (
    <FormDrawer open={isOpen} onClose={onClose} title="Upload File" width="md">
      <FormSection title="File Selection" icon={<Upload className="h-4 w-4" />}>
        <FormField label="Choose Files">
          <label className="flex items-center justify-center gap-2 w-full cursor-pointer rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50">
            <Upload className="h-5 w-5" />
            {files.length > 0
              ? `${files.length} file(s) selected`
              : "Click to select files"}
            <input type="file" hidden multiple onChange={handleFileChange} />
          </label>
        </FormField>

        {files.length > 0 && (
          <div className="space-y-1 mt-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-md px-2 py-1">
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{f.name}</span>
                <span className="ml-auto shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
              </div>
            ))}
          </div>
        )}

        {message && (
          <div className={`mt-3 rounded-lg border px-4 py-3 text-sm ${
            message.toLowerCase().includes("error") || message.includes("Please")
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}>
            {message}
          </div>
        )}
      </FormSection>

      <FormSection title="Select Destination Folder">
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
          </div>
        );
      })}
    </div>
  );
};

export default FileUploadDrawer;


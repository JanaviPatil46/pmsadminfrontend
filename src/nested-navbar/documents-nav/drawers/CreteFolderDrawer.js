import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "../../../components/ui/button";
import { Folder, FolderOpen, ChevronDown, ChevronRight, X, FolderPlus } from "lucide-react";

const CreateFolderDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  accountId,
}) => {
  const [folderName, setFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");

  const handleFolderSelect = (path) => setSelectedFolder(path);

  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFolderName("");
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  const handleCreateFolder = async () => {
    if (!folderName) {
      setMessage("⚠️ Folder name is required!");
      return;
    }
    console.log("foldername", folderName);
    console.log("selected path", selectedFolder);
    try {
      const res = await axios.post(
        "https://www.snptaxes.com/api/accountsdoc/folder",
        {
          name: folderName,
          parentPath: selectedFolder || "",
          accountId: accountId,
        }
      );
      console.log("res", res);
      setMessage(`✅ Folder created: ${res.data.metaData.name}`);
      toast.success(`✅ Folder created: ${res.data.metaData.name}`);
      setFolderName("");
      await fetchFolderTree();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err);
      setMessage(`❌ Error creating folder: ${err.response?.data?.error || "Server Error"}`);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 transition-opacity" onClick={onClose} />

      {/* Drawer panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[500px] flex-col bg-white shadow-2xl transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <FolderPlus className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-gray-900">Create New Folder</h2>
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
          {/* Folder name input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Folder Name
            </label>
            <input
              type="text"
              placeholder="Enter new folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
            />
          </div>

          {/* Selected path display */}
          {selectedFolder && (
            <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
              <p className="text-xs font-medium text-blue-600 mb-0.5">Parent folder</p>
              <p className="text-sm text-blue-800 break-all">{selectedFolder}</p>
            </div>
          )}

          {/* Message */}
          {message && (
            <p className="text-sm font-medium text-gray-700">{message}</p>
          )}

          {/* Folder tree */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Select Parent Folder
            </p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-auto max-h-80">
              <FolderTreeSelector
                items={folderTree}
                onSelect={handleFolderSelect}
                selectedFolder={selectedFolder}
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-100 px-5 py-4 flex items-center gap-3">
          <Button onClick={handleCreateFolder} className="flex-1">
            Create Folder
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <ul className="py-1">
      {items?.map((item) => {
        if (item.type !== "folder") return null;

        const isSelected = selectedFolder === item.path;
        const isExpanded = expanded[item.path];
        const hasChildren = item.children?.length > 0;
        const isReadOnly = item.meta?.readOnly;

        return (
          <li key={item.path}>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md mx-1 mb-0.5 cursor-pointer transition-colors text-sm
                ${isSelected ? "bg-blue-100 text-blue-800 font-medium" : "text-gray-700 hover:bg-gray-100"}
                ${isReadOnly ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
              `}
              style={{ paddingLeft: `${12 + level * 16}px` }}
              onClick={() => !isReadOnly && onSelect(item.path)}
            >
              {/* Expand toggle */}
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

              {/* Folder icon */}
              {isExpanded
                ? <FolderOpen className="h-4 w-4 text-amber-400 shrink-0" />
                : <Folder className="h-4 w-4 text-amber-400 shrink-0" />}

              <span className="truncate">{item.name}</span>
            </div>

            {/* Recursive children */}
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

export default CreateFolderDrawer;


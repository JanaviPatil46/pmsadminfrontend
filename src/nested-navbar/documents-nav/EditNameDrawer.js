// components/EditNameDrawer.jsx
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
const EditNameDrawer = ({ open, onClose, item, onRename }) => {
  const [newName, setNewName] = useState("");
  const [ itemPath, setItemPath]= useState("")
console.log("edit item",item?.path)
console.log("filename",item?.file)
useEffect(() => {
    if (item?.file) {
      setNewName(item.file); // Set initial file name from the item prop
    }
    if(item?.folder){
        setNewName(item?.folder)
    }
    if (item?.path){
        setItemPath(item.path)
    }
  }, [item]);

  const handleRename = () => {
    if (!newName.trim()) return;
    onRename(item, newName,itemPath);
    setNewName("");
    setItemPath("")
    onClose();
  
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[320px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Rename {item?.type === "folder" ? "Folder" : "File"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Enter a new name below</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MdClose size={15} />
          </button>
        </div>
        <div className="flex-1 px-5 py-4">
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
            New Name
          </label>
          <input
            type="text"
            placeholder="Enter new name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder:text-gray-400 transition-colors"
          />
        </div>
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
            onClick={handleRename}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNameDrawer;

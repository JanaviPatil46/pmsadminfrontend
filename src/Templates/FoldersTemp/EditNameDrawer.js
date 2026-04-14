// components/EditNameDrawer.jsx
import React, { useState, useEffect } from "react";

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
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[300px] bg-white shadow-xl flex flex-col p-6">
        <h2 className="text-base font-semibold mb-4">
          Rename {item?.type === "folder" ? "Folder" : "File"}
        </h2>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="New Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          type="button"
          className="w-full py-2 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          onClick={handleRename}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditNameDrawer;

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
  MoreVertical,
  RotateCcw,
  Trash2,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";

const Trash = () => {
  const { data } = useParams();
  const FolderTreeView = ({ accountId }) => {
    const [expandedFolders, setExpandedFolders] = useState({});
    const [menuOpenFor, setMenuOpenFor] = useState(null);
    const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
    const [error, setError] = useState(null);
    const [folderTree, setFolderTree] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [itemToDelete, setItemToDelete] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
      fetchFolderTree(accountId);
    }, [accountId]);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          setMenuOpenFor(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchFolderTree = async (accountId) => {
      try {
        const res = await fetch(
          `https://www.snptaxes.com/api/accountsdoc/list-trashed?folderPath=${accountId}`
        );
        const data = await res.json();
        console.log("janavi patil", data);
        if (res.ok) {
          setFolderTree(data.contents.Admin || []);
        } else {
          setError("Failed to fetch folder tree");
        }
      } catch (err) {
        setError("Error fetching folder tree");
      }
    };

    const toggleFolder = (path) => {
      setExpandedFolders((prev) => ({
        ...prev,
        [path]: !prev[path],
      }));
    };

    const handleMenuOpen = (e, folder) => {
      e.stopPropagation();
      setSelectedFolderForMenu(folder);
      setMenuOpenFor(folder.path);
    };

    const handleMenuClose = () => {
      setMenuOpenFor(null);
    };

    const getAllChildrenPaths = (item) => {
      const paths = [item.path];
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          paths.push(...getAllChildrenPaths(child));
        });
      }
      return paths;
    };

    const restoreItem = async (item) => {
      try {
        const res = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/restore",
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetPath: item.path }),
          }
        );
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success("Item restored successfully");
          fetchFolderTree(accountId);
        } else {
          toast.error(data.message || "Restore failed");
        }
      } catch (err) {
        toast.error("Error restoring item");
      }
    };

    const handleDownload = async (item) => {
      try {
        const res = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/download",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paths: item.path }),
          }
        );
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Download failed");
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.name || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download error:", err);
      }
    };

    const deleteItem = async (item) => {
      console.log("Deleting item:", item);
      if (!item?.path) return alert("Invalid path");
      try {
        const response = await fetch(
          "https://www.snptaxes.com/api/accountsdoc/delete",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetPath: item.path }),
          }
        );
        const data = await response.json();
        if (response.ok && data.success) {
          toast.success(data.message);
          setTimeout(() => {
            fetchFolderTree(accountId);
          }, 800);
        } else {
          alert(data.message || "Failed to delete");
          toast.error(data.message);
        }
      } catch (err) {
        console.error("Error deleting item:", err);
        alert("Error deleting file or folder");
        toast.error(err);
      }
      handleMenuClose();
    };

    const getFileIcon = (fileName) => {
      const ext = fileName.split(".").pop().toLowerCase();
      switch (ext) {
        case "pdf":
          return <FaFilePdf color="#d32f2f" size={18} />;
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
          return <FaFileImage color="#1976d2" size={18} />;
        case "doc":
        case "docx":
          return <FaFileWord color="#1565c0" size={18} />;
        case "xls":
        case "xlsx":
          return <FaFileExcel color="#2e7d32" size={18} />;
        case "txt":
        case "md":
          return <FaFileAlt color="#616161" size={18} />;
        default:
          return <AiFillFileUnknown color="#757575" size={18} />;
      }
    };

    const formatUploadedAt = (dateValue) => {
      if (!dateValue) return "";
      if (
        typeof dateValue === "string" &&
        /^[A-Z]{3}-\d{2} \d{4}$/.test(dateValue)
      ) {
        return dateValue;
      }
      const date = new Date(dateValue);
      if (isNaN(date)) return dateValue;
      return date
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toUpperCase()
        .replace(",", "")
        .replace(" ", "-");
    };

    const TrashedInfo = ({ meta }) => {
      if (!meta?.trash?.trashedAt) return null;
      const trashedAt = new Date(meta.trash.trashedAt);
      const now = new Date();
      const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
      const diffTime = trashedAt.getTime() + TWO_HOURS_MS - now.getTime();

      if (diffTime <= 0) {
        return (
          <span className="text-xs font-semibold text-red-600">Deleting soon</span>
        );
      }

      const remainingMinutes = Math.ceil(diffTime / (1000 * 60));
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = remainingMinutes % 60;

      const formattedDate = trashedAt
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toUpperCase()
        .replace(",", "");

      return (
        <span className="text-xs font-semibold text-gray-600">
          {formattedDate} (
          {hours > 0 && `${hours} hr${hours > 1 ? "s" : ""} `}
          {minutes > 0 && `${minutes} min${minutes > 1 ? "s" : ""}`} left)
        </span>
      );
    };

    const findNewSystemTag = (item) => {
      const newTag = item.meta?.tags?.find(
        (tag) => tag.isSystemTag && tag.tagName === "New"
      );
      if (newTag) return newTag;
      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          const childTag = findNewSystemTag(child);
          if (childTag) return childTag;
        }
      }
      return null;
    };

    const renderTrashedRows = (items, level = 0, parentPath = "") => {
      return items.map((item) => {
        const fullPath = item.path;
        const meta = item.meta || {};
        const isFolder = item.type === "folder";
        const showMenu = level === 0 && (item.type === "folder" || item.type === "file");
        const isMenuOpen = menuOpenFor === item.path;

        return (
          <React.Fragment key={fullPath}>
            <tr className={level % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-50"}>
              <td className="px-4 py-2 text-sm" style={{ paddingLeft: `${level * 16 + 16}px` }}>
                <div className="flex items-center gap-1">
                  {isFolder ? (
                    <>
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        onClick={() => toggleFolder(fullPath)}
                      >
                        {expandedFolders[fullPath] ? (
                          <FolderOpenIcon size={18} className="text-yellow-500" />
                        ) : (
                          <FolderClosedIcon size={18} className="text-yellow-500" />
                        )}
                      </button>
                      <span
                        className="font-medium cursor-pointer text-gray-700 hover:text-gray-900"
                        onClick={() => toggleFolder(fullPath)}
                      >
                        {item.name} <span className="text-xs text-gray-400">(Trashed)</span>
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      {getFileIcon(item.name)}
                      <span className="text-gray-600 cursor-not-allowed">
                        {item.name} <span className="text-xs text-gray-400">(Trashed)</span>
                      </span>
                    </div>
                  )}
                </div>
              </td>

              <td className="px-4 py-2 text-sm">
                {level === 0 && <TrashedInfo meta={meta} />}
              </td>

              <td className="px-4 py-2 text-right relative">
                {showMenu && (
                  <div className="inline-block relative" ref={isMenuOpen ? menuRef : null}>
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                      onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                    >
                      <MoreVertical size={16} className="text-gray-500" />
                    </button>
                    {isMenuOpen && (
                      <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                        <button
                          type="button"
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            restoreItem(selectedFolderForMenu);
                            handleMenuClose();
                          }}
                        >
                          <RotateCcw size={14} /> Restore
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => {
                            setItemToDelete(selectedFolderForMenu);
                            setDeleteConfirmText("");
                            setDeleteDialogOpen(true);
                            handleMenuClose();
                          }}
                        >
                          <Trash2 size={14} /> Delete Permanently
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            handleDownload(selectedFolderForMenu);
                            handleMenuClose();
                          }}
                        >
                          <Download size={14} /> Download
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </td>
            </tr>

            {isFolder &&
              expandedFolders[fullPath] &&
              item.children &&
              item.children.length > 0 &&
              renderTrashedRows(item.children, level + 1, fullPath)}
          </React.Fragment>
        );
      });
    };

    return (
      <div className="p-4 md:p-6">
        {/* Page header */}
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-800">Trash</h2>
          <p className="text-xs text-gray-400 mt-0.5">Deleted files and folders</p>
        </div>

        {/* Warning banner */}
        <div className="flex items-start gap-3 mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-amber-500 text-lg leading-none mt-0.5">⚠️</span>
          <p className="text-sm text-amber-800">
            Items in Trash will be <strong>permanently deleted after 60 days</strong>. Restore important files before this period.
          </p>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {folderTree && folderTree.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Time Remaining</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {renderTrashedRows(folderTree)}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Trash2 size={20} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">Trash is empty</p>
              <p className="text-xs text-gray-300">Deleted files and folders will appear here</p>
            </div>
          )}
        </div>

        {/* Delete confirm modal */}
        {deleteDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteDialogOpen(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 size={14} className="text-red-600" />
                </span>
                <h3 className="text-sm font-semibold text-gray-800">Delete Permanently</h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <p className="text-sm text-gray-500 leading-relaxed">
                  This action <strong className="text-gray-800">cannot be undone</strong>. Type{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-red-600">DELETE</code>{" "}
                  to confirm permanent deletion of:
                </p>
                <p className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
                  {itemToDelete?.name}
                </p>
                <div>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Type DELETE to confirm"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
                      deleteConfirmText.length > 0 && deleteConfirmText !== "DELETE"
                        ? "border-red-300 focus:ring-red-200 bg-red-50"
                        : "border-gray-200 focus:ring-blue-200 bg-gray-50"
                    }`}
                  />
                  {deleteConfirmText && deleteConfirmText !== "DELETE" && (
                    <p className="text-xs text-red-500 mt-1.5">You must type DELETE exactly</p>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmText !== "DELETE"}
                  onClick={async () => {
                    await deleteItem(itemToDelete);
                    setDeleteDialogOpen(false);
                    setItemToDelete(null);
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <FolderTreeView accountId={data} />
    </div>
  );
};

export default Trash;

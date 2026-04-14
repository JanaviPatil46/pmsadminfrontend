import React, { useState, useEffect, useContext } from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import { AiFillFileUnknown } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { LoginContext } from "../../../Sidebar/Context/Context";
import { Button } from "../../../components/ui/button";
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  X,
  Upload,
  FileUp,
} from "lucide-react";
const FileUploadDrawer = ({
  isOpen,
  onClose,
  folderTree,
  fetchFolderTree,
  selectedFolderForMenu,
  accountId,
}) => {
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [message, setMessage] = useState("");
  const { logindata } = useContext(LoginContext);
  const [loginUserId, setLoginUserId] = useState();
  // 🔹 Invoice dialogs & selection
  const [invoiceConfirmOpen, setInvoiceConfirmOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  useEffect(() => {
    if (logindata?.user?.id) {
      const id = logindata.user.id;
      setLoginUserId(id);
      fetchUserData(id);
    }
  }, [logindata]);
  const [senderName, setSenderName] = useState("");
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchUserData = async (id) => {
    const myHeaders = new Headers();
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("id", result);
        // setSenderEmail(result.email);
        setSenderName(result.username);
        console.log("senderName", result.username);
      });
  };
  // Reset on drawer open/close
  useEffect(() => {
    if (isOpen && selectedFolderForMenu) {
      setSelectedFolder(selectedFolderForMenu.path);
    } else if (!isOpen) {
      setSelectedFolder("");
      setFiles([]);
      setMessage("");
    }
  }, [isOpen, selectedFolderForMenu]);

  // Fetch invoices for invoice dialog
  const fetchInvoices = async () => {
    try {
      const response = await fetch(
        `https://www.snptaxes.com/workflow/invoices/invoice/pending/invoicelistby/accountid/${accountId}`
      );
      const data = await response.json();
      setInvoiceList(data.invoice || []);
    } catch (err) {
      console.error("Error fetching invoices", err);
    }
  };

  useEffect(() => {
    if (invoiceDialogOpen) fetchInvoices();
  }, [invoiceDialogOpen]);

  // Handle multiple file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024; // 50 MB

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        alert(`❌ ${file.name} exceeds 50 MB.`);
        return false;
      }
      if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        alert(`❌ ${file.name} is audio/video — not allowed.`);
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

    // Check if folder contains "Firm Documents Shared with Client"
    if (selectedFolder.includes("Firm Documents Shared with Client")) {
      try {
        // 🔹 Check pending invoices first
        const res = await fetch(
          `https://www.snptaxes.com/workflow/invoices/invoice/pending/invoicelistby/accountid/${accountId}`
        );
        const data = await res.json();
        const pendingInvoices = data.invoice || [];

        if (pendingInvoices.length === 0) {
          // ❌ No pending invoices → upload directly
          performUpload();
          return;
        }

        // ✅ Pending invoices exist → ask confirmation
        setInvoiceConfirmOpen(true);
      } catch (error) {
        console.error("Error checking pending invoices", error);
        // Fail-safe: upload directly
        performUpload();
      }
    } else {
      // Not a shared folder → upload directly
      performUpload();
    }
  };

  // 🔹 Step 2: Upload files (direct or after invoice selection)
  const performUpload = async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      formData.append("invoices", JSON.stringify(selectedInvoices));
      formData.append("adminUserName", senderName);
      const res = await axios.post(
        `https://www.snptaxes.com/api/accountsdoc/file/upload?folderPath=${encodeURIComponent(
          selectedFolder
        )}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("formData", formData);
      toast.success(res.data.message || "Files uploaded successfully");

      setInvoiceDialogOpen(false);
      setSelectedInvoices([]);
      onClose();
      fetchFolderTree();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error uploading files");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ---- MAIN UPLOAD DRAWER ---- */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <FileUp className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-gray-900">Upload File</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {/* File picker */}
          <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {files.length > 0 ? `${files.length} file(s) selected` : "Click to select files"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Max 50 MB per file. No audio/video.</p>
            </div>
            <input type="file" className="hidden" multiple onChange={handleFileChange} />
          </label>

          {/* Selected files list */}
          {files.length > 0 && (
            <ul className="space-y-1">
              {Array.from(files).map((f, i) => (
                <li key={i} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  <span className="truncate flex-1">{f.name}</span>
                  <span className="text-xs text-gray-400 shrink-0">{Math.round(f.size / 1024)} KB</span>
                </li>
              ))}
            </ul>
          )}

          {/* Selected folder */}
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
            <p className="text-sm font-medium text-gray-700 mb-2">Select Folder</p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-auto max-h-72">
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

      {/* ---- INVOICE LOCK CONFIRMATION MODAL ---- */}
      {invoiceConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setInvoiceConfirmOpen(false)} />
          <div className="relative z-[61] w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Invoice Lock</h3>
            <p className="text-sm text-gray-600 mb-5">Do you want to lock this file to an invoice?</p>
            <div className="flex items-center gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => { setInvoiceConfirmOpen(false); performUpload(); }}
              >
                No
              </Button>
              <Button
                onClick={() => {
                  setInvoiceConfirmOpen(false);
                  if (selectedFolder.includes("Firm Documents Shared with Client")) {
                    setInvoiceDialogOpen(true);
                  } else {
                    performUpload();
                  }
                }}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---- INVOICE SELECTION MODAL ---- */}
      {invoiceDialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setInvoiceDialogOpen(false)} />
          <div className="relative z-[61] w-full max-w-2xl rounded-xl bg-white shadow-2xl flex flex-col max-h-[80vh]">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="text-base font-semibold text-gray-900">Select Invoice(s)</h3>
              <button
                onClick={() => setInvoiceDialogOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-auto px-5 py-4">
              <p className="text-sm text-gray-600 mb-4">Select one or more invoices before uploading.</p>
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Select</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice #</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {invoiceList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-sm text-gray-400">No invoices found.</td>
                      </tr>
                    ) : (
                      invoiceList.map((inv) => {
                        const id = inv._id;
                        const checked = selectedInvoices.includes(id);
                        return (
                          <tr
                            key={id}
                            onClick={() => {
                              setSelectedInvoices((prev) => {
                                const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
                                console.log("Selected invoices:", updated);
                                return updated;
                              });
                            }}
                            className={`cursor-pointer transition-colors hover:bg-gray-50 ${checked ? "bg-blue-50" : ""}`}
                          >
                            <td className="px-3 py-2.5">
                              <input type="checkbox" checked={checked} readOnly className="h-4 w-4 accent-primary cursor-pointer" />
                            </td>
                            <td className="px-3 py-2.5 font-medium text-gray-800">{inv.invoicenumber}</td>
                            <td className="px-3 py-2.5 text-gray-600">{inv.description || "—"}</td>
                            <td className="px-3 py-2.5 text-gray-600">{new Date(inv.createdAt).toLocaleDateString()}</td>
                            <td className="px-3 py-2.5 text-gray-800">₹{inv.summary?.total}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal footer */}
            <div className="border-t border-gray-100 px-5 py-4 flex items-center gap-3 justify-end">
              <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (selectedInvoices.length === 0) {
                    toast.warning("Please select at least one invoice.");
                    return;
                  }
                  performUpload();
                }}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ================= FOLDER TREE ===================
const FolderTreeSelector = ({ items, onSelect, selectedFolder, level = 0 }) => {
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

export default FileUploadDrawer;

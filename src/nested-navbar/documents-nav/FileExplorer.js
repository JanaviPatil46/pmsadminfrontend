import React, { useEffect, useState, useRef } from "react";
import { DocusealBuilder } from "@docuseal/react";
import customCss from "./docuseal-dark-theme.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdClose } from "react-icons/md";
const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
const SIGNATURE_API = process.env.REACT_APP_ESIGNATURE_API;
const Folder = ({
  name,
  content,
  onSelectPath,
  currentPath = "",
  onPermissionUpdate,
  clientEmail,
  approvedFiles,
  setApprovedFiles,accountId
}) => {
  console.log("clientEmail", clientEmail);
  const [isOpen, setIsOpen] = useState(false);
  const isFile = content.filename;
  const fullPath = currentPath ? `${currentPath}/${name}` : name;
  const [token, setToken] = useState("");
  const [showBuilderFor, setShowBuilderFor] = useState(null);
  const [polling, setPolling] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // dialog state
  const [anchorEl, setAnchorEl] = useState(null);
   const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [description, setDescription] = useState("");
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePermissionChange = async (permKey, value) => {
    const updatedPermissions = {
      ...content.permissions,
      [permKey]: value,
    };

    try {
      const response = await fetch(
        `${DOCS_MANAGMENTS}/firmDocs/permissions/${content._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ permissions: updatedPermissions }),
        }
      );

      if (!response.ok) throw new Error("Failed to update permissions");

      // Update local file state
      if (onPermissionUpdate) {
        onPermissionUpdate(content._id, updatedPermissions);
      }
    } catch (err) {
      console.error("Permission update error:", err);
    }
  };

  const handleDeleteFile = async () => {
    handleMenuClose();

    if (!content.permissions?.canDelete) {
      alert("You don't have permission to delete this file.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${content.filename}"?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${DOCS_MANAGMENTS}/firmDocs/delete/${content.accountId}/${content.filename}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete the file.");
      }

      alert("File deleted successfully!");
    } catch (err) {
      console.error("File deletion failed:", err);
      alert("Failed to delete the file.");
    }
  };

  const handleRequestSignature = async () => {
    handleMenuClose();
    try {
      const fileUrl = `https://snptaxes.com/${content.filePath}/${content.filename}`;
      const fileName = content.filename;
      // const accountId = accountId;
      const res = await fetch(
       `${SIGNATURE_API}/api/generate-token?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}&accountId=${accountId}`
        // `${SIGNATURE_API}/api/generate-token?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`
      );
      const data = await res.json();
      setToken(data.token);
      setShowBuilderFor(content._id);
      setOpenDialog(true);
      setPolling(true);

        // ✅ Immediately disable further e-sign requests
    await handlePermissionChange("canEsign", false);
    } catch (err) {
      console.error("Failed to request signature:", err);
    }
  };
// 🔹 Open dialog instead of directly sending request
  const handleOpenDialog = () => {
    handleMenuClose();
    setOpenApprovalDialog(true);
  };

  // 🔹 Close dialog
  const handleCloseDialog = () => {
    setOpenApprovalDialog(false);
    setDescription("");
  };
  const handleRequestApproval = async () => {
    // handleMenuClose();

    try {
      // Build file URL
      const fileUrl = `${DOCS_MANAGMENTS}/${content.filePath}/${content.filename}`;

      // Prepare payload for backend
      const payload = {
        accountId: content.accountId,
        filename: content.filename,
        fileUrl: fileUrl,
        clientEmail: clientEmail, // assuming this comes from backend data
        description:description
      };
      console.log("payload", payload);
      const res = await fetch(`${DOCS_MANAGMENTS}/approvals/request-approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to send approval request.");

      alert(`Approval request sent to ${payload.clientEmail}`);
      // ✅ Mark file as approved
      setApprovedFiles((prev) => new Set(prev).add(content._id));
      setOpenApprovalDialog(false)
        // ✅ Immediately disable further e-sign requests
    await handlePermissionChange("canApprove", false);
    } catch (err) {
      console.error("Approval request failed:", err);
      alert("Failed to send approval request.");
    }
  };

  const [submissions, setSubmissions] = useState([]);
  // Poll submissions
  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      const res = await fetch(`${SIGNATURE_API}/api/submissions`);
      const data = await res.json();

      if (data.submissions && data.submissions.length > 0) {
        const latest = data.submissions[0];

        // Check by external_id or created_at if needed
        if (!submissions.find((s) => s.id === latest.id)) {
          console.log("✅ New Submission Detected:", latest);
          console.log(latest.submitters[0].slug);
          setSubmissions((prev) => [latest, ...prev]);
          setPolling(false); // Stop polling after getting one
        }
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [polling, submissions]);
  if (isFile) {
    const { permissions = {} } = content;

    

    return (
      <div className="pl-5 mb-2.5 flex justify-between items-start w-full">
        {/* Left: filename + permissions */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-sm text-gray-700">
            📄 <span className="font-medium">{content.filename}</span>
          </div>
          <div className="flex items-center gap-3">
            {["canView", "canDownload", "canUpdate", "canDelete"].map((perm) => (
              <label key={perm} className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions[perm]}
                  onChange={(e) => handlePermissionChange(perm, e.target.checked)}
                  className="rounded border-gray-300"
                />
                {perm.replace("can", "")}
              </label>
            ))}
          </div>
        </div>

        {/* Right: three-dot menu */}
        <div className="relative">
          <button
            type="button"
            onClick={handleMenuOpen}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <BsThreeDotsVertical size={14} />
          </button>

          {Boolean(anchorEl) && (
            <>
              <div className="fixed inset-0 z-30" onClick={handleMenuClose} />
              <div className="absolute right-0 top-8 z-40 bg-white border border-gray-200 rounded-xl shadow-xl w-52 py-1 overflow-hidden">
                {content.filename.toLowerCase().endsWith(".pdf") && (
                  <button
                    type="button"
                    disabled={!permissions.canEsign}
                    onClick={handleRequestSignature}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Request Signature
                  </button>
                )}
                {content.filename.toLowerCase().endsWith(".pdf") && (
                  <button
                    type="button"
                    disabled={!permissions.canApprove}
                    onClick={handleOpenDialog}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Approval
                  </button>
                )}
                <button
                  type="button"
                  disabled={!permissions.canUpdate}
                  onClick={handleMenuClose}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Rename
                </button>
                <button
                  type="button"
                  disabled={!permissions.canDownload}
                  onClick={handleMenuClose}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Download
                </button>
                <button
                  type="button"
                  disabled={!permissions.canDelete}
                  onClick={handleDeleteFile}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>

        {/* Approval Dialog */}
        {openApprovalDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={handleCloseDialog} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-800">Request Approval</h2>
                <button type="button" onClick={handleCloseDialog} className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <MdClose size={15} />
                </button>
              </div>
              <div className="px-5 py-4">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Description / Note</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type a short description or note for this approval..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-gray-400 resize-none transition-colors"
                />
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
                <button type="button" onClick={handleCloseDialog} className="rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="button" onClick={handleRequestApproval} disabled={!description.trim()} className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] disabled:opacity-50 transition-colors">Send</button>
              </div>
            </div>
          </div>
        )}

        {/* DocuSeal Signature Dialog */}
        {openDialog && showBuilderFor === content._id && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpenDialog(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                <h2 className="text-sm font-semibold text-gray-800">{content.filename}</h2>
                <button type="button" onClick={() => setOpenDialog(false)} className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <MdClose size={15} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {token && (
                  <div className="app">
                    <DocusealBuilder token={token} customCss={customCss} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (onSelectPath) onSelectPath(fullPath);
  };

  return (
    <div className="pl-5">
      <div onClick={handleClick} className="flex items-center gap-1.5 cursor-pointer text-sm font-medium text-gray-700 py-1 hover:text-gray-900">
        {isOpen ? "📂" : "📁"} <span>{name}</span>
      </div>
      {isOpen &&
        Object.entries(content).map(([childName, childContent]) => (
          <Folder
            key={childName}
            name={childName}
            content={childContent}
            onSelectPath={onSelectPath}
            currentPath={fullPath}
            onPermissionUpdate={onPermissionUpdate}
            clientEmail={clientEmail}
            approvedFiles={approvedFiles}
            setApprovedFiles={setApprovedFiles}
            accountId={accountId}
          />
        ))}
    </div>
  );
};

const buildFileTree = (files, folderStart) => {
  const root = {};

  // Ensure the base folder exists
  const parts = folderStart.split("/");
  let current = root;
  parts.forEach((part) => {
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  });

  files.forEach((file) => {
    let path = file.filePath.replace(/\\/g, "/");
    const index = path.toLowerCase().indexOf(folderStart.toLowerCase());
    if (index === -1) return;

    path = path.slice(index);
    const fileParts = path.split("/");
    current = root;

    fileParts.forEach((part) => {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    });

    if (file.filename !== "#$default.txt") {
      current[file.filename] = file;
    }
  });

  return root;
};

const FileExplorer = ({ onPathSelect, accountId }) => {
  const [files, setFiles] = useState([]);
  const folderName = "Firm Docs Shared With Client";

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${DOCS_MANAGMENTS}/firmDocs/files/${accountId}`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  const updateFilePermissionsLocally = (fileId, updatedPermissions) => {
    setFiles((prev) =>
      prev.map((file) =>
        file._id === fileId
          ? { ...file, permissions: updatedPermissions }
          : file
      )
    );
  };
  const [clientEmail, setClientEmail] = useState(""); // store client email
  const [approvedFiles, setApprovedFiles] = useState(new Set());
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const fetchAccountDetails = async () => {
    try {
      const res = await fetch(
        `${ACCOUNT_API}/accounts/accountdetails/${accountId}`
      );
      const data = await res.json();
      setClientEmail(data.account.contacts[0].email);
      console.log(data.account.contacts[0].email); // adjust key if it's different
    } catch (err) {
      console.error("Failed to fetch account details", err);
    }
  };
  useEffect(() => {
    if (accountId) {
      fetchFiles();
      fetchAccountDetails();
    }
  }, [accountId]);

  const fileTree = buildFileTree(files, folderName);

  return (
    <div className="text-sm">
      {Object.entries(fileTree).map(([name, content]) => (
        <Folder
          key={name}
          name={name}
          content={content}
          //  content={{ ...content, clientEmail }}
          onSelectPath={onPathSelect}
          currentPath=""
          onPermissionUpdate={updateFilePermissionsLocally}
          clientEmail={clientEmail}
          approvedFiles={approvedFiles}
          setApprovedFiles={setApprovedFiles}
          accountId={accountId}
        />
      ))}
    </div>
  );
};

export default FileExplorer;

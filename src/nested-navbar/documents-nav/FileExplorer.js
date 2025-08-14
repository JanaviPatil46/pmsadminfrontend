import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem } from "@mui/material";
import { DocusealBuilder } from "@docuseal/react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import customCss from "./docuseal-dark-theme.css";
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

  const handleRequestApproval = async () => {
    handleMenuClose();

    try {
      // Build file URL
      const fileUrl = `${DOCS_MANAGMENTS}/${content.filePath}/${content.filename}`;

      // Prepare payload for backend
      const payload = {
        accountId: content.accountId,
        filename: content.filename,
        fileUrl: fileUrl,
        clientEmail: clientEmail, // assuming this comes from backend data
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
        // ✅ Immediately disable further e-sign requests
    await handlePermissionChange("canEsign", false);
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
      <div
        style={{
          paddingLeft: 20,
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Left side: filename + permissions */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            📄 <span>{content.filename}</span>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: 5 }}>
            {["canView", "canDownload", "canUpdate", "canDelete"].map(
              (perm) => (
                <label key={perm} style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={permissions[perm]}
                    onChange={(e) =>
                      handlePermissionChange(perm, e.target.checked)
                    }
                  />
                  {perm.replace("can", "")}
                </label>
              )
            )}
          </div>
        </div>

        {/* Right side: three-dot icon */}
        <div>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        
          <Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
>
  {content.filename.toLowerCase().endsWith(".pdf") && (
    <MenuItem
      onClick={handleRequestSignature}
      disabled={!permissions.canEsign} // depends on canEsign
    >
      Request Signature
    </MenuItem>
  )}

  {content.filename.toLowerCase().endsWith(".pdf") && (
    <MenuItem
      onClick={handleRequestApproval}
      disabled={!permissions.canApprove} // depends on canApprove
    >
      Approval
    </MenuItem>
  )}

  <MenuItem
    onClick={handleMenuClose}
    disabled={!permissions.canUpdate} // depends on canUpdate
  >
    Rename
  </MenuItem>

  <MenuItem
    onClick={handleMenuClose}
    disabled={!permissions.canDownload} // depends on canDownload
  >
    Download
  </MenuItem>

  <MenuItem
    onClick={handleDeleteFile}
    disabled={!permissions.canDelete} // depends on canDelete
  >
    Delete
  </MenuItem>
</Menu>

        </div>

        {/* Dialog remains unchanged */}
        <Dialog
          open={openDialog && showBuilderFor === content._id}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>
            {content.filename}
            <IconButton
              aria-label="close"
              onClick={() => setOpenDialog(false)}
              style={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {token && (
              <div className="app">
                <DocusealBuilder token={token} customCss={customCss} />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (onSelectPath) onSelectPath(fullPath);
  };

  return (
    <div style={{ paddingLeft: 20 }}>
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
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
    <div>
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

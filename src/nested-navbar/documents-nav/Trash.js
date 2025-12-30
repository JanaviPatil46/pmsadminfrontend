import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Table,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import { useParams } from "react-router-dom";
import {
  Folder as FolderClosedIcon,
  FolderOpen as FolderOpenIcon,
} from "lucide-react";

import DownloadIcon from "@mui/icons-material/Download";
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
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedFolderForMenu, setSelectedFolderForMenu] = useState(null);
    const [error, setError] = useState(null);
    const [folderTree, setFolderTree] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
      fetchFolderTree(accountId);
    }, [accountId]);

    // API call to fetch folder tree for a given template ID
    const fetchFolderTree = async (accountId) => {
      try {
        const res = await fetch(
          `https://www.snptaxes.com/api/accountsdoc/list-trashed?folderPath=${accountId}`
        );
        const data = await res.json();
        console.log("janavi patil", data);
        if (res.ok) {
          setFolderTree(data.contents);
        } else {
          setError("Failed to fetch folder tree");
        }
      } catch (err) {
        setError("Error fetching folder tree");
      }
    };
    const toggleFolder = (path, isReadOnly) => {
      // if (isReadOnly) return;
      setExpandedFolders((prev) => ({
        ...prev,
        [path]: !prev[path],
      }));
    };

    const handleMenuOpen = (event, folder) => {
      event.stopPropagation();
      setMenuAnchorEl(event.currentTarget);
      setSelectedFolderForMenu(folder);
    };

    const handleMenuClose = () => {
      setMenuAnchorEl(null);
    };

    // Update getAllChildrenPaths to work with item.path
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
            body: JSON.stringify({
              paths: item.path, // backend already supports string or array
            }),
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
    // 🗑️ Delete File or Folder (Universal)
    const deleteItem = async (item) => {
      console.log("Deleting item:", item);
      if (!item?.path) return alert("Invalid path");
      // console.log("delete path", item.path);
      // console.log("delete item", item);
      // const confirmDelete = window.confirm(
      //   `Are you sure you want to delete "${item.name}"? This cannot be undone!`
      // );
      // if (!confirmDelete) return;

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
          // alert(data.message);
          toast.success(data.message);
          setTimeout(() => {
            fetchFolderTree(accountId);
          }, 800);
          //  fetchFolderTree(accountId);
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

      // If already in "DEC-19 2025" format
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
        .replace(",", "") // remove comma
        .replace(" ", "-"); // replace first space with dash
    };
  
// const TrashedInfo = ({ meta }) => {
//   if (!meta?.trash?.trashedAt) return null;

//   const trashedAt = new Date(meta.trash.trashedAt);
//   const now = new Date();

//   // Calculate remaining time until 60 days
//   const diffTime = trashedAt.getTime() + 60 * 24 * 60 * 60 * 1000 - now.getTime(); // 60 days in ms
//   const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//   // Format trashed date
//   const formattedDate = trashedAt
//     .toLocaleDateString("en-US", {
//       month: "short",
//       day: "2-digit",
//       year: "numeric",
//     })
//     .toUpperCase()
//     .replace(",", ""); // e.g., DEC-29 2025

//   return (
//     <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//       {formattedDate} ({remainingDays > 0 ? `${remainingDays} day${remainingDays > 1 ? "s" : ""} left` : "Deleting soon"})
//     </Typography>
//   );
// };

const TrashedInfo = ({ meta }) => {
  if (!meta?.trash?.trashedAt) return null;

  const trashedAt = new Date(meta.trash.trashedAt);
  const now = new Date();

  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

  // Remaining time
  const diffTime = trashedAt.getTime() + TWO_HOURS_MS - now.getTime();

  if (diffTime <= 0) {
    return (
      <Typography variant="caption" sx={{ fontWeight: "bold", color: "error.main" }}>
        Deleting soon
      </Typography>
    );
  }

  const remainingMinutes = Math.ceil(diffTime / (1000 * 60));
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  // Format trashed date
  const formattedDate = trashedAt
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase()
    .replace(",", "");

  return (
    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
      {formattedDate} (
      {hours > 0 && `${hours} hr${hours > 1 ? "s" : ""} `}
      {minutes > 0 && `${minutes} min${minutes > 1 ? "s" : ""}`} left)
    </Typography>
  );
};

    const findNewSystemTag = (item) => {
      // console.log("Finding 'New' tag in item:", item);
      // Check current item
      const newTag = item.meta?.tags?.find(
        (tag) => tag.isSystemTag && tag.tagName === "New"
      );

      if (newTag) return newTag;

      // Check children recursively
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

        const showMenu =
          level === 0 && (item.type === "folder" || item.type === "file");

        const getAllChildrenPaths = (item) => {
          const paths = [item.path];
          if (item.children && item.children.length > 0) {
            item.children.forEach((child) => {
              paths.push(...getAllChildrenPaths(child));
            });
          }
          return paths;
        };

        return (
          <React.Fragment key={fullPath}>
            <TableRow
              sx={{
                backgroundColor: level % 2 === 0 ? "#fafafa" : "white",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <TableCell sx={{ paddingLeft: level * 4 + 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {isFolder ? (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => toggleFolder(fullPath)}
                        sx={{ mr: 0.5 }}
                      >
                        {expandedFolders[fullPath] ? (
                          <FolderOpenIcon />
                        ) : (
                          <FolderClosedIcon />
                        )}
                      </IconButton>
                      <Typography
                        variant="body2"
                        sx={{
                          ml: 0.5,
                          fontWeight: "medium",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleFolder(fullPath)}
                      >
                        {item.name} (Trashed)
                      </Typography>
                    </>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ mr: 1 }}>{getFileIcon(item.name)}</Box>
                      <Typography
                        variant="body2"
                        sx={{ cursor: "not-allowed" }}
                      >
                        {item.name} (Trashed)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </TableCell>

              <TableCell>
                {level === 0 && <TrashedInfo meta={meta} />}
              </TableCell>

              <TableCell align="right">
                {showMenu && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, { ...item, fullPath })}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>

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
      <Box sx={{ margin: "auto", p: 3 }}>
        <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            📜 Folder Explorer
          </Typography>
<Box
  sx={{
    mb: 2,
    p: 1.5,
    borderRadius: 1,
    backgroundColor: "#fff8e1",
    border: "1px solid #ffe082",
  }}
>
  <Typography variant="body2" sx={{ fontWeight: 500 }}>
    ⚠️ Items in Trash will be <strong>permanently deleted after 60 days</strong>.
    <br />
    Please restore important files or folders before this period.
  </Typography>
</Box>
          {folderTree && folderTree.length > 0 ? (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>

                      <TableCell>Trashed</TableCell>

                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderTrashedRows(folderTree)}</TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography sx={{ p: 2, textAlign: "center" }}>
              🗑️ Trash is empty.
            </Typography>
          )}
        </Paper>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          {selectedFolderForMenu && (
            <>
              <MenuItem
                onClick={() => {
                  restoreItem(selectedFolderForMenu);
                  handleMenuClose();
                }}
              >
                <RestoreIcon sx={{ mr: 1 }} />
                Restore
              </MenuItem>

              {/* <MenuItem
                onClick={() => {
                  deleteItem(selectedFolderForMenu);
                  handleMenuClose();
                }}
                sx={{ color: "error.main" }}
              > */}
              <MenuItem
                onClick={() => {
                  setItemToDelete(selectedFolderForMenu);
                  setDeleteConfirmText("");
                  setDeleteDialogOpen(true);
                  handleMenuClose();
                }}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon sx={{ mr: 1 }} />
                Delete Permanently
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleDownload(selectedFolderForMenu);
                  handleMenuClose();
                }}
              >
                <DownloadIcon sx={{ mr: 1 }} />
                Download
              </MenuItem>
            </>
          )}
        </Menu>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ color: "error.main" }}>
            Delete Permanently
          </DialogTitle>

          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              This action <strong>cannot be undone</strong>.
              <br />
              Type <strong>DELETE</strong> to confirm permanent deletion of:
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {itemToDelete?.name}
            </Typography>

            <TextField
              autoFocus
              fullWidth
              placeholder="Type DELETE"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              error={
                deleteConfirmText.length > 0 && deleteConfirmText !== "DELETE"
              }
              helperText={
                deleteConfirmText && deleteConfirmText !== "DELETE"
                  ? "You must type DELETE exactly"
                  : " "
              }
            />
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              disabled={deleteConfirmText !== "DELETE"}
              onClick={async () => {
                await deleteItem(itemToDelete);
                setDeleteDialogOpen(false);
                setItemToDelete(null);
              }}
            >
              Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  return (
    <Box>
      <FolderTreeView accountId={data} />
    </Box>
  );
};

export default Trash;

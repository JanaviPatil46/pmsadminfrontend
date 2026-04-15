// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Button } from "@mui/material";
// // import { useNavigate } from "react-router-dom";

// // const FolderTemplateList = () => {
// //   const [templates, setTemplates] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchTemplates = async () => {
// //       setLoading(true);
// //       setError("");

// //       try {
// //         const response = await axios.get(
// //           "https://www.snptaxes.com/api/foldertemp/templatelist"
// //         );
// //         setTemplates(response.data.folderTemplates); // assuming response.data is an array
// //         console.log("Templates:", response.data);
// //       } catch (err) {
// //         console.error("Error fetching templates:", err);
// //         setError("Failed to fetch templates");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchTemplates();
// //   }, []);
// //   const handleCreateTemplate = () => {
// //     navigate("/firmtemp/templates/createfolder");
// //   };
// //   return (
// //     <div>
// //       <Button variant="contained" onClick={handleCreateTemplate}>
// //         Create Template
// //       </Button>
// //       {loading && <p>Loading templates...</p>}
// //       {error && <p style={{ color: "red" }}>{error}</p>}
// //       {!loading && !error && (
// //         <ul>
// //           {templates.map((template, index) => (
// //             <li key={index}>
// //               <Button
// //                 onClick={() =>
// //                   navigate(
// //                     `/firmtemp/templates/tree/${encodeURIComponent(template._id)}`, // 👈 pass ID in URL
// //                     {
// //                       state: {
// //                         templateId: template._id, // 👈 send ID
// //                         templateName: template.templatename, // 👈 send name
// //                       },
// //                     }
// //                   )
// //                 }
// //               >
// //                 {template.templatename || "Unnamed Template"}
// //               </Button>
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // };

// // export default FolderTemplateList;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Button,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   IconButton,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogActions,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import EditIcon from "@mui/icons-material/Edit";
// import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useNavigate } from "react-router-dom";

// const FolderTemplateList = () => {
//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [confirmDelete, setConfirmDelete] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplates();
//   }, []);

//   const fetchTemplates = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.get(
//         "https://www.snptaxes.com/api/foldertemp/templatelist"
//       );
//       setTemplates(response.data.folderTemplates || []);
//     } catch (err) {
//       console.error("Error fetching templates:", err);
//       setError("Failed to fetch templates");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateTemplate = () => {
//     navigate("/firmtemp/templates/createfolder");
//   };

//   // =============== Menu Handlers ===============
//   const handleMenuOpen = (event, template) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedTemplate(template);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedTemplate(null);
//   };

//   const handleEdit = () => {
//     navigate(`/firmtemp/templates/tree/${encodeURIComponent(selectedTemplate._id)}`, {
//       state: {
//         templateId: selectedTemplate._id,
//         templateName: selectedTemplate.templatename,
//       },
//     });
//     handleMenuClose();
//   };

//   const handleRename = () => {
//     alert(`Rename feature coming soon for: ${selectedTemplate.templatename}`);
//     handleMenuClose();
//   };

//   const handleDeleteClick = () => {
//     setConfirmDelete(true);
//     handleMenuClose();
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       await axios.delete(
//         `https://www.snptaxes.com/api/foldertemp/delete/${selectedTemplate._id}`
//       );
//       setTemplates((prev) =>
//         prev.filter((t) => t._id !== selectedTemplate._id)
//       );
//     } catch (err) {
//       console.error("Delete error:", err);
//       alert("Failed to delete template");
//     } finally {
//       setConfirmDelete(false);
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 3,
//         }}
//       >
//         <Typography variant="h5" fontWeight="bold">
//           Folder Templates
//         </Typography>
//         <Button variant="contained" onClick={handleCreateTemplate}>
//           Create Template
//         </Button>
//       </Box>

//       {loading ? (
//         <Box sx={{ textAlign: "center", mt: 5 }}>
//           <CircularProgress />
//           <Typography sx={{ mt: 2 }}>Loading templates...</Typography>
//         </Box>
//       ) : error ? (
//         <Typography color="error">{error}</Typography>
//       ) : (
//         <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            
//                 <TableCell><strong>Template Name</strong></TableCell>
               
//                 <TableCell align="right"><strong>Action</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {templates.length > 0 ? (
//                 templates.map((template, index) => (
//                   <TableRow key={template._id}>
                   
//                     <TableCell>{template.templatename || "Unnamed Template"}</TableCell>
                   
//                     <TableCell align="right">
//                       <IconButton onClick={(e) => handleMenuOpen(e, template)}>
//                         <MoreVertIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={4} align="center">
//                     No templates found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* ===== Menu ===== */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleEdit}>
//           <EditIcon fontSize="small" sx={{ mr: 1 }} />
//           Edit
//         </MenuItem>
//         <MenuItem onClick={handleRename}>
//           <DriveFileRenameOutlineIcon fontSize="small" sx={{ mr: 1 }} />
//           Rename
//         </MenuItem>
//         <MenuItem onClick={handleDeleteClick} sx={{ color: "red" }}>
//           <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
//           Delete
//         </MenuItem>
//       </Menu>

//       {/* ===== Delete Confirmation Dialog ===== */}
//       <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
//         <DialogTitle>
//           Are you sure you want to delete “{selectedTemplate?.templatename}”?
//         </DialogTitle>
//         <DialogActions>
//           <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
//           <Button color="error" onClick={handleConfirmDelete}>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default FolderTemplateList;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { MoreVertical, Pencil, PenLine, Trash2, FolderOpen, Plus } from "lucide-react";

const FolderTemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const menuRef = useRef(null);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          "https://www.snptaxes.com/api/foldertemp/templatelist"
        );
        setTemplates(response.data.folderTemplates || []);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError("Failed to fetch templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateTemplate = () => {
    navigate("/firmtemp/templates/createfolder");
  };

  const handleMenuClick = (e, template) => {
    e.stopPropagation();
    setSelectedTemplate(template);
    setMenuOpen(menuOpen === template._id ? null : template._id);
  };

  const handleMenuClose = () => {
    setMenuOpen(null);
  };

  const handleRenameOpen = () => {
    if (!selectedTemplate) return;
    setRenameValue(selectedTemplate.templatename || "");
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleRenameSubmit = async () => {
    if (!selectedTemplate || !selectedTemplate._id) {
      console.error("No template selected for rename");
      return;
    }

    try {
      const response = await axios.patch(
        `https://www.snptaxes.com/api/foldertemp/rename/${selectedTemplate._id}`,
        { newName: renameValue }
      );
      console.log("Rename response:", response.data);

      toast.success("Template Renamed successfully");
      setTemplates((prev) =>
        prev.map((t) =>
          t._id === selectedTemplate._id
            ? { ...t, templatename: renameValue }
            : t
        )
      );

      setRenameDialogOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error renaming template:", error);
      alert("Failed to rename template");
    }
  };

  const handleDeleteOpen = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTemplate || !selectedTemplate._id) return;

    try {
      await axios.delete(
        `https://www.snptaxes.com/api/foldertemp/delete/${selectedTemplate._id}`
      );

      toast.success("Template Deleted successfully");
      setTemplates((prev) =>
        prev.filter((t) => t._id !== selectedTemplate._id)
      );

      setDeleteDialogOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
    }
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        {/* <h2 className="text-lg font-semibold text-foreground">Folder Templates</h2> */}
        <Button onClick={handleCreateTemplate}>
        <Plus className="h-4 w-4" />
        Create New Folder
      </Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading templates...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && templates.length > 0 && (
        <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Template Name</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/firmtemp/templates/tree/${encodeURIComponent(template._id)}`,
                          {
                            state: {
                              templateId: template._id,
                              templateName: template.templatename,
                            },
                          }
                        )
                      }
                    >
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                      {template.templatename || "Unnamed Template"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      className="rounded-md p-1.5 hover:bg-accent transition-colors"
                      onClick={(e) => handleMenuClick(e, template)}
                    >
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {menuOpen === template._id && (
                      <div
                        ref={menuRef}
                        className="absolute right-4 top-10 z-50 w-40 rounded-lg border border-border bg-white shadow-lg py-1 animate-in fade-in-0 zoom-in-95"
                      >
                        <button
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
          onClick={() => {
            navigate(
                              `/firmtemp/templates/tree/${encodeURIComponent(selectedTemplate?._id)}`,
              {
                state: {
                  templateId: selectedTemplate?._id,
                  templateName: selectedTemplate?.templatename,
                },
              }
            );
            handleMenuClose();
          }}
        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={handleRenameOpen}
                        >
                          <PenLine className="h-3.5 w-3.5" /> Rename
                        </button>
                        <button
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={handleDeleteOpen}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rename Dialog */}
      {renameDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Rename Template</h3>
            <Input
            autoFocus
              placeholder="New Template Name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
          />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleRenameSubmit}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Delete Template</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{selectedTemplate?.templatename}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderTemplateList;

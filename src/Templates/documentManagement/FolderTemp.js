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

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FolderTemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const navigate = useNavigate();

  // 🔹 Fetch templates on mount
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

  // 🔹 Create Template
  const handleCreateTemplate = () => {
    navigate("/firmtemp/templates/createfolder");
  };

  // 🔹 Menu Handling
  const handleMenuClick = (event, template) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplate(template);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 🔹 Rename Template
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


      toast.success("Template Renamed successfully")
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

  // 🔹 Delete Template
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


      toast.success("Template Deteleted successfully")
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
    <div style={{ padding: "20px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateTemplate}
        sx={{ mb: 2 }}
      >
        Create Template
      </Button>

      {loading && <p>Loading templates...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && templates.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><strong>Template Name</strong></TableCell>
              
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template._id}>
                  <TableCell>
                    <Typography
                      onClick={() =>
                        navigate(
                          `/firmtemp/templates/tree/${encodeURIComponent(
                            template._id
                          )}`,
                          {
                            state: {
                              templateId: template._id,
                              templateName: template.templatename,
                            },
                          }
                        )
                      }
                      sx={{cursor:'pointer'}}
                    >
                      {template.templatename || "Unnamed Template"}
                    </Typography>
                  </TableCell>
                 
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuClick(e, template)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 🔹 Three-dot Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate(
              `/firmtemp/templates/tree/${encodeURIComponent(
                selectedTemplate?._id
              )}`,
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
          Edit
        </MenuItem>
        <MenuItem onClick={handleRenameOpen}>Rename</MenuItem>
        <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
      </Menu>

      {/* 🔹 Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle>Rename Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Template Name"
            fullWidth
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{selectedTemplate?.templatename}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FolderTemplateList;

// import React, { useState, useEffect } from "react";
// import { Grid, Box } from "@mui/material";
// import axios from "axios";
// import { Card, CardContent, Typography } from "@mui/material";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// const Insights = () => {
//   const COLORS = ["#4CAF50", "#FF9800", "#F44336"];
//   const data = [
//     { name: "Paid", value: 5000 },
//     { name: "Pending", value: 2000 },
//     { name: "Overdue", value: 1000 },
//   ];

//   const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
//   const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
//   // jobs count
//   const [jobCount, setJobCount] = useState(null);
//   const [activeJobCount, setActiveJobCount] = useState(null);
//   const [inactiveJobCount, setInactiveJobCount] = useState(null);
//   const [invoiceCount, setInvoiceCount] = useState(null);
//   const [invoiceCounts, setInvoiceCounts] = useState({
//     Paid: 0,
//     Pending: 0,
//     Overdue: 0,
//   });
//   const [invoiceSummary, setInvoiceSummary] = useState({
//     totalAmount: 0,
//     pendingAmount: 0,
//     paidAmount: 0,
//     overdueAmount: 0,
//   });
//   useEffect(() => {
//     // Fetch job count from API
//     axios
//       .get(`${JOBS_API}/workflow/jobs/jobscount`)
//       .then((response) => {
//         setJobCount(response.data.count); // Assuming API returns { count: <job count> }
//       })
//       .catch((error) => {
//         console.error("Error fetching job count:", error);
//       });

//     // Fetch count of active jobs
//     axios
//       .get(`${JOBS_API}/workflow/jobs/activejobcounts`)
//       .then((response) => {
//         setActiveJobCount(response.data.count);
//       })
//       .catch((error) => {
//         console.error("Error fetching active job count:", error);
//       });

//     // Fetch count of inactive jobs
//     axios
//       .get(`${JOBS_API}/workflow/jobs/inactivejobcounts`)
//       .then((response) => {
//         setInactiveJobCount(response.data.count);
//       })
//       .catch((error) => {
//         console.error("Error fetching inactive job count:", error);
//       });

//     // Fetch count of total invoices
//     axios
//       .get(`${INVOICE_NEW}/workflow/invoices/invoicecount`)
//       .then((response) => {
//         setInvoiceCount(response.data.count);
//       })
//       .catch((error) => {
//         console.error("Error fetching inactive job count:", error);
//       });
//     axios
//       .get(`${INVOICE_NEW}/workflow/invoices/invoicestatuscount`)
//       .then((response) => {
//         const data = response.data.invoiceCounts;

//         // Convert response to an object with statuses as keys
//         const countMap = {};
//         data.forEach(({ _id, count }) => {
//           countMap[_id] = count;
//         });

//         // Update state with counts
//         setInvoiceCounts({
//           Paid: countMap["Paid"] || 0,
//           Pending: countMap["Pending"] || 0,
//           Overdue: countMap["Overdue"] || 0,
//         });
//       })
//       .catch((error) => console.error("Error fetching invoice counts:", error));
//     axios
//       .get(`${INVOICE_NEW}/workflow/invoices/invoicesummary`)
//       .then((response) => {
//         const data = response.data.summary;
//         let totalAmount = 0,
//           paidAmount = 0,
//           pendingAmount = 0,
//           overdueAmount = 0;

//         data.forEach(
//           ({ _id, totalAmount: total, paidAmount: paid, balanceDueAmount }) => {
//             totalAmount += total;
//             if (_id === "Paid") paidAmount += paid;
//             if (_id === "Pending") pendingAmount += balanceDueAmount;
//             if (_id === "Overdue") overdueAmount += balanceDueAmount;
//           }
//         );

//         setInvoiceSummary({
//           totalAmount,
//           pendingAmount,
//           paidAmount,
//           overdueAmount,
//         });
//       })
//       .catch((error) =>
//         console.error("Error fetching invoice summary:", error)
//       );
//   }, []);
  
//   return (
//     <Box sx={{ padding: 2 }}>
//       {/* <Box>
//       <Typography gutterBottom variant="h5" component="div">
//         Jobs Details
//       </Typography>
//       <Box mt={3}>
//         <Grid container spacing={2} justifyContent="center">
//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Total Jobs
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">{jobCount}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Active Jobs
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">{activeJobCount}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Archived Jobs
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">{inactiveJobCount}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Finished Jobs
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">{0}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//       </Box>
//       <Box mt={3}>
//       <Typography gutterBottom variant="h5" component="div">
//         Invoices Details
//       </Typography>
//       <Box mt={3}>
//         <Grid container spacing={2} justifyContent="center">
//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Total Invoices
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">{invoiceCount}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Pending Invoices
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">{invoiceCounts.Pending}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Paid Invoices
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary"> {invoiceCounts.Paid}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//       <Card sx={{ width:'250px'}}>
//         <CardContent>
//           <Typography gutterBottom variant="h6" component="div">
//             Overdue Invoices
//           </Typography>
//           <Typography variant="body2" color="text.secondary">{invoiceCounts.Overdue}</Typography>
//         </CardContent>
//       </Card>
//     </Grid>
//         </Grid>
//       </Box>

//       </Box> */}

//       <Box mt={3}>
//         <Typography gutterBottom variant="h5">
//           Invoices Amount
//         </Typography>
//         <Box mt={3}>
//           <Grid container spacing={2} justifyContent="center">
//             {[
//               { title: "Total Amount", value: 500 },
//               { title: "Pending Amount", value: 300 },
//               { title: "Paid Amount", value: 100 },
//               { title: "Overdue Amount", value: 100},
//             ].map(({ title, value }) => (
//               <Grid item xs={12} sm={3} key={title}>
//                 <Card sx={{ width: "250px" }}>
//                   <CardContent>
//                     <Typography gutterBottom variant="h6">
//                       {title}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       ${value.toFixed(2)}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>

//         <Box mt={5} display="flex" justifyContent="center">
//     <ResponsiveContainer width={400} height={300}>
//       <PieChart>
//         <Pie
//           data={[
//             { name: "Paid", value: 100 },
//             { name: "Pending", value: 300 },
//             { name: "Overdue", value: 100 },
//           ]}
//           cx="50%"
//           cy="50%"
//           innerRadius={60}
//           outerRadius={100}
//           fill="#8884d8"
//           dataKey="value"
//           label
//         >
//           {["#4CAF50", "#FF9800", "#F44336"].map((color, index) => (
//             <Cell key={index} fill={color} />
//           ))}
//         </Pie>
//         <Tooltip formatter={(value) => `$${value}`} />
//         <Legend />
//       </PieChart>
//     </ResponsiveContainer>
//   </Box>
//       </Box>
//       {/* <Box sx={{ display: "flex", alignItems: "center" }}>
//         <ResponsiveContainer width={"30%"} height={300}>
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={60}
//               outerRadius={100}
//               fill="#8884d8"
//               dataKey="value"
//               label
//             >
//               {data.map((entry, index) => (
//                 <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip formatter={(value) => `$${value}`} />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//         <Box>
//           {data.map((entry, index) => (
//             <Typography>
//               {entry.name} : ${entry.value}
//             </Typography>
//           ))}
//         </Box>
//       </Box> */}
//     </Box>
//   );
// };

// export default Insights;

// // import React, { useState } from "react";
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   Button,
// //   Drawer,
// //   Box,
// //   Typography
// // } from "@mui/material";

// // export default function FullscreenDialogWithDrawer() {
// //   const [dialogOpen, setDialogOpen] = useState(false);
// //   const [drawerOpen, setDrawerOpen] = useState(false);

// //   return (
// //     <>
// //       {/* Button to open fullscreen dialog */}
// //       <Button variant="contained" onClick={() => setDialogOpen(true)}>
// //         Open Fullscreen Dialog
// //       </Button>

// //       {/* Fullscreen Dialog */}
// //       <Dialog
// //         fullScreen
// //         open={dialogOpen}
// //         onClose={() => setDialogOpen(false)}
// //       >
// //         <DialogTitle>Fullscreen Dialog</DialogTitle>
// //         <DialogContent>
// //           <Typography>
// //             This is a fullscreen dialog.  
// //             Click below to open a drawer on top.
// //           </Typography>
// //           <Button
// //             variant="outlined"
// //             sx={{ mt: 2 }}
// //             onClick={() => setDrawerOpen(true)}
// //           >
// //             Open Right Drawer
// //           </Button>
// //         </DialogContent>
// //       </Dialog>

// //       {/* Right Drawer (with higher z-index so it shows over dialog) */}
// //       <Drawer
// //         anchor="right"
// //         open={drawerOpen}
// //         onClose={() => setDrawerOpen(false)}
// //         ModalProps={{
// //           keepMounted: true // Improves performance on mobile
// //         }}
// //         sx={{
// //           zIndex: (theme) => theme.zIndex.modal + 1 // ensure above dialog
// //         }}
// //       >
// //         <Box sx={{ width: 300, p: 2 }}>
// //           <Typography variant="h6">Drawer Content</Typography>
// //           <Typography>This drawer opens above the fullscreen dialog!</Typography>
// //           <Button
// //             variant="contained"
// //             sx={{ mt: 2 }}
// //             onClick={() => setDrawerOpen(false)}
// //           >
// //             Close Drawer
// //           </Button>
// //         </Box>
// //       </Drawer>
// //     </>
// //   );
// // }


// import React, { useEffect, useState } from "react";
// import { Autocomplete, TextField, CircularProgress } from "@mui/material";

// const CountryAutocomplete = () => {
//   const [countries, setCountries] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
//       .then(res => res.json())
//       .then(data => {
//         const sorted = data.sort((a, b) =>
//           a.name.common.localeCompare(b.name.common)
//         );
//         setCountries(sorted);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Error fetching countries:", err);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <Autocomplete
//       options={countries}
//       getOptionLabel={(option) => option.name.common}
//       loading={loading}
//       onChange={(event, value) => {
//         console.log("Selected country:", value);
//       }}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label="Select Country"
//           InputProps={{
//             ...params.InputProps,
//             endAdornment: (
//               <>
//                 {loading ? <CircularProgress size={20} /> : null}
//                 {params.InputProps.endAdornment}
//               </>
//             ),
//           }}
//         />
//       )}
//       renderOption={(props, option) => {
//         const callingCode = option.idd?.root
//           ? `${option.idd.root}${option.idd.suffixes?.[0] || ""}`
//           : "";
//         return (
//           <li {...props} key={option.cca2}>
//             <span style={{ fontSize: "1.2rem", marginRight: 8 }}>
//               {option.flag}
//             </span>
//             {option.name.common} {callingCode && `(${callingCode})`}
//           </li>
//         );
//       }}
//       sx={{ width: 300 }}
//     />
//   );
// };

// export default CountryAutocomplete;


import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Sample data
const initialData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
];

const MuiTableWithActions = () => {
  const [data, setData] = useState(initialData);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleEdit = () => {
    if (selectedRow) {
      setEditForm(selectedRow);
      setEditDialogOpen(true);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleEditSubmit = () => {
    setData(prevData =>
      prevData.map(item =>
        item.id === editForm.id ? editForm : item
      )
    );
    setEditDialogOpen(false);
    setEditForm({});
  };

  const handleDeleteConfirm = () => {
    setData(prevData => prevData.filter(item => item.id !== selectedRow.id));
    setDeleteDialogOpen(false);
    setSelectedRow(null);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(event) => handleMenuOpen(event, row)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ marginRight: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ marginRight: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={editForm.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editForm.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Role"
            fullWidth
            variant="outlined"
            value={editForm.role || ''}
            onChange={(e) => handleInputChange('role', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedRow?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MuiTableWithActions;
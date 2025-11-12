// import React, { useState, useEffect, useMemo } from "react";
// import { Button, Typography, Box, TableContainer } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Chip,
//   Paper,
//   Divider,
//   Menu,
//   MenuItem,
//   useMediaQuery,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Checkbox,
//   IconButton,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import { CiMenuKebab } from "react-icons/ci";
// import axios from "axios";
// import ProposalDialog from "./ProposalDialog"
// const Proposals = () => {
//   const { data } = useParams();
//   const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL;
//   const [ProposalsTemplates, setProposalsTemplates] = useState([]);

//   const navigate = useNavigate();

//   const handleCreateTemplateClick = () => {
//     navigate(`/clients/accounts/accountsdash/proposals/${data}/new`);
//   };

//   const [tempIdget, setTempIdGet] = useState("");
//   const [openMenuId, setOpenMenuId] = useState(null);
//  const [anchorEl, setAnchorEl] = useState(null);

//   const toggleMenu = (event, _id) => {
//     setAnchorEl(event.currentTarget);
//     setOpenMenuId(_id);
//     setTempIdGet(_id);
//   };
//     const handleMenuClose = () => {
//     setAnchorEl(null);
//     setOpenMenuId(null);
//     setTempIdGet(null);
//   };
//  const [openDialog, setOpenDialog] = useState(false);
//   const [selectedProposal, setSelectedProposal] = useState(null);
//   const handleOpenDialog = (proposal) => {
//     setSelectedProposal(proposal);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedProposal(null);
// if (data) {
//     fetchPrprosalsAllData(data); // now refresh with correct ID
//   }
//   };
// const signProposal = async (signatureData) => {
//   console.log("signatureData",signatureData)
//   try {
//     const response = await axios.patch(
//       `${PROPOSAL_API}/proposalandels/proposalaccountwise/${signatureData.proposalId}/sign`,
//       {

//         signature: signatureData.signature,
//         signedAt: signatureData.signedAt,
//           signedBy:signatureData.signedBy
//       },

//     );
//  console.log(response)
//     return response.data;

//   } catch (error) {
//     console.error('Error signing proposal:', error);
//     throw error;
//   }
// };
//   //delete template
//   const handleEdit = (_id) => {
//     navigate(`/clients/accounts/accountsdash/proposals/${data}/update/` + _id);
//     console.log(_id);
//   };
//   useEffect(() => {
//     fetchPrprosalsAllData(data);
//   }, []);

//   // Delete template
//   const handleDelete = (_id) => {
//     // Show a confirmation prompt
//     const isConfirmed = window.confirm(
//       "Are you sure you want to delete this Job template?"
//     );

//     // Proceed with deletion if confirmed
//     if (isConfirmed) {
//       const requestOptions = {
//         method: "DELETE",
//         redirect: "follow",
//       };
//       const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/`;
//       fetch(url + _id, requestOptions)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Failed to delete item");
//           }
//           return response.json();
//         })
//         .then((result) => {
//           console.log(result);
//              toast.success("Item deleted successfully");
//               // fetchPrprosalsAllData(data);
//          handleMenuClose()
//    // ✅ Remove deleted item from state immediately
//         setProposalsTemplates((prev) => prev.filter((p) => p._id !== _id));
//           // Fetch the updated data after deletion

//         })
//         .catch((error) => {
//           console.error(error);
//           toast.error("Failed to delete item");
//         });
//     }
//   };

//   const fetchPrprosalsAllData = async (data) => {
//     try {
//       const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/proposalbyaccount/${data}`;

//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error("Failed to fetch Proposals templates");
//       }
//       const result = await response.json();
//       console.log(result.proposalesandelsAccountwise);
//       setProposalsTemplates(result.proposalesandelsAccountwise);
//     } catch (error) {
//       console.error("Error fetching Proposals templates:", error);
//     }
//   };

//   return (
//     <Box sx={{ mt: 2 }}>
//       <Button
//         variant="contained"
//         onClick={handleCreateTemplateClick}
//         sx={{
//           backgroundColor: "var(--color-save-btn)", // Normal background

//           "&:hover": {
//             backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//           },
//           mb: 3,
//           borderRadius: "15px",
//         }}
//       >
//         New Proposals
//       </Button>

//       <TableContainer component={Paper} sx={{ overflow: "visible" }}>
//         <Table sx={{ width: "100%" }}>
//           <TableHead>
//             <TableRow>
//               <TableCell
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   padding: "16px",
//                 }}
//                 width="100"
//               >
//                 Client Name
//               </TableCell>
//               <TableCell
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   padding: "16px",
//                 }}
//                 width="200"
//               >
//                 Proposal Name
//               </TableCell>
//               {/* <TableCell
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   padding: "16px",
//                 }}
//                 width="100"
//               >
//                 Status
//               </TableCell> */}
//               <TableCell
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   padding: "16px",
//                 }}
//                 width="100"
//               >
//                 Payment
//               </TableCell>
//               <TableCell
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   padding: "16px",
//                 }}
//                 width="100"
//               >
//                 Auth
//               </TableCell>
//               <TableCell
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   padding: "16px",
//                 }}
//                 width="100"
//               >
//                 Invoicing
//               </TableCell>
//               <TableCell
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   padding: "16px",
//                 }}
//                 width="100"
//               >
//                 Date
//               </TableCell>
//               <TableCell
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   padding: "16px",
//                 }}
//                 width="100"
//               >
//                 Signed
//               </TableCell>
//               <TableCell
//                 style={{
//                   fontSize: "12px",
//                   fontWeight: "bold",
//                   padding: "16px",
//                 }}
//                 width="100"
//               >
//                 Settings
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {ProposalsTemplates.map((row) => (
//               <TableRow key={row._id}>
//                 <TableCell>
//                   <Typography
//                     style={{
//                       fontSize: "12px",
//                       padding: "4px 8px",
//                       lineHeight: "1",
//                       cursor: "pointer",
//                       color: "#3f51b5",
//                     }}

//                   >
//                     {row.accountid.accountName}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Typography
//                     style={{
//                       fontSize: "12px",
//                       padding: "4px 8px",
//                       lineHeight: "1",
//                       cursor: "pointer",
//                       color: "#3f51b5",
//                     }}
//                      onClick={() => handleOpenDialog(row)}
//                     // onClick={() => handleEdit(row._id, row.accountid._id)}
//                   >
//                     {row.proposalname}
//                   </Typography>
//                 </TableCell>
//                 {/* <TableCell
//                   style={{
//                     fontSize: "12px",
//                     padding: "4px 8px",
//                     lineHeight: "1",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {row.status}
//                 </TableCell> */}
//                 <TableCell
//                   style={{
//                     fontSize: "12px",
//                     padding: "4px 8px",
//                     lineHeight: "1",
//                     cursor: "pointer",
//                   }}
//                 >
//                   b
//                 </TableCell>
//                 <TableCell
//                   style={{
//                     fontSize: "12px",
//                     padding: "4px 8px",
//                     lineHeight: "1",
//                     cursor: "pointer",
//                   }}
//                 >
//                   c
//                 </TableCell>
//                 <TableCell
//                   style={{
//                     fontSize: "12px",
//                     padding: "4px 8px",
//                     lineHeight: "1",
//                     cursor: "pointer",
//                   }}
//                 >
//                   d
//                 </TableCell>
//                 <TableCell
//                   style={{
//                     fontSize: "12px",
//                     padding: "4px 8px",
//                     lineHeight: "1",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {/* {row.createdAt}
//                    */}
//                   {new Intl.DateTimeFormat("en-US", {
//                     day: "2-digit",
//                     month: "2-digit",
//                     year: "numeric",
//                   }).format(new Date(row.createdAt))}
//                 </TableCell>
//                 <TableCell>{row.status}</TableCell>

//                   <TableCell
//                                   style={{
//                                     fontSize: "12px",
//                                     padding: "4px 8px",
//                                     lineHeight: "1",
//                                   }}
//                                 >
//                                   <IconButton
//                                     onClick={(event) => toggleMenu(event, row._id)}
//                                     style={{ color: "#2c59fa" }}
//                                     size="small"
//                                   >
//                                     <CiMenuKebab />
//                                   </IconButton>

//                                   {/* MUI Menu */}

//                                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//               anchorOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'left',
//               }}
//               PaperProps={{
//                 sx: {
//                   mt: 3,
//                   ml: 1,
//                   boxShadow: 3,
//                   borderRadius: 1,
//                   minWidth: 120,
//                   '& .MuiMenuItem-root': {
//                     fontSize: '12px',
//                     padding: '8px 16px',
//                   }
//                 }
//               }}
//             >
//               <MenuItem
//                 onClick={() => handleEdit(tempIdget)}
//                 sx={{
//                   fontWeight: "bold",
//                   '&:hover': {
//                     backgroundColor: '#f5f5f5'
//                   }
//                 }}
//               >
//                 Edit
//               </MenuItem>
//               <MenuItem
//                 onClick={() => handleDelete(tempIdget)}
//                 sx={{
//                   color: "error.main",
//                   fontWeight: "bold",
//                   '&:hover': {
//                     backgroundColor: '#ffebee'
//                   }
//                 }}
//               >
//                 Delete
//               </MenuItem>
//             </Menu>

//               <ProposalDialog
//   open={openDialog}
//   handleClose={handleCloseDialog}
//   proposal={selectedProposal}
//   onProposalSigned={async (signatureData) => {
//     try {
//       await signProposal(signatureData);
//         toast.success("Signature saved successfully!");
//     handleCloseDialog(); // this will refresh the proposals
//       // Optionally refresh your proposals list or update state
//     } catch (error) {
//       console.error('Error signing proposal:', error);
//     }
//   }}
// />
//     </Box>
//   );
// };

// export default Proposals;

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Chip,
  Button,IconButton,MenuItem,Menu
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import ProposalPreviewDialog from "../../ProposalandEls/components/ProposalPreviewDialog"
const AccountProposalTable = () => {
   const { data } = useParams();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  // const [selectedProposal, setSelectedProposal] = useState(null);
const [anchorEl, setAnchorEl] = useState(null);
const [selectedProposal, setSelectedProposal] = useState(null);

  const handleProposalNameClick = (proposal) => {
    setSelectedProposal(proposal);
    setOpenDialog(true);
  };

   useEffect(() => {
      const fetchData = async () => {
        try {
          const requestOptions = {
            method: "GET",
            redirect: "follow"
          };
  
          const response = await fetch(`https://www.snptaxes.com/account/proposals/byaccount/${data}`, requestOptions);
          
          
          const result = await response.json();
          setProposals(result.proposallist || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

  const handleTemplateClick = (proposal) => {
    console.log("proposal to edit", proposal);
    // Navigate to proposal form with the proposal ID
    navigate(`/clients/accounts/accountsdash/proposals/${data}/account-proposal?edit=${proposal._id}`);
  };

  const handleCreateNew = () => {
    // Navigate to empty proposal form
    navigate(`/clients/accounts/accountsdash/proposals/${data}/account-proposal`);
  };

  const handleMenuOpen = (event, proposal) => {
  setAnchorEl(event.currentTarget);
  setSelectedProposal(proposal);
};

const handleMenuClose = () => {
  setAnchorEl(null);
  setSelectedProposal(null);
};

const handleDelete = async () => {
  if (!selectedProposal) return;
  if (!window.confirm("Are you sure you want to delete this proposal?")) {
    handleMenuClose();
    return;
  }

  try {
    const response = await fetch(
      `https://www.snptaxes.com/account/proposals/${selectedProposal._id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete proposal");
    }
toast.success("Proposal Deleted Successfully")
    // ✅ Remove from UI list instantly
    setProposals((prev) =>
      prev.filter((p) => p._id !== selectedProposal._id)
    );
  } catch (err) {
    console.error(err);
  } finally {
    handleMenuClose();
  }
};


  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading proposals...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Proposals List</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateNew}>
          Create New Proposal
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
              >
                Proposal Name
              </TableCell>

              <TableCell
                sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow
                key={proposal._id}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                  "&:hover": { backgroundColor: "action.selected" },
                }}
              >
                <TableCell
                  onClick={() => handleProposalNameClick(proposal)}
                  style={{ cursor: "pointer" }}
                >
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    color="primary"
                  >
                    {proposal.general.proposalName}
                  </Typography>
                </TableCell>

                {/* <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleTemplateClick(proposal)}
                  >
                    Edit
                  </Button>
                </TableCell> */}
                 <TableCell>
            <IconButton onClick={(e) => handleMenuOpen(e, proposal)}>
              <MoreVertIcon />
            </IconButton>
          </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
{/* ✅ Shared Menu */}
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleMenuClose}
  >
    <MenuItem
      onClick={() => {
        handleTemplateClick(selectedProposal);
        handleMenuClose();
      }}
    >
      Edit
    </MenuItem>

    <MenuItem sx={{ color: "red" }} onClick={handleDelete}>
      Delete
    </MenuItem>
  </Menu>
      {proposals.length === 0 && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No proposals available
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateNew}
            sx={{ mt: 2 }}
          >
            Create Your First Proposal
          </Button>
        </Box>
      )}
      {/* {openDialog && (
  <ProposalPreviewDialog
    open={openDialog}
    handleClose={() => setOpenDialog(false)}
    proposal={selectedProposal}
  />
)} */}
    </Box>
  );
};

export default AccountProposalTable;

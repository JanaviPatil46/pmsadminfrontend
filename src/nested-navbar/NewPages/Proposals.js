

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
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProposalPreviewDialog from "./ProposalDialog"
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
  const handleOpenDialog = (proposal) => {
    setSelectedProposal(proposal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProposal(null);
// fetchPrprosalsAllData(accountId);
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
          console.log("Fetched Proposals:", result);
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
               Status
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
                
                >
                  {/* <Link  to={`/clients/accounts/accountsdash/proposals/${data}/account-proposal?edit=${proposal._id}`}  style={{
                        textDecoration: "none",
                        color: "blue",
                        fontWeight: 500,
                      }}> */}
                    <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{cursor:'pointer'}}
                    color="primary"
                      onClick={() => handleOpenDialog(proposal)}
                  >
                    {proposal.general.proposalName}
                  </Typography>
                  {/* </Link> */}
                
                </TableCell>

                <TableCell>{proposal.status}</TableCell>
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
 <ProposalPreviewDialog
    open={openDialog}
    handleClose={handleCloseDialog}
    proposal={selectedProposal}
  />
    </Box>
  );
};

export default AccountProposalTable;

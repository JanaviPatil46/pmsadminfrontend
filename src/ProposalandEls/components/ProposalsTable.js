

import React, { useState, useEffect } from 'react';
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
  Button
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { toast } from 'react-toastify';
const ProposalsTable = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);              // menu anchor
  const [selectedProposal, setSelectedProposal] = useState(null); // which row clicked
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };

        const response = await fetch("https://www.snptaxes.com/api/proposals", requestOptions);
        
        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }
        
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

    console.log("proposal to edit", proposal)
    // Navigate to proposal form with the proposal ID
    navigate(`/firmtemp/templates/proposals/proposal-form?edit=${proposal._id}`);
  };

  const handleCreateNew = () => {
    // Navigate to empty proposal form
    navigate('/firmtemp/templates/proposals/proposal-form');
  };

   // ✅ Open menu for selected row
  const handleMenuOpen = (event, proposal) => {
    setAnchorEl(event.currentTarget);
    setSelectedProposal(proposal);
  };

  // ✅ Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProposal(null);
  };

  // ✅ Delete handler (You can add API call later)
const handleDelete = async () => {
  if (!selectedProposal) return;

  try {
    const response = await fetch(
      `https://www.snptaxes.com/api/proposals/${selectedProposal._id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete proposal");
    }
toast.success("Proposal deleted successfully")
    // ✅ Remove from UI without refresh
    setProposals(prev => prev.filter(p => p._id !== selectedProposal._id));

    console.log("Proposal deleted");
  } catch (err) {
    console.error("Delete error:", err);
  } finally {
    handleMenuClose();
  }
};

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Proposals List
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleCreateNew}
        >
          Create New Proposal
        </Button>
      </Box>
      
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              
             
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                Template Name
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow
                key={proposal._id}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  '&:hover': { backgroundColor: 'action.selected' }
                }}
              >
               
                
                <TableCell>
               
                 <Link  to={`/firmtemp/templates/proposals/proposal-form?edit=${proposal._id}`}
                      style={{
                        textDecoration: "none",
                        color: "blue",
                        fontWeight: 500,
                      }}> {proposal.templatename} </Link>
                 
                </TableCell>
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
        {/* ✅ MENU FOR EDIT / DELETE */}
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
    </Box>
  );
};

export default ProposalsTable;
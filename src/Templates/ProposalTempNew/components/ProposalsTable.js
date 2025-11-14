

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
import { useNavigate } from 'react-router-dom';

const ProposalsTable = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };

        const response = await fetch("http://localhost:9000/api/proposals", requestOptions);
        
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
    navigate(`/proposal-form?edit=${proposal._id}`);
  };

  const handleCreateNew = () => {
    // Navigate to empty proposal form
    navigate('/proposal-form');
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
                Proposal ID
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                Proposal Name
              </TableCell>
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
                  <Chip 
                    label={proposal._id} 
                    variant="outlined" 
                    size="small"
                    sx={{ fontFamily: 'monospace' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {proposal.general.proposalName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={proposal.general.templatename} 
                    color="primary" 
                    variant="filled"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => handleTemplateClick(proposal)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
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
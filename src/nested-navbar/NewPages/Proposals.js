import React, { useState, useEffect, useMemo } from "react";
import { Button, Typography, Box, TableContainer } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import {
  Chip,
  Paper,
  Divider,
  Menu,
  MenuItem,
  useMediaQuery,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { CiMenuKebab } from "react-icons/ci";
import axios from "axios";
import ProposalDialog from "./ProposalDialog"
const Proposals = () => {
  const { data } = useParams();
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL;
  const [ProposalsTemplates, setProposalsTemplates] = useState([]);

  const navigate = useNavigate();

  const handleCreateTemplateClick = () => {
    navigate(`/clients/accounts/accountsdash/proposals/${data}/new`);
  };

  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
 const [anchorEl, setAnchorEl] = useState(null);
  // const toggleMenu = (_id) => {
  //   setOpenMenuId(openMenuId === _id ? null : _id);
  //   setTempIdGet(_id);
  // };
  const toggleMenu = (event, _id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(_id);
    setTempIdGet(_id);
  };
    const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
    setTempIdGet(null);
  };
 const [openDialog, setOpenDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const handleOpenDialog = (proposal) => {
    setSelectedProposal(proposal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProposal(null);
if (data) {
    fetchPrprosalsAllData(data); // now refresh with correct ID
  }
  };
const signProposal = async (signatureData) => {
  console.log("signatureData",signatureData)
  try {
    const response = await axios.patch(
      `${PROPOSAL_API}/proposalandels/proposalaccountwise/${signatureData.proposalId}/sign`,
      {
        
        signature: signatureData.signature,
        signedAt: signatureData.signedAt,
          signedBy:signatureData.signedBy
      },
      
    );
 console.log(response)
    return response.data;
   
  } catch (error) {
    console.error('Error signing proposal:', error);
    throw error;
  }
};
  //delete template
  const handleEdit = (_id) => {
    navigate(`/clients/accounts/accountsdash/proposals/${data}/update/` + _id);
    console.log(_id);
  };
  useEffect(() => {
    fetchPrprosalsAllData(data);
  }, []);

  // Delete template
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Job template?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
             toast.success("Item deleted successfully");
              // fetchPrprosalsAllData(data);
         handleMenuClose()
   // ✅ Remove deleted item from state immediately
        setProposalsTemplates((prev) => prev.filter((p) => p._id !== _id));
          // Fetch the updated data after deletion
    
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };

  const fetchPrprosalsAllData = async (data) => {
    try {
      const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/proposalbyaccount/${data}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch Proposals templates");
      }
      const result = await response.json();
      console.log(result.proposalesandelsAccountwise);
      setProposalsTemplates(result.proposalesandelsAccountwise);
    } catch (error) {
      console.error("Error fetching Proposals templates:", error);
    }
  };

 
  return (
    <Box sx={{ mt: 2 }}>
      <Button
        variant="contained"
        onClick={handleCreateTemplateClick}
        sx={{
          backgroundColor: "var(--color-save-btn)", // Normal background

          "&:hover": {
            backgroundColor: "var(--color-save-hover-btn)", // Hover background color
          },
          mb: 3,
          borderRadius: "15px",
        }}
      >
        New Proposals
      </Button>
     
      <TableContainer component={Paper} sx={{ overflow: "visible" }}>
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Client Name
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="200"
              >
                Proposal Name
              </TableCell>
              {/* <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Status
              </TableCell> */}
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Payment
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Auth
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Invoicing
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Date
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Signed
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Settings
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ProposalsTemplates.map((row) => (
              <TableRow key={row._id}>
                <TableCell>
                  <Typography
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                      cursor: "pointer",
                      color: "#3f51b5",
                    }}
                   
                  >
                    {row.accountid.accountName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                      cursor: "pointer",
                      color: "#3f51b5",
                    }}
                     onClick={() => handleOpenDialog(row)}
                    // onClick={() => handleEdit(row._id, row.accountid._id)}
                  >
                    {row.proposalname}
                  </Typography>
                </TableCell>
                {/* <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                    cursor: "pointer",
                  }}
                >
                  {row.status}
                </TableCell> */}
                <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                    cursor: "pointer",
                  }}
                >
                  b
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                    cursor: "pointer",
                  }}
                >
                  c
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                    cursor: "pointer",
                  }}
                >
                  d
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                    cursor: "pointer",
                  }}
                >
                  {/* {row.createdAt}
                   */}
                  {new Intl.DateTimeFormat("en-US", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(row.createdAt))}
                </TableCell>
                <TableCell>{row.status}</TableCell>
                {/* <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                  }}
                >
                  <IconButton
                    onClick={() => toggleMenu(row._id)}
                    style={{ color: "#2c59fa" }}
                  >
                    <CiMenuKebab style={{ fontSize: "25px" }} />
                    {openMenuId === row._id && (
                      <Box
                        sx={{
                          position: "absolute",
                          zIndex: 1,
                          backgroundColor: "#fff",
                          boxShadow: 1,
                          borderRadius: 1,
                          p: 1,
                          left: "20px",

                          m: 2,
                          top: "10px",
                          textAlign: "start",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "12px", fontWeight: "bold" }}
                          onClick={() => handleEdit(row._id)}
                        >
                          Edit   
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "red",
                            fontWeight: "bold",
                          }}
                          onClick={() => handleDelete(row._id)}
                        >
                          Delete
                        </Typography>
                      </Box>
                    )}
                  </IconButton>
                </TableCell> */}
                  <TableCell
                                  style={{
                                    fontSize: "12px",
                                    padding: "4px 8px",
                                    lineHeight: "1",
                                  }}
                                >
                                  <IconButton
                                    onClick={(event) => toggleMenu(event, row._id)}
                                    style={{ color: "#2c59fa" }}
                                    size="small"
                                  >
                                    <CiMenuKebab />
                                  </IconButton>
                
                                  {/* MUI Menu */}
                                
                                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  mt: 3,
                  ml: 1,
                  boxShadow: 3,
                  borderRadius: 1,
                  minWidth: 120,
                  '& .MuiMenuItem-root': {
                    fontSize: '12px',
                    padding: '8px 16px',
                  }
                }
              }}
            >
              <MenuItem 
                onClick={() => handleEdit(tempIdget)}
                sx={{ 
                  fontWeight: "bold",
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Edit
              </MenuItem>
              <MenuItem 
                onClick={() => handleDelete(tempIdget)}
                sx={{ 
                  color: "error.main", 
                  fontWeight: "bold",
                  '&:hover': {
                    backgroundColor: '#ffebee'
                  }
                }}
              >
                Delete
              </MenuItem>
            </Menu>

              <ProposalDialog
  open={openDialog}
  handleClose={handleCloseDialog}
  proposal={selectedProposal}
  onProposalSigned={async (signatureData) => {
    try {
      await signProposal(signatureData);
        toast.success("Signature saved successfully!");
    handleCloseDialog(); // this will refresh the proposals
      // Optionally refresh your proposals list or update state
    } catch (error) {
      console.error('Error signing proposal:', error);
    }
  }}
/>
    </Box>
  );
};

export default Proposals;

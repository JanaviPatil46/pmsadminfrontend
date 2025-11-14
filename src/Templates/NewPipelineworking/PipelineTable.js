import React, { useState, useEffect } from "react";
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
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box } from "lucide-react";


  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
const PipelineTable = () => {
  
const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPipeline, setSelectedPipeline] = useState(null);

 const [pipelineData, setPipelineData] = useState([]);

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch pipeline data");
      }
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    }
  };

  const handleMenuOpen = (event, pipeline) => {
    setAnchorEl(event.currentTarget);
    setSelectedPipeline(pipeline);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPipeline(null);
  };

  // ============================
  // 💥 EDIT Pipeline
  // ============================
  const handleEdit = () => {
    console.log("Edit clicked:", selectedPipeline);
    navigate(`/firmtemp/pipelineform?edit=${selectedPipeline._id}`);
    // 👉 Open drawer/modal here
    handleMenuClose();
  };

  // ============================
  // 💥 DELETE Pipeline
  // ============================
  const handleDelete = async () => {
    console.log("Delete clicked:", selectedPipeline);

    // Example API call
    try {
      await fetch(`/api/pipelines/${selectedPipeline._id}`, {
        method: "DELETE",
      });

      // Refresh list
      fetchPipelineData();
    } catch (error) {
      console.log("Delete error:", error);
    }

    handleMenuClose();
  };

  const handelCreateNew = () => {
    // Navigate to empty proposal form
    navigate(`/firmtemp/pipelineform`);
  }
  return (
    <>
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}> 
      
      
      <Typography variant="h6" component="div">
        Pipeline Templates
      </Typography>
      <Button variant="contained" color="primary" onClick={handelCreateNew}>
        Create New Pipeline
      </Button>
   </Stack>
    <TableContainer component={Paper} elevation={2}>
    

      <Table>
        <TableHead>
          <TableRow>
          
            <TableCell sx={{ fontWeight: 600 }}>Pipeline Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Total Stages</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pipelineData?.length > 0 ? (
            pipelineData.map((pipeline, index) => (
              <TableRow key={pipeline._id}>
                
                <TableCell>{pipeline.pipelineName}</TableCell>
                <TableCell>{pipeline.stages?.length || 0}</TableCell>

                <TableCell sx={{ textAlign: "right" }}>
                  <IconButton onClick={(e) => handleMenuOpen(e, pipeline)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: "center", py: 3 }}>
                No pipelines found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Three-dot Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </TableContainer>
    </>
  );
};

export default PipelineTable;

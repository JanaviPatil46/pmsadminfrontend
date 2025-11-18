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
  Tab,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box } from "lucide-react";

import axios from "axios";
import { toast } from "react-toastify";
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
  // EDIT Pipeline - Navigate with pipeline ID
  const handleEdit = () => {
    if (selectedPipeline) {
      navigate(`/firmtemp/pipelineform?edit=${selectedPipeline._id}`);
    }
    handleMenuClose();
  };

  const handleDelete = async (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this pipeline?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${PIPELINE_API}/workflow/pipeline/pipeline/${selectedPipeline._id}`,
        headers: {},
      };

      try {
        const response = await axios.request(config);
        console.log("Delete response:", response.data);
        toast.success("Pipeline deleted successfully");
        handleMenuClose();
        fetchPipelineData();
        // Optionally, you can refresh the data or update the state to reflect the deletion
      } catch (error) {
        console.error("Error deleting pipeline:", error);
      }
    }
  };
  const handelCreateNew = () => {
    // Navigate to empty proposal form
    navigate(`/firmtemp/pipelineform`);
  };
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
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
                  {/* <TableCell>{pipeline.pipelineName}</TableCell> */}
                  <TableCell>
                    <Link
                      to={`/firmtemp/pipelineform?edit=${pipeline._id}`}
                      style={{
                        textDecoration: "none",
                        color: "blue",
                        fontWeight: 500,
                      }}
                    >
                      {pipeline.pipelineName}
                    </Link>
                  </TableCell>
                  <TableCell>{pipeline.stages?.length}</TableCell>

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

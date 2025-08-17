import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Button,
  Typography,
  Drawer,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Chip,IconButton
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IoClose } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
const Clientfacing = () => {
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const [clientFacingName, setClientFacingName] = useState("");

  const [clientFacingDescription, setClientFacingDescription] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  

  const colors = [
    "#0d6efd",
    "#6c757d",
    "#198754",
    "#dc3545",
    "#ffc107",
    "#0dcaf0",
    "#FF5722",
    "#212529",
  ];
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

 

  const handleNewDrawerOpen = (jobId) => {
    console.log("Opening drawer for job ID:", jobId); // Log the job ID
    setIsNewDrawerOpen(true);
  };

  const handleNewDrawerClose = () => {
    setIsNewDrawerOpen(false);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };
  const [loading, setLoading] = useState(true);
  // const fetchData = async () => {
  const fetchData = async () => {
    setLoading(true);
    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await fetch(
        `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setClientFacingJobs(data.clientFacingJobStatues); // Ensure data is set correctly
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };

  // useEffect to fetch jobs when the component mounts
  useEffect(() => {
    fetchData();
  }, []);
  const [errors, setErrors] = useState({
  name: "",
  description: "",
  color: ""
});

const validateForm = () => {
  let valid = true;
  let newErrors = { name: "", description: "", color: "" };

  if (!selectedColor) {
    newErrors.color = "Please select a color";
    valid = false;
  }
  if (!clientFacingName.trim()) {
    newErrors.name = "Name is required";
    valid = false;
  }
  if (!clientFacingDescription.trim()) {
    newErrors.description = "Description is required";
    valid = false;
  } else if (clientFacingDescription.length > 200) {
    newErrors.description = "Description must be 200 characters or less";
    valid = false;
  }

  setErrors(newErrors);
  return valid;
};

  // const createJobFacing = () => {
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   const raw = JSON.stringify({
  //     clientfacingName: clientFacingName,
  //     clientfacingColour: selectedColor,
  //     clientfacingdescription: clientFacingDescription,
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   fetch(
  //     `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`,
  //     requestOptions
  //   )
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result);
  //       fetchData();
  //       handleClearTemp();
  //       handleDrawerClose();
  //       toast.success("Client Facing Jobs created successfully");
  //     })
  //     .catch((error) => console.error(error));
  // };

 const createJobFacing = () => {
  if (!validateForm()) return; // stop if invalid

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    clientfacingName: clientFacingName.trim(),
    clientfacingColour: selectedColor,
    clientfacingdescription: clientFacingDescription.trim(),
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      fetchData();
      // handleClearTemp();
      handleDrawerClose();
       setClientFacingName("");
    setClientFacingDescription("");
    setSelectedColor("");
      toast.success("Client Facing Job created successfully");
    })
    .catch((error) => console.error(error));
};


  const handleClearTemp = () => {
    setClientFacingName("");
    setClientFacingDescription("");
    setSelectedColor("");
    handleDrawerClose();
  };
  const handleupdateclientstatus = () => {
    updateJobFacing(jobId);
  };

  const updateJobFacing = async (jobId) => {
    console.log(jobId);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      clientfacingName: clientFacingName,
      clientfacingColour: selectedColor,
      clientfacingdescription: clientFacingDescription,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(jobId);
    fetch(
      `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${jobId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        fetchData();
        handleClearTemp();
        handleNewDrawerClose();
        toast.success("Client Facing Jobs Updated successfully");
      })
      .catch((error) => console.error(error));
  };

  const deleteJobFacing = async (jobId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this client facing job?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        clientfacingName: clientFacingName,
        clientfacingColour: selectedColor,
        clientfacingdescription: clientFacingDescription,
      });

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${jobId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          fetchData();
          toast.success("Item deleted successfully");
        })
        .catch((error) => console.error(error));
    }
  };
  //

  const handleEdit = async (jobId) => {
    console.log(jobId);
    handleNewDrawerOpen(jobId);
    try {
      const response = await fetch(
        `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${jobId}`
      );
      const data = await response.json();
      console.log("Fetched job data:", data);
      setJobId(data.clientfacingjobstatuses._id);
      setSelectedColor(data.clientfacingjobstatuses.clientfacingColour);
      console.log(data.clientfacingjobstatuses.clientfacingColour);
      setClientFacingName(data.clientfacingjobstatuses.clientfacingName);
      setClientFacingDescription(
        data.clientfacingjobstatuses.clientfacingdescription
      );
      console.log(data.clientfacingjobstatuses.clientfacingdescription);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };
  console.log(jobId);
  return (
    <Box>
      <Box className="tag-container">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={handleDrawerOpen}
            sx={{
              backgroundColor: "var(--color-save-btn)", // Normal background

              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)", // Hover background color
              },
              borderRadius: "15px",
              mb: 3,
            }}
          >
            Create Status
          </Button>
        </Box>

        {/* Display Current Status */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <CircularProgress style={{ fontSize: "300px", color: "blue" }} />
          </Box>
        ) : (
         
          <Box>
      {clientFacingJobs.map((job) => (
        <Box
          key={job._id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            mb: 2,
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
            <GoDotFill
              style={{
                color: job.clientfacingColour,
                fontSize: "28px",
                flexShrink: 0, // Prevents size reduction
                marginRight: "12px",
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body1" fontWeight="600" noWrap>
                {job.clientfacingName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                
              >
                {job.clientfacingdescription}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => handleEdit(job._id)} sx={{ color: "#1168bf" }}>
              <BorderColorIcon />
            </IconButton>
            <IconButton onClick={() => deleteJobFacing(job._id)} sx={{ color: "#f52d2d" }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
        )}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            id: "tag-drawer",
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : 500,
              maxWidth: "100%",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
            },
          }}
        >
          <Box
            sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}
            role="presentation"
          >
            <Box>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "15px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <Typography variant="h6">
                  <b>Create client-facing job status template</b>
                </Typography>
                <IoClose
                  onClick={handleDrawerClose}
                  style={{ cursor: "pointer" }}
                />
              </Box>

              <Box m={2}>
               

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  {/* Color Selection */}
                  <Box sx={{ flex: 1 }}>
                    <InputLabel sx={{ color: "black" }}>Color</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        size="small"
                        sx={{
                          width: "100%",
                          backgroundColor: "#fff",
                          mt: 2,
                        }}
                        value={selectedColor}
                        // onChange={handleColorChange}
                        onChange={(e) => {
      setSelectedColor(e.target.value);
      if (e.target.value) {
        setErrors((prev) => ({ ...prev, color: "" })); // clear error
      }
    }}
                        renderValue={(selected) =>
                          selected ? (
                            <Chip
                              sx={{
                                backgroundColor: selected,
                                width: "18px",
                                height: "18px",
                                // borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <span style={{ color: "#9ca3af" }}>Select</span>
                          )
                        }
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 200,
                              overflowY: "auto",
                            },
                          },
                        }}
                      >
                        {colors.map((color) => (
                          <MenuItem key={color} value={color}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: "18px",
                                  height: "18px",
                                  backgroundColor: color,
                                  borderRadius: "50%",
                                }}
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                       {errors.color && <Typography variant="caption" color="error">{errors.color}</Typography>}
                    </FormControl>
                  </Box>

                  {/* Name Input */}
                  <Box sx={{ flex: 2 }}>
                    <InputLabel sx={{ color: "black" }}>Name</InputLabel>
                    <TextField
                      placeholder="Enter a name"
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "#fff",
                        mt: 2,
                      }}
                      value={clientFacingName}
                      onChange={(e) => {
    setClientFacingName(e.target.value);
    if (e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, name: "" })); // clear error
    }
  }}
                      // onChange={(e) => setClientFacingName(e.target.value)}
                    error={!!errors.name}
  helperText={errors.name}
                    />
                  </Box>
                </Box>

                <Box sx={{ marginTop: 2 }}>
                  <InputLabel sx={{ color: "black" }}>
                    Status description for client
                  </InputLabel>
                  
                  <TextField
  sx={{ marginTop: 2 }}
  fullWidth
  size="small"
  placeholder="Status description for client"
  multiline
  rows={5}
  value={clientFacingDescription}
  // onChange={(e) => setClientFacingDescription(e.target.value)}
   onChange={(e) => {
    setClientFacingDescription(e.target.value);
    if (e.target.value.trim() && e.target.value.length <= 200) {
      setErrors((prev) => ({ ...prev, description: "" })); // clear error
    }
  }}
  inputProps={{ maxLength: 200 }}
error={!!errors.description}
  helperText={errors.description || `${clientFacingDescription.length}/200`}

/>
                </Box>

                <Box
                  sx={{ pt: 5, display: "flex", alignItems: "center", gap: 5 }}
                >
                  <Button
                    onClick={createJobFacing}
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                      width: "80px",
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleClearTemp}
                    sx={{
                      borderColor: "var(--color-border-cancel-btn)", // Normal background
                      color: "var(--color-save-btn)",
                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                        color: "#fff",
                        border: "none",
                      },
                      width: "80px",
                      borderRadius: "15px",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Drawer>

        {/* new drawer for edit */}
        <Drawer
          anchor="right"
          open={isNewDrawerOpen}
          onClose={handleNewDrawerClose}
          PaperProps={{
            id: "tag-drawer",
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : 500,
              maxWidth: "100%",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
            },
          }}
        >
          <Box
            sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}
            role="presentation"
          >
            <Box>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "15px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <Typography variant="h6">
                  <b>Update client-facing job status template</b>
                </Typography>
                <IoClose
                  onClick={handleNewDrawerClose}
                  style={{ cursor: "pointer" }}
                />
              </Box>

              <Box m={3}>
               
 <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  {/* Color Selection */}
                  <Box sx={{ flex: 1 }}>
                    <InputLabel sx={{ color: "black" }}>Color</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        size="small"
                        sx={{
                          width: "100%",
                          backgroundColor: "#fff",
                          mt: 2,
                        }}
                        value={selectedColor}
                        onChange={handleColorChange}
                        renderValue={(selected) =>
                          selected ? (
                            <Chip
                              sx={{
                                backgroundColor: selected,
                                width: "18px",
                                height: "18px",
                                // borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <span style={{ color: "#9ca3af" }}>Select</span>
                          )
                        }
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 200,
                              overflowY: "auto",
                            },
                          },
                        }}
                      >
                        {colors.map((color) => (
                          <MenuItem key={color} value={color}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: "18px",
                                  height: "18px",
                                  backgroundColor: color,
                                  borderRadius: "50%",
                                }}
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Name Input */}
                  <Box sx={{ flex: 2 }}>
                    <InputLabel sx={{ color: "black" }}>Name</InputLabel>
                    <TextField
                      placeholder="Enter a name"
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "#fff",
                        mt: 2,
                      }}
                      value={clientFacingName}
                      onChange={(e) => setClientFacingName(e.target.value)}
                    />
                  </Box>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                <InputLabel sx={{ color: "black" }}>
                    Status description for client
                  </InputLabel>
                 
                        <TextField
  sx={{ marginTop: 2 }}
  fullWidth
  size="small"
  placeholder="Status description for client"
  multiline

  rows={5}
  value={clientFacingDescription}
  onChange={(e) => setClientFacingDescription(e.target.value)}
  inputProps={{ maxLength: 200 }}
  helperText={`${clientFacingDescription.length}/200`}
/>
                </Box>

                <Box
                  sx={{ pt: 5, display: "flex", alignItems: "center", gap: 5 }}
                >
                  <Button
                    onClick={handleupdateclientstatus}
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                      width: "80px",
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleNewDrawerClose}
                    sx={{
                      borderColor: "var(--color-border-cancel-btn)", // Normal background
                      color: "var(--color-save-btn)",
                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                        color: "#fff",
                        border: "none",
                      },
                      width: "80px",
                      borderRadius: "15px",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default Clientfacing;


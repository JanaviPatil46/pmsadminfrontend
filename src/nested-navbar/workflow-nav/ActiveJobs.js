import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
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
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GoDotFill } from "react-icons/go";
import EditJobDrawer from "../../Workflow/updateJobCard";
const ActiveJobs = () => {
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const [jobData, setJobData] = useState([]);
  const { data } = useParams();
 const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    fetchJobList(data);
  }, [data]);

  const fetchJobList = (data) => {
    const url = `${JOBS_API}/workflow/jobs/job/joblist/list/true/${data}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setJobData(result.jobList || []);
      })
      .catch((error) => {
        console.error("Error fetching job list:", error);
      });
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Formats date as dd/mm/yyyy
  };
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for menu
  const [selectedJobId, setSelectedJobId] = useState(null); // Store selected Job ID
  const handleSettingsClick = (event, jobId) => {
    setAnchorEl(event.currentTarget); // Open the menu
    setSelectedJobId(jobId); // Store the selected job ID
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Close the menu
  };

  
  const [actionType, setActionType] = useState(""); // Archive or Delete
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state
  const openConfirmationDialog = (type) => {
    setActionType(type);
    setIsDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmAction = () => {
    if (actionType === "archive") {
      handleArchive();
    } else if (actionType === "delete") {
      handleDelete();
    }
    handleCloseDialog();
  };

  const handleArchive = () => {
    if (!selectedJobId) return;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ active: false });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const archiveUrl = `${JOBS_API}/workflow/jobs/job/${selectedJobId}`;

    fetch(archiveUrl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Archive result:", result);
        setJobData((prevJobs) =>
          prevJobs.filter((job) => job.id !== selectedJobId)
        ); // Remove archived job from the table
      })
      .catch((error) => {
        console.error("Error archiving job:", error);
      });
  };

  const handleDelete = () => {
    if (!selectedJobId) return;

    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    const deleteUrl = `${JOBS_API}/workflow/jobs/job/${selectedJobId}`;

    fetch(deleteUrl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Delete result:", result);
        setJobData((prevJobs) =>
          prevJobs.filter((job) => job.id !== selectedJobId)
        ); // Remove deleted job from the table
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
      });
  };

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
     const [editJobId, setEditJobId] = useState(null);
     const handleEditJobCard = (jobId) => {
        setEditJobId(jobId);
        setIsDrawerOpen(true);
      };
         const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
          const [accountData, setAccountData] = useState([]);
      
          useEffect(() => {
            fetchAccountData();
          }, []);
      
          const fetchAccountData = async () => {
            try {
              const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails`);
              const data = await response.json();
              setAccountData(data.accounts);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
      
          // Create account options
          const accountOptions = accountData.map((account) => ({
            value: account._id,
            label: account.accountName,
          }));

            const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
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
                  console.log(data);
                  setPipelineData(data.pipeline || []);
                } catch (error) {
                  console.error("Error fetching data:", error);
                }
              };
          
              const optionpipeline = pipelineData.map((pipeline) => ({
                value: pipeline._id,
                label: pipeline.pipelineName,
              }));
              const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
                 const [tags, setTags] = useState([]);
                
                  useEffect(() => {
                    fetchTagData();
                  }, []);
              
                  const fetchTagData = async () => {
                    try {
                      const response = await fetch(`${TAGS_API}/tags/`);
                      const data = await response.json();
                      setTags(data.tags);
                    } catch (error) {
                      console.error("Error fetching data:", error);
                    }
                  };
                  
                  
                  const tagoptions = tags.map((tag) => ({
                    value: tag._id,
                    label: tag.tagName,
                    colour: tag.tagColour,
              
                    customTagStyle: {
                      backgroundColor: tag.tagColour,
                      color: "#fff",
                      borderRadius: "8px",
                      alignItems: "center",
                      textAlign: "center",
                      marginBottom: "5px",
                      padding: "2px,8px",
              
                      fontSize: "10px",
                      // width: `${calculateWidth(tag.tagName)}px`,
                      margin: "7px",
                    },
                  }));
                   useEffect(() => {
                        fetchUserData();
                      }, []);
                      const [userData, setUserData] = useState([]);
                     
                      const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
                      const fetchUserData = async () => {
                        try {
                          const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
                          const response = await fetch(url);
                          const data = await response.json();
                          setUserData(data);
                        } catch (error) {
                          console.error("Error fetching data:", error);
                        }
                      };
                      const useroptions = userData.map((user) => ({
                        value: user._id,
                        label: user.username,
                      }));
                      const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
                       const [clientFacingJobs, setClientFacingJobs] = useState([]);
                          const fetchClientFacingJobsData = async () => {
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
      }
    };
    const optionstatus = clientFacingJobs.map((status) => ({
      value: status._id,
      label: status.clientfacingName,
      clientfacingColour: status.clientfacingColour,
    }));
     // useEffect to fetch jobs when the component mounts
        useEffect(() => {
          fetchClientFacingJobsData();
        }, []);
  return (
    <Box sx={{ padding: 2 }}>
      <TableContainer component={Paper}>
        <Table sx={{width:'100%'}}>
          <TableHead>
            <TableRow>
              <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="200">Name</TableCell>
              <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="200">Job Assignee(s)</TableCell>
              <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="200">Pipeline</TableCell>
              <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Stage</TableCell>
              <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Starts In</TableCell>
              <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Due In</TableCell>
              <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Status</TableCell>
              <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Settings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobData.map((job) => (
              <TableRow key={job.id}>
                <TableCell style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",cursor:"pointer"
                        }}  onClick={() => handleEditJobCard(job.id)}>{job.Name}</TableCell>
                <TableCell style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}>{job.JobAssignee.join(", ")}</TableCell>
                <TableCell style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}>{job.Pipeline}</TableCell>
                <TableCell style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}>{job.Stages?.map(stage => stage.name).join(", ")}</TableCell>
               
                <TableCell style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}>{formatDate(job.StartDate)}</TableCell>
                <TableCell style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}>{formatDate(job.DueDate)}</TableCell>
<TableCell style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}>
                  {job.ClientFacingStatus ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <GoDotFill
                        style={{
                          color: job.ClientFacingStatus.statusColor,
                          fontSize: "25px",
                        }}
                      />
                      <span>{job.ClientFacingStatus.statusName}</span>
                    </Box>
                  ) : (
                    ""
                  )}
                </TableCell>
                 <TableCell style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}>
                  <IconButton
                     onClick={(event) => handleSettingsClick(event, job.id)}
                    aria-label="Settings"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
       <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => openConfirmationDialog("archive")}>Archive</MenuItem>
        <MenuItem onClick={() => openConfirmationDialog("delete")}>Delete</MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionType} this job?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleConfirmAction} color="primary">
            Confirm
          </Button>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <EditJobDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        jobId={editJobId}
        // fetchJobData={fetchJobList}
        fetchJobData={()=> fetchJobList(data)}
        accountOptions={accountOptions}
        pipelineOptions={optionpipeline}
        tagOptions={tagoptions}
        userOptions={useroptions}
        clientFacingOptions={optionstatus}
        theme={theme}
        isSmallScreen={isSmallScreen}
      />
    </Box>
  );
};

export default ActiveJobs;

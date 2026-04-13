import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { X, MoreVertical, Trash2, ArchiveRestore, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Switch } from "../../components/ui/switch";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import Priority from "../../Templates/Priority/Priority";
import Editor from "../../Templates/Texteditor/Editor";
import UpdateJob from "../UpdateJob";
import { GoDotFill } from "react-icons/go";
import TagsMultiSelectDropDown from "../../Templates/TagsMultiSelectDropDown";
import MultiSelectDropdown from "../../Templates/MultiSelectDropdown";
const Example = ({ charLimit = 4000 }) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: "auto",
      },
    },
  };
   const navigate = useNavigate();
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  // const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  // Responsive handled via Tailwind
  const [jobData, setJobData] = useState([]);
  const [isActiveTrue, setIsActiveTrue] = useState(false);

  const [activeButton, setActiveButton] = useState("active");

  const handleActiveClick = () => {
    setIsActiveTrue(true);
    setActiveButton("active");
    fetchData(true);
    console.log("Active action triggered.");
  };
  const handleArchivedClick = () => {
    setIsActiveTrue(false);
    setActiveButton("archived");
    fetchData(false);
    console.log("Archive action triggered.");
  };
    const [userRole, setUserRole] = useState("");
    useEffect(() => {
      const storedUserRole = localStorage.getItem("userRole");
      console.log("Fetched userRole from localStorage:", storedUserRole);
      setUserRole(storedUserRole);
    }, []);
  useEffect(() => {
    if (userRole) {
      fetchData();
    }
  }, [userRole,isActiveTrue]);
  // const fetchData = async () => {
  //   try {
  //     const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  //     console.log("Received stored teamMemberData:", storedData);
  //     const loginuserid = storedData?.teammember?.userid;
  //     console.log("User role is:", userRole);

  //     let url = userRole === "Admin"
  //     ? `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}`
  //     : `${JOBS_API}/workflow/jobs/joblist/list/${loginuserid}/${isActiveTrue}`;
      
  //     const jobListResponse = await axios.get(url);
  //     // const jobListResponse = await axios.get(
  //     //   `${JOBS_API}/workflow/jobs/job/joblist/list/${isActive}`
  //     // );
  //     const formattedData = jobListResponse.data.jobList.map((job) => ({
  //       ...job,
  //       // StartDate: format(new Date(job.StartDate), "MMMM dd, yyyy"),
  //       // DueDate: format(new Date(job.DueDate), "MMMM dd, yyyy"),
  //       StartDate: job.StartDate
  //         ? format(new Date(job.StartDate), "MMMM dd, yyyy")
  //         : "",
  //       DueDate: job.DueDate
  //         ? format(new Date(job.DueDate), "MMMM dd, yyyy")
  //         : "",
  //       updatedAt: formatDistanceToNow(new Date(job.updatedAt), {
  //         addSuffix: true,
  //       }),
  //       JobAssignee: Array.isArray(job.JobAssignee)
  //         ? job.JobAssignee.join(", ")
  //         : job.JobAssignee,
  //       // clientfacingstatus: job.ClientFacingStatus?.statusName,
  //       clientfacingstatus: {
  //         statusName: job.ClientFacingStatus?.statusName || "",
  //         statusColor: job.ClientFacingStatus?.statusColor || "", // default color if undefined
  //       },
  //     }));
  //     setJobData(formattedData);
  //     console.log(formattedData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // Define the filter function

  // account
 
 
 
 
 const [filterStatus, setFilterStatus] = useState("active"); 
 
  const fetchData = async () => {
    try {
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      console.log("Received stored teamMemberData:", storedData);
  
      const loginuserid = storedData?.teammember?.userid;
      
      const viewAllAccounts = storedData?.teammember?.viewallAccounts;
  
      console.log("User role is:", userRole);
      console.log("access:", viewAllAccounts);
  
      let url = "";
  
      if (userRole === "Admin") {
        // Admin fetches all jobs
        url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}`;
      } else if (userRole === "TeamMember") {
        if (!viewAllAccounts) {
          // If TeamMember has no access, do not fetch data
          alert("You do not have permission to view accounts.");
          setJobData([]); // Set empty job data
          return;
        }
  
        // Fetch accounts linked to the user
        const accountsResponse = await axios.get(`https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=${filterStatus === "active"}`);
        const accountsData = accountsResponse.data.accountlist;
        console.log(accountsData);
  
        if (!accountsData || accountsData.length === 0) {
          console.warn("No accounts found for user.");
          setJobData([]); // Set empty job data
          return;
        }
  
        // Extract account IDs and form a query string
        const accountIds = accountsData.map(account => account._id).join(",");
  
        // Fetch jobs based on retrieved account IDs
        url = `${JOBS_API}/workflow/jobs/job/joblist/list/true/${accountIds}`;
      }
  
      // If no URL is set, exit
      if (!url) return;
  
      // Fetch job data
      const jobListResponse = await axios.get(url);
      const formattedData = jobListResponse.data.jobList.map((job) => ({
        ...job,
        StartDate: job.StartDate ? format(new Date(job.StartDate), "MMMM dd, yyyy") : "",
        DueDate: job.DueDate ? format(new Date(job.DueDate), "MMMM dd, yyyy") : "",
        updatedAt: formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true }),
        JobAssignee: Array.isArray(job.JobAssignee) ? job.JobAssignee.join(", ") : job.JobAssignee,
        clientfacingstatus: {
          statusName: job.ClientFacingStatus?.statusName || "",
          statusColor: job.ClientFacingStatus?.statusColor || "",
        },
      }));
  
      setJobData(formattedData);
      console.log(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

  // pipeline
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const [pipelineData, setPipelineData] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [piplineid, setPipelineId] = useState();
  const [pipelineIdData, setPipelineIdData] = useState();
  const [stages, setstages] = useState();

  useEffect(() => {
    fetchPipelineDataid();
  }, []);

  const fetchPipelineDataid = async (piplineid) => {
    try {
      const response = await fetch(
        `${PIPELINE_API}/workflow/pipeline/pipeline/${piplineid}`
      );
      const data = await response.json();

      setPipelineIdData(data.pipeline);

      if (data.pipeline && data.pipeline.stages) {
        const stagesdata = data.pipeline.stages.map((stage) => ({
          value: stage._id,
          label: stage.name,
        }));
        setstages(stagesdata);
        // setSelectedstage(stagesdata[0]);
        console.log(stagesdata);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
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
      setPipelineData(data.pipeline || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const optionpipeline = pipelineData.map((pipeline) => ({
    value: pipeline._id,
    label: pipeline.pipelineName,
  }));

  const handlePipelineChange = (selectedOptions) => {
    setSelectedPipeline(selectedOptions);
    fetchPipelineDataid(selectedOptions.value);
  };

  // const [selectedStage, setSelectedStage] = useState(null);
  const [stagesoptions, setStagesOptions] = useState([]);
  const [selectedstage, setSelectedstage] = useState("");
  const handleStageChange = (selectedOptions) => {
    setSelectedstage(selectedOptions);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };
  const handleEditorChange = (content) => {
    setDescription(content);
  };

  //Tag FetchData ================
  const [tags, setTags] = useState([]);
  const [combinedTagsValues, setCombinedTagsValues] = useState([]);
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
  //  for tags
  const calculateWidth = (label) => {
    const textWidth = label.length * 8;
    return Math.min(textWidth, 200);
  };
  const calculateWidthOptions = (label) =>
    `${Math.max(label.length * 8, 90)}px`;
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

  const [selectedTags, setSelectedTags] = useState([]);
  const [dataAccountjob, setDataAccountjob] = useState();

  const handleTagChange = (event, newValue) => {
    setSelectedTags(newValue); // Keep the full tag objects

    // Send only the values to your backend
    const tagValues = newValue.map((option) => option.value);
    console.log("Selected Values:", tagValues);

    // Assuming setCombinedTagsValues is a function to send the values to your backend
    setCombinedTagsValues(tagValues);
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  const [userData, setUserData] = useState([]);
  const [selecteduser, setSelectedUser] = useState();
  const [combinedValues, setCombinedValues] = useState([]);
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
  // for autocomplete
  // const handleUserChange = (event, selectedOptions) => {
  //   setSelectedUser(selectedOptions);
  //   const selectedValues = selectedOptions.map((option) => option.value);
  //   setCombinedValues(selectedValues);
  // };
  
  
  
  const handleUserChange = (event) => {
    const selectedValues = event.target.value; // This will be an array of selected values
    console.log("Selected Values:", selectedValues);
  
    // Update the state with the selected values
    setSelectedUser(selectedValues);
  
    // If you need to map the selected values to their corresponding IDs or other properties
    const selectedAccountDetails = userData.filter((user) =>
      selectedValues.includes(user.username)
    );
  
    const selectedAccountIds = selectedAccountDetails.map((account) => account._id);
    console.log("Selected Account IDs:", selectedAccountIds);
  
    // Update combined account values if needed
    setCombinedValues(selectedAccountIds);
  };
  
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleDueDateChange = (date) => {
    setDueDate(date);
  };
  const [accountId, setAccountId] = useState();
  const [jobid, setjobid] = useState();
     const [selectedAccount, setSelectedAccount] = useState(null);
  const handleClick = async (id) => {
    console.log(id);
    setjobid(id);
    try {
      const url = `${JOBS_API}/workflow/jobs/job/joblist/listbyid/${id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setSelectedJob(data.jobList);
      console.log(data.jobList);
      if (data.jobList.Account && data.jobList.Account.length > 0) {
        const { _id, accountName } = data.jobList.Account[0];
        console.log("Account ID:", _id);
        console.log("Account Name:", accountName);
        setSelectedAccount(accountName);
      } 
      if (data.jobList && data.jobList.Pipeline) {
        const pipelineData = {
          value: data.jobList.Pipeline._id,
          label: data.jobList.Pipeline.Name,
        };
        setSelectedPipeline(pipelineData);
        console.log(pipelineData);
        setPipelineId(data.jobList.Pipeline._id);
        console.log(data.jobList.Pipeline._id);
        fetchPipelineDataid(data.jobList.Pipeline._id);
      }
      setDueDate(dayjs(data.jobList.DueDate) || null);
      // (dayjs(tempvalues.startdate) || null)
      setStartDate(dayjs(data.jobList.StartDate) || null);
      if (data.jobList && data.jobList.Stage && data.jobList.Stage.length > 0) {
        const stageData = {
          value: data.jobList.Stage[0]._id, // Access first element of array
          label: data.jobList.Stage[0].name,
        };
        setSelectedstage(stageData);
        console.log("stages", stageData);
      }
      setPriority(data.jobList.Priority);
      setDescription(data.jobList.Description);
      setClientFacingStatus(data.jobList.ShowinClientPortal);
      setInputText(data.jobList.jobClientName);
      setClientDescription(data.jobList.ClientFacingDecription);
      if (data.jobList.ClientFacingStatus && data.jobList.ClientFacingStatus) {
        const clientStatusData = {
          value: data.jobList.ClientFacingStatus._id,
          label: data.jobList.ClientFacingStatus.clientfacingName,
          clientfacingColour:
            data.jobList.ClientFacingStatus.clientfacingColour,
        };

        setSelectedjob(clientStatusData);
      }

      if (data.jobList && data.jobList.Account) {
        setDataAccountjob(data.jobList.Account[0].accountName);
      }

      if (data.jobList && data.jobList.Account) {
        console.log(data.jobList.Account[0]._id);
        setAccountId(data.jobList.Account[0]._id);
        console.log(data.jobList.Account[0].tags);
        const tagsData = data.jobList.Account[0].tags
          .flatMap((tagArray) => tagArray)
          .map((tag) => ({
            value: tag._id,
            label: tag.tagName,
            colour: tag.tagColour,
          }));
        setSelectedTags(tagsData);
        const selectedValues = tagsData.map((option) => option.value);
        setCombinedTagsValues(selectedValues);
      }
      if (data.jobList && data.jobList.Account) {
        const tags = data.jobList.Account[0].tags.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour,

          customStyle: {
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

        // setSelectedTags(tags);
        console.log(tags);
      }
      // if (data.jobList && data.jobList.JobAssignee) {
      //   const assigneesData = data.jobList.JobAssignee.map((assignee) => ({
      //     value: assignee._id,
      //     label: assignee.username,
      //   }));

      //   setSelectedUser(assigneesData);
      //   const selectedValues = assigneesData.map((option) => option.value);
      //   setCombinedValues(selectedValues);
      // }

      const jobAssignees = data.jobList.JobAssignee.map((assignee) => assignee.username);
      setSelectedUser(jobAssignees);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // console.log(selectedTags)
  const handleSubmit = (id) => {
    // setjobid(id);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      active: !isActiveTrue,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${JOBS_API}/workflow/jobs/job/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        fetchData()
        handleClose()
        // console.log(result.updatedAccount); // Log the result
        // setAccountId(result.updatedAccount._id);
        toast.success("Job updated successfully"); // Display success toast
        navigate("/jobs/activejob");
      })
      .catch((error) => {
        console.error(error); // Log the error
        toast.error("An error occurred while submitting the form"); // Display error toast
      });
  };
  const handleDelete = () => {
    handleClose();
    handleDeleteJob(selectedJob);
    console.log("Deleted:", selectedJob);
  };
  // const handleDeleteJob = (id) => {
  //   console.log(id);
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this job? This action cannot be undone."
  //   );
  //   if (!confirmDelete) return;
  //   setjobid(id);
  //   const requestOptions = {
  //     method: "DELETE",
  //     redirect: "follow",
  //   };

  //   fetch(`${JOBS_API}/workflow/jobs/job/` + id, requestOptions)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to delete item");
  //       }
  //       return response.json();
  //     })
  //     .then((result) => {
  //       // console.log(result);
  //       toast.success("Job deleted successfully");
  //       fetchData();
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       toast.error("Failed to delete item");
  //     });
  // };
  // console.log(selectedTags);

  const handleDeleteJob = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected jobs? This action cannot be undone."
    );
    if (isConfirmed) {
      try {
        // Make delete requests for each selected job
        await Promise.all(
          selected.map((id) =>
            fetch(`${JOBS_API}/workflow/jobs/job/` + id, {
              method: "DELETE",
              redirect: "follow",
            })
          )
        );

        // Optionally, you can remove the deleted jobs from the UI (if needed)
        // If you're using jobData in state, for example:
        // setJobData((prevJobs) => prevJobs.filter((job) => !selected.includes(job.id)));

        toast.success("Job deleted successfully!");
        setSelected([]); // Clear the selected jobs
        fetchData(true); // Refresh the data after deletion
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete selected jobs");
      }
    }
  };
  const handleEditClick = (action) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    // Set "active" to false if "Archive" is selected, or true if "Make Active" is selected
    const raw = JSON.stringify({
      active: action === "Archive" ? false : true,
    });
  
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    // Assuming you're passing the row.id or jobId to the function to update the specific job
    fetch(`${JOBS_API}/workflow/jobs/job/${selectedJob}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setOpenMenuId(null);
        if (action === "Archive") {
          handleArchivedClick(); // Call the handleArchivedClick function
        } else if (action === "Make Active") {
          handleActiveClick(); // Call the handleActiveClick function
        }
        setSelectedJob(null);
      })
      .catch((error) => console.error(error));
  };
  
  // const columns = useMemo(
  //   () => [
  //     {
  //       accessorKey: "Name",
  //       header: "Name",

  //       Cell: ({ row }) => (
  //         <span style={{ cursor: "pointer", color: "blue" }} onClick={() => handleClick(row.original.id)}>
  //           {row.original.Name}
  //         </span>
  //       ),
  //     },

  //     { accessorKey: "JobAssignee", header: "Job Assignee", size: 150 },
  //     {
  //       accessorKey: "Pipeline",
  //       header: "Pipeline",
  //       size: 200,
  //     },
  //     {
  //       accessorKey: "Stage",
  //       header: "Stage",
  //       size: 150,
  //     },
  //     {
  //       accessorKey: "Account",
  //       header: "Account",
  //       size: 150,
  //     },
  //     {
  //       accessorKey: "clientfacingstatus",
  //       header: "client-facing status",
  //       size: 200,
  //       Cell: ({ row }) => {
  //         const { statusName, statusColor } = row.original.clientfacingstatus || {}; // Use default destructuring to handle undefined
  //         return (
  //           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //             {statusName && <GoDotFill style={{ color: statusColor, fontSize: "25px" }} />}
  //             <span>{statusName}</span>
  //           </Box>
  //         );
  //       },
  //     },
  //     // clientfacingstatus
  //     {
  //       accessorKey: "StartDate",
  //       header: "Start Date",
  //       size: 150,
  //       // Cell: ({ value }) => (value === "null" ? "null" : value),
  //     },
  //     {
  //       accessorKey: "DueDate",
  //       header: "Due Date",
  //       size: 150,
  //       // Cell: ({ value }) => (value === "null" ? "null" : value),
  //     },
  //     {
  //       accessorKey: "updatedAt",
  //       header: "Time in current stage",
  //       size: 150,
  //     },
  //     {
  //       accessorKey: "Settings",
  //       header: "Settings",
  //       size: 100,
  //       Cell: ({ row }) => {
  //         const [anchorEl, setAnchorEl] = useState(null);

  //         const handleMenuClick = (event) => {
  //           setAnchorEl(event.currentTarget);
  //         };

  //         const handleClose = () => {
  //           setAnchorEl(null);
  //         };

  //         const handleArchive = () => {
  //           handleClose();
  //           handleSubmit(row.original.id);
  //           console.log("Archived:", row.original.id);
  //         };

  //         const handleDelete = () => {
  //           handleClose();
  //           handleDeleteJob(row.original.id);
  //           // Add logic to delete by ID here
  //           console.log("Deleted:", row.original.id);
  //         };

  //         return (
  //           <>
  //             <IconButton onClick={handleMenuClick}>
  //               <MoreVertIcon />
  //             </IconButton>
  //             <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
  //               <MenuItem onClick={handleArchive}>{isActiveTrue ? "Archive " : "Make Active"}</MenuItem>
  //               <MenuItem onClick={handleDelete}>Delete</MenuItem>
  //             </Menu>
  //           </>
  //         );
  //       },
  //     },
  //   ],
  //   [optionpipeline, accountOptions]
  // );

  const [openMenuId, setOpenMenuId] = useState(null);

  const handleMenuClick = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };
  const handleClose = () => {
    setOpenMenuId(null);
    setSelectedJob(null);
  };

  // const table = useMaterialReactTable({
  //   columns,
  //   data: jobData,
  //   enableBottomToolbar: true,
  //   enableStickyHeader: true,
  //   columnFilterDisplayMode: "custom",
  //   enableRowSelection: true,
  //   enablePagination: true,
  //   muiTableContainerProps: { sx: { maxHeight: "400px" } },
  //   initialState: {
  //     columnPinning: { left: ["mrt-row-select", "Name"] },
  //   },
  //   muiTableBodyCellProps: {
  //     sx: (theme) => ({
  //       backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[50],
  //     }),
  //   },
  // });

  const handleSaveClick = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipeline: selectedPipeline.value,
      stageid: selectedstage.value,
      jobassignees: combinedValues,
      priority: priority,
      description: description,
      startdate: startDate,
      enddate: dueDate,
    });

    console.log(raw);
    // /job
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(jobid);
    fetch(`${JOBS_API}/workflow/jobs/job/` + jobid, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        // Handle success
        toast.success("Job Template updated successfully");
        // setIsDrawerOpen(false);
        fetchData();
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        toast.error("Failed to update Job Template");
      });
  };
  const handleSaveExitClick = () => {
    updatejobdata();
    handleSaveTags();
  };
  console.log(accountId);
  const handleSaveTags = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      tags: combinedTagsValues,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${ACCOUNT_API}/accounts/accountdetails/${accountId}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        console.log(result.updatedAccount); // Log the result
      })
      .catch((error) => {
        console.error(error); // Log the error
        toast.error("An error occurred while submitting the form"); // Display error toast
      });
  };
  const handleFormClose = () => {
    setIsDrawerOpen(false);
  };
  const updatejobdata = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipeline: selectedPipeline.value,
      stageid: selectedstage.value,
      jobassignees: combinedValues,

      priority: priority,
      description: description,
      startdate: startDate,
      enddate: dueDate,
      showinclientportal: clientFacingStatus,
      jobnameforclient: inputText,
      clientfacingstatus: selectedjob?.value,
      clientfacingDescription: clientDescription,
    });

    console.log(raw);
    // /job
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(jobid);
    fetch(`${JOBS_API}/workflow/jobs/job/` + jobid, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        // Handle success
        toast.success("Job Template updated successfully");
        setIsDrawerOpen(false);
        fetchData();
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        toast.error("Failed to update Job Template");
      });
  };

  const [clientFacingStatus, setClientFacingStatus] = useState(false);
  const [selectedJobShortcut, setSelectedJobShortcut] = useState("");
  const [anchorElClientJob, setAnchorElClientJob] = useState(null);
  const [anchorElDescription, setAnchorElDecription] = useState(null);
  const [inputText, setInputText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [clientDescription, setClientDescription] = useState("");
  const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
  const [showDropdownDescription, setShowDropdownDescription] = useState(false);
  const [selectedjob, setSelectedjob] = useState(null);
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

  const handleJobChange = async (event, newValue) => {
    setSelectedjob(newValue);

    if (newValue && newValue.value) {
      const clientjobId = newValue.value;
      try {
        const response = await fetch(
          `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${clientjobId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log(data);
        setClientDescription(
          data.clientfacingjobstatuses.clientfacingdescription
        );
        console.log(data.clientfacingjobstatuses.clientfacingdescription);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleDescriptionAddShortcut = (shortcut) => {
    const updatedTextValue = clientDescription + `[${shortcut}]`;
    if (updatedTextValue.length <= charLimit) {
      setClientDescription(updatedTextValue);
      setCharCount(updatedTextValue.length);
    }
    setShowDropdownDescription(false);
  };
  const handlechatsubject = (e) => {
    const { value } = e.target;
    setInputText(value);
  };
  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length <= charLimit) {
      setClientDescription(value);
      setCharCount(value.length);
    }
  };
  const handleClientFacing = (checked) => {
    setClientFacingStatus(checked);
  };

  const handleJobAddShortcut = (shortcut) => {
    setInputText((prevText) => prevText + `[${shortcut}]`);
    setShowDropdownClientJob(false);
  };

  const toggleShortcodeDropdown = (event) => {
    setAnchorElClientJob(event.currentTarget);
    setShowDropdownClientJob(!showDropdownClientJob);
  };
  const toggleDescriptionDropdown = (event) => {
    setAnchorElDecription(event.currentTarget);
    setShowDropdownDescription(!showDropdownDescription);
  };
  const [selectedRows, setSelectedRows] = useState({});

  // Handle individual checkbox changes
  const handleCheckboxChange = (id) => {
    setSelectedRows((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Handle the "select all" checkbox change
  const handleSelectAllChange = (event) => {
    const checked = event.target.checked;
    const newSelectedRows = checked
      ? jobData.reduce((acc, row) => {
          acc[row.id] = true;
          return acc;
        }, {})
      : {};

    setSelectedRows(newSelectedRows);
  };

  const [selected, setSelected] = useState([]);
  const handleSelect = (id) => {
    const currentIndex = selected.indexOf(id);
    const newSelected =
      currentIndex === -1
        ? [...selected, id]
        : selected.filter((item) => item !== id);
    setSelected(newSelected);
    // Log all selected row IDs
    // console.log("Selected IDs:", newSelected); // Log all selected IDs
  };
  // Pagination State
 const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(30);
  
  
     const handleChangePage = (_, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
     // Compute paginated tasks
     const paginatedChats = jobData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  
   const handleActive = () => {
      console.log("Additional Action 1 triggered");
  
      selected.forEach((jobId) => {
        handleActiveJob(jobId);
      });
      toast.success("Jobs activated successfully");
     
      navigate("/jobs/activejob");
    };
  
     const handleActiveJob = (selected) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
          active: !isActiveTrue,
        });
        console.log(raw);
        const requestOptions = {
          method: "PATCH",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        const url = `${JOBS_API}/workflow/jobs/job/${selected}`;
        fetch(url, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);

            // console.log(result.); // Log the result
            // setAccountId(result.updatedAccount._id);
            // toast.success("Form submitted successfully"); // Display success toast
          })
          .catch((error) => {
            console.error(error); // Log the error
            toast.error("An error occurred while submitting the form"); // Display error toast
          });
      };
  
  const columns = [
    { key: "Name", label: "Name", sticky: true },
    { key: "JobAssignee", label: "Job Assignee" },
    { key: "Pipeline", label: "Pipeline" },
    { key: "Stage", label: "Stage" },
    { key: "Account", label: "Account" },
    { key: "ClientFacing", label: "Client-Facing Status" },
    { key: "StartDate", label: "Start Date" },
    { key: "DueDate", label: "Due Date" },
    { key: "updatedAt", label: "Time in Stage" },
  ];

  const renderCell = (row, col) => {
    switch (col.key) {
      case "Name":
        return (
          <button className="text-sm font-medium text-primary hover:underline" onClick={(e) => { e.stopPropagation(); handleClick(row.id); }}>
            {row.Name}
          </button>
        );
      case "ClientFacing":
        return row.clientfacingstatus?.statusName ? (
          <span className="flex items-center gap-1.5 text-sm">
            <GoDotFill style={{ color: row.clientfacingstatus.statusColor, fontSize: "16px" }} />
            {row.clientfacingstatus.statusName}
          </span>
        ) : <span className="text-sm text-muted-foreground">-</span>;
      default:
        return <span className="text-sm text-muted-foreground">{row[col.key] || "-"}</span>;
    }
  };

  return (
    <>
      {/* ===== DRAWER ===== */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative z-50 flex h-full w-full max-w-[600px] flex-col bg-background shadow-2xl animate-in slide-in-from-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold text-foreground">Edit Job</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDrawerOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Account */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Account</label>
                <Input value={selectedAccount || ""} readOnly />
              </div>

              {/* Pipeline */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Pipeline</label>
                <select
                  value={selectedPipeline?.value || ""}
                  onChange={(e) => { const match = optionpipeline.find((p) => p.value === e.target.value); handlePipelineChange(match || null); }}
                  className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Pipeline</option>
                  {optionpipeline.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Account Tags */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Account Tags</label>
                <TagsMultiSelectDropDown value={selectedTags} onChange={handleTagChange} placeholder="Tags" />
              </div>

              {/* Task Assignee */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Task Assignee</label>
                <MultiSelectDropdown value={selecteduser} onChange={handleUserChange} placeholder="Job Assignees" />
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Stage</label>
                <select
                  value={selectedstage?.value || ""}
                  onChange={(e) => { const match = (stages || []).find((s) => s.value === e.target.value); handleStageChange(match || null); }}
                  className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Stage</option>
                  {(stages || []).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <Priority onPriorityChange={handlePriorityChange} selectedPriority={priority} />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Start Date</label>
                  <input type="date" value={startDate ? dayjs(startDate).format("YYYY-MM-DD") : ""} onChange={(e) => handleStartDateChange(e.target.value ? dayjs(e.target.value) : null)} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Due Date</label>
                  <input type="date" value={dueDate ? dayjs(dueDate).format("YYYY-MM-DD") : ""} onChange={(e) => handleDueDateChange(e.target.value ? dayjs(e.target.value) : null)} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              {/* Description */}
              <div>
                <Editor initialContent={description} onChange={handleEditorChange} />
              </div>

              {/* Client-facing status */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Client-facing status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Show in Client portal</span>
                    <Switch checked={clientFacingStatus} onCheckedChange={handleClientFacing} />
                  </div>
                </div>
                {clientFacingStatus && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Job name for client</label>
                      <Input value={inputText + selectedJobShortcut} onChange={handlechatsubject} placeholder="Job name for client" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
                      <select
                        value={selectedjob?.value || ""}
                        onChange={(e) => { const match = optionstatus.find((s) => s.value === e.target.value); handleJobChange(e, match || null); }}
                        className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select Client Facing Job</option>
                        {optionstatus.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                      <textarea
                        value={clientDescription}
                        onChange={handleChange}
                        placeholder="Description"
                        rows={3}
                        className="flex w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                      <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">{charCount}/{charLimit}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="flex items-center gap-3 px-5 py-4 border-t bg-muted/30">
              <Button onClick={handleSaveExitClick}>Save & Exit</Button>
              <Button onClick={handleSaveClick}>Save</Button>
              <Button variant="outline" onClick={handleFormClose}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ACTION BAR ===== */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2 mb-3">
          <span className="text-sm font-medium text-muted-foreground">{selected.length} selected</span>
          <button onClick={handleActive} className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors">
            <ArchiveRestore className="h-4 w-4" /> Make Active
          </button>
          <Button variant="ghost" size="icon" onClick={handleDeleteJob} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="space-y-3">
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="sticky left-0 z-10 bg-muted/40 w-10 px-3 py-3">
                    <Checkbox
                      checked={jobData.length > 0 && selected.length === jobData.length}
                      onCheckedChange={(checked) => {
                        if (checked) { setSelected(jobData.map((item) => item.id)); } else { setSelected([]); }
                      }}
                    />
                  </th>
                  {columns.map((col) => (
                    <th key={col.key} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap ${col.sticky ? "sticky left-10 z-10 bg-muted/40" : ""}`}>
                      {col.label}
                    </th>
                  ))}
                  <th className="sticky right-0 z-10 bg-muted/40 w-14 px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedChats.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 2} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No archived jobs found.
                    </td>
                  </tr>
                ) : (
                  paginatedChats.map((row) => {
                    const isSelected = selected.includes(row.id);
                    return (
                      <tr key={row.id} onClick={() => handleSelect(row.id)} className={`cursor-pointer transition-colors hover:bg-muted/30 ${isSelected ? "bg-primary/5" : ""}`}>
                        <td className="sticky left-0 z-[5] bg-card px-3 py-2.5">
                          <Checkbox checked={isSelected} onCheckedChange={() => handleSelect(row.id)} />
                        </td>
                        {columns.map((col) => (
                          <td key={col.key} className={`px-4 py-2.5 whitespace-nowrap ${col.sticky ? "sticky left-10 z-[5] bg-card" : ""}`}>
                            {renderCell(row, col)}
                          </td>
                        ))}
                        <td className="sticky right-0 z-[5] bg-card px-2 py-2.5">
                          <DropdownMenu open={openMenuId === row.id} onOpenChange={(open) => setOpenMenuId(open ? row.id : null)}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleMenuClick(row.id); }}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSubmit(row.id); }}>Make Active</DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleClose(); handleDeleteJob(); }} className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page:</span>
            <select value={rowsPerPage} onChange={handleChangeRowsPerPage} className="rounded border border-input bg-white px-2 py-1 text-sm">
              {[30, 40, 50, 60, 100].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, jobData.length)} of {jobData.length}</span>
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button>
            <Button variant="outline" size="sm" disabled={(page + 1) * rowsPerPage >= jobData.length} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Example;
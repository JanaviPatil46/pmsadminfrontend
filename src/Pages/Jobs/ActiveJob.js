import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { X, MoreVertical, Trash2, Archive, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import Priority from "../../Templates/Priority/Priority";
import Editor from "../../Templates/Texteditor/Editor";
import { GoDotFill } from "react-icons/go";
import TagsMultiSelectDropDown from "../../Templates/TagsMultiSelectDropDown";
import MultiSelectDropdown from "../../Templates/MultiSelectDropdown";
import FilterDropdown from "./JobFilter";
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
  const [isActiveTrue, setIsActiveTrue] = useState(true);

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
  }, [userRole, isActiveTrue]);

  const [loading, setLoading] = useState(false); // Loader state
 
// const fetchData = async () => {
//   setLoading(true); // Start loading
//   const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));

//   try {
//     const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
//     console.log("Received stored teamMemberData:", storedData);

//     const loginuserid = storedData?.teammember?.userid;
//     const viewAllAccounts = storedData?.teammember?.viewallAccounts;

//     console.log("User role is:", userRole);
//     console.log("access:", viewAllAccounts);

//     let url = "";

//     if (userRole === "Admin") {
//       // Admin fetches all jobs
//       url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}`;
//     } 
    
//     else if (userRole === "TeamMember") {
//       if (viewAllAccounts) {
//         // TeamMember with full access gets all jobs
//         url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}`;
//       } else {
//         // TeamMember with restricted access → fetch user's accounts
//         const accountsResponse = await axios.get(
//           `${ACCOUNT_API}/accounts/getaccounts/${loginuserid}/${isActiveTrue}`
//         );

//         const accountsData = accountsResponse.data.accountlist;
//         console.log("Accounts fetched:", accountsData);

//         if (!accountsData || accountsData.length === 0) {
//           console.warn("No accounts found for user.");
//           setJobData([]);
//           await loaderDelay;
//           setLoading(false);
//           return;
//         }

//         const accountIds = accountsData.map((account) => account.id).join(",");
//         url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}/${accountIds}`;
//       }
//     }

//     if (!url) {
//       await loaderDelay;
//       setLoading(false);
//       return;
//     }

//     console.log("Fetching jobs from URL:", url);

//     const jobListResponse = await axios.get(url);

//     const formattedData = jobListResponse.data.jobList.map((job) => ({
//       ...job,
//       StartDate: job.StartDate
//         ? format(new Date(job.StartDate), "MMMM dd, yyyy")
//         : "",
//       DueDate: job.DueDate
//         ? format(new Date(job.DueDate), "MMMM dd, yyyy")
//         : "",
//       updatedAt: formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true }),
//       JobAssignee: Array.isArray(job.JobAssignee)
//         ? job.JobAssignee.join(", ")
//         : job.JobAssignee,
//       clientfacingstatus: {
//         statusName: job.ClientFacingStatus?.statusName || "",
//         statusColor: job.ClientFacingStatus?.statusColor || "",
//       },
//     }));

//     setJobData(formattedData);
//     console.log("Formatted Job Data:", formattedData);
//   } 
//   catch (error) {
//     console.error("Error fetching data:", error);
//   } 
//   finally {
//     await loaderDelay;
//     setLoading(false);
//   }
// };

const [filterStatus, setFilterStatus] = useState("active"); 
// const fetchData = async () => {
//   setLoading(true);
//   const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));

//   try {
//     const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
//     console.log("Received stored teamMemberData:", storedData);

//     const loginuserid = storedData?.teammember?.userid;
//     const viewAllAccounts = storedData?.teammember?.viewallAccounts;

//     console.log("User role is:", userRole);
//     console.log("access:", viewAllAccounts);

//     let url = "";

//     if (userRole === "Admin") {
//       // ✅ Fetch active accounts first
//       const accountsResponse = await axios.get(
//         `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`
//       );
// console.log("accountsResponse",accountsResponse)
//       const accountsData = accountsResponse.data.accountlist
// ;
//       console.log("Admin accounts fetched:", accountsData);

//       if (!accountsData || accountsData.length === 0) {
//         console.warn("No active accounts found for Admin.");
//         setJobData([]);
//         await loaderDelay;
//         setLoading(false);
//         return;
//       }

//       const accountIds = accountsData.map((account) => account._id).join(",");
//       url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}/${accountIds}`;
//     } 
    
 
// else if (userRole === "TeamMember") {

//   let accountsData = [];

//   if (viewAllAccounts) {
//     // 🔹 TeamMember WITH view all access → fetch ALL active accounts
//     const accountsResponse = await axios.get(
//       `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`
//     );

//     accountsData = accountsResponse.data.accountlist;
//     console.log("TeamMember (view all) accounts:", accountsData);

//   } else {
//     // 🔹 TeamMember WITHOUT view all access → fetch assigned accounts only
//     const accountsResponse = await axios.get(
//       `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=${filterStatus === "active"}`
//     );

//     accountsData = accountsResponse.data.accountlist;
//     console.log("TeamMember assigned accounts:", accountsData);
//   }

//   // 🔹 Validate accounts
//   if (!accountsData || accountsData.length === 0) {
//     console.warn("No accounts found for TeamMember.");
//     setJobData([]);
//     await loaderDelay;
//     setLoading(false);
//     return;
//   }

//   // 🔹 Map account IDs
//   const accountIds = accountsData.map((account) => account._id).join(",");

//   // 🔹 Prepare URL for jobs
//   url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}/${accountIds}`;

//   console.log("TeamMember Job Fetch URL:", url);
// }

//     if (!url) {
//       await loaderDelay;
//       setLoading(false);
//       return;
//     }

//     console.log("Fetching jobs from URL:", url);

//     const jobListResponse = await axios.get(url);

//     const formattedData = jobListResponse.data.jobList.map((job) => ({
//       ...job,
//       StartDate: job.StartDate
//         ? format(new Date(job.StartDate), "MMMM dd, yyyy")
//         : "",
//       DueDate: job.DueDate
//         ? format(new Date(job.DueDate), "MMMM dd, yyyy")
//         : "",
//       updatedAt: formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true }),
//       JobAssignee: Array.isArray(job.JobAssignee)
//         ? job.JobAssignee.join(", ")
//         : job.JobAssignee,
//       clientfacingstatus: {
//         statusName: job.ClientFacingStatus?.statusName || "",
//         statusColor: job.ClientFacingStatus?.statusColor || "",
//       },
//     }));

//     setJobData(formattedData);
//     console.log("Formatted Job Data:", formattedData);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   } finally {
//     await loaderDelay;
//     setLoading(false);
//   }
// };
const fetchData = async () => {
  setLoading(true);
  const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));

    const loginuserid = storedData?.teammember?.userid;
    const viewAllAccounts = storedData?.teammember?.viewallAccounts;

    console.log("User role:", userRole);
    console.log("View all accounts:", viewAllAccounts);

    // ✅ Declare once (IMPORTANT)
    let accountsData = [];

    /* =======================
       FETCH ACCOUNTS
    ======================= */

    if (userRole === "Admin") {
      const accountsResponse = await axios.get(
        `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`
      );

      accountsData = accountsResponse.data.accountlist || [];
      console.log("Admin accounts:", accountsData);

    } else if (userRole === "TeamMember") {

      if (viewAllAccounts) {
        const accountsResponse = await axios.get(
          `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`
        );

        accountsData = accountsResponse.data.accountlist || [];
        console.log("TeamMember (view all) accounts:", accountsData);

      } else {
        const accountsResponse = await axios.get(
          `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=${filterStatus === "active"}`
        );

        accountsData = accountsResponse.data.accountlist || [];
        console.log("TeamMember assigned accounts:", accountsData);
      }
    }

    // 🔒 Safety check
    if (!accountsData.length) {
      console.warn("No accounts found.");
      setJobData([]);
      return;
    }

    /* =======================
       FETCH JOBS (POST ✅)
    ======================= */

    const jobListResponse = await axios.post(
      `${JOBS_API}/workflow/jobs/job/joblist/list`,
      {
        isActive: isActiveTrue,
        accountIds: accountsData.map(acc => acc._id),
      }
    );

    const formattedData = jobListResponse.data.jobList.map((job) => ({
      ...job,
      StartDate: job.StartDate
        ? format(new Date(job.StartDate), "MMMM dd, yyyy")
        : "",
      DueDate: job.DueDate
        ? format(new Date(job.DueDate), "MMMM dd, yyyy")
        : "",
      updatedAt: formatDistanceToNow(new Date(job.updatedAt), {
        addSuffix: true,
      }),
      JobAssignee: Array.isArray(job.JobAssignee)
        ? job.JobAssignee.join(", ")
        : job.JobAssignee,
      clientfacingstatus: {
        statusName: job.ClientFacingStatus?.statusName || "",
        statusColor: job.ClientFacingStatus?.statusColor || "",
      },
    }));

    setJobData(formattedData);
    console.log("Final job data:", formattedData);

  } catch (error) {
    console.error("Error fetching jobs:", error);
  } finally {
    await loaderDelay;
    setLoading(false);
  }
};

  const [filters, setFilters] = useState({
    jobAssignees: [],
    clientStatus: [],
    pipelineStages: {},
    accountName: "",
    priority: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filter the jobData based on active filters
  const filteredData = useMemo(() => {
    return jobData.filter((job) => {
      // Job Assignees filter
      if (filters.jobAssignees?.length > 0) {
        const jobAssignees = Array.isArray(job.JobAssignee)
          ? job.JobAssignee
          : typeof job.JobAssignee === "string"
            ? job.JobAssignee.split(",").map((a) => a.trim())
            : [];

        if (
          !jobAssignees?.some((assignee) =>
            filters.jobAssignees.includes(assignee)
          )
        ) {
          return false;
        }
      }

      // Client-facing status filter
      if (filters.clientStatus?.length > 0) {
        const status = job.clientfacingstatus?.statusName || "";
        if (!filters.clientStatus.includes(status)) {
          return false;
        }
      }

      // Pipeline and stage filter - updated to match your data structure
    
      // if (Object.keys(filters.pipelineStages).length > 0) {
      //   console.log("job filter by pipeline and stage",filters.pipelineStages);
      //   const pipelineMatch = Object.entries(filters.pipelineStages).some(
      //     ([pipelineName, stageNames]) => {
      //       const jobPipeline = job.Pipeline || "";
      //       if (jobPipeline.toLowerCase() !== pipelineName.toLowerCase()) {
      //         return false;
      //       }

      //       const jobStages = Array.isArray(job.Stage)
      //         ? job.Stage
      //         : [job.Stage || ""];

      //       return stageNames.some((stage) =>
      //         jobStages.some(
      //           (jobStage) => jobStage.toLowerCase() === stage.toLowerCase()
      //         )
      //       );
      //     }
      //   );
      //   console.log("jkhdfds", pipelineMatch);
      //   if (!pipelineMatch) return false;
        
      // }
      if (Object.keys(filters.pipelineStages).length > 0) {
  console.log('Filtering by pipeline/stages:', filters.pipelineStages);
  console.log('Job pipeline:', job.Pipeline);
  console.log('Job stages:', job.Stages?.map(stage => stage.name));
  
  const pipelineMatch = Object.entries(filters.pipelineStages).some(
    ([pipelineName, stageNames]) => {
      const jobPipeline = job.Pipeline || "";
      const pipelineMatches = jobPipeline.toLowerCase() === pipelineName.toLowerCase();
      
      if (!pipelineMatches) return false;

      const jobStageNames = job.Stages?.map(stage => stage.name) || [];
      const stageMatches = stageNames.some((selectedStage) =>
        jobStageNames.some(
          (jobStage) => jobStage.toLowerCase() === selectedStage.toLowerCase()
        )
      );
      
      console.log(`Pipeline "${pipelineName}" matches: ${pipelineMatches}, Stages match: ${stageMatches}`);
      return stageMatches;
    }
  );

  if (!pipelineMatch) return false;
}
      // Account name filter - with null/undefined check
      if (filters.accountName) {
        const accountName = job.Account
          ? String(job.Account).toLowerCase()
          : "";
        if (!accountName.includes(filters.accountName.toLowerCase())) {
          return false;
        }
      }

      // Priority filter - with null/undefined check
      if (filters.priority) {
        const jobPriority = job.Priority || "";
        if (jobPriority !== filters.priority) {
          return false;
        }
      }

      return true;
    });
  }, [jobData, filters]);

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
const [jobName,setJobName]=useState("")
  useEffect(() => {
    fetchPipelineDataid();
  }, [piplineid]);

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
  const [combinedTagsValues, setCombinedTagsValues] = useState();
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

  const [selectedTags, setSelectedTags] = useState([]);
  const [dataAccountjob, setDataAccountjob] = useState();

  const handleTagChange = (newSelectedTags) => {
    setSelectedTags(newSelectedTags);
    console.log(newSelectedTags);
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedTagsValues(selectedValues);
    console.log(selectedValues);
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [combinedValues, setCombinedValues] = useState();
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

  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
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
      setJobName(data.jobList.Name)
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

            margin: "7px",
          },
        }));

        // setSelectedTags(tags);
        console.log(tags);
      }
      if (data.jobList && data.jobList.JobAssignee) {
        const assigneesData = data.jobList.JobAssignee.map((assignee) => ({
          value: assignee._id,
          label: assignee.username,
        }));

        setSelectedUser(assigneesData);
        const selectedValues = assigneesData.map((option) => option.value);
        setCombinedValues(selectedValues);
      }

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
        fetchData();
        handleClose();

        toast.success("Job updated successfully"); // Display success toast
        navigate("/jobs/archivedjob");
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

  const handleDeleteJob = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected jobs? This action cannot be undone."
    );
    if (isConfirmed) {
      try {
        // Make delete requests for each selected job
        await Promise.all(
          selectedIds.map((id) =>
            fetch(`${JOBS_API}/workflow/jobs/job/` + id, {
              method: "DELETE",
              redirect: "follow",
            })
          )
        );

        toast.success("Job deleted successfully!");
        setSelectedIds([]); // Clear the selected jobs
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
        console.log(result);
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

  const [openMenuId, setOpenMenuId] = useState(null);

  const handleMenuClick = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };
  const handleClose = () => {
    setOpenMenuId(null);
    setSelectedJob(null);
  };

  const handleSaveClick = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipeline: selectedPipeline.value,
      stageid: selectedstage.value,
      jobname:jobName,
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
jobname:jobName,
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
        handleSaveTags();
        setIsDrawerOpen(false);
        fetchData();
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        toast.error("Failed to update Job Template");
      });
  };

  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
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
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Compute paginated tasks
  // const paginatedChats = jobData.slice(
  //   page * rowsPerPage,
  //   page * rowsPerPage + rowsPerPage
  // );
  // Update your pagination to use filteredData instead of jobData
  const paginatedChats = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  //
  // Define additional action handlers
  const handleArchive = () => {
    selectedIds.forEach((jobId) => {
      handleArchiveJob(jobId);
    });
    toast.success("Jobs archived successfully");
    setSelectedIds([]);
    navigate("/jobs/archivedjob");
  };

  const handleArchiveJob = (selected) => {
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
  const PRIORITY_CLASSES = {
    urgent: "bg-zinc-950 text-white",
    high:   "bg-red-400 text-white",
    medium: "bg-amber-400 text-white",
    low:    "bg-emerald-400 text-white",
  };

  const tableColumns = useMemo(() => [
    {
      accessorKey: "Name",
      header: "Job Name",
      size: 200,
      cell: ({ row, getValue }) => (
        <button
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors text-left truncate max-w-[180px] block"
          onClick={(e) => { e.stopPropagation(); handleClick(row.original.id); }}
        >
          {getValue() || "—"}
        </button>
      ),
    },
    {
      accessorKey: "JobAssignee",
      header: "Assignee",
      size: 140,
      cell: ({ getValue }) => (
        <span className="text-xs text-foreground/80 truncate block max-w-[130px]">{getValue() || <span className="text-muted-foreground">—</span>}</span>
      ),
    },
    {
      accessorKey: "Pipeline",
      header: "Pipeline",
      size: 130,
      cell: ({ getValue }) => (
        <span className="text-xs text-foreground/80">{getValue() || <span className="text-muted-foreground">—</span>}</span>
      ),
    },
    {
      id: "Stage",
      header: "Stage",
      size: 120,
      enableSorting: false,
      accessorFn: (row) => row.Stages?.name || "",
      cell: ({ getValue }) => (
        <span className="text-xs text-foreground/80">{getValue() || <span className="text-muted-foreground">—</span>}</span>
      ),
    },
    {
      accessorKey: "Account",
      header: "Account",
      size: 150,
      cell: ({ getValue }) => (
        <span className="text-xs text-foreground/80 truncate block max-w-[140px]">{getValue() || <span className="text-muted-foreground">—</span>}</span>
      ),
    },
    {
      id: "ClientFacing",
      header: "Client Status",
      size: 155,
      enableSorting: false,
      cell: ({ row }) => {
        const r = row.original;
        if (!r.visibilityForClient) return <span className="text-xs text-muted-foreground">—</span>;
        const { statusName, statusColor } = r.clientfacingstatus || {};
        if (!statusName) return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <span className="inline-flex items-center gap-1.5 text-xs">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: statusColor }} />
            {statusName}
          </span>
        );
      },
    },
    {
      accessorKey: "Priority",
      header: "Priority",
      size: 100,
      cell: ({ getValue }) => {
        const val = getValue();
        if (!val) return <span className="text-xs text-muted-foreground">—</span>;
        const cls = PRIORITY_CLASSES[val.toLowerCase()] || "bg-muted text-muted-foreground";
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${cls}`}>
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "StartDate",
      header: "Start Date",
      size: 110,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() || "—"}</span>,
    },
    {
      accessorKey: "DueDate",
      header: "Due Date",
      size: 110,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() || "—"}</span>,
    },
    {
      accessorKey: "updatedAt",
      header: "Time in Stage",
      size: 130,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() || "—"}</span>,
    },
    {
      id: "actions",
      header: "",
      size: 50,
      enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu
          open={openMenuId === row.original.id}
          onOpenChange={(open) => setOpenMenuId(open ? row.original.id : null)}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost" size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSubmit(row.original.id); }}>
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); handleClose(); handleDeleteJob(); }}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [openMenuId]);

  const bulkActions = selectedIds.length > 0 ? (
    <>
      <button
        onClick={handleArchive}
        className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors"
      >
        <Archive className="h-3.5 w-3.5" /> Archive
      </button>
      <button
        onClick={handleDeleteJob}
        className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-md border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
    </>
  ) : null;

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

              {/* Job Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Job Name</label>
                <Input value={jobName} onChange={(e) => setJobName(e.target.value)} />
              </div>

              {/* Pipeline */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Pipeline</label>
                <select disabled value={selectedPipeline?.value || ""} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
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

              {/* Job Assignee */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Job Assignee</label>
                <MultiSelectDropdown value={selectedUser} onChange={handleUserChange} placeholder="Job Assignees" />
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

      {/* ===== TOOLBAR + TABLE ===== */}
      <div className="space-y-3">
        <FilterDropdown onFilterChange={handleFilterChange} />

        <DataTableToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          selectedCount={selectedIds.length}
          bulkActions={bulkActions}
        />

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={filteredData}
            loading={false}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            enableRowSelection
            onRowSelectionChange={(sel) =>
              setSelectedIds(Object.keys(sel).filter((k) => sel[k]))
            }
            getRowId={(row) => row.id}
            emptyMessage="No active jobs found"
            emptyDescription="Create a job to get started"
            pageSize={25}
          />
        )}
      </div>
    </>
  );
};

export default Example;

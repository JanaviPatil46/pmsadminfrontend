import React, { useEffect, useState, useContext } from "react";
import "./pipeline.css";
import { useDrag, DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RiDeleteBin5Line } from "react-icons/ri";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { X, MoreVertical, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Switch } from "../components/ui/switch";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import { format, formatDistanceToNow } from "date-fns";
import Priority from "../Templates/Priority/Priority";
import Editor from "../Templates/Texteditor/Editor";
import AddJobs from "./AddJobs";
import dayjs from "dayjs";
import MultiSelectDropdown from "../Templates/MultiSelectDropdown";
import { LoginContext } from "../Sidebar/Context/Context";
import EditJobDrawer from "./updateJobCard";
const Pipeline = ({ charLimit = 4000 }) => {
  const { logindata } = useContext(LoginContext);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [loginuserid, setLoginUserId] = useState("");
  const [username, setUsername] = useState("");
  const fetchUserData = async (id) => {
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("id", result);

        // console.log(userData)
        setUsername(result.username);
      });
  };
  useEffect(() => {
    if (logindata?.user?.id) {
      // Check if logindata and user.id exist
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  useEffect(() => {
    fetchUserData(loginuserid);
  }, []);

  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const AUTOMATION_API = process.env.REACT_APP_AUTOMATION_API;
  const [pipelineData, setPipelineData] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [selectedPipelineOption, setSelectedPipelineOption] = useState(null);
  const [stages, setStages] = useState([]);
  const [pipelineId, setPipelineId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    fetchJobData()
  };
  const handleEditDrawerOpen = () => {
    setIsEditDrawerOpen(true);
  };
  const handleEditDrawerClose = () => {
    setIsEditDrawerOpen(false);
  };

  useEffect(() => {
    fetchJobData();
  }, []);

  const fetchPipelineData = async () => {
    setLoading(true);
    try {
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      console.log("Received stored teamMemberData:", storedData);
      const loginuserid = storedData?.teammember?.userid;
      console.log("User role is:", userRole);

      let url =
        userRole === "Admin"
          ? `${PIPELINE_API}/workflow/pipeline/pipelines`
          : `${PIPELINE_API}/workflow/pipeline/pipelines/${loginuserid}`;
      // ${JOBS_API}/workflow/jobs/joblist/pipelines/${loginuserid}/true
      // http://127.0.0.1/workflow/pipeline/pipelines/
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      // setPipelineData(data.pipeline);
      setPipelineData(data.pipeline || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    console.log("Fetched userRole from localStorage:", storedUserRole);
    setUserRole(storedUserRole);
  }, []);
  useEffect(() => {
    if (userRole) {
      fetchPipelineData();
    }
  }, [userRole]);
  // const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    console.log("Fetched userRole from localStorage:", storedUserRole);
    setUserRole(storedUserRole);
  }, []);
  useEffect(() => {
    if (userRole) {
      fetchJobData();
    }
  }, [userRole]);
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [isActiveTrue, setIsActiveTrue] = useState(true);
  // const fetchJobData = async () => {

  //   try {
  //     const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  //     console.log("Received stored teamMemberData:", storedData);
  //     const loginuserid = storedData?.teammember?.userid;
  //     const viewAllAccounts = storedData?.teammember?.viewallAccounts;
  //     console.log("User role is:", userRole);
  //     let url = "";

  //     if (userRole === "Admin") {
  //       // Admin fetches all jobs
  //       url = `${JOBS_API}/workflow/jobs/job/joblist/list/true`;
  //     } else if (userRole === "TeamMember") {
  //       if (!viewAllAccounts) {

  //         setJobs([]); // Set empty job data
  //         return;
  //       }

  //       // Fetch accounts linked to the user
  //       const accountsResponse = await axios.get(
  //         `${ACCOUNT_API}/accounts/getaccounts/${loginuserid}/true`
  //       );
  //       const accountsData = accountsResponse.data.accountlist;
  //       console.log(accountsData);

  //       if (!accountsData || accountsData.length === 0) {
  //         console.warn("No accounts found for user.");
  //         setJobs([]); // Set empty job data
  //         return;
  //       }

  //       // Extract account IDs and form a query string
  //       const accountIds = accountsData.map((account) => account.id).join(",");

  //       // Fetch jobs based on retrieved account IDs
  //       url = `${JOBS_API}/workflow/jobs/job/joblist/list/true/${accountIds}`;
  //     }

  //     // If no URL is set, exit
  //     if (!url) return;
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     setJobs(data.jobList);
  //     console.log(data.jobList);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  const [filterStatus, setFilterStatus] = useState("active");
const fetchJobData = async () => {
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
      setJobs([]);
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
      // JobAssignee: Array.isArray(job.JobAssignee)
      //   ? job.JobAssignee.join(", ")
      //   : job.JobAssignee,
       jobAssigneeText: Array.isArray(job.JobAssignee)
  ? job.JobAssignee.join(", ")
  : typeof job.JobAssignee === "string"
  ? job.JobAssignee
  : "",

      clientfacingstatus: {
        statusName: job.ClientFacingStatus?.statusName || "",
        statusColor: job.ClientFacingStatus?.statusColor || "",
      },
    }));

    setJobs(formattedData);
    console.log("Final job data:", formattedData);

  } catch (error) {
    console.error("Error fetching jobs:", error);
  } finally {
    await loaderDelay;
    setLoading(false);
  }
};
//   const fetchJobData = async () => {
//     setLoading(true);
//     const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));

//     try {
//       const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
//       console.log("Received stored teamMemberData:", storedData);

//       const loginuserid = storedData?.teammember?.userid;
//       const viewAllAccounts = storedData?.teammember?.viewallAccounts;

//       console.log("User role is:", userRole);
//       console.log("access:", viewAllAccounts);

//       let url = "";

//       if (userRole === "Admin") {
//         // ✅ Fetch active accounts first
//         const accountsResponse = await axios.get(
//           `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`
//         );

//         const accountsData = accountsResponse.data.accountlist;
//         console.log("Admin accounts fetched:", accountsData);

//         if (!accountsData || accountsData.length === 0) {
//           console.warn("No active accounts found for Admin.");
//           setJobs([]);
//           await loaderDelay;
//           setLoading(false);
//           return;
//         }

//         const accountIds = accountsData.map((account) => account._id).join(",");
//         url = `${JOBS_API}/workflow/jobs/job/joblist/list/true/${accountIds}`;
//       } 
      
//       // else if (userRole === "TeamMember") {
//       //   if (viewAllAccounts) {
//       //     // TeamMember with full access gets all jobs
//       //     // url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}`;
//       //     // ✅ Fetch active accounts first
//       //     const accountsResponse = await axios.get(`https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=${filterStatus === "active"}`);
//       //         const accountsData = accountsResponse.data.accountlist;
//       //     console.log("Admin accounts fetched:", accountsData);

//       //     if (!accountsData || accountsData.length === 0) {
//       //       console.warn("No active accounts found for Admin.");
//       //       setJobs([]);
//       //       await loaderDelay;
//       //       setLoading(false);
//       //       return;
//       //     }

//       //     const accountIds = accountsData
//       //       .map((account) => account._id)
//       //       .join(",");
//       //     url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}/${accountIds}`;
//       //   } else {
//       //     // TeamMember with restricted access → fetch user's accounts
//       //     const accountsResponse = await axios.get(
//       //       `${ACCOUNT_API}/accounts/getaccounts/${loginuserid}/${isActiveTrue}`
//       //     );

//       //     const accountsData = accountsResponse.data.accountlist;
//       //     console.log("Accounts fetched:", accountsData);

//       //     if (!accountsData || accountsData.length === 0) {
//       //       console.warn("No accounts found for user.");
//       //       setJobs([]);
//       //       await loaderDelay;
//       //       setLoading(false);
//       //       return;
//       //     }

//       //     const accountIds = accountsData
//       //       .map((account) => account.id)
//       //       .join(",");
//       //     url = `${JOBS_API}/workflow/jobs/job/joblist/list/${isActiveTrue}/${accountIds}`;
//       //   }
//       // }
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
//     setJobs([]);
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

//       if (!url) {
//         await loaderDelay;
//         setLoading(false);
//         return;
//       }

//       console.log("Fetching jobs from URL:", url);

//       const jobListResponse = await axios.get(url);
//       // const data = await response.json();
//       console.log("joblistss", jobListResponse.data.jobList);
//       setJobs(jobListResponse.data.jobList);

//       console.log("Formatted Job Data:", jobListResponse.data.jobList);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       await loaderDelay;
//       setLoading(false);
//     }
//   };
  const fetchStages = async (pipelineId) => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch stages");
      }
      const data = await response.json();

      // return data.pipeline.stages;
      // Ensure each stage has both _id and name
      return data.pipeline.stages.map((stage) => ({
        _id: stage._id,
        name: stage.name,
        automations: stage.automations || [],
      }));
    } catch (error) {
      console.error("Error fetching stages:", error);
      return [];
    }
  };

  const handleSelectChange = (event, option) => {
    setSelectedPipelineOption(option);

    if (option) {
      const pipeline = pipelineData.find(
        (p) => p.pipelineName === option.label
      );
      if (pipeline) {
        handleBoardsList(pipeline);
      }
    }
  };

  const handleBoardsList = async (pipeline) => {
    setSelectedPipeline(pipeline);
    setSelectedPipelineOption({
      value: pipeline._id,
      label: pipeline.pipelineName,
    });
    setPipelineId(pipeline._id);

    const fetchedStages = await fetchStages(pipeline._id);
    setStages(fetchedStages);
    console.log("fetchStages", fetchedStages);
  };

  const handleBackToPipelineList = () => {
    setSelectedPipeline(null);
    setSelectedPipelineOption(null);
    setStages([]);
  };
  console.log("janavi", stages);

  const updateJobStage = async (jobId, targetStage) => {
    // Create the payload with the stage ID for updating the job's stage
    const data = JSON.stringify({ stageid: targetStage._id });

    // Set up the request configuration
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${jobId}`,
      headers: { "Content-Type": "application/json" },
      data: data,
    };

    try {
      // Make the request to update the job stage
      const response = await axios.request(config);
      console.log("Job moved successfully:", response.data);
      toast.success("Job moved successfully!");
      fetchJobData(); // Optionally refresh the job data after updating
    } catch (error) {
      console.error("Error moving job:", error);
      toast.error("Failed to move job");
    }
  };

 
  const AutomationDrawer = ({
    open,
    automations,
    onClose,
    onMoveJob,
    jobId,
    targetStage,
    accountId,
    accountName,
  }) => {
    console.log("selected account name", jobId);

    // API endpoints
    const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
    const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
    const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
    const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
    const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
    const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
    const PROPOSAL_ACCOUNT_API = process.env.REACT_APP_PROPOSAL_URL;
    const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
    const AUTOMATION_API = process.env.REACT_APP_AUTOMATION_API;
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
    const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
    const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
    const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
    const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
    // State
    const [tags, setTags] = useState([]);
    const [accountTags, setAccountTags] = useState([]);
    const [accountsWithTags, setAccountsWithTags] = useState([]);
    const [selectedAutomationIndices, setSelectedAutomationIndices] = useState(
      []
    );
    const [templateData, setTemplateData] = useState({});
    const [tagData, setTagData] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch tags
    useEffect(() => {
      fetchTags();
    }, []);

    const fetchTags = async () => {
      try {
        const url = `${TAGS_API}/tags/`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("tags data", data.tags);
        setTags(data.tags);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch account tags
    const AccountsTag = async (accountId) => {
      console.log("accountId for tags", accountId);
      try {
        const response = await fetch(
          `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyid/${accountId}`
        );
        const result = await response.json();
        console.log(result);
        if (result.accountlist && result.accountlist.Tags) {
          setAccountTags(result.accountlist.Tags);
        }
      } catch (error) {
        console.error("Error fetching account tags:", error);
      }
    };

    useEffect(() => {
      if (accountId) {
        AccountsTag(accountId);
      }
    }, [accountId]);

    // Fetch complete account data with tags
    useEffect(() => {
      const fetchAccountsWithTags = async () => {
        if (!accountId) return;

        setLoading(true);
        try {
          const response = await fetch(
            "https://www.snptaxes.com/api/accounts/multiple",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ids: [accountId] }),
            }
          );

          if (!response.ok) throw new Error("Failed to fetch accounts");

          const accountsData = await response.json();
          setAccountsWithTags(accountsData);
          console.log("Fetched accounts with tags:", accountsData);
        } catch (error) {
          console.error("Error fetching accounts with tags:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAccountsWithTags();
    }, [accountId]);

    // Get tags for account
    const getAccountTags = (accountId) => {
      const account = accountsWithTags.find((acc) => acc._id === accountId);
      return account ? account.tags || [] : [];
    };

    // Check if automation tags match account tags
    const checkTagMatch = (automationSelectedTags, accountId) => {
      if (!automationSelectedTags || automationSelectedTags.length === 0) {
        return true; // No condition tags means always match
      }

      const accountTags = getAccountTags(accountId);
      console.log(`Checking tags for account ${accountId}:`, {
        automationTags: automationSelectedTags,
        accountTags: accountTags,
      });

      // Check if at least one automation tag exists in account tags
      const hasMatch = automationSelectedTags.some((automationTagId) =>
        accountTags.includes(automationTagId)
      );

      console.log(`Tag match result for account ${accountId}:`, hasMatch);
      return hasMatch;
    };

    // Initialize selected automations
    useEffect(() => {
      if (automations.length > 0) {
        setSelectedAutomationIndices(automations.map((_, index) => index));
      }
    }, [automations]);

    // Fetch template data for display
    const fetchTemplateData = async (templateId, templateType) => {
      if (!templateId) return null;

      try {
        let url = "";
        let response;

        switch (templateType) {
          case "EmailTemplate":
            url = `${EMAIL_API}/workflow/emailtemplate/${templateId}`;
            break;
          case "TaskTemplate":
            url = `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${templateId}`;
            break;
          case "InvoiceTemplate":
            url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${templateId}`;
            break;
          case "ChatTemplate":
            url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${templateId}`;
            break;
          case "ProposalTemplate":
            url = `https://www.snptaxes.com/api/proposals/${templateId}`;
            break;
          case "OrganizerTemplate":
            url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${templateId}`;
            break;
          case "FolderTemplate":
            url = `https://www.snptaxes.com/api/foldertemp/${templateId}`;
            break;
          default:
            return null;
        }

        const requestOptions = { method: "GET", redirect: "follow" };
        response = await fetch(url, requestOptions);
        const result = await response.json();

        switch (templateType) {
          case "EmailTemplate":
            return (
              result.emailTemplate?.templatename || "Unknown Email Template"
            );
          case "TaskTemplate":
            return result.taskTemplate?.templatename || "Unknown Task Template";
          case "InvoiceTemplate":
            return (
              result.invoiceTemplate?.templatename || "Unknown Invoice Template"
            );
          case "ChatTemplate":
            return result.chatTemplate?.templatename || "Unknown Chat Template";
          case "ProposalTemplate":
            return result.templatename || "Unknown Proposal Template";
          case "OrganizerTemplate":
            return (
              result.organizerTemplate?.templatename ||
              "Unknown Organizer Template"
            );
          case "FolderTemplate":
            return result.template?.templatename || "Unknown Folder Template";
          default:
            return "Unknown Template";
        }
      } catch (error) {
        console.error(`Error fetching ${templateType}:`, error);
        return "Error loading template";
      }
    };
    const [clientFacingJobs, setClientFacingJobs] = useState([]);
    const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
    const fetchClientFacingJobsData = async () => {
      try {
        const response = await fetch(
          `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setClientFacingJobs(data.clientFacingJobStatues);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const clientStatusOptions = clientFacingJobs.map((status) => ({
      value: status._id,
      label: status.clientfacingName,
      clientfacingColour: status.clientfacingColour,
    }));
    useEffect(() => {
      fetchClientFacingJobsData();
    }, []);
    // Fetch tag details for display
    const fetchTagDetails = async (tagIds) => {
      if (!tagIds || tagIds.length === 0) return [];

      try {
        const tagDetails = await Promise.all(
          tagIds.map(async (tagId) => {
            try {
              const response = await fetch(`${TAGS_API}/tags/${tagId}`);
              const result = await response.json();
              return result.tag;
            } catch (error) {
              console.error(`Error fetching tag ${tagId}:`, error);
              return null;
            }
          })
        );
        return tagDetails.filter((tag) => tag !== null);
      } catch (error) {
        console.error("Error fetching tag details:", error);
        return [];
      }
    };

    // Initialize template and tag data
    useEffect(() => {
      const initializeAutomationData = async () => {
        const templatePromises = automations.map(async (automation, index) => {
          if (automation.selectedtemp && automation.refModel) {
            const templateName = await fetchTemplateData(
              automation.selectedtemp,
              automation.refModel
            );
            return { index, templateName };
          }
          return { index, templateName: null };
        });

        const tagPromises = automations.map(async (automation, index) => {
          const selectedTags = await fetchTagDetails(automation.selectedTags);
          const addTags = await fetchTagDetails(automation.addTags);
          const removeTags = await fetchTagDetails(automation.removeTags);

          return {
            index,
            selectedTags,
            addTags,
            removeTags,
          };
        });

        const templateResults = await Promise.all(templatePromises);
        const tagResults = await Promise.all(tagPromises);

        const newTemplateData = {};
        templateResults.forEach((result) => {
          newTemplateData[result.index] = result.templateName;
        });

        const newTagData = {};
        tagResults.forEach((result) => {
          newTagData[result.index] = {
            selectedTags: result.selectedTags,
            addTags: result.addTags,
            removeTags: result.removeTags,
          };
        });

        setTemplateData(newTemplateData);
        setTagData(newTagData);
      };

      if (automations.length > 0) {
        initializeAutomationData();
      }
    }, [automations]);

    // Checkbox handler
    const handleAutomationSelection = (index) => {
      setSelectedAutomationIndices((prevSelected) =>
        prevSelected.includes(index)
          ? prevSelected.filter((i) => i !== index)
          : [...prevSelected, index]
      );
    };

    // API functions (keep your existing functions)
    const fetchinvoicetempbyid = async (automationTemp) => {
      const requestOptions = { method: "GET", redirect: "follow" };
      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log("Fetched invoice template:", result.invoiceTemplate);
        return result.invoiceTemplate;
      } catch (error) {
        console.error("Error fetching invoice template:", error);
        throw error;
      }
    };

    const fetchchattempbyid = async (automationTemp) => {
      const requestOptions = { method: "GET", redirect: "follow" };
      const url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log("Fetched chat template:", result.chatTemplate);
        return result.chatTemplate;
      } catch (error) {
        console.error("Error fetching chat template:", error);
        throw error;
      }
    };

    const fetchtasktempbyid = async (automationTemp) => {
      const requestOptions = { method: "GET", redirect: "follow" };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log("Fetched task template:", result.taskTemplate);
        return result.taskTemplate;
      } catch (error) {
        console.error("Error fetching task template:", error);
        throw error;
      }
    };

    const fetchproposalbyid = async (automationTemp) => {
      const requestOptions = { method: "GET", redirect: "follow" };
      const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log(
          "Fetched proposal template:",
          result.proposalesAndElsTemplate
        );
        return result.proposalesAndElsTemplate;
      } catch (error) {
        console.error("Error fetching proposal template:", error);
        throw error;
      }
    };

    const fetchorganizertempbyid = async (automationTemp) => {
      const requestOptions = { method: "GET", redirect: "follow" };
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        console.log("Fetched organizer template:", result.organizerTemplate);
        return result.organizerTemplate;
      } catch (error) {
        console.error("Error fetching organizer template:", error);
        throw error;
      }
    };

    const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Assignment functions (simplified versions)
    const assignInvoiceToAccount = (invoiceData, automationTemp, accountId) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        account: accountId,
        invoicenumber: "",
        invoicedate: getCurrentDate(),
        description: invoiceData.description || "",
        invoicetemplate: automationTemp,
        paymentMethod: invoiceData.paymentMethod || "",
        teammember: loginuserid,
        payInvoicewithcredits: invoiceData.payInvoicewithcredits || false,
        emailinvoicetoclient: invoiceData.sendEmailWhenInvCreated || false,
        reminders: invoiceData.sendReminderstoClients || false,
        daysuntilnextreminder: invoiceData.daysuntilnextreminder || null,
        numberOfreminder: invoiceData.numberOfreminder || null,
        scheduleinvoice: false,
        scheduleinvoicedate: new Date(),
        scheduleinvoicetime: new Date().toLocaleTimeString("en-US", {
          hour12: false,
        }),
        lineItems:
          invoiceData.lineItems?.map((item) => ({
            productorService: item.productorService || "",
            description: item.description || "",
            rate: item.rate || "",
            quantity: item.quantity || "",
            amount: item.amount || "",
            tax: item.tax || false,
          })) || [],
        summary: {
          subtotal: invoiceData.summary?.subtotal || "",
          taxRate: invoiceData.summary?.taxRate || "",
          taxTotal: invoiceData.summary?.taxTotal || "",
          total: invoiceData.summary?.total || "",
        },
      paidAmount: 0,
        invoiceStatus: "Pending",
        balanceDueAmount: "",
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${INVOICE_NEW}/workflow/invoices/invoice`, requestOptions)
        .then((response) => response.json())
        .then((result) => console.log("Invoice assigned successfully:", result))
        .catch((error) => console.error("Error assigning invoice:", error));
    };

    const sendChatToAccount = (chatData, automationTemp, accountId) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const subtaskData =
        chatData.clienttasks?.map(({ id, text, checked }) => ({
          id,
          text,
          checked: checked !== undefined ? checked : false,
        })) || [];

      const messageData = [
        {
          message: chatData.description,
          fromwhome: "Admin",
          senderid: username,
          isRead: false,
        },
      ];

      const raw = JSON.stringify({
        accountids: [accountId],
        chattemplateid: automationTemp,
        chatsubject: chatData.chatsubject,
        description: messageData || "",
        templatename: chatData.templatename,
        from: username,
        sendreminderstoclient: chatData.sendreminderstoclient,
        daysuntilnextreminder: chatData.daysuntilnextreminder,
        numberofreminders: chatData.numberofreminders,
        clienttasks: subtaskData,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise`, requestOptions)
        .then((response) => response.json())
        .then((result) =>
          console.log("Send chat to account successfully:", result)
        )
        .catch((error) => console.error("Error assigning chat:", error));
    };

    const assignTaskToAccount = (
      taskData,
      automationTemp,
      accountId,
      jobId
    ) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accounts: accountId,
        job: jobId,
        templatename: automationTemp,
        taskname: taskData.templatename,
        status: taskData.status,
        taskassignees: taskData.taskassignees,
        priority: taskData.priority,
        description: taskData.description,
        tasktags: taskData.tasktags,
        issubtaskschecked: taskData.issubtaskschecked,
        startdate: taskData.startdate,
        enddate: taskData.enddate,
        subtasks: taskData.subtasks,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${ACCOUNT_TASKS_API}/accountstasks/newtask`, requestOptions)
        .then((response) => response.json())
        .then((result) => console.log("Task created:", result))
        .catch((error) => console.error("Error creating task:", error));
    };

    const assignProposalToAccount = async (automationTemp, accountId) => {
      console.log("Assigning proposal to account:", automationTemp, accountId);
      try {
        const response = await fetch(
          "https://www.snptaxes.com/account/proposals/automation",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              proposalTemp: automationTemp,
              account: [accountId],
            }),
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        console.log("✅ Success:", result);
      } catch (error) {
        console.error("❌ Error sending proposal automation:", error);
      }
    };

    const assignOrganizerToAccount = (
      organizerData,
      automationTemp,
      accountId
    ) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accountid: accountId,
        organizertemplateid: automationTemp,
        organizerName: organizerData.organizerName,
        reminders: organizerData.reminders,
        noofreminders: organizerData.noOfReminder,
        daysuntilnextreminder: organizerData.daysuntilNextReminder,
        sections: organizerData.sections,
        status: "Pending",
        active: true,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/org`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => console.log("Organizer assigned:", result))
        .catch((error) => console.error("Error assigning organizer:", error));
    };

    const assignfoldertemp = (accountId, automationTemp) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accountId: accountId,
        templateId: automationTemp,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        `https://www.snptaxes.com/api/docManagement/apply-template`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => console.log("Folder template applied:", result))
        .catch((error) =>
          console.error("Error applying folder template:", error)
        );
    };

    // Account tags update handler
    const handleAccountTagsUpdate = async (accountId, automation) => {
      console.log(`Updating account tags for Account ID: ${accountId}`);

      try {
        const res = await axios.get(
          `https://www.snptaxes.com/api/accounts/${accountId}`
        );
        const accountsData = res.data;

        let currentTags = accountsData.tags || [];
        const addTagIds = automation?.addTags || [];
        const removeTagIds =
          automation?.removeTags || [];

        let updatedTags = currentTags.filter(
          (tagId) => !removeTagIds.includes(tagId)
        );
        updatedTags = [...new Set([...updatedTags, ...addTagIds])];

        const updateResponse = await fetch(
          `https://www.snptaxes.com/api/accounts/accountdetails/updateaccounttags/${accountId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tags: updatedTags }),
          }
        );

        if (!updateResponse.ok)
          throw new Error("Failed to update account tags");
        console.log("Account tags updated successfully");
      } catch (error) {
        console.error("Error updating account tags:", error);
        throw error;
      }
    };

    // Main automation execution function
    const selectAutomationApi = async (
      automationType,
      automationTemp,
      automationAccountId,
      automation,
      jobId = null
    ) => {
      console.log("Processing automation:", automationType, automation);

      if (!automationType || !automationAccountId) {
        console.error("Missing required parameters");
        return;
      }

      try {
        switch (automationType) {
          case "Update account tags":
            await handleAccountTagsUpdate(automationAccountId, automation);
            break;

          case "Send Invoice":
            const invoiceData = await fetchinvoicetempbyid(automationTemp);
            assignInvoiceToAccount(
              invoiceData,
              automationTemp,
              automationAccountId
            );
            break;

          case "Send message":
            const chatData = await fetchchattempbyid(automationTemp);
            sendChatToAccount(chatData, automationTemp, automationAccountId);
            break;

          case "Create Task":
            const taskData = await fetchtasktempbyid(automationTemp);
            assignTaskToAccount(
              taskData,
              automationTemp,
              automationAccountId,
              jobId
            );
            break;

          case "Apply folder template":
            await assignfoldertemp(automationAccountId, automationTemp);
            break;

          case "Create Organizer":
            const organizerData = await fetchorganizertempbyid(automationTemp);
            assignOrganizerToAccount(
              organizerData,
              automationTemp,
              automationAccountId
            );
            break;

          case "Send Proposal/Els":
            await assignProposalToAccount(automationTemp, automationAccountId);
            break;

          case "Send Email":
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
              automationType,
              templateId: automationTemp,
              accountId: automationAccountId,
            });

            const requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
              redirect: "follow",
            };

            await fetch(`${AUTOMATION_API}/automations/`, requestOptions);
            break;

          default:
            console.warn(`Unhandled automation type: ${automationType}`);
            break;
        }
      } catch (error) {
        console.error(`Error processing ${automationType}:`, error);
        throw error;
      }
    };

    // Handle move action
    const handleMove = async () => {
      try {
        const selectedAutomationsList = selectedAutomationIndices
          .map((index) => automations[index])
          .filter((automation) => {
            // Filter based on tags if applicable
            if (!automation.tags || automation.tags.length === 0) {
              return true;
            }
            return checkTagMatch(automation.selectedTags, accountId);
          });

        // Find specific automations if needed
        const clientStatusAutomation = selectedAutomationsList.find(
          (a) => a.type === "Update client-facing job status"
        );
        const assigneeAutomation = selectedAutomationsList.find(
          (a) => a.type === "Update job assignees"
        );

        // Process all selected automations
        if (selectedAutomationsList.length > 0) {
          for (const automation of selectedAutomationsList) {
            const { type, selectedtemp } = automation;

            if (type && accountId) {
              try {
                await selectAutomationApi(
                  type,
                  selectedtemp,
                  accountId,
                  automation,
                  jobId
                );
              } catch (error) {
                console.error("Error processing automation:", error);
              }
            }
          }
        }

        // Move the job with any relevant automations
        onMoveJob(jobId, targetStage, {
          clientStatus: clientStatusAutomation,
          assignees: assigneeAutomation,
        });

        onClose();
      } catch (error) {
        console.error("Error in handleMove:", error);
      }
    };

    // Calculate width for tag options
    const calculateWidth = (label) => Math.min(label.length * 8, 200);

    const tagsoptions = tags.map((tag) => ({
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
        width: `${calculateWidth(tag.tagName)}px`,
        margin: "7px",
        cursor: "pointer",
      },
      customTagStyle: {
        backgroundColor: tag.tagColour,
        color: "#fff",
        alignItems: "center",
        textAlign: "center",
        padding: "2px,8px",
        fontSize: "10px",
        cursor: "pointer",
      },
    }));

    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="fixed inset-0 bg-black/40" onClick={onClose} />
        <div className="ml-auto relative z-50 w-full max-w-[500px] bg-background h-full overflow-y-auto shadow-2xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Automations for {accountName}</h2>

          {automations.length > 0 ? (
            automations.map((automation, index) => {
              const currentTagData = tagData[index] || {};
              const templateName = templateData[index] || "Loading...";
              const hasMatchingTags = checkTagMatch(automation.selectedTags, accountId);

              return (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectedAutomationIndices.includes(index)} onCheckedChange={() => handleAutomationSelection(index)} disabled={!hasMatchingTags} />
                    <span className="text-base font-semibold">{automation.type}</span>
                    {!hasMatchingTags && <span className="text-xs text-red-500 italic ml-2">The tags do not match the account</span>}
                  </div>

                  {automation.selectedtemp && (
                    <div>
                      <p className="text-sm font-bold">Template:</p>
                      <p className="text-sm text-muted-foreground">{templateName}</p>
                    </div>
                  )}

                  {currentTagData.selectedTags && currentTagData.selectedTags.length > 0 && (
                    <div>
                      <p className="text-sm font-bold">Condition Tags:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentTagData.selectedTags.map((tag) => (
                          <span key={tag._id} className="text-xs text-white font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {automation.type === "Update account tags" && currentTagData.addTags && currentTagData.addTags.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-green-600">Add Tags:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentTagData.addTags.map((tag) => (
                          <span key={tag._id} className="text-xs text-white font-medium px-2 py-0.5 rounded-full border-2 border-green-500" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {automation.type === "Update account tags" && currentTagData.removeTags && currentTagData.removeTags.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-red-600">Remove Tags:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentTagData.removeTags.map((tag) => (
                          <span key={tag._id} className="text-xs text-white font-medium px-2 py-0.5 rounded-full border-2 border-red-500 line-through" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {automation.type === "Update client-facing job status" && (
                    <div>
                      <p className="text-sm font-bold">Client Status:</p>
                      {automation.selectedClientStatus && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: clientStatusOptions?.find((opt) => opt.value === automation.selectedClientStatus)?.clientfacingColour || "#ccc" }} />
                          <span className="text-sm">{clientStatusOptions?.find((opt) => opt.value === automation.selectedClientStatus)?.label || automation.selectedClientStatus || "Not set"}</span>
                        </div>
                      )}
                      <p className="text-sm mt-1">Visibility: {automation.status ? "Visible to client" : "Hidden from client"}</p>
                      {automation.statusDescription && <p className="text-sm text-muted-foreground mt-1">Description: {automation.statusDescription}</p>}
                    </div>
                  )}

                  {automation.type === "Update job assignees" && (
                    <div>
                      <p className="text-sm font-bold">Job Assignees:</p>
                      {automation.addAssignees && automation.addAssignees.length > 0 && (
                        <div className="mt-1">
                          <p className="text-sm text-green-600">Add Assignees:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {automation.addAssignees.map((assignee) => (
                              <span key={assignee._id} className="text-xs text-white font-medium px-2 py-0.5 rounded-full bg-green-500">{assignee.name || assignee.username || "Unknown"}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {automation.removeAssignees && automation.removeAssignees.length > 0 && (
                        <div className="mt-1">
                          <p className="text-sm text-red-600">Remove Assignees:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {automation.removeAssignees.map((assignee) => (
                              <span key={assignee._id} className="text-xs text-white font-medium px-2 py-0.5 rounded-full bg-red-500 line-through">{assignee.name || assignee.username || "Unknown"}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {automation.type === "Update account tags" && (
                    <div className="flex items-center gap-2 mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      This automation can affect conditions for automations below
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No automations available</p>
          )}

          <div className="flex items-center gap-3 pt-3">
            <Button onClick={handleMove}>Move</Button>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  };
  const JobCard = ({ job }) => {
    // console.log("nbfhjsg",job)
    const [{ isDragging }, drag] = useDrag({
      type: "JOB_CARD",
      item: { id: job.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
    const [lastUpdatedTime, setLastUpdatedTime] = useState(
      new Date(job.createdAt)
    );

    useEffect(() => {
      if (job.updatedAt) {
        setLastUpdatedTime(new Date(job.updatedAt));
      }
    }, [job.updatedAt]);

    useEffect(() => {
      const intervalId = setInterval(() => {
        setLastUpdatedTime((prevTime) => new Date(prevTime));
      }, 1000);

      return () => clearInterval(intervalId);
    }, []);

    const updateLastUpdatedTime = () => {
      setLastUpdatedTime(new Date());
      console.log(new Date());
    };

    const timeAgo = () => {
      const currentTime = new Date();
      const jobTime = lastUpdatedTime;

      const minutesDiff = differenceInMinutes(currentTime, jobTime);
      const hoursDiff = differenceInHours(currentTime, jobTime);
      const daysDiff = differenceInDays(currentTime, jobTime);

      if (minutesDiff < 1) {
        return "just now";
      } else if (minutesDiff < 60) {
        return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"} ago`;
      } else if (hoursDiff < 24) {
        return `${hoursDiff} hour${hoursDiff === 1 ? "" : "s"} ago`;
      } else {
        return `${daysDiff} day${daysDiff === 1 ? "" : "s"} ago`;
      }
    };

    const stripHtmlTags = (html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    };

    const truncateDescription = (description, maxLength = 30) => {
      if (description.length > maxLength) {
        return description.slice(0, maxLength) + "...";
      }
      return description;
    };

    const getPriorityStyle = (priority) => {
      switch (priority.toLowerCase()) {
        case "urgent":
          return {
            color: "white",
            backgroundColor: "#0E0402",
            fontSize: "12px",
            borderRadius: "50px",
            padding: "3px 7px",
          };
        case "high":
          return {
            color: "white",
            backgroundColor: "#fe676e",
            fontSize: "12px",
            borderRadius: "50px",
            padding: "3px 7px",
          }; // light red background
        case "medium":
          return {
            color: "white",
            backgroundColor: "#FFC300",
            fontSize: "12px",
            borderRadius: "50px",
            padding: "3px 7px",
          }; // light orange background
        case "low":
          return {
            color: "white",
            backgroundColor: "#56c288",
            fontSize: "12px",
            borderRadius: "50px",
            padding: "3px 7px",
          }; // light green background
        default:
          return {};
      }
    };

    const truncateName = (name) => {
      const maxLength = 15;
      if (name.length > maxLength) {
        return name.substring(0, maxLength) + "...";
      }
      return name;
    };

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const options = { month: "short", day: "2-digit", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    };

    const startDateFormatted = formatDate(job.StartDate);
    const dueDateFormatted = formatDate(job.DueDate);

    const [isHovered, setIsHovered] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleDelete = (_id) => {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      fetch(`${JOBS_API}/workflow/jobs/job/` + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          // console.log(result);
          toast.success("Job deleted successfully");
          fetchJobData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    };

    // edit

    // account
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

   

    const fetchPipelineDataid = async (piplineid) => {
      try {
        const response = await fetch(
          `${PIPELINE_API}/workflow/pipeline/pipeline/${piplineid}`
        );
        const data = await response.json();

        setPipelineIdData(data.pipeline);
        console.log("pipeline data for stage", data.pipeline);

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
        // console.error("Error fetching data:", error);
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

    // const handlePipelineChange = (selectedOptions) => {
    //   setSelectedPipeline(selectedOptions);
    //   console.log("pipeline", selectedOptions);
    //   fetchPipelineDataid(selectedOptions.value);
    // };

    // const [selectedStage, setSelectedStage] = useState(null);
    const [stagesoptions, setStagesOptions] = useState([]);
    const [selectedstage, setSelectedstage] = useState("");
    const handleStageChange = (selectedOptions) => {
      setSelectedstage(selectedOptions);
    };

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedJobData, setSelectedJoData] = useState(null);
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

    const handleTagChange = (event) => {
      const { value } = event.target; // Get selected tag objects
      setSelectedTags(value); // Keep full tag objects in state

      // Extract selected tag values
      const selectedTagsValues = value.map((val) => {
        const option = tagoptions.find((opt) => opt.value === val);
        return option?.value;
      });

      setCombinedTagsValues(selectedTagsValues); // Send only tag IDs to backend
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
    const USER_API = process.env.REACT_APP_USER_URL;
    const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
    const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
    const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
    const [jobid, setjobid] = useState();
    const [inputText, setInputText] = useState("");
    const [charCount, setCharCount] = useState(0);
    const [selectedjob, setSelectedjob] = useState(null);
    const [clientFacingJobs, setClientFacingJobs] = useState([]);
    const [clientDescription, setClientDescription] = useState("");
    const [clientFacingStatus, setClientFacingStatus] = useState(false);
    const [selectedJobShortcut, setSelectedJobShortcut] = useState("");
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
    const [selectedAccount, setSelectedAccount] = useState(null);
    // const handleEditJobCard = async (jobid) => {
    //   console.log(jobid);
    //   setjobid(jobid);
    //   try {
    //     const url = `${JOBS_API}/workflow/jobs/job/joblist/listbyid/${jobid}`;
    //     const response = await fetch(url);
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch data");
    //     }
    //     const data = await response.json();
    //     console.log("jobasdata",data)
    //     setSelectedJoData(data.jobList);

    //     if (data.jobList.Account && data.jobList.Account.length > 0) {
    //       const { _id, accountName } = data.jobList.Account[0];
    //       console.log("Account ID:", _id);
    //       console.log("Account Name:", accountName);
    //       setSelectedAccount(accountName);
    //     }
    //     if (data.jobList && data.jobList.Pipeline) {
    //       const pipelineData = {
    //         value: data.jobList.Pipeline._id,
    //         label: data.jobList.Pipeline.Name,
    //       };
    //       setSelectedPipeline(pipelineData);
    //       console.log(pipelineData);
    //       setPipelineId(data.jobList.Pipeline._id);
    //       console.log(data.jobList.Pipeline._id);
    //       fetchPipelineDataid(data.jobList.Pipeline._id);
    //     }
    //     setDueDate(dayjs(data.jobList.DueDate) || null);
    //     // (dayjs(tempvalues.startdate) || null)
    //     setStartDate(dayjs(data.jobList.StartDate) || null);
    //     if (
    //       data.jobList &&
    //       data.jobList.Stage &&
    //       data.jobList.Stage.length > 0
    //     ) {
    //       const stageData = {
    //         value: data.jobList.Stage[0]._id, // Access first element of array
    //         label: data.jobList.Stage[0].name,
    //       };
    //       setSelectedstage(stageData);
    //       console.log("stages", stageData);
    //     }

    //     setPriority(data.jobList.Priority);
    //     setDescription(data.jobList.Description);
    //     setClientFacingStatus(data.jobList.ShowinClientPortal);
    //     setInputText(data.jobList.jobClientName);
    //     setClientDescription(data.jobList.ClientFacingDecription);
    //     if (
    //       data.jobList.ClientFacingStatus &&
    //       data.jobList.ClientFacingStatus
    //     ) {
    //       const clientStatusData = {
    //         value: data.jobList.ClientFacingStatus._id,
    //         label: data.jobList.ClientFacingStatus.clientfacingName,
    //         clientfacingColour:
    //           data.jobList.ClientFacingStatus.clientfacingColour,
    //       };

    //       setSelectedjob(clientStatusData);
    //     }

    //     if (data.jobList && data.jobList.Account) {
    //       setDataAccountjob(data.jobList.Account[0].accountName);
    //     }

    //     if (data.jobList && data.jobList.Account) {
    //       console.log(data.jobList.Account[0]._id);
    //       setAccountId(data.jobList.Account[0]._id);
    //       console.log(data.jobList.Account[0].tags);
    //       const tagsData = data.jobList.Account[0].tags
    //         .flatMap((tagArray) => tagArray)
    //         .map((tag) => ({
    //           value: tag._id,
    //           label: tag.tagName,
    //           colour: tag.tagColour,
    //         }));
    //       setSelectedTags(tagsData);
    //       const selectedValues = tagsData.map((option) => option.value);
    //       setCombinedTagsValues(selectedValues);
    //     }

    //     if (data.jobList && data.jobList.JobAssignee) {
    //       const assigneesData = data.jobList.JobAssignee.map((assignee) => ({
    //         value: assignee._id,
    //         label: assignee.username,
    //       }));

    //       setSelectedUser(assigneesData);
    //       const selectedValues = assigneesData.map((option) => option.value);
    //       setCombinedValues(selectedValues);
    //     }

    //     setIsDrawerOpen(true);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    const [editJobId, setEditJobId] = useState(null);
    const handleEditJobCard = (jobId) => {
      setEditJobId(jobId);
      setIsDrawerOpen(true);
    };
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
          toast.success("Job  updated successfully");
          handleSaveTags();
          // setIsDrawerOpen(false);
          fetchJobData();
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to update Job ");
        });
    };
    const handleSaveExitClick = () => {
      updatejobdata();
    };
    // console.log(accountId);
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
          console.log("acc", result.updatedAccount); // Log the result
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
          console.log("hgdvhvf", result);
          toast.success("Job Template updated successfully");
          handleSaveTags();
          setIsDrawerOpen(false);

          fetchJobData();
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to update Job Template");
        });
    };
    return (
      <div
        className={`job-card ${isDragging ? "dragging" : ""} bg-card shadow-md rounded-xl p-4 transition-all hover:shadow-lg`}
        ref={drag}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDrop={updateLastUpdatedTime}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">{job.Account.join(", ")}</span>
          {isHovered ? (
            <RiDeleteBin5Line onClick={handleOpen} className="cursor-pointer text-red-500" size={18} />
          ) : (
            <span className="automation-batch">1</span>
          )}
        </div>

        <p className="font-bold mb-2 cursor-pointer break-words" onClick={() => handleEditJobCard(job.id)}>{job.Name}</p>
        <p className="text-sm text-muted-foreground mb-2 break-words leading-relaxed">{job.JobAssignee.join(", ")}</p>
        <p className="text-sm text-muted-foreground mb-2">{truncateDescription(stripHtmlTags(job.Description))}</p>

        <span style={getPriorityStyle(job.Priority)}>{job.Priority}</span>

        <div className="mt-3 space-y-0.5">
          <p className="text-sm text-muted-foreground"><strong>Starts:</strong> {startDateFormatted}</p>
          <p className="text-sm text-muted-foreground"><strong>Due:</strong> {dueDateFormatted}</p>
        </div>

        <span className="text-xs text-muted-foreground mt-2 block">{timeAgo()}</span>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40" onClick={handleClose} />
            <div className="relative z-50 w-[300px] bg-background rounded-xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
              <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete this job?</p>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                <Button variant="destructive" onClick={() => handleDelete(job.id)}>Delete</Button>
              </div>
            </div>
          </div>
        )}
        <EditJobDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          jobId={editJobId}
          fetchJobData={fetchJobData}
          accountOptions={accountOptions}
          pipelineOptions={optionpipeline}
          tagOptions={tagoptions}
          userOptions={useroptions}
          clientFacingOptions={optionstatus}
        />

        </div>
    );
  };

  const Stage = ({ stage, selectedPipeline, handleDrop }) => {
    console.log("pipeline stage list", stage);
    const [{ isOver }, drop] = useDrop({
      accept: "JOB_CARD",
      drop: (item, monitor) => {
        // handleDrop(item.id, stage.name);
        handleDrop(item.id, stage._id, stage.name);
        console.log(stage.automations);
        // updateJobStage(stage, item);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });
    console.log("jobs for stage", jobs);
    // const stageJobs = jobs.filter(
    //   (job) =>

    //     job.Pipeline  &&
    //     // job.Stages.includes(stage.name)
    //      job.Stages.some((s) => s.name === stage.name)
    // );
    // Filter jobs by stage ID
    const stageJobs = jobs.filter((job) => {
  if (!job.Pipeline || !job.Stages) return false;

  if (Array.isArray(job.Stages)) {
    return job.Stages.some((s) => s._id === stage._id);
  }

  return job.Stages._id === stage._id;
});

    // const stageJobs = jobs.filter(
    //   (job) => job.Pipeline && job.Stages.some((s) => s._id === stage._id)
    // );
    // console.log("jobs for stage", stageJobs);
    const [displayCount, setDisplayCount] = useState(50);
    const displayedJobs = stageJobs.slice(0, displayCount);
    const truncatedStageName =
      stage.name.length > 30 ? `${stage.name.slice(0, 20)}...` : stage.name;
    return (
      <div ref={drop} className={`stage ${isOver ? "drag-over" : ""}`}>
        <p className="stage-name mb-3 break-words">{stage.name}</p>
        {stageJobs.length > 0 && <p className="text-sm text-muted-foreground mb-3">({stageJobs.length})</p>}
        {displayedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {stageJobs.length > displayCount && (
          <Button variant="outline" onClick={() => setDisplayCount(displayCount + 50)} className="mt-4 self-center">
            Load More
          </Button>
        )}
      </div>
    );
  };
  const [automationdrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [automationData, setAutomationData] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [currentTargetStage, setCurrentTargetStage] = useState(null);
  const [tempJobData, setTempJobData] = useState(null); // State for temporary job data
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");

  // const handleDrop = (jobId, targetStageName) => {
  //   const targetStage = stages.find((stage) => stage.name === targetStageName);
  //   const job = jobs.find((job) => job.id === jobId);

  //   if (job) {
  //     setAccountName(job.Account.join(", ")); // Store the account name
  //     setAccountId(job.AccountId); // Store the account ID
  //   }

  //   // If the target stage has automations, show the drawer
  //   if (targetStage?.automations?.length > 0) {
  //     setAutomationData(targetStage.automations); // Set automation data for drawer
  //     setCurrentJobId(jobId); // Store the current job ID
  //     setCurrentTargetStage(targetStage); // Store the target stage
  //     setAutomationDrawerOpen(true); // Open the automation drawer
  //   } else {
  //     // If no automations, immediately update the job's stage
  //     const updatedJobs = jobs.map((job) => {
  //       if (job.id === jobId) {
  //         return { ...job, Stage: [targetStageName] };
  //       }
  //       return job;
  //     });

  //     setJobs(updatedJobs); // Update the job in the local state

  //     // Optionally, refresh job data after updating
  //     setTimeout(() => {
  //       fetchJobData();
  //     }, 1000);

  //     updateJobStage(jobId, targetStage);
  //   }
  //   setTempJobData({ jobId, targetStageName });
  // };

  const handleDrop = (jobId, targetStageId, targetStageName) => {
    const targetStage = stages.find(
      (stage) => stage._id === targetStageId || stage.name === targetStageName
    );

    const job = jobs.find((job) => job.id === jobId);

    if (job) {
      setAccountName(job.Account.join(", "));
      setAccountId(job.AccountId);
    }

    // If the target stage has automations, show the drawer
    if (targetStage?.automations?.length > 0) {
      setAutomationData(targetStage.automations);
      setCurrentJobId(jobId);
      setCurrentTargetStage(targetStage);
      setAutomationDrawerOpen(true);
    } else {
      // If no automations, immediately update the job's stage
      const updatedJobs = jobs.map((job) => {
        if (job.id === jobId) {
          // Update both stage ID and name in the job
          return {
            ...job,
            Stage: [targetStageName],
            // Also update the Stages array to include the new stage
            Stages: [
              ...(job.Stages || []),
              {
                _id: targetStageId,
                name: targetStageName,
              },
            ],
          };
        }
        return job;
      });

      setJobs(updatedJobs);

      setTimeout(() => {
        fetchJobData();
      }, 1000);

      updateJobStage(jobId, targetStage);
    }
    setTempJobData({ jobId, targetStageId, targetStageName });
  };

  const handleMoveJob = async (jobId, targetStage, automations = {}) => {
    try {
      // First, get the current job data to work with the existing assignees
      const currentJobResponse = await axios.get(
        `${JOBS_API}/workflow/jobs/job/${jobId}`
      );
      const currentJob = currentJobResponse.data;
      const currentAssignees = currentJob.jobassignees || [];

      // Prepare the data object with stage update
      const data = {
        stageid: targetStage._id,
      };

      // Handle client-facing status if automation exists
      // Handle client-facing status if automation exists
      if (automations.clientStatus) {
        const { status, selectedClientStatus, statusDescription } =
          automations.clientStatus;
        Object.assign(data, {
          showinclientportal: status, // This matches the 'status' property from automation
          clientfacingstatus: selectedClientStatus, // This is already the ID, no need for .value
          clientfacingDescription: statusDescription,
        });

        console.log("Updating client-facing status:", {
          showinclientportal: status,
          clientfacingstatus: selectedClientStatus,
          clientfacingDescription: statusDescription,
        });
      }

      // Handle assignee updates if automation exists
      if (automations.assignees) {
        const { addAssignees = [], removeAssignees = [] } =
          automations.assignees;

        // Create new assignees array:
        // 1. Start with current assignees
        // 2. Remove any assignees in removeAssignees
        // 3. Add any assignees in addAssignees that aren't already present
        const newAssignees = [
          ...currentAssignees.filter(
            (assigneeId) => !removeAssignees.some((ra) => ra._id === assigneeId)
          ),
          ...addAssignees
            .map((a) => a._id)
            .filter((newId) => !currentAssignees.includes(newId)),
        ];

        Object.assign(data, {
          jobassignees: newAssignees,
        });
      }

      // Make the API call to update the job
      const response = await axios.post(
        `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${jobId}`,
        data
      );

      console.log("Job moved and updated successfully:", response.data);
      toast.success("Job moved and updated successfully!");
      fetchJobData(); // Refresh the job data
    } catch (error) {
      console.error("Error moving/updating job:", error);
      toast.error("Failed to move and update job");
    }
  };
  console.log("pipeline", pipelineData);
  const optionpipeline = pipelineData.map((pipeline) => ({
    value: pipeline._id,
    label: pipeline.pipelineName,
  }));

  const [tags, setTags] = useState([]);
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("tags dtata", data.tags);
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateWidth = (label) => Math.min(label.length * 8, 200);
  const tagsoptions = tags.map((tag) => ({
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
      width: `${calculateWidth(tag.tagName)}px`,
      margin: "7px",
      cursor: "pointer",
    },
    customTagStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      alignItems: "center",
      textAlign: "center",
      padding: "2px,8px",
      fontSize: "10px",
      cursor: "pointer",
    },
  }));
  const handleTagChange = (index, type, event) => {
    const { value } = event.target; // Array of selected tag IDs

    setAutomationData((prev) => {
      const updatedAutomations = [...prev];

      // Get the correct tag options list
      const tagOptions = tagsoptions;

      // Map selected tag IDs to tag objects with _id, tagName, and tagColour
      const selectedTags = value
        .map((tagId) => {
          const tag = tagOptions.find((t) => t.value === tagId);
          return tag
            ? { _id: tag.value, tagName: tag.label, tagColour: tag.colour }
            : null;
        })
        .filter(Boolean); // Remove null values

      // Prevent duplicate selections
      const uniqueTags = selectedTags.filter(
        (tag, idx, self) => self.findIndex((t) => t._id === tag._id) === idx
      );

      // Ensure the tag is removed from the opposite category
      if (type === "addTags") {
        updatedAutomations[index].removeTags = updatedAutomations[
          index
        ].removeTags.filter(
          (tag) => !uniqueTags.some((t) => t._id === tag._id)
        );
      } else if (type === "removeTags") {
        updatedAutomations[index].addTags = updatedAutomations[
          index
        ].addTags.filter((tag) => !uniqueTags.some((t) => t._id === tag._id));
      }

      updatedAutomations[index] = {
        ...updatedAutomations[index],
        [type]: uniqueTags,
      };

      return updatedAutomations;
    });
  };
  const [assignee, setAssignee] = useState([]);

  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const response = await axios.get(
          `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`
        );
        console.log("assigness data", response.data);
        setAssignee(response.data);
      } catch (error) {
        console.error("Error fetching assignees:", error);
      }
    };

    fetchAssignees();
  }, []);
  const assigneeOptions = assignee.map((ass) => ({
    value: ass._id,
    label: ass.username,
  }));
  const handleAssigneeChange = (index, type, event) => {
    const { value } = event.target; // Array of selected tag IDs

    setAutomationData((prev) => {
      const updatedAutomations = [...prev];

      // Get the correct tag options list
      const assigneeoptions = assigneeOptions;

      // Map selected tag IDs to tag objects with _id, tagName, and tagColour
      const selectedTags = value
        .map((assId) => {
          const ass = assigneeoptions.find((t) => t.value === assId);
          return ass ? { _id: ass.value, username: ass.label } : null;
        })
        .filter(Boolean); // Remove null values

      // Prevent duplicate selections
      const uniqueTags = selectedTags.filter(
        (ass, idx, self) => self.findIndex((t) => t._id === ass._id) === idx
      );

      // Ensure the tag is removed from the opposite category
      if (type === "addAssignees") {
        updatedAutomations[index].removeAssignees = updatedAutomations[
          index
        ].removeAssignees.filter(
          (ass) => !uniqueTags.some((t) => t._id === ass._id)
        );
      } else if (type === "removeAssignees") {
        updatedAutomations[index].addAssignees = updatedAutomations[
          index
        ].addAssignees.filter(
          (tag) => !uniqueTags.some((t) => t._id === tag._id)
        );
      }

      updatedAutomations[index] = {
        ...updatedAutomations[index],
        [type]: uniqueTags,
      };

      return updatedAutomations;
    });
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedPipeline ? (
          <>
            <div className="mb-4">
              <select
                value={selectedPipelineOption?.value || ""}
                onChange={(e) => {
                  const option = optionpipeline.find((o) => o.value === e.target.value);
                  handleSelectChange(e, option);
                }}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring pipeline-select"
              >
                <option value="" disabled>Search pipelines...</option>
                {optionpipeline.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="flex items-center justify-between mt-3">
                <Button variant="outline" onClick={handleBackToPipelineList}>
                  Back to Pipeline List
                </Button>
                <Button onClick={handleDrawerOpen}>
                  Add Jobs
                </Button>
              </div>
            </div>
            <div>
              <div className="stage-container flex gap-4">
                {stages.map((stage, index) => (
                  <Stage
                    key={stage._id || index}
                    stage={stage}
                    selectedPipeline={selectedPipeline}
                    handleDrop={handleDrop}
                  />
                ))}

                <AutomationDrawer
                  open={automationdrawerOpen}
                  automations={automationData}
                  onClose={() => setAutomationDrawerOpen(false)}
                  jobId={currentJobId}
                  targetStage={currentTargetStage}
                  onMoveJob={handleMoveJob}
                  accountName={accountName}
                  accountId={accountId}
                />
              </div>
            </div>

            {isDrawerOpen && (
              <div className="fixed inset-0 z-50 flex">
                <div className="fixed inset-0 bg-black/40" onClick={handleDrawerClose} />
                <div className="ml-auto relative z-50 w-full max-w-[500px] sm:rounded-l-xl bg-background h-full overflow-y-auto shadow-2xl" id="tag-drawer">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted">
                    <h2 className="text-lg font-semibold">
                      Add Job to {selectedPipeline ? selectedPipeline.pipelineName : ""}
                    </h2>
                    <button onClick={handleDrawerClose} className="text-muted-foreground hover:text-foreground">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div>
                    <AddJobs
                      stages={stages}
                      pipelineId={pipelineId}
                      handleDrawerClose={handleDrawerClose}
                      fetchJobData={fetchJobData}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Pipeline List</h1>
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Pipeline Name</th>
                    <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Jobs</th>
                    <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Schedule</th>
                    <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Start Date</th>
                    <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">End Date</th>
                    <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Setting</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pipelineData.map((pipeline, index) => (
                    <tr key={index} className="bg-white transition-colors hover:bg-muted/30">
                      <td
                        onClick={() => handleBoardsList(pipeline)}
                        className="text-xs px-4 py-3 leading-tight cursor-pointer text-primary hover:text-primary/80 font-medium"
                      >
                        {pipeline.pipelineName}
                      </td>
                      <td className="text-xs px-4 py-3 leading-tight text-muted-foreground"></td>
                      <td className="text-xs px-4 py-3 leading-tight text-muted-foreground"></td>
                      <td className="text-xs px-4 py-3 leading-tight text-muted-foreground"></td>
                      <td className="text-xs px-4 py-3 leading-tight text-muted-foreground"></td>
                      <td className="text-xs px-4 py-3 leading-tight">
                        <button className="p-1 rounded-md hover:bg-muted transition-colors">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DndProvider>
  );
};

export default Pipeline;

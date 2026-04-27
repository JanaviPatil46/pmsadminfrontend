import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { useDrag, DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { toast } from "react-toastify";
import { X, MoreVertical, Loader2, AlertTriangle, Pencil, Trash2 } from "lucide-react";
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
import { DataTable } from "../components/data-table/data-table";
import { DataTableToolbar } from "../components/data-table/toolbar";
import { LayoutGrid, List } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../components/ui/dropdown-menu";

function BoardListView({ jobs, stages, sharedAccountOptions, sharedTagOptions, sharedUserOptions, sharedClientFacingOptions, fetchJobData, optionpipeline }) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [stageFilter, setStageFilter] = React.useState("all");
  const [listOpenMenuId, setListOpenMenuId] = React.useState(null);

  const JOBS_API_LIST = process.env.REACT_APP_ADD_JOBS_URL;

  const filteredJobs = React.useMemo(() => {
    let data = jobs;
    if (stageFilter !== "all") {
      data = data.filter((job) => {
        if (!job.Stages) return false;
        const stagesArr = Array.isArray(job.Stages) ? job.Stages : [job.Stages];
        return stagesArr.some((s) => s._id === stageFilter);
      });
    }
    return data;
  }, [jobs, stageFilter]);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${JOBS_API_LIST}/workflow/jobs/job/${jobId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Job deleted");
      fetchJobData();
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const PRIORITY_MAP = {
    urgent: "bg-zinc-900 text-white",
    high:   "bg-red-500/15 text-red-600",
    medium: "bg-amber-500/15 text-amber-700",
    low:    "bg-emerald-500/15 text-emerald-700",
  };

  const columns = React.useMemo(() => [
    {
      accessorKey: "Name",
      header: "Job Name",
      size: 200,
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-foreground truncate block max-w-[190px]">{getValue() || "—"}</span>
      ),
    },
    {
      accessorKey: "Account",
      header: "Account",
      size: 150,
      cell: ({ getValue }) => {
        const val = getValue();
        const text = Array.isArray(val) ? val.join(", ") : (val || "");
        return <span className="text-xs text-foreground/80 truncate block max-w-[140px]">{text || <span className="text-muted-foreground">—</span>}</span>;
      },
    },
    {
      accessorKey: "Stages",
      header: "Stage",
      size: 130,
      cell: ({ getValue }) => {
        const val = getValue();
        const stagesArr = Array.isArray(val) ? val : (val ? [val] : []);
        const name = stagesArr[0]?.name || "—";
        return <span className="text-xs text-foreground/80">{name}</span>;
      },
    },
    {
      accessorKey: "jobAssigneeText",
      header: "Assignee",
      size: 130,
      cell: ({ getValue, row }) => {
        const val = getValue() || (Array.isArray(row.original.JobAssignee) ? row.original.JobAssignee.join(", ") : "");
        return <span className="text-xs text-foreground/80 truncate block max-w-[120px]">{val || <span className="text-muted-foreground">—</span>}</span>;
      },
    },
    {
      accessorKey: "Priority",
      header: "Priority",
      size: 100,
      cell: ({ getValue }) => {
        const val = getValue();
        if (!val) return <span className="text-muted-foreground text-xs">—</span>;
        const cls = PRIORITY_MAP[(val || "").toLowerCase()] || "bg-muted text-muted-foreground";
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ${cls}`}>{val}</span>
        );
      },
    },
    {
      accessorKey: "StartDate",
      header: "Start",
      size: 110,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() || "—"}</span>,
    },
    {
      accessorKey: "DueDate",
      header: "Due",
      size: 110,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() || "—"}</span>,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      size: 120,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue() || "—"}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); handleDeleteJob(row.original.id); }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <DataTableToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
        />
        {stages.length > 0 && (
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring shrink-0"
          >
            <option value="all">All stages</option>
            {stages.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        )}
      </div>
      <DataTable
        columns={columns}
        data={filteredJobs}
        loading={false}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row.id}
        emptyMessage="No jobs found"
        emptyDescription="Add a job to get started"
        pageSize={25}
      />
    </div>
  );
}

function PipelineListView({ pipelineData, openMenuId, handleBoardsList, togglePipelineMenu, closePipelineMenu, handleDeletePipeline }) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = React.useMemo(() => [
    {
      accessorKey: "pipelineName",
      header: "Pipeline Name",
      size: 220,
      cell: ({ row, getValue }) => (
        <button
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors text-left"
          onClick={() => handleBoardsList(row.original)}
        >
          {getValue() || "—"}
        </button>
      ),
    },
    {
      id: "jobs",
      header: "Jobs",
      size: 80,
      enableSorting: false,
      cell: () => <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      id: "schedule",
      header: "Schedule",
      size: 100,
      enableSorting: false,
      cell: () => <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      id: "startDate",
      header: "Start Date",
      size: 110,
      enableSorting: false,
      cell: () => <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      id: "endDate",
      header: "End Date",
      size: 110,
      enableSorting: false,
      cell: () => <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => {
        const pipeline = row.original;
        return (
          <div className="flex items-center gap-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); handleBoardsList(pipeline); }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDeletePipeline(); }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      },
    },
  ], [handleBoardsList, handleDeletePipeline]);

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Pipelines</h1>
      </div>
      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />
      <DataTable
        columns={columns}
        data={pipelineData}
        loading={false}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row._id}
        emptyMessage="No pipelines found"
        emptyDescription="Create a pipeline to get started"
        pageSize={25}
      />
    </>
  );
}

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
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedPipelineMenu, setSelectedPipelineMenu] = useState(null);

  const togglePipelineMenu = (e, pipeline) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === pipeline._id ? null : pipeline._id);
    setSelectedPipelineMenu(pipeline);
  };
  const closePipelineMenu = () => {
    setOpenMenuId(null);
    setSelectedPipelineMenu(null);
  };
  const handleDeletePipeline = async () => {
    if (!selectedPipelineMenu) return;
    const confirmed = window.confirm(`Delete pipeline "${selectedPipelineMenu.pipelineName}"?`);
    if (!confirmed) return;
    try {
      const response = await fetch(
        `${PIPELINE_API}/workflow/pipeline/pipelines/${selectedPipelineMenu._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete pipeline");
      toast.success("Pipeline deleted successfully");
      setPipelineData(prev => prev.filter(p => p._id !== selectedPipelineMenu._id));
    } catch (err) {
      toast.error("Failed to delete pipeline");
    } finally {
      closePipelineMenu();
    }
  };

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
  const [viewMode, setViewMode] = useState("board");

  // ── Shared options fetched once in parent and passed to JobCard ──
  const ACCOUNT_API_PARENT = process.env.REACT_APP_ACCOUNTS_URL;
  const TAGS_API_PARENT = process.env.REACT_APP_TAGS_TEMP_URL;
  const CLIENT_FACING_API_PARENT = process.env.REACT_APP_CLIENT_FACING_URL;
  const [sharedAccountOptions, setSharedAccountOptions] = useState([]);
  const [sharedTagOptions, setSharedTagOptions] = useState([]);
  const [sharedUserOptions, setSharedUserOptions] = useState([]);
  const [sharedClientFacingOptions, setSharedClientFacingOptions] = useState([]);

  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        const [accRes, tagRes, userRes, cfRes] = await Promise.all([
          fetch(`${ACCOUNT_API_PARENT}/accounts/accountdetails`).then(r => r.json()),
          fetch(`${TAGS_API_PARENT}/tags/`).then(r => r.json()),
          fetch(`${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`).then(r => r.json()),
          fetch(`${CLIENT_FACING_API_PARENT}/workflow/clientfacingjobstatus/`).then(r => r.json()),
        ]);
        setSharedAccountOptions((accRes.accounts || []).map(a => ({ value: a._id, label: a.accountName })));
        setSharedTagOptions((tagRes.tags || []).map(t => ({ value: t._id, label: t.tagName, colour: t.tagColour })));
        setSharedUserOptions((userRes || []).map(u => ({ value: u._id, label: u.username })));
        setSharedClientFacingOptions((cfRes.clientFacingJobStatues || []).map(s => ({ value: s._id, label: s.clientfacingName, clientfacingColour: s.clientfacingColour })));
      } catch (e) {
        console.error("Error fetching shared options:", e);
      }
    };
    fetchSharedData();
  }, []);

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
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
        <div className="ml-auto relative z-50 w-full max-w-[480px] bg-background h-full flex flex-col shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Automations</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{accountName}</p>
            </div>
            <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

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
                    <div className="flex items-center gap-2 mt-2 p-3 rounded-lg bg-warning/10 border border-warning/20 text-warning-foreground text-sm" style={{backgroundColor:'hsl(var(--muted))',borderColor:'hsl(var(--border))'}}>
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                      <span className="text-muted-foreground">This automation can affect conditions for automations below</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No automations available</p>
          )}

          </div>
          <div className="border-t border-border px-5 py-4 flex items-center gap-3">
            <Button onClick={handleMove}>Move Job</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  };
  const PRIORITY_CLASSES_CARD = {
    urgent: "bg-zinc-900 text-white",
    high:   "bg-red-500/15 text-red-600",
    medium: "bg-amber-500/15 text-amber-700",
    low:    "bg-emerald-500/15 text-emerald-700",
  };

  const JobCard = ({ job, accountOptions, tagOptions, userOptions, clientFacingOptions }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "JOB_CARD",
      item: { id: job.id },
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    });

    const [isHovered, setIsHovered] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editJobId, setEditJobId] = useState(null);

    const JOBS_API_CARD = process.env.REACT_APP_ADD_JOBS_URL;

    const lastUpdatedRef = React.useRef(
      job.updatedAt ? new Date(job.updatedAt) : new Date(job.createdAt)
    );

    useEffect(() => {
      if (job.updatedAt) lastUpdatedRef.current = new Date(job.updatedAt);
    }, [job.updatedAt]);

    useEffect(() => {
      const id = setInterval(() => {}, 60000);
      return () => clearInterval(id);
    }, []);

    const timeAgo = () => {
      if (!job.updatedAt) return "";
      if (typeof job.updatedAt === "string" && job.updatedAt.includes("ago")) return job.updatedAt;
      return formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true });
    };

    const stripHtml = (html) => {
      try { return new DOMParser().parseFromString(html, "text/html").body.textContent || ""; }
      catch { return html || ""; }
    };

    const handleDelete = async (_id) => {
      try {
        const res = await fetch(`${JOBS_API_CARD}/workflow/jobs/job/${_id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        toast.success("Job deleted successfully");
        fetchJobData();
      } catch {
        toast.error("Failed to delete job");
      } finally {
        setConfirmOpen(false);
      }
    };

    const handleEditJobCard = (jobId) => {
      setEditJobId(jobId);
      setIsDrawerOpen(true);
    };

    const accountText = Array.isArray(job.Account) ? job.Account.join(", ") : (job.Account || "");
    const assigneeText = Array.isArray(job.JobAssignee)
      ? job.JobAssignee.join(", ")
      : (job.jobAssigneeText || "");
    const descriptionText = (() => {
      const plain = stripHtml(job.Description || "");
      return plain.length > 80 ? plain.slice(0, 80) + "…" : plain;
    })();
    const priorityCls = PRIORITY_CLASSES_CARD[(job.Priority || "").toLowerCase()] || "bg-muted text-muted-foreground";
    const startFmt = job.StartDate ? (
      typeof job.StartDate === "string" && job.StartDate.match(/[a-zA-Z]/)
        ? job.StartDate
        : (() => { try { return format(new Date(job.StartDate), "MMM d, yyyy"); } catch { return job.StartDate; } })()
    ) : null;
    const dueFmt = job.DueDate ? (
      typeof job.DueDate === "string" && job.DueDate.match(/[a-zA-Z]/)
        ? job.DueDate
        : (() => { try { return format(new Date(job.DueDate), "MMM d, yyyy"); } catch { return job.DueDate; } })()
    ) : null;

    return (
      <div
        ref={drag}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={[
          "group relative rounded-lg border bg-card p-3 text-left transition-all duration-150",
          "hover:shadow-sm hover:border-border/80 cursor-grab active:cursor-grabbing select-none",
          isDragging ? "opacity-40 shadow-xl scale-[0.97]" : "opacity-100",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[11px] font-medium text-muted-foreground leading-tight truncate flex-1">{accountText}</span>
          <div className="flex items-center gap-1 shrink-0">
            {job.Priority && (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ${priorityCls}`}>
                {job.Priority}
              </span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmOpen(true); }}
              className={`inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10 ${isHovered ? "opacity-100" : "opacity-0"}`}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Job name */}
        <button
          onClick={() => handleEditJobCard(job.id)}
          className="block w-full text-left text-sm font-semibold text-foreground hover:text-primary transition-colors break-words leading-snug mb-1.5"
        >
          {job.Name}
        </button>

        {/* Assignee */}
        {assigneeText && (
          <p className="text-[11px] text-muted-foreground truncate mb-1.5">{assigneeText}</p>
        )}

        {/* Description */}
        {descriptionText && (
          <p className="text-[11px] text-muted-foreground/80 leading-relaxed line-clamp-2 mb-2">{descriptionText}</p>
        )}

        {/* Dates */}
        {(startFmt || dueFmt) && (
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/50">
            {startFmt && <span className="text-[10px] text-muted-foreground"><span className="font-medium">Start</span> {startFmt}</span>}
            {dueFmt && <span className="text-[10px] text-muted-foreground"><span className="font-medium">Due</span> {dueFmt}</span>}
          </div>
        )}

        {/* Time ago */}
        <p className="text-[10px] text-muted-foreground/50 mt-1.5">{timeAgo()}</p>

        {/* Delete confirm */}
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
            <div className="relative z-50 w-72 rounded-xl border border-border bg-card p-5 shadow-2xl">
              <h3 className="text-sm font-semibold text-foreground mb-1">Delete Job</h3>
              <p className="text-xs text-muted-foreground mb-4">This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(job.id)}>Delete</Button>
              </div>
            </div>
          </div>
        )}

        <EditJobDrawer
          open={isDrawerOpen}
          onClose={() => { setIsDrawerOpen(false); fetchJobData(); }}
          jobId={editJobId}
          fetchJobData={fetchJobData}
          accountOptions={accountOptions}
          pipelineOptions={optionpipeline}
          tagOptions={tagOptions}
          userOptions={userOptions}
          clientFacingOptions={clientFacingOptions}
        />
      </div>
    );
  };

  const Stage = ({ stage, selectedPipeline, handleDrop }) => {
    const [{ isOver }, drop] = useDrop({
      accept: "JOB_CARD",
      drop: (item) => { handleDrop(item.id, stage._id, stage.name); },
      collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    });

    const stageJobs = jobs.filter((job) => {
      if (!job.Pipeline || !job.Stages) return false;
      if (Array.isArray(job.Stages)) return job.Stages.some((s) => s._id === stage._id);
      return job.Stages._id === stage._id;
    });

    const [displayCount, setDisplayCount] = useState(50);
    const displayedJobs = stageJobs.slice(0, displayCount);

    return (
      <div
        ref={drop}
        className={[
          "min-w-[260px] max-w-[272px] flex flex-col rounded-xl border transition-colors duration-150",
          isOver ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20",
        ].join(" ")}
        style={{ maxHeight: "calc(100vh - 168px)" }}
      >
        {/* Column header */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/60 shrink-0">
          <span className="h-2 w-2 rounded-full bg-primary/60 shrink-0" />
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide flex-1 truncate">{stage.name}</p>
          <span className="inline-flex h-4.5 min-w-[1.25rem] items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground leading-none">
            {stageJobs.length}
          </span>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-1.5 p-2 overflow-y-auto flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {displayedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-1.5">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-base">·</span>
              </div>
              <p className="text-[11px] text-muted-foreground">No jobs</p>
            </div>
          ) : (
            displayedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                accountOptions={sharedAccountOptions}
                tagOptions={sharedTagOptions}
                userOptions={sharedUserOptions}
                clientFacingOptions={sharedClientFacingOptions}
              />
            ))
          )}
          {stageJobs.length > displayCount && (
            <button
              onClick={() => setDisplayCount(displayCount + 50)}
              className="mt-1 w-full rounded-md py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Load {stageJobs.length - displayCount} more
            </button>
          )}
        </div>
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
          <div className="space-y-4">
            <div className="h-9 w-56 rounded-lg bg-muted animate-pulse" />
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[260px] rounded-xl border border-border bg-card p-4 space-y-3">
                  <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="rounded-xl border border-border bg-background p-3 space-y-2">
                      <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                      <div className="h-3 w-full rounded bg-muted animate-pulse" />
                      <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : selectedPipeline ? (
          <>
            {/* ── Board toolbar ── */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <select
                value={selectedPipelineOption?.value || ""}
                onChange={(e) => {
                  const option = optionpipeline.find((o) => o.value === e.target.value);
                  handleSelectChange(e, option);
                }}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[180px]"
              >
                <option value="" disabled>Select pipeline…</option>
                {optionpipeline.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <div className="flex items-center gap-2 ml-auto">
                {/* Active/inactive filter */}
                <div className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
                  {["active", "inactive"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={[
                        "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all duration-150",
                        filterStatus === s
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Board / List toggle */}
                <div className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
                  <button
                    onClick={() => setViewMode("board")}
                    title="Board view"
                    className={[
                      "inline-flex items-center justify-center h-7 w-7 rounded-md transition-all",
                      viewMode === "board"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    title="List view"
                    className={[
                      "inline-flex items-center justify-center h-7 w-7 rounded-md transition-all",
                      viewMode === "list"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>

                <Button variant="outline" size="sm" onClick={handleBackToPipelineList}>← Back</Button>
                <Button size="sm" onClick={handleDrawerOpen}>+ Add Job</Button>
              </div>
            </div>

            {/* ── Board view ── */}
            {viewMode === "board" ? (
              <div className="flex gap-3 overflow-x-auto pb-4 items-start">
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
            ) : (
              <BoardListView
                jobs={jobs}
                stages={stages}
                onEdit={(jobId) => {
                  setViewMode("board");
                }}
                sharedAccountOptions={sharedAccountOptions}
                sharedTagOptions={sharedTagOptions}
                sharedUserOptions={sharedUserOptions}
                sharedClientFacingOptions={sharedClientFacingOptions}
                fetchJobData={fetchJobData}
                optionpipeline={optionpipeline}
              />
            )}

            {isDrawerOpen && (
              <div className="fixed inset-0 z-50 flex">
                <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm" onClick={handleDrawerClose} />
                <div className="ml-auto relative z-50 w-full max-w-[520px] bg-background h-full flex flex-col shadow-2xl">
                  <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">Add Job</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{selectedPipeline?.pipelineName}</p>
                    </div>
                    <button onClick={handleDrawerClose} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
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
          <PipelineListView
            pipelineData={pipelineData}
            openMenuId={openMenuId}
            handleBoardsList={handleBoardsList}
            togglePipelineMenu={togglePipelineMenu}
            closePipelineMenu={closePipelineMenu}
            handleDeletePipeline={handleDeletePipeline}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default Pipeline;

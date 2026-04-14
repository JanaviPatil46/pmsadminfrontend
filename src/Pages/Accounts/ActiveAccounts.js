import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Outlet } from "react-router-dom";
import { MdDeleteOutline, MdMoreVert } from "react-icons/md";
import { FiList, FiMail, FiTag, FiUser, FiBell } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import SendAccountEmail from "../BulkActions/SendAccountEmail";
import AddJobs from "../BulkActions/AddJobs";
import AddBulkOrganizer from "../BulkActions/AddBulkOrganizer";
import ManageTags from "../BulkActions/ManageTags";
import ManageTeams from "../BulkActions/ManageTeams";
import "../account.css";
import { useNavigate } from "react-router-dom";
import TagsMultiSelectDropDown from "./TagsMultiSelectDropDown.js";
import TeamMemberMultiSelectDropDown from "./TeamMemberMultiSelectDropDown.js";
import { LoginContext } from "../../Sidebar/Context/Context.js";
import Cookies from 'js-cookie';
const FixedColumnTable = () => {
  const WINDOWS_PORT = process.env.REACT_APP_SERVER_URI;
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
  console.log(logindata);
  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  console.log("userid", loginuserid);
  const navigate = useNavigate();
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [accountData, setAccountData] = useState([]);
  const [selected, setSelected] = useState([]);

//      console.log("Selecting all:", selected);
//      useEffect(() => {
//   if (selected && selected.length > 0) {
//     // Store selected data in cookies (convert to JSON)
//     Cookies.set("accountId", selected);
//   } else {
//     // Optional: remove cookie if selection is cleared
//     Cookies.remove('accountId');
//   }
// }, [selected]);


// useEffect(() => {
//   if (selected && selected.length > 0) {
//     // ✅ Always store only the latest (most recent) ID
//     const latestId = selected[selected.length - 1];
//     Cookies.set("accountId", latestId, { path: "/" });
//     console.log("✅ Stored latest accountId:", latestId);
//   } else {
//     // ❌ Remove cookie if nothing is selected
//     Cookies.remove("accountId", { path: "/" });
//     console.log("❌ accountId cookie removed");
//   }
// }, [selected]);

  const [anchorEl, setAnchorEl] = useState(null);

  // Update your state initialization to ensure arrays are always used for multi-select filters
const [filters, setFilters] = useState({
  accountName: "",
  type: "",
  teamMember: [],  // Changed from string to array
  tags: [],
});
  const [showFilters, setShowFilters] = useState({
    accountName: false,
    type: false,
    teamMember: false,
    tags: false,
  });

  const [isActiveTrue, setIsActiveTrue] = useState(true);
  const [anchorE2, setAnchorE2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [viewAllAccounts, setViewAllAccounts] = useState(false);

  const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  const fetchData = async () => {
    setLoading(true);
    try {
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      console.log("Received stored teamMemberData:", storedData);

      const loginuserid = storedData?.teammember?.userid;
      console.log("User role is:", userRole);

      let url;

      if (userRole === "Admin") {
        url = `${ACCOUNT_API}/accounts/account/accountdetailslist/${isActiveTrue}`;
      } else if (userRole === "TeamMember") {
        const viewAll = storedData?.teammember?.viewallAccounts || false;
        setViewAllAccounts(viewAll);

        url = viewAll
          ? `${ACCOUNT_API}/accounts/account/accountdetailslist/${isActiveTrue}`
          : `${ACCOUNT_API}/accounts/getaccounts/${loginuserid}/${isActiveTrue}`;
      }

      // Fetch data
      const response = await axios.get(url);
      console.log("API Response:", response.data.accountlist);

      setAccountData(response.data.accountlist || []);
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  console.log(viewAllAccounts);

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    console.log("Fetched userRole from localStorage:", storedUserRole);
    setUserRole(storedUserRole);
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchData();
    }
  }, [userRole, ACCOUNT_API, isActiveTrue]);

  const handleSelect = (id) => {
    const currentIndex = selected.indexOf(id);
    const newSelected =
      currentIndex === -1
        ? [...selected, id]
        : selected.filter((item) => item !== id);
    setSelected(newSelected);
    
  };

  // Update the handleFilterChange function to properly handle both single and multi-select filters
const handleFilterChange = (event) => {
  const { name, value } = event.target;
  
  setFilters(prev => {
    // For multi-select fields, ensure we maintain an array
    if (name === "teamMember") {
      return {
        ...prev,
        [name]: Array.isArray(value) ? value : [value].filter(Boolean)
      };
    }
    // For single-select fields
    return {
      ...prev,
      [name]: value
    };
  });
  
  setPage(0);
};
  const [sortBy, setSortBy] = useState(null); // Current column to sort by
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  // Sorting logic
  const sortedData = [...accountData].sort((a, b) => {
    if (!sortBy) return 0; // No sorting if no column is selected

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue === bValue) return 0;

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  // Update your filteredData logic to properly apply all filters
const filteredData = sortedData.filter((row) => {
  // Account Name filter
  const accountNameMatch = filters.accountName
    ? row.Name.toLowerCase().includes(filters.accountName.toLowerCase())
    : true;
  
  // Type filter
  const typeMatch = filters.type
    ? row.Type.toLowerCase() === filters.type.toLowerCase()
    : true;
  

// Team Member filter (matches by ID)
  // const teamMemberMatch = filters.teamMember.length > 0
  //   ? row.Team.some(member => 
  //       filters.teamMember.includes(member._id) // Match by ID
  //     )
  //   : true;
  // Team Member filter (matches by ID or username)
const teamMemberMatch = filters.teamMember.length > 0
  ? row.Team.some(member =>
      filters.teamMember.some(selected =>
        selected.value === member._id || 
        selected.label.toLowerCase() === member.username.toLowerCase()
      )
    )
  : true;

  // Tags filter
  const tagMatch = filters.tags.length > 0
    ? row.Tags &&
      Array.isArray(row.Tags) &&
      filters.tags.some(selectedTag =>
        row.Tags.some(rowTag =>
          rowTag.tagName === selectedTag.tagName &&
          rowTag.tagColour === selectedTag.tagColour
        )
      )
    : true;
  
  return accountNameMatch && typeMatch && teamMemberMatch && tagMatch;
});
 
  const handleFilterButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
  };

// Update the clearFilter function to properly reset both single and multi-select filters
const clearFilter = (filterField) => {
  setFilters(prev => ({
    ...prev,
    [filterField]: filterField === 'accountName' || filterField === 'type' ? '' : []
  }));
  setShowFilters(prev => ({
    ...prev,
    [filterField]: false,
  }));
};
  const toggleFilter = (filterType) => {
    setShowFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };
  

  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = async () => {
    try {
      const response = await fetch(`${TAGS_API}/tags/`);
      const data = await response.json();
      setTags(data.tags);
      console.log(data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const uniqueTags = Array.from(
    new Map(
      tags.map((tag) => [`${tag.tagName}_${tag.tagColour}`, tag])
    ).values()
  );
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCreateOrganizerOpen, setIsCreateOrganizerOpen] = useState(false);
  const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsSendEmailOpen(false);
    setIsCreateOrganizerOpen(false);
    setIsCreateJobOpen(false);
    setIsManageTagsOpen(false);
    setIsManageTeamOpen(false);
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30); // 5 rows per page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
useEffect(() => {
  if (selected && selected.length > 0 && paginatedData.length > 0) {
    const latestId = selected[selected.length - 1];
    const selectedRow = paginatedData.find((row) => row.id === latestId);

    if (selectedRow) {
      Cookies.set("accountId", latestId, { path: "/" });
      Cookies.set("accountName", selectedRow.Name, { path: "/" });
      console.log("✅ Stored accountId:", latestId, "accountName:", selectedRow.Name);
    }
  } else {
    Cookies.remove("accountId", { path: "/" });
    Cookies.remove("accountName", { path: "/" });
    console.log("❌ accountId and accountName cookies removed");
  }
}, [selected, paginatedData]);

  const handleAssignOrganizer = () => {
    setIsCreateOrganizerOpen(!isCreateOrganizerOpen);
    handleDrawerOpen();
    console.log("Assign Organizer action triggered.");
  };

  const handleAddJob = () => {
    setIsCreateJobOpen(!isCreateJobOpen);
    handleDrawerOpen();
    console.log("Add Job action triggered.");
  };

  const handleManageTeam = () => {
    setIsManageTeamOpen(!isManageTeamOpen);
    handleDrawerOpen();
    console.log("Manage Team action triggered.");
  };

  const handleSendEmail = () => {
    setIsSendEmailOpen(!isSendEmailOpen);
    handleDrawerOpen();
    console.log("Send Email action triggered.");
  };

  const handleManageTags = () => {
    setIsManageTagsOpen(!isManageTagsOpen);
    handleDrawerOpen();
    console.log("Manage Tags action triggered.");
  };

  const handleFormClose = () => {
    setIsDrawerOpen(false);
    setIsSendEmailOpen(false);
    setIsCreateOrganizerOpen(false);
    setIsCreateJobOpen(false);
    setIsManageTagsOpen(false);
    setIsManageTeamOpen(false);
  };



  const handleMoreActionsClick = (event) => {
    setAnchorE2(event.currentTarget);
  };
  // Define additional action handlers
  const handleArchiveAccount = () => {
    console.log("Additional Action 1 triggered");

    selected.forEach((accountId) => {
      handleSubmit(accountId);
    });
    toast.success("Accounts archived successfully");
    // setIsActiveTrue(false);
    handleClose();
    navigate("/clients/accounts/archivedaccounts");
  };

  const handleEditLoginNotifyEmailSync = () => {
    console.log("EditLoginNotifyEmailSync triggered");
    // handleupdatecontacts(selected)
    setSidebarOpen(true);
    handleClose();
  };

  // create account
  const handleSubmit = (selected) => {
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
    const url = `${ACCOUNT_API}/accounts/accountdetails/${selected}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        console.log(result.updatedAccount); // Log the result
        // setAccountId(result.updatedAccount._id);
        // toast.success("Form submitted successfully"); // Display success toast
      })
      .catch((error) => {
        console.error(error); // Log the error
        toast.error("An error occurred while submitting the form"); // Display error toast
      });
  };

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const [settings, setSettings] = useState({
    login: undefined, // undefined means no action selected
    notify: undefined,
    emailSync: undefined,
  });

  // Handle the change in the select dropdown
  const handleSettingChange = (setting, value) => {
    console.log(value);
    console.log(setting);


    // Map the dropdown values to boolean or undefined
    const mappedValue =
      value === "Assign to all"
        ? true
        : value === "Remove from all"
          ? false
          : undefined;
    console.log(mappedValue);
    setSettings((prevState) => ({
      ...prevState,
      [setting]: mappedValue,
    }));
  };


  const handleupdatecontacts = () => {
    submitupdatecontacts(selected);
  };
  // const { logindata, setLoginData } = useContext(LoginContext);

  const [loginsData, setloginsData] = useState("");

  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState("");
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchUserLoginData = async (id) => {
    const maxLength = 15;
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url + loginsData, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUserData(result.email); // Set a maximum length for userData if email exists

        setUsername(result.username);
      });
  };
  useEffect(() => {
    fetchUserLoginData(loginuserid);
  }, []);

  
  const submitupdatecontacts = (selected) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

  

    const filteredSettings = Object.entries(settings)
      .filter(([_, value]) => value !== undefined) // Only include true or false
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    // Create the payload with selected account IDs and filtered settings
    const payload = {
      accountIds: selected,
      ...filteredSettings, // Spread only defined settings into the payload
    };

    // Debugging: log the payload to check its structure
    console.log("Payload being sent:", payload);

    // Prepare the raw data for the API call
    const raw = JSON.stringify(payload);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/accounts/accounts/update-contacts`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success(
          "Bulk edit in progress, you will receive an email and Inbox+ notification when complete."
        );
        // editMailNotifyLoginSendmail()
        handleCloseSidebar();
      })
      .catch((error) => console.error(error));
  };

 


  const saveBtnCls = "rounded-full px-4 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)]";
  const cancelBtnCls = "rounded-full px-4 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white";
  const inputCls = "rounded border border-gray-200 px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-400";

  return (
    <>
      {/* Filters dropdown */}
      {Boolean(anchorEl) && (
        <div className="fixed inset-0 z-30" onClick={handleClose}>
          <div className="absolute bg-white border border-gray-200 rounded-lg shadow-md w-44" style={{ top: 60, left: 8 }} onClick={e => e.stopPropagation()}>
            {["accountName", "type", "teamMember", "tags"].map(f => (
              <button key={f} type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => { toggleFilter(f); handleClose(); }}>
                {f === "accountName" ? "Account Name" : f === "teamMember" ? "Team Member" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bulk-edit sidebar (login/notify/emailsync) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" onClick={handleCloseSidebar} />
          <div className="absolute right-0 top-0 h-full w-[700px] bg-white shadow-xl flex flex-col p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-base font-semibold">Bulk-edit login, notify, email sync</h2>
                <p className="text-sm text-gray-500">For a selected account</p>
              </div>
              <button type="button" onClick={handleCloseSidebar} className="text-gray-500 hover:text-gray-800 mt-1"><IoClose size={20}/></button>
            </div>
            <hr className="border-gray-200 mb-3"/>
            <p className="text-xs text-gray-500 mb-1">Bulk edit updates all email addresses linked to the selected accounts. You can adjust settings per contact within each account's Info section.</p>
            <p className="text-xs text-gray-500 mb-3">Your clients will be able to access their portal through their email address and receive notifications. Additionally, you can automatically see all email history if you enable email sync.</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Settings</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Login", setting: "login", icon: <FiUser size={14}/> },
                  { label: "Notify", setting: "notify", icon: <FiBell size={14}/> },
                  { label: "Email sync", setting: "emailSync", icon: <FiMail size={14}/> },
                ].map((s, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 px-3"><div className="flex items-center gap-2">{s.icon}<span>{s.label}</span></div></td>
                    <td className="py-2 px-3">
                      <select className={`${inputCls} w-40`} value={settings[s.setting] ?? ""}
                        onChange={(e) => handleSettingChange(s.setting, e.target.value)}>
                        <option value="">— select —</option>
                        <option value="Assign to all">Assign to all</option>
                        <option value="Remove from all">Remove from all</option>
                        <option value="Do nothing">Do nothing</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={handleupdatecontacts} className={saveBtnCls}>Save</button>
              <button type="button" onClick={handleCloseSidebar} className={cancelBtnCls}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : userRole === "TeamMember" && !viewAllAccounts && (!accountData || accountData.length === 0) ? (
        <p className="text-center text-lg font-bold text-red-500 mt-5">You do not have permission to view accounts.</p>
      ) : (
        accountData.length > 0 && (
          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <button type="button" onClick={handleFilterButtonClick} className="text-sm text-blue-600 cursor-pointer hover:underline px-2 py-1">Filters</button>

              {/* Bulk actions */}
              {selected.length > 0 && (
                <div className="flex flex-wrap items-center gap-3" data-test="clients-bulk-actions-panel">
                  <button type="button" onClick={handleAssignOrganizer}
                    disabled={storedData?.teammember?.manageOrganizers === false}
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 disabled:opacity-40">
                    <FiList size={14}/> Send Organizer
                  </button>
                  <button type="button" onClick={handleAddJob}
                    disabled={storedData?.teammember?.managePipelines === false}
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 disabled:opacity-40">
                    <FiList size={14}/> Add Job
                  </button>
                  <button type="button" onClick={handleManageTeam}
                    disabled={storedData?.teammember?.assignTeamMates === false}
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 disabled:opacity-40">
                    <FiUser size={14}/> Manage Team
                  </button>
                  <button type="button" onClick={handleSendEmail} disabled={selected.length === 0}
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 disabled:opacity-40">
                    <FiMail size={14}/> Send Email
                  </button>
                  <button type="button" onClick={handleManageTags}
                    className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600">
                    <FiTag size={14}/> Manage Tags
                  </button>
                  <div className="relative">
                    <button type="button" onClick={handleMoreActionsClick}
                      className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600">
                      <MdMoreVert size={16}/> More Actions
                    </button>
                    {Boolean(anchorE2) && (
                      <div className="absolute left-0 top-6 z-50 bg-white border border-gray-200 rounded-lg shadow-md w-52">
                        <button type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          disabled={storedData?.teammember?.manageAccounts === false}
                          onClick={handleArchiveAccount}>Archive Account</button>
                        <button type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          onClick={handleEditLoginNotifyEmailSync}>Edit login notify emailSync</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Active filters */}
              {showFilters.accountName && (
                <div className="flex items-center gap-1">
                  <input type="text" name="accountName" value={filters.accountName} onChange={handleFilterChange}
                    placeholder="Filter by Account Name" className={inputCls} />
                  <button type="button" onClick={() => clearFilter("accountName")} className="text-red-400 hover:text-red-600"><MdDeleteOutline size={16}/></button>
                </div>
              )}
              {showFilters.type && (
                <div className="flex items-center gap-1">
                  <select name="type" value={filters.type} onChange={handleFilterChange} className={`${inputCls} w-36`}>
                    <option value="">All</option>
                    <option value="Individual">Individual</option>
                    <option value="Company">Company</option>
                  </select>
                  <button type="button" onClick={() => clearFilter("type")} className="text-red-400 hover:text-red-600"><MdDeleteOutline size={16}/></button>
                </div>
              )}
              {showFilters.teamMember && (
                <div className="flex items-center gap-1">
                  <TeamMemberMultiSelectDropDown
                    value={filters.teamMember}
                    onChange={(newValue) => { setFilters(prev => ({ ...prev, teamMember: newValue })); setPage(0); }}
                    width="250px"
                    LOGIN_API={LOGIN_API}
                  />
                  <button type="button" onClick={() => clearFilter("teamMember")} className="text-red-400 hover:text-red-600 ml-1"><MdDeleteOutline size={16}/></button>
                </div>
              )}
              {showFilters.tags && (
                <div className="flex items-center gap-1">
                  <TagsMultiSelectDropDown
                    value={filters.tags.map(tag => ({ value: tag.tagName, label: tag.tagName, colour: tag.tagColour }))}
                    onChange={(newValue) => setFilters(prev => ({ ...prev, tags: newValue.map(item => ({ tagName: item.value, tagColour: item.colour })) }))}
                    options={uniqueTags.map(tag => ({ value: tag.tagName, label: tag.tagName, colour: tag.tagColour }))}
                    width="250px"
                    placeholder="Select tags..."
                  />
                  <button type="button" onClick={() => clearFilter("tags")} className="text-red-400 hover:text-red-600"><MdDeleteOutline size={16}/></button>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs" style={{ tableLayout: "fixed" }}>
                <thead>
                  <tr className="border-b border-gray-200 bg-white">
                    <th className="sticky left-0 bg-white z-10 w-10 py-3 px-2 text-center">
                      <input type="checkbox" className="h-4 w-4 rounded"
                        checked={selected.length === accountData.length && accountData.length > 0}
                        onChange={() => selected.length === accountData.length ? setSelected([]) : setSelected(accountData.map(i => i.id))}
                      />
                    </th>
                    <th className="sticky left-10 bg-white z-10 w-48 py-3 px-4 text-left font-bold cursor-pointer"
                      onClick={() => { if (sortBy === "Name") setSortOrder(sortOrder === "asc" ? "desc" : "asc"); else { setSortBy("Name"); setSortOrder("asc"); } }}>
                      Account Name {sortBy === "Name" && (sortOrder === "asc" ? "▲" : "▼")}
                    </th>
                    {["Type", "Email", "Team Members", "Tags", "Invoices", "Proposals", "Chats", "Pending Organizers"].map(h => (
                      <th key={h} className="py-3 px-4 text-left font-bold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row) => {
                    const isSelected = selected.indexOf(row.id) !== -1;
                    return (
                      <tr key={row.id} onClick={() => handleSelect(row.id)}
                        className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${ isSelected ? 'bg-blue-50' : '' }`}>
                        <td className="sticky left-0 bg-white z-10 py-1 px-2 text-center">
                          <input type="checkbox" className="h-4 w-4 rounded" checked={isSelected} onChange={() => handleSelect(row.id)} onClick={e => e.stopPropagation()} />
                        </td>
                        <td className="sticky left-10 bg-white z-10 py-1 px-4">
                          <Link to={`/clients/accounts/accountsdash/overview/${row.id}`}
                            className="text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>{row.Name}</Link>
                        </td>
                        <td className="py-1 px-4">{row.Type}</td>
                        <td className="py-1 px-4">
                          {row.Follow ? (() => {
                            const emails = row.Follow.split(",").map(e => e.trim());
                            return <span title={emails.join("\n")} className="cursor-pointer">{emails[0]}{emails.length > 1 ? ` +${emails.length - 1}` : ""}</span>;
                          })() : ""}
                        </td>
                        <td className="py-1 px-4">
                          {row.Team.length > 0 && (
                            <span className="text-xs">
                              <span title={row.Team[0].username}>{row.Team[0].username}</span>
                              {row.Team.length > 1 && (
                                <span title={row.Team.slice(1).map(m => m.username).join(", ")} className="ml-1 text-[10px] text-gray-500 cursor-pointer">+{row.Team.length - 1}</span>
                              )}
                            </span>
                          )}
                        </td>
                        <td className="py-1 px-4">
                          {Array.isArray(row.Tags) && row.Tags.length > 0 && (
                            <span className="flex flex-wrap gap-0.5">
                              {row.Tags.slice(0, 1).map(tag => (
                                <span key={tag._id} title={row.Tags.map(t => t.tagName).join(", ")}
                                  className="inline-block px-2 py-0.5 rounded-full text-[10px] text-white cursor-pointer"
                                  style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                              ))}
                              {row.Tags.length > 1 && <span className="text-[10px] text-gray-500 ml-1">+{row.Tags.length - 1}</span>}
                            </span>
                          )}
                        </td>
                        <td className="py-1 px-4">{row.Invoices}</td>
                        <td className="py-1 px-4">{row.Proposals}</td>
                        <td className="py-1 px-4">{row.Unreadchats}</td>
                        <td className="py-1 px-4">{row.Pendingorganizers}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select className={inputCls} value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                  {[30,40,50,60,100].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span>{page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length}</span>
                <button type="button" disabled={page === 0} onClick={() => handleChangePage(null, page - 1)}
                  className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">‹</button>
                <button type="button" disabled={(page + 1) * rowsPerPage >= filteredData.length} onClick={() => handleChangePage(null, page + 1)}
                  className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">›</button>
              </div>
            </div>
          </div>
        )
      )}

      {/* Bulk action drawers */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" onClick={handleDrawerClose} />
          <div className="absolute right-0 top-0 h-full w-[700px] bg-white shadow-xl overflow-y-auto rounded-tl-2xl rounded-bl-2xl">
            {isSendEmailOpen && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold">New Email</span>
                  <button type="button" onClick={handleFormClose} className="text-blue-600 hover:text-blue-800"><RxCross2 size={20}/></button>
                </div>
                <hr className="border-gray-200 mb-3"/>
                <SendAccountEmail selectedAccounts={selected} onClose={handleFormClose} />
              </div>
            )}
            {isCreateJobOpen && (
              <div className="p-4 right-drawers">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold">Create job</span>
                  <button type="button" onClick={handleFormClose} className="text-blue-600 hover:text-blue-800"><RxCross2 size={20}/></button>
                </div>
                <AddJobs selectedAccounts={selected} onClose={handleFormClose} />
              </div>
            )}
            {isCreateOrganizerOpen && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold">Create Organizer</span>
                  <button type="button" onClick={handleFormClose} className="text-blue-600 hover:text-blue-800"><RxCross2 size={20}/></button>
                </div>
                <AddBulkOrganizer selectedAccounts={selected} onClose={handleFormClose} />
              </div>
            )}
            {isManageTagsOpen && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-base font-semibold">Assign Tags for </span>
                    <span className="text-sm text-gray-600">{selected.map(id => accountData.find(a => a.id === id)?.Name || id).join(", ")}</span>
                  </div>
                  <button type="button" onClick={handleFormClose} className="text-blue-600 hover:text-blue-800"><RxCross2 size={20}/></button>
                </div>
                <hr className="border-gray-200 mb-3"/>
                <ManageTags selectedAccounts={selected} onClose={handleFormClose} fetchData={fetchData} />
              </div>
            )}
            {isManageTeamOpen && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-base font-semibold">Assign Team for </span>
                    <span className="text-sm text-gray-600">{selected.map(id => accountData.find(a => a.id === id)?.Name || id).join(", ")}</span>
                  </div>
                  <button type="button" onClick={handleFormClose} className="text-blue-600 hover:text-blue-800"><RxCross2 size={20}/></button>
                </div>
                <hr className="border-gray-200 mb-3"/>
                <ManageTeams selectedAccounts={selected} onClose={handleFormClose} fetchAccountData={fetchData} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FixedColumnTable;

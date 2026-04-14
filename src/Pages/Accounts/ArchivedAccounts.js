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
import { LoginContext } from "../../Sidebar/Context/Context.js";
const FixedColumnTable = () => {
  const navigate = useNavigate();
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [accountData, setAccountData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "Name",
    direction: "asc",
  });

  const [filters, setFilters] = useState({
    accountName: "",
    type: "",
    teamMember: "",
    tags: [],
  });
  const [showFilters, setShowFilters] = useState({
    accountName: false,
    type: false,
    teamMember: false,
    tags: false,
  });

  const [isActiveTrue, setIsActiveTrue] = useState(false);
  const [anchorE2, setAnchorE2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${ACCOUNT_API}/accounts/account/accountdetailslist/${isActiveTrue}`
  //     );
  //     let accountsListData = response.data.accountlist;
  //     console.log("accounts", accountsListData);
  //     // Retrieve team member data from localStorage
  //     const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  //     console.log("recived data", storedData);
  //     const userRole = localStorage.getItem("userRole");
  //     console.log("role is", userRole);
  //     setUserRole(userRole);
  //     // Check if the user is a TeamMember and if they have permission to view accounts (viewallAccounts = true)
  //     //  const canViewAccounts = userRole === "TeamMember" && storedData.teammember?.viewallAccounts;
  //     const canViewAccounts =
  //       userRole === "Admin" || // Admins can always view accounts
  //       (userRole === "TeamMember" && storedData.teammember?.viewallAccounts);

  //     if (canViewAccounts) {
  //       setAccountData(accountsListData);
  //     } else {
  //       setAccountData([]); // Clear account data if not permitted
  //       // setAccountData(accountsListData);
  //     }
  //   } catch (error) {
  //     console.log("Error:", error);
  //   } finally {
  //     setLoading(false); // Stop loader
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [ACCOUNT_API, isActiveTrue]);

  const [viewAllAccounts, setViewAllAccounts] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      console.log("Received stored teamMemberData:", storedData);
      const loginuserid = storedData?.teammember?.userid;
      console.log("User role is:", userRole);

      let url =
        userRole === "Admin"
          ? `${ACCOUNT_API}/accounts/account/accountdetailslist/${isActiveTrue}`
          : `${ACCOUNT_API}/accounts/getaccounts/${loginuserid}/${isActiveTrue}`;

      const response = await axios.get(url);
      console.log("API Response:", response.data.accountlist);

      setAccountData(response.data.accountlist || []);

      if (userRole === "TeamMember") {
        setViewAllAccounts(storedData?.teammember?.viewallAccounts || false);
        if (!storedData?.teammember?.viewallAccounts) {
          setLoading(false);
          return;
        }
      }
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
  }, [userRole]);
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

  // console.log(selected);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value })); // Update filter without clearing others
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
  const filteredData = sortedData.filter((row) => {
    const accountNameMatch = row.Name.toLowerCase().includes(
      filters.accountName.toLowerCase()
    );
    const typeMatch = filters.type
      ? row.Type.toLowerCase() === filters.type.toLowerCase()
      : true;
    const teamMemberMatch = filters.teamMember
      ? row.Team.some((member) => member.username === filters.teamMember)
      : true;
    // const tagMatch = filters.tags.length ? filters.tags.every((tag) => row.Tags.some((rowTag) => rowTag.tagName === tag)) : true;
    // const tagMatch = filters.tags.length ? filters.tags.some((tag) => row.Tags.some((rowTag) => rowTag.tagName === tag.tagName && rowTag.tagColour === tag.tagColour)) : true;
    const tagMatch = filters.tags.length
      ? row.Tags &&
        Array.isArray(row.Tags) &&
        filters.tags.some((tag) =>
          row.Tags.some(
            (rowTag) =>
              rowTag.tagName === tag.tagName &&
              rowTag.tagColour === tag.tagColour
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

  const clearFilter = (filterField) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterField]: "" })); // Clear the specific filter
    setShowFilters((prev) => ({
      ...prev,
      [filterField]: false, // Hide the filter input
    }));
  };

  const toggleFilter = (filterType) => {
    setShowFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };
  const handleMultiSelectChange = (name, values) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: values }));
  };
  const teamMemberOptions = Array.from(
    new Set(
      accountData.flatMap((row) => row.Team.map((member) => member.username))
    )
  );
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
      console.error("Error fetching tags:", error);
    }
  };

  // const uniqueTags =
  //   tags.length > 0
  //     ? Array.from(
  //         new Set(tags.map((tag) => `${tag.tagName}-${tag.tagColour}`))
  //       ).map((tagKey) => {
  //         const [tagName, tagColour] = tagKey.split("-");
  //         return { tagName, tagColour };
  //       })
  //     : [];
  const uniqueTags = Array.from(
    new Map(
      tags.map((tag) => [`${tag.tagName}_${tag.tagColour}`, tag])
    ).values()
  );
  const calculateWidth = (tagName) => tagName.length * 8 + 20;
  // const calculateWidth = (tagName) => {
  //   const baseWidth = 10; // base width for each tag
  //   const charWidth = 8; // approximate width of each character
  //   const padding = 10; // padding on either side
  //   return baseWidth + charWidth * tagName.length + padding;
  // };
  // const handleSort = (key) => {
  //   setSortConfig((prevSortConfig) => {
  //     if (prevSortConfig.key === key) {
  //       return {
  //         key,
  //         direction: prevSortConfig.direction === "asc" ? "desc" : "asc",
  //       };
  //     }
  //     return { key, direction: "asc" };
  //   });
  // };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...paginatedData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    // setPaginatedData(sortedData);
  };
  // const sortedData = React.useMemo(() => {
  //   const dataToSort = filteredData; // Use filteredData for sorting
  //   const sorted = [...dataToSort]; // Create a copy of filteredData

  //   if (sortConfig.key) {
  //     sorted.sort((a, b) => {
  //       if (a[sortConfig.key] < b[sortConfig.key])
  //         return sortConfig.direction === "asc" ? -1 : 1;
  //       if (a[sortConfig.key] > b[sortConfig.key])
  //         return sortConfig.direction === "asc" ? 1 : -1;
  //       return 0;
  //     });
  //   }
  //   return sorted;
  // }, [filteredData, sortConfig]);

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

  const [activeButton, setActiveButton] = useState("active");

  const handleActiveClick = () => {
    setIsActiveTrue(true);
    setActiveButton("active");
    fetchData();
    console.log("Active action triggered.");
  };

  const handleArchivedClick = () => {
    setIsActiveTrue(false);
    setActiveButton("archived");
    fetchData();
    console.log("Archive action triggered.");
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
    toast.success("account Restored successfully");
    // setIsActiveTrue(false);
    handleClose();
    navigate("/clients/accounts/activeaccounts");
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

    // if (setting === 'notify') {
    //   setNotifySetting(setting, value)
    // }
    // if (setting === 'login') {
    //   setLoginSetting(setting, value)
    // }
    // if (setting === 'emailSync') {
    //   setEmailSyncSetting(setting, value)
    // }

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
  // const handleSettingChange = (setting, value) => {
  //   console.log(`Setting: ${setting}, Value: ${value}`);

  //   // Map dropdown values to a boolean or undefined
  //   const mappedValue = value === "Assign to all"
  //     ? true
  //     : value === "Remove from all"
  //     ? false
  //     : undefined;

  //   console.log(`Mapped Value: ${mappedValue}`);

  //   // Update the state with the new setting value
  //   setSettings((prevState) => ({
  //     ...prevState,
  //     [setting]: mappedValue,
  //   }));
  //    // Handle specific settings based on the `setting` type
  //    switch (setting) {
  //     case 'notify':
  //       setNotifySetting(setting, value);
  //       break;
  //     case 'login':
  //       setLoginSetting(setting, value);
  //       break;
  //     case 'emailSync':
  //       setEmailSyncSetting(setting, value);
  //       break;
  //     default:
  //       console.warn(`Unknown setting: ${setting}`);
  //   }
  // };

  const [loginSetting, setLoginSetting] = useState({
    settingName: "",
    value: "",
  });
  const [notifySetting, setNotifySetting] = useState({
    settingName: "",
    value: "",
  });
  const [emailSyncSetting, setEmailSyncSetting] = useState({
    settingName: "",
    value: "",
  });

  const handleupdatecontacts = () => {
    submitupdatecontacts(selected);
  };
  // const { logindata, setLoginData } = useContext(LoginContext);
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");

  useEffect(() => {
    if (logindata?.user?.id) {
      // Check if logindata and user.id exist
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);

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

  const editMailNotifyLoginSendmail = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      // useremail:"dipika@microtechsolutions.co.in",
      useremail: userData,
      operations: {
        login: loginSetting.value,
        notify: notifySetting.value,
        emailSync: emailSyncSetting.value,
      },
      accountsSummary: {
        total: "1",
        successful: "1",
        failed: "0",
      },
      timestamp: "10.21",
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/editnotifyloginemailsync`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };
  const submitupdatecontacts = (selected) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // // Safely extract only the necessary fields from settings
    // const { login, notify, emailSync } = settings;

    // // Ensure login, notify, and emailSync are booleans or null (not components or DOM elements)
    // const payload = {
    //   accountIds: selected,
    //   login: login === undefined ? null : login, // Nullify if undefined
    //   notify: notify === undefined ? null : notify,
    //   emailSync: emailSync === undefined ? null : emailSync,
    // };

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
  // const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  // const handleDeleteSelected = async () => {
  //   const isConfirmed = window.confirm(
  //     "Are you sure you want to delete the selected accounts?"
  //   );

  //   if (isConfirmed) {
  //     try {
  //       // Delete selected accounts and extract their data
  //       const deletedAccounts = await Promise.all(
  //         selected.map(async (id) => {
  //           const response = await axios.delete(
  //             `${ACCOUNT_API}/accounts/accountdetails/${id}`
  //           );
  //           return response.data.deletedAccount; // Extract deleted account data
  //         })
  //       );

  //       // Extract user IDs from deleted accounts
  //       const userIds = deletedAccounts.map((acc) => acc.userid);

  //       // Get user data and client data before deletion
  //       const usersData = await Promise.all(
  //         userIds.map(async (userid) => {
  //           const response = await axios.get(
  //             `${LOGIN_API}/common/user/${userid}`
  //           );
  //           return response.data; // Get user data
  //         })
  //       );

  //       const clientsData = await Promise.all(
  //         userIds.map(async (userid) => {
  //           console.log("clientid", userid);
  //           const response = await axios.get(
  //             `${LOGIN_API}/admin/client/${userid}`
  //           );
  //           return response.data; // Get client data
  //         })
  //       );

  //       // Extract client IDs from retrieved client data
  //       // const clientIds = clientsData.map(client => client._id);
  //       const clientIds = clientsData
  //         .map((clientObj) => clientObj.client?._id)
  //         .filter((id) => id);

  //       console.log("clients", clientsData);
  //       // Delete users
  //       await Promise.all(
  //         userIds.map((userid) =>
  //           axios.delete(`${LOGIN_API}/common/user/${userid}`)
  //         )
  //       );

  //       // Delete clients
  //       await Promise.all(
  //         clientIds.map((clientId) =>
  //           axios.delete(`${LOGIN_API}/admin/clientsignup/${clientId}`)
  //         )
  //       );

  //       // Update UI to remove deleted accounts
  //       setAccountData((prevContacts) =>
  //         prevContacts.filter((account) => !selected.includes(account.id))
  //       );

  //       toast.success(
  //         "Selected account deleted successfully!"
  //       );
  //       setSelected([]); // Clear selected contacts
  //     } catch (error) {
  //       console.error("Delete API Error:", error);
  //       toast.error("Failed to delete selected accounts, users, or clients.");
  //     }
  //   }
  // };
const handleDeleteSelected = async () => {
  const isConfirmed = window.confirm(
    "Are you sure you want to delete the selected accounts?"
  );

  if (!isConfirmed) return;

  try {
    // Call backend delete API for all selected accounts
    const deletedResults = await Promise.all(
      selected.map(async (id) => {
        const response = await axios.delete(
          `${ACCOUNT_API}/accounts/accountdetails/${id}`
        );
        return response.data; // backend already deletes account, users, clients
      })
    );

    console.log("Deleted results:", deletedResults);

    // Update UI to remove deleted accounts
    setAccountData((prevAccounts) =>
      prevAccounts.filter((account) => !selected.includes(account.id))
    );

    toast.success("Selected accounts (with users & clients) deleted successfully!");
    setSelected([]); // Clear selected
  } catch (error) {
    console.error("Delete API Error:", error);
    toast.error("Failed to delete selected accounts.");
  }
};

  const [openDialog, setOpenDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDeleteClick = () => {
    setOpenDialog(true);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    if (confirmText === "DELETE") {
      console.log("Accounts deleted");
      await handleDeleteSelected();
      setOpenDialog(false);
      setConfirmText("");
    }
  };
  // const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  // const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
  // const handleDeleteSelected = async () => {
  //   try {
  //     // Delete selected accounts and extract their data
  //     const deletedAccounts = await Promise.all(
  //       selected.map(async (id) => {
  //         try {
  //           const response = await axios.delete(
  //             `${ACCOUNT_API}/accounts/accountdetails/${id}`
  //           );
  //           console.log("Deleted Account Response:", response.data);
  //           return response.data.deletedAccount || null; // Ensure deletedAccount exists
  //         } catch (error) {
  //           console.error(`Failed to delete account with ID ${id}:`, error);
  //           return null; // Skip failed deletions
  //         }
  //       })
  //     );

  //     // Filter out null responses and extract user IDs
  //     const userIds = deletedAccounts
  //       .filter((acc) => acc && acc.userid) // Skip if userid is missing
  //       .map((acc) => acc.userid);

  //     if (userIds.length === 0) {
  //       console.warn(
  //         "No user IDs found in deleted accounts. Skipping user deletion."
  //       );
  //     } else {
  //       // Get user data and client data before deletion
  //       const usersData = await Promise.all(
  //         userIds.map(async (userid) => {
  //           const response = await axios.get(
  //             `${LOGIN_API}/common/user/${userid}`
  //           );
  //           return response.data;
  //         })
  //       );

  //       const clientsData = await Promise.all(
  //         userIds.map(async (userid) => {
  //           console.log("clientid", userid);
  //           const response = await axios.get(
  //             `${LOGIN_API}/admin/client/${userid}`
  //           );
  //           return response.data;
  //         })
  //       );

  //       // Extract client IDs from retrieved client data
  //       const clientIds = clientsData
  //         .map((clientObj) => clientObj.client?._id)
  //         .filter((id) => id);

  //       console.log("clients", clientsData);

  //       // Delete users if userIds exist
  //       await Promise.all(
  //         userIds.map((userid) =>
  //           axios.delete(`${LOGIN_API}/common/user/${userid}`)
  //         )
  //       );

  //       // Delete clients if clientIds exist
  //       if (clientIds.length > 0) {
  //         await Promise.all(
  //           clientIds.map((clientId) =>
  //             axios.delete(`${LOGIN_API}/admin/clientsignup/${clientId}`)
  //           )
  //         );
  //       }
  //     }

  //     // ✅ DELETE JOBS by account IDs
  //     if (selected.length > 0) {
  //       console.log("Deleting jobs for account IDs:", selected);
       
  //       try {
  //         const jobDeleteResponse = await axios.delete(
  //           `${JOBS_API}/workflow/jobs/by-account/${selected.join(",")}`
  //         );
  //         console.log("Deleted Job Response:", jobDeleteResponse.data);
  //       } catch (error) {
  //         console.error(
  //           "Failed to delete jobs for selected account IDs:",
  //           error
  //         );
  //       }
  //     }
      
  //     // ✅ DELETE INVOICE by account IDs
  //     if (selected.length > 0) {
  //       console.log("Deleting invoices for account IDs:", selected);
       
  //       try {
  //         const invoiceDeleteResponse = await axios.delete(
  //           `${INVOICE_NEW}/workflow/invoices/invoices/by-account/${selected.join(",")}`
  //         );
  //         console.log("Deleted Job Response:", invoiceDeleteResponse.data);
  //       } catch (error) {
  //         console.error(
  //           "Failed to delete jobs for selected account IDs:",
  //           error
  //         );
  //       }
  //     }

  //     // Update UI to remove deleted accounts
  //     setAccountData((prevContacts) =>
  //       prevContacts.filter((account) => !selected.includes(account.id))
  //     );

  //     toast.success("Selected account(s) deleted successfully!");
  //     setSelected([]); // Clear selected contacts
  //   } catch (error) {
  //     console.error("Delete API Error:", error);
  //     toast.error("Failed to delete selected accounts, users, or clients.");
  //   }
  // };

  const saveBtnCls = "rounded-full px-4 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)]";
  const cancelBtnCls = "rounded-full px-4 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white";
  const inputCls = "rounded border border-gray-200 px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-400";

  return (
    <>
      {/* <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: "10px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}></Box>
          </Box>

          <Outlet />
        </Box> */}

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

      {/* Bulk-edit sidebar */}
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
      ) : userRole === "TeamMember" && !viewAllAccounts ? (
        <p className="text-center text-lg font-bold text-red-500 mt-5">You do not have permission to view accounts.</p>
      ) : (
        accountData.length > 0 && (
          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <button type="button" onClick={handleFilterButtonClick} className="text-sm text-blue-600 cursor-pointer hover:underline px-2 py-1">Filters</button>

              {selected.length > 0 && (
                <div className="flex flex-wrap items-center gap-3" data-test="clients-bulk-actions-panel">
                  <button type="button" onClick={handleAssignOrganizer} className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600"><FiList size={14}/> Send Organizer</button>
                  <button type="button" onClick={handleAddJob} className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600"><FiList size={14}/> Add Job</button>
                  <button type="button" onClick={handleManageTeam} className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600"><FiUser size={14}/> Manage Team</button>
                  <button type="button" onClick={handleSendEmail} disabled={selected.length === 0} className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 disabled:opacity-40"><FiMail size={14}/> Send Email</button>
                  <button type="button" onClick={handleManageTags} className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600"><FiTag size={14}/> Manage Tags</button>
                  <div className="relative">
                    <button type="button" onClick={handleMoreActionsClick} className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600"><MdMoreVert size={16}/> More Actions</button>
                    {Boolean(anchorE2) && (
                      <div className="absolute left-0 top-6 z-50 bg-white border border-gray-200 rounded-lg shadow-md w-52">
                        <button type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={handleArchiveAccount}>Active Account</button>
                        <button type="button" className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={handleEditLoginNotifyEmailSync}>Edit login notify emailSync</button>
                        <button type="button" className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={handleDeleteClick}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Delete confirmation dialog */}
              {openDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setOpenDialog(false)} />
                  <div className="relative bg-white rounded-xl shadow-xl w-[480px] p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold">Delete Confirmation</h3>
                      <button type="button" onClick={() => setOpenDialog(false)} className="text-gray-400 hover:text-gray-700"><RxCross2 size={18}/></button>
                    </div>
                    <hr className="border-gray-200 mb-3"/>
                    <p className="text-sm text-gray-700 mb-2">
                      Are you sure you want to delete <strong>{selected.length}</strong> {selected.length === 1 ? "account" : "accounts"}? This action is not reversible. If you proceed, <strong>all files and data associated with them will be deleted.</strong>
                    </p>
                    <p className="text-sm text-gray-700 mb-3">If you would like to proceed, please type <strong>DELETE</strong> below.</p>
                    <input type="text" className={`${inputCls} w-full`} value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="Please enter the word DELETE" />
                    <div className="flex gap-2 mt-4 justify-end">
                      <button type="button" onClick={handleConfirmDelete}
                        disabled={confirmText !== "DELETE"}
                        className="px-4 py-1.5 rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-40">Delete</button>
                      <button type="button" onClick={() => setOpenDialog(false)}
                        className={cancelBtnCls}>Cancel</button>
                    </div>
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
                  <select name="teamMember" value={filters.teamMember} onChange={handleFilterChange} className={`${inputCls} w-40`}>
                    <option value="">All</option>
                    {teamMemberOptions.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <button type="button" onClick={() => clearFilter("teamMember")} className="text-red-400 hover:text-red-600"><MdDeleteOutline size={16}/></button>
                </div>
              )}
              {showFilters.tags && (
                <div className="flex items-center gap-1">
                  <div className="flex flex-wrap gap-1 rounded border border-gray-200 px-2 py-1 bg-white min-w-[200px] max-w-[300px]">
                    {filters.tags.map(tag => (
                      <span key={tag.tagName} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-white"
                        style={{ backgroundColor: tag.tagColour }}>
                        {tag.tagName}
                        <button type="button" onClick={() => handleMultiSelectChange("tags", filters.tags.filter(t => t.tagName !== tag.tagName))} className="hover:opacity-70"><IoClose size={10}/></button>
                      </span>
                    ))}
                    <select className="text-xs border-none outline-none bg-transparent"
                      value=""
                      onChange={(e) => {
                        const opt = uniqueTags.find(t => t.tagName === e.target.value);
                        if (opt && !filters.tags.find(t => t.tagName === opt.tagName)) {
                          handleMultiSelectChange("tags", [...filters.tags, { tagName: opt.tagName, tagColour: opt.tagColour }]);
                        }
                      }}>
                      <option value="">+ Add tag</option>
                      {uniqueTags.map(t => <option key={t.tagName} value={t.tagName}>{t.tagName}</option>)}
                    </select>
                  </div>
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
                        className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
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
                <ManageTags selectedAccounts={selected} onClose={handleFormClose} />
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
                <ManageTeams selectedAccounts={selected} onClose={handleFormClose} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FixedColumnTable;

{
  /* <TableCell
                      style={{ display: "flex", alignItems: "center" }}
                      height="40"
                    >
                      {row.Team.map((member) => {
                        // Generate initials from the username
                        const initials = member.username
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase();

                        return (
                          <Tooltip
                            key={member._id}
                            title={member.username}
                            placement="top"
                          >
                            <span
                              style={{
                                display: "inline-block",
                                backgroundColor: "#3f51b5", // Customize badge color as needed
                                color: "#fff",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginRight: "5px",
                                cursor: "pointer",
                              }}
                            >
                              {initials}
                            </span>
                          </Tooltip>
                        );
                      })}
                    </TableCell> */
}
{
  /* <TableCell>
<AvatarGroup max={2}>
      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
      <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
      <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
      <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
    </AvatarGroup>
</TableCell> */
}
{
  /* {sortConfig.key === "Name" && (sortConfig.direction === "asc" ? "↑" : "↓")} */
}
{
  /* {sortConfig.key === "Name"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : null} */
}
{
  /* <TableCell width="100">Pending Signatures</TableCell> */
}
{
  /* <TableCell width="100">Credits</TableCell> */
}
{
  /* <TableCell width="100">Tasks</TableCell> */
}
{
  /* <TableCell width="100">Last Login</TableCell> */
}
{
  /* <TableCell>{row.Credits}</TableCell> */
}
{
  /* <TableCell>{row.Tasks}</TableCell> */
}
{
  /* <TableCell>{row.Pendingsignatures}</TableCell> */
}
{
  /* <TableCell>{row.Lastlogin}</TableCell> */
}

{
  /* <TableContainer
            component={Paper}
            style={{ width: "100%", overflowX: "auto" }}
          >
            <Table style={{ tableLayout: "fixed", width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      background: "#fff",
                    }}
                  >
                    <Checkbox
                      checked={selected.length === accountData.length}
                      onChange={() => {
                        if (selected.length === accountData.length) {
                          setSelected([]);
                        } else {
                          const allSelected = accountData.map(
                            (item) => item.id
                          );
                          setSelected(allSelected);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell
                    // onClick={() => handleSort("Name")}
                    onClick={() => {
                      if (sortBy === "Name") {
                        // Toggle sorting order if the same column is clicked
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        // Set a new column to sort by
                        setSortBy("Name");
                        setSortOrder("asc");
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      position: "sticky",
                      left: 50,
                      zIndex: 1,
                      background: "#fff",
                    }}
                    width="200"
                  >
                    AccountName{" "}
                    {sortBy === "Name" && (sortOrder === "asc" ? "▲" : "▼")}
                  </TableCell>
                  <TableCell width="100">Type</TableCell>
                  <TableCell width="250">Email</TableCell>
                  <TableCell width="100" height="60">
                    Team Members
                  </TableCell>
                  <TableCell width="100">Tags</TableCell>
                  <TableCell width="100">Invoices</TableCell>
                  <TableCell width="100">Proposals</TableCell>
                  <TableCell width="100">Chats</TableCell>
                  <TableCell width="100">Pending Organizers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => {
                  const isSelected = selected.indexOf(row.id) !== -1;
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      onClick={() => handleSelect(row.id)}
                      role="checkbox"
                      tabIndex={-1}
                      selected={isSelected}
                    >
                      <TableCell
                        padding="checkbox"
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          background: "#fff",
                        }}
                      >
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell
                        style={{
                          position: "sticky",
                          left: 50,
                          zIndex: 1,
                          background: "#fff",
                        }}
                      >
                        <Link
                          to={`/clients/accounts/accountsdash/overview/${row.id}`}
                        >
                          {row.Name}
                        </Link>
                      </TableCell>
                      <TableCell>{row.Type}</TableCell>
                      <TableCell>
                        {row.Follow
                          ? (() => {
                              const emails = row.Follow.split(",").map(
                                (email) => email.trim()
                              );
                              return (
                                <Tooltip
                                  title={emails.join("\n")}
                                  arrow
                                  placement="top"
                                >
                                  <Typography
                                    sx={{ cursor: "pointer", fontSize: "15px" }}
                                  >
                                    {emails[0]}{" "}
                                    {emails.length > 1
                                      ? `+${emails.length - 1}`
                                      : ""}
                                  </Typography>
                                </Tooltip>
                              );
                            })()
                          : ""}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AvatarGroup max={2}>
                            {row.Team.map((member) => {
                              const size = 25;
                              // Generate initials from the username
                              const initials = member.username
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase();

                              return (
                                <Tooltip
                                  key={member._id}
                                  title={member.username}
                                  placement="top"
                                >
                                  {member.avatar ? (
                                    <Avatar
                                      alt={member.username}
                                      src={member.avatar}
                                      sx={{ width: size, height: size }}
                                    />
                                  ) : (
                                    <Avatar
                                      sx={{
                                        width: size,
                                        height: size,
                                        backgroundColor: "#3f51b5",
                                        color: "#fff",
                                        fontSize: `${size * 0.4}px`,
                                      }}
                                    >
                                      {initials}
                                    </Avatar>
                                  )}
                                </Tooltip>
                              );
                            })}
                          </AvatarGroup>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {Array.isArray(row.Tags) && row.Tags.length > 0 ? (
                          row.Tags.length > 1 ? (
                            <Tooltip
                              title={
                                <div>
                                  {row.Tags.map((tag) => (
                                    <div
                                      key={tag._id}
                                      style={{
                                        background: tag.tagColour,
                                        color: "#fff",
                                        borderRadius: "8px",
                                        padding: "2px 8px",
                                        marginBottom: "2px",
                                        fontSize: "10px",
                                      }}
                                    >
                                      {tag.tagName}
                                    </div>
                                  ))}
                                </div>
                              }
                              placement="top"
                            >
                              <span
                                style={{
                                  background: row.Tags[0].tagColour, // Show color of the first tag
                                  color: "#fff",
                                  borderRadius: "8px",
                                  padding: "2px 8px",
                                  fontSize: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                {row.Tags[0].tagName}
                              </span>
                            </Tooltip>
                          ) : (
                            row.Tags.map((tag) => (
                              <span
                                key={tag._id}
                                style={{
                                  background: tag.tagColour,
                                  color: "#fff",
                                  borderRadius: "8px",
                                  padding: "2px 8px",
                                  fontSize: "10px",
                                  marginLeft: "3px",
                                }}
                              >
                                {tag.tagName}
                              </span>
                            ))
                          )
                        ) : null}
                        {Array.isArray(row.Tags) && row.Tags.length > 1 && (
                          <span
                            style={{
                              marginLeft: "5px",
                              fontSize: "10px",
                              color: "#555",
                            }}
                          >
                            +{row.Tags.length - 1}
                          </span>
                        )}
                      </TableCell>

                      <TableCell>{row.Invoices}</TableCell>

                      <TableCell>{row.Proposals}</TableCell>
                      <TableCell>{row.Unreadchats}</TableCell>
                      <TableCell>{row.Pendingorganizers}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer> */
}

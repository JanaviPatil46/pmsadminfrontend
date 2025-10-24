import React, { useEffect, useState, useContext } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  TablePagination,
  Chip,
  Tooltip,
  Autocomplete,
  Box,
  Divider,
  Typography,
  OutlinedInput,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  Menu,
  Button,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,ListItemText
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Outlet } from "react-router-dom";
import ListIcon from "@mui/icons-material/List";
import EmailIcon from "@mui/icons-material/Email";
import TagIcon from "@mui/icons-material/Tag";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendAccountEmail from "../BulkActions/SendAccountEmail";
import AddJobs from "../BulkActions/AddJobs";
import AddBulkOrganizer from "../BulkActions/AddBulkOrganizer";
import ManageTags from "../BulkActions/ManageTags";
import ManageTeams from "../BulkActions/ManageTeams";
import { useTheme } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CircularProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import "../account.css";
import { useNavigate } from "react-router-dom";
import TagsMultiSelectDropDown from "./TagsMultiSelectDropDown.js"
import TeamMemberMultiSelectDropDown from "./TeamMemberMultiSelectDropDown.js"
import { LoginContext } from "../../Sidebar/Context/Context.js";
import Cookies from 'js-cookie';
const FixedColumnTable = () => {
  const WINDOWS_PORT = process.env.REACT_APP_SERVER_URI;
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
  console.log(logindata);
  useEffect(() => {
    if (logindata?.user?.id) {
      // Check if logindata and user.id exist
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  console.log("userid", loginuserid);
  const navigate = useNavigate();
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
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

 


  return (
    <>
      <div style={{ display: "flex" }}>
       

        <Drawer
          anchor="right"
          open={isSidebarOpen}
          onClose={handleCloseSidebar}
          PaperProps={{
            id: "tag-drawer",
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : 700,
              maxWidth: "100%",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
            },
          }}
        >
          <div style={{ padding: 16, position: "relative" }}>
            <DialogTitle>
              Bulk-edit login, notify, email sync
              <Typography variant="subtitle1">
                For a selected account
              </Typography>
              <IconButton
                onClick={handleCloseSidebar}
                style={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Bulk edit updates all email addresses linked to the selected
                accounts. You can adjust settings per contact within each
                account's Info section.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your clients will be able to access their portal through their
                email address and receive notifications. Additionally, you can
                automatically see all email history if you enable email sync.
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Settings</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        label: "Login",
                        setting: "login",
                        icon: <PersonIcon />,
                      },
                      {
                        label: "Notify",
                        setting: "notify",
                        icon: <NotificationsIcon />,
                      },
                      {
                        label: "Email sync",
                        setting: "emailSync",
                        icon: <EmailIcon />,
                      },
                    ].map((setting, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {setting.icon}
                            <Typography
                              variant="body2"
                              style={{ marginLeft: 8 }}
                            >
                              {setting.label}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={settings[setting.setting]} // Controlled value based on state
                            onChange={(e) =>
                              handleSettingChange(
                                setting.setting,
                                e.target.value
                              )
                            } // Handle change
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            sx={{ width: "150px" }}
                          >
                            <MenuItem value="Assign to all">
                              Assign to all
                            </MenuItem>
                            <MenuItem value="Remove from all">
                              Remove from all
                            </MenuItem>
                            <MenuItem value="Do nothing">Do nothing</MenuItem>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>

            <DialogActions>
              <Button
                variant="contained"
                onClick={handleupdatecontacts}
                sx={{
                  backgroundColor: "var(--color-save-btn)", // Normal background

                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                  },
                  width: "80px",
                  borderRadius: "15px",
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseSidebar}
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
            </DialogActions>
          </div>
        </Drawer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              toggleFilter("accountName");
              handleClose();
            }}
          >
            Account Name
          </MenuItem>
          <MenuItem
            onClick={() => {
              toggleFilter("type");
              handleClose();
            }}
          >
            Type
          </MenuItem>
          <MenuItem
            onClick={() => {
              toggleFilter("teamMember");
              handleClose();
            }}
          >
            Team Member
          </MenuItem>
          <MenuItem
            onClick={() => {
              toggleFilter("tags");
              handleClose();
            }}
          >
            Tags
          </MenuItem>
        </Menu>
      </div>
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
      ) : // userRole === "TeamMember" && !viewAllAccounts ?
      userRole === "TeamMember" &&
        !viewAllAccounts &&
        (!accountData || accountData.length === 0) ? (
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            color: "red",
            marginTop: "20px",
          }}
        >
          You do not have permission to view accounts.
        </Typography>
      ) : (
        accountData.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 1 }}>
              <Box
                sx={{
                  width: "50px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  color: "#3f51b5",
                }}
                onClick={handleFilterButtonClick}
              >
                
                Filters
                
              </Box>
              <Box>
                {selected.length > 0 && (
                  <div
                    data-test="clients-bulk-actions-panel"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px",
                      // marginBottom: "20px",
                      // borderBottom: "1px solid #ddd",
                      // backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Button
                      variant="text"
                      startIcon={<ListIcon />}
                      onClick={handleAssignOrganizer}
                      // disabled={!storedData?.teammember?.manageOrganizers}
                      disabled={
                        storedData?.teammember?.manageOrganizers === false
                      }
                    >
                      Send Organizer
                    </Button>
                    <Button
                      variant="text"
                      startIcon={<ListIcon />}
                      onClick={handleAddJob}
                      // disabled={!storedData?.teammember?.managePipelines}
                      disabled={
                        storedData?.teammember?.managePipelines === false
                      }
                    >
                      Add Job
                    </Button>
                    <Button
                      variant="text"
                      startIcon={<PersonIcon />}
                      onClick={handleManageTeam}
                      // disabled={!storedData?.teammember?.assignTeamMates}
                      disabled={
                        storedData?.teammember?.assignTeamMates === false
                      }
                    >
                      Manage Team
                    </Button>
                    <Button
                      variant="text"
                      startIcon={<EmailIcon />}
                      disabled={selected.length === 0}
                      onClick={handleSendEmail}
                    >
                      Send Email
                    </Button>
                    <Button
                      variant="text"
                      startIcon={<TagIcon />}
                      onClick={handleManageTags}
                    >
                      Manage Tags
                    </Button>
                    <Button
                      variant="text"
                      startIcon={<MoreVertIcon />}
                      onClick={handleMoreActionsClick}
                    >
                      More Actions
                    </Button>

                    {/* Dropdown menu for additional actions */}
                    <Menu
                      anchorEl={anchorE2}
                      open={Boolean(anchorE2)}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <MenuItem
                        onClick={handleArchiveAccount}
                        // disabled={!storedData?.teammember?.manageAccounts}
                        disabled={
                          storedData?.teammember?.manageAccounts === false
                        }
                      >
                        Archive Account
                      </MenuItem>
                      <MenuItem onClick={handleEditLoginNotifyEmailSync}>
                        Edit login notify emailSync
                      </MenuItem>
                    </Menu>
                  </div>
                )}
              </Box>

            
              {/* Account Name Filter */}
              {showFilters.accountName && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    // marginBottom: "10px",
                  }}
                >
                  <TextField
                    name="accountName"
                    value={filters.accountName}
                    onChange={handleFilterChange}
                    placeholder="Filter by Account Name"
                    variant="outlined"
                    size="small"
                    style={{ marginRight: "10px" }}
                  />
                  <DeleteIcon
                    onClick={() => clearFilter("accountName")}
                    style={{ cursor: "pointer", color: "red" }}
                  />
                </div>
              )}

              {/* Type Filter */}
              {showFilters.type && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    // marginBottom: "10px",
                  }}
                >
                  <FormControl
                    variant="outlined"
                    size="small"
                    style={{ marginRight: "10px", width: "150px" }}
                  >
                    <InputLabel>Type</InputLabel>
                    <Select
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                      label="Type"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Individual">Individual</MenuItem>
                      <MenuItem value="Company">Company</MenuItem>
                    </Select>
                  </FormControl>
                  <DeleteIcon
                    onClick={() => clearFilter("type")}
                    style={{ cursor: "pointer", color: "red" }}
                  />
                </div>
              )}
             
  
{showFilters.teamMember && (
  <div style={{ display: "flex", alignItems: "center" }}>
    <Box sx={{ mr: 3 }}>
      {/* <TeamMemberMultiSelectDropDown
        // value={filters.teamMember.map(id => ({
           
        //   value: id, 
        //   label: username
        // }))}
        value={filters.teamMember.map(id => {
  console.log("id:", id);
  return {
    value: id,
    label: username   // temporary placeholder until you map to real username
  };
})}

        onChange={(newValue) => {
            console.log("Selected team members:", newValue);
          setFilters(prev => ({ 
            ...prev, 
            teamMember: newValue.map(item => item.value) // Store just the IDs
          }));
          setPage(0);
        }}
      
        width="250px"
        LOGIN_API={LOGIN_API}
      /> */}
      <TeamMemberMultiSelectDropDown
  value={filters.teamMember}   // just array of IDs like ["689c4d64...", "6880af58..."]
  onChange={(newValue) => {
    console.log("Selected team members:", newValue);
    setFilters(prev => ({ 
      ...prev, 
      teamMember: newValue      // newValue will already be array of IDs
    }));
    setPage(0);
  }}
  width="250px"
  LOGIN_API={LOGIN_API}
/>

    </Box>
    <DeleteIcon
      onClick={() => clearFilter("teamMember")}
      style={{ cursor: "pointer", color: "red", marginLeft: 5 }}
    />
  </div>
)}
              {/* Tags Filter */}
              {showFilters.tags && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "250px",
                    gap: 3,
                    // marginBottom: "10px",
                  }}
                >
                 
                  <Box mr={3}> <TagsMultiSelectDropDown
  value={filters.tags.map(tag => ({
    value: tag.tagName,
    label: tag.tagName,
    colour: tag.tagColour
  }))}
  onChange={(newValue) => {
    setFilters(prev => ({
      ...prev,
      tags: newValue.map(item => ({
        tagName: item.value,
        tagColour: item.colour
      }))
    }));
  }}
  options={uniqueTags.map(tag => ({
    value: tag.tagName,
    label: tag.tagName,
    colour: tag.tagColour
  }))}
  width="250px"
  placeholder="Select tags..."
/></Box>
                 
                  <DeleteIcon
                    onClick={() => clearFilter("tags")}
                    style={{ cursor: "pointer", color: "red" }}
                  />
                </div>
              )}
            </Box>
            <TableContainer sx={{ mt: 2 }}>
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
                        fontSize: "2px", // Set a professional font size
                        fontWeight: "bold",
                        textAlign: "center",
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
                      onClick={() => {
                        if (sortBy === "Name") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
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
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "16px", // Add more padding for better spacing
                      }}
                      width="200"
                    >
                      Account Name{" "}
                      {sortBy === "Name" && (sortOrder === "asc" ? "▲" : "▼")}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "16px",
                      }}
                      width="100"
                    >
                      Type
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "16px",
                      }}
                      width="250"
                    >
                      Email
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "16px",
                      }}
                      width="200"
                      height="60"
                    >
                      Team Members
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "16px",
                      }}
                      width="200"
                    >
                      Tags
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "16px",
                      }}
                      width="100"
                    >
                      Invoices
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "16px",
                      }}
                      width="100"
                    >
                      Proposals
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "16px",
                      }}
                      width="100"
                    >
                      Chats
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "16px",
                      }}
                      width="100"
                    >
                      Pending Organizers
                    </TableCell>
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
                        style={{
                          cursor: "pointer",
                          transition: "background-color 0.3s ease",
                          "&:hover": {
                            backgroundColor: "#f4f4f4", // Add hover effect
                          },
                        }}
                      >
                        <TableCell
                          padding="checkbox"
                          style={{
                            position: "sticky",
                            left: 0,
                            zIndex: 1,
                            background: "#fff",
                            fontSize: "12px",
                            textAlign: "center",
                            padding: "4px 8px",
                            lineHeight: "1",
                            // padding: "2px", // Adjust padding for better spacing
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
                            fontSize: "12px",
                            fontWeight: "normal",
                          }}
                        >
                          <Link
                            to={`/clients/accounts/accountsdash/overview/${row.id}`}
                            style={{ textDecoration: "none", color: "#3f51b5" }}
                          >
                            {row.Name}
                          </Link>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            lineHeight: "1",
                          }}
                        >
                          {row.Type}
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            lineHeight: "1",
                          }}
                        >
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
                                      sx={{
                                        cursor: "pointer",
                                        fontSize: "12px",
                                      }}
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
                        <TableCell
                          style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            lineHeight: "1",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {row.Team.length > 0 && (
                              <>
                                <Tooltip
                                  title={row.Team[0].username}
                                  placement="top"
                                >
                                  <span style={{ marginRight: 8 }}>
                                    {row.Team[0].username}
                                  </span>
                                </Tooltip>

                                {row.Team.length > 1 && (
                                  <Tooltip
                                    title={row.Team.slice(1)
                                      .map((member) => member.username)
                                      .join(", ")}
                                    placement="top"
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        marginLeft: "2px",
                                        cursor: "pointer",
                                        fontSize: "10px",
                                        color: "#555",
                                      }}
                                    >
                                      +{row.Team.length - 1}
                                    </Typography>
                                  </Tooltip>
                                )}
                              </>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            lineHeight: "1",
                          }}
                        >
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
                                    background: row.Tags[0].tagColour,
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
                        <TableCell
                          style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            lineHeight: "1",
                          }}
                        >
                          {row.Invoices}
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            lineHeight: "1",
                          }}
                        >
                          {row.Proposals}
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            lineHeight: "1",
                          }}
                        >
                          {row.Unreadchats}
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            lineHeight: "1",
                          }}
                        >
                          {row.Pendingorganizers}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[30, 40, 50, 60, 100]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        )
      )}

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          id: "tag-drawer",
          sx: {
            borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
            width: isSmallScreen ? "100%" : 700,
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
          {isSendEmailOpen && (
            <Box p={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">New Email</Typography>
                <IconButton onClick={handleFormClose} sx={{ color: "blue" }}>
                  <RxCross2 fontSize="large" />
                </IconButton>
              </Box>

              <Divider sx={{ my: 2 }} />

              <SendAccountEmail
                selectedAccounts={selected}
                onClose={handleFormClose}
              />
            </Box>
          )}

          {isCreateJobOpen && (
            <Box p={2} className="right-drawers">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Create job</Typography>
                <IconButton onClick={handleFormClose} sx={{ color: "blue" }}>
                  <RxCross2 fontSize="large" />
                </IconButton>
              </Box>

              <AddJobs selectedAccounts={selected} onClose={handleFormClose} />
            </Box>
          )}

          {isCreateOrganizerOpen && (
            <Box p={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Create Organizer</Typography>
                <IconButton onClick={handleFormClose} sx={{ color: "blue" }}>
                  <RxCross2 fontSize="large" />
                </IconButton>
              </Box>

              <AddBulkOrganizer
                selectedAccounts={selected}
                onClose={handleFormClose}
              />
            </Box>
          )}

          {isManageTagsOpen && (
            <Box p={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Assign Tags for </Typography>

                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  {selected
                    .map((id) => {
                      const account = accountData.find(
                        (account) => account.id === id
                      );
                      return account ? account.Name : id; // Fallback to ID if name is not found
                    })
                    .join(", ")}{" "}
                  {/* Joining account names with commas */}
                </Typography>

                <IconButton onClick={handleFormClose} sx={{ color: "blue" }}>
                  <RxCross2 fontSize="large" />
                </IconButton>
              </Box>

              <Divider sx={{ my: 2 }} />

              <ManageTags
                selectedAccounts={selected}
                onClose={handleFormClose}
                fetchData={fetchData}
              />
            </Box>
          )}

          {isManageTeamOpen && (
            <Box p={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Assign Team for</Typography>

                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  {selected
                    .map((id) => {
                      const account = accountData.find(
                        (account) => account.id === id
                      );
                      return account ? account.Name : id; // Fallback to ID if name is not found
                    })
                    .join(", ")}{" "}
                  {/* Joining account names with commas */}
                </Typography>
                <IconButton onClick={handleFormClose} sx={{ color: "blue" }}>
                  <RxCross2 fontSize="large" />
                </IconButton>
              </Box>

              <Divider sx={{ my: 2 }} />

              <ManageTeams
                selectedAccounts={selected}
                onClose={handleFormClose}
                fetchAccountData={fetchData}
              />
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default FixedColumnTable;

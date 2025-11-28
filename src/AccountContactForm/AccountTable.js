

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Stack,
  Link,
  Button,
  Checkbox,
  TablePagination,
  TableSortLabel,
  ButtonGroup,
  Menu,
  MenuItem,
  Drawer,
  IconButton,
  Divider,
  Tooltip,Select,InputLabel,FormControl,TextField,Dialog,DialogActions,DialogTitle,DialogContent,List,ListItem,ListItemText,DialogContentText
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import useMediaQuery from "@mui/material/useMediaQuery";
import SendAccountEmail from "../../src/Pages/BulkActions/SendAccountEmail";
import AddJobs from "../../src/Pages/BulkActions/AddJobs";
import AddBulkOrganizer from "../../src/Pages/BulkActions/AddBulkOrganizer";
import ManageTags from "../../src/Pages/BulkActions/ManageTags";
import ManageTeams from "../../src/Pages/BulkActions/ManageTeams";
import { useTheme } from "@mui/material/styles";
import { RxCross2 } from "react-icons/rx";
import ListIcon from "@mui/icons-material/List";
import EmailIcon from "@mui/icons-material/Email";
import TagIcon from "@mui/icons-material/Tag";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import AccountContactDrawer from "./AccountContactDrawer";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import TagsMultiSelectDropDown from "./TagsMultiSelectDropDown.js"
import TeamMemberMultiSelectDropDown from "./TeamMemberMultiSelectDropDown.js"
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const AccountTable = () => {
  const [accountList, setAccountList] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  // const [order, setOrder] = useState("asc");
  // const [orderBy, setOrderBy] = useState("accountName");
  const [order, setOrder] = useState(null);
const [orderBy, setOrderBy] = useState(null);

  const [filterStatus, setFilterStatus] = useState("active"); // active | archived
  const [anchorE2, setAnchorE2] = useState(null);
   const [anchorEl, setAnchorEl] = useState(null);
     const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountsToDelete, setAccountsToDelete] = useState([]);
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
     const handleFilterButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
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
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [viewAllAccounts, setViewAllAccounts] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCreateOrganizerOpen, setIsCreateOrganizerOpen] = useState(false);
  const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);

  // Get user role from localStorage on component mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    if (storedData) {
      setUserRole(storedData.teammember?.userrole || "");
      setViewAllAccounts(storedData.teammember?.viewallAccounts || false);
    }
  }, []);

  const handleFormClose = () => {
    setIsDrawerOpen(false);
    setIsSendEmailOpen(false);
    setIsCreateOrganizerOpen(false);
    setIsCreateJobOpen(false);
    setIsManageTagsOpen(false);
    setIsManageTeamOpen(false);
  };
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
 useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    console.log("Fetched userRole from localStorage:", storedUserRole);
    setUserRole(storedUserRole);
  }, []);
  const fetchAccountsList = async () => {
    setLoading(true);
    try {
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      console.log("Received stored teamMemberData:", storedData);

      const loginuserid = storedData?.teammember?.userid;
      // const userRole = storedData?.teammember?.userrole || "Admin";
      console.log("User role is:", userRole);

      let url;

      if (userRole === "Admin") {
        url = `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`;
      } else if (userRole === "TeamMember") {
        const viewAll = storedData?.teammember?.viewallAccounts || false;
        setViewAllAccounts(viewAll);

        if (viewAll) {
          url = `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`;
        } else {
          url = `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=${filterStatus === "active"}`;
        }
      }

      console.log("Fetching from URL:", url);
      const response = await axios.get(url);
      setAccountList(response.data.accountlist || []);
    } catch (err) {
      console.error("Error loading accounts:", err);
      setAccountList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsList();
  }, [filterStatus,userRole]);

  const handleArchiveAccount = async () => {
    try {
      await axios.patch(`https://www.snptaxes.com/api/accounts/update-active`, {
        ids: selected,
        active: false,
      });

      console.log("Accounts archived:", selected);

      setSelected([]);
      fetchAccountsList();
      handleClose();
      toast.success("Account Archived successfully");
    } catch (error) {
      console.error("Failed to archive account", error);
    }
  };

  const handleActivateAccount = async () => {
    try {
      await axios.patch(`https://www.snptaxes.com/api/accounts/update-active`, {
        ids: selected,
        active: true,
      });

      console.log("Accounts activated:", selected);

      setSelected([]);
      fetchAccountsList();
      handleClose();
      toast.success("Account Activated successfully");
    } catch (error) {
      console.error("Failed to activate account", error);
    }
  };

  // New handler for drawer close that also refreshes the table
  const handleDrawerClose = () => {
    setOpenDrawer(false);
    fetchAccountsList(); // refresh data when drawer closes
  };
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const allSelectedIds = accountList.map((n) => n._id);
      setSelected(allSelectedIds);

      // Console log all selected accounts
      console.log(
        "Selected all accounts:",
        accountList.map(({ _id, accountName }) => ({
          value: _id,
          label: accountName,
        }))
      );
      return;
    }

    setSelected([]);
    console.log("Deselected all accounts");
  };
  // import Cookies from "js-cookie";

const handleClick = (account) => {
  const selectedIndex = selected.indexOf(account._id);
  let newSelected = [];

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, account._id);
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selected.slice(1));
  } else if (selectedIndex === selected.length - 1) {
    newSelected = newSelected.concat(selected.slice(0, -1));
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selected.slice(0, selectedIndex),
      selected.slice(selectedIndex + 1)
    );
  }

  setSelected(newSelected);

  // Get selected account details
  const selectedAccounts = newSelected
    .map((id) => {
      const acc = accountList.find((a) => a._id === id);
      return acc ? { id: acc._id, name: acc.accountName } : null;
    })
    .filter(Boolean);

  console.log("Selected accounts:", selectedAccounts);

  // ✅ Store in cookies
  if (selectedAccounts.length > 0) {
    Cookies.set("selectedAccounts", JSON.stringify(selectedAccounts), {
      path: "/",
    });

    // Also store the most recently selected one
    const latest = selectedAccounts[selectedAccounts.length - 1];
    Cookies.set("accountId", latest.id, { path: "/" });
    Cookies.set("accountName", latest.name, { path: "/" });

    console.log(
      "✅ Stored cookies:",
      selectedAccounts.length,
      "accounts (latest:)",
      latest
    );
  } else {
    // Remove cookies when nothing is selected
    Cookies.remove("selectedAccounts", { path: "/" });
    Cookies.remove("accountId", { path: "/" });
    Cookies.remove("accountName", { path: "/" });
    console.log("❌ Removed all account cookies");
  }
};

  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
    const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
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
    const applyFilters = () => {
  let filtered = [...accountList];

  // ✅ Filter by Account Name (case insensitive)
  if (filters.accountName.trim() !== "") {
    filtered = filtered.filter(acc =>
      acc.accountName.toLowerCase().includes(filters.accountName.toLowerCase())
    );
  }

  // ✅ Filter by Type
  if (filters.type !== "") {
    filtered = filtered.filter(acc => acc.clientType === filters.type);
  }

  // ✅ Filter by Team Members (multi-select)
//   if (filters.teamMember.length > 0) {
//   filtered = filtered.filter(acc =>
//     acc.teamMember?.some(tm => filters.teamMember.includes(tm._id))
//   );
// }
// ✅ Filter by Team Member
  if (filters.teamMember.length > 0) {
    const selectedIds = filters.teamMember.map(t => t.value);
    filtered = filtered.filter((acc) =>
      acc.teamMember?.some((tm) => selectedIds.includes(tm._id))
    );
  }

  // ✅ Filter by Tags (multi-select)
if (filters.tags.length > 0) {
  const selectedIds = filters.tags.map(t => t.value);
  filtered = filtered.filter(acc =>
    acc.tags?.some(tag => selectedIds.includes(tag._id))
  );
}




  return filtered;
};
const filteredList = applyFilters();
// const sortedList = filteredList.slice().sort(getComparator(order, orderBy));
const sortedList =
  orderBy && order
    ? filteredList.slice().sort(getComparator(order, orderBy))
    : filteredList; // keep API order

const paginatedList = sortedList.slice(
  page * rowsPerPage,
  page * rowsPerPage + rowsPerPage
);

 

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const handleMoreActionsClick = (event) => {
    setAnchorE2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
  };


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

  const renderLimitedChips = (items, getLabel, getColor) => {
    if (!items || items.length === 0) return "—";

    const first = items[0];
    const remainingCount = items.length - 1;

    return (
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        sx={{ cursor: "pointer" }}
      >
        {/* ✅ FIRST CHIP */}
        <Tooltip title={getLabel(first)} placement="top-end">
          <Chip
            label={getLabel(first)}
            size="small"
            sx={getColor ? getColor(first) : {}}
          />
        </Tooltip>

        {/* ✅ SHOW +N MORE if more than 1 */}
        {remainingCount > 0 && (
          <Tooltip
            title={items.map((i) => getLabel(i)).join(", ")}
            placement="top-end"
          >
            <Chip
              label={`+${remainingCount} more`}
              size="small"
              variant="outlined"
            />
          </Tooltip>
        )}
      </Stack>
    );
  };

  // Check if TeamMember has no permission to view accounts
  if (userRole === "TeamMember" && !viewAllAccounts && accountList.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
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
      </Box>
    );
  }

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`https://www.snptaxes.com/api/accounts/accounts/deleteMultipleAccounts`, {
        data: { accountIds: selected }
      });

      console.log("Accounts deleted:", selected);

      setSelected([]);
      fetchAccountsList();
      handleClose();
      setIsDeleteDialogOpen(false);
      toast.success("Account(s) deleted successfully");
    } catch (error) {
      console.error("Failed to delete account", error);
      toast.error("Failed to delete account(s)");
    }
  };

  const handleDeleteClick = () => {
    // Get account names for confirmation dialog
    const accountsToDeleteNames = selected.map(id => {
      const account = accountList.find(acc => acc._id === id);
      return account ? account.accountName : id;
    });
    
    setAccountsToDelete(accountsToDeleteNames);
    setIsDeleteDialogOpen(true);
    handleClose(); // Close the menu
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setAccountsToDelete([]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <ButtonGroup>
          <Button
            variant={filterStatus === "active" ? "contained" : "outlined"}
            onClick={() => setFilterStatus("active")}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === "archived" ? "contained" : "outlined"}
            onClick={() => setFilterStatus("archived")}
          >
            Archived
          </Button>
        </ButtonGroup>

        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDrawer(true)}
        >
          Add Account
        </Button> */}
      </Stack>
<Box
                sx={{
                  width: "50px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  color: "#3f51b5",
                  mb:5
                }}
                onClick={handleFilterButtonClick}
              >
                
                Filters
                
              </Box>
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
              {/* Team Member Filter */}
{showFilters.teamMember && (
  <div style={{ display: "flex", alignItems: "center" }}>
    <Box sx={{ mr: 3 }}>
      <TeamMemberMultiSelectDropDown
        value={filters.teamMember}               // array of IDs → ["689c4d64...", "6880af58..."]
        onChange={(newValue) => {
          setFilters(prev => ({
            ...prev,
            teamMember: newValue                // dropdown returns array of IDs
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


{/* Tag Filter */}
{showFilters.tags && (
  <div style={{ display: "flex", alignItems: "center", width: "250px" }}>
    <Box mr={3}>
      <TagsMultiSelectDropDown
        value={filters.tags}   // it will be array of tag IDs like ["65a2..", "65b3.."]
        onChange={(newValue) => {
          setFilters(prev => ({
            ...prev,
            tags: newValue     // already array of IDs
          }));
          setPage(0);
        }}
        // Send dropdown list as ID + label + colour
        options={uniqueTags.map(tag => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour
        }))}
        width="250px"
        placeholder="Select Tags..."
      />
    </Box>

    <DeleteIcon
      onClick={() => clearFilter("tags")}
      style={{ cursor: "pointer", color: "red" }}
    />
  </div>
)}


      {selected.length > 0 && (
        <Box data-test="clients-bulk-actions-panel" sx={{ mb: 2 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
            }}
          >
            <Button
              variant="text"
              startIcon={<ListIcon />}
              onClick={handleAssignOrganizer}
              // disabled={storedData?.teammember?.manageOrganizers === false}
            >
              Send Organizer
            </Button>
            <Button
              variant="text"
              startIcon={<ListIcon />}
              onClick={handleAddJob}
              // disabled={storedData?.teammember?.managePipelines === false}
            >
              Add Job
            </Button>
            <Button
              variant="text"
              startIcon={<PersonIcon />}
              onClick={handleManageTeam}
              // disabled={storedData?.teammember?.assignTeamMates === false}
            >
              Manage Team
            </Button>
            <Button
              variant="text"
              startIcon={<EmailIcon />}
              // disabled={selected.length === 0}
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

            <Menu
              anchorEl={anchorE2}
              open={Boolean(anchorE2)}
              onClose={handleClose}
            >
              {filterStatus === "active" ? (
                <MenuItem onClick={handleArchiveAccount}>
                  Archive Account
                </MenuItem>
              ) : (
                <MenuItem onClick={handleActivateAccount}>
                  Activate Account
                </MenuItem>
              )}
             {filterStatus === "archived" && (
    <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
      Delete Account
    </MenuItem>
  )}
              <MenuItem>Edit login notify emailSync</MenuItem>
            </Menu>
          </div>
        </Box>
      )}
      
      {loading ? (
        <Typography sx={{ textAlign: "center", p: 3 }}>
          Loading accounts...
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < accountList.length
                    }
                    checked={
                      accountList.length > 0 &&
                      selected.length === accountList.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell
                  sortDirection={orderBy === "accountName" ? order : false}
                  width={"500px"}
                >
                  <TableSortLabel
                    active={orderBy === "accountName"}
                    direction={orderBy === "accountName" ? order : "asc"}
                    onClick={() => handleRequestSort("accountName")}
                  >
                    Account Name
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === "clientType" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "clientType"}
                    direction={orderBy === "clientType" ? order : "asc"}
                    onClick={() => handleRequestSort("clientType")}
                  >
                    Client Type
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === "companyName" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "companyName"}
                    direction={orderBy === "companyName" ? order : "asc"}
                    onClick={() => handleRequestSort("companyName")}
                  >
                    Company Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Team Members</TableCell>
                <TableCell>Contact Emails</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedList.length > 0 ? (
                paginatedList.map((account) => (
                  <TableRow key={account._id} selected={isSelected(account._id)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isSelected(account._id)}
                        onChange={() => handleClick(account)}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        component="button"
                        underline="hover"
                        color="primary"

                        onClick={() =>
                          navigate(`/clients/accounts/accountsdash/overview/${account._id}`)
                        }
                      >
                        {account.accountName}
                      </Link>
                    </TableCell>
                    <TableCell>{account.clientType}</TableCell>
                    <TableCell>{account.companyName || "—"}</TableCell>

                    <TableCell>
                      {renderLimitedChips(
                        account.tags,
                        (t) => t.tagName,
                        (t) => ({
                          backgroundColor: t.tagColour,
                          color: "#fff",
                          fontWeight: 600,
                        })
                      )}
                    </TableCell>

                    <TableCell>
                      {renderLimitedChips(
                        account.teamMember,
                        (tm) => tm.username,
                        () => ({
                          border: "1px solid",
                          borderColor: "primary.main",
                          color: "primary.main",
                        })
                      )}
                    </TableCell>

                    <TableCell>
                      {renderLimitedChips(
                        account.contacts?.map((c) => c.contact),
                        (c) => c.email
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No accounts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={accountList.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
             rowsPerPageOptions={[5, 10, 25,30, 50, 100,]} 
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(0);
            }}
          />
        </TableContainer>
      )}
      
      {/* <AccountContactDrawer open={openDrawer} onCloseDrawer={handleDrawerClose} fetchAccountsList={fetchAccountsList}/> */}
<Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the following account(s)? This action cannot be undone.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Accounts to be deleted:
            </Typography>
            <List dense>
              {accountsToDelete.map((accountName, index) => (
                <ListItem key={index}>
                  <ListItemText primary={accountName} />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAccount} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
                      const account = accountList.find(
                        (account) => account._id === id
                      );
                      return account ? account.accountName : id; // Fallback to ID if name is not found
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
                fetchData={fetchAccountsList}
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
                      const account = accountList.find(
                        (account) => account._id === id
                      );
                      return account ? account.accountName : id; // Fallback to ID if name is not found
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
                fetchaccountList={fetchAccountsList}
              />
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default AccountTable;
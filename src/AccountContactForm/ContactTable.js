import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Paper,
  TextField,
  Chip,
  TableSortLabel,
  Stack,
  Button,
  Menu,
  MenuItem,
  IconButton,Divider,Typography,Drawer,Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaTimes } from "react-icons/fa";
import TagMultiSelectDropDown from "../AccountContactForm/TagsMultiSelectDropDown";
import axios from "axios";
import { toast } from "react-toastify";
import ContactForm from "../Pages/UpdateContact"; // adjust path

const ContactsTable = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
const [selectedContact, setSelectedContact] = useState(null);

const handleOpenDrawer = (contact) => {
  setSelectedContact(contact);
  setOpenDrawer(true);
};

const handleCloseDrawer = () => {
  setOpenDrawer(false);
  setSelectedContact(null);
};

 const handleSave = (contactData) => {
    if (selectedContact) {
      console.log("Update contact:", contactData);
      // call API to update
    } else {
      console.log("Create new contact:", contactData);
      // call API to create
    }
  };

  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);

  const [filters, setFilters] = useState({
    contactName: "",
    email: "",
    company: "",
    tags: [],
  });

  // ✅ Which filters are visible
  const [activeFilters, setActiveFilters] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenFilterMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseFilterMenu = () => setAnchorEl(null);

  const addFilter = (filter) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
    handleCloseFilterMenu();
  };

  const removeFilter = (filter) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
    setFilters({ ...filters, [filter]: filter === "tags" ? [] : "" });
  };

  // // ✅ Fetch
  // useEffect(() => {
  //   fetch("https://www.snptaxes.com/api/contacts/")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setContacts(data);
  //       setFilteredContacts(data);
  //     });
  // }, []);
// ✅ central fetch function
  const fetchContacts = async () => {
    try {
      const res = await fetch("https://www.snptaxes.com/api/contacts/");
      const data = await res.json();
      setContacts(data);
      setFilteredContacts(data);
    } catch (error) {
      console.error("Fetch contacts error:", error);
    }
  };

  // ✅ initial load
  useEffect(() => {
    fetchContacts();
  }, []);
  // ✅ Apply filtering + sorting
  useEffect(() => {
    let result = [...contacts];

    if (filters.contactName)
      result = result.filter((c) =>
        c.contactName?.toLowerCase().includes(filters.contactName.toLowerCase())
      );

    if (filters.email)
      result = result.filter((c) =>
        c.email?.toLowerCase().includes(filters.email.toLowerCase())
      );

    if (filters.company)
      result = result.filter((c) =>
        c.companyName?.toLowerCase().includes(filters.company.toLowerCase())
      );

    if (filters.tags.length > 0) {
      result = result.filter((c) =>
        c.tags?.some((t) => filters.tags.some((sel) => sel.value === t._id))
      );
    }

    setFilteredContacts(result);
  }, [filters, contacts]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  // ✅ Toggle individual row
  const handleSelectOne = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Toggle select all
  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((c) => c._id));
    }
  };

  // ✅ Bulk delete (just frontend, you can connect backend)
  // ✅ Bulk delete using backend API
  const handleDeleteSelected = async () => {
    if (selectedContacts.length === 0) return;

    try {
      await axios.delete(
        "https://www.snptaxes.com/api/contacts/delete-multiple",
        {
          data: { ids: selectedContacts },
        }
      );
      toast.success("Contact Deleted Successfully");
      // ✅ Remove from UI after backend success
      const remaining = contacts.filter(
        (c) => !selectedContacts.includes(c._id)
      );
      setContacts(remaining);
      setSelectedContacts([]);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  const handleContactUpdated =()=>{
fetchContacts();
  }

  return (
    <Box p={2}>
      <Paper sx={{ p: 2, mb: 2 }}>
        {/* ✅ Filter button */}
        <Button variant="contained" onClick={handleOpenFilterMenu}>
          Add Filter
        </Button>

        {/* ✅ Filter options menu */}
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseFilterMenu}>
          <MenuItem onClick={() => addFilter("contactName")}>
            Contact Name
          </MenuItem>
          <MenuItem onClick={() => addFilter("email")}>Email</MenuItem>
          <MenuItem onClick={() => addFilter("company")}>Company Name</MenuItem>
          <MenuItem onClick={() => addFilter("tags")}>Tags</MenuItem>
        </Menu>

        {/* ✅ Show only selected filters */}
        <Stack spacing={2} direction="row" sx={{ mt: 2, flexWrap: "wrap" }}>
          {activeFilters.includes("contactName") && (
            <Box display="flex" alignItems="center">
              <TextField
                label="Search Name"
                size="small"
                value={filters.contactName}
                onChange={(e) =>
                  setFilters({ ...filters, contactName: e.target.value })
                }
              />
              <IconButton onClick={() => removeFilter("contactName")}>
                <FaTimes />
              </IconButton>
            </Box>
          )}

          {activeFilters.includes("email") && (
            <Box display="flex" alignItems="center">
              <TextField
                label="Search Email"
                size="small"
                value={filters.email}
                onChange={(e) =>
                  setFilters({ ...filters, email: e.target.value })
                }
              />
              <IconButton onClick={() => removeFilter("email")}>
                <FaTimes />
              </IconButton>
            </Box>
          )}

          {activeFilters.includes("company") && (
            <Box display="flex" alignItems="center">
              <TextField
                label="Search Company"
                size="small"
                value={filters.company}
                onChange={(e) =>
                  setFilters({ ...filters, company: e.target.value })
                }
              />
              <IconButton onClick={() => removeFilter("company")}>
                <FaTimes />
              </IconButton>
            </Box>
          )}

          {activeFilters.includes("tags") && (
            <Box display="flex" alignItems="center">
              <TagMultiSelectDropDown
                value={filters.tags}
                onChange={(newTags) =>
                  setFilters({ ...filters, tags: newTags })
                }
                options={[
                  ...new Map(
                    contacts
                      .flatMap((c) => c.tags || [])
                      .map((tag) => [
                        tag._id,
                        {
                          value: tag._id,
                          label: tag.tagName,
                          colour: tag.tagColour,
                        },
                      ])
                  ).values(),
                ]}
                width="250px"
              />
              <IconButton onClick={() => removeFilter("tags")}>
                <FaTimes />
              </IconButton>
            </Box>
          )}
        </Stack>
      </Paper>
      <Button
        variant="contained"
        color="error"
        disabled={selectedContacts.length === 0}
        onClick={handleDeleteSelected}
        sx={{ mb: 2 }}
      >
        Delete Selected ({selectedContacts.length})
      </Button>

      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <input
                  type="checkbox"
                  checked={
                    selectedContacts.length > 0 &&
                    selectedContacts.length === filteredContacts.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Contact Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Phone Numbers</TableCell>
              <TableCell>Tags</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredContacts.map((c) => (
              <TableRow key={c._id}>
                <TableCell padding="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(c._id)}
                    onChange={() => handleSelectOne(c._id)}
                  />
                </TableCell>

                {/* <TableCell>{c.contactName || "—"}</TableCell>
                 */}
                 <TableCell>
  <Button
    variant="text"
    onClick={() => handleOpenDrawer(c)}
    style={{ textTransform: "none" }}
  >
    {c.contactName || "—"}
  </Button>
</TableCell>

                <TableCell>{c.email || "—"}</TableCell>
                <TableCell>{c.companyName || "—"}</TableCell>
                {/* <TableCell>{c.phoneNumbers}</TableCell> */}
<TableCell>
  {Array.isArray(c.phoneNumbers) && c.phoneNumbers.length > 0
    ? c.phoneNumbers.join(", ")
    : "—"}
</TableCell>
                {/* <TableCell>
                  {c.tags?.map((t) => (
                    <Chip
                      key={t._id}
                      label={t.tagName}
                      size="small"
                      style={{
                        backgroundColor: t.tagColour,
                        color: "#fff",
                        marginRight: "4px",
                      }}
                    />
                  )) || "—"}
                </TableCell> */}
                <TableCell>
  {c.tags && c.tags.length > 0 ? (
    <>
      {c.tags.slice(0, 2).map((t) => (
        <Chip
          key={t._id}
          label={t.tagName}
          size="small"
          style={{
            backgroundColor: t.tagColour,
            color: "#fff",
            marginRight: "4px",
            marginBottom: "4px",
          }}
        />
      ))}

      {c.tags.length > 2 && (
        <Tooltip
          title={
            <Box>
              {c.tags.slice(2).map((t) => (
                <Box key={t._id} sx={{ mb: 0.5 }} >
                  • {t.tagName}
                </Box>
              ))}
            </Box>
          }
          arrow
          placement="top"
        >
          <Chip
            label={`+${c.tags.length - 2} more`}
            size="small"
            style={{ backgroundColor: "#999", color: "white" }}
          />
        </Tooltip>
      )}
    </>
  ) : (
    "—"
  )}
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredContacts.length}
          rowsPerPage={5}
          page={0}
        />
      </TableContainer>
    
<Drawer
          anchor="right"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          sx={{ width: 600 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              ml: 1,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }} variant="h6">
              Edit Contact
            </Typography>
            <IconButton onClick={() => setOpenDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          {selectedContact && (
            <ContactForm
              selectedContact={selectedContact}
              
              handleClose={() => setOpenDrawer(false)}
             
              onContactUpdated={handleContactUpdated}
            />
          )}
        </Drawer>
    </Box>
  );
};

export default ContactsTable;

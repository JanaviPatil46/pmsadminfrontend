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
  IconButton,
  Divider,
  Typography,
  Drawer,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [canManageContacts, setCanManageContacts] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25); // default 25 per page
  
  const handleOpenDrawer = (contact) => {
    if (!canManageContacts) {
      toast.info("You do not have permission to edit contacts");
      return;
    }
    setSelectedContact(contact);
    setOpenDrawer(true);
  };

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    setUserRole(storedUserRole);

    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    const manage = storedData?.teammember?.manageContacts;

    // If teamMember → use manageContacts
    if (storedUserRole === "TeamMember") {
      setCanManageContacts(Boolean(manage));
    } else {
      // Admin always has permission
      setCanManageContacts(true);
    }
  }, []);

  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);

  const [filters, setFilters] = useState({
    contactName: "",
    email: "",
    company: "",
    tags: [],
    contactCode: "",
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
        c.contactName
          ?.toLowerCase()
          .includes(filters.contactName.toLowerCase()),
      );

    if (filters.email)
      result = result.filter((c) =>
        c.email?.toLowerCase().includes(filters.email.toLowerCase()),
      );

    if (filters.company)
      result = result.filter((c) =>
        c.companyName?.toLowerCase().includes(filters.company.toLowerCase()),
      );

    if (filters.tags.length > 0) {
      result = result.filter((c) =>
        c.tags?.some((t) => filters.tags.some((sel) => sel.value === t._id)),
      );
    }
    if (filters.contactCode)
      result = result.filter((c) =>
        c.contactCode
          ?.toLowerCase()
          .includes(filters.contactCode.toLowerCase()),
      );

    setFilteredContacts(result);
  }, [filters, contacts]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  // ✅ Toggle individual row
  const handleSelectOne = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
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
        },
      );
      toast.success("Contact Deleted Successfully");
      // ✅ Remove from UI after backend success
      const remaining = contacts.filter(
        (c) => !selectedContacts.includes(c._id),
      );
      setContacts(remaining);
      setSelectedContacts([]);
      setOpenDeleteDialog(false); // CLOSE DIALOG
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  const handleContactUpdated = () => {
    fetchContacts();
  };

  const totalPages = Math.ceil(filteredContacts.length / rowsPerPage);
  const paginatedContacts = filteredContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Filters bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          onClick={handleOpenFilterMenu}
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filters
        </button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseFilterMenu}>
          <MenuItem onClick={() => addFilter("contactName")}>Contact Name</MenuItem>
          <MenuItem onClick={() => addFilter("email")}>Email</MenuItem>
          <MenuItem onClick={() => addFilter("company")}>Company Name</MenuItem>
          <MenuItem onClick={() => addFilter("tags")}>Tags</MenuItem>
          <MenuItem onClick={() => addFilter("contactCode")}>Contact Code</MenuItem>
        </Menu>

        {activeFilters.includes("contactName") && (
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
            <TextField label="Search Name" size="small" value={filters.contactName} onChange={(e) => setFilters({ ...filters, contactName: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px' }, width: '160px' }} />
            <button onClick={() => removeFilter("contactName")} className="text-slate-400 hover:text-red-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        )}
        {activeFilters.includes("email") && (
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
            <TextField label="Search Email" size="small" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px' }, width: '160px' }} />
            <button onClick={() => removeFilter("email")} className="text-slate-400 hover:text-red-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        )}
        {activeFilters.includes("contactCode") && (
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
            <TextField label="Contact Code" size="small" value={filters.contactCode} onChange={(e) => setFilters({ ...filters, contactCode: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px' }, width: '160px' }} />
            <button onClick={() => removeFilter("contactCode")} className="text-slate-400 hover:text-red-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        )}
        {activeFilters.includes("company") && (
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
            <TextField label="Search Company" size="small" value={filters.company} onChange={(e) => setFilters({ ...filters, company: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px' }, width: '160px' }} />
            <button onClick={() => removeFilter("company")} className="text-slate-400 hover:text-red-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        )}
        {activeFilters.includes("tags") && (
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
            <TagMultiSelectDropDown
              value={filters.tags}
              onChange={(newTags) => setFilters({ ...filters, tags: newTags })}
              options={[
                ...new Map(
                  contacts.flatMap((c) => c.tags || []).map((tag) => [tag._id, { value: tag._id, label: tag.tagName, colour: tag.tagColour }])
                ).values(),
              ]}
              width="220px"
            />
            <button onClick={() => removeFilter("tags")} className="text-slate-400 hover:text-red-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        )}
      </div>

      {/* Bulk delete */}
      {selectedContacts.length > 0 && (
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!canManageContacts}
            onClick={() => {
              if (!canManageContacts) { toast.error("You do not have permission to delete contacts"); return; }
              setOpenDeleteDialog(true);
            }}
          >
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Delete Selected ({selectedContacts.length})
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    disabled={!canManageContacts}
                    checked={selectedContacts.length > 0 && selectedContacts.length === filteredContacts.length}
                    onChange={() => { if (!canManageContacts) return; handleSelectAll(); }}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer disabled:opacity-40"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[160px]">Contact Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Numbers</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedContacts.length > 0 ? (
                paginatedContacts.map((c) => (
                  <tr key={c._id} className={`transition-colors duration-100 hover:bg-slate-50/80 ${selectedContacts.includes(c._id) ? "bg-indigo-50/40" : ""}`}>
                    <td className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        disabled={!canManageContacts}
                        checked={selectedContacts.includes(c._id)}
                        onChange={() => { if (!canManageContacts) return; handleSelectOne(c._id); }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer disabled:opacity-40"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.contactCode || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleOpenDrawer(c)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors bg-transparent border-none cursor-pointer p-0"
                      >
                        {c.contactName || "—"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 truncate max-w-[200px]">{c.email || <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.companyName || <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {Array.isArray(c.phoneNumbers) && c.phoneNumbers.length > 0
                        ? <span className="truncate max-w-[140px] block">{c.phoneNumbers.join(", ")}</span>
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {c.tags && c.tags.length > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {c.tags.slice(0, 2).map((t) => (
                            <span
                              key={t._id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium truncate max-w-[120px]"
                              style={{ backgroundColor: t.tagColour, color: "#fff" }}
                            >
                              {t.tagName}
                            </span>
                          ))}
                          {c.tags.length > 2 && (
                            <Tooltip
                              title={
                                <div>{c.tags.slice(2).map((t) => (<div key={t._id} style={{ marginBottom: 2 }}>• {t.tagName}</div>))}</div>
                              }
                              arrow
                              placement="top"
                            >
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200 cursor-default">
                                +{c.tags.length - 2}
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                    No contacts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/40">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {[25, 30, 50, 80, 100, 200].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 mr-2">
              {filteredContacts.length === 0 ? "0 of 0" : `${page * rowsPerPage + 1}–${Math.min((page + 1) * rowsPerPage, filteredContacts.length)} of ${filteredContacts.length}`}
            </span>
            <button onClick={() => setPage(0)} disabled={page === 0} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7 7" /></svg>
            </button>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Contact Drawer */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 600 }, maxWidth: '100%' } }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Edit Contact</h2>
          <button onClick={() => setOpenDrawer(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <CloseIcon fontSize="small" />
          </button>
        </div>
        {selectedContact && (
          <ContactForm
            selectedContact={selectedContact}
            handleClose={() => setOpenDrawer(false)}
            onContactUpdated={handleContactUpdated}
          />
        )}
      </Drawer>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Contacts?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete
            <strong> {selectedContacts.length} </strong>
            selected {selectedContacts.length === 1 ? "contact" : "contacts"}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteSelected} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContactsTable;

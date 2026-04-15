import React, { useEffect, useState, useRef } from "react";
import { X, Filter, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import TagMultiSelectDropDown from "../AccountContactForm/TagsMultiSelectDropDown";
import axios from "axios";
import { toast } from "react-toastify";
import ContactForm from "../Pages/UpdateContact";

const ContactsTable = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [canManageContacts, setCanManageContacts] = useState(true);
  const filterMenuRef = useRef(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  
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

  const filterOptions = [
    { key: "contactName", label: "Contact Name" },
    { key: "email", label: "Email" },
    { key: "company", label: "Company Name" },
    { key: "tags", label: "Tags" },
    { key: "contactCode", label: "Contact Code" },
  ];

  const inputCls = "w-40 border border-border rounded-md px-2.5 py-1 text-sm bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0";

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Filters bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative" ref={filterMenuRef}>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-foreground bg-white border border-border rounded-lg hover:bg-secondary transition-colors"
            onClick={handleOpenFilterMenu}
          >
            <Filter size={14} />
            Filters
          </button>
          {open && (
            <div className="absolute left-0 top-full mt-1 z-50 w-44 bg-white border border-border rounded-lg shadow-card-hover py-1">
              {filterOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => addFilter(key)}
                  className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeFilters.includes("contactName") && (
          <div className="inline-flex items-center gap-1.5 bg-white border border-border rounded-lg px-2 py-1">
            <input placeholder="Search Name" value={filters.contactName} onChange={(e) => setFilters({ ...filters, contactName: e.target.value })} className={inputCls} />
            <button onClick={() => removeFilter("contactName")} className="text-muted-foreground hover:text-destructive transition-colors"><X size={14} /></button>
          </div>
        )}
        {activeFilters.includes("email") && (
          <div className="inline-flex items-center gap-1.5 bg-white border border-border rounded-lg px-2 py-1">
            <input placeholder="Search Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} className={inputCls} />
            <button onClick={() => removeFilter("email")} className="text-muted-foreground hover:text-destructive transition-colors"><X size={14} /></button>
          </div>
        )}
        {activeFilters.includes("contactCode") && (
          <div className="inline-flex items-center gap-1.5 bg-white border border-border rounded-lg px-2 py-1">
            <input placeholder="Contact Code" value={filters.contactCode} onChange={(e) => setFilters({ ...filters, contactCode: e.target.value })} className={inputCls} />
            <button onClick={() => removeFilter("contactCode")} className="text-muted-foreground hover:text-destructive transition-colors"><X size={14} /></button>
          </div>
        )}
        {activeFilters.includes("company") && (
          <div className="inline-flex items-center gap-1.5 bg-white border border-border rounded-lg px-2 py-1">
            <input placeholder="Search Company" value={filters.company} onChange={(e) => setFilters({ ...filters, company: e.target.value })} className={inputCls} />
            <button onClick={() => removeFilter("company")} className="text-muted-foreground hover:text-destructive transition-colors"><X size={14} /></button>
          </div>
        )}
        {activeFilters.includes("tags") && (
          <div className="inline-flex items-center gap-1.5 bg-white border border-border rounded-lg px-2 py-1">
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
            <button onClick={() => removeFilter("tags")} className="text-muted-foreground hover:text-destructive transition-colors"><X size={14} /></button>
          </div>
        )}
      </div>

      {/* Bulk delete */}
      {selectedContacts.length > 0 && (
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg hover:bg-destructive/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!canManageContacts}
            onClick={() => {
              if (!canManageContacts) { toast.error("You do not have permission to delete contacts"); return; }
              setOpenDeleteDialog(true);
            }}
          >
            <Trash2 size={13} />
            Delete Selected ({selectedContacts.length})
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    disabled={!canManageContacts}
                    checked={selectedContacts.length > 0 && selectedContacts.length === filteredContacts.length}
                    onChange={() => { if (!canManageContacts) return; handleSelectAll(); }}
                    className="rounded border-border accent-primary h-4 w-4 cursor-pointer disabled:opacity-40"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[160px]">Contact Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Numbers</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedContacts.length > 0 ? (
                paginatedContacts.map((c) => (
                  <tr key={c._id} className={`transition-colors duration-100 hover:bg-secondary/30 ${selectedContacts.includes(c._id) ? "bg-primary/5" : ""}`}>
                    <td className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        disabled={!canManageContacts}
                        checked={selectedContacts.includes(c._id)}
                        onChange={() => { if (!canManageContacts) return; handleSelectOne(c._id); }}
                        className="rounded border-border accent-primary h-4 w-4 cursor-pointer disabled:opacity-40"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-success/10 text-success border border-success/20">
                        {c.contactCode || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleOpenDrawer(c)}
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-transparent border-none cursor-pointer p-0"
                      >
                        {c.contactName || "—"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/70 truncate max-w-[200px]">{c.email || <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-4 py-3 text-sm text-foreground/70">{c.companyName || <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-4 py-3 text-sm text-foreground/70">
                      {Array.isArray(c.phoneNumbers) && c.phoneNumbers.length > 0
                        ? <span className="truncate max-w-[140px] block">{c.phoneNumbers.join(", ")}</span>
                        : <span className="text-muted-foreground">—</span>}
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
                            <span
                              title={c.tags.slice(2).map(t => t.tagName).join(", ")}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border cursor-default"
                            >
                              +{c.tags.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No contacts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              className="text-xs border border-border rounded-md px-2 py-1 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {[25, 30, 50, 80, 100, 200].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-2">
              {filteredContacts.length === 0 ? "0 of 0" : `${page * rowsPerPage + 1}–${Math.min((page + 1) * rowsPerPage, filteredContacts.length)} of ${filteredContacts.length}`}
            </span>
            <button onClick={() => setPage(0)} disabled={page === 0} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronsLeft size={16} />
            </button>
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
            <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Contact Drawer */}
      {openDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpenDrawer(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-white shadow-drawer flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="text-lg font-semibold text-foreground">Edit Contact</h2>
              <button onClick={() => setOpenDrawer(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {selectedContact && (
                <ContactForm
                  selectedContact={selectedContact}
                  handleClose={() => setOpenDrawer(false)}
                  onContactUpdated={handleContactUpdated}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {openDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenDeleteDialog(false)} />
          <div className="relative bg-white rounded-xl shadow-card-hover w-full max-w-sm mx-4 p-6 space-y-4">
            <h3 className="text-base font-semibold text-foreground">Delete Contacts?</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{selectedContacts.length}</strong> selected {selectedContacts.length === 1 ? "contact" : "contacts"}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setOpenDeleteDialog(false)} className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-secondary transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteSelected} className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-lg transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsTable;

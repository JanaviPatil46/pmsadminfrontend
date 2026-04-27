/* ─── ContactTable — @tanstack/react-table + shadcn DataTable ─── */
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2, X } from "lucide-react";
import { DataTable } from "../components/data-table/data-table";
import { DataTableToolbar } from "../components/data-table/toolbar";
import TagMultiSelectDropDown from "../AccountContactForm/TagsMultiSelectDropDown";
import ContactForm from "../Pages/UpdateContact";
import { cn } from "../lib/utils";

function TagPills({ tags }) {
  if (!tags?.length) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {tags.slice(0, 2).map((t) => (
        <span
          key={t._id}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium truncate max-w-[110px]"
          style={{ backgroundColor: t.tagColour, color: "#fff" }}
        >
          {t.tagName}
        </span>
      ))}
      {tags.length > 2 && (
        <span
          title={tags.slice(2).map((t) => t.tagName).join(", ")}
          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border cursor-default"
        >
          +{tags.length - 2}
        </span>
      )}
    </div>
  );
}

const ContactsTable = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [canManageContacts, setCanManageContacts] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [filters, setFilters] = useState({ contactName: "", email: "", company: "", tags: [], contactCode: "" });
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const sd = JSON.parse(localStorage.getItem("teamMemberData"));
    const manage = sd?.teammember?.manageContacts;
    setCanManageContacts(role === "TeamMember" ? Boolean(manage) : true);
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://www.snptaxes.com/api/contacts/");
      const data = await res.json();
      setContacts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const uniqueTagOptions = useMemo(() =>
    Array.from(
      new Map(contacts.flatMap((c) => c.tags || []).map((t) => [t._id, { value: t._id, label: t.tagName, colour: t.tagColour }])).values()
    ),
    [contacts]
  );

  const filteredData = useMemo(() => {
    let d = [...contacts];
    if (filters.contactName) d = d.filter((c) => c.contactName?.toLowerCase().includes(filters.contactName.toLowerCase()));
    if (filters.email) d = d.filter((c) => c.email?.toLowerCase().includes(filters.email.toLowerCase()));
    if (filters.company) d = d.filter((c) => c.companyName?.toLowerCase().includes(filters.company.toLowerCase()));
    if (filters.contactCode) d = d.filter((c) => c.contactCode?.toLowerCase().includes(filters.contactCode.toLowerCase()));
    if (filters.tags.length) d = d.filter((c) => c.tags?.some((t) => filters.tags.some((s) => s.value === t._id)));
    return d;
  }, [contacts, filters]);

  const handleOpenDrawer = (contact) => {
    if (!canManageContacts) { toast.info("You do not have permission to edit contacts"); return; }
    setSelectedContact(contact);
    setOpenDrawer(true);
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;
    try {
      await axios.delete("https://www.snptaxes.com/api/contacts/delete-multiple", { data: { ids: selectedIds } });
      toast.success("Contact(s) deleted successfully");
      setContacts((prev) => prev.filter((c) => !selectedIds.includes(c._id)));
      setSelectedIds([]);
      setOpenDeleteDialog(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete contacts");
    }
  };

  const addFilter = (key) => {
    if (!activeFilters.includes(key)) setActiveFilters((p) => [...p, key]);
  };
  const removeFilter = (key) => {
    setActiveFilters((p) => p.filter((f) => f !== key));
    setFilters((p) => ({ ...p, [key]: key === "tags" ? [] : "" }));
  };

  const columns = useMemo(() => [
    {
      accessorKey: "contactCode",
      header: "Code",
      size: 80,
      cell: ({ getValue }) => {
        const v = getValue();
        return v
          ? <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">{v}</span>
          : <span className="text-muted-foreground text-xs">—</span>;
      },
    },
    {
      accessorKey: "contactName",
      header: "Contact Name",
      size: 200,
      cell: ({ row, getValue }) => (
        <button
          onClick={() => handleOpenDrawer(row.original)}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-transparent border-none p-0 cursor-pointer text-left truncate max-w-[180px] block"
        >
          {getValue() || "—"}
        </button>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 200,
      cell: ({ getValue }) => (
        <span className="text-sm text-foreground/80 truncate block max-w-[190px]">
          {getValue() || <span className="text-muted-foreground">—</span>}
        </span>
      ),
    },
    {
      accessorKey: "companyName",
      header: "Company",
      size: 160,
      cell: ({ getValue }) => (
        <span className="text-sm text-foreground/80">
          {getValue() || <span className="text-muted-foreground">—</span>}
        </span>
      ),
    },
    {
      accessorKey: "phoneNumbers",
      header: "Phone",
      size: 140,
      enableSorting: false,
      cell: ({ getValue }) => {
        const nums = getValue();
        if (!nums?.length) return <span className="text-muted-foreground text-xs">—</span>;
        return <span className="text-sm text-foreground/80 truncate block max-w-[130px]">{nums[0]}{nums.length > 1 && ` +${nums.length - 1}`}</span>;
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      size: 180,
      enableSorting: false,
      cell: ({ getValue }) => <TagPills tags={getValue()} />,
    },
  ], [canManageContacts]);

  const filterContent = (
    <div className="flex flex-col gap-1">
      {[
        { key: "contactName", label: "Contact Name" },
        { key: "email", label: "Email" },
        { key: "company", label: "Company" },
        { key: "contactCode", label: "Contact Code" },
        { key: "tags", label: "Tags" },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => addFilter(key)}
          disabled={activeFilters.includes(key)}
          className="text-left px-2 py-1.5 text-sm rounded-md hover:bg-muted text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {label}
        </button>
      ))}
    </div>
  );

  const bulkActions = canManageContacts ? (
    <button
      onClick={() => setOpenDeleteDialog(true)}
      className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-md border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete ({selectedIds.length})
    </button>
  ) : null;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        filterContent={filterContent}
        selectedCount={selectedIds.length}
        bulkActions={bulkActions}
      >
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {activeFilters.includes("contactName") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input value={filters.contactName} onChange={(e) => setFilters((p) => ({ ...p, contactName: e.target.value }))} placeholder="Name…" className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-32" />
                <button onClick={() => removeFilter("contactName")} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
            {activeFilters.includes("email") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input value={filters.email} onChange={(e) => setFilters((p) => ({ ...p, email: e.target.value }))} placeholder="Email…" className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-36" />
                <button onClick={() => removeFilter("email")} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
            {activeFilters.includes("company") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input value={filters.company} onChange={(e) => setFilters((p) => ({ ...p, company: e.target.value }))} placeholder="Company…" className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-32" />
                <button onClick={() => removeFilter("company")} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
            {activeFilters.includes("contactCode") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input value={filters.contactCode} onChange={(e) => setFilters((p) => ({ ...p, contactCode: e.target.value }))} placeholder="Code…" className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-28" />
                <button onClick={() => removeFilter("contactCode")} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
            {activeFilters.includes("tags") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-1 pr-1.5 bg-background">
                <TagMultiSelectDropDown
                  value={filters.tags}
                  onChange={(v) => setFilters((p) => ({ ...p, tags: v }))}
                  options={uniqueTagOptions}
                  width="200px"
                />
                <button onClick={() => removeFilter("tags")} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
          </div>
        )}
      </DataTableToolbar>

      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={canManageContacts}
        onRowSelectionChange={(rowSel) => setSelectedIds(Object.keys(rowSel).filter((k) => rowSel[k]))}
        getRowId={(row) => row._id}
        emptyMessage="No contacts found"
        emptyDescription="Add contacts to get started"
        pageSize={25}
      />

      {/* Edit Contact Drawer */}
      {openDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setOpenDrawer(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-background shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">Edit Contact</h2>
              <button onClick={() => setOpenDrawer(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {selectedContact && (
                <ContactForm
                  selectedContact={selectedContact}
                  handleClose={() => { setOpenDrawer(false); fetchContacts(); }}
                  onContactUpdated={fetchContacts}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {openDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpenDeleteDialog(false)} />
          <div className="relative bg-background rounded-xl shadow-lg w-full max-w-sm mx-4 p-6 space-y-4">
            <h3 className="text-base font-semibold text-foreground">Delete Contacts?</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{selectedIds.length}</strong> selected {selectedIds.length === 1 ? "contact" : "contacts"}? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setOpenDeleteDialog(false)} className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleDeleteSelected} className="h-9 px-4 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsTable;

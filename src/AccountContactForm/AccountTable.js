/* ─── AccountTable — @tanstack/react-table + shadcn DataTable ─── */
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import {
  Mail, Briefcase, Users, Tag, Archive,
  RotateCcw, Trash2, X,
  UserSearch, AtSign, Building2, UserCog, TagsIcon,
} from "lucide-react";
import { DataTable } from "../components/data-table/data-table";
import { DataTableToolbar } from "../components/data-table/toolbar";
import TagsMultiSelectDropDown from "./TagsMultiSelectDropDown.js";
import TeamMemberMultiSelectDropDown from "./TeamMemberMultiSelectDropDown.js";
import AccountContactDrawer from "./AccountContactDrawer";
import SendAccountEmail from "../Pages/BulkActions/SendAccountEmail";
import AddJobs from "../Pages/BulkActions/AddJobs";
import AddBulkOrganizer from "../Pages/BulkActions/AddBulkOrganizer";
import ManageTags from "../Pages/BulkActions/ManageTags";
import ManageTeams from "../Pages/BulkActions/ManageTeams";
import { cn } from "../lib/utils";

const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

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

function MemberPills({ members }) {
  if (!members?.length) return <span className="text-muted-foreground text-xs">—</span>;
  const first = members[0];
  return (
    <div className="flex items-center gap-1">
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 truncate max-w-[110px]">
        {first.username}
      </span>
      {members.length > 1 && (
        <span
          title={members.slice(1).map((m) => m.username).join(", ")}
          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border"
        >
          +{members.length - 1}
        </span>
      )}
    </div>
  );
}

function BulkActionBtn({ label, icon: Icon, onClick, disabled, variant = "default" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-md border transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "destructive"
          ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

const AccountTable = () => {
  const navigate = useNavigate();
  const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  const perms = storedData?.teammember;

  const [accountList, setAccountList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [viewAllAccounts, setViewAllAccounts] = useState(false);
  const [filterStatus, setFilterStatus] = useState("active");
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCreateOrganizerOpen, setIsCreateOrganizerOpen] = useState(false);
  const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const [filters, setFilters] = useState({ accountName: "", type: "", teamMember: [], tags: [], email: "" });
  const [activeFilters, setActiveFilters] = useState([]);
  const [tags, setTags] = useState([]);

  const [settings, setSettings] = useState({ login: "Do nothing", notify: "Do nothing", emailSync: "Do nothing" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    const sd = JSON.parse(localStorage.getItem("teamMemberData"));
    if (sd) setViewAllAccounts(sd.teammember?.viewallAccounts || false);
  }, []);

  const fetchAccountsList = async () => {
    setLoading(true);
    try {
      const sd = JSON.parse(localStorage.getItem("teamMemberData"));
      const loginuserid = sd?.teammember?.userid;
      let url;
      if (userRole === "Admin") {
        url = `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`;
      } else if (userRole === "TeamMember") {
        const viewAll = sd?.teammember?.viewallAccounts || false;
        setViewAllAccounts(viewAll);
        url = viewAll
          ? `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`
          : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=${filterStatus === "active"}`;
      }
      if (!url) return;
      const res = await axios.get(url);
      setAccountList(res.data.accountlist || []);
    } catch (err) {
      console.error(err);
      setAccountList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccountsList(); }, [filterStatus, userRole]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${TAGS_API}/tags/`);
        const d = await res.json();
        setTags(d.tags || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const uniqueTags = useMemo(() =>
    Array.from(new Map(tags.map((t) => [`${t.tagName}_${t.tagColour}`, t])).values()),
    [tags]
  );

  const filteredData = useMemo(() => {
    let d = [...accountList];
    if (filters.accountName) d = d.filter((a) => a.accountName?.toLowerCase().includes(filters.accountName.toLowerCase()));
    if (filters.email) d = d.filter((a) => a.contacts?.some((c) => c.contact?.email?.toLowerCase().includes(filters.email.toLowerCase())));
    if (filters.type) d = d.filter((a) => a.clientType === filters.type);
    if (filters.teamMember.length) {
      const ids = filters.teamMember.map((t) => t.value);
      d = d.filter((a) => a.teamMember?.some((tm) => ids.includes(tm._id)));
    }
    if (filters.tags.length) {
      const ids = filters.tags.map((t) => t.value);
      d = d.filter((a) => a.tags?.some((t) => ids.includes(t._id)));
    }
    return d;
  }, [accountList, filters]);

  const syncCookies = (ids) => {
    const accs = ids.map((id) => {
      const a = accountList.find((x) => x._id === id);
      return a ? { id: a._id, name: a.accountName } : null;
    }).filter(Boolean);
    if (accs.length) {
      Cookies.set("selectedAccounts", JSON.stringify(accs), { path: "/" });
      Cookies.set("accountId", accs[accs.length - 1].id, { path: "/" });
      Cookies.set("accountName", accs[accs.length - 1].name, { path: "/" });
    } else {
      Cookies.remove("selectedAccounts", { path: "/" });
      Cookies.remove("accountId", { path: "/" });
      Cookies.remove("accountName", { path: "/" });
    }
  };

  const handleRowSelectionChange = (rowSel) => {
    const ids = Object.keys(rowSel).filter((k) => rowSel[k]);
    setSelectedIds(ids);
    syncCookies(ids);
  };

  const handleArchive = async () => {
    try {
      await axios.patch("https://www.snptaxes.com/api/accounts/update-active", { ids: selectedIds, active: false });
      toast.success("Accounts archived");
      setSelectedIds([]);
      fetchAccountsList();
    } catch { toast.error("Failed to archive"); }
  };

  const handleActivate = async () => {
    try {
      await axios.patch("https://www.snptaxes.com/api/accounts/update-active", { ids: selectedIds, active: true });
      toast.success("Accounts activated");
      setSelectedIds([]);
      fetchAccountsList();
    } catch { toast.error("Failed to activate"); }
  };

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;
    try {
      await axios.delete("https://www.snptaxes.com/api/accounts/accounts/deleteMultipleAccounts", { data: { accountIds: selectedIds } });
      toast.success("Accounts deleted");
      setSelectedIds([]);
      setIsDeleteDialogOpen(false);
      setConfirmText("");
      fetchAccountsList();
    } catch { toast.error("Failed to delete"); }
  };

  const openBulkDrawer = (setter) => { setter(true); setIsDrawerOpen(true); };
  const handleFormClose = () => {
    setIsDrawerOpen(false);
    setIsSendEmailOpen(false);
    setIsCreateJobOpen(false);
    setIsCreateOrganizerOpen(false);
    setIsManageTagsOpen(false);
    setIsManageTeamOpen(false);
  };

  const columns = useMemo(() => [
    {
      accessorKey: "accountCode",
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
      accessorKey: "accountName",
      header: "Account Name",
      size: 220,
      cell: ({ row, getValue }) => (
        <Link
          to={`/clients/accounts/accountsdash/overview/${row.original._id}`}
          className="text-sm font-medium text-primary hover:text-primary/80 no-underline transition-colors truncate block max-w-[200px]"
        >
          {getValue() || "—"}
        </Link>
      ),
    },
    {
      accessorKey: "clientType",
      header: "Type",
      size: 110,
      cell: ({ getValue }) => {
        const v = getValue();
        if (!v) return <span className="text-muted-foreground text-xs">—</span>;
        const color = v === "Individual" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
          : v === "Company" ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300"
          : "bg-muted text-muted-foreground border-border";
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${color}`}>{v}</span>;
      },
    },
    {
      accessorKey: "companyName",
      header: "Company",
      size: 160,
      cell: ({ getValue }) => (
        <span className="text-sm text-foreground/80 truncate block max-w-[150px]">
          {getValue() || <span className="text-muted-foreground">—</span>}
        </span>
      ),
    },
    {
      accessorKey: "tags",
      header: "Tags",
      size: 180,
      enableSorting: false,
      cell: ({ getValue }) => <TagPills tags={getValue()} />,
    },
    {
      accessorKey: "teamMember",
      header: "Team",
      size: 160,
      enableSorting: false,
      cell: ({ getValue }) => <MemberPills members={getValue()} />,
    },
    {
      id: "contactEmails",
      header: "Contact Emails",
      size: 200,
      enableSorting: false,
      cell: ({ row }) => {
        const emails = row.original.contacts
          ?.map((c) => c.contact?.email)
          .filter(Boolean) || [];
        if (!emails.length) return <span className="text-muted-foreground text-xs">—</span>;
        return (
          <div className="flex items-center gap-1">
            <span className="text-xs text-foreground/80 truncate max-w-[160px]">{emails[0]}</span>
            {emails.length > 1 && (
              <span className="text-[11px] text-muted-foreground" title={emails.slice(1).join(", ")}>+{emails.length - 1}</span>
            )}
          </div>
        );
      },
    },
  ], []);

  const toggleFilter = (key) => {
    if (activeFilters.includes(key)) {
      setActiveFilters((p) => p.filter((f) => f !== key));
      setFilters((p) => ({ ...p, [key]: key === "teamMember" || key === "tags" ? [] : "" }));
    } else {
      setActiveFilters((p) => [...p, key]);
    }
  };
  const removeFilter = (key) => {
    setActiveFilters((p) => p.filter((f) => f !== key));
    setFilters((p) => ({ ...p, [key]: key === "teamMember" || key === "tags" ? [] : "" }));
  };

  const FILTER_DEFS = [
    { key: "accountName", label: "Name",        Icon: UserSearch  },
    { key: "email",       label: "Email",       Icon: AtSign      },
    { key: "type",        label: "Type",        Icon: Building2   },
    { key: "teamMember",  label: "Team Member", Icon: UserCog     },
    { key: "tags",        label: "Tags",        Icon: TagsIcon    },
  ];

  const filterButtons = FILTER_DEFS.map(({ key, label, Icon }) => {
    const active = activeFilters.includes(key);
    return (
      <button
        key={key}
        onClick={() => toggleFilter(key)}
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors",
          active
            ? "bg-primary/10 text-primary border-primary/30"
            : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </button>
    );
  });

  const bulkActions = (
    <>
      <BulkActionBtn label="Send Email" icon={Mail} onClick={() => openBulkDrawer(setIsSendEmailOpen)} />
      <BulkActionBtn label="Add Job" icon={Briefcase} onClick={() => openBulkDrawer(setIsCreateJobOpen)} disabled={perms?.managePipelines === false} />
      <BulkActionBtn label="Organizer" icon={Briefcase} onClick={() => openBulkDrawer(setIsCreateOrganizerOpen)} disabled={perms?.manageOrganizers === false} />
      <BulkActionBtn label="Team" icon={Users} onClick={() => openBulkDrawer(setIsManageTeamOpen)} disabled={perms?.assignTeamMates === false} />
      <BulkActionBtn label="Tags" icon={Tag} onClick={() => openBulkDrawer(setIsManageTagsOpen)} disabled={perms?.manageTags === false} />
      <div className="h-4 w-px bg-border/60 mx-1" />
      {filterStatus === "active"
        ? <BulkActionBtn label="Archive" icon={Archive} onClick={handleArchive} disabled={perms?.manageAccounts === false} />
        : <BulkActionBtn label="Activate" icon={RotateCcw} onClick={handleActivate} disabled={perms?.manageAccounts === false} />
      }
      {filterStatus === "archived" && (
        <BulkActionBtn label="Delete" icon={Trash2} variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} disabled={perms?.manageAccounts === false} />
      )}
    </>
  );

  if (userRole === "TeamMember" && !viewAllAccounts && accountList.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <p className="text-destructive font-medium text-sm">You do not have permission to view accounts.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Status toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 gap-0.5">
          {["active", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "px-3.5 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                filterStatus === s
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => setOpenDrawer(true)}
          className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          Add Account
        </button>
      </div>

      {/* Toolbar */}
      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        filterButtons={filterButtons}
        selectedCount={selectedIds.length}
        bulkActions={bulkActions}
      >
        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {activeFilters.includes("accountName") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input
                  value={filters.accountName}
                  onChange={(e) => setFilters((p) => ({ ...p, accountName: e.target.value }))}
                  placeholder="Account name…"
                  className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-36"
                />
                <button onClick={() => removeFilter("accountName")} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
            {activeFilters.includes("email") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <input
                  value={filters.email}
                  onChange={(e) => setFilters((p) => ({ ...p, email: e.target.value }))}
                  placeholder="Email…"
                  className="text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-36"
                />
                <button onClick={() => removeFilter("email")} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
            {activeFilters.includes("type") && (
              <div className="inline-flex items-center gap-1.5 h-8 border border-border rounded-lg pl-2.5 pr-1.5 bg-background">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
                  className="text-sm bg-transparent outline-none text-foreground"
                >
                  <option value="">All types</option>
                  <option value="Individual">Individual</option>
                  <option value="Company">Company</option>
                  <option value="Other">Other</option>
                </select>
                <button onClick={() => removeFilter("type")} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
            {activeFilters.includes("teamMember") && (
              <div className="flex items-center gap-1.5 min-h-8 border border-border rounded-lg pl-1 pr-1.5 bg-background">
                <TeamMemberMultiSelectDropDown
                  value={filters.teamMember}
                  onChange={(v) => setFilters((p) => ({ ...p, teamMember: v }))}
                  width="200px"
                  LOGIN_API={LOGIN_API}
                />
                <button onClick={() => removeFilter("teamMember")} className="text-muted-foreground hover:text-foreground shrink-0"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
            {activeFilters.includes("tags") && (
              <div className="flex items-center gap-1.5 min-h-8 border border-border rounded-lg pl-1 pr-1.5 bg-background">
                <TagsMultiSelectDropDown
                  value={filters.tags}
                  onChange={(v) => setFilters((p) => ({ ...p, tags: v }))}
                  options={uniqueTags.map((t) => ({ value: t._id, label: t.tagName, colour: t.tagColour }))}
                  width="200px"
                  placeholder="Tags…"
                />
                <button onClick={() => removeFilter("tags")} className="text-muted-foreground hover:text-foreground shrink-0"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}
          </div>
        )}
      </DataTableToolbar>

      {/* Data table */}
      <DataTable
        columns={columns}
        data={filteredData}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onRowSelectionChange={handleRowSelectionChange}
        getRowId={(row) => row._id}
        emptyMessage="No accounts found"
        emptyDescription={filterStatus === "archived" ? "No archived accounts" : "Create your first account to get started"}
        pageSize={25}
      />

      {/* Create/Edit Account Drawer */}
      <AccountContactDrawer
        open={openDrawer}
        onClose={() => { setOpenDrawer(false); fetchAccountsList(); }}
        fetchAccountsList={fetchAccountsList}
      />

      {/* Bulk action drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleFormClose} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">
                {isSendEmailOpen && "Send Email"}
                {isCreateJobOpen && "Add Job"}
                {isCreateOrganizerOpen && "Send Organizer"}
                {isManageTagsOpen && "Manage Tags"}
                {isManageTeamOpen && "Manage Team"}
              </h2>
              <button onClick={handleFormClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {isSendEmailOpen && <SendAccountEmail selectedAccounts={selectedIds} onClose={handleFormClose} />}
              {isCreateJobOpen && <AddJobs selectedAccounts={selectedIds} onClose={handleFormClose} />}
              {isCreateOrganizerOpen && <AddBulkOrganizer selectedAccounts={selectedIds} onClose={handleFormClose} />}
              {isManageTagsOpen && <ManageTags selectedAccounts={selectedIds} onClose={handleFormClose} fetchData={fetchAccountsList} />}
              {isManageTeamOpen && <ManageTeams selectedAccounts={selectedIds} onClose={handleFormClose} fetchaccountList={fetchAccountsList} />}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setIsDeleteDialogOpen(false)} />
          <div className="relative bg-background rounded-xl shadow-lg w-full max-w-sm mx-4 p-6 space-y-4">
            <h3 className="text-base font-semibold text-foreground">Delete Accounts?</h3>
            <p className="text-sm text-muted-foreground">
              This will permanently delete <strong>{selectedIds.length}</strong> account{selectedIds.length > 1 ? "s" : ""}. Type <strong>DELETE</strong> to confirm.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full h-9 px-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => { setIsDeleteDialogOpen(false); setConfirmText(""); }} className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={confirmText !== "DELETE"} className="h-9 px-4 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountTable;

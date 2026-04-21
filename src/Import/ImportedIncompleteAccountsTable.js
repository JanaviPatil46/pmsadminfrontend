import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, Users, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const COLUMNS = ["Account Name", "Client Type", "Tags", "Contact Emails"];
const ROWS_OPTIONS = [10, 25, 50];

const ImportedIncompleteAccountsTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchAccounts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        "https://www.snptaxes.com/api/accounts/imported-incomplete?active=true"
      );
      setAccounts(res.data.accountlist || []);
    } catch (err) {
      console.error("Failed to fetch accounts", err);
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const filtered = accounts.filter((a) =>
    a.accountName?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) return (
    <div className="rounded-xl border border-border bg-card">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0">
          <div className="h-4 w-40 rounded bg-muted animate-pulse" />
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="flex gap-1.5">
            <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
            <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
          </div>
          <div className="h-4 w-36 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 py-16">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-sm font-medium text-destructive">{error}</p>
      <Button variant="outline" size="sm" onClick={fetchAccounts}>Retry</Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search accounts..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {COLUMNS.map((col) => (
                  <th key={col} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-muted-foreground">No accounts found</p>
                      {search && <p className="text-xs text-muted-foreground">Try adjusting your search</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((account) => (
                  <tr key={account._id} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <button
                        onClick={() => navigate(`/importedaccounts/${account._id}/docs`)}
                        className="text-sm font-medium text-primary hover:underline text-left"
                      >
                        {account.accountName}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-foreground">
                        {account.clientType || <span className="text-muted-foreground">—</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {account.tags?.length > 0 ? account.tags.map((tag) => (
                          <span
                            key={tag._id}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white leading-none"
                            style={{ backgroundColor: tag.tagColour }}
                          >
                            {tag.tagName}
                          </span>
                        )) : <span className="text-sm text-muted-foreground">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {account.contacts?.length > 0 ? (
                        <div className="space-y-0.5">
                          {account.contacts.map((c) => (
                            <div key={c._id} className="text-sm text-muted-foreground">
                              {c.contact?.email || "—"}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">{page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, filtered.length)}</span>
              {" "}of{" "}
              <span className="font-medium text-foreground">{filtered.length}</span> accounts
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Rows</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                  className="h-7 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {ROWS_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[4rem] text-center text-xs text-muted-foreground">
                  {page + 1} / {totalPages || 1}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportedIncompleteAccountsTable;

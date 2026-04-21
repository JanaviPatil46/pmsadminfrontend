import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Search, Upload, Trash2, FileArchive, Loader2, AlertCircle, FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const ROWS_OPTIONS = [10, 25, 50];

const AccountTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const [selectedZip, setSelectedZip] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fileInputRef = useRef(null);

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("https://www.snptaxes.com/api/accounts/only-imported?active=true");
      setAccounts(res.data?.accountlist || res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = accounts.filter((a) =>
    a.accountName?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);
  const paginatedAccounts = filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSelectZip = (account) => {
    setSelectedAccount(account);
    setSelectedZip(null);
    setFolderName("");
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  const handleZipChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".zip")) {
      toast.error("Only ZIP files are allowed");
      return;
    }
    setSelectedZip(file);
    setFolderName(file.name.replace(/\.zip$/i, ""));
    toast.success(`Selected: ${file.name}`);
  };

  const handleUpload = async (account) => {
    if (!selectedZip || !account) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("folderZip", selectedZip);
    formData.append("folderName", folderName);
    formData.append("folderPath", `${account._id}/${folderName}`);
    formData.append("accountId", account._id);
    try {
      await axios.post("https://www.snptaxes.com/api/accountsdoc/account-upload-folder", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("ZIP uploaded successfully");
      setSelectedZip(null);
      setFolderName("");
      fetchAccounts();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocuments = async (account) => {
    if (!account?._id) return;
    if (!window.confirm("Delete ALL documents for this account? This cannot be undone.")) return;
    setIsDeletingId(account._id);
    try {
      await axios.delete("https://www.snptaxes.com/api/accountsdoc/delete-account-folder", {
        data: { accountId: account._id },
      });
      toast.success("Documents deleted");
      fetchAccounts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete documents");
    } finally {
      setIsDeletingId(null);
    }
  };

  if (loading) return (
    <div className="rounded-xl border border-border bg-card">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-border last:border-0">
          <div className="h-4 w-48 rounded bg-muted animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded-lg bg-muted animate-pulse" />
            <div className="h-8 w-20 rounded-lg bg-muted animate-pulse" />
            <div className="h-8 w-32 rounded-lg bg-muted animate-pulse" />
          </div>
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
      {/* Search bar */}
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
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Name</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedAccounts.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-muted-foreground">No accounts found</p>
                      {search && <p className="text-xs text-muted-foreground">Try adjusting your search</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAccounts.map((account) => {
                  const isThisSelected = selectedAccount?._id === account._id && selectedZip;
                  const isDeleting = isDeletingId === account._id;
                  return (
                    <tr key={account._id} className="group transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-medium text-foreground">{account.accountName}</span>
                          {isThisSelected && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                              <FileArchive className="h-3 w-3" />
                              {selectedZip.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectZip(account)}
                            className="h-8 gap-1.5 text-xs"
                          >
                            <FileArchive className="h-3.5 w-3.5" />
                            Select ZIP
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpload(account)}
                            disabled={!isThisSelected || isUploading}
                            className="h-8 gap-1.5 text-xs"
                          >
                            {isUploading && isThisSelected ? (
                              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…</>
                            ) : (
                              <><Upload className="h-3.5 w-3.5" /> Upload</>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDocuments(account)}
                            disabled={isDeleting}
                            className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 hover:border-destructive/50"
                          >
                            {isDeleting ? (
                              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Deleting…</>
                            ) : (
                              <><Trash2 className="h-3.5 w-3.5" /> Delete Docs</>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAccounts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, filteredAccounts.length)}</span> of <span className="font-medium text-foreground">{filteredAccounts.length}</span> accounts
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

      <input ref={fileInputRef} type="file" hidden accept=".zip" onChange={handleZipChange} />
    </div>
  );
};

export default AccountTable;

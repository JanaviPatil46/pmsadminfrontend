import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Upload, FileArchive, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { DataTable } from "../components/data-table/data-table";
import { DataTableToolbar } from "../components/data-table/toolbar";

const AccountTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [selectedZip, setSelectedZip] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [folderName, setFolderName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("https://www.snptaxes.com/api/accounts/imported-incomplete?active=true");
      setAccounts(res.data?.accountlist || res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const [globalFilter, setGlobalFilter] = useState("");

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

  const columns = useMemo(() => [
    {
      accessorKey: "accountName",
      header: "Account Name",
      cell: ({ getValue, row }) => {
        const account = row.original;
        const isThisSelected = selectedAccount?._id === account._id && selectedZip;
        return (
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-medium text-foreground">{getValue()}</span>
            {isThisSelected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                <FileArchive className="h-3 w-3" />
                {selectedZip.name}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      size: 180,
      enableSorting: false,
      meta: { align: "right" },
      cell: ({ row }) => {
        const account = row.original;
        const isThisSelected = selectedAccount?._id === account._id && selectedZip;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectZip(account)}
              className="h-7 gap-1.5 text-xs"
            >
              <FileArchive className="h-3.5 w-3.5" />
              Select ZIP
            </Button>
            <Button
              size="sm"
              onClick={() => handleUpload(account)}
              disabled={!isThisSelected || isUploading}
              className="h-7 gap-1.5 text-xs"
            >
              {isUploading && isThisSelected ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…</>
              ) : (
                <><Upload className="h-3.5 w-3.5" /> Upload</>
              )}
            </Button>
          </div>
        );
      },
    },
  ], [selectedAccount, selectedZip, isUploading]);

  if (error) return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 py-16">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-sm font-medium text-destructive">{error}</p>
      <Button variant="outline" size="sm" onClick={fetchAccounts}>Retry</Button>
    </div>
  );

  return (
    <div className="space-y-3">
      <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
      <DataTable
        columns={columns}
        data={accounts}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row._id}
        emptyMessage="No accounts found"
        emptyDescription="No incomplete upload accounts available"
        pageSize={10}
      />
      <input ref={fileInputRef} type="file" hidden accept=".zip" onChange={handleZipChange} />
    </div>
  );
};

export default AccountTable;
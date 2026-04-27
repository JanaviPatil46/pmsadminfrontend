import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { DataTable } from "../components/data-table/data-table";
import { DataTableToolbar } from "../components/data-table/toolbar";

const ImportedIncompleteAccountsTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
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

  const columns = useMemo(() => [
    {
      accessorKey: "accountName",
      header: "Account Name",
      cell: ({ getValue, row }) => (
        <button
          onClick={() => navigate(`/importedaccounts/${row.original._id}/docs`)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
        >
          {getValue()}
        </button>
      ),
    },
    {
      accessorKey: "clientType",
      header: "Client Type",
      cell: ({ getValue }) => {
        const val = getValue();
        return val
          ? <Badge variant="secondary">{val}</Badge>
          : <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      enableSorting: false,
      cell: ({ getValue }) => {
        const tags = getValue();
        return tags?.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag._id}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white leading-none"
                style={{ backgroundColor: tag.tagColour }}
              >
                {tag.tagName}
              </span>
            ))}
          </div>
        ) : <span className="text-sm text-muted-foreground">—</span>;
      },
    },
    {
      accessorKey: "contacts",
      header: "Contact Emails",
      enableSorting: false,
      cell: ({ getValue }) => {
        const contacts = getValue();
        return contacts?.length > 0 ? (
          <div className="space-y-0.5">
            {contacts.map((c) => (
              <div key={c._id} className="text-sm text-muted-foreground">
                {c.contact?.email || "—"}
              </div>
            ))}
          </div>
        ) : <span className="text-sm text-muted-foreground">—</span>;
      },
    },
  ], [navigate]);

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
        emptyDescription="No imported incomplete accounts available"
        pageSize={10}
      />
    </div>
  );
};

export default ImportedIncompleteAccountsTable;

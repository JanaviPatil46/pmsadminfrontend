import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import { toast } from "react-toastify";
import axios from "axios";

const ProposalsEls = () => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL;
  const [proposallist, setProposalList] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const navigate = useNavigate();
  const [filterStatus] = useState("active");

  const fetchPrprosalsAllData = async () => {
    try {
      const accountsResponse = await axios.get(
        `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`
      );
      const accountsData = accountsResponse.data.accountlist || [];
      if (!accountsData.length) return;
      const accountIds = accountsData.map((acc) => acc._id).join(",");
      const url = `https://www.snptaxes.com/account/proposals/byaccount/${accountIds}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch proposals");
      const result = await response.json();
      setProposalList(result.proposallist || []);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  useEffect(() => {
    fetchPrprosalsAllData();
  }, []);

  const handleEdit = (_id, accountId) => {
    navigate(`/clients/accounts/accountsdash/proposals/${accountId}/account-proposal?edit=${_id}`);
  };

  const handleAccountDash = (accountId) => {
    navigate(`/clients/accounts/accountsdash/overview/${accountId}`);
  };

  const handleDelete = (_id) => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;
    fetch(`https://www.snptaxes.com/account/proposals/${_id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        toast.success("Proposal deleted successfully");
        fetchPrprosalsAllData();
      })
      .catch(() => toast.error("Failed to delete proposal"));
  };

  const handleCreateProposal = () => {
    navigate("/billing/proposalsandels/new");
  };

  const STATUS_CLASSES = {
    Draft: "bg-muted text-muted-foreground border-border",
    Sent: "bg-primary/10 text-primary border-primary/20",
    Accepted: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
    Declined: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const columns = useMemo(() => [
    {
      id: "clientName",
      header: "Client Name",
      size: 160,
      cell: ({ row }) => {
        const accountId = row.original.general?.account?.[0]?._id;
        const accountName = row.original.general?.account?.[0]?.accountName;
        return (
          <button
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors text-left truncate max-w-[150px] block"
            onClick={() => handleAccountDash(accountId)}
          >
            {accountName || "—"}
          </button>
        );
      },
    },
    {
      id: "proposalName",
      header: "Proposal Name",
      size: 180,
      cell: ({ row }) => {
        const accountId = row.original.general?.account?.[0]?._id;
        return (
          <button
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors text-left truncate max-w-[170px] block"
            onClick={() => handleEdit(row.original._id, accountId)}
          >
            {row.original.general?.proposalName || "Untitled"}
          </button>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 110,
      cell: ({ getValue }) => {
        const status = getValue();
        const cls = STATUS_CLASSES[status] || "bg-muted text-muted-foreground border-border";
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>
            {status || "—"}
          </span>
        );
      },
    },
    {
      id: "payment",
      header: "Payment",
      size: 90,
      enableSorting: false,
      cell: () => <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      id: "auth",
      header: "Auth",
      size: 80,
      enableSorting: false,
      cell: () => <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      id: "invoicing",
      header: "Invoicing",
      size: 90,
      enableSorting: false,
      cell: () => <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      size: 100,
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground">
          {getValue()
            ? new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).format(new Date(getValue()))
            : "—"}
        </span>
      ),
    },
    {
      id: "signed",
      header: "Signed",
      size: 80,
      enableSorting: false,
      cell: () => <span className="text-xs text-muted-foreground">—</span>,
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => {
        const accountId = row.original.general?.account?.[0]?._id;
        return (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => handleEdit(row.original._id, accountId)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      },
    },
  ], []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Proposals & ELs</h1>
        <Button size="sm" onClick={handleCreateProposal}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> New Proposal
        </Button>
      </div>

      <div className="space-y-3">
        <DataTableToolbar
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
        />
        <DataTable
          columns={columns}
          data={proposallist}
          loading={false}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          enableRowSelection={false}
          getRowId={(row) => row._id}
          emptyMessage="No proposals found"
          emptyDescription="Create your first proposal to get started"
          pageSize={25}
        />
      </div>
    </div>
  );
};

export default ProposalsEls;

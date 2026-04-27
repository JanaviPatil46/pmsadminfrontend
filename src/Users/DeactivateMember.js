import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import { Badge } from "../components/ui/badge";
import { DataTable } from "../components/data-table/data-table";
import { DataTableToolbar } from "../components/data-table/toolbar";

const DeactivateMember = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const fetchDeactivateData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${LOGIN_API}/admin/teammember/teammemberlist/list/false`,
        { method: "GET", redirect: "follow" }
      );
      const result = await response.json();
      setTeamMembers(result.teamMemberslist);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeactivateData();
  }, []);

  const handleRestoreMember = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to restore this account?");
    if (isConfirmed) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      fetch(`${LOGIN_API}/admin/teammember/${id}`, {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify({ active: true }),
        redirect: "follow",
      })
        .then((r) => r.json())
        .then(() => {
          toast.success("Team Member Activated Successfully");
          fetchDeactivateData();
        })
        .catch((error) => console.error(error));
    }
  };

  const memberColumns = useMemo(() => [
    {
      accessorKey: "FirstName",
      header: "Name",
      cell: ({ row }) => {
        const member = row.original;
        const fName = member?.FirstName || "";
        const mName = member?.MiddleName || "";
        const lName = member?.LastName || "";
        const initials = `${fName ? fName[0] : ""}${lName ? lName[0] : ""}`.toUpperCase();
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground shrink-0">
              {initials || "?"}
            </div>
            <Link
              to={`/updateteammember/${member?.id}`}
              className="text-sm font-medium text-foreground hover:text-primary hover:underline transition-colors"
            >
              {`${fName} ${mName} ${lName}`.trim() || "—"}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "Email",
      header: "Email",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{getValue()}</span>
      ),
    },
    {
      accessorKey: "Role",
      header: "Role",
      cell: ({ getValue }) => {
        const role = getValue();
        return role ? (
          <Badge variant="secondary" className="capitalize">{role}</Badge>
        ) : null;
      },
    },
    {
      accessorKey: "Created",
      header: "Created",
      cell: ({ getValue }) => {
        const d = new Date(getValue());
        return (
          <span className="text-sm text-muted-foreground">
            {isNaN(d) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }).replace(",", "")}
          </span>
        );
      },
    },
    {
      accessorKey: "has2FA",
      header: "2FA",
      cell: ({ getValue }) => {
        const enabled = getValue();
        return (
          <Badge variant={enabled ? "default" : "outline"}>
            {enabled ? "Enabled" : "Disabled"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <button
          onClick={() => handleRestoreMember(row.original.id)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary hover:bg-primary/10"
          title="Restore"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ], []);

  return (
    <div className="space-y-3">
      <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
      <DataTable
        columns={memberColumns}
        data={teamMembers}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row._id || row.id}
        emptyMessage="No deactivated members"
        emptyDescription="All team members are currently active"
        pageSize={30}
      />
    </div>
  );
};

export default DeactivateMember;

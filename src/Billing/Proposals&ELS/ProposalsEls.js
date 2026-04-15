import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import axios from "axios";
const ProposalsEls = () => {
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL;
  const [proposallist, setProposalList] = useState([]);
  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState("active"); 
  
const fetchPrprosalsAllData = async () => {
  try {
    // Step 1: Fetch active accounts
    const accountsResponse = await axios.get(
     `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`
      // `${ACCOUNT_API}/accounts/account/accountdetailslist/true`
    );

    const accountsData = accountsResponse.data.accountlist || [];
    if (!accountsData.length) return;

    // Step 2: Build accountIds string
    const accountIds = accountsData.map((acc) => acc._id).join(",");

    // Step 3: Fetch proposals for all accounts in one request
    const url = `https://www.snptaxes.com/account/proposals/byaccount/${accountIds}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch proposals");

    const result = await response.json();
    console.log("Proposals:", result.proposallist);

    setProposalList(result.proposallist || []);
  } catch (error) {
    console.error("Error fetching proposals:", error);
  }
};

  useEffect(() => {
    fetchPrprosalsAllData();
  }, []);

  const handleEdit = (_id, data) => {
    console.log(_id);
    console.log(data);
    navigate(`/clients/accounts/accountsdash/proposals/${data}/account-proposal?edit=${_id}`);
    // console.log(_id);
  };

  const handleAccountDash = (_id, data) => {
    navigate(`/clients/accounts/accountsdash/overview/${data}`);
  };

  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };

  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Job template?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `https://www.snptaxes.com/account/proposals/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          toast.success("Item deleted successfully");
          //   setShowForm(false);
          fetchPrprosalsAllData();
          // fetchServiceData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };
  const handleCreateProposal=()=>{
    navigate("/billing/proposalsandels/new");
  }

  const HEADERS = ["Client Name", "Proposal Name", "Status", "Payment", "Auth", "Invoicing", "Date", "Signed", "Settings"];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Proposals & ELs</h1>
        <Button
          onClick={handleCreateProposal}
          className="rounded-full px-5 bg-primary text-white hover:bg-primary/90"
        >
          New Proposals & ELs
        </Button>
      </div>

      <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/40">
              {HEADERS.map((h) => (
                <th key={h} className="text-xs font-semibold text-left px-4 py-3 text-muted-foreground uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proposallist.length === 0 ? (
              <tr>
                <td colSpan={HEADERS.length} className="text-center py-12 text-sm text-muted-foreground">
                  No proposals found.
                </td>
              </tr>
            ) : (
              proposallist.map((row) => (
                <tr key={row._id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span
                      className="text-sm text-indigo-600 cursor-pointer hover:underline font-medium"
                      onClick={() => handleAccountDash(row._id, row.general.account?.[0]?._id)}
                    >
                      {row.general.account?.[0]?.accountName || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-sm text-indigo-600 cursor-pointer hover:underline font-medium"
                      onClick={() => handleEdit(row._id, row.general.account?.[0]?._id)}
                    >
                      {row.general.proposalName || "Untitled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {row.status || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">—</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">—</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">—</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(row.createdAt))}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">—</td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => toggleMenu(row._id)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenuId === row._id && (
                      <div className="absolute right-6 top-8 z-50 min-w-[120px] bg-background border rounded-lg shadow-lg py-1">
                        <button
                          className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                          onClick={() => handleEdit(row._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(row._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalsEls;

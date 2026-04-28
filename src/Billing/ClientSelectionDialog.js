import React, { useState, useEffect } from "react";
import { X, Search, Users } from "lucide-react";
import InvoiceDrawer from "./InvoiceDrawer";
import Cookies from "js-cookie";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input"

const ClientSelectionDialog = ({ open, onClose, handleDrawerClose }) => {
  const [accountData, setAccountData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchAccountData();
  }, [open]);

  const fetchAccountData = async () => {
    try {
      const storedUserRole = localStorage.getItem("userRole");
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      const loginuserid = storedData?.teammember?.userid;
      const viewAllAccounts = storedData?.teammember?.viewallAccounts;

      let url = "";

      if (storedUserRole === "Admin") {
        url =
          "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
      } else {
        url =
          viewAllAccounts === true
            ? "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
            : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=true`;
      }

      const response = await fetch(url);
      const data = await response.json();

      const accounts = Array.isArray(data.accountlist)
        ? data.accountlist
        : Array.isArray(data.teamAccounts)
        ? data.teamAccounts
        : [];

      setAccountData(accounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const accountOptions = accountData.map((account) => ({
    value: account._id,
    label: account.accountName,
  }));

  const filteredAccounts = accountOptions.filter((account) =>
    account.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    onClose();
    Cookies.set("accountId", account.value);
    setDrawerOpen(true);
  };

  if (!open) return (
    <InvoiceDrawer
      isDrawerOpen={isDrawerOpen}
      setDrawerOpen={setDrawerOpen}
      selectedAccount={selectedAccount}
      handleDrawerClose={handleDrawerClose}
    />
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Dialog panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="csd-title"
        className="fixed left-1/2 top-1/2 z-[60] w-full max-w-md -translate-x-1/2 -translate-y-1/2 mx-4"
      >
        <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h2 id="csd-title" className="text-sm font-semibold text-foreground leading-none">Select Client</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Choose an account to create an invoice</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Search */}
          <div className="px-5 pt-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9"
                autoFocus
              />
            </div>
          </div>

          {/* Account list */}
          <ul className="mx-5 mb-4 h-52 overflow-y-auto divide-y divide-border/60 rounded-lg border border-border/60">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <li
                  key={account.value}
                  onClick={() => handleSelectAccount(account)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground cursor-pointer hover:bg-muted/60 transition-colors select-none"
                >
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-semibold text-primary">
                      {account.label.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {account.label}
                </li>
              ))
            ) : (
              <li className="flex flex-col items-center justify-center gap-1.5 py-8 text-center">
                <Users className="h-5 w-5 text-muted-foreground/50" />
                <span className="text-sm text-muted-foreground">No accounts found</span>
              </li>
            )}
          </ul>

          {/* Footer */}
          <div className="flex justify-end items-center gap-2 px-5 py-3.5 border-t border-border/60 bg-muted/20">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>

        </div>
      </div>

      <InvoiceDrawer
        isDrawerOpen={isDrawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedAccount={selectedAccount}
        handleDrawerClose={handleDrawerClose}
      />
    </>
  );
};

export default ClientSelectionDialog;
import React, { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";
import InvoiceDrawer from "./InvoiceDrawer";
import Cookies from "js-cookie";
import { SideSheet } from "../components/ui/side-sheet";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

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

  return (
    <>
      <SideSheet
        open={open}
        onOpenChange={(isOpen) => !isOpen && onClose()}
        title="Select Client"
        description="Choose an account to create an invoice"
        size="sm"
        hideDefaultFooter
        footer={
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        }
      >
        {/* Search */}
        <div className="relative mb-4">
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

        {/* Account list */}
        <ul className="divide-y divide-border/60 rounded-lg border border-border/60 overflow-hidden">
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
            <li className="flex flex-col items-center justify-center gap-1.5 py-10 text-center">
              <Users className="h-5 w-5 text-muted-foreground/50" />
              <span className="text-sm text-muted-foreground">No accounts found</span>
            </li>
          )}
        </ul>
      </SideSheet>

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
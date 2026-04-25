import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import InvoiceDrawer from "./InvoiceDrawer";
import Cookies from "js-cookie";

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
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Dialog Panel */}
        <div className="relative z-10 bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Select Client</h2>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 pt-4 pb-2">
            <input
              type="text"
              placeholder="Start typing name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow shadow-sm mb-3"
            />

            <ul className="h-52 overflow-y-auto divide-y divide-border rounded-lg border border-border">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <li
                    key={account.value}
                    onClick={() => handleSelectAccount(account)}
                    className="px-4 py-2.5 text-sm text-foreground cursor-pointer hover:bg-muted transition-colors"
                  >
                    {account.label}
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-sm text-muted-foreground text-center">
                  No accounts found
                </li>
              )}
            </ul>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-5 py-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
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
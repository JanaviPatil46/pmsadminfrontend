

import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InvoiceDrawer from "./InvoiceDrawer";
import Cookies from "js-cookie";
const ClientSelectionDialog = ({ open, onClose, handleDrawerClose }) => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [accountData, setAccountData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // const fetchAccountData = async () => {
  //   try {
  //     // const response = await fetch(
  //     //   `${ACCOUNT_API}/accounts/account/accountdetailslist/true`
  //     // );
  //     // const data = await response.json();
  //        const url = "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
  //         const response = await fetch(url);
  //         const data = await response.json();
  //     setAccountData(data.accounts);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchAccountData();
  // }, []);

  // const accountOptions = accountData.map((account) => ({
  //   value: account._id,
  //   label: account.accountName,
  // }));

  useEffect(() => {
  fetchAccountData();
}, []);

const fetchAccountData = async () => {
  try {
    const storedUserRole = localStorage.getItem("userRole");
    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    const loginuserid = storedData?.teammember?.userid;
    const viewAllAccounts = storedData?.teammember?.viewallAccounts;

    let url = "";

    // === ROLE-BASED URL LOGIC ===
    if (storedUserRole === "Admin") {
      url =
        "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
    } else {
      // Team Member
      url =
        viewAllAccounts === true
          ? "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
          : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=true`;
    }

    console.log("Fetching accounts from:", url);

    const response = await fetch(url);
    const data = await response.json();

    // Handle both response formats (Admin & TeamMember)
    const accounts = Array.isArray(data.accountlist)
      ? data.accountlist
      : Array.isArray(data.teamAccounts)
      ? data.teamAccounts
      : [];

    console.log("Account list:", accounts);

    setAccountData(accounts);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Convert to dropdown options
const accountOptions = accountData.map((account) => ({
  value: account._id,
  label: account.accountName,
}));
  const filteredAccounts = accountOptions.filter((account) =>
    account.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAccount = (account) => {
    console.log("accountselection",account)
    setSelectedAccount(account);
    onClose();
    Cookies.set("accountId", account.value);
    setDrawerOpen(true);
  };

  return (
    <Box>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Select client
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Start typing user name, ID, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

          <List sx={{ height: "200px", overflowY: "auto" }}>
            {filteredAccounts.map((account) => (
              <ListItem
                key={account.value}
                onClick={() => handleSelectAccount(account)}
              >
                <ListItemText
                  primary={account.label}
                  sx={{ cursor: "pointer" }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <InvoiceDrawer
        isDrawerOpen={isDrawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedAccount={selectedAccount}
        handleDrawerClose={handleDrawerClose}
      />
    </Box>
  );
};

export default ClientSelectionDialog;
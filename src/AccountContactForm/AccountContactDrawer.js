import React, { useEffect } from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountContactForm from "./AccountContactForm";
import { useDispatch } from "react-redux";
import { setAccountData, setSelectedContacts, resetForm } from "../redux/accountContactSlice";
import axios from "axios";

export default function AccountContactDrawer({ open, onClose, accountId = null,fetchAccountsList ,handleDrawerClose}) {
  const dispatch = useDispatch();

  
useEffect(() => {
    if (open && accountId) {
      (async () => {
        try {
          const { data: account } = await axios.get(`https://www.snptaxes.com/api/accounts/${accountId}`);

          // Dispatch account data
          dispatch(setAccountData(account));

          // Map account contacts to selected contacts with login mapping
          const selectedContacts = account.contacts?.map(c => ({
            ...c.contact,
            login: c.canLogin, // map backend canLogin to frontend login
            notify: c.canNotify || false,
            emailSync: c.canEmailSync || false,
            _id: c.contact._id,
          })) || [];

          dispatch(setSelectedContacts(selectedContacts));
        } catch (error) {
          console.error("Failed to load account data:", error);
          dispatch(resetForm());
          onClose(); // close drawer on failure optionally
        }
      })();
    } else if (!open) {
      dispatch(resetForm());
    }
  }, [open, accountId, dispatch, onClose]);
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 700 }, maxWidth: '100vw', borderRadius: { sm: '12px 0 0 12px' } } }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          {accountId ? "Update Account" : "Create Account"}
        </h2>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <CloseIcon fontSize="small" />
        </button>
      </div>
      <div className="p-5 overflow-y-auto flex-1">
        <AccountContactForm isEditing={!!accountId} accountId={accountId} onCloseDrawer={onClose} fetchAccountsList={fetchAccountsList} handleDrawerClose={handleDrawerClose}/>
      </div>
    </Drawer>
  );
}

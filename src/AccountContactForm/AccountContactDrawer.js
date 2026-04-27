import React, { useEffect } from "react";
import AccountContactForm from "./AccountContactForm";
import { useDispatch } from "react-redux";
import { setAccountData, setSelectedContacts, resetForm } from "../redux/accountContactSlice";
import axios from "axios";
import { SideSheet } from "../components/ui/side-sheet";

export default function AccountContactDrawer({ open, onClose, accountId = null, fetchAccountsList, handleDrawerClose }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (open && accountId) {
      (async () => {
        try {
          const { data: account } = await axios.get(`https://www.snptaxes.com/api/accounts/${accountId}`);
          dispatch(setAccountData(account));
          const selectedContacts = account.contacts?.map(c => ({
            ...c.contact,
            login: c.canLogin,
            notify: c.canNotify || false,
            emailSync: c.canEmailSync || false,
            _id: c.contact._id,
          })) || [];
          dispatch(setSelectedContacts(selectedContacts));
        } catch (error) {
          dispatch(resetForm());
          onClose();
        }
      })();
    } else if (!open) {
      dispatch(resetForm());
    }
  }, [open, accountId, dispatch, onClose]);

  return (
    <SideSheet
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={accountId ? "Update Account" : "Create Account"}
      size="xl"
      hideDefaultFooter
    >
      <AccountContactForm
        isEditing={!!accountId}
        accountId={accountId}
        onCloseDrawer={onClose}
        fetchAccountsList={fetchAccountsList}
        handleDrawerClose={handleDrawerClose}
      />
    </SideSheet>
  );
}

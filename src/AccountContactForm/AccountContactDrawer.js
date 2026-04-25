import React, { useEffect } from "react";
import { X } from "lucide-react";
import AccountContactForm from "./AccountContactForm";
import { useDispatch } from "react-redux";
import { setAccountData, setSelectedContacts, resetForm } from "../redux/accountContactSlice";
import axios from "axios";

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
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-over panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[700px] max-w-full bg-card border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">
            {accountId ? "Update Account" : "Create Account"}
          </h2>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          <AccountContactForm
            isEditing={!!accountId}
            accountId={accountId}
            onCloseDrawer={onClose}
            fetchAccountsList={fetchAccountsList}
            handleDrawerClose={handleDrawerClose}
          />
        </div>
      </div>
    </>
  );
}

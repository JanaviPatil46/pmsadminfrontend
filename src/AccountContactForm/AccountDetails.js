import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Stack,
  Button,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AccountContactDrawer from "./AccountContactDrawer";

const AccountDetails = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [tagList, setTagList] = useState([]);
const [teamMemberList, setTeamMemberList] = useState([]);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newCanLoginValue, setNewCanLoginValue] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
useEffect(() => {
  const fetchTags = async () => {
    try {
      const res = await fetch(`${TAGS_API}/tags/`);
      const data = await res.json();

      setTagList(data.tags); // store all tags
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  fetchTags();
}, []);

  const fetchAccountDetails = async () => {
    try {
      const res = await axios.get(
        `https://www.snptaxes.com/api/accounts/${id}`
      );
      setAccount(res.data);
      console.log("result", res.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };
console.log("selected contact list",selectedContact)
  useEffect(() => {
    fetchAccountDetails();
  }, [id]);
  // Open confirmation dialog before toggling
  const handleSwitchClick = (contact) => {
    setSelectedContact(contact);
    setNewCanLoginValue(!contact.canLogin); // what the value will be after toggle
    setDialogOpen(true);
  };
  // Toggle without dialog
  const handleNotifyToggle = async (contact) => {
    try {
      await axios.patch(
        `https://www.snptaxes.com/api/accounts/${account._id}/contact/${contact.contact._id}`,
        { canNotify: !contact.canNotify }
      );

      // update UI
      setAccount((prev) => ({
        ...prev,
        contacts: prev.contacts.map((c) =>
          c.contact._id === contact.contact._id
            ? { ...c, canNotify: !c.canNotify }
            : c
        ),
      }));
    } catch (error) {
      console.error("Error updating canNotify", error);
    }
  };

  const handleEmailSyncToggle = async (contact) => {
    try {
      await axios.patch(
        `https://www.snptaxes.com/api/accounts/${account._id}/contact/${contact.contact._id}`,
        { canEmailSync: !contact.canEmailSync }
      );

      setAccount((prev) => ({
        ...prev,
        contacts: prev.contacts.map((c) =>
          c.contact._id === contact.contact._id
            ? { ...c, canEmailSync: !c.canEmailSync }
            : c
        ),
      }));
    } catch (error) {
      console.error("Error updating canEmailSync", error);
    }
  };

  // Confirm toggle
  const handleConfirmToggle = async () => {
    if (!selectedContact) return;

    try {
      await axios.patch(
        `https://www.snptaxes.com/api/accounts/${account._id}/contact/${selectedContact.contact._id}`,
        { canLogin: newCanLoginValue }
      );

      // Update local state
      setAccount((prev) => ({
        ...prev,
        contacts: prev.contacts.map((c) =>
          c.contact._id === selectedContact.contact._id
            ? { ...c, canLogin: newCanLoginValue }
            : c
        ),
      }));
    } catch (error) {
      console.error("Error updating canLogin:", error);
    } finally {
      setDialogOpen(false);
      setSelectedContact(null);
    }
  };

  // Cancel dialog
  const handleCancelToggle = () => {
    setDialogOpen(false);
    setSelectedContact(null);
  };
const accountTags = tagList.filter(tag =>
  account.tags.includes(tag._id)
);
const assignedMembers = teamMemberList.filter(user =>
  account.teamMember.includes(user._id)
);

  if (!account) return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-slate-500">
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <RouterLink to="/" className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors no-underline">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Accounts
        </RouterLink>
        <button
          className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          onClick={() => setDrawerOpen(true)}
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Edit Account
        </button>
      </div>

      {/* Account detail card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Account header */}
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">{account.accountName}</h2>
        </div>

        <div className="p-5 space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Client Type</p>
              <p className="text-sm text-slate-900">{account.clientType}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Company Name</p>
              <p className="text-sm text-slate-900">{account.companyName || <span className="text-slate-300">—</span>}</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Tags */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {accountTags.length > 0 ? (
                accountTags.map(tag => (
                  <span key={tag._id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: tag.tagColour, color: "#fff" }}>
                    {tag.tagName}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400">—</span>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Team Members</p>
            <div className="flex flex-wrap gap-1.5">
              {assignedMembers.length > 0 ? (
                assignedMembers.map(member => (
                  <span key={member._id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {member.username}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400">—</span>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Contacts */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contacts</p>
            {account.contacts?.length > 0 ? (
              <div className="space-y-2">
                {account.contacts.map((c) => (
                  <div key={c.contact._id} className="flex items-center justify-between flex-wrap gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-sm text-slate-700">
                      <span className="font-medium">{c.contact.firstName} {c.contact.lastName}</span>
                      <span className="text-slate-400 mx-1.5">—</span>
                      <span className="text-slate-500">{c.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FormControlLabel
                        control={<Switch size="small" checked={c.canLogin} onClick={() => handleSwitchClick(c)} color="primary" />}
                        label={<span className="text-xs text-slate-600">Login</span>}
                      />
                      <FormControlLabel
                        control={<Switch size="small" checked={c.canNotify} onClick={() => handleNotifyToggle(c)} color="primary" />}
                        label={<span className="text-xs text-slate-600">Notify</span>}
                      />
                      <FormControlLabel
                        control={<Switch size="small" checked={c.canEmailSync} onClick={() => handleEmailSyncToggle(c)} color="primary" />}
                        label={<span className="text-xs text-slate-600">EmailSync</span>}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No contacts found</p>
            )}
          </div>
        </div>
      </div>

      <AccountContactDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          fetchAccountDetails();
        }}
        accountId={account._id}
      />

      <Dialog open={dialogOpen} onClose={handleCancelToggle}>
        <DialogTitle>Confirm Access Change</DialogTitle>
        <DialogContent>
          <Typography>
            {newCanLoginValue
              ? `Do you want to give access of client portal to ${selectedContact?.contact.email}?`
              : `Do you want to remove access of client portal from ${selectedContact?.contact.email}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelToggle} variant="outlined">Cancel</Button>
          <Button onClick={handleConfirmToggle} variant="contained" color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AccountDetails;

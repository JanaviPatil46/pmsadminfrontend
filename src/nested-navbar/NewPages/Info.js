import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AccountContactDrawer from "../../AccountContactForm/AccountContactDrawer";
import ContactForm from "../../Pages/UpdateContact";
import MenuDropdown from "./MenuDropdown";
import UploadProfilePicture from "./UploadProfilePicture";
import { IoClose } from "react-icons/io5";
import { Button } from "../../components/ui/button";
const AccountDetails = () => {
  const { data } = useParams();
  const [account, setAccount] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newCanLoginValue, setNewCanLoginValue] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  const fetchAccountDetails = async () => {
    try {
      const res = await axios.get(
        `https://www.snptaxes.com/api/accounts/${data}`
      );
      setAccount(res.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };
  useEffect(() => {
    fetchAccountDetails();
  }, [data]);
  // Fetch available contacts (excluding already linked ones)
  const fetchAvailableContacts = async () => {
    try {
      const res = await axios.get(`https://www.snptaxes.com/api/contacts`);
      const currentContactIds =
        account?.contacts?.map((c) => c.contact._id) || [];
      const filteredContacts = res.data.filter(
        (contact) => !currentContactIds.includes(contact._id)
      );
      setAvailableContacts(filteredContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };
  // Fetch available contacts when account data is loaded and drawer is opened
  useEffect(() => {
    if (addContactDrawerOpen && account) {
      fetchAvailableContacts();
    }
  }, [addContactDrawerOpen, account]);
  const handleSwitchClick = (contact) => {
    setSelectedContact(contact);
    setNewCanLoginValue(!contact.canLogin);
    setDialogOpen(true);
  };

  const handleNotifyToggle = async (contact) => {
    try {
      await axios.patch(
        `https://www.snptaxes.com/api/accounts/${account._id}/contact/${contact.contact._id}`,
        { canNotify: !contact.canNotify }
      );
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
  // Send activation email function
  const sendActivationEmail = async (contact) => {
    const ContactId = contact.contact._id;
    try {
      await axios.post(
        `https://www.snptaxes.com/api/contacts/${ContactId}/resend-activation`,
        {
          email: contact.contact.email,
          contactId: ContactId,
        }
      );
      return true;
    } catch (error) {
      console.error("Error sending activation email:", error);
      return false;
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedContact) return;
    try {
      await axios.patch(
        `https://www.snptaxes.com/api/accounts/${account._id}/contact/${selectedContact.contact._id}`,
        { canLogin: newCanLoginValue }
      );
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

  const handleCancelToggle = () => {
    setDialogOpen(false);
    setSelectedContact(null);
  };
  const [tagList, setTagList] = useState([]);
  const [teamMemberList, setTeamMemberList] = useState([]);
  // ✅ Fetch Tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`${TAGS_API}/tags/`);
        const data = await res.json();
        setTagList(data.tags);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, []);

  // ✅ Fetch Team Members
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(
          `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`
        );
        const data = await res.json();
        setTeamMemberList(data);
      } catch (err) {
        console.error("Error fetching team members:", err);
      }
    };
    fetchTeam();
  }, []);

  // ✅ Always use empty array fallback
  const accountTags = tagList.length
    ? tagList.filter((tag) => account?.tags?.includes(tag._id))
    : [];

  const assignedMembers = teamMemberList.length
    ? teamMemberList.filter((member) =>
        account?.teamMember?.includes(member._id)
      )
    : [];
  // Handle linking selected contacts to account - UPDATED FOR YOUR SCHEMA
  const handleLinkContacts = async () => {
    if (selectedContacts.length === 0) return;

    try {
      // Prepare the contacts data according to your schema
      const contactsToAdd = selectedContacts.map((contact) => ({
        contact: contact._id,
        canLogin: false,
        canNotify: false,
        canEmailSync: false,
      }));

      // Make API call to add contacts to account
      await axios.post(
        `https://www.snptaxes.com/api/accounts/${account._id}/contacts`,
        { contacts: contactsToAdd }
      );

      // Refresh account details
      fetchAccountDetails();
      setAddContactDrawerOpen(false);
      setSelectedContacts([]);
    } catch (error) {
      console.error("Error linking contacts:", error);
    }
  };
  // Handle unlinking contact from account
  const handleUnlinkContact = async (contact) => {
    if (
      !window.confirm(
        `Are you sure you want to unlink ${contact.contact.firstName} ${contact.contact.lastName} from this account?`
      )
    ) {
      return;
    }
    try {
      await axios.delete(
        `https://www.snptaxes.com/api/accounts/${account._id}/contact/${contact.contact._id}`
      );

      // Refresh account details to reflect the change
      fetchAccountDetails();
    } catch (error) {
      console.error("Error unlinking contact:", error);
    }
  };

  // Handle reset password
  const handleResetPassword = async (contact) => {
    if (!contact.canLogin) {
      alert(
        "This contact does not have login access. Enable login access first."
      );
      return;
    }

    if (
      !window.confirm(
        `Reset password for ${contact.contact.firstName} ${contact.contact.lastName}? They will receive an email with instructions to set a new password.`
      )
    ) {
      return;
    }

    try {
      await axios.post( 'https://www.snptaxes.com/api/auth/forgot-password', {
        email: contact.contact.email,
      });
      alert("Password reset email sent successfully!");
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Error sending password reset email");
    }
  };
  // Separate state for contact edit drawer
  const [contactEditDrawerOpen, setContactEditDrawerOpen] = useState(false);
  const [selectedContactForEdit, setSelectedContactForEdit] = useState(null); // Renamed for clarity

  // Handle opening contact edit drawer
  const handleOpenContactEditDrawer = (contactData) => {
    setSelectedContactForEdit(contactData.contact);
    setContactEditDrawerOpen(true);
  };
  const handleContactUpdated = () => {
    fetchAccountDetails();
  };
  const [contactSearch, setContactSearch] = useState("");
  const filteredAvailableContacts = availableContacts.filter((c) =>
    `${c.contactName} ${c.email}`.toLowerCase().includes(contactSearch.toLowerCase())
  );

  if (!account) return (
    <div className="flex items-center justify-center h-40">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading account details…</p>
      </div>
    </div>
  );

  const saveBtnCls = "rounded-lg px-4 py-2 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] transition-colors";
  const cancelBtnCls = "rounded-lg px-4 py-2 text-sm font-medium border border-border text-muted-foreground hover:bg-muted transition-colors";
  const toggleCls = "w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4";

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* LEFT — Account Details */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Account Details</h2>
            <span title={storedData?.teammember?.manageAccounts === false ? "You don't have permission to edit accounts" : ""}>
              <button type="button"
                onClick={() => setDrawerOpen(true)}
                disabled={storedData?.teammember?.manageAccounts === false}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] transition-colors ${
                  storedData?.teammember?.manageAccounts === false ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >Edit</button>
            </span>
          </div>

          <div className="px-5 py-4 space-y-5">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <UploadProfilePicture
                accountId={account._id}
                currentImage={account.profilePicture}
                onUploadSuccess={fetchAccountDetails}
              />
              <div>
                <p className="font-semibold text-foreground">{account.accountName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{account.clientType}</p>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Tags */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {accountTags?.length > 0 ? (
                  accountTags.map((tag) => (
                    <span key={tag._id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white"
                      style={{ backgroundColor: tag.tagColour }}
                    >{tag.tagName}</span>
                  ))
                ) : <span className="text-xs text-muted-foreground">No tags assigned</span>}
              </div>
            </div>

            {/* Team Members */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Team Members</p>
              <div className="flex flex-wrap gap-1.5">
                {assignedMembers?.length > 0 ? (
                  assignedMembers.map((m) => (
                    <span key={m._id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border border-border bg-muted text-muted-foreground">
                      {m.username}
                    </span>
                  ))
                ) : <span className="text-xs text-muted-foreground">No members assigned</span>}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Contacts */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Contacts</h2>
            <Button type="button" size="sm" onClick={() => setAddContactDrawerOpen(true)}
           >
              + Add Contact
            </Button>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto] items-center px-5 py-2 bg-muted border-b border-border">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Contact</span>
            <div className="flex items-center gap-5 mr-8">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-10 text-center">Login</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-10 text-center">Notify</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-14 text-center">Email Sync</span>
            </div>
          </div>

          {/* Contact rows */}
          <div className="divide-y divide-border">
            {account.contacts?.length > 0 ? (
              account.contacts.map((c) => (
                <div key={c.contact._id} className="grid grid-cols-[1fr_auto] items-center px-5 py-3 hover:bg-muted/50 transition-colors">
                  <div>
                    <span
                      title={storedData?.teammember?.manageContacts === false ? "You don't have permission to edit contacts" : ""}
                      className={`text-sm font-medium block ${
                        storedData?.teammember?.manageContacts === false
                          ? 'text-muted-foreground cursor-not-allowed opacity-60'
                          : 'text-foreground cursor-pointer hover:text-primary'
                      }`}
                      onClick={() => {
                        if (storedData?.teammember?.manageContacts === false) return;
                        handleOpenContactEditDrawer(c);
                      }}
                    >{c.contact.contactName}</span>
                    <span className="text-xs text-muted-foreground mt-0.5 block">{c.contact.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-5 mr-2">
                    <label className="relative inline-flex items-center w-10 justify-center cursor-not-allowed">
                      <input type="checkbox" className="sr-only peer" checked={c.canLogin} disabled onChange={() => handleSwitchClick(c)} />
                      <div className={toggleCls}></div>
                    </label>
                    <label className="relative inline-flex items-center w-10 justify-center cursor-not-allowed">
                      <input type="checkbox" className="sr-only peer" checked={c.canNotify} disabled onChange={() => handleNotifyToggle(c)} />
                      <div className={toggleCls}></div>
                    </label>
                    <label className="relative inline-flex items-center w-14 justify-center cursor-not-allowed">
                      <input type="checkbox" className="sr-only peer" checked={c.canEmailSync} disabled onChange={() => handleEmailSyncToggle(c)} />
                      <div className={toggleCls}></div>
                    </label>
                    <MenuDropdown contact={c} onUnlink={handleUnlinkContact} onResetPassword={handleResetPassword} />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <p className="text-sm text-muted-foreground">No contacts linked</p>
                <button type="button" onClick={() => setAddContactDrawerOpen(true)}
                  className="text-xs text-[var(--color-primary)] hover:underline">Add a contact</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account edit drawer */}
      <AccountContactDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); fetchAccountDetails(); }}
        accountId={account._id}
      />

      {/* Confirm access change modal */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleCancelToggle} />
          <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-base font-semibold text-foreground mb-2">Confirm Access Change</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {newCanLoginValue
                ? `Grant portal login access to ${selectedContact?.contact.email}?`
                : `Remove portal login access from ${selectedContact?.contact.email}?`}
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={handleCancelToggle} className={cancelBtnCls}>Cancel</button>
              <Button type="button" onClick={handleConfirmToggle}>Confirm</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact drawer */}
      {addContactDrawerOpen && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setAddContactDrawerOpen(false); setSelectedContacts([]); }} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-card shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Add Contacts to Account</h2>
              <button type="button" onClick={() => { setAddContactDrawerOpen(false); setSelectedContacts([]); setContactSearch(""); }}
                className="text-muted-foreground hover:text-foreground">
                <IoClose size={18} />
              </button>
            </div>
            <div className="px-5 py-3 border-b border-border">
              <input
                type="text"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                placeholder="Search by name or email…"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {filteredAvailableContacts.map((c) => (
                <label key={c._id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary"
                    checked={selectedContacts.some(s => s._id === c._id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedContacts(prev => [...prev, c]);
                      else setSelectedContacts(prev => prev.filter(s => s._id !== c._id));
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.contactName}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </div>
                </label>
              ))}
              {filteredAvailableContacts.length === 0 && (
                <p className="text-sm text-muted-foreground px-5 py-6 text-center">No contacts found</p>
              )}
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
              <button type="button" onClick={() => { setAddContactDrawerOpen(false); setSelectedContacts([]); setContactSearch(""); }} className={cancelBtnCls}>Cancel</button>
              <Button type="button" onClick={handleLinkContacts} disabled={selectedContacts.length === 0}
                className={`${selectedContacts.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                Link {selectedContacts.length > 0 ? `${selectedContacts.length} ` : ""}Contact{selectedContacts.length !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact drawer */}
      {contactEditDrawerOpen && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setContactEditDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[600px] bg-card shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-sm font-semibold text-foreground">Edit Contact</span>
              <button type="button" onClick={() => setContactEditDrawerOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <IoClose size={18} />
              </button>
            </div>
            {selectedContactForEdit && (
              <ContactForm
                selectedContact={selectedContactForEdit}
                handleClose={() => setContactEditDrawerOpen(false)}
                onContactUpdated={handleContactUpdated}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;

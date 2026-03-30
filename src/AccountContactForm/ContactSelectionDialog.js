import React, { useState, useEffect } from "react";
import {
  Box, TextField, Chip, List, ListItem, ListItemText, Dialog,
  DialogActions, DialogContent, DialogTitle, Button, Checkbox,
  Typography, ListItemButton
} from "@mui/material";

export default function ContactSelectionDialog({ open, onClose, onSelectContacts }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (open) fetchContacts(); }, [open]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://www.snptaxes.com/api/contacts");
      const data = await response.json();
      setAvailableContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleToggleContact = (contact) => {
    const currentIndex = selectedContacts.findIndex(c => c._id === contact._id);
    const newSelected = [...selectedContacts];
    if (currentIndex === -1) newSelected.push(contact);
    else newSelected.splice(currentIndex, 1);
    setSelectedContacts(newSelected);
    setSearchTerm("");
  };
  const handleRemoveChip = (contactId) => setSelectedContacts(selectedContacts.filter(c => c._id !== contactId));
  const handleSubmit = () => { onSelectContacts(selectedContacts); setSelectedContacts([]); setSearchTerm(""); onClose(); };
  const handleCancel = () => { setSelectedContacts([]); setSearchTerm(""); onClose(); };
  const filteredContacts = availableContacts.filter(contact =>
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <div className="px-5 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Select Existing Contacts</h2>
      </div>
      <DialogContent>
        <div className="mt-1">
          <TextField
            autoFocus margin="dense" label="Search by email or name" type="text"
            fullWidth variant="outlined" size="small"
            value={searchTerm} onChange={handleSearchChange}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            InputProps={{
              startAdornment: selectedContacts.length > 0 ? (
                <div className="flex flex-wrap gap-1 mr-2">
                  {selectedContacts.map(contact => (
                    <span key={contact._id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {contact.contactName || `${contact.firstName} ${contact.lastName}`}
                      <button onClick={() => handleRemoveChip(contact._id)} className="text-indigo-400 hover:text-indigo-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                </div>
              ) : null,
            }}
          />
        </div>
        <div className="mt-3 h-[300px] overflow-y-auto border border-slate-100 rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-slate-400 text-sm">Loading contacts...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-slate-400 text-sm">
              {searchTerm ? 'No contacts found' : 'No contacts available'}
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filteredContacts.map((contact) => {
                const isSelected = selectedContacts.some(c => c._id === contact._id);
                return (
                  <div
                    key={contact._id}
                    className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-slate-50 ${isSelected ? "bg-indigo-50/50" : ""}`}
                    onClick={() => handleToggleContact(contact)}
                  >
                    <Checkbox checked={isSelected} size="small" sx={{ padding: '2px' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{contact.contactName || `${contact.firstName} ${contact.lastName}`}</p>
                      <p className="text-xs text-slate-500 truncate">{contact.email}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
      <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200">
        <button onClick={handleCancel} className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={selectedContacts.length === 0}
          className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add Selected ({selectedContacts.length})
        </button>
      </div>
    </Dialog>
  );
}

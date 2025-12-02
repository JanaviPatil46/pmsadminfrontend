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
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>Select Existing Contacts</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            autoFocus margin="dense" label="Search by email or name" type="text"
            fullWidth variant="outlined"
            value={searchTerm} onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mr: 1 }}>
                  {selectedContacts.map(contact => (
                    <Chip
                      key={contact._id} size="small"
                      label={contact.contactName || `${contact.firstName} ${contact.lastName}`}
                      onDelete={() => handleRemoveChip(contact._id)}
                    />
                  ))}
                </Box>
              ),
            }}
          />
        </Box>
        <Box sx={{ mt: 2, height: 300, overflow: 'auto' }}>
          {loading ? (
            <Typography>Loading contacts...</Typography>
          ) : filteredContacts.length === 0 ? (
            <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
              {searchTerm ? 'No contacts found' : 'No contacts available'}
            </Typography>
          ) : (
            <List>
              {filteredContacts.map((contact) => {
                const isSelected = selectedContacts.some(c => c._id === contact._id);
                return (
                  <ListItem key={contact._id} disablePadding>
                    <ListItemButton onClick={() => handleToggleContact(contact)}>
                      <Checkbox
                        edge="start"
                        checked={isSelected}
                        tabIndex={-1}
                        disableRipple
                      />
                      <ListItemText
                        primary={contact.contactName || `${contact.firstName} ${contact.lastName}`}
                        secondary={contact.email}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={selectedContacts.length === 0}>
          Add Selected Contacts
        </Button>
      </DialogActions>
    </Dialog>
  );
}

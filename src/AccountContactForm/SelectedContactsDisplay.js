import React from "react";
import {
  Box, Typography, Card, CardContent,
  IconButton, FormGroup, FormControlLabel, Checkbox
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function SelectedContactsDisplay({ contacts, onRemove, onUpdateField, isEditing = false }) {
  if (!contacts.length) return null;
  console.log("contacts",contacts)
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>Selected Existing Contacts</Typography>
      {contacts.map((contact, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box flexGrow={1}>
                <Typography variant="h6">
                  {contact.contactName || `${contact.firstName} ${contact.lastName}`}
                </Typography>
                <Typography color="textSecondary">{contact.email}</Typography>
                <FormGroup row sx={{ mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={contact.login || false}
                        disabled
                        onChange={e => onUpdateField(index, "login", e.target.checked)}
                      />
                    }
                    label="Login"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={contact.notify || false}
                        onChange={e => onUpdateField(index, "notify", e.target.checked)}
                        disabled
                      />
                    }
                    label="Notify"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={contact.emailSync || false}
                        disabled
                        onChange={e => onUpdateField(index, "emailSync", e.target.checked)}
                      />
                    }
                    label="Email Sync"
                  />
                </FormGroup>
              </Box>
              <IconButton onClick={() => onRemove(index)} color="error">
                <CloseIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

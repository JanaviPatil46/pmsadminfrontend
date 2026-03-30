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
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-2">Selected Existing Contacts</h3>
      <div className="space-y-2">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">
                {contact.contactName || `${contact.firstName} ${contact.lastName}`}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{contact.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <FormControlLabel
                  control={<Checkbox size="small" checked={contact.login || false} disabled onChange={e => onUpdateField(index, "login", e.target.checked)} sx={{ padding: '2px' }} />}
                  label={<span className="text-xs text-slate-600">Login</span>}
                />
                <FormControlLabel
                  control={<Checkbox size="small" checked={contact.notify || false} disabled onChange={e => onUpdateField(index, "notify", e.target.checked)} sx={{ padding: '2px' }} />}
                  label={<span className="text-xs text-slate-600">Notify</span>}
                />
                <FormControlLabel
                  control={<Checkbox size="small" checked={contact.emailSync || false} disabled onChange={e => onUpdateField(index, "emailSync", e.target.checked)} sx={{ padding: '2px' }} />}
                  label={<span className="text-xs text-slate-600">Email Sync</span>}
                />
              </div>
            </div>
            <button onClick={() => onRemove(index)} className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <CloseIcon fontSize="small" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}




import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Stack,
  Typography,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  IconButton,
  Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import CloseIcon from "@mui/icons-material/Close";
import ContactForm from "../Pages/UpdateContact";
import { useNavigate } from "react-router-dom";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;

  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  // -------------------------------
  // FINAL UPDATED SEARCH LOGIC
  // -------------------------------
  const handleSearchChange = async (event) => {
    const query = event.target.value.trim();
    setSearchQuery(query);

    if (!query) {
      setOptions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let combinedOptions = [];

      // ------------------------------------
      // ✔ EMAIL SEARCH LOGIC
      // ------------------------------------
      if (isEmail(query)) {
        const [accountsRes, contactsRes] = await Promise.all([
          axios.get(
            "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true",
            { params: { search: query } }
          ),
          axios.get("https://snptaxes.com/api/contacts/search-by-email", {
            params: { email: query },
          }),
        ]);

        const accounts = accountsRes.data.accountlist || [];
        const contacts = contactsRes.data.data || [];

        combinedOptions = [
          ...accounts.map((a) => ({
            id: a._id,
            label: a.accountName,
            subLabel:
              a.emails?.length > 0 ? a.emails.join(", ") : "No Email Listed",
            type: "Accounts",
          })),
          ...contacts.map((c) => ({
            id: c._id,
            label: c.contactName,
            subLabel: c.email,
            type: "Contacts",
          })),
        ];
      }

      // ------------------------------------
      // ✔ NAME SEARCH LOGIC
      // ------------------------------------
      else {
        const [accountsRes, contactsRes] = await Promise.all([
          axios.get(
            "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true",
            { params: { search: query } }
          ),
          axios.get("https://snptaxes.com/api/contacts/contact-names", {
            params: { search: query },
          }),
        ]);

        const accounts = accountsRes.data.accountlist || [];
        const contacts = contactsRes.data.data || [];

        combinedOptions = [
          ...accounts.map((a) => ({
            id: a._id,
            label: a.accountName,
            subLabel:
              a.emails?.length > 0 ? a.emails.join(", ") : "No Email Listed",
            type: "Accounts",
          })),
          ...contacts.map((c) => ({
            id: c._id,
            label: c.contactName,
            subLabel: c.email ?? "No Email",
            type: "Contacts",
          })),
        ];
      }

      setOptions(combinedOptions);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // FILTER LOGIC
  // -------------------------------
  const filteredOptions = options
    .filter((option) => {
      const labelMatch = option.label
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const subLabelMatch = option.subLabel
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      return labelMatch || subLabelMatch;
    })
    .filter((option) => filterType === "All" || option.type === filterType);

  // -------------------------------
  // OPEN CONTACT EDIT DRAWER
  // -------------------------------
  const handleClick = async (id) => {
    try {
      const url = `https://www.snptaxes.com/api/contacts/contact/${id}`;
      const response = await fetch(url);
      const data = await response.json();

      setSelectedContact(data.data);
      setIsDrawerOpen(true);

      // Clear input + options after click
      setSearchQuery("");
      setOptions([]);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedContact(null);
  };
    const handleContactUpdated = () => {
    handleCloseDrawer();
  };

  return (
    <Box sx={{ position: "relative", width: 300, margin: "0 auto" }}>
      {/* Search Input */}
      <TextField
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search..."
        size="small"
        fullWidth
        
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
          endAdornment: (
            <>
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                searchQuery && (
                  <IconButton onClick={() => setSearchQuery("")} size="small">
                    <RxCross2 />
                  </IconButton>
                )
              )}
            </>
          ),
        }}
      />

      {/* Dropdown */}
      {searchQuery && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            bgcolor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: 2,
            mt: 1,
            zIndex: 10,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {/* Filter Tabs */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ p: 2, justifyContent: "center" }}
          >
            {["All", "Accounts", "Contacts"].map((type) => {
              const count = filteredOptions.filter(
                (opt) => type === "All" || opt.type === type
              ).length;

              return (
                <Box
                  key={type}
                  sx={{ display: "flex", gap: 1, alignItems: "center" }}
                >
                  <Typography
                    onClick={() => setFilterType(type)}
                    sx={{
                      fontWeight: filterType === type ? "bold" : "light",
                      cursor: "pointer",
                    }}
                  >
                    {type}
                  </Typography>
                  {count > 0 && (
                    <Chip
                      label={count}
                      size="small"
                      sx={{
                        backgroundColor: "#00ACC1",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>

          <Divider />

          {/* Results List */}
          {filteredOptions.length > 0 ? (
            <List>
              {filteredOptions.map((option) => (
                <ListItem
                  key={option.id}
                  button
                  onClick={() => {
                    if (option.type === "Accounts") {
                      navigate(
                        `/clients/accounts/accountsdash/overview/${option.id}`
                      );
                      setSearchQuery("");
                    } else {
                      handleClick(option.id);
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>{option.label.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={option.label}
                    secondary={option.subLabel}
                    primaryTypographyProps={{ fontWeight: "bold" }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ p: 2, color: "gray", textAlign: "center" }}>
              No results found
            </Typography>
          )}
        </Box>
      )}

      {/* Contact Edit Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 2,
            alignItems: "center",
            // width: 420,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Edit Contact
          </Typography>
          <IconButton onClick={handleCloseDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {selectedContact && (
          <ContactForm
            selectedContact={selectedContact}
            handleClose={handleCloseDrawer}
             onContactUpdated={handleContactUpdated}
          />
        )}
      </Drawer>
    </Box>
  );
};

export default SearchComponent;

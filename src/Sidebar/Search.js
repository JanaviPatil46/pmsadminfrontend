






import React, { useState,useEffect } from "react";
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
  Button,
  Drawer,
  Chip,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import ContactForm from "../Pages/UpdateContact"
import { useNavigate } from "react-router-dom";
const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [filterType, setFilterType] = useState("All"); // "All", "Accounts", "Contacts"
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const [contactData, setContactData] = useState([]);
  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (!query) {
      setOptions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch data from both APIs
      const [accountsResponse, contactsResponse] = await Promise.all([
        axios.get("https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true", {
          params: { search: query },
        }),
        axios.get("https://snptaxes.com/api/contacts/contact-names", {
          params: { search: query },
        }),
      ]);

      const accountsData = accountsResponse.data.accountlist || [];
      const contactsData = contactsResponse.data.data || [];
// console.log("Accounts Data:", accountsData);
console.log("Contacts Data:", contactsData);
      // Combine and map options
      const combinedOptions = [
        ...accountsData.map((account) => ({
          label: account.accountName,
          // subLabel: account.email || "No Email",
          type: "Accounts",
          id: account._id,
        })),
        ...contactsData.map((contact) => ({
          label: contact.contactName,
          subLabel: contact.email || "No Email",
          type: "Contacts",
          id: contact._id,
        })),
      ];

      setOptions(combinedOptions);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const filteredOptions =
  //   filterType === "All"
  //     ? options
  //     : options.filter((option) => option.type === filterType);

  const filteredOptions = options
  .filter((option) => {
    const labelMatch = option.label?.toLowerCase().includes(searchQuery.toLowerCase());
    const subLabelMatch = option.subLabel?.toLowerCase().includes(searchQuery.toLowerCase());
    return labelMatch || subLabelMatch;
  })
  .filter((option) => filterType === "All" || option.type === filterType);


  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer visibility
  const [selectedContact, setSelectedContact] = useState(null);
  // Handle fetching contact data when a contact option is clicked
  const handleClick = async (id) => {
      try {
          const url = `https://www.snptaxes.com/api/contacts/contact/${id}`;
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          setSelectedContact(data.contact);
          // console.log(data.contact); // Debug: Log the contact data
          selectedContacts();
          setIsDrawerOpen(true); // Open the drawer after setting the contact data
            // Clear the autocomplete input and options
    setSearchQuery(""); // Clear search query
    setOptions([]); // Clear options list
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  };
  // Effect for selected contact
  useEffect(() => {
      if (selectedContact) {
          selectedContacts();
      }
  }, [selectedContact]);

  const selectedContacts = () => {
      if (selectedContact) {
          console.log("Selected contact:", selectedContact);
          // You can add more functionality for when the contact is selected, like updating the UI
      }
  };

  // Close the drawer
  const handleCloseDrawer = () => {
      setIsDrawerOpen(false);
      setSelectedContact(null); // Optionally clear selected contact when closing the drawer
  };
  const fetchContacts = async () => {
    try {
        const response = await axios.get(`${CONTACT_API}/contacts/contactlist/list/`);
        setContactData(response.data.contactlist);
        // console.log(response.data.contactlist);
    } catch (error) {
        console.error("API Error:", error);
        // toast.error('Failed to fetch contacts');
    }
};
useEffect(() => {
    fetchContacts();
}, []);
const handleContactUpdated = () => {
    fetchContacts(); // Refetch contacts when updated
};
  return (
    <Box sx={{ position: "relative", width: 300, margin: "0 auto" }}>
      {/* Search Input */}
      <TextField
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search..."
        // variant="outlined"
        size="small"

        fullWidth
        // InputProps={{
        //   startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
        //   endAdornment: loading ? <CircularProgress size={20} /> : null,
        // }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
          endAdornment: (
            <>
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    sx={{ color: "gray" }}
                  >
                    <RxCross2  />
                  </IconButton>
                )
              )}
            </>
          ),
        }}
      />

      {/* Search Dropdown */}
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
          {/* Filter Buttons */}
          {/* <Stack direction="row" spacing={1} sx={{ p: 2, justifyContent: "center" }}>
            {["All", "Accounts", "Contacts"].map((type) => (
              <Typography
                key={type}
                onClick={() => setFilterType(type)}
                sx={{
                  fontWeight: filterType === type ? "bold" : "light",
                  cursor: "pointer",
                }}
              >
                {type} ({options.filter((opt) => opt.type === type || type === "All").length})
              </Typography>
            ))}
          </Stack> */}
          <Stack direction="row" spacing={1} sx={{ p: 2, justifyContent: "center" }}>
  {["All", "Accounts", "Contacts"].map((type) => {
    const count = options
      .filter((opt) => {
        const labelMatch = opt.label?.toLowerCase().includes(searchQuery.toLowerCase());
        const subLabelMatch = opt.subLabel?.toLowerCase().includes(searchQuery.toLowerCase());
        return labelMatch || subLabelMatch;
      })
      .filter((opt) => type === "All" || opt.type === type).length;

    return (
      <Box sx={{display:'flex', gap:1, alignItems:'center'}}>
      <Typography
        key={type}
        onClick={() => setFilterType(type)}
        sx={{
          fontWeight: filterType === type ? "bold" : "light",
          cursor: "pointer",
        }}
      >
        {type}  

      </Typography>
      {/* <Chip
      label={count}
      size="small"
      sx={{
        backgroundColor:  "#00ACC1" ,
        color: "white" ,
        fontWeight: "bold",
      }}
    /> */}
    {count > 0 && (
    <Chip
      label={count}
      size="small"
      sx={{
        backgroundColor: '#00ACC1',
        color: 'white',
        fontWeight: 'bold',
      }}
    />
  )}
    </Box>
    );
  })}
</Stack>

          <Divider />

          {filteredOptions.length > 0 ? (
            <>
              <List>
                {filteredOptions.map((option) => (
                  <ListItem
                    key={option.id}
                    button
                    // onClick={() => console.log(`Selected ${option.label}`)}
                    onClick={() => {
                      if (option.type === "Accounts") {
                        // Navigate to the Accounts dashboard
                        navigate(`/clients/accounts/accountsdash/overview/${option.id}`);
                        setSearchQuery("")
                      } else if (option.type === "Contacts") {
                        // Open the drawer
                        handleClick(option.id); // Function to handle opening the drawer
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

              {/* Global Search Link */}
              {/* <Box sx={{ p: 2, textAlign: "center" }}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => console.log("Global search clicked")}
                >
                  Global search
                </Button>
              </Box> */}
            </>
          ) : (
            <Typography sx={{ p: 2, color: "gray", textAlign: "center" }}>
              No results found
            </Typography>
          )}
        </Box>
      )}
                  <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={handleCloseDrawer}
                sx={{ width: 600 }}
            >
                {selectedContact && (
                    // <ContactForm
                    //     selectedContact={selectedContact}
                    //     // uniqueTags={uniqueTags}
                    //     // Pass additional props needed by ContactForm
                    //     handleTagChange={() => { }}
                    //     handlePhoneNumberChange={() => { }}
                    //     handleDeletePhoneNumber={() => { }}
                    //     handleAddPhoneNumber={() => { }}
                    //     handleCountryChange={() => { }}
                    //     sendingData={() => { }}
                    //     handleClose={() => setIsDrawerOpen(false)}
                    //     // isSmallScreen={isMobile}
                    //     onContactUpdated={handleContactUpdated}
                    // />
                    <ContactForm
                                  selectedContact={selectedContact}
                                  
                                  handleClose={() => setIsDrawerOpen(false)}
                                 
                                  onContactUpdated={handleContactUpdated}
                                />
                )}
            </Drawer>
    </Box>
  );
};

export default SearchComponent;

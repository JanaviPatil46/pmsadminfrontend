import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Menu,
  Chip,
  Typography,
  IconButton,
  Checkbox,
  ListItemText,
  ListItemIcon,CircularProgress
} from "@mui/material";
import { FaCaretUp, FaCaretDown, FaTimes } from "react-icons/fa";

const TeamMemberMultiSelectDropDown = ({
  value = [],
  onChange,
  placeholder = "Select team members",
  width = "100%",
  LOGIN_API
}) => {
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuWidth, setMenuWidth] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const formattedOptions = data.map(user => ({
          value: user._id,
          label: user.username 
        }));
        
        setOptions(formattedOptions);
        console.log("formattedOptions",formattedOptions)
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("Failed to load team members");
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [LOGIN_API]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (containerRef.current) {
      setMenuWidth(containerRef.current.offsetWidth);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery("");
  };

  const handleSelect = (selectedValue) => {
    if (!selectedValue) return;
    console.log("selectedValue",selectedValue)
    const selectedOption = options.find(option => 
      option && option.value === selectedValue
    );
    
    if (!selectedOption) return;

    const newValue = value.some(item => item && item.value === selectedValue)
      ? value.filter(item => item && item.value !== selectedValue)
      : [...value, selectedOption];
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value || '');
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange([]);
    }
  };

  const filteredOptions = options
    .filter(option => {
      const label = option?.label || '';
      const query = searchQuery || '';
      return label.toLowerCase().includes(query.toLowerCase());
    });

  return (
    <Box sx={{ width }}>
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "4px",
          cursor: "pointer",
          bgcolor: "background.paper",
          width: "100%",
          minHeight: "40px"
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, flex: 1 }}>
          {value && value.length > 0 ? (
            value.map((item) => {
              if (!item) return null;
              return (
                <Chip
                  key={item.value}
                  label={item.label || ''}
                  onDelete={() => handleSelect(item.value)}
                  size="small"
                  sx={{
                    backgroundColor: '#f0f0f0',
                    color: "text.primary",
                    fontWeight: 500,
                    borderRadius: "16px",
                    height: "28px",
                    cursor: "pointer",
                    "& .MuiChip-deleteIcon": {
                      color: "text.secondary",
                      opacity: 0.7,
                      transition: "opacity 0.2s",
                      "&:hover": { opacity: 1 },
                    },
                  }}
                />
              );
            })
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ pl: 1 }}>
              {placeholder}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {value && value.length > 0 && (
            <IconButton
              onClick={clearSelection}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <FaTimes />
            </IconButton>
          )}
          <IconButton size="small">
            {anchorEl ? <FaCaretUp /> : <FaCaretDown />}
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          style: {
            width: menuWidth || "auto",
            maxHeight: "250px",
          }
        }}
      >
        <Box sx={{ p: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            autoComplete="off"
            autoFocus
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography sx={{ p: 2, color: "error.main" }}>
            {error}
          </Typography>
        ) : filteredOptions && filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <Box
              key={option.value}
              sx={{
                display: "flex",
                alignItems: "center",
                p: "4px 8px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => handleSelect(option.value)}
            >
              <Checkbox
                checked={value.some(item => item && item.value === option.value)}
                size="small"
                sx={{ padding: "4px" }}
              />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {option.label || ''}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography sx={{ p: 2, color: "text.secondary" }}>
            No team members found
          </Typography>
        )}
      </Menu>
    </Box>
  );
};

export default TeamMemberMultiSelectDropDown;
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Menu,
  Chip,
  Typography,
  IconButton,
  Checkbox,
  Avatar
} from "@mui/material";
import { FaCaretUp, FaCaretDown, FaTimes } from "react-icons/fa";

const TagsMultiSelectDropDown = ({
  value = [],
  onChange,
  options = [],
  placeholder = "Select tags",
  width = "100%"
}) => {
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuWidth, setMenuWidth] = useState(null);

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
    
    const selectedOption = options.find(opt => opt.value === selectedValue);
    if (!selectedOption) return;

    const newValue = value.some(item => item.value === selectedValue)
      ? value.filter(item => item.value !== selectedValue)
      : [...value, selectedOption];
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange([]);
    }
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {value.length > 0 ? (
            value.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                onDelete={() => handleSelect(item.value)}
                size="small"
                sx={{
                  backgroundColor: item.colour,
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "10px",
                  borderRadius: "16px",
                  height: "20px",
                  cursor: "pointer",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                  "& .MuiChip-deleteIcon": {
                    color: "#fff",
                    opacity: 0.7,
                    transition: "opacity 0.2s",
                    "&:hover": { opacity: 1 },
                  },
                }}
              />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ pl: 1 }}>
              {placeholder}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {value.length > 0 && (
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
            placeholder="Search tags..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            autoComplete="off"
            autoFocus
          />
        </Box>

        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => {
            const isSelected = value.some(item => item.value === option.value);
            const dynamicWidth = Math.min(option.label.length * 8 + 16, 150);
            
            return (
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
                  checked={isSelected}
                  size="small"
                  sx={{ padding: "4px" }}
                />
                <Box
                  sx={{
                    backgroundColor: option.colour,
                    color: "#fff",
                    fontSize: "10px",
                    borderRadius: "10px",
                    margin: "0 5px",
                    padding: "4px 8px",
                    minWidth: `${dynamicWidth}px`,
                    textAlign: "center"
                  }}
                >
                  {option.label}
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography sx={{ p: 2, color: "text.secondary" }}>
            No tags found
          </Typography>
        )}
      </Menu>
    </Box>
  );
};

export default TagsMultiSelectDropDown;
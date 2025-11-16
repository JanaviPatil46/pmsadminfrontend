import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Menu,
  Chip,
  Typography,
  IconButton
} from "@mui/material";
import { FaCaretUp, FaCaretDown, FaTimes } from "react-icons/fa";

const TagsMultiSelectDropDown = ({
  value = [],
  onChange,
  options = [],
  placeholder = "Select tags",
}) => {
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuWidth, setMenuWidth] = useState(null);

  const handleClick = (event) => {
    if (options.length === 0) return; // prevent opening if empty
    setAnchorEl(event.currentTarget);
    if (containerRef.current) {
      setMenuWidth(containerRef.current.offsetWidth);
    }
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (selectedValue) => {
    const newValue = value.some((item) => item.value === selectedValue)
      ? value.filter((item) => item.value !== selectedValue)
      : [...value, options.find((option) => option.value === selectedValue)];

    onChange && onChange(newValue);
  };

  const clearSelection = () => onChange && onChange([]);

  const filteredOptions = options
    .filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((option) => !value.some((selected) => selected.value === option.value));

  return (
    <Box>
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          padding: "4px",
          cursor: "pointer",
          bgcolor: "background.paper",
          mt: 1,
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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
                  fontWeight: 550,
                  fontSize: "10px",
                  borderRadius: "16px",
                  height: "20px",
                  cursor: "pointer",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                  "& .MuiChip-deleteIcon": { color: "#fff" },
                }}
              />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              {placeholder}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {value.length > 0 && (
            <IconButton onClick={clearSelection} size="small" sx={{ color: "text.secondary" }}>
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
        PaperProps={{
          style: { width: menuWidth || "auto", maxHeight: "250px" },
        }}
      >
        <Box sx={{ p: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </Box>

        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <Box
              key={option.value}
              sx={{
                margin: "5px 10px",
                padding: "4px 8px",
                borderRadius: "10px",
                backgroundColor: option.colour,
                color: "#fff",
                cursor: "pointer",
                fontSize: "10px",
                width: "fit-content",
              }}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </Box>
          ))
        ) : (
          <Typography sx={{ p: 2, color: "gray" }}>No results found</Typography>
        )}
      </Menu>
    </Box>
  );
};

export default TagsMultiSelectDropDown;

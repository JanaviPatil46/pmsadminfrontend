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
    <div style={{ width }}>
      <div
        ref={containerRef}
        className="flex items-center justify-between border border-slate-200 rounded-lg px-2 py-1 cursor-pointer bg-white min-h-[38px] hover:border-slate-300 transition-colors"
        onClick={handleClick}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {value.length > 0 ? (
            value.map((item) => (
              <span
                key={item.value}
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium text-white cursor-pointer shadow-sm"
                style={{ backgroundColor: item.colour }}
              >
                {item.label}
                <button
                  onClick={(e) => { e.stopPropagation(); handleSelect(item.value); }}
                  className="ml-0.5 text-white/70 hover:text-white transition-opacity"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-400 pl-1">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-0.5 ml-1">
          {value.length > 0 && (
            <button onClick={clearSelection} className="p-0.5 text-slate-400 hover:text-slate-600 transition-colors">
              <FaTimes size={10} />
            </button>
          )}
          <span className="text-slate-400">
            {anchorEl ? <FaCaretUp size={12} /> : <FaCaretDown size={12} />}
          </span>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ style: { width: menuWidth || "auto", maxHeight: "250px", borderRadius: '8px' } }}
      >
        <div className="p-2">
          <TextField
            fullWidth size="small" placeholder="Search tags..." value={searchQuery}
            onChange={handleSearchChange} variant="outlined" autoComplete="off" autoFocus
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '13px' } }}
          />
        </div>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => {
            const isSelected = value.some(item => item.value === option.value);
            return (
              <div
                key={option.value}
                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleSelect(option.value)}
              >
                <Checkbox checked={isSelected} size="small" sx={{ padding: "2px" }} />
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                  style={{ backgroundColor: option.colour }}
                >
                  {option.label}
                </span>
              </div>
            );
          })
        ) : (
          <div className="px-3 py-4 text-center text-sm text-slate-400">No tags found</div>
        )}
      </Menu>
    </div>
  );
};

export default TagsMultiSelectDropDown;
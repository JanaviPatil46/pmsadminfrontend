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
    <div style={{ width }}>
      <div
        ref={containerRef}
        className="flex items-center justify-between border border-slate-200 rounded-lg px-2 py-1 cursor-pointer bg-white min-h-[38px] hover:border-slate-300 transition-colors"
        onClick={handleClick}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {value && value.length > 0 ? (
            value.map((item) => {
              if (!item) return null;
              return (
                <span
                  key={item.value}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {item.label || ''}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSelect(item.value); }}
                    className="ml-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-sm text-slate-400 pl-1">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-0.5 ml-1">
          {value && value.length > 0 && (
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
            fullWidth size="small" placeholder="Search team members..." value={searchQuery}
            onChange={handleSearchChange} variant="outlined" autoComplete="off" autoFocus
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '13px' } }}
          />
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <CircularProgress size={20} />
          </div>
        ) : error ? (
          <div className="px-3 py-4 text-center text-sm text-red-500">{error}</div>
        ) : filteredOptions && filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => handleSelect(option.value)}
            >
              <Checkbox
                checked={value.some(item => item && item.value === option.value)}
                size="small"
                sx={{ padding: "2px" }}
              />
              <span className="text-sm text-slate-700">{option.label || ''}</span>
            </div>
          ))
        ) : (
          <div className="px-3 py-4 text-center text-sm text-slate-400">No team members found</div>
        )}
      </Menu>
    </div>
  );
};

export default TeamMemberMultiSelectDropDown;
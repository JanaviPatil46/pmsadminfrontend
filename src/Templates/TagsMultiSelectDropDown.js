import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const TagsMultiSelectDropDown = ({
  value = [],
  onChange,
  options: propOptions,
  placeholder = "Select tags",
}) => {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuWidth, setMenuWidth] = useState(null);
  const [internalOptions, setInternalOptions] = useState([]);

  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const options = propOptions || internalOptions;

  useEffect(() => {
    if (!propOptions) {
      const fetchData = async () => {
        try {
          const response = await fetch(`${TAGS_API}/tags/`);
          const data = await response.json();
          setInternalOptions(
            data.tags.map((tag) => ({
              value: tag._id,
              label: tag.tagName,
              colour: tag.tagColour,
            }))
          );
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      };
      fetchData();
    }
  }, [TAGS_API, propOptions]);

  const handleToggle = () => {
    if (!open && containerRef.current) {
      setMenuWidth(containerRef.current.offsetWidth);
    }
    setOpen((prev) => !prev);
    setSearchQuery("");
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
  };

  const handleSelect = (selectedValue) => {
    const isSelected = value.some((item) => item.value === selectedValue);
    const newValue = isSelected
      ? value.filter((item) => item.value !== selectedValue)
      : [...value, options.find((opt) => opt.value === selectedValue)];
    onChange?.(newValue);
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onChange?.([]);
  };

  const filteredOptions = options
    .filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((opt) => !value.some((sel) => sel.value === opt.value));

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <div
        onClick={handleToggle}
        className="flex min-h-[38px] w-full cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-sm transition-all duration-150 hover:border-ring focus-within:border-ring focus-within:ring-1 focus-within:ring-ring"
      >
        <div className="flex flex-1 flex-wrap gap-1.5">
          {value.length > 0 ? (
            value.map((item) => {
              const opt = options.find((o) => o.value === item.value);
              return (
                <span
                  key={item.value}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: opt?.colour || "#6b7280" }}
                >
                  {item.label}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleSelect(item.value); }}
                    className="rounded-full opacity-70 hover:opacity-100 focus:outline-none"
                    aria-label={`Remove ${item.label}`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
          {value.length > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="rounded p-0.5 transition-colors hover:text-foreground focus:outline-none"
              aria-label="Clear all tags"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={handleClose} />
          <div
            className="absolute left-0 top-full z-40 mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
            style={{ width: menuWidth || "100%", maxHeight: 260 }}
          >
            {/* Search */}
            <div className="border-b border-border px-2 py-1.5">
              <input
                type="text"
                autoFocus
                placeholder="Search tags..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
              />
            </div>
            {/* Options */}
            <div className="overflow-y-auto" style={{ maxHeight: 210 }}>
              {filteredOptions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 p-2">
                  {filteredOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                      style={{ backgroundColor: opt.colour || "#6b7280" }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-4 text-center text-xs text-muted-foreground">No tags found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TagsMultiSelectDropDown;


// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   TextField,
//   Menu,
//   Chip,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import { FaCaretUp, FaCaretDown, FaTimes } from "react-icons/fa";

// const TagsMultiSelectDropDown = ({
//   value = [],
//   onChange,
//   options: propOptions,
//   placeholder = "Select tags",
//   // width = "100%"
// }) => {
//   const containerRef = useRef(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [menuWidth, setMenuWidth] = useState(null);
//   const [internalOptions, setInternalOptions] = useState([]);
//   const [initialized, setInitialized] = useState(false);

//   const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
//   const DEFAULT_TAG_ID = "6964e4aad86be801d99de568";

//   // Determine if using internal or external options
//   const options = propOptions || internalOptions;

//   useEffect(() => {
//     // Only fetch data if no options prop provided
//     if (!propOptions) {
//       const fetchData = async () => {
//         try {
//           const url = `${TAGS_API}/tags/`;
//           const response = await fetch(url);
//           const data = await response.json();
//           const formattedOptions = data.tags.map((tag) => ({
//             value: tag._id,
//             label: tag.tagName,
//             colour: tag.tagColour,
//           }));
          
//           setInternalOptions(formattedOptions);

//           // Set default value if no value is provided and we haven't initialized yet
//           if (!initialized && value.length === 0 && onChange) {
//             const defaultTag = formattedOptions.find(
//               (option) => option.value === DEFAULT_TAG_ID
//             );
            
//             if (defaultTag) {
//               onChange([defaultTag]);
//               setInitialized(true);
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
//       };
//       fetchData();
//     }
//   }, [TAGS_API, propOptions, value.length, onChange, initialized]);

//   // Alternative approach: Initialize default value once when component mounts
//   useEffect(() => {
//     // Set default value if no value prop is provided
//     if (!initialized && value.length === 0 && onChange && options.length > 0) {
//       const defaultTag = options.find(
//         (option) => option.value === DEFAULT_TAG_ID
//       );
      
//       if (defaultTag) {
//         onChange([defaultTag]);
//         setInitialized(true);
//       }
//     }
//   }, [options, value.length, onChange, initialized]);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//     if (containerRef.current) {
//       setMenuWidth(containerRef.current.offsetWidth);
//     }
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelect = (selectedValue) => {
//     const newValue = value.some((item) => item.value === selectedValue)
//       ? value.filter((item) => item.value !== selectedValue)
//       : [...value, options.find((option) => option.value === selectedValue)];

//     if (onChange) {
//       onChange(newValue);
//     }
//   };

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const clearSelection = () => {
//     if (onChange) {
//       onChange([]);
//     }
//   };

//   const filteredOptions = options
//     .filter((option) =>
//       option.label.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .filter(
//       (option) => !value.some((selected) => selected.value === option.value)
//     );

//   return (
//     <Box>
//       <Box
//         ref={containerRef}
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           border: "1px solid #ccc",
//           padding: "4px",
//           cursor: "pointer",
//           bgcolor: "background.paper",
//           mt: 2,
//         }}
//         onClick={handleClick}
//       >
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//           {value.length > 0 ? (
//             value.map((item) => {
//               const selectedOption = options.find(
//                 (option) => option.value === item.value
//               );
//               return (
//                 <Chip
//                   key={item.value}
//                   label={item.label}
//                   onDelete={() => handleSelect(item.value)}
//                   size="small"
//                   sx={{
//                     backgroundColor: selectedOption?.colour,
//                     color: "#fff",
//                     fontWeight: 550,
//                     fontSize: "10px",
//                     borderRadius: "16px",
//                     height: "20px",
//                     cursor: "pointer",
//                     boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
//                     "& .MuiChip-deleteIcon": {
//                       color: "#fff",
//                       opacity: 0.7,
//                       transition: "opacity 0.2s",
//                       "&:hover": { opacity: 1 },
//                     },
//                   }}
//                 />
//               );
//             })
//           ) : (
//             <Typography variant="body2" color="textSecondary">
//               {placeholder}
//             </Typography>
//           )}
//         </Box>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           {value.length > 0 && (
//             <IconButton
//               onClick={clearSelection}
//               size="small"
//               sx={{ color: "text.secondary" }}
//             >
//               <FaTimes />
//             </IconButton>
//           )}
//           <IconButton size="small">
//             {anchorEl ? <FaCaretUp /> : <FaCaretDown />}
//           </IconButton>
//         </Box>
//       </Box>

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "left" }}
//         PaperProps={{
//           style: {
//             width: menuWidth || "auto",
//             maxHeight: "250px",
//           },
//         }}
//       >
//         <Box sx={{ p: 1 }}>
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             variant="outlined"
//             autoComplete="off"
//             autoFocus
//           />
//         </Box>

//         {filteredOptions.length > 0 ? (
//           filteredOptions.map((option) => (
//             <Box
//               key={option.value}
//               sx={{
//                 color: "#fff",
//                 fontSize: "10px",
//                 borderRadius: "10px",
//                 margin: "5px 10px",
//                 display: "flex",
//                 width: "fit-content",
//                 backgroundColor: option.colour,
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: "4px 8px",
//                 cursor: "pointer",
//                 whiteSpace: "nowrap",
//               }}
//               onClick={() => handleSelect(option.value)}
//             >
//               <Typography sx={{ fontSize: "inherit" }}>
//                 {option.label}
//               </Typography>
//             </Box>
//           ))
//         ) : (
//           <Typography sx={{ p: 2, color: "gray" }}>No results found</Typography>
//         )}
//       </Menu>
//     </Box>
//   );
// };

// export default TagsMultiSelectDropDown;
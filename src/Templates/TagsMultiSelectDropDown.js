import React, { useState, useEffect, useRef } from "react";
import { FaCaretUp, FaCaretDown, FaTimes } from "react-icons/fa";

const TagsMultiSelectDropDown = ({
  value = [],
  onChange,
  options: propOptions,
  placeholder = "Select tags",
  // width = "100%"
}) => {
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuWidth, setMenuWidth] = useState(null);
  const [internalOptions, setInternalOptions] = useState([]);

  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;

  // Determine if using internal or external options
  const options = propOptions || internalOptions;

  useEffect(() => {
    // Only fetch data if no options prop provided
    if (!propOptions) {
      const fetchData = async () => {
        try {
          const url = `${TAGS_API}/tags/`;
          const response = await fetch(url);
          const data = await response.json();
          setInternalOptions(
            data.tags.map((tag) => ({
              value: tag._id,
              label: tag.tagName,
              colour: tag.tagColour,
            }))
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [TAGS_API, propOptions]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (containerRef.current) {
      setMenuWidth(containerRef.current.offsetWidth);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (selectedValue) => {
    const newValue = value.some((item) => item.value === selectedValue)
      ? value.filter((item) => item.value !== selectedValue)
      : [...value, options.find((option) => option.value === selectedValue)];

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSelection = () => {
    if (onChange) {
      onChange([]);
    }
  };

  //   const filteredOptions = options.filter((option) =>
  //     option.label.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  const filteredOptions = options
    .filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (option) => !value.some((selected) => selected.value === option.value)
    );
  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex items-center justify-between border border-gray-300 px-1.5 py-1 cursor-pointer bg-white mt-2 min-h-[30px]"
        onClick={handleClick}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {value.length > 0 ? (
            value.map((item) => {
              const selectedOption = options.find(o => o.value === item.value);
              return (
                <span key={item.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white shadow-sm"
                  style={{ backgroundColor: selectedOption?.colour }}>
                  {item.label}
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleSelect(item.value); }} className="opacity-70 hover:opacity-100"><FaTimes size={8}/></button>
                </span>
              );
            })
          ) : (
            <span className="text-xs text-gray-400">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center">
          {value.length > 0 && (
            <button type="button" onClick={(e) => { e.stopPropagation(); clearSelection(); }} className="text-gray-400 hover:text-gray-600 p-0.5"><FaTimes size={10}/></button>
          )}
          <button type="button" className="text-gray-400 p-0.5">{anchorEl ? <FaCaretUp size={12}/> : <FaCaretDown size={12}/>}</button>
        </div>
      </div>

      {Boolean(anchorEl) && (
        <>
          <div className="fixed inset-0 z-30" onClick={handleClose} />
          <div className="absolute top-full left-0 z-40 bg-white border border-gray-200 rounded shadow-lg overflow-y-auto"
            style={{ width: menuWidth || "auto", maxHeight: 250 }}>
            <div className="p-1">
              <input type="text" autoFocus placeholder="Search..."
                className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={searchQuery} onChange={handleSearchChange} autoComplete="off" />
            </div>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div key={option.value}
                  className="mx-2.5 my-1 px-2 py-1 rounded-lg text-[10px] text-white cursor-pointer whitespace-nowrap w-fit"
                  style={{ backgroundColor: option.colour }}
                  onClick={() => handleSelect(option.value)}>
                  {option.label}
                </div>
              ))
            ) : (
              <p className="px-3 py-2 text-xs text-gray-400">No results found</p>
            )}
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
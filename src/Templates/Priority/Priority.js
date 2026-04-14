

import React from "react";

// const Priority = ({ onPriorityChange, selectedPriority }) => {
//   const options = [
//     { value: "Urgent", label: "Urgent", color: "#0E0402" },
//     { value: "High", label: "High", color: "#fe676e" },
//     { value: "Medium", label: "Medium", color: "#FFC300" },
//     { value: "Low", label: "Low", color: "#56c288" },
//   ];

//   const handleChange = (event) => {
//     onPriorityChange(event.target.value);
//     console.log("handleChange", event.target.value);
//   };
//   const ITEM_HEIGHT = 48;
//   const ITEM_PADDING_TOP = 8;
//   const MenuProps = {
//     PaperProps: {
//       style: {
//         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//         width: "auto",
//       },
//     },
//   };
//   const calculateWidth = (label) => {
//     const textWidth = label.length * 9;
//     return Math.min(textWidth, 220);
//   };
//   return (
//     <Box>
//       <InputLabel sx={{ color: "black", mb: 2 }}>Priority</InputLabel>
//       <FormControl fullWidth>
//         <Select
//           size="small"
//           value={selectedPriority || ""}
//           onChange={handleChange}
//           displayEmpty
//           renderValue={(selected) => {
//             const selectedOption = options.find(
//               (option) => option.value === selected
//             );
//             return selectedOption ? (
//               <Chip
//                 label={selectedOption.label}
//                 sx={{
//                   backgroundColor: selectedOption.color,
//                   color: "#fff",
//                   fontWeight: 500,
//                   fontSize: "10px",
//                   borderRadius: "16px",
//                   height: "20px",
//                   cursor: "pointer",
//                   boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
//                   "& .MuiChip-deleteIcon": {
//                     color: "#fff",
//                     opacity: 0.7,
//                     transition: "opacity 0.2s",
//                     "&:hover": { opacity: 1 },
//                   },
//                 }}
//               />
//             ) : null;
//           }}
//           MenuProps={MenuProps}
//           sx={{
//             borderRadius: "10px",
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "10px",
//             },
//           }}
//         >
//           {options.map((option) => (
//             <MenuItem
//               key={option.value}
//               value={option.value}
//               sx={{
//                 backgroundColor: option.color,
//                 color: "#fff",
//                 fontSize: "10px",
//                 borderRadius: "10px",
//                 margin: "5px",
//                 textAlign: "center",
//                 display: "flex",
//                 justifyContent: "center",
//                 padding: "4px 9px",
//                 whiteSpace: "nowrap",
//                 width: `${calculateWidth(option.label)}px`,
//                 "&:hover": {
//                   backgroundColor: option.color,
//                   color: "#fff",
//                 },
//               }}
//             >
//               {option.label}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </Box>
//   );
// };
const Priority = ({ onPriorityChange, selectedPriority }) => {
  const options = [
    { value: "Urgent", label: "Urgent", color: "#0E0402" },
    { value: "High", label: "High", color: "#fe676e" },
    { value: "Medium", label: "Medium", color: "#FFC300" },
    { value: "Low", label: "Low", color: "#56c288" },
  ];

  const handleChange = (event) => {
    onPriorityChange(event.target.value);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: "auto",
      },
    },
  };

  const selectedOption = options.find((opt) => opt.value === (selectedPriority || ""));

  return (
    <div>
      <label className="block text-xs text-black font-medium mb-1">Priority</label>
      <div className="relative">
        <select
          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 appearance-none"
          value={selectedPriority || ""}
          onChange={handleChange}
        >
          <option value="">— select priority —</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {selectedOption && (
          <span
            className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none px-2 py-0.5 rounded-full text-[10px] font-medium text-white shadow"
            style={{ backgroundColor: selectedOption.color }}>
            {selectedOption.label}
          </span>
        )}
      </div>
    </div>
  );
};

export default Priority;

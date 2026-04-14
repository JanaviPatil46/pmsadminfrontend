// import React from "react";
// import Select from "react-select";

// const Status = ({onStatusChange, selectedStatus}) => {


//   const options = [
//     { value: "No status", label: "No status", color: "#C4AEAD" },
//     { value: "Planned", label: "Planned", color: "#4169E1" },
//     { value: "In review", label: "In review", color: "#F6BE00" },
//     { value: "In progress", label: "In progress", color: "#F6BE00" },
//     { value: "On hold", label: "On hold", color: "#BCC6CC" },
//     { value: "Extended", label: "Extended", color: "#82CAFF" },
//     { value: "Waiting for Client", label: "Waiting for Client", color: "#566D7E" },
//     { value: "Waiting for Signatures", label: "Waiting for Signatures", color: "#566D7E" },
//     { value: "Waiting for agency", label: "Waiting for agency", color: "#566D7E" },
//     { value: "Completed", label: "Completed", color: "#00FF00" },
//     { value: "Canceled", label: "Canceled", color: "#EB5406" },

//   ];

//   const calculateWidth = (label) => {
//     const textWidth = label.length * 9;
//     return Math.min(textWidth, 220);
//   };

//   const colorStyles = {
//     control: (styles) => ({ ...styles, backgroundColor: "white" }),
  
//     option: (styles, { data }) => ({
//       ...styles,
//       backgroundColor: data.color,
//       color: "#fff",
//       borderRadius: "15px",
//       textAlign: "center",
//       padding: "2px,8px",
//       margin: "7px",
//       fontSize: "10px",
//       fontWeight: "bold",
//       width: `${calculateWidth(data.label)}px`, // Fix here
//     }),
  
//     singleValue: (styles, { data }) => ({
//       ...styles,
//       backgroundColor: data.color,
//       color: "#fff",
//       borderRadius: "15px",
//       width: `${calculateWidth(data.label) + 20}px`, // Fix here
//       overflow: "hidden",
//       textOverflow: "ellipsis",
//       textAlign: "center",
//     }),
  
//     singleValueLabel: (styles, { data }) => ({
//       ...styles,
//       backgroundColor: data.color,
//       color: "#fff",
//       borderRadius: "15px",
//       textAlign: "center",
//       fontSize: "12px",
//     }),
//   };
  
//   const handleChange = (selectedOption) => {
//     onStatusChange(selectedOption);
//     console.log("handleChange", selectedOption);
//   };

//   return (
//     <div>
//    <label  className="priority-custom-label">Status</label>
//    <div style={{marginTop:'10px'}}>
//    <Select options={options} 
//     onChange={handleChange} 
//     styles={colorStyles} 
//     value = {options.find(option => option.value === selectedStatus)}
//     isSearchable // Enable search
//     isClearable
//     />
//    </div>
    
//     </div>
 
    
//   );
// };

// export default Status;


import React from "react";

const Status = ({ onStatusChange, selectedStatus }) => {
  const options = [
    { value: "No status", label: "No status", color: "#C4AEAD" },
    { value: "Planned", label: "Planned", color: "#4169E1" },
    { value: "In review", label: "In review", color: "#F6BE00" },
    { value: "In progress", label: "In progress", color: "#F6BE00" },
    { value: "On hold", label: "On hold", color: "#BCC6CC" },
    { value: "Extended", label: "Extended", color: "#82CAFF" },
    { value: "Waiting for Client", label: "Waiting for Client", color: "#566D7E" },
    { value: "Waiting for Signatures", label: "Waiting for Signatures", color: "#566D7E" },
    { value: "Waiting for agency", label: "Waiting for agency", color: "#566D7E" },
    { value: "Completed", label: "Completed", color: "#00FF00" },
    { value: "Canceled", label: "Canceled", color: "#EB5406" },
  ];

  const handleChange = (event) => {
    onStatusChange(event.target.value);
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
  }

  const selectedOption = options.find((opt) => opt.value === selectedStatus);

  return (
    <div>
      <label className="block text-xs text-black font-medium mb-1">Status</label>
      <div className="relative">
        <select
          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 appearance-none"
          value={selectedStatus || ""}
          onChange={handleChange}
        >
          <option value="">— select status —</option>
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

export default Status;

// import { Box, Typography } from "@mui/material";
// import React,{useState} from "react";
// import { NavLink, Outlet } from "react-router-dom";
// const Accounts = () => {
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
  
//   // Create a function that child components can call to refresh data
//   const refreshAccountsData = () => {
//     setRefreshTrigger(prev => prev + 1);
//   };
//   return (
//     <>
//       <Box >
//         <Typography variant="h4" gutterBottom={"10px"}>Accounts</Typography>
//       </Box>

      
// <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         backgroundColor: "#EBF0F5", // Light grayish-blue background
//         borderRadius: "12px",
//         padding: "6px",
//       width:'max-content'
//       }}
//     >
//       <NavLink
//         to="/clients/accounts/activeaccounts"
//         style={({ isActive }) => ({
//           padding: "8px 16px",
//           borderRadius: "10px",
//           fontSize: "15px",
//           cursor: "pointer",
//           textDecoration: "none",
//           fontWeight: isActive ? "bold" : "normal",
//           color: isActive ? "var(--color-save-btn)" : "#333",
//           backgroundColor: isActive ? "#fff" : "transparent",
//           transition: "all 0.3s ease",
//         })}
//       >
//         Active
//       </NavLink>
//       <NavLink
//         to="/clients/accounts/archivedaccounts"
//         style={({ isActive }) => ({
//           padding: "8px 16px",
//           borderRadius: "10px",
//           fontSize: "15px",
//           cursor: "pointer",
//           textDecoration: "none",
//           fontWeight: isActive ? "bold" : "normal",
//           color: isActive ? "var(--color-save-btn)" : "#333",
//           backgroundColor: isActive ? "#fff" : "transparent",
//           transition: "all 0.3s ease",
//         })}
//       >
//         Archived
//       </NavLink>
      
//     </Box>
 

//       <Box mt={2}>
//         {/* <Outlet /> */}
//         <Outlet context={{ refreshAccountsData, refreshTrigger }} />
//       </Box>
//     </>
//   );
// };

// export default Accounts;

import { Box, Typography } from "@mui/material";
import React, { useState, useCallback } from "react";
import { NavLink, Outlet } from "react-router-dom";

const Accounts = () => {
  const [refreshCount, setRefreshCount] = useState(0);
  
  // Use useCallback to memoize the refresh function
  const refreshAccountsData = useCallback(() => {
    setRefreshCount(prev => prev + 1);
  }, []);

  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom={"10px"}>Accounts</Typography>
      </Box>

      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#EBF0F5",
          borderRadius: "12px",
          padding: "6px",
          width: 'max-content'
        }}
      >
        <NavLink
          to="/clients/accounts/activeaccounts"
          style={({ isActive }) => ({
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "15px",
            cursor: "pointer",
            textDecoration: "none",
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "var(--color-save-btn)" : "#333",
            backgroundColor: isActive ? "#fff" : "transparent",
            transition: "all 0.3s ease",
          })}
        >
          Active
        </NavLink>
        <NavLink
          to="/clients/accounts/archivedaccounts"
          style={({ isActive }) => ({
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "15px",
            cursor: "pointer",
            textDecoration: "none",
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "var(--color-save-btn)" : "#333",
            backgroundColor: isActive ? "#fff" : "transparent",
            transition: "all 0.3s ease",
          })}
        >
          Archived
        </NavLink>
      </Box> */}

      <Box mt={2}>
        <Outlet context={{ refreshAccountsData, refreshCount }} />
      </Box>
    </>
  );
};

export default Accounts;
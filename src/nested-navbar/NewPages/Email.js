// // import React from 'react'
// // import { NavLink, Outlet } from 'react-router-dom'
// // import { Box, } from '@mui/material'
// // import { useParams } from "react-router-dom";
// // const Email = () => {
// //    const { data } =  useParams();
// //    console.log(data)
// //   return (
   
// //     <Box >

// //       <Box className="firmtemp" >
// //         <Box className="firmtemp-nav" sx={{
// //           display: 'flex',

// //           mt: 5,
// //           flexWrap: 'wrap', // Allow items to wrap to the next line if they overflow
// //          gap:2 ,// Space out items evenly
// //           '& a': { // Styling for the NavLink components
// //             textDecoration: 'none',
// //             padding: '8px 16px',
// //             borderRadius: '4px',
// //             // color: 'primary.main',
// //             '&:hover': {
// //               backgroundColor: "var(--color-save-btn)",
// //               color: 'white'
// //             },
// //             '&.active': {
// //               backgroundColor: "var(--color-save-btn)",
// //               color: 'white'
// //             }
// //           }
// //         }}>
// //           <NavLink to={`/clients/accounts/accountsdash/email/${data}/inbox`}>Inbox</NavLink>
// //           <NavLink to={`/clients/accounts/accountsdash/email/${data}/sent`} >Sent</NavLink>
// //         </Box>

// //       </Box>
// //       <Box> <hr /></Box>
// //       <Box mt={2} ><Outlet /></Box>
// //     </Box>
// //   )
// // }

// // export default Email

// import React from 'react'
// import { Box, List, ListItemButton, Typography } from "@mui/material";
// import { Link, Outlet } from "react-router-dom";
// const Email = () => {
//   return (
//     <Box sx={{ display: "flex", height: "90vh" }}>
//       {/* Sidebar */}
//       <Box sx={{ width: 220, borderRight: "1px solid #ddd", p: 1 }}>
//         <List>
//           <ListItemButton component={Link} to="inbox">
//             Inbox
//           </ListItemButton>

//           <ListItemButton component={Link} to="sent">
//             Sent
//           </ListItemButton>
//         </List>
//       </Box>

//       {/* Main Area */}
//       <Box sx={{ flex: 1 }}>
//         <Outlet />
//       </Box>
//     </Box>
//   )
// }

// export default Email

import { Box, List, ListItemButton, Typography,Badge } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
const EmailLayout = () => {

  const location = useLocation();
const unreadInbox = location.state?.unreadCount || 0;

  return (
    <Box sx={{ display: "flex", mt:2}}>
      {/* Sidebar */}
      <Box sx={{ width: 220,  p: 1 }}>
        <List>

          {/* INBOX */}
          {/* <ListItemButton
            component={NavLink}
            to="inbox"
            sx={{
              "&.active": {
                bgcolor: "#e3f2fd",
                fontWeight: "bold",
                color: "#1976d2",
              },
            }}
          >
            Inbox 

          </ListItemButton> */}
          <ListItemButton
  component={NavLink}
  to="inbox"
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 2,
    py: 1,
    borderRadius: 2,

    "&.active": {
      bgcolor: "#e3f2fd",
      fontWeight: "bold",
      color: "#1976d2",
    },
  }}
>
  <Typography sx={{ fontWeight: "inherit" }}>
    Inbox
  </Typography>

  {unreadInbox > 0 && (
    <Badge
      badgeContent={unreadInbox}
      color="primary"
      sx={{
        "& .MuiBadge-badge": {
          fontSize: "0.75rem",
          minWidth: 20,
          height: 20,
        },
      }}
    />
  )}
</ListItemButton>


          {/* SENT */}
          <ListItemButton
            component={NavLink}
            to="sent"
            sx={{
              "&.active": {
                bgcolor: "#e3f2fd",
                fontWeight: "bold",
                color: "#1976d2",
              },
            }}
          >
            Sent
          </ListItemButton>

        </List>
      </Box>

      {/* Main Area */}
      <Box sx={{ flex: 1 }}>
        {/* <Outlet /> */}
        <Outlet context={{ unreadCount: 0 }} />

      </Box>
    </Box>
  );
};

export default EmailLayout;

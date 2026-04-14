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

import { NavLink, Outlet, useLocation } from "react-router-dom";
const EmailLayout = () => {

  const location = useLocation();
const unreadInbox = location.state?.unreadCount || 0;

  const navCls = ({ isActive }) =>
    `flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive ? 'bg-blue-50 font-bold text-blue-600' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="flex mt-2">
      {/* Sidebar */}
      <div className="w-[220px] p-1 shrink-0">
        <NavLink to="inbox" className={navCls}>
          <span>Inbox</span>
          {unreadInbox > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-blue-500 text-white text-xs font-medium">
              {unreadInbox}
            </span>
          )}
        </NavLink>
        <NavLink to="sent" className={navCls}>
          <span>Sent</span>
        </NavLink>
      </div>

      {/* Main Area */}
      <div className="flex-1">
        <Outlet context={{ unreadCount: 0 }} />
      </div>
    </div>
  );
};

export default EmailLayout;

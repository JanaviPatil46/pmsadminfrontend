import { Box, List, ListItemButton, Typography } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

const EmailLayout = () => {
  return (
    <Box sx={{ display: "flex", height: "90vh" }}>
      {/* Sidebar */}
      <Box sx={{ width: 220, borderRight: "1px solid #ddd", p: 1 }}>
        <List>
          <ListItemButton component={Link} to="inbox">
            Inbox
          </ListItemButton>

          <ListItemButton component={Link} to="sent">
            Sent
          </ListItemButton>
        </List>
      </Box>

      {/* Main Area */}
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default EmailLayout;

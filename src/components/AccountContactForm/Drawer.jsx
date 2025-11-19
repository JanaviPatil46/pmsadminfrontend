import React from "react";
import { Box, Typography } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import AccountContactForm from "../../AccountContactForm/AccountContactForm"
const Drawer = ({ handleNewDrawerClose, handleDrawerClose ,editingAccountId,onClose}) => {

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid grey",
        }}
      >
        {/* <Typography variant="h6">New Account</Typography> */}
        
        <Typography variant="h6">
          {editingAccountId ? "Edit Account" : "New Account"}
        </Typography>
        <RxCross2
          style={{ cursor: "pointer" }}
          onClick={handleNewDrawerClose}
        />
      </Box>
      <Box>
       <AccountContactForm handleDrawerClose={handleDrawerClose} handleNewDrawerClose={handleNewDrawerClose} editingAccountId={editingAccountId} />
      </Box>
    </>
  );
};

export default Drawer;

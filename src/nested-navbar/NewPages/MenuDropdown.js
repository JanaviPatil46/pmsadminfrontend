import React ,{useState}from 'react'
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
const MenuDropdown = ({ contact, onUnlink, onResetPassword }) => {
    const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUnlinkClick = () => {
    onUnlink(contact);
    handleClose();
  };

  const handleResetPasswordClick = () => {
    onResetPassword(contact);
    handleClose();
  };

  return (
    <>
     <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 1 }}
      >
        <MoreVertIcon />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 160,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleUnlinkClick}>
          <ListItemIcon>
            <LinkOffIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Unlink" primaryTypographyProps={{ color: 'error' }} />
        </MenuItem>
        
        <MenuItem onClick={handleResetPasswordClick} disabled={!contact.canLogin}>
          <ListItemIcon>
            <VpnKeyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Reset Password" />
        </MenuItem>
      </Menu></>
  )
}

export default MenuDropdown



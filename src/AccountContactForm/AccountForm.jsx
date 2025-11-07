

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccountData } from "../redux/accountContactSlice";
import { Box, Button, TextField, MenuItem, Typography } from "@mui/material";

// export default function AccountForm({ onContinue }) {
//   const dispatch = useDispatch();
//   const { accountData } = useSelector((state) => state.accountContact);

//   const handleChange = (e) => {
//     dispatch(setAccountData({ [e.target.name]: e.target.value }));
//   };

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         Account Form
//       </Typography>

//       <TextField
//         fullWidth
//         margin="normal"
//         label="Account Name"
//         name="accountName"
//         value={accountData.accountName}
//         onChange={handleChange}
//       />

//       <TextField
//         select
//         fullWidth
//         margin="normal"
//         label="Client Type"
//         name="clientType"
//         value={accountData.clientType}
//         onChange={handleChange}
//       >
//         <MenuItem value="Individual">Individual</MenuItem>
//         <MenuItem value="Company">Company</MenuItem>
//       </TextField>

//       {accountData.clientType === "Company" && (
//         <TextField
//           fullWidth
//           margin="normal"
//           label="Company Name"
//           name="companyName"
//           value={accountData.companyName}
//           onChange={handleChange}
//         />
//       )}

//       <Button variant="contained" sx={{ mt: 2 }} onClick={onContinue}>
//         Continue
//       </Button>
//     </Box>
//   );
// }

export default function AccountForm({ onContinue }) {
  const dispatch = useDispatch();
  const { accountData } = useSelector((state) => state.accountContact);

  const handleChange = (e) => {
    dispatch(setAccountData({ [e.target.name]: e.target.value }));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Account Form
      </Typography>
      <TextField
        fullWidth margin="normal" label="Account Name" name="accountName"
        value={accountData.accountName} onChange={handleChange}
      />
      <TextField
        select fullWidth margin="normal" label="Client Type" name="clientType"
        value={accountData.clientType} onChange={handleChange}
      >
        <MenuItem value="Individual">Individual</MenuItem>
        <MenuItem value="Company">Company</MenuItem>
      </TextField>
      {accountData.clientType === "Company" && (
        <TextField
          fullWidth margin="normal" label="Company Name" name="companyName"
          value={accountData.companyName} onChange={handleChange}
        />
      )}
      <Button variant="contained" sx={{ mt: 2 }} onClick={onContinue}>
        Continue
      </Button>
    </Box>
  );
}
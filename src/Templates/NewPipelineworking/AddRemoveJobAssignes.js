import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import UsersMultiSelectDropDown from "../UsersMultiSelectDropDown";

const AddRemoveJobAssignes = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

  const [users, setUsers] = useState([]);
  const [addAssignes, setAddAssignes] = useState([]);
  const [removeAssignes, setRemoveAssignes] = useState([]);

  // Fetch Users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
        const response = await fetch(url);
        const data = await response.json();

        const userOptions = data.map((u) => ({
          value: u._id,
          label: `${u.firstname} ${u.lastname}`,
          email: u.email,
        }));

        setUsers(userOptions);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [LOGIN_API]);

  // Mutually exclusive options
  const addAssigneeOptions = users.filter(
    (u) => !removeAssignes.some((r) => r.value === u.value)
  );

  const removeAssigneeOptions = users.filter(
    (u) => !addAssignes.some((a) => a.value === u.value)
  );

  return (
    <Box>
      <Typography fontWeight={600} mt={1}>Add Job Assignes</Typography>
      <UsersMultiSelectDropDown
        value={addAssignes}
        onChange={setAddAssignes}
        options={addAssigneeOptions}
        placeholder="Select assignes to ADD"
        withCheckbox
      />

      <Typography fontWeight={600} mt={3}>Remove Job Assignes</Typography>
      <UsersMultiSelectDropDown
        value={removeAssignes}
        onChange={setRemoveAssignes}
        options={removeAssigneeOptions}
        placeholder="Select assignes to REMOVE"
        withCheckbox
      />
    </Box>
  );
};

export default AddRemoveJobAssignes;



import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Stack,
  Link,
  Button,
  Checkbox,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountContactDrawer from "./AccountContactDrawer";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const AccountTable = () => {
  const [accountList, setAccountList] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("accountName");
  const navigate = useNavigate();

  const fetchAccountsList = async () => {
    const response = await axios.get("https://www.snptaxes.com/api/accounts");
    setAccountList(response.data);
  };

  useEffect(() => {
    fetchAccountsList();
  }, []);
// New handler for drawer close that also refreshes the table
  const handleDrawerClose = () => {
    setOpenDrawer(false);
    fetchAccountsList(); // refresh data when drawer closes
  };
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     setSelected(accountList.map((n) => n._id));
  //     return;
  //   }
  //   setSelected([]);
  // };
  const handleSelectAllClick = (event) => {
  if (event.target.checked) {
    const allSelectedIds = accountList.map((n) => n._id);
    setSelected(allSelectedIds);
    
    // Console log all selected accounts
    console.log(
      "Selected all accounts:",
      accountList.map(({ _id, accountName }) => ({
        value: _id,
        label: accountName,
      }))
    );
    return;
  }
  
  setSelected([]);
  console.log("Deselected all accounts");
};
const handleClick = (account) => {
  const selectedIndex = selected.indexOf(account._id);
  let newSelected = [];

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, account._id);
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selected.slice(1));
  } else if (selectedIndex === selected.length - 1) {
    newSelected = newSelected.concat(selected.slice(0, -1));
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selected.slice(0, selectedIndex),
      selected.slice(selectedIndex + 1)
    );
  }

  setSelected(newSelected);

  // Console log the selected accounts
  console.log(
    "Selected accounts:",
    newSelected.map(id => {
      const account = accountList.find(acc => acc._id === id);
      return account ? { value: account._id, label: account.accountName } : null;
    }).filter(Boolean)
  );
};
  
  // const handleClick = (account) => {
  //   const selectedIndex = selected.findIndex((sel) => sel._id === account._id);
  //   let newSelected = [];

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, account);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }

  //   setSelected(newSelected);

  //   // Console log the selected accounts
  //   console.log(
  //     "Selected accounts:",
  //     newSelected.map(({ _id, accountName }) => ({
  //       value: _id,
  //       label: accountName,
  //     }))
  //   );
  // };
  // Sorting and pagination
  const sortedList = accountList.slice().sort(getComparator(order, orderBy));
  const paginatedList = sortedList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Accounts & Contact Emails
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDrawer(true)}
      >
        Add Account
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < accountList.length
                  }
                  checked={
                    accountList.length > 0 &&
                    selected.length === accountList.length
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell
                sortDirection={orderBy === "accountName" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "accountName"}
                  direction={orderBy === "accountName" ? order : "asc"}
                  onClick={() => handleRequestSort("accountName")}
                >
                  Account Name
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={orderBy === "clientType" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "clientType"}
                  direction={orderBy === "clientType" ? order : "asc"}
                  onClick={() => handleRequestSort("clientType")}
                >
                  Client Type
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={orderBy === "companyName" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "companyName"}
                  direction={orderBy === "companyName" ? order : "asc"}
                  onClick={() => handleRequestSort("companyName")}
                >
                  Company Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Contact Emails</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedList.length > 0 ? (
              paginatedList.map((account) => (
                <TableRow key={account._id} selected={isSelected(account._id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      // checked={isSelected(account)}
                       checked={isSelected(account._id)}
                      onChange={() => handleClick(account)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      component="button"
                      underline="hover"
                      color="primary"
                      onClick={() => navigate(`/clients/accounts/account/${account._id}`)}
                    >
                      {account.accountName}
                    </Link>
                  </TableCell>
                  <TableCell>{account.clientType}</TableCell>
                  <TableCell>{account.companyName || "—"}</TableCell>
                  <TableCell>
                    {account.contacts?.length > 0 ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {account.contacts.map((c) => (
                          <Chip
                            key={c.contact._id}
                            label={c.contact.email}
                            color={c.canLogin ? "success" : "default"}
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Stack>
                    ) : (
                      "No contacts"
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No accounts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={accountList.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value));
            setPage(0);
          }}
        />
      </TableContainer>
      <AccountContactDrawer
        open={openDrawer}
        onClose={handleDrawerClose}
      />
    </Box>
  );
};

export default AccountTable;

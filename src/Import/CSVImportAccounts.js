import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const AccountCSVImport = () => {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const tableHeaders = [
    "id",
    "Account Name",
    "Account Type",
    "Tags",
    "Linked Contact #1",
    "Linked Contact #2",
    "Linked Contact #3",
    "Linked Contact #4",
  ];

  // 📌 CSV Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setRows(result.data);
      },
    });
  };

  // 📌 Select Row
  const handleSelectRow = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // 📌 Save Selected Accounts
  const handleSaveAccounts = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one account");
      return;
    }

    try {
      for (let index of selectedRows) {
        const r = rows[index];

        const payload = {
          id: r["id"] || "",
          accountName: r["Account Name"] || "",
          accountType: r["Account Type"], // maps to clientType
          linkedContacts: [
            r["Linked Contact #1"],
            r["Linked Contact #2"],
            r["Linked Contact #3"],
            r["Linked Contact #4"],
          ],
          tags: ["69425a8af7dd56fe66fd8538","69425aacf7dd56fe66fd853a"], // optional
          adminUserId: "6879ebab22b8b2db5c5bb0fc", // pass from auth/user context
        };

        await axios.post(
          "https://www.snptaxes.com/api/accounts/csv-import",
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // 🔥 Remove saved rows from table
      setRows((prev) => prev.filter((_, idx) => !selectedRows.includes(idx)));

      setSelectedRows([]);

      alert("Accounts saved successfully!");
    } catch (error) {
      console.error("Account Save Error:", error);
      alert("Error saving accounts");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Import Accounts (CSV)
      </Typography>

      <Button variant="contained" component="label">
        Upload CSV
        <input hidden type="file" accept=".csv" onChange={handleFileUpload} />
      </Button>

      {selectedRows.length > 0 && (
        <Button
          variant="contained"
          color="success"
          sx={{ ml: 2 }}
          onClick={handleSaveAccounts}
        >
          Save Accounts ({selectedRows.length})
        </Button>
      )}

      {rows.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                {tableHeaders.map((h, i) => (
                  <TableCell key={i} sx={{ fontWeight: "bold" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(rowIndex)}
                      onChange={() => handleSelectRow(rowIndex)}
                    />
                  </TableCell>
                  <TableCell>{row["id"]}</TableCell>
                  <TableCell>{row["Account Name"]}</TableCell>
                  <TableCell>{row["Account Type"]}</TableCell>
                  <TableCell>{row["Tags"]}</TableCell>
                  <TableCell>{row["Linked Contact #1"]}</TableCell>
                  <TableCell>{row["Linked Contact #2"]}</TableCell>
                  <TableCell>{row["Linked Contact #3"]}</TableCell>
                  <TableCell>{row["Linked Contact #4"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AccountCSVImport;

// 
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
  Typography
} from "@mui/material";

const CSVImportContacts = () => {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // Required table headers for display
  const tableHeaders = [
    "Contact Name",
    "First Name",
    "Middle Name",
    "Last Name",
    "Company Name",
    "Phone Numbers",
    "Email",
  ];

  // 📌 Read CSV File
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (result) {
        setRows(result.data);
      },
    });
  };

  // 📌 Select/Unselect Rows
  const handleSelectRow = (index) => {
    let updated = [...selectedRows];
    if (updated.includes(index)) {
      updated = updated.filter((i) => i !== index);
    } else {
      updated.push(index);
    }
    setSelectedRows(updated);
  };
const [isSaving, setIsSaving] = useState(false);
  // 📌 Save Selected Contacts (POST API)
//   const handleSaveContacts = async () => {
//     if (selectedRows.length === 0) {
//       alert("Please select at least one contact.");
//       return;
//     }
//      setIsSaving(true);  

//     try {
//       for (let index of selectedRows) {
//         const r = rows[index];

//         const payload = {
//           firstName: r["First Name"] || "",
//           middleName: r["Middle Name"] || "",
//           lastName: r["Last Name"] || "",
//           email: r["Email"] || "",
//           contactName:
//             r["Contact Name"] ||
//             `${r["First Name"] ?? ""} ${r["Last Name"] ?? ""}`,
//           companyName: r["Company Name"] || "",
//         };

//         await axios.post(
//           "https://www.snptaxes.com/api/contacts/",
//           payload,
//           {
//             headers: { "Content-Type": "application/json" },
//           }
//         );
//       }
//  // 🔥 Remove saved rows from table
//     const remainingRows = rows.filter(
//       (_, idx) => !selectedRows.includes(idx)
//     );

//     setRows(remainingRows);
//     setSelectedRows([]); // Clear selection
//       alert("Contacts saved successfully!");
//       // setSelectedRows([]);

//     } catch (error) {
//       console.error(error);
//       console.log("Error saving contacts:", error.response?.data || error.message);
//       alert("Error saving contacts");
//     }
//     finally {
//     setIsSaving(false);   // ✅ re-enable button
//   }
//   };
const handleSaveContacts = async () => {
  if (selectedRows.length === 0) {
    alert("Please select at least one contact.");
    return;
  }

  setIsSaving(true);

  try {
    // Build bulk contacts payload
    const contacts = selectedRows.map((index) => {
      const r = rows[index];

      return {
        firstName: r["First Name"] || "",
        middleName: r["Middle Name"] || "",
        lastName: r["Last Name"] || "",
        email: r["Email"] || "",
        contactName:
          r["Contact Name"] ||
          `${r["First Name"] ?? ""} ${r["Last Name"] ?? ""}`,
        companyName: r["Company Name"] || "",
        login: false // 🔒 save only, no activation mail
      };
    });

    const response = await axios.post(
      "https://www.snptaxes.com/api/contacts/bulk-save",
      { contacts },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    console.log("Bulk save response:", response.data);

    // 🔥 Remove saved + skipped rows from table
    const remainingRows = rows.filter(
      (_, idx) => !selectedRows.includes(idx)
    );

    setRows(remainingRows);
    setSelectedRows([]);

    alert(
      `Contacts processed successfully!\nSaved: ${response.data.savedCount}\nSkipped: ${response.data.skippedCount}`
    );

  } catch (error) {
    console.error("Error saving contacts:", error.response?.data || error.message);
    alert("Error saving contacts");
  } finally {
    setIsSaving(false);
  }
};

   const handleSelectAll = () => {
  if (selectedRows.length === rows.length) {
    // unselect all
    setSelectedRows([]);
  } else {
    // select all
    setSelectedRows(rows.map((_, index) => index));
  }
};

  return (
    <Box p={3}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Import Contacts (CSV)
      </Typography>

      {/* Upload CSV Button */}
      <Button variant="contained" component="label">
        Upload CSV
        <input
          hidden
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
        />
      </Button>

      {/* Save Contacts Button */}
      {selectedRows.length > 0 && (
        <Button
          variant="contained"
          color="success"
          sx={{ ml: 2 }}
          onClick={handleSaveContacts}
            disabled={isSaving}  
        >
          {/* Save Contacts ({selectedRows.length}) */}
            {isSaving
    ? "Saving..."            // show loading text
    : `Save Contacts (${selectedRows.length})`}

        </Button>
      )}

      {/* Data Table */}
      {rows.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
               <TableCell>
      <Checkbox
        checked={selectedRows.length === rows.length && rows.length > 0}
        indeterminate={
          selectedRows.length > 0 && selectedRows.length < rows.length
        }
        onChange={handleSelectAll}
      />
    </TableCell>
                {tableHeaders.map((header, idx) => (
                  <TableCell key={idx} sx={{ fontWeight: "bold" }}>
                    {header}
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

                  <TableCell>
                    {row["Contact Name"] ||
                      `${row["First Name"] ?? ""} ${row["Last Name"] ?? ""}`}
                  </TableCell>

                  <TableCell>{row["First Name"] || ""}</TableCell>
                  <TableCell>{row["Middle Name"] || ""}</TableCell>
                  <TableCell>{row["Last Name"] || ""}</TableCell>
                  <TableCell>{row["Company Name"] || ""}</TableCell>
                  <TableCell>{row["Phone Numbers"] || row["Phone"] || ""}</TableCell>
                  <TableCell>{row["Email"] || row["Email Address"] || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CSVImportContacts;

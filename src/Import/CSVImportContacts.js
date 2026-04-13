// 
import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";

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
        phoneNumbers: r["Phone Numbers"] || r["Phone"] || "",
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
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((_, index) => index));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Import Contacts (CSV)</h1>

      <div className="flex items-center gap-3">
        <label className="cursor-pointer">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border border-input bg-background hover:bg-muted transition-colors">
            Upload CSV
          </span>
          <input hidden type="file" accept=".csv" onChange={handleFileUpload} />
        </label>

        {selectedRows.length > 0 && (
          <Button
            onClick={handleSaveContacts}
            disabled={isSaving}
            className="rounded-full px-5"
            style={{ backgroundColor: "var(--color-save-btn)" }}
          >
            {isSaving ? "Saving..." : `Save Contacts (${selectedRows.length})`}
          </Button>
        )}
      </div>

      {rows.length > 0 && (
        <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 w-10">
                  <Checkbox
                    checked={selectedRows.length === rows.length && rows.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                {tableHeaders.map((header, idx) => (
                  <th key={idx} className="text-xs font-semibold text-left px-4 py-3 text-muted-foreground uppercase tracking-wide">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={`border-b hover:bg-muted/30 transition-colors ${selectedRows.includes(rowIndex) ? "bg-blue-50/50" : ""}`}>
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedRows.includes(rowIndex)}
                      onCheckedChange={() => handleSelectRow(rowIndex)}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium">
                    {row["Contact Name"] || `${row["First Name"] ?? ""} ${row["Last Name"] ?? ""}`}
                  </td>
                  <td className="px-4 py-2.5 text-sm">{row["First Name"] || ""}</td>
                  <td className="px-4 py-2.5 text-sm">{row["Middle Name"] || ""}</td>
                  <td className="px-4 py-2.5 text-sm">{row["Last Name"] || ""}</td>
                  <td className="px-4 py-2.5 text-sm">{row["Company Name"] || ""}</td>
                  <td className="px-4 py-2.5 text-sm">{row["Phone Numbers"] || row["Phone"] || ""}</td>
                  <td className="px-4 py-2.5 text-sm">{row["Email"] || row["Email Address"] || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CSVImportContacts;

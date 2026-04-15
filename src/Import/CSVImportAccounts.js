import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Upload, FileSpreadsheet } from "lucide-react";

const AccountCSVImport = () => {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
const [isSaving, setIsSaving] = useState(false);

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
 setIsSaving(true);  
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
    finally {
    setIsSaving(false);   // ✅ re-enable button
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
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Import Accounts (CSV)</h1>

      {rows.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-border bg-muted/20 px-12 py-14 text-center w-full max-w-sm">
            <div className="rounded-full bg-primary/10 p-5">
              <FileSpreadsheet className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">Upload Accounts CSV</h3>
              <p className="text-sm text-muted-foreground">Select a <span className="font-medium">.csv</span> file to import accounts</p>
            </div>
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors cursor-pointer">
                <Upload className="h-4 w-4" /> Choose CSV File
              </span>
              <input hidden type="file" accept=".csv" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer">
                <Upload className="h-4 w-4" /> Upload New CSV
              </span>
              <input hidden type="file" accept=".csv" onChange={handleFileUpload} />
            </label>

            {selectedRows.length > 0 && (
              <Button
                onClick={handleSaveAccounts}
                disabled={isSaving}
                className="rounded-full px-5"
                style={{ backgroundColor: "var(--color-save-btn)" }}
              >
                {isSaving ? "Saving..." : `Save Accounts (${selectedRows.length})`}
              </Button>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border shadow-sm bg-background">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 w-10">
                    <Checkbox
                      checked={selectedRows.length === rows.length && rows.length > 0}
                      onCheckedChange={handleSelectAll}
                      ref={(el) => {
                        if (el) el.indeterminate = selectedRows.length > 0 && selectedRows.length < rows.length;
                      }}
                    />
                  </th>
                  {tableHeaders.map((h, i) => (
                    <th key={i} className="text-xs font-semibold text-left px-4 py-3 text-muted-foreground uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={`border-b hover:bg-muted/30 transition-colors ${selectedRows.includes(rowIndex) ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedRows.includes(rowIndex)}
                        onCheckedChange={() => handleSelectRow(rowIndex)}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-sm">{row["id"]}</td>
                    <td className="px-4 py-2.5 text-sm font-medium">{row["Account Name"]}</td>
                    <td className="px-4 py-2.5 text-sm">{row["Account Type"]}</td>
                    <td className="px-4 py-2.5 text-sm">{row["Tags"]}</td>
                    <td className="px-4 py-2.5 text-sm">{row["Linked Contact #1"]}</td>
                    <td className="px-4 py-2.5 text-sm">{row["Linked Contact #2"]}</td>
                    <td className="px-4 py-2.5 text-sm">{row["Linked Contact #3"]}</td>
                    <td className="px-4 py-2.5 text-sm">{row["Linked Contact #4"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountCSVImport;

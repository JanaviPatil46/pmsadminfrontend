import React, { useState } from "react";
import { CloudUpload, CheckCircle2 } from "lucide-react";
import AccountTable from "./incompletedDataAcc";
import CompletedAccountsTable from "./completedDataAcc";

const TABS = [
  { id: "incomplete", label: "Incomplete Upload", icon: CloudUpload },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
];

const AccountUploadPage = () => {
  const [activeTab, setActiveTab] = useState("incomplete");

  return (
    <div className="space-y-6 p-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Account Data Import</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload ZIP archives to import account documents.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={[
              "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-150",
              activeTab === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "incomplete" && <AccountTable />}
        {activeTab === "completed" && <CompletedAccountsTable />}
      </div>
    </div>
  );
};

export default AccountUploadPage;

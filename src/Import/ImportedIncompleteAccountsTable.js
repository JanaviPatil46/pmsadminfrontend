import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ImportedIncompleteAccountsTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(
          "https://www.snptaxes.com/api/accounts/imported-incomplete?active=true"
        );
        setAccounts(res.data.accountlist || []);
      } catch (err) {
        console.error("Failed to fetch accounts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/40">
            {["Account Name", "Client Type", "Tags", "Contact Emails"].map((h) => (
              <th key={h} className="text-xs font-semibold text-left px-4 py-3 text-muted-foreground uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-12 text-sm text-muted-foreground">
                No accounts found
              </td>
            </tr>
          ) : (
            accounts.map((account) => (
              <tr key={account._id} className="border-b hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <span
                    className="text-sm font-medium text-indigo-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/importedaccounts/${account._id}/docs`)}
                  >
                    {account.accountName}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{account.clientType}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {account.tags?.map((tag) => (
                      <span
                        key={tag._id}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: tag.tagColour }}
                      >
                        {tag.tagName}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {account.contacts?.length > 0 ? (
                    <div className="space-y-0.5">
                      {account.contacts.map((c) => (
                        <div key={c._id} className="text-sm text-muted-foreground">
                          {c.contact?.email || "—"}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ImportedIncompleteAccountsTable;

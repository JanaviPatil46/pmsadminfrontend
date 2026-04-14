import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";

const Approvals = () => {
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const { data } = useParams();
  const [approvals, setApprovals] = useState([]);

  // Fetch approvals list
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await axios.get(
          `${DOCS_MANAGMENTS}/approvals/approvalList/byaccountid/${data}`
        );
        setApprovals(res.data.approvals || []);
      } catch (err) {
        console.error("Error fetching approvals:", err);
      }
    };
    fetchApprovals();
  }, [data, DOCS_MANAGMENTS]);

  // ✅ Delete approval
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this approval?")) return;

    try {
      await axios.delete(`${DOCS_MANAGMENTS}/approvals/${id}`);
      setApprovals((prev) => prev.filter((a) => a._id !== id)); // remove from list
    } catch (err) {
      console.error("Error deleting approval:", err);
      alert("Failed to delete approval");
    }
  };

  const statusStyles = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") return "bg-green-50 text-green-700 border border-green-200";
    if (s === "rejected" || s === "declined") return "bg-red-50 text-red-700 border border-red-200";
    if (s === "pending") return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-800">Approvals</h2>
        <p className="text-xs text-gray-400 mt-0.5">Document approval requests for this account</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Document Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {approvals.length > 0 ? (
                approvals.map((approval, index) => (
                  <tr key={approval._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{approval.filename || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusStyles(approval.status)}`}>
                        {approval.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{approval.description || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {approval.updatedAt
                        ? new Date(approval.updatedAt).toLocaleString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(approval._id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete approval"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Trash2 size={18} className="text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-400">No approvals found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Approvals;

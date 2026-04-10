import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
const DeactivateMember = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const handleRestoreMember = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to Restore this account ?"
    );
    if (isConfirmed) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        active: true,
      });

      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${LOGIN_API}/admin/teammember/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          console.log(id);

          fetchDeactivateData();
          toast.success("Team Member Activated Successfully");
        })
        .catch((error) => console.error(error));
    }
  };

  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);

  const fetchDeactivateData = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const url = `${LOGIN_API}/admin/teammember/teammemberlist/list/false`;

      const response = await fetch(url, requestOptions);
      const result = await response.json();

      setTeamMembers(result.teamMemberslist);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDeactivateData();
  }, []);
  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const menuRef = useRef(null);
  const totalPages = Math.ceil(teamMembers.length / rowsPerPage);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        <span className="text-sm text-slate-500">Loading members...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Created</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">2FA</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((member, index) => {
                  const firstName = member?.FirstName || "";
                  const middleName = member?.MiddleName || "";
                  const lastName = member?.LastName || "";
                  const initials = `${firstName ? firstName[0] : ""}${lastName ? lastName[0] : ""}`;
                  const linkPath = `/updateteammember/${member?.id}`;
                  const formattedDate = new Date(member.Created);
                  const displayDate = isNaN(formattedDate)
                    ? "Invalid Date"
                    : formattedDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }).replace(",", "");

                  return (
                    <tr key={member.id} className={`transition-colors hover:bg-indigo-50/40 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 shrink-0">
                            {initials}
                          </div>
                          <Link to={linkPath} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                            {`${firstName} ${middleName} ${lastName}`.trim()}
                          </Link>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{member.Email}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 capitalize">{member.Role}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{displayDate}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${member.has2FA ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {member.has2FA ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="relative inline-block" ref={openMenuId === member.id ? menuRef : null}>
                          <button onClick={() => toggleMenu(member.id)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {openMenuId === member.id && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                              <button onClick={() => handleRestoreMember(member.id)} className="flex w-full items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors">
                                Restore
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              {teamMembers.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">No deactivated members found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Rows per page:</span>
            <select value={rowsPerPage} onChange={handleChangeRowsPerPage} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {[30, 40, 50, 60, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="ml-2">{teamMembers.length > 0 ? `${page * rowsPerPage + 1}–${Math.min((page + 1) * rowsPerPage, teamMembers.length)} of ${teamMembers.length}` : '0 results'}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={(e) => handleChangePage(e, page - 1)} disabled={page === 0} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={(e) => handleChangePage(e, page + 1)} disabled={page >= totalPages - 1} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeactivateMember;

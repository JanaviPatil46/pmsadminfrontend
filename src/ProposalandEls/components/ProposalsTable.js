

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoreVertical, Plus, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
const ProposalsTable = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(null);              // proposal id for open menu
  const [selectedProposal, setSelectedProposal] = useState(null); // which row clicked
  const menuRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };

        const response = await fetch("https://www.snptaxes.com/api/proposals", requestOptions);
        
        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }
        
        const result = await response.json();
        setProposals(result.proposallist || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTemplateClick = (proposal) => {

    // Navigate to proposal form with the proposal ID
    navigate(`/firmtemp/templates/proposals/proposal-form?edit=${proposal._id}`);
  };

  const handleCreateNew = () => {
    // Navigate to empty proposal form
    navigate('/firmtemp/templates/proposals/proposal-form');
  };

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
        setSelectedProposal(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuOpen = (proposal) => {
    setMenuOpen(menuOpen === proposal._id ? null : proposal._id);
    setSelectedProposal(proposal);
  };

  const handleMenuClose = () => {
    setMenuOpen(null);
    setSelectedProposal(null);
  };

  // ✅ Delete handler (You can add API call later)
const handleDelete = async () => {
  if (!selectedProposal) return;

  try {
    const response = await fetch(
      `https://www.snptaxes.com/api/proposals/${selectedProposal._id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete proposal");
    }
    toast.success("Proposal deleted successfully");
    setProposals(prev => prev.filter(p => p._id !== selectedProposal._id));
  } catch (err) {
    console.error("Delete error:", err);
  } finally {
    handleMenuClose();
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading proposals...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 mt-4">
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
         
          {/* <h1 className="text-2xl font-bold tracking-tight text-foreground">Proposals</h1>
          <p className="mt-1 text-sm text-muted-foreground">{proposals.length} proposal(s) available</p> */}
         
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Create New Proposal
        </button>
      </div>

      {proposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 py-16 px-6 text-center">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No proposals yet</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">Get started by creating your first proposal template.</p>
          <button
            onClick={handleCreateNew}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <Plus className="h-4 w-4" /> Create Your First Proposal
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-xs font-semibold tracking-wide uppercase text-left text-muted-foreground">Template Name</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wide uppercase text-right text-muted-foreground w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {proposals.map((proposal, idx) => (
                  <tr key={proposal._id} className="bg-background transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <Link
                        to={`/firmtemp/templates/proposals/proposal-form?edit=${proposal._id}`}
                        className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                      >
                        {proposal.templatename}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block" ref={menuOpen === proposal._id ? menuRef : null}>
                        <button
                          onClick={() => handleMenuOpen(proposal)}
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {menuOpen === proposal._id && (
                          <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-card py-1 shadow-lg animate-in fade-in slide-in-from-top-1">
                            <button
                              onClick={() => { handleTemplateClick(selectedProposal); handleMenuClose(); }}
                              className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={handleDelete}
                              className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalsTable;
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../../components/ui/button';
import { DataTable } from '../../components/data-table/data-table';
import { DataTableToolbar } from '../../components/data-table/toolbar';
const ProposalsTable = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const navigate = useNavigate();
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

  const handleCreateNew = () => {
    navigate('/firmtemp/templates/proposals/proposal-form');
  };

  const handleDeleteProposal = async (id) => {
    try {
      const response = await fetch(`https://www.snptaxes.com/api/proposals/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete proposal');
      toast.success('Proposal deleted successfully');
      setProposals(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete proposal');
    }
  };

  const proposalColumns = useMemo(() => [
    {
      accessorKey: 'templatename',
      header: 'Template Name',
      cell: ({ getValue, row }) => (
        <button
          onClick={() => navigate(`/firmtemp/templates/proposals/proposal-form?edit=${row.original._id}`)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
        >
          {getValue()}
        </button>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => navigate(`/firmtemp/templates/proposals/proposal-form?edit=${row.original._id}`)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDeleteProposal(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], [navigate]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button size="sm" onClick={handleCreateNew}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Proposal
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
      <DataTable
        columns={proposalColumns}
        data={proposals}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row._id}
        emptyMessage="No proposals found"
        emptyDescription="Create your first proposal template to get started"
        pageSize={25}
      />
    </div>
  );
};

export default ProposalsTable;
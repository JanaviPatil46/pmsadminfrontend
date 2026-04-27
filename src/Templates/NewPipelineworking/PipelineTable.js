import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
const PipelineTable = () => {
  const navigate = useNavigate();
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${PIPELINE_API}/workflow/pipeline/pipelines`);
      if (!response.ok) throw new Error("Failed to fetch pipeline data");
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/firmtemp/pipelineform?edit=${id}`);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this pipeline?");
    if (isConfirmed) {
      try {
        await axios.delete(`${PIPELINE_API}/workflow/pipeline/pipeline/${id}`);
        toast.success("Pipeline deleted successfully");
        fetchPipelineData();
      } catch (error) {
        console.error("Error deleting pipeline:", error);
        toast.error("Failed to delete pipeline");
      }
    }
  };

  const pipelineColumns = useMemo(() => [
    {
      accessorKey: "pipelineName",
      header: "Pipeline Name",
      cell: ({ getValue, row }) => (
        <button
          onClick={() => handleEdit(row.original._id)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
        >
          {getValue()}
        </button>
      ),
    },
    {
      accessorKey: "stages",
      header: "Total Stages",
      cell: ({ getValue }) => (
        <Badge variant="secondary">{getValue()?.length || 0}</Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => handleEdit(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button size="sm" onClick={() => navigate(`/firmtemp/pipelineform`)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Pipeline
        </Button>
      </div>
      <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
      <DataTable
        columns={pipelineColumns}
        data={pipelineData}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row._id}
        emptyMessage="No pipelines found"
        emptyDescription="Create your first pipeline template to get started"
        pageSize={25}
      />
    </div>
  );
};

export default PipelineTable;

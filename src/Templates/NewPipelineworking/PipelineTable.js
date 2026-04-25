import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MoreVertical, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
const PipelineTable = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPipeline, setSelectedPipeline] = useState(null);

  const [pipelineData, setPipelineData] = useState([]);

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch pipeline data");
      }
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    }
  };

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handleMenuClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuOpen = (event, pipeline) => {
    setAnchorEl(anchorEl === pipeline._id ? null : pipeline._id);
    setSelectedPipeline(pipeline);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPipeline(null);
  };

  // ============================
  // 💥 EDIT Pipeline
  // ============================
  // EDIT Pipeline - Navigate with pipeline ID
  const handleEdit = () => {
    if (selectedPipeline) {
      navigate(`/firmtemp/pipelineform?edit=${selectedPipeline._id}`);
    }
    handleMenuClose();
  };

  const handleDelete = async (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this pipeline?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${PIPELINE_API}/workflow/pipeline/pipeline/${selectedPipeline._id}`,
        headers: {},
      };

      try {
        const response = await axios.request(config);
        console.log("Delete response:", response.data);
        toast.success("Pipeline deleted successfully");
        handleMenuClose();
        fetchPipelineData();
        // Optionally, you can refresh the data or update the state to reflect the deletion
      } catch (error) {
        console.error("Error deleting pipeline:", error);
      }
    }
  };
  const handelCreateNew = () => {
    // Navigate to empty proposal form
    navigate(`/firmtemp/pipelineform`);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Pipeline Templates</h1>
        <button
          onClick={handelCreateNew}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Create New Pipeline
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Pipeline Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Total Stages</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pipelineData?.length > 0 ? (
                pipelineData.map((pipeline, idx) => (
                  <tr key={pipeline._id} className={`transition-colors hover:bg-blue-50/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/firmtemp/pipelineform?edit=${pipeline._id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {pipeline.pipelineName}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        {pipeline.stages?.length || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="relative inline-block" ref={anchorEl === pipeline._id ? menuRef : null}>
                        <button
                          onClick={(e) => handleMenuOpen(e, pipeline)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {anchorEl === pipeline._id && (
                          <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-in fade-in slide-in-from-top-1">
                            <button onClick={handleEdit} className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Edit</button>
                            <button onClick={handleDelete} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors focus:ring-blue-500">Delete</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-sm text-slate-400">No pipelines found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PipelineTable;

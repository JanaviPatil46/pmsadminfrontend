import React, { useState } from "react";
import { MoreVertical, FolderOpen, Pencil, Trash2, Plus } from "lucide-react";

function FolderTemplateTbel({
  handleCreateTemplate,
  folderTemplates,
  handleEdit,
  handleDelete,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleMenuOpen = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleMenuClose = () => {
    setOpenMenuId(null);
  };

  const handleDeleteClick = (id) => {
    if (id && handleDelete) handleDelete(id);
    handleMenuClose();
  };

  const handleEditClick = (id) => {
    if (id && handleEdit) handleEdit(id);
    handleMenuClose();
  };

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleCreateTemplate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Create Template
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {folderTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FolderOpen className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm">No folder templates found.</p>
            <p className="text-xs mt-1 text-slate-400">Click "Create Template" to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Used in Pipeline</th>
                  <th className="px-5 py-3 w-16 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {folderTemplates.map((template) => (
                  <tr key={template._id} className="group transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(template._id)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {template.templatename}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-400">—</td>
                    <td className="px-5 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={(e) => handleMenuOpen(e, template._id)}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {openMenuId === template._id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={handleMenuClose} />
                            <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                              <button
                                type="button"
                                onClick={() => handleEditClick(template._id)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(template._id)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FolderTemplateTbel;

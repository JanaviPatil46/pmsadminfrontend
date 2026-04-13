import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowRoundBack } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";
import { Trash2 } from "lucide-react";

const EditAutomationDrawer = ({
  setSelectedAutomationData,
  handleAssigneeChange,
  isEditDrawerOpen,
  setIsEditDrawerOpen,
  selectedAutomationData,
  handleDeleteAutomation,
  handleEditTemplateChange,
  emailTemplateOptions,
  invoiceTemplateOptions,
  organizerOptions,
  proposalElsOptions,
  optionfolder,
  handleEditConditions,
  handleEditClick,
  handleEditSaveAutomation,
  ehitAnchorEl,
  handleEditClose,
  handleMenuItemSelect,
  isConditionsEditFormOpen,
  handleEditGoBack,
  selectedAutomationIndex,
  searchTerm,
  handleSearchChange,
  filteredTags,
  stageAutomationTags,
  handleEditCheckboxChange,
  handleEditAddTags,
  tagsoptions,
  assigneeOptions,
  filteredRemoveTagsOptions,
  taskTemplateOptions,
  chatTemplateOptions,
  handleTagChange,
  handleEditClientChange,
  statusOptions,
  optionstatus,
  maxDescriptionLength,
  
}) => {
  console.log("automation list", selectedAutomationData);
  console.log("statusOptions", statusOptions);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: "auto",
      },
    },
  };

  const [automations, setAutomations] = useState(selectedAutomationData);
  useEffect(() => {
    if (selectedAutomationData.length > 0) {
      setAutomations((prev) =>
        selectedAutomationData.map((automation) => ({
          ...(prev.find((a) => a.id === automation.id) || automation),
          addTags: automation.addTags || [],
          removeTags: automation.removeTags || [],
        }))
      );
    }
  }, [selectedAutomationData]);

 
  const automationTypeOptions = [
    "Send Email", "Send Invoice", "Send Proposal/Els", "Create Organizer",
    "Apply folder template", "Update account tags", "Update job assignees",
    "Create Task", "Send message", "Update client-facing job status",
  ];

  const getTemplateOptions = (type) => {
    if (type === "Send Email") return emailTemplateOptions;
    if (type === "Send Invoice") return invoiceTemplateOptions;
    if (type === "Create Organizer") return organizerOptions;
    if (type === "Send Proposal/Els") return proposalElsOptions;
    if (type === "Apply folder template") return optionfolder;
    if (type === "Create Task") return taskTemplateOptions;
    if (type === "Send message") return chatTemplateOptions;
    return [];
  };

  return (
    <>
      {/* Main Edit Automation Drawer */}
      {isEditDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setIsEditDrawerOpen(false)} />
          <div className="ml-auto relative z-50 w-full max-w-[500px] bg-background rounded-l-xl h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-bold">Edit Automations</h2>
              <RxCross2 onClick={() => setIsEditDrawerOpen(false)} className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-800" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedAutomationData.length > 0 ? (
                selectedAutomationData.map((automation, index) => (
                  <div key={index} className="rounded-lg border-2 border-gray-200 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{index + 1}. {automation.type || "No Type"}</span>
                      <button type="button" onClick={() => handleDeleteAutomation(index)} className="rounded p-1 text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {automation.type === "Update account tags" ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-600">Added Tags:</p>
                        <select
                          multiple
                          className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={automation.addTags.map((t) => t._id)}
                          onChange={(e) => handleTagChange(index, "addTags", { target: { value: Array.from(e.target.selectedOptions, (o) => o.value) } })}
                        >
                          {tagsoptions.filter((opt) => !automation.removeTags.some((t) => t._id === opt.value)).map((opt) => (
                            <option key={opt.value} value={opt.value} style={{ backgroundColor: opt.colour, color: "#fff" }}>{opt.label}</option>
                          ))}
                        </select>
                        <div className="flex flex-wrap gap-1">
                          {automation.addTags.map((tag) => (
                            <span key={tag._id} className="rounded-full px-2 py-0.5 text-xs text-white font-medium" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                          ))}
                        </div>
                        <p className="text-xs font-medium text-gray-600 mt-2">Removed Tags:</p>
                        <select
                          multiple
                          className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={automation.removeTags.map((t) => t._id)}
                          onChange={(e) => handleTagChange(index, "removeTags", { target: { value: Array.from(e.target.selectedOptions, (o) => o.value) } })}
                        >
                          {tagsoptions.filter((opt) => !automation.addTags.some((t) => t._id === opt.value)).map((opt) => (
                            <option key={opt.value} value={opt.value} style={{ backgroundColor: opt.colour, color: "#fff" }}>{opt.label}</option>
                          ))}
                        </select>
                        <div className="flex flex-wrap gap-1">
                          {automation.removeTags.map((tag) => (
                            <span key={tag._id} className="rounded-full px-2 py-0.5 text-xs text-white font-medium" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                          ))}
                        </div>
                      </div>
                    ) : automation.type === "Update job assignees" ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-600">Added Assignees:</p>
                        <select
                          multiple
                          className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={automation.addAssignees.map((a) => a._id)}
                          onChange={(e) => handleAssigneeChange(index, "addAssignees", { target: { value: Array.from(e.target.selectedOptions, (o) => o.value) } })}
                        >
                          {assigneeOptions.filter((opt) => !automation.removeAssignees.some((a) => a._id === opt.value)).map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <div className="flex flex-wrap gap-1">
                          {automation.addAssignees.map((a) => (
                            <span key={a._id} className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium">{a.username}</span>
                          ))}
                        </div>
                        <p className="text-xs font-medium text-gray-600 mt-2">Removed Assignees:</p>
                        <select
                          multiple
                          className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={automation.removeAssignees.map((a) => a._id)}
                          onChange={(e) => handleAssigneeChange(index, "removeAssignees", { target: { value: Array.from(e.target.selectedOptions, (o) => o.value) } })}
                        >
                          {assigneeOptions.filter((opt) => !automation.addAssignees.some((a) => a._id === opt.value)).map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <div className="flex flex-wrap gap-1">
                          {automation.removeAssignees.map((a) => (
                            <span key={a._id} className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium">{a.username}</span>
                          ))}
                        </div>
                      </div>
                    ) : automation.type === "Update client-facing job status" ? (
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">Visibility for client</label>
                        <select
                          className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={automation.visibilityForClient ?? ""}
                          onChange={(e) => {
                            const updatedAutomations = [...selectedAutomationData];
                            updatedAutomations[index].visibilityForClient = e.target.value === "true";
                            setSelectedAutomationData(updatedAutomations);
                          }}
                        >
                          <option value="">Select status</option>
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {automation.visibilityForClient === true && (
                          <div className="space-y-2 mt-2">
                            <label className="text-xs font-medium text-gray-600">Select status</label>
                            <select
                              className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={automation.selectedClientStatus?.value || ""}
                              onChange={(e) => {
                                const opt = optionstatus.find((o) => o.value === e.target.value);
                                handleEditClientChange(index, opt);
                              }}
                            >
                              <option value="">Select status</option>
                              {optionstatus.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <label className="text-xs font-medium text-gray-600">Status description for client</label>
                            <textarea
                              rows={4}
                              className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                              placeholder="Status description for client"
                              value={automation.statusDescription || ""}
                              onChange={(e) => {
                                const updatedAutomations = [...selectedAutomationData];
                                updatedAutomations[index].statusDescription = e.target.value;
                                setSelectedAutomationData(updatedAutomations);
                              }}
                            />
                            <p className="text-xs text-gray-400">{automation.statusDescription?.length || 0}/{maxDescriptionLength}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600">Select Template</p>
                        <select
                          className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={automation.template?.value || ""}
                          onChange={(e) => {
                            const opt = getTemplateOptions(automation.type).find((o) => o.value === e.target.value);
                            handleEditTemplateChange(index, opt);
                          }}
                        >
                          <option value="">Select Template</option>
                          {getTemplateOptions(automation.type).map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {automation.tags && automation.tags.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-600">Only For:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {automation.tags.map((tag) => (
                            <span key={tag._id} className="rounded-full px-2 py-0.5 text-xs text-white font-medium" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <button type="button" onClick={() => handleEditConditions(index)} className="mt-2 text-sm text-blue-600 hover:underline">
                      Add Conditions
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 mt-2">No automations selected.</p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={(e) => handleEditClick(e)} className="text-sm text-blue-600 hover:underline">
                  Add Automations
                </button>
                <button
                  type="button"
                  onClick={() => handleEditSaveAutomation()}
                  className="rounded-full bg-[var(--color-save-btn)] px-5 py-1.5 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors"
                >
                  Save Automation
                </button>
              </div>

              {Boolean(ehitAnchorEl) && (
                <div className="absolute left-4 z-50 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg max-h-52 overflow-y-auto">
                  {automationTypeOptions.map((type) => (
                    <button key={type} type="button" onClick={() => { handleMenuItemSelect(type); handleEditClose(); }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conditions Edit Drawer */}
      {isConditionsEditFormOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={handleEditGoBack} />
          <div className="ml-auto relative z-50 w-full max-w-[550px] bg-background h-full overflow-y-auto shadow-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <button type="button" onClick={handleEditGoBack} className="rounded p-1 text-blue-600 hover:bg-blue-50">
                <IoMdArrowRoundBack className="h-5 w-5" />
              </button>
              <h3 className="text-base font-semibold">Add conditions</h3>
              <span className="text-xs text-gray-400">Automation index: {selectedAutomationIndex}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Apply automation only for accounts with these tags</p>
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded border border-gray-200 pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mt-3 h-[68vh] overflow-y-auto space-y-1">
              {filteredTags.map((tag) => (
                <div key={tag._id} className="flex items-center gap-3 border-b border-gray-200 pb-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={stageAutomationTags.some((t) => t._id === tag._id)}
                    onChange={() => handleEditCheckboxChange(tag)}
                  />
                  <span className="rounded-full px-3 py-0.5 text-xs text-white font-medium" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleEditAddTags}
                className="rounded-full bg-[var(--color-save-btn)] px-5 py-1.5 text-sm text-white hover:bg-[var(--color-save-hover-btn)] transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={handleEditGoBack}
                className="rounded-full border border-[var(--color-border-cancel-btn)] px-5 py-1.5 text-sm text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white hover:border-transparent transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditAutomationDrawer;

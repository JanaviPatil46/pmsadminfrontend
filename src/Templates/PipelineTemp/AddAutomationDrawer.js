import React from "react";
import { RxCross2 } from "react-icons/rx";

const AUTOMATION_TYPES = [
  "Send Email",
  "Send Invoice",
  "Send Proposal/Els",
  "Create Organizer",
  "Apply folder template",
  "Update account tags",
  "Update job assignees",
];

const AddAutomationDrawer = ({
  isDrawerOpen,
  handleDrawerClose,
  renderActionContent,
  automationSelect,
  index,
  ehitAnchorEl,
  handleEditClose,
  handleMenuItemSelect,
}) => {
  if (!isDrawerOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/40" onClick={handleDrawerClose} />
      <div className="ml-auto relative z-50 w-full max-w-[500px] bg-background h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-base font-bold">Add Automations</h2>
          <RxCross2 onClick={handleDrawerClose} className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-800" />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {renderActionContent(automationSelect, index)}
        </div>
        {Boolean(ehitAnchorEl) && (
          <div className="absolute right-4 top-14 z-50 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {AUTOMATION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => { handleMenuItemSelect(type); handleEditClose(); }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAutomationDrawer;

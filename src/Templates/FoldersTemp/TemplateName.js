// import React from 'react'

// function TemplateName({ handleSaveTemplate, handleCancel,tempName,setTempName }) {
//     return (
//         <div>

//             <div className="folder-label">
//                 <label>Template Name</label>
//                 <input type="text" placeholder="Template Name" value={tempName} onChange={(e) => setTempName(e.target.value)} />
//             </div>
//             <div className="temp_buttons">
//                 <button className="btn1" onClick={handleSaveTemplate}>
//                     Save
//                 </button>
//                 <button className="btn2" onClick={handleCancel}>
//                     Cancel
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default TemplateName

import React from "react";

function TemplateName({
  handleSaveTemplate,
  handleCancel,
  tempName,
  setTempName,
}) {
  return (
    <>
      <h2 className="text-lg font-semibold">Create folder template</h2>
      <div className="flex flex-col gap-4 mt-4">
        <div>
          <label className="block text-xs text-black font-medium mb-1">Template Name</label>
          <input
            type="text"
            placeholder="Template Name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSaveTemplate}
            className="rounded-full px-5 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)]"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full px-5 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default TemplateName;

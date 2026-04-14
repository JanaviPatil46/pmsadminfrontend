import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AccountOrganizers = () => {
  return (
    <>
    <div>
      <h4 className="text-2xl font-semibold mb-2">Organizers</h4>
    </div>

    {/* <Box sx={{border:'2px solid red',p:'10px'}}>
      <NavLink
        to={`/clients/accounts/activeaccounts`}
        style={{
       
          padding: "4px 8px",
          borderRadius: "10px",
          fontSize: "14px",
          cursor: "pointer",
          width: "50%",
          textDecoration: "none",
          margin:'5px'
        }}
      >
        Active
      </NavLink>
      <NavLink
        to={`/clients/accounts/archivedaccounts`}
        style={{
         
          padding: "4px 8px",
          borderRadius: "10px",
          fontSize: "14px",
          cursor: "pointer",
          width: "50%",
          textDecoration: "none",
          margin:'5px'
        }}
      >
        Archived
      </NavLink>
    </Box> */}

<div className="flex items-center bg-[#EBF0F5] rounded-xl p-1.5 w-max">
    <NavLink
      to="/organizers/active"
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg text-sm cursor-pointer no-underline transition-all ${
          isActive ? "font-bold text-[var(--color-save-btn)] bg-white" : "text-gray-700"
        }`
      }
    >
      Active
    </NavLink>
    <NavLink
      to="/organizers/archived"
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg text-sm cursor-pointer no-underline transition-all ${
          isActive ? "font-bold text-[var(--color-save-btn)] bg-white" : "text-gray-700"
        }`
      }
    >
      Archived
    </NavLink>
  </div>


    <div className="mt-2">
      <Outlet />
    </div>
  </>
  )
}

export default AccountOrganizers
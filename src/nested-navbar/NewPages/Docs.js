import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useParams } from "react-router-dom";

const Docs = () => {
  const { data } = useParams();
  console.log(data)

  const navLinks = [
    { to: `/clients/accounts/accountsdash/docs/${data}/documents`, label: 'Documents' },
    { to: `/clients/accounts/accountsdash/docs/${data}/approvals`, label: 'Approvals' },
    { to: `/clients/accounts/accountsdash/docs/${data}/signatures`, label: 'Signatures' },
    { to: `/clients/accounts/accountsdash/docs/${data}/filerequests`, label: 'File Requests' },
    { to: `/clients/accounts/accountsdash/docs/${data}/trash`, label: 'Trash' },
    { to: `/clients/accounts/accountsdash/docs/${data}/irs`, label: 'IRS' },
  ];

  return (
    <div>
      <div className="px-1 pt-4 pb-0">
        <div className="inline-flex items-center gap-1 bg-muted rounded-xl p-1 flex-wrap">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `no-underline px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/60'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="h-px bg-border mt-3" />
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  )
}

export default Docs
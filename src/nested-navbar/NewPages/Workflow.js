import React from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'

const Workflow = () => {
  const { data } = useParams();
  console.log(data)

  const navLinks = [
    { to: `/clients/accounts/accountsdash/workflow/${data}/pipelines`, label: 'Pipelines' },
    { to: `/clients/accounts/accountsdash/workflow/${data}/activejobs`, label: 'Active Jobs' },
    { to: `/clients/accounts/accountsdash/workflow/${data}/archivedjobs`, label: 'Archived Jobs' },
    { to: `/clients/accounts/accountsdash/workflow/${data}/pendingtasks`, label: 'Pending Tasks' },
    { to: `/clients/accounts/accountsdash/workflow/${data}/completetasks`, label: 'Completed Tasks' },
  ];

  return (
    <div>
      <div className="px-1 pt-4 pb-0">
        <div className="inline-flex items-center gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `no-underline px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="h-px bg-gray-100 mt-3" />
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  )
}

export default Workflow
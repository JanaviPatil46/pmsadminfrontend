import React from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'

const DashInvoices = () => {
  const { data } = useParams();

  const navLinkClass = ({ isActive }) =>
    `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'text-white'
        : 'text-muted-foreground hover:text-white'
    }`;

  return (
    <div>
      <div className="mt-5 flex flex-wrap gap-2">
        <NavLink
          to={`/clients/accounts/accountsdash/invoices/${data}/invoice`}
          className={navLinkClass}
          style={({ isActive }) => isActive ? { backgroundColor: 'var(--color-save-btn)' } : { backgroundColor: 'transparent' }}
        >
          Invoice
        </NavLink>
        <NavLink
          to={`/clients/accounts/accountsdash/invoices/${data}/payments`}
          className={navLinkClass}
          style={({ isActive }) => isActive ? { backgroundColor: 'var(--color-save-btn)' } : { backgroundColor: 'transparent' }}
        >
          Payments
        </NavLink>
      </div>
      <hr className="my-3 border-border" />
      <div className="mt-2">
        <Outlet />
      </div>
    </div>
  );
}

export default DashInvoices
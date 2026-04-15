import React from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'

const DashInvoices = () => {
  const { data } = useParams();

  const navLinkClass = ({ isActive }) =>
    `px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary text-white'
        : 'bg-transparent text-muted-foreground hover:bg-primary/10 hover:text-foreground'
    }`;

  return (
    <div>
      <div className="mt-5 flex flex-wrap gap-2">
        <NavLink
          to={`/clients/accounts/accountsdash/invoices/${data}/invoice`}
          className={navLinkClass}
        >
          Invoice
        </NavLink>
        <NavLink
          to={`/clients/accounts/accountsdash/invoices/${data}/payments`}
          className={navLinkClass}
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
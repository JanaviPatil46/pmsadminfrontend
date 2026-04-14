import React, { useState, useEffect } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Cookies from 'js-cookie';
import { useParams } from "react-router-dom";
import axios from "axios";
const AccountsDash = () => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const { data } = useParams();
  console.log("account name",data);

  useEffect(() => {
    if (data) {
    
      Cookies.set('accountId', data);

    }
  }, [data]);

  useEffect(() => {
  return () => {
    Cookies.remove('accountId');
    Cookies.remove('accountName');
    console.log("accountId cookie removed");
  };
}, []);

  const [accName, setAccName] = useState();

  // eslint-disable-next-line
  // useEffect(() => {
  //   const requestOptions = {
  //     method: "GET",
  //     redirect: "follow",
  //   };

  //   // Fetch URL with environment variable

  //   const url = `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyid/`;
  //   fetch(url + data, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result);

  //       setAccName(result.accountlist.Name);
  //        Cookies.set('accountName', result.accountlist.Name);
  //     })
  //     .catch((error) => console.error(error));
  // }, [data]);
 const fetchAccountDetails = async () => {
    try {
      const res = await axios.get(
        `https://www.snptaxes.com/api/accounts/${data}`
      );
      setAccName(res.data.accountName);
      Cookies.set('accountName',res.data.accountName)
      console.log("result", res.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };
// console.log("selected contact list",selectedContact)
  useEffect(() => {
    fetchAccountDetails();
  }, [data]);
  const navItems = [
    [`/clients/accounts/accountsdash/overview/${data}`, "Overview"],
    [`/clients/accounts/accountsdash/info/${data}`, "Info"],
    [`/clients/accounts/accountsdash/docs/${data}/documents`, "Docs"],
    [`/clients/accounts/accountsdash/communication/${data}`, "Communication"],
    [`/clients/accounts/accountsdash/organizers/${data}`, "Organizers"],
    [`/clients/accounts/accountsdash/invoices/${data}/invoice`, "Invoices"],
    [`/clients/accounts/accountsdash/email/${data}/inbox`, "Email"],
    [`/clients/accounts/accountsdash/proposals/${data}`, "Proposals & ELs"],
    [`/clients/accounts/accountsdash/notes/${data}`, "Notes"],
    [`/clients/accounts/accountsdash/workflow/${data}/pipelines`, "Workflow"],
  ];

  return (
    <div className="min-h-screen bg-gray-50/40">
      {/* Top header bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <Link
          to="/clients/accounts/activeaccounts"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors no-underline"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 text-base leading-none">{accName}</span>
          <ExternalLink size={13} className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="bg-white border-b border-gray-100 px-4 py-0">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {navItems.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `no-underline whitespace-nowrap px-4 py-3 text-sm font-medium transition-all duration-150 border-b-2 ${
                  isActive
                    ? "border-[var(--color-save-btn)] text-[var(--color-save-btn)]"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Page content */}
      <div className="px-4 py-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AccountsDash;

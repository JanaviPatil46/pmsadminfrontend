import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PiNotepad } from "react-icons/pi";
import { useParams } from "react-router-dom";


const Overview = () => {
  // Organizer
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();
  const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);

  const fetchOrganizerTemplates = async (accountid) => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${accountid}`;
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();
      console.log(data);
      setOrganizerTemplatesData(data.organizerAccountWise);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };
  useEffect(() => {
    fetchOrganizerTemplates(data);

  }, []);


  //Proposals

  useEffect(() => {
    fetchPrprosalsAllData(data);
  }, []);

  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL;
  const [ProposalsTemplates, setProposalsTemplates] = useState([]);

  const fetchPrprosalsAllData = async (data) => {
    try {
      const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/proposalbyaccount/${data}`;
      console.log(url)
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch Proposals templates");
      }
      const result = await response.json();
      console.log(result.proposalesandelsAccountwise)
      setProposalsTemplates(result.proposalesandelsAccountwise);

    } catch (error) {
      console.error("Error fetching Proposals  templates:", error);
    }
  };
  console.log(ProposalsTemplates)
  //Invoices 
  const INVOICES_API = process.env.REACT_APP_INVOICES_URL;
  const [accountInvoicesData, setAccountInvoicesData] = useState([]);
  useEffect(() => {
    fetchInvoices(data);
  }, []);

  const fetchInvoices = async (data) => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(`${INVOICES_API}/workflow/invoices/invoice/invoicelistby/accountid/${data}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          // setAccountInvoicesData(result.invoice);
          setAccountInvoicesData(result.invoice || []);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error("Error fetching email templates:", error);
      setAccountInvoicesData([]);
    }
  };
  console.log(accountInvoicesData)
// chats
const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
 const [isActiveTrue, setIsActiveTrue] = useState(true);
 const [chats, setChats] = useState([]);
  useEffect(() => {
    accountwiseChatlist(data, isActiveTrue);
  }, [data, isActiveTrue]); // Dependencies
const accountwiseChatlist = (data, isActiveTrue) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/isactivechat/${data}/${isActiveTrue}`
  console.log(url)
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("chats temp", result);
      if (result.chataccountwise) {
        setChats(result.chataccountwise); // Store the chat list
      }
      
    })
    .catch((error) => console.error(error));
};

 const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    fetchJobList(data);
  }, [data]);

  const fetchJobList = (data) => {
    const url = `${JOBS_API}/workflow/jobs/job/joblist/list/true/${data}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setJobData(result.jobList || []);
      })
      .catch((error) => {
        console.error("Error fetching job list:", error);
      });
  };

  const EmptyState = ({ label }) => (
    <div className="flex flex-col items-center py-8 text-gray-300">
      <PiNotepad className="text-5xl mb-2" />
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );

  const SectionHeader = ({ title, to }) => (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <Link to={to} className="text-xs font-medium text-blue-500 hover:text-blue-600 no-underline transition-colors">View all</Link>
    </div>
  );

  const TableHead = ({ cols }) => (
    <thead>
      <tr className="bg-gray-50 border-b border-gray-100">
        {cols.map(c => <th key={c} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{c}</th>)}
      </tr>
    </thead>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* ── LEFT COLUMN ── */}
      <div className="space-y-5">

        {/* Chats card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <SectionHeader title="Chats" to={`/clients/accounts/accountsdash/communication/${data}`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <TableHead cols={["Chat Subject"]} />
              <tbody className="divide-y divide-gray-50">
                {chats.length > 0 ? chats.map((chat) => (
                  <tr key={chat._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 text-xs text-gray-700">{chat.chatsubject}</td>
                  </tr>
                )) : (
                  <tr><td><EmptyState label="No chats available" /></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Organizers card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <SectionHeader title="Organizers" to={`/clients/accounts/accountsdash/organizers/${data}`} />
          {organizerTemplatesData && organizerTemplatesData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <TableHead cols={["Name", "Status"]} />
                <tbody className="divide-y divide-gray-50">
                  {organizerTemplatesData.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-gray-700">{row.organizertemplateid?.organizerName || "Unnamed Template"}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-400">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState label="No organizers available" />
          )}
        </div>

        {/* Proposals card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <SectionHeader title="Proposals & ELs" to={`/clients/accounts/accountsdash/proposals/${data}`} />
          {ProposalsTemplates && ProposalsTemplates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <TableHead cols={["Name", "Status"]} />
                <tbody className="divide-y divide-gray-50">
                  {ProposalsTemplates.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-gray-700">{row.proposalname}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-400">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState label="No proposals" />
          )}
        </div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="space-y-5">

        {/* Jobs card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <SectionHeader title="Jobs" to={`/clients/accounts/accountsdash/workflow/${data}/activejobs`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <TableHead cols={["Job Name", "Pipeline", "Stage"]} />
              <tbody className="divide-y divide-gray-50">
                {jobData.length > 0 ? jobData.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 text-xs text-gray-700">{job.Name}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">{job.Pipeline}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-400">—</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3}><EmptyState label="No jobs available" /></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoices card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <SectionHeader title="Unpaid Invoices" to={`/clients/accounts/accountsdash/invoices/${data}/invoice`} />
          {accountInvoicesData && accountInvoicesData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <TableHead cols={["Invoice #", "Status"]} />
                <tbody className="divide-y divide-gray-50">
                  {accountInvoicesData.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-gray-700">{row.invoicenumber}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-400">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState label="No unpaid invoices" />
          )}
        </div>
      </div>
    </div>
  )
}

export default Overview
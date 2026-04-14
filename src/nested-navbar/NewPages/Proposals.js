import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProposalPreviewDialog from "./ProposalDialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AccountProposalTable = () => {
  const { data } = useParams();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  // const [selectedProposal, setSelectedProposal] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleProposalNameClick = (proposal) => {
    setSelectedProposal(proposal);
    setOpenDialog(true);
  };
  const handleOpenDialog = (proposal) => {
    setSelectedProposal(proposal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProposal(null);
    // fetchPrprosalsAllData(accountId);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        const response = await fetch(
          `https://www.snptaxes.com/account/proposals/byaccount/${data}`,
          requestOptions
        );

        const result = await response.json();
        console.log("Fetched Proposals:", result);
        setProposals(result.proposallist || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
const handleDownload = async (proposal) => {
  if (!proposal) return;

  const {
    general,
    introduction,
    terms,
    services,
    payments,
    status,
    signature,
    signedAt,
  } = proposal;

  // ---------- INTRODUCTION ----------
  const introHtml =
    general?.introductionEnabled
      ? `
      <h2>Introduction</h2>
      ${introduction?.description || ""}
      <hr/>
    `
      : "";

  // ---------- TERMS ----------
  const termsHtml =
    general?.termsEnabled
      ? `
      <h2>Terms & Conditions</h2>
      ${terms?.description || ""}
      <hr/>
    `
      : "";

  // ---------- SERVICES (ITEMIZED) ----------
  let servicesHtml = "";

  if (general?.servicesEnabled && services?.option === "services") {
    servicesHtml = `
      <h2>Services</h2>
      <table width="100%" border="1" cellspacing="0" cellpadding="6">
        <thead>
          <tr>
            <th align="left">Service</th>
            <th align="right">Rate</th>
            <th align="right">Qty</th>
            <th align="right">Tax</th>
            <th align="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${services?.itemizedData?.lineItems
            ?.map((item) => {
              const rate = Number(item.rate || 0);
              const qty = Number(item.quantity || 1);
              const taxRate = services?.itemizedData?.taxRate || 0;
              const base = rate * qty;
              const tax = item.tax ? (base * taxRate) / 100 : 0;
              const total = base + tax;

              return `
                <tr>
                  <td>
                    <b>${item.productorService}</b><br/>
                    <small>${item.description || ""}</small>
                  </td>
                  <td align="right">$${rate.toFixed(2)}</td>
                  <td align="right">${qty}</td>
                  <td align="right">$${tax.toFixed(2)}</td>
                  <td align="right">$${total.toFixed(2)}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>

      <p style="text-align:right; font-weight:bold; margin-top:10px;">
        Total: $${services?.itemizedData?.totalAmount?.toFixed(2)}
      </p>
      <hr/>
    `;
  }

  // ---------- SERVICES (INVOICE MODE) ----------
  if (general?.servicesEnabled && services?.option === "invoice") {
    const invoice = services?.invoices?.[0];

    servicesHtml = `
      <h2>Invoice</h2>

      <p><b>Amount:</b> $${invoice?.totalAmount?.toFixed(2)}</p>
      <p><b>Invoice will be issued:</b> ${invoice?.issueinvoice}</p>
      <p><b>Description:</b> ${invoice?.description || ""}</p>

      <h3>Invoice Details</h3>
      <table width="100%" border="1" cellspacing="0" cellpadding="6">
        <thead>
          <tr>
            <th align="left">Service</th>
            <th align="right">Rate</th>
            <th align="right">Qty</th>
            <th align="right">Tax</th>
            <th align="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice?.lineItems
            ?.map((item) => {
              const rate = Number(item.rate || 0);
              const qty = Number(item.quantity || 1);
              const taxRate = invoice?.taxRate || 0;
              const base = rate * qty;
              const tax = item.tax ? (base * taxRate) / 100 : 0;
              const total = base + tax;

              return `
                <tr>
                  <td>
                    <b>${item.productorService}</b><br/>
                    <small>${item.description || ""}</small>
                  </td>
                  <td align="right">$${rate.toFixed(2)}</td>
                  <td align="right">${qty}</td>
                  <td align="right">$${tax.toFixed(2)}</td>
                  <td align="right">$${total.toFixed(2)}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>

      <p style="text-align:right; font-weight:bold;">
        Total: $${invoice?.totalAmount?.toFixed(2)}
      </p>
      <hr/>
    `;
  }

  // ---------- PAYMENTS ----------
  const paymentsHtml =
    general?.paymentsEnabled
      ? `
      <h2>Payments</h2>
      <p><b>Method:</b> ${payments?.method}</p>
      <p><b>Amount:</b> $${payments?.amount}</p>
      <hr/>
    `
      : "";

  // ---------- SIGNATURE (ONLY IF SIGNED) ----------
  let signatureHtml = `
    <h2>Sign & Accept</h2>
    <p style="color:red;">Proposal not signed yet.</p>
  `;

  if (status === "Signed") {
    signatureHtml = `
      <h2>Sign & Accept</h2>
      <p><b>Signed on:</b> ${new Date(signedAt).toLocaleString()}</p>

      <p><b>Signature:</b></p>
      ${
        signature?.startsWith("data:image")
          ? `<img src="${signature}" style="max-width:300px; border:1px solid #ccc; padding:10px;" />`
          : `<div style="font-family:cursive; font-size:24px; border:1px solid #ccc; padding:15px; width:fit-content;">
              ${signature}
            </div>`
      }

      
    `;
  }

  // ---------- FULL HTML ----------
  const fullHtml = `
    <div style="font-family: Arial, sans-serif; font-size: 12px; padding: 20px;">
      <h1 style="text-align:center;">
        ${general?.proposalName || "Proposal"}
      </h1>

      ${introHtml}
      ${termsHtml}
      ${servicesHtml}
      ${paymentsHtml}
      ${signatureHtml}
    </div>
  `;

  // ---------- RENDER ----------
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = fullHtml;
  document.body.appendChild(tempDiv);

  const canvas = await html2canvas(tempDiv, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  document.body.removeChild(tempDiv);

  const pdf = new jsPDF("p", "pt", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${general?.proposalName || "Proposal"}.pdf`);
};



  const handleTemplateClick = (proposal) => {
    console.log("proposal to edit", proposal);
    // Navigate to proposal form with the proposal ID
    navigate(
      `/clients/accounts/accountsdash/proposals/${data}/account-proposal?edit=${proposal._id}`
    );
  };

  const handleCreateNew = () => {
    // Navigate to empty proposal form
    navigate(
      `/clients/accounts/accountsdash/proposals/${data}/account-proposal`
    );
  };

  const handleMenuOpen = (event, proposal) => {
    setAnchorEl(event.currentTarget);
    setSelectedProposal(proposal);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProposal(null);
  };

  const handleDelete = async () => {
    if (!selectedProposal) return;
    if (!window.confirm("Are you sure you want to delete this proposal?")) {
      handleMenuClose();
      return;
    }

    try {
      const response = await fetch(
        `https://www.snptaxes.com/account/proposals/${selectedProposal._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete proposal");
      }
      toast.success("Proposal Deleted Successfully");
      // ✅ Remove from UI list instantly
      setProposals((prev) =>
        prev.filter((p) => p._id !== selectedProposal._id)
      );
    } catch (err) {
      console.error(err);
    } finally {
      handleMenuClose();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] gap-3">
        <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-600">Loading proposals...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Proposals List</h1>
        <button type="button" onClick={handleCreateNew}
          className="px-4 py-2 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          Create New Proposal
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm min-w-[650px]">
          <thead className="bg-blue-600">
            <tr>
              <th className="text-left px-4 py-3 text-white font-bold">Proposal Name</th>
              <th className="text-left px-4 py-3 text-white font-bold">Status</th>
              <th className="text-left px-4 py-3 text-white font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {proposals.map((proposal) => (
              <tr key={proposal._id} className="odd:bg-gray-50 hover:bg-blue-50 transition-colors">
                <td className="px-4 py-3">
                  <span
                    className="text-sm font-medium text-blue-600 cursor-pointer hover:underline"
                    onClick={() => handleOpenDialog(proposal)}
                  >
                    {proposal.general.proposalName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    proposal.status === "Signed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {proposal.status}
                  </span>
                </td>
                <td className="px-4 py-3 relative">
                  <button type="button" onClick={(e) => handleMenuOpen(e, proposal)}
                    className="p-1 text-gray-500 hover:text-gray-700">
                    <BsThreeDotsVertical />
                  </button>
                  {Boolean(anchorEl) && selectedProposal?._id === proposal._id && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={handleMenuClose} />
                      <div className="absolute right-0 z-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                        {selectedProposal?.status === "Signed" ? (
                          <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            onClick={() => { handleDownload(selectedProposal); handleMenuClose(); }}>
                            Download
                          </button>
                        ) : (
                          <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            onClick={() => { handleTemplateClick(selectedProposal); handleMenuClose(); }}>
                            Edit
                          </button>
                        )}
                        <button type="button" className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={handleDelete}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {proposals.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-base text-gray-500 mb-3">No proposals available</p>
          <button type="button" onClick={handleCreateNew}
            className="px-4 py-2 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Create Your First Proposal
          </button>
        </div>
      )}

      <ProposalPreviewDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        proposal={selectedProposal}
      />
    </div>
  );
};

export default AccountProposalTable;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProposalPreviewDialog from "./ProposalDialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "../../components/ui/button";
import { Plus, Pencil, Trash2, Download } from "lucide-react";

const AccountProposalTable = () => {
  const { data } = useParams();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
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

  const handleDelete = async (proposal) => {
    if (!proposal) return;
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;

    try {
      const response = await fetch(
        `https://www.snptaxes.com/account/proposals/${proposal._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete proposal");
      toast.success("Proposal Deleted Successfully");
      setProposals((prev) => prev.filter((p) => p._id !== proposal._id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] gap-3">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading proposals...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 px-4 py-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Proposals List</h1>
        <Button type="button" size="sm" onClick={handleCreateNew}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Create New Proposal
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[55%]" />
            <col className="w-[20%]" />
            <col className="w-[25%]" />
          </colgroup>
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proposal Name</th>
              <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-2 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {proposals.map((proposal) => (
              <tr key={proposal._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-2 py-1.5 truncate">
                  <span
                    className="text-xs font-medium text-primary hover:text-primary/80 cursor-pointer"
                    onClick={() => handleOpenDialog(proposal)}
                  >
                    {proposal.general.proposalName}
                  </span>
                </td>
                <td className="px-2 py-1.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    proposal.status === "Signed"
                      ? "bg-green-500/10 text-green-600 border border-green-500/20"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {proposal.status}
                  </span>
                </td>
                <td className="px-2 py-1.5">
                  <div className="flex items-center justify-end gap-0.5">
                    {proposal.status === "Signed" ? (
                      <Button
                        type="button" variant="ghost" size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Download"
                        onClick={() => handleDownload(proposal)}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <Button
                        type="button" variant="ghost" size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="Edit"
                        onClick={() => handleTemplateClick(proposal)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      type="button" variant="ghost" size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete"
                      onClick={() => handleDelete(proposal)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {proposals.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-base text-muted-foreground mb-3">No proposals available</p>
          <Button type="button" size="sm" onClick={handleCreateNew}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Create Your First Proposal
          </Button>
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

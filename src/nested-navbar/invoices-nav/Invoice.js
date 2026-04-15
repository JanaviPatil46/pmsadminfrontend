import React, { useEffect, useState, useRef } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { toast } from "react-toastify";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import CreateInvoice from "../invoices-nav/CreateInvoice";
import UpdateInvoice from "../invoices-nav/UpdateInvoice";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Invoice = () => {
  const navigate = useNavigate();
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const INVOICES_API = process.env.REACT_APP_INVOICES_URL;
  const [showInvoiceTemplateForm, setShowInvoiceTemplateForm] = useState(false);
  const [showInvoiceUpdateForm, setShowInvoiceUpdateForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [tempIdget, setTempIdGet] = useState("");
  const [accountInvoicesData, setAccountInvoicesData] = useState([]);
  const { data } = useParams();

  useEffect(() => {
    fetchInvoices(data);
  }, []);

  // Overdue detection helper
  const isInvoiceOverdue = (invoice, paymentTermDays = 5) => {
    if (!invoice.invoicedate || invoice.invoiceStatus === "Paid") return false;

    const invoiceDate = new Date(invoice.invoicedate);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + paymentTermDays);

    const today = new Date();
    const isUnpaid = invoice.invoiceStatus === "Pending";
    const hasBalanceDue =
      invoice.balanceDueAmount === null || invoice.balanceDueAmount > 0;

    return today > dueDate && isUnpaid && hasBalanceDue;
  };
  const fetchInvoices = async (data) => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        `${INVOICES_API}/workflow/invoices/invoice/invoicelistby/accountid/${data}`,
        requestOptions
      );
      const result = await response.json();

      if (result.invoice) {
        const updatedInvoices = await Promise.all(
          result.invoice.map(async (invoice) => {
            if (isInvoiceOverdue(invoice)) {
              await fetch(
                `${INVOICES_API}/workflow/invoices/invoicestatus/${invoice.invoicenumber}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ invoiceStatus: "Overdue" }),
                }
              );
              return { ...invoice, invoiceStatus: "Overdue" };
            }
            return invoice;
          })
        );
        setAccountInvoicesData(updatedInvoices);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  console.log(accountInvoicesData);
  const [anchorEl, setAnchorEl] = useState(null);
  // const toggleMenu = (_id) => {
  //   setOpenMenuId(openMenuId === _id ? null : _id);
  //   setTempIdGet(_id);
  // };
  const toggleMenu = (event, _id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(_id);
    setTempIdGet(_id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
    setTempIdGet(null);
  };
  const handleDelete = async (_id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (!isConfirmed) return;

    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${INVOICES_API}/workflow/invoices/invoice/${_id}`;

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      toast.success("Invoice deleted successfully");
      handleMenuClose();
      // ✅ Optimistic UI update: remove the deleted invoice from state
      setAccountInvoicesData((prev) => prev.filter((inv) => inv._id !== _id));

      // ✅ Also refresh from backend to stay in sync
      await fetchInvoices(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete invoice");
    }
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentInvoice, setCurrentInvoice] = useState(null);

  const handleUpdateStatus = (invoiceNumber, status) => {
    if (!invoiceNumber || !status) return;

    fetch(`${INVOICES_API}/workflow/invoices/invoicestatus/${invoiceNumber}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceStatus: status }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Invoice status updated:", result);
        // Optionally refresh data here
      })
      .catch((error) => console.error("Error updating invoice status:", error));
  };

  //***********Invoice Create */

  const handleCreateInvoiceClick = () => {
    setShowInvoiceTemplateForm(true);
  };

  const handleClose = () => {
    setShowInvoiceTemplateForm(false);
    fetchInvoices(data);
  };

  const handleInvoiceUpdateClose = () => {
    setShowInvoiceUpdateForm(false);
    fetchInvoices(data);
  };

  const [invoiceId, SetInvoiceId] = useState();
  const handleEdit = (_id) => {
    setShowInvoiceUpdateForm(true);
    handleMenuClose();
    SetInvoiceId(_id);
    // navigate("/" + _id);
  };
  console.log(invoiceId);

  const handleDuplicate = async (_id) => {
    // Find the template by its ID
    const InvoiceToDuplicate = accountInvoicesData.find(
      (template) => template._id === _id
    );
    if (!InvoiceToDuplicate) {
      toast.error("Invocie not found");
      return;
    }
    // Create a new template object (with new ID and modified template name)
    const duplicatedInvoice = {
      ...InvoiceToDuplicate,
      invoiceLabel: "Copy",
      // invoicenumber: `${InvoiceToDuplicate.invoicenumber} (Copy)`, // Indicate it's a duplicate
    };
    console.log(duplicatedInvoice);
    try {
      // Prepare request options
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(duplicatedInvoice);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      // Send the duplicated template to the server
      const response = await fetch(
        `${INVOICES_API}/workflow/invoices/invoice`,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      if (result.message === "Invoice created successfully") {
        toast.success("Invoice duplicated successfully");
        handleMenuClose();
        fetchInvoices(data); // Refresh the list after duplication
      } else {
        toast.error(result.error || "Failed to duplicate Invoice");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error duplicating template");
    }
  };

  const handlePrint = async (_id) => {
    try {
      const response = await fetch(
        `${INVOICES_API}/workflow/invoices/invoice/invoiceforprint/${_id}`
      );
      const invoiceData = await response.json();
      console.log(invoiceData);

      const accountName =
        invoiceData.invoice.account.accountName || "Unknown Account";
      // Construct the HTML for printing
      const printContent = `

            <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;

          }
          .invoice-container {
            max-width: 800px;
            margin: auto;
            padding: 20px;

          }
          h1 {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            color: #555;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .summary-table {
            width: 50%;
            margin-left: auto;
            margin-top: 20px;
            border: none;
          }
          .summary-table td {
            border: none;
            padding: 10px 0;
          }
          .total-row td {
            font-weight: bold;
          }
        </style>
        <div style="font-family: Arial, sans-serif; padding: 35px;">
          <h1>Invoice Number #${invoiceData.invoice.invoicenumber}</h1>
          <p><strong>Date:</strong> ${new Date(invoiceData.invoice.invoicedate).toLocaleDateString()}</p>
          <p><strong>${accountName}</strong></p>
          <p><strong>Description:</strong> ${invoiceData.invoice.description}</p>
          

         <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th>Product/Service</th>
                <th>Rate</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.invoice.lineItems
                .map(
                  (item) => `
                <tr>
                  <td>${item.productorService}</td>
                  <td>$${item.rate}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.amount}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

                <table class="summary-table">
            <tbody>
              <tr>
                <td><strong>Subtotal</strong></td>
                <td>$${invoiceData.invoice.summary.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Tax</strong></td>
                <td>$${invoiceData.invoice.summary.taxTotal.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Total</strong></td>
                <td>$${invoiceData.invoice.summary.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

        </div>
      `;

      // Open a new window and print the content
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Invoice</title>
          </head>
          <body onload="window.print(); window.close();">
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      handleMenuClose();
    } catch (error) {
      console.error("Error printing invoice:", error);
      toast.error("Failed to print invoice");
    }
  };

  const handleDownload = async (_id) => {
    try {
      const response = await fetch(
        `${INVOICES_API}/workflow/invoices/invoice/invoiceforprint/${_id}`
      );
      const invoiceData = await response.json();
      console.log(invoiceData);
      const doc = new jsPDF();

      // Set up styles for the PDF
      doc.setFont("Arial", "normal");
      doc.setFontSize(14);
      doc.text(`Invoice Number: ${invoiceData.invoice.invoicenumber}`, 10, 10);
      doc.text(
        `Date: ${new Date(invoiceData.invoice.invoicedate).toLocaleDateString()}`,
        10,
        20
      );
      doc.text(`Description: ${invoiceData.invoice.description}`, 10, 30);
      const accountName =
        invoiceData.invoice.account.accountName || "Unknown Account";
      doc.text(`Account Name: ${accountName}`, 10, 40);

      // Create line items table
      doc.autoTable({
        startY: 50,
        head: [["Product/Service", "Rate", "Quantity", "Amount"]],
        body: invoiceData.invoice.lineItems.map((item) => [
          item.productorService,
          `$${item.rate}`,
          item.quantity,
          `$${item.amount}`,
        ]),
        theme: "grid", // Choose a theme, 'grid', 'striped', etc.
        headStyles: {
          fillColor: [242, 242, 242], // Light gray background for header
          textColor: [51, 51, 51], // Dark text color
        },
        styles: {
          textColor: [85, 85, 85], // Text color
          fontSize: 12,
          halign: "left", // Align text to left
        },
      });

      // Summary section
      const summaryY = doc.autoTable.previous.finalY + 10;
      doc.setFontSize(12);
      doc.text(
        `Subtotal: $${invoiceData.invoice.summary.subtotal.toFixed(2)}`,
        10,
        summaryY
      );
      doc.text(
        `Tax: $${invoiceData.invoice.summary.taxTotal.toFixed(2)}`,
        10,
        summaryY + 10
      );
      doc.setFontSize(14);
      doc.text(
        `Total: $${invoiceData.invoice.summary.total.toFixed(2)}`,
        10,
        summaryY + 20
      );

      // Save the PDF to local storage
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `Invoice_${invoiceData.invoice.invoicenumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success("Invoice downloaded successfully");
      handleMenuClose();
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid": return "bg-success/10 text-success border border-success/20";
      case "Overdue": return "bg-destructive/10 text-destructive border border-destructive/20";
      case "Pending": return "bg-warning/10 text-warning border border-warning/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleCreateInvoiceClick}
        className="mb-4 px-5 py-2 rounded-full text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
      >
        New Invoice
      </button>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Invoice #</th>
              <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Status</th>
              <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Posted</th>
              <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Total</th>
              <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Amount Paid</th>
              <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Balance Due</th>
              <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Last Paid</th>
              <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Description</th>
              <th className="text-xs font-semibold tracking-wide uppercase text-left px-4 py-3 text-muted-foreground">Settings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.isArray(accountInvoicesData) && accountInvoicesData.map((row, idx) => (
              <tr key={row._id} className="bg-white transition-colors hover:bg-muted/30">
                <td
                  className="text-xs px-4 py-2.5 leading-tight cursor-pointer text-primary hover:text-primary/80 font-medium"
                  onClick={() => handleEdit(row._id)}
                >
                  {row.invoicenumber}{" "}
                  {row.invoiceLabel && (
                    <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                      {row.invoiceLabel}
                    </span>
                  )}
                </td>
                <td className="text-xs px-4 py-2.5 leading-tight">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(row.invoiceStatus)}`}>
                    {row.invoiceStatus}
                  </span>
                </td>
                <td className="text-xs px-4 py-2.5 leading-tight text-foreground">
                  {new Intl.DateTimeFormat("en-US", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(row.createdAt))}
                </td>
                <td className="text-xs px-4 py-2.5 leading-tight text-foreground">${row.summary.total}</td>
                <td className="text-xs px-4 py-2.5 leading-tight text-foreground">${row.paidAmount}</td>
                <td className="text-xs px-4 py-2.5 leading-tight text-foreground">${row.summary.total - row.paidAmount}</td>
                <td className="text-xs px-4 py-2.5 leading-tight text-muted-foreground">{row.lastPaid}</td>
                <td className="text-xs px-4 py-2.5 leading-tight text-muted-foreground max-w-[200px] truncate">{row.description}</td>
                <td className="text-xs px-4 py-2.5 leading-tight">
                  <div className="relative inline-block">
                    <button
                      onClick={(event) => toggleMenu(event, row._id)}
                      className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <CiMenuKebab className="text-base" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dropdown Menu */}
      {Boolean(anchorEl) && (
        <>
          <div className="fixed inset-0 z-30" onClick={handleMenuClose} />
          <div
            className="fixed z-40 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[130px]"
            style={{
              top: anchorEl.getBoundingClientRect().bottom + 4,
              left: anchorEl.getBoundingClientRect().left,
            }}
          >
            <button onClick={() => handleEdit(tempIdget)} className="w-full text-left px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors">Edit</button>
            <button onClick={() => handleDelete(tempIdget)} className="w-full text-left px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors">Delete</button>
            <button onClick={() => handleDuplicate(tempIdget)} className="w-full text-left px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors">Duplicate</button>
            <button onClick={() => handlePrint(tempIdget)} className="w-full text-left px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors">Print</button>
            <button onClick={() => handleDownload(tempIdget)} className="w-full text-left px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors">Download</button>
          </div>
        </>
      )}

      {/* Update Status Dialog */}
      {openDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpenDialog(false)} />
          <div className="relative z-50 w-[340px] bg-card rounded-xl p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-foreground mb-4">Update Invoice Status</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-4"
            >
              <option value="">Select Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setOpenDialog(false)} className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors">Cancel</button>
              <button
                onClick={() => { handleUpdateStatus(currentInvoice, selectedStatus); setOpenDialog(false); }}
                disabled={!selectedStatus}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Drawer */}
      {showInvoiceTemplateForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={handleClose} />
          <div className="ml-auto relative z-50 w-full max-w-[60%] bg-background h-full overflow-y-auto shadow-2xl">
            <CreateInvoice onClose={handleClose} />
          </div>
        </div>
      )}

      {/* Update Invoice Drawer */}
      {showInvoiceUpdateForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={handleInvoiceUpdateClose} />
          <div className="ml-auto relative z-50 w-full max-w-[60%] bg-background h-full overflow-y-auto shadow-2xl">
            <UpdateInvoice onClose={handleInvoiceUpdateClose} invoiceData={invoiceId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;

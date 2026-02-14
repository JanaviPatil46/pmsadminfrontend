import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Chip,
  Button,
  IconButton,
  MenuItem,
  Menu,
  Checkbox,
  TablePagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProposalPreviewDialog from "./ProposalDialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DeleteOutlineRounded } from "@mui/icons-material";
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
          requestOptions,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProposals = proposals.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const isSelected = (id) => selectedIds.includes(id);
  console.log("Selected IDs:", selectedIds);

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSelectAllPage = (event) => {
    if (event.target.checked) {
      const pageIds = paginatedProposals.map((p) => p._id);
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    } else {
      const pageIds = paginatedProposals.map((p) => p._id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const allPageSelected =
    paginatedProposals.length > 0 &&
    paginatedProposals.every((p) => selectedIds.includes(p._id));

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
    const introHtml = general?.introductionEnabled
      ? `
      <h2>Introduction</h2>
      ${introduction?.description || ""}
      <hr/>
    `
      : "";

    // ---------- TERMS ----------
    const termsHtml = general?.termsEnabled
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
    const paymentsHtml = general?.paymentsEnabled
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
      `/clients/accounts/accountsdash/proposals/${data}/account-proposal?edit=${proposal._id}`,
    );
  };

  const handleCreateNew = () => {
    // Navigate to empty proposal form
    navigate(
      `/clients/accounts/accountsdash/proposals/${data}/account-proposal`,
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
const handleBulkDelete = async () => {
  // if (!selectedProposal) return;

  if (!window.confirm("Are you sure you want to delete this proposal?")) {
    handleMenuClose();
    return;
  }

  try {
    const response = await fetch(
      "https://www.snptaxes.com/account/proposals/delete-multiple",
      {
        method: "DELETE", // or POST if backend uses POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proposalIds: selectedIds, // 🔹 send as array
        }),
      }
    );

    const data = await response.json();

    // if (!response.ok) {
    //   throw new Error(data.message || "Failed to delete proposal");
    // }

    toast.success(data.message || "Proposal deleted successfully");

    // ✅ Remove from UI instantly
    setProposals((prev) =>
      prev.filter((p) => !selectedIds.includes(p._id))
    );
  } catch (err) {
    console.error("Delete proposal error:", err);
    toast.error(err.message || "Failed to delete proposal");
  } finally {
    handleMenuClose();
  }
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
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("Failed to delete proposal");
      }
      toast.success("Proposal Deleted Successfully");
      // ✅ Remove from UI list instantly
      setProposals((prev) =>
        prev.filter((p) => p._id !== selectedProposal._id),
      );
    } catch (err) {
      console.error(err);
    } finally {
      handleMenuClose();
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading proposals...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Proposals List</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateNew}>
          Create New Proposal
        </Button>
      </Box>
<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
       
        {selectedIds.length > 0 &&  (
          <DeleteOutlineRounded
            sx={{ color: "red", cursor: "pointer" }}
            onClick={handleBulkDelete}
          />
        )}
       
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allPageSelected}
                  indeterminate={selectedIds.length > 0 && !allPageSelected}
                  onChange={handleSelectAllPage}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Proposal Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProposals.map((proposal) => (
              <TableRow
                key={proposal._id}
                selected={isSelected(proposal._id)}
                sx={{
                  "&:hover": { backgroundColor: "action.selected" },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected(proposal._id)}
                    onChange={() => handleSelectRow(proposal._id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{ cursor: "pointer" }}
                    color="primary"
                    onClick={() => handleOpenDialog(proposal)}
                  >
                    {proposal.general.proposalName}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={proposal.status}
                    color={proposal.status === "Signed" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, proposal)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={proposals.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedProposal?.status === "Signed" ? (
          <MenuItem
            onClick={() => {
              handleDownload(selectedProposal);
              handleMenuClose();
            }}
          >
            Download
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleTemplateClick(selectedProposal);
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>
        )}

        <MenuItem sx={{ color: "red" }} onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>

      {proposals.length === 0 && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No proposals available
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateNew}
            sx={{ mt: 2 }}
          >
            Create Your First Proposal
          </Button>
        </Box>
      )}

      <ProposalPreviewDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        proposal={selectedProposal}
      />
    </Box>
  );
};

export default AccountProposalTable;

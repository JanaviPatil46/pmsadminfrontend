import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Button,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TableContainer,
  Menu,
  DialogActions,
  TextField,
  DialogTitle,
  Checkbox,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import OrganizerUpdate from "../NewPages/OrganizerUpdate";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import OrganizerDialog from "./OrganizerDialog";
import { DeleteOutlineRounded } from "@mui/icons-material";
const Organizers = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();
  console.log(data);
  const navigate = useNavigate();

  const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);
  const [tempIdget, setTempIdGet] = useState("");
  const [showOrganizerTemplateForm, setShowOrganizerTemplateForm] =
    useState(false);

  //for active & Archived
  const [activeButton, setActiveButton] = useState("active");
  const [isActiveTrue, setIsActiveTrue] = useState(true);
  const [activeorarchive, setActiveorarchive] = React.useState("Active");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedIds, setSelectedIds] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // rows visible on current page
  const paginatedRows = organizerTemplatesData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const isSelected = (id) => selectedIds.includes(id);

  // Select single row
  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Select all rows on current page
  const handleSelectAllPage = (event) => {
    if (event.target.checked) {
      const pageIds = paginatedRows.map((row) => row._id);
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    } else {
      const pageIds = paginatedRows.map((row) => row._id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const allPageSelected =
    paginatedRows.length > 0 &&
    paginatedRows.every((row) => selectedIds.includes(row._id));

  const handleActiveClick = () => {
    setIsActiveTrue(true);
    setActiveButton("active");
    setActiveorarchive("Archive");
    // fetchOrganizerTemplates(data,true)
    fetchOrganizerTemplates();
    console.log("Active action triggered.");
  };

  const handleArchivedClick = () => {
    setIsActiveTrue(false);
    setActiveButton("archived");
    setActiveorarchive("Active");
    // fetchOrganizerTemplates(data,false)
    fetchOrganizerTemplates();
    console.log("Archive action triggered.");
  };
  const handleArchive = (_id, isActive) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Toggle active state
    const raw = JSON.stringify({
      active: !isActive,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/active-archive/${_id}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // if (result.message === "Organizer AccountWise Updated successfully") {
        toast.success("Organizer updated successfully");
        fetchOrganizerTemplates(data);
        // }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while updating organizer");
      });
  };

  const fetchOrganizerTemplates = async (accountid) => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${accountid}/${isActiveTrue}`;

      console.log("|URLLL", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();
      console.log(data);
      setOrganizerTemplatesData(data.organizerAccountWise);
      console.log("orgData:", data.organizerAccountWise);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };
  useEffect(() => {
    fetchOrganizerTemplates(data);
  }, [isActiveTrue]);

  const handleSealed = (_id, issealed) => {
    // navigate('OrganizerTempUpdate/' + _id)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      issealed: issealed,
      // status: "In Progress"

      ...(issealed === false && { status: "In Progress" }),
    });
    console.log("raw", raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${_id}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.message === "Organizer AccountWise Updated successfully") {
          toast.success("Organizer Updated successfully.");
          fetchOrganizerTemplates(data);
        }
      })
      .catch((error) => console.error(error));
  };
  const [anchorEl, setAnchorEl] = useState(null);

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
  const handleCreateInvoiceClick = () => {
    setShowOrganizerTemplateForm(true);
    navigate(
      `/clients/accounts/accountsdash/organizers/${data}/accountorganizer`,
    );
  };
  const deleteById = (_id) => {
  const requestOptions = {
    method: "DELETE",
    redirect: "follow",
  };

  const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/`;

  return fetch(url + _id, requestOptions).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to delete item");
    }
    return response.text();
  });
};

const handleBulkDelete = async () => {
  if (selectedIds.length === 0) {
    toast.warning("Please select at least one item");
    return;
  }

  const isConfirmed = window.confirm(
    `Are you sure you want to delete ${selectedIds.length} selected templates?`
  );

  if (!isConfirmed) return;

  try {
    await Promise.all(selectedIds.map((id) => deleteById(id)));

    toast.success("Selected items deleted successfully");
    setSelectedIds([]); // clear selection
    fetchOrganizerTemplates(data);
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete some items");
  }
};

  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this organizer template?",
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.text();
        })
        .then((result) => {
          console.log(result);
          toast.success("Item deleted successfully");
          fetchOrganizerTemplates(data);
          // setshowOrganizerTemplateForm(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };
  useEffect(() => {
    fetchOrganizerTemplates(data);
  }, []);

  const [selectedOrganizer, SetSelectedOrganizer] = useState({});
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [renameRowId, setRenameRowId] = React.useState(null);
  const [renameValue, setRenameValue] = React.useState("");
  const handleRenameConfirm = async (id, newName) => {
    if (!newName || newName.trim() === "") return;

    try {
      const response = await axios.patch(
        `${ORGANIZER_TEMP_API}/workflow/orgaccwise/rename/${id}`, // use the rename endpoint
        { organizerName: newName }, // send only organizerName
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        toast.success("Organizer Renamed successfully");
        // Update frontend table immediately
        setOrganizerTemplatesData((prev) =>
          prev.map((row) =>
            row._id === id ? { ...row, organizerName: newName } : row,
          ),
        );
      } else {
        console.error("Failed to update organizer name in DB");
      }
    } catch (error) {
      console.error("Error updating organizer name:", error);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const handleEdit = (_id) => {
    SetSelectedOrganizer(_id);
    setShowForm(true);
  };
  const handleClosePreview = () => {
    setShowForm(false);
  };
  const handleDownload = async (organizer) => {
    if (!organizer) return;

    // ------------------ CLEAN TEXT FUNCTION ------------------
    const stripHtml = (html) => {
      if (!html) return "";

      let text = html;

      // remove spaced-out html tags:  < p > , < / b r >
      text = text.replace(/<\s*\/?\s*[^>]*\s*>/g, " ");

      // remove normal html tags
      text = text.replace(/<[^>]+>/g, " ");

      // decode html entities
      const textarea = document.createElement("textarea");
      textarea.innerHTML = text;
      text = textarea.value;

      // remove weird MS Word / non-ASCII garbage characters
      text = text.replace(/[^\x00-\x7F]+/g, " ");

      // remove control characters
      text = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");

      // fix letter separated text like: W e l c o m e
      text = text.replace(/(\w)\s(?=\w)/g, "$1");

      // collapse extra spaces and line breaks
      text = text.replace(/\s+/g, " ").trim();

      return text;
    };

    // ------------------ PDF INIT ------------------
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let y = 40;

    // ------------------ TITLE ------------------
    pdf.setFontSize(16);
    pdf.text(organizer?.organizerName || "Organizer", 40, y);
    y += 25;

    // ------------------ LOOP SECTIONS ------------------
    for (const section of organizer?.sections || []) {
      if (!section) continue;

      // add new page if needed
      if (y > pageHeight - 80) {
        pdf.addPage();
        y = 40;
      }

      // section title
      pdf.setFontSize(14);
      pdf.text(section?.name || "Section", 40, y);
      y += 20;

      // ------------------ LOOP FORM ELEMENTS ------------------
      for (const el of section?.formElements || []) {
        if (!el) continue;

        // skip unanswered elements
        if (
          !el.textvalue &&
          !el.files?.length &&
          !el.imageUrl &&
          !el.images?.length
        ) {
          continue;
        }

        // page break protection
        if (y > pageHeight - 120) {
          pdf.addPage();
          y = 40;
        }

        // question
        pdf.setFontSize(12);
        pdf.text(`Q: ${stripHtml(el.text || "")}`, 40, y);
        y += 16;

        // ------------------ TEXT ANSWER ------------------
        if (el.textvalue) {
          const cleanAnswer = stripHtml(el.textvalue);

          const textLines = pdf.splitTextToSize(
            `A: ${cleanAnswer}`,
            pageWidth - 80,
          );
          pdf.text(textLines, 40, y);
          y += textLines.length * 14;
        }

        // ------------------ IMAGES ------------------
        if (el.imageUrl || el.images?.length) {
          const images = el.images || [el.imageUrl];

          for (const img of images) {
            try {
              const res = await fetch(img, { mode: "cors" });
              const blob = await res.blob();

              const reader = new FileReader();
              await new Promise((resolve) => {
                reader.onloadend = resolve;
                reader.readAsDataURL(blob);
              });

              const imgWidth = 180;
              const imgHeight = 130;

              if (y > pageHeight - 180) {
                pdf.addPage();
                y = 40;
              }

              pdf.addImage(reader.result, "JPEG", 40, y, imgWidth, imgHeight);
              y += imgHeight + 10;
            } catch (e) {
              pdf.text("Image could not be loaded", 40, y);
              y += 14;
            }
          }
        }

        // ------------------ FILE LIST ------------------
        if (el.files?.length) {
          pdf.setFontSize(11);

          for (const f of el.files) {
            const fname = f?.name || "File";

            const line = pdf.splitTextToSize(
              `Attached File: ${fname}`,
              pageWidth - 80,
            );

            pdf.text(line, 40, y);
            y += line.length * 14;
          }
        }

        y += 6;
      }

      y += 10;
    }

    // ------------------ SAVE PDF ------------------
    pdf.save(`${organizer?.organizerName || "organizer"}_answers.pdf`);
  };

  const printOrganizerData = (id) => {
    const organizer = organizerTemplatesData.find((org) => org._id === id);

    if (!organizer) {
      toast.error("Organizer not found.");
      return;
    }

    const sectionsHtml = organizer.sections
      .map((section) => {
        const formElementsHtml = section.formElements
          .map(
            (element) => `
            <div style="margin-bottom: 20px;">
              <strong>${element.text}</strong>
              <span style="margin-left: 5px; display: block; margin-top: 5px;">
                <strong>Answer:</strong> ${element.textvalue ?? "________"}
              </span>
            </div>
          `,
          )
          .join("");

        return `
        <div style="margin-bottom: 20px;">
          <h3>${section.name}</h3>
          ${formElementsHtml}
        </div>
      `;
      })
      .join("");

    const printContent = `
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { color: #2c59fa; }
      h3 { color: #555; margin-top: 20px; }
    </style>

    <h1>Organizer Data</h1>
    ${sectionsHtml}
  `;

    // Open a new window & auto-print & auto-close
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <html>
      <head>
        <title>Print Organizer</title>
      </head>
      <body onload="window.print(); window.close();">
        ${printContent}
      </body>
    </html>
  `);

    printWindow.document.close();
    handleMenuClose();
  };

  const [openDialog, setOpenDialog] = useState(false);
  // const [selectedOrganizer, setSelectedOrganizer] = useState(null);

  const handleOpenDialog = (organizer) => {
    SetSelectedOrganizer(organizer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    SetSelectedOrganizer(null);
    // fetchOrganizers();
  };
  return (
    <Box sx={{ mt: 2 }}>
      <Button
        variant="contained"
        onClick={handleCreateInvoiceClick}
        sx={{
          backgroundColor: "var(--color-save-btn)", // Normal background

          "&:hover": {
            backgroundColor: "var(--color-save-hover-btn)", // Hover background color
          },
          mb: 3,
          borderRadius: "15px",
        }}
      >
        New Organizer
      </Button>
      {/* <MaterialReactTable columns={columns} table={table} /> */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            style={{
              backgroundColor:
                activeButton === "active"
                  ? "var(--color-save-btn)"
                  : "transparent",
              color: activeButton === "active" ? "white" : "black",
              fontWeight: activeButton === "active" ? "bold" : "normal",
              padding: "4px 8px",
              borderRadius: "10px",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={handleActiveClick}
          >
            Active
          </Typography>

          <Typography
            style={{
              backgroundColor:
                activeButton === "archived"
                  ? "var(--color-save-btn)"
                  : "transparent",
              color: activeButton === "archived" ? "white" : "black",
              fontWeight: activeButton === "archived" ? "bold" : "normal",
              padding: "4px 8px",
              borderRadius: "10px",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={handleArchivedClick}
          >
            Archived
          </Typography>
        </Box>
          
      </Box>
      {!showForm ? (
        // <Paper>
        <>
          {selectedIds.length > 0 && (
            <>
              <DeleteOutlineRounded sx={{ color: "red", cursor: "pointer" }} onClick={handleBulkDelete} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
               ({selectedIds.length} item(s) selected)
              </Typography>
            </>
          )}
          <TableContainer component={Paper} sx={{ overflow: "visible" }}>
            <Table sx={{ width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allPageSelected}
                      indeterminate={selectedIds.length > 0 && !allPageSelected}
                      onChange={handleSelectAllPage}
                    />
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="250"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100"
                  >
                    Last Updated
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100"
                  >
                    Progress
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100"
                  >
                    Seal
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100"
                  >
                    Settings
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row) => (
                  <TableRow key={row._id} selected={isSelected(row._id)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(row._id)}
                        onChange={() => handleSelectRow(row._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                          cursor: "pointer",
                          color: "#3f51b5",
                        }}
                        onClick={() => handleEdit(row._id)}
                      >
                        {row.organizerName}
                      </Typography>
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                        cursor: "pointer",
                        // {row.updatedAt}
                      }}
                    >
                      {" "}
                      {new Intl.DateTimeFormat("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(new Date(row.updatedAt))}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                        cursor: "pointer",
                      }}
                    >
                      <Chip
                        label={row.status || "Pending"}
                        color={
                          row.status === "Completed" ? "success" : "default"
                        }
                        size="small"
                        sx={{ border: "none" }}
                      />
                          
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                        cursor: "pointer",
                      }}
                    >
                      {row.sections.length}
                    </TableCell>{" "}
                    {/* Show the number of sections */}
                    <TableCell
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                        cursor: "pointer",
                      }}
                    >
                      {row.issealed ? (
                        <Chip
                          label="Sealed"
                          color="primary"
                          sx={{
                            color: "#fff",

                            fontSize: "11px",
                          }}
                        />
                      ) : null}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                      }}
                    >
                      <IconButton
                        onClick={(event) => toggleMenu(event, row._id)}
                        style={{ color: "#2c59fa" }}
                        size="small"
                      >
                        <CiMenuKebab />
                      </IconButton>

                      {/* MUI Menu */}
                      <Menu
                        anchorEl={anchorEl}
                        open={openMenuId === row._id}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            ml: 1,
                            boxShadow: 3,
                            borderRadius: 1,
                            minWidth: 140,
                            p: 1,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleSealed(row._id, !row.issealed);
                              handleMenuClose();
                            }}
                          >
                            {row.issealed ? "Unseal" : "Seal"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleDownload(row); // Pass current organizer
                              handleMenuClose();
                            }}
                          >
                            Download
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleDelete(row._id);
                              handleMenuClose();
                            }}
                          >
                            Delete
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleOpenDialog(row);
                              handleMenuClose();
                            }}
                          >
                            Change Answers
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleArchive(row._id, row.active);
                              handleMenuClose();
                            }}
                          >
                            {row.active ? "Archive" : "Restore"}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              printOrganizerData(row._id);
                              handleMenuClose();
                            }}
                          >
                            Print
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setRenameRowId(row._id);
                              setRenameValue(row.organizerName); // Pre-fill current name
                              setRenameDialogOpen(true);
                              handleMenuClose();
                            }}
                          >
                            Rename
                          </Typography>
                        </Box>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={organizerTemplatesData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />

          <Dialog
            open={renameDialogOpen}
            onClose={() => setRenameDialogOpen(false)}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>Rename Organizer</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="New Name"
                type="text"
                fullWidth
                variant="outlined"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setRenameDialogOpen(false)}
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleRenameConfirm(renameRowId, renameValue);
                  setRenameDialogOpen(false);
                }}
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Box>
          {" "}
          <OrganizerUpdate
            OrganizerData={selectedOrganizer}
            onClose={handleClosePreview}
          />
        </Box>
      )}

      <OrganizerDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        organizer={selectedOrganizer}
        accountid={data}
      />
    </Box>
  );
};

export default Organizers;

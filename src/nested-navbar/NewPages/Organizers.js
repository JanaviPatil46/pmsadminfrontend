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
  TableContainer,Menu,DialogActions,TextField,DialogTitle
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
import OrganizerDialog from "./OrganizerDialog"
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

  fetch(`${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/active-archive/${_id}`, requestOptions)
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
      // const url = http://127.0.0.1:7600/workflow/orgaccwise/organizeraccountwise/${isActiveTrue}/${accountid};

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
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${_id}`,
      requestOptions
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
  const handleCreateInvoiceClick = () => {
    setShowOrganizerTemplateForm(true);
    navigate(
      `/clients/accounts/accountsdash/organizers/${data}/accountorganizer`
    );
  };

  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this organizer template?"
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
      }
    );

    if (response.status === 200) {
      toast.success("Organizer Renamed successfully")
      // Update frontend table immediately
      setOrganizerTemplatesData((prev) =>
        prev.map((row) =>
          row._id === id ? { ...row, organizerName: newName } : row
        )
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

  // Construct sections HTML (only answered questions)
  const sectionsHtml = (organizer.sections || [])
    .map((section) => {
      const answeredElements = (section.formElements || []).filter(
        (el) => el.textvalue && el.textvalue.trim() !== ""
      );

      if (answeredElements.length === 0) return "";

      const formElementsHtml = answeredElements
        .map(
          (element) => `
        <div style="margin-bottom: 10px;">
          <strong>${element.text}</strong>
          <div style="margin-left: 10px; margin-top: 5px;">
            <strong>Answer:</strong> ${element.textvalue}
          </div>
        </div>
      `
        )
        .join("");

      return `
        <div style="margin-bottom: 15px;">
          <h3 style="margin-bottom: 5px;">${section.name}</h3>
          ${formElementsHtml}
        </div>
      `;
    })
    .join("");

  // Wrap in a container
  const containerHtml = `
    <div style="font-family: Arial, sans-serif; font-size: 12px; padding: 20px;">
      <h2>${organizer.organizerName}</h2>
      ${sectionsHtml || "<p>No answered questions available.</p>"}
    </div>
  `;

  // Create a temporary container in DOM
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = containerHtml;
  document.body.appendChild(tempDiv);

  // Render HTML to canvas
  const canvas = await html2canvas(tempDiv, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  // Remove temporary container
  document.body.removeChild(tempDiv);

  // Generate PDF
  const pdf = new jsPDF("p", "pt", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${organizer.organizerName}_answered.pdf`);
};
  
  // const printOrganizerData = (id) => {
  //   const organizer = organizerTemplatesData.find((org) => org._id === id);
  //   console.log(organizer);

  //   if (organizer) {
  //     const printWindow = window.open("", "_blank");

  //     // Constructing the sections HTML
  //     const sectionsHtml = organizer.sections
  //       .map((section) => {
  //         const formElementsHtml = section.formElements
  //           .map((element) => {
  //             return `
  //           <div style="margin-bottom: 20px;">
  //             <strong >${element.text}</strong>
  //             <span style="margin-left: 5px; display: block; margin-top: 5px;">
  //               <strong >Answer:</strong>  ${element.textvalue ?? "________"}
  //               </span>
  //           </div>
  //         `;
  //           })
  //           .join("");

  //         return `
  //         <div style="margin-bottom: 20px;">
  //           <h3>${section.name}</h3>
           
  //           ${formElementsHtml}
  //         </div>
  //       `;
  //       })
  //       .join("");

  //     printWindow.document.write(`
  //       <html>
  //         <head>
  //           <title>Organizer Data</title>
  //           <style>
  //             body { font-family: Arial, sans-serif; }
  //             h1 { color: #2c59fa; }
  //             h3 { color: #555; }
  //             table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  //             th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
  //             th { background-color: #f4f4f4; }
  //           </style>
  //         </head>
  //         <body>
  //           <h1>Organizer Data</h1>
           
  //           <div>
             
  //             ${sectionsHtml}
  //           </div>
  //         </body>
  //       </html>
  //     `);

  //     printWindow.document.close();
  //     printWindow.print();
  //   } else {
  //     toast.error("Organizer not found.");
  //   }
  // };

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
          `
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
        <TableContainer component={Paper} sx={{ overflow: "visible" }}>
          <Table sx={{ width: "100%" }}>
            <TableHead>
              <TableRow>
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
              {organizerTemplatesData.map((row) => (
                <TableRow key={row._id}>
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
                      color={row.status === "Completed" ? "success" : "default"}
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
                          // backgroundColor: row.issubmited ? "green" : "grey",
                          // color: "white",
                          color: "#fff",
                          // borderRadius: "15px",
                          // padding: "1px 1px",
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography
        sx={{ fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
        onClick={() => {
          handleSealed(row._id, !row.issealed);
          handleMenuClose();
        }}
      >
        {row.issealed ? "Unseal" : "Seal"}
      </Typography>
<Typography
  sx={{ fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
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
        sx={{ fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
        onClick={() => {
          handleOpenDialog(row);
          handleMenuClose();
        }}
      >
        Change Answers
      </Typography>

      <Typography
        sx={{ fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
        onClick={() => {
          handleArchive(row._id, row.active);
          handleMenuClose();
        }}
      >
        {row.active ? "Archive" : "Restore"}
      </Typography>

      <Typography
        sx={{ fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
        onClick={() => {
          printOrganizerData(row._id);
          handleMenuClose();
        }}
      >
        Print
      </Typography>
      <Typography
  sx={{ fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
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
    <Button onClick={() => setRenameDialogOpen(false)} color="secondary">
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

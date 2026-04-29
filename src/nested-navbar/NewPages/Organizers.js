import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import OrganizerUpdate from "../NewPages/OrganizerUpdate";
import OrganizerDialog from "./OrganizerDialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { MoreVertical, Pencil, Download, Archive, RotateCcw, Printer, Trash2, MessageSquare, Lock, LockOpen } from "lucide-react";
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
      // status: "In Progress"
      
    ...(issealed === false && { status: "In Progress" }),
    });
console.log("raw",raw)
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
  const handleMenuClose = () => {
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
          pageWidth - 80
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
            pageWidth - 80
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

// const handleDownload = async (organizer) => {
//   if (!organizer) return;
// console.log("download organizer",organizer)
//   // Construct sections HTML (only answered questions)
//   const sectionsHtml = (organizer.sections || [])
//     .map((section) => {
//       const answeredElements = (section.formElements || []).filter(
//         (el) => el.textvalue && el.textvalue.trim() !== ""
//       );

//       if (answeredElements.length === 0) return "";

//       const formElementsHtml = answeredElements
//         .map(
//           (element) => `
//         <div style="margin-bottom: 10px;">
//           <strong>${element.text}</strong>
//           <div style="margin-left: 10px; margin-top: 5px;">
//             <strong>Answer:</strong> ${element.textvalue}
//           </div>
//         </div>
//       `
//         )
//         .join("");

//       return `
//         <div style="margin-bottom: 15px;">
//           <h3 style="margin-bottom: 5px;">${section.name}</h3>
//           ${formElementsHtml}
//         </div>
//       `;
//     })
//     .join("");

//   // Wrap in a container
//   const containerHtml = `
//     <div style="font-family: Arial, sans-serif; font-size: 12px; padding: 20px;">
//       <h2>${organizer.organizerName}</h2>
//       ${sectionsHtml || "<p>No answered questions available.</p>"}
//     </div>
//   `;

//   // Create a temporary container in DOM
//   const tempDiv = document.createElement("div");
//   tempDiv.innerHTML = containerHtml;
//   document.body.appendChild(tempDiv);

//   // Render HTML to canvas
//   const canvas = await html2canvas(tempDiv, { scale: 2 });
//   const imgData = canvas.toDataURL("image/png");

//   // Remove temporary container
//   document.body.removeChild(tempDiv);

//   // Generate PDF
//   const pdf = new jsPDF("p", "pt", "a4");
//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//   pdf.save(`${organizer.organizerName}_answered.pdf`);
// };
  
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
// const handleDownload = async (organizer) => {
//   if (!organizer) return;

//   const pdf = new jsPDF("p", "pt", "a4");
//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();

//   let y = 40;

//   // Title
//   pdf.setFontSize(16);
//   pdf.text(organizer.organizerName || "Organizer", 40, y);
//   y += 30;

//   (organizer.sections || []).forEach((section) => {
//     if (!section) return;

//     // Section title
//     pdf.setFontSize(14);
//     pdf.text(section.name || "Section", 40, y);
//     y += 25;

//     (section.formElements || []).forEach((el) => {
//       if (!el) return;

//       // Skip unanswered
//       if (!el.textvalue && !el.files && !el.imageUrl) return;

//       // Page break if required
//       if (y > pageHeight - 80) {
//         pdf.addPage();
//         y = 40;
//       }

//       // Question text
//       pdf.setFontSize(12);
//       pdf.text(`Q: ${el.text || ""}`, 40, y);
//       y += 20;

//       // Text answer
//       if (el.textvalue) {
//         const textLines = pdf.splitTextToSize(`A: ${el.textvalue}`, pageWidth - 80);
//         pdf.text(textLines, 40, y);
//         y += textLines.length * 15;
//       }

     
     

//       // FILE answers (pdf/doc/xls etc)
//       if (el.files && el.files.length > 0) {
//         pdf.setFontSize(11);
//         el.files.forEach((f) => {
//           const textLines = pdf.splitTextToSize(`Attached File: ${f.name}`, pageWidth - 80);
//           pdf.text(textLines, 40, y);
//           y += textLines.length * 15;
//         });
//       }

//       y += 10;
//     });

//     y += 20;
//   });

//   pdf.save(`${organizer.organizerName || "organizer"}_full.pdf`);
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
    <div className="p-4 md:p-6 space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Organizers</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage organizers for this account</p>
        </div>
        <Button size="sm" onClick={handleCreateInvoiceClick}>
          + New Organizer
        </Button>
      </div>

      {/* Tab Switcher */}
      <div className="inline-flex items-center gap-1 bg-muted rounded-xl p-1">
        <button
          type="button"
          onClick={handleActiveClick}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            activeButton === "active"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={handleArchivedClick}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            activeButton === "archived"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Archived
        </button>
      </div>

      {!showForm ? (
        <>
          {/* Organizers Table */}
          <div className="rounded-xl border border-border overflow-hidden bg-background">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[30%]" />
                <col className="w-[16%]" />
                <col className="w-[16%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[16%]" />
              </colgroup>
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Updated</th>
                  <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sections</th>
                  <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Seal</th>
                  <th className="px-2 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {organizerTemplatesData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-2 py-12 text-center text-sm text-muted-foreground">
                      No organizers found.
                    </td>
                  </tr>
                ) : (
                  organizerTemplatesData.map((row) => (
                    <tr key={row._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-2 py-1.5">
                        <span
                          className="text-xs font-medium text-primary cursor-pointer hover:underline"
                          onClick={() => handleEdit(row._id)}
                        >
                          {row.organizerName}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(row.updatedAt))}
                      </td>
                      <td className="px-2 py-1.5">
                        <Badge
                          className={`rounded-full text-[11px] font-medium border-0 ${
                            row.status === "Completed"
                              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                              : row.status === "In Progress"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                          variant="outline"
                        >
                          {row.status || "Pending"}
                        </Badge>
                      </td>
                      <td className="px-2 py-1.5 text-xs text-muted-foreground">{row.sections.length}</td>
                      <td className="px-2 py-1.5">
                        {row.issealed && (
                          <Badge className="rounded-full text-[11px] bg-primary text-primary-foreground border-0 font-medium">Sealed</Badge>
                        )}
                      </td>
                      <td className="px-2 py-1.5">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" title="View / Edit"
                            onClick={() => handleEdit(row._id)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" title="Download"
                            onClick={() => handleDownload(row)}>
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => handleSealed(row._id, !row.issealed)}>
                                {row.issealed ? <LockOpen className="h-3.5 w-3.5 mr-2" /> : <Lock className="h-3.5 w-3.5 mr-2" />}
                                {row.issealed ? "Unseal" : "Seal"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenDialog(row)}>
                                <MessageSquare className="h-3.5 w-3.5 mr-2" />Change Answers
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleArchive(row._id, row.active)}>
                                {row.active ? <Archive className="h-3.5 w-3.5 mr-2" /> : <RotateCcw className="h-3.5 w-3.5 mr-2" />}
                                {row.active ? "Archive" : "Restore"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => printOrganizerData(row._id)}>
                                <Printer className="h-3.5 w-3.5 mr-2" />Print
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setRenameRowId(row._id); setRenameValue(row.organizerName); setRenameDialogOpen(true); }}>
                                <Pencil className="h-3.5 w-3.5 mr-2" />Rename
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(row._id)}>
                                <Trash2 className="h-3.5 w-3.5 mr-2" />Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Rename Dialog */}
          {renameDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40" onClick={() => setRenameDialogOpen(false)} />
              <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-sm">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">Rename Organizer</h2>
                </div>
                <div className="px-5 py-4">
                  <Input
                    autoFocus
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    placeholder="Enter new name..."
                    className="text-sm"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
                  <Button variant="outline" size="sm" onClick={() => setRenameDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => { handleRenameConfirm(renameRowId, renameValue); setRenameDialogOpen(false); }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <OrganizerUpdate
            OrganizerData={selectedOrganizer}
            onClose={handleClosePreview}
          />
        </div>
      )}

      <OrganizerDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        organizer={selectedOrganizer}
        accountid={data}
      />
    </div>
  );
};

export default Organizers;

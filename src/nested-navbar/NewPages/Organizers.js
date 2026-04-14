import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import OrganizerUpdate from "../NewPages/OrganizerUpdate";
import OrganizerDialog from "./OrganizerDialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
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
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Organizers</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage organizers for this account</p>
        </div>
        <Button size="sm" onClick={handleCreateInvoiceClick}>
          + New Organizer
        </Button>
      </div>

      {/* Tab Switcher */}
      <div className="inline-flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        <button
          type="button"
          onClick={handleActiveClick}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            activeButton === "active"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={handleArchivedClick}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            activeButton === "archived"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Archived
        </button>
      </div>

      {!showForm ? (
        <>
          {/* Organizers Table */}
          <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Last Updated</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Sections</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Seal</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {organizerTemplatesData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                        No organizers found.
                      </td>
                    </tr>
                  ) : (
                    organizerTemplatesData.map((row) => (
                      <tr key={row._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3">
                          <span
                            className="text-sm font-medium text-indigo-600 cursor-pointer hover:underline"
                            onClick={() => handleEdit(row._id)}
                          >
                            {row.organizerName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(row.updatedAt))}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={`rounded-full text-[11px] font-medium border-0 ${
                              row.status === "Completed"
                                ? "bg-green-50 text-green-700"
                                : row.status === "In Progress"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                            variant="outline"
                          >
                            {row.status || "Pending"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{row.sections.length}</td>
                        <td className="px-4 py-3">
                          {row.issealed && (
                            <Badge className="rounded-full text-[11px] bg-indigo-600 text-white border-0 font-medium">Sealed</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right relative">
                          <button
                            type="button"
                            onClick={(e) => toggleMenu(e, row._id)}
                            className="h-7 w-7 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <CiMenuKebab size={15} />
                          </button>
                          {openMenuId === row._id && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={handleMenuClose} />
                              <div className="absolute right-4 z-40 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 w-48 overflow-hidden">
                                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  onClick={() => { handleSealed(row._id, !row.issealed); handleMenuClose(); }}>
                                  {row.issealed ? "Unseal" : "Seal"}
                                </button>
                                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  onClick={() => { handleDownload(row); handleMenuClose(); }}>
                                  Download
                                </button>
                                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  onClick={() => { handleOpenDialog(row); handleMenuClose(); }}>
                                  Change Answers
                                </button>
                                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  onClick={() => { handleArchive(row._id, row.active); handleMenuClose(); }}>
                                  {row.active ? "Archive" : "Restore"}
                                </button>
                                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  onClick={() => { printOrganizerData(row._id); handleMenuClose(); }}>
                                  Print
                                </button>
                                <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  onClick={() => { setRenameRowId(row._id); setRenameValue(row.organizerName); setRenameDialogOpen(true); handleMenuClose(); }}>
                                  Rename
                                </button>
                                <div className="my-1 h-px bg-gray-100 mx-2" />
                                <button type="button" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  onClick={() => { handleDelete(row._id); handleMenuClose(); }}>
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rename Dialog */}
          {renameDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40" onClick={() => setRenameDialogOpen(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-800">Rename Organizer</h2>
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
                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
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

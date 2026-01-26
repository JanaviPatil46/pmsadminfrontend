import React, { useState, useEffect } from "react";
import { Grid, Box } from "@mui/material";
import axios from "axios";
import { Card, CardContent, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const Insights = () => {
  const COLORS = ["#4CAF50", "#FF9800", "#F44336"];
  const data = [
    { name: "Paid", value: 5000 },
    { name: "Pending", value: 2000 },
    { name: "Overdue", value: 1000 },
  ];

  const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  // jobs count
  const [jobCount, setJobCount] = useState(null);
  const [activeJobCount, setActiveJobCount] = useState(null);
  const [inactiveJobCount, setInactiveJobCount] = useState(null);
  const [invoiceCount, setInvoiceCount] = useState(null);
  const [invoiceCounts, setInvoiceCounts] = useState({
    Paid: 0,
    Pending: 0,
    Overdue: 0,
  });
  const [invoiceSummary, setInvoiceSummary] = useState({
    totalAmount: 0,
    pendingAmount: 0,
    paidAmount: 0,
    overdueAmount: 0,
  });
  useEffect(() => {
    // Fetch job count from API
    axios
      .get(`${JOBS_API}/workflow/jobs/jobscount`)
      .then((response) => {
        setJobCount(response.data.count); // Assuming API returns { count: <job count> }
      })
      .catch((error) => {
        console.error("Error fetching job count:", error);
      });

    // Fetch count of active jobs
    axios
      .get(`${JOBS_API}/workflow/jobs/activejobcounts`)
      .then((response) => {
        setActiveJobCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching active job count:", error);
      });

    // Fetch count of inactive jobs
    axios
      .get(`${JOBS_API}/workflow/jobs/inactivejobcounts`)
      .then((response) => {
        setInactiveJobCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching inactive job count:", error);
      });

    // Fetch count of total invoices
    axios
      .get(`${INVOICE_NEW}/workflow/invoices/invoicecount`)
      .then((response) => {
        setInvoiceCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching inactive job count:", error);
      });
    axios
      .get(`${INVOICE_NEW}/workflow/invoices/invoicestatuscount`)
      .then((response) => {
        const data = response.data.invoiceCounts;

        // Convert response to an object with statuses as keys
        const countMap = {};
        data.forEach(({ _id, count }) => {
          countMap[_id] = count;
        });

        // Update state with counts
        setInvoiceCounts({
          Paid: countMap["Paid"] || 0,
          Pending: countMap["Pending"] || 0,
          Overdue: countMap["Overdue"] || 0,
        });
      })
      .catch((error) => console.error("Error fetching invoice counts:", error));
    axios
      .get(`${INVOICE_NEW}/workflow/invoices/invoicesummary`)
      .then((response) => {
        const data = response.data.summary;
        let totalAmount = 0,
          paidAmount = 0,
          pendingAmount = 0,
          overdueAmount = 0;

        data.forEach(
          ({ _id, totalAmount: total, paidAmount: paid, balanceDueAmount }) => {
            totalAmount += total;
            if (_id === "Paid") paidAmount += paid;
            if (_id === "Pending") pendingAmount += balanceDueAmount;
            if (_id === "Overdue") overdueAmount += balanceDueAmount;
          }
        );

        setInvoiceSummary({
          totalAmount,
          pendingAmount,
          paidAmount,
          overdueAmount,
        });
      })
      .catch((error) =>
        console.error("Error fetching invoice summary:", error)
      );
  }, []);
  
  return (
    <Box sx={{ padding: 2 }}>
      {/* <Box>
      <Typography gutterBottom variant="h5" component="div">
        Jobs Details
      </Typography>
      <Box mt={3}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={3}>
            <Card sx={{ width:'250px'}}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Total Jobs
                </Typography>
                <Typography variant="body2" color="text.secondary">{jobCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card sx={{ width:'250px'}}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Active Jobs
                </Typography>
                <Typography variant="body2" color="text.secondary">{activeJobCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card sx={{ width:'250px'}}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Archived Jobs
                </Typography>
                <Typography variant="body2" color="text.secondary">{inactiveJobCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ width:'250px'}}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Finished Jobs
                </Typography>
                <Typography variant="body2" color="text.secondary">{0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      </Box>
      <Box mt={3}>
      <Typography gutterBottom variant="h5" component="div">
        Invoices Details
      </Typography>
      <Box mt={3}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={3}>
            <Card sx={{ width:'250px'}}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Total Invoices
                </Typography>
                <Typography variant="body2" color="text.secondary">{invoiceCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card sx={{ width:'250px'}}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Pending Invoices
                </Typography>
                <Typography variant="body2" color="text.secondary">{invoiceCounts.Pending}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Card sx={{ width:'250px'}}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Paid Invoices
                </Typography>
                <Typography variant="body2" color="text.secondary"> {invoiceCounts.Paid}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
      <Card sx={{ width:'250px'}}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            Overdue Invoices
          </Typography>
          <Typography variant="body2" color="text.secondary">{invoiceCounts.Overdue}</Typography>
        </CardContent>
      </Card>
    </Grid>
        </Grid>
      </Box>

      </Box> */}

      <Box mt={3}>
        <Typography gutterBottom variant="h5">
          Invoices Amount
        </Typography>
        <Box mt={3}>
          <Grid container spacing={2} justifyContent="center">
            {[
              { title: "Total Amount", value: 500 },
              { title: "Pending Amount", value: 300 },
              { title: "Paid Amount", value: 100 },
              { title: "Overdue Amount", value: 100},
            ].map(({ title, value }) => (
              <Grid item xs={12} sm={3} key={title}>
                <Card sx={{ width: "250px" }}>
                  <CardContent>
                    <Typography gutterBottom variant="h6">
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${value.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mt={5} display="flex" justifyContent="center">
    <ResponsiveContainer width={400} height={300}>
      <PieChart>
        <Pie
          data={[
            { name: "Paid", value: 100 },
            { name: "Pending", value: 300 },
            { name: "Overdue", value: 100 },
          ]}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {["#4CAF50", "#FF9800", "#F44336"].map((color, index) => (
            <Cell key={index} fill={color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </Box>

  {/* <iframe
  src={`https://www.snptaxes.com/uploads/AccountId/68d6793505a41edbe207d393/Client%20Uploaded%20Documents/sealed/Invoice_14.pdf`}
  width="100%"
  height="600px"
  title="PDF Viewer"
/> */}

      </Box>
      {/* <Box sx={{ display: "flex", alignItems: "center" }}>
        <ResponsiveContainer width={"30%"} height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <Box>
          {data.map((entry, index) => (
            <Typography>
              {entry.name} : ${entry.value}
            </Typography>
          ))}
        </Box>
      </Box> */}
    </Box>
  );
};

export default Insights;
// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   Typography,
//   Button,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const PdfViewerDialog = ({ open, onClose, fileUrl }) => {
//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle sx={{ m: 0, p: 2 }}>
//         <Typography variant="h6">PDF Preview</Typography>
//         <IconButton
//           aria-label="close"
//           onClick={onClose}
//           sx={{
//             position: "absolute",
//             right: 8,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent dividers sx={{ height: "80vh" }}>
//         {fileUrl ? (
//           <iframe
//             src={fileUrl}
//             title="PDF Viewer"
//             width="100%"
//             height="100%"
//             style={{ border: "none" }}
//           />
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No file selected.
//           </Typography>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default function ViewPdfExample() {
//   const [open, setOpen] = useState(false);

//   // Example file URL (from your multer uploads)
//   const fileUrl = "https://www.snptaxes.com/uploads/AccountId/68d6793505a41edbe207d393/Client%20Uploaded%20Documents/sealed/Invoice_14.pdf";

//   return (
//     <div>
//       <Button variant="contained" onClick={() => setOpen(true)}>
//         View PDF
//       </Button>

//       <PdfViewerDialog
//         open={open}
//         onClose={() => setOpen(false)}
//         fileUrl={fileUrl}
//       />
//     </div>
//   );
// }

// // import React, { useState } from "react";
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   Button,
// //   Drawer,
// //   Box,
// //   Typography
// // } from "@mui/material";

// // export default function FullscreenDialogWithDrawer() {
// //   const [dialogOpen, setDialogOpen] = useState(false);
// //   const [drawerOpen, setDrawerOpen] = useState(false);

// //   return (
// //     <>
// //       {/* Button to open fullscreen dialog */}
// //       <Button variant="contained" onClick={() => setDialogOpen(true)}>
// //         Open Fullscreen Dialog
// //       </Button>

// //       {/* Fullscreen Dialog */}
// //       <Dialog
// //         fullScreen
// //         open={dialogOpen}
// //         onClose={() => setDialogOpen(false)}
// //       >
// //         <DialogTitle>Fullscreen Dialog</DialogTitle>
// //         <DialogContent>
// //           <Typography>
// //             This is a fullscreen dialog.  
// //             Click below to open a drawer on top.
// //           </Typography>
// //           <Button
// //             variant="outlined"
// //             sx={{ mt: 2 }}
// //             onClick={() => setDrawerOpen(true)}
// //           >
// //             Open Right Drawer
// //           </Button>
// //         </DialogContent>
// //       </Dialog>

// //       {/* Right Drawer (with higher z-index so it shows over dialog) */}
// //       <Drawer
// //         anchor="right"
// //         open={drawerOpen}
// //         onClose={() => setDrawerOpen(false)}
// //         ModalProps={{
// //           keepMounted: true // Improves performance on mobile
// //         }}
// //         sx={{
// //           zIndex: (theme) => theme.zIndex.modal + 1 // ensure above dialog
// //         }}
// //       >
// //         <Box sx={{ width: 300, p: 2 }}>
// //           <Typography variant="h6">Drawer Content</Typography>
// //           <Typography>This drawer opens above the fullscreen dialog!</Typography>
// //           <Button
// //             variant="contained"
// //             sx={{ mt: 2 }}
// //             onClick={() => setDrawerOpen(false)}
// //           >
// //             Close Drawer
// //           </Button>
// //         </Box>
// //       </Drawer>
// //     </>
// //   );
// // }


// import React, { useEffect, useState } from "react";
// import { Autocomplete, TextField, CircularProgress } from "@mui/material";

// const CountryAutocomplete = () => {
//   const [countries, setCountries] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
//       .then(res => res.json())
//       .then(data => {
//         const sorted = data.sort((a, b) =>
//           a.name.common.localeCompare(b.name.common)
//         );
//         setCountries(sorted);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Error fetching countries:", err);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <Autocomplete
//       options={countries}
//       getOptionLabel={(option) => option.name.common}
//       loading={loading}
//       onChange={(event, value) => {
//         console.log("Selected country:", value);
//       }}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label="Select Country"
//           InputProps={{
//             ...params.InputProps,
//             endAdornment: (
//               <>
//                 {loading ? <CircularProgress size={20} /> : null}
//                 {params.InputProps.endAdornment}
//               </>
//             ),
//           }}
//         />
//       )}
//       renderOption={(props, option) => {
//         const callingCode = option.idd?.root
//           ? `${option.idd.root}${option.idd.suffixes?.[0] || ""}`
//           : "";
//         return (
//           <li {...props} key={option.cca2}>
//             <span style={{ fontSize: "1.2rem", marginRight: 8 }}>
//               {option.flag}
//             </span>
//             {option.name.common} {callingCode && `(${callingCode})`}
//           </li>
//         );
//       }}
//       sx={{ width: 300 }}
//     />
//   );
// };

// export default CountryAutocomplete;

// import React, { useState } from "react";

// function App() {
//   const [message, setMessage] = useState("");

//   const loginWithGoogle = () => {
//    window.location.href = "https://www.snptaxes.com/emailsync/auth/google";
//   };

//   return (
//     <div style={styles.container}>
//       <h1>Google Login Demo</h1>

//       <button style={styles.button} onClick={loginWithGoogle}>
//         Login with Google
//       </button>

//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// const styles = {
//   container: {
//     height: "100vh",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     fontFamily: "Arial"
//   },
//   button: {
//     padding: "12px 20px",
//     fontSize: "16px",
//     cursor: "pointer",
//     background: "#4285F4",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px"
//   }
// };

// export default App;
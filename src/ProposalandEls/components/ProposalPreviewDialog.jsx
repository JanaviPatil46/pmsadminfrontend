// import React, { useState, useRef } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Box,
//   List,
//   ListItemButton,
//   Typography,
//   Divider,Accordion,AccordionSummary,AccordionDetails
// } from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';
// const ProposalPreviewDialog = ({ open, handleClose, proposal }) => {
//   const [activeStep, setActiveStep] = useState("general");

//   // Determine enabled sections
//   const steps = [
//     // { id: "general", label: "General Info", enabled: true },
//     { id: "introduction", label: "Introduction", enabled: proposal?.general?.introductionEnabled },
//    { id: "terms", label: "Terms & Conditions", enabled: proposal?.general?.termsEnabled },
//     { id: "services", label: "Services", enabled: proposal?.general?.servicesEnabled },
//     { id: "payments", label: "Payments", enabled: proposal?.general?.paymentsEnabled },
   
//   ].filter(s => s.enabled);

//   // ✅ Declare refs individually — VALID
//   const generalRef = useRef(null);
//   const introRef = useRef(null);
//   const servicesRef = useRef(null);
//   const paymentsRef = useRef(null);
//   const termsRef = useRef(null);

//   // ✅ Map ids → refs
//   const refMap = {
//     general: generalRef,
//     introduction: introRef,
//     services: servicesRef,
//     payments: paymentsRef,
//     terms: termsRef,
//   };

//   const handleStepClick = (id) => {
//     const sectionRef = refMap[id];
//     if (sectionRef?.current) {
//       sectionRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//     setActiveStep(id);
//   };

//   const handleScroll = (e) => {
//     const scrollTop = e.target.scrollTop;

//     for (let step of steps) {
//       const stepRef = refMap[step.id];
//       if (stepRef?.current) {
//         const offsetTop = stepRef.current.offsetTop;
//         if (scrollTop + 50 >= offsetTop) {
//           setActiveStep(step.id);
//         }
//       }
//     }
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} fullScreen>
//   <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//     {proposal?.general?.proposalName || "Proposal"}
//     <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
//   </DialogTitle>

//   <DialogContent sx={{ display: "flex", height: "75vh", p: 0 }}>
    
//     {/* ✅ LEFT SIDE MENU (Steps) */}
//     <Box sx={{ width: "28%", borderRight: "1px solid #ddd", bgcolor: "#fafafa" }}>
//       <List>
//         {steps.map((step) => (
//           <ListItemButton
//             key={step.id}
//             selected={activeStep === step.id}
//             onClick={() => handleStepClick(step.id)}
//           >
//             {step.label}
//           </ListItemButton>
//         ))}
//       </List>
//     </Box>

//     {/* ✅ RIGHT CONTENT AREA */}
//     <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }} onScroll={handleScroll}>

//       {/* ✅ INTRODUCTION */}
//       {proposal?.general?.introductionEnabled && (
//         <Box ref={introRef} sx={{ mb: 3 }}>
//           <Typography variant="h6">{proposal?.introduction?.title}</Typography>
//           <Typography
//             dangerouslySetInnerHTML={{ __html: proposal?.introduction?.description }}
//           />
//           <Divider sx={{ my: 2 }} />
//         </Box>
//       )}

//       {/* ✅ TERMS */}
//       {proposal?.general?.termsEnabled && (
//         <Box ref={termsRef} sx={{ mb: 3 }}>
//           <Typography variant="h6">Terms & Conditions</Typography>
//           <Typography
//             dangerouslySetInnerHTML={{ __html: proposal?.terms?.description }}
//           />
//           <Divider sx={{ my: 2 }} />
//         </Box>
//       )}

//       {/* ✅ SERVICES - ITEMIZED MODE */}
//       {proposal?.services?.option === "services" && (
//         <Box ref={servicesRef} sx={{ mb: 3 }}>
//           <Typography variant="h6" sx={{ mb: 2 }}>Services</Typography>

//           <Box sx={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
            
//             {/* Header */}
//             <Box sx={{
//               bgcolor: "#f9fafb", p: 1, fontWeight: "bold",
//               display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//             }}>
//               <Typography>Service</Typography>
//               <Typography textAlign="right">Rate</Typography>
//               <Typography textAlign="right">Qty</Typography>
//               <Typography textAlign="right">Tax</Typography>
//               <Typography textAlign="right">Amount</Typography>
//             </Box>

//             {/* Line Items */}
//             {proposal?.services?.itemizedData?.lineItems?.map((item, i) => {
//               const rate = Number(item.rate || 0);
//               const qty = Number(item.quantity || 1);
//               const taxRate = proposal?.services?.itemizedData?.taxRate || 0;

//               const base = rate * qty;
//               const tax = item.tax ? (base * taxRate) / 100 : 0;
//               const total = base + tax;

//               return (
//                 <Box key={i} sx={{
//                   p: 1,
//                   borderTop: "1px solid #e5e7eb",
//                   display: "grid",
//                   gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                 }}>
//                   <Box>
//                     <Typography fontWeight="bold">{item.productorService}</Typography>
//                     <Typography fontSize={12} color="text.secondary">{item.description}</Typography>
//                   </Box>

//                   <Typography textAlign="right">${rate.toFixed(2)}</Typography>
//                   <Typography textAlign="right">{qty}</Typography>
//                   <Typography textAlign="right">${tax.toFixed(2)}</Typography>
//                   <Typography textAlign="right">${total.toFixed(2)}</Typography>
//                 </Box>
//               );
//             })}

//             {/* Footer Total */}
//             <Box sx={{
//               borderTop: "1px solid #e5e7eb",
//               p: 1,
//               display: "flex",
//               justifyContent: "flex-end",
//               fontWeight: "bold"
//             }}>
//               Total: ${proposal?.services?.itemizedData?.totalAmount?.toFixed(2)}
//             </Box>
//           </Box>

//           <Divider sx={{ my: 2 }} />
//         </Box>
//       )}

//       {/* ✅ SERVICES - INVOICE MODE */}
//       {proposal?.services?.option === "invoice" && (
//         <Box ref={servicesRef} sx={{ mb: 3 }}>
//           <Typography variant="h6" sx={{ mb: 2 }}>Invoice</Typography>

//           <Box sx={{ mb: 2 }}>
//             <Typography fontWeight="bold">Amount</Typography>
//             <Box sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: "8px" }}>
//               ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
//             </Box>

//             <Typography fontWeight="bold" sx={{ mt: 2 }}>Invoice will be issued</Typography>
//             <Box sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: "8px" }}>
//               {proposal?.services?.invoices?.[0]?.issueinvoice || "N/A"}
//             </Box>

//             <Typography fontWeight="bold" sx={{ mt: 2 }}>Description</Typography>
//             <Box sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: "8px" }}>
//               {proposal?.services?.invoices?.[0]?.description || "N/A"}
//             </Box>
//           </Box>

//           {/* Collapsible Section */}
//           <Accordion>
//             <AccordionSummary expandIcon={<span>▼</span>}>
//               <Typography fontWeight="bold">Invoice details</Typography>
//             </AccordionSummary>

//             <AccordionDetails>
//               <Box sx={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
                
//                 {/* Header */}
//                 <Box sx={{
//                   bgcolor: "#f9fafb", p: 1, fontWeight: "bold",
//                   display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                 }}>
//                   <Typography>Service</Typography>
//                   <Typography textAlign="right">Rate</Typography>
//                   <Typography textAlign="right">Qty</Typography>
//                   <Typography textAlign="right">Tax</Typography>
//                   <Typography textAlign="right">Amount</Typography>
//                 </Box>

//                 {/* Line Items */}
//                 {proposal?.services?.invoices?.[0]?.lineItems?.map((item, i) => {
//                   const rate = Number(item.rate || 0);
//                   const qty = Number(item.quantity || 1);
//                   const taxRate = proposal?.services?.invoices?.[0]?.taxRate || 0;

//                   const base = rate * qty;
//                   const tax = item.tax ? (base * taxRate) / 100 : 0;
//                   const total = base + tax;

//                   return (
//                     <Box key={i} sx={{
//                       p: 1,
//                       borderTop: "1px solid #e5e7eb",
//                       display: "grid",
//                       gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                     }}>
//                       <Box>
//                         <Typography fontWeight="bold">{item.productorService}</Typography>
//                         <Typography fontSize={12} color="text.secondary">{item.description}</Typography>
//                       </Box>

//                       <Typography textAlign="right">${rate.toFixed(2)}</Typography>
//                       <Typography textAlign="right">{qty}</Typography>
//                       <Typography textAlign="right">${tax.toFixed(2)}</Typography>
//                       <Typography textAlign="right">${total.toFixed(2)}</Typography>
//                     </Box>
//                   );
//                 })}

//                 {/* Footer Total */}
//                 <Box sx={{
//                   borderTop: "1px solid #e5e7eb",
//                   p: 1,
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   fontWeight: "bold"
//                 }}>
//                   Total: ${proposal?.services?.invoices?.[0]?.totalAmount.toFixed(2)}
//                 </Box>
//               </Box>
//             </AccordionDetails>
//           </Accordion>

//           <Divider sx={{ my: 2 }} />
//         </Box>
//       )}

//       {/* ✅ PAYMENTS */}
//       {proposal?.general?.paymentsEnabled && (
//         <Box ref={paymentsRef} sx={{ mb: 3 }}>
//           <Typography variant="h6">Payments</Typography>
//           <Typography><b>Method:</b> {proposal?.payments?.method}</Typography>
//           <Typography><b>Amount:</b> ${proposal?.payments?.amount}</Typography>
//           <Divider sx={{ my: 2 }} />
//         </Box>
//       )}

//     </Box>
//   </DialogContent>
// </Dialog>

//   );
// };

// export default ProposalPreviewDialog;

// import React, { useState, useRef } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Box,
//   List,
//   ListItemButton,
//   Typography,
//   Divider,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,TextField,Button,ButtonGroup,FormControlLabel,Checkbox
// } from "@mui/material";
// import SignatureCanvas from "react-signature-canvas";
// import axios from "axios";
// import CloseIcon from "@mui/icons-material/Close";
// import HTMLReactParser from "html-react-parser"; // ✅ Added safely


// const ProposalPreviewDialog = ({ open, handleClose, proposal }) => {
//   const [activeStep, setActiveStep] = useState("general");
//  // Signature States
//   const [signatureType, setSignatureType] = useState("draw");
//   const [signatureData, setSignatureData] = useState(null);
//   const [typedSignature, setTypedSignature] = useState("");
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [isSigning, setIsSigning] = useState(false);

//   const sigCanvas = useRef(null);
//   // Determine enabled sections
//   const steps = [
//     { id: "introduction", label: "Introduction", enabled: proposal?.general?.introductionEnabled },
//     { id: "terms", label: "Terms & Conditions", enabled: proposal?.general?.termsEnabled },
//     { id: "services", label: "Services", enabled: proposal?.general?.servicesEnabled },
//     { id: "payments", label: "Payments", enabled: proposal?.general?.paymentsEnabled },
//       { id: "signature", label: "Sign & Accept", enabled: true },
//   ].filter(s => s.enabled);

//   const introRef = useRef(null);
//   const termsRef = useRef(null);
//   const servicesRef = useRef(null);
//   const paymentsRef = useRef(null);
//   const signatureRef = useRef(null);
//   const refMap = {
//     introduction: introRef,
//     terms: termsRef,
//     services: servicesRef,
//     payments: paymentsRef,
//      signature: signatureRef,
//   };

//   const handleStepClick = (id) => {
//     const sectionRef = refMap[id];
//     if (sectionRef?.current) {
//       sectionRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//     setActiveStep(id);
//   };

//   const handleScroll = (e) => {
//     const scrollTop = e.target.scrollTop;

//     for (let step of steps) {
//       const stepRef = refMap[step.id];
//       if (stepRef?.current) {
//         const offsetTop = stepRef.current.offsetTop;
//         if (scrollTop + 50 >= offsetTop) {
//           setActiveStep(step.id);
//         }
//       }
//     }
//   };
//    /** ✅ Complete button action */
//   const handleCompleteProposal = async () => {
//     try {
//       setIsSigning(true);

//       const payload = {
//         status: "Signed",
//         signedAt: new Date(),
//         signature: signatureType === "draw" ? signatureData : typedSignature,
//       };

//       await axios.put(`http://localhost:9000/account/proposals/${proposal._id}`, payload);

//     //   fetchProposals();
//       handleClose();
//     } catch (err) {
//       console.error("Signature save error:", err);

//     } finally {
//       setIsSigning(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} fullScreen>
//       <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
//         {proposal?.general?.proposalName || "Proposal"}
//         <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
//       </DialogTitle>

//       <DialogContent sx={{ display: "flex", height: "75vh", p: 0 }}>
        
//         {/* LEFT SIDE MENU */}
//         <Box sx={{ width: "28%", borderRight: "1px solid #ddd", bgcolor: "#fafafa" }}>
//           <List>
//             {steps.map((step) => (
//               <ListItemButton
//                 key={step.id}
//                 selected={activeStep === step.id}
//                 onClick={() => handleStepClick(step.id)}
//               >
//                 {step.label}
//               </ListItemButton>
//             ))}
//           </List>
//         </Box>

//         {/* RIGHT CONTENT */}
//         <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }} onScroll={handleScroll}>

//           {/* ✅ INTRODUCTION */}
//           {proposal?.general?.introductionEnabled && (
//             <Box ref={introRef} sx={{ mb: 3 }}>
//               <Typography variant="h6">{proposal?.introduction?.title || "Introduction"}</Typography>
//               {HTMLReactParser(proposal?.introduction?.description || "")}
//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ TERMS */}
//           {proposal?.general?.termsEnabled && (
//             <Box ref={termsRef} sx={{ mb: 3 }}>
//               <Typography variant="h6">Terms & Conditions</Typography>
//               {HTMLReactParser(proposal?.terms?.description || "")}
//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ SERVICES - ITEMIZED */}
//           {proposal?.general?.servicesEnabled && proposal?.services?.option === "services" && (
//             <Box ref={servicesRef} sx={{ mb: 3 }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>Services</Typography>

//               <Box sx={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
//                 <Box sx={{
//                   bgcolor: "#f9fafb", p: 1, fontWeight: "bold",
//                   display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                 }}>
//                   <Typography>Service</Typography>
//                   <Typography textAlign="right">Rate</Typography>
//                   <Typography textAlign="right">Qty</Typography>
//                   <Typography textAlign="right">Tax</Typography>
//                   <Typography textAlign="right">Amount</Typography>
//                 </Box>

//                 {proposal?.services?.itemizedData?.lineItems?.map((item, i) => {
//                   const rate = Number(item.rate || 0);
//                   const qty = Number(item.quantity || 1);
//                   const taxRate = proposal?.services?.itemizedData?.taxRate || 0;

//                   const base = rate * qty;
//                   const tax = item.tax ? (base * taxRate) / 100 : 0;
//                   const total = base + tax;

//                   return (
//                     <Box key={i} sx={{
//                       p: 1,
//                       borderTop: "1px solid #e5e7eb",
//                       display: "grid",
//                       gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                     }}>
//                       <Box>
//                         <Typography fontWeight="bold">{item.productorService}</Typography>
//                         <Typography fontSize={12} color="text.secondary">{item.description}</Typography>
//                       </Box>

//                       <Typography textAlign="right">${rate.toFixed(2)}</Typography>
//                       <Typography textAlign="right">{qty}</Typography>
//                       <Typography textAlign="right">${tax.toFixed(2)}</Typography>
//                       <Typography textAlign="right">${total.toFixed(2)}</Typography>
//                     </Box>
//                   );
//                 })}

//                 <Box sx={{
//                   borderTop: "1px solid #e5e7eb",
//                   p: 1,
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   fontWeight: "bold"
//                 }}>
//                   Total: ${proposal?.services?.itemizedData?.totalAmount?.toFixed(2)}
//                 </Box>
//               </Box>

//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ SERVICES - INVOICE MODE */}
//           {proposal?.general?.servicesEnabled && proposal?.services?.option === "invoice" && (
//             <Box ref={servicesRef} sx={{ mb: 3 }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>Invoice</Typography>

//               <Box sx={{ mb: 2 }}>
//                 <Typography fontWeight="bold">Amount</Typography>
//                 <Box sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: "8px" }}>
//                   ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
//                 </Box>

//                 <Typography fontWeight="bold" sx={{ mt: 2 }}>Invoice will be issued</Typography>
//                 <Box sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: "8px" }}>
//                   {proposal?.services?.invoices?.[0]?.issueinvoice || "N/A"}
//                 </Box>

//                 <Typography fontWeight="bold" sx={{ mt: 2 }}>Description</Typography>
//                 <Box sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: "8px" }}>
//                   {proposal?.services?.invoices?.[0]?.description || "N/A"}
//                 </Box>
//               </Box>

//               <Accordion>
//                 <AccordionSummary expandIcon={<span>▼</span>}>
//                   <Typography fontWeight="bold">Invoice details</Typography>
//                 </AccordionSummary>

//                 <AccordionDetails>
//                   <Box sx={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
//                     <Box sx={{
//                       bgcolor: "#f9fafb", p: 1, fontWeight: "bold",
//                       display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                     }}>
//                       <Typography>Service</Typography>
//                       <Typography textAlign="right">Rate</Typography>
//                       <Typography textAlign="right">Qty</Typography>
//                       <Typography textAlign="right">Tax</Typography>
//                       <Typography textAlign="right">Amount</Typography>
//                     </Box>

//                     {proposal?.services?.invoices?.[0]?.lineItems?.map((item, i) => {
//                       const rate = Number(item.rate || 0);
//                       const qty = Number(item.quantity || 1);
//                       const taxRate = proposal?.services?.invoices?.[0]?.taxRate || 0;

//                       const base = rate * qty;
//                       const tax = item.tax ? (base * taxRate) / 100 : 0;
//                       const total = base + tax;

//                       return (
//                         <Box key={i} sx={{
//                           p: 1,
//                           borderTop: "1px solid #e5e7eb",
//                           display: "grid",
//                           gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                         }}>
//                           <Box>
//                             <Typography fontWeight="bold">{item.productorService}</Typography>
//                             <Typography fontSize={12} color="text.secondary">{item.description}</Typography>
//                           </Box>

//                           <Typography textAlign="right">${rate.toFixed(2)}</Typography>
//                           <Typography textAlign="right">{qty}</Typography>
//                           <Typography textAlign="right">${tax.toFixed(2)}</Typography>
//                           <Typography textAlign="right">${total.toFixed(2)}</Typography>
//                         </Box>
//                       );
//                     })}

//                     <Box sx={{
//                       borderTop: "1px solid #e5e7eb",
//                       p: 1,
//                       display: "flex",
//                       justifyContent: "flex-end",
//                       fontWeight: "bold"
//                     }}>
//                       Total: ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
//                     </Box>
//                   </Box>
//                 </AccordionDetails>
//               </Accordion>

//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ PAYMENTS */}
//           {proposal?.general?.paymentsEnabled && (
//             <Box ref={paymentsRef} sx={{ mb: 3 }}>
//               <Typography variant="h6">Payments</Typography>
//               <Typography><b>Method:</b> {proposal?.payments?.method}</Typography>
//               <Typography><b>Amount:</b> ${proposal?.payments?.amount}</Typography>
//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}
//            {/* ✅ SIGNATURE SECTION */}
//          {/* ✅ SIGNATURE SECTION */}
// <Box ref={signatureRef} sx={{ mb: 4 }}>
//   <Typography variant="h6" sx={{ mb: 2 }}>Sign & Accept</Typography>
//   <Divider sx={{ mb: 2 }} />

//   {/* Already signed */}
//   {proposal?.status === "Signed" ? (
//     <>
//       <Typography sx={{ mb: 2 }} color="text.secondary">
//         Signed on {new Date(proposal.signedAt).toLocaleString()}
//       </Typography>

//       <Typography fontWeight="bold">Signature:</Typography>

//       {proposal?.signature?.startsWith("data:image") ? (
//         <img
//           src={proposal.signature}
//           alt="signature"
//           style={{
//             maxWidth: 300,
//             border: "1px solid #ddd",
//             background: "white",
//             padding: 10,
//             marginTop: 10,
//           }}
//         />
//       ) : (
//         <div
//           style={{
//             fontSize: 24,
//             fontFamily: "cursive",
//             border: "1px solid #ccc",
//             padding: 20,
//             background: "#f7f7f7",
//             marginTop: 10,
//             borderRadius: 6,
//           }}
//         >
//           {proposal.signature}
//         </div>
//       )}

//       <Button variant="contained" disabled sx={{ mt: 2, opacity: 0.7 }}>
//         Already Signed
//       </Button>
//     </>
//   ) : (
//     <>
//       {/* Signature type selector */}
//       <ButtonGroup sx={{ mb: 2 }}>
//         <Button
//           variant={signatureType === "draw" ? "contained" : "outlined"}
//           onClick={() => setSignatureType("draw")}
//         >
//           Draw
//         </Button>
//         <Button
//           variant={signatureType === "type" ? "contained" : "outlined"}
//           onClick={() => setSignatureType("type")}
//         >
//           Type
//         </Button>
//       </ButtonGroup>

//       {/* Draw Mode */}
//       {signatureType === "draw" && (
//         <>
//           <SignatureCanvas
//             ref={sigCanvas}
//             penColor="black"
//             canvasProps={{
//               width: 500,
//               height: 200,
//               style: {
//                 border: "1px solid #ccc",
//                 background: "#fafafa",
//                 borderRadius: 6,
//               },
//             }}
//           />

//           <Box sx={{ display: "flex", gap: 1, my: 2 }}>
//             <Button variant="outlined" onClick={() => sigCanvas.current.clear()}>
//               Clear
//             </Button>
//             <Button
//               variant="contained"
//               onClick={() => {
//                 if (sigCanvas.current.isEmpty()) {
//                   alert("Please draw your signature first");
//                   return;
//                 }
//                 const signature = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
//                 setSignatureData(signature);
//               }}
//             >
//               Save Signature
//             </Button>
//           </Box>

//           {signatureData && (
//             <>
//               <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
//                 ✓ Signature saved successfully
//               </Typography>
//               <img
//                 src={signatureData}
//                 alt="preview"
//                 style={{
//                   maxWidth: 300,
//                   border: "1px solid #ddd",
//                   padding: 10,
//                   background: "white",
//                 }}
//               />
//             </>
//           )}
//         </>
//       )}

//       {/* Type Mode */}
//       {signatureType === "type" && (
//         <>
//           <TextField
//             fullWidth
//             placeholder="Type your full name"
//             value={typedSignature}
//             onChange={(e) => setTypedSignature(e.target.value)}
//             sx={{ mb: 2 }}
//             InputProps={{
//               style: { fontFamily: "cursive", fontSize: 22 },
//             }}
//           />

//           {typedSignature && (
//             <div
//               style={{
//                 fontSize: 24,
//                 fontFamily: "cursive",
//                 border: "1px solid #ccc",
//                 padding: 20,
//                 background: "#fafafa",
//                 borderRadius: 6,
//                 marginBottom: 20,
//               }}
//             >
//               {typedSignature}
//             </div>
//           )}
//         </>
//       )}

//       {/* Accept terms checkbox */}
//       <FormControlLabel
//         control={
//           <Checkbox
//             checked={termsAccepted}
//             onChange={(e) => setTermsAccepted(e.target.checked)}
//             disabled={proposal?.status === "Signed"}
//           />
//         }
//         label="I accept the Terms & Conditions"
//         sx={{ mt: 2 }}
//       />

//       {/* Complete button */}
//       <Button
//         variant="contained"
//         sx={{ mt: 2 }}
//         disabled={
//           isSigning ||
//           !termsAccepted ||
//           (signatureType === "draw" ? !signatureData : !typedSignature) ||
//           proposal?.status === "Signed"
//         }
//         onClick={handleCompleteProposal}
//       >
//         {isSigning ? "Saving..." : "Complete Proposal"}
//       </Button>
//     </>
//   )}
// </Box>
      
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ProposalPreviewDialog;

import React, { useState, useRef } from "react";
import { X, ChevronDown, Pen, Type } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import HTMLReactParser from "html-react-parser";

const ProposalPreviewDialog = ({ open, handleClose, proposal }) => {
  const [activeStep, setActiveStep] = useState("general");
  // Signature States
  const [signatureType, setSignatureType] = useState("draw");
  const [signatureData, setSignatureData] = useState(null);
  const [typedSignature, setTypedSignature] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [invoiceDetailsOpen, setInvoiceDetailsOpen] = useState(false);

  const sigCanvas = useRef(null);
  
  // Determine enabled sections
  const steps = [
    { id: "introduction", label: "Introduction", enabled: proposal?.general?.introductionEnabled },
    { id: "terms", label: "Terms & Conditions", enabled: proposal?.general?.termsEnabled },
    { id: "services", label: "Services", enabled: proposal?.general?.servicesEnabled },
    { id: "payments", label: "Payments", enabled: proposal?.general?.paymentsEnabled },
    { id: "signature", label: "Sign & Accept", enabled: true },
  ].filter(s => s.enabled);

  const introRef = useRef(null);
  const termsRef = useRef(null);
  const servicesRef = useRef(null);
  const paymentsRef = useRef(null);
  const signatureRef = useRef(null);
  const refMap = {
    introduction: introRef,
    terms: termsRef,
    services: servicesRef,
    payments: paymentsRef,
    signature: signatureRef,
  };

  const handleStepClick = (id) => {
    const sectionRef = refMap[id];
    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setActiveStep(id);
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;

    for (let step of steps) {
      const stepRef = refMap[step.id];
      if (stepRef?.current) {
        const offsetTop = stepRef.current.offsetTop;
        if (scrollTop + 50 >= offsetTop) {
          setActiveStep(step.id);
        }
      }
    }
  };

  /** ✅ Complete button action */
  const handleCompleteProposal = async () => {
    try {
      setIsSigning(true);

      const payload = {
        status: "Signed",
        signedAt: new Date(),
        signature: signatureType === "draw" ? signatureData : typedSignature,
      };

      await axios.put(`http://localhost:9000/account/proposals/${proposal._id}`, payload);
      handleClose();
    } catch (err) {
      console.error("Signature save error:", err);
    } finally {
      setIsSigning(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
        <h1 className="text-lg font-semibold text-slate-900 truncate">
          {proposal?.general?.proposalName || "Proposal"}
        </h1>
        <button onClick={handleClose} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDE MENU */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50/70 overflow-y-auto">
          <nav className="p-3 space-y-1">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all ${
                  activeStep === step.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                }`}
              >
                {step.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10" onScroll={handleScroll}>
          <div className="mx-auto max-w-3xl space-y-8">

            {/* INTRODUCTION */}
            {proposal?.general?.introductionEnabled && (
              <section ref={introRef} className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">{proposal?.introduction?.title || "Introduction"}</h2>
                <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                  {HTMLReactParser(proposal?.introduction?.description || "")}
                </div>
                <hr className="border-slate-200" />
              </section>
            )}

            {/* TERMS */}
            {proposal?.general?.termsEnabled && (
              <section ref={termsRef} className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">Terms & Conditions</h2>
                <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                  {HTMLReactParser(proposal?.terms?.description || "")}
                </div>
                <hr className="border-slate-200" />
              </section>
            )}

            {/* SERVICES - ITEMIZED */}
            {proposal?.general?.servicesEnabled && proposal?.services?.option === "services" && (
              <section ref={servicesRef} className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Services</h2>
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-2 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <span>Service</span>
                    <span className="text-right">Rate</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Tax</span>
                    <span className="text-right">Amount</span>
                  </div>
                  {proposal?.services?.itemizedData?.lineItems?.map((item, i) => {
                    const rate = Number(item.rate || 0);
                    const qty = Number(item.quantity || 1);
                    const taxRate = proposal?.services?.itemizedData?.taxRate || 0;
                    const base = rate * qty;
                    const tax = item.tax ? (base * taxRate) / 100 : 0;
                    const total = base + tax;
                    return (
                      <div key={i} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-2 border-t border-slate-100 px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium text-slate-800">{item.productorService}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                        <span className="text-right text-slate-700">${rate.toFixed(2)}</span>
                        <span className="text-right text-slate-700">{qty}</span>
                        <span className="text-right text-slate-700">${tax.toFixed(2)}</span>
                        <span className="text-right font-medium text-slate-900">${total.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm font-bold text-slate-900">
                    Total: ${proposal?.services?.itemizedData?.totalAmount?.toFixed(2)}
                  </div>
                </div>
                <hr className="border-slate-200" />
              </section>
            )}

            {/* SERVICES - INVOICE MODE */}
            {proposal?.general?.servicesEnabled && proposal?.services?.option === "invoice" && (
              <section ref={servicesRef} className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Invoice</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</span>
                    <div className="mt-1 rounded-lg bg-slate-50 px-4 py-2.5 text-sm text-slate-800">
                      ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Invoice will be issued</span>
                    <div className="mt-1 rounded-lg bg-slate-50 px-4 py-2.5 text-sm text-slate-800">
                      {proposal?.services?.invoices?.[0]?.issueinvoice || "N/A"}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</span>
                    <div className="mt-1 rounded-lg bg-slate-50 px-4 py-2.5 text-sm text-slate-800">
                      {proposal?.services?.invoices?.[0]?.description || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Collapsible Invoice Details */}
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <button
                    onClick={() => setInvoiceDetailsOpen(!invoiceDetailsOpen)}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    Invoice details
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${invoiceDetailsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {invoiceDetailsOpen && (
                    <div className="border-t border-slate-200">
                      <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-2 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <span>Service</span>
                        <span className="text-right">Rate</span>
                        <span className="text-right">Qty</span>
                        <span className="text-right">Tax</span>
                        <span className="text-right">Amount</span>
                      </div>
                      {proposal?.services?.invoices?.[0]?.lineItems?.map((item, i) => {
                        const rate = Number(item.rate || 0);
                        const qty = Number(item.quantity || 1);
                        const taxRate = proposal?.services?.invoices?.[0]?.taxRate || 0;
                        const base = rate * qty;
                        const tax = item.tax ? (base * taxRate) / 100 : 0;
                        const total = base + tax;
                        return (
                          <div key={i} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-2 border-t border-slate-100 px-4 py-3 text-sm">
                            <div>
                              <p className="font-medium text-slate-800">{item.productorService}</p>
                              <p className="text-xs text-slate-500">{item.description}</p>
                            </div>
                            <span className="text-right text-slate-700">${rate.toFixed(2)}</span>
                            <span className="text-right text-slate-700">{qty}</span>
                            <span className="text-right text-slate-700">${tax.toFixed(2)}</span>
                            <span className="text-right font-medium text-slate-900">${total.toFixed(2)}</span>
                          </div>
                        );
                      })}
                      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm font-bold text-slate-900">
                        Total: ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
                <hr className="border-slate-200" />
              </section>
            )}

            {/* PAYMENTS */}
            {proposal?.general?.paymentsEnabled && (
              <section ref={paymentsRef} className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">Payments</h2>
                <div className="space-y-1 text-sm text-slate-700">
                  <p><span className="font-semibold">Method:</span> {proposal?.payments?.method}</p>
                  <p><span className="font-semibold">Amount:</span> ${proposal?.payments?.amount}</p>
                </div>
                <hr className="border-slate-200" />
              </section>
            )}

            {/* SIGNATURE SECTION */}
            <section ref={signatureRef} className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">Sign & Accept</h2>
              <hr className="border-slate-200" />

              {proposal?.status === "Signed" ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">
                    Signed on {new Date(proposal.signedAt).toLocaleString()}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">Signature:</p>
                  {proposal?.signature?.startsWith("data:image") ? (
                    <img src={proposal.signature} alt="signature" className="mt-2 max-w-[300px] rounded-lg border border-slate-200 bg-white p-3" />
                  ) : (
                    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-2xl" style={{ fontFamily: "cursive" }}>
                      {proposal.signature}
                    </div>
                  )}
                  <button disabled className="mt-3 inline-flex items-center rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed opacity-70">
                    Already Signed
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Signature type selector */}
                  <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setSignatureType("draw")}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                        signatureType === "draw"
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Pen className="h-3.5 w-3.5" /> Draw
                    </button>
                    <button
                      onClick={() => setSignatureType("type")}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-l border-slate-200 ${
                        signatureType === "type"
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Type className="h-3.5 w-3.5" /> Type
                    </button>
                  </div>

                  {/* Draw Mode */}
                  {signatureType === "draw" && (
                    <div className="space-y-3">
                      <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{
                          width: 500,
                          height: 200,
                          className: "rounded-lg border border-slate-200 bg-slate-50/50",
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => sigCanvas.current.clear()}
                          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => {
                            if (sigCanvas.current.isEmpty()) {
                              alert("Please draw your signature first");
                              return;
                            }
                            const signature = sigCanvas.current.toDataURL("image/png");
                            setSignatureData(signature);
                          }}
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                          Save Signature
                        </button>
                      </div>
                      {signatureData && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-emerald-600">Signature saved successfully</p>
                          <img src={signatureData} alt="preview" className="max-w-[300px] rounded-lg border border-slate-200 bg-white p-3" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Type Mode */}
                  {signatureType === "type" && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Type your full name"
                        value={typedSignature}
                        onChange={(e) => setTypedSignature(e.target.value)}
                        className="flex h-12 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-xl shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={{ fontFamily: "cursive" }}
                      />
                      {typedSignature && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-2xl" style={{ fontFamily: "cursive" }}>
                          {typedSignature}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Accept terms checkbox */}
                  <label className="flex items-center gap-3 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      disabled={proposal?.status === "Signed"}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">I accept the Terms & Conditions</span>
                  </label>

                  {/* Complete button */}
                  <button
                    onClick={handleCompleteProposal}
                    disabled={
                      isSigning ||
                      !termsAccepted ||
                      (signatureType === "draw" ? !signatureData : !typedSignature) ||
                      proposal?.status === "Signed"
                    }
                    className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSigning ? "Saving..." : "Complete Proposal"}
                  </button>
                </div>
              )}
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ProposalPreviewDialog;
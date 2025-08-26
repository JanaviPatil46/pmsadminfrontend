


import React, { useState, useRef, useEffect,useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button,ButtonGroup,TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SignatureCanvas from 'react-signature-canvas';
// import { LoginContext } from "../../context/Context";
const ProposalDialog = ({ open, handleClose, proposal, onProposalSigned }) => {
//    const { logindata } = useContext(LoginContext);
//    const [loginUserId, setLoginUserId] = useState();
//     useEffect(() => {
//       if (logindata?.user?.id) {
//         setLoginUserId(logindata.user.id);
//       }
//     }, [logindata]);
  console.log("proposal",proposal)
  const [selectedSection, setSelectedSection] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signatureType, setSignatureType] = useState('draw'); // 'draw' or 'type'
  const [typedSignature, setTypedSignature] = useState('');
  const sectionRefs = useRef({});
  const sigCanvas = useRef(null);
  const [isSigning, setIsSigning] = useState(false);
    const contentRef = useRef(null); // Add this ref for the content container

  const [isManualScroll, setIsManualScroll] = useState(false);

useEffect(() => {
  const contentElement = contentRef.current;
  if (!contentElement) return;

  const handleScroll = () => {
    if (isManualScroll) return; // Prevent updates during manual scroll

    const scrollPosition = contentElement.scrollTop + 600; 
    let activeSection = null;

    for (const [sectionKey, sectionElement] of Object.entries(sectionRefs.current)) {
      if (!sectionElement) continue;
      
      const { offsetTop, offsetHeight } = sectionElement;
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        activeSection = sectionKey;
        break;
      }
    }

    if (activeSection && activeSection !== selectedSection) {
      setSelectedSection(activeSection);
    }
  };

  contentElement.addEventListener('scroll', handleScroll);
  return () => {
    contentElement.removeEventListener('scroll', handleScroll);
  };
}, [selectedSection, isManualScroll]);

  useEffect(() => {
    if (!proposal) return;

    if (proposal.introduction) setSelectedSection("introduction");
    else if (proposal.terms) setSelectedSection("terms");
    else if (
      proposal.servicesandinvoices &&
      proposal.Additemizedserviceswithoutcreatinginvoices === "service"
    )
      setSelectedSection("services");
    else if (
      proposal.servicesandinvoices &&
      proposal.Addinvoiceoraskfordeposit === "invoice"
    )
      setSelectedSection("invoices");
  }, [proposal]);

  useEffect(() => {
    if (selectedSection && sectionRefs.current[selectedSection]) {
      sectionRefs.current[selectedSection].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedSection]);

//   const clearSignature = () => {
//     sigCanvas.current.clear();
//     setSignatureData(null);
//   };

//   const saveSignature = () => {
//     if (!sigCanvas.current?.isEmpty()) {
//       try {
//         // Get the canvas and create a copy
//         const canvas = sigCanvas.current.getCanvas();
//         const tempCanvas = document.createElement('canvas');
//         const ctx = tempCanvas.getContext('2d');
        
//         // Set dimensions
//         tempCanvas.width = canvas.width;
//         tempCanvas.height = canvas.height;
        
//         // Draw the signature
//         ctx.drawImage(canvas, 0, 0);
        
//         // Convert to data URL
//         const signature = tempCanvas.toDataURL('image/png');
//         setSignatureData(signature);
//       } catch (error) {
//         console.error('Error saving signature:', error);
//         alert('Failed to save signature. Please try again.');
//       }
//     }
//   };


//  const handleCompleteProposal = async () => {
//     if (!termsAccepted || (!signatureData && !typedSignature)) {
//       alert('Please accept the terms and provide a signature');
//       return;
//     }

//     setIsSigning(true);
//     try {
//       await onProposalSigned({
//         proposalId: proposal._id,
//         signature: signatureData || typedSignature,
//         signedAt: new Date().toISOString(),
//         signedBy:loginUserId
//       });
      
//       handleClose();
//     } catch (error) {
//       console.error('Error saving signature:', error);
//       alert('Failed to save signature. Please try again.');
//     } finally {
//       setIsSigning(false);
//     }
//   };
  if (!proposal) return null;

  const sections = [];

  if (proposal.introduction) {
    sections.push({
      key: "introduction",
      label: proposal.introductiontextname,
      content: proposal.introductiontext,
    });
  }

  if (proposal.terms) {
    sections.push({
      key: "terms",
      label: proposal.termsandconditionsname,
      content: proposal.termsandconditions,
    });
  }

  // if (
  //   proposal.servicesandinvoices &&
  //   proposal.Additemizedserviceswithoutcreatinginvoices === "service"
  // ) {
  //   const taxRate = proposal.summary?.taxRate || 0;

  //   const serviceHTML = `
  //     <div style="font-family: Arial, sans-serif; color: #1e1e1e;">
  //       <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
  //         <thead style="background-color: #f9fafb;">
  //           <tr>
  //             <th style="text-align: left; padding: 8px;">Service</th>
  //             <th style="text-align: right; padding: 8px;">Rate</th>
  //             <th style="text-align: right; padding: 8px;">Qty</th>
  //             <th style="text-align: right; padding: 8px;">Tax</th>
  //             <th style="text-align: right; padding: 8px;">Amount</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           ${proposal.lineItems
  //             .map((item) => {
  //               const rate = Number(item.rate);
  //               const quantity = Number(item.quantity);
  //               const baseAmount = rate * quantity;
  //               const taxAmount = item.tax ? (baseAmount * taxRate) / 100 : 0;
  //               const totalAmount = baseAmount + taxAmount;

  //               return `
  //                 <tr>
  //                   <td style="padding: 8px;">
  //                     <div><strong>${item.productorService}</strong></div>
  //                     <div style="font-size: 12px; color: #6b7280;">${item.description}</div>
  //                   </td>
  //                   <td style="text-align: right; padding: 8px;">$ ${rate.toFixed(2)}</td>
  //                   <td style="text-align: right; padding: 8px;">${quantity}</td>
  //                   <td style="text-align: right; padding: 8px;">$ ${taxAmount.toFixed(2)}</td>
  //                   <td style="text-align: right; padding: 8px;">$ ${totalAmount.toFixed(2)}</td>
  //                 </tr>`;
  //             })
  //             .join("")}
  //         </tbody>
  //         <tfoot>
  //           <tr>
  //             <td colspan="4" style="text-align: right; padding: 8px;"><strong>Total</strong></td>
  //             <td style="text-align: right; padding: 8px;"><strong>$ ${proposal.summary?.total.toFixed(2)}</strong></td>
  //           </tr>
  //         </tfoot>
  //       </table>
  //     </div>
  //   `;

  //   sections.push({
  //     key: "services",
  //     label: "Services",
  //     content: serviceHTML,
  //   });
  // }

  // if (
  //   proposal.servicesandinvoices &&
  //   proposal.Addinvoiceoraskfordeposit === "invoice"
  // ) {
  //   const taxRate = proposal.summary?.taxRate || 0;

  //   const invoiceHTML = `
  //     <div style="font-family: Arial, sans-serif; color: #1e1e1e;">
  //       <div style="margin-bottom: 20px;">
  //         <p><strong>Amount</strong></p>
  //         <p style="background-color: #f9fafb; padding: 10px; border-radius: 8px;">$${proposal.summary?.total.toFixed(2)}</p>

  //         <p><strong>Invoice will be issued</strong></p>
  //         <p style="background-color: #f9fafb; padding: 10px; border-radius: 8px;">${proposal.issueinvoice}</p>

  //         <p><strong>Description</strong></p>
  //         <p style="background-color: #f9fafb; padding: 10px; border-radius: 8px;">${proposal.description}</p>
  //       </div>

  //       <div>
  //         <p 
  //           style="font-weight: bold; margin-bottom: 10px; cursor: pointer;"
  //           onclick="const table = this.nextElementSibling; const arrow = this.querySelector('span'); if (table.style.display === 'none') { table.style.display = 'block'; arrow.innerHTML = '&#x25B2;'; } else { table.style.display = 'none'; arrow.innerHTML = '&#x25BC;'; }"
  //         >
  //           <span>&#x25BC;</span> Invoice details
  //         </p>

  //         <div style="display: none;">
  //           <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
  //             <thead style="background-color: #f9fafb;">
  //               <tr>
  //                 <th style="text-align: left; padding: 8px;">Service</th>
  //                 <th style="text-align: right; padding: 8px;">Rate</th>
  //                 <th style="text-align: right; padding: 8px;">Qty</th>
  //                 <th style="text-align: right; padding: 8px;">Tax</th>
  //                 <th style="text-align: right; padding: 8px;">Amount</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               ${proposal.lineItems
  //                 .map((item) => {
  //                   const rate = Number(item.rate);
  //                   const quantity = Number(item.quantity);
  //                   const baseAmount = rate * quantity;
  //                   const taxAmount = item.tax ? (baseAmount * taxRate) / 100 : 0;
  //                   const totalAmount = baseAmount + taxAmount;

  //                   return `
  //                     <tr>
  //                       <td style="padding: 8px;">
  //                         <div><strong>${item.productorService}</strong></div>
  //                         <div style="font-size: 12px; color: #6b7280;">${item.description}</div>
  //                       </td>
  //                       <td style="text-align: right; padding: 8px;">$ ${rate.toFixed(2)}</td>
  //                       <td style="text-align: right; padding: 8px;">${quantity}</td>
  //                       <td style="text-align: right; padding: 8px;">$ ${taxAmount.toFixed(2)}</td>
  //                       <td style="text-align: right; padding: 8px;">$ ${totalAmount.toFixed(2)}</td>
  //                     </tr>`;
  //                 })
  //                 .join("")}
  //             </tbody>
  //             <tfoot>
  //               <tr>
  //                 <td colspan="4" style="text-align: right; padding: 8px;"><strong>Total</strong></td>
  //                 <td style="text-align: right; padding: 8px;"><strong>$ ${proposal.summary?.total.toFixed(2)}</strong></td>
  //               </tr>
  //             </tfoot>
  //           </table>
  //         </div>
  //       </div>
  //     </div>
  //   `;

  //   sections.push({
  //     key: "invoices",
  //     label: "Invoices",
  //     content: invoiceHTML,
  //   });
  // }

  
 // Add this check at the beginning of your component
  const isSigned = proposal?.status === "Signed";
  const existingSignature = proposal?.signature;
   sections.push({
    key: "signature",
    label: "Sign & accept",
    content: (
      <div style={{ fontFamily: 'Arial, sans-serif', color: '#1e1e1e', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          {isSigned ? (
            <>
              <p style={{ color: '#666', marginBottom: '20px' }}>Signed on {new Date(proposal.signedAt).toLocaleString()}</p>
              <div style={{ marginBottom: '20px' }}>
                <p>Signature:</p>
                {existingSignature.startsWith('data:image') ? (
                  <img 
                    src={existingSignature} 
                    alt="Saved signature" 
                    style={{ 
                      maxWidth: '300px', 
                      border: '1px solid #e5e7eb', 
                      backgroundColor: 'white',
                      padding: '10px'
                    }} 
                  />
                ) : (
                  <div style={{
                    fontSize: '24px',
                    fontFamily: 'cursive',
                    border: '1px solid #e5e7eb',
                    padding: '20px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px'
                  }}>
                    {existingSignature}
                  </div>
                )}
              </div>
              {/* <div style={{ textAlign: 'left', marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <input 
                    type="checkbox" 
                    checked={true}
                    disabled
                    style={{ marginRight: '10px', marginTop: '3px' }}
                  />
                  <span>Terms accepted on {new Date(proposal.signedAt).toLocaleString()}</span>
                </label>
              </div> */}
              {/* <Button
                variant="contained"
                disabled
                style={{
                  backgroundColor: '#3f80ff',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  width: '100%',
                  fontWeight: 'bold',
                  opacity: 0.7
                }}
              >
                Already Signed
              </Button> */}
            </>
          ) : (
            <>
              <p style={{ color: '#666', marginBottom: '20px' }}>Your signature</p>
              
              {/* Signature Type Toggle */}
              {/* <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <ButtonGroup>
                  <Button
                    variant={signatureType === 'draw' ? 'contained' : 'outlined'}
                    onClick={() => setSignatureType('draw')}
                  >
                    Draw Signature
                  </Button>
                  <Button
                    variant={signatureType === 'type' ? 'contained' : 'outlined'}
                    onClick={() => setSignatureType('type')}
                  >
                    Type Signature
                  </Button>
                </ButtonGroup>
              </div> */}
              
              {/* Drawing Signature */}
              {/* {signatureType === 'draw' && (
                <>
                  <div style={{ 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '4px',
                    marginBottom: '20px',
                    backgroundColor: '#f9fafb'
                  }}>
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className: 'signature-canvas',
                        style: { background: 'transparent' }
                      }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <Button 
                      variant="outlined" 
                      onClick={clearSignature}
                      style={{ flex: 1 }}
                      disabled={isSigning}
                    >
                      Clear
                    </Button>
                    <Button 
                      color="primary"
                      sx={{
                        backgroundColor: 'text.menu',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'menu.dark',
                          boxShadow: 1,
                        },
                        transition: 'background-color 0.2s ease'
                      }}
                      onClick={saveSignature}
                      style={{ flex: 1 }}
                    >
                      Save Signature
                    </Button>
                  </div>
                  
                  {signatureData && (
                    <div style={{ marginBottom: '20px' }}>
                      <p>Your saved signature:</p>
                      <img 
                        src={signatureData} 
                        alt="Saved signature" 
                        style={{ 
                          maxWidth: '300px', 
                          border: '1px solid #e5e7eb', 
                          backgroundColor: 'white',
                          padding: '10px'
                        }} 
                      />
                    </div>
                  )}
                </>
              )} */}
              
              {/* Typed Signature */}
              {/* {signatureType === 'type' && (
                <>
                  <TextField
                    fullWidth
                    size='small'
                    variant="outlined"
                    placeholder="Type your name as signature"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    sx={{
                      marginBottom: '20px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#e5e7eb',
                        },
                        '&:hover fieldset': {
                          borderColor: '#d1d5db',
                        },
                      },
                    }}
                    InputProps={{
                      style: {
                        fontFamily: 'cursive',
                        //   fontFamily: '"Segoe Print", "Bradley Hand", cursive, sans-serif',
                        fontSize: '20px',
                        height: '60px'
                      }
                    }}
                  />
                  
                  {typedSignature && (
                    <div style={{ marginBottom: '20px' }}>
                      <p>Your typed signature:</p>
                      <div style={{
                        fontSize: '24px',
                        fontFamily: 'cursive',
                        border: '1px solid #e5e7eb',
                        padding: '20px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '4px'
                      }}>
                        {typedSignature}
                      </div>
                    </div>
                  )}
                </>
              )} */}
              
              {/* Terms acceptance */}
              <div style={{ textAlign: 'left', marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    style={{ marginRight: '10px', marginTop: '3px' }}
                    // disabled={isSigning}
                    disabled
                  />
                  <span>I accept the above terms and TaxDome's Terms of Service</span>
                </label>
              </div>
              
              {/* Complete button */}
              {/* <Button
                color="primary"
                onClick={handleCompleteProposal}
                disabled={!termsAccepted || (signatureType === 'draw' ? !signatureData : !typedSignature) || isSigning}
                sx={{
                  backgroundColor: 'text.menu',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'menu.dark',
                    boxShadow: 1,
                  },
                  transition: 'background-color 0.2s ease'
                }}
              >
                {isSigning ? 'Processing...' : 'Complete'}
              </Button> */}
            </>
          )}
        </div>
      </div>
    ),
  });
  
  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="h6" component="p">
          {proposal?.proposalname || "Proposal"}
        </Typography>
        <IconButton edge="end" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", height: "100%", p: 0 }}>
        {/* Left Navigation */}
        <Box
          sx={{
            width: 250,
            borderRight: "1px solid #ddd",
            height: "100%",
          }}
        >
            <List>
  {sections.map((section) => {
    // Check "completion" status
    let isCompleted = false;

    if (section.key === "introduction" && proposal?.introduction) {
      isCompleted = true;
    }
    if (section.key === "terms" && proposal?.terms) {
      isCompleted = true;
    }
    if (section.key === "services" && proposal?.lineItems?.length > 0) {
      isCompleted = true;
    }
    if (section.key === "invoices" && proposal?.lineItems?.length > 0) {
      isCompleted = true;
    }
    if (section.key === "signature" && proposal?.signature) {
      isCompleted = true;
    }

    return (
      <ListItemButton
        key={section.key}
        selected={selectedSection === section.key}
        onClick={() => {
          setSelectedSection(section.key);
          setIsManualScroll(true);
          sectionRefs.current[section.key]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          setTimeout(() => {
            setIsManualScroll(false);
          }, 800);
        }}
      >
        <ListItemText
          primary={section.label}
          primaryTypographyProps={{
            sx: {
              color: isCompleted ? "green" : "inherit",  // ✅ green if completed
              fontWeight: section.key === selectedSection ? 600 : 400,
            },
          }}
        />
      </ListItemButton>
    );
  })}
</List>

          {/* <List>
            {sections.map((section) => (
             
              <ListItemButton
  key={section.key}
  selected={selectedSection === section.key}
  onClick={() => {
    setSelectedSection(section.key);
    setIsManualScroll(true); // lock
    sectionRefs.current[section.key]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Unlock after smooth scroll finishes (~800ms)
    setTimeout(() => {
      setIsManualScroll(false);
    }, 800);
  }}
>
  <ListItemText primary={section.label} primaryTypographyProps={{
          sx: {
            color:
              section.key === "signature" && proposal?.signature
                ? "green" // ✅ make signature section green if signature exists
                : "inherit",
            fontWeight: section.key === selectedSection ? 600 : 400,
          },
        }} />
</ListItemButton>

            ))}
          </List> */}
        </Box>

        {/* Right Content - Scrollable All Sections */}
        <Box
         ref={contentRef} // Add the ref here
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {sections.map((section) => (
            <Box
              key={section.key}
              ref={(el) => (sectionRefs.current[section.key] = el)}
              sx={{ mb: 6 }}
            >
              <Typography variant="h6" component="p" gutterBottom sx={{ fontWeight: "600" }}>
                {section.label}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {typeof section.content === 'string' ? (
                <Box
                  dangerouslySetInnerHTML={{ __html: section.content }}
                  sx={{ lineHeight: 1.7 }}
                />
              ) : (
                section.content
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalDialog;
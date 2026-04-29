


import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import { X, CheckCircle2 } from "lucide-react";
import HTMLReactParser from "html-react-parser";
import { toast } from "react-toastify";

const ProposalPreviewDialog = ({ open, handleClose, proposal }) => {
  const [activeStep, setActiveStep] = useState("general");
  // Signature States
  const [signatureType, setSignatureType] = useState("draw");
  const [signatureData, setSignatureData] = useState(null);
  const [typedSignature, setTypedSignature] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const sigCanvas = useRef(null);
  
  // Check if proposal is signed
  const isSigned = proposal?.status === "Signed";
  
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

      await axios.post(`https://www.snptaxes.com/account/proposals/sign/${proposal._id}`, payload);
      toast.success("Proposal signed successfully");
      handleClose();
    } catch (err) {
      console.error("Signature save error:", err);
    } finally {
      setIsSigning(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-card">
      {/* Title bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <span className="text-base font-semibold">{proposal?.general?.proposalName || "Proposal"}</span>
        <button type="button" onClick={handleClose} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* LEFT SIDE MENU */}
        <div className="w-[28%] border-r border-border overflow-y-auto">
          <ul>
            {steps.map((step) => (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => handleStepClick(step.id)}
                  className={`w-full text-left flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                    activeStep === step.id ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted"
                  } ${isSigned ? "text-success" : ""}`}
                >
                  {isSigned && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                  {step.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 overflow-y-auto p-5" onScroll={handleScroll}>

          {/* INTRODUCTION */}
          {proposal?.general?.introductionEnabled && (
            <div ref={introRef} className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{proposal?.introduction?.title || "Introduction"}</h2>
              <div className="text-sm">{HTMLReactParser(proposal?.introduction?.description || "")}</div>
              <hr className="my-4 border-border" />
            </div>
          )}

          {/* TERMS */}
          {proposal?.general?.termsEnabled && (
            <div ref={termsRef} className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Terms &amp; Conditions</h2>
              <div className="text-sm">{HTMLReactParser(proposal?.terms?.description || "")}</div>
              <hr className="my-4 border-border" />
            </div>
          )}

          {/* SERVICES - ITEMIZED */}
          {proposal?.general?.servicesEnabled && proposal?.services?.option === "services" && (
            <div ref={servicesRef} className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Services</h2>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] p-2 font-bold text-sm">
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
                    <div key={i} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] p-2 border-t border-border text-sm">
                      <div>
                        <p className="font-bold">{item.productorService}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <span className="text-right">${rate.toFixed(2)}</span>
                      <span className="text-right">{qty}</span>
                      <span className="text-right">${tax.toFixed(2)}</span>
                      <span className="text-right">${total.toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="border-t border-border p-2 flex justify-end font-bold text-sm">
                  Total: ${proposal?.services?.itemizedData?.totalAmount?.toFixed(2)}
                </div>
              </div>
              <hr className="my-4 border-border" />
            </div>
          )}

          {/* SERVICES - INVOICE MODE */}
          {proposal?.general?.servicesEnabled && proposal?.services?.option === "invoice" && (
            <div ref={servicesRef} className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Invoice</h2>
              <div className="mb-3 space-y-3">
                <div>
                  <p className="font-bold text-sm">Amount</p>
                  <div className="bg-muted p-2 rounded-lg text-sm">${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}</div>
                </div>
                <div>
                  <p className="font-bold text-sm mt-2">Invoice will be issued</p>
                  <div className="bg-muted p-2 rounded-lg text-sm">{proposal?.services?.invoices?.[0]?.issueinvoice || "N/A"}</div>
                </div>
                <div>
                  <p className="font-bold text-sm mt-2">Description</p>
                  <div className="bg-muted p-2 rounded-lg text-sm">{proposal?.services?.invoices?.[0]?.description || "N/A"}</div>
                </div>
              </div>

              {/* Accordion-style invoice details */}
              <details className="border border-border rounded-lg overflow-hidden">
                <summary className="p-2 font-bold text-sm cursor-pointer bg-muted">Invoice details ▼</summary>
                <div className="border border-border rounded-lg overflow-hidden m-2">
                  <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] p-2 font-bold text-sm bg-muted">
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
                      <div key={i} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] p-2 border-t border-border text-sm">
                        <div>
                          <p className="font-bold">{item.productorService}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        <span className="text-right">${rate.toFixed(2)}</span>
                        <span className="text-right">{qty}</span>
                        <span className="text-right">${tax.toFixed(2)}</span>
                        <span className="text-right">${total.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-border p-2 flex justify-end font-bold text-sm">
                    Total: ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
                  </div>
                </div>
              </details>
              <hr className="my-4 border-border" />
            </div>
          )}

          {/* PAYMENTS */}
          {proposal?.general?.paymentsEnabled && (
            <div ref={paymentsRef} className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Payments</h2>
              <p className="text-sm"><b>Method:</b> {proposal?.payments?.method}</p>
              <p className="text-sm"><b>Amount:</b> ${proposal?.payments?.amount}</p>
              <hr className="my-4 border-border" />
            </div>
          )}

          {/* ✅ SIGNATURE SECTION */}
          {/* <Box ref={signatureRef} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Sign & Accept</Typography>
            <Divider sx={{ mb: 2 }} />

            {proposal?.status === "Signed" ? (
              <>
                <Typography sx={{ mb: 2 }} color="text.secondary">
                  Signed on {new Date(proposal.signedAt).toLocaleString()}
                </Typography>

                <Typography fontWeight="bold">Signature:</Typography>

                {proposal?.signature?.startsWith("data:image") ? (
                  <img
                    src={proposal.signature}
                    alt="signature"
                    style={{
                      maxWidth: 300,
                      border: "1px solid #ddd",
                      background: "white",
                      padding: 10,
                      marginTop: 10,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      fontSize: 24,
                      fontFamily: "cursive",
                      border: "1px solid #ccc",
                      padding: 20,
                      background: "#f7f7f7",
                      marginTop: 10,
                      borderRadius: 6,
                    }}
                  >
                    {proposal.signature}
                  </div>
                )}

                <Button variant="contained" disabled sx={{ mt: 2, opacity: 0.7 }}>
                  Already Signed
                </Button>
              </>
            ) : (
              <>
               
                <ButtonGroup sx={{ mb: 2 }}>
                  <Button
                    variant={signatureType === "draw" ? "contained" : "outlined"}
                    onClick={() => setSignatureType("draw")}
                  >
                    Draw
                  </Button>
                  <Button
                    variant={signatureType === "type" ? "contained" : "outlined"}
                    onClick={() => setSignatureType("type")}
                  >
                    Type
                  </Button>
                </ButtonGroup>

                
                {signatureType === "draw" && (
                  <>
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        width: 500,
                        height: 200,
                        style: {
                          border: "1px solid #ccc",
                          background: "#fafafa",
                          borderRadius: 6,
                        },
                      }}
                    />

                    <Box sx={{ display: "flex", gap: 1, my: 2 }}>
                      <Button variant="outlined" onClick={() => sigCanvas.current.clear()}>
                        Clear
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (sigCanvas.current.isEmpty()) {
                            alert("Please draw your signature first");
                            return;
                          }
                          const signature = sigCanvas.current.toDataURL("image/png");
                          setSignatureData(signature);
                        }}
                      >
                        Save Signature
                      </Button>
                    </Box>

                    {signatureData && (
                      <>
                        <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                          ✓ Signature saved successfully
                        </Typography>
                        <img
                          src={signatureData}
                          alt="preview"
                          style={{
                            maxWidth: 300,
                            border: "1px solid #ddd",
                            padding: 10,
                            background: "white",
                          }}
                        />
                      </>
                    )}
                  </>
                )}

               
                {signatureType === "type" && (
                  <>
                    <TextField
                      fullWidth
                      placeholder="Type your full name"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      sx={{ mb: 2 }}
                      InputProps={{
                        style: { fontFamily: "cursive", fontSize: 22 },
                      }}
                    />

                    {typedSignature && (
                      <div
                        style={{
                          fontSize: 24,
                          fontFamily: "cursive",
                          border: "1px solid #ccc",
                          padding: 20,
                          background: "#fafafa",
                          borderRadius: 6,
                          marginBottom: 20,
                        }}
                      >
                        {typedSignature}
                      </div>
                    )}
                  </>
                )}

                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      disabled={proposal?.status === "Signed"}
                    />
                  }
                  label="I accept the Terms & Conditions"
                  sx={{ mt: 2 }}
                />

                
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={
                    isSigning ||
                    !termsAccepted ||
                    (signatureType === "draw" ? !signatureData : !typedSignature) ||
                    proposal?.status === "Signed"
                  }
                  onClick={handleCompleteProposal}
                >
                  {isSigning ? "Saving..." : "Complete Proposal"}
                </Button>
              </>
            )}
          </Box> */}
          {/* SIGNATURE SECTION */}
          <div ref={signatureRef} className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Sign &amp; Accept</h2>
            <hr className="mb-4 border-border" />

            {proposal?.status === "Signed" ? (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Signed on {new Date(proposal.signedAt).toLocaleString()}
                </p>
                <p className="font-bold text-sm mb-2">Signature:</p>
                {proposal?.signature?.startsWith("data:image") ? (
                  <img src={proposal.signature} alt="signature"
                    className="max-w-[300px] border border-border bg-card p-2 mt-2" />
                ) : (
                  <div className="text-2xl mt-2 p-5 border border-border bg-muted rounded-md font-[cursive]">
                    {proposal.signature}
                  </div>
                )}
                <button type="button" disabled
                  className="mt-4 px-4 py-2 rounded text-sm font-medium text-white bg-primary opacity-70 cursor-not-allowed">
                  Already Signed
                </button>
              </div>
            ) : (
              <p className="text-sm text-destructive mt-2">Proposal is not signed yet.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProposalPreviewDialog;
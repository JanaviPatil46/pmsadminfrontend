import React from "react";
import { Chip, Tooltip, Stack, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CancelIcon from "@mui/icons-material/Cancel";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// ================= SIGNATURE STATUS MAP =================
export const signatureStatusMap = {
  pending: {
    label: "Pending Signature",
    color: "#FFB300",
    icon: <HourglassBottomIcon sx={{ fontSize: 16 }} />,
    bg: "rgba(255,179,0,0.15)"
  },
  signed: {
    label: "Signed",
    color: "#2E7D32",
    icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
    bg: "rgba(46,125,50,0.15)"
  },
  rejected: {
    label: "Signature Rejected",
    color: "#D32F2F",
    icon: <CancelIcon sx={{ fontSize: 16 }} />,
    bg: "rgba(211,47,47,0.15)"
  },
  required: {
    label: "Signature Required",
    color: "#0288D1",
    icon: <EditNoteIcon sx={{ fontSize: 16 }} />,
    bg: "rgba(2,136,209,0.15)"
  },
  "": {
    label: "Not Signed",
    color: "#757575",
    icon: <ErrorOutlineIcon sx={{ fontSize: 16 }} />,
    bg: "rgba(117,117,117,0.10)"
  }
};

// ================= APPROVAL STATUS MAP =================
export const approvalStatusMap = {
  sendForApproval: {
    label: "Pending Approval",
    color: "#FFB300",
    icon: <HourglassBottomIcon sx={{ fontSize: 16 }} />,
    bg: "rgba(255,179,0,0.15)"
  },

  approvalCompleted: {
    label: "Approved",
    color: "#2E7D32",
    icon: <VerifiedIcon sx={{ fontSize: 16 }} />,
    bg: "rgba(46,125,50,0.15)"
  },

  cancledApproval: {
    label: "Approval Cancelled",
    color: "#D32F2F",
    icon: <CancelIcon sx={{ fontSize: 16 }} />,
    bg: "rgba(211,47,47,0.15)"
  },

  rejected: {
    label: "Rejected",
    color: "#D32F2F",
    icon: <CancelIcon sx={{ fontSize: 16 }} />,
    bg: "rgba(211,47,47,0.15)"
  },

  verified: {
    label: "Verified",
    color: "#2E7D32",
    icon: <VerifiedIcon sx={{ fontSize: 16 }} />,
    bg: "rgba(46,125,50,0.15)"
  },

  "": {
    label: "No Approval",
    color: "#757575",
    icon: <ErrorOutlineIcon sx={{ fontSize: 16 }} />,
    bg: "rgba(117,117,117,0.10)"
  }
};

// ================= MAIN CHIP COMPONENT =================
const FileStatusChips = ({ meta }) => {
  const signature = signatureStatusMap[meta.signStatus || ""];
  const approval = approvalStatusMap[meta.authStatus || ""];

  return (
    <Stack direction="row" spacing={1} mt={1}>
      {/* SIGNATURE CHIP */}
      <Chip
        label={
          <Box display="flex" alignItems="center" gap={0.5}>
            {signature.icon}
            {signature.label}
          </Box>
        }
        sx={{
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 500,
          backgroundColor: signature.bg,
          color: signature.color,
          border: `1px solid ${signature.color}`
        }}
        size="small"
      />

      {/* APPROVAL CHIP WITH TOOLTIP FOR CANCEL REASON */}
      <Tooltip
        title={
          meta.authStatus === "cancledApproval"
            ? meta.cancelReason || "Approval cancelled"
            : ""
        }
      >
        <Chip
          label={
            <Box display="flex" alignItems="center" gap={0.5}>
              {approval.icon}
              {approval.label}
            </Box>
          }
          sx={{
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: 500,
            backgroundColor: approval.bg,
            color: approval.color,
            border: `1px solid ${approval.color}`,
            cursor: meta.authStatus === "cancledApproval" ? "pointer" : "default"
          }}
          size="small"
        />
      </Tooltip>
    </Stack>
  );
};

export default FileStatusChips;

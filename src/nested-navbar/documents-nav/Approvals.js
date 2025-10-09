import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const Approvals = () => {
   const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
    const { data } = useParams();
  const [approvals, setApprovals] = useState([]);
  

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await axios.get(
          `${DOCS_MANAGMENTS}/approvals/approvalList/byaccountid/${data}`
        );
        setApprovals(res.data.approvals || []);
      } catch (err) {
        console.error("Error fetching approvals:", err);
      }
    };
    fetchApprovals();
  }, [data]);

  return (
    <Box p={2}>
     
      <TableContainer component={Paper}>
        <Table>
          <TableHead >
            <TableRow>
              <TableCell><strong>Document Name</strong></TableCell>
            
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Created At</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvals.length > 0 ? (
              approvals.map((approval, index) => (
                <TableRow key={approval._id || index}>
                  <TableCell>{approval.filename || "—"}</TableCell>
               
                  <TableCell>{approval.status}</TableCell>
                  <TableCell>{approval.description}</TableCell>
                <TableCell>
  {approval.updatedAt
    ? new Date(approval.updatedAt).toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
      })
    : "—"}
</TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Approvals;

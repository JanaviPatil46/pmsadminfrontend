import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
const Signatures = () => {
   const SIGNATURE_API =process.env.REACT_APP_ESIGNATURE_API
   const [signatureList,setSignatureList]=useState([])
    const { data } = useParams();
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await axios.get(
          `${SIGNATURE_API}/signautrelist/${data}`
        );
        setSignatureList(res.data || []);
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
             
            </TableRow>
          </TableHead>
          <TableBody>
            {signatureList.length > 0 ? (
              signatureList.map((signautrelist, index) => (
                <TableRow key={signautrelist._id || index}>
                  <TableCell>{signautrelist.filename || "—"}</TableCell>
               
                  <TableCell>{signautrelist.status}</TableCell>
              

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
  )
}

export default Signatures
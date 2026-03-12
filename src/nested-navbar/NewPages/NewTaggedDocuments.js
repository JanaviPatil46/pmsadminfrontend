import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Paper,
} from "@mui/material";

const NewTaggedDocuments = ({ accountId }) => {
    console.log("accountid for new tags",accountId)
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
  try {
    const res = await axios.get(
      "https://www.snptaxes.com/api/accountsdoc/documents/new-tagged",
      {
        params: {
          accountId: "69b12185cb6719366b553883",
        },
      }
    );

    console.log("API Response:", res.data);

    setDocuments(res.data.documents || []);
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

  useEffect(() => {
    if (accountId) {
      fetchDocuments();
    }
  }, [accountId]);

  return (
    <Box sx={{ p: 2 }}>
      {/* <Typography variant="h6" sx={{ mb: 2 }}>
        New Tagged Documents
      </Typography> */}

      {/* <Paper> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight:'bold'}}>Document Name</TableCell>
              <TableCell sx={{fontWeight:'bold'}}>Tag</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {documents.map((doc, index) => (
              <TableRow key={index}>
                <TableCell>{doc.name}</TableCell>

                <TableCell>
                  {doc.meta.tags.map((tag, i) => (
                    <Chip
                      key={i}
                      label={tag.tagName}
                      sx={{
                        backgroundColor: tag.tagColour,
                        color: "#fff",
                        mr: 1,
                      }}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))}

            {documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No documents found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      {/* </Paper> */}
    </Box>
  );
};

export default NewTaggedDocuments;
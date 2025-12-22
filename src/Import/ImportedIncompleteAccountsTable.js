import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ImportedIncompleteAccountsTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(
          "https://www.snptaxes.com/api/accounts/imported-incomplete?active=true"
        );
        setAccounts(res.data.accountlist || []);
      } catch (err) {
        console.error("Failed to fetch accounts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Account Name</strong></TableCell>
            <TableCell><strong>Client Type</strong></TableCell>
            <TableCell><strong>Tags</strong></TableCell>
            <TableCell><strong>Contact Emails</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No accounts found
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => (
              <TableRow key={account._id}>
                
                {/* ✅ CLICKABLE ACCOUNT NAME */}
                <TableCell>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: "primary.main",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() =>
                      navigate(`/importedaccounts/${account._id}/docs`)
                    }
                  >
                    {account.accountName}
                  </Typography>
                </TableCell>

                <TableCell>{account.clientType}</TableCell>

                <TableCell>
                  {account.tags?.map((tag) => (
                    <Chip
                      key={tag._id}
                      label={tag.tagName}
                      size="small"
                      sx={{
                        backgroundColor: tag.tagColour,
                        color: "#fff",
                        mr: 0.5,
                        mb: 0.5,
                      }}
                    />
                  ))}
                </TableCell>

                <TableCell>
                  {account.contacts?.length > 0 ? (
                    account.contacts.map((c) => (
                      <Typography key={c._id} variant="body2">
                        {c.contact?.email || "-"}
                      </Typography>
                    ))
                  ) : (
                    "-"
                  )}
                </TableCell>

              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ImportedIncompleteAccountsTable;

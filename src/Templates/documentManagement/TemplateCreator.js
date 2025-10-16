import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
const TemplateCreator = () => {
  const [templatename, setTemplateName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("https://www.snptaxes.com/api/foldertemp/folder-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templatename }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success! Folder template created: ${data.templatePath}`);
        const templateId = data.templatePath.split("/")[0];
        console.log("templateId",templateId)
        // Redirect to tree structure component and pass templateId as URL param
        // navigate(`/tree/${templateId}`);
          const encodedPath = encodeURIComponent(data.templatePath); // encode slashes etc.
  // navigate(`/tree/${encodedPath}`);
   navigate(`/firmtemp/templates/tree/${encodedPath}`, { state: { templateName: templatename } });
      } else {
        setError(data.error || "Failed to create folder template");
      }
    } catch (err) {
      setError("Network error or server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div style={{ margin: "auto", padding: 20 }}>
    //   <h2>Create Folder Template</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="text"
    //       value={templatename}
    //       onChange={(e) => setTemplateName(e.target.value)}
    //       placeholder="Enter template name"
    //       required
    //       style={{ width: "100%", padding: 8, marginBottom: 10 }}
    //     />
    //     <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
    //       {loading ? "Creating..." : "Create"}
    //     </button>
    //   </form>
    //   {message && <p style={{ color: "green", marginTop: 10 }}>{message}</p>}
    //   {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    // </div>
    <Box
      sx={{
        margin: "auto",
        padding: 3,
      
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Create Folder Template
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <TextField
          label="Template Name"
          variant="outlined"
          fullWidth
          required
          value={templatename}
          onChange={(e) => setTemplateName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          // fullWidth
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default TemplateCreator;

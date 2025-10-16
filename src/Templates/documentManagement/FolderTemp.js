import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FolderTemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          "https://www.snptaxes.com/api/foldertemp/templatelist"
        );
        setTemplates(response.data.folderTemplates); // assuming response.data is an array
        console.log("Templates:", response.data);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError("Failed to fetch templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);
  const handleCreateTemplate = () => {
    navigate("/firmtemp/templates/createfolder");
  };
  return (
    <div>
      <Button variant="contained" onClick={handleCreateTemplate}>
        Create Template
      </Button>
      {loading && <p>Loading templates...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <ul>
          {templates.map((template, index) => (
            <li key={index}>
              <Button
                onClick={() =>
                  navigate(
                    `/firmtemp/templates/tree/${encodeURIComponent(template._id)}`, // 👈 pass ID in URL
                    {
                      state: {
                        templateId: template._id, // 👈 send ID
                        templateName: template.templatename, // 👈 send name
                      },
                    }
                  )
                }
              >
                {template.templatename || "Unnamed Template"}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FolderTemplateList;

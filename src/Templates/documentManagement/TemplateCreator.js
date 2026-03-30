import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormPage, FormSection, FormField } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { FolderPlus } from "lucide-react";

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
        toast.success(`Success! Folder template created`)
          const encodedPath = encodeURIComponent(data.templatePath);
   navigate(`/firmtemp/templates/tree/${encodedPath}`, { state: { templateName: templatename } });
      } else {
        setError(data.error || "Failed to create folder template");
        toast.error("Failed to create folder template")
      }
    } catch (err) {
      setError("Network error or server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPage
      title="Create Folder Template"
      subtitle="Set up a new document folder template"
    >
      <FormSection title="Template Info" icon={<FolderPlus className="h-4 w-4" />}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Template Name">
            <Input
              placeholder="Enter template name"
              required
              value={templatename}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </FormField>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>

        {message && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </FormSection>
    </FormPage>
  );
};

export default TemplateCreator;

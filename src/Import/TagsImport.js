import React, { useState } from "react";
import Papa from "papaparse";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";

const TagsImport = () => {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const handleTagsFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log(result);
          const data = result.data.map((row) => ({
            tagName: row["Tags"] || "",
          }));
          setTags(data);
          setSelectedTags([]);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };
  const handleSelectTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSelectAllTags = () => {
    setSelectedTags(selectedTags.length === tags.length ? [] : [...tags]);
  };
  // const tagColours = [
  //   "#fd3241",
  //   "#f9b5ac",
  //   "#ac6400",
  //   "#ff7e39",
  //   "#ffea00",
  //   "#94ecbe",
  //   "#2e8b57",
  //   "#76ac1e",
  //   "#3cbb50",
  //   "#9ed8db",
  //   "#0299bb",
  //   "#0af4b8",
  //   "#466efb",
  //   "#0496ff",
  //   "#b9c1ff",
  //   "#e1b1ff",
  //   "#9d33d0",
  //   "#d834f5",
  //   "#ff54b6",
  //   "#1d3354",
  //   "#767b91",
  //   "#8f8f8f",
  //   "#c7c7c7",
  //   "#9a657e",
  //   "#616468",
  //   "#511dff",
  //   "#85c7db",
  //   "#8cd1ff",
  //   "#0aefff",
  //   "#d4ff00",
  //   "#a1ff0a",
  //   "#00f43d",
  //   "#ffc100",
  //   "#cdc6a5",
  //   "#fed6b1",
  //   "#e5dfdf",
  //   "#ffeaa7",
  // ];
 
 
 
  const tagColours = ["#0d6efd", "#6c757d","#198754","#dc3545","#ffc107","#0dcaf0","#FF5722","#212529"];
 
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const handleSaveSelectedTags = async () => {
    try {
      const savedTags = []; // Store created tags for CSV
      for (const tag of selectedTags) {
        const tagToSave = {
          tagName: tag.tagName,
          tagColour: tagColours[Math.floor(Math.random() * tagColours.length)],
          active: true,
        };

        console.log("Saving Tag:", tagToSave);

        const response = await fetch(`${TAGS_API}/tags/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tagToSave),
        });

        const result = await response.json();
        console.log("Response:", result);

        if (!response.ok) {
          alert("Failed to save tag: " + result.error);
        } else {
          console.log(
            "Tag ID:",
            result.tags._id,
            "Tag Name:",
            result.tags.tagName
          );
          savedTags.push({
            _id: result.tags._id,
            tagName: result.tags.tagName,
          });
        }
      }

      // Generate CSV file
      if (savedTags.length > 0) {
        generateCSV(savedTags);
      }

      alert("Tags saved successfully!");
      setSelectedTags([]); // Clear selected tags after saving
    } catch (error) {
      console.error("Error saving tags:", error);
      alert("Error saving tags!");
    }
  };

  const generateCSV = (tags) => {
    const csvHeader = "ID,Tag Name\n";
    const csvRows = tags.map((tag) => `${tag._id},${tag.tagName}`).join("\n");
    const csvContent = csvHeader + csvRows;

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "created_tags.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Import Tags</h1>

      <div className="flex items-center gap-3">
        <label className="cursor-pointer">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border border-input bg-background hover:bg-muted transition-colors">
            Import Tags
          </span>
          <input type="file" accept=".csv" hidden onChange={handleTagsFileUpload} />
        </label>

        {selectedTags.length > 0 && (
          <Button
            onClick={handleSaveSelectedTags}
            className="rounded-full px-5"
            style={{ backgroundColor: "var(--color-save-btn)" }}
          >
            Create Tags ({selectedTags.length})
          </Button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 w-10">
                  <Checkbox
                    checked={selectedTags.length === tags.length && tags.length > 0}
                    onCheckedChange={handleSelectAllTags}
                  />
                </th>
                <th className="text-xs font-semibold text-left px-4 py-3 text-muted-foreground uppercase tracking-wide">
                  Tag Name
                </th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag, index) => (
                <tr key={index} className={`border-b hover:bg-muted/30 transition-colors ${selectedTags.includes(tag) ? "bg-blue-50/50" : ""}`}>
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleSelectTag(tag)}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium">{tag.tagName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TagsImport;

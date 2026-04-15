import React, { useState } from "react";
import Papa from "papaparse";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Upload, Tag } from "lucide-react";

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

      {tags.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-border bg-muted/20 px-12 py-14 text-center w-full max-w-sm">
            <div className="rounded-full bg-primary/10 p-5">
              <Tag className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">Upload Tags CSV</h3>
              <p className="text-sm text-muted-foreground">Select a <span className="font-medium">.csv</span> file to import tags</p>
            </div>
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors cursor-pointer">
                <Upload className="h-4 w-4" /> Choose CSV File
              </span>
              <input type="file" accept=".csv" hidden onChange={handleTagsFileUpload} />
            </label>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer">
                <Upload className="h-4 w-4" /> Upload New CSV
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

          <div className="overflow-x-auto rounded-xl border shadow-sm bg-background">
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
                  <tr key={index} className={`border-b hover:bg-muted/30 transition-colors ${selectedTags.includes(tag) ? "bg-primary/5" : ""}`}>
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
        </>
      )}
    </div>
  );
};

export default TagsImport;

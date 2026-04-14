import React, { useState } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";

const TagAutomationComponent = ({
  automationSelect = "No Type",
 
  tagsoptions = [],
  initialAddTags = [],
  initialRemoveTags = [],
  initialSelectedTags = []
}) => {
  const [addTags, setAddTags] = useState(initialAddTags);
  const [removeTags, setRemoveTags] = useState(initialRemoveTags);
  const [selectedTags, setSelectedTags] = useState(initialSelectedTags);

  const handleAddTagChange = (newTags) => {
    setAddTags(newTags);
  };

  const handleRemoveTagChange = (newTags) => {
    setRemoveTags(newTags);
  };

  const handleAddConditions = () => {
    // Your conditions logic here
  };

  const selectedTagElements = selectedTags.map((tag) => {
    const option = tagsoptions.find(opt => opt.value === tag.value);
    return (
      <span key={tag.value}
        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
        style={{ backgroundColor: option?.colour }}>
        {tag.label}
      </span>
    );
  });

  return (
    <div>
      <div className="border-2 border-gray-200 rounded-lg p-4">
        <p className="text-sm mb-2">1. {automationSelect || "No Type"}</p>
        <div className="flex items-start gap-5">
          <div className="mt-2 w-1/2">
            <MultiSelectDropdown
              value={addTags}
              onChange={handleAddTagChange}
              options={tagsoptions}
              placeholder="Select tags..."
              label="Add Tags"
            />
          </div>
          <div className="mt-2 w-1/2">
            <MultiSelectDropdown
              value={removeTags}
              onChange={handleRemoveTagChange}
              options={tagsoptions}
              placeholder="Select tags..."
              label="Remove Tags"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagAutomationComponent;
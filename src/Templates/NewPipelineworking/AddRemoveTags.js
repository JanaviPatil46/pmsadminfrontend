import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import TagsMultiSelectDropDown from "../TagsMultiSelectDropDown";

const AddRemoveTags = () => {
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;

  const [tags, setTags] = useState([]);
  const [addTags, setAddTags] = useState([]);
  const [removeTags, setRemoveTags] = useState([]);

  // Fetch Tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`${TAGS_API}/tags/`);
        const data = await res.json();
        const tagsOptions = data.tags.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour,
        }));
        setTags(tagsOptions);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, [TAGS_API]);

  // Filter options mutually exclusive
  const addTagOptions = tags.filter(
    (tag) => !removeTags.some((t) => t.value === tag.value)
  );

  const removeTagOptions = tags.filter(
    (tag) => !addTags.some((t) => t.value === tag.value)
  );

  return (
    <Box>
      <Typography fontWeight={600} mt={1}>Add Tags</Typography>
      <TagsMultiSelectDropDown
        value={addTags}
        onChange={setAddTags}
        options={addTagOptions}
        placeholder="Select tags to ADD"
      />

      <Typography fontWeight={600} mt={3}>Remove Tags</Typography>
      <TagsMultiSelectDropDown
        value={removeTags}
        onChange={setRemoveTags}
        options={removeTagOptions}
        placeholder="Select tags to REMOVE"
      />
    </Box>
  );
};

export default AddRemoveTags;

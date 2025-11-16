// AutomationsDrawer.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Drawer,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const AutomationsDrawer = ({
  open,
  onClose,
  automations,
  combinedaccountValues,
  accountdata,
  selectedPipeline,
  selectedStage,
  selectedtemp,
  jobName,
  combinedValues,
  priority,
  description,
  absoluteDate,
  startsin,
  startsInDuration,
  duein,
  dueinduration,
  clientFacingStatus,
  inputText,
  selectedJob,
  clientDescription,
  startDate,
  dueDate,
  onSuccess,
}) => {
  const [selectedAutomations, setSelectedAutomations] = useState([]);
  const [tags, setTags] = useState([]);
  const [assignee, setAssignee] = useState([]);

  // API endpoints
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

  // Initialize selectedAutomations to include all indices
  useEffect(() => {
    const allIndices = automations.map((_, index) => index);
    setSelectedAutomations(allIndices);
  }, [automations]);

  useEffect(() => {
    fetchTags();
    fetchAssignees();
  }, []);

  const fetchTags = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAssignees = async () => {
    try {
      const response = await axios.get(
        `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`
      );
      setAssignee(response.data);
    } catch (error) {
      console.error("Error fetching assignees:", error);
    }
  };

  const calculateWidth = (label) => Math.min(label.length * 8, 200);

  const tagsoptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.tagName,
    colour: tag.tagColour,
    customStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      borderRadius: "8px",
      alignItems: "center",
      textAlign: "center",
      marginBottom: "5px",
      padding: "2px,8px",
      fontSize: "10px",
      width: `${calculateWidth(tag.tagName)}px`,
      margin: "7px",
      cursor: "pointer",
    },
    customTagStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      alignItems: "center",
      textAlign: "center",
      padding: "2px,8px",
      fontSize: "10px",
      cursor: "pointer",
    },
  }));

  const assigneeOptions = assignee.map((ass) => ({
    value: ass._id,
    label: ass.username,
  }));

  const handleCheckboxChange = (index) => {
    setSelectedAutomations((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleTagChange = (index, type, event) => {
    const { value } = event.target;

    // This function would need to be implemented based on your state management
    // You might need to pass this up to the parent component
    console.log("Tag change:", { index, type, value });
  };

  const handleAssigneeChange = (index, type, event) => {
    const { value } = event.target;
    // This function would need to be implemented based on your state management
    // You might need to pass this up to the parent component
    console.log("Assignee change:", { index, type, value });
  };

  const handleMove = async () => {
    try {
      // Your existing handleMove logic here
      // This would be the same as your current handleMove function
      console.log("Moving with automations");
      
      // Call the success callback
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(`Operation failed: ${error.message}`);
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: "auto",
      },
    },
  };

  // Get the tags for the selected accounts
  const accountTags = combinedaccountValues
    .map((accountId) => {
      const account = accountdata.find((account) => account._id === accountId);
      return account ? account.tags || [] : [];
    })
    .flat();

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 550, p: 2 }}>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          Automations for{" "}
          <Typography variant="h6" ml={1}>
            {combinedaccountValues
              .map((accountId) => {
                const account = accountdata.find(
                  (account) => account._id === accountId
                );
                return account ? account.accountName : null;
              })
              .join(", ")}
          </Typography>
        </Typography>

        <Box>
          {automations.map((automation, index) => {
            const hasMatchingTags = automation.tags?.length
              ? automation.tags.some((automationTag) =>
                  accountTags.some(
                    (accountTag) => accountTag._id === automationTag._id
                  )
                )
              : true;

            return (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedAutomations.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                        disabled={!hasMatchingTags}
                      />
                    }
                  />
                  {!hasMatchingTags && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ fontStyle: "italic" }}
                    >
                      The tags do not match the account
                    </Typography>
                  )}
                </Box>
                
                {automation.type === "Update account tags" ? (
                  <Box>
                    <Box sx={{ width: 500 }}>
                      <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        Add tags to account
                      </Typography>

                      <Select
                        multiple
                        displayEmpty
                        multiline
                        size="small"
                        value={automation.addTags?.map((tag) => tag._id) || []}
                        onChange={(event) =>
                          handleTagChange(index, "addTags", event)
                        }
                        renderValue={(selected) =>
                          selected.length === 0 ? (
                            <Typography color="gray">
                              Select tags to add
                            </Typography>
                          ) : (
                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              {automation.addTags?.map((tag) => (
                                <Chip
                                  key={tag._id}
                                  label={tag.tagName}
                                  sx={{
                                    backgroundColor: tag.tagColour,
                                    color: "#fff",
                                    fontWeight: "500",
                                    borderRadius: "20px",
                                  }}
                                />
                              ))}
                            </Box>
                          )
                        }
                        fullWidth
                        MenuProps={MenuProps}
                        sx={{ width: "100%", marginBottom: 2 }}
                      >
                        {tagsoptions
                          .filter(
                            (option) =>
                              !automation.removeTags?.some(
                                (tag) => tag._id === option.value
                              )
                          )
                          .map((option) => {
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");
                            context.font = "14px Arial";
                            const textWidth = context.measureText(
                              option.label
                            ).width;
                            const dynamicWidth = Math.min(textWidth + 20, 200);

                            return (
                              <MenuItem
                                key={option.value}
                                value={option.value}
                                sx={{
                                  backgroundColor: option.colour,
                                  color: "#fff",
                                  fontSize: "10px",
                                  borderRadius: "10px",
                                  margin: "5px",
                                  textAlign: "center",
                                  display: "flex",
                                  justifyContent: "center",
                                  padding: "4px 9px",
                                  whiteSpace: "nowrap",
                                  minWidth: `${dynamicWidth}px`,
                                  maxWidth: `${dynamicWidth}px`,
                                  "&:hover": {
                                    backgroundColor: option.colour,
                                    color: "#fff",
                                  },
                                }}
                              >
                                {option.label}
                              </MenuItem>
                            );
                          })}
                      </Select>

                      <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        Remove tags from account
                      </Typography>

                      <Select
                        multiple
                        size="small"
                        multiline
                        displayEmpty
                        value={automation.removeTags?.map((tag) => tag._id) || []}
                        onChange={(event) =>
                          handleTagChange(index, "removeTags", event)
                        }
                        renderValue={(selected) =>
                          selected.length === 0 ? (
                            <Typography color="gray">
                              Select tags to remove
                            </Typography>
                          ) : (
                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              {automation.removeTags?.map((tag) => (
                                <Chip
                                  key={tag._id}
                                  label={tag.tagName}
                                  sx={{
                                    backgroundColor: tag.tagColour,
                                    color: "#fff",
                                    fontWeight: "500",
                                    borderRadius: "20px",
                                  }}
                                />
                              ))}
                            </Box>
                          )
                        }
                        MenuProps={MenuProps}
                        sx={{ width: "100%", marginBottom: 2 }}
                      >
                        {tagsoptions
                          .filter(
                            (option) =>
                              !automation.addTags?.some(
                                (tag) => tag._id === option.value
                              )
                          )
                          .map((option) => {
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");
                            context.font = "14px Arial";
                            const textWidth = context.measureText(
                              option.label
                            ).width;
                            const dynamicWidth = Math.min(textWidth + 20, 200);

                            return (
                              <MenuItem
                                key={option.value}
                                value={option.value}
                                sx={{
                                  backgroundColor: option.colour,
                                  color: "#fff",
                                  fontSize: "10px",
                                  borderRadius: "10px",
                                  margin: "5px",
                                  textAlign: "center",
                                  display: "flex",
                                  justifyContent: "center",
                                  padding: "4px 9px",
                                  whiteSpace: "nowrap",
                                  minWidth: `${dynamicWidth}px`,
                                  maxWidth: `${dynamicWidth}px`,
                                  "&:hover": {
                                    backgroundColor: option.colour,
                                    color: "#fff",
                                  },
                                }}
                              >
                                {option.label}
                              </MenuItem>
                            );
                          })}
                      </Select>

                      <Alert severity="warning" sx={{ marginBottom: 2 }}>
                        This automation can affect conditions for automations below
                      </Alert>
                    </Box>
                  </Box>
                ) : automation.type === "Update job assignees" ? (
                  <Box>
                    <Box sx={{ width: 500 }}>
                      <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        Add assignees to job
                      </Typography>

                      <Select
                        multiple
                        displayEmpty
                        multiline
                        size="small"
                        value={automation.addAssignees?.map((assignee) => assignee._id) || []}
                        onChange={(event) =>
                          handleAssigneeChange(index, "addAssignees", event)
                        }
                        renderValue={(selected) =>
                          selected.length === 0 ? (
                            <Typography color="gray">
                              Select assignees to add
                            </Typography>
                          ) : (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                              {automation.addAssignees?.map((assignee) => (
                                <Chip
                                  key={assignee._id}
                                  label={assignee.username}
                                  sx={{
                                    backgroundColor: '#e0e0e0',
                                    color: "#000",
                                    fontWeight: "500",
                                    borderRadius: "20px",
                                  }}
                                />
                              ))}
                            </Box>
                          )
                        }
                        fullWidth
                        MenuProps={MenuProps}
                        sx={{ width: "100%", marginBottom: 2 }}
                      >
                        {assigneeOptions.map((option) => (
                          <MenuItem
                            key={option.value}
                            value={option.value}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#f5f5f5',
                              },
                            }}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>

                      <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        Remove assignees from job
                      </Typography>

                      <Select
                        multiple
                        size="small"
                        multiline
                        displayEmpty
                        value={automation.removeAssignees?.map((assignee) => assignee._id) || []}
                        onChange={(event) =>
                          handleAssigneeChange(index, "removeAssignees", event)
                        }
                        renderValue={(selected) =>
                          selected.length === 0 ? (
                            <Typography color="gray">
                              Select assignees to remove
                            </Typography>
                          ) : (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                              {automation.removeAssignees?.map((assignee) => (
                                <Chip
                                  key={assignee._id}
                                  label={assignee.username}
                                  sx={{
                                    backgroundColor: '#e0e0e0',
                                    color: "#000",
                                    fontWeight: "500",
                                    borderRadius: "20px",
                                  }}
                                />
                              ))}
                            </Box>
                          )
                        }
                        MenuProps={MenuProps}
                        sx={{ width: "100%", marginBottom: 2 }}
                      >
                        {assigneeOptions.map((option) => (
                          <MenuItem
                            key={option.value}
                            value={option.value}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#f5f5f5',
                              },
                            }}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>

                      <Alert severity="warning" sx={{ marginBottom: 2 }}>
                        This automation can affect job assignment notifications
                      </Alert>
                    </Box>
                  </Box>
                ) : automation.type === "Update client-facing job status" ? (
                  <Box>
                    <Typography variant="body1">
                      <strong>Type:</strong> {automation.type}
                      {automation.visibilityForClient &&
                        automation.selectedClientStatus && (
                          <span> : {automation.selectedClientStatus.label}</span>
                        )}
                      {!automation.visibilityForClient && (
                        <span> : Hide status</span>
                      )}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body1">
                      <strong>Type:</strong> {automation.type}
                    </Typography>

                    <Typography variant="body1">
                      <strong>Template:</strong> {automation.template?.label}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Tags:</strong>
                    </Typography>
                    {automation.tags?.map((tag) => (
                      <Box
                        key={tag._id}
                        sx={{
                          display: "inline-block",
                          backgroundColor: tag.tagColour,
                          color: "white",
                          borderRadius: "15px",
                          padding: "3px 8px",
                          marginRight: "4px",
                        }}
                      >
                        {tag.tagName}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 5 }}>
          <Button
            variant="contained"
            onClick={handleMove}
            sx={{
              backgroundColor: "var(--color-save-btn)",
              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)",
              },
              borderRadius: "15px",
              width: "80px",
            }}
          >
            Move
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: "var(--color-border-cancel-btn)",
              color: "var(--color-save-btn)",
              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)",
                color: "#fff",
                border: "none",
              },
              width: "80px",
              borderRadius: "15px",
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AutomationsDrawer;
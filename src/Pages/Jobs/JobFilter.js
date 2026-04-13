import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import MultiSelectDropdown from "../../Templates/MultiSelectDropdown";

const FilterDropdown = ({ onFilterChange }) => {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleOptionSelect = (option) => {
    if (!selectedFilters.includes(option)) {
      setSelectedFilters((prev) => [...prev, option]);
    }
    setFilterMenuOpen(false);
  };

  const removeFilter = (option) => {
    setSelectedFilters((prev) => prev.filter((item) => item !== option));
    setClientStatus([]);
    setAccountNameValue("");
    setPriorityValue("");
    setCombinedValues();
    setSelectedStages({});
    setActivePipeline(null);
  };

  const options = [
    "Job assignees",
    "Pipeline and stage",
    "Client-facing status",
    "Account name",
    "Priority",
  ];

  const [selectedUser, setSelectedUser] = useState([]);

  const [combinedValues, setCombinedValues] = useState();
  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.label);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
  };
  const [clientStatus, setClientStatus] = useState([]);
  const [clientStatusOptions, setClientStatusOptions] = useState([]);
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  useEffect(() => {
    const fetchClientFacingStatus = async () => {
      try {
        const response = await fetch(
          `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`
        );
        const data = await response.json();
        if (data?.clientFacingJobStatues) {
          setClientStatusOptions(data.clientFacingJobStatues);
        }
      } catch (error) {
        console.error("Failed to fetch client-facing statuses", error);
      }
    };

    fetchClientFacingStatus();
  }, []);

  const [pipelines, setPipelines] = useState([]);
  const [selectedStages, setSelectedStages] = useState({});
  const [stagePopoverOpen, setStagePopoverOpen] = useState(false);
  const [activePipeline, setActivePipeline] = useState(null);
  const stagePopoverRef = useRef(null);
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const response = await fetch(
          `${PIPELINE_API}/workflow/pipeline/pipelines`
        );
        const data = await response.json();
        if (data?.pipeline) setPipelines(data.pipeline);
      } catch (error) {
        console.error("Error fetching pipelines:", error);
      }
    };

    fetchPipelines();
  }, []);

  const handlePipelineClick = (pipeline) => {
    setActivePipeline(pipeline);
    setStagePopoverOpen(true);
  };

  const handlePipelineCheckboxToggle = (pipeline) => {
    const stageNames = pipeline.stages.map((stage) => stage.name);
    const currentSelected = selectedStages[pipeline.pipelineName] || [];

    if (currentSelected.length === stageNames.length) {
      const newSelectedStages = { ...selectedStages };
      delete newSelectedStages[pipeline.pipelineName];
      setSelectedStages(newSelectedStages);
    } else {
      setSelectedStages((prev) => ({
        ...prev,
        [pipeline.pipelineName]: stageNames,
      }));
    }
  };

  const handleStageToggle = (pipelineName, stageName) => {
    setSelectedStages((prev) => {
      const current = prev[pipelineName] || [];
      let updated;

      if (current.includes(stageName)) {
        updated = current.filter((name) => name !== stageName);
      } else {
        updated = [...current, stageName];
      }

      if (updated.length === 0) {
        const newState = { ...prev };
        delete newState[pipelineName];
        return newState;
      }

      return { ...prev, [pipelineName]: updated };
    });
  };

  const handleClientStatusToggle = (statusName) => {
    setClientStatus((prev) =>
      prev.includes(statusName)
        ? prev.filter((s) => s !== statusName)
        : [...prev, statusName]
    );
  };

  const [accountNameValue, setAccountNameValue] = useState("");
  const [priorityValue, setPriorityValue] = useState("");

  useEffect(() => {
    if (onFilterChange) {
      const filters = {
        jobAssignees: combinedValues,
        clientStatus,
        pipelineStages: selectedStages,
        accountName: accountNameValue,
        priority: priorityValue,
      };
      onFilterChange(filters);
    }
  }, [
    combinedValues,
    clientStatus,
    selectedStages,
    accountNameValue,
    priorityValue,
  ]);

  // Close stage popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (stagePopoverRef.current && !stagePopoverRef.current.contains(e.target)) {
        setStagePopoverOpen(false);
      }
    };
    if (stagePopoverOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [stagePopoverOpen]);

  return (
    <div>
      <div className="flex flex-wrap items-start gap-3">
        {/* Filter Button */}
        <DropdownMenu open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              Filter
              {filterMenuOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {options.map((option) => (
              <DropdownMenuItem key={option} onClick={() => handleOptionSelect(option)}>
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Selected Filter Cards */}
        {selectedFilters.map((filter) => (
          <div key={filter} className="relative flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm min-w-[220px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">{filter}</span>
              <button onClick={() => removeFilter(filter)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Job assignees */}
            {filter === "Job assignees" && (
              <MultiSelectDropdown value={selectedUser} onChange={handleUserChange} placeholder="Select assignees" />
            )}

            {/* Account name */}
            {filter === "Account name" && (
              <Input placeholder="Enter account name" value={accountNameValue} onChange={(e) => setAccountNameValue(e.target.value)} className="h-8 text-sm" />
            )}

            {/* Client-facing status */}
            {filter === "Client-facing status" && (
              <div className="max-h-40 overflow-y-auto space-y-1">
                {clientStatusOptions.map((status) => (
                  <label key={status._id} className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-muted/50 cursor-pointer text-sm">
                    <Checkbox
                      checked={clientStatus.includes(status.clientfacingName)}
                      onCheckedChange={() => handleClientStatusToggle(status.clientfacingName)}
                    />
                    <span className="text-sm">{status.clientfacingName}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Pipeline and stage */}
            {filter === "Pipeline and stage" && (
              <div className="space-y-1 relative">
                {pipelines.map((pipeline) => (
                  <div
                    key={pipeline._id}
                    className="flex items-center justify-between rounded px-1.5 py-1 hover:bg-muted/50 cursor-pointer"
                    onClick={() => handlePipelineClick(pipeline)}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={
                          !!(pipeline.stages?.length &&
                          selectedStages[pipeline.pipelineName]?.length === pipeline.stages.length)
                        }
                        onCheckedChange={() => handlePipelineCheckboxToggle(pipeline)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-xs">{pipeline.pipelineName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({selectedStages[pipeline.pipelineName]?.length || 0}/{pipeline.stages?.length || 0})
                    </span>
                  </div>
                ))}

                {/* Stage Popover */}
                {stagePopoverOpen && activePipeline && (
                  <div ref={stagePopoverRef} className="absolute left-full top-0 ml-2 z-50 rounded-lg border bg-card p-3 shadow-lg min-w-[200px]">
                    <span className="block text-xs font-semibold text-foreground mb-2">Pipeline stages</span>
                    {activePipeline.stages?.map((stage) => (
                      <label
                        key={stage._id}
                        className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleStageToggle(activePipeline.pipelineName, stage.name)}
                      >
                        <Checkbox
                          checked={selectedStages[activePipeline.pipelineName]?.includes(stage.name) || false}
                          onCheckedChange={() => handleStageToggle(activePipeline.pipelineName, stage.name)}
                        />
                        <span className="text-xs">{stage.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Priority */}
            {filter === "Priority" && (
              <select
                value={priorityValue}
                onChange={(e) => setPriorityValue(e.target.value)}
                className="flex h-8 w-full rounded-md border border-input bg-white px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterDropdown;

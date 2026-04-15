import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";

const ManageTags = ({ selectedAccounts, onClose,fetchData }) => {
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [tags, setTags] = useState([]);
  const [tagActions, setTagActions] = useState({});
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  useEffect(() => {
    fetchTagData(); // Fetch tags on component mount
  }, []);

  const fetchTagData = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);

      // Initialize action state for each tag
      const initialActions = data.tags.reduce((acc, tag) => {
        acc[tag._id] = "Do nothing";
        return acc;
      }, {});

      console.log(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleActionChange = (tagId, newValue) => {
    setTagActions((prevActions) => ({
      ...prevActions,
      [tagId]: newValue,
    }));
  };

  const handleCancel = () => {
    if (onClose) {
      onClose(); // Ensures onClose is a valid function before calling it
    }
  };

  // Separate tags by their actions
  // const assignToAllTags = Object.keys(tagActions)
  //     .filter((tagId) => tagActions[tagId] === "Assign to all")
  //     .join(', ');

  // const removeFromAllTags = Object.keys(tagActions)
  //     .filter((tagId) => tagActions[tagId] === "Remove from all")
  //     .join(', ');

  // Separate tags by their actions
  const assignToAllTags = Object.keys(tagActions).filter((tagId) => tagActions[tagId] === "Assign to all");

  const removeFromAllTags = Object.keys(tagActions).filter((tagId) => tagActions[tagId] === "Remove from all");

  // Format the final output with separate tag arrays
  const formattedOutput = {
    accounts: ["671ce885aa9709c39fd3f974", "6718e47e1b7d40bc7d33611e"],
    assignToAllTags, // Tags for "Assign to all" action
    removeFromAllTags, // Tags for "Remove from all" action
  };

  console.log("Assign to All Tags:", assignToAllTags);
  console.log("Remove from All Tags:", removeFromAllTags);

  const sendbulkTags = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accounts: selectedAccounts,
      tags: formattedOutput.assignToAllTags,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`https://www.snptaxes.com/api/accounts/assignbulktags/tomultipleaccount`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        removebulkTags();
      
       
        
      })
      .catch((error) => console.error(error));
  };

  const removebulkTags = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accounts: selectedAccounts,
      tags: formattedOutput.removeFromAllTags,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`https://www.snptaxes.com/api/accounts/assignbulktags/removetags`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Tags Assign Successfully");
        
        handleCancel();
          fetchData()
      })
      .catch((error) => console.error(error));
  };

  console.log(tagActions);

  const thCls = "px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase text-muted-foreground border-b border-border";
  const tdCls = "px-4 py-3 text-sm text-foreground border-b border-border align-middle";

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-border shadow-sm bg-white" style={{ height: '75vh', overflowY: 'auto' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={thCls}>Tag Name</th>
              <th className={thCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag._id} className="bg-white hover:bg-muted/30 transition-colors">
                <td className={tdCls}>
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white whitespace-nowrap"
                    style={{ backgroundColor: tag.tagColour }}
                  >
                    {tag.tagName}
                  </span>
                </td>
                <td className={tdCls}>
                  <Select value={tagActions[tag._id] || "Do nothing"} onValueChange={(val) => handleActionChange(tag._id, val)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assign to all">Assign to all</SelectItem>
                      <SelectItem value="Remove from all">Remove from all</SelectItem>
                      <SelectItem value="Do nothing">Do nothing</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-3 mt-4">
        <Button variant="default" onClick={sendbulkTags}>Assign Tags</Button>
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default ManageTags;

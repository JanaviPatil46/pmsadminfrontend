import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";

const ManageTeams = ({ selectedAccounts, onClose,fetchAccountData,fetchaccountList }) => {
  const USER_API = process.env.REACT_APP_USER_URL;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [userData, setUserData] = useState([]);
  const [tagActions, setTagActions] = useState({});
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleActionChange = (userId, newValue) => {
    setTagActions((prevActions) => ({
      ...prevActions,
      [userId]: newValue,
    }));
  };

  const handleCancel = () => {
    if (onClose) {
      onClose(); // Ensures onClose is a valid function before calling it
    }
  };

  //Separate tags by their actions
  const assignToAllTeamMember = Object.keys(tagActions).filter((userId) => tagActions[userId] === "Assign to all");

  const removeFromAllTeamMember = Object.keys(tagActions).filter((userId) => tagActions[userId] === "Remove from all");

  // Format the final output with separate tag arrays
  const formattedOutput = {
    assignToAllTeamMember, // Tags for "Assign to all" action
    removeFromAllTeamMember, // Tags for "Remove from all" action
  };

  // console.log("Assign to All Tags:", assignToAllTags);
  // console.log("Remove from All Tags:", removeFromAllTags);

  const sendbulkTeamMember = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accounts: selectedAccounts,
      teamMembers: formattedOutput.assignToAllTeamMember,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`https://www.snptaxes.com/api/accounts/manageteammember/teamMembertomultipleaccount`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        removebulkTeamMember();
       
       
          
      })
      .catch((error) => console.error(error));
  };

  const removebulkTeamMember = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accounts: selectedAccounts,
      teamMembers: formattedOutput.removeFromAllTeamMember,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`https://www.snptaxes.com/api/accounts/manageteammember/removeteammember`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        toast.success("Team Member Assign Successfully");
       
        onClose();
         fetchaccountList()
      })
      .catch((error) => console.error(error));
  };

  const thCls = "px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase text-muted-foreground border-b border-border";
  const tdCls = "px-4 py-3 text-sm text-foreground border-b border-border align-middle";

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-border shadow-sm bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={thCls}>Name</th>
              <th className={thCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user._id} className="bg-white hover:bg-muted/30 transition-colors">
                <td className={tdCls}>{user.username}</td>
                <td className={tdCls}>
                  <Select value={tagActions[user._id] || "Do nothing"} onValueChange={(val) => handleActionChange(user._id, val)}>
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
        <Button variant="default" onClick={sendbulkTeamMember}>Assign</Button>
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default ManageTeams;

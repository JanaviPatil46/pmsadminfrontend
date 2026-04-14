import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";

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

  const thCls = "px-4 py-2 text-left text-xs font-bold text-gray-700 bg-gray-50 border-b border-gray-200";
  const tdCls = "px-4 py-2 text-xs text-gray-700 border-b border-gray-100";

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={thCls}>Name</th>
              <th className={thCls}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className={tdCls}>{user.username}</td>
                <td className={tdCls}>
                  <select
                    className="rounded border border-gray-200 px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-40"
                    value={tagActions[user._id] || "Do nothing"}
                    onChange={(e) => handleActionChange(user._id, e.target.value)}
                  >
                    <option value="Assign to all">Assign to all</option>
                    <option value="Remove from all">Remove from all</option>
                    <option value="Do nothing">Do nothing</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={sendbulkTeamMember} className="rounded-full px-5 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)]">
          Assign
        </button>
        <button onClick={handleCancel} className="rounded-full px-5 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ManageTeams;

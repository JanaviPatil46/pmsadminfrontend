import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { FaCaretUp, FaCaretDown, FaTimes } from "react-icons/fa";


const MultiSelectDropdown = ({
  value = [],
  onChange,
  options: propOptions,
  placeholder = "Select from list",
  width = "100%"
}) => {
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuWidth, setMenuWidth] = useState(null);
  const [internalOptions, setInternalOptions] = useState([]);
  const [initialized, setInitialized] = useState(false); // Track initialization

  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;

  const options = propOptions || internalOptions;

  useEffect(() => {
  if (!propOptions && !initialized) {
    const fetchData = async () => {
      try {
        const storedUserRole = localStorage.getItem("userRole");
        const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
        const loginuserid = storedData?.teammember?.userid;
        const viewAllAccounts = storedData?.teammember?.viewallAccounts;

        let url = "";

        // ROLE BASED URL (Same logic as your pipeline code)
        if (storedUserRole === "Admin") {
          url =
            "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
        } else {
          // TeamMember
          url =
            viewAllAccounts === true
              ? "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
              : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=true`;
        }

        console.log("Fetching accounts from:", url);

        const response = await fetch(url);
        const data = await response.json();

        const options = (data.accountlist || data.teamAccounts || []).map(
          (account) => ({
            value: account._id,
            label: account.accountName,
          })
        );

        setInternalOptions(options);

        // Auto-select from cookie (ONLY if no value selected from parent)
        if (value.length === 0) {
          const accountIdFromCookie = Cookies.get("accountId");

          if (accountIdFromCookie) {
            const matchedAccount = options.find(
              (acc) => acc.value === accountIdFromCookie
            );

            if (matchedAccount && onChange) {
              onChange([matchedAccount]);
            }
          }
        }

        setInitialized(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }
}, [propOptions, onChange, value, initialized]);

  // useEffect(() => {
  //   if (!propOptions && !initialized) {
  //     const fetchData = async () => {
  //       try {
       
  //       const url = "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
  //         const response = await fetch(url);
  //         const data = await response.json();

  //         const options = data.accounts.map(account => ({
  //           value: account._id,
  //           label: account.accountName,
  //         }));

  //         setInternalOptions(options);

  //         // Only set cookie value if no existing value is provided
  //         if (value.length === 0) {
  //           const accountIdFromCookie = Cookies.get('accountId');
  //           if (accountIdFromCookie) {
  //             const matchedAccount = options.find(
  //               (acc) => acc.value === accountIdFromCookie
  //             );
  //             if (matchedAccount && onChange) {
  //               onChange([matchedAccount]);
  //             }
  //           }
  //         }
          
  //         setInitialized(true);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };

  //     fetchData();
  //   }
  // }, [ACCOUNT_API, propOptions, onChange, value, initialized]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (containerRef.current) {
      setMenuWidth(containerRef.current.offsetWidth);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (selectedValue) => {
    const newValue = value.some(item => item.value === selectedValue)
      ? value.filter(item => item.value !== selectedValue)
      : [...value, options.find(option => option.value === selectedValue)];
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSelection = () => {
    if (onChange) {
      onChange([]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" style={{ width }}>
      <div
        ref={containerRef}
        className="flex items-center justify-between border border-gray-300 rounded-lg px-2 py-1.5 cursor-pointer bg-white mt-2 min-h-[32px] w-full"
        onClick={handleClick}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {value.length > 0 ? (
            value.map((item) => (
              <span key={item.value}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-200 text-gray-700 shadow-sm">
                {item.label}
                <button type="button" onClick={(e) => { e.stopPropagation(); handleSelect(item.value); }} className="hover:opacity-70"><FaTimes size={8}/></button>
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">{placeholder}</span>
          )}
        </div>
        <button type="button" className="text-gray-400 p-0">
          {anchorEl ? <FaCaretUp size={12}/> : <FaCaretDown size={12}/>}
        </button>
      </div>

      {Boolean(anchorEl) && (
        <>
          <div className="fixed inset-0 z-30" onClick={handleClose} />
          <div className="absolute top-full left-0 z-40 bg-white border border-gray-200 rounded shadow-lg overflow-y-auto"
            style={{ width: menuWidth || "auto", maxHeight: 250 }}>
            <div className="p-1">
              <input type="text" autoFocus placeholder="Search..."
                className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={searchQuery} onChange={handleSearchChange} autoComplete="off" />
            </div>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div key={option.value}
                  className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm"
                  onClick={() => handleSelect(option.value)}>
                  <input type="checkbox" className="mr-2 h-3.5 w-3.5"
                    checked={value.some(item => item.value === option.value)}
                    onChange={() => handleSelect(option.value)}
                    onClick={e => e.stopPropagation()} />
                  <span>{option.label}</span>
                </div>
              ))
            ) : (
              <p className="px-3 py-2 text-xs text-gray-400">No results found</p>
            )}
            {value.length > 0 && (
              <button type="button" className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-gray-50"
                onClick={clearSelection}>✕ Clear selected</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
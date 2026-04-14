import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
// import  from "react-select";
import { RiAddCircleLine } from "react-icons/ri";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Editor } from "react-draft-wysiwyg";
import Switch from "react-switch";
import { EditorState, convertToRaw, ContentState, Modifier } from "draft-js";
import makeAnimated from "react-select/animated";
import { LuConstruction } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";

import AccountMultiSelectDropdown from "../../Templates/AccountMultiSelectDropdown";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// import 'react-toastify/dist/ReactToastify.css';
const SendAccountEmail = ({ selectedAccounts, onClose }) => {
  console.log(selectedAccounts);

  const [htmlContent, setHtmlContent] = useState(""); // State to store raw HTML content
  const API_KEY = process.env.REACT_APP_API_IP;

  const [scheduledEmail, setScheduledEmail] = useState(false);
  const handleScheduledEmail = (checked) => {
    setScheduledEmail(checked);
  };

  const shortcutsOptions = [
    { value: "contact_shortcuts", label: "Contact Shortcuts" },
    { value: "account_shortcuts", label: "Account Shortcuts" },
  ];
  const customShortcutsStyles = {
    container: (provided) => ({
      ...provided,
      // margin: '0 auto',
      // marginTop: '50px',
      // width: '300px',
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "#f0f0f0",
      borderColor: "#ccc",
      border: "none",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#f9f9f9",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#e6e6e6" : "#f9f9f9",
      color: state.isSelected ? "#333" : "#000",
      "&:active": {
        backgroundColor: "#ddd",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#999",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#333",
    }),
  };
  const customTempStyles = {
    container: (provided) => ({
      ...provided,
      width: "400px",
    }),
  };

  const [inputText, setInputText] = useState("");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const dropdownRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("contacts"); // Default selected option

  const [shortcuts, setShortcuts] = useState([]);
  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputText(value); // Update inputText state with the new value
    // console.log("Email Subject:", value); // Log the value to the console
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setSearchTerm(""); // Clear search term when showing the dropdown
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleAddShortcut = (shortcut) => {
    setEmailSubject((prevText) => prevText + `[${shortcut}]`);
    setShowDropdown(false);
  };
  useEffect(() => {
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, shortcuts]);
  useEffect(() => {
    if (selectedOption === "contacts") {
      // Set contact shortcuts
      const contactShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
        { title: "Contact Shortcodes", isBold: true },
        { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
        { title: "First Name", isBold: false, value: "FIRST_NAME" },
        { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
        { title: "Last Name", isBold: false, value: "LAST_NAME" },
        { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
        { title: "Country", isBold: false, value: "COUNTRY" },
        { title: "Company name", isBold: false, value: "COMPANY_NAME " },
        { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
        { title: "City", isBold: false, value: "CITY" },
        { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
        { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
        { title: "Custom field:Email", isBold: false, value: "CONTACT_CUSTOM_FIELD:Email" },

        { title: "Date Shortcodes", isBold: true },
        { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
        { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
        { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(contactShortcuts);
    } else if (selectedOption === "account") {
      // Set account shortcuts
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
        { title: "Date Shortcodes", isBold: true },
        { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
        { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
        { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);

  const [showTextDropdown, setShowTextDropdown] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const CustomToolbar = () => (
    <div className="rdw-editor-toolbar">
      <div className="dropdown-button" onClick={() => setShowTextDropdown(!showTextDropdown)}>
        Add Shortcode
      </div>
      {showTextDropdown && (
        <div className="dropdown-menu" ref={dropdownRef}>
          {shortcuts.map((shortcode, index) => (
            <div key={index} className={`dropdown-item ${shortcode.isBold ? "bold" : ""}`} onClick={() => handleShortcodeClick(shortcode)}>
              {shortcode.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const handleShortcodeClick = (shortcode) => {
    insertText(`[${shortcode.value}]`);
    setShowDropdown(false);
  };

  const insertText = (text) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const newContentState = Modifier.insertText(contentState, selectionState, text);
    const newEditorState = EditorState.push(editorState, newContentState, "insert-characters");
    setEditorState(newEditorState);
  };

  //*********************************Drop Down Fill */
  const animatedComponents = makeAnimated();
  const [userdata, setUserData] = useState([]);
  const [selecteduser, setSelectedUser] = useState();

  const [selectedto, setSelectedTo] = useState([]);
  const [emailTemplatedata, setEmailTemplateData] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState();
  const [fetchtemplatedata, setFetchTemplateData] = useState();
  const [emailBody, setEmailBody] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [userEmailData, setUserEmailData] = useState();

  useEffect(() => {
    fetchData();
    fetchemailTemplateData();
  }, []);

  const USER_API = process.env.REACT_APP_USER_URL;
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchData = async () => {
    try {
      // const url = `${API_KEY}/common/user/`;
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      // const url = `${API_KEY}/common/users/roles?roles=Admin,TeamMember`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const options = userdata.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const handleuserChange = async (event, selectedOption) => {
    if (!selectedOption || !selectedOption.value) {
      console.error("Invalid selected option:", selectedOption);
      return;
    }

    setSelectedUser(selectedOption);

    const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin/${selectedOption.value}`;;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching user data: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      setUserEmailData(data.email);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const fetchemailTemplateData = async () => {
    try {
      // const url = `${API_KEY}/workflow/emailtemplate/`;
      const url = `${EMAIL_API}/workflow/emailtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setEmailTemplateData(data.emailTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const emailoptions = emailTemplatedata.map((emailtemplate) => ({
    value: emailtemplate._id,
    label: emailtemplate.templatename,
  }));

  const handleEmailtemp = (event, selectedOption) => {
    console.log(selectedOption);
    if (selectedOption && selectedOption.value) {
      setEmailTemplate(selectedOption);
      fetchDataemaildetails(selectedOption.value);
    } else {
      console.error("Invalid selected option:", selectedOption);
    }
  };

  const fetchDataemaildetails = async (selecttempId) => {
    try {
      const url = `${EMAIL_API}/workflow/emailtemplate/${selecttempId}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log(data);

      const contentBlock = htmlToDraft(data.emailTemplate.emailbody);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      setEditorState(EditorState.createWithContent(contentState));
      setHtmlContent(data.emailTemplate.emailbody);
      setFetchTemplateData(data.emailTemplate);

      setEmailSubject(data.emailTemplate.emailsubject);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEmailInputChange = (e) => {
    const { value } = e.target;
    setEmailSubject(value);
  };
   const [selectedAccount, setSelectedAccount] = useState([]);
  const [userRole, setUserRole] = useState("");
    const [accountoptions, setAccountOptions] = useState([]);
  const [loading, setLoading] = useState(false);
   const [filterStatus, setFilterStatus] = useState("active"); 
  const [combinedaccountValues, setCombinedaccountValues] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState([]);
  const [accountdata, setaccountdata] = useState([]);
const fetchAccountsData = async () => {
  setLoading(true);
  try {
    const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
    const loginuserid = storedData?.teammember?.userid;
    const viewAllAccounts = storedData?.teammember?.viewallAccounts;

    console.log("UserRole:", userRole);
    console.log("Team Member userId:", loginuserid);
    console.log("viewAllAccounts:", viewAllAccounts);

    let url = "";

    // --- Same logic pattern as pipeline data ---
    if (userRole === "Admin") {
      url = `https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true`;
    } else {
      // TeamMember
      url =
        viewAllAccounts === true
          ? `https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true`
          : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=${filterStatus === "active"}`;
    }

    console.log("Fetching accounts from:", url);

    const response = await fetch(url);
    const data = await response.json();

    const accounts = data.accountlist || data.teamAccounts || [];

    setaccountdata(accounts);

    // Convert to dropdown options
    const options = accounts.map((acc) => ({
      value: acc._id,
      label: acc.accountName,
    }));
    setAccountOptions(options);

    // Pre-select previously chosen accounts
    const selectedOptions = options.filter((option) =>
      selectedAccounts.includes(option.value)
    );
    setSelectedaccount(selectedOptions);
    setCombinedaccountValues(selectedOptions.map((opt) => opt.value));

  } catch (error) {
    console.error("Error fetching account data:", error);
  } finally {
    setLoading(false);
  }
};

// STEP 1 — Fetch userRole first
useEffect(() => {
  const storedUserRole = localStorage.getItem("userRole") || "";
  console.log("UserRole from localStorage:", storedUserRole);
  setUserRole(storedUserRole);
}, []);

// STEP 2 — After userRole is loaded, fetch account list
useEffect(() => {
  if (userRole) {
    fetchAccountsData();
  }
}, [userRole, filterStatus]);
  // const fetchAccountData = async () => {
  //   try {
  //     // const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails`);
  //     const response = await fetch("https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true")
  //     const data = await response.json();
  //     setaccountdata(data.accounts);

  //     // Map accounts to options
  //     const options = data.accounts.map((account) => ({
  //       value: account._id,
  //       label: account.accountName,
  //     }));
  //     setAccountOptions(options);

  //     // Filter options based on selectedAccounts
  //     const selectedOptions = options.filter((option) => selectedAccounts.includes(option.value));
  //     console.log("Selected Options:", selectedOptions);
  //     setSelectedTo(selectedOptions);
  //     setCombinedValues(selectedOptions.map((option) => option.value));
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  // console.log(selectedto);

  // useEffect(() => {
  //   fetchAccountData();
  // }, []);
 
 const handleAccountChange = (event, newValue) => {
    setSelectedAccount(newValue);
    console.log("Selected Options:", newValue); // Log full option objects
    console.log(
      "Selected Values:",
      newValue.map((option) => option.value)
    ); // Log just the values

    // If you need to set combined account values separately
    setCombinedaccountValues(newValue.map((option) => option.value));
  };
 

  const [combinedValues, setCombinedValues] = useState([]);

  

  const handleToselect = (event, selectedOptions) => {
    console.log(selectedOptions);

    // Update the selected value for display
    setSelectedTo(selectedOptions);

    if (selectedOptions) {
      // If multiple selections are possible, use `map` to get values; otherwise handle single object
      const selectedValues = Array.isArray(selectedOptions) ? selectedOptions.map((option) => option.value) : [selectedOptions.value]; // Wrap in array for single selection

      console.log(selectedValues);
      setCombinedValues(selectedValues);
    } else {
      // Handle case when cleared
      setCombinedValues([]);
    }
  };

  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  // console.log(combinedValues);
  // console.log(selectedto);
  // const sendbulkEmail = () => {
  //   const rawContentState = convertToRaw(editorState.getCurrentContent());
  //   const htmlContent = draftToHtml(rawContentState);
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   const raw = JSON.stringify({
  //     selectedAccounts: combinedaccountValues,
  //     emailtemplateid: emailTemplate.value,
  //     emailsubject: emailSubject,
  //     emailbody: htmlContent,
  //     notificationemail: userEmailData,
  //   });
  //   console.log(raw);
  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };
  //   const url = "https://www.snptaxes.com/api/accounts/sendBulkEmails";
  //   fetch(url, requestOptions)
  //     .then((response) => {
  //       if (!response.ok) {
  //         console.log(response);
  //         toast.error(response);
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     // .then((success) => {})
  //        .then((data) => {
  //     toast.success(
  //       "Emails are being sent. You will receive a notification email once completed."
  //     );

  //     handleCancel(); // Close modal or drawer
  //   })
  //     .catch((error) => {
  //       console.error(error);
  //       toast.error("An error occurred while sending emails");
  //     });
  //   //  toast.success("After sending all mails you will get notification mail.");
  //   //  setTimeout(() =>  navigate('/accounts'), 1000);
  //   // window.location.reload();
  //   handleCancel();
  // };
const sendbulkEmail = () => {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  const htmlContent = draftToHtml(rawContentState);

  const payload = {
    selectedAccounts: combinedaccountValues,
    emailtemplateid: emailTemplate.value,
    emailsubject: emailSubject,
    emailbody: htmlContent,
    notificationemail: userEmailData,
  };

  fetch("https://www.snptaxes.com/api/accounts/sendBulkEmails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error Response:", errorText);
        toast.error("Failed to send emails");
        throw new Error("Request failed");
      }

      return response.json();
    })
    .then((data) => {
      toast.success(
        "Emails are being sent. You will receive a notification email once completed."
      );

      handleCancel(); // Close modal or drawer
    })
    .catch((error) => {
      console.error("Bulk Email Error:", error.message);
      toast.error("An error occurred while sending emails");
    });
};

  const handleCancel = () => {
    if (onClose) {
      onClose(); // Ensures onClose is a valid function before calling it
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowTextDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const inputCls = "w-full mt-1 rounded border border-gray-200 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelCls = "block text-sm font-medium text-gray-700 mb-0.5";

  return (
    <div>
      <div className="send-email-container">
        <div className="contact-temp">
          <label className={labelCls}>Email Template</label>
          <select
            className={inputCls}
            value={emailTemplate?.value || ""}
            onChange={(e) => {
              const opt = emailoptions.find(o => o.value === e.target.value);
              if (opt) handleEmailtemp(null, opt);
            }}
          >
            <option value="">Email Template</option>
            {emailoptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="mt-3">
          <label className={labelCls}>From</label>
          <select
            className={inputCls}
            value={selecteduser?.value || ""}
            onChange={(e) => {
              const opt = options.find(o => o.value === e.target.value);
              if (opt) handleuserChange(null, opt);
            }}
          >
            <option value="">From</option>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="mt-3">
          <label className={labelCls}>To</label>
          <AccountMultiSelectDropdown
            value={selectedaccount}
            onChange={handleAccountChange}
            placeholder="Accounts"
            options={accountoptions}
          />
        </div>

        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Subject</p>
          <div className="flex items-center gap-2">
            <input
              className={inputCls}
              value={emailSubject + selectedShortcut}
              onChange={handleEmailInputChange}
              placeholder="Subject"
            />
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center gap-1 whitespace-nowrap rounded px-3 py-1.5 text-sm text-blue-600 border border-blue-300 hover:bg-blue-50"
            >
              <RiAddCircleLine /> Add Shortcode
            </button>
          </div>

          {showDropdown && (
            <div className="dropdown border border-gray-200 rounded-lg shadow-lg bg-white mt-1 p-2" ref={dropdownRef}>
              <div className="flex items-center gap-2 mb-2">
                <input className={inputCls} placeholder="Search shortcuts" value={searchTerm} onChange={handleSearchChange} />
                <button type="button" onClick={toggleDropdown} className="text-gray-500 hover:text-gray-700"><IoIosCloseCircleOutline fontSize="20px" /></button>
              </div>
              <ul className="dropdown-list max-h-48 overflow-y-auto">
                {filteredShortcuts.map((shortcut) => (
                  <li key={shortcut.title} onClick={() => handleAddShortcut(shortcut.value)}
                    className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100"
                    style={{ fontWeight: shortcut.isBold ? "bold" : "normal" }}
                  >
                    {shortcut.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-3">
            <Editor editorState={editorState} wrapperClassName="demo-wrapper" editorClassName="demo-editor" toolbarCustomButtons={[<CustomToolbar />]} onEditorStateChange={setEditorState} />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Switch checked={scheduledEmail} onChange={handleScheduledEmail} />
            <span className="text-sm text-gray-600 cursor-pointer">Scheduled email</span>
          </div>

          {scheduledEmail && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Date &amp; time</p>
              <input type="datetime-local" className={inputCls} placeholder="Date &amp; time" />
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={sendbulkEmail} className="rounded-full px-5 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)]">
              Send
            </button>
            <button type="button" onClick={handleCancel} className="rounded-full px-5 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendAccountEmail;

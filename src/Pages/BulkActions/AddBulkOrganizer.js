import { useState, useEffect } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AccountMultiSelectDropdown from "../../Templates/AccountMultiSelectDropdown";

const AddBulkOrganizer = ({ selectedAccounts, onClose }) => {
  console.log("selectedAccounts",selectedAccounts)
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();

  const [organizerTemplate, setOrganizerTemplate] = useState([]);
  const [selectedOrganizerTemplate, setSelectedOrganizerTemplate] = useState("");
  const [selectedAccount, setSelectedAccount] = useState([]);
  const [showOrganizerForm, setShowOrganizerForm] = useState(false);
  const [organizeraccountwise, setorganizeraccountwise] = useState();
  const [selectedOrganizerTempData, setSelectedOrganizerTempData] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    fetchOrganizerTemplateData();
    fetchAccountsData();
  }, []);

  const fetchOrganizerTemplateData = async () => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/`;
      const response = await fetch(url);
      const result = await response.json();
      setOrganizerTemplate(result.OrganizerTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [accountData, setAccountData] = useState([]);
   const [accountdata, setaccountdata] = useState([]);
  const [accountoptions, setAccountOptions] = useState([]);
   const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);
   const [filterStatus, setFilterStatus] = useState("active"); 
  const [combinedaccountValues, setCombinedaccountValues] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState([]);
//   const fetchAccountsData = async () => {
//     try {
//       // const url = `${ACCOUNT_API}/accounts/account/accountdetailslist/`;
//       const url = "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
//       const response = await fetch(url);
//       const result = await response.json();
// console.log("result",result.accounts)
// setAccountData(result.accounts)
//     const options = result.accounts.map((account) => ({
//           value: account._id,
//           label: account.accountName,
//         }));
//         setAccountOptions(options);
//       // if (Array.isArray(result.accountlist)) {
//       //   setAccountData(result.accountlist);
//       //   console.log(result.accountlist);

//       //   // Map accounts to options
//         // const options = result.accountlist.map((account) => ({
//         //   value: account.id,
//         //   label: account.Name,
//         // }));
//         // setAccountOptions(options);

//       //   // Filter options based on selectedAccounts
//         const selectedOptions = options.filter((option) => selectedAccounts.includes(option.value));
//       //   console.log("Selected Options:", selectedOptions);
//         setSelectedAccount(selectedOptions);
//         setCombinedaccountValues(selectedOptions.map((option) => option.value));
//       // } else {
//       //   console.error("Account list is not an array", result.accountlist);
//       // }
//     } catch (error) {
//       console.log("Error:", error);
//     }
//   };
// const fetchAccountsData = async () => {
//   setLoading(true);
//   try {
//     const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
//     const loginuserid = storedData?.teammember?.userid;
//     const viewAllAccounts = storedData?.teammember?.viewallAccounts;

//     console.log("UserRole:", userRole);
//     console.log("Team Member userId:", loginuserid);
//     console.log("viewAllAccounts:", viewAllAccounts);

//     let url = "";

//     // --- Same logic pattern as pipeline data ---
//     if (userRole === "Admin") {
//       url = `https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true`;
//     } else {
//       // TeamMember
//       url =
//         viewAllAccounts === true
//           ? `https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true`
//           : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=${filterStatus === "active"}`;
//     }

//     console.log("Fetching accounts from:", url);

//     const response = await fetch(url);
//     const data = await response.json();

//     const accounts = data.accountlist || data.teamAccounts || [];

//     setaccountdata(accounts);

//     // Convert to dropdown options
//     const options = accounts.map((acc) => ({
//       value: acc._id,
//       label: acc.accountName,
//     }));
//     setAccountOptions(options);

//     // Pre-select previously chosen accounts
//     const selectedOptions = options.filter((option) =>
//       selectedAccounts.includes(option.value)
//     );
//     setSelectedaccount(selectedOptions);
//     setCombinedaccountValues(selectedOptions.map((opt) => opt.value));

//   } catch (error) {
//     console.error("Error fetching account data:", error);
//   } finally {
//     setLoading(false);
//   }
// };
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
  const handleOrganizerTemplateChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOrganizerTemplate(selectedValue);
    // Fetch data based on selected value
    fetchOrganizerTemplateDataByTempId(selectedValue);
  };
  // const [sections, setSections] = useState([]);
  const [sections, setSections] = useState([]);
  const [organizerName, setOrganizerName] = useState("");
const handleOrganizerNameChange = (e) => {
  setOrganizerName(e.target.value);
};

  const fetchOrganizerTemplateDataByTempId = async (selectedOrganizerTempid) => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${selectedOrganizerTempid}`;
      const response = await fetch(url);
      const result = await response.json();
      console.log(result);
      console.log(result.organizerTemplate.sections);
      setSelectedOrganizerTempData(result.organizerTemplate);
      setSections(result.organizerTemplate.sections);
      setOrganizerName(result.organizerTemplate.organizerName);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(selectedOrganizerTempData);

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const handlePreview = () => {
    setPreviewDialogOpen(true); // Open the dialog
    // console.log(selectedOrganizerTempData.sections);
    const sections = selectedOrganizerTempData.sections;
    const data = {
      sections, // sections // This contains all your sections and their elements
    };
    console.log("Data for preview:", data);
  };

  console.log(sections);
  console.log(accountData);
  console.log(selectedOrganizerTempData);
  console.log(selectedAccount);
  console.log(selectedOrganizerTemplate);

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

  //   const AccountsOptions = (accountData || []).map((account) => ({
  //     value: account.id,
  //     label: account.Name,
  //   }));

  const OrganizerTemplateOptions = organizerTemplate.map((organizertemp) => ({
    value: organizertemp._id,
    label: organizertemp.templatename,
  }));

  const handleOrganizerFormClose = () => {
    if (onClose) {
      onClose(); // Ensures onClose is a valid function before calling it
    }
  };

  //Preview
  const [startDate, setStartDate] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [answeredElements, setAnsweredElements] = useState({});
  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [selectedValue, setSelectedValue] = useState(null);
   const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
  // const shouldShowSection = (section) => {
  //   if (!section.sectionsettings?.conditional) return true;

  //   const condition = section.sectionsettings?.conditions?.[0];
  //   if (condition && condition.question && condition.answer) {
  //     const radioAnswer = radioValues[condition.question];
  //     const checkboxAnswer = checkboxValues[condition.question];
  //     const dropdownAnswer = selectedDropdownValue;
  //     // For radio buttons
  //     if (radioAnswer !== undefined && condition.answer === radioAnswer) {
  //       return true;
  //     }
  //     // For checkboxes: check if the condition answer is in the selected checkbox values
  //     if (checkboxAnswer && checkboxAnswer[condition.answer]) {
  //       return true;
  //     }
  //     // For dropdowns: check if the condition answer matches the selected dropdown value
  //     if (dropdownAnswer !== undefined && condition.answer === dropdownAnswer) {
  //       return true;
  //     }
  //     return false;
  //   }
  //   return true;
  // };
const shouldShowSection = (section) => {
    if (!section.sectionsettings?.conditional) return true;
    const conditions = section.sectionsettings.conditions || [];

    return conditions.every((condition) => {
      if (!condition.question || !condition.answer) return false;

      // Check all possible sections for the answer
      for (const key in radioValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          radioValues[key] === condition.answer
        ) {
          return true;
        }
      }

      for (const key in checkboxValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          checkboxValues[key]?.[condition.answer]
        ) {
          return true;
        }
      }

      for (const key in selectedDropdownValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          selectedDropdownValues[key] === condition.answer
        ) {
          return true;
        }
      }
      // Check Yes/No values
      for (const key in selectedYesNoValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          selectedYesNoValues[key] === condition.answer
        ) {
          return true;
        }
      }
      return false;
    });
  };
  const getVisibleSections = () => sections.filter(shouldShowSection);
  const visibleSections = getVisibleSections();

  // const handleInputChange = (event, elementText) => {
  //   const { value } = event.target;
  //   setInputValues((prevValues) => ({
  //     ...prevValues,
  //     [elementText]: value,
  //   }));
  //   setAnsweredElements((prevAnswered) => ({
  //     ...prevAnswered,
  //     [elementText]: true,
  //   }));
  // };
 const handleInputChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    const { value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  const totalSteps = visibleSections.length;
  const totalElements = sections[activeStep]?.formElements.length || 0;

  const answeredCount = sections[activeStep]?.formElements.filter((element) => answeredElements[element.text]).length || 0;

  const handleClosePreview = () => {
    setPreviewDialogOpen(false); // Close the dialog
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };
  const handleDropdownChange = (event) => {
    const selectedIndex = event.target.value;
    setActiveStep(selectedIndex);
  };
  // const shouldShowElement = (element) => {
  //   if (!element.questionsectionsettings?.conditional) return true;

  //   const condition = element.questionsectionsettings?.conditions?.[0];

  //   if (condition && condition.question && condition.answer) {
  //     const radioAnswer = radioValues[condition.question];
  //     const checkboxAnswer = checkboxValues[condition.question];
  //     const dropdownAnswer = selectedDropdownValue;

  //     // For radio buttons
  //     if (radioAnswer !== undefined && condition.answer === radioAnswer) {
  //       return true;
  //     }

  //     // For checkboxes: check if the condition answer is in the selected checkbox values
  //     if (checkboxAnswer && checkboxAnswer[condition.answer]) {
  //       return true;
  //     }

  //     // For dropdowns: check if the condition answer matches the selected dropdown value
  //     if (dropdownAnswer !== undefined && condition.answer === dropdownAnswer) {
  //       return true;
  //     }

  //     return false;
  //   }
  //   return true;
  // };
const shouldShowElement = (element, sectionId) => {
    const settings = element.questionsectionsettings;
    if (!settings?.conditional) return true;
    const conditions = settings?.conditions || [];

    for (const condition of conditions) {
      const { question, answer } = condition;
      if (!question || !answer) continue;

      // Check all possible sections for the answer
      let conditionMet = false;

      // Check radio values
      for (const key in radioValues) {
        if (key.endsWith(`_${question}`) && radioValues[key] === answer) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      // Check checkbox values
      for (const key in checkboxValues) {
        if (key.endsWith(`_${question}`) && checkboxValues[key]?.[answer]) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      // Check dropdown values
      for (const key in selectedDropdownValues) {
        if (
          key.endsWith(`_${question}`) &&
          selectedDropdownValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;
      // Check Yes/No values
      for (const key in selectedYesNoValues) {
        if (
          key.endsWith(`_${question}`) &&
          selectedYesNoValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;
      // If we get here, no condition was met
      return false;
    }

    return true;
  };
  // const handleRadioChange = (value, elementText) => {
  //   setRadioValues((prevValues) => ({
  //     ...prevValues,
  //     [elementText]: value,
  //   }));
  //   setAnsweredElements((prevAnswered) => ({
  //     ...prevAnswered,
  //     [elementText]: true,
  //   }));
  // };
 const handleRadioChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setRadioValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  // const handleCheckboxChange = (value, elementText) => {
  //   setCheckboxValues((prevValues) => ({
  //     ...prevValues,
  //     [elementText]: {
  //       ...prevValues[elementText],
  //       [value]: !prevValues[elementText]?.[value],
  //     },
  //   }));
  //   setAnsweredElements((prevAnswered) => ({
  //     ...prevAnswered,
  //     [elementText]: true,
  //   }));
  // };
const handleCheckboxChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [key]: {
        ...prevValues[key],
        [value]: !prevValues[key]?.[value],
      },
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  // const handleChange = (event, elementText) => {
  //   setSelectedValue(event.target.value);
  //   setAnsweredElements((prevAnswered) => ({
  //     ...prevAnswered,
  //     [elementText]: true,
  //   }));
  // };
const handleYesNoChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedYesNoValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  // const handleDropdownValueChange = (event, elementText) => {
  //   setSelectedDropdownValue(event.target.value);
  //   setAnsweredElements((prevAnswered) => ({
  //     ...prevAnswered,
  //     [elementText]: true,
  //   }));
  // };
   const handleDropdownValueChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: event.target.value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent || "";
  };

  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
  const [noOfReminder, setNoOfReminder] = useState(1);
  const [reminder, setReminder] = useState(false);

  const handleAbsolutesDates = (checked) => {
    setReminder(checked);
  };

  console.log(combinedaccountValues);
  // const createOrganizerOfAccount = () => {
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
  //   const raw = JSON.stringify({
  //     accountid: combinedaccountValues,
  //     organizertemplateid: selectedOrganizerTemplate,
  //     reminders: reminder,
  //     noofreminders: noOfReminder,
  //     daysuntilnextreminder: daysuntilNextReminder,
  //     jobid: ["661e495d11a097f731ccd6e8"],
  //     sections:
  //       selectedOrganizerTempData?.sections?.map((section) => ({
  //         name: section?.text || "",
  //         id: section?.id?.toString() || "",
  //         text: section?.text || "",
  //         formElements:
  //           section?.formElements?.map((question) => ({
  //             type: question?.type || "",
  //             id: question?.id || "",
  //             sectionid: question?.sectionid || "",
  //             options:
  //               question?.options?.map((option) => ({
  //                 id: option?.id || "",
  //                 text: option?.text || "",
  //                 selected: option?.selected || false,
  //               })) || [],
  //             text: question?.text || "",
  //             textvalue: question?.textvalue || "",
  //           })) || [],
  //       })) || [],
  //     active: true,
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   console.log(raw);
  //   const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/org`;
  //   console.log(url);
  //   fetch(url, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result);
  //       // console.log(result.newOrganizerAccountWise);
  //       // const { _id } = result.newOrganizerAccountWise;

  //       // console.log(_id); // "66f7e5d97114d8ad832c2d3e"
  //       // setorganizeraccountwise(result.newOrganizerAccountWise);
  //       // setShowOrganizerForm(true);
  //       // setSelectedOrganizerTemplate(selectedOrganizerTemplate);
  //       // console.log(selectedOrganizerTemplate);
  //       toast.success("New organizer created successfully");
  //       handleOrganizerFormClose();
  //       // navigate(`/clients/accounts`);
  //     })
  //     .catch((error) => console.error(error));
  // };



  const createOrganizerOfAccount = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    combinedaccountValues.forEach((accountId) => {
      const raw = JSON.stringify({
        accountid: accountId, // Send one account ID at a time
        organizertemplateid: selectedOrganizerTemplate,
        organizerName: organizerName,
        reminders: reminder,
        noofreminders: noOfReminder,
        daysuntilnextreminder: daysuntilNextReminder,
        jobid: ["661e495d11a097f731ccd6e8"],
        sections:
          selectedOrganizerTempData?.sections?.map((section) => ({
            name: section?.text || "",
            id: section?.id?.toString() || "",
            text: section?.text || "",
            formElements:
              section?.formElements?.map((question) => ({
                type: question?.type || "",
                id: question?.id || "",
                sectionid: question?.sectionid || "",
                options:
                  question?.options?.map((option) => ({
                    id: option?.id || "",
                    text: option?.text || "",
                    selected: option?.selected || false,
                  })) || [],
                text: question?.text || "",
                textvalue: question?.textvalue || "",
              })) || [],
          })) || [],
          status: "Pending",
        active: true,
      });
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
  
      const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/org`;
  
      console.log(`Sending request for accountId: ${accountId}`);
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(`Organizer created for accountId: ${accountId}`, result);
          
        })
        .catch((error) => console.error(`Error creating organizer for accountId: ${accountId}`, error));
    });
    toast.success("Organizer created successfully");
    handleOrganizerFormClose();
  };
  
  const handleDelete = (valueToDelete) => {
    setSelectedAccount((prevSelected) => prevSelected.filter((value) => value !== valueToDelete));
  };

  const inputCls = "w-full mt-1 rounded border border-gray-200 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400";
  const btnPrimary = "rounded-full px-5 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] disabled:opacity-40";
  const btnOutline = "rounded-full px-5 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white";
  const optionBtn = (active) => `rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
    active
      ? "bg-[var(--color-save-btn)] text-white border-[var(--color-save-btn)]"
      : "border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white"
  }`;

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Accounts</p>
        <AccountMultiSelectDropdown
          value={selectedaccount}
          onChange={handleAccountChange}
          placeholder="Accounts"
          options={accountoptions}
        />
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Organizer Template</p>
        <select className={inputCls} value={selectedOrganizerTemplate} onChange={handleOrganizerTemplateChange}>
          <option value="">None</option>
          {OrganizerTemplateOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <input className={inputCls} value={organizerName || ""} onChange={handleOrganizerNameChange} placeholder="Organizer Name" />
      </div>

      <div className="mt-3">
        <button type="button" onClick={handlePreview} className={btnPrimary}>Preview Mode</button>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={reminder} onChange={(e) => handleAbsolutesDates(e.target.checked)} />
          <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-[var(--color-save-btn)] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
        </label>
        <span className="text-base font-semibold">Reminders</span>
      </div>

      {reminder && (
        <div className="flex items-center gap-4 mt-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-0.5">Days until next reminder</label>
            <input className={inputCls} name="Daysuntilnextreminder" value={daysuntilNextReminder} onChange={(e) => setDaysuntilNextReminder(e.target.value)} placeholder="Days until next reminder" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-0.5">No. of reminders</label>
            <input className={inputCls} name="noOfReminder" value={noOfReminder} onChange={(e) => setNoOfReminder(e.target.value)} placeholder="No of reminders" />
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-5">
        <button type="button" onClick={createOrganizerOfAccount} className={btnPrimary}>Create</button>
        <button type="button" onClick={handleOrganizerFormClose} className={btnOutline}>Cancel</button>
      </div>

      {previewDialogOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between border-2 border-blue-400 bg-blue-200 p-3 mb-4 rounded-xl">
              <div>
                <p className="font-bold">Preview mode</p>
                <p className="text-sm">The client sees your organizer like this</p>
              </div>
              <button type="button" onClick={handleClosePreview} className="text-blue-700 hover:underline text-sm font-medium">Back to edit</button>
            </div>
            <p className="text-base font-medium mb-3">{organizerName}</p>

            <select className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm mb-3" value={activeStep} onChange={handleDropdownChange}>
              {visibleSections.map((section, index) => {
                const visibleElements = section.formElements.filter((el) => shouldShowElement(el, section.id));
                const answered = visibleElements.reduce((c, el) => c + (answeredElements[`${section.id}_${el.text}`] ? 1 : 0), 0);
                return <option key={section.id} value={index}>{section.text} ({answered}/{visibleElements.length})</option>;
              })}
            </select>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${((activeStep + 1) / totalSteps) * 100}%` }}></div>
            </div>

            <div className="px-4 md:px-20">
                  {/* {visibleSections.map(
                    (section, sectionIndex) =>
                      sectionIndex === activeStep && (
                        <Box key={section.text}>
                          {section.formElements.map(
                            (element) =>
                              shouldShowElement(element) && (
                                <Box key={element.text}>
                                  {(element.type === "Free Entry" || element.type === "Number" || element.type === "Email") && (
                                    <Box>
                                      <Typography fontSize="18px" mb={1} mt={1}>
                                        {element.text}
                                      </Typography>
                                      <TextField
                                        variant="outlined"
                                        size="small"
                                        multiline
                                        fullWidth
                                        // margin='normal'
                                        placeholder={`${element.type} Answer`}
                                        inputProps={{
                                          type: element.type === "Free Entry" ? "text" : element.type.toLowerCase(),
                                        }}
                                        maxRows={8}
                                        style={{ display: "block", marginTop: "15px" }}
                                        value={inputValues[element.text] || ""}
                                        onChange={(e) => handleInputChange(e, element.text)}
                                      />
                                    </Box>
                                  )}

                                  {element.type === "Radio Buttons" && (
                                    <Box>
                                      <Typography fontSize="18px" mb={1} mt={1}>
                                        {element.text}
                                      </Typography>
                                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                        {element.options.map((option) => (
                                          <Button key={option.text} variant={radioValues[element.text] === option.text ? "contained" : "outlined"} onClick={() => handleRadioChange(option.text, element.text)}  sx={{
                                            width: '80px',
                                            borderRadius: '15px',
                                            ...(radioValues[element.text] === option.text
                                              ? {
                                                  backgroundColor: 'var(--color-save-btn)',  // Normal background
                                                  '&:hover': {
                                                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                                                  },
                                                }
                                              : {
                                                  borderColor: 'var(--color-border-cancel-btn)',  // Normal border color
                                                  color: 'var(--color-save-btn)',
                                                  '&:hover': {
                                                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                                                    color: '#fff',
                                                    border: 'none',
                                                  },
                                                }),
                                          }} >
                                            {option.text}
                                          </Button>
                                        ))}
                                      </Box>
                                    </Box>
                                  )}

                                  {element.type === "Checkboxes" && (
                                    <Box>
                                      <Typography fontSize="18px">{element.text}</Typography>
                                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                        {element.options.map((option) => (
                                          <Button key={option.text} variant={checkboxValues[element.text]?.[option.text] ? "contained" : "outlined"} onClick={() => handleCheckboxChange(option.text, element.text)}     sx={{
                                            width: '80px',
                                            borderRadius: '15px',
                                            ...(checkboxValues[element.text]?.[option.text]
                                              ? {
                                                  backgroundColor: 'var(--color-save-btn)',  // Normal background
                                                  '&:hover': {
                                                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                                                  },
                                                }
                                              : {
                                                  borderColor: 'var(--color-border-cancel-btn)',  // Normal border color
                                                  color: 'var(--color-save-btn)',
                                                  '&:hover': {
                                                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                                                    color: '#fff',
                                                    border: 'none',
                                                  },
                                                }),
                                          }}>
                                            {option.text}
                                          </Button>
                                        ))}
                                      </Box>
                                    </Box>
                                  )}

                                  {element.type === "Yes/No" && (
                                    <Box>
                                      <Typography fontSize="18px">{element.text}</Typography>
                                      <Box sx={{ display: "flex", gap: 1 }}>
                                        {element.options.map((option) => (
                                          <Button key={option.text} variant={selectedValue === option.text ? "contained" : "outlined"} onClick={(event) => handleChange(event, element.text)}  sx={{
                                            width: '80px',
                                            borderRadius: '15px',
                                            ...(selectedValue === option.text
                                              ? {
                                                  backgroundColor: 'var(--color-save-btn)',  // Normal background
                                                  '&:hover': {
                                                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                                                  },
                                                }
                                              : {
                                                  borderColor: 'var(--color-border-cancel-btn)',  // Normal border color
                                                  color: 'var(--color-save-btn)',
                                                  '&:hover': {
                                                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                                                    color: '#fff',
                                                    border: 'none',
                                                  },
                                                }),
                                          }}>
                                            {option.text}
                                          </Button>
                                        ))}
                                      </Box>
                                    </Box>
                                  )}

                                  {element.type === "Dropdown" && (
                                    <Box>
                                      <Typography fontSize="18px">{element.text}</Typography>
                                      <FormControl fullWidth>
                                        <Select value={selectedDropdownValue} onChange={(event) => handleDropdownValueChange(event, element.text)} size="small">
                                          {element.options.map((option) => (
                                            <MenuItem key={option.text} value={option.text}>
                                              {option.text}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </Box>
                                  )}

                                  {element.type === "Date" && (
                                    <Box>
                                      <Typography fontSize="18px">{element.text}</Typography>
                                      <DatePicker
                                         format="MM/DD/YYYY"
                                        sx={{ width: "100%", backgroundColor: "#fff" }}
                                        selected={startDate}
                                        onChange={handleStartDateChange}
                                        renderInput={(params) => <TextField {...params} size="small" />}
                                        onOpen={() =>
                                          setAnsweredElements((prevAnswered) => ({
                                            ...prevAnswered,
                                            [element.text]: true,
                                          }))
                                        }
                                      />
                                    </Box>
                                  )}
                                 
                                  {element.type === "File Upload" && (
                                    <Box>
                                      <Typography fontSize="18px" mb={1} mt={2}>
                                        {element.text}
                                      </Typography>

                                      <Tooltip title="Unavailable in preview mode" placement="top">
                                        <Box sx={{ position: "relative", width: "100%" }}>
                                          <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            // margin="normal"
                                            disabled
                                            placeholder="Add Document"
                                            sx={{
                                              cursor: "not-allowed",
                                              "& .MuiInputBase-input": {
                                                pointerEvents: "none",
                                                cursor: "not-allowed",
                                              },
                                            }}
                                          />
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                  )}
                                  {element.type === "Text Editor" && (
                                    <Box mt={2} mb={2}>
                                      <Typography>{stripHtmlTags(element.text)}</Typography>
                                    </Box>
                                  )}
                                </Box>
                              )
                          )}
                        </Box>
                      )
                  )} */}
              {visibleSections.map((section, sectionIndex) =>
                sectionIndex === activeStep && (
                  <div key={section.id}>
                    {section.formElements.map(
                      (element) =>
                        shouldShowElement(element, section.id) && (
                          <div key={`${section.id}_${element.id}`} className="mb-4">
                            {element.type === "Text Editor" && (
                              <p className="text-sm text-gray-700 my-3">{stripHtmlTags(element.text)}</p>
                            )}
                            {(element.type === "Free Entry" || element.type === "Email") && (
                              <div>
                                <p className="text-base mb-1 mt-2">{element.text}</p>
                                <textarea
                                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  rows={3}
                                  placeholder={`${element.type} Answer`}
                                  value={inputValues[`${section.id}_${element.text}`] || ""}
                                  onChange={(e) => handleInputChange(e, element.text, section.id)}
                                />
                              </div>
                            )}
                            {element.type === "Number" && (
                              <div>
                                <p className="text-base mb-1 mt-2">{element.text}</p>
                                <input type="text" inputMode="numeric" pattern="[0-9]*"
                                  className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  placeholder="Number Answer"
                                  value={inputValues[`${section.id}_${element.text}`] || ""}
                                  onChange={(e) => handleInputChange({ target: { value: e.target.value.replace(/\D/g, "") } }, element.text, section.id)}
                                />
                              </div>
                            )}
                            {element.type === "Radio Buttons" && (
                              <div>
                                <p className="text-base mb-1 mt-2">{element.text}</p>
                                <div className="flex flex-wrap gap-2">
                                  {element.options.map((option) => (
                                    <button key={option.text} type="button"
                                      className={optionBtn(radioValues[`${section.id}_${element.text}`] === option.text)}
                                      onClick={() => handleRadioChange(option.text, element.text, section.id)}
                                    >{option.text}</button>
                                  ))}
                                </div>
                              </div>
                            )}
                            {element.type === "Checkboxes" && (
                              <div>
                                <p className="text-base mb-1 mt-2">{element.text}</p>
                                <div className="flex flex-wrap gap-2">
                                  {element.options.map((option) => (
                                    <button key={option.text} type="button"
                                      className={optionBtn(!!checkboxValues[`${section.id}_${element.text}`]?.[option.text])}
                                      onClick={() => handleCheckboxChange(option.text, element.text, section.id)}
                                    >{option.text}</button>
                                  ))}
                                </div>
                              </div>
                            )}
                            {element.type === "Yes/No" && (
                              <div>
                                <p className="text-base mb-1 mt-2">{element.text}</p>
                                <div className="flex gap-2">
                                  {element.options.map((option) => (
                                    <button key={option.text} type="button"
                                      className={optionBtn(selectedYesNoValues[`${section.id}_${element.text}`] === option.text)}
                                      onClick={() => handleYesNoChange(option.text, element.text, section.id)}
                                    >{option.text}</button>
                                  ))}
                                </div>
                              </div>
                            )}
                            {element.type === "Dropdown" && (
                              <div>
                                <p className="text-base mb-1 mt-2">{element.text}</p>
                                <select
                                  className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  value={selectedDropdownValues[`${section.id}_${element.text}`] || ""}
                                  onChange={(e) => handleDropdownValueChange(e, element.text, section.id)}
                                >
                                  {element.options.map((opt) => <option key={opt.text} value={opt.text}>{opt.text}</option>)}
                                </select>
                              </div>
                            )}
                            {element.type === "Date" && (
                              <div>
                                <p className="text-base mb-1 mt-2">{element.text}</p>
                                <input type="date"
                                  className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  value={startDate || ""}
                                  onChange={(e) => { handleStartDateChange(e.target.value); setAnsweredElements(p => ({ ...p, [`${section.id}_${element.text}`]: true })); }}
                                />
                              </div>
                            )}
                            {element.type === "File Upload" && (
                              <div>
                                <p className="text-base mb-1 mt-2">{element.text}</p>
                                <div title="Unavailable in preview mode">
                                  <input disabled placeholder="Add Document"
                                    className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm bg-gray-100 cursor-not-allowed"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                    )}
                  </div>
                )
              )}

              <div className="flex gap-3 mt-6">
                <button type="button" disabled={activeStep === 0} onClick={handleBack} className={btnPrimary}>Back</button>
                <button type="button" disabled={activeStep === totalSteps - 1} onClick={handleNext} className={btnPrimary}>Next</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBulkOrganizer;

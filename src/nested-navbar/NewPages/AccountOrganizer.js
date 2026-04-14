import { useState, useEffect, useContext } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginContext } from "../../Sidebar/Context/Context.js";
const AccountOrganizer = () => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();

  const [organizerTemplate, setOrganizerTemplate] = useState([]);
  const [selectedOrganizerTemplate, setSelectedOrganizerTemplate] =
    useState("");
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
 
  useEffect(() => {
    fetchAccountsData();
  }, []);

  const fetchAccountsData = async () => {
    try {
      const storedUserRole = localStorage.getItem("userRole");
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      const loginuserid = storedData?.teammember?.userid;
      const viewAllAccounts = storedData?.teammember?.viewallAccounts;

      let url = "";

      // === ROLE-BASED URL LOGIC ===
      if (storedUserRole === "Admin") {
        url =
          "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true";
      } else {
        url =
          viewAllAccounts === true
            ? "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true"
            : `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=true`;
      }

      console.log("Fetching accounts from:", url);

      const response = await fetch(url);
      const result = await response.json();

      console.log("accounts result", result);

      // Normalize for both API responses
      const accounts =
        result.accounts || result.accountlist || result.teamAccounts || [];

      if (Array.isArray(accounts)) {
        setAccountData(accounts);

        // Handle selected data (account ID or multiple IDs)
        const selectedAccounts = accounts
          .filter((account) =>
            Array.isArray(data)
              ? data.includes(account._id)
              : account._id === data
          )
          .map((selectedAccount) => ({
            label: selectedAccount.accountName,
            value: selectedAccount._id,
          }));

        if (selectedAccounts.length > 0) {
          setSelectedAccount(selectedAccounts);
        } else {
          setSelectedAccount([]);
        }
      } else {
        console.error("Account list is not an array", result.accounts);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Dropdown Options
  const AccountsOptions = (accountData || []).map((account) => ({
    value: account._id,
    label: account.accountName,
  }));

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
  const fetchOrganizerTemplateDataByTempId = async (
    selectedOrganizerTempid
  ) => {
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
    console.log(selectedOrganizerTempData.sections);
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

  const OrganizerTemplateOptions = organizerTemplate.map((organizertemp) => ({
    value: organizertemp._id,
    label: organizertemp.templatename,
  }));

  const handleOrganizerFormClose = () => {
    navigate(`/clients/accounts/accountsdash/organizers/${data}`);
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

  const [repeatedSections, setRepeatedSections] = useState({});

  const shouldShowSection = (section) => {
    if (!section.sectionsettings?.conditional) return true;

    const conditions = section.sectionsettings.conditions || [];
    const mode = section.sectionsettings.mode || "All";

    if (conditions.length === 0) return true;

    let matchedConditions = 0;

    conditions.forEach((condition) => {
      if (!condition.question || !condition.answer) return;

      let conditionMet = false;

      for (const key in radioValues) {
        const [checkSectionId] = key.split("_");
        const numericCheckSectionId = Number(checkSectionId);
        if (
          !Object.values(repeatedSections)
            .flat()
            .includes(numericCheckSectionId)
        ) {
          if (
            key.endsWith(`_${condition.question}`) &&
            radioValues[key] === condition.answer
          ) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      for (const key in checkboxValues) {
        const [checkSectionId] = key.split("_");
        const numericCheckSectionId = Number(checkSectionId);
        if (
          !Object.values(repeatedSections)
            .flat()
            .includes(numericCheckSectionId)
        ) {
          if (
            key.endsWith(`_${condition.question}`) &&
            checkboxValues[key]?.[condition.answer]
          ) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      for (const key in selectedDropdownValues) {
        const [checkSectionId] = key.split("_");
        const numericCheckSectionId = Number(checkSectionId);
        if (
          !Object.values(repeatedSections)
            .flat()
            .includes(numericCheckSectionId)
        ) {
          if (
            key.endsWith(`_${condition.question}`) &&
            selectedDropdownValues[key] === condition.answer
          ) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
        return;
      }

      for (const key in selectedYesNoValues) {
        const [checkSectionId] = key.split("_");
        const numericCheckSectionId = Number(checkSectionId);
        if (
          !Object.values(repeatedSections)
            .flat()
            .includes(numericCheckSectionId)
        ) {
          if (
            key.endsWith(`_${condition.question}`) &&
            selectedYesNoValues[key] === condition.answer
          ) {
            conditionMet = true;
            break;
          }
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") return;
      }
    });

    if (mode === "Any") {
      return matchedConditions > 0;
    } else {
      return matchedConditions === conditions.length;
    }
  };
  const getVisibleSections = () => sections.filter(shouldShowSection);
  const visibleSections = getVisibleSections();

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

  const shouldShowElement = (element, sectionId) => {
    const settings = element.questionsectionsettings;
    if (!settings?.conditional) return true;

    const conditions = settings?.conditions || [];
    const mode = settings?.mode || "All";

    if (conditions.length === 0) return true;

    let matchedConditions = 0;

    for (const condition of conditions) {
      const { question, answer } = condition;
      if (!question || !answer) continue;

      let conditionMet = false;

      for (const key in radioValues) {
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId =
          typeof sectionId === "string" ? Number(sectionId) : sectionId;

        if (
          numericKeySectionId === numericCurrentSectionId &&
          key.endsWith(`_${question}`) &&
          radioValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in checkboxValues) {
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId =
          typeof sectionId === "string" ? Number(sectionId) : sectionId;

        if (
          numericKeySectionId === numericCurrentSectionId &&
          key.endsWith(`_${question}`) &&
          checkboxValues[key]?.[answer]
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in selectedDropdownValues) {
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId =
          typeof sectionId === "string" ? Number(sectionId) : sectionId;

        if (
          numericKeySectionId === numericCurrentSectionId &&
          key.endsWith(`_${question}`) &&
          selectedDropdownValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      for (const key in selectedYesNoValues) {
        const [keySectionId] = key.split("_");
        const numericKeySectionId = Number(keySectionId);
        const numericCurrentSectionId =
          typeof sectionId === "string" ? Number(sectionId) : sectionId;

        if (
          numericKeySectionId === numericCurrentSectionId &&
          key.endsWith(`_${question}`) &&
          selectedYesNoValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) {
        matchedConditions++;
        if (mode === "Any") continue;
        else continue;
      }

      if (mode === "All" && !conditionMet) {
        return false;
      }
    }

    if (mode === "Any") {
      return matchedConditions > 0;
    } else {
      return matchedConditions === conditions.length;
    }
  };
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

  const createOrganizerOfAccount = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      accountid: data,
      organizertemplateid: selectedOrganizerTemplate,
      organizerName: organizerName,
      reminders: reminder,
      noofreminders: noOfReminder,
      daysuntilnextreminder: daysuntilNextReminder,
      jobid: ["661e495d11a097f731ccd6e8"],
      fileUploadPath: "",
      sections:
        selectedOrganizerTempData?.sections?.map((section) => ({
          name: section?.text || "",
          id: section?.id?.toString() || "",
          text: section?.text || "",
          sectionsettings: {
            sectionRepeatingMode:
              section?.sectionsettings?.sectionRepeatingMode || false,
            buttonName:
              section?.sectionsettings?.buttonName || "Repeat Section",
            conditional: section?.sectionsettings?.conditional || false,
            conditions: section?.sectionsettings?.conditions || [],
            mode: section?.sectionsettings?.mode || "Any",
          },
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
              questionsectionsettings: {
                required: question?.questionsectionsettings?.required || false,
                prefilled:
                  question?.questionsectionsettings?.prefilled || false,
                conditional:
                  question?.questionsectionsettings?.conditional || false,
                conditions: question?.questionsectionsettings?.conditions || [],
                descriptionEnabled:
                  question?.questionsectionsettings?.descriptionEnabled ||
                  false,
                description:
                  question?.questionsectionsettings?.description || "",
                mode: question?.questionsectionsettings?.mode || "Any",
              },
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

    console.log(raw);
    const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/org`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        console.log(result.newOrganizerAccountWise);
        
        setorganizeraccountwise(result.newOrganizerAccountWise);
        setShowOrganizerForm(true);
        setSelectedOrganizerTemplate(selectedOrganizerTemplate);
        console.log(selectedOrganizerTemplate);
        toast.success("New organizer created successfully");
      
        navigate(`/clients/accounts/accountsdash/organizers/${data}`);
      })
      .catch((error) => console.error(error));
  };
  const { logindata, setLoginData } = useContext(LoginContext);
  const [loginsData, setloginsData] = useState("");
  console.log(logindata);

  const [username, setUsername] = useState("");

  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchUserData = async (id) => {
    const maxLength = 15;
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url + loginsData, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUsername(result.username);
      });
  };
  useEffect(() => {
    // setloginsData(logindata.user.id)
    fetchUserData(logindata.user.id);
  }, []);

  const handleDelete = (valueToDelete) => {
    setSelectedAccount((prevSelected) =>
      prevSelected.filter((value) => value !== valueToDelete)
    );
  };

  const fieldCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder:text-gray-400 transition-colors";
  const labelCls = "block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5";
  const saveBtnCls = "rounded-lg px-4 py-2 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] transition-colors";
  const cancelBtnCls = "rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors";

  return (
    <>
      <div className="p-4 md:p-6">
        {/* Page header */}
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-800">Create Organizer</h2>
          <p className="text-xs text-gray-400 mt-0.5">Set up a new organizer for this account</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">

            {/* Account */}
            <div className="px-5 py-4">
              <label className={labelCls}>Account</label>
              <div className="flex flex-wrap gap-1.5 min-h-[38px] w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                {selectedAccount.map((option) => (
                  <span key={option.value} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700">
                    {option.label}
                  </span>
                ))}
                {selectedAccount.length === 0 && (
                  <span className="text-sm text-gray-300">No account selected</span>
                )}
              </div>
            </div>

            {/* Template */}
            <div className="px-5 py-4">
              <label className={labelCls}>Organizer Template</label>
              <select
                value={selectedOrganizerTemplate}
                onChange={handleOrganizerTemplateChange}
                className={fieldCls}
              >
                <option value="">Select a template</option>
                {OrganizerTemplateOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Organizer Name */}
            <div className="px-5 py-4">
              <label className={labelCls}>Organizer Name</label>
              <input
                type="text"
                value={organizerName || ""}
                placeholder="Enter organizer name"
                onChange={handleOrganizerNameChange}
                className={fieldCls}
              />
            </div>

            {/* Preview button row */}
            <div className="px-5 py-4">
              <button type="button" onClick={handlePreview}
                className="rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                Preview Mode
              </button>
            </div>

            {/* Reminders toggle */}
            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Reminders</p>
                  <p className="text-xs text-gray-400 mt-0.5">Send follow-up reminders to the client</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={reminder}
                    onChange={(e) => handleAbsolutesDates(e.target.checked)}
                    className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
              {reminder && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className={labelCls}>Days until next reminder</label>
                    <input type="text" name="Daysuntilnextreminder" value={daysuntilNextReminder}
                      onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                      placeholder="e.g. 3"
                      className={fieldCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Number of reminders</label>
                    <input type="text" name="noOfReminder" value={noOfReminder}
                      onChange={(e) => setNoOfReminder(e.target.value)}
                      placeholder="e.g. 2"
                      className={fieldCls} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50">
            <button type="button" onClick={handleOrganizerFormClose} className={cancelBtnCls}>
              Cancel
            </button>
            <button type="button" onClick={createOrganizerOfAccount} className={saveBtnCls}>
              Create Organizer
            </button>
          </div>
        </div>
      </div>

      {previewDialogOpen && (
        <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4 md:p-8">
            {/* Preview header banner */}
            <div className="flex items-center justify-between bg-blue-600 rounded-xl px-5 py-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-white">Preview Mode</p>
                <p className="text-xs text-blue-100 mt-0.5">This is how clients will see this organizer</p>
              </div>
              <button type="button" onClick={handleClosePreview}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-white text-blue-700 hover:bg-blue-50 transition-colors">
                ← Back to Edit
              </button>
            </div>

            {/* Organizer name */}
            <h2 className="text-lg font-bold text-gray-800 mb-4">{organizerName}</h2>

            {/* Section selector */}
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-4">
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Section</label>
              <select
                value={activeStep}
                onChange={handleDropdownChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {visibleSections.map((section, index) => {
                  const visibleElements = section.formElements.filter((el) => shouldShowElement(el, section.id));
                  const answeredCount = visibleElements.reduce((count, element) => {
                    const key = `${section.id}_${element.text}`;
                    return count + (answeredElements[key] ? 1 : 0);
                  }, 0);
                  return (
                    <option key={section.id} value={index}>
                      {section.text} ({answeredCount}/{visibleElements.length})
                    </option>
                  );
                })}
              </select>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-gray-400">Progress</span>
                  <span className="text-[11px] font-semibold text-blue-600">
                    {activeStep + 1} / {totalSteps}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((activeStep + 1) / totalSteps) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Form content */}
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 md:px-8">
                  {visibleSections.map(
                    (section, sectionIndex) =>
                      sectionIndex === activeStep && (
                        <div key={section.id}>
                          {section.formElements.map(
                            (element) =>
                              shouldShowElement(element, section.id) && (
                                <div key={`${section.id}_${element.id}`}>
                                  {/* Text Editor */}
                                  {element.type === "Text Editor" && (
                                    <div className="my-4">
                                      <p className="text-sm">{stripHtmlTags(element.text)}</p>
                                    </div>
                                  )}

                                  {/* Free Entry or Email */}
                                  {(element.type === "Free Entry" || element.type === "Email") && (
                                    <div className="my-2">
                                      <p className="text-lg mb-1 mt-1">{element.text}</p>
                                      <textarea
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        rows={3}
                                        placeholder={`${element.type} Answer`}
                                        value={inputValues[`${section.id}_${element.text}`] || ""}
                                        onChange={(e) => handleInputChange(e, element.text, section.id)}
                                      />
                                    </div>
                                  )}

                                  {/* Number */}
                                  {element.type === "Number" && (
                                    <div className="my-2">
                                      <p className="text-lg mb-1 mt-1">{element.text}</p>
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        placeholder={`${element.type} Answer`}
                                        value={inputValues[`${section.id}_${element.text}`] || ""}
                                        onChange={(e) => {
                                          const numericValue = e.target.value.replace(/\D/g, "");
                                          handleInputChange({ target: { value: numericValue } }, element.text, section.id);
                                        }}
                                      />
                                    </div>
                                  )}

                                  {/* Radio Buttons */}
                                  {element.type === "Radio Buttons" && (
                                    <div className="my-2">
                                      <p className="text-lg mb-1 mt-1">{element.text}</p>
                                      <div className="flex flex-wrap gap-2">
                                        {element.options.map((option) => (
                                          <button key={option.text} type="button"
                                            onClick={() => handleRadioChange(option.text, element.text, section.id)}
                                            className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                                              radioValues[`${section.id}_${element.text}`] === option.text
                                                ? "text-white bg-[var(--color-save-btn)] border-transparent"
                                                : "border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white"
                                            }`}>
                                            {option.text}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Checkboxes */}
                                  {element.type === "Checkboxes" && (
                                    <div className="my-2">
                                      <p className="text-lg">{element.text}</p>
                                      <div className="flex flex-wrap gap-2">
                                        {element.options.map((option) => (
                                          <button key={option.text} type="button"
                                            onClick={() => handleCheckboxChange(option.text, element.text, section.id)}
                                            className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                                              checkboxValues[`${section.id}_${element.text}`]?.[option.text]
                                                ? "text-white bg-[var(--color-save-btn)] border-transparent"
                                                : "border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white"
                                            }`}>
                                            {option.text}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Yes/No */}
                                  {element.type === "Yes/No" && (
                                    <div className="my-2">
                                      <p className="text-lg">{element.text}</p>
                                      <div className="flex gap-2">
                                        {element.options.map((option) => (
                                          <button key={option.text} type="button"
                                            onClick={() => handleYesNoChange(option.text, element.text, section.id)}
                                            className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                                              selectedYesNoValues[`${section.id}_${element.text}`] === option.text
                                                ? "text-white bg-[var(--color-save-btn)] border-transparent"
                                                : "border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white"
                                            }`}>
                                            {option.text}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Dropdown */}
                                  {element.type === "Dropdown" && (
                                    <div className="my-2">
                                      <p className="text-lg">{element.text}</p>
                                      <select
                                        value={selectedDropdownValues[`${section.id}_${element.text}`] || ""}
                                        onChange={(event) => handleDropdownValueChange(event, element.text, section.id)}
                                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                      >
                                        {element.options.map((option) => (
                                          <option key={option.text} value={option.text}>{option.text}</option>
                                        ))}
                                      </select>
                                    </div>
                                  )}

                                  {/* Date */}
                                  {element.type === "Date" && (
                                    <div className="my-2">
                                      <p className="text-lg">{element.text}</p>
                                      <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                                        value={startDate ? startDate.format("YYYY-MM-DD") : ""}
                                        onChange={(e) => {
                                          handleStartDateChange(e.target.value);
                                          setAnsweredElements((prevAnswered) => ({ ...prevAnswered, [`${section.id}_${element.text}`]: true }));
                                        }}
                                      />
                                    </div>
                                  )}

                                  {/* File Upload */}
                                  {element.type === "File Upload" && (
                                    <div className="my-2">
                                      <p className="text-lg mb-1 mt-2">{element.text}</p>
                                      <div title="Unavailable in preview mode">
                                        <input
                                          type="text"
                                          disabled
                                          placeholder="Add Document"
                                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm cursor-not-allowed bg-gray-100"
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
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button type="button" disabled={activeStep === 0} onClick={handleBack}
                      className="rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      ← Back
                    </button>
                    <span className="text-xs text-gray-400">
                      Section {activeStep + 1} of {totalSteps}
                    </span>
                    <button type="button" disabled={activeStep === totalSteps - 1} onClick={handleNext}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      Next →
                    </button>
                  </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountOrganizer;

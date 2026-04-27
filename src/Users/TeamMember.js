import { NavLink, Outlet } from "react-router-dom";
import Switch from "react-switch";
import React, { useState, useContext, useEffect } from "react";
import { X, HelpCircle, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { LoginContext } from "../Sidebar/Context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";

const TeamMember = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

  const WINDOWS_PORT = process.env.REACT_APP_SERVER_URI;
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const { logindata } = useContext(LoginContext);

  // const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [userData, setUserData] = useState([]);
  const fetchuserData = async () => {
    try {
      const url = `${LOGIN_API}/common/user/${logindata.user.id}`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
      console.log(data.user.id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchuserData();
  }, []);

  const fetchData = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const url = `${LOGIN_API}/admin/teammember/teammemberlist/list/true`;

      const response = await fetch(url, requestOptions);
      const result = await response.json();

      const loggedInUser = {
        _id: userData._id,
        FirstName: userData.username, // Assuming you want to display the username in FirstName
        MiddleName: "",
        LastName: "",
        // Name: userData.username,
        Email: userData.email,
        Role: userData.role,
        has2FA: "Disabled",
        Created: userData.updatedAt,
      };

      const updatedTeamMembers = [loggedInUser, ...result.teamMemberslist];

      setTeamMembers(updatedTeamMembers);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userData) {
      fetchData();
    }
  }, [userData]);
  console.log("teamsdata", teamMembers);
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const handleNewDrawerClose = () => {
    setIsNewDrawerOpen(false);
    fetchData();
  };
  //Integration
  const [isCheckedPayments, setIsCheckedPayments] = useState(false);
  const [isCheckedPipelines, setIsCheckedPipelines] = useState(false);
  const [isCheckedTimeEntries, setIsCheckedTimeEntries] = useState(false);
  const [isCheckedAccounts, setIsCheckedAccounts] = useState(false);
  const [isCheckedTags, setIsCheckedTags] = useState(false);
  const [isCheckedOrganizers, setIsCheckedOrganizers] = useState(false);
  const [isCheckedFirmBalance, setIsCheckedFirmBalance] = useState(false);
  const [isCheckedContacts, setIsCheckedContacts] = useState(false);
  const [isCheckedSite, setIsCheckedSite] = useState(false);
  const [isCheckedServices, setIsCheckedServices] = useState(false);
  const [isCheckedFilterTemplates, setIsCheckedFilterTemplates] =
    useState(false);
  const [isCheckedTemplates, setIsCheckedTemplates] = useState(false);
  const [isCheckedMarketplace, setIsCheckedMarketplace] = useState(false);
  const [isCheckedInvoices, setIsCheckedInvoices] = useState(false);
  const [isCheckedJobRecurrences, setIsCheckedJobRecurrences] = useState(false);
  const [isCheckedRatesTimeEntries, setIsCheckedRatesTimeEntries] =
    useState(false);
  const [isCheckedAllAccounts, setIsCheckedAllAccounts] = useState(false);
  const [isCheckedCustomFields, setIsCheckedCustomFields] = useState(false);
  const [isCheckedAllContacts, setIsCheckedAllContacts] = useState(false);
  const [isCheckedTeammates, setIsCheckedTeammates] = useState(false);
  const [isCheckedProposals, setIsCheckedProposals] = useState(false);
  const [isCheckedViewReporting, setIsCheckedViewReporting] = useState(false);
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isCheckedTranscripts, setIsCheckedTranscripts] = useState(false);
  const [isCheckedOrgnizerAnswers, setIsCheckedOrgnizerAnswers] =
    useState(false);
  const [isCheckedDocuments, setIsCheckedDocuments] = useState(false);

  const handleSwitchViewReporting = (checked) => {
    setIsCheckedViewReporting(checked);
  };
  const handleSwitchTranscripts = (checked) => {
    setIsCheckedTranscripts(checked);
  };
  const handleSwitchDocuments = (checked) => {
    setIsCheckedDocuments(checked);
  };
  const handleSwitchOrgnizerAnswers = (checked) => {
    setIsCheckedOrgnizerAnswers(checked);
  };
  const handleSwitchEmail = (checked) => {
    setIsCheckedEmail(checked);
  };
  const handleSwitchProposals = (checked) => {
    setIsCheckedProposals(checked);
  };
  const handleSwitchAllContacts = (checked) => {
    setIsCheckedAllContacts(checked);
  };
  const handleSwitchTeammates = (checked) => {
    setIsCheckedTeammates(checked);
  };
  const handleSwitchCustomFields = (checked) => {
    setIsCheckedCustomFields(checked);
  };
  const handleSwitchAllAccounts = (checked) => {
    setIsCheckedAllAccounts(checked);
  };
  const handleSwitchRatesTimeEntries = (checked) => {
    setIsCheckedRatesTimeEntries(checked);
  };
  const handleSwitchJobRecurrences = (checked) => {
    setIsCheckedJobRecurrences(checked);
  };
  const handleSwitchInvoices = (checked) => {
    setIsCheckedInvoices(checked);
  };
  const handleSwitchSite = (checked) => {
    setIsCheckedSite(checked);
  };
  const handleSwitchServices = (checked) => {
    setIsCheckedServices(checked);
  };
  const handleSwitchFilterTemplates = (checked) => {
    setIsCheckedFilterTemplates(checked);
  };
  const handleSwitchTemplates = (checked) => {
    setIsCheckedTemplates(checked);
    // updateSidebarData()
  };
  const handleSwitchMarketplace = (checked) => {
    setIsCheckedMarketplace(checked);
  };
  const handleSwitchContacts = (checked) => {
    setIsCheckedContacts(checked);
  };
  const handleSwitchFirmBalance = (checked) => {
    setIsCheckedFirmBalance(checked);
  };
  const handleSwitchOrganizers = (checked) => {
    setIsCheckedOrganizers(checked);
  };
  const handleSwitchTags = (checked) => {
    setIsCheckedTags(checked);
  };
  const handleSwitchAccounts = (checked) => {
    setIsCheckedAccounts(checked);
  };
  const handleSwitchTime = (checked) => {
    setIsCheckedTimeEntries(checked);
  };
  const handleSwitchPayments = (checked) => {
    setIsCheckedPayments(checked);
  };
  const handleSwitchPipelines = (checked) => {
    setIsCheckedPipelines(checked);
  };

  const [selectedOption, setSelectedOption] = useState("employee");
  // const [selectedRole, setSelectedRole]
  const options = [
    { value: "employee", label: "Employee" },
    { value: "admin", label: "Admin" },
  ];
  // const handleOptionChange = (selectedOption) => {
  //     setSelectedOption(selectedOption);
  // };
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEMail] = useState("");
  const handleFirstName = (event) => {
    setFirstName(event.target.value.trim());
  };

  const handleMiddleName = (event) => {
    setMiddleName(event.target.value.trim());
  };
  const handleLastName = (event) => {
    setLastName(event.target.value.trim());
  };

  // Function to check if email exists
  const checkEmailExists = async (enteredEmail) => {
    const myHeaders = new Headers();
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${LOGIN_API}/common/user/email/getuserbyemail/${enteredEmail}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log(result);
      // Check if user array is empty
      if (result.error) {
        // No such user, email does not exist
        return false;
      } else {
        // Email exists
        return true;
      }
    } catch (error) {
      console.error(error);
      return false; // Return false if an error occurs
    }
  };
  const handleEmail = async (event) => {
    const enteredEmail = event.target.value;
    // console.log(enteredEmail);
    setEMail(enteredEmail);
    // Check if email exists
    const exists = await checkEmailExists(enteredEmail);
    setEmailValidation(exists ? "Email already exists" : "");
  };
  const [firstNameValidation, setFirstNameValidation] = useState("");
  const [lastNameValidation, setLastNameValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [teamMemberIdUpdate, setTeamMemberId] = useState("");

  //todo handle submit indivisual
  const handleSubmitTeamMember = async () => {
    if (firstName === "") {
      setFirstNameValidation("First Name can't be blank");
    } else {
      setFirstNameValidation("");
    }

    // Validation for Last Name
    if (lastName === "") {
      setLastNameValidation("Last Name can't be blank");
    } else {
      setLastNameValidation("");
    }

    // Validation for Phone Number
    if (email === "") {
      setEmailValidation("Email is compalsary");
    } else {
      setEmailValidation("");
    }
    // **Check if email already exists before submitting**
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setEmailValidation("Email already exists");
      toast.error("Email already exists"); // Show toast notification
      // setIsNewDrawerOpen(false);
      return; // **Stop submission**
    }
    // If all validations pass, proceed to next step
    if (firstName && lastName && email) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        // role: selectedOption.value,
        role: selectedOption,
        managePayments: isCheckedPayments,
        manageInvoices: isCheckedInvoices,
        managePipelines: isCheckedPipelines,
        manageJobRecurrence: isCheckedJobRecurrences,
        manageTimeEntries: isCheckedTimeEntries,
        manageRatesinTimeEntries: isCheckedRatesTimeEntries,
        manageAccounts: isCheckedAccounts,
        viewallAccounts: isCheckedAllAccounts,
        manageTags: isCheckedTags,
        manageCustomFields: isCheckedCustomFields,
        manageOrganizers: isCheckedOrganizers,
        assignTeamMates: isCheckedTeammates,
        chargeFirmBalance: isCheckedFirmBalance,
        viewAllContacts: isCheckedAllContacts,
        manageContacts: isCheckedContacts,
        manageProposals: isCheckedProposals,
        manageSites: isCheckedSite,
        manageEmails: isCheckedEmail,
        manageServices: isCheckedServices,
        editOrganizersAnswers: isCheckedOrgnizerAnswers,
        managePublicFilterTemplates: isCheckedFilterTemplates,
        manageDocuments: isCheckedDocuments,
        manageTemplates: isCheckedTemplates,
        manageIRSTranscripts: isCheckedTranscripts,
        manageMarketPlace: isCheckedMarketplace,
        viewReporting: isCheckedViewReporting,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${LOGIN_API}/admin/teammember`;

      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            toast.error("Team member with this email already  exist.");
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          console.log(result.teamMember._id);
          setTeamMemberId(result.teamMember._id);
          newUser(result.teamMember._id);
        })

        .catch((error) => console.error(error));
    }
  };
  console.log(teamMemberIdUpdate);

  const newUser = (teammemberuserid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const username = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(" ");
    const password = `${firstName}@123`;

    const raw = JSON.stringify({
      username: username,
      email: email,
      role: "TeamMember",
      password: password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/login/signup/`;
    fetch(url, requestOptions)
      .then((response) => response.json())

      .then((result) => {
        console.log(result);
        console.log(result._id);
        updateTeammemberUserid(result._id, teammemberuserid);
        insertNotificationAccess(result._id);

        // ******************required to send email************
        sendmail();
      })

      .catch((error) => console.error(error));
  };
  const insertNotificationAccess = (userid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      userId: userid,
      notifications: [
        {
          notificationDescription: "Invoices",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Payments",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Organizers",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Uploads",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "E-signatures",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Approvals",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Done uploading",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Tasks",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Messages",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "New mail",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Proposals",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Jobs",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Mentions",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "SMS",
          inbox: false,
          email: false,
        },
      ],
      active: true,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/admin/notification`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const updateTeammemberUserid = (UserId, teammemberuserid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      userid: UserId,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(teammemberuserid);
    fetch(`${LOGIN_API}/admin/teammember/${teammemberuserid}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        //         toast.success("Team Member created successfully!");
        //        handleNewDrawerClose()
        // fetchData();
        // navigate
      })

      .catch((error) => console.error(error));
  };
  // const { logindata } = useContext(LoginContext);
  const sendmail = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    console.log(logindata.user.id);

    // const port = window.location.port;
    const raw = JSON.stringify({
      email: email,
      owneremail: logindata.user.id,
      url: `${WINDOWS_PORT}/activate/`,
    });

    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${LOGIN_API}/teamemail/teammembersavedemail/`;

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        // toast.success("Team Member saved successfully!");
        // createNewSidebarData();
        // handleNewDrawerClose();
        // fetchData();
        // navigate("/firmtemp/teammember/activemember");
        // window.location.reload();
        toast.success("Team Member created successfully!");
        handleNewDrawerClose();
        fetchData();
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while submitting the form", error);
      });
  };

  // Access rights data for rendering
  const leftColumnRights = [
    { label: "Manage payments", checked: isCheckedPayments, handler: handleSwitchPayments, disabled: true },
    { label: "Manage pipelines", checked: isCheckedPipelines, handler: handleSwitchPipelines },
    { label: "Manage time entries", checked: isCheckedTimeEntries, handler: handleSwitchTime, disabled: true },
    { label: "Manage accounts", checked: isCheckedAccounts, handler: handleSwitchAccounts },
    { label: "Manage tags", checked: isCheckedTags, handler: handleSwitchTags },
    { label: "Manage organizers", checked: isCheckedOrganizers, handler: handleSwitchOrganizers },
    { label: "Manage firm balance", checked: isCheckedFirmBalance, handler: handleSwitchFirmBalance, disabled: true },
    { label: "Manage contacts", checked: isCheckedContacts, handler: handleSwitchContacts },
    { label: "Manage site", checked: isCheckedSite, handler: handleSwitchSite, disabled: true },
    { label: "Manage services", checked: isCheckedServices, handler: handleSwitchServices },
    { label: "Manage public filter templates", checked: isCheckedFilterTemplates, handler: handleSwitchFilterTemplates, disabled: true },
    { label: "Manage templates", checked: isCheckedTemplates, handler: handleSwitchTemplates },
    { label: "Manage marketplace", checked: isCheckedMarketplace, handler: handleSwitchMarketplace, disabled: true },
  ];

  const rightColumnRights = [
    { label: "Manage invoices", checked: isCheckedInvoices, handler: handleSwitchInvoices },
    { label: "Manage job recurrences", checked: isCheckedJobRecurrences, handler: handleSwitchJobRecurrences, disabled: true },
    { label: "Manage rates in time entries", checked: isCheckedRatesTimeEntries, handler: handleSwitchRatesTimeEntries, disabled: true },
    { label: "View all accounts", checked: isCheckedAllAccounts, handler: handleSwitchAllAccounts },
    { label: "Manage custom fields", checked: isCheckedCustomFields, handler: handleSwitchCustomFields, disabled: true },
    { label: "Manage teammates", checked: isCheckedTeammates, handler: handleSwitchTeammates, disabled: true },
    { label: "View all contacts", checked: isCheckedAllContacts, handler: handleSwitchAllContacts },
    { label: "Manage proposals", checked: isCheckedProposals, handler: handleSwitchProposals },
    { label: "Mute emails", checked: isCheckedEmail, handler: handleSwitchEmail, disabled: true },
    { label: "Edit organizer answers", checked: isCheckedOrgnizerAnswers, handler: handleSwitchOrgnizerAnswers, disabled: true },
    { label: "Manage documents", checked: isCheckedDocuments, handler: handleSwitchDocuments, disabled: true },
    { label: "Manage IRS Transcripts", checked: isCheckedTranscripts, handler: handleSwitchTranscripts, disabled: true },
    { label: "View reporting", checked: isCheckedViewReporting, handler: handleSwitchViewReporting, disabled: true },
  ];

  const renderSwitchRow = (item, index) => (
    <div key={index} className={`flex items-center gap-3 py-2 ${item.disabled ? 'opacity-50' : ''}`}>
      <Switch
        onChange={item.handler}
        checked={item.checked}
        onColor="#4f46e5"
        onHandleColor="#FFF"
        handleDiameter={10}
        uncheckedIcon={false}
        checkedIcon={false}
        height={20}
        width={32}
        disabled={item.disabled}
        className="react-switch"
      />
      <span className="text-sm text-slate-700">{item.label}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="inline-flex items-center rounded-lg bg-muted p-1">
          <NavLink
            to="/firmtemp/teammember/activemember"
            className={({ isActive }) =>
              `rounded-md px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-background text-primary shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            Active Members
          </NavLink>
          <NavLink
            to="/firmtemp/teammember/deactivatemember"
            className={({ isActive }) =>
              `rounded-md px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-background text-primary shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            Deactivated Members
          </NavLink>
        </div>

        <Button size="sm" onClick={() => setIsNewDrawerOpen(true)}>
          <UserPlus className="h-4 w-4 mr-1.5" />
          Add Team Member
        </Button>
      </div>

      {/* Outlet */}
      <div>
        <Outlet context={{ fetchData, teamMembers, loading }} />
      </div>

      {/* Add Team Member Drawer */}
      {isNewDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleNewDrawerClose} />
          <div className="relative w-full max-w-[650px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Add New Team Member</h2>
              <button onClick={handleNewDrawerClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    placeholder="First name"
                    onChange={handleFirstName}
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  />
                  {firstNameValidation && <p className="mt-1 text-xs text-red-500">{firstNameValidation}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Middle Name</label>
                  <input
                    type="text"
                    id="middlename"
                    name="middlename"
                    placeholder="Middle Name"
                    onChange={handleMiddleName}
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="Last Name"
                    onChange={handleLastName}
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  />
                  {lastNameValidation && <p className="mt-1 text-xs text-red-500">{lastNameValidation}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleEmail}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                />
                {!!emailValidation && (
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    {emailValidation}
                  </div>
                )}
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                >
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Access Rights */}
              {selectedOption === "employee" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">Access Rights</h3>
                    <HelpCircle className="h-4 w-4 text-indigo-500 cursor-pointer" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <div className="space-y-0.5">
                      {leftColumnRights.map((item, i) => renderSwitchRow(item, i))}
                    </div>
                    <div className="space-y-0.5">
                      {rightColumnRights.map((item, i) => renderSwitchRow(item, i))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="flex items-center gap-3 border-t border-slate-200 px-6 py-4">
              <button onClick={handleSubmitTeamMember} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
                Send Invite
              </button>
              <button onClick={handleNewDrawerClose} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMember;

import React, { useEffect, useState, useMemo, useContext, useRef } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { MoreVertical, X, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Switch from "react-switch";
import { LoginContext } from "../Sidebar/Context/Context";
import { toast } from "react-toastify";
import axios from "axios";

const ActiveMember = () => {
  // http://68.251.138.236:8880
  const { fetchData, teamMembers, loading } = useOutletContext();
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
  console.log(userData);
  const USER_API = process.env.REACT_APP_USER_URL;
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const WINDOWS_PORT = process.env.REACT_APP_SERVER_URI;
  const menuRef = useRef(null);
  // const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const handleNewDrawerClose = () => {
    setIsUpdateDrawerOpen(false);
  };
  // const [loading, setLoading] = useState(true);
  // const [teamMembers, setTeamMembers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDelete = () => {
    // Handle the delete action
    console.log("Delete", selectedRow);
    handleMenuClose();
  };

  // const fetchData = async () => {
  //   try {
  //     const requestOptions = {
  //       method: "GET",
  //       redirect: "follow",
  //     };

  //     const url = `${LOGIN_API}/admin/teammember/teammemberlist/list/true`;

  //     const response = await fetch(url, requestOptions);
  //     const result = await response.json();

  //     const loggedInUser = {
  //       _id: userData._id,
  //       FirstName: userData.username, // Assuming you want to display the username in FirstName
  //       MiddleName: "",
  //       LastName: "",
  //       // Name: userData.username,
  //       Email: userData.email,
  //       Role: userData.role,
  //       has2FA: "Disabled",
  //       Created: userData.updatedAt,
  //     };

  //     const updatedTeamMembers = [loggedInUser, ...result.teamMemberslist];

  //     setTeamMembers(updatedTeamMembers);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   if (userData) {
  //     fetchData();
  //   }
  // }, [userData]);

  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [getId, setGetId] = useState("");
  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const handleUpdateDrawerOpen = () => {
    setIsUpdateDrawerOpen(true);
  };
  // const handleTeamMemberDelete = async (_id) => {
  //   console.log(_id);

  //   const requestOptions = {
  //     method: "DELETE",
  //     redirect: "follow",
  //   };

  //   try {
  //     const response = await fetch(
  //       `${LOGIN_API}/admin/teammember/${_id}`,
  //       requestOptions
  //     );
  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status} - ${response.statusText}`);
  //     }
  //     const result = await response.json();
  //     console.log(result);
  //     toast.success("Team Member deleted successfully!");
  //     // fetchData();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("An error occurred while deleting the member");
  //   }
  // };

  const handleTeamMemberDelete = async (_id) => {
    console.log(_id);
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this account ?"
    );
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      try {
        // Delete the team member
        const response = await fetch(
          `${LOGIN_API}/admin/teammember/${_id}`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result);

        // Assuming the result contains a `userid`
        const userId = result.teamMember?.userid;
        if (userId) {
          // Delete the associated user
          const deleteUserResponse = await fetch(
            `${LOGIN_API}/common/user/${userId}`,
            requestOptions
          );

          if (!deleteUserResponse.ok) {
            throw new Error(
              `Error: ${deleteUserResponse.status} - ${deleteUserResponse.statusText}`
            );
          }

          const deleteUserResult = await deleteUserResponse.text();
          console.log(deleteUserResult); // Logs the result of the user deletion

          toast.success(
            "Team member and associated user deleted successfully!"
          );
          fetchData();
        } else {
          toast.error("No associated user found for this team member.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting the team member or user");
      }
    }
  };

  const handleDeleteMember = async (_id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to deactivate this account ?"
    );
    if (isConfirmed) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        active: false,
      });

      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${LOGIN_API}/admin/teammember/${_id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          console.log(_id);

          getTeamMenberUser(_id);
          fetchData();
        })
        .catch((error) => console.error(error));
    }
  };
  const getTeamMenberUser = async (id) => {
    // /teammember
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,

      redirect: "follow",
    };

    fetch(`${LOGIN_API}/admin/teammember/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        console.log(result.teamMember.userid);
        HandleUserDeactivate(result.teamMember.userid);
      })
      .catch((error) => console.error(error));
  };
  const HandleUserDeactivate = async (userid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      active: false,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(userid);
    fetch(`${LOGIN_API}/common/user/${userid}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Team Member Deactivated Successfully");
      })
      .catch((error) => console.error(error));
  };
  const handleEdit = async (_id) => {
    setGetId(_id);
    console.log("Edit action triggered for template id: ", tempIdget);
    setOpenMenuId(false);
    const response = await fetch(`${LOGIN_API}/admin/teammember/` + tempIdget);
    if (!response.ok) {
      throw new Error("Failed to fetch  data");
    }
    const data = await response.json();
    console.log(data);
    setFirstName(data.teamMember.firstName);
    setMiddleName(data.teamMember.middleName);
    setLastName(data.teamMember.lastName);
    setEMail(data.teamMember.email);
    setSelectedOption(data.teamMember.role);

    setIsCheckedPayments(data.teamMember.managePayments);
    setIsCheckedPipelines(data.teamMember.managePipelines);
    setIsCheckedTimeEntries(data.teamMember.manageTimeEntries);
    setIsCheckedAccounts(data.teamMember.manageAccounts);
    setIsCheckedTags(data.teamMember.manageTags);
    setIsCheckedOrganizers(data.teamMember.manageOrganizers);
    setIsCheckedFirmBalance(data.teamMember.chargeFirmBalance);

    setIsCheckedContacts(data.teamMember.manageContacts);
    setIsCheckedSite(data.teamMember.manageSites);

    setIsCheckedServices(data.teamMember.manageServices);
    setIsCheckedFilterTemplates(data.teamMember.managePublicFilterTemplates);
    setIsCheckedTemplates(data.teamMember.manageTemplates);

    setIsCheckedMarketplace(data.teamMember.manageMarketPlace);
    setIsCheckedInvoices(data.teamMember.manageInvoices);

    setIsCheckedJobRecurrences(data.teamMember.manageJobRecurrence);
    setIsCheckedRatesTimeEntries(data.teamMember.manageRatesinTimeEntries);
    setIsCheckedAllAccounts(data.teamMember.viewallAccounts);
    setIsCheckedCustomFields(data.teamMember.manageCustomFields);
    setIsCheckedAllContacts(data.teamMember.viewAllContacts);

    setIsCheckedTeammates(data.teamMember.assignTeamMates);
    setIsCheckedProposals(data.teamMember.manageProposals);
    setIsCheckedViewReporting(data.teamMember.viewReporting);
    setIsCheckedEmail(data.teamMember.manageEmails);
    setIsCheckedTranscripts(data.teamMember.manageIRSTranscripts);
    setIsCheckedOrgnizerAnswers(data.teamMember.editOrganizersAnswers);
    setIsCheckedDocuments(data.teamMember.manageDocuments);
  };

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

  const [selectedOption, setSelectedOption] = useState("");

  const options = [
    { value: "employee", label: "Employee" },
    { value: "admin", label: "Admin" },
  ];

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEMail] = useState("");
  const handleFirstName = (e) => setFirstName(e.target.value);

  const handleMiddleName = (event) => {
    setMiddleName(event.target.value);
  };
  const handleLastName = (event) => {
    setLastName(event.target.value);
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
      const result = await response.text();
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
    console.log(enteredEmail);
    setEMail(enteredEmail);
    // Check if email exists
    const exists = await checkEmailExists(enteredEmail);
    setEmailValidation(exists ? "Email already exists" : "");
  };

  const [firstNameValidation, setFirstNameValidation] = useState("");
  const [lastNameValidation, setLastNameValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");

  // Access rights arrays for rendering
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

  // Function to check if email exists
  // const newUser = () => {
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   const raw = JSON.stringify({
  //     username: firstName,
  //     email: email,
  //     role: "TeamMember",
  //     password: firstName,
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };
  //   const url = `${LOGIN_API}/common/login/signup/`;
  //   fetch(url, requestOptions)
  //     .then((response) => response.text())

  //     .then((result) => {
  //       console.log(result);
  //       toast.success("Team Member Updated Successfully");
  //       handleNewDrawerClose();
  //       // sendmail();
  //     })

  //     .catch((error) => console.error(error));
  // };
  //for bydefault showing login data
  //     const { logindata } = useContext(LoginContext);
  //     console.log(logindata)
  //     console.log(logindata.user.id);
  //     const [userData, setUserData] = useState([]);
  //     const fetchuserData = async () => {
  //         try {
  //           const url = `http://127.0.0.1:8880/common/user/userlist/list/${logindata.user.id}`;
  //           const response = await fetch(url);
  //           const data = await response.json();
  //           setUserData(data);
  //         } catch (error) {
  //           console.error("Error fetching data:", error);
  //         }
  //       };

  //       useEffect(() => {
  //         fetchuserData();
  //       }, []);
  // console.log(userData)

  const sendmail = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // const port = window.location.port;
    const raw = JSON.stringify({
      email: email,
      // owneremail: logindata.user.id,
      // url: "http://localhost:3000/activate/",
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
        toast.success("Team Member Update successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while submitting the form", error);
      });
  };

  const handleUpdateTeamMember = () => {
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
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/admin/teammember/${tempIdget}`;

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          toast.error("Failed to update team member");
        }
        return response.json();
      })
      .then((result) => {
        // console.log(result);
        // console.log(result.teamMember.userid);
        //  toast.success("Team Member Upadted Successfully");
        // // handleNewDrawerClose();
        // // newUser();
        if (result && result.teamMember && result.teamMember.userid) {
          const userId = result.teamMember.userid;
          const updatedUsername =
            `${firstName} ${middleName ? middleName + " " : ""}${lastName}`.trim();

          // Call function to update the username
          updateUserUsername(userId, updatedUsername);
        }
      })

      .catch((error) => console.error(error));
  };
  const updateUserUsername = (userId, username) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ username });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/common/user/${userId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update username");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Username updated:", result);
        toast.success("Team member updated successfully");
        handleNewDrawerClose();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update username");
      });
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // const columns = useMemo(
  //   () => [
  //     {
  //       accessorKey: "FirstName",
  //       header: "Name",
  //       Cell: ({ row }) => {
  //         const firstName = row.original?.FirstName;
  //         const middleName = row.original?.MiddleName;
  //         const lastName = row.original?.LastName;
  //         const initials = `${firstName ? firstName[0] : ""}${lastName ? lastName[0] : ""}`;

  //         const isLoggedInUser = row.index === 0;
  //         // Route to Account Settings for first row, Team Member Update for others
  //         const linkPath = isLoggedInUser
  //           ? `/settings/myaccount`
  //           : `/updateteammember/${row.original?.id}`;
  //         return (
  //           <div>
  //             <div className="circle">{initials}</div>
  //             <Link
  //               to={linkPath}
  //             >{`${firstName ? firstName : ""}  ${middleName ? middleName : ""} ${lastName ? lastName : ""}`}</Link>
  //             {/* <Link to={`/updateteammember/${row.original?.id}`}>{`${firstName ? firstName : ""}  ${middleName ? middleName : ""} ${lastName ? lastName : ""}`}</Link>{" "} */}
  //           </div>
  //         );
  //       },
  //     },
  //     { accessorKey: "Email", header: "Email" },
  //     { accessorKey: "Role", header: "Role" },
  //     {
  //       accessorKey: "Created",
  //       header: "Created",
  //       Cell: ({ cell }) => {
  //         const dateValue = cell.getValue();
  //         const date = new Date(dateValue);

  //         if (isNaN(date)) {
  //           return "Invalid Date";
  //         }

  //         return date
  //           .toLocaleDateString("en-US", {
  //             year: "numeric",
  //             month: "short",
  //             day: "2-digit",
  //           })
  //           .replace(",", "");
  //       },
  //     },
  //     {
  //       accessorKey: "has2FA",
  //       header: "2FA",
  //       Cell: ({ value }) => (value ? "Enabled" : "Disabled"),
  //     },
  //     {
  //       accessorKey: "Actions",
  //       header: "Actions",
  //       Cell: ({ row }) => (
  //         <IconButton
  //           onClick={() => toggleMenu(row.original.id)}
  //           style={{ color: "#2c59fa", position: "relative" }} // Added position relative for proper positioning
  //         >
  //           <CiMenuKebab style={{ fontSize: "25px" }} />
  //           {openMenuId === row.original.id && (
  //             <Box
  //               sx={{
  //                 position: "absolute",
  //                 zIndex: 10, // Ensure it's on top of other elements
  //                 backgroundColor: "#fff",
  //                 boxShadow: 1,
  //                 borderRadius: 1,
  //                 p: 1,
  //                 left: "30px",
  //                 m: 2,
  //               }}
  //             >
  //               <Typography
  //                 sx={{ fontSize: "12px", fontWeight: "bold" }}
  //                 onClick={() => {
  //                   handleEdit(row.original._id);
  //                   handleUpdateDrawerOpen();
  //                 }}
  //               >
  //                 Edit
  //               </Typography>
  //               <Typography
  //                 sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }}
  //                 onClick={() => handleDeleteMember(row.original.id)}
  //               >
  //                 Deactivate
  //               </Typography>
  //               <Typography
  //                 sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }}
  //                 onClick={() => handleTeamMemberDelete(row.original.id)}
  //               >
  //                 Delete
  //               </Typography>
  //             </Box>
  //           )}
  //         </IconButton>
  //       ),
  //     },
  //   ],
  //   [openMenuId]
  // );

  const totalPages = Math.ceil(teamMembers.length / rowsPerPage);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        <span className="text-sm text-slate-500">Loading members...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Created</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">2FA</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((member, index) => {
                  const fName = member?.FirstName || "";
                  const mName = member?.MiddleName || "";
                  const lName = member?.LastName || "";
                  const initials = `${fName ? fName[0] : ""}${lName ? lName[0] : ""}`;
                  const isLoggedInUser = index === 0;
                  const linkPath = isLoggedInUser ? `/settings/myaccount` : `/updateteammember/${member?.id}`;
                  const formattedDate = new Date(member.Created);
                  const displayDate = isNaN(formattedDate)
                    ? "Invalid Date"
                    : formattedDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }).replace(",", "");

                  return (
                    <tr key={member.id} className={`transition-colors hover:bg-indigo-50/40 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 shrink-0">
                            {initials}
                          </div>
                          <Link to={linkPath} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                            {`${fName} ${mName} ${lName}`.trim()}
                          </Link>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{member.Email}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 capitalize">{member.Role}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{displayDate}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${member.has2FA ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {member.has2FA ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="relative inline-block" ref={openMenuId === member.id ? menuRef : null}>
                          <button onClick={() => toggleMenu(member.id)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {openMenuId === member.id && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-in fade-in slide-in-from-top-1">
                              <button onClick={() => { handleEdit(member._id); handleUpdateDrawerOpen(); }} className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Edit</button>
                              <button onClick={() => handleDeleteMember(member.id)} className="flex w-full items-center px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors">Deactivate</button>
                              <button onClick={() => handleTeamMemberDelete(member.id)} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              {teamMembers.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">No active members found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Rows per page:</span>
            <select value={rowsPerPage} onChange={handleChangeRowsPerPage} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {[30, 40, 50, 60, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="ml-2">{page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, teamMembers.length)} of {teamMembers.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={(e) => handleChangePage(e, page - 1)} disabled={page === 0} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={(e) => handleChangePage(e, page + 1)} disabled={page >= totalPages - 1} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Update Team Member Drawer */}
      {isUpdateDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleNewDrawerClose} />
          <div className="relative w-full max-w-[650px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Update Team Member — {firstName} {middleName} {lastName}</h2>
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
                  <input type="text" id="firstname" name="firstname" placeholder="First name" value={firstName} onChange={handleFirstName} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow" />
                  {firstNameValidation && <p className="mt-1 text-xs text-red-500">{firstNameValidation}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Middle Name</label>
                  <input type="text" id="middlename" name="middlename" placeholder="Middle Name" value={middleName} onChange={handleMiddleName} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                  <input type="text" id="lastname" name="lastname" placeholder="Last Name" value={lastName} onChange={handleLastName} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow" />
                  {lastNameValidation && <p className="mt-1 text-xs text-red-500">{lastNameValidation}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={handleEmail} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow" />
                {emailValidation && (
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    {emailValidation}
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow">
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
              <button onClick={handleUpdateTeamMember} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">Save</button>
              <button onClick={handleNewDrawerClose} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ActiveMember;

import React, { useEffect, useState, useMemo, useContext } from "react";
import { LoginContext } from "../Sidebar/Context/Context";
import { Facebook, Linkedin, Twitter, Instagram, PlusCircle, Upload } from "lucide-react";
import Switch from "react-switch";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";
const FirmSetting = () => {
  // const {id} = useParams();
  // console.log(id)
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setSelectedFile(files[0]);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };
  // Helper: reusable switch component for settings
  const SettingsSwitch = ({ checked, onChange, disabled }) => (
    <Switch
      onChange={onChange}
      checked={checked}
      onColor="#4f46e5"
      onHandleColor="#FFF"
      handleDiameter={10}
      uncheckedIcon={false}
      checkedIcon={false}
      height={20}
      width={32}
      disabled={disabled}
      className="react-switch"
    />
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const handleSwitchChange = (event) => {
    setShowDatePicker(event.target.checked);
  };
  const [supportlogin, setSupportLogin] = useState(false);
  const [selectedLogInDate, setSelectedLogInDate] = useState(null);
  const handleSwitchLogInChange = (event) => {
    setSupportLogin(event.target.checked);
  };
  //right side form
  const [isNewChatOpen, setNewChat] = useState(false);
  const handleNewDrawerClose = () => {
    setNewChat(false);
  };
  const [content, setContent] = useState("");
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  //integration
  const [defaultreplytoemails, setDefaultreplytoemails] = useState();
  const [firmName, setFirmName] = useState();
  const [state, setState] = useState();
  // const [firmURL, setFirmURL] = useState();
  const [firmwebsite, setFirmWebsite] = useState();
  const [firmPhoneNumber, setFirmPhoneNumber] = useState();
  const [defaultlanguage, setDefaultlanguage] = useState();

  const languages = [
    { value: "English(British)", label: "English(British)" },
    { value: "Deutsch", label: "Deutsch" },
    { value: "Ztaliano", label: "Ztaliano" },
    { value: "Nederlands", label: "Nederlands" },
    { value: "suomi", label: "suomi" },
    { value: "Dansk", label: "Dansk" },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const language = selectedLanguage;
  console.log(language);
  const handleLanguageChange = (selectedLanguage) => {
    setSelectedLanguage(selectedLanguage);
  };

  const { logindata } = useContext(LoginContext);
  const [adminUserData, setAdminUserData] = useState();
  console.log(logindata);
  useEffect(() => {
    getFirmSettingsByAdminUserId();
    setAdminUserData(logindata.user.id);
  }, []);
  console.log(adminUserData);
  const [firmSettingId, setFirmSettingsId] = useState();
  console.log(firmSettingId);
  const [AssigneesNew, setAssigneesNew] = useState([]);
  const getFirmSettingsByAdminUserId = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/Firmsettingbyuserid/${logindata.user.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.length > 0) {
          setFirmSettingsId(result[0]._id);
          setDefaultreplytoemails(result[0].defaultreplytoemails);
          setFirmName(result[0].firmName);
          setFirmEmail(result[0].firmEmail);
          setAddress(result[0].streetAddress);
          setFirmWebsite(result[0].firmwebsite);
          setFirmPhoneNumber(result[0].firmPhoneNumber);
          setDefaultlanguage(result[0].defaultlanguage);
          setCity(result[0].city);
          setZipCode(result[0].postalCode);
          const stateMatch = states.find((state) => state.name === result[0].state);
          setSelectedState(stateMatch ? { label: stateMatch.name } : null);
          setDescription(result[0].aboutusDescription);
          setShowfirmownerphototologin(result[0].showfirmownerphototologin);
          setDomainName(result[0].domainname);
          setRequire2FAforallteam(result[0].require2FAforallteam);
          setAllowclienttocreatenewchat(result[0].allowclienttocreatenewchat);
          setFacebooklink(result[0].facebooklink);
          setLinkedinlink(result[0].linkedinlink);
          setXlink(result[0].xlink);
          setInstagramlink(result[0].instagramlink);
          setSelectedFormat(result[0].contactnameformat);
          setApplytoallcontacts(result[0].applytoallcontacts);
          setSelectedSignatures(result[0].defaultdateformatforesign);
          setShowKBAverification(result[0].showKBAverification);
          setShowQESAdESverification(result[0].showQESAdESverification);
          setAllowsupportteamsetuplanding(result[0].allowsupportteamsetuplanding);
          setAllowsupportteamsetuplandingdate(result[0].allowsupportteamsetuplandingdate ? dayjs(result[0].allowsupportteamsetuplandingdate) : null);
          setAllowsupportteamownerlikepermission(result[0].allowsupportteamownerlikepermission);
          setAllowsupportteamownerlikepermissiondate(result[0].allowsupportteamownerlikepermissiondate ? dayjs(result[0].allowsupportteamownerlikepermissiondate) : null);
          setShowfirmcontactdetails(result[0].showfirmcontactdetails);
          setShowsocialnetworklinks(result[0].showsocialnetworklinks);
          setshowfirmlogo(result[0].showfirmlogo);
          setshowmesscontextinternalnotification(result[0].showmesscontextinternalnotification);
          setshowmesscontextclientfacingnotification(result[0].showmesscontextclientfacingnotification);
          setEmailfirmmembercansend(result[0].emailfirmmembercansend);

          setshowdoneuploadingbutton(result[0].showdoneuploadingbutton);
          setshowdoneuploadingcheckbox(result[0].showdoneuploadingcheckbox);

          // Format and set giveaccountaccessteammembers
          const accountAccessMembers = result[0].giveaccountaccessteammembers.map((user) => ({
            value: user.id,
            label: `${user.username}`,
          }));
          setSelectedUser(accountAccessMembers);

          const selectedValues = accountAccessMembers.map((option) => option.value);
          setCombinedValues(selectedValues);
          console.log(selectedValues);
        }
      })
      .catch((error) => console.error("Error fetching firm settings:", error));
  };
  // const [firmemail, setFirmemail] = useState()
  const [firmEmail, setFirmEmail] = useState();
  const [address, setAddress] = useState();
  const [City, setCity] = useState();
  const [zipCode, setZipCode] = useState();

  //patch for  contact details
  const Contactdetails = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      firmName: firmName,
      state: selectedState.label,
      firmPhoneNumber: firmPhoneNumber,
      defaultreplytoemails: defaultreplytoemails,
      // firmURL: firmURL,
      firmwebsite: firmwebsite,
      firmEmail: firmEmail,
      streetAddress: address,
      city: City,
      postalCode: zipCode,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);

        // Show success toast
        toast.success("Firm settings updated successfully!");
        getFirmSettingsByAdminUserId();
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  //PATCH for About Us
  const [discription, setDescription] = useState();
  const [showfirmownerphototologin, setShowfirmownerphototologin] = useState(false);
  const handleAboutusCheckbox = (checked) => {
    setShowfirmownerphototologin(checked);
  };
  const AboutUs = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      aboutusDescription: discription,
      showfirmownerphototologin: showfirmownerphototologin,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  //PATCH for Custom domain URL
  const [domainname, setDomainName] = useState();
  const CustomDomain = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      domainname: domainname,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  //PATCH for Two-factor authentication (2FA)
  const [require2FAforallteam, setRequire2FAforallteam] = useState(false);
  const handlefor2FA = (checked) => {
    setRequire2FAforallteam(checked);
  };

  const TwoFactorAuthentication = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      require2FAforallteam: require2FAforallteam,
      emailaddressfor2FA: defaultreplytoemails,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  //PATCH for Chats
  const [allowclienttocreatenewchat, setAllowclienttocreatenewchat] = useState(false);
  const handlechat = (checked) => {
    setAllowclienttocreatenewchat(checked);
  };

  const chat = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      allowclienttocreatenewchat: allowclienttocreatenewchat,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}//adminfirmfirmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for Social media links
  const [facebooklink, setFacebooklink] = useState();
  const [linkedinlink, setLinkedinlink] = useState();
  const [xlink, setXlink] = useState();
  const [instagramlink, setInstagramlink] = useState();

  const SocialMediaLinks = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      facebooklink: facebooklink,
      linkedinlink: linkedinlink,
      xlink: xlink,
      instagramlink: instagramlink,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for International settings
  const InternationalSettings = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      defaultlanguage: defaultlanguage,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for Contact name formatting
  const contactNameOptions = ["[Last name], [First name]", "[First name] [Last name]", "[Last name] [First name]", "[First name] [Middle name] [Last name]"];

  const [selectedFormat, setSelectedFormat] = useState("[First name] [Middle name] [Last name]");
  const [applytoallcontacts, setApplytoallcontacts] = useState(false);

  const handleapplytoallcontacts = (checked) => {
    setApplytoallcontacts(checked);
  };

  const ContactNameFormatting = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      contactnameformat: selectedFormat,
      applytoallcontacts: applytoallcontacts,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for Signatures

  const SignaturesOptions = ["MM.DD.YYYY", "DD-MM-YYYY", "DD/MM/YYYY", "DD.MM.YYYY", "YYYY/MM/DD", "YYYY/DD/MM"];

  const [selectedSignatures, setSelectedSignatures] = useState("MM.DD.YYYY");
  const [showKBAverification, setShowKBAverification] = useState(false);
  const [showQESAdESverification, setShowQESAdESverification] = useState(false);

  const handleshowQESAdESverification = (checked) => {
    setShowQESAdESverification(checked);
  };

  const handleshowKBAverification = (checked) => {
    setShowKBAverification(checked);
  };

  const Signatures = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      defaultdateformatforesign: selectedSignatures,
      showKBAverification: showKBAverification,
      showQESAdESverification: showQESAdESverification,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for Editor access
  const [allowsupportteamsetuplanding, setAllowsupportteamsetuplanding] = useState(false);
  const [allowsupportteamsetuplandingdate, setAllowsupportteamsetuplandingdate] = useState(null);
  const [allowsupportteamownerlikepermission, setAllowsupportteamownerlikepermission] = useState(false);
  const [allowsupportteamownerlikepermissiondate, setAllowsupportteamownerlikepermissiondate] = useState(null);

  const handleallowsupportteamsetuplanding = (checked) => {
    setAllowsupportteamsetuplanding(checked);
  };

  const handleallowsupportteamownerlikepermission = (checked) => {
    setAllowsupportteamownerlikepermission(checked);
  };

  const EditorAccess = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      allowsupportteamsetuplanding: allowsupportteamsetuplanding,
      allowsupportteamsetuplandingdate: allowsupportteamsetuplandingdate,
      allowsupportteamownerlikepermission: allowsupportteamownerlikepermission,
      allowsupportteamownerlikepermissiondate: allowsupportteamownerlikepermissiondate,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for System-generated emails
  const [showfirmcontactdetails, setShowfirmcontactdetails] = useState(false);

  const [showsocialnetworklinks, setShowsocialnetworklinks] = useState(false);

  const [showfirmlogo, setshowfirmlogo] = useState(false);

  const [showmesscontextinternalnotification, setshowmesscontextinternalnotification] = useState(false);

  const [showmesscontextclientfacingnotification, setshowmesscontextclientfacingnotification] = useState(false);

  const handleshowfirmcontactdetails = (checked) => {
    setShowfirmcontactdetails(checked);
  };

  const handleshowsocialnetworklinks = (checked) => {
    setShowsocialnetworklinks(checked);
  };

  const handleshowfirmlogo = (checked) => {
    setshowfirmlogo(checked);
  };

  const handleshowmesscontextclientfacingnotification = (checked) => {
    setshowmesscontextclientfacingnotification(checked);
  };

  const handleshowmesscontextinternalnotification = (checked) => {
    setshowmesscontextinternalnotification(checked);
  };

  const SystemGeneratedEmails = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      showfirmcontactdetails: showfirmcontactdetails,
      showsocialnetworklinks: showsocialnetworklinks,
      showfirmlogo: showfirmlogo,
      showmesscontextinternalnotification: showmesscontextinternalnotification,
      showmesscontextclientfacingnotification: showmesscontextclientfacingnotification,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for Sending limit

  const [emailfirmmembercansend, setEmailfirmmembercansend] = useState(400);

  const SendingLimit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      emailfirmmembercansend: emailfirmmembercansend,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///PATCH for Client portal settings
  const [showdoneuploadingbutton, setshowdoneuploadingbutton] = useState(false);

  const [showdoneuploadingcheckbox, setshowdoneuploadingcheckbox] = useState(false);

  const handleshowdoneuploadingbutton = (checked) => {
    setshowdoneuploadingbutton(checked);
  };

  const handleshowdoneuploadingcheckbox = (checked) => {
    setshowdoneuploadingcheckbox(checked);
  };

  const ClientPortalSettingst = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      showdoneuploadingbutton: showdoneuploadingbutton,
      showdoneuploadingcheckbox: showdoneuploadingcheckbox,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  ///for team member
  const Fetchteammember = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/common/users/roles?roles=TeamMember`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUserData(result);
        console.log("Fetched Team Member Data:", result);
      })
      .catch((error) => {
        console.error("Error fetching team member data:", error);
      });
  };

  // console.log(combinedValues)
  useEffect(() => {
    Fetchteammember();
  }, []);
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);

  const options = userData.map((user) => ({
    value: user._id,
    label: `${user.username} `,
    // label:user.FirstName
  }));

  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
  };
  console.log(combinedValues);

  //PATCH for teammember
  const teammember = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      giveaccountaccessteammembers: combinedValues,
    });

    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/adminfirm/firmsetting/${firmSettingId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // Show success toast
        toast.success("Firm settings updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        // Show error toast
        toast.error("Error updating firm settings!");
      });
  };

  //states
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);

  // useEffect(() => {
  //     const fetchAllStates = async () => {
  //         try {
  //             const response = await axios.get("https://countriesnow.space/api/v0.1/countries/states");
  //             console.log(response.data);  // Log the response to see its structure
  //             const allStates = response.data.data.flatMap(country => country.states);
  //             setStates(allStates);
  //         } catch (error) {
  //             console.error("Error fetching state data:", error);
  //         }
  //     };

  //     fetchAllStates();
  // }, []);

  useEffect(() => {
    const fetchAllStates = async () => {
      try {
        const response = await axios.get("https://countriesnow.space/api/v0.1/countries/states");
        console.log(response.data); // Log the response to see its structure
        const allStates = response.data.data.flatMap((country) => country.states);
        setStates(allStates);

        // if (state) { // Make sure the firm state is available
        //     const matchingState = allStates.find((s) => s.name === state); // match with firm state
        //     if (matchingState) {
        //         setSelectedState({ label: matchingState.name }); // set default state
        //     }
        // }
      } catch (error) {
        console.error("Error fetching state data:", error);
      }
    };

    fetchAllStates();
  }, [state]);

  // Reusable card wrapper
  const SettingsCard = ({ title, children }) => (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-3.5">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );

  const SaveBtn = ({ onClick }) => (
    <button onClick={onClick} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
      Save
    </button>
  );

  const InputField = ({ label, value, onChange, placeholder, type = "text", endAdornment, icon: Icon, iconColor }) => (
    <div>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="h-4 w-4" style={{ color: iconColor || '#6b7280' }} />
          </div>
        )}
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white ${Icon ? 'pl-10' : 'px-3'} ${endAdornment ? 'pr-12' : 'px-3'} py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow`}
        />
        {endAdornment && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{endAdornment}</span>
        )}
      </div>
    </div>
  );

  const SwitchRow = ({ checked, onChange, label, disabled }) => (
    <div className="flex items-center gap-3 py-1.5">
      <SettingsSwitch checked={checked || false} onChange={onChange} disabled={disabled} />
      <span className="text-sm text-slate-700">{label}</span>
    </div>
  );

  const CheckboxRow = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-2.5 cursor-pointer py-1">
      <input type="checkbox" checked={checked || false} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition" />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Firm Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Contact Details */}
          <SettingsCard title="Contact details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Firm Name" value={firmName} onChange={(e) => setFirmName(e.target.value)} placeholder="Enter Your Firm Name" />
              <InputField label="Firm Email" value={firmEmail} onChange={(e) => setFirmEmail(e.target.value)} placeholder="Enter Your Firm Email" />
            </div>
            <InputField label="Street address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField label="City" value={City} onChange={(e) => setCity(e.target.value)} placeholder="City" />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                <select
                  value={selectedState?.label || ""}
                  onChange={(e) => {
                    const match = states.find((s) => s.name === e.target.value);
                    setSelectedState(match ? { label: match.name } : null);
                  }}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <InputField label="Zip/Postal code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Zip/Postal code" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Firm phone number" value={firmPhoneNumber} onChange={(e) => setFirmPhoneNumber(e.target.value)} placeholder="Enter Your Firm phone number" />
              <InputField label="Firm Website" value={firmwebsite} onChange={(e) => setFirmWebsite(e.target.value)} placeholder="Firm Website" />
            </div>
            <InputField label="Default reply-to address for system emails" value={defaultreplytoemails} onChange={(e) => setDefaultreplytoemails(e.target.value)} placeholder="Default reply-to address for system emails" />
            <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
              <span className="text-xs text-slate-600 flex-1">Receive copies (BCC) of system emails sent to clients. These emails include requests and reminders to fill out forms, upload documents, and complete other pending actions.</span>
              <SettingsSwitch checked={false} onChange={() => {}} />
            </div>
            <SaveBtn onClick={Contactdetails} />
          </SettingsCard>

          {/* About Us */}
          <SettingsCard title="About us">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                value={discription || ""}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
              />
            </div>
            <CheckboxRow checked={showfirmownerphototologin} onChange={handleAboutusCheckbox} label="Show firm owner photo on the login page" />
            <SaveBtn onClick={AboutUs} />
          </SettingsCard>

          {/* Firm Portal URL */}
          <SettingsCard title="Firm portal URL">
            <p className="text-sm text-slate-600">Your firm's TaxDome portal URL:</p>
            <p className="text-sm font-medium text-indigo-600">https://anuja.taxdome.com/</p>
            <p className="text-xs text-slate-500">To modify this address, please contact support.</p>
          </SettingsCard>

          {/* Custom Domain */}
          <SettingsCard title="Custom domain">
            <p className="text-sm text-slate-600">
              You can white-label your TaxDome portal with your own domain name (for example, anuja.com instead of anuja.taxdome.com). Before adding your domain name, please see <span className="text-indigo-600 cursor-pointer hover:underline">how to configure DNS</span>.
            </p>
            <InputField label="Domain name" value={domainname} onChange={(e) => setDomainName(e.target.value)} placeholder="Domain name" />
            <button onClick={CustomDomain} className="rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors">
              Link Custom Domain
            </button>
          </SettingsCard>

          {/* Two-factor Authentication */}
          <SettingsCard title="Two-factor authentication (2FA)">
            <InputField label="Email address to receive manual 2FA disable requests" value={defaultreplytoemails} onChange={(e) => setDefaultreplytoemails(e.target.value)} placeholder="Email address" />
            <CheckboxRow checked={require2FAforallteam} onChange={handlefor2FA} label="Require 2FA for all team members" />
            <p className="text-xs text-slate-500 ml-6">2FA will be turned on for team members at next login.</p>
            <SaveBtn onClick={TwoFactorAuthentication} />
          </SettingsCard>

          {/* Chats */}
          <SettingsCard title="Chats">
            <p className="text-sm text-slate-600">Chats are a secure way to communicate and exchange documents with your clients. You can allow clients to start new chats, or have them only respond to messages sent by your firm.</p>
            <SwitchRow checked={allowclienttocreatenewchat} onChange={handlechat} label="Allow clients to create new chat threads" />
            <SaveBtn onClick={chat} />
          </SettingsCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Social Media Links */}
          <SettingsCard title="Social media links">
            <InputField label="Facebook" value={facebooklink} onChange={(e) => setFacebooklink(e.target.value)} placeholder="Facebook URL" icon={Facebook} iconColor="#1877f2" />
            <InputField label="LinkedIn" value={linkedinlink} onChange={(e) => setLinkedinlink(e.target.value)} placeholder="LinkedIn URL" icon={Linkedin} iconColor="#0077b5" />
            <InputField label="X" value={xlink} onChange={(e) => setXlink(e.target.value)} placeholder="X URL" icon={Twitter} iconColor="#000" />
            <InputField label="Instagram" value={instagramlink} onChange={(e) => setInstagramlink(e.target.value)} placeholder="Instagram URL" icon={Instagram} iconColor="#da2b79" />
            <SaveBtn onClick={SocialMediaLinks} />
          </SettingsCard>

          {/* Logo Upload */}
          <SettingsCard title="Logo upload">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 gap-3 transition-colors hover:border-indigo-400 hover:bg-indigo-50/30"
            >
              <Upload className="h-8 w-8 text-slate-400" />
              <p className="text-sm text-slate-500">Drag & Drop file here</p>
              <button onClick={handleButtonClick} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
                Browse Files
              </button>
              <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} />
              {selectedFile && <p className="mt-2 text-xs text-slate-600 break-all">Selected file: {selectedFile.name}</p>}
            </div>
          </SettingsCard>

          {/* International Settings */}
          <SettingsCard title="International settings">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Default language</label>
              <select
                value={selectedLanguage?.value || ""}
                onChange={(e) => {
                  const lang = languages.find(l => l.value === e.target.value);
                  handleLanguageChange(lang);
                }}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
            <InputField label="Time Zone" placeholder="Time Zone" />
            <SaveBtn onClick={InternationalSettings} />
          </SettingsCard>

          {/* Contact Name Formatting */}
          <SettingsCard title="Contact name formatting">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">The next generated contact name will have the following format</label>
              <select
                value={selectedFormat || ""}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              >
                {contactNameOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <CheckboxRow checked={applytoallcontacts} onChange={handleapplytoallcontacts} label="Apply to all Contacts" />
            <SaveBtn onClick={ContactNameFormatting} />
          </SettingsCard>

          {/* Signatures */}
          <SettingsCard title="Signatures">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Default date format for e-signature</label>
              <select
                value={selectedSignatures || ""}
                onChange={(e) => setSelectedSignatures(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              >
                {SignaturesOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <SwitchRow checked={showKBAverification} onChange={handleshowKBAverification} label="Show KBA verification as option" />
            <SwitchRow checked={showQESAdESverification} onChange={handleshowQESAdESverification} label="Show QES/AdES verification as option" />
            <SaveBtn onClick={Signatures} />
          </SettingsCard>

          {/* Default Account Access */}
          <SettingsCard title="Default account access">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Team Members</label>
              <select
                multiple
                value={combinedValues}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                  setCombinedValues(selected);
                  const selectedOpts = options.filter(o => selected.includes(o.value));
                  setSelectedUser(selectedOpts);
                }}
                className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {selectedUser.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedUser.map((u) => (
                    <span key={u.value} className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">{u.label}</span>
                  ))}
                </div>
              )}
            </div>
            <SaveBtn onClick={teammember} />
          </SettingsCard>

          {/* Editor Access */}
          <SettingsCard title="Editor access">
            <div className="space-y-3">
              <SwitchRow checked={allowsupportteamsetuplanding} onChange={handleallowsupportteamsetuplanding} label="Allow the support team to set up landing" />
              {allowsupportteamsetuplanding && (
                <div className="ml-11">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Until</label>
                  <input
                    type="date"
                    value={allowsupportteamsetuplandingdate ? dayjs(allowsupportteamsetuplandingdate).format("YYYY-MM-DD") : ""}
                    onChange={(e) => setAllowsupportteamsetuplandingdate(e.target.value ? dayjs(e.target.value) : null)}
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  />
                </div>
              )}
              <SwitchRow checked={allowsupportteamownerlikepermission} onChange={handleallowsupportteamownerlikepermission} label="Allow the support team to log in with owner-like permissions" />
              {allowsupportteamownerlikepermission && (
                <div className="ml-11">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Until</label>
                  <input
                    type="date"
                    value={allowsupportteamownerlikepermissiondate ? dayjs(allowsupportteamownerlikepermissiondate).format("YYYY-MM-DD") : ""}
                    onChange={(e) => setAllowsupportteamownerlikepermissiondate(e.target.value ? dayjs(e.target.value) : null)}
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  />
                </div>
              )}
            </div>
            <SaveBtn onClick={EditorAccess} />
          </SettingsCard>

          {/* Default Folder Template */}
          <SettingsCard title="Default folder template">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Folder Templates</label>
              <select multiple className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow">
                {/* Add folder template options here */}
              </select>
            </div>
            <SaveBtn />
          </SettingsCard>

          {/* System-generated Emails */}
          <SettingsCard title="System-generated emails">
            <SwitchRow checked={showfirmcontactdetails} onChange={handleshowfirmcontactdetails} label="Show firm contact details" />
            <SwitchRow checked={showsocialnetworklinks} onChange={handleshowsocialnetworklinks} label="Show social network links" />
            <SwitchRow checked={showfirmlogo} onChange={handleshowfirmlogo} label="Show firm logo" />
            <SwitchRow checked={showmesscontextinternalnotification} onChange={handleshowmesscontextinternalnotification} label="Show firm message context in internal notifications" />
            <SwitchRow checked={showmesscontextclientfacingnotification} onChange={handleshowmesscontextclientfacingnotification} label="Show firm message context in client facing notifications" />
            <SaveBtn onClick={SystemGeneratedEmails} />
          </SettingsCard>

          {/* Sending Limit */}
          <SettingsCard title="Sending limit">
            <InputField label="Emails each firm member can send (max 10,000)" value={emailfirmmembercansend} onChange={(e) => setEmailfirmmembercansend(e.target.value)} placeholder="400" endAdornment="per day" />
            <SaveBtn onClick={SendingLimit} />
          </SettingsCard>

          {/* Client Portal Settings */}
          <SettingsCard title="Client portal settings">
            <SwitchRow checked={showdoneuploadingbutton} onChange={handleshowdoneuploadingbutton} label="Show 'Done uploading' button in interface" />
            <SwitchRow checked={showdoneuploadingcheckbox} onChange={handleshowdoneuploadingcheckbox} label="Show 'Done uploading' checkbox in document upload menu" />
            <SaveBtn onClick={ClientPortalSettingst} />
          </SettingsCard>

          {/* Client Portal Announcement */}
          <SettingsCard title="Client portal announcement">
            <p className="text-sm text-slate-600">Announcement is visible in the client portal and mobile app upon login.</p>
            <button onClick={() => setNewChat(true)} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
              <PlusCircle className="h-4 w-4" />
              Create announcement
            </button>
            <SaveBtn />
          </SettingsCard>
        </div>
      </div>
    </div>
  );
};

export default FirmSetting;

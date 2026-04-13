import React, { useState, useRef, useEffect, useContext } from "react";
import "./myaccount.css";
import { Eye, EyeOff, Pencil, X, Upload, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Switch } from "../components/ui/switch";
import user from "../Images/user.jpg";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { LoginContext } from "../Sidebar/Context/Context";
import { gapi } from "gapi-script";
import Cookies from "js-cookie";
import axios from "axios";
import ImageCropper from "./ImageCropper";

const MyAccount = () => {
  const [isActive, setIsActive] = useState(true);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [showSaveButtons, setShowSaveButtons] = useState(false);
  const [showUpdatePassButton, setShowUpdatePassButton] = useState(false);
  const [newPasShow, setNewPassShow] = useState(false);
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setCPassShow] = useState(false);

  const [userdata, setuserdata] = useState();
  const [admindata, setadmindata] = useState();
  const [isEditable, setIsEditable] = useState(false);
  const [isLoginEditable, setIsLoginEditable] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [signedtime, setSignedTime] = useState("");

  const formatTimePeriod = (seconds) => {
    if (seconds < 3600) {
      return `${Math.ceil(seconds / 60)} minutes`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0
        ? `${hours} hours ${minutes} minutes`
        : `${hours} hours`;
    }
  };

  //******************* */
  // const { logindata } = useContext(LoginContext);
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState();

  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  // Fetch data after loginuserid is set
  useEffect(() => {
    if (loginuserid) {
      fetchData();
    }
  }, [loginuserid]);

  console.log("loginuseriid", loginuserid);
  // const fetchData = async () => {
  //   try {
  //     const url = `${LOGIN_API}/common/user/${loginuserid}`;
  //     console.log("jjj", url);
  //     const response = await fetch(url);
  //     const data = await response.json();

  //     const validTime = logindata.user.exp - logindata.user.iat;
  //     setSignedTime(formatTimePeriod(validTime));

  //     setuserdata(data);
  //     console.log("dta", data);
  //     fetchAdminData(data.email);

  //     fetchNotificationData(loginuserid);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  const [currentImage, setCurrentImage] = useState(null);
  const [preview, setPreview] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const [emailsync, setEmailSync] = useState("");
  useEffect(() => {
    console.log("Email sync updated:", emailsync);
    // updateEmailSync(emailsync)
  }, [emailsync]);
  const fetchData = async () => {
    try {
      const url = `${LOGIN_API}/common/user/${loginuserid}`;
      console.log("jjj", url);
      const response = await fetch(url);
      const data = await response.json();

      const validTime = logindata.user.exp - logindata.user.iat;
      setSignedTime(formatTimePeriod(validTime));

      setuserdata(data);
      console.log("dta", data);
      setCurrentImage(data.profilePicture);
      setEmailSync(data.emailSyncEmail);
      if (data.role === "TeamMember") {
        fetchTeamMemberData(data.email);
      } else {
        fetchAdminData(data.email);
      }

      fetchNotificationData(loginuserid);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // 🔁 Optional: Update email sync to backend when changed
  const updateEmailSync = async (newEmailSyncValue) => {
    try {
      const url = `${LOGIN_API}/common/user/${loginuserid}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailSyncEmail: newEmailSyncValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update email sync");
      }

      console.log("Email sync updated on server");
    } catch (error) {
      console.error("Error updating email sync:", error);
    }
  };
  useEffect(() => {
    if (currentImage) {
      // Replace 'uploads/' with 'profilepicture/' in the path
      const transformedUrl = currentImage.replace(
        "uploads/",
        "profilepicture/"
      );
      setPreview(`${LOGIN_API}/${transformedUrl}`);
      console.log("ghfhgf", `${LOGIN_API}/${transformedUrl}`);
    }
  }, [currentImage]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.warning("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", image);

    try {
      setIsUploading(true);
      const response = await axios.post(
        `${LOGIN_API}/common/${loginuserid}/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Profile picture updated successfully");

      setIsUploading(false);
      fetchData();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.error || "Failed to upload profile picture"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const [username, setUserName] = useState("");
  const fetchAdminData = async (email) => {
    try {
      const url = `${LOGIN_API}/admin/adminsignup/adminbyemail/${email}`;
      console.log("url", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();
      console.log("admin", data);
      setadmindata(data.admin[0]);
      setFirstName(data.admin[0].firstName);
      setMiddleName(data.admin[0].middleName);
      setLastName(data.admin[0].lastName);
      setPhoneNumber(data.admin[0].phoneNumber);
      setEmail(data.admin[0].email);
      setUserName(data.admin[0].firmName);
      console.log(profilePicture);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };
  const fetchTeamMemberData = async (email) => {
    try {
      const url = `${LOGIN_API}/admin/teammember/teammemberbyemail/${email}`;
      console.log("url", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();
      console.log("admin", data);
      setadmindata(data.admin[0]);
      setFirstName(data.admin[0].firstName);
      setMiddleName(data.admin[0].middleName);
      setLastName(data.admin[0].lastName);
      setPhoneNumber(data.admin[0].phoneNumber);
      setEmail(data.admin[0].email);
      setUserName(data.admin[0].firmName);
      console.log(profilePicture);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };
  const handleSaveButtonClick = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      firstName: firstName,
      middleName: middleName,
      lastName: lastname,
      phoneNumber: phonenumber,
    });
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${LOGIN_API}/admin/adminsignup/${admindata._id}`;
    console.log(url);
    console.log(admindata._id);

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.text();
      console.log(result);
      toast.success("Data updated successfully!");
      updateProfilePicture();
      await fetchAdminData();
      setIsEditable(false);
      setShowSaveButtons(false);
    } catch (error) {
      console.error("Error in handleSaveButtonClick:", error);
      toast.error("An error occurred!");
    }
  };

  const handleEditClick = () => {
    // setIsEditable(true);
    setIsEditable((prev) => !prev);
    // setShowSaveButtons(true);
    setShowSaveButtons((prev) => !prev);
  };
  const handleCancelButtonClick = () => {
    setShowSaveButtons(false);
    setIsEditable(false);
  };
  const [showAlert, setShowAlert] = useState(false);

  // Function to toggle the alert box
  const toggleAlert = () => {
    setShowAlert(!showAlert);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const handleAuthentication = () => {
    setShowAlert(!showAlert);
  };
  const [isChecked, setIsChecked] = useState(false);
  const [isPaymentsChecked, setIsPaymentsChecked] = useState(false);
  const [isOrganizersChecked, setIsOrganizersChecked] = useState(false);
  const [isUploadsChecked, setIsUploadsChecked] = useState(false);
  const [isSignaturesChecked, setIsSignaturesChecked] = useState(false);
  const [isApprovalsChecked, setIsApprovalsChecked] = useState(false);
  const [isUploadingChecked, setIsUploadingChecked] = useState(false);
  const [isTasksChecked, setIsTasksChecked] = useState(false);
  const [isMessagesChecked, setIsMessagesChecked] = useState(false);
  const [isNewEmailChecked, setIsNewEmailChecked] = useState(false);
  const [isProposalsChecked, setIsProposalsChecked] = useState(false);
  const [isJobsChecked, setIsJobsChecked] = useState(false);
  const [isMentionsChecked, setIsMentionsChecked] = useState(false);
  const [isSmsChecked, setIsSmsChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isPaymentsEmailChecked, setIsPaymentsEmailChecked] = useState(false);
  const [isOrganizersEmailChecked, setIsOrganizersEmailChecked] =
    useState(false);
  const [isUploadsEmailChecked, setIsUploadsEmailChecked] = useState(false);
  const [isSignaturesEmailChecked, setIsSignaturesEmailChecked] =
    useState(false);
  const [isApprovalsEmailChecked, setIsApprovalsEmailChecked] = useState(false);
  const [isUploadingEmailChecked, setIsUploadingEmailChecked] = useState(false);
  const [isTasksEmailChecked, setIsTasksEmailChecked] = useState(false);
  const [isMessagesEmailChecked, setIsMessagesEmailChecked] = useState(false);
  const [isNewEmailEmailChecked, setIsNewEmailEmailChecked] = useState(false);
  const [isProposalsEmailChecked, setIsProposalsEmailChecked] = useState(false);
  const [isJobsEmailChecked, setIsJobsEmailChecked] = useState(false);
  const [isMentionsEmailChecked, setIsMentionsEmailChecked] = useState(false);
  const [isSmsEmailChecked, setIsSmsEmailChecked] = useState(false);
  const [SystemLang, setSystemLang] = React.useState("");
  const options = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ru", label: "Russian" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    // Add more languages as needed
  ];

  const isCheckedRef = useRef(isChecked);
  const isPaymentsCheckedRef = useRef(isPaymentsChecked);
  const isEmailCheckedRef = useRef(isChecked);
  const isPaymentsEmailCheckedRef = useRef(isPaymentsChecked);
  const isOrganizersCheckedref = useRef(isOrganizersChecked);
  const isOrganizersEmailCheckedRef = useRef(isOrganizersEmailChecked);
  const isUploadsCheckedref = useRef(isUploadsChecked);
  const isUploadsEmailCheckedRef = useRef(isUploadsEmailChecked);
  const isSignaturesCheckedref = useRef(isSignaturesChecked);
  const isSignaturesEmailCheckedRef = useRef(isSignaturesEmailChecked);
  const isApprovalsCheckedref = useRef(isApprovalsChecked);
  const isApprovalsEmailCheckedRef = useRef(isApprovalsEmailChecked);
  const isUploadingCheckedref = useRef(isUploadingChecked);
  const isUploadingEmailCheckedRef = useRef(isUploadingEmailChecked);
  const isTasksCheckedref = useRef(isTasksChecked);
  const isTasksEmailCheckedRef = useRef(isTasksEmailChecked);
  const isMessagesCheckedref = useRef(isMessagesChecked);
  const isMessagesEmailCheckedRef = useRef(isMessagesEmailChecked);
  const isNewEmailCheckedref = useRef(isNewEmailChecked);
  const isNewEmailEmailCheckedRef = useRef(isNewEmailEmailChecked);
  const isProposalsCheckedref = useRef(isProposalsChecked);
  const isProposalsEmailCheckedRef = useRef(isProposalsEmailChecked);
  const isJobsCheckedref = useRef(isJobsChecked);
  const isJobsEmailCheckedRef = useRef(isJobsEmailChecked);
  const isMentionsCheckedref = useRef(isMentionsChecked);
  const isMentionsEmailCheckedRef = useRef(isMentionsEmailChecked);
  const isSmsCheckedref = useRef(isSmsChecked);
  const isSmsEmailCheckedRef = useRef(isSmsEmailChecked);

  useEffect(() => {
    isCheckedRef.current = isChecked;
  }, [isChecked]);
  useEffect(() => {
    isPaymentsCheckedRef.current = isPaymentsChecked;
  }, [isPaymentsChecked]);
  useEffect(() => {
    isEmailCheckedRef.current = isEmailChecked;
  }, [isEmailChecked]);
  useEffect(() => {
    isPaymentsEmailCheckedRef.current = isPaymentsEmailChecked;
  }, [isPaymentsEmailChecked]);
  useEffect(() => {
    isOrganizersCheckedref.current = isOrganizersChecked;
  }, [isOrganizersChecked]);
  useEffect(() => {
    isOrganizersEmailCheckedRef.current = isOrganizersEmailChecked;
  }, [isOrganizersEmailChecked]);
  useEffect(() => {
    isUploadsCheckedref.current = isUploadsChecked;
  }, [isUploadsChecked]);
  useEffect(() => {
    isUploadsEmailCheckedRef.current = isUploadsEmailChecked;
  }, [isUploadsEmailChecked]);
  useEffect(() => {
    isSignaturesCheckedref.current = isSignaturesChecked;
  }, [isSignaturesCheckedref]);
  useEffect(() => {
    isSignaturesEmailCheckedRef.current = isSignaturesEmailChecked;
  }, [isSignaturesEmailChecked]);
  useEffect(() => {
    isApprovalsCheckedref.current = isApprovalsChecked;
  }, [isApprovalsChecked]);
  useEffect(() => {
    isApprovalsEmailCheckedRef.current = isApprovalsEmailChecked;
  }, [isApprovalsEmailChecked]);
  useEffect(() => {
    isUploadingCheckedref.current = isUploadingChecked;
  }, [isUploadingChecked]);
  useEffect(() => {
    isUploadingEmailCheckedRef.current = isUploadingEmailChecked;
  }, [isUploadingEmailChecked]);
  useEffect(() => {
    isTasksCheckedref.current = isTasksChecked;
  }, [isTasksChecked]);
  useEffect(() => {
    isTasksEmailCheckedRef.current = isTasksEmailChecked;
  }, [isTasksEmailChecked]);
  useEffect(() => {
    isMessagesCheckedref.current = isMessagesChecked;
  }, [isMessagesChecked]);
  useEffect(() => {
    isMessagesEmailCheckedRef.current = isMessagesEmailChecked;
  }, [isMessagesEmailChecked]);
  useEffect(() => {
    isNewEmailCheckedref.current = isNewEmailChecked;
  }, [isNewEmailChecked]);
  useEffect(() => {
    isNewEmailEmailCheckedRef.current = isNewEmailEmailChecked;
  }, [isNewEmailEmailChecked]);
  useEffect(() => {
    isProposalsCheckedref.current = isProposalsChecked;
  }, [isProposalsChecked]);
  useEffect(() => {
    isProposalsEmailCheckedRef.current = isProposalsEmailChecked;
  }, [isProposalsEmailChecked]);
  useEffect(() => {
    isJobsCheckedref.current = isJobsChecked;
  }, [isJobsChecked]);
  useEffect(() => {
    isJobsEmailCheckedRef.current = isJobsEmailChecked;
  }, [isJobsEmailChecked]);
  useEffect(() => {
    isMentionsCheckedref.current = isMentionsChecked;
  }, [isMentionsChecked]);
  useEffect(() => {
    isMentionsEmailCheckedRef.current = isMentionsEmailChecked;
  }, [isMentionsEmailChecked]);
  useEffect(() => {
    isSmsCheckedref.current = isSmsChecked;
  }, [isSmsChecked]);
  useEffect(() => {
    isSmsEmailCheckedRef.current = isSmsEmailChecked;
  }, [isSmsEmailChecked]);

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handlePaymentsCheckboxChange = () => {
    // setIsPaymentsChecked(!isPaymentsChecked);
    setIsPaymentsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isPaymentsCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleOrganizersCheckboxChange = () => {
    // setIsOrganizersChecked(!isOrganizersChecked);
    setIsOrganizersChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isOrganizersCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleUploadsCheckboxChange = () => {
    // setIsUploadsChecked(!isUploadsChecked);
    setIsUploadsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isUploadsCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleSignaturesCheckboxChange = () => {
    // setIsSignaturesChecked(!isSignaturesChecked);
    setIsSignaturesChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isSignaturesCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleApprovalsCheckboxChange = () => {
    // setIsApprovalsChecked(!isApprovalsChecked);
    setIsApprovalsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isApprovalsCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleUploadingCheckboxChange = () => {
    // setIsUploadingChecked(!isUploadingChecked);
    setIsUploadingChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isUploadingCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleTasksCheckboxChange = () => {
    // setIsTasksChecked(!isTasksChecked);
    setIsTasksChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isTasksCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleMessagesCheckboxChange = () => {
    // setIsMessagesChecked(!isMessagesChecked);
    setIsMessagesChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isMessagesCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleNewEmailCheckboxChange = () => {
    // setIsNewEmailChecked(!isNewEmailChecked);
    setIsNewEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isNewEmailCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleProposalsCheckboxChange = () => {
    // setIsProposalsChecked(!isProposalsChecked);
    setIsProposalsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isProposalsCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleJobsCheckboxChange = () => {
    // setIsJobsChecked(!isJobsChecked);
    setIsJobsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isJobsCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleMentionsCheckboxChange = () => {
    // setIsMentionsChecked(!isMentionsChecked);
    setIsMentionsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isMentionsCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleSmsCheckboxChange = () => {
    // setIsSmsChecked(!isSmsChecked);
    setIsSmsChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isSmsCheckedref.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };

  const handleEmailCheckboxChange = () => {
    // setIsEmailChecked(!isEmailChecked);
    setIsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handlePaymentsEmailCheckboxChange = () => {
    // setIsPaymentsEmailChecked(!isPaymentsEmailChecked);
    setIsPaymentsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isPaymentsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleOrganizersEmailCheckboxChange = () => {
    // setIsOrganizersEmailChecked(!isOrganizersEmailChecked);
    setIsOrganizersEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isOrganizersEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleUploadsEmailCheckboxChange = () => {
    // setIsUploadsEmailChecked(!isUploadsEmailChecked);
    setIsUploadsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isUploadsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleSignaturesEmailCheckboxChange = () => {
    // setIsSignaturesEmailChecked(!isSignaturesEmailChecked);
    setIsSignaturesEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isSignaturesEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleApprovalsEmailCheckboxChange = () => {
    // setIsApprovalsEmailChecked(!isApprovalsEmailChecked);
    setIsApprovalsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isApprovalsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleUploadingEmailCheckboxChange = () => {
    setIsUploadingEmailChecked(!isUploadingEmailChecked);
    setIsUploadingEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isUploadingEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleTasksEmailCheckboxChange = () => {
    // setIsTasksEmailChecked(!isTasksEmailChecked);
    setIsTasksEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isTasksEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleMessagesEmailCheckboxChange = () => {
    // setIsMessagesEmailChecked(!isMessagesEmailChecked);
    setIsMessagesEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isMessagesEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleNewEmailEmailCheckboxChange = () => {
    // setIsNewEmailEmailChecked(!isNewEmailEmailChecked);
    setIsNewEmailEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isNewEmailEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleProposalsEmailCheckboxChange = () => {
    // setIsProposalsEmailChecked(!isProposalsEmailChecked);
    setIsProposalsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isProposalsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleJobsEmailCheckboxChange = () => {
    // setIsJobsEmailChecked(!isJobsEmailChecked);
    setIsJobsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isJobsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleMentionsEmailCheckboxChange = () => {
    // setIsMentionsEmailChecked(!isMentionsEmailChecked);
    setIsMentionsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isMentionsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };
  const handleSmsEmailCheckboxChange = () => {
    // setIsSmsEmailChecked(!isSmsEmailChecked);
    setIsSmsEmailChecked((prevChecked) => {
      const newChecked = !prevChecked;
      isSmsEmailCheckedRef.current = newChecked; // Update the ref with the new value
      return newChecked;
    });
    setTimeout(() => {
      NotificationUpdate();
    }, 0);
  };

  //********Notification changed update */

  const NotificationUpdate = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      userId: logindata.user.id,
      notifications: [
        {
          notificationDescription: "Invoices",
          inbox: isCheckedRef.current,
          email: isEmailCheckedRef.current,
        },
        {
          notificationDescription: "Payments",
          inbox: isPaymentsCheckedRef.current,
          email: isPaymentsEmailCheckedRef.current,
        },
        {
          notificationDescription: "Organizers",
          inbox: isOrganizersCheckedref.current,
          email: isOrganizersEmailCheckedRef.current,
        },
        {
          notificationDescription: "Uploads",
          inbox: isUploadsCheckedref.current,
          email: isUploadsEmailCheckedRef.current,
        },
        {
          notificationDescription: "E-signatures",
          inbox: isSignaturesCheckedref.current,
          email: isSignaturesEmailCheckedRef.current,
        },
        {
          notificationDescription: "Approvals",
          inbox: isApprovalsCheckedref.current,
          email: isApprovalsEmailCheckedRef.current,
        },
        {
          notificationDescription: "Done uploading",
          inbox: isUploadingCheckedref.current,
          email: isUploadingEmailCheckedRef.current,
        },
        {
          notificationDescription: "Tasks",
          inbox: isTasksCheckedref.current,
          email: isTasksEmailCheckedRef.current,
        },
        {
          notificationDescription: "Messages",
          inbox: isMessagesCheckedref.current,
          email: isMessagesEmailCheckedRef.current,
        },
        {
          notificationDescription: "New mail",
          inbox: isNewEmailCheckedref.current,
          email: isNewEmailEmailCheckedRef.current,
        },
        {
          notificationDescription: "Proposals",
          inbox: isProposalsCheckedref.current,
          email: isProposalsEmailCheckedRef.current,
        },
        {
          notificationDescription: "Jobs",
          inbox: isJobsCheckedref.current,
          email: isJobsEmailCheckedRef.current,
        },
        {
          notificationDescription: "Mentions",
          inbox: isMentionsCheckedref.current,
          email: isMentionsEmailCheckedRef.current,
        },
        {
          notificationDescription: "SMS",
          inbox: isSmsCheckedref.current,
          email: isSmsEmailCheckedRef.current,
        },
      ],
      active: true,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log(notificationdata);

    const url = `${LOGIN_API}/admin/notification/${notificationdata._id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result && result.message === "Notification updated successfully") {
          toast.success("Notification settings updated successfully");
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000);
        } else {
          toast.error(result.message || "Failed to update Notification");
        }
      })
      .catch((error) => console.error(error));
  };

  const [notificationdata, setNotificationData] = useState();

  const fetchNotificationData = async (id) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${LOGIN_API}/admin/notification/notificationbyuser/${id}`;
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const result = await response.text();
      const notification = JSON.parse(result);
      setNotificationData(notification.notification);

      if (
        notification &&
        Array.isArray(notification.notification.notifications)
      ) {
        notification.notification.notifications.forEach((notif) => {
          switch (notif.notificationDescription) {
            case "Invoices":
              setIsChecked(notif.inbox);
              setIsEmailChecked(notif.email);
              break;
            case "Payments":
              setIsPaymentsChecked(notif.inbox);
              setIsPaymentsEmailChecked(notif.email);
              break;
            case "Organizers":
              setIsOrganizersChecked(notif.inbox);
              setIsOrganizersEmailChecked(notif.email);
              break;
            case "Uploads":
              setIsUploadsChecked(notif.inbox);
              setIsUploadsEmailChecked(notif.email);
              break;
            case "E-signatures":
              setIsSignaturesChecked(notif.inbox);
              setIsSignaturesEmailChecked(notif.email);
              break;
            case "Approvals":
              setIsApprovalsChecked(notif.inbox);
              setIsApprovalsEmailChecked(notif.email);
              break;
            case "Done uploading":
              setIsUploadingChecked(notif.inbox);
              setIsUploadingEmailChecked(notif.email);
              break;
            case "Tasks":
              setIsTasksChecked(notif.inbox);
              setIsTasksEmailChecked(notif.email);
              break;
            case "Messages":
              setIsMessagesChecked(notif.inbox);
              setIsMessagesEmailChecked(notif.email);
              break;
            case "New mail":
              setIsNewEmailChecked(notif.inbox);
              setIsNewEmailEmailChecked(notif.email);
              break;
            case "Proposals":
              setIsProposalsChecked(notif.inbox);
              setIsProposalsEmailChecked(notif.email);
              break;
            case "Jobs":
              setIsJobsChecked(notif.inbox);
              setIsJobsEmailChecked(notif.email);
              break;
            case "Mentions":
              setIsMentionsChecked(notif.inbox);
              setIsMentionsEmailChecked(notif.email);
              break;
            case "SMS":
              setIsSmsChecked(notif.inbox);
              setIsSmsEmailChecked(notif.email);
              break;
            default:
              console.error(
                "Unknown notification type:",
                notif.notificationDescription
              );
          }
        });
      } else {
        console.error("Notifications array is not defined or not an array");
      }
    } catch (error) {
      console.error("Error fetching notification data:", error);
    }
  };
  console.log(notificationdata);

  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedLanguage(selectedOption);
  };

  const [userUpdate, setUserUpdate] = useState();
  const handleUpdatePasswordClick = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      password: password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/verifyuserandpassword/`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.user);
        setUserUpdate(result.user);

        toast("User Verified successfully.");
        setShowAlert(false);
        setIsLoginEditable(true);
        setShowUpdatePassButton(true);
        // setShowAlert(false);
        // updatePassword(result.user._id )
      })
      .catch((error) => {
        console.error(error);
      });
  };
  console.log(userUpdate);
  const updatePassword = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("id", userUpdate._id);

    // myHeaders.append("Authorization", token);

    // console.log(token)
    const raw = JSON.stringify({
      password: password,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const baseUrl = `${LOGIN_API}/common/user/password/updateuserpassword/`;

    const url = new URL(baseUrl);

    // url.searchParams.append("id", id);
    // url.searchParams.append("token", token);

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((result) => {
        toast("Password Updated successfully.");
        setIsLoginEditable(false);
        setPassword("");
        setCpassword("");
        // Handle success, if needed
      })
      .catch((error) => {
        console.error("Error updating password:", error.message);
        // Handle error, if needed
      });
  };
  // const [password, setPassword] = useState("");
  //for password
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  //for confiem password
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickConfirmShowPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpConfirmPassword = (event) => {
    event.preventDefault();
  };
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState("");
  const [confirmPasswordValidation, setConfirmPasswordValidation] =
    useState("");
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleToggleCPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleConfirmPasswordPaste = (e) => {
    const pastedText = e.clipboardData.getData("text");
    setConfirmPassword(pastedText);
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    validatePassword(password, newConfirmPassword);
  };

  const validatePassword = (newPassword) => {
    // Check if newPassword is defined before performing operations
    if (typeof newPassword !== "undefined") {
      // Example validation criteria: password length >= 8 characters, contains at least one number and one letter
      const hasNumber = /\d/.test(newPassword);
      const hasLetter = /[a-zA-Z]/.test(newPassword);
      const isValid = newPassword.length >= 8 && hasNumber && hasLetter;
      setPasswordValid(isValid);
    }
  };

  //for email synk

  const CLIENT_ID =
    "1070770223600-nkocmga9ensmg3aaip15rhp0vpjlugd1.apps.googleusercontent.com";
  const API_KEY = "AIzaSyDR042NieiN9Lbz13KAxTTl5ShVW4Ln4yM";
  const SCOPES =
    "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send";

  const [emailId, setEmailId] = useState("");

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
          ],
          scope: SCOPES,
        })
        .then(() => {
          // No need to handle signed-in state here
        })
        .catch((error) => {
          console.error("Error initializing GAPI:", error);
        });
    }

    gapi.load("client:auth2", start);
  }, []);

  const handleLogin = () => {
    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(() => {
        const userEmail = gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getBasicProfile()
          .getEmail();
        const accessToken = gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getAuthResponse().access_token; // Get access token

        // Store email and access token in cookies
        Cookies.set("emailId", userEmail, { expires: 1 }); // 1 day expiration
        Cookies.set("accessToken", accessToken, { expires: 1 }); // 1 day expiration
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  const handleEmailIdSubmit = (event) => {
    event.preventDefault();
    if (emailId) {
      Cookies.set("emailId", emailId); // Store email in cookies
      handleLogin(); // Trigger Gmail API sign-in
    }
  };
  const EMAIL_SYNC = process.env.REACT_APP_EMAILSYNC_API;
  const [emailList, setEmailList] = useState([]);
  const handleGoogleLogin = () => {
    window.location.href = `${EMAIL_SYNC}/emailsync/auth/google`;
  };
  const updateUserEmailSync = async (userId, emailSyncValue) => {
    try {
      await axios.patch(`${LOGIN_API}/common/user/${userId}`, {
        emailSyncEmail: emailSyncValue,
      });
      console.log("✅ User updated with emailSync field.");
    } catch (error) {
      console.error("❌ Failed to update user with emailSync field:", error);
    }
  };

  const handleTokenLogin = async () => {
    const targetEmail = emailsync;
    console.log("target", targetEmail);
    if (!targetEmail) {
      alert("⚠️ Please enter your email or login with Google first.");
      return;
    }

    try {
      const res = await axios.get(
        `${EMAIL_SYNC}/emailsync/user/login-with-token/${targetEmail}`
      );
      console.log("payload", res.data);
      setEmail(targetEmail);
      // setProfile(res.data.profile);
      setEmailList(res.data.emails || []);
      localStorage.setItem("gmail_user_email", targetEmail);
      setEmailSync(targetEmail);

      await updateUserEmailSync(loginuserid, targetEmail);
      alert("✅ Logged in using refresh token!");
    } catch (err) {
      console.error(err);
      alert("❌ Token login failed. Please login with Google again.");
    }
  };

  const handleEmailSync = async () => {
    if (!emailsync) {
      alert("⚠️ Please enter an email address.");
      return;
    }

    try {
      const res = await axios.get(
        `${EMAIL_SYNC}/emailsync/user/exists/${emailsync}`
      );

      if (res.data.exists) {
        console.log("User exists, using token login.");
        // setEmail(emailsync);
        await handleTokenLogin();
      } else {
        console.log("User not found, redirecting to Google login.");
        setEmail(emailsync);
        await handleGoogleLogin();
      }

      // ✅ After successful sync, update the user with emailsync
      await updateEmailSync(emailsync);
    } catch (error) {
      console.error("Email sync failed", error);
      alert("❌ Something went wrong while checking email existence.");
    }
  };
  const [selectedFile, setSelectedFile] = useState(null);

  const updateProfilePicture = () => {
    const formdata = new FormData();

    if (selectedFile) {
      // Check directly if selectedFile is set
      formdata.append("ProfilePicture", selectedFile);
      console.log(selectedFile); // Debugging: Log the selected file

      const requestOptions = {
        method: "PATCH",
        body: formdata,
        redirect: "follow",
      };

      fetch(`${LOGIN_API}/admin/adminsignup/${admindata._id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    } else {
      console.error("No file selected"); // This will execute if no file is selected
    }
  };

  const [error, setError] = useState(""); // Error state
  const [profilePicture, setProfilePicture] = useState("");
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Check if file size exceeds 1MB (1048576 bytes)
      if (file.size > 1048576) {
        setError("File size exceeds 1MB. Please upload a smaller file.");
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const width = img.width;
        const height = img.height;

        // Check if the image size exceeds 512x512 pixels
        if (width > 512 || height > 512) {
          setError(
            "Image dimensions exceed 512x512 pixels. Please resize the image."
          );
        } else {
          // File is valid, proceed with setting the file
          setError("");
          setSelectedFile(file);
          setProfilePicture(URL.createObjectURL(file)); // For displaying the preview
        }
      };
    }
  };

  const handleDeletePhoto = () => setProfilePicture(null);

  const [image, setImage] = useState(null); // The original image
  const [croppedImage, setCroppedImage] = useState(""); // The cropped image

  // Fetch the last uploaded image when the page loads
  // useEffect(() => {
  //   axios
  //     .get(`${LOGIN_API}/lastimage`)
  //     .then((response) => {
  //       const imageUrl = response.data.imageUrl;
  //       setCroppedImage(imageUrl); // Set the last uploaded image URL as the profile picture
  //       console.log("viayak",imageUrl)
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching last image:", error);
  //     });
  // }, []);
  // const imageUrlWithCacheBuster = `${croppedImage}`;
  const fetchLastUploadedImage = async () => {
    try {
      const response = await axios.get(`${LOGIN_API}/lastimage`);
      if (response.status === 200) {
        console.log("Last uploaded image:", response.data.imageUrl);
        setCroppedImage(response.data.imageUrl); // Set the image URL in state
      }
    } catch (error) {
      console.error("Error fetching last image:", error);
    }
  };
  useEffect(() => {
    fetchLastUploadedImage();
  }, []);

  const handleCroppedImage = (cropped) => {
    setCroppedImage(cropped); // Set the cropped image data
    setImage(null); // Hide the cropper
  };

  const handleSubmit = async (userId) => {
    if (!userId) {
      console.error("User ID is required!");
      return;
    }

    if (croppedImage) {
      try {
        // Convert the blob URL to a Blob object
        const response = await fetch(croppedImage);
        const blob = await response.blob();

        // Create a File object
        const file = new File([blob], `${userId}.jpg`, { type: blob.type });

        // Prepare FormData
        const formData = new FormData();
        formData.append("image", file);

        // Make POST request with userId in URL
        const result = await axios.post(
          `${LOGIN_API}/userprofilepic?userId=${userId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        console.log("Image uploaded successfully:", result.data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.error("No cropped image to send!");
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    return nameParts
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  const notificationRows = [
    { label: "Invoices", inboxChecked: isChecked, onInboxChange: handleCheckboxChange, emailChecked: isEmailChecked, onEmailChange: handleEmailCheckboxChange },
    { label: "Payments", inboxChecked: isPaymentsChecked, onInboxChange: handlePaymentsCheckboxChange, emailChecked: isPaymentsEmailChecked, onEmailChange: handlePaymentsEmailCheckboxChange },
    { label: "Organizers", inboxChecked: isOrganizersChecked, onInboxChange: handleOrganizersCheckboxChange, emailChecked: isOrganizersEmailChecked, onEmailChange: handleOrganizersEmailCheckboxChange },
    { label: "Documents", isSpacer: true },
    { label: "Uploads", indent: true, inboxChecked: isUploadsChecked, onInboxChange: handleUploadsCheckboxChange, emailChecked: isUploadsEmailChecked, onEmailChange: handleUploadsEmailCheckboxChange },
    { label: "E-signatures", indent: true, inboxChecked: isSignaturesChecked, onInboxChange: handleSignaturesCheckboxChange, emailChecked: isSignaturesEmailChecked, onEmailChange: handleSignaturesEmailCheckboxChange },
    { label: "Approvals", indent: true, inboxChecked: isApprovalsChecked, onInboxChange: handleApprovalsCheckboxChange, emailChecked: isApprovalsEmailChecked, onEmailChange: handleApprovalsEmailCheckboxChange },
    { label: "Done uploading", indent: true, inboxChecked: isUploadingChecked, onInboxChange: handleUploadingCheckboxChange, emailChecked: isUploadingEmailChecked, onEmailChange: handleUploadingEmailCheckboxChange },
    { label: "Tasks", inboxChecked: isTasksChecked, onInboxChange: handleTasksCheckboxChange, emailChecked: isTasksEmailChecked, onEmailChange: handleTasksEmailCheckboxChange },
    { label: "Messages", inboxChecked: isMessagesChecked, onInboxChange: handleMessagesCheckboxChange, emailChecked: isMessagesEmailChecked, onEmailChange: handleMessagesEmailCheckboxChange },
    { label: "New mail", inboxChecked: isNewEmailChecked, onInboxChange: handleNewEmailCheckboxChange, emailChecked: isNewEmailEmailChecked, onEmailChange: handleNewEmailEmailCheckboxChange },
    { label: "Proposals", inboxChecked: isProposalsChecked, onInboxChange: handleProposalsCheckboxChange, emailChecked: isProposalsEmailChecked, onEmailChange: handleProposalsEmailCheckboxChange },
    { label: "Jobs", inboxChecked: isJobsChecked, onInboxChange: handleJobsCheckboxChange, emailChecked: isJobsEmailChecked, onEmailChange: handleJobsEmailCheckboxChange },
    { label: "Mentions", inboxChecked: isMentionsChecked, onInboxChange: handleMentionsCheckboxChange, emailChecked: isMentionsEmailChecked, onEmailChange: handleMentionsEmailCheckboxChange },
    { label: "SMS", inboxChecked: isSmsChecked, onInboxChange: handleSmsCheckboxChange, emailChecked: isSmsEmailChecked, onEmailChange: handleSmsEmailCheckboxChange },
  ];

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">Account Settings</h1>
      </div>
      <div className="account-settings space-y-6">
        {/* ===== PERSONAL DETAILS ===== */}
        <div className="accounts-details-user rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Personal Details</h2>
            <button onClick={handleEditClick} className="text-primary hover:text-primary/80 transition-colors">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <hr className="border-border mb-4" />

          {!isEditable && (
            <div className="flex items-center gap-5 mt-4">
              <img src={preview || currentImage || user} alt="Profile" className="w-[120px] h-[120px] rounded-full border-2 border-muted object-cover" />
              <div>
                <h3 className="text-xl font-semibold text-foreground">{firstName} {lastname}</h3>
                <p className="text-sm text-muted-foreground">{phonenumber}</p>
              </div>
            </div>
          )}

          {isEditable && (
            <div className="mt-4 space-y-5">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <img src={preview || currentImage || user} alt="Profile" className="w-[120px] h-[120px] rounded-full border-2 border-muted object-cover" />
                  <input accept="image/*" className="hidden" id="profile-picture-upload" type="file" onChange={handleImageChange} />
                  <label htmlFor="profile-picture-upload" className="absolute bottom-0 right-0 rounded-lg bg-primary p-1.5 cursor-pointer hover:bg-primary/90 transition-colors">
                    <Pencil className="h-3.5 w-3.5 text-white" />
                  </label>
                </div>
                {image && (
                  <div className="text-center space-y-2">
                    <p className="text-xs text-muted-foreground">{image.name} ({Math.round(image.size / 1024)} KB)</p>
                    <Button onClick={handleUpload} disabled={isUploading} className="gap-1.5">
                      {isUploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Upload Profile Picture</>}
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">First name</label>
                  <Input disabled={!isEditable} placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Middle Name</label>
                  <Input disabled={!isEditable} placeholder="Middle Name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Last name</label>
                  <Input disabled={!isEditable} placeholder="Last name" value={lastname} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                <Input disabled={!isEditable} placeholder="Phone Number" value={phonenumber} onChange={(e) => { const onlyNums = e.target.value.replace(/\D/g, ""); setPhoneNumber(onlyNums); }} />
              </div>
            </div>
          )}

          {showSaveButtons && (
            <div className="flex items-center gap-3 mt-4">
              <Button onClick={handleSaveButtonClick}>Save</Button>
              <Button variant="outline" onClick={handleCancelButtonClick}>Cancel</Button>
            </div>
          )}
        </div>

        {/* ===== LOGIN DETAILS ===== */}
        <div className="login-details-user rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Login Details</h2>
            <button onClick={toggleAlert} className="text-primary hover:text-primary/80 transition-colors">
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          {showAlert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black/40" onClick={handleCloseAlert} />
              <div className="relative z-50 w-full max-w-md rounded-xl bg-background p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Authentication</h3>
                  <button onClick={handleCloseAlert}><X className="h-4 w-4" /></button>
                </div>
                <hr className="border-border" />
                <p className="text-sm text-muted-foreground">In order to change your login details you must provide your current password.</p>
                <div className="relative">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <Input type={passShow ? "text" : "password"} placeholder="Enter Your Password" />
                    <button type="button" onClick={() => setPassShow(!passShow)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {passShow ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <NavLink to="/forgotpass" className="text-sm text-primary hover:underline">Forgot Password?</NavLink>
                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={handleUpdatePasswordClick}>Submit</Button>
                  <Button variant="outline" onClick={handleCloseAlert}>Cancel</Button>
                </div>
              </div>
            </div>
          )}

          <hr className="border-border mb-4" />
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <Input disabled value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={!isLoginEditable} placeholder="Password" />
                  <button type="button" onClick={handleTogglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Input type={showConfirmPassword ? "text" : "password"} value={cpassword} onChange={(e) => setCpassword(e.target.value)} disabled={!isLoginEditable} placeholder="Confirm Password" />
                  <button type="button" onClick={handleToggleCPasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Stay signed in for</label>
              <Input disabled value={signedtime} placeholder="Stay signed in for" />
            </div>
            {showUpdatePassButton && (
              <Button onClick={updatePassword}>Update Password</Button>
            )}
          </div>
        </div>

        {/* ===== TWO-FACTOR AUTH ===== */}
        <div className="authentication rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-3">Two-factor authentication</h2>
          <hr className="border-border mb-4" />
          <div className="flex items-center gap-3 cursor-pointer">
            <Switch onCheckedChange={handleAuthentication} />
            <span className="text-sm text-foreground" onClick={handleAuthentication}>Turn on two-factor authentication</span>
            <HelpCircle className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* ===== NOTIFICATION PREFERENCES ===== */}
        <div className="preferences rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-semibold text-foreground">Notification preferences</h2>
            <HelpCircle className="h-4 w-4 text-primary" />
          </div>
          <hr className="border-border mb-4" />
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-1/2"></th>
                  <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">INBOX+</th>
                  <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">EMAIL</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {notificationRows.map((row) => (
                  <tr key={row.label}>
                    <td className={`py-2.5 px-3 text-sm text-foreground ${row.indent ? "pl-8" : ""}`}>{row.label}</td>
                    <td className="py-2.5 px-3 text-center">
                      {!row.isSpacer && <Checkbox checked={row.inboxChecked} onCheckedChange={row.onInboxChange} />}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {!row.isSpacer && <Checkbox checked={row.emailChecked} onCheckedChange={row.onEmailChange} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== EMAIL SYNC ===== */}
        <div className="emailsyns rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-3">Email Sync</h2>
          <hr className="border-border mb-4" />
          <div className="flex items-center gap-1.5 mb-4">
            <p className="text-sm text-muted-foreground">Sync your existing email with TaxDome — all your client messages in one place.</p>
            <HelpCircle className="h-4 w-4 text-primary shrink-0" />
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email for sync</label>
              <Input value={emailsync} onChange={(e) => setEmailSync(e.target.value)} placeholder="Email for sync" />
            </div>
            <Button onClick={handleEmailSync}>Sync your email</Button>
          </div>
        </div>

        {/* ===== DOWNLOAD APP ===== */}
        <div className="emailsyns rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-3">Download Windows app</h2>
          <hr className="border-border mb-4" />
          <p className="text-sm text-muted-foreground">TaxDome Windows App help</p>
          <Link to="#" className="text-sm text-primary hover:underline">
            https://help.taxdome.com/article/164-taxdome-windows-application
          </Link>
        </div>

        {/* ===== INTERNATIONAL SETTINGS ===== */}
        <div className="emailsyns rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-3">International settings</h2>
          <hr className="border-border mb-4" />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">From</label>
            <select value={SystemLang} onChange={(e) => setSystemLang(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Select Language</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </>
  );
};
export default MyAccount;

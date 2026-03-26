import React, { useEffect, useState, useMemo, useContext } from "react";
import { LoginContext } from "../Sidebar/Context/Context";
import Switch from "react-switch";
import { SlQuestion } from "react-icons/sl";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import ImageCropper from "../Settings/ImageCropper";
import { FormPage, FormSection, FormField, FormRow, FormDrawer, FormDrawerFooter } from "../components/ui/form-layout";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { ArrowLeft, Pencil, Upload, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
const UpdateTeamMember = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const WINDOWS_PORT = process.env.REACT_APP_SERVER_URI;

  const { id } = useParams();
  console.log(id);
  const [open, setOpen] = useState(false);

  const [isEditable, setIsEditable] = useState(false);
  const [showSaveButtons, setShowSaveButtons] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editable, setEditable] = useState(false);
  const [logindetails, setLoginDetails] = useState(false);
  const [phonenumber, setPhoneNumber] = useState("");
  const handleLoginDetails = () => {
    setLoginDetails(!logindetails); // Set to true to show the text
  };
  const handleCloseLoginDetials = () => {
    setLoginDetails(!logindetails);
  };
  // const handleOpen = () => {
  //   setOpen(true);
  //   setEditable(true); // Enable editing when modal is opened
  // };
  const handleEditClick = () => {
    setIsEditable(!isEditable);
    setShowSaveButtons(!showSaveButtons);
    // setOpen(true);
  };
  const handleCancelButtonClick = () => {
    setShowSaveButtons(false);
    setIsEditable(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [error, setError] = useState(""); // Error state

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   console.log(file); // Check if the file is being logged correctly
  //   if (file) {
  //     setSelectedFile(file);
  //   }
  // };

  //right side form
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const handleNewDrawerClose = () => {
    setIsNewDrawerOpen(false);
  };
  //integration
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
    setFirstName(event.target.value);
  };

  const handleMiddleName = (event) => {
    setMiddleName(event.target.value);
  };
  const handleLastName = (event) => {
    setLastName(event.target.value);
  };

  const handleEdit = async (id) => {
    console.log("Edit action triggered for template id: ", id);
    // updateSidebarData(id);
  };

  const [firstNameValidation, setFirstNameValidation] = useState("");
  const [lastNameValidation, setLastNameValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  // const updateSidebarData = (targetLabel, newPermission) => {
  //   // console.log("janavi", teamMemberUserId);
  //   let data = JSON.stringify({
  //     targetLabel: targetLabel,
  //     newPermission: newPermission,

  //   });

  //   let config = {
  //     method: "patch",
  //     maxBodyLength: Infinity,
  //     url: "http://127.0.0.1:7000/api/permissions/678a0f33cee4de78198a70de",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: data,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log("updtaed sidebar",JSON.stringify(response.data));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const handleUpdateTeamMember = () => {

  //     const myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/json");

  //     const raw = JSON.stringify({
  //       firstName: firstName,
  //       middleName: middleName,
  //       lastName: lastName,
  //       role: selectedOption,
  //       email: email,
  //       managePayments: isCheckedPayments,
  //       manageInvoices: isCheckedInvoices,
  //       managePipelines: isCheckedPipelines,
  //       manageJobRecurrence: isCheckedJobRecurrences,
  //       manageTimeEntries: isCheckedTimeEntries,
  //       manageRatesinTimeEntries: isCheckedRatesTimeEntries,
  //       manageAccounts: isCheckedAccounts,
  //       viewallAccounts: isCheckedAllAccounts,
  //       manageTags: isCheckedTags,
  //       manageCustomFields: isCheckedCustomFields,
  //       manageOrganizers: isCheckedOrganizers,
  //       assignTeamMates: isCheckedTeammates,
  //       chargeFirmBalance: isCheckedFirmBalance,
  //       viewAllContacts: isCheckedAllContacts,
  //       manageContacts: isCheckedContacts,
  //       manageProposals: isCheckedProposals,
  //       manageSites: isCheckedSite,
  //       manageEmails: isCheckedEmail,
  //       manageServices: isCheckedServices,
  //       editOrganizersAnswers: isCheckedOrgnizerAnswers,
  //       managePublicFilterTemplates: isCheckedFilterTemplates,
  //       manageDocuments: isCheckedDocuments,
  //       manageTemplates: isCheckedTemplates,
  //       manageIRSTranscripts: isCheckedTranscripts,
  //       manageMarketPlace: isCheckedMarketplace,
  //       viewReporting: isCheckedViewReporting,
  //     });

  //     const requestOptions = {
  //       method: "PATCH",
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: "follow",
  //     };

  //     fetch(`${LOGIN_API}/admin/teammember/${id}`, requestOptions)
  //       .then((response) => {
  //                if (!response.ok) {
  //                  toast.error("Failed to update team member");
  //                }
  //                return response.json();
  //              })
  //       .then((result) => {
  //         if (result && result.teamMember && result.teamMember.userid) {
  //           const userId = result.teamMember.userid;
  //           const updatedUsername = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`.trim();

  //           // Call function to update the username
  //           updateUserUsername(userId, updatedUsername);
  //         }
  //       })

  //       .catch((error) => console.error(error));
  //   }
  //   const updateUserUsername = (userId, username) => {
  //     const myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/json");

  //     const raw = JSON.stringify({ username });

  //     const requestOptions = {
  //       method: "PATCH",
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: "follow",
  //     };

  //     fetch(`${LOGIN_API}/common/user/${userId}`, requestOptions)
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error("Failed to update username");
  //         }
  //         return response.json();
  //       })
  //       .then((result) => {
  //         console.log("Username updated:", result);
  //          toast.success("Team member updated successfully");
  //          handleNewDrawerClose();
  //         })
  //       .catch((error) => {
  //         console.error(error);
  //         toast.error("Failed to update username");
  //       });
  //   };
  const handleUpdateTeamMember = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      role: selectedOption,
      email: email,
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

    fetch(`${LOGIN_API}/admin/teammember/${id}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update team member");
        }
        return response.json();
      })
      .then((result) => {
        if (result && result.teamMember && result.teamMember.userid) {
          const userId = result.teamMember.userid;
          const updatedUsername =
            `${firstName} ${middleName ? middleName + " " : ""}${lastName}`.trim();
          return updateUserUsername(userId, updatedUsername);
        }
        return Promise.resolve(); // Resolve if no userid is present
      })
      .then(() => {
        toast.success("Team member updated successfully");
        handleNewDrawerClose();
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message || "Failed to update team member");
      });
  };

  const updateUserUsername = (userId, username) => {
    return new Promise((resolve, reject) => {
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
          resolve(); // Resolve the promise
        })
        .catch((error) => {
          console.error(error);
          reject(error); // Reject the promise
        });
    });
  };
  const handleSaveButtonClick = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      phoneNumber: phonenumber,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${LOGIN_API}/admin/teammember/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        // toast.success("Data updated successful!");
        // updateProfilePicture();
        setIsEditable(false);
        setShowSaveButtons(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred!");
      });
  };

  const [teamMemeberData, setTeamMemeberData] = useState();

  useEffect(() => {
    fetchInvoiceTemp(id);
  }, []);
  const [teamMemberUserId, setTeamMemberUserId] = useState("");

  const fetchInvoiceTemp = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${LOGIN_API}/admin/teammember/`;

    fetch(url + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const teamMembers = result;
        console.log(teamMembers);
        console.log(teamMembers.teamMember.userid);

        setTeamMemeberData(teamMembers.teamMember);
        setTeamMemberUserId(teamMembers.teamMember.userid);
        setFirstName(teamMembers.teamMember.firstName);
        setMiddleName(teamMembers.teamMember.middleName);
        setLastName(teamMembers.teamMember.lastName);
        setEMail(teamMembers.teamMember.email);
        setSelectedOption(teamMembers.teamMember.role);
        setPhoneNumber(teamMembers.teamMember.phoneNumber);
        setIsCheckedPayments(teamMembers.teamMember.managePayments);
        setIsCheckedPipelines(teamMembers.teamMember.managePipelines);
        setIsCheckedTimeEntries(teamMembers.teamMember.manageTimeEntries);
        setIsCheckedAccounts(teamMembers.teamMember.manageAccounts);
        setIsCheckedTags(teamMembers.teamMember.manageTags);
        setIsCheckedOrganizers(teamMembers.teamMember.manageOrganizers);
        setIsCheckedFirmBalance(teamMembers.teamMember.chargeFirmBalance);

        setIsCheckedContacts(teamMembers.teamMember.manageContacts);
        setIsCheckedSite(teamMembers.teamMember.manageSites);

        setIsCheckedServices(teamMembers.teamMember.manageServices);
        setIsCheckedFilterTemplates(
          teamMembers.teamMember.managePublicFilterTemplates
        );
        setIsCheckedTemplates(teamMembers.teamMember.manageTemplates);

        setIsCheckedMarketplace(teamMembers.teamMember.manageMarketPlace);
        setIsCheckedInvoices(teamMembers.teamMember.manageInvoices);

        setIsCheckedJobRecurrences(teamMembers.teamMember.manageJobRecurrence);
        setIsCheckedRatesTimeEntries(
          teamMembers.teamMember.manageRatesinTimeEntries
        );
        setIsCheckedAllAccounts(teamMembers.teamMember.viewallAccounts);
        setIsCheckedCustomFields(teamMembers.teamMember.manageCustomFields);
        setIsCheckedAllContacts(teamMembers.teamMember.viewAllContacts);

        setIsCheckedTeammates(teamMembers.teamMember.assignTeamMates);
        setIsCheckedProposals(teamMembers.teamMember.manageProposals);
        setIsCheckedViewReporting(teamMembers.teamMember.viewReporting);
        setIsCheckedEmail(teamMembers.teamMember.manageEmails);
        setIsCheckedTranscripts(teamMembers.teamMember.manageIRSTranscripts);
        setIsCheckedOrgnizerAnswers(
          teamMembers.teamMember.editOrganizersAnswers
        );
        setIsCheckedDocuments(teamMembers.teamMember.manageDocuments);
      })
      .catch((error) => console.error(error));
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

  /// Integration
  const { _id, token } = useParams();
  // console.log(_id);
  // console.log(token);

  const [values, setValues] = useState();
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setCPassShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState("");
  const [confirmPasswordValidation, setConfirmPasswordValidation] =
    useState("");
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
  // const { logindata } = useContext(LoginContext);
  console.log(teamMemberUserId);
  const updatePassword = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      password: password,
      cpassword: password,
      userid: teamMemberUserId,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/teamresetpass/teammemberpasswordupdate`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };
  const handleDelete = () => {
    setSelectedFile(null);
  };

  const [image, setImage] = useState(null); // The original image
  const [croppedImage, setCroppedImage] = useState(""); // The cropped image

  // Fetch the last uploaded image when the page loads
  useEffect(() => {
    axios
      .get(`${LOGIN_API}/lastimage`)
      .then((response) => {
        const imageUrl = response.data.imageUrl;
        setCroppedImage(imageUrl); // Set the last uploaded image URL as the profile picture
        console.log("viayak", imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching last image:", error);
      });
  }, []);
  // const imageUrlWithCacheBuster = `${croppedImage}`;

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setImage(reader.result); // Set the base64 image data
  //       console.log("vinayak",reader.result)
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleCroppedImage = (cropped) => {
    setCroppedImage(cropped); // Set the cropped image data
    setImage(null); // Hide the cropper
  };

  const handleSubmit = async () => {
    if (croppedImage) {
      try {
        // Convert the blob URL to a Blob object
        const response = await fetch(croppedImage);
        const blob = await response.blob();

        // Create a File object (optional: you can give it a name and MIME type)
        const file = new File([blob], "cropped_image.jpg", { type: blob.type });

        // Prepare FormData
        const formData = new FormData();
        formData.append("image", file); // Add the File object

        // Make POST request using axios
        axios
          .post(`${LOGIN_API}/userprofilepic`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Image uploaded successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      } catch (error) {
        console.error("Error converting blob URL to Blob:", error);
      }
    } else {
      console.error("No cropped image to send!");
    }
  };

  const [currentImage, setCurrentImage] = useState(null);
  const [preview, setPreview] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const fetchData = async () => {
    try {
      const url = `${LOGIN_API}/common/user/${teamMemberUserId}`;
      console.log("jjj", url);
      const response = await fetch(url);
      const data = await response.json();

      // const validTime = logindata.user.exp - logindata.user.iat;
      // setSignedTime(formatTimePeriod(validTime));

      setCurrentImage(data.profilePicture);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (teamMemberUserId) {
      fetchData();
    }
  }, [teamMemberUserId]);
  useEffect(() => {
    if (currentImage) {
      // Replace 'uploads/' with 'profilepicture/' in the path
      const transformedUrl = currentImage.replace(
        "uploads/",
        "profilepicture/"
      );
      setPreview(`${LOGIN_API}/${transformedUrl}`);
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
        `${LOGIN_API}/common/${teamMemberUserId}/profile-picture`,
        formData
      );
      console.log("jhgds", response);
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
  return (
    <FormPage title="Update Team Member">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column - Personal Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Personal Details</h3>
            <button type="button" onClick={handleEditClick} className="rounded p-1.5 text-primary hover:bg-primary/10">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <hr className="mb-4" />

          {!isEditable && (
            <div className="flex items-center gap-6 mt-4">
              <img
                src={preview || currentImage}
                alt="Profile"
                className="w-[120px] h-[120px] rounded-full border-2 border-muted object-cover"
              />
              <div>
                <h4 className="text-xl font-semibold">{firstName} {lastName}</h4>
                <p className="text-sm text-muted-foreground">{phonenumber}</p>
              </div>
            </div>
          )}

          {isEditable && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <img
                    src={preview || currentImage}
                    alt="Profile"
                    className="w-[120px] h-[120px] rounded-full border-2 border-muted object-cover"
                  />
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="profile-picture-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="profile-picture-upload">
                    <span className="absolute bottom-0 right-0 rounded-lg cursor-pointer p-1.5 bg-primary hover:bg-primary/90 text-white">
                      <Pencil className="h-3.5 w-3.5" />
                    </span>
                  </label>
                </div>

                {image && (
                  <>
                    <p className="text-xs text-muted-foreground mt-1">
                      {image.name} ({Math.round(image.size / 1024)} KB)
                    </p>
                    <Button onClick={handleUpload} disabled={isUploading} className="w-full mt-2">
                      {isUploading ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                      ) : (
                        <><Upload className="h-4 w-4 mr-2" /> Upload Profile Picture</>
                      )}
                    </Button>
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <FormField label="First Name">
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" disabled={!isEditable} />
                </FormField>
                <FormField label="Middle Name">
                  <Input value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle Name" disabled={!isEditable} />
                </FormField>
                <FormField label="Last Name">
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" disabled={!isEditable} />
                </FormField>
              </div>

              <FormField label="Phone Number">
                <Input
                  value={phonenumber}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setPhoneNumber(onlyNums);
                  }}
                  placeholder="Phone Number"
                  disabled={!isEditable}
                />
              </FormField>

              {showSaveButtons && (
                <div className="flex items-center gap-3 mt-3">
                  <Button onClick={handleSaveButtonClick}>Save</Button>
                  <Button variant="outline" onClick={handleCancelButtonClick}>Cancel</Button>
                </div>
              )}
            </div>
          )}

          {/* Login Details */}
          <div className="flex items-center justify-between mt-6">
            <h3 className="text-base font-semibold">Login details</h3>
            <button type="button" onClick={handleLoginDetails} className="rounded p-1.5 text-primary hover:bg-primary/10">
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          <FormField label="Email" className="mt-2">
            <Input placeholder="Email" disabled value={email} onChange={handleEmail} />
          </FormField>

          {logindetails && (
            <div className="space-y-4 mt-4">
              <FormField label="Password">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Password"
                    onChange={handlePasswordChange}
                  />
                  <button type="button" onClick={handleTogglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </FormField>
              <FormField label="Confirm Password">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onChange={handleConfirmPasswordChange}
                    onPaste={handleConfirmPasswordPaste}
                  />
                  <button type="button" onClick={handleTogglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </FormField>
              <div className="flex items-center gap-3 mt-3">
                <Button onClick={updatePassword}>Save</Button>
                <Button variant="outline" onClick={handleCloseLoginDetials}>Cancel</Button>
              </div>
            </div>
          )}
        </div>

        {/* Right column - Access Rights */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Access rights</h3>
            <button
              type="button"
              onClick={() => { handleEdit(id); setIsNewDrawerOpen(true); }}
              className="rounded p-1.5 text-primary hover:bg-primary/10"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Access Rights Drawer */}
      <FormDrawer
        open={isNewDrawerOpen}
        onClose={handleNewDrawerClose}
        title={`Edit team member ${firstName} ${middleName} ${lastName}`}
        width="lg"
      >
        <form>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <FormField label="First Name">
                <Input placeholder="First Name" onChange={handleFirstName} value={firstName} />
              </FormField>
              <FormField label="Middle Name">
                <Input placeholder="Middle Name" onChange={handleMiddleName} value={middleName} />
              </FormField>
              <FormField label="Last Name">
                <Input placeholder="Last Name" onChange={handleLastName} value={lastName} />
              </FormField>
            </div>

            <FormField label="Email">
              <Input placeholder="Email" value={email} disabled />
            </FormField>

            <FormField label="Role">
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </FormField>

            {selectedOption === "employee" && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-sm font-medium">Access Rights</p>
                  <SlQuestion className="text-primary cursor-pointer" />
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-0 p-2">
                  {/* Column 1 */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchPayments} checked={isCheckedPayments} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} disabled className="react-switch" /><span className="text-sm">Manage payments</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchPipelines} checked={isCheckedPipelines} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" /><span className="text-sm">Manage pipelines</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchTime} checked={isCheckedTimeEntries} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Manage time entries</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchAccounts} checked={isCheckedAccounts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" /><span className="text-sm">Manage accounts</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchTags} checked={isCheckedTags} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" /><span className="text-sm">Manage tags</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchOrganizers} checked={isCheckedOrganizers} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" /><span className="text-sm">Manage organizers</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchFirmBalance} checked={isCheckedFirmBalance} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Manage firm balance</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchContacts} checked={isCheckedContacts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" /><span className="text-sm">Manage contacts</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchSite} checked={isCheckedSite} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Manage site</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchServices} checked={isCheckedServices} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" /><span className="text-sm">Manage services</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchFilterTemplates} checked={isCheckedFilterTemplates} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Manage public filter templates</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchTemplates} checked={isCheckedTemplates} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" /><span className="text-sm">Manage templates</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchMarketplace} checked={isCheckedMarketplace} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Manage marketplace</span></div>
                  </div>
                  {/* Column 2 */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchInvoices} checked={isCheckedInvoices} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" /><span className="text-sm">Manage invoices</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchJobRecurrences} checked={isCheckedJobRecurrences} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Manage job recurrences</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchRatesTimeEntries} checked={isCheckedRatesTimeEntries} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Manage rates in time entries</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchAllAccounts} checked={isCheckedAllAccounts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" /><span className="text-sm">View all accounts</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchCustomFields} checked={isCheckedCustomFields} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Manage custom fields</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchTeammates} checked={isCheckedTeammates} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Manage teammates</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchAllContacts} checked={isCheckedAllContacts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" /><span className="text-sm">View all contacts</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchProposals} checked={isCheckedProposals} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" /><span className="text-sm">Manage proposals</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchEmail} checked={isCheckedEmail} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Mute emails</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchOrgnizerAnswers} checked={isCheckedOrgnizerAnswers} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Edit organizer answers</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchDocuments} checked={isCheckedDocuments} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Manage documents</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchTranscripts} checked={isCheckedTranscripts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">Manage IRS Transcripts</span></div>
                    <div className="flex items-center gap-2.5"><Switch onChange={handleSwitchViewReporting} checked={isCheckedViewReporting} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" disabled /><span className="text-sm">View reporting</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
        <FormDrawerFooter>
          <Button variant="outline" onClick={handleNewDrawerClose}>Cancel</Button>
          <Button onClick={handleUpdateTeamMember}>Save</Button>
        </FormDrawerFooter>
      </FormDrawer>
      <ToastContainer position="top-right" autoClose={3000} />
    </FormPage>
  );
};

export default UpdateTeamMember;

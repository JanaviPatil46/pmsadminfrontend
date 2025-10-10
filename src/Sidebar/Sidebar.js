import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Drawer,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,Popover
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Brightness4,
  Brightness7,
  Task,
  NotificationAddRounded,
} from "@mui/icons-material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import iconMapping from "./icons/index";
import Logo from "../Images/Logo.svg";
import { FaBars } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
// import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import ContactForm from "../Contact/ContactForm";
import AccountForm from "../Contact/AccountForm";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { AiOutlineLogout } from "react-icons/ai";
import { LoginContext } from "../Sidebar/Context/Context";
import { useLocation } from "react-router-dom";
import TaskForm from "../Tasks/AccountTask";
import { IoMoonOutline } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";
import { VscColorMode } from "react-icons/vsc";
import user from "../Images/user.jpg";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import CloseIcon from "@mui/icons-material/Close";
// import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import SearchComponent from "./Search";
import { useDispatch } from "react-redux";
// import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import ClientSelectionDialog from "../Billing/ClientSelectionDialog";
import { faL } from "@fortawesome/free-solid-svg-icons";
import OrganizerDialog from "../Pages/Organizers/ClientSelectionDialog";
import ChatForm from "../Pages/ChatForm";
import JobDrawer from "../Jobs/JobDrawer";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InvoiceDrawer from "../Billing/InvoiceDrawer";
import {
  resetForm,
  setAccountData,
  setSelectedContacts,
  removeSelectedContact,
} from "../redux/accountContactSlice";
import AccountDrawer from "../components/AccountContactForm/Drawer"
function Sidebar() {
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));
  const location = useLocation();
  const navigate = useNavigate();
   const dispatch = useDispatch();
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const SIDEBAR_API = process.env.REACT_APP_SIDEBAR_URL;
  const NEW_SIDEBAR_API = process.env.REACT_APP_SIDEBAR_URL;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([]);
  const [newSidebarItems, setNewSidebarItems] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [rightDrawerContent, setRightDrawerContent] = useState(null);
  
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  const fetchSidebarData = async () => {
    try {
      const response = await axios.get(`${SIDEBAR_API}/api/`);
      let sidebarData = response.data;

      // Retrieve team member data from localStorage
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      const userRole = localStorage.getItem("userRole");

      console.log(storedData);
      if (storedData && storedData.teammember) {
        // const { manageTags } = teamMemberData.teammember;
        const {
          manageTags,
          manageServices,
          managePipelines,
          viewAllContacts,
          manageTemplates,
          manageProposals,
          viewallAccounts,
        } = storedData.teammember;

        // Filter or modify sidebar items based on manageTags
        const updatedSidebarData = sidebarData
          .map((item) => {
            // Remove the `Teams & plans` submenu if the user role is TeamMember
            if (
              userRole === "TeamMember" &&
              item.label === "Templates" &&
              item.submenu
            ) {
              item.submenu = item.submenu.filter(
                (subItem) => subItem.label !== "Teams & Plans"
              );
            }
            if (
              userRole === "TeamMember" &&
              item.label === "Settings" &&
              item.submenu
            ) {
              item.submenu = item.submenu.filter(
                (subItem) => subItem.label !== "Firm Settings"
              );
            }
            // Remove the `NewTags` submenu if manageTags is false
            if (item.submenu && item.submenu.length > 0) {
              item.submenu = item.submenu.filter(
                (subItem) =>
                  !(
                    (subItem.label === "Tags" && !manageTags) ||
                    (subItem.label === "Services" && !manageServices) ||
                    (subItem.label === "Pipeline Templates" &&
                      !managePipelines) ||
                    (subItem.label === "Firm Templates" && !manageTemplates) ||
                    (subItem.label === "Contacts" && !viewAllContacts) ||
                    (subItem.label === "Proposal&Els" && !manageProposals) ||
                    (subItem.label === "Invoices" && !viewallAccounts)
                  )
              );
            }

            // If the parent item is NewTags and manageTags is false, exclude it
            if (
              (item.label === "Tags" && !manageTags) ||
              (item.label === "Services" && !manageServices) ||
              (item.label === "Pipeline Templates" && !managePipelines) ||
              (item.label === "Firm Templates" && !manageTemplates) ||
              (item.label === "Contacts" && !viewAllContacts) ||
              (item.label === "Proposal&Els" && !manageProposals) ||
              (item.label === "Invoices" && !viewallAccounts)
            ) {
              return null;
            }

            return item;
          })
          .filter(Boolean); // Remove null entries
        setSidebarItems(updatedSidebarData);
        console.log("sidebar", updatedSidebarData);
      } else {
        setSidebarItems(sidebarData);
        console.log("side", sidebarData);
      }
    } catch (error) {
      console.error("Error fetching sidebar data:", error);
    }
  };

  // }, []);

//   useEffect(() => {
//     if (isDrawerOpen) {
//       const fetchNewSidebarData = async () => {
//         try {
//           const response = await axios.get(`${NEW_SIDEBAR_API}/newsidebar/`);
//           let NewSidebarData = response.data;
// console.log("newsidebardata", NewSidebarData)
//           // Retrieve team member data if the user is a team member
//           const teamMemberData = JSON.parse(
//             localStorage.getItem("teamMemberData")
//           );
//           if (teamMemberData) {
           

//             NewSidebarData = NewSidebarData.map((item) => {
//               if (
//                 item.label === "Account" &&
//                 !teamMemberData.teammember.manageAccounts
//               ) {
//                 return { ...item, restricted: true };
//               }
//               if (
//                 item.label === "Contact" &&
//                 !teamMemberData.teammember.manageContacts
//               ) {
//                 return { ...item, restricted: true };
//               }
//               if (
//                 item.label === "Jobs" &&
//                 !teamMemberData.teammember.managePipelines
//               ) {
//                 return { ...item, restricted: true };
//               }
//               if (
//                 item.label === "Organizer" &&
//                 !teamMemberData.teammember.manageOrganizers
//               ) {
//                 return { ...item, restricted: true };
//               }
//               if (
//                 item.label === "Invoice" &&
//                 !teamMemberData.teammember.manageInvoices
//               ) {
//                 return { ...item, restricted: true };
//               }
//               return item;
//             });
//           }

//           setNewSidebarItems(NewSidebarData);
//         } catch (error) {
//           console.error("Error fetching new sidebar data:", error);
//         }
//       };

//       fetchNewSidebarData();
//     }
//   }, [isDrawerOpen]);

   useEffect(() => {
  if (isDrawerOpen) {
    const fetchNewSidebarData = async () => {
      try {
        const response = await axios.get(`${NEW_SIDEBAR_API}/newsidebar/`);
        let NewSidebarData = response.data;
        console.log("newsidebardata", NewSidebarData);

        // Get team member permissions from localStorage
        const teamMemberData = JSON.parse(
          localStorage.getItem("teamMemberData")
        );

        if (teamMemberData && teamMemberData.teammember) {
          // Apply restrictions only if team member exists
          NewSidebarData = NewSidebarData.map((item) => {
            if (
              item.label === "Account" &&
              !teamMemberData.teammember.manageAccounts
            ) {
              return { ...item, restricted: true };
            }
            if (
              item.label === "Contact" &&
              !teamMemberData.teammember.manageContacts
            ) {
              return { ...item, restricted: true };
            }
            if (
              item.label === "Jobs" &&
              !teamMemberData.teammember.managePipelines
            ) {
              return { ...item, restricted: true };
            }
            if (
              item.label === "Organizer" &&
              !teamMemberData.teammember.manageOrganizers
            ) {
              return { ...item, restricted: true };
            }
            if (
              item.label === "Invoice" &&
              !teamMemberData.teammember.manageInvoices
            ) {
              return { ...item, restricted: true };
            }
            return item;
          });
        } else {
          console.log("No team member data found — showing all items");
        }

        setNewSidebarItems(NewSidebarData);
      } catch (error) {
        console.error("Error fetching new sidebar data:", error);
      }
    };

    fetchNewSidebarData();
  }
}, [isDrawerOpen]);

  const handleToggleSidebar = () => {
    if (isSmallScreen) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };
  
  const handleToggleSubmenu = (menuId, label) => {
    setOpenMenu((prevMenu) => (prevMenu === menuId ? null : menuId)); // Toggle submenu
  };
  
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsOrganizerDialogOpen(false);
  };

  const handleNewDrawerClose = () => {
    setIsRightDrawerOpen(false);

     dispatch(resetForm());
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOrganizerDialogOpen, setIsOrganizerDialogOpen] = useState(false);
// Get accountId from cookie

const [isInvoiceDrawerOpen, setIsInvoiceDrawerOpen] = useState(false);
// const [selectedAccount, setSelectedAccount] = useState(null);
const handleNewItemClick = (label) => {
  console.log("menu", label);
  const accountIdFromCookie = Cookies.get("accountId");
const accountNameFromCppkie =Cookies.get("accountName")
  if (
    label === "Account" ||
    label === "Contact" ||
    label === "Task" ||
    label === "Chat" ||
    label === "Jobs"
  ) {
    setRightDrawerContent(label);
    setIsRightDrawerOpen(true);
  } else if (label === "Invoice") {
    if (accountIdFromCookie && accountNameFromCppkie) {
      // If account ID exists in cookies, directly open the invoice drawer
      setSelectedAccount({
        value: accountIdFromCookie,
        label: accountNameFromCppkie // Temporary label until we fetch the name
      });
      setIsInvoiceDrawerOpen(true);
    } else {
      // Show client selection dialog
      setIsDialogOpen(true);
    }
  
  } else if (label === "Organizer") {
    setIsOrganizerDialogOpen(true);
  }
};

  const [theme, setTheme] = useState("light-theme");
  const toggleTheme = () => {
    if (theme === "dark-theme") {
      setTheme("light-theme");
    } else {
      setTheme("dark-theme");
    }
  };
  useEffect(() => {
    document.body.className = theme; // Apply the theme to the body
  }, [theme]);

  //Logout
  const { logindata, setLoginData } = useContext(LoginContext);

  const history = useNavigate();

  const logoutuser = async () => {
    let token = localStorage.getItem("usersdatatoken");
    const url = `${LOGIN_API}/common/login/logout/`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const res = await fetch(url, requestOptions);

    const data = await res.json();

    if (data.status === 200) {
      console.log("user logout");
      localStorage.removeItem("usersdatatoken");
      localStorage.removeItem("teamMemberData");
      localStorage.removeItem("userRole");
      Cookies.remove("userToken");
      setLoginData(false);

      history("/login");
    } else {
      console.log("error");
    }
  };
  const [data, setData] = useState(false);
  const [loginsData, setloginsData] = useState("");
  const [emailSyncEmail,setEmailSyncEmail]= useState("")
  const [loading, setLoading] = useState(true);
  // const DashboardValid = async () => {
  //   let token = localStorage.getItem("usersdatatoken");
  //   // Cookies.set("userToken", res.result.token); // Set cookie with duration provided
  //   console.log("userToken",token);
  //   const url = `${LOGIN_API}/common/login/verifytoken/`;
  //   const res = await fetch(url, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token,
  //     },
  //   });

  //   //console.log(token);

  //   const data = await res.json();
  //   //console.log(data);
  //   if (data.message === "Invalid token") {
  //     // console.log("error page");
  //     navigate("/login");
  //   } else {
  //     // console.log("user verify");
  //     setLoginData(data);
  //     setloginsData(data.user.id);

  //     console.log("User role:", data.user.role);

  //     if (data.user.role === "Admin") {
  //       localStorage.setItem("userRole", data.user.role);
  //       fetchUserData(data.user.id);
  //       // getadminsignup(data.user.id)
  //       fetchSidebarData();
  //       navigate("/");
  //     }

     
  //     else if (data.user.role === "TeamMember") {
  //       localStorage.setItem("userRole", data.user.role);
  //       fetchUserData(data.user.id);
  //       fectUsersDatabyUserid(data.user.id);
  //       navigate("/");
  //     } else {
  //       toast.error("You are not valid user.");
  //       setTimeout(() => {
  //         navigate("/login");
  //       }, 1000);
  //     }
  //   }
  // };
  // useEffect(() => {
  //   DashboardValid();
  //   setData(true);
  // }, []);

useEffect(() => {
  const validateAndFetch = async () => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      console.log("fghfhf",token)
      // if (!token) {
      //   window.location.href = `${EMAIL_SYNC}/emailsync/auth/google`;
      //   return;
      // }

      const res = await fetch(`${LOGIN_API}/common/login/verifytoken/`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token },
      });

      const data = await res.json();

      if (data.message === "Invalid token") {
        navigate("/login");
      }

      // token valid → fetch user data
      setLoginData(data);
      setloginsData(data.user.id);
      localStorage.setItem("userRole", data.user.role);
//       fetchUserData(data.user.id);
// fectUsersDatabyUserid(data.user.id)
 // ✅ Role-based logic
      if (data.user.role === "Admin") {
        fetchUserData(data.user.id);
        fetchSidebarData();
        // navigate("/");
      } else if (data.user.role === "TeamMember") {
        fetchUserData(data.user.id);
        fectUsersDatabyUserid(data.user.id);
        // navigate("/");
      } else {
        toast.error("You are not a valid user.");
        setTimeout(() => navigate("/login"), 1000);
        return;
      }
      // fetch emails
      if (emailSyncEmail) {
        const emailRes = await axios.get(
          `${EMAIL_SYNC}/emailsync/user/login-with-token/${emailSyncEmail}`
        );

        if (emailRes.data?.redirectUrl) {
          window.location.href = `${EMAIL_SYNC}/emailsync/auth/google`;
          return;
        }
        setEmails(emailRes.data?.emails || []);
      }

      setLoading(false); // finished validation
    } catch (err) {
      console.error("Validation failed", err);
      // window.location.href = `${EMAIL_SYNC}/emailsync/auth/google`;
    }
  };

  validateAndFetch();
}, [emailSyncEmail]);
// Call this on component mount
useEffect(() => {
  // validateAndFetch();
  setData(true)
}, []);
  const [userData, setUserData] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [userid, setUserid] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [preview, setPreview] = useState(currentImage);

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
  
  const fetchUserData = async (id) => {
    const maxLength = 15;
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url , requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("id", result);
        if (result.username) {
          setUsername(result.username);
        }
        if (result.email) {
          setUserData(truncateString(result.email, maxLength)); // Set a maximum length for userData if email exists
          setUserEmail(result.email);
        }

        // console.log(userData)
        setEmailSyncEmail(result.emailSyncEmail)
        setUserid(result._id);
        setCurrentImage(result.profilePicture);
      });
  };

  const fectUsersDatabyUserid = (userid) => {
    console.log("janavi", userid);
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/admin/teammemberbyuserid/${userid}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // Store result in local storage
        localStorage.setItem("teamMemberData", JSON.stringify(result));

        
        fetchSidebarData();
       
      })
      .catch((error) => console.error(error));
  };

  const truncateString = (str, maxLength) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + "..."; // Truncate string if it exceeds maxLength
    } else {
      return str;
    }
  };

const [anchorEl, setAnchorEl] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
   const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setDropdownOpen(!isDropdownOpen);
  };
 const handleCloseDropdown = () => {
    setAnchorEl(null);
    setDropdownOpen(false);
  };
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
  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    return nameParts
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [invoiceDrawerOpen, setInvoiceDrawerOpen] = useState(false);
  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    console.log("selected account data", account);
    setInvoiceDrawerOpen(true); // Open right drawer when an account is selected
    setIsDialogOpen(false); // Close the client selection dialog
  };

  const unreadHashEmailCount = Cookies.get("unreadHashEmailCount");
  console.log("Stored unread count:", unreadHashEmailCount);


  //chek inbox email working 
   const EMAIL_SYNC = process.env.REACT_APP_EMAILSYNC_API;
 // redirect to google login
  const [emails, setEmails] = useState([]);
  // const [loading, setLoading] = useState(false);
const [fetchError, setFetchError] = useState("");


 
  return (
    <div className="grid-container">
      <header className="header">
        <Box
          component="header"
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box className="bar-icon">
            <FaBars
              onClick={handleToggleSidebar}
              style={{ fontSize: "1.7rem" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 3,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box>
              <FaPlusCircle className="add-icon" onClick={handleDrawerOpen} />
            </Box>

          
          </Box>

          <Box>
            <SearchComponent />
          </Box>
         
          <Box
            ml={"auto"}
            mr={3}
            sx={{ display: "flex", alignItems: "center", gap: 3 }}
          >
            

            <Link to="#" className="logout-link">
              <Box className="info">
                <Box
                  onClick={toggleDropdown}
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    
                    <Avatar
                      src={preview || currentImage}
                      sx={{
                        width: 40,
                        height: 40,
                        border: "2px solid #eee",
                      }}
                    />
                  </StyledBadge>
                  <Box ml={2}>
                    <Typography
                      style={{ fontWeight: "bold", fontSize: "12px" }}
                    >
                      {username}
                    </Typography>
                    <Typography style={{ fontSize: "10px", color: "#666" }}>
                      {userData}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Link>
          </Box>
          {/* {isDropdownOpen && (
            
            <Box
              sx={{
                position: "absolute",
                top: "100px",
                right: "20px",
                width: "250px",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "10px",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar
                    src={preview || currentImage}
                    sx={{
                      width: 40,
                      height: 40,
                      border: "2px solid #eee",
                    }}
                  />
                </StyledBadge>
                <Box>
                  <Typography
                    sx={{ fontWeight: "600", fontSize: "13px", color: "#333" }}
                  >
                    {username}
                  </Typography>
                  <Typography sx={{ fontSize: "11px", color: "#777" }}>
                    {userEmail}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ borderTop: "1px solid #eee" }} />

              <Box sx={{ padding: "14px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    color: "red",
                    fontWeight: "500",
                    padding: "8px",
                    borderRadius: "6px",
                    transition: "background 0.3s",
                    "&:hover": {
                      backgroundColor: "#f8d7da",
                    },
                  }}
                  onClick={logoutuser}
                >
                  <AiOutlineLogout size={18} />
                  <Typography sx={{ fontSize: "13px" }}>Log out</Typography>
                </Box>
              </Box>
            </Box>
          )} */}
           <Popover
                                open={isDropdownOpen}
                                anchorEl={anchorEl}
                                onClose={handleCloseDropdown}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "left",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                                sx={{mt:2}}
                              >
                               <Box
                sx={{
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar
                    src={preview || currentImage}
                    sx={{
                      width: 40,
                      height: 40,
                      border: "2px solid #eee",
                    }}
                  />
                </StyledBadge>
                <Box>
                  <Typography
                    sx={{ fontWeight: "600", fontSize: "13px", color: "#333" }}
                  >
                    {username}
                  </Typography>
                  <Typography sx={{ fontSize: "11px", color: "#777" }}>
                    {userEmail}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ borderTop: "1px solid #eee" }} />

              <Box sx={{ padding: "14px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    color: "red",
                    fontWeight: "500",
                    padding: "8px",
                    borderRadius: "6px",
                    transition: "background 0.3s",
                    "&:hover": {
                      backgroundColor: "#f8d7da",
                    },
                  }}
                  onClick={logoutuser}
                >
                  <AiOutlineLogout size={18} />
                  <Typography sx={{ fontSize: "13px" }}>Log out</Typography>
                </Box>
              </Box>
                              </Popover>
        </Box>
      </header>

      <aside
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isSidebarVisible ? "show" : ""}`}
      >
        <IconButton onClick={handleToggleSidebar} className="toggle-button">
          {isCollapsed ? (
            <ChevronRight className="toggle-icon" />
          ) : (
            <ChevronLeft className="toggle-icon" />
          )}
        </IconButton>
        <Box
          component="aside"
          style={{
            width: isCollapsed ? "50px" : "225px",
            padding: 5,
            transition: "width 0.3s",
          }}
        >
          <Box
            sx={{
              pt: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              gap: 1,
            }}
          >
            <img
              src={Logo}
              alt="logo"
              style={{ height: "40px", display: "block" }}
            />
            {!isCollapsed && (
              <Typography variant="h5" className="company-name-text">
                SNP
              </Typography>
            )}
          </Box>
         

          <Box
            className="sidebar-contents"
            sx={{ mt: 2, height: "85vh", overflowY: "auto" }}
          >
            <List sx={{ cursor: "pointer" }}>
              {sidebarItems.map((item) => {
                const isActiveMenu =
                  (item.path !== "/" &&
                    location.pathname.startsWith(item.path)) ||
                  (item.path === "/" && location.pathname === "/") ||
                  item.submenu.some((subItem) =>
                    location.pathname.startsWith(subItem.path)
                  );

                return (
                  <Box key={item._id}>
                    <ListItem
                      onClick={() => handleToggleSubmenu(item._id, item.label)}
                      component={Link}
                      to={item.path}
                      className="menu-item"
                      sx={{
                        mt: 1,
                        borderRadius: "10px",
                        padding: "4px 6px",
                        // border:'1px solid red',
                        backgroundColor: isActiveMenu
                          ? "#E0F7FA"
                          : "transparent",
                        transition: "background-color 0.3s, color 0.3s",
                        "&:hover": {
                          color: "#fff",
                          backgroundColor: "#00ACC1",
                          ".menu-icon": { color: "#fff" },
                          ".menu-text": { color: "#fff" },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ fontSize: "1.2rem" }}
                        className="menu-icon"
                      >
                        {iconMapping[item.icon]
                          ? React.createElement(iconMapping[item.icon])
                          : null}
                      </ListItemIcon>
                      {!isCollapsed && (
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: "0.9rem", // Adjust size for submenu text
                            fontWeight: 400, // Optional: control weight
                          }}
                          sx={{ ml: -3 }}
                          className="menu-text"
                        />
                      )}
                      {!isCollapsed && item.submenu.length > 0 && (
                        <ListItemIcon sx={{ justifyContent: "end" }}>
                          {openMenu === item._id ? (
                            <ExpandLess className="menu-icon" />
                          ) : (
                            <ExpandMore className="menu-icon" />
                          )}
                        </ListItemIcon>
                      )}
                    </ListItem>

                    {item.submenu.length > 0 && (
                      <Collapse in={openMenu === item._id}>
                        <List component="div" disablePadding>
                          {item.submenu.map((subItem) => {
                            const isActiveSubmenu =
                              location.pathname.startsWith(subItem.path);

                            return (
                              <ListItem
                                key={subItem.path}
                                component={Link}
                                to={subItem.path}
                                className="menu-item"
                                sx={{
                                  mt: 1,
                                  padding: "4px 6px",
                                  borderRadius: "10px",
                                  backgroundColor: isActiveSubmenu
                                    ? "#E0F7FA"
                                    : "transparent",
                                  color: "black",
                                  pl: 4,
                                  transition:
                                    "background-color 0.3s, color 0.3s",
                                  "&:hover": {
                                    color: "#fff",
                                    backgroundColor: "#00ACC1",
                                    ".menu-icon": { color: "#fff" },
                                    ".menu-text": { color: "#fff" },
                                  },
                                }}
                              >
                                <ListItemIcon
                                  sx={{ fontSize: "1.2rem" }}
                                  className="menu-icon"
                                >
                                  {iconMapping[subItem.icon]
                                    ? React.createElement(
                                        iconMapping[subItem.icon]
                                      )
                                    : null}
                                </ListItemIcon>
                                {!isCollapsed && (
                                  <ListItemText
                                    primary={subItem.label}
                                    primaryTypographyProps={{
                                      fontSize: "0.9rem", // Adjust size for submenu text
                                      fontWeight: 400, // Optional: control weight
                                    }}
                                    sx={{ ml: -2 }}
                                    className="menu-text"
                                  />
                                )}
                              </ListItem>
                            );
                          })}
                        </List>
                      </Collapse>
                    )}
                  </Box>
                );
              })}
            </List>

          
          </Box>
        </Box>
      </aside>
      <main className="main">
        <Box component="main">
          <Outlet />
        </Box>
      </main>
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 200, p: 2, height: "100%" }} className="newSidebar">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <FaPlus /> New
            </Typography>
            <RxCross2
              onClick={handleDrawerClose}
              style={{ cursor: "pointer" }}
            />
          </Box>
          <List>
            {newSidebarItems.map((item) => (
              <ListItem
                key={item._id}
                component={Link}
                to={item.path}
                className="menu-item"
                onClick={(e) => {
                  if (item.restricted) {
                    e.preventDefault(); // Prevent navigation
                    toast.error("Access to this feature is restricted.");
                  } else {
                    handleNewItemClick(item.label);
                  }
                }}
                sx={{
                  mt: 1, // margin-top: 8px
                  borderRadius: "10px",
                  padding: "4px 6px",
                  color: "black",
                  transition: "background-color 0.3s, color 0.3s",
                  "&:hover": {
                    color: item.restricted ? "grey" : "#fff",
                    backgroundColor: item.restricted ? "" : "#00ACC1",
                    ".menu-icon": {
                      color: item.restricted ? "grey" : "#fff",
                    },
                    ".menu-text": {
                      color: item.restricted ? "grey" : "#fff",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    fontSize: "1.2rem",
                    color: item.restricted ? "grey" : "#00ACC1",
                  }}
                  className="menu-icon"
                >
                  {iconMapping[item.icon]
                    ? React.createElement(iconMapping[item.icon])
                    : null}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  className="menu-text"
                  primaryTypographyProps={{
                    fontSize: "0.9rem", // Adjust size for submenu text
                    fontWeight: 400, // Optional: control weight
                  }}
                  sx={{ color: item.restricted ? "grey" : "inherit" }}
                />
              </ListItem>
            ))}
          </List>
          
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={isRightDrawerOpen}
        onClose={handleNewDrawerClose}
        classes={{ paper: "custom-right-drawer" }}
      >
        <Box sx={{ width: isSmallScreen ? "100vw" : 650 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></Box>
          {rightDrawerContent === "Account" && (
           
            <AccountDrawer
               handleNewDrawerClose={handleNewDrawerClose}
              handleDrawerClose={handleDrawerClose}
              />
          )}
          {rightDrawerContent === "Contact" && (
            <ContactForm
              handleNewDrawerClose={handleNewDrawerClose}
              handleDrawerClose={handleDrawerClose}
            />
          )}
          {rightDrawerContent === "Task" && (
            <TaskForm
              handleNewDrawerClose={handleNewDrawerClose}
              handleDrawerClose={handleDrawerClose}
            />
          )}
          {rightDrawerContent === "Chat" && (
            <ChatForm
              handleNewDrawerClose={handleNewDrawerClose}
              handleDrawerClose={handleDrawerClose}
            />
          )}

          {rightDrawerContent === "Jobs" && (
            <JobDrawer
              handleNewDrawerClose={handleNewDrawerClose}
              handleDrawerClose={handleDrawerClose}
            />
          )}
        </Box>
      </Drawer>

      <ClientSelectionDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        handleDrawerClose={handleDrawerClose}
      />

<InvoiceDrawer
  isDrawerOpen={isInvoiceDrawerOpen}
  setDrawerOpen={setIsInvoiceDrawerOpen}
  selectedAccount={selectedAccount}
  handleDrawerClose={() => setIsInvoiceDrawerOpen(false)}
  leftsidebarDrawer={handleDrawerClose}
/>
      <OrganizerDialog
        open={isOrganizerDialogOpen}
        onClose={() => setIsOrganizerDialogOpen(false)}
        handleDrawerClose={handleDrawerClose}
      />
    </div>
  );
}

export default Sidebar;

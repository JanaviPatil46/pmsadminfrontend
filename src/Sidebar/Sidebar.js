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
  CircularProgress,
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
// import Logo from "../Images/Logo.svg";
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
import Stack from "@mui/material/Stack";
import SearchComponent from "./Search";
import { useDispatch } from "react-redux";
import { Avatar as ShadAvatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Popover as ShadPopover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { Badge as ShadBadge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/ui/tooltip";
import ClientSelectionDialog from "../Billing/ClientSelectionDialog";
import { faL } from "@fortawesome/free-solid-svg-icons";
import OrganizerDialog from "../Pages/Organizers/ClientSelectionDialog";
import ChatForm from "../Pages/ChatForm";
import FullLogo from "../Images/snp.png";
import Logo from "../Images/only s.png";
import JobDrawer from "../Jobs/JobDrawer";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InvoiceDrawer from "../Billing/InvoiceDrawer";
import {
  resetForm,
  setAccountData,
  setSelectedContacts,
  removeSelectedContact,
} from "../redux/accountContactSlice";
import AccountDrawer from "../components/AccountContactForm/Drawer";
import AccountContactDrawer from "../AccountContactForm/AccountContactDrawer";
import { use } from "react";

const getInitials = (str = "") => {
  const clean = str.replace(/<.*?>/g, "").trim();
  const parts = clean.split(/[\s@]+/);
  return (
    ((parts[0]?.[0] || "?") + (parts[1]?.[0] || "")).toUpperCase()
  );
};

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
const [inboxCount, setInboxCount]=useState(0);
  useEffect(() => { 
   

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://www.snptaxes.com/emailsync/messagesList/messages/unread-count',
  headers: { }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  setInboxCount(response.data.unreadCount);
})
.catch((error) => {
  console.log(error);
});

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
  const handleCloseDrawers = () => {
    handleDrawerClose();
    handleNewDrawerClose();
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOrganizerDialogOpen, setIsOrganizerDialogOpen] = useState(false);
  // Get accountId from cookie
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [isInvoiceDrawerOpen, setIsInvoiceDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [accountList, setAccountList] = useState([]);
  const [filterStatus, setFilterStatus] = useState("active");
  const [viewAllAccounts, setViewAllAccounts] = useState(false);
  // const [loading, setLoading] = useState(false);
  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    console.log("Fetched userRole from localStorage:", storedUserRole);
    setUserRole(storedUserRole);
  }, []);
  const fetchAccountsList = async () => {
    setLoading(true);
    try {
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      console.log("Received stored teamMemberData:", storedData);

      const loginuserid = storedData?.teammember?.userid;
      // const userRole = storedData?.teammember?.userrole || "Admin";
      console.log("User role is:", userRole);

      let url;

      if (userRole === "Admin") {
        url = `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`;
      } else if (userRole === "TeamMember") {
        const viewAll = storedData?.teammember?.viewallAccounts || false;
        setViewAllAccounts(viewAll);

        if (viewAll) {
          url = `https://www.snptaxes.com/api/accounts/list?active=${filterStatus === "active"}`;
        } else {
          url = `https://www.snptaxes.com/api/accounts/byTeam?userId=${loginuserid}&active=${filterStatus === "active"}`;
        }
      }

      console.log("Fetching from URL:", url);
      const response = await axios.get(url);
      setAccountList(response.data.accountlist || []);
    } catch (err) {
      console.error("Error loading accounts:", err);
      setAccountList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsList();
  }, [filterStatus, userRole]);
  // const [selectedAccount, setSelectedAccount] = useState(null);
  // const handleNewItemClick = (label) => {
  //   console.log("menu", label);
  //   const accountIdFromCookie = Cookies.get("accountId");
  //   const accountNameFromCppkie = Cookies.get("accountName");
  //   if (
  //     label === "Account" ||
  //     label === "Contact" ||
  //     label === "Task" ||
  //     label === "Chat" ||
  //     label === "Jobs"
  //   ) {
  //     setRightDrawerContent(label);
  //     setIsRightDrawerOpen(true);
  //   } else if (label === "Invoice") {
  //     if (accountIdFromCookie && accountNameFromCppkie) {
  //       // If account ID exists in cookies, directly open the invoice drawer
  //       setSelectedAccount({
  //         value: accountIdFromCookie,
  //         label: accountNameFromCppkie, // Temporary label until we fetch the name
  //       });
  //       setIsInvoiceDrawerOpen(true);
  //     } else {
  //       // Show client selection dialog
  //       setIsDialogOpen(true);
  //     }
  //   } else if (label === "Organizer") {
  //     setIsOrganizerDialogOpen(true);
  //   }
  // };
  const handleNewItemClick = (label) => {
    console.log("menu", label);

    if (label === "Account") {
      // Create Account → no ID
      setSelectedAccountId(null);
      setIsAccountDrawerOpen(true);
      return;
    }

    if (
      label === "Contact" ||
      label === "Task" ||
      label === "Chat" ||
      label === "Jobs"
    ) {
      setRightDrawerContent(label);
      setIsRightDrawerOpen(true);
    } else if (label === "Invoice") {
      const accountId = Cookies.get("accountId");
      const accountName = Cookies.get("accountName");

      if (accountId && accountName) {
        setSelectedAccount({
          value: accountId,
          label: accountName,
        });
        setIsInvoiceDrawerOpen(true);
      } else {
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
  const [emailSyncEmail, setEmailSyncEmail] = useState("");
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
        console.log("fghfhf", token);
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
    setData(true);
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
    fetch(url, requestOptions)
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
        setEmailSyncEmail(result.emailSyncEmail);
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
    <TooltipProvider delayDuration={200}>
    <div className="grid-container">
      <header className="header">
        <Box
          component="header"
          sx={{
            px: 2.5,
            py: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: 2,
          }}
        >
          <Box className="bar-icon">
            <FaBars
              onClick={handleToggleSidebar}
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <FaPlusCircle className="add-icon" onClick={handleDrawerOpen} />
          </Box>

          <Box sx={{ flex: 1, maxWidth: 420 }}>
            <SearchComponent />
          </Box>

          <Box ml="auto" sx={{ display: "flex", alignItems: "center" }}>
            <ShadPopover open={isDropdownOpen} onOpenChange={setDropdownOpen}>
              <PopoverTrigger asChild>
                <div className="header-user-chip">
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <ShadAvatar className="h-9 w-9 border-2 border-[rgba(0,172,193,0.25)]">
                      <AvatarImage src={preview || currentImage} alt={username} />
                      <AvatarFallback className="bg-[rgba(0,172,193,0.15)] text-[#00ACC1] text-xs font-semibold">
                        {getInitials(username)}
                      </AvatarFallback>
                    </ShadAvatar>
                  </StyledBadge>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: "12px", lineHeight: 1.3 }}>
                      {username}
                    </Typography>
                    <Typography sx={{ fontSize: "10px", color: "#888", lineHeight: 1.2 }}>
                      {userData}
                    </Typography>
                  </Box>
                </div>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={8}
                className="p-0 w-[230px] rounded-xl shadow-xl overflow-hidden border border-[rgba(0,172,193,0.15)]"
              >
                <div className="popover-header">
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <ShadAvatar className="h-11 w-11 border-2 border-[rgba(0,172,193,0.3)]">
                      <AvatarImage src={preview || currentImage} alt={username} />
                      <AvatarFallback className="bg-[rgba(0,172,193,0.15)] text-[#00ACC1] text-sm font-semibold">
                        {getInitials(username)}
                      </AvatarFallback>
                    </ShadAvatar>
                  </StyledBadge>
                  <div>
                    <p className="font-semibold text-[13px] leading-tight">{username}</p>
                    <p className="text-[11px] text-gray-500 leading-tight">{userEmail}</p>
                  </div>
                </div>
                <Separator className="opacity-40" />
                <div className="popover-logout-row" onClick={logoutuser}>
                  <AiOutlineLogout size={17} />
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>Log out</span>
                </div>
              </PopoverContent>
            </ShadPopover>
          </Box>
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
            width: isCollapsed ? "58px" : "230px",
            padding: isCollapsed ? "0 4px" : "0 8px",
            transition: "width 0.25s ease",
          }}
        >
          <Box
            sx={{
              pt: 2.5,
              pb: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
              px: isCollapsed ? 0 : 0.5,
              borderBottom: "1px solid rgba(0,172,193,0.1)",
              mb: 1,
            }}
          >
            {isCollapsed ? (
              <img
                src={Logo}
                alt="logo"
                style={{ height: "36px", display: "block" }}
              />
            ) : (
              <img
                src={FullLogo}
                alt="logo"
                style={{ height: "56px", display: "block", width: "88%" }}
              />
            )}
          </Box>

          {/* <Box
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
          </Box> */}

          {/* inbox with badge */}

          {/* <Box
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
          </Box>  */}

          <Box
            className="sidebar-contents"
            sx={{ mt: 1, height: "85vh", overflowY: "auto" }}
          >
            <List sx={{ cursor: "pointer", px: 0.5 }}>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ListItem
                          onClick={() => handleToggleSubmenu(item._id, item.label)}
                          component={Link}
                          to={item.path}
                          className={`menu-item ${isActiveMenu ? "menu-item-active" : ""}`}
                          sx={{
                            mt: 0.5,
                            borderRadius: "8px",
                            padding: "6px 8px",
                            backgroundColor: isActiveMenu
                              ? "rgba(0,172,193,0.09)"
                              : "transparent",
                            transition: "background-color 0.2s ease, color 0.2s ease",
                            "&:hover": {
                              backgroundColor: isActiveMenu
                                ? "rgba(0,172,193,0.15)"
                                : "rgba(0,172,193,0.07)",
                              ".menu-icon": { color: "#00ACC1" },
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{ fontSize: "1.15rem", minWidth: isCollapsed ? "auto" : 36 }}
                            className="menu-icon"
                          >
                            {iconMapping[item.icon]
                              ? React.createElement(iconMapping[item.icon])
                              : null}
                          </ListItemIcon>

                          {!isCollapsed && (
                            <ListItemText
                              primary={
                                item.label === "Inbox +" ? (
                                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span>{item.label}</span>
                                    <ShadBadge className="bg-green-500 text-white border-0 h-4 text-[10px] px-1.5 rounded-full font-semibold">
                                      {inboxCount}
                                    </ShadBadge>
                                  </span>
                                ) : (
                                  item.label
                                )
                              }
                              primaryTypographyProps={{
                                fontSize: "0.875rem",
                                fontWeight: isActiveMenu ? 600 : 400,
                              }}
                              sx={{ ml: -1 }}
                              className="menu-text"
                            />
                          )}

                          {!isCollapsed && item.submenu.length > 0 && (
                            <ListItemIcon sx={{ justifyContent: "flex-end", minWidth: "auto" }}>
                              {openMenu === item._id ? (
                                <ExpandLess sx={{ fontSize: "1.1rem" }} className="menu-icon" />
                              ) : (
                                <ExpandMore sx={{ fontSize: "1.1rem" }} className="menu-icon" />
                              )}
                            </ListItemIcon>
                          )}
                        </ListItem>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right" className="text-xs font-medium bg-[#00ACC1] text-white border-0">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>

                    {item.submenu.length > 0 && (
                      <Collapse in={openMenu === item._id}>
                        <List component="div" disablePadding sx={{ pl: 0.5 }}>
                          {item.submenu.map((subItem) => {
                            const isActiveSubmenu =
                              location.pathname.startsWith(subItem.path);

                            return (
                              <ListItem
                                key={subItem.path}
                                component={Link}
                                to={subItem.path}
                                className={`menu-item ${isActiveSubmenu ? "menu-item-active" : ""}`}
                                sx={{
                                  mt: 0.5,
                                  padding: "5px 8px",
                                  borderRadius: "8px",
                                  backgroundColor: isActiveSubmenu
                                    ? "rgba(0,172,193,0.09)"
                                    : "transparent",
                                  pl: isCollapsed ? 1 : 3.5,
                                  transition: "background-color 0.2s ease",
                                  "&:hover": {
                                    backgroundColor: isActiveSubmenu
                                      ? "rgba(0,172,193,0.15)"
                                      : "rgba(0,172,193,0.07)",
                                    ".menu-icon": { color: "#00ACC1" },
                                  },
                                }}
                              >
                                <ListItemIcon
                                  sx={{ fontSize: "1rem", minWidth: isCollapsed ? "auto" : 30 }}
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
                                      fontSize: "0.85rem",
                                      fontWeight: isActiveSubmenu ? 600 : 400,
                                    }}
                                    sx={{ ml: -1 }}
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
      <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && handleDrawerClose()}>
        <SheetContent
          side="left"
          className="newSidebar p-0 w-[210px] flex flex-col [&>button]:hidden"
        >
          <SheetHeader className="new-drawer-header">
            <SheetTitle className="new-drawer-title">
              <FaPlus size={12} style={{ color: "#00ACC1" }} />
              <span style={{ fontSize: "0.9rem" }}>Create New</span>
            </SheetTitle>
            <RxCross2
              size={17}
              className="new-drawer-close"
              onClick={handleDrawerClose}
            />
          </SheetHeader>
          <List sx={{ px: 1, pt: 0.5, flex: 1, overflowY: "auto" }}>
            {newSidebarItems.map((item) => (
              <ListItem
                key={item._id}
                component={Link}
                to={item.path}
                className="menu-item"
                onClick={(e) => {
                  if (item.restricted) {
                    e.preventDefault();
                    toast.error("Access to this feature is restricted.");
                  } else {
                    handleNewItemClick(item.label);
                  }
                }}
                sx={{
                  mt: 0.5,
                  borderRadius: "8px",
                  padding: "7px 10px",
                  opacity: item.restricted ? 0.5 : 1,
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    backgroundColor: item.restricted
                      ? "transparent"
                      : "rgba(0,172,193,0.09)",
                    ".menu-icon": {
                      color: item.restricted ? "grey" : "#00ACC1",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    fontSize: "1.1rem",
                    minWidth: 34,
                    color: item.restricted ? "#aaa" : "#00ACC1",
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
                    fontSize: "0.875rem",
                    fontWeight: 400,
                    color: item.restricted ? "#aaa" : "inherit",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </SheetContent>
      </Sheet>
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
          {/* {rightDrawerContent === "Account" && (
            <AccountDrawer
              handleNewDrawerClose={handleNewDrawerClose}
              handleDrawerClose={handleDrawerClose}
              // onClose={handleCloseDrawers}
            />
          )} */}
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
      <AccountContactDrawer
        open={isAccountDrawerOpen}
        onClose={() => setIsAccountDrawerOpen(false)}
        accountId={selectedAccountId} // null → Create, ID → Update
        fetchAccountsList={fetchAccountsList}
        handleDrawerClose={handleDrawerClose}
      />
    </div>
    </TooltipProvider>
  );
}

export default Sidebar;

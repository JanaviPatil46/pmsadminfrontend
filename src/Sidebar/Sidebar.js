import React, { useState, useEffect, useContext } from "react";
import { IconButton, Collapse, Drawer } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import iconMapping from "./icons/index";
import { FaBars, FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import ContactForm from "../Contact/ContactForm";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { AiOutlineLogout } from "react-icons/ai";
import { LoginContext } from "../Sidebar/Context/Context";
import TaskForm from "../Tasks/AccountTask";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import SearchComponent from "./Search";
import { useDispatch } from "react-redux";
import { Avatar as ShadAvatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Popover as ShadPopover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { Separator } from "../components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/ui/tooltip";
import ClientSelectionDialog from "../Billing/ClientSelectionDialog";
import OrganizerDialog from "../Pages/Organizers/ClientSelectionDialog";
import ChatForm from "../Pages/ChatForm";
import FullLogo from "../Images/snp.png";
import Logo from "../Images/only s.png";
import JobDrawer from "../Jobs/JobDrawer";
import InvoiceDrawer from "../Billing/InvoiceDrawer";
import { resetForm } from "../redux/accountContactSlice";
import AccountContactDrawer from "../AccountContactForm/AccountContactDrawer";

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
      {/* Mobile overlay */}
      {isSmallScreen && isSidebarVisible && (
        <div className="sidebar-mobile-overlay visible" onClick={() => setIsSidebarVisible(false)} />
      )}

      <header className="header">
        <div className="flex items-center justify-between w-full h-full px-4 gap-3">
          {/* Mobile hamburger */}
          <div className="bar-icon">
            <button onClick={handleToggleSidebar} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <FaBars size={18} />
            </button>
          </div>

          {/* Create new button */}
          <button onClick={handleDrawerOpen} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
            <FaPlus size={10} />
            <span className="hidden sm:inline">New</span>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-[420px]">
            <SearchComponent />
          </div>

          {/* User chip */}
          <div className="ml-auto flex items-center">
            <ShadPopover open={isDropdownOpen} onOpenChange={setDropdownOpen}>
              <PopoverTrigger asChild>
                <div className="header-user-chip">
                  <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
                    <ShadAvatar className="h-8 w-8 border-2 border-blue-100">
                      <AvatarImage src={preview || currentImage} alt={username} />
                      <AvatarFallback className="bg-blue-50 text-blue-600 text-[11px] font-semibold">
                        {getInitials(username)}
                      </AvatarFallback>
                    </ShadAvatar>
                  </StyledBadge>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{username}</p>
                    <p className="text-[10px] text-slate-400 leading-tight">{userData}</p>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={8} className="p-0 w-[240px] rounded-xl shadow-xl overflow-hidden border border-slate-200/80">
                <div className="popover-header">
                  <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
                    <ShadAvatar className="h-10 w-10 border-2 border-blue-100">
                      <AvatarImage src={preview || currentImage} alt={username} />
                      <AvatarFallback className="bg-blue-50 text-blue-600 text-sm font-semibold">
                        {getInitials(username)}
                      </AvatarFallback>
                    </ShadAvatar>
                  </StyledBadge>
                  <div>
                    <p className="font-semibold text-[13px] text-slate-800 leading-tight">{username}</p>
                    <p className="text-[11px] text-slate-400 leading-tight">{userEmail}</p>
                  </div>
                </div>
                <Separator className="opacity-40" />
                <div className="popover-logout-row" onClick={logoutuser}>
                  <AiOutlineLogout size={16} />
                  <span className="text-[13px] font-medium">Log out</span>
                </div>
              </PopoverContent>
            </ShadPopover>
          </div>
        </div>
      </header>

      <aside
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isSidebarVisible ? "show" : ""}`}
        style={{ width: isCollapsed ? 64 : 240 }}
      >
        {/* Collapse toggle */}
        {!isSmallScreen && (
          <IconButton onClick={handleToggleSidebar} className="toggle-button">
            {isCollapsed ? (
              <ChevronRight className="toggle-icon" />
            ) : (
              <ChevronLeft className="toggle-icon" />
            )}
          </IconButton>
        )}

        {/* Logo */}
        <div
          className="flex items-center border-b border-slate-100 shrink-0"
          style={{
            height: 56,
            padding: isCollapsed ? "0 8px" : "0 16px",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          {isCollapsed ? (
            <img src={Logo} alt="logo" className="h-7 w-auto object-contain" />
          ) : (
            <img src={FullLogo} alt="logo" className="h-8 w-auto object-contain max-w-[140px]" />
          )}
        </div>

        {/* Navigation label */}
        {!isCollapsed && (
          <div className="px-4 pt-4 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Navigation</span>
          </div>
        )}

        {/* Menu items */}
        <div className="sidebar-contents" style={{ marginTop: isCollapsed ? 8 : 0 }}>
          <nav className="px-2 py-1">
            {sidebarItems.map((item) => {
              const isActiveMenu =
                (item.path !== "/" && location.pathname.startsWith(item.path)) ||
                (item.path === "/" && location.pathname === "/") ||
                item.submenu.some((subItem) => location.pathname.startsWith(subItem.path));

              return (
                <div key={item._id} className="mb-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        onClick={() => handleToggleSubmenu(item._id, item.label)}
                        className={`
                          group flex items-center gap-2.5 rounded-lg transition-all duration-150 no-underline
                          ${isCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2"}
                          ${isActiveMenu
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                          }
                        `}
                      >
                        {/* Icon */}
                        <span className={`text-[1.1rem] shrink-0 transition-colors duration-150 ${isActiveMenu ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                          {iconMapping[item.icon] ? React.createElement(iconMapping[item.icon]) : null}
                        </span>

                        {/* Label */}
                        {!isCollapsed && (
                          <span className={`flex-1 text-[13px] truncate ${isActiveMenu ? "font-semibold" : "font-medium"}`}>
                            {item.label === "Inbox +" ? (
                              <span className="flex items-center gap-1.5">
                                <span>{item.label}</span>
                                {inboxCount > 0 && (
                                  <span className="inline-flex items-center justify-center h-[18px] min-w-[18px] px-1 text-[10px] font-bold text-white bg-emerald-500 rounded-full">{inboxCount}</span>
                                )}
                              </span>
                            ) : item.label}
                          </span>
                        )}

                        {/* Expand arrow */}
                        {!isCollapsed && item.submenu.length > 0 && (
                          <svg
                            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${openMenu === item._id ? "rotate-180" : ""} ${isActiveMenu ? "text-blue-400" : "text-slate-300"}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="text-xs font-medium bg-slate-800 text-white border-0 shadow-lg">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>

                  {/* Submenu */}
                  {item.submenu.length > 0 && (
                    <Collapse in={openMenu === item._id}>
                      <div className={`mt-0.5 ${isCollapsed ? "" : "ml-4 pl-3 border-l border-slate-100"}`}>
                        {item.submenu.map((subItem) => {
                          const isActiveSubmenu = location.pathname.startsWith(subItem.path);

                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`
                                group flex items-center gap-2 rounded-md transition-all duration-150 no-underline mb-0.5
                                ${isCollapsed ? "justify-center px-2 py-2" : "px-2.5 py-1.5"}
                                ${isActiveSubmenu
                                  ? "bg-blue-50/70 text-blue-700"
                                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                                }
                              `}
                            >
                              <span className={`text-[0.95rem] shrink-0 transition-colors ${isActiveSubmenu ? "text-blue-500" : "text-slate-300 group-hover:text-slate-500"}`}>
                                {iconMapping[subItem.icon] ? React.createElement(iconMapping[subItem.icon]) : null}
                              </span>
                              {!isCollapsed && (
                                <span className={`text-[12.5px] truncate ${isActiveSubmenu ? "font-semibold" : "font-medium"}`}>
                                  {subItem.label}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </Collapse>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>

      {/* ─── Create New Sheet ────────────────────────────── */}
      <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && handleDrawerClose()}>
        <SheetContent
          side="left"
          className="newSidebar p-0 w-[220px] flex flex-col [&>button]:hidden"
        >
          <SheetHeader className="new-drawer-header">
            <SheetTitle className="new-drawer-title">
              <span className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-50">
                <FaPlus size={9} className="text-blue-600" />
              </span>
              <span className="text-sm font-semibold text-slate-800">Create New</span>
            </SheetTitle>
            <button onClick={handleDrawerClose} className="new-drawer-close">
              <RxCross2 size={16} />
            </button>
          </SheetHeader>
          <nav className="flex-1 overflow-y-auto px-2 py-2">
            {newSidebarItems.map((item) => (
              <Link
                key={item._id}
                to={item.path}
                onClick={(e) => {
                  if (item.restricted) {
                    e.preventDefault();
                    toast.error("Access to this feature is restricted.");
                  } else {
                    handleNewItemClick(item.label);
                  }
                }}
                className={`
                  group flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 no-underline transition-all duration-150
                  ${item.restricted
                    ? "opacity-40 cursor-not-allowed text-slate-400"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }
                `}
              >
                <span className={`text-[1rem] shrink-0 transition-colors ${item.restricted ? "text-slate-300" : "text-slate-400 group-hover:text-blue-500"}`}>
                  {iconMapping[item.icon] ? React.createElement(iconMapping[item.icon]) : null}
                </span>
                <span className="text-[13px] font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* ─── Right Drawer ────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={isRightDrawerOpen}
        onClose={handleNewDrawerClose}
        PaperProps={{ sx: { width: { xs: '100vw', sm: 650 }, borderRadius: { sm: '16px 0 0 16px' } } }}
      >
        <div style={{ width: "100%" }}>
          {rightDrawerContent === "Contact" && (
            <ContactForm handleNewDrawerClose={handleNewDrawerClose} handleDrawerClose={handleDrawerClose} />
          )}
          {rightDrawerContent === "Task" && (
            <TaskForm handleNewDrawerClose={handleNewDrawerClose} handleDrawerClose={handleDrawerClose} />
          )}
          {rightDrawerContent === "Chat" && (
            <ChatForm handleNewDrawerClose={handleNewDrawerClose} handleDrawerClose={handleDrawerClose} />
          )}
          {rightDrawerContent === "Jobs" && (
            <JobDrawer handleNewDrawerClose={handleNewDrawerClose} handleDrawerClose={handleDrawerClose} />
          )}
        </div>
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

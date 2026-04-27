import React, { useState, useEffect, useContext } from "react";
import { Drawer } from "@mui/material";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import iconMapping from "./icons/index";
import {
  Plus, X, LogOut, ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen, Menu
} from "lucide-react";
import ContactForm from "../Contact/ContactForm";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { LoginContext } from "../Sidebar/Context/Context";
import TaskForm from "../Tasks/AccountTask";
import SearchComponent from "./Search";
import { useDispatch } from "react-redux";
import { Avatar as ShadAvatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Popover as ShadPopover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { Separator } from "../components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/ui/tooltip";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../components/ui/collapsible";
import { cn } from "../lib/utils";
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
  return ((parts[0]?.[0] || "?") + (parts[1]?.[0] || "")).toUpperCase();
};

const PRIMARY_LABELS = ["Insights", "Inbox +", "Clients", "Workflow", "Billing"];

function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const SIDEBAR_API = process.env.REACT_APP_SIDEBAR_URL;
  const NEW_SIDEBAR_API = process.env.REACT_APP_SIDEBAR_URL;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([]);
  const [newSidebarItems, setNewSidebarItems] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [rightDrawerContent, setRightDrawerContent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInvoiceDrawerOpen, setIsInvoiceDrawerOpen] = useState(false);
  const [isOrganizerDialogOpen, setIsOrganizerDialogOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [userRole, setUserRole] = useState(null);
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

  const handleToggleSubmenu = (menuId) => {
    setOpenMenu((prev) => (prev === menuId ? null : menuId));
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

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    console.log("Fetched userRole from localStorage:", storedUserRole);
    setUserRole(storedUserRole);
  }, []);
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
      navigate("/login");
    } else {
      console.log("error");
    }
  };
  const [data, setData] = useState(false);
  const [loginsData, setloginsData] = useState("");
  const { logindata, setLoginData } = useContext(LoginContext);
  const fetchAccountsList = () => {};
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
        if (setLoginData) setLoginData(data);
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

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
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

  const primaryItems = sidebarItems.filter((i) => PRIMARY_LABELS.includes(i.label));
  const secondaryItems = sidebarItems.filter((i) => !PRIMARY_LABELS.includes(i.label));

  return (
    <TooltipProvider delayDuration={150}>
      <>
      {/* ══════════════════════════════════════════════════════
          ROOT FLEX LAYOUT — replaces all grid/CSS layout
      ══════════════════════════════════════════════════════ */}
      <div className="flex h-screen overflow-hidden bg-background">

        {/* ── Mobile overlay ────────────────────────────── */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* ════════════════════════════════════════════════
            SIDEBAR PANEL
        ════════════════════════════════════════════════ */}
        <aside
          className={cn(
            "relative flex flex-col shrink-0 border-r border-border/40 bg-background transition-all duration-300 ease-in-out z-40",
            isCollapsed ? "w-[60px]" : "w-[232px]",
            "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:shadow-xl",
            isMobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
          )}
        >
          {/* ── Logo ──────────────────────────────────── */}
          <div className={cn(
            "flex h-14 shrink-0 items-center border-b border-border/40",
            isCollapsed ? "justify-center px-2" : "px-4"
          )}>
            {isCollapsed
              ? <img src={Logo} alt="logo" className="h-7 w-auto object-contain" />
              : <img src={FullLogo} alt="logo" className="h-7 w-auto object-contain max-w-[120px]" />
            }
          </div>

          {/* ── Collapse toggle ───────────────────────── */}
          <button
            onClick={() => setIsCollapsed((c) => !c)}
            className={cn(
              "absolute -right-3 top-[52px] z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-background shadow-sm transition-colors hover:border-primary hover:bg-muted",
              "max-md:hidden"
            )}
          >
            {isCollapsed
              ? <ChevronRight className="h-3 w-3 text-muted-foreground" />
              : <ChevronRight className="h-3 w-3 rotate-180 text-muted-foreground" />
            }
          </button>

          {/* ── Nav content ───────────────────────────── */}
          <div className="sidebar-contents flex-1">
            <nav className="flex flex-col gap-4 px-2 py-3">

              {/* Section label: Main */}
              {!isCollapsed && (
                <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
                  Main
                </p>
              )}

              {/* Primary items */}
              <div className="flex flex-col gap-0.5">
                {primaryItems.map((item) => {
                  const isActive =
                    (item.path !== "/" && location.pathname.startsWith(item.path)) ||
                    (item.path === "/" && location.pathname === "/") ||
                    (item.submenu || []).some((s) => location.pathname.startsWith(s.path));
                  const hasSubmenu = (item.submenu || []).length > 0;
                  const IconComp = iconMapping[item.icon];

                  const itemBtnClass = cn(
                    "group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    isCollapsed && "justify-center px-2"
                  );

                  return (
                    <div key={item._id}>
                      {hasSubmenu ? (
                        <Collapsible open={openMenu === item._id} onOpenChange={(o) => setOpenMenu(o ? item._id : null)}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CollapsibleTrigger className={itemBtnClass}>
                                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />}
                                {IconComp && <IconComp className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />}
                                {!isCollapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
                                {!isCollapsed && <ChevronRight className={cn("ml-auto h-3.5 w-3.5 shrink-0 transition-transform duration-200", openMenu === item._id && "rotate-90", isActive ? "text-primary/60" : "text-muted-foreground/40")} />}
                              </CollapsibleTrigger>
                            </TooltipTrigger>
                            {isCollapsed && <TooltipContent side="right" className="text-xs font-medium">{item.label}</TooltipContent>}
                          </Tooltip>
                          <CollapsibleContent>
                            <div className={cn("mt-0.5", !isCollapsed && "ml-3 border-l border-border/50 pl-3")}>
                              {item.submenu.map((sub) => {
                                const isSubActive = location.pathname.startsWith(sub.path);
                                const SubIcon = iconMapping[sub.icon];
                                return (
                                  <Link key={sub.path} to={sub.path}
                                    className={cn(
                                      "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium no-underline transition-all duration-150 mb-0.5",
                                      isSubActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                    )}
                                  >
                                    {isSubActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r-full bg-primary" />}
                                    {SubIcon
                                      ? <SubIcon className={cn("h-3.5 w-3.5 shrink-0", isSubActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground")} />
                                      : <span className={cn("h-1 w-1 rounded-full shrink-0", isSubActive ? "bg-primary" : "bg-muted-foreground/40")} />
                                    }
                                    {!isCollapsed && <span className="truncate">{sub.label}</span>}
                                  </Link>
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              to={item.path}
                              className={cn(
                                itemBtnClass,
                                "no-underline"
                              )}
                            >
                              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />}
                              {IconComp && <IconComp className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />}
                              {!isCollapsed && (
                                <span className="flex-1 flex items-center gap-1.5 truncate">
                                  {item.label}
                                  {item.label === "Inbox +" && inboxCount > 0 && (
                                    <span className="ml-auto inline-flex items-center justify-center rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary">
                                      {inboxCount}
                                    </span>
                                  )}
                                </span>
                              )}
                            </Link>
                          </TooltipTrigger>
                          {isCollapsed && <TooltipContent side="right" className="text-xs font-medium">{item.label}</TooltipContent>}
                        </Tooltip>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Divider + secondary section */}
              <div className="h-px bg-border/40 mx-1" />

              {!isCollapsed && (
                <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
                  Tools
                </p>
              )}

              <div className="flex flex-col gap-0.5">
                {secondaryItems.map((item) => {
                  const isActive =
                    (item.path !== "/" && location.pathname.startsWith(item.path)) ||
                    (item.path === "/" && location.pathname === "/") ||
                    (item.submenu || []).some((s) => location.pathname.startsWith(s.path));
                  const hasSubmenu = (item.submenu || []).length > 0;
                  const IconComp = iconMapping[item.icon];

                  const itemBtnClass = cn(
                    "group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    isCollapsed && "justify-center px-2"
                  );

                  return (
                    <div key={item._id}>
                      {hasSubmenu ? (
                        <Collapsible open={openMenu === item._id} onOpenChange={(o) => setOpenMenu(o ? item._id : null)}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CollapsibleTrigger className={itemBtnClass}>
                                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />}
                                {IconComp && <IconComp className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />}
                                {!isCollapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
                                {!isCollapsed && <ChevronRight className={cn("ml-auto h-3.5 w-3.5 shrink-0 transition-transform duration-200", openMenu === item._id && "rotate-90", isActive ? "text-primary/60" : "text-muted-foreground/40")} />}
                              </CollapsibleTrigger>
                            </TooltipTrigger>
                            {isCollapsed && <TooltipContent side="right" className="text-xs font-medium">{item.label}</TooltipContent>}
                          </Tooltip>
                          <CollapsibleContent>
                            <div className={cn("mt-0.5", !isCollapsed && "ml-3 border-l border-border/50 pl-3")}>
                              {item.submenu.map((sub) => {
                                const isSubActive = location.pathname.startsWith(sub.path);
                                const SubIcon = iconMapping[sub.icon];
                                return (
                                  <Link key={sub.path} to={sub.path}
                                    className={cn(
                                      "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium no-underline transition-all duration-150 mb-0.5",
                                      isSubActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                    )}
                                  >
                                    {isSubActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r-full bg-primary" />}
                                    {SubIcon
                                      ? <SubIcon className={cn("h-3.5 w-3.5 shrink-0", isSubActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground")} />
                                      : <span className={cn("h-1 w-1 rounded-full shrink-0", isSubActive ? "bg-primary" : "bg-muted-foreground/40")} />
                                    }
                                    {!isCollapsed && <span className="truncate">{sub.label}</span>}
                                  </Link>
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              to={item.path}
                              className={cn(itemBtnClass, "no-underline")}
                            >
                              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />}
                              {IconComp && <IconComp className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />}
                              {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                            </Link>
                          </TooltipTrigger>
                          {isCollapsed && <TooltipContent side="right" className="text-xs font-medium">{item.label}</TooltipContent>}
                        </Tooltip>
                      )}
                    </div>
                  );
                })}
              </div>

            </nav>
          </div>

          {/* ── Profile footer ────────────────────────── */}
          <div className="shrink-0 border-t border-border/40 p-2">
            <ShadPopover open={isDropdownOpen} onOpenChange={setDropdownOpen}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all duration-150 hover:bg-muted/60",
                    isDropdownOpen && "bg-muted/60",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <div className="relative shrink-0">
                    <ShadAvatar className="h-8 w-8 rounded-lg border border-border/60">
                      <AvatarImage src={preview || currentImage} alt={username} />
                      <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold rounded-lg">
                        {getInitials(username)}
                      </AvatarFallback>
                    </ShadAvatar>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-[1.5px] ring-background" />
                  </div>
                  {!isCollapsed && (
                    <>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-[13px] font-semibold text-foreground leading-tight">{username}</p>
                        <p className="truncate text-[11px] text-muted-foreground leading-tight">{userData}</p>
                      </div>
                      <ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                    </>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={8} className="p-0 w-[248px] rounded-xl border border-border/60 shadow-xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3.5 bg-muted/30">
                  <div className="relative shrink-0">
                    <ShadAvatar className="h-9 w-9 rounded-lg border border-border/60">
                      <AvatarImage src={preview || currentImage} alt={username} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold rounded-lg">
                        {getInitials(username)}
                      </AvatarFallback>
                    </ShadAvatar>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-[1.5px] ring-background" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-foreground">{username}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{userEmail}</p>
                  </div>
                </div>
                <Separator className="opacity-60" />
                <button
                  onClick={logoutuser}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-destructive transition-colors duration-150 hover:bg-destructive/8 focus-visible:outline-none"
                >
                  <LogOut className="h-3.5 w-3.5 shrink-0" />
                  Sign out
                </button>
              </PopoverContent>
            </ShadPopover>
          </div>
        </aside>

        {/* ════════════════════════════════════════════════
            MAIN CONTENT AREA
        ════════════════════════════════════════════════ */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

          {/* Top header */}
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/40 bg-background px-4 sticky top-0 z-20">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <Separator orientation="vertical" className="h-4 opacity-60 max-md:hidden" />

            {/* Create New */}
            <button
              onClick={handleDrawerOpen}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
            >
              <Plus className="h-3 w-3" />
              <span>New</span>
            </button>

            {/* Search */}
            <div className="flex-1 max-w-[400px]">
              <SearchComponent />
            </div>
          </header>

          {/* Page content */}
          <main className="main flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          CREATE NEW SHEET
      ════════════════════════════════════════════════ */}
      <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && handleDrawerClose()}>
        <SheetContent side="left" className="p-0 w-[216px] flex flex-col bg-background border-r border-border/40 [&>button]:hidden">
          <SheetHeader className="new-drawer-header">
            <SheetTitle className="new-drawer-title">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                <Plus className="h-3.5 w-3.5 text-primary" />
              </span>
              <span className="text-sm font-semibold text-foreground">Create New</span>
            </SheetTitle>
            <button onClick={handleDrawerClose} className="new-drawer-close">
              <X className="h-4 w-4" />
            </button>
          </SheetHeader>
          <nav className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-0.5">
            {newSidebarItems.map((item) => {
              const IconComp = iconMapping[item.icon];
              return (
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
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium no-underline transition-all duration-150",
                    item.restricted
                      ? "cursor-not-allowed opacity-40 text-muted-foreground"
                      : "text-foreground hover:bg-muted/60"
                  )}
                >
                  {IconComp && (
                    <IconComp className={cn("h-4 w-4 shrink-0 transition-colors", item.restricted ? "text-muted-foreground/50" : "text-muted-foreground group-hover:text-primary")} />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
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
      </>
    </TooltipProvider>
  );
}

export default AppSidebar;

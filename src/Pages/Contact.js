import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import "./account.css";
import { toast } from "react-toastify";
import { Trash2, X, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import ContactForm from "./UpdateContact";
import TagsMultiSelectDropDown from "./Accounts/TagsMultiSelectDropDown"
const ContactTable = () => {
  const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  console.log("bhvh", storedData);
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [contactData, setContactData] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [tags, setTags] = useState([]);
  const isMobile = window.innerWidth <= 1000;
  const [filterText, setFilterText] = useState({});

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Handle sort action
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const newDirection =
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc";
      return { key, direction: newDirection };
    });
  };

  // Sort the data based on the sortConfig
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return contactData;

    const sorted = [...contactData].sort((a, b) => {
      let aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
      let bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [contactData, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "↕"; // Default icon for unsorted columns
  };
  //Tag FetchData ================
  const [selectedTags, setSelectedTags] = useState([]);
  //  for tags
  const calculateWidth = (tagName) => {
    const baseWidth = 10; // base width for each tag
    const charWidth = 8; // approximate width of each character
    const padding = 10; // padding on either side
    return baseWidth + charWidth * tagName.length + padding;
  };
  const tagsoptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.tagName,
    colour: tag.tagColour,
    customStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      borderRadius: "8px",
      alignItems: "center",
      textAlign: "center",
      marginBottom: "5px",
      padding: "2px,8px",
      fontSize: "10px",
      width: `${calculateWidth(tag.tagName)}px`,
      margin: "7px",
      cursor: "pointer",
    },
    customTagStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      alignItems: "center",
      textAlign: "center",
      padding: "2px,8px",
      fontSize: "10px",
      cursor: "pointer",
    },
  }));
  
  const handleTagChange = (event) => {
    const selectedValues = event.target.value;
    setSelectedTags(selectedValues);

    // Send selectedValues array to your backend
    console.log("Selected Values:", selectedValues);
  };

  const [dateFilter, setDateFilter] = useState({
    option: null, // 'today', 'yesterday', 'lastWeek', 'custom'
    startDate: null,
    endDate: null,
  });

  const [updatedDateFilter, setUpdatedDateFilter] = useState({
    option: null,
    startDate: null,
    endDate: null,
  });
  // Filter the data based on the filterText and selectedTags
  const filteredData = useMemo(() => {
    let filtered = sortedData;

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((contact) => {
        const contactTagNames =
          contact.tags?.flat().map((tag) => tag.tagName) || [];
        return selectedTags.every((selectedTagName) =>
          contactTagNames.includes(selectedTagName)
        );
      });
    }


    Object.entries(filterText).forEach(([filterKey, filterVal]) => {
      if (filterVal) {
        filtered = filtered.filter((contact) => {
          const val = filterVal.toLowerCase();
          const name = contact.name?.toLowerCase() || "";
          const email = contact.email?.toLowerCase() || "";
          const companyName = contact.companyName?.toLowerCase() || "";

          return (
            name.includes(val) ||
            email.includes(val) ||
            companyName.includes(val)
          );
        });
      }
    });

    // Filter by date
    if (dateFilter.option) {
      filtered = filtered.filter((contact) => {
        const contactDate = new Date(contact.createdAt);
        const start = dateFilter.startDate
          ? new Date(dateFilter.startDate)
          : null;
        const end = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        return (!start || contactDate >= start) && (!end || contactDate <= end);
      });
    }
    // Filter by updated date
    if (updatedDateFilter.option) {
      filtered = filtered.filter((contact) => {
        const contactDate = new Date(contact.updatedAt);
        const start = updatedDateFilter.startDate
          ? new Date(updatedDateFilter.startDate)
          : null;
        const end = updatedDateFilter.endDate
          ? new Date(updatedDateFilter.endDate)
          : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        return (!start || contactDate >= start) && (!end || contactDate <= end);
      });
    }

    return filtered;
  }, [sortedData, filterText, selectedTags, dateFilter, updatedDateFilter]);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };



  // Slice data based on pagination
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);
  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `${CONTACT_API}/contacts/contactlist/list/`
      );
      setContactData(response.data.contactlist);
      console.log("responce", response.data.contactlist);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const fetchTagData = async () => {
    try {
      const response = await fetch(`${TAGS_API}/tags/`);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleContactUpdated = () => {
    fetchContacts(); // Refetch contacts when updated
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`${CONTACT_API}/contacts/${id}/`);
        setContactData((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== id)
        );
        // alert("Contact deleted successfully!");
        toast.success("Contact deleted successfully!");
      } catch (error) {
        console.error("Delete API Error:", error);
        alert("Failed to delete contact");
      }
    }
  };

  const handleClick = async (id) => {
    try {
      const url = `${CONTACT_API}/contacts/${id}`;
      console.log("url", url);
      const response = await fetch(url);
      const data = await response.json();
      setSelectedContact(data.contact);
      console.log("edit contact data", data.contact);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchTagData();
  }, []);

  useEffect(() => {
    if (contactData.length > 0) {
      const tagsSet = new Set();
      contactData.forEach((item) => {
        if (Array.isArray(item.Tags)) {
          item.Tags.forEach((tag) => {
            tagsSet.add(JSON.stringify(tag[0]));
          });
        }
      });
      setUniqueTags(Array.from(tagsSet).map((tag) => JSON.parse(tag)));
    }
  }, [contactData]);

  const [selectedContacts, setSelectedContacts] = useState([]);
  // Handle checkbox change for individual contact
  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      // Add ID to selectedContacts array
      setSelectedContacts((prevSelected) => {
        const newSelected = [...prevSelected, id];
        console.log("Selected Contacts IDs:", newSelected); // Log selected IDs
        return newSelected;
      });
    } else {
      // Remove ID from selectedContacts array
      setSelectedContacts((prevSelected) => {
        const newSelected = prevSelected.filter(
          (contactId) => contactId !== id
        );
        console.log("Selected Contacts IDs:", newSelected); // Log selected IDs
        return newSelected;
      });
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = contactData.map((contact) => contact.id);
      setSelectedContacts(allIds);
      console.log("Selected Contacts IDs:", allIds); // Log all selected IDs
    } else {
      setSelectedContacts([]);
      console.log("Selected Contacts IDs: []"); // Log empty array when deselected
    }
  };

  const handleDeleteSelected = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected contacts?"
    );
    if (isConfirmed) {
      try {
        await Promise.all(
          selectedContacts.map((id) =>
            axios.delete(`${CONTACT_API}/contacts/${id}/`)
          )
        );
        setContactData((prevContacts) =>
          prevContacts.filter(
            (contact) => !selectedContacts.includes(contact.id)
          )
        );
        toast.success("Selected contacts deleted successfully!");
        setSelectedContacts([]); // Clear the selected contacts
        // alert;
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete selected contacts");
      }
    }
  };
  const [filterOption, setFilterOption] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  // const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  // const handleFilterOptionClick = (option) => {
  //   setFilterOption(option);
  //   setIsFilterVisible(true); // Show the TextField
  //   setMenuAnchor(null); // Close the menu after selection
  // };
  const handleFilterOptionClick = (filter) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter]);
    }
    setMenuAnchor(null);
  };
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleInputChange = (filter, value) => {
    setFilterValues({ ...filterValues, [filter]: value });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };


  const handleDateOptionChange = (option) => {
    const today = new Date();
    let startDate = null;
    let endDate = new Date(today.setHours(23, 59, 59, 999));

    switch (option) {
      case "today":
        startDate = new Date(today.setHours(0, 0, 0, 0));
        break;
      case "yesterday":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "lastWeek":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "lastMonth":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "lastQuarter":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "lastYear":
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate = dateFilter.startDate;
        endDate = dateFilter.endDate;
    }
    setDateFilter({
      option,
      startDate,
      endDate,
      // Add formatted dates to display
      displayText:
        option === "custom"
          ? "Custom Range"
          : `${format(startDate, "MMM-dd-yyyy")} to ${format(endDate, "MMM-dd-yyyy")}`,
    });
 
  };
  // Handler for updated date option change
  const handleUpdatedDateOptionChange = (option) => {
    let startDate = null;
    let endDate = null;
    // let displayText = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (option) {
      case "today":
        startDate = new Date();
        endDate = new Date();
        // displayText = "Today";
        break;
      case "lastWeek":
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        endDate = new Date();
        // displayText = "Last 7 days";
        break;
      case "lastMonth":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 1);
        endDate = new Date();
        // displayText = "Last 30 days";
        break;
      case "lastQuarter":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 3);
        endDate = new Date();
        // displayText = "Last 90 days";
        break;
      case "lastYear":
        startDate = new Date();
        startDate.setFullYear(today.getFullYear() - 1);
        endDate = new Date();
        // displayText = "Last year";
        break;

      default:
        startDate = updatedDateFilter.startDate;
        endDate = updatedDateFilter.endDate;
    }

    // setUpdatedDateFilter({
    //   option,
    //   startDate,
    //   endDate,
    //   displayText,
    // });
    setUpdatedDateFilter({
      option,
      startDate,
      endDate,
      // Add formatted dates to display
      displayText:
        option === "custom"
          ? "Custom Range"
          : `${format(startDate, "MMM-dd-yyyy")} to ${format(endDate, "MMM-dd-yyyy")}`,
    });
  };

  // Handler for updated date change
  const handleUpdatedDateChange = (type, date) => {
    setUpdatedDateFilter((prev) => ({
      ...prev,
      [type]: date,
    }));
  };
  const handleDateChange = (type, value) => {
    setDateFilter((prev) => ({
      ...prev,
      [type]: value,
      option: "custom",
    }));
  };
  // Clear filter handler should be updated to handle updatedAt
  const clearFilter = (filter) => {
    if (filter === "createdAt") {
      setDateFilter({
        option: null,
        startDate: null,
        endDate: null,
      });
    } else if (filter === "updatedAt") {
      setUpdatedDateFilter({
        option: null,
        startDate: null,
        endDate: null,
      });
    } else {
      setFilterText("");
    }
    setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    if (filter === "tags") setSelectedTags([]);
  };

  const selectCls = "rounded border border-gray-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400";
  const thCls = "px-4 py-3 text-left text-xs font-bold text-gray-700 bg-gray-50 border-b border-gray-200 cursor-pointer select-none whitespace-nowrap";
  const tdCls = "px-3 py-2 text-xs text-gray-700 border-b border-gray-100";

  return (
    <>
      {/* Edit Contact Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[580px] bg-white shadow-xl flex flex-col transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <span className="font-bold text-base">Edit Contact</span>
          <button onClick={() => setIsDrawerOpen(false)} className="text-gray-500 hover:text-gray-800"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {selectedContact && (
            <ContactForm
              selectedContact={selectedContact}
              uniqueTags={uniqueTags}
              handleClose={() => setIsDrawerOpen(false)}
              isSmallScreen={isMobile}
              onContactUpdated={handleContactUpdated}
            />
          )}
        </div>
      </div>
      {isDrawerOpen && <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setIsDrawerOpen(false)} />}

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <button
            onClick={handleMenuOpen}
            className="flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)]"
          >
            Filter by <ChevronDown size={14} />
          </button>
          {Boolean(menuAnchor) && (
            <div className="absolute left-0 top-full mt-1 z-50 w-44 rounded-lg border border-gray-200 bg-white shadow-lg py-1">
              {["name","email","companyName","tags","createdAt","updatedAt"].map((opt) => (
                <button key={opt} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 capitalize"
                  onClick={() => handleFilterOptionClick(opt)}>
                  {opt === "createdAt" ? "Date Created" : opt === "updatedAt" ? "Date Updated" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedFilters.map((filter) => (
          <div key={filter} className="flex items-center gap-2">
            {filter === "tags" ? (
              <div style={{ width: "250px" }}>
                <TagsMultiSelectDropDown
                  value={selectedTags.map(tagName => {
                    const tag = tags.find(t => t.tagName === tagName);
                    return tag ? { value: tag._id, label: tag.tagName, colour: tag.tagColour } : null;
                  }).filter(Boolean)}
                  onChange={(selected) => setSelectedTags(selected.map(item => item.label))}
                  options={tagsoptions.map(o => ({ value: o.value, label: o.label, colour: o.colour }))}
                  placeholder="Select tags"
                  width="250px"
                />
              </div>
            ) : filter === "createdAt" ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Date Created</span>
                <select className={selectCls} value={dateFilter.option || ""} onChange={(e) => handleDateOptionChange(e.target.value)}>
                  <option value="">Select period</option>
                  {["today","lastWeek","lastMonth","lastQuarter","lastYear"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {dateFilter.option && <span className="text-xs text-gray-500">{dateFilter.displayText}</span>}
                {dateFilter.option === "custom" && (
                  <>
                    <input type="date" className={selectCls} value={dateFilter.startDate ? format(new Date(dateFilter.startDate),"yyyy-MM-dd") : ""} onChange={(e) => handleDateChange("startDate", e.target.value ? new Date(e.target.value) : null)} />
                    <input type="date" className={selectCls} value={dateFilter.endDate ? format(new Date(dateFilter.endDate),"yyyy-MM-dd") : ""} onChange={(e) => handleDateChange("endDate", e.target.value ? new Date(e.target.value) : null)} />
                  </>
                )}
              </div>
            ) : filter === "updatedAt" ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Date Updated</span>
                <select className={selectCls} value={updatedDateFilter.option || ""} onChange={(e) => handleUpdatedDateOptionChange(e.target.value)}>
                  <option value="">Select period</option>
                  {["today","lastWeek","lastMonth","lastQuarter","lastYear"].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {updatedDateFilter.option && <span className="text-xs text-gray-500">{updatedDateFilter.displayText}</span>}
                {updatedDateFilter.option === "custom" && (
                  <>
                    <input type="date" className={selectCls} value={updatedDateFilter.startDate ? format(new Date(updatedDateFilter.startDate),"yyyy-MM-dd") : ""} onChange={(e) => handleUpdatedDateChange("startDate", e.target.value ? new Date(e.target.value) : null)} />
                    <input type="date" className={selectCls} value={updatedDateFilter.endDate ? format(new Date(updatedDateFilter.endDate),"yyyy-MM-dd") : ""} onChange={(e) => handleUpdatedDateChange("endDate", e.target.value ? new Date(e.target.value) : null)} />
                  </>
                )}
              </div>
            ) : (
              <input
                type="text"
                placeholder={`Search by ${filter}`}
                className={`${selectCls} w-48`}
                value={filterText[filter] || ""}
                onChange={(e) => setFilterText((prev) => ({ ...prev, [filter]: e.target.value }))}
              />
            )}
            <button onClick={() => clearFilter(filter)} className="text-red-500 hover:text-red-700"><X size={14} /></button>
          </div>
        ))}

        {selectedContacts.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            disabled={storedData?.teammember?.manageContacts === false}
            className="ml-2 text-red-600 hover:text-red-800 disabled:opacity-40"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr>
              <th className={`${thCls} w-8`}>
                <input type="checkbox"
                  checked={selectedContacts.length === contactData.length && contactData.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>
              {[["name","Name",200],["email","Email",150],["phoneNumbers","Phone Numbers",200],[null,"Tags",100],["companyName","Company Name",180],[null,"Actions",60]].map(([key,label,w]) => (
                <th key={label} className={thCls} style={{ width: w }} onClick={() => key && handleSort(key)}>
                  {label} {key && getSortIcon(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                <td className={tdCls}>
                  <input type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => handleCheckboxChange(e, contact.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </td>
                <td className={tdCls}
                  style={{ cursor: storedData?.teammember?.manageContacts === false ? "not-allowed" : "pointer", color: storedData?.teammember?.manageContacts === false ? "gray" : "#3f51b5" }}
                  onClick={() => { if (storedData?.teammember?.manageContacts !== false) handleClick(contact.id); }}
                >
                  {contact.name}
                </td>
                <td className={tdCls}>{contact.email}</td>
                <td className={tdCls}>
                  {contact.phoneNumbers?.length > 0 && contact.phoneNumbers.map((p, i) => <div key={i}>{p}</div>)}
                </td>
                <td className={tdCls}>
                  {contact.tags?.flat().length > 0 && (
                    <div className="group relative inline-block">
                      {contact.tags.flat()[0] && (
                        <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white mr-1" style={{ backgroundColor: contact.tags.flat()[0].tagColour }}>
                          {contact.tags.flat()[0].tagName}
                        </span>
                      )}
                      {contact.tags.flat().length > 1 && (
                        <>
                          <span className="cursor-pointer text-blue-600 text-xs">+{contact.tags.flat().length - 1}</span>
                          <div className="absolute left-0 top-full z-10 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[120px]">
                            {contact.tags.flat().map(tag => (
                              <span key={tag._id} className="block rounded px-2 py-0.5 text-[10px] font-semibold text-white mb-1" style={{ backgroundColor: tag.tagColour }}>{tag.tagName}</span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </td>
                <td className={tdCls}>{contact.companyName}</td>
                <td className={tdCls}>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    disabled={storedData?.teammember?.manageContacts === false}
                    className="text-red-500 hover:text-red-700 disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select className="rounded border border-gray-200 px-2 py-1 text-xs" value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value,10)); setPage(0); }}>
            {[30,40,50,60,100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span>{page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, contactData.length)} of {contactData.length}</span>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-100">‹</button>
          <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * rowsPerPage >= contactData.length} className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-100">›</button>
        </div>
      </div>
    </>
  );
};

export default ContactTable;

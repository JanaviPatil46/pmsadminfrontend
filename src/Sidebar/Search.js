


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, X, Loader2, User, Building2 } from "lucide-react";
import ContactForm from "../Pages/UpdateContact";
import { useNavigate } from "react-router-dom";

const FILTER_TYPES = ["All", "Accounts", "Contacts"];

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  const navigate = useNavigate();

  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearchChange = async (event) => {
    const query = event.target.value.trim();
    setSearchQuery(event.target.value);

    if (!query) {
      setOptions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let combinedOptions = [];

      if (isEmail(query)) {
        const [accountsRes, contactsRes] = await Promise.all([
          axios.get(
            "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true",
            { params: { search: query } }
          ),
          axios.get("https://snptaxes.com/api/contacts/search-by-email", {
            params: { email: query },
          }),
        ]);
        const accounts = accountsRes.data.accountlist || [];
        const contacts = contactsRes.data.data || [];
        combinedOptions = [
          ...accounts.map((a) => ({
            id: a._id,
            label: a.accountName,
            subLabel: a.emails?.length > 0 ? a.emails.join(", ") : "No Email Listed",
            type: "Accounts",
          })),
          ...contacts.map((c) => ({
            id: c._id,
            label: c.contactName,
            subLabel: c.email,
            type: "Contacts",
          })),
        ];
      } else {
        const [accountsRes, contactsRes] = await Promise.all([
          axios.get(
            "https://www.snptaxes.com/api/accounts/accountlist/names-by-status?active=true",
            { params: { search: query } }
          ),
          axios.get("https://snptaxes.com/api/contacts/contact-names", {
            params: { search: query },
          }),
        ]);
        const accounts = accountsRes.data.accountlist || [];
        const contacts = contactsRes.data.data || [];
        combinedOptions = [
          ...accounts.map((a) => ({
            id: a._id,
            label: a.accountName,
            subLabel: a.emails?.length > 0 ? a.emails.join(", ") : "No Email Listed",
            type: "Accounts",
          })),
          ...contacts.map((c) => ({
            id: c._id,
            label: c.contactName,
            subLabel: c.email ?? "No Email",
            type: "Contacts",
          })),
        ];
      }

      setOptions(combinedOptions);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredOptions = options
    .filter((option) => {
      const q = searchQuery.toLowerCase();
      return option.label?.toLowerCase().includes(q) || option.subLabel?.toLowerCase().includes(q);
    })
    .filter((option) => filterType === "All" || option.type === filterType);

  const handleClick = async (id) => {
    try {
      const url = `https://www.snptaxes.com/api/contacts/contact/${id}`;
      const response = await fetch(url);
      const data = await response.json();
      setSelectedContact(data.data);
      setIsDrawerOpen(true);
      setSearchQuery("");
      setOptions([]);
      setIsFocused(false);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedContact(null);
  };

  const handleContactUpdated = () => {
    handleCloseDrawer();
  };

  const typeCount = (type) =>
    options.filter((o) => type === "All" || o.type === type).length;

  const showDropdown = isFocused && searchQuery.trim();

  return (
    <>
      <div ref={containerRef} className="relative w-72">
        {/* Search input */}
        <div className={`flex items-center gap-2 rounded-xl border bg-background px-3 py-2 shadow-sm transition-all duration-200 ${isFocused ? "border-primary ring-2 ring-primary/15 shadow-md" : "border-input hover:border-ring"}`}>
          {loading
            ? <Loader2 className="h-4 w-4 text-slate-400 shrink-0 animate-spin" />
            : <Search className="h-4 w-4 text-slate-400 shrink-0" />
          }
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            placeholder="Search accounts & contacts..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none min-w-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setOptions([]); }}
              className="shrink-0 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown results */}
        {showDropdown && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-border bg-popover shadow-xl ring-1 ring-black/5 overflow-hidden">
            {/* Filter tabs */}
            <div className="flex items-center gap-1 border-b border-slate-100 px-3 py-2">
              {FILTER_TYPES.map((type) => {
                const count = typeCount(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilterType(type)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      filterType === type
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {type}
                    {count > 0 && (
                      <span className={`rounded-full px-1.5 py-0 text-[10px] font-semibold ${filterType === type ? "bg-primary-foreground/25 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {error ? (
                <p className="px-4 py-5 text-center text-sm text-red-500">{error}</p>
              ) : filteredOptions.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-slate-400">No results found</p>
              ) : (
                <ul>
                  {filteredOptions.map((option) => (
                    <li key={option.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (option.type === "Accounts") {
                            navigate(`/clients/accounts/accountsdash/overview/${option.id}`);
                            setSearchQuery("");
                            setOptions([]);
                            setIsFocused(false);
                          } else {
                            handleClick(option.id);
                          }
                        }}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent"
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white text-xs font-semibold ${option.type === "Accounts" ? "bg-primary" : "bg-emerald-500"}`}>
                          {option.type === "Accounts"
                            ? <Building2 className="h-4 w-4" />
                            : <User className="h-4 w-4" />
                          }
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">{option.label}</p>
                          <p className="truncate text-xs text-slate-500">{option.subLabel}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${option.type === "Accounts" ? "bg-primary/10 text-primary" : "bg-emerald-50 text-emerald-600"}`}>
                          {option.type === "Accounts" ? "Account" : "Contact"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contact Edit Drawer */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={handleCloseDrawer}
          />
          <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col bg-background shadow-2xl transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">Edit Contact</h2>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {selectedContact && (
                <ContactForm
                  selectedContact={selectedContact}
                  handleClose={handleCloseDrawer}
                  onContactUpdated={handleContactUpdated}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchComponent;

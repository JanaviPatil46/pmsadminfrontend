import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import EditorShortcodes from "../Texteditor/EditorShortcodes";
import { useDropzone } from "react-dropzone";
import debounce from "lodash.debounce";
import axios from "axios";
import { FormPage, FormSection, FormField, FormRow, FormGrid, ShortcodePopover, FormSelect } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Upload, Trash2, FileText, Pencil, Loader2 } from "lucide-react";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
const EmailTemp = () => {
  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCreateTemplate = () => {
    setShowForm(true); // Show the form when button is clicked
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };
  const [cursorPosition, setCursorPosition] = useState(0);
  const handlesubject = (e) => {
    const { value, selectionStart } = e.target;
    setInputText(value);
    setCursorPosition(selectionStart);
  };
  const textFieldRef = useRef(null);
  const handleAddShortcut = (shortcut) => {
    setInputText((prevText) => {
      const newText =
        prevText.slice(0, cursorPosition) +
        `[${shortcut}]` +
        prevText.slice(cursorPosition);
      return newText;
    });

    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(
          cursorPosition + shortcut.length + 2,
          cursorPosition + shortcut.length + 2
        );
      }
    }, 0);

    setShowDropdown(false);
  };
  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
  }, [shortcuts]);

  useEffect(() => {
    // Set shortcuts based on selected option
    if (selectedOption === "contacts") {
      const contactShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        // {
        //   title: "Custom field:Website",
        //   isBold: false,
        //   value: "ACCOUNT_CUSTOM_FIELD:Website",
        // },
        { title: "Contact Shortcodes", isBold: true },
        { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
        { title: "First Name", isBold: false, value: "FIRST_NAME" },
        { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
        { title: "Last Name", isBold: false, value: "LAST_NAME" },
        { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
        { title: "Country", isBold: false, value: "COUNTRY" },
        { title: "Company name", isBold: false, value: "COMPANY_NAME " },
        { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
        { title: "City", isBold: false, value: "CITY" },
        { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
        { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
        {
          title: "Custom field:Email",
          isBold: false,
          value: "CONTACT_CUSTOM_FIELD:Email",
        },
        { title: "Date Shortcodes", isBold: true },
        {
          title: "Current day full date",
          isBold: false,
          value: "CURRENT_DAY_FULL_DATE",
        },
        {
          title: "Current day number",
          isBold: false,
          value: "CURRENT_DAY_NUMBER",
        },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        {
          title: "Current month number",
          isBold: false,
          value: "CURRENT_MONTH_NUMBER",
        },
        {
          title: "Current month name",
          isBold: false,
          value: "CURRENT_MONTH_NAME",
        },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        {
          title: "Last day full date",
          isBold: false,
          value: "LAST_DAY_FULL_DATE",
        },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        {
          title: "Last month number",
          isBold: false,
          value: "LAST_MONTH_NUMBER",
        },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        {
          title: "Next day full date",
          isBold: false,
          value: "NEXT_DAY_FULL_DATE",
        },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        {
          title: "Next month number",
          isBold: false,
          value: "NEXT_MONTH_NUMBER",
        },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(contactShortcuts);
    } else if (selectedOption === "account") {
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        // {
        //   title: "Custom field:Website",
        //   isBold: false,
        //   value: "ACCOUNT_CUSTOM_FIELD:Website",
        // },
        { title: "Date Shortcodes", isBold: true },
        {
          title: "Current day full date",
          isBold: false,
          value: "CURRENT_DAY_FULL_DATE",
        },
        {
          title: "Current day number",
          isBold: false,
          value: "CURRENT_DAY_NUMBER",
        },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        {
          title: "Current month number",
          isBold: false,
          value: "CURRENT_MONTH_NUMBER",
        },
        {
          title: "Current month name",
          isBold: false,
          value: "CURRENT_MONTH_NAME",
        },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        {
          title: "Last day full date",
          isBold: false,
          value: "LAST_DAY_FULL_DATE",
        },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        {
          title: "Last month number",
          isBold: false,
          value: "LAST_MONTH_NUMBER",
        },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        {
          title: "Next day full date",
          isBold: false,
          value: "NEXT_DAY_FULL_DATE",
        },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        {
          title: "Next month number",
          isBold: false,
          value: "NEXT_MONTH_NUMBER",
        },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);
  const handlechatsubject = (e) => {
    const { value } = e.target;
    setInputText(value);
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

  const [selecteduser, setSelectedUser] = useState("");

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleuserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const handleSaveExitTemplate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }

    // Create a FormData object
    const formData = new FormData();

    // Append form fields to FormData
    formData.append("templatename", templateName);
    formData.append("from", selecteduser.value);
    formData.append("emailsubject", inputText);
    formData.append("emailbody", emailBody);
    formData.append("mode", selectedOption)

    // Append files to FormData
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("attachments", file); // Use "attachments" as the field name
      });
    }

    try {
      const response = await fetch(`${EMAIL_API}/workflow/emailtemplate`, {
        method: "POST",
        body: formData, // Send FormData instead of JSON
        redirect: "follow",
      });
      const result = await response.json();

      if (result && result.message === "EmailTemplate already exists") {
        toast.success("Email Template already exists");
      } else {
        toast.success("Email Template created successfully");
        setShowForm(false);
        handleClearTemplate();
        fetchEmailTemplates();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleSaveTemplate = async(e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }

    // Create a FormData object
    const formData = new FormData();

    // Append form fields to FormData
    formData.append("templatename", templateName);
    formData.append("from", selecteduser.value);
    formData.append("emailsubject", inputText);
    formData.append("emailbody", emailBody);
    formData.append("mode", selectedOption)

    // Append files to FormData
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("attachments", file); // Use "attachments" as the field name
      });
    }

    try {
      const response = await fetch(`${EMAIL_API}/workflow/emailtemplate`, {
        method: "POST",
        body: formData, // Send FormData instead of JSON
        redirect: "follow",
      });
      const result = await response.json();

      if (result && result.message === "EmailTemplate already exists") {
        toast.success("Email Template already exists");
      } else {
        toast.success("Email Template created successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  const [emailBody, setEmailBody] = useState("");

  const handleEditorChange = (content) => {
    setEmailBody(content);
  };
  const handleClearTemplate = () => {
    setTemplateName("");
    setSelectedUser("");
    setInputText("");
    setEmailBody("");
  };
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmailTemplates = async () => {
    setLoading(true);
    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const url = `${EMAIL_API}/workflow/emailtemplate/`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();

      setEmailTemplates(data.emailTemplate);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    } finally {
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };

  useEffect(() => {
    fetchEmailTemplates();
  }, []);

  const handleEdit = (_id) => {
    navigate("emailTempUpdate/" + _id);
  };

  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this email template?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${EMAIL_API}/workflow/emailtemplate/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          toast.success("Data deleted successfully");
          fetchEmailTemplates();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const [globalFilter, setGlobalFilter] = useState("");

  const emailColumns = useMemo(() => [
    {
      accessorKey: "templatename",
      header: "Name",
      cell: ({ getValue, row }) => (
        <button
          onClick={() => handleEdit(row.original._id)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
        >
          {getValue()}
        </button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => handleEdit(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDelete(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], []);
  const handleTempCancle = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmClose) {
        return;
      }
    }
    setShowForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (templateName || selecteduser || inputText) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [templateName, selecteduser, inputText]);

  const [templateNameError, setTemplateNameError] = useState("");
  const [selectedUserError, setSelectedUserError] = useState("");
  const [inputTextError, setInputTextError] = useState("");

  const validateForm = () => {
    let isValid = true;

    if (templateName.trim() === "") {
      setTemplateNameError("Template name is required");
      isValid = false;
    } else {
      setTemplateNameError("");
    }

    if (!selecteduser) {
      setSelectedUserError("Please select a user");
      isValid = false;
    } else {
      setSelectedUserError("");
    }

    if (inputText.trim() === "") {
      setInputTextError("Email subject is required");
      isValid = false;
    } else {
      setInputTextError("");
    }

    return isValid;
  };

  //*********************** */

  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);


  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      handleFileChange(acceptedFiles); // Pass the array of files to handleFileChange
    },
    accept:
      "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png",
    multiple: true,
  });

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleButtonClick = (event) => {
    event.stopPropagation(); // Prevent click event from bubbling up
    document.getElementById("file-input").click(); // Trigger click on the hidden file input
  };

  const [files, setFiles] = useState([]);

  

  const handleFileChange = (acceptedFiles) => {
    if (!acceptedFiles || !Array.isArray(acceptedFiles)) return;
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };


  // Debounced function to check template name existence
  const checkTemplateName = async (name) => {
      try {
        const res = await axios.get(`${EMAIL_API}/workflow/check-name`, {
          params: { name },
        });
        if (res.data.exists) {
          setTemplateNameError('Template name already exists');
        } else {
          setTemplateNameError('');
        }
      } catch (err) {
        console.error(err);
        setTemplateNameError('');
      }
    };
  
   const debouncedCheck = debounce((name) => {
      if (name.trim()) checkTemplateName(name);
      else setTemplateNameError('');
    }, 500);
  
    useEffect(() => {
      debouncedCheck(templateName);
      return debouncedCheck.cancel;
    }, [templateName]);
  return (
    <div>
      {!showForm ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Button size="sm" onClick={handleCreateTemplate}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Email
            </Button>
          </div>
          <DataTableToolbar globalFilter={globalFilter} onGlobalFilterChange={setGlobalFilter} />
          <DataTable
            columns={emailColumns}
            data={emailTemplates}
            loading={loading}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            enableRowSelection={false}
            getRowId={(row) => row._id}
            emptyMessage="No email templates found"
            emptyDescription="Create your first email template to get started"
            pageSize={30}
          />
        </div>
      ) : (
        <FormPage
          title="Create Email Template"
          subtitle="Configure your new email template"
          actions={
            <>
              <Button variant="outline" onClick={handleTempCancle}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleSaveTemplate}>
                Save
              </Button>
              <Button onClick={handleSaveExitTemplate}>
                Save & Exit
              </Button>
            </>
          }
        >
          <FormGrid>
            {/* ===== LEFT COLUMN: Email Form ===== */}
            <FormGrid.Main>
              <FormSection title="Template Details">
                <FormField label="Template Name" error={templateNameError}>
                  <Input
                    name="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Template Name"
                    error={!!templateNameError}
                  />
                </FormField>

                <FormField label="Mode">
                  <RadioGroup value={selectedOption} onValueChange={(val) => handleChange({ target: { value: val } })}>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="contacts" id="contacts" />
                        <Label htmlFor="contacts" className="cursor-pointer text-sm">Contact Shortcodes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="account" id="account" />
                        <Label htmlFor="account" className="cursor-pointer text-sm">Account Shortcodes</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </FormField>
              </FormSection>

              <FormSection title="Sender & Subject">
                <FormField label="From" error={selectedUserError}>
                  <FormSelect
                    value={selecteduser?.value || ""}
                    onChange={(e) => {
                      const selected = options.find((o) => o.value === e.target.value) || null;
                      handleuserChange(null, selected);
                    }}
                    error={!!selectedUserError}
                  >
                    <option value="">Select Sender</option>
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </FormSelect>
                </FormField>

                <FormField label="Subject" error={inputTextError}>
                  <div className="space-y-2">
                    <Input
                      name="subject"
                      onChange={handlesubject}
                      ref={textFieldRef}
                      value={inputText}
                      onClick={(e) => setCursorPosition(e.target.selectionStart)}
                      placeholder="Subject"
                      error={!!inputTextError}
                    />
                    <ShortcodePopover
                      shortcuts={filteredShortcuts}
                      onSelect={handleAddShortcut}
                    />
                  </div>
                </FormField>
              </FormSection>

              {/* Email Body */}
              <FormSection title="Email Body">
                <EditorShortcodes onChange={handleEditorChange} />
              </FormSection>
            </FormGrid.Main>

            {/* ===== RIGHT COLUMN: Attachments ===== */}
            <FormGrid.Sidebar>
              <FormSection title="Attachments">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <input id="file-input" {...getInputProps()} className="hidden" multiple />
                  <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Drag & drop files here</p>
                  <p className="mt-1 text-xs text-muted-foreground">or</p>
                  <Button type="button" variant="outline" size="sm" className="mt-3">
                    Browse Files
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    20 MB limit. PDF, DOC, DOCX, XLS, XLSX, JPG, PNG.
                  </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-1">
                    <p className="text-sm font-medium text-foreground">Selected Files:</p>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(2)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedFiles = files.filter((_, i) => i !== index);
                            setFiles(updatedFiles);
                          }}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </FormSection>
            </FormGrid.Sidebar>
          </FormGrid>
        </FormPage>
      )}
    </div>
  );
};

export default EmailTemp;

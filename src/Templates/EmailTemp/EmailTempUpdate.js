import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EditorShortcodes from "../Texteditor/EditorShortcodes";
import { useDropzone } from "react-dropzone";
import { FormPage, FormSection, FormField, FormRow, FormActions, FormGrid, ShortcodePopover } from "../../components/ui/form-layout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Upload, Trash2, FileText, Mail, Paperclip, User } from "lucide-react";

const EmailTempUpdate = () => {
  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const { _id } = useParams();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [anchorEl, setAnchorEl] = useState(null);
  const [emailBody, setEmailBody] = useState("");
  const [userData, setUserData] = useState([]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    console.log("selectedOption",event.target.value)
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
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
  }, [shortcuts]);

  useEffect(() => {
    if (selectedOption === "contacts") {
      const contactShortcuts = [
        // Array of contact shortcuts
      ];
      setShortcuts(contactShortcuts);
    } else if (selectedOption === "account") {
      const accountShortcuts = [
        // Array of account shortcuts
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
  const handleuserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
  };
  useEffect(() => {
    fetchData();
    fetchEmailTemplates();
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

  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const handleEditorChange = (content) => {
    setEmailBody(content);
  };

  const [emailTemplates, setEmailTemplates] = useState([]);
  const fetchEmailTemplates = async () => {
    try {
      const url = `${EMAIL_API}/workflow/emailtemplate`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();

      setEmailTemplates(data.emailTemplate);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };

  const SendData = async (e) => {
    // Create a FormData object
    const formData = new FormData();

    // Append form fields to FormData
    formData.append("templatename", templateName);
    formData.append("from", selecteduser.value);
    formData.append("emailsubject", inputText);
    formData.append("emailbody", emailBody);
    formData.append("mode", selectedOption);
    // Append files to FormData
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("attachments", file); // Use "attachments" as the field name
      });
    }
console.log("formdata",formData)
    const requestOptions = {
      method: "PATCH",
      body: formData,
      redirect: "follow",
    };
    console.log("bhvfdg", formData);

    const url = `${EMAIL_API}/workflow/emailtemplate/${_id}`;

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Data update result:", result);
        toast.success("Template updated successfully!"); // Success message
        navigate("/firmtemp/templates/emails");
        fetchEmailTemplates(); // Reload templates
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        toast.error("Error updating template."); // Error message
      });
  };

  const saveTemp = () => {
    const formData = new FormData();
    formData.append("templatename", templateName);
    // formData.append("from", selecteduser.value);
    formData.append("from", selecteduser ? selecteduser.value : "");
    formData.append("emailsubject", inputText);
    formData.append("emailbody", emailBody);
    formData.append("mode", selectedOption);
    // Append each selected file to formData
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    // Logging FormData contents for debugging
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: ${value.name} (size: ${value.size} bytes)`); // Logging file name and size
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    const requestOptions = {
      method: "PATCH",
      body: formData,
      redirect: "follow",
    };

    const url = `${EMAIL_API}/workflow/emailtemplate/${_id}`;
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((result) => {
        console.log("Data update result:", result);
        toast.success("Template updated successfully!"); // Success message
        // navigate("/firmtemp/templates/emails")
        fetchEmailTemplates();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        toast.error("Error updating template."); // Error message
      });
  };
  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };
        const url = `${EMAIL_API}/workflow/emailtemplate/emailtemplateList/`;
        const response = await fetch(url + _id, requestOptions);

        const result = await response.json();
        setTempValues(result.emailTemplate);
        tempallvalue(result.emailTemplate);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmailData();
  }, []);
  const [mode, setMode] = useState("");
  const tempallvalue = (data) => {
    console.log(data);
    setTemplateName(data.templatename);
    setSelectedOption(data.mode);
    setInputText(data.emailsubject);
    setSelectedUser(
      data.from ? { value: data.from._id, label: data.from.username } : null
    );
    setEmailBody(data.emailbody);
    setSelectedOption(data.mode);
    const transformedFiles = data.attachments.map((attachment) => ({
      name: attachment.filename, // Use 'name' instead of 'filename'
      size: attachment.size, // Keep 'size' as is
      id: attachment._id, // Optionally include the ID for reference
    }));
    setFiles(transformedFiles);
  };

  // get id wise template Record
  const [tempvalues, setTempValues] = useState();
  // State to store emailTemplate data
  const [fromtempdata, setFromdataTemp] = useState();

  const handleSaveExitTemplate = () => {
    SendData();
    navigate("/firmtemp/templates/emails");
  };
  // const handleTempCancle = () => {
  //     navigate("/firmtemp/templates/emails")

  // }
  //shortcodes
  useEffect(() => {
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
        {
          title: "Custom field:Website",
          isBold: false,
          value: "ACCOUNT_CUSTOM_FIELD:Website",
        },
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
        {
          title: "Custom field:Website",
          isBold: false,
          value: "ACCOUNT_CUSTOM_FIELD:Website",
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
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);

  useEffect(() => {
    // Set shortcuts based on selected option
    if (selectedOption === "contacts") {
      const contactShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        {
          title: "Custom field:Website",
          isBold: false,
          value: "ACCOUNT_CUSTOM_FIELD:Website",
        },
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
        {
          title: "Custom field:Website",
          isBold: false,
          value: "ACCOUNT_CUSTOM_FIELD:Website",
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
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);

  const [isFormFilled, setIsFormFilled] = useState(false);
  const handleTempCancle = () => {
    if (isFormFilled) {
      const confirmCancel = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (confirmCancel) {
        navigate("/firmtemp/templates/emails");
      }
    } else {
      navigate("/firmtemp/templates/emails");
    }
  };

  useEffect(() => {
    // Check if form is filled
    const checkIfFormFilled = () => {
      if (templateName || inputText || emailBody || fromtempdata) {
        setIsFormFilled(true);
      } else {
        setIsFormFilled(false);
      }
    };

    checkIfFormFilled();
  }, [templateName, inputText, emailBody, fromtempdata]);

  //*********************** */

  const [selectedFiles, setSelectedFiles] = useState([]);

  // // Handle file drop
  // const onDrop = useCallback((acceptedFiles) => {
  //     setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  // }, []);

  // const { getRootProps, getInputProps } = useDropzone({
  //     onDrop,
  // });
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

  // const handleFileChange = (acceptedFiles) => {
  //   setFiles(acceptedFiles); // Store selected files in state
  // };

  const handleFileChange = (acceptedFiles) => {
    console.log("acceptedFiles:", acceptedFiles); // Debugging: Check what is being passed
    if (!acceptedFiles || !Array.isArray(acceptedFiles)) {
      console.error("acceptedFiles is not an array:", acceptedFiles);
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  return (
    <FormPage
      title="Edit Email Template"
      subtitle="Configure your email template settings"
      actions={
        <>
          <Button variant="outline" onClick={handleTempCancle}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={saveTemp}>
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
          <FormSection title="Template Details" icon={<Mail className="h-4 w-4" />}>
            <FormField label="Template Name">
              <Input
                name="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template Name"
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

          <FormSection title="Sender & Subject" icon={<User className="h-4 w-4" />}>
            <FormField label="From">
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selecteduser?.value || ""}
                onChange={(e) => {
                  const selected = options.find((o) => o.value === e.target.value) || null;
                  handleuserChange(null, selected);
                }}
              >
                <option value="">Select Sender</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Subject">
              <div className="space-y-2">
                <Input
                  name="subject"
                  onChange={handlesubject}
                  ref={textFieldRef}
                  value={inputText}
                  onClick={(e) => setCursorPosition(e.target.selectionStart)}
                  placeholder="Subject"
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
            <EditorShortcodes
              onChange={handleEditorChange}
              initialContent={emailBody}
            />
          </FormSection>
        </FormGrid.Main>

        {/* ===== RIGHT COLUMN: Attachments ===== */}
        <FormGrid.Sidebar>
          <FormSection title="Attachments" icon={<Paperclip className="h-4 w-4" />}>
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
                      onClick={async () => {
                        const fileToDelete = files[index];
                        console.log("filename", fileToDelete);
                        if (!fileToDelete.id) {
                          const updatedFiles = files.filter((_, i) => i !== index);
                          setFiles(updatedFiles);
                          return;
                        }
                        try {
                          const response = await fetch(
                            `${EMAIL_API}/workflow/deleteattachments/${_id}/${fileToDelete.name}`,
                            { method: "DELETE" }
                          );
                          if (!response.ok) {
                            throw new Error("Failed to delete file from server");
                          }
                          const updatedFiles = files.filter((_, i) => i !== index);
                          setFiles(updatedFiles);
                        } catch (error) {
                          console.error("Error deleting file:", error);
                        }
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
  );
};

export default EmailTempUpdate;

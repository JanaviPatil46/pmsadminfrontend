import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import axios from "axios";
const CreateOrganizerUpdate = ({ OrganizerData, onClose }) => {
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();
  // const [expandedSection, setExpandedSection] = useState(null);
  const [organizerTemp, setOrganizerTemp] = useState(null);
  const [sections, setSections] = useState([]);
  const [organizerId, setOrganizerId] = useState("");
  const [showConditional, setShowConditional] = useState(false);
  useEffect(() => {
    fetchOrganizerOfAccount(data);
  }, []);

  const fetchOrganizerOfAccount = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${data}`;
    console.log(url);
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const selectedOrganizer = result.organizerAccountWise.find(
          (org) => org._id === OrganizerData
        );
        console.log("fdfd", selectedOrganizer);
        setOrganizerTemp(selectedOrganizer);
        setOrganizerId(selectedOrganizer._id);
        setSections(selectedOrganizer.sections);
        // Loop through the sections and form elements to log text and textvalue
      })
      .catch((error) => console.error(error));
  };
  console.log(organizerTemp);
  // const handleToggleSection = (sectionId) => {
  //   setExpandedSection((prevExpandedSection) =>
  //     prevExpandedSection === sectionId ? null : sectionId
  //   );
  // };
  // use array instead of single value
const [expandedSections, setExpandedSections] = useState([]);

// toggle function
const handleToggleSection = (sectionId) => {
  setExpandedSections((prevExpanded) =>
    prevExpanded.includes(sectionId)
      ? prevExpanded.filter((id) => id !== sectionId) // close it
      : [...prevExpanded, sectionId] // open it
  );
};

  const [drawerOpen, setDrawerOpen] = useState(false); // State to manage Drawer visibility
  const [drawerContent, setDrawerContent] = useState(""); // State to store content for Drawer
  const handleOpenDrawer = (content) => {
    console.log("Opening Drawer with content:", content); // Debugging log
    setDrawerContent(content);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };
  const handleCheckboxChange = async (sectionId, formElementId, checked) => {
    try {
      // Call API to update backend
      await axios.patch(
        `${ORGANIZER_TEMP_API}/workflow/orgaccwise/${organizerId}/sections/${sectionId}/form-elements/${formElementId}`,
        { active: checked }
      );

      // Update local state after successful backend update
      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            formElements: section.formElements.map((el) => {
              if (el.id === formElementId) {
                return { ...el, active: checked };
              }
              return el;
            }),
          };
        }
        return section;
      });

      setSections(updatedSections);
    } catch (error) {
      console.error("Failed to update active status in backend:", error);
      // Optionally show an error to the user
    }
  };
  // Filter sections based on conditional settings and toggle state
  const filteredSections = sections.filter((section) => {
    return !section.sectionsettings?.conditional || showConditional;
  });
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showConditional}
            onChange={(e) => setShowConditional(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
        </label>
        <span className="text-sm text-foreground">Show Hidden Questions</span>
      </div>

      {filteredSections.length > 0 ? (
        filteredSections.map((section) => (
          <div key={section.id} className="mb-4">
            <div className="flex items-center cursor-pointer" onClick={() => handleToggleSection(section.id)}>
              <span className="flex-1 text-sm font-medium">
                {section.text}
                {section.sectionsettings?.conditional && showConditional && (
                  <span className="ml-1 italic text-muted-foreground text-xs">(Hidden Section)</span>
                )}
              </span>
              <span className="text-xs text-muted-foreground mr-2">
                ({section.formElements.filter((el) => el.textvalue && (!el.questionsectionsettings?.conditional || showConditional)).length}
                {" / "}
                {section.formElements.filter((el) => !el.questionsectionsettings?.conditional || showConditional).length})
              </span>
              <button type="button" className="p-1 text-muted-foreground">
                {expandedSections.includes(section.id) ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>

            {expandedSections.includes(section.id) && (
              <div className="rounded-lg border border-border mt-2 overflow-hidden">
                <table className="w-full table-fixed text-sm">
                  <colgroup>
                    <col className="w-[40%]" />
                    <col className="w-[45%]" />
                    <col className="w-[15%]" />
                  </colgroup>
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Question</th>
                      <th className="text-left px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Answer</th>
                      <th className="text-center px-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reviewed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {section.formElements
                      .filter((formElement) => !formElement.questionsectionsettings?.conditional || showConditional)
                      .map((formElement) => (
                        <tr key={formElement.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-2 py-1.5 text-xs text-foreground align-top">
                            {formElement.type === "Text Editor" ? "Text Block" : formElement.text}
                          </td>
                          <td className="px-2 py-1.5 text-xs text-muted-foreground align-top">
                            {formElement.type === "Text Editor" ? (
                              <span
                                className="text-primary cursor-pointer hover:underline"
                                onClick={() => handleOpenDrawer(formElement.text)}
                              >
                                Display
                              </span>
                            ) : (
                              <span className="whitespace-pre-line">{formElement.textvalue}</span>
                            )}
                          </td>
                          <td className="px-2 py-1.5 text-center align-middle">
                            {formElement.type !== "Text Editor" && (
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={formElement.active || false}
                                  onChange={(e) => handleCheckboxChange(section.id, formElement.id, e.target.checked)}
                                  className="h-3.5 w-3.5 rounded border-border cursor-pointer"
                                />
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      ) : (
        <span />
      )}

      <button type="button" onClick={onClose}
        className="mt-2 px-4 py-1.5 text-sm rounded border border-border text-foreground hover:bg-muted">
        Back
      </button>

      {/* Text Block Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" onClick={handleCloseDrawer} />
          <div className="absolute right-0 top-0 h-full w-[600px] bg-card shadow-xl overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Text Block Content</span>
              <button type="button" onClick={handleCloseDrawer} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: drawerContent }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrganizerUpdate;

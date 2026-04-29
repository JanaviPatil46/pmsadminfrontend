import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, FileText, ArrowLeft } from "lucide-react";
import axios from "axios";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";

const CreateOrganizerUpdate = ({ OrganizerData, onClose }) => {
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();
  const [organizerTemp, setOrganizerTemp] = useState(null);
  const [sections, setSections] = useState([]);
  const [organizerId, setOrganizerId] = useState("");
  const [showConditional, setShowConditional] = useState(false);
  const [expandedSections, setExpandedSections] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState("");

  useEffect(() => {
    fetchOrganizerOfAccount(data);
  }, []);

  const fetchOrganizerOfAccount = () => {
    const requestOptions = { method: "GET", redirect: "follow" };
    const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${data}`;
    fetch(url, requestOptions)
      .then((r) => r.json())
      .then((result) => {
        const selectedOrganizer = result.organizerAccountWise.find(
          (org) => org._id === OrganizerData
        );
        setOrganizerTemp(selectedOrganizer);
        setOrganizerId(selectedOrganizer._id);
        setSections(selectedOrganizer.sections);
      })
      .catch((error) => console.error(error));
  };

  const handleToggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleOpenDrawer = (content) => {
    setDrawerContent(content);
    setDrawerOpen(true);
  };

  const handleCheckboxChange = async (sectionId, formElementId, checked) => {
    try {
      await axios.patch(
        `${ORGANIZER_TEMP_API}/workflow/orgaccwise/${organizerId}/sections/${sectionId}/form-elements/${formElementId}`,
        { active: checked }
      );
      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                formElements: section.formElements.map((el) =>
                  el.id === formElementId ? { ...el, active: checked } : el
                ),
              }
            : section
        )
      );
    } catch (error) {
      console.error("Failed to update active status in backend:", error);
    }
  };

  const filteredSections = sections.filter(
    (section) => !section.sectionsettings?.conditional || showConditional
  );

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40 border border-border/60">
        <div className="flex items-center gap-2.5">
          <Switch
            id="show-hidden"
            checked={showConditional}
            onCheckedChange={setShowConditional}
          />
          <label htmlFor="show-hidden" className="text-sm font-medium text-foreground cursor-pointer select-none">
            Show hidden questions
          </label>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>
      </div>

      {/* Sections */}
      {filteredSections.length > 0 ? (
        <div className="space-y-3">
          {filteredSections.map((section) => {
            const visibleElements = section.formElements.filter(
              (el) => !el.questionsectionsettings?.conditional || showConditional
            );
            const answeredCount = visibleElements.filter(
              (el) => el.textvalue
            ).length;
            const isExpanded = expandedSections.includes(section.id);
            const isComplete = answeredCount === visibleElements.length && visibleElements.length > 0;

            return (
              <div key={section.id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                {/* Section header */}
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => handleToggleSection(section.id)}
                >
                  <span className="flex-1 text-sm font-semibold text-foreground">
                    {section.text}
                    {section.sectionsettings?.conditional && showConditional && (
                      <span className="ml-2 text-[10px] font-normal italic text-muted-foreground">(hidden)</span>
                    )}
                  </span>
                  <Badge
                    variant={isComplete ? "default" : "secondary"}
                    className="text-[10px] font-semibold px-2 py-0.5 shrink-0"
                  >
                    {answeredCount} / {visibleElements.length}
                  </Badge>
                  <span className="text-muted-foreground shrink-0">
                    {isExpanded
                      ? <ChevronUp className="h-4 w-4" />
                      : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>

                {/* Section body */}
                {isExpanded && (
                  <>
                    <Separator />
                    <div className="overflow-hidden">
                      <table className="w-full table-fixed text-sm">
                        <colgroup>
                          <col className="w-[40%]" />
                          <col className="w-[45%]" />
                          <col className="w-[15%]" />
                        </colgroup>
                        <thead className="bg-muted/40">
                          <tr>
                            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Question</th>
                            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Answer</th>
                            <th className="text-center px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Reviewed</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {visibleElements.map((formElement) => (
                            <tr key={formElement.id} className="hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-2.5 text-xs text-foreground align-top font-medium">
                                {formElement.type === "Text Editor" ? "Text Block" : formElement.text}
                              </td>
                              <td className="px-4 py-2.5 text-xs text-muted-foreground align-top">
                                {formElement.type === "Text Editor" ? (
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-1 text-primary text-xs font-medium hover:underline"
                                    onClick={() => handleOpenDrawer(formElement.text)}
                                  >
                                    <FileText className="h-3 w-3" />
                                    View content
                                  </button>
                                ) : (
                                  <span className="whitespace-pre-line leading-relaxed">
                                    {formElement.textvalue || <span className="text-muted-foreground/50 italic">No answer</span>}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2.5 text-center align-middle">
                                {formElement.type !== "Text Editor" && (
                                  <Checkbox
                                    checked={formElement.active || false}
                                    onCheckedChange={(checked) =>
                                      handleCheckboxChange(section.id, formElement.id, checked)
                                    }
                                    className="mx-auto"
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">No sections found</p>
        </div>
      )}

      {/* Text Block Sheet */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[560px] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" />
              Text Block Content
            </SheetTitle>
          </SheetHeader>
          <Separator className="mb-4" />
          <div
            className="prose prose-sm max-w-none text-foreground [&_p]:mb-2 [&_ul]:pl-4 [&_ol]:pl-4 [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: drawerContent }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateOrganizerUpdate;

import { useState, useEffect, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { debounce } from "lodash";
import UploadDrawer from "./UploadDrawer";
import { LoginContext } from "../../Sidebar/Context/Context";
import { X, ChevronLeft, ChevronRight, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
} from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
const OrganizerDialog = ({ open, handleClose, organizer,accountid }) => {
    const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
   const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState();
    useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
    useEffect(() => {
    if (loginuserid) {
       fetchData(loginuserid);
    }
  }, [loginuserid]);
   const [username, setUsername] = useState("");
  const fetchData = async (id) => {
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
        setUsername(result.username);
      });
  };
 const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  // const ORGANIZER_AUTOSAVE_API = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/autosave`;
  const sections = organizer?.sections;
  const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [answeredElements, setAnsweredElements] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [startDate, setStartDate] = useState(dayjs());
const [uploadedFiles, setUploadedFiles] = useState({}); // Stores file names for each file upload question
 const [file, setFile] = useState(null);
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  // Create a debounced auto-save function
  const debouncedAutoSave = useCallback(
    debounce(async (data) => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(data);

        const requestOptions = {
          method: "PATCH",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        // const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/autosave/${organizer._id}`;
          const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
        const response = await fetch(url, requestOptions);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to auto-save organizer");
        }
        
        // auto-save successful
      } catch (error) {
        console.error("Error auto-saving organizer:", error);
      }
    }, 2000), // 2 second debounce delay
    [organizer?._id]
  );

  // Function to prepare data for submission (used by both auto-save and submit)
  const prepareSubmitData = (finalSubmit = false) => {
    return {
      sections: organizer?.sections?.map((section) => ({
        name: section?.text || "",
        id: section?.id?.toString() || "",
        text: section?.text || "",
        sectionsettings: section?.sectionsettings ,
        formElements:
          section?.formElements?.map((question) => ({
            type: question?.type || "",
            id: question?.id || "",
            sectionid: section?.id || "",
            options:
              question?.options?.map((option) => ({
                id: option?.id || "",
                text: option?.text || "",
                selected: getOptionSelectedState(
                  question,
                  option,
                  section.id
                ),
              })) || [],
            text: question?.text || "",
            textvalue: getQuestionTextValue(question, section.id),
            questionsectionsettings: question?.questionsectionsettings ,
             ...(question.type === "File Upload" && {
            fileMetadata: {
              fileName: uploadedFiles[`${section.id}_${question.text}`] || "",
              // Add other metadata like upload date, size, etc.
            }
          })
          })) || [],
          
      })) || [],
      status: finalSubmit ? "Completed" : "In Progress",
      completedby:loginuserid,
      active: true,
      lastSaved: new Date().toISOString(),
    };
  };

  // Auto-save whenever relevant state changes
  useEffect(() => {
    if (open && organizer?._id) {
      const data = prepareSubmitData(false);
      debouncedAutoSave(data);
    }
  }, [
    open,
    organizer?._id,
    inputValues,
    radioValues,
    checkboxValues,
    selectedYesNoValues,
    selectedDropdownValues,
    startDate,
     uploadedFiles,
    debouncedAutoSave,
  ]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedAutoSave.cancel();
    };
  }, [debouncedAutoSave]);

  const handleRadioChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setRadioValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleCheckboxChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [key]: {
        ...prevValues[key],
        [value]: !prevValues[key]?.[value],
      },
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleYesNoChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedYesNoValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleInputChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    const { value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleDropdownValueChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: event.target.value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const shouldShowSection = (section) => {
    if (!section.sectionsettings?.conditional) return true;
    const conditions = section.sectionsettings.conditions || [];

    return conditions.every((condition) => {
      if (!condition.question || !condition.answer) return false;

      for (const key in radioValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          radioValues[key] === condition.answer
        ) {
          return true;
        }
      }

      for (const key in checkboxValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          checkboxValues[key]?.[condition.answer]
        ) {
          return true;
        }
      }

      for (const key in selectedDropdownValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          selectedDropdownValues[key] === condition.answer
        ) {
          return true;
        }
      }

      for (const key in selectedYesNoValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          selectedYesNoValues[key] === condition.answer
        ) {
          return true;
        }
      }
      return false;
    });
  };

  const getVisibleSections = () => (sections || []).filter(shouldShowSection);

  const visibleSections = getVisibleSections();
  const totalSteps = visibleSections.length;

  const shouldShowElement = (element, sectionId) => {
    const settings = element.questionsectionsettings;
    if (!settings?.conditional) return true;
    const conditions = settings?.conditions || [];

    for (const condition of conditions) {
      const { question, answer } = condition;
      if (!question || !answer) continue;

      let conditionMet = false;

      for (const key in radioValues) {
        if (key.endsWith(`_${question}`) && radioValues[key] === answer) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      for (const key in checkboxValues) {
        if (key.endsWith(`_${question}`) && checkboxValues[key]?.[answer]) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      for (const key in selectedDropdownValues) {
        if (
          key.endsWith(`_${question}`) &&
          selectedDropdownValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      for (const key in selectedYesNoValues) {
        if (
          key.endsWith(`_${question}`) &&
          selectedYesNoValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleDropdownChange = (event) => {
    const selectedIndex = event.target.value;
    setActiveStep(selectedIndex);
  };

  const handleSubmit = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const data = prepareSubmitData(true); // true for final submission
 // Determine which endpoint to use based on status
    const endpoint = data.status === "Completed" 
      ? `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/completeandnotify/${organizer._id}`
      : `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: "follow",
      };

      // const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
       const response = await fetch(endpoint, requestOptions);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update organizer");
      }

      toast.success("Organizer updated successfully");
      handleClose();
    } catch (error) {
      console.error("Error submitting organizer:", error);
      toast.error(
        error.message || "Something went wrong while updating organizer!"
      );
    }
  };

  const getQuestionTextValue = (question, sectionId) => {
    const key = `${sectionId}_${question.text}`;

    switch (question.type) {
      case "Free Entry":
      case "Email":
      case "Number":
        return inputValues[key] || "";
      case "Radio Buttons":
        return radioValues[key] || "";
      case "Checkboxes":
        return checkboxValues[key]
          ? Object.keys(checkboxValues[key])
              .filter((k) => checkboxValues[key][k])
              .join(", ")
          : "";
      case "Yes/No":
        return selectedYesNoValues[key] || "";
      case "Dropdown":
        return selectedDropdownValues[key] || "";
      case "Date":
        return startDate?.toISOString() || "";
      case "Text Editor":
        return question.text || "";
         case "File Upload":
      return uploadedFiles[key] || "";
      default:
        return "";
    }
  };

  const getOptionSelectedState = (question, option, sectionId) => {
    const key = `${sectionId}_${question.text}`;
    switch (question.type) {
      case "Radio Buttons":
        return radioValues[key] === option.text;
      case "Checkboxes":
        return checkboxValues[key]?.[option.text] || false;
      case "Yes/No":
        return selectedYesNoValues[key] === option.text;
      case "Dropdown":
        return selectedDropdownValues[key] === option.text;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (organizer?.sections) {
      const newInputValues = {};
      const newRadioValues = {};
      const newCheckboxValues = {};
      const newSelectedYesNoValues = {};
      const newSelectedDropdownValues = {};
      const newAnsweredElements = {};
       const newUploadedFiles = {};
      let initialDate = dayjs();

      organizer.sections.forEach((section) => {
        section.formElements.forEach((element) => {
          const key = `${section.id}_${element.text}`;

          if (element.textvalue) {
            newAnsweredElements[key] = true;

            switch (element.type) {
              case "Free Entry":
              case "Email":
              case "Number":
                newInputValues[key] = element.textvalue;
                break;
              case "Radio Buttons":
                newRadioValues[key] = element.textvalue;
                break;
              case "Checkboxes":
                const selectedOptions = element.textvalue
                  .split(",")
                  .map((s) => s.trim());
                newCheckboxValues[key] = {};
                element.options.forEach((option) => {
                  newCheckboxValues[key][option.text] =
                    selectedOptions.includes(option.text);
                });
                break;
              case "Yes/No":
                newSelectedYesNoValues[key] = element.textvalue;
                break;
              case "Dropdown":
                newSelectedDropdownValues[key] = element.textvalue;
                break;
              case "Date":
                initialDate = dayjs(element.textvalue);
                break;
                     case "File Upload":
              // If there's a textvalue, assume it's a file name
              if (element.textvalue) {
                newUploadedFiles[key] = element.textvalue;
              }
              break;
            }
          }
        });
      });

      setInputValues(newInputValues);
      setRadioValues(newRadioValues);
      setCheckboxValues(newCheckboxValues);
      setSelectedYesNoValues(newSelectedYesNoValues);
      setSelectedDropdownValues(newSelectedDropdownValues);
      setAnsweredElements(newAnsweredElements);
      setStartDate(initialDate);
        setUploadedFiles(newUploadedFiles);
    }
  }, [organizer]);

  const isElementActive = (element) => {
    if (organizer?.issealed) return true;
    return element.active === true;
  };

  const inputCls = "w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:cursor-not-allowed placeholder:text-muted-foreground transition-colors";
  const optionBtn = (active, disabled) => `rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
    disabled ? 'opacity-50 cursor-not-allowed border-border text-muted-foreground' :
    active ? 'bg-primary text-primary-foreground border-primary' :
    'border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary'
  }`;

  const progressPct = totalSteps > 0 ? Math.round(((activeStep + 1) / totalSteps) * 100) : 0;

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-none w-screen h-screen p-0 rounded-none flex flex-col gap-0 overflow-hidden translate-x-0 translate-y-0 left-0 top-0 [&>button:first-of-type]:hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background shrink-0">
            <div>
              <p className="text-base font-semibold text-foreground">{organizer?.organizerName || "Organizer"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Step {activeStep + 1} of {totalSteps}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 text-muted-foreground">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-muted shrink-0">
            <div className="h-1 bg-primary transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-6 py-6">
              {/* Section select */}
              <Select value={String(activeStep)} onValueChange={(v) => setActiveStep(Number(v))}>
                <SelectTrigger className="mb-5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {visibleSections.map((section, index) => {
                    const visEls = section.formElements.filter((el) => shouldShowElement(el, section.id));
                    const answered = visEls.reduce((c, el) => c + (answeredElements[`${section.id}_${el.text}`] ? 1 : 0), 0);
                    return (
                      <SelectItem key={section.id} value={String(index)}>
                        {section.text} ({answered}/{visEls.length})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <div>
            {visibleSections.map((section, sectionIndex) =>
              sectionIndex === activeStep && (
                <div key={section.id}>
                  {section.formElements.map((element) =>
                    shouldShowElement(element, section.id) && (
                      <div key={`${section.id}_${element.id}`} className="mb-5">

                        {element.type === "Text Editor" && (
                          <p className="text-sm text-foreground my-3" dangerouslySetInnerHTML={{ __html: element.text }} />
                        )}

                        {(element.type === "Free Entry" || element.type === "Email") && (
                          <div>
                            <p className="text-sm font-semibold mb-1">{element.text}</p>
                            <textarea
                              className={inputCls}
                              rows={3}
                              placeholder={`${element.type} Answer`}
                              disabled={isElementActive(element)}
                              value={inputValues[`${section.id}_${element.text}`] || ""}
                              onChange={(e) => handleInputChange(e, element.text, section.id)}
                            />
                          </div>
                        )}

                        {element.type === "Number" && (
                          <div>
                            <p className="text-sm font-semibold mb-1">{element.text}</p>
                            <input
                              type="text" inputMode="numeric" pattern="[0-9]*"
                              className={inputCls}
                              placeholder="Number Answer"
                              disabled={isElementActive(element)}
                              value={inputValues[`${section.id}_${element.text}`] || ""}
                              onChange={(e) => handleInputChange({ target: { value: e.target.value.replace(/\D/g, "") } }, element.text, section.id)}
                            />
                          </div>
                        )}

                        {element.type === "Radio Buttons" && (
                          <div>
                            <p className="text-sm font-semibold mb-2">{element.text}</p>
                            <div className="flex flex-wrap gap-2">
                              {element.options.map((option) => (
                                <button key={option.text} type="button"
                                  className={optionBtn(radioValues[`${section.id}_${element.text}`] === option.text, isElementActive(element))}
                                  onClick={() => !isElementActive(element) && handleRadioChange(option.text, element.text, section.id)}
                                >{option.text}</button>
                              ))}
                            </div>
                          </div>
                        )}

                        {element.type === "Checkboxes" && (
                          <div>
                            <p className="text-sm font-semibold mb-2">{element.text}</p>
                            <div className="flex flex-wrap gap-2">
                              {element.options.map((option) => (
                                <button key={option.text} type="button"
                                  className={optionBtn(!!checkboxValues[`${section.id}_${element.text}`]?.[option.text], isElementActive(element))}
                                  onClick={() => !isElementActive(element) && handleCheckboxChange(option.text, element.text, section.id)}
                                >{option.text}</button>
                              ))}
                            </div>
                          </div>
                        )}

                        {element.type === "Yes/No" && (
                          <div>
                            <p className="text-sm font-semibold mb-2">{element.text}</p>
                            <div className="flex gap-2">
                              {element.options.map((option) => (
                                <button key={option.text} type="button"
                                  className={optionBtn(selectedYesNoValues[`${section.id}_${element.text}`] === option.text, isElementActive(element))}
                                  onClick={() => !isElementActive(element) && handleYesNoChange(option.text, element.text, section.id)}
                                >{option.text}</button>
                              ))}
                            </div>
                          </div>
                        )}

                        {element.type === "Dropdown" && (
                          <div>
                            <p className="text-sm font-semibold mb-1">{element.text}</p>
                            <select
                              className={inputCls}
                              disabled={isElementActive(element)}
                              value={selectedDropdownValues[`${section.id}_${element.text}`] || ""}
                              onChange={(event) => handleDropdownValueChange(event, element.text, section.id)}
                            >
                              {element.options.map((option) => (
                                <option key={option.text} value={option.text}>{option.text}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {element.type === "Date" && (
                          <div>
                            <p className="text-sm font-semibold mb-1">{element.text}</p>
                            <input
                              type="date"
                              className={inputCls}
                              disabled={isElementActive(element)}
                              value={startDate ? (dayjs.isDayjs(startDate) ? startDate.format('YYYY-MM-DD') : startDate) : ""}
                              onChange={(e) => {
                                if (!isElementActive(element)) {
                                  setStartDate(e.target.value);
                                  setAnsweredElements((prev) => ({ ...prev, [`${section.id}_${element.text}`]: true }));
                                }
                              }}
                            />
                          </div>
                        )}

                        {element.type === "File Upload" && (
                          <div>
                            <p className="text-sm font-semibold mb-2">{element.text}</p>
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isElementActive(element)}
                                className="gap-1.5 text-xs"
                                onClick={() => document.getElementById(`fileInput_${section.id}_${element.id}`)?.click()}
                              >
                                <Upload className="h-3.5 w-3.5" />
                                Upload Document
                              </Button>
                              <input
                                type="file"
                                id={`fileInput_${section.id}_${element.id}`}
                                className="hidden"
                                disabled={isElementActive(element)}
                                onChange={(e) => {
                                  const selectedFile = e.target.files[0];
                                  if (selectedFile) {
                                    setFile(selectedFile);
                                    setIsDocumentForm(true);
                                    const key = `${section.id}_${element.text}`;
                                    setUploadedFiles(prev => ({ ...prev, [key]: selectedFile.name }));
                                    setAnsweredElements(prev => ({ ...prev, [key]: true }));
                                  }
                                }}
                              />
                              {uploadedFiles[`${section.id}_${element.text}`] && (
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted border border-border">
                                  <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                                  <span className="text-xs text-foreground truncate max-w-[180px]">{uploadedFiles[`${section.id}_${element.text}`]}</span>
                                  <button
                                    type="button"
                                    className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                                    disabled={isElementActive(element)}
                                    onClick={() => {
                                      const key = `${section.id}_${element.text}`;
                                      setUploadedFiles(prev => { const n = {...prev}; delete n[key]; return n; });
                                      setAnsweredElements(prev => ({ ...prev, [key]: false }));
                                      const d = prepareSubmitData(false);
                                      debouncedAutoSave(d);
                                    }}
                                  ><X className="h-3 w-3" /></button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                      </div>
                    )
                  )}
                </div>
              )
            )}

              </div>

              {/* Navigation */}
              <Separator className="my-6" />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  className="gap-1.5 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <span className="text-xs text-muted-foreground font-medium">
                  {progressPct}% complete
                </span>
                {activeStep < totalSteps - 1 ? (
                  <Button type="button" size="sm" onClick={handleNext} className="gap-1.5 rounded-full">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" size="sm" onClick={handleSubmit} className="rounded-full px-6">
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    <UploadDrawer
  open={isDocumentForm}
  onClose={() => setIsDocumentForm(false)}
  file={file}
  organizer={organizer}
  accountId={accountid}
   uploadedFiles={uploadedFiles}  // Pass the state down
  setUploadedFiles={setUploadedFiles} 
  onUploadSuccess={(fileData) => {
    // Update local state with the file name
    const key = Object.keys(uploadedFiles).find(
      k => uploadedFiles[k] === file?.name
    );
    
    if (key) {
      setUploadedFiles(prev => ({
        ...prev,
        [key]: fileData.fileName
      }));
      
      // Trigger auto-save with the new file name
      const data = prepareSubmitData(false);
      debouncedAutoSave(data);
    }
    
    setFile(null);
    setIsDocumentForm(false);
  }}
  onUploadError={(error) => {
    console.error("File upload failed:", error);
    // Clear the file selection if upload fails
    const key = Object.keys(uploadedFiles).find(
      k => uploadedFiles[k] === file?.name
    );
    if (key) {
      setUploadedFiles(prev => {
        const newState = {...prev};
        delete newState[key];
        return newState;
      });
    }
    setFile(null);
  }}
/>

</>
  );
};

export default OrganizerDialog;
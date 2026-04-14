// import {
//   MenuItem,
//   Select,
//   FormControl,
//   Dialog,
//   DialogContent,
//   DialogTitlen,
//   Typography,
//   DialogTitle,
//   IconButton,
//   Box,
//   TextField,
//   CircularProgress,
//   Button,
// } from "@mui/material";

// import { LinearProgress } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { useState, useEffect } from "react";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { toast } from "react-toastify";
// import dayjs from "dayjs";
// const OrganizerDialog = ({ open, handleClose, organizer }) => {
//   const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
//   const sections = organizer?.sections; // Assigned const here
// console.log("organizer",organizer)
//   const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
//   const [inputValues, setInputValues] = useState({});
//   const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
//   const [radioValues, setRadioValues] = useState({});
//   const [checkboxValues, setCheckboxValues] = useState({});
//   const [answeredElements, setAnsweredElements] = useState({});
//   const [activeStep, setActiveStep] = useState(0);
//   const [startDate, setStartDate] = useState(dayjs());


//   const handleRadioChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setRadioValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
  
//   };
//   const handleCheckboxChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setCheckboxValues((prevValues) => ({
//       ...prevValues,
//       [key]: {
//         ...prevValues[key],
//         [value]: !prevValues[key]?.[value],
//       },
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
   
//   };

//   const handleYesNoChange = (value, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setSelectedYesNoValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
   
//   };

//   const handleInputChange = (event, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     const { value } = event.target;
//     setInputValues((prevValues) => ({
//       ...prevValues,
//       [key]: value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
   
//   };
//   const handleDropdownValueChange = (event, elementText, sectionId) => {
//     const key = `${sectionId}_${elementText}`;
//     setSelectedDropdownValues((prevValues) => ({
//       ...prevValues,
//       [key]: event.target.value,
//     }));
//     setAnsweredElements((prevAnswered) => ({
//       ...prevAnswered,
//       [key]: true,
//     }));
    
//   };
//   const shouldShowSection = (section) => {
//     if (!section.sectionsettings?.conditional) return true;
//     const conditions = section.sectionsettings.conditions || [];

//     return conditions.every((condition) => {
//       if (!condition.question || !condition.answer) return false;

//       // Check all possible sections for the answer
//       for (const key in radioValues) {
//         if (
//           key.endsWith(`_${condition.question}`) &&
//           radioValues[key] === condition.answer
//         ) {
//           return true;
//         }
//       }

//       for (const key in checkboxValues) {
//         if (
//           key.endsWith(`_${condition.question}`) &&
//           checkboxValues[key]?.[condition.answer]
//         ) {
//           return true;
//         }
//       }

//       for (const key in selectedDropdownValues) {
//         if (
//           key.endsWith(`_${condition.question}`) &&
//           selectedDropdownValues[key] === condition.answer
//         ) {
//           return true;
//         }
//       }
//       // Check Yes/No values
//       for (const key in selectedYesNoValues) {
//         if (
//           key.endsWith(`_${condition.question}`) &&
//           selectedYesNoValues[key] === condition.answer
//         ) {
//           return true;
//         }
//       }
//       return false;
//     });
//   };

//   //   const getVisibleSections = () => sections.filter(shouldShowSection);
//   const getVisibleSections = () => (sections || []).filter(shouldShowSection);

//   const visibleSections = getVisibleSections();
//   const totalSteps = visibleSections.length;

//   const shouldShowElement = (element, sectionId) => {
//     const settings = element.questionsectionsettings;
//     if (!settings?.conditional) return true;
//     const conditions = settings?.conditions || [];

//     for (const condition of conditions) {
//       const { question, answer } = condition;
//       if (!question || !answer) continue;

//       // Check all possible sections for the answer
//       let conditionMet = false;

//       // Check radio values
//       for (const key in radioValues) {
//         if (key.endsWith(`_${question}`) && radioValues[key] === answer) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) continue;

//       // Check checkbox values
//       for (const key in checkboxValues) {
//         if (key.endsWith(`_${question}`) && checkboxValues[key]?.[answer]) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) continue;

//       // Check dropdown values
//       for (const key in selectedDropdownValues) {
//         if (
//           key.endsWith(`_${question}`) &&
//           selectedDropdownValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) continue;
//       // Check Yes/No values
//       for (const key in selectedYesNoValues) {
//         if (
//           key.endsWith(`_${question}`) &&
//           selectedYesNoValues[key] === answer
//         ) {
//           conditionMet = true;
//           break;
//         }
//       }
//       if (conditionMet) continue;
//       // If we get here, no condition was met
//       return false;
//     }

//     return true;
//   };

//   const handleNext = () => {
//     if (activeStep < totalSteps - 1) {
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     }
//   };

//   const handleDropdownChange = (event) => {
//     const selectedIndex = event.target.value;
//     setActiveStep(selectedIndex);
//   };

//   const handleSubmit = async () => {
//     try {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       const raw = JSON.stringify({
//         sections:
//           organizer?.sections?.map((section) => ({
//             name: section?.text || "",
//             id: section?.id?.toString() || "",
//             text: section?.text || "",
//             formElements:
//               section?.formElements?.map((question) => ({
//                 type: question?.type || "",
//                 id: question?.id || "",
//                 sectionid: section?.id || "", // Using section.id instead of question.sectionid
//                 options:
//                   question?.options?.map((option) => ({
//                     id: option?.id || "",
//                     text: option?.text || "",
//                     selected: getOptionSelectedState(
//                       question,
//                       option,
//                       section.id
//                     ),
//                   })) || [],
//                 text: question?.text || "",
//                 textvalue: getQuestionTextValue(question, section.id),
//               })) || [],
//           })) || [],
//         status: "Completed",
//         active: true,
//       });

//       const requestOptions = {
//         method: "PATCH", // or "POST" as needed
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow",
//       };
//       console.log("raw", raw);
//       const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
//       const response = await fetch(url, requestOptions);
//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to update organizer");
//       }

//       toast.success("Organizer updated successfully");
//       handleClose();
//     } catch (error) {
//       console.error("Error submitting organizer:", error);
//       toast.error(
//         error.message || "Something went wrong while updating organizer!"
//       );
//     }
//   };

//   // Helper function to get the textvalue for a question
//   const getQuestionTextValue = (question, sectionId) => {
//     const key = `${sectionId}_${question.text}`;

//     switch (question.type) {
//       case "Free Entry":
//       case "Email":
//       case "Number":
//         return inputValues[key] || "";
//       case "Radio Buttons":
//         return radioValues[key] || "";
//       case "Checkboxes":
//         return checkboxValues[key]
//           ? Object.keys(checkboxValues[key])
//               .filter((k) => checkboxValues[key][k])
//               .join(", ")
//           : "";
//       case "Yes/No":
//         return selectedYesNoValues[key] || "";
//       case "Dropdown":
//         return selectedDropdownValues[key] || "";
//       case "Date":
//         return startDate?.toISOString() || "";
//       case "Text Editor":
//         return question.text || "";
//       default:
//         return "";
//     }
//   };

//   // Helper function to determine if an option is selected
//   const getOptionSelectedState = (question, option, sectionId) => {
//     const key = `${sectionId}_${question.text}`;
//     console.log("key", key);
//     switch (question.type) {
//       case "Radio Buttons":
//         return radioValues[key] === option.text;
//       case "Checkboxes":
//         return checkboxValues[key]?.[option.text] || false;
//       case "Yes/No":
//         return selectedYesNoValues[key] === option.text;
//       case "Dropdown":
//         return selectedDropdownValues[key] === option.text;
//       default:
//         return false;
//     }
//   };

//   useEffect(() => {
//     if (organizer?.sections) {
//       const newInputValues = {};
//       const newRadioValues = {};
//       const newCheckboxValues = {};
//       const newSelectedYesNoValues = {};
//       const newSelectedDropdownValues = {};
//       const newAnsweredElements = {};
//       let initialDate = dayjs();

//       organizer.sections.forEach((section) => {
//         section.formElements.forEach((element) => {
//           const key = `${section.id}_${element.text}`;

//           if (element.textvalue) {
//             newAnsweredElements[key] = true;

//             switch (element.type) {
//               case "Free Entry":
//               case "Email":
//               case "Number":
//                 newInputValues[key] = element.textvalue;
//                 break;
//               case "Radio Buttons":
//                 newRadioValues[key] = element.textvalue;
//                 break;
//               case "Checkboxes":
//                 // For checkboxes, textvalue is a comma-separated string
//                 const selectedOptions = element.textvalue
//                   .split(",")
//                   .map((s) => s.trim());
//                 newCheckboxValues[key] = {};
//                 element.options.forEach((option) => {
//                   newCheckboxValues[key][option.text] =
//                     selectedOptions.includes(option.text);
//                 });
//                 break;
//               case "Yes/No":
//                 newSelectedYesNoValues[key] = element.textvalue;
//                 break;
//               case "Dropdown":
//                 newSelectedDropdownValues[key] = element.textvalue;
//                 break;
//               case "Date":
//                 initialDate = dayjs(element.textvalue);
//                 break;
//             }
//           }
//         });
//       });

//       setInputValues(newInputValues);
//       setRadioValues(newRadioValues);
//       setCheckboxValues(newCheckboxValues);
//       setSelectedYesNoValues(newSelectedYesNoValues);
//       setSelectedDropdownValues(newSelectedDropdownValues);
//       setAnsweredElements(newAnsweredElements);
//       setStartDate(initialDate);
//     }
//   }, [organizer]);

//   // const isElementActive = (element) => {
//   //   return element.active === true; // Returns true if active, false otherwise
//   // };
//   const isElementActive = (element) => {
//     // If organizer is sealed, disable all elements
//     if (organizer?.issealed) return true;

//     // Otherwise, follow the element's active status
//     return element.active === true;
//   };
//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Dialog fullScreen open={open} onClose={handleClose}>
//         <DialogTitle
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             px: 3,
//             py: 2,
//             borderBottom: "1px solid #ddd",
//           }}
//         >
//           <Typography variant="h6" component="p">
//             {organizer?.organizerName || "Organizer"}
//           </Typography>
//           <IconButton edge="end" onClick={handleClose}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <FormControl
//             fullWidth
//             sx={{ marginBottom: "10px", marginTop: "10px" }}
//           >
//             {/* <Select
//               value={activeStep}
//               onChange={handleDropdownChange}
//               size="small"
//             >
//               {visibleSections.map((section, index) => {
//                 // Calculate answered elements count for this specific section
//                 const answeredCount = section.formElements.reduce(
//                   (count, element) => {
//                     const key = `${section.id}_${element.text}`;
//                     return count + (answeredElements[key] ? 1 : 0);
//                   },
//                   0
//                 );

//                 const totalElements = section.formElements.length;

//                 return (
//                   <MenuItem key={section.id} value={index}>
//                     {section.text} ({answeredCount}/{totalElements})
//                   </MenuItem>
//                 );
//               })}
//             </Select> */}
//             <Select
//               value={activeStep}
//               onChange={handleDropdownChange}
//               size="small"
//             >
//               {visibleSections.map((section, index) => {
//                 // Filter form elements that are actually visible
//                 const visibleElements = section.formElements.filter((el) =>
//                   shouldShowElement(el, section.id)
//                 );

//                 // Count answered visible elements
//                 const answeredCount = visibleElements.reduce(
//                   (count, element) => {
//                     const key = `${section.id}_${element.text}`;
//                     return count + (answeredElements[key] ? 1 : 0);
//                   },
//                   0
//                 );

//                 const totalVisibleElements = visibleElements.length;

//                 return (
//                   <MenuItem key={section.id} value={index}>
//                     {section.text} ({answeredCount}/{totalVisibleElements})
//                   </MenuItem>
//                 );
//               })}
//             </Select>
//           </FormControl>
//           <Box mt={2} mb={2}>
//             <LinearProgress
//               variant="determinate"
//               value={((activeStep + 1) / totalSteps) * 100}
//             />
//           </Box>

//           <Box sx={{ pl: 20, pr: 20 }}>
//             {visibleSections.map(
//               (section, sectionIndex) =>
//                 sectionIndex === activeStep && (
//                   <Box key={section.id}>
//                     {section.formElements.map(
//                       (element) =>
//                         shouldShowElement(element, section.id) && (
//                           <Box key={`${section.id}_${element.id}`}>
//                             {element.type === "Text Editor" && (
//                               <Box mt={2} mb={2}>
//                                 <Typography>
//                                   <span
//                                     dangerouslySetInnerHTML={{
//                                       __html: element.text,
//                                     }}
//                                   />
//                                 </Typography>
//                               </Box>
//                             )}

//                             {(element.type === "Free Entry" ||
//                               element.type === "Email") && (
//                               <Box mt={2}>
//                                 <Typography
//                                   variant="subtitle2"
//                                   component="p"
//                                   gutterBottom
//                                   sx={{ fontWeight: "550" }}
//                                 >
//                                   {element.text}
//                                 </Typography>
//                                 <TextField
//                                   disabled={isElementActive(element)}
//                                   variant="outlined"
//                                   size="small"
//                                   multiline
//                                   fullWidth
//                                   placeholder={`${element.type} Answer`}
//                                   inputProps={{
//                                     type:
//                                       element.type === "Free Entry"
//                                         ? "text"
//                                         : element.type.toLowerCase(),
//                                   }}
//                                   maxRows={8}
//                                   style={{ display: "block" }}
//                                   value={
//                                     inputValues[
//                                       `${section.id}_${element.text}`
//                                     ] || ""
//                                   }
//                                   onChange={(e) =>
//                                     handleInputChange(
//                                       e,
//                                       element.text,
//                                       section.id
//                                     )
//                                   }
//                                 />
//                               </Box>
//                             )}

//                             {element.type === "Number" && (
//                               <Box mt={2}>
//                                 <Typography
//                                   variant="subtitle2"
//                                   component="p"
//                                   gutterBottom
//                                   sx={{ fontWeight: "550" }}
//                                 >
//                                   {element.text}
//                                 </Typography>
//                                 <TextField
//                                   disabled={isElementActive(element)}
//                                   variant="outlined"
//                                   size="small"
//                                   multiline
//                                   fullWidth
//                                   placeholder={`${element.type} Answer`}
//                                   inputProps={{
//                                     type: "text",
//                                     inputMode: "numeric",
//                                     pattern: "[0-9]*",
//                                   }}
//                                   maxRows={8}
//                                   style={{
//                                     display: "block",
//                                     marginTop: "15px",
//                                   }}
//                                   value={
//                                     inputValues[
//                                       `${section.id}_${element.text}`
//                                     ] || ""
//                                   }
//                                   onChange={(e) => {
//                                     const numericValue = e.target.value.replace(
//                                       /\D/g,
//                                       ""
//                                     );
//                                     handleInputChange(
//                                       { target: { value: numericValue } },
//                                       element.text,
//                                       section.id
//                                     );
//                                   }}
//                                 />
//                               </Box>
//                             )}

//                             {element.type === "Radio Buttons" && (
//                               <Box mt={2}>
//                                 <Typography
//                                   variant="subtitle2"
//                                   component="p"
//                                   gutterBottom
//                                   sx={{ fontWeight: "550" }}
//                                 >
//                                   {element.text}
//                                 </Typography>
//                                 <Box
//                                   sx={{
//                                     display: "flex",
//                                     gap: 1,
//                                     flexWrap: "wrap",
//                                   }}
//                                 >
//                                   {element.options.map((option) => (
//                                     <Button
//                                       key={option.text}
//                                       variant={
//                                         radioValues[
//                                           `${section.id}_${element.text}`
//                                         ] === option.text
//                                           ? "contained"
//                                           : "outlined"
//                                       }
//                                       disabled={isElementActive(element)}
//                                       onClick={() =>
//                                         !isElementActive(element) &&
//                                         handleRadioChange(
//                                           option.text,
//                                           element.text,
//                                           section.id
//                                         )
//                                       }
//                                       sx={{
//                                         borderRadius: "15px",
//                                         ...(radioValues[
//                                           `${section.id}_${element.text}`
//                                         ] === option.text),
//                                       }}
//                                     >
//                                       {option.text}
//                                     </Button>
//                                   ))}
//                                 </Box>
//                               </Box>
//                             )}

//                             {element.type === "Checkboxes" && (
//                               <Box mt={2}>
//                                 <Typography
//                                   variant="subtitle2"
//                                   component="p"
//                                   gutterBottom
//                                   sx={{ fontWeight: "550" }}
//                                 >
//                                   {element.text}
//                                 </Typography>
//                                 <Box
//                                   sx={{
//                                     display: "flex",
//                                     gap: 1,
//                                     flexWrap: "wrap",
//                                   }}
//                                 >
//                                   {element.options.map((option) => (
//                                     <Button
//                                       key={option.text}
//                                       variant={
//                                         checkboxValues[
//                                           `${section.id}_${element.text}`
//                                         ]?.[option.text]
//                                           ? "contained"
//                                           : "outlined"
//                                       }
//                                       disabled={isElementActive(element)}
//                                       onClick={() =>
//                                         !isElementActive(element) &&
//                                         handleCheckboxChange(
//                                           option.text,
//                                           element.text,
//                                           section.id
//                                         )
//                                       }
//                                       sx={{
//                                         borderRadius: "15px",
//                                         ...checkboxValues[
//                                           `${section.id}_${element.text}`
//                                         ]?.[option.text],
//                                       }}
//                                     >
//                                       {option.text}
//                                     </Button>
//                                   ))}
//                                 </Box>
//                               </Box>
//                             )}

//                             {element.type === "Yes/No" && (
//                               <Box mt={2}>
//                                 <Typography
//                                   variant="subtitle2"
//                                   component="p"
//                                   gutterBottom
//                                   sx={{ fontWeight: "550" }}
//                                 >
//                                   {element.text}
//                                 </Typography>
//                                 <Box sx={{ display: "flex", gap: 1 }}>
//                                   {element.options.map((option) => (
//                                     <Button
//                                       key={option.text}
//                                       variant={
//                                         selectedYesNoValues[
//                                           `${section.id}_${element.text}`
//                                         ] === option.text
//                                           ? "contained"
//                                           : "outlined"
//                                       }
//                                       disabled={isElementActive(element)}
//                                       onClick={() =>
//                                         !isElementActive(element) &&
//                                         handleYesNoChange(
//                                           option.text,
//                                           element.text,
//                                           section.id
//                                         )
//                                       }
//                                       sx={{
//                                         borderRadius: "15px",
//                                         ...(selectedYesNoValues[
//                                           `${section.id}_${element.text}`
//                                         ] === option.text),
//                                       }}
//                                     >
//                                       {option.text}
//                                     </Button>
//                                   ))}
//                                 </Box>
//                               </Box>
//                             )}

//                             {element.type === "Dropdown" && (
//                               <Box mt={2}>
//                                 <Typography
//                                   variant="subtitle2"
//                                   component="p"
//                                   gutterBottom
//                                   sx={{ fontWeight: "550" }}
//                                 >
//                                   {element.text}
//                                 </Typography>
//                                 <FormControl fullWidth>
//                                   <Select
//                                     value={
//                                       selectedDropdownValues[
//                                         `${section.id}_${element.text}`
//                                       ] || ""
//                                     }
//                                     disabled={isElementActive(element)}
//                                     onChange={(event) =>
//                                       handleDropdownValueChange(
//                                         event,
//                                         element.text,
//                                         section.id
//                                       )
//                                     }
//                                     size="small"
//                                   >
//                                     {element.options.map((option) => (
//                                       <MenuItem
//                                         key={option.text}
//                                         value={option.text}
//                                       >
//                                         {option.text}
//                                       </MenuItem>
//                                     ))}
//                                   </Select>
//                                 </FormControl>
//                               </Box>
//                             )}

//                             {element.type === "Date" && (
//                               <Box mt={2}>
//                                 <Typography
//                                   variant="subtitle2"
//                                   component="p"
//                                   gutterBottom
//                                   sx={{ fontWeight: "550" }}
//                                 >
//                                   {element.text}
//                                 </Typography>
//                                 {/* <DatePicker
//                                    format="MM/DD/YYYY"
//                                   sx={{
//                                     width: "100%",
//                                     backgroundColor: "#fff",
//                                   }}
//                                   selected={startDate}
//                                   onChange={handleStartDateChange}
//                                   renderInput={(params) => (
//                                     <TextField {...params} size="small" />
//                                   )}
//                                   onOpen={() =>
//                                     setAnsweredElements((prevAnswered) => ({
//                                       ...prevAnswered,
//                                       [`${section.id}_${element.text}`]: true,
//                                     }))
//                                   }
//                                 /> */}
//                                 <DatePicker
//                                    format="MM/DD/YYYY"
//                                   sx={{
//                                     width: "100%",
//                                     backgroundColor: "#fff",
//                                   }}
//                                   value={startDate}
//                                   disabled={isElementActive(element)}
//                                   onChange={(newValue) => {
//                                     // setStartDate(newValue);
//                                     // setAnsweredElements((prevAnswered) => ({
//                                     //   ...prevAnswered,
//                                     //   [`${section.id}_${element.text}`]: true,
//                                     // }));
//                                     if (!isElementActive(element)) {
//                                       setStartDate(newValue);
//                                       setAnsweredElements((prev) => ({
//                                         ...prev,
//                                         [`${section.id}_${element.text}`]: true,
//                                       }));
//                                     }
//                                   }}
//                                   renderInput={(params) => (
//                                     <TextField {...params} size="small" />
//                                   )}
//                                 />
//                               </Box>
//                             )}

//                             {element.type === "File Upload" && (
//                               <Box mt={2}>
//                                 <Typography
//                                   variant="subtitle2"
//                                   component="p"
//                                   gutterBottom
//                                   sx={{ fontWeight: "550" }}
//                                 >
//                                   {element.text}
//                                 </Typography>
//                                 this file upload question
//                               </Box>
//                             )}
//                           </Box>
//                         )
//                     )}
//                   </Box>
//                 )
//             )}

//             <Box
//               mt={3}
//               display="flex"
//               alignItems="center"
//               justifyContent={"space-between"}
//             >
//               <Box display="flex" gap={3} alignItems="center">
//                 {activeStep > 0 && (
//                   <Button onClick={handleBack} variant="outlined">
//                     <ArrowBackIcon fontSize="small" />
//                   </Button>
//                 )}

//                 {activeStep < totalSteps - 1 ? (
//                   <Button onClick={handleNext} variant="contained">
//                     Next{" "}
//                     <ArrowForwardIcon fontSize="small" sx={{ marginLeft: 2 }} />
//                   </Button>
//                 ) : (
//                   <Button variant="contained" onClick={handleSubmit}>
//                     Submit
//                   </Button>
//                 )}
//               </Box>

//               <Box sx={{ display: "flex", alignItems: "flex-end" }}>
//                 <Typography>
//                   Step {activeStep + 1} of {totalSteps}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </LocalizationProvider>
//   );
// };

// export default OrganizerDialog;



import { useState, useEffect, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { debounce } from "lodash";
import UploadDrawer from "./UploadDrawer";
import { LoginContext } from "../../Sidebar/Context/Context";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
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
        console.log("id", result);

        // console.log(userData)
        setUsername(result.username);
      });
  };
 const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  // const ORGANIZER_AUTOSAVE_API = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/autosave`;
  const sections = organizer?.sections;
console.log("sections",sections)
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
        
        console.log("Auto-save successful");
        // toast.success("Auto-save successful")
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

  const inputCls = "w-full mt-1 rounded border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const optionBtn = (active, disabled) => `rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
    disabled ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' :
    active ? 'bg-[var(--color-save-btn)] text-white border-[var(--color-save-btn)]' :
    'border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white'
  }`;

  return (
    <>
    {open && (
      <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <p className="text-base font-semibold">{organizer?.organizerName || "Organizer"}</p>
          <button type="button" onClick={handleClose} className="p-1 rounded hover:bg-gray-100 text-gray-600">
            <IoClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Section dropdown */}
          <select
            className="w-full mb-3 rounded border border-gray-200 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={activeStep}
            onChange={handleDropdownChange}
          >
            {visibleSections.map((section, index) => {
              const visibleElements = section.formElements.filter((el) => shouldShowElement(el, section.id));
              const answeredCount = visibleElements.reduce((c, el) => c + (answeredElements[`${section.id}_${el.text}`] ? 1 : 0), 0);
              return (
                <option key={section.id} value={index}>
                  {section.text} ({answeredCount}/{visibleElements.length})
                </option>
              );
            })}
          </select>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${((activeStep + 1) / totalSteps) * 100}%` }}></div>
          </div>

          <div className="px-4 md:px-20">
            {visibleSections.map((section, sectionIndex) =>
              sectionIndex === activeStep && (
                <div key={section.id}>
                  {section.formElements.map((element) =>
                    shouldShowElement(element, section.id) && (
                      <div key={`${section.id}_${element.id}`} className="mb-5">

                        {element.type === "Text Editor" && (
                          <p className="text-sm text-gray-700 my-3" dangerouslySetInnerHTML={{ __html: element.text }} />
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
                            <p className="text-sm font-semibold mb-1">{element.text}</p>
                            <div className="flex items-center gap-2">
                              <label
                                htmlFor={`fileInput_${section.id}_${element.id}`}
                                className={`text-sm cursor-pointer text-[var(--color-save-btn)] underline ${isElementActive(element) ? 'opacity-50 pointer-events-none' : ''}`}
                              >
                                Upload Document
                              </label>
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
                            </div>
                            {uploadedFiles[`${section.id}_${element.text}`] && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">Selected file: {uploadedFiles[`${section.id}_${element.text}`]}</span>
                                <button type="button" className="text-gray-400 hover:text-red-500"
                                  disabled={isElementActive(element)}
                                  onClick={() => {
                                    const key = `${section.id}_${element.text}`;
                                    setUploadedFiles(prev => { const n = {...prev}; delete n[key]; return n; });
                                    setAnsweredElements(prev => ({ ...prev, [key]: false }));
                                    const d = prepareSubmitData(false);
                                    debouncedAutoSave(d);
                                  }}
                                ><IoClose size={14} /></button>
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    )
                  )}
                </div>
              )
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                {activeStep > 0 && (
                  <button type="button" onClick={handleBack}
                    className="flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium border border-[var(--color-border-cancel-btn)] text-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)] hover:text-white">
                    <IoIosArrowBack size={14} />
                  </button>
                )}
                {activeStep < totalSteps - 1 ? (
                  <button type="button" onClick={handleNext}
                    className="flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)]">
                    Next <IoIosArrowForward size={14} />
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit}
                    className="rounded-full px-5 py-1.5 text-sm font-medium text-white bg-[var(--color-save-btn)] hover:bg-[var(--color-save-hover-btn)]">
                    Submit
                  </button>
                )}
              </div>
              <span className="text-sm text-gray-500">Step {activeStep + 1} of {totalSteps}</span>
            </div>
          </div>
        </div>
      </div>
    )}
    <UploadDrawer
  open={isDocumentForm}
  onClose={() => setIsDocumentForm(false)}
  file={file}
  organizer={organizer}
  accountId={accountid}
   uploadedFiles={uploadedFiles}  // Pass the state down
  setUploadedFiles={setUploadedFiles} 
  onUploadSuccess={(fileData) => {
    console.log("File uploaded successfully:", fileData);
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
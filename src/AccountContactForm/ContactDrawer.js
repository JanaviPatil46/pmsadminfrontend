
// import React, { useState, useEffect,useMemo } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

// import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
// import {
//   Button,
//   Box,
//   Typography,
//   useMediaQuery,
//   Chip,
//   MenuItem,
//   Select,
//   ListItem,
//   TextField,
//   InputLabel,
//   Autocomplete,
//   Alert,
//   FormControl,
//   OutlinedInput,
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// // import "./contact.css";
// import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown"
// import { toast } from "react-toastify";
// import { RxCross2 } from "react-icons/rx";
// import countryList from "react-select-country-list";
// const ContactForm = ({ open,onClose,contact }) => {
//   const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;


//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   const [phoneNumbers, setPhoneNumbers] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);

//   // Individual state hooks for form fields
//   const [firstName, setFirstName] = useState("");
//   const [middleName, setMiddleName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [contactName, setContactName] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [note, setNote] = useState("");
//   const [ssn, setSsn] = useState("");
//   const [email, setEmail] = useState("");

//   const [streetAddress, setStreetAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [postalCode, setPostalCode] = useState("");
//   const [combinedValues, setCombinedValues] = useState();

//   console.log(selectedCountry);
  
//   const options = useMemo(() => countryList().getData(), []);
 

//    const handlePhoneNumberChange = (phoneValue, countryData, id) => {
//   setPhoneNumbers(prevPhoneNumbers =>
//     prevPhoneNumbers.map(item =>
//       item.id === id
//         ? {
//             ...item,
//             phone: phoneValue,
//             countryCode: countryData.dialCode, // Store country dial code
//             country: countryData.countryCode.toLowerCase() // Store country code (e.g., 'us')
//           }
//         : item
//     )
//   );
// };
//   // Update contactName when firstName, middleName, or lastName changes
//   useEffect(() => {
//     setContactName(`${firstName} ${middleName} ${lastName}`.trim());
//   }, [firstName, middleName, lastName]);

  
//   const handleAddPhoneNumber = () => {
//   setPhoneNumbers(prevPhoneNumbers => [
//     ...prevPhoneNumbers,
//     { 
//       id: Date.now(), 
//       phone: "", 
//       country: "us", // Default country
//       isPrimary: false 
//     },
//   ]);
// };

//   const handleDeletePhoneNumber = (id) => {
//     setPhoneNumbers((prevPhoneNumbers) =>
//       prevPhoneNumbers.filter((item) => item.id !== id)
//     );
//   };

//   const [firstNameError, setFirstNameError] = useState("");
//   const [lastNameError, setLastNameError] = useState("");
//   const [emailError, setEmaileError] = useState("");
//   const validateForm = () => {
//     let isValid = true;
//     if (!firstName) {
//       setFirstNameError("First name is required");

//       isValid = false;
//     } else {
//       setFirstNameError("");
//     }

//     if (!lastName) {
//       setLastNameError("Last name is required.");
//       isValid = false;
//     } else {
//       setLastNameError("");
//     }
    
//     // Email
//   if (!email?.trim()) {
//     setEmaileError("Email is required.");
//     isValid = false;
//   } else if (
//     !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
//   ) {
//     setEmaileError("Please enter a valid email address.");
//     isValid = false;
//   } else {
//     setEmaileError("");
//   }
//     return isValid;
//   };
// //   const sendingData = async (e) => {
// //     e.preventDefault();

// //     // Validate form before proceeding
// //     if (!validateForm()) {
// //       return; // Stop execution if validation fails
// //     }

// //     handleNewDrawerClose();
// //     handleDrawerClose();
 
// //   const formattedPhoneNumbers = phoneNumbers.map(phone => phone.phone);


// // console.log("formattedPhoneNumbers",formattedPhoneNumbers)
// //     const raw = JSON.stringify([
// //       {
// //         firstName: firstName,
// //         middleName: middleName,
// //         lastName: lastName,
// //         contactName: contactName,
// //         companyName: companyName,
// //         note: note,
// //         ssn: ssn,
// //         email: email,
// //         // login: false,
// //         // notify: false,
// //         // emailSync: false,
// //         tags: combinedValues,

// //         country: selectedCountry,
// //         streetAddress: streetAddress,
// //         city: city,
// //         state: state,
// //         postalCode: postalCode,
// //         phoneNumbers: formattedPhoneNumbers,
// //       },
// //     ]);
// //     console.log(raw);
// //     const requestOptions = {
// //       method: "POST",

// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: raw,
// //       redirect: "follow",
// //     };
// //     const url = "https://www.snptaxes.com/api/contacts";
// //     fetch(url, requestOptions)
// //       .then((response) => {
// //         if (!response.ok) {
// //           throw new Error("Network response was not ok");
// //         }
// //         return response.json();
// //       })
// //       .then((result) => {
// //         // Handle success
// //         toast.success("Contact created successfully!");
// //         //console.log('Contact ID:', result);  // Log the contactId
// //         navigate("/clients/contacts");
// //         // Additional logic after successful creation if needed
// //       })
// //       .catch((error) => {
// //         // Handle errors
// //         console.error(error);
// //         toast.error("Failed to create contact");
// //       });
// //   };
// const sendingData = async (e) => {
//   e.preventDefault();

//   if (!validateForm()) return;

  

//   const formattedPhoneNumbers = phoneNumbers.map((item) => item.phone);

//   const countryPayload = selectedCountry
//     ? { name: selectedCountry.label, code: selectedCountry.value }
//     : null;

//   const payload = JSON.stringify({
//     firstName,
//     middleName,
//     lastName,
//     contactName,
//     companyName,
//     note,
//     ssn,
//     email,
//     tags: combinedValues,
//     country: countryPayload,
//     streetAddress,
//     city,
//     state,
//     postalCode,
//     phoneNumbers: formattedPhoneNumbers,
//   });

//   const requestOptions = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: payload
//   };

//   fetch("https://www.snptaxes.com/api/contacts", requestOptions)
//     .then((res) => {
//       if (!res.ok) throw new Error("Request failed");
//       return res.json();
//     })
//     .then(() => {
//       toast.success("Contact created successfully!");
//       navigate("/clients/contacts");
//     })
//     .catch(() => {
//       toast.error("Failed to create contact");
//     });
// };

//   const handleClose = () => {
//    onClose()
//   };

//   const [selectedTags, setSelectedTags] = useState([]);

//   //Tag FetchData ================
//   const handleTagChange = (newSelectedTags) => {
//     setSelectedTags(newSelectedTags);
//     console.log(newSelectedTags)
//     const selectedValues = newSelectedTags.map((option) => option.value);
//     setCombinedValues(selectedValues);
//     console.log(selectedValues)
//   };
//   return (
//     <Box>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           p: 2,
//           borderBottom: "1px solid grey",
//         }}
//       >
//         <Typography sx={{ fontWeight: "550", fontSize: "20px" }}>
//           New Contact 
//         </Typography>
//         <RxCross2
//           onClick={onClose}
//           style={{ cursor: "pointer" }}
//         />
//       </Box>
//       <form
//         style={{
       
//           paddingRight: "3%",
//           paddingLeft: "3%",
//           height: "90vh",
//           overflowY: "auto",
//         }}
//         className="contact-form"
//       >
   
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: isSmallScreen ? "column" : "row",
//             gap: isSmallScreen ? 2 : 5,
//             padding: "1px 5px 0 2px",
//             mt: 1,
//           }}
//         >
//           <Box>
          
//             <InputLabel
//               sx={{
//                 color: "black",
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               First Name
//               <Typography sx={{ color: "red", ml: 0.5 }}>*</Typography>
//             </InputLabel>
//             <TextField
//               // margin="normal"
//               fullWidth
//               name="firstName"
//               value={firstName}
//               sx={{ mt: 1.5, backgroundColor: "#fff" }}
//               // onChange={(e) => setFirstName(e.target.value)}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setFirstName(value);

//                 // Clear the error message when input is not empty
//                 if (value.trim() !== "") {
//                   setFirstNameError("");
//                 }
//               }}
//               placeholder="First Name"
//               size="small"
//               error={!!firstNameError}
//             />
           
//           </Box>
//           <Box>
         
//             <InputLabel
//               sx={{
//                 color: "black",
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               Middle Name
//             </InputLabel>
//             <TextField
           
//               sx={{ mt: 1.5, backgroundColor: "#fff" }}
//               fullWidth
//               name="middleName"
//               value={middleName}
//               onChange={(e) => setMiddleName(e.target.value)}
//               placeholder="Middle Name"
//               size="small"
//             />
//           </Box>
//           <Box>
          
//             <InputLabel
//               sx={{
//                 color: "black",
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               Last Name
//               <Typography sx={{ color: "red", ml: 0.5 }}>*</Typography>
//             </InputLabel>
            

//             <TextField
//               fullWidth
//               name="lastName"
//               value={lastName}
            
//               placeholder="Last name"
//               size="small"
//               sx={{ mt: 1.5, backgroundColor: "#fff" }}
             
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setLastName(value);

//                 // Clear the error message when input is not empty
//                 if (value.trim() !== "") {
//                   setLastNameError("");
//                 }
//               }}
//               error={!!firstNameError}
//             />
//             {!!lastNameError && (
//               <Alert
//                 sx={{
//                   width: "96%",
//                   p: "0", // Adjust padding to control the size
//                   pl: "4%",
//                   height: "23px",
//                   borderRadius: "10px",
//                   borderTopLeftRadius: "0",
//                   borderTopRightRadius: "0",
//                   fontSize: "11px",
//                   display: "flex",
//                   alignItems: "center", // Center content vertically
//                   "& .MuiAlert-icon": {
//                     fontSize: "16px", // Adjust the size of the icon
//                     mr: "8px", // Add margin to the right of the icon
//                   },
//                 }}
//                 variant="filled"
//                 severity="error"
//               >
//                 {lastNameError}
//               </Alert>
//             )}
//           </Box>
//         </Box>
//         <Box mt={1}>
//           <InputLabel sx={{ color: "black" }}>Contact Name</InputLabel>

//           <TextField
//             name="contactName"
//             value={contactName}
//             onChange={(e) => setContactName(e.target.value)}
//             fullWidth
//             placeholder="Contact Name"
//             margin="normal"
//             size="small"
//           />
//         </Box>
//         <Box mt={1}>
//           <InputLabel sx={{ color: "black" }}>Company Name</InputLabel>

//           <TextField
//             fullWidth
//             name="companyName"
//             value={companyName}
//             onChange={(e) => setCompanyName(e.target.value)}
//             margin="normal"
//             placeholder="Company Name"
//             size="small"
//           />
//         </Box>
//         <Box mt={1}>
          
//           <InputLabel
//             sx={{
//               color: "black",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             Email
//             <Typography sx={{ color: "red", ml: 0.5 }}>*</Typography>
//           </InputLabel>
//           <TextField
//             fullWidth
//             name="email"
//             value={email}
//             // onChange={(e) => setEmail(e.target.value)}
//             // margin="normal"
//             placeholder="Email"
//             size="small"
//             sx={{ mt: 1.5, backgroundColor: "#fff" }}
           
//             onChange={(e) => {
//   const value = e.target.value;
//   setEmail(value);

//   if (!value.trim()) {
//     setEmaileError("Email is required.");
//   } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
//     setEmaileError("Please enter a valid email address.");
//   } else {
//     setEmaileError(""); // Clear error when valid
//   }
// }}

//             error={!!emailError}
//           />
//           {!!emailError && (
//             <Alert
//               sx={{
//                 width: "96%",
//                 p: "0", // Adjust padding to control the size
//                 pl: "4%",
//                 height: "23px",
//                 borderRadius: "10px",
//                 borderTopLeftRadius: "0",
//                 borderTopRightRadius: "0",
//                 fontSize: "11px",
//                 display: "flex",
//                 alignItems: "center", // Center content vertically
//                 "& .MuiAlert-icon": {
//                   fontSize: "16px", // Adjust the size of the icon
//                   mr: "8px", // Add margin to the right of the icon
//                 },
//               }}
//               variant="filled"
//               severity="error"
//             >
//               {emailError}
//             </Alert>
//           )}
//         </Box>
//         <Box mt={1} mr={2}>
         
//           <InputLabel sx={{ color: "black", mb: 1 }}>Tags</InputLabel>
         
//           <TagsMultiSelectDropDown 
//   value={selectedTags}
//   onChange={handleTagChange}
//   placeholder="Tags"
// />

//         </Box>
//         <Box mt={1}>
//           <InputLabel sx={{ color: "black" }}>Note</InputLabel>

//           <TextField
//             fullWidth
//             name="note"
//             value={note}
//             multiline
//             onChange={(e) => setNote(e.target.value)}
//             margin="normal"
//             placeholder="Note"
//             size="small"
//           />
//         </Box>
//         <Box mt={1}>
//           <InputLabel sx={{ color: "black" }}>SSN</InputLabel>

//           <TextField
//             fullWidth
//             name="ssn"
//             value={ssn}
//             onChange={(e) => setSsn(e.target.value)}
//             margin="normal"
//             placeholder="SSN"
//             size="small"
//           />
//         </Box>

//         <Typography
//           variant="h6"
//           gutterBottom
//           sx={{ ml: 1, fontWeight: "bold", mt: 3 }}
//         >
//           Phone Numbers
//         </Typography>
//         {phoneNumbers.map((phone) => (
//           <Box
//             key={phone.id}
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//               gap: 2,
//               ml: 1,
//               mb: 2,
//             }}
//           >
//             {phone.isPrimary && (
//               <Chip
//                 label="Primary phone"
//                 color="primary"
//                 size="small"
//                 sx={{ position: "absolute", mt: -3 }}
//               />
//             )}
            
// <PhoneInput
// country={"us"}
//   value={phone.phone}
//   // onChange={(phoneValue) => handlePhoneNumberChange(phone.id, phoneValue)}
//      onChange={(value, country) => handlePhoneNumberChange(value, country, phone.id)}
//   inputStyle={{
//     width: "100%",
//   }}
//   buttonStyle={{
//     borderTopLeftRadius: "8px",
//     borderBottomLeftRadius: "8px",
//   }}
//   containerStyle={{
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//   }}
// />
//             <AiOutlineDelete
//               onClick={() => handleDeletePhoneNumber(phone.id)}
//               style={{ cursor: "pointer", color: "red" }}
//             />
//           </Box>
//         ))}
//         <Box
//           sx={{
//             display: "flex",
//             gap: 2,
//             alignItems: isSmallScreen ? "center" : "flex-start",
//             ml: 1,
//             cursor: "pointer",
//             color: "blue",
//             fontWeight: 600,
//           }}
//           onClick={handleAddPhoneNumber}
//         >
//           <AiOutlinePlusCircle style={{ marginTop: "20px" }} />
//           <p>Add phone number</p>
//         </Box>
//         <Typography
//           variant="h6"
//           gutterBottom
//           sx={{ ml: 1, fontWeight: "bold", mt: 3 }}
//         >
//           Address
//         </Typography>
//         <Box>
//           <InputLabel sx={{ color: "black" }}>Country</InputLabel>

         
//           <Autocomplete
//       options={options}
//       size="small"
//       getOptionLabel={(option) => option.label} // show country name
//       value={selectedCountry}
//       onChange={(event, newValue) => setSelectedCountry(newValue)}
//       renderInput={(params) => (
//         <TextField {...params} placeholder="Select Country" variant="outlined" />
//       )}
      
//     />
//         </Box>
//         <Box>
//           <InputLabel sx={{ color: "black", mt: 2 }}>Street address</InputLabel>
//           <TextField
//             fullWidth
//             name="streetAddress"
//             value={streetAddress}
//             onChange={(e) => setStreetAddress(e.target.value)}
//             margin="normal"
//             placeholder="Street address"
//             size="small"
//           />
//         </Box>
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: isSmallScreen ? "column" : "row",
//             gap: isSmallScreen ? 2 : 5,
//             mt: 2,
//           }}
//         >
//           <Box>
//             <InputLabel sx={{ color: "black" }}>City</InputLabel>
//             <TextField
//               fullWidth
//               margin="normal"
//               name="city"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               placeholder="City"
//               size="small"
//             />
//           </Box>
//           <Box>
//             <InputLabel sx={{ color: "black" }}>State/Province</InputLabel>

//             <TextField
//               margin="normal"
//               name="state"
//               fullWidth
//               value={state}
//               onChange={(e) => setState(e.target.value)}
//               placeholder="State/Province"
//               size="small"
//             />
//           </Box>
//           <Box>
//             <InputLabel sx={{ color: "black" }}>ZIP/Postal Code</InputLabel>

//             <TextField
//               margin="normal"
//               fullWidth
//               name="postalCode"
//               value={postalCode}
//               onChange={(e) => setPostalCode(e.target.value)}
//               placeholder="ZIP/Postal Code"
//               size="small"
//             />
//           </Box>
//         </Box>
//         <Box
//           sx={{
//             display: "flex",
//             gap: 4,
//             padding: "1px 5px 15px 5px",
//           }}
//         >
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             onClick={sendingData}
  
//             sx={{
//               backgroundColor: "var(--color-save-btn)", // Normal background

//               "&:hover": {
//                 backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//               },
//               borderRadius: "15px",
//               mt: 2,
//               width: isSmallScreen ? "100%" : "auto",
//             }}
//           >
//             Update
//           </Button>
//           <Button
//             type="button"
//             variant="outlined"
//             color="primary"
//             onClick={handleClose}
           
//             sx={{
//               borderColor: "var(--color-border-cancel-btn)", // Normal background
//               color: "var(--color-save-btn)",
//               "&:hover": {
//                 backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//                 color: "#fff",
//                 border: "none",
//               },
//               width: isSmallScreen ? "100%" : "auto",
//               borderRadius: "15px",
//               mt: 2,
//             }}
//           >
//             Cancel
//           </Button>
//         </Box>
//       </form>
//     </Box>
//   );
// };

// export default ContactForm;


 import {
  Drawer,
  Box,
  Typography,
  TextField,
  InputLabel,
  Button,
  Chip,
  Alert,
  Autocomplete,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import "react-phone-number-input/style.css";
import TagsMultiSelectDropDown from "./TagsMultiSelectDropDown";
import countryList from "react-select-country-list";

const ContactForm = ({ open, onClose, contact, onSave }) => {
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Individual state hooks for form fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [note, setNote] = useState("");
  const [ssn, setSsn] = useState("");
  const [email, setEmail] = useState("");

  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [combinedValues, setCombinedValues] = useState([]);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = useMemo(() => countryList().getData(), []);

  // Initialize form with contact data when component mounts or contact changes
  useEffect(() => {
    if (contact) {
      // Editing existing contact
      setFirstName(contact.firstName || "");
      setMiddleName(contact.middleName || "");
      setLastName(contact.lastName || "");
      setContactName(contact.contactName || "");
      setCompanyName(contact.companyName || "");
      setNote(contact.note || "");
      setSsn(contact.ssn || "");
      setEmail(contact.email || "");
      setStreetAddress(contact.streetAddress || "");
      setCity(contact.city || "");
      setState(contact.state || "");
      setPostalCode(contact.postalCode || "");
      setCombinedValues(contact.tags || []);

      // Set country if available
      if (contact.country) {
        const countryOption = options.find(
          (opt) => opt.value === contact.country.code || opt.label === contact.country.name
        );
        setSelectedCountry(countryOption || null);
      }

      // Set phone numbers if available
      if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        const formattedPhoneNumbers = contact.phoneNumbers.map((phone, index) => ({
          id: Date.now() + index,
          phone: phone || "",
          country: "us",
          isPrimary: index === 0 // Set first phone as primary
        }));
        setPhoneNumbers(formattedPhoneNumbers);
      } else {
        setPhoneNumbers([{ id: Date.now(), phone: "", country: "us", isPrimary: false }]);
      }

      // Set tags if available
      if (contact.tags) {
        const tagOptions = contact.tags.map(tag => ({ value: tag, label: tag }));
        setSelectedTags(tagOptions);
      }
    } else {
      // Creating new contact - reset form
      resetForm();
    }
  }, [contact, options]);

  const resetForm = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setContactName("");
    setCompanyName("");
    setNote("");
    setSsn("");
    setEmail("");
    setStreetAddress("");
    setCity("");
    setState("");
    setPostalCode("");
    setCombinedValues([]);
    setSelectedCountry(null);
    setPhoneNumbers([{ id: Date.now(), phone: "", country: "us", isPrimary: false }]);
    setSelectedTags([]);
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
  };

  const handlePhoneNumberChange = (phoneValue, countryData, id) => {
    setPhoneNumbers(prevPhoneNumbers =>
      prevPhoneNumbers.map(item =>
        item.id === id
          ? {
              ...item,
              phone: phoneValue,
              countryCode: countryData.dialCode,
              country: countryData.countryCode.toLowerCase()
            }
          : item
      )
    );
  };

  // Update contactName when firstName, middleName, or lastName changes
  useEffect(() => {
    setContactName(`${firstName} ${middleName} ${lastName}`.trim());
  }, [firstName, middleName, lastName]);

  const handleAddPhoneNumber = () => {
    setPhoneNumbers(prevPhoneNumbers => [
      ...prevPhoneNumbers,
      { 
        id: Date.now(), 
        phone: "", 
        country: "us",
        isPrimary: false 
      },
    ]);
  };

  const handleDeletePhoneNumber = (id) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers((prevPhoneNumbers) =>
        prevPhoneNumbers.filter((item) => item.id !== id)
      );
    } else {
      toast.warning("At least one phone number is required");
    }
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!firstName?.trim()) {
      setFirstNameError("First name is required");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    if (!lastName?.trim()) {
      setLastNameError("Last name is required.");
      isValid = false;
    } else {
      setLastNameError("");
    }
    
    // Email validation
    if (!email?.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    return isValid;
  };

  const sendingData = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const formattedPhoneNumbers = phoneNumbers
      .map((item) => item.phone)
      .filter(phone => phone.trim() !== "");

    const countryPayload = selectedCountry
      ? { name: selectedCountry.label, code: selectedCountry.value }
      : null;

    const payload = {
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      contactName: contactName.trim(),
      companyName: companyName.trim(),
      note: note.trim(),
      ssn: ssn.trim(),
      email: email.trim(),
      tags: combinedValues,
      country: countryPayload,
      streetAddress: streetAddress.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      phoneNumbers: formattedPhoneNumbers,
    };

    const requestOptions = {
      method: contact ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact ? [payload] : payload) // Adjust based on your API
    };

    const url = contact 
      ? `https://www.snptaxes.com/api/contacts/${contact.id}` // Adjust endpoint for update
      : "https://www.snptaxes.com/api/contacts";

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) throw new Error("Request failed");
      
      const result = await response.json();
      
      toast.success(`Contact ${contact ? 'updated' : 'created'} successfully!`);
      
      if (onSave) {
        onSave(result); // Callback for parent component
      }
      
      navigate("/clients/contacts");
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to ${contact ? 'update' : 'create'} contact`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagChange = (newSelectedTags) => {
    setSelectedTags(newSelectedTags);
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedValues(selectedValues);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: isSmallScreen ? "100%" : "600px",
          maxWidth: "100vw",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid grey",
        }}
      >
        <Typography sx={{ fontWeight: "550", fontSize: "20px" }}>
          {contact ? 'Edit Contact' : 'New Contact'}
        </Typography>
        <RxCross2
          onClick={handleClose}
          style={{ cursor: "pointer" }}
        />
      </Box>
      
      <Box
        component="form"
        onSubmit={sendingData}
        sx={{
          padding: "0 3%",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
        className="contact-form"
      >
        {/* Form fields remain the same as before */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: isSmallScreen ? 2 : 5,
            padding: "1px 5px 0 2px",
            mt: 1,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <InputLabel
              sx={{
                color: "black",
                display: "flex",
                alignItems: "center",
              }}
            >
              First Name
              <Typography sx={{ color: "red", ml: 0.5 }}>*</Typography>
            </InputLabel>
            <TextField
              fullWidth
              name="firstName"
              value={firstName}
              sx={{ mt: 1.5, backgroundColor: "#fff" }}
              onChange={(e) => {
                const value = e.target.value;
                setFirstName(value);
                if (value.trim() !== "") {
                  setFirstNameError("");
                }
              }}
              placeholder="First Name"
              size="small"
              error={!!firstNameError}
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <InputLabel
              sx={{
                color: "black",
                display: "flex",
                alignItems: "center",
              }}
            >
              Middle Name
            </InputLabel>
            <TextField
              sx={{ mt: 1.5, backgroundColor: "#fff" }}
              fullWidth
              name="middleName"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Middle Name"
              size="small"
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <InputLabel
              sx={{
                color: "black",
                display: "flex",
                alignItems: "center",
              }}
            >
              Last Name
              <Typography sx={{ color: "red", ml: 0.5 }}>*</Typography>
            </InputLabel>
            <TextField
              fullWidth
              name="lastName"
              value={lastName}
              placeholder="Last name"
              size="small"
              sx={{ mt: 1.5, backgroundColor: "#fff" }}
              onChange={(e) => {
                const value = e.target.value;
                setLastName(value);
                if (value.trim() !== "") {
                  setLastNameError("");
                }
              }}
              error={!!lastNameError}
            />
            {!!lastNameError && (
              <Alert
                sx={{
                  width: "96%",
                  p: "0",
                  pl: "4%",
                  height: "23px",
                  borderRadius: "10px",
                  borderTopLeftRadius: "0",
                  borderTopRightRadius: "0",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  "& .MuiAlert-icon": {
                    fontSize: "16px",
                    mr: "8px",
                  },
                }}
                variant="filled"
                severity="error"
              >
                {lastNameError}
              </Alert>
            )}
          </Box>
        </Box>
        
        {/* Rest of the form fields (same as before) */}
        <Box mt={1}>
          <InputLabel sx={{ color: "black" }}>Contact Name</InputLabel>
          <TextField
            name="contactName"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            fullWidth
            placeholder="Contact Name"
            margin="normal"
            size="small"
          />
        </Box>
        
        <Box mt={1}>
          <InputLabel sx={{ color: "black" }}>Company Name</InputLabel>
          <TextField
            fullWidth
            name="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            margin="normal"
            placeholder="Company Name"
            size="small"
          />
        </Box>
        
        <Box mt={1}>
          <InputLabel
            sx={{
              color: "black",
              display: "flex",
              alignItems: "center",
            }}
          >
            Email
            <Typography sx={{ color: "red", ml: 0.5 }}>*</Typography>
          </InputLabel>
          <TextField
            fullWidth
            name="email"
            value={email}
            placeholder="Email"
            size="small"
            sx={{ mt: 1.5, backgroundColor: "#fff" }}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              if (!value.trim()) {
                setEmailError("Email is required.");
              } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
                setEmailError("Please enter a valid email address.");
              } else {
                setEmailError("");
              }
            }}
            error={!!emailError}
          />
          {!!emailError && (
            <Alert
              sx={{
                width: "96%",
                p: "0",
                pl: "4%",
                height: "23px",
                borderRadius: "10px",
                borderTopLeftRadius: "0",
                borderTopRightRadius: "0",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                "& .MuiAlert-icon": {
                  fontSize: "16px",
                  mr: "8px",
                },
              }}
              variant="filled"
              severity="error"
            >
              {emailError}
            </Alert>
          )}
        </Box>
        
        <Box mt={1} mr={2}>
          <InputLabel sx={{ color: "black", mb: 1 }}>Tags</InputLabel>
          <TagsMultiSelectDropDown 
            value={selectedTags}
            onChange={handleTagChange}
            placeholder="Tags"
          />
        </Box>
        
        <Box mt={1}>
          <InputLabel sx={{ color: "black" }}>Note</InputLabel>
          <TextField
            fullWidth
            name="note"
            value={note}
            multiline
            rows={3}
            onChange={(e) => setNote(e.target.value)}
            margin="normal"
            placeholder="Note"
            size="small"
          />
        </Box>
        
        <Box mt={1}>
          <InputLabel sx={{ color: "black" }}>SSN</InputLabel>
          <TextField
            fullWidth
            name="ssn"
            value={ssn}
            onChange={(e) => setSsn(e.target.value)}
            margin="normal"
            placeholder="SSN"
            size="small"
          />
        </Box>

        <Typography
          variant="h6"
          gutterBottom
          sx={{ ml: 1, fontWeight: "bold", mt: 3 }}
        >
          Phone Numbers
        </Typography>
        
        {phoneNumbers.map((phone) => (
          <Box
            key={phone.id}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              ml: 1,
              mb: 2,
            }}
          >
            {phone.isPrimary && (
              <Chip
                label="Primary phone"
                color="primary"
                size="small"
                sx={{ position: "absolute", mt: -3 }}
              />
            )}
            
            <PhoneInput
              country={"us"}
              value={phone.phone}
              onChange={(value, country) => handlePhoneNumberChange(value, country, phone.id)}
              inputStyle={{
                width: "100%",
              }}
              buttonStyle={{
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
              }}
              containerStyle={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            />
            <AiOutlineDelete
              onClick={() => handleDeletePhoneNumber(phone.id)}
              style={{ cursor: "pointer", color: "red" }}
            />
          </Box>
        ))}
        
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: isSmallScreen ? "center" : "flex-start",
            ml: 1,
            cursor: "pointer",
            color: "blue",
            fontWeight: 600,
          }}
          onClick={handleAddPhoneNumber}
        >
          <AiOutlinePlusCircle style={{ marginTop: "20px" }} />
          <p>Add phone number</p>
        </Box>
        
        <Typography
          variant="h6"
          gutterBottom
          sx={{ ml: 1, fontWeight: "bold", mt: 3 }}
        >
          Address
        </Typography>
        
        <Box>
          <InputLabel sx={{ color: "black" }}>Country</InputLabel>
          <Autocomplete
            options={options}
            size="small"
            getOptionLabel={(option) => option.label}
            value={selectedCountry}
            onChange={(event, newValue) => setSelectedCountry(newValue)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Country" variant="outlined" />
            )}
          />
        </Box>
        
        <Box>
          <InputLabel sx={{ color: "black", mt: 2 }}>Street address</InputLabel>
          <TextField
            fullWidth
            name="streetAddress"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            margin="normal"
            placeholder="Street address"
            size="small"
          />
        </Box>
        
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: isSmallScreen ? 2 : 5,
            mt: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <InputLabel sx={{ color: "black" }}>City</InputLabel>
            <TextField
              fullWidth
              margin="normal"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              size="small"
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <InputLabel sx={{ color: "black" }}>State/Province</InputLabel>
            <TextField
              margin="normal"
              name="state"
              fullWidth
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State/Province"
              size="small"
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <InputLabel sx={{ color: "black" }}>ZIP/Postal Code</InputLabel>
            <TextField
              margin="normal"
              fullWidth
              name="postalCode"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="ZIP/Postal Code"
              size="small"
            />
          </Box>
        </Box>
        
        <Box
          sx={{
            display: "flex",
            gap: 4,
            padding: "1px 5px 15px 5px",
            mt: 3,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{
              backgroundColor: "var(--color-save-btn)",
              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)",
              },
              borderRadius: "15px",
              width: isSmallScreen ? "100%" : "auto",
            }}
          >
            {isSubmitting ? 'Saving...' : (contact ? 'Update' : 'Create')}
          </Button>
          
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{
              borderColor: "var(--color-border-cancel-btn)",
              color: "var(--color-save-btn)",
              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)",
                color: "#fff",
                border: "none",
              },
              width: isSmallScreen ? "100%" : "auto",
              borderRadius: "15px",
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ContactForm;
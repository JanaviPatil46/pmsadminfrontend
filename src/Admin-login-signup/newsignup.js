import React, { useState, useEffect } from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Autocomplete } from "@mui/material";
import axios from "axios";
import OtpInput from "react-otp-input";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import startsWith from "lodash.startswith";
import firmsetting from "../Images/setting.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import logo from "../Images/logoAdmin.png";
import micropms from "../Images/micropms.png";
import PremiumSignupProgress from "../components/ui/Progressbar";

import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react"
import {
  Link,
  Divider,
  IconButton,
  Typography,
  TextField,
  InputLabel,
  Checkbox,
  FormHelperText,
  // Button,
  FormControlLabel,
  Paper,
  Grid,
  FormControl,
  Slider,
  // Input,
} from "@mui/material";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
const MyForm = () => {
  console.log("🔥 newsignup.js FILE LOADED 🔥");

  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const navigate = useNavigate();
  const handleAdminLogin = () => {
    navigate("/login");
  };
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Tracks the main steps (Email, Information, Settings)
  const [subStep, setSubStep] = useState(3); // Tracks sub-steps within Information (Cases 3-7)
  const [settingsStep, setSettingsStep] = useState(8); // Tracks sub-steps within Settings (Cases 8-9)
  const [showEmailContent, setShowEmailContent] = useState(false); // Tracks whether to show Email step content
  const [phoneNumber, setPhoneNumber] = useState("");
  const [valid, setValid] = useState(true);
  const steps = ["Email", "Information", "Settings"];
  const [value, setValue] = useState();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [firmName, setFirmName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [emailError, setEmailError] = useState("");

  const [error, setError] = useState(null);
  const [selectedCountryD, setSelectedCountryD] = useState("");
  const [sliderValue, setSliderValue] = useState(0);
  const fixedValues = [0, 5, 10, 15, 50, 100, 200];
  const colors = [
    "Google search",
    "Capterra/ Get app/ G2",
    "From a friend",
    "Offline event",
    "Social media",
    "Taxdome consultant/ Partner",
    "Other",
  ];
  const [buttonStates, setButtonStates] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [selectedButton, setSelectedButton] = useState(null);

  const handleInputChange = (event) => {
    const newValue =
      event.target.value === "" ? "" : Number(event.target.value);
    setInputValue(newValue); // Only update the input value, not the slider
  };

  const [inputValue, setInputValue] = useState(sliderValue);

  const handleBlur = () => {
    let valueToSet = inputValue;

    // Ensure the input value is within the valid range
    if (inputValue < 0) {
      valueToSet = 0;
    } else if (inputValue > 200) {
      valueToSet = 200;
    }

    setSliderValue(valueToSet); // Update slider value after blur
    setInputValue(valueToSet); // Sync input value with slider
  };
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    setInputValue(newValue); // Sync input with slider value while sliding
  };
  const handleToggle = (index) => {
    const updatedStates = buttonStates.map((state, i) =>
      i === index ? !state : false,
    );
    setButtonStates(updatedStates);
    setSelectedButton(index);
  };

  const svalue = fixedValues[sliderValue];
  console.log(svalue);

  const selectedOption = colors[selectedButton];
  console.log(selectedOption);

  useEffect(() => {
    console.log(svalue);
  }, [svalue]);
  useEffect(() => {
    // console.log(selectedOption);
    // You can perform additional actions or API calls here based on the selected services
  }, [selectedOption]);

  const countryStates =
    states.find((country) => country.name === selectedCountry)?.states || [];

  // Transform the states data into options for React Select
  const stateOptions = countryStates.map((state, index) => ({
    value: state.name,
    label: state.name,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/positions",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        const countryOptions = data.data.map((country) => ({
          //value: country.country,
          label: country.name,
        }));

        setCountries(countryOptions);
      } catch (error) {
        setError(error);
      } finally {
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getStatesData = async () => {
      try {
        const response = await axios.get(
          "https://countriesnow.space/api/v0.1/countries/states",
        );
        setStates(response.data.data);
      } catch (error) {
        console.error("Error fetching state data:", error);
      }
    };

    getStatesData();
  }, [countries]);

  // useEffect to do something when selectedCountry changes
  useEffect(() => {
    // console.log("Selected Country:", selectedCountry);
    // You can perform additional actions or API calls here based on the selected country
  }, [selectedCountry]);


  
  const [otp, setOtp] = useState("");
  const handleClearOtp = () => {
    console.log(otp);
    setOtp("");
  };
  const sendOtpVerify = async (e) => {
    e.preventDefault();

    //const { email } = inpval;

    if (otp === "") {
      toast.error(" OTP required! ", {
        position: "top-center",
      });
    } else {
      e.preventDefault();

      let data = JSON.stringify({
        email: inpval.email.trim(),
        otp: otp.toString().trim(),
      });

      const Url = `${LOGIN_API}/otp/verify-otp/`;
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: Url,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          console.log("Verify response:", response.data);
          // toast.success("Check your email ID for OTP", { position: "top-right" });

          alert("Email verified sucessfully");
          setOtp("");
          handleNext();
          // nextStep();
        })
        .catch((error) => {
          alert("please check your OTP");
          console.log("Catch block executed", error);
        });
    }
  };

  const resensotp = async (e) => {
    e.preventDefault();

    //const { email } = inpval;

    e.preventDefault();

    let data = JSON.stringify({
      email: inpval.email,
    });
    const Url = `${LOGIN_API}/otp/request-otp`;
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: Url,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    console.log("Verify button clicked");

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        //toast.success("Check your email ID for OTP", { position: "top-right" });

        alert("Check your email ID for OTP");
      })
      .catch((error) => {
        alert("please check your OTP");
        console.log(error);
      });
  };


  const handleBack = () => {
     if (currentStep === 0) {
      // Move from Email to Information step
      return
    } else if (currentStep === 1) {
      // Handle Information sub-steps (Cases 3-7)
      if (subStep >3 ) {
        setSubStep((prevSubStep) => prevSubStep - 1);
      } else {
        // If all sub-steps are completed, move to Settings
        setCurrentStep(0);
        setShowEmailContent(false)
      }
    } else if (currentStep === 2) {
      // Handle Settings sub-steps (Cases 8-9)
      if (settingsStep < 9) {
        setSettingsStep((prevSettingsStep) => prevSettingsStep - 1 );
      } else {
        // You can add finish behavior here
        // console.log('Form Completed!');
      }
    }
  }
  const handleNext = () => {
    if (currentStep === 0) {
      // Move from Email to Information step
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Handle Information sub-steps (Cases 3-7)
      if (subStep < 7) {
        setSubStep((prevSubStep) => prevSubStep + 1);
      } else {
        // If all sub-steps are completed, move to Settings
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Handle Settings sub-steps (Cases 8-9)
      if (settingsStep < 9) {
        setSettingsStep((prevSettingsStep) => prevSettingsStep + 1);
      } else {
        // You can add finish behavior here
        // console.log('Form Completed!');
      }
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  const setValbox = (event) => {
    setIsChecked(event.target.checked);
    console.log(event.target.checked);
  };
  const setVal = (e) => {
    // console.log(e.target.value);
    const { name, value } = e.target;

    setInpval(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };
  const [inpval, setInpval] = useState({
    email: "",
  });

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setInpval((prev) => ({
      ...prev,
      email: value,
    }));

    if (!value) {
      setEmailError("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  };
  const canSubmit = inpval.email && !emailError && isChecked && !loading;
  const createAccount = async () => {
    // e.preventDefault();
    setShowEmailContent(true);
    const { email } = inpval;

    if (email === "") {
      toast.error("email is required!", {
        position: "top-center",
      });
    } else if (!email.includes("@")) {
      toast.warning("includes @ in your email!", {
        position: "top-center",
      });
    } else if (isChecked === false) {
      toast.error("Accept terms and condtion ", {
        position: "top-center",
      });
    } else {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      console.log(inpval.email);

      const email = inpval.email;

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `${LOGIN_API}/common/user/email/getuserbyemail/` + email,
        requestOptions,
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((result) => {
          console.log(inpval.email);
          // Assuming result is in JSON format and contains user data
          if (result.user.length > 0) {
            toast.error("User with this EMail already exists", {
              position: "top-right",
            });
            // You can also do further processing here if needed
          } else {
            // e.preventDefault();

            let data = JSON.stringify({
              email: inpval.email,
            });

            let config = {
              method: "post",
              maxBodyLength: Infinity,
              url: `${LOGIN_API}/otp/request-otp`,
              headers: {
                "Content-Type": "application/json",
              },
              data: data,
            };
            axios
              .request(config)
              .then((response) => {
                console.log(JSON.stringify(response.data));
                //toast.success("Check your email ID for OTP", { position: "top-right" });
                alert("Check your email ID for OTP");
                //   setInpval({ ...inpval, email: "" });
                setIsChecked(false);
                // nextStep();
              })
              .catch((error) => {
                alert("please check your OTP");
                // console.log(error);
              });
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const [firstname, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");

  const submitUserinfo = async (e) => {
    e.preventDefault();

    if (firstname === "") {
      toast.error(" First Name Required ! ", {
        position: "top-center",
      });
    } else if (lastName === "") {
      toast.error(" Last Name Required ! ", {
        position: "top-center",
      });
    } else if (lastName === "") {
      toast.error(" Last Name Required ! ", {
        position: "top-center",
      });
    } else if (phoneNumber === "") {
      toast.error(" Phone number required ", {
        position: "top-center",
      });
    } else {
      handleNext();
    }
  };

  const submitFerminfo = async (e) => {
    e.preventDefault();

    if (firmName === "") {
      toast.error(" Firm Name Required ! ", {
        position: "top-center",
      });
    } else if (selectedCountry === "") {
      toast.warning(" Select Country ! ", {
        position: "top-center",
      });
    } else if (selectedState === "") {
      toast.warning(" Select state ! ", {
        position: "top-center",
      });
    } else {
      handleNext();
      // toast.success("firm info is filled successfully")
    }
  };

  const submitFirmDetail = async (e) => {
    e.preventDefault();

    if (svalue === 0) {
      toast.error(" Select Firm Size  ! ", {
        position: "top-center",
      });
    } else if (selectedOption === "") {
      toast.warning(" Select How did you hear about us ? ", {
        position: "top-center",
      });
    } else {
      handleNext();
      // toast.success("firm details is filled successfully")
    }
  };

  const [buttonStates2, setButtonStates2] = useState({
    TaxPreparation: false,
    TaxPlanning: false,
    Advisory: false,
    Resolution: false,
    Payroll: false,
    Accounting: false,
    Audit: false,
    LawFirm: false,
    Bookkeeping: false,
    Other: false,
  });

  const [selectAll, setSelectAll] = useState(false);
  const buttonsOn = Object.keys(buttonStates2).filter(
    (button) => buttonStates2[button],
  );
  const handleButtonClick2 = (buttonName) => {
    setButtonStates2((prevStates) => ({
      ...prevStates,
      [buttonName]: !prevStates[buttonName],
    }));
  };

  const selectedButtons = buttonsOn.join(", ");
  // console.log([selectedButtons]);

  const handleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    // Set the state of all buttons based on the "Select All" checkbox
    setButtonStates2((prevStates) => {
      const newButtonStates = {};
      Object.keys(prevStates).forEach((button) => {
        newButtonStates[button] = !selectAll;
      });
      return newButtonStates;
    });
  };

  useEffect(() => {}, [selectedButtons]);

  const submitService = async (e) => {
    e.preventDefault();

    if (selectedButtons == []) {
      toast.error(" Select Service  ! ", {
        position: "top-center",
      });
    } else {
      handleNext();
    }
  };

  const colors3 = [
    "Owner or partner",
    "Book keeper or Accountant",
    "Operations / office Manager",
    "Admin",
    "Assistant",
    "Other",
  ];
  const [buttonStates3, setButtonStates3] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [selectedButton3, setSelectedButton3] = useState(null);

  const handleToggle3 = (index) => {
    const updatedStates = buttonStates3.map((state, i) =>
      i === index ? !state : false,
    );
    setButtonStates3(updatedStates);
    setSelectedButton3(index);
  };

  const roleOption = colors3[selectedButton3];

  // useEffect to do something when selectedServices changes
  useEffect(() => {
    // console.log(roleOption);
    // You can perform additional actions or API calls here based on the selected services
  }, [roleOption]);
  const submitRole = async (e) => {
    e.preventDefault();

    if (selectedButton3 === "") {
      //   toast.error(" Select Role  ! ", {
      //     position: "top-center",
      //   });
    } else {
      handleNext();
      // toast.success("your role is filled successfully")
    }
  };
  const [currencies, setCurrencies] = useState("");

  const [url, setUrl] = useState("");
  const label = ".pms.com";

  const [selectedCurrency, setSelectedCurrency] = useState("");

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/supported_vs_currencies",
        );
        const currencyOptions = Object.keys(response.data).map((currency) => ({
          value: currency,
          label: response.data[currency].toUpperCase(),
        }));

        setCurrencies(currencyOptions);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption);
  };

  const handleSubmitUrl = () => {
    const combinedValue = url + label;
    // console.log("Combined value:", combinedValue);
    return combinedValue;
  };

  const combinedData = {
    url: handleSubmitUrl(),
  };

  // console.log(combinedData.url);

  const languages = [
    { value: "English(British)", label: "English(British)" },
    { value: "Deutsch", label: "Deutsch" },
    { value: "Ztaliano", label: "Ztaliano" },
    { value: "Nederlands", label: "Nederlands" },
    { value: "suomi", label: "suomi" },
    { value: "Dansk", label: "Dansk" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const language = selectedLanguage;
  console.log(language);

  const handleLanguageChange = (selectedLanguage) => {
    setSelectedLanguage(selectedLanguage);
  };

  //?validation
  const submiturl = async (e) => {
    e.preventDefault();
    // console.log("vinayak");

    if (url === "") {
      toast.error(" Choose web URL ! ", {
        position: "top-center",
      });
    } else if (currencies === "") {
      toast.warning(" Select Currency ! ", {
        position: "top-center",
      });
    } else if (language === "") {
      toast.warning(" Select language ! ", {
        position: "top-center",
      });
    } else {
      handleNext();
    }
  };
  const submitPassword = async (e) => {
    e.preventDefault();

    const { password, cpassword } = inppass;

    if (password === "") {
      alert("password is required!", {
        position: "top-center",
      });
    } else if (password.length < 8) {
      alert("password must be 6 char!", {
        position: "top-center",
      });
    } else if (cpassword === "") {
      alert("cpassword is required!", {
        position: "top-center",
      });
    } else if (cpassword.length < 8) {
      alert("confirm password must be 6 char!", {
        position: "top-center",
      });
    } else if (password !== cpassword) {
      alert("pass and Cpass are not matching!", {
        position: "top-center",
      });
    } else {
      toast.success(" Account created successfully  ", {
        position: "top-right",
      });

      //call final
      adminalldata();
      navigate("/login");
      //   history("/login");
    }
  };
  const [adminIdUpdate, setAdminIdUpdate] = useState("");
  const adminalldata = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: inpval.email,
      firstName: firstname,
      lastName: lastName,
      phoneNumber: phoneNumber,
      firmName: firmName,
      country: selectedCountry,
      state: selectedState,
      // firmSize: svalue,
      firmSize: inputValue,
      referenceFrom: selectedOption,
      services: [selectedButtons],
      role: roleOption,
      firmURL: combinedData.url,
      currency: selectedCurrency.label,
      language: language.label,
      password: inppass.password,
      cpassword: inppass.cpassword,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const Url = `${LOGIN_API}/admin/adminsignup`;
    fetch(Url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        console.log(result.admin._id);
        setAdminIdUpdate(result.admin._id);
        newUser(result.admin._id);

        toast.success("Signup successful!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error signing up. Please try again.", error);
      });
  };
  console.log(adminIdUpdate);
  //************************ */
  const userCreatedmail = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // const port = window.location.port;
    const url = `${LOGIN_API}/login`;
    const raw = JSON.stringify({
      email: inpval.email,
      url: url,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const Url = `${LOGIN_API}/usersemail/usersavedemail/`;
    fetch(Url, requestOptions)
      .then((response) => response.json())

      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };
  //************************ */
  // const [newUserId, setNewUserId] = useState("");
  const newUser = (adminUserId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: firmName,
      email: inpval.email,
      password: inppass.password,
      role: "Admin",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    const Url = `${LOGIN_API}/common/login/signup/`;
    fetch(Url, requestOptions)
      .then((response) => response.json())

      .then((result) => {
        console.log(result);
        console.log(result._id);
        updateAdminUserId(result._id, adminUserId);
        insertNotificationAccess(result._id);
        sendFirmSettings(result._id);
        userCreatedmail();
      })

      .catch((error) => console.error(error));
  };

  const insertNotificationAccess = (userid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      userId: userid,
      notifications: [
        {
          notificationDescription: "Invoices",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Payments",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Organizers",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Uploads",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "E-signatures",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Approvals",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Done uploading",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Tasks",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Messages",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "New mail",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Proposals",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Jobs",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "Mentions",
          inbox: false,
          email: false,
        },
        {
          notificationDescription: "SMS",
          inbox: false,
          email: false,
        },
      ],
      active: true,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/admin/notification`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const updateAdminUserId = (UserId, adminUserId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      userid: UserId,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(adminUserId);
    // const Url = `${LOGIN_API}/admin/adminsignup`;
    fetch(`${LOGIN_API}/admin/adminsignup/${adminUserId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })

      .catch((error) => console.error(error));
  };

  const sendFirmSettings = (userid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      firmName: firmName,
      defaultreplytoemails: inpval.email,
      state: selectedState,
      phoneNumber: phoneNumber,
      firmURL: combinedData.url,
      language: language.label,
      adminuserid: userid,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);

    fetch(`${LOGIN_API}/adminfirm/firmsetting/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Response data:", result);
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const [inppass, setInppass] = useState({
    password: "",
    cpassword: "",
  });

  //console.log
  const setValP = (e) => {
    // console.log(e.target.value);
    const { name, value } = e.target;

    setInppass(() => {
      return {
        ...inppass,
        [name]: value,
      };
    });
  };

  const passwordValidation = {
    hasNumber: /\d/.test(inppass.password),
    hasUppercase: /[A-Z]/.test(inppass.password),
    hasLowercase: /[a-z]/.test(inppass.password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(inppass.password),
    hasMinLength: inppass.password.length >= 8,
  };
  const renderFormFields = () => {
    console.log("Current step:", currentStep);

    switch (currentStep) {
      // Email (Case 2)
      case 0:
        // return showEmailContent ? (
        //   <>
        //     <Box
        //       sx={{
        //         display: "flex",
        //         justifyContent: "center",
        //         alignItems: "center",
        //         margin: "5%",
        //         // maxHeight: '100vh',
        //         flexDirection: "column",
        //       }}
        //     >
        //       {/* <Typography variant="h4" component="h2" gutterBottom>
        //         Confirmation Code
        //       </Typography> */}
        //       <Typography
        //         variant="h1"
        //         sx={{
        //           color: "black",
        //           fontSize: "35px",
        //           fontWeight: "700",
        //           mb: "20px",
        //           textAlign: "center",
        //           fontFamily: "sans-serif",
        //         }}
        //       >
        //         Confirmation Code
        //       </Typography>

        //       <Typography sx={{ margin: "3px 0" }}>
        //         We sent a confirmation code to your email: <b>{inpval.email}</b>
        //       </Typography>

        //       {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        //                             <BorderColorIcon />
        //                         </Box> */}

        //       <Typography sx={{ fontSize: "14px", margin: "3px 0" }}>
        //         Please, enter it below:
        //       </Typography>

        //       <Box
        //         sx={{
        //           mt: 2,
        //           mb: 4,
        //           display: "flex",
        //           alignItems: "center",
        //           justifyContent: "center",
        //         }}
        //       >
        //         <OtpInput
        //           value={otp}
        //           onChange={setOtp}
        //           numInputs={6}
        //           renderInput={(props) => (
        //             <input
        //               {...props}
        //               style={{
        //                 width: "40px",
        //                 height: "60px",
        //                 fontSize: "42px",
        //                 fontFamily: "Arial, sans-serif",
        //                 margin: "10px",
        //                 textAlign: "center",
        //               }}
        //             />
        //           )}
        //         />
        //       </Box>

        //       <Box
        //         sx={{
        //           display: "flex",
        //           justifyContent: "center",
        //           gap: 2,
        //           mb: 4,
        //           alignItems: "center",
        //         }}
        //       >
        //         <Typography variant="body">
        //           <strong>Didn't receive it? </strong>
        //         </Typography>
        //         <Button variant="text" onClick={resensotp}>
        //           Resend code
        //         </Button>
        //       </Box>

        //       <Box
        //         sx={{
        //           display: "flex",
        //           alignItems: "center",
        //           justifyContent: "center",
        //           gap: "40px",
        //         }}
        //       >
        //         <Button
        //           variant="contained"
        //           className="btn1"
        //           onClick={handleClearOtp}
        //         >
        //           Clear OTP
        //         </Button>
        //         <Button
        //           variant="contained"
        //           className="btn1"
        //           onClick={sendOtpVerify}
        //         >
        //           Verify
        //         </Button>
        //       </Box>
        //     </Box>
        //   </>
        // ) : null;
        return (
          showEmailContent && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-semibold">Confirmation Code</h2>

              <p className="text-sm text-slate-600">
                We sent a confirmation code to:
              </p>

              <p className="font-medium text-black break-all">{inpval.email}</p>

              <p className="text-sm text-slate-500">Please enter it below</p>

              {/* OTP INPUT */}
              <div className="flex justify-center">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="w-12 h-14 mx-2 text-2xl text-center border 
                         border-slate-300 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </div>

              {/* RESEND */}
              <div className="flex justify-center items-center gap-2 text-sm">
                <span className="text-slate-600">Didn't receive it?</span>
                <button
                  onClick={resensotp}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Resend code
                </button>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={handleClearOtp}
                  className="px-4 py-2 border border-slate-300 
                     rounded-md hover:bg-slate-100 transition"
                >
                  Clear OTP
                </button>

                <button
                  onClick={sendOtpVerify}
                  className="px-6 py-2 bg-black text-white 
                     rounded-md hover:opacity-90 transition"
                >
                  Verify
                </button>
              </div>
            </div>
          )
        );

      // Information (Cases 3-7)
      case 1:
        return <>{renderInformationSteps()}</>;

      // Settings (Cases 8-9)
      case 2:
        return <>{renderSettingsSteps()}</>;

      default:
        return null;
    }
  };

  // Information Step (Cases 3-7)
  const renderInformationSteps = () => {
    switch (subStep) {
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">
              Your Information
            </h2>

            <div className="space-y-4">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <PhoneInput
                  country="us"
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value)}
                  enableSearch
                  searchPlaceholder="Search country..."
                  disableCountryCode={false}
                  containerClass="!w-full"
                  inputClass="!w-full 
                !h-11 
                !pl-14 
                !pr-3 
                !rounded-lg 
                !border 
                !border-slate-300 
                !bg-white 
                !text-sm 
                !cursor-text
                focus:!outline-none 
                focus:!ring-2 
                focus:!ring-blue-500 
                focus:!border-blue-500 
                transition-all duration-200"
                  buttonClass="!border-slate-300 
                 !bg-white 
                 hover:!bg-slate-50 
                 !rounded-l-lg 
                 transition-colors duration-200"
                  dropdownClass="!rounded-lg 
                   !shadow-lg 
                   !border 
                   !border-slate-200 
                   !mt-2 
                   animate-fadeIn"
                />

                {!valid && (
                  <p className="text-sm text-red-500">
                    Please enter a valid phone number.
                  </p>
                )}
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={submitUserinfo}
                className="px-6 py-2 bg-black text-white 
                     rounded-md hover:opacity-90 transition"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex items-center justify-center p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">Firm Information</h2>
                <p className="text-sm text-slate-500">
                  Tell us about your firm
                </p>
              </div>

              <form className="space-y-5">
                {/* Firm Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Firm Name
                  </label>
                  <TextField
                    fullWidth
                    name="firm name"
                    placeholder="Enter firm name"
                    size="small"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        transition: "all 0.2s ease",
                      },
                    }}
                  />
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Country
                  </label>
                  <Autocomplete
                    size="small"
                    value={selectedCountryD}
                    onChange={(event, newValue) => {
                      setSelectedCountry(newValue?.label || "");
                      setSelectedCountryD(newValue || null);
                      setSelectedState(null);
                    }}
                    options={countries}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select country"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            transition: "all 0.2s ease",
                          },
                        }}
                      />
                    )}
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    State
                  </label>
                  <Autocomplete
                    size="small"
                    value={stateOptions.find(
                      (option) => option.value === selectedState,
                    )}
                    onChange={(event, newValue) => {
                      setSelectedState(newValue?.label || "");
                    }}
                    options={stateOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select state"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            transition: "all 0.2s ease",
                          },
                        }}
                      />
                    )}
                  />
                </div>

                {/* Next Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={submitFerminfo}
                    className="w-full bg-black text-white py-2.5 rounded-lg 
                           font-medium transition hover:opacity-90"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex items-center justify-center p-8">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">Firm Details</h2>
                <p className="text-sm text-slate-500">
                  Help us understand your firm better
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-700">
                  Firm Size
                </label>

                <div className="flex items-center gap-4">
                  {/* Number Input */}
                  <input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-24 border rounded-md px-3 py-2 text-center"
                  />

                  {/* Slider Wrapper */}
                  <div className="flex-1 pr-2">
                    <Slider
                      value={inputValue}
                      onChange={handleSliderChange}
                      step={1}
                      min={0}
                      max={200}
                      sx={{
                        width: "100%",
                        "& .MuiSlider-rail": {
                          opacity: 0.3,
                        },
                        "& .MuiSlider-thumb": {
                          width: 16,
                          height: 16,
                        },
                        "& .MuiSlider-markLabel": {
                          display: "none",
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Clean scale labels */}
                <div className="flex justify-between text-xs text-slate-500 px-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                  <span>200+</span>
                </div>
              </div>

              {/* Source Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-700">
                  How did you hear about PMS Solutions?
                </h3>

                <div className="flex flex-wrap gap-3">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleToggle(index)}
                      className={`px-4 py-2 text-sm rounded-lg border transition
                  ${
                    buttonStates[index]
                      ? "bg-black text-white border-black"
                      : "border-slate-300 hover:bg-slate-100"
                  }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-4">
                <button
                  onClick={submitFirmDetail}
                  className="w-full bg-black text-white py-2.5 rounded-lg 
                       font-medium transition hover:opacity-90"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <>
            <>
              <div className="space-y-8">
                {/* Title */}
                <div className="text-center">
                  <h2 className="text-3xl font-semibold tracking-tight">
                    Services your firm offers
                  </h2>
                  <p className="text-sm text-slate-500 mt-2">
                    Select all services that apply
                  </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.keys(buttonStates2).map((service) => (
                    <button
                      key={service}
                      onClick={() => handleButtonClick2(service)}
                      className={`
            px-4 py-2 rounded-lg border text-sm font-medium transition
            ${
              buttonStates2[service]
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }
          `}
                    >
                      {service.replace(/([A-Z])/g, " $1").trim()}
                    </button>
                  ))}
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between pt-6">
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      className="w-4 h-4 accent-slate-900"
                    />
                    Select All
                  </label>

                  <button
                    onClick={submitService}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:opacity-90 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          </>
        );
      case 7:
        return (
          <>
            <>
              <div className="space-y-8">
                {/* Title */}
                <div className="text-center">
                  <h2 className="text-3xl font-semibold tracking-tight">
                    Your role in the firm
                  </h2>
                  <p className="text-sm text-slate-500 mt-2">
                    Select the option that best describes your role
                  </p>
                </div>

                {/* Role Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {colors3.map((role, index) => (
                    <button
                      key={index}
                      onClick={() => handleToggle3(index)}
                      className={`
            w-full px-4 py-3 rounded-lg border text-sm font-medium text-left transition
            ${
              buttonStates3[index]
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }
          `}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={submitRole}
                    className="px-8 py-2 bg-slate-900 text-white rounded-lg hover:opacity-90 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          </>
        );
      default:
        return null;
    }
  };

  // Settings Step (Cases 8-9)
  const renderSettingsSteps = () => {
    switch (settingsStep) {
      case 8:
        return (
          <div className="w-full flex justify-center items-center py-8">
            <div className="w-full max-w-lg space-y-6">
              {/* HEADER */}
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Firm Settings
                </h2>

                <p className="text-slate-600">
                  A powerful, integrated platform to manage teams, clients,
                  projects.
                </p>

                <p className="text-slate-900 font-medium">
                  from $50/mo per user
                  <span className="text-slate-500 font-normal ml-1">
                    (with a 3-year subscription plan)
                  </span>
                </p>
              </div>

              {/* WORKSPACE URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Choose your workspace URL
                </label>

                <p className="text-sm text-slate-500">
                  You can connect a custom domain later (without .pms.com)
                </p>

                <div className="flex">
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="your-firm-name"
                    className="
                flex-1 h-11 px-3 rounded-l-md
                border border-slate-300
                focus:outline-none focus:ring-2 focus:ring-slate-900
              "
                  />

                  <div
                    className="
                flex items-center px-3
                border border-l-0 border-slate-300
                rounded-r-md bg-slate-50 text-slate-600
              "
                  >
                    .pms.com
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  You cannot change this later
                </p>
              </div>

              {/* DROPDOWNS */}
              <div className="grid grid-cols-2 gap-4">
                {/* Currency */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>

                  <Select
                    value={selectedCurrency?.label || ""}
                    onValueChange={(value) => {
                      const selected = currencies.find(
                        (c) => c.label === value,
                      );

                      handleCurrencyChange(selected);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>

                    <SelectContent>
                      {currencies.map((currency, index) => (
                        <SelectItem key={index} value={currency.label}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>

                  <Select
                    value={selectedLanguage?.label || ""}
                    onValueChange={(value) => {
                      const selected = languages.find((l) => l.label === value);

                      handleLanguageChange(selected);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>

                    <SelectContent>
                      {languages.map((language, index) => (
                        <SelectItem key={index} value={language.label}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* CONTINUE BUTTON */}
              <button
                onClick={submiturl}
                className="
            w-full h-11 rounded-md
            bg-slate-900 text-white font-medium
            hover:bg-slate-800
            transition
          "
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="w-full flex justify-center items-center py-8">
            <div className="w-full max-w-lg space-y-6">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-3xl font-semibold">Set Password</h2>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={inppass.password}
                    onChange={setValP}
                    placeholder="Password"
                    className="
                w-full h-11 px-3 pr-10 rounded-md
                border border-slate-300
                focus:outline-none focus:ring-2 focus:ring-slate-900
              "
                  />

                  <button
                    type="button"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    className="
                absolute right-3 top-1/2 -translate-y-1/2
                text-slate-500 hover:text-slate-800
              "
                  >
                    👁
                  </button>
                </div>
              </div>

              {/* Password Validation */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <p
                  className={
                    passwordValidation.hasNumber
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  ✓ a number
                </p>

                <p
                  className={
                    passwordValidation.hasUppercase
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  ✓ an uppercase letter
                </p>

                <p
                  className={
                    passwordValidation.hasLowercase
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  ✓ a lowercase letter
                </p>

                <p
                  className={
                    passwordValidation.hasSymbol
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  ✓ a symbol
                </p>

                <p
                  className={
                    passwordValidation.hasMinLength
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  ✓ at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="cpassword"
                    value={inppass.cpassword}
                    onChange={setValP}
                    placeholder="Confirm Password"
                    className="
                w-full h-11 px-3 pr-10 rounded-md
                border border-slate-300
                focus:outline-none focus:ring-2 focus:ring-slate-900
              "
                  />

                  <button
                    type="button"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    className="
                absolute right-3 top-1/2 -translate-y-1/2
                text-slate-500 hover:text-slate-800
              "
                  >
                    👁
                  </button>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={submitPassword}
                className="
            w-full h-11 mt-4
            bg-slate-900 text-white
            rounded-md
            hover:bg-slate-800 transition-all
          "
              >
                Continue
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // return (
  //   <Box>
  //     {/* Render the Stepper only when the Email step content is shown */}
  //     <Box>
  //       {showEmailContent && (
  //         <Box
  //           sx={{
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "space-between",
  //             padding: "10px 15px",
  //           }}
  //         >
  //           <Box
  //             sx={{
  //               padding: "10px 15px",
  //               display: "flex",
  //               alignItems: "center",
  //             }}
  //           >
  //             <img src={micropms} style={{ height: "40px" }} />
  //             <Typography
  //               variant="h6"
  //               sx={{
  //                 fontFamily: "sans-serif",
  //                 color: "black",
  //                 fontSize: "20px",
  //                 fontWeight: "700",
  //               }}
  //             >
  //               PMS Solutions
  //             </Typography>
  //           </Box>
  //           <Stepper activeStep={currentStep}>
  //             {steps.map((label, index) => (
  //               <Step key={index}>
  //                 <StepLabel>
  //                   <Typography fontSize="25px" ml={2} mr={2}>
  //                     {label}
  //                   </Typography>
  //                 </StepLabel>
  //               </Step>
  //             ))}
  //           </Stepper>

  //           <Button variant="outlined" onClick={handleAdminLogin}>
  //             Log In
  //           </Button>
  //         </Box>
  //       )}
  //     </Box>

  //     <Box>
  //       {/* Render form fields based on current step */}
  //       {renderFormFields()}
  //     </Box>

  //     <Box>
  //       {/* Show button to go to email step initially */}
  //       {!showEmailContent && (
  //         <>
  //           <Box
  //             sx={{
  //               py: 4,
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //               gap: 1,
  //             }}
  //           >
  //             <img src={micropms} style={{ height: "32px" }} />
  //             <Typography
  //               variant="h6"
  //               sx={{
  //                 fontFamily: "'Manrope', sans-serif",
  //                 color: "black",
  //                 fontSize: "20px",
  //                 fontWeight: "700",
  //               }}
  //             >
  //               PMS Solutions
  //             </Typography>
  //           </Box>
  //           <Box
  //             sx={{
  //               minHeight: "100vh",
  //               background: "linear-gradient(180deg, #f7f9fc 0%, #ffffff 100%)",

  //               display: "flex",
  //               // border: solid "black",
  //               justifyContent: "center",
  //               alignItems: "center",
  //               margin: "3%",
  //               maxHeight: "100vh", // Full viewport height
  //               flexDirection: "column", // Column direction for centering
  //             }}
  //           >
  //             <Box
  //               className="fade-slide-in"
  //               sx={{
  //                 width: "100%",
  //                 maxWidth: 420,
  //                 p: 4,
  //                 borderRadius: 3,
  //                   boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
  //               }}
  //             >
  //               {/* <Typography variant="h5" textAlign={"center"}>
  //                 <b>Signup</b>
  //               </Typography> */}
  //               <Typography
  //                 variant="h5"
  //                 sx={{
  //                   color: "text.secondary",
  //                   // fontSize: "35px",
  //                   fontWeight: "700",
  //                   mb: 0.5,
  //                   textAlign: "center",
  //                   // fontFamily: "sans-serif",
  //                 }}
  //               >
  //                 Sign up
  //               </Typography>
  //               <Typography
  //                 variant="body2"
  //                 sx={{
  //                   textAlign: "center",
  //                   color: "text.secondary",
  //                   mb: 3,
  //                 }}
  //               >
  //                 Sign up your firm and start upgrading your workflow
  //               </Typography>

  //               <form>
  //                 <Box
  //                   className="form-group"
  //                   sx={{ display: "flex", flexDirection: "column", gap: 2 }}
  //                 >
  //                   <InputLabel sx={{ color: "black" }}>Email</InputLabel>
  //                   <TextField
  //                     fullWidth
  //                     type="email"
  //                     name="email"
  //                     placeholder="Enter Your Email"
  //                     size="medium"
  //                     sx={{
  //                       "& .MuiOutlinedInput-root": {
  //                         borderRadius: 2,
  //                         transition: "border-color 0.2s ease",
  //                       },
  //                     }}
  //                     value={inpval.email}
  //                     onChange={handleEmailChange}
  //                     error={Boolean(emailError)}
  //                     helperText={emailError}
  //                   />
  //                 </Box>

  //                 <Box
  //                   sx={{
  //                     display: "flex",
  //                     alignItems: "center",
  //                     width: "100%",
  //                     mt: 1,
  //                   }}
  //                 >
  //                   <FormControlLabel
  //                     control={
  //                       <Checkbox
  //                         id="terms"
  //                         onChange={setValbox}
  //                         checked={isChecked}
  //                         disabled={loading}
  //                       />
  //                     }
  //                     label={
  //                       <Typography variant="body2" color="text.secondary">
  //                         I agree to the terms and conditions
  //                       </Typography>
  //                     }
  //                   />
  //                 </Box>

  //                 <Box
  //                   sx={{
  //                     display: "flex",
  //                     alignItems: "center",
  //                     justifyContent: "center",
  //                   }}
  //                 >
  //                   <Button
  //                     fullwidth
  //                     variant="contained"
  //                     size="large"
  //                     disabled={!canSubmit}
  //                     sx={{
  //                       mt: 2,
  //                       py: 1.2,
  //                       textTransform: "none",
  //                       fontWeight: 600,
  //                       boxShadow: "none",
  //                       transition: "all 0.2s ease",
  //                       "&:hover": {
  //                         transform: "translateY(-1px)",
  //                       },
  //                       "&:active": {
  //                         transform: "translateY(0)",
  //                       },
  //                     }}
  //                     // variant="contained"
  //                     onClick={async () => {
  //                       try {
  //                         setLoading(true);
  //                         await createAccount();
  //                       } finally {
  //                         setLoading(false);
  //                       }
  //                     }}
  //                   >
  //                     {loading ? "Create account..." : "Create account"}
  //                   </Button>
  //                 </Box>

  //                 <Box
  //                   sx={{
  //                     display: "flex",
  //                     alignItems: "center",
  //                     justifyContent: "center",
  //                     mt: 2,
  //                   }}
  //                 >
  //                   <Typography
  //                     variant="body2"
  //                     className="sign-in-link"
  //                     textAlign="center"
  //                     mt={3}
  //                   >
  //                     Already have an account?{" "}
  //                     <Link component={NavLink} to="/" sx={{ fontWeight: 500 }}>
  //                       Sign in
  //                     </Link>
  //                   </Typography>
  //                 </Box>
  //               </form>
  //             </Box>
  //           </Box>
  //         </>
  //       )}
  //     </Box>
  //   </Box>
  // );

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT PANEL */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white p-12">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            PMS Solutions
          </h1>
          <p className="text-slate-300">
            A powerful platform to manage your firm, clients, workflows and
            billing — all in one place.
          </p>
        </div>
      </div>
      {/* RIGHT PANEL */}
 <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">


     <div className="w-full max-w-md">

  {/* Progress Bar */}
  {showEmailContent && (
    <div className="mb-6">
      <PremiumSignupProgress
        currentStep={currentStep}
        showEmailContent={showEmailContent}
        subStep={subStep}
        settingsStep={settingsStep}
      />
    </div>
  )}

  {showEmailContent && (
    <Button
  variant="outline"
  size="icon"
  onClick={handleBack}
  className="absolute left-6 top-6 rounded-full shadow-md hover:shadow-lg"
>
  <ArrowLeft className="w-4 h-4" />
  Back
    </Button>

  )}

  {/* Card */}
  <Card className="w-full p-8 shadow-xl rounded-2xl bg-white space-y-6 animate-in fade-in zoom-in-95 duration-300">

    {!showEmailContent && (
      <>
        <h2 className="text-2xl font-semibold text-center">
          Sign up
        </h2>

        <p className="text-sm text-slate-500 text-center">
          Sign up your firm and start upgrading your workflow
        </p>

        <div className="space-y-2">
          <input
            type="email"
            name="email"
            value={inpval.email}
            onChange={handleEmailChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 transition
              ${
                emailError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-slate-900"
              }`}
            placeholder="Enter your email"
          />

          {emailError && (
            <p className="text-sm text-red-500">{emailError}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={isChecked}
            onChange={setValbox}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <label htmlFor="terms" className="text-sm text-slate-600">
            I agree to the terms and conditions
          </label>
        </div>

        <button
          onClick={createAccount}
          className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 transition"
        >
          Create Account
        </button>
      </>
    )}

    {showEmailContent && (
      <div className="animate-in fade-in duration-300">
        {renderFormFields()}
      </div>
    )}

  </Card>

</div>
</div>
    </div>
  );
};

export default MyForm;


import React, { useState, useEffect } from "react";
import logo from '../Images/Logo.svg';
import { Box, Link, Divider, IconButton, Typography, TextField, InputLabel, Checkbox, Button, FormControlLabel, Paper, Grid, FormControl } from '@mui/material';
import { NavLink } from "react-router-dom"; // Correct import for NavLink
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import startsWith from "lodash.startswith";
import axios from "axios";
import { Autocomplete } from '@mui/material';
import firmsetting from '../Images/setting.png';
import OutlinedInput from '@mui/material/OutlinedInput';
import './Adminsignup.css';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const AdminSignup = () => {
      console.log("🔥 AdminSignup component rendered 🔥");
    const navigate = useNavigate();
    // TODO ======== #page control logic No1 =======
    //! Change state for testing
    const [currentStep, setCurrentStep] = useState(3);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [valid, setValid] = useState(true);
    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    //Country State API

    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [states, setStates] = useState([]);
    const [firmName, setFirmName] = useState("");
    const [selectedState, setSelectedState] = useState("");

    const [error, setError] = useState(null);
    const [formError , setformError] = useState(null);
    const [selectedCountryD, setSelectedCountryD] = useState("");

    const countryStates = states.find((country) => country.name === selectedCountry)?.states || [];

    // Transform the states data into options for React Select
    const stateOptions = countryStates.map((state, index) => ({
        value: state.name,
        label: state.name,
    }));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
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
                const response = await axios.get("https://countriesnow.space/api/v0.1/countries/states");
                setStates(response.data.data);
            } catch (error) {
                console.error("Error fetching state data:", error);
            }
        };

        getStatesData();
    }, [countries]);

    // useEffect to do something when selectedCountry changes
    useEffect(() => {
        console.log("Selected Country:", selectedCountry);
        // You can perform additional actions or API calls here based on the selected country
    }, [selectedCountry]);

    //todo ========    #send mail to backend for varification code  case 5: =======
    //slider
    const [value, setValue] = useState();
    const [sliderValue, setSliderValue] = useState(0);
    const fixedValues = [0, 5, 10, 15, 50, 100, 200];
    const colors = ["Google search", "Capterra/ Get app/ G2", "From a friend", "Offline event", "Social media", "Taxdome consultant/ Partner", "Other"];
    const [buttonStates, setButtonStates] = useState([false, false, false, false, false, false, false]);
    const [selectedButton, setSelectedButton] = useState(null);

    const handleToggle = (index) => {
        const updatedStates = buttonStates.map((state, i) => (i === index ? !state : false));
        setButtonStates(updatedStates);
        setSelectedButton(index);
    };

    const handleSliderChange = (event) => {
        setSliderValue(parseInt(event.target.value, 10));
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

    //=============================================================
    //todo  Services offers case 6:

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
    const buttonsOn = Object.keys(buttonStates2).filter((button) => buttonStates2[button]);
    const handleButtonClick2 = (buttonName) => {
        setButtonStates2((prevStates) => ({
            ...prevStates,
            [buttonName]: !prevStates[buttonName],
        }));
    };

    const selectedButtons = buttonsOn.join(", ");
    console.log([selectedButtons]);

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

    useEffect(() => {
        // console.log(selectedButtons);
        // You can perform additional actions or API calls here based on the selected services
    }, [selectedButtons]);

    const submitService = async (e) => {
        e.preventDefault();

        if (selectedButtons == []) {
              toast.error(" Select Service  ! ", {
                position: "top-center",
              });
        } else {
            nextStep();
            toast.success("Services your firm offers filled successfully")
        }
    };

    //======================================
    //======================================

    //todo role selection case 7
    const colors3 = ["Owner or partner", "Book keeper or Accountant", "Operations / office Manager", "Admin", "Assistant", "Other"];
    const [buttonStates3, setButtonStates3] = useState([false, false, false, false, false, false]);
    const [selectedButton3, setSelectedButton3] = useState(null);

    const handleToggle3 = (index) => {
        const updatedStates = buttonStates3.map((state, i) => (i === index ? !state : false));
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
            nextStep();
            toast.success("your role is filled successfully")
        }
    };
    //============================
    ////todo role selection case 8 ============================
    const [currencies, setCurrencies] = useState("");

    const [url, setUrl] = useState("");
    const label = ".pms.com";

    const [selectedCurrency, setSelectedCurrency] = useState("");

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await axios.get("https://api.coingecko.com/api/v3/simple/supported_vs_currencies");
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

    // const handleUrlChange = (e) => {

    //   setUrl(e.target.value);

    // };

    const handleSubmitUrl = () => {
        const combinedValue = url + label;
        console.log("Combined value:", combinedValue);
        return combinedValue;
    };

    const combinedData = {
        url: handleSubmitUrl(),
    };

    console.log(combinedData.url);

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
        console.log("vinayak");

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
               } 
               else {
                
            nextStep();
            toast.success("firm settings filled succesfully")
        }
    };

    //todo role selection case 9
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const [passShow, setPassShow] = useState(false);
    const [cpassShow, setCPassShow] = useState(false);

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

    //  const submitPassword = async (e) => {
    //    e.preventDefault();

    //    const { password, cpassword } = inppass;

    //    if (password === "") {
    //      alert("password is required!", {
    //        position: "top-center",
    //      });
    //    } else if (password.length < 8) {
    //      alert("password must be 6 char!", {
    //        position: "top-center",
    //      });
    //    } else if (cpassword === "") {
    //      alert("cpassword is required!", {
    //        position: "top-center",
    //      });
    //    } else if (cpassword.length < 8) {
    //      alert("confirm password must be 6 char!", {
    //        position: "top-center",
    //      });
    //    } else if (password !== cpassword) {
    //      alert("pass and Cpass are not matching!", {
    //        position: "top-center",
    //      });
    //    } else {
    //      toast.success(" Account created successfully  ", {
    //        position: "top-right",
    //      });
    //      // nextStep();

    //      //call final
    //      adminalldata();
    //      // useNavigate("/login")
    //      history("/login");
    //    }
    //  };

    //*checkbox
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
    const createAccount = async () => {
        // e.preventDefault();

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

            fetch("http://127.0.0.1:8880/common/user/email/getuserbyemail/" + email, requestOptions)
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
                        toast.error("User with this EMail already exists", { position: "top-right" });
                        // You can also do further processing here if needed
                    } else {
                        // e.preventDefault();

                        let data = JSON.stringify({
                            email: inpval.email,
                        });

                        let config = {
                            method: "post",
                            maxBodyLength: Infinity,
                            url: "http://127.0.0.1:8880/request-otp",
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
                                // alert("Check your email ID for OTP");
                                setformError("OTP has been sent to your email ID")
                                //   setInpval({ ...inpval, email: "" });
                                setIsChecked(false);
                                nextStep();
                            })
                            .catch((error) => {
                                alert("please check your OTP");
                                console.log(error);
                            });
                    }
                })
                .catch((error) => console.error("Error:", error));
            console.log(error);
        }
    };


    const resensotp = async (e) => {
        e.preventDefault();

        //const { email } = inpval;

        e.preventDefault();

        let data = JSON.stringify({
            email: inpval.email,
        });
        const Url = "http://127.0.0.1:8880/request-otp";
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
                //toast.success("Check your email ID for OTP", { position: "top-right" });

                alert("Check your email ID for OTP");
            })
            .catch((error) => {
                alert("please check your OTP");
                console.log(error);
            });
    };

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
                email: inpval.email,
                otp: otp,
            });
            const Url = 'http://127.0.0.1:8880/verify-otp/';
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
                    // toast.success("Check your email ID for OTP", { position: "top-right" });

                    alert("Email verified sucessfully");
                    setOtp("");

                    nextStep();
                })
                .catch((error) => {
                    alert("please check your OTP");
                    console.log(error);
                });
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
            nextStep();
            toast.success("your info is filled successfully")
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
          nextStep();
          toast.success("firm info is filled successfully")
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
          nextStep();
          toast.success("firm details is filled successfully")
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
          // nextStep();
    
          //call final
          adminalldata();
          navigate("/login")
        //   history("/login");
        }
      };
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
          firmSize: svalue,
          referenceFrom: selectedOption,
          services: [
             selectedButtons,
           
          ],
          role: roleOption,
          firmURL: combinedData.url,
          currency: selectedCurrency.label,
          language: language.label,
          password: inppass.password,
          cpassword: inppass.cpassword,
        });
    console.log(raw)
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        const Url = 'http://127.0.0.1:8880/admin/adminsignup';
        fetch(Url, requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.text();
          })
          .then((result) => {
            console.log(result);
    
            newUser();
    
            toast.success("Signup successful!");
          })
          .catch((error) => {
            console.error(error);
            toast.error("Error signing up. Please try again.", error);
          });
      };

      //************************ */
  const userCreatedmail = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const port = window.location.port;
    const url = `http://127.0.0.1:8880:${port}/login`;
    const raw = JSON.stringify({
      email: inpval.email,
      url: url,
    });
console.log(raw)
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const Url = 'http://127.0.0.1:8880/usersavedemail/';
    fetch(Url, requestOptions)
      .then((response) => response.text())

      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };
    //************************ */
  const newUser = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: firmName,
      email: inpval.email,
      password: inppass.password,
      role: roleOption,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const Url = 'http://127.0.0.1:8880/common/login/signup/';
    fetch(Url, requestOptions)
      .then((response) => response.text())

      .then((result) => {
        console.log(result);
        userCreatedmail();
      })

      .catch((error) => console.error(error));
  };
 
  
    const renderFormFields = () => {
        console.log("Current step:", currentStep);
      
        switch (currentStep) {
            // Sign up
            case 1:
                return (
                    <div className="min-h-screen bg-background flex flex-col">
                  
                      {/* Header */}
                      <header className="w-full px-6 py-4 border-b border-border bg-background">
                        <div className="flex items-center gap-2">
                          <img src={logo} alt="Logo" className="w-8" />
                          <span className="font-semibold text-lg text-foreground">
                            PMS Solutions
                          </span>
                        </div>
                      </header>
                  
                      {/* Center Content */}
                      <div className="flex-1 flex items-center justify-center px-4">
                  
                        <Card className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-border bg-card text-card-foreground space-y-6">
                  
                          {/* Title Section */}
                          <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold">
                              Create Account
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Sign up your firm and start upgrading your workflow
                            </p>
                          </div>
                  
                          {/* Form */}
                          <form onSubmit={handleSubmit} className="space-y-5">
                  
                            {/* Email Field */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Email
                              </label>
                  
                              <Input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={inpval.email}
                                onChange={setVal}
                                className="bg-background focus-visible:ring-2 focus-visible:ring-primary"
                              />
                            </div>
                  
                            {/* Terms */}
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="terms"
                                checked={isChecked}
                                onChange={setValbox}
                                className="h-4 w-4 border-border accent-primary"
                              />
                              <label
                                htmlFor="terms"
                                className="text-sm text-muted-foreground"
                              >
                                I agree to the terms and conditions
                              </label>
                            </div>
                  
                            {/* Button */}
                            <Button
                              type="submit"
                              onClick={createAccount}
                              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
                            >
                              Create Account
                            </Button>
                  
                            {/* Sign In Link */}
                            <p className="text-sm text-center text-muted-foreground">
                              Already have an account?{" "}
                              <NavLink
                                to="/"
                                className="text-primary font-medium hover:underline"
                              >
                                Sign in
                              </NavLink>
                            </p>
                  
                          </form>
                        </Card>
                      </div>
                    </div>
                  );

            // code confirmation 
            case 2:
                return (
                    <div className="min-h-screen bg-background flex flex-col">
                  
                      {/* Header */}
                      <header className="w-full px-6 py-4 border-b border-border bg-background">
                        <div className="flex items-center gap-2">
                          <img src={logo} alt="Logo" className="w-8" />
                          <span className="font-semibold text-lg text-foreground">
                            PMS Solutions
                          </span>
                        </div>
                      </header>
                  
                      {/* Center Content */}
                      <div className="flex-1 flex items-center justify-center px-4">
                  
                        <Card className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-border bg-card text-card-foreground space-y-6">
                  
                          {/* Title */}
                          <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-semibold">
                              Confirmation Code
                            </h2>
                  
                            <p className="text-sm text-muted-foreground">
                              We sent a confirmation code to:
                            </p>
                  
                            <p className="text-sm font-medium text-foreground break-all">
                              {inpval.email}
                            </p>
                  
                            <p className="text-sm text-muted-foreground">
                              Please enter it below
                            </p>
                          </div>
                  
                          {/* OTP Inputs */}
                          <div className="flex justify-center gap-3 pt-2">
                            <OtpInput
                              value={otp}
                              onChange={setOtp}
                              numInputs={6}
                              renderInput={(props) => (
                                <input
                                  {...props}
                                  className="
                                    w-15 h-14
                                    text-xl
                                    text-center
                                    rounded-md
                                    border border-border
                                    bg-background
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-primary
                                    transition
                                  "
                                />
                              )}
                            />
                          </div>
                  
                          {/* Resend */}
                          <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                              Didn't receive it?
                            </span>{" "}
                            <button
                              onClick={resensotp}
                              className="text-primary font-medium hover:underline"
                            >
                              Resend code
                            </button>
                          </div>
                  
                          {/* Actions */}
                          <div className="flex gap-4 pt-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={handleClearOtp}
                            >
                              Clear OTP
                            </Button>
                  
                            <Button
                              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={sendOtpVerify}
                            >
                              Verify
                            </Button>
                          </div>
                  
                        </Card>
                      </div>
                    </div>
                  );
            //!================================================================================================================================================================
            case 3:
                return (
                    <div className="min-h-screen bg-background flex flex-col">
                  
                      {/* Header */}
                      <header className="w-full px-6 py-4 border-b border-border bg-background">
                        <div className="flex items-center gap-2">
                          <img src={logo} alt="Logo" className="w-8" />
                          <span className="font-semibold text-lg text-foreground">
                            PMS Solutions
                          </span>
                        </div>
                      </header>
                  
                      {/* Center Content */}
                      <div className="flex-1 flex items-center justify-center px-4">
                  
                        <Card className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-border bg-card text-card-foreground space-y-6">
                  
                          {/* Title */}
                          <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold">
                              Your Information
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Tell us a bit about yourself
                            </p>
                          </div>
                  
                          <form className="space-y-5">
                  
                            {/* First Name */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                First Name
                              </label>
                              <Input
                                name="First Name"
                                placeholder="First Name"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                className="bg-background focus-visible:ring-2 focus-visible:ring-primary"
                              />
                            </div>
                  
                            {/* Last Name */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Last Name
                              </label>
                              <Input
                                name="Last Name"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="bg-background focus-visible:ring-2 focus-visible:ring-primary"
                              />
                            </div>
                  
                            {/* Phone Number */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                Phone Number
                              </label>
                  
                              <div className="rounded-md border border-border bg-background focus-within:ring-2 focus-within:ring-primary transition">
                                <PhoneInput
                                  country={"us"}
                                  placeholder="Enter phone number"
                                  value={phoneNumber}
                                  onChange={(value) => {
                                    setPhoneNumber(value);
                                  }}
                                  countryCodeEditable={false}
                                  inputStyle={{
                                    width: "100%",
                                    border: "none",
                                    background: "transparent",
                                  }}
                                  buttonStyle={{
                                    border: "none",
                                    background: "transparent",
                                  }}
                                  containerStyle={{
                                    width: "100%",
                                  }}
                                  isValid={(inputNumber, country, countries) => {
                                    return countries.some((country) => {
                                      return (
                                        startsWith(inputNumber, country.dialCode) ||
                                        startsWith(country.dialCode, inputNumber)
                                      );
                                    });
                                  }}
                                />
                              </div>
                  
                              {!valid && (
                                <p className="text-sm text-destructive">
                                  Please enter a valid phone number.
                                </p>
                              )}
                            </div>
                  
                            {/* Button */}
                            <Button
                              type="button"
                              onClick={submitUserinfo}
                              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
                            >
                              Next
                            </Button>
                  
                          </form>
                  
                        </Card>
                      </div>    
                    </div>
                  );
            //!===============================================================================================================================
            case 4:
                return (
                    <div className="min-h-screen bg-background flex flex-col">
                  
                      {/* Header */}
                      <header className="w-full px-6 py-4 border-b border-border bg-background">
                        <div className="flex items-center gap-2">
                          <img src={logo} alt="Logo" className="w-8" />
                          <span className="font-semibold text-lg text-foreground">
                            PMS Solutions
                          </span>
                        </div>
                      </header>
                  
                      {/* Center Section */}
                      <div className="flex-1 flex items-center justify-center px-4">
                  
                        <Card className="w-full max-w-lg p-8 rounded-2xl shadow-xl border border-border bg-card text-card-foreground space-y-6">
                  
                          {/* Title */}
                          <div className="text-center space-y-1">
                            <h2 className="text-2xl font-semibold">
                              Firm Information
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Tell us about your firm
                            </p>
                          </div>
                  
                          <form className="space-y-6">
                  
                            {/* Firm Name */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Firm Name
                              </label>
                              <Input
                                name="firm name"
                                placeholder="Enter firm name"
                                value={value}
                                onChange={(e) => setFirmName(e.target.value)}
                                className="bg-background focus-visible:ring-2 focus-visible:ring-primary"
                              />
                            </div>
                  
                            {/* Country */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Country
                              </label>
                  
                              <Select
                                value={selectedCountryD?.label || ""}
                                onValueChange={(value) => {
                                  const selected = countries.find(c => c.label === value)
                                  setSelectedCountry(value)
                                  setSelectedCountryD(selected)
                                  setSelectedState(null)
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                  
                                <SelectContent className="max-h-60">
                                  {countries.map((country) => (
                                    <SelectItem
                                      key={country.label}
                                      value={country.label}
                                    >
                                      {country.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                  
                            {/* State */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                State
                              </label>
                  
                              <Select
                                value={selectedState || ""}
                                onValueChange={(value) => {
                                  setSelectedState(value)
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                  
                                <SelectContent className="max-h-60">
                                  {stateOptions.map((state) => (
                                    <SelectItem
                                      key={state.value}
                                      value={state.label}
                                    >
                                      {state.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                  
                            {/* Button */}
                            <Button
                              type="button"
                              onClick={submitFerminfo}
                              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
                            >
                              Next
                            </Button>
                  
                          </form>
                  
                        </Card>
                      </div>
                    </div>
                  )
            //!===============================================================================================================================

            case 5:
                return (
                    <div className="min-h-screen bg-background flex flex-col">
                  
                      {/* Header */}
                      <header className="w-full px-6 py-4 border-b border-border bg-background">
                        <div className="flex items-center gap-2">
                          <img src={logo} alt="Logo" className="w-8" />
                          <span className="font-semibold text-lg text-foreground">
                            PMS Solutions
                          </span>
                        </div>
                      </header>
                  
                      {/* Center Content */}
                      <div className="flex-1 flex items-center justify-center px-4">
                  
                        <Card className="w-full max-w-xl p-8 rounded-2xl shadow-xl border border-border bg-card text-card-foreground space-y-8">
                  
                          {/* ===== FIRM SIZE ===== */}
                          <div className="space-y-4">
                  
                            <div className="text-center space-y-1">
                              <h2 className="text-2xl font-semibold">
                                Firm Size
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Selected: {fixedValues[sliderValue]}
                              </p>
                            </div>
                  
                            {/* Labels */}
                            <div className="flex justify-between text-sm text-muted-foreground px-1">
                              {fixedValues.map((value, index) => (
                                <span key={index}>{value}</span>
                              ))}
                            </div>
                  
                            {/* Slider */}
                            <input
                              type="range"
                              min="0"
                              max={fixedValues.length - 1}
                              step="1"
                              value={sliderValue}
                              onChange={handleSliderChange}
                              className="
                                w-full
                                accent-primary
                                cursor-pointer
                              "
                            />
                  
                            {sliderValue === 0 && (
                              <p className="text-sm text-destructive text-center">
                                Please select company size
                              </p>
                            )}
                          </div>
                  
                          {/* Divider */}
                          <div className="border-t border-border pt-6 space-y-4">
                  
                            <h3 className="text-lg font-semibold text-center">
                              How did you hear about PMS Solutions?
                            </h3>
                  
                            {/* Selection Buttons */}
                            <div className="flex flex-wrap justify-center gap-3">
                  
                              {colors.map((color, index) => (
                                <Button
                                  key={index}
                                  type="button"
                                  onClick={() => handleToggle(index)}
                                  className={`
                                    ${
                                      buttonStates[index]
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-foreground hover:bg-muted/70"
                                    }
                                    transition
                                  `}
                                >
                                  {color}
                                </Button>
                              ))}
                  
                            </div>
                  
                            {/* Selected Source */}
                            {selectedButton !== null && (
                              <p className="text-sm text-center text-muted-foreground pt-2">
                                Source of Information:{" "}
                                <span className="font-medium text-foreground">
                                  {colors[selectedButton]}
                                </span>
                              </p>
                            )}
                  
                          </div>
                  
                          {/* Next Button */}
                          <Button
                            type="button"
                            onClick={submitFirmDetail}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
                          >
                            Next
                          </Button>
                  
                        </Card>
                  
                      </div>
                    </div>
                  );
            //!===============================================================================================================        
            case 6:
                return (
                    <div className="min-h-screen bg-background flex flex-col">
                  
                      {/* Header */}
                      <header className="w-full px-6 py-4 border-b border-border bg-background">
                        <div className="flex items-center gap-2">
                          <img src={logo} alt="Logo" className="w-8" />
                          <span className="font-semibold text-lg text-foreground">
                            PMS Solutions
                          </span>
                        </div>
                      </header>
                  
                      {/* Center Content */}
                      <div className="flex-1 flex items-center justify-center px-4 py-10">
                  
                        <Card className="w-full max-w-4xl p-8 rounded-2xl shadow-xl border border-border bg-card text-card-foreground">
                  
                          {/* Title */}
                          <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold">
                              Services your firm offers
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                              Select all that apply
                            </p>
                          </div>
                  
                          {/* Services Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  
                            {[
                              "TaxPreparation",
                              "TaxPlanning",
                              "Advisory",
                              "Resolution",
                              "Payroll",
                              "Accounting",
                              "Audit",
                              "LawFirm",
                              "Bookkeeping",
                              "Other",
                            ].map((service) => (
                              <Button
                                key={service}
                                type="button"
                                onClick={() => handleButtonClick2(service)}
                                variant={buttonStates2[service] ? "default" : "secondary"}
                                className="w-full transition-all duration-200"
                              >
                                {service.replace(/([A-Z])/g, " $1").trim()}
                              </Button>
                            ))}
                  
                          </div>
                  
                          {/* Selected Services */}
                          {buttonsOn.length > 0 && (
                            <div className="mt-6 text-sm text-muted-foreground text-center">
                              Services Selected:
                              <span className="ml-2 font-medium text-foreground">
                                {buttonsOn.join(", ")}
                              </span>
                            </div>
                          )}
                  
                          {/* Footer Section */}
                          <div className="mt-8 flex items-center justify-between">
                  
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                              <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                className="h-4 w-4 accent-primary"
                              />
                              Select All
                            </label>
                  
                            <Button
                              type="button"
                              onClick={submitService}
                              className="bg-primary text-primary-foreground hover:bg-primary/90 transition"
                            >
                              Next
                            </Button>
                  
                          </div>
                  
                        </Card>
                  
                      </div>
                    </div>
                  );
            // !=======================================================================================+================

            case 7:
                return (
                    <div className="min-h-screen bg-background flex flex-col">
                  
                      {/* Header */}
                      <header className="w-full px-6 py-4 border-b border-border bg-background">
                        <div className="flex items-center gap-2">
                          <img src={logo} alt="Logo" className="w-8" />
                          <span className="font-semibold text-lg text-foreground">
                            PMS Solutions
                          </span>
                        </div>
                      </header>
                  
                      {/* Center Content */}
                      <div className="flex-1 flex items-center justify-center px-4 py-10">
                  
                        <Card className="w-full max-w-3xl p-8 rounded-2xl shadow-xl border border-border bg-card text-card-foreground space-y-8">
                  
                          {/* Title */}
                          <div className="text-center space-y-2">
                            <h1 className="text-2xl font-semibold">
                              Your role in the firm
                            </h1>
                            <p className="text-sm text-muted-foreground">
                              Select the option that best describes you
                            </p>
                          </div>
                  
                          {/* Roles Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  
                            {colors3.map((color, index) => (
                              <Button
                                key={index}
                                type="button"
                                variant={buttonStates3[index] ? "default" : "secondary"}
                                onClick={() => handleToggle3(index)}
                                className="w-full transition-all duration-200"
                              >
                                {color}
                              </Button>
                            ))}
                  
                          </div>
                  
                          {/* Selected Role */}
                          {selectedButton3 !== null && (
                            <div className="text-center text-sm text-muted-foreground">
                              Selected Role:
                              <span className="ml-2 font-medium text-foreground">
                                {colors3[selectedButton3]}
                              </span>
                            </div>
                          )}
                  
                          {/* Next Button */}
                          <div className="flex justify-end pt-4">
                            <Button
                              type="button"
                              onClick={submitRole}
                              className="bg-primary text-primary-foreground hover:bg-primary/90 transition"
                            >
                              Next
                            </Button>
                          </div>
                  
                        </Card>
                  
                      </div>
                    </div>
                  );

            // !===============================================================
            case 8:
                return (
                    <div className="min-h-screen bg-background flex flex-col">
                  
                      {/* Header */}
                      <header className="w-full px-6 py-4 border-b border-border bg-background">
                        <div className="flex items-center gap-2">
                          <img src={logo} alt="Logo" className="w-8" />
                          <span className="font-semibold text-lg text-foreground">
                            PMS Solutions
                          </span>
                        </div>
                      </header>
                  
                      {/* Center Content */}
                      <div className="flex-1 flex items-center justify-center px-4 py-10">
                  
                        <Card className="w-full max-w-2xl p-8 rounded-2xl shadow-xl border border-border bg-card text-card-foreground space-y-8">
                  
                          {/* Title */}
                          <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold">
                              Firm Settings
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              A powerful, integrated platform to manage teams, clients and projects.
                            </p>
                            <p className="text-sm font-medium text-primary">
                              from $50/mo per user (with a 3-year subscription plan)
                            </p>
                          </div>
                  
                          {/* URL Section */}
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Choose Web URL</h3>
                            <p className="text-sm text-muted-foreground">
                              You will be able to set up a fully custom domain later.
                            </p>
                  
                            <div className="flex items-center">
                              <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Enter your URL"
                                className="rounded-r-none"
                              />
                              <div className="px-4 py-2 border border-l-0 border-border bg-muted text-sm rounded-r-md">
                                .pms.com
                              </div>
                            </div>
                  
                            <p className="text-xs text-destructive">
                              You cannot change this later
                            </p>
                          </div>
                  
                          {/* Currency + Language */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                            {/* Currency */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Select Currency
                              </label>
                  
                              <Select
                                value={selectedCurrency?.label}
                                onValueChange={(value) =>
                                  handleCurrencyChange(
                                    currencies.find((c) => c.label === value)
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {currencies.map((currency) => (
                                    <SelectItem
                                      key={currency.label}
                                      value={currency.label}
                                    >
                                      {currency.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                  
                            {/* Language */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Select Language
                              </label>
                  
                              <Select
                                value={selectedLanguage?.label}
                                onValueChange={(value) =>
                                  handleLanguageChange(
                                    languages.find((l) => l.label === value)
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a language" />
                                </SelectTrigger>
                                <SelectContent>
                                  {languages.map((language) => (
                                    <SelectItem
                                      key={language.label}
                                      value={language.label}
                                    >
                                      {language.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                  
                              {selectedLanguage && (
                                <p className="text-xs text-muted-foreground">
                                  You selected: {selectedLanguage.label}
                                </p>
                              )}
                            </div>
                  
                          </div>
                  
                          {/* Continue Button */}
                          <Button
                            onClick={submiturl}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
                          >
                            Continue
                          </Button>
                  
                        </Card>
                  
                      </div>
                    </div>
                  );
            //!===========================================================================================================

            case 9:
              return (
  <div className="min-h-screen bg-background flex flex-col">

    {/* Header */}
    <header className="w-full px-6 py-4 border-b border-border bg-background">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-8" />
        <span className="font-semibold text-lg text-foreground">
          PMS Solutions
        </span>
      </div>
    </header>

    {/* Center Content */}
    <div className="flex-1 flex items-center justify-center px-4 py-10">

      <Card className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-border bg-card text-card-foreground space-y-8">

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold">
            Set Password
          </h2>
          <p className="text-sm text-muted-foreground">
            Secure your account with a strong password
          </p>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Password
          </label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={inppass.password}
              onChange={setValP}
              placeholder="Enter password"
              className="pr-foreground"
            />

            <button
              type="button"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              {showPassword ? <VisibilityOff size={18} /> : <Visibility size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Confirm Password
          </label>

          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="cpassword"
              value={inppass.cpassword}
              onChange={setValP}
              placeholder="Confirm password"
              className="pr-10"
            />

            <button
              type="button"
              onClick={handleClickShowConfirmPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              {showConfirmPassword ? <VisibilityOff size={18} /> : <Visibility size={18} />}
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={submitPassword}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          Continue
        </Button>

      </Card>

    </div>
  </div>
);
            default:
                return null;
        }
    };

    // Handle form submission (placeholder for now)
    const handleSubmit = (event) => {
        event.preventDefault();
        // Add logic for form submission here
    };

    return (
        <Box>
            {formError && (
  <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
    {formError}
  </div>
)}
            {renderFormFields()}
        </Box>
    );
}

export default AdminSignup;



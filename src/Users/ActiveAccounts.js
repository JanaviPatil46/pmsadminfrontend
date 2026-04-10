import React, { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ActiveAccounts = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  //for password
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  //for confiem password
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickConfirmShowPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpConfirmPassword = (event) => {
    event.preventDefault();
  };

  /// Integration
  const { _id, token } = useParams();
  console.log(_id);
  console.log(token);
  const navigate = useNavigate();

  const [values, setValues] = useState();
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setCPassShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordMatchValidation, setPasswordMatchValidation] = useState("");

  useEffect(() => {
    fetchidwiseData();
  }, []);

  //get id wise template Record

  const fetchidwiseData = async () => {
    try {
      const url = `${LOGIN_API}/admin/teammember/${_id}`;
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      setValues(data.teamMember);
      setFirstName(data.teamMember.firstName);
      setMiddleName(data.teamMember.middleName);
      setLastName(data.teamMember.lastName);
      setEmail(data.teamMember.email);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    validatePassword(password, newConfirmPassword);
  };

  const validatePassword = (newPassword) => {
    // Check if newPassword is defined before performing operations
    if (typeof newPassword !== "undefined") {
      // Example validation criteria: password length >= 8 characters, contains at least one number and one letter
      const hasNumber = /\d/.test(newPassword);
      const hasLetter = /[a-zA-Z]/.test(newPassword);
      const isValid = newPassword.length >= 8 && hasNumber && hasLetter;
      setPasswordValid(isValid);
    }
  };

  const [firstNameValidation, setFirstNameValidation] = useState("");
  const [lastNameValidation, setLastNameValidation] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [confirmPasswordValidation, setConfirmPasswordValidation] =
    useState("");

  const submitvalidation = async (e) => {
    e.preventDefault();
    // Validation for First Name
    if (firstName === "") {
      setFirstNameValidation("First Name can't be blank");
    } else {
      setFirstNameValidation("");
    }

    // Validation for Last Name
    if (lastName === "") {
      setLastNameValidation("Last Name can't be blank");
    } else {
      setLastNameValidation("");
    }

    // Validation for Phone Number
    if (password === "") {
      setPasswordValidation("Password is compalsary");
    } else {
      setPasswordValidation("");
    }

    // Validation for Phone Number
    if (confirmPassword === "") {
      setConfirmPasswordValidation("Confirm Password is compalsary");
    } else {
      setConfirmPasswordValidation("");
    }
    // if passwords don't match → stop
    if (password !== confirmPassword) {
      setPasswordMatchValidation("Passwords do not match");
      return;
    }
    // If all validations pass, proceed to next step
    if (firstName && lastName && password && confirmPassword) {
      UserValidToken();
    }
  };

  const UserValidToken = async () => {
    validatePassword();
    const url = `${LOGIN_API}/common/resetpassword/verifytoken/`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
    console.log(data);
    if (data.message === "Access granted") {
      console.log("userVerify");
      const id = data.user.id;
      console.log(id);
      getuser();
      handleSubmit();
    } else if (data.message === "Invalid token") {
      toast.error("Time Expired!");
      //ToDo send to resetpasswordlink
    }
  };

  const handleSubmit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      // password: password,
      // cpassword: confirmPassword
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    console.log(raw);

    fetch(`${LOGIN_API}/admin/teammember/${_id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // Show success toast
        toast.success("Team Member activated successfully!");
        console.log(result);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((error) => {
        // Show error toast
        toast.error("Failed to activate Team Member. Please try again.");
        console.error(error);
      });
  };
  const getuser = async () => {
    try {
      const myHeaders = new Headers();
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `${LOGIN_API}/common/user/email/getuserbyemail/${email}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      console.log(data);

      if (
        data.message === "User retrieved successfully" &&
        data.user.length > 0
      ) {
        const userId = data.user[0]._id; // Access the _id field of the first user
        console.log(userId);
        updatePassword(userId);
      } else {
        console.error("No user found in the response");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //************************ */
  ///Update Password
  const updatePassword = (_id, token) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("id", _id);
    myHeaders.append("Authorization", token);

    console.log(token);
    const raw = JSON.stringify({
      password: confirmPassword,
    });
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const urlupdateuserpassword = `${LOGIN_API}/common/user/password/updateuserpassword/`;
    const baseUrl = urlupdateuserpassword;
    const url = new URL(baseUrl);
    console.log(url);
    // url.searchParams.append("id", _id);
    // url.searchParams.append("token", token);

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((result) => {
        console.log(result);
        toast("Password Updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating password:", error.message);
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">Set Up Your Account</h1>
        <div className="my-4 h-px bg-slate-200" />
        <p className="mb-6 text-sm text-slate-600">
          To activate your account, please fill in the requested information.
        </p>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
            {firstNameValidation && <p className="mt-1 text-xs text-red-500">{firstNameValidation}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
          </div>
          <div>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
            {lastNameValidation && <p className="mt-1 text-xs text-red-500">{lastNameValidation}</p>}
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
              <button
                type="button"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordValidation && <p className="mt-1 text-xs text-red-500">{passwordValidation}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Password"
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
              <button
                type="button"
                onClick={handleClickConfirmShowPassword}
                onMouseDown={handleMouseDownConfirmPassword}
                onMouseUp={handleMouseUpConfirmPassword}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {(confirmPasswordValidation || passwordMatchValidation) && (
              <p className="mt-1 text-xs text-red-500">{confirmPasswordValidation || passwordMatchValidation}</p>
            )}
          </div>
        </div>

        {/* Password Checklist */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 mb-6">
          <p className="text-sm font-medium text-slate-700 mb-2">Your password must contain:</p>
          <ul className="space-y-1.5">
            <li className={`flex items-center gap-2 text-sm ${password.length >= 8 ? 'text-green-600' : 'text-slate-400'}`}>
              <CheckCircle2 className={`h-4 w-4 shrink-0 ${password.length >= 8 ? 'text-green-500' : 'text-slate-300'}`} />
              Minimum 8 characters
            </li>
            <li className={`flex items-center gap-2 text-sm ${/\d/.test(password) ? 'text-green-600' : 'text-slate-400'}`}>
              <CheckCircle2 className={`h-4 w-4 shrink-0 ${/\d/.test(password) ? 'text-green-500' : 'text-slate-300'}`} />
              At least one number
            </li>
            <li className={`flex items-center gap-2 text-sm ${/[a-zA-Z]/.test(password) ? 'text-green-600' : 'text-slate-400'}`}>
              <CheckCircle2 className={`h-4 w-4 shrink-0 ${/[a-zA-Z]/.test(password) ? 'text-green-500' : 'text-slate-300'}`} />
              At least one letter
            </li>
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            onClick={submitvalidation}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveAccounts;

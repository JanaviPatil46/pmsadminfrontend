import React ,{useState,useEffect,useContext}from 'react'
import {Box,Drawer,Typography,Divider,Button,Autocomplete,TextField} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import Editor from "../../Templates/Texteditor/Editor"
import {toast} from "react-toastify"
import { LoginContext } from "../../Sidebar/Context/Context";
const NewChat = ({ open, handleClose, getsChatlist}) => {
  const INTERNALCHAT = process.env.REACT_APP_INTERNALCHAT_API
    const { logindata } = useContext(LoginContext);

  const [loginUserId, setLoginUserId] = useState();

  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
    const [inputText, setInputText] = useState("");
    const [inputTextError, setInputTextError] = useState("");
    const [description, setDescription] = useState("");
    const handleEditorChange = (content) => {
        setDescription(content);
      };

      const [selecteduser, setSelectedUser] = useState(null);

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (loginUserId) {
      fetchData();
    }
  }, [loginUserId]);
  
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      // setUserData(data);
          // Exclude the current user
    const filteredData = data.filter(user => user._id !== loginUserId);

    setUserData(filteredData);
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

  // const saveChat = () => {
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
   
  //   const messageData = [
  //     {
  //       message: description,
  //       fromwhome: "Admin",
  //       senderid: loginUserId,
       
  //       isRead:false
  //     },
  //   ];

  //   const raw = JSON.stringify({
  //       teammemberid: selecteduser.value,
     
    
     
  //     description: messageData,
     
  //     active: "true",
  //   });
  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };
  //   console.log(raw);
  //   fetch(`http://127.0.0.1:8016/api/internalchat/send`, requestOptions)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((result) => {
  //       console.log(result);
  //       // console.log("chat id",result.newChats._id)
  //       // setChatId(result.newChats._id)
  //       toast.success("New Chat created successfully");
      
  //       handleClose();
  //       ClearFileds();
  //       getsChatlist()
  //     })
  //     .catch((error) => {
  //       console.error("Fetch error: ", error.message);
  //       toast.error("Failed to create new chat. Please try again.");
  //     });
  // };
   
  const saveChat = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const userRole = localStorage.getItem("userRole"); // or use logindata?.user?.role
  
    const messageData = [
      {
        message: description,
        fromwhome: userRole, // ✅ dynamically from role
        senderid: loginUserId,
        isRead: false,
      },
    ];
  
    const raw = JSON.stringify({
      participants: [loginUserId, selecteduser.value],
      description: messageData,
      active: "true",
    });
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    console.log(raw);
  
    fetch(`${INTERNALCHAT}/api/internalchat/send`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        toast.success("New Chat created successfully");
        handleClose();
        ClearFileds();
        getsChatlist();
      })
      .catch((error) => {
        console.error("Fetch error: ", error.message);
        toast.error("Failed to create new chat. Please try again.");
      });
  };
  
  
  
  const ClearFileds = () => {
   setSelectedUser(null);

        setInputText("");
      
        setDescription();
      
      };
    
      const handleCloseDrawer = ()=>{
        handleClose()
        ClearFileds()

      }


  return (
    <Drawer
    anchor="right"
    open={open}
    onClose={handleClose}
    PaperProps={{
      sx: {
        width: 600,
      },
    }}
  >
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Typography variant="h6">New chat</Typography>
        <Box
          onClick={handleClose}
          sx={{ cursor: "pointer", color: "#1976d3" }}
        >
          <CloseIcon />
        </Box>
      </Box>
      <Divider />

      <Box p={3} height={"75vh"} overflow={"auto"}>
        <Typography>To</Typography>
        <Box mr={2}>
        <Autocomplete
                      options={options}
                      sx={{ mt: 2, mb: 2, backgroundColor: "#fff" }}
                      size="small"
                      value={selecteduser}
                      onChange={handleuserChange}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      getOptionLabel={(option) => option.label || ""}
                      renderInput={(params) => (
                        <>
                          <TextField
                            {...params}
                           
                            placeholder="Select Teammember"
                          />
                        
                        </>
                      )}
                      isClearable={true}
                    />
        </Box>
     
      

        <Box sx={{ mt: 2 }}>
          <Editor
            initialContent={description}
            onChange={handleEditorChange}
          />
        </Box>
       
       

        
   
      </Box>
      <Box
        sx={{
          display: "flex",
          // justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={saveChat}
          sx={{
            backgroundColor: "var(--color-save-btn)", // Normal background

            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)", // Hover background color
            },

            borderRadius: "15px",
          }}
          
          
        >
          Create chat
        </Button>
        <Button
          onClick={handleCloseDrawer}
          variant="outlined"
          sx={{
            borderColor: "var(--color-border-cancel-btn)", // Normal background
            color: "var(--color-save-btn)",
            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)", // Hover background color
              color: "#fff",
              border: "none",
            },
            width: "80px",
            borderRadius: "15px",
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  </Drawer>
  )
}

export default NewChat
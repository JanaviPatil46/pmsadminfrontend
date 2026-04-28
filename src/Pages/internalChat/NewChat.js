import React ,{useState,useEffect,useContext}from 'react'
import Editor from "../../Templates/Texteditor/Editor"
import {toast} from "react-toastify"
import { LoginContext } from "../../Sidebar/Context/Context";
import { SideSheet } from "../../components/ui/side-sheet";
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
    <SideSheet
      open={open}
      onOpenChange={(o) => !o && handleCloseDrawer()}
      title="New Chat"
      size="lg"
      onCancel={handleCloseDrawer}
      onConfirm={saveChat}
      confirmLabel="Create Chat"
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">To</label>
          <select
            value={selecteduser?.value || ""}
            onChange={(e) => {
              const found = options.find(o => o.value === e.target.value);
              setSelectedUser(found || null);
            }}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select Teammember</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Message</label>
          <Editor initialContent={description} onChange={handleEditorChange} />
        </div>
      </div>
    </SideSheet>
  )
}

export default NewChat
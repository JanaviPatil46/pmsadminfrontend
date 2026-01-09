

// import React, { useEffect, useRef, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   Typography,
//   Button,
//   Stack,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   LinearProgress,
//   Divider,
//   Box,
// } from "@mui/material";
// import FolderIcon from "@mui/icons-material/Folder";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import axios from "axios";
// import { toast } from "react-toastify";

// /* ------------------ Folder Tree Builder ------------------ */

// const buildTree = (files) => {
//   const root = {};


//   files.forEach((file) => {
//     // 🔥 REMOVE ROOT FOLDER
//     const parts = file.webkitRelativePath
//       .split("/")
//       .filter(Boolean)
//       .slice(1); // drop "testing"

//     let current = root;

//     parts.forEach((part, index) => {
//       if (!current[part]) {
//         current[part] = {
//           files: [],
//           children: {},
//         };
//       }

//       if (index === parts.length - 1) {
//         current[part].files.push(file);
//       }

//       current = current[part].children;
//     });
//   });

//   return root;
// };


// /* ------------------ Recursive Tree Renderer ------------------ */
// const renderTree = (tree, level = 0) =>
//   Object.keys(tree).map((key) => (
//     <Box key={key} sx={{ pl: level * 2 }}>
//       <ListItem dense>
//         <FolderIcon fontSize="small" />
//         <ListItemText sx={{ ml: 1 }} primary={key} />
//       </ListItem>

//       {tree[key].files.map((f, i) => (
//         <ListItem key={i} dense sx={{ pl: 4 }}>
//           <InsertDriveFileIcon fontSize="small" />
//           <ListItemText sx={{ ml: 1 }} primary={f.name} />
//         </ListItem>
//       ))}

//       {renderTree(tree[key].children, level + 1)}
//     </Box>
//   ));

// /* ------------------ Main Component ------------------ */
// const AccountTable = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState(null);
  

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [treeData, setTreeData] = useState({});
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);

//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     fetchAccounts();
//   }, []);

//   const fetchAccounts = async () => {
//     try {
//       const res = await axios.get(
//         "http://127.0.0.1:8022/api/accounts/list?active=true"
//       );
//       setAccounts(res.data?.accountlist || []);
//     } catch (err) {
//       setError("Failed to load accounts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ------------------ Select Folder ------------------ */
//   const handleSelectFolder = (account) => {
//     setSelectedAccount(account);
//     fileInputRef.current.value = "";
//     fileInputRef.current.click();
//   };

//   /* ------------------ Folder Picked ------------------ */
//   // const handleFolderChange = (e) => {
//   //   const files = Array.from(e.target.files);
//   //   if (!files.length) return;

//   //   setSelectedFiles(files);

//   //   const rootFolder = files[0].webkitRelativePath.split("/")[0];
//   //   setFolderName(rootFolder);

//   //   setTreeData(buildTree(files));
//   //   setDrawerOpen(true);
//   // };
// const handleFolderChange = (e) => {
//   const files = Array.from(e.target.files);
//   if (!files.length) return;

//   setSelectedFiles(files);
//   setTreeData(buildTree(files));
//   setDrawerOpen(true);
// };

//   /* ------------------ Upload ------------------ */
//   // const handleUpload = async () => {
//   //   if (!selectedFiles.length || !selectedAccount) {
//   //     toast.error("Select folder first");
//   //     return;
//   //   }

//   //   const formData = new FormData();

//   //   selectedFiles.forEach((file) => {
//   //     formData.append("files", file);
//   //     formData.append("paths", file.webkitRelativePath);
//   //   });

//   //   formData.append("accountId", selectedAccount._id);

//   //   try {
//   //     setUploading(true);
//   //     setUploadProgress(0);

//   //     await axios.post(
//   //       "http://127.0.0.1:8020/api/accountsdoc/upload-folder-raw",
//   //       formData,
//   //       {
//   //         onUploadProgress: (progressEvent) => {
//   //           const percent = Math.round(
//   //             (progressEvent.loaded * 100) / progressEvent.total
//   //           );
//   //           setUploadProgress(percent);
//   //         },
//   //       }
//   //     );

//   //     toast.success("Folder uploaded successfully");
//   //     setDrawerOpen(false);
//   //     setSelectedFiles([]);
//   //     setUploadProgress(0);
//   //   } catch (err) {
//   //     toast.error("Upload failed");
//   //   } finally {
//   //     setUploading(false);
//   //   }
//   // };
// const handleUpload = async () => {
//   if (!selectedFiles.length || !selectedAccount) {
//     toast.error("Select folder first");
//     return;
//   }

//   const formData = new FormData();

//   selectedFiles.forEach((file) => {
//     const cleanPath = file.webkitRelativePath
//       .split("/")
//       .slice(1) // 🔥 remove root
//       .join("/");

//     formData.append("files", file);
//     formData.append("paths", cleanPath);
//   });

//   formData.append("accountId", selectedAccount._id);

//   try {
//     setUploading(true);
//     setUploadProgress(0);

//     await axios.post(
//       "http://127.0.0.1:8020/api/accountsdoc/upload-folder-raw",
//       formData,
//       {
//         onUploadProgress: (e) => {
//           setUploadProgress(
//             Math.round((e.loaded * 100) / e.total)
//           );
//         },
//       }
//     );

//     toast.success("Folder uploaded successfully");
//     setDrawerOpen(false);
//     setSelectedFiles([]);
//   } catch (err) {
//     toast.error("Upload failed");
//   } finally {
//     setUploading(false);
//   }
// };

//   /* ------------------ UI States ------------------ */
//   if (loading)
//     return (
//       <Paper sx={{ p: 3, textAlign: "center" }}>
//         <CircularProgress />
//       </Paper>
//     );

//   if (error)
//     return (
//       <Paper sx={{ p: 3 }}>
//         <Typography color="error">{error}</Typography>
//       </Paper>
//     );

//   /* ------------------ JSX ------------------ */
//   return (
//     <>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <strong>Account Name</strong>
//               </TableCell>
//               <TableCell align="right">
//                 <strong>Upload Folder</strong>
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {accounts.map((account) => (
//               <TableRow key={account._id}>
//                 <TableCell>{account.accountName}</TableCell>

//                 <TableCell align="right">
//                   <Stack direction="row" spacing={1} justifyContent="flex-end">
//                     <Button
//                       size="small"
//                       variant="outlined"
//                       onClick={() => handleSelectFolder(account)}
//                     >
//                       Select Folder
//                     </Button>

//                   </Stack>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* ------------------ Drawer ------------------ */}
     
//       <Drawer
//   anchor="right"
//   open={drawerOpen}
//   onClose={() => !uploading && setDrawerOpen(false)}
// >
//   <Box
//     sx={{
//       width: 920,
//       height: "100%",
//       display: "flex",
//       flexDirection: "column",
//     }}
//   >
//     <Box sx={{ p: 2 }}>
//       <Typography variant="h6">Folder Preview</Typography>
//     </Box>

//     <Divider />

//     <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
//       <List dense>{renderTree(treeData)}</List>
//     </Box>

//     <Divider />

//     <Box sx={{ p: 2 }}>
//       {uploading && (
//         <>
//           <Typography variant="body2">
//             Uploading… {uploadProgress}%
//           </Typography>
//           <LinearProgress
//             variant="determinate"
//             value={uploadProgress}
//             sx={{ mb: 2 }}
//           />
//         </>
//       )}

//       <Stack direction="row" spacing={2} justifyContent="flex-end">
//         <Button
//           variant="outlined"
//           disabled={uploading}
//           onClick={() => setDrawerOpen(false)}
//         >
//           Cancel
//         </Button>

//         <Button
//           variant="contained"
//           disabled={uploading}
//           onClick={handleUpload}
//         >
//           Upload
//         </Button>
//       </Stack>
//     </Box>
//   </Box>
// </Drawer>



//       {/* Hidden folder input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         hidden
//         multiple
//         webkitdirectory="true"
//         directory="true"
//         onChange={handleFolderChange}
//       />
//     </>
//   );
// };

// export default AccountTable;











// import React, { useEffect, useRef, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   Typography,
//   Button,
//   Stack,
// } from "@mui/material";
// import axios from "axios";
// import JSZip from "jszip";
// import { toast } from "react-toastify";
// const AccountTable = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const [folderName, setFolderName] = useState("");
//   const fileInputRef = useRef(null);
//   useEffect(() => {
//     fetchAccounts();
//   }, []);
//   const fetchAccounts = async () => {
//     try {
//       const res = await axios.get(
//         "http://127.0.0.1:8022/api/accounts/list?active=true"
//       );
//       setAccounts(res.data?.accountlist || res.data || []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load accounts");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // 👉 Open folder selector
//   const handleSelectFolder = (account) => {
//     setSelectedAccount(account);
//     console.log("account", account);
//     fileInputRef.current.click();
//   };
//   const handleFolderChange = (e) => {
//   let files = Array.from(e.target.files);

//   // 👉 CASE 1: Folder has files (normal behavior)
//   if (files.length > 0) {
//     setSelectedFiles(files);
//     const topFolder = files[0].webkitRelativePath.split("/")[0];
//     setFolderName(topFolder);
//     return;
//   }

//   // 👉 CASE 2: EMPTY folder selected
//   // Browser gives no files, so we must infer folder name
//   const input = e.target;
//   const folderPath = input.value.split("\\").pop(); // works in Chrome/Edge
//   const inferredFolderName = folderPath || "EmptyFolder";

//   // Create dummy .keep file to preserve folder
//   const dummyFile = new File(
//     ["empty folder"],
//     `${inferredFolderName}/.keep`,
//     { type: "text/plain" }
//   );

//   setSelectedFiles([dummyFile]);
//   setFolderName(inferredFolderName);

//   toast.info("Empty folder detected. Creating placeholder file.");
// };

//   // const handleFolderChange = (e) => {
//   //   const files = Array.from(e.target.files);
//   //   setSelectedFiles(files);
//   //   if (files.length > 0) {
//   //     const topFolder = files[0].webkitRelativePath.split("/")[0];
//   //     setFolderName(topFolder);
//   //   }
//   // };
//   const handleUpload = async () => {
//     if (!selectedFiles.length || !selectedAccount) {
//       toast.error("Please select a folder first");
//       return;
//     }
//     const targetFolderPath = `${selectedAccount._id}/${folderName}`;
//     console.log("targetFolderPath", targetFolderPath);
//     const zip = new JSZip();
//     selectedFiles.forEach((file) => {
//       zip.file(file.webkitRelativePath, file);
//     });
//     toast.info("Zipping folder...");
//     const zipBlob = await zip.generateAsync({ type: "blob" });
//     const formData = new FormData();
//     formData.append("folderZip", zipBlob, ` ${folderName}.zip`);
//     formData.append("folderName", folderName);
//     formData.append("folderPath", targetFolderPath);
//     try {
//       await axios.post(
//         "http://127.0.0.1:8020/api/accountsdoc/account-upload-folder",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       toast.success("Folder uploaded successfully");
//       setSelectedFiles([]);
//       setFolderName("");
//     } catch (err) {
//       console.error(err);
//       toast.error("Upload failed");
//     }
//   };
//   if (loading)
//     return (
//       <Paper sx={{ p: 3, textAlign: "center" }}>
//         {" "}
//         <CircularProgress />{" "}
//       </Paper>
//     );
//   if (error)
//     return (
//       <Paper sx={{ p: 3 }}>
//         {" "}
//         <Typography color="error">{error}</Typography>{" "}
//       </Paper>
//     );
//   return (
//     <>
//       {" "}
//       <TableContainer component={Paper}>
//         {" "}
//         <Table>
//           {" "}
//           <TableHead>
//             {" "}
//             <TableRow>
//               {" "}
//               <TableCell>
//                 <strong>Account Name</strong>{" "}
//               </TableCell>{" "}
//               <TableCell align="right">
//                 <strong>Upload Folder</strong>{" "}
//               </TableCell>{" "}
//             </TableRow>{" "}
//           </TableHead>{" "}
//           <TableBody>
//             {" "}
//             {accounts.map((account) => (
//               <TableRow key={account._id}>
//                 {" "}
//                 <TableCell>{account.accountName}</TableCell>{" "}
//                 <TableCell align="right">
//                   {" "}
//                   <Stack direction="row" spacing={1} justifyContent="flex-end">
//                     {" "}
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       onClick={() => handleSelectFolder(account)}
//                     >
//                       {" "}
//                       Select Folder{" "}
//                     </Button>{" "}
//                     <Button
//                       variant="contained"
//                       size="small"
//                       onClick={handleUpload}
//                       disabled={
//                         !selectedFiles.length ||
//                         selectedAccount?._id !== account._id
//                       }
//                     >
//                       {" "}
//                       Upload{" "}
//                     </Button>{" "}
//                   </Stack>{" "}
//                 </TableCell>{" "}
//               </TableRow>
//             ))}{" "}
//           </TableBody>{" "}
//         </Table>{" "}
//       </TableContainer>{" "}
//       {/* Hidden folder input */}{" "}
//       <input
//         ref={fileInputRef}
//         type="file"
//         hidden
//         multiple
//         webkitdirectory="true"
//         directory="true"
//         onChange={handleFolderChange}
//       />{" "}
//     </>
//   );
// };
// export default AccountTable;


import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const AccountTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedZip, setSelectedZip] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [folderName, setFolderName] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        "https://www.snptaxes.com/api/accounts/imported-incomplete?active=true"
      );
      setAccounts(res.data?.accountlist || res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  // 👉 Open ZIP selector
  const handleSelectZip = (account) => {
    setSelectedAccount(account);
    console.log("selcted account",account)
    setSelectedZip(null);
    setFolderName("");
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  // 👉 Handle ZIP selection
  const handleZipChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".zip")) {
      toast.error("Only ZIP files are allowed");
      return;
    }

    const nameWithoutExt = file.name.replace(/\.zip$/i, "");

    setSelectedZip(file);
    setFolderName(nameWithoutExt);

    toast.success(`Selected ZIP: ${file.name}`);
  };

  // 👉 Upload ZIP
  const handleUpload = async () => {
    if (!selectedZip || !selectedAccount) {
      toast.error("Please select a ZIP file first");
      return;
    }

    const targetFolderPath = `${selectedAccount._id}/${folderName}`;
console.log("targetFolderPath",targetFolderPath)
    const formData = new FormData();
    formData.append("folderZip", selectedZip);
    formData.append("folderName", folderName);
    formData.append("folderPath", targetFolderPath);
formData.append("accountId", selectedAccount._id);
    try {
      await axios.post(
        "https://www.snptaxes.com/api/accountsdoc/account-upload-folder",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("ZIP uploaded successfully");
      setSelectedZip(null);
      setFolderName("");
      fetchAccounts();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  if (loading)
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Paper>
    );

  if (error)
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Account Name</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Upload ZIP</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account._id}>
                <TableCell>{account.accountName}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleSelectZip(account)}
                    >
                      Select ZIP
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleUpload}
                      disabled={
                        !selectedZip ||
                        selectedAccount?._id !== account._id
                      }
                    >
                      Upload
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Hidden ZIP input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept=".zip"
        onChange={handleZipChange}
      />
    </>
  );
};

export default AccountTable;


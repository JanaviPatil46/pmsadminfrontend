// // import React from "react";
// // import {
// //   Box,
// //   Typography,
// //   Button,
// //   IconButton,
// //   Divider,
// //   TextField,
// //   InputAdornment,
// // } from "@mui/material";
// // import { LuPlusCircle, LuPenLine } from "react-icons/lu";
// // import { RiDeleteBin6Line } from "react-icons/ri";
// // import { RxDragHandleDots2 } from "react-icons/rx";

// // const StagesSection = ({
// //   stages,
// //   stageNameErrors,
// //   handleAddStage,
// //   handleDeleteStage,
// //   handleStageNameChange,
// // }) => {
// //   return (
// //     <Box>
// //       {/* Header */}
// //       <Box
// //         display="flex"
// //         justifyContent="space-between"
// //         alignItems="center"
// //         mb={3}
// //       >
// //         <Typography variant="h6">Stages</Typography>

// //         <Button
// //           variant="contained"
// //           startIcon={<LuPlusCircle />}
// //           onClick={() => handleAddStage(stages.length)}
// //           sx={{
// //             backgroundColor: "var(--color-save-btn)",
// //             "&:hover": {
// //               backgroundColor: "var(--color-save-hover-btn)",
// //             },
// //             borderRadius: "15px",
// //           }}
// //         >
// //           Add stage
// //         </Button>
// //       </Box>

// //       {/* Scroll Area */}
// //       <Box
// //         sx={{
// //           display: "flex",
// //           gap: "25px",
// //           flexDirection: { xs: "column", sm: "row" },
// //           marginBottom: "10px",
// //         }}
// //       >
// //         <Box
// //           className="stage-scroll"
// //           sx={{
// //             display: "flex",
// //             gap: "15px",
// //             overflowX: "auto",
// //             whiteSpace: "nowrap",
// //             paddingBottom: "8px",
// //             maxWidth: "100%",
// //             minHeight: "300px",
// //             maxHeight: "500px",
// //           }}
// //         >
// //           {stages.map((stage, index) => (
// //             <React.Fragment key={index}>
// //               {/* Stage Card */}
// //               <Box
// //                 sx={{
// //                   minWidth: "250px",
// //                   maxWidth: "270px",
// //                   padding: "20px",
// //                   backgroundColor: "#F5F5F7",
// //                   borderRadius: "12px",
// //                   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
// //                   flexShrink: 0,
// //                 }}
// //               >
// //                 <Box>
// //                   {/* Header With Edit/Delete */}
// //                   <Box
// //                     sx={{
// //                       display: "flex",
// //                       alignItems: "center",
// //                       gap: "10px",
// //                       marginBottom: "10px",
// //                     }}
// //                   >
// //                     <RxDragHandleDots2 />

// //                     <TextField
// //                       variant="standard"
// //                       placeholder="Stage Name"
// //                       fullWidth
// //                       size="small"
// //                       value={stage.name}
// //                       onChange={(e) => handleStageNameChange(e, index)}
// //                       error={!!stageNameErrors[index]}
// //                       helperText={stageNameErrors[index]}
// //                       InputProps={{
// //                         endAdornment: (
// //                           <InputAdornment position="end">
// //                             <LuPenLine style={{ fontSize: "12px" }} />
// //                           </InputAdornment>
// //                         ),
// //                       }}
// //                     />

// //                     <IconButton
// //                       onClick={() => handleDeleteStage(index)}
// //                       sx={{ color: "red" }}
// //                     >
// //                       <RiDeleteBin6Line />
// //                     </IconButton>
// //                   </Box>

// //                   <Divider />

// //                   {/* Content */}
// //                   <Box sx={{ mt: 2 }}>
// //                     <Typography variant="subtitle2" fontWeight="bold">
// //                       Stage conditions
// //                     </Typography>
// //                     <Typography variant="body2" color="text.secondary">
// //                       {index === 0
// //                         ? "First stage can't have conditions"
// //                         : index === stages.length - 1
// //                         ? "Last stage can't have conditions"
// //                         : "Job enters this stage if conditions are met"}
// //                     </Typography>

// //                     <Typography
// //                       variant="subtitle2"
// //                       fontWeight="bold"
// //                       sx={{ mt: 2 }}
// //                     >
// //                       Automations
// //                     </Typography>
// //                     <Typography variant="body2" color="text.secondary">
// //                       Triggered when job enters stage
// //                     </Typography>
// //                   </Box>
// //                 </Box>
// //               </Box>

// //               {/* Plus Icon Between Stages */}
// //               {index < stages.length - 1 && (
// //                 <IconButton onClick={() => handleAddStage(index + 1)}>
// //                   <LuPlusCircle
// //                     style={{
// //                       color: "var(--color-save-btn)",
// //                       width: "25px",
// //                       height: "25px",
// //                     }}
// //                   />
// //                 </IconButton>
// //               )}
// //             </React.Fragment>
// //           ))}
// //         </Box>
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default StagesSection;

// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   IconButton,
//   Divider,
//   TextField,
//   InputAdornment,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import { LuPlusCircle, LuPenLine } from "react-icons/lu";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { RxDragHandleDots2 } from "react-icons/rx";

// const StagesSection = ({
//   stages,
//   stageNameErrors,
//   handleAddStage,
//   handleDeleteStage,
//   handleStageNameChange,
// //   handleAddAutomation, // Add this prop to handle automation addition
// }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [stageSelected, setStageSelected] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [automationSelect, SetAutomationSelect] = useState();
 
//   const handleAutomationMenuOpen = (event, stageIndex) => {
//     setAnchorEl(event.currentTarget);
//     setStageSelected(stageIndex);
//   };

//   const handleAutomationMenuClose = () => {
//     setAnchorEl(null);
//     setStageSelected(null);
//   };


//   const handleAutomationSelect = (automationType) => {
//     if (stageSelected !== null) {
//       handleAddAutomation(stageSelected, automationType);
//     }
//     handleAutomationMenuClose();
//   };
//  const handleAddAutomation = (stageSelected, option) => {
//     // Handle option action here
//     console.log("Adding automation to stage index:", stageSelected);
//     console.log("automation  clicked!");

//     console.log("Added automation to stage", stageSelected, option);
//     handleDrawerOpen(option, stageSelected);
//     handleAutomationMenuClose();
//   };
//    const handleDrawerOpen = (option, index) => {
//     setIsDrawerOpen(true);
//     SetAutomationSelect(option);
//     setStageSelected(index);
//     console.log(index);
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h6">Stages</Typography>

//         <Button
//           variant="contained"
//           startIcon={<LuPlusCircle />}
//           onClick={() => handleAddStage(stages.length)}
//           sx={{
//             backgroundColor: "var(--color-save-btn)",
//             "&:hover": {
//               backgroundColor: "var(--color-save-hover-btn)",
//             },
//             borderRadius: "15px",
//           }}
//         >
//           Add stage
//         </Button>
//       </Box>

//       {/* Scroll Area */}
//       <Box
//         sx={{
//           display: "flex",
//           gap: "25px",
//           flexDirection: { xs: "column", sm: "row" },
//           marginBottom: "10px",
//         }}
//       >
//         <Box
//           className="stage-scroll"
//           sx={{
//             display: "flex",
//             gap: "15px",
//             overflowX: "auto",
//             whiteSpace: "nowrap",
//             paddingBottom: "8px",
//             maxWidth: "100%",
//             minHeight: "300px",
//             maxHeight: "500px",
//           }}
//         >
//           {stages.map((stage, index) => (
//             <React.Fragment key={index}>
//               {/* Stage Card */}
//               <Box
//                 sx={{
//                   minWidth: "250px",
//                   maxWidth: "270px",
//                   padding: "20px",
//                   backgroundColor: "#F5F5F7",
//                   borderRadius: "12px",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                   flexShrink: 0,
//                 }}
//               >
//                 <Box>
//                   {/* Header With Edit/Delete */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <RxDragHandleDots2 />

//                     <TextField
//                       variant="standard"
//                       placeholder="Stage Name"
//                       fullWidth
//                       size="small"
//                       value={stage.name}
//                       onChange={(e) => handleStageNameChange(e, index)}
//                       error={!!stageNameErrors[index]}
//                       helperText={stageNameErrors[index]}
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <LuPenLine style={{ fontSize: "12px" }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     <IconButton
//                       onClick={() => handleDeleteStage(index)}
//                       sx={{ color: "red" }}
//                     >
//                       <RiDeleteBin6Line />
//                     </IconButton>
//                   </Box>

//                   <Divider />

//                   {/* Content */}
//                   <Box sx={{ mt: 2 }}>
//                     <Typography variant="subtitle2" fontWeight="bold">
//                       Stage conditions
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {index === 0
//                         ? "First stage can't have conditions"
//                         : index === stages.length - 1
//                         ? "Last stage can't have conditions"
//                         : "Job enters this stage if conditions are met"}
//                     </Typography>

//                     <Typography
//                       variant="subtitle2"
//                       fontWeight="bold"
//                       sx={{ mt: 2 }}
//                     >
//                       Automations
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Triggered when job enters stage
//                     </Typography>

//                     {/* Add Automation Button */}
//                     <Button
//                       variant="outlined"
//                       startIcon={<LuPlusCircle />}
//                       fullWidth
//                       sx={{ mt: 1, borderRadius: "8px" }}
//                       onClick={(event) => handleAutomationMenuOpen(event, index)}
//                     >
//                       Add Automation
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>

//               {/* Plus Icon Between Stages */}
//               {index < stages.length - 1 && (
//                 <IconButton onClick={() => handleAddStage(index + 1)}>
//                   <LuPlusCircle
//                     style={{
//                       color: "var(--color-save-btn)",
//                       width: "25px",
//                       height: "25px",
//                     }}
//                   />
//                 </IconButton>
//               )}
//             </React.Fragment>
//           ))}
//         </Box>
//       </Box>

//       {/* Automation Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleAutomationMenuClose}
//         PaperProps={{
//           style: {
//             maxHeight: 200,
//             overflowY: "auto",
//           },
//         }}
//       >
//         <MenuItem onClick={() => handleAutomationSelect("Send Email")}>
//           Send Email
//         </MenuItem>
//         <MenuItem onClick={() => handleAutomationSelect("Send Invoice")}>
//           Send Invoice
//         </MenuItem>
//         <MenuItem onClick={() => handleAutomationSelect("Send Proposal/Els")}>
//           Send Proposal/Els
//         </MenuItem>
//         <MenuItem onClick={() => handleAutomationSelect("Create Organizer")}>
//           Create Organizer
//         </MenuItem>
//         <MenuItem onClick={() => handleAutomationSelect("Apply folder template")}>
//           Apply folder template
//         </MenuItem>
//         <MenuItem onClick={() => handleAutomationSelect("Update account tags")}>
//           Update account tags
//         </MenuItem>
//         <MenuItem onClick={() => handleAutomationSelect("Update job assignees")}>
//           Update job assignees
//         </MenuItem>
//         <MenuItem onClick={() => handleAutomationSelect("Create Task")}>
//           Create Task
//         </MenuItem>
//         <MenuItem onClick={() => handleAutomationSelect("Send message")}>
//           Send message
//         </MenuItem>
//         <MenuItem onClick={() => handleAutomationSelect("Update client-facing job status")}>
//           Update client-facing job status
//         </MenuItem>
//       </Menu>
//     </Box>
//   );
// };

// export default StagesSection;

import React, { useState ,useEffect} from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Drawer,
  Grid,Chip,Autocomplete,Checkbox
} from "@mui/material";
import { LuPlusCircle, LuPenLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2, RxDragHandleDots2 } from "react-icons/rx";
import {IoMdArrowRoundBack} from "react-icons/io";
import  {AiOutlineSearch} from "react-icons/ai";
// const StagesSection = ({
//   stages,
//   stageNameErrors,
//   handleAddStage,
//   handleDeleteStage,
//   handleStageNameChange,
// }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [stageSelected, setStageSelected] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [automationSelect, setAutomationSelect] = useState();

//   const handleAutomationMenuOpen = (event, stageIndex) => {
//     setAnchorEl(event.currentTarget);
//     setStageSelected(stageIndex);
//   };

//   const handleAutomationMenuClose = () => {
//     setAnchorEl(null);
//     setStageSelected(null);
//   };

//   const handleAddAutomation = (stageSelected, option) => {
//     console.log("Adding automation to stage index:", stageSelected);
//     console.log("Automation clicked:", option);
//     handleDrawerOpen(option, stageSelected);
//     handleAutomationMenuClose();
//   };

//   const handleDrawerOpen = (option, index) => {
//     setIsDrawerOpen(true);
//     setAutomationSelect(option);
//     setStageSelected(index);
//     console.log("Opening drawer for stage:", index, "with option:", option);
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//     setAutomationSelect(null);
//     setStageSelected(null);
//   };

//   // Placeholder functions - you'll need to implement these based on your logic
//   const handleSaveAutomation = (stageIndex) => () => {
//     console.log("Saving automation for stage:", stageIndex);
//     // Implement your save logic here
//   };

//   const handleAddConditions = () => {
//     console.log("Add conditions clicked");
//     // Implement your conditions logic here
//   };

//   // Simplified renderActionContent for demonstration
//   // You'll need to import all the required components and state variables
//   const renderActionContent = (automationSelect, index) => {
//     switch (automationSelect) {
//       case "Create Task":
//         return (
//           <Box>
//             <Typography variant="h6">Create Task Automation</Typography>
//             <Typography>Stage: {index}</Typography>
//             <Button 
//               variant="contained" 
//               onClick={handleSaveAutomation(index)}
//               sx={{ mt: 2 }}
//             >
//               Save Task Automation
//             </Button>
//           </Box>
//         );
//       case "Send Email":
//         return (
//           <Box>
//             <Typography variant="h6">Send Email Automation</Typography>
//             <Typography>Stage: {index}</Typography>
//             <Button 
//               variant="contained" 
//               onClick={handleSaveAutomation(index)}
//               sx={{ mt: 2 }}
//             >
//               Save Email Automation
//             </Button>
//           </Box>
//         );
//       // Add other cases as needed
//       default:
//         return (
//           <Box>
//             <Typography variant="h6">{automationSelect} Automation</Typography>
//             <Typography>Stage: {index}</Typography>
//             <Button 
//               variant="contained" 
//               onClick={handleSaveAutomation(index)}
//               sx={{ mt: 2 }}
//             >
//               Save {automationSelect} Automation
//             </Button>
//           </Box>
//         );
//     }
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h6">Stages</Typography>

//         <Button
//           variant="contained"
//           startIcon={<LuPlusCircle />}
//           onClick={() => handleAddStage(stages.length)}
//           sx={{
//             backgroundColor: "var(--color-save-btn)",
//             "&:hover": {
//               backgroundColor: "var(--color-save-hover-btn)",
//             },
//             borderRadius: "15px",
//           }}
//         >
//           Add stage
//         </Button>
//       </Box>

//       {/* Scroll Area */}
//       <Box
//         sx={{
//           display: "flex",
//           gap: "25px",
//           flexDirection: { xs: "column", sm: "row" },
//           marginBottom: "10px",
//         }}
//       >
//         <Box
//           className="stage-scroll"
//           sx={{
//             display: "flex",
//             gap: "15px",
//             overflowX: "auto",
//             whiteSpace: "nowrap",
//             paddingBottom: "8px",
//             maxWidth: "100%",
//             minHeight: "300px",
//             maxHeight: "500px",
//           }}
//         >
//           {stages.map((stage, index) => (
//             <React.Fragment key={index}>
//               {/* Stage Card */}
//               <Box
//                 sx={{
//                   minWidth: "250px",
//                   maxWidth: "270px",
//                   padding: "20px",
//                   backgroundColor: "#F5F5F7",
//                   borderRadius: "12px",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                   flexShrink: 0,
//                 }}
//               >
//                 <Box>
//                   {/* Header With Edit/Delete */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <RxDragHandleDots2 />

//                     <TextField
//                       variant="standard"
//                       placeholder="Stage Name"
//                       fullWidth
//                       size="small"
//                       value={stage.name}
//                       onChange={(e) => handleStageNameChange(e, index)}
//                       error={!!stageNameErrors[index]}
//                       helperText={stageNameErrors[index]}
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <LuPenLine style={{ fontSize: "12px" }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     <IconButton
//                       onClick={() => handleDeleteStage(index)}
//                       sx={{ color: "red" }}
//                     >
//                       <RiDeleteBin6Line />
//                     </IconButton>
//                   </Box>

//                   <Divider />

//                   {/* Content */}
//                   <Box sx={{ mt: 2 }}>
//                     <Typography variant="subtitle2" fontWeight="bold">
//                       Stage conditions
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {index === 0
//                         ? "First stage can't have conditions"
//                         : index === stages.length - 1
//                         ? "Last stage can't have conditions"
//                         : "Job enters this stage if conditions are met"}
//                     </Typography>

//                     <Typography
//                       variant="subtitle2"
//                       fontWeight="bold"
//                       sx={{ mt: 2 }}
//                     >
//                       Automations
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Triggered when job enters stage
//                     </Typography>

//                     {/* Add Automation Button */}
//                     <Button
//                       variant="outlined"
//                       startIcon={<LuPlusCircle />}
//                       fullWidth
//                       sx={{ mt: 1, borderRadius: "8px" }}
//                       onClick={(event) => handleAutomationMenuOpen(event, index)}
//                     >
//                       Add Automation
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>

//               {/* Plus Icon Between Stages */}
//               {index < stages.length - 1 && (
//                 <IconButton onClick={() => handleAddStage(index + 1)}>
//                   <LuPlusCircle
//                     style={{
//                       color: "var(--color-save-btn)",
//                       width: "25px",
//                       height: "25px",
//                     }}
//                   />
//                 </IconButton>
//               )}
//             </React.Fragment>
//           ))}
//         </Box>
//       </Box>

//       {/* Automation Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleAutomationMenuClose}
//         PaperProps={{
//           style: {
//             maxHeight: 200,
//             overflowY: "auto",
//           },
//         }}
//       >
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Email")}>
//           Send Email
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Invoice")}>
//           Send Invoice
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Proposal/Els")}>
//           Send Proposal/Els
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Organizer")}>
//           Create Organizer
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Apply folder template")}>
//           Apply folder template
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update account tags")}>
//           Update account tags
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update job assignees")}>
//           Update job assignees
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Task")}>
//           Create Task
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send message")}>
//           Send message
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update client-facing job status")}>
//           Update client-facing job status
//         </MenuItem>
//       </Menu>

//       {/* Automation Drawer */}
//       <Drawer
//         anchor="right"
//         open={isDrawerOpen}
//         onClose={handleDrawerClose}
//         PaperProps={{ 
//           sx: { 
//             width: { xs: "100%", sm: "600px", md: "700px" },
//             padding: 2
//           } 
//         }}
//       >
//         <Box sx={{ padding: 2 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//             <Typography variant="h5">
//               Add Automation - {automationSelect}
//             </Typography>
//             <IconButton onClick={handleDrawerClose}>
//               <RiDeleteBin6Line />
//             </IconButton>
//           </Box>
          
//           {automationSelect && stageSelected !== null && (
//             renderActionContent(automationSelect, stageSelected)
//           )}
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };
// const StagesSection = ({
//   stages,
//   stageNameErrors,
//   handleAddStage,
//   handleDeleteStage,
//   handleStageNameChange,
// }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [stageSelected, setStageSelected] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [automationSelect, setAutomationSelect] = useState();
//   const [drawerAutomations, setDrawerAutomations] = useState([]); // Track multiple automations in drawer
//   const [drawerAnchorEl, setDrawerAnchorEl] = useState(null); // Anchor for drawer menu

//   const handleAutomationMenuOpen = (event, stageIndex) => {
//     setAnchorEl(event.currentTarget);
//     setStageSelected(stageIndex);
//   };

//   const handleAutomationMenuClose = () => {
//     setAnchorEl(null);
//     setStageSelected(null);
//   };

//   const handleAddAutomation = (stageSelected, option) => {
//     console.log("Adding automation to stage index:", stageSelected);
//     console.log("Automation clicked:", option);
    
//     // Initialize drawer with the first automation
//     setDrawerAutomations([{ type: option, index: 1 }]);
//     handleDrawerOpen(option, stageSelected);
//     handleAutomationMenuClose();
//   };

//   const handleDrawerOpen = (option, index) => {
//     setIsDrawerOpen(true);
//     setAutomationSelect(option);
//     setStageSelected(index);
//     console.log("Opening drawer for stage:", index, "with option:", option);
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//     setAutomationSelect(null);
//     setStageSelected(null);
//     setDrawerAutomations([]); // Clear automations when drawer closes
//   };

//   // Drawer menu handlers
//   const handleDrawerMenuOpen = (event) => {
//     setDrawerAnchorEl(event.currentTarget);
//   };

//   const handleDrawerMenuClose = () => {
//     setDrawerAnchorEl(null);
//   };

//   const handleDrawerMenuItemSelect = (option) => {
//     const newIndex = drawerAutomations.length + 1;
//     setDrawerAutomations(prev => [...prev, { type: option, index: newIndex }]);
//     handleDrawerMenuClose();
//   };

//   // Placeholder functions - you'll need to implement these based on your logic
//   const handleSaveAutomation = (stageIndex) => () => {
//     console.log("Saving automation for stage:", stageIndex);
//     console.log("Automations to save:", drawerAutomations);
//     // Implement your save logic here
//   };

//   const handleAddConditions = () => {
//     console.log("Add conditions clicked");
//     // Implement your conditions logic here
//   };

//   // Simplified renderActionContent for demonstration
//   // You'll need to import all the required components and state variables
//   const renderActionContent = (automationSelect, index) => {
//     switch (automationSelect) {
//       case "Create Task":
//         return (
//           <Box>
//             <Typography variant="h6">Create Task Automation</Typography>
//             <Typography>Stage: {index}</Typography>
//             <Button 
//               variant="contained" 
//               onClick={handleSaveAutomation(index)}
//               sx={{ mt: 2 }}
//             >
//               Save Task Automation
//             </Button>
//           </Box>
//         );
//       case "Send Email":
//         return (
//           <Box>
//             <Typography variant="h6">Send Email Automation</Typography>
//             <Typography>Stage: {index}</Typography>
//             <Button 
//               variant="contained" 
//               onClick={handleSaveAutomation(index)}
//               sx={{ mt: 2 }}
//             >
//               Save Email Automation
//             </Button>
//           </Box>
//         );
//       // Add other cases as needed
//       default:
//         return (
//           <Box>
//             <Typography variant="h6">{automationSelect} Automation</Typography>
//             <Typography>Stage: {index}</Typography>
//             <Button 
//               variant="contained" 
//               onClick={handleSaveAutomation(index)}
//               sx={{ mt: 2 }}
//             >
//               Save {automationSelect} Automation
//             </Button>
//           </Box>
//         );
//     }
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h6">Stages</Typography>

//         <Button
//           variant="contained"
//           startIcon={<LuPlusCircle />}
//           onClick={() => handleAddStage(stages.length)}
//           sx={{
//             backgroundColor: "var(--color-save-btn)",
//             "&:hover": {
//               backgroundColor: "var(--color-save-hover-btn)",
//             },
//             borderRadius: "15px",
//           }}
//         >
//           Add stage
//         </Button>
//       </Box>

//       {/* Scroll Area */}
//       <Box
//         sx={{
//           display: "flex",
//           gap: "25px",
//           flexDirection: { xs: "column", sm: "row" },
//           marginBottom: "10px",
//         }}
//       >
//         <Box
//           className="stage-scroll"
//           sx={{
//             display: "flex",
//             gap: "15px",
//             overflowX: "auto",
//             whiteSpace: "nowrap",
//             paddingBottom: "8px",
//             maxWidth: "100%",
//             minHeight: "300px",
//             maxHeight: "500px",
//           }}
//         >
//           {stages.map((stage, index) => (
//             <React.Fragment key={index}>
//               {/* Stage Card */}
//               <Box
//                 sx={{
//                   minWidth: "250px",
//                   maxWidth: "270px",
//                   padding: "20px",
//                   backgroundColor: "#F5F5F7",
//                   borderRadius: "12px",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                   flexShrink: 0,
//                 }}
//               >
//                 <Box>
//                   {/* Header With Edit/Delete */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <RxDragHandleDots2 />

//                     <TextField
//                       variant="standard"
//                       placeholder="Stage Name"
//                       fullWidth
//                       size="small"
//                       value={stage.name}
//                       onChange={(e) => handleStageNameChange(e, index)}
//                       error={!!stageNameErrors[index]}
//                       helperText={stageNameErrors[index]}
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <LuPenLine style={{ fontSize: "12px" }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     <IconButton
//                       onClick={() => handleDeleteStage(index)}
//                       sx={{ color: "red" }}
//                     >
//                       <RiDeleteBin6Line />
//                     </IconButton>
//                   </Box>

//                   <Divider />

//                   {/* Content */}
//                   <Box sx={{ mt: 2 }}>
//                     <Typography variant="subtitle2" fontWeight="bold">
//                       Stage conditions
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {index === 0
//                         ? "First stage can't have conditions"
//                         : index === stages.length - 1
//                         ? "Last stage can't have conditions"
//                         : "Job enters this stage if conditions are met"}
//                     </Typography>

//                     <Typography
//                       variant="subtitle2"
//                       fontWeight="bold"
//                       sx={{ mt: 2 }}
//                     >
//                       Automations
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Triggered when job enters stage
//                     </Typography>

//                     {/* Add Automation Button */}
//                     <Button
//                       variant="outlined"
//                       startIcon={<LuPlusCircle />}
//                       fullWidth
//                       sx={{ mt: 1, borderRadius: "8px" }}
//                       onClick={(event) => handleAutomationMenuOpen(event, index)}
//                     >
//                       Add Automation
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>

//               {/* Plus Icon Between Stages */}
//               {index < stages.length - 1 && (
//                 <IconButton onClick={() => handleAddStage(index + 1)}>
//                   <LuPlusCircle
//                     style={{
//                       color: "var(--color-save-btn)",
//                       width: "25px",
//                       height: "25px",
//                     }}
//                   />
//                 </IconButton>
//               )}
//             </React.Fragment>
//           ))}
//         </Box>
//       </Box>

//       {/* Automation Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleAutomationMenuClose}
//         PaperProps={{
//           style: {
//             maxHeight: 200,
//             overflowY: "auto",
//           },
//         }}
//       >
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Email")}>
//           Send Email
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Invoice")}>
//           Send Invoice
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Proposal/Els")}>
//           Send Proposal/Els
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Organizer")}>
//           Create Organizer
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Apply folder template")}>
//           Apply folder template
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update account tags")}>
//           Update account tags
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update job assignees")}>
//           Update job assignees
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Task")}>
//           Create Task
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send message")}>
//           Send message
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update client-facing job status")}>
//           Update client-facing job status
//         </MenuItem>
//       </Menu>

//       {/* Automation Drawer */}
//       <Drawer
//         anchor="right"
//         open={isDrawerOpen}
//         onClose={handleDrawerClose}
//         PaperProps={{ 
//           sx: { 
//             width: { xs: "100%", sm: "600px", md: "700px" },
//             padding: 2
//           } 
//         }}
//       >
//         <Box sx={{ padding: 2 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//             <Typography variant="h5">
//               Add Automation - {automationSelect}
//             </Typography>
//             <IconButton onClick={handleDrawerClose}>
//               <RxCross2 />
//             </IconButton>
//           </Box>
          
//           {/* Display all automations in this drawer with indexing */}
//           {drawerAutomations.map((automation, idx) => (
//             <Box key={idx} sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: "8px" }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 Automation {automation.index}: {automation.type}
//               </Typography>
//               {renderActionContent(automation.type, stageSelected)}
//             </Box>
//           ))}
          
//           {/* Add Another Automation Button */}
//           <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
//             <Button
//               variant="outlined"
//               startIcon={<LuPlusCircle />}
//               onClick={handleDrawerMenuOpen}
//               sx={{ borderRadius: "8px" }}
//             >
//               Add Another Automation
//             </Button>
//           </Box>

//           {/* Drawer Menu for Adding More Automations */}
//           <Menu
//             anchorEl={drawerAnchorEl}
//             open={Boolean(drawerAnchorEl)}
//             onClose={handleDrawerMenuClose}
//             PaperProps={{
//               style: {
//                 maxHeight: 200,
//                 overflowY: "auto",
//               },
//             }}
//           >
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Email")}>
//               Send Email
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Invoice")}>
//               Send Invoice
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Proposal/Els")}>
//               Send Proposal/Els
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Organizer")}>
//               Create Organizer
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Apply folder template")}>
//               Apply folder template
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update account tags")}>
//               Update account tags
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update job assignees")}>
//               Update job assignees
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Task")}>
//               Create Task
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send message")}>
//               Send message
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update client-facing job status")}>
//               Update client-facing job status
//             </MenuItem>
//           </Menu>
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };
// const StagesSection = ({
//   stages,
//   stageNameErrors,
//   handleAddStage,
//   handleDeleteStage,
//   handleStageNameChange,
// }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [stageSelected, setStageSelected] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [automationSelect, setAutomationSelect] = useState();
//   const [drawerAutomations, setDrawerAutomations] = useState([]); // Track multiple automations in drawer
//   const [drawerAnchorEl, setDrawerAnchorEl] = useState(null); // Anchor for drawer menu

//   const handleAutomationMenuOpen = (event, stageIndex) => {
//     setAnchorEl(event.currentTarget);
//     setStageSelected(stageIndex);
//   };

//   const handleAutomationMenuClose = () => {
//     setAnchorEl(null);
//     setStageSelected(null);
//   };

//   const handleAddAutomation = (stageSelected, option) => {
//     console.log("Adding automation to stage index:", stageSelected);
//     console.log("Automation clicked:", option);
    
//     // Initialize drawer with the first automation
//     setDrawerAutomations([{ type: option, index: 1 }]);
//     handleDrawerOpen(option, stageSelected);
//     handleAutomationMenuClose();
//   };

//   const handleDrawerOpen = (option, index) => {
//     setIsDrawerOpen(true);
//     setAutomationSelect(option);
//     setStageSelected(index);
//     console.log("Opening drawer for stage:", index, "with option:", option);
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//     setAutomationSelect(null);
//     setStageSelected(null);
//     setDrawerAutomations([]); // Clear automations when drawer closes
//   };

//   // Drawer menu handlers
//   const handleDrawerMenuOpen = (event) => {
//     setDrawerAnchorEl(event.currentTarget);
//   };

//   const handleDrawerMenuClose = () => {
//     setDrawerAnchorEl(null);
//   };

//   const handleDrawerMenuItemSelect = (option) => {
//     const newIndex = drawerAutomations.length + 1;
//     setDrawerAutomations(prev => [...prev, { type: option, index: newIndex }]);
//     handleDrawerMenuClose();
//   };

//   // Delete automation from drawer
//   const handleDeleteAutomation = (automationIndex) => {
//     setDrawerAutomations(prev => {
//       // Remove the automation at the specified index
//       const updatedAutomations = prev.filter((_, idx) => idx !== automationIndex);
      
//       // Re-index the remaining automations
//       return updatedAutomations.map((automation, idx) => ({
//         ...automation,
//         index: idx + 1
//       }));
//     });
//   };

//   // Placeholder functions - you'll need to implement these based on your logic
//   const handleSaveAutomation = (stageIndex) => () => {
//     console.log("Saving automation for stage:", stageIndex);
//     console.log("Automations to save:", drawerAutomations);
//     // Implement your save logic here
//   };

//   const handleAddConditions = () => {
//     console.log("Add conditions clicked");
//     // Implement your conditions logic here
//   };

//   // Simplified renderActionContent for demonstration
//   // You'll need to import all the required components and state variables
//   const renderActionContent = (automationSelect, index) => {
//     switch (automationSelect) {
//       case "Create Task":
//         return (
//           <Box>
//             <Typography variant="h6">Create Task Automation</Typography>
//             <Typography>Stage: {index}</Typography>
//             <Button 
//               variant="contained" 
//               onClick={handleSaveAutomation(index)}
//               sx={{ mt: 2 }}
//             >
//               Save Task Automation
//             </Button>
//           </Box>
//         );
//       case "Send Email":
//         return (
//           <Box>
//             <Typography variant="h6">Send Email Automation</Typography>
//             <Typography>Stage: {index}</Typography>
//             <Button 
//               variant="contained" 
//               onClick={handleSaveAutomation(index)}
//               sx={{ mt: 2 }}
//             >
//               Save Email Automation
//             </Button>
//           </Box>
//         );
//       // Add other cases as needed
//       default:
//         return (
//           <Box>
//             <Typography variant="h6">{automationSelect} Automation</Typography>
//             <Typography>Stage: {index}</Typography>
//             <Button 
//               variant="contained" 
//               onClick={handleSaveAutomation(index)}
//               sx={{ mt: 2 }}
//             >
//               Save {automationSelect} Automation
//             </Button>
//           </Box>
//         );
//     }
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h6">Stages</Typography>

//         <Button
//           variant="contained"
//           startIcon={<LuPlusCircle />}
//           onClick={() => handleAddStage(stages.length)}
//           sx={{
//             backgroundColor: "var(--color-save-btn)",
//             "&:hover": {
//               backgroundColor: "var(--color-save-hover-btn)",
//             },
//             borderRadius: "15px",
//           }}
//         >
//           Add stage
//         </Button>
//       </Box>

//       {/* Scroll Area */}
//       <Box
//         sx={{
//           display: "flex",
//           gap: "25px",
//           flexDirection: { xs: "column", sm: "row" },
//           marginBottom: "10px",
//         }}
//       >
//         <Box
//           className="stage-scroll"
//           sx={{
//             display: "flex",
//             gap: "15px",
//             overflowX: "auto",
//             whiteSpace: "nowrap",
//             paddingBottom: "8px",
//             maxWidth: "100%",
//             minHeight: "300px",
//             maxHeight: "500px",
//           }}
//         >
//           {stages.map((stage, index) => (
//             <React.Fragment key={index}>
//               {/* Stage Card */}
//               <Box
//                 sx={{
//                   minWidth: "250px",
//                   maxWidth: "270px",
//                   padding: "20px",
//                   backgroundColor: "#F5F5F7",
//                   borderRadius: "12px",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                   flexShrink: 0,
//                 }}
//               >
//                 <Box>
//                   {/* Header With Edit/Delete */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <RxDragHandleDots2 />

//                     <TextField
//                       variant="standard"
//                       placeholder="Stage Name"
//                       fullWidth
//                       size="small"
//                       value={stage.name}
//                       onChange={(e) => handleStageNameChange(e, index)}
//                       error={!!stageNameErrors[index]}
//                       helperText={stageNameErrors[index]}
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <LuPenLine style={{ fontSize: "12px" }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     <IconButton
//                       onClick={() => handleDeleteStage(index)}
//                       sx={{ color: "red" }}
//                     >
//                       <RiDeleteBin6Line />
//                     </IconButton>
//                   </Box>

//                   <Divider />

//                   {/* Content */}
//                   <Box sx={{ mt: 2 }}>
//                     <Typography variant="subtitle2" fontWeight="bold">
//                       Stage conditions
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {index === 0
//                         ? "First stage can't have conditions"
//                         : index === stages.length - 1
//                         ? "Last stage can't have conditions"
//                         : "Job enters this stage if conditions are met"}
//                     </Typography>

//                     <Typography
//                       variant="subtitle2"
//                       fontWeight="bold"
//                       sx={{ mt: 2 }}
//                     >
//                       Automations
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Triggered when job enters stage
//                     </Typography>

//                     {/* Add Automation Button */}
//                     <Button
//                       variant="outlined"
//                       startIcon={<LuPlusCircle />}
//                       fullWidth
//                       sx={{ mt: 1, borderRadius: "8px" }}
//                       onClick={(event) => handleAutomationMenuOpen(event, index)}
//                     >
//                       Add Automation
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>

//               {/* Plus Icon Between Stages */}
//               {index < stages.length - 1 && (
//                 <IconButton onClick={() => handleAddStage(index + 1)}>
//                   <LuPlusCircle
//                     style={{
//                       color: "var(--color-save-btn)",
//                       width: "25px",
//                       height: "25px",
//                     }}
//                   />
//                 </IconButton>
//               )}
//             </React.Fragment>
//           ))}
//         </Box>
//       </Box>

//       {/* Automation Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleAutomationMenuClose}
//         PaperProps={{
//           style: {
//             maxHeight: 200,
//             overflowY: "auto",
//           },
//         }}
//       >
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Email")}>
//           Send Email
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Invoice")}>
//           Send Invoice
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Proposal/Els")}>
//           Send Proposal/Els
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Organizer")}>
//           Create Organizer
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Apply folder template")}>
//           Apply folder template
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update account tags")}>
//           Update account tags
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update job assignees")}>
//           Update job assignees
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Task")}>
//           Create Task
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send message")}>
//           Send message
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update client-facing job status")}>
//           Update client-facing job status
//         </MenuItem>
//       </Menu>

//       {/* Automation Drawer */}
//       <Drawer
//         anchor="right"
//         open={isDrawerOpen}
//         onClose={handleDrawerClose}
//         PaperProps={{ 
//           sx: { 
//             width: { xs: "100%", sm: "600px", md: "700px" },
//             padding: 2
//           } 
//         }}
//       >
//         <Box sx={{ padding: 2 }}>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//             <Typography variant="h5">
//               Add Automation - {automationSelect}
//             </Typography>
//             <IconButton onClick={handleDrawerClose}>
//               <RiDeleteBin6Line />
//             </IconButton>
//           </Box>
          
//           {/* Display all automations in this drawer with indexing */}
//           {drawerAutomations.map((automation, idx) => (
//             <Box 
//               key={idx} 
//               sx={{ 
//                 mb: 3, 
//                 p: 2, 
//                 border: "1px solid #e0e0e0", 
//                 borderRadius: "8px",
//                 position: "relative"
//               }}
//             >
//               {/* Delete Icon for each automation */}
//               <IconButton
//                 onClick={() => handleDeleteAutomation(idx)}
//                 sx={{ 
//                   position: "absolute", 
//                   top: 8, 
//                   right: 8,
//                   color: "red",
//                   backgroundColor: "rgba(255,255,255,0.8)",
//                   '&:hover': {
//                     backgroundColor: "rgba(255,0,0,0.1)"
//                   }
//                 }}
//                 size="small"
//               >
//                 <RiDeleteBin6Line />
//               </IconButton>
              
//               <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>
//                 Automation {automation.index}: {automation.type}
//               </Typography>
//               {renderActionContent(automation.type, stageSelected)}
//             </Box>
//           ))}
          
//           {/* Add Another Automation Button */}
//           <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
//             <Button
//               variant="outlined"
//               startIcon={<LuPlusCircle />}
//               onClick={handleDrawerMenuOpen}
//               sx={{ borderRadius: "8px" }}
//             >
//               Add Another Automation
//             </Button>
//           </Box>

//           {/* Drawer Menu for Adding More Automations */}
//           <Menu
//             anchorEl={drawerAnchorEl}
//             open={Boolean(drawerAnchorEl)}
//             onClose={handleDrawerMenuClose}
//             PaperProps={{
//               style: {
//                 maxHeight: 200,
//                 overflowY: "auto",
//               },
//             }}
//           >
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Email")}>
//               Send Email
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Invoice")}>
//               Send Invoice
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Proposal/Els")}>
//               Send Proposal/Els
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Organizer")}>
//               Create Organizer
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Apply folder template")}>
//               Apply folder template
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update account tags")}>
//               Update account tags
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update job assignees")}>
//               Update job assignees
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Task")}>
//               Create Task
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send message")}>
//               Send message
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update client-facing job status")}>
//               Update client-facing job status
//             </MenuItem>
//           </Menu>
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };

// const StagesSection = ({
//   stages,
//   stageNameErrors,
//   handleAddStage,
//   handleDeleteStage,
//   handleStageNameChange,
// }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [stageSelected, setStageSelected] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [automationSelect, setAutomationSelect] = useState();
//   const [drawerAutomations, setDrawerAutomations] = useState([]); // Track multiple automations in drawer
//   const [drawerAnchorEl, setDrawerAnchorEl] = useState(null); // Anchor for drawer menu

//   const handleAutomationMenuOpen = (event, stageIndex) => {
//     setAnchorEl(event.currentTarget);
//     setStageSelected(stageIndex);
//   };

//   const handleAutomationMenuClose = () => {
//     setAnchorEl(null);
//     setStageSelected(null);
//   };

//   const handleAddAutomation = (stageSelected, option) => {
//     console.log("Adding automation to stage index:", stageSelected);
//     console.log("Automation clicked:", option);
    
//     // Initialize drawer with the first automation
//     setDrawerAutomations([{ type: option, index: 1 }]);
//     handleDrawerOpen(option, stageSelected);
//     handleAutomationMenuClose();
//   };

//   const handleDrawerOpen = (option, index) => {
//     setIsDrawerOpen(true);
//     setAutomationSelect(option);
//     setStageSelected(index);
//     console.log("Opening drawer for stage:", index, "with option:", option);
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//     setAutomationSelect(null);
//     setStageSelected(null);
//     setDrawerAutomations([]); // Clear automations when drawer closes
//   };

//   // Drawer menu handlers
//   const handleDrawerMenuOpen = (event) => {
//     setDrawerAnchorEl(event.currentTarget);
//   };

//   const handleDrawerMenuClose = () => {
//     setDrawerAnchorEl(null);
//   };

//   const handleDrawerMenuItemSelect = (option) => {
//     const newIndex = drawerAutomations.length + 1;
//     setDrawerAutomations(prev => [...prev, { type: option, index: newIndex }]);
//     handleDrawerMenuClose();
//   };

//   // Delete automation from drawer
//   const handleDeleteAutomation = (automationIndex) => {
//     setDrawerAutomations(prev => {
//       // Remove the automation at the specified index
//       const updatedAutomations = prev.filter((_, idx) => idx !== automationIndex);
      
//       // Re-index the remaining automations
//       return updatedAutomations.map((automation, idx) => ({
//         ...automation,
//         index: idx + 1
//       }));
//     });
//   };

//   // Save all automations to the stage
//   const handleSaveAllAutomations = () => {
//     // if (stageSelected === null || drawerAutomations.length === 0) return;
    
//     console.log("Saving all automations to stage:", stageSelected);
//     console.log("Automations to save:", drawerAutomations);
    
//     // Here you would typically:
//     // 1. Save to your backend/state management
//     // 2. Update the stage with the new automations
//     // 3. Show success message
    
//     // Example implementation:
//     // updateStageAutomations(stageSelected, drawerAutomations);
    
//     // Show success feedback
//     alert(`Successfully saved ${drawerAutomations.length} automation(s) to stage ${stageSelected + 1}`);
    
//     // Close the drawer after saving
//     handleDrawerClose();
//   };

//   // Simplified renderActionContent for demonstration
//   const renderActionContent = (automationSelect, index) => {
//     switch (automationSelect) {
//       case "Create Task":
//         return (
//           <Box>
//             <Typography variant="h6">Create Task Automation</Typography>
//             <Typography>Configure your task automation settings here...</Typography>
//             {/* Add your task-specific form fields here */}
//           </Box>
//         );
//       case "Send Email":
//         return (
//           <Box>
//             <Typography variant="h6">Send Email Automation</Typography>
//             <Typography>Configure your email automation settings here...</Typography>
//             {/* Add your email-specific form fields here */}
//           </Box>
//         );
//       case "Send Invoice":
//         return (
//           <Box>
//             <Typography variant="h6">Send Invoice Automation</Typography>
//             <Typography>Configure your invoice automation settings here...</Typography>
//             {/* Add your invoice-specific form fields here */}
//           </Box>
//         );
//       // Add other cases as needed
//       default:
//         return (
//           <Box>
//             <Typography variant="h6">{automationSelect} Automation</Typography>
//             <Typography>Configure your {automationSelect.toLowerCase()} automation settings here...</Typography>
//             {/* Add generic form fields here */}
//           </Box>
//         );
//     }
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h6">Stages</Typography>

//         <Button
//           variant="contained"
//           startIcon={<LuPlusCircle />}
//           onClick={() => handleAddStage(stages.length)}
//           sx={{
//             backgroundColor: "var(--color-save-btn)",
//             "&:hover": {
//               backgroundColor: "var(--color-save-hover-btn)",
//             },
//             borderRadius: "15px",
//           }}
//         >
//           Add stage
//         </Button>
//       </Box>

//       {/* Scroll Area */}
//       <Box
//         sx={{
//           display: "flex",
//           gap: "25px",
//           flexDirection: { xs: "column", sm: "row" },
//           marginBottom: "10px",
//         }}
//       >
//         <Box
//           className="stage-scroll"
//           sx={{
//             display: "flex",
//             gap: "15px",
//             overflowX: "auto",
//             whiteSpace: "nowrap",
//             paddingBottom: "8px",
//             maxWidth: "100%",
//             minHeight: "300px",
//             maxHeight: "500px",
//           }}
//         >
//           {stages.map((stage, index) => (
//             <React.Fragment key={index}>
//               {/* Stage Card */}
//               <Box
//                 sx={{
//                   minWidth: "250px",
//                   maxWidth: "270px",
//                   padding: "20px",
//                   backgroundColor: "#F5F5F7",
//                   borderRadius: "12px",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                   flexShrink: 0,
//                 }}
//               >
//                 <Box>
//                   {/* Header With Edit/Delete */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <RxDragHandleDots2 />

//                     <TextField
//                       variant="standard"
//                       placeholder="Stage Name"
//                       fullWidth
//                       size="small"
//                       value={stage.name}
//                       onChange={(e) => handleStageNameChange(e, index)}
//                       error={!!stageNameErrors[index]}
//                       helperText={stageNameErrors[index]}
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <LuPenLine style={{ fontSize: "12px" }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     <IconButton
//                       onClick={() => handleDeleteStage(index)}
//                       sx={{ color: "red" }}
//                     >
//                       <RiDeleteBin6Line />
//                     </IconButton>
//                   </Box>

//                   <Divider />

//                   {/* Content */}
//                   <Box sx={{ mt: 2 }}>
//                     <Typography variant="subtitle2" fontWeight="bold">
//                       Stage conditions
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {index === 0
//                         ? "First stage can't have conditions"
//                         : index === stages.length - 1
//                         ? "Last stage can't have conditions"
//                         : "Job enters this stage if conditions are met"}
//                     </Typography>

//                     <Typography
//                       variant="subtitle2"
//                       fontWeight="bold"
//                       sx={{ mt: 2 }}
//                     >
//                       Automations
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Triggered when job enters stage
//                     </Typography>

//                     {/* Show existing automations if any */}
//                     {stage.automations && stage.automations.length > 0 && (
//                       <Box sx={{ mt: 1 }}>
//                         {stage.automations.map((auto, autoIndex) => (
//                           <Chip 
//                             key={autoIndex}
//                             label={`${auto.index}. ${auto.type}`}
//                             size="small"
//                             sx={{ mr: 0.5, mb: 0.5 }}
//                           />
//                         ))}
//                       </Box>
//                     )}

//                     {/* Add Automation Button */}
//                     <Button
//                       variant="outlined"
//                       startIcon={<LuPlusCircle />}
//                       fullWidth
//                       sx={{ mt: 1, borderRadius: "8px" }}
//                       onClick={(event) => handleAutomationMenuOpen(event, index)}
//                     >
//                       Add Automation
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>

//               {/* Plus Icon Between Stages */}
//               {index < stages.length - 1 && (
//                 <IconButton onClick={() => handleAddStage(index + 1)}>
//                   <LuPlusCircle
//                     style={{
//                       color: "var(--color-save-btn)",
//                       width: "25px",
//                       height: "25px",
//                     }}
//                   />
//                 </IconButton>
//               )}
//             </React.Fragment>
//           ))}
//         </Box>
//       </Box>

//       {/* Automation Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleAutomationMenuClose}
//         PaperProps={{
//           style: {
//             maxHeight: 200,
//             overflowY: "auto",
//           },
//         }}
//       >
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Email")}>
//           Send Email
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Invoice")}>
//           Send Invoice
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Proposal/Els")}>
//           Send Proposal/Els
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Organizer")}>
//           Create Organizer
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Apply folder template")}>
//           Apply folder template
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update account tags")}>
//           Update account tags
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update job assignees")}>
//           Update job assignees
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Task")}>
//           Create Task
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send message")}>
//           Send message
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update client-facing job status")}>
//           Update client-facing job status
//         </MenuItem>
//       </Menu>

//       {/* Automation Drawer */}
//       <Drawer
//         anchor="right"
//         open={isDrawerOpen}
//         onClose={handleDrawerClose}
//         PaperProps={{ 
//           sx: { 
//             width: { xs: "100%", sm: "600px", md: "700px" },
//             padding: 2
//           } 
//         }}
//       >
//         <Box sx={{ padding: 2, display: "flex", flexDirection: "column", height: "100%" }}>
//           {/* Header */}
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//             <Typography variant="h5">
//               Configure Automations - Stage {stageSelected !== null ? stageSelected + 1 : ''}
//             </Typography>
//             <IconButton onClick={handleDrawerClose}>
//               <RiDeleteBin6Line />
//             </IconButton>
//           </Box>
          
//           {/* Automation List - Scrollable area */}
//           <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
//             {/* Display all automations in this drawer with indexing */}
//             {drawerAutomations.length === 0 ? (
//               <Box sx={{ textAlign: "center", py: 4 }}>
//                 <Typography variant="body1" color="text.secondary">
//                   No automations added yet. Click "Add Another Automation" to get started.
//                 </Typography>
//               </Box>
//             ) : (
//               drawerAutomations.map((automation, idx) => (
//                 <Box 
//                   key={idx} 
//                   sx={{ 
//                     mb: 3, 
//                     p: 2, 
//                     border: "1px solid #e0e0e0", 
//                     borderRadius: "8px",
//                     position: "relative"
//                   }}
//                 >
//                   {/* Delete Icon for each automation */}
//                   <IconButton
//                     onClick={() => handleDeleteAutomation(idx)}
//                     sx={{ 
//                       position: "absolute", 
//                       top: 8, 
//                       right: 8,
//                       color: "red",
//                       backgroundColor: "rgba(255,255,255,0.8)",
//                       '&:hover': {
//                         backgroundColor: "rgba(255,0,0,0.1)"
//                       }
//                     }}
//                     size="small"
//                   >
//                     <RiDeleteBin6Line />
//                   </IconButton>
                  
//                   <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>
//                     Automation {automation.index}: {automation.type}
//                   </Typography>
//                   {renderActionContent(automation.type, stageSelected)}
//                 </Box>
//               ))
//             )}
//           </Box>

//           {/* Footer with Action Buttons */}
//           <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 2 }}>
//             {/* Add Another Automation Button */}
//             <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
//               <Button
//                 variant="outlined"
//                 startIcon={<LuPlusCircle />}
//                 onClick={handleDrawerMenuOpen}
//                 sx={{ borderRadius: "8px" }}
//               >
//                 Add Another Automation
//               </Button>
//             </Box>

//             {/* Save All Automations Button */}
//             <Button
//               variant="contained"
//               fullWidth
//               onClick={handleSaveAllAutomations}
//               disabled={drawerAutomations.length === 0}
//               sx={{
//                 backgroundColor: "var(--color-save-btn)",
//                 "&:hover": {
//                   backgroundColor: "var(--color-save-hover-btn)",
//                 },
//                 "&:disabled": {
//                   backgroundColor: "#ccc",
//                   color: "#666"
//                 },
//                 borderRadius: "8px",
//                 py: 1.5
//               }}
//             >
//               Save All Automations ({drawerAutomations.length})
//             </Button>
//           </Box>

//           {/* Drawer Menu for Adding More Automations */}
//           <Menu
//             anchorEl={drawerAnchorEl}
//             open={Boolean(drawerAnchorEl)}
//             onClose={handleDrawerMenuClose}
//             PaperProps={{
//               style: {
//                 maxHeight: 200,
//                 overflowY: "auto",
//               },
//             }}
//           >
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Email")}>
//               Send Email
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Invoice")}>
//               Send Invoice
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Proposal/Els")}>
//               Send Proposal/Els
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Organizer")}>
//               Create Organizer
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Apply folder template")}>
//               Apply folder template
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update account tags")}>
//               Update account tags
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update job assignees")}>
//               Update job assignees
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Task")}>
//               Create Task
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send message")}>
//               Send message
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update client-facing job status")}>
//               Update client-facing job status
//             </MenuItem>
//           </Menu>
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };
// const StagesSection = ({
//   stages,
//   stageNameErrors,
//   handleAddStage,
//   handleDeleteStage,
//   handleStageNameChange,
// }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [stageSelected, setStageSelected] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [automationSelect, setAutomationSelect] = useState();
//   const [drawerAutomations, setDrawerAutomations] = useState([]);
//   const [drawerAnchorEl, setDrawerAnchorEl] = useState(null);

//   const handleAutomationMenuOpen = (event, stageIndex) => {
//     setAnchorEl(event.currentTarget);
//     setStageSelected(stageIndex);
//   };

//   const handleAutomationMenuClose = () => {
//     setAnchorEl(null);
//     // Don't reset stageSelected here - we need it for the drawer
//   };

//   const handleAddAutomation = (stageSelected, option) => {
//     console.log("Adding automation to stage index:", stageSelected);
//     console.log("Automation clicked:", option);
    
//     // Initialize drawer with the first automation
//     setDrawerAutomations([{ type: option, index: 1 }]);
//     setAutomationSelect(option);
//     setIsDrawerOpen(true);
//     handleAutomationMenuClose();
//   };

//   const handleDrawerOpen = (option, index) => {
//     setIsDrawerOpen(true);
//     setAutomationSelect(option);
//     setStageSelected(index);
//     console.log("Opening drawer for stage:", index, "with option:", option);
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//     setAutomationSelect(null);
//     // Don't reset stageSelected here if you want to preserve it for future operations
//     setDrawerAutomations([]);
//   };

//   // Drawer menu handlers
//   const handleDrawerMenuOpen = (event) => {
//     setDrawerAnchorEl(event.currentTarget);
//   };

//   const handleDrawerMenuClose = () => {
//     setDrawerAnchorEl(null);
//   };

//   const handleDrawerMenuItemSelect = (option) => {
//     const newIndex = drawerAutomations.length + 1;
//     setDrawerAutomations(prev => [...prev, { type: option, index: newIndex }]);
//     handleDrawerMenuClose();
//   };

//   // Delete automation from drawer
//   const handleDeleteAutomation = (automationIndex) => {
//     setDrawerAutomations(prev => {
//       const updatedAutomations = prev.filter((_, idx) => idx !== automationIndex);
//       return updatedAutomations.map((automation, idx) => ({
//         ...automation,
//         index: idx + 1
//       }));
//     });
//   };

//   // Save all automations to the stage
//   const handleSaveAllAutomations = () => {
//     if (stageSelected === null) {
//       console.error("No stage selected!");
//       return;
//     }
    
//     if (drawerAutomations.length === 0) {
//       console.error("No automations to save!");
//       return;
//     }
    
//     console.log("Saving all automations to stage:", stageSelected);
//     console.log("Automations to save:", drawerAutomations);
    
//     // Here you would implement your actual save logic
//     // For example:
//     // updateStageAutomations(stageSelected, drawerAutomations);
    
//     alert(`Successfully saved ${drawerAutomations.length} automation(s) to stage ${stageSelected + 1}`);
    
//     // Close the drawer after saving
//     handleDrawerClose();
//   };

//   // Simplified renderActionContent for demonstration
//   const renderActionContent = (automationSelect, index) => {
//     switch (automationSelect) {
//       case "Create Task":
//         return (
//           <Box>
//             <Typography variant="h6">Create Task Automation</Typography>
//             <Typography>Configure your task automation settings here...</Typography>
//           </Box>
//         );
//       case "Send Email":
//         return (
//           <Box>
//             <Typography variant="h6">Send Email Automation</Typography>
//             <Typography>Configure your email automation settings here...</Typography>
//           </Box>
//         );
//       case "Send Invoice":
//         return (
//           <Box>
//             <Typography variant="h6">Send Invoice Automation</Typography>
//             <Typography>Configure your invoice automation settings here...</Typography>
//           </Box>
//         );
//       default:
//         return (
//           <Box>
//             <Typography variant="h6">{automationSelect} Automation</Typography>
//             <Typography>Configure your {automationSelect.toLowerCase()} automation settings here...</Typography>
//           </Box>
//         );
//     }
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h6">Stages</Typography>

//         <Button
//           variant="contained"
//           startIcon={<LuPlusCircle />}
//           onClick={() => handleAddStage(stages.length)}
//           sx={{
//             backgroundColor: "var(--color-save-btn)",
//             "&:hover": {
//               backgroundColor: "var(--color-save-hover-btn)",
//             },
//             borderRadius: "15px",
//           }}
//         >
//           Add stage
//         </Button>
//       </Box>

//       {/* Scroll Area */}
//       <Box
//         sx={{
//           display: "flex",
//           gap: "25px",
//           flexDirection: { xs: "column", sm: "row" },
//           marginBottom: "10px",
//         }}
//       >
//         <Box
//           className="stage-scroll"
//           sx={{
//             display: "flex",
//             gap: "15px",
//             overflowX: "auto",
//             whiteSpace: "nowrap",
//             paddingBottom: "8px",
//             maxWidth: "100%",
//             minHeight: "300px",
//             maxHeight: "500px",
//           }}
//         >
//           {stages.map((stage, index) => (
//             <React.Fragment key={index}>
//               {/* Stage Card */}
//               <Box
//                 sx={{
//                   minWidth: "250px",
//                   maxWidth: "270px",
//                   padding: "20px",
//                   backgroundColor: "#F5F5F7",
//                   borderRadius: "12px",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                   flexShrink: 0,
//                 }}
//               >
//                 <Box>
//                   {/* Header With Edit/Delete */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <RxDragHandleDots2 />

//                     <TextField
//                       variant="standard"
//                       placeholder="Stage Name"
//                       fullWidth
//                       size="small"
//                       value={stage.name}
//                       onChange={(e) => handleStageNameChange(e, index)}
//                       error={!!stageNameErrors[index]}
//                       helperText={stageNameErrors[index]}
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <LuPenLine style={{ fontSize: "12px" }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     <IconButton
//                       onClick={() => handleDeleteStage(index)}
//                       sx={{ color: "red" }}
//                     >
//                       <RiDeleteBin6Line />
//                     </IconButton>
//                   </Box>

//                   <Divider />

//                   {/* Content */}
//                   <Box sx={{ mt: 2 }}>
//                     <Typography variant="subtitle2" fontWeight="bold">
//                       Stage conditions
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {index === 0
//                         ? "First stage can't have conditions"
//                         : index === stages.length - 1
//                         ? "Last stage can't have conditions"
//                         : "Job enters this stage if conditions are met"}
//                     </Typography>

//                     <Typography
//                       variant="subtitle2"
//                       fontWeight="bold"
//                       sx={{ mt: 2 }}
//                     >
//                       Automations
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Triggered when job enters stage
//                     </Typography>

//                     {/* Show existing automations if any */}
//                     {stage.automations && stage.automations.length > 0 && (
//                       <Box sx={{ mt: 1 }}>
//                         {stage.automations.map((auto, autoIndex) => (
//                           <Chip 
//                             key={autoIndex}
//                             label={`${auto.index}. ${auto.type}`}
//                             size="small"
//                             sx={{ mr: 0.5, mb: 0.5 }}
//                           />
//                         ))}
//                       </Box>
//                     )}

//                     {/* Add Automation Button */}
//                     <Button
//                       variant="outlined"
//                       startIcon={<LuPlusCircle />}
//                       fullWidth
//                       sx={{ mt: 1, borderRadius: "8px" }}
//                       onClick={(event) => handleAutomationMenuOpen(event, index)}
//                     >
//                       Add Automation
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>

//               {/* Plus Icon Between Stages */}
//               {index < stages.length - 1 && (
//                 <IconButton onClick={() => handleAddStage(index + 1)}>
//                   <LuPlusCircle
//                     style={{
//                       color: "var(--color-save-btn)",
//                       width: "25px",
//                       height: "25px",
//                     }}
//                   />
//                 </IconButton>
//               )}
//             </React.Fragment>
//           ))}
//         </Box>
//       </Box>

//       {/* Automation Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleAutomationMenuClose}
//         PaperProps={{
//           style: {
//             maxHeight: 200,
//             overflowY: "auto",
//           },
//         }}
//       >
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Email")}>
//           Send Email
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Invoice")}>
//           Send Invoice
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Proposal/Els")}>
//           Send Proposal/Els
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Organizer")}>
//           Create Organizer
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Apply folder template")}>
//           Apply folder template
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update account tags")}>
//           Update account tags
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update job assignees")}>
//           Update job assignees
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Task")}>
//           Create Task
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send message")}>
//           Send message
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update client-facing job status")}>
//           Update client-facing job status
//         </MenuItem>
//       </Menu>

//       {/* Automation Drawer */}
//       <Drawer
//         anchor="right"
//         open={isDrawerOpen}
//         onClose={handleDrawerClose}
//         PaperProps={{ 
//           sx: { 
//             width: { xs: "100%", sm: "600px", md: "700px" },
//             padding: 2
//           } 
//         }}
//       >
//         <Box sx={{ padding: 2, display: "flex", flexDirection: "column", height: "100%" }}>
//           {/* Header */}
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//             <Typography variant="h5">
//               Configure Automations - Stage {stageSelected !== null ? stageSelected + 1 : 'Loading...'}
//             </Typography>
//             <IconButton onClick={handleDrawerClose}>
//               <RiDeleteBin6Line />
//             </IconButton>
//           </Box>
          
//           {/* Debug info - remove in production */}
//           {stageSelected === null && (
//             <Box sx={{ backgroundColor: '#ffebee', p: 1, borderRadius: 1, mb: 2 }}>
//               <Typography variant="body2" color="error">
//                 Debug: stageSelected is null. This should not happen when drawer is open.
//               </Typography>
//             </Box>
//           )}
          
//           {/* Automation List - Scrollable area */}
//           <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
//             {drawerAutomations.length === 0 ? (
//               <Box sx={{ textAlign: "center", py: 4 }}>
//                 <Typography variant="body1" color="text.secondary">
//                   No automations added yet. Click "Add Another Automation" to get started.
//                 </Typography>
//               </Box>
//             ) : (
//               drawerAutomations.map((automation, idx) => (
//                 <Box 
//                   key={idx} 
//                   sx={{ 
//                     mb: 3, 
//                     p: 2, 
//                     border: "1px solid #e0e0e0", 
//                     borderRadius: "8px",
//                     position: "relative"
//                   }}
//                 >
//                   <IconButton
//                     onClick={() => handleDeleteAutomation(idx)}
//                     sx={{ 
//                       position: "absolute", 
//                       top: 8, 
//                       right: 8,
//                       color: "red",
//                       backgroundColor: "rgba(255,255,255,0.8)",
//                       '&:hover': {
//                         backgroundColor: "rgba(255,0,0,0.1)"
//                       }
//                     }}
//                     size="small"
//                   >
//                     <RiDeleteBin6Line />
//                   </IconButton>
                  
//                   <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>
//                     Automation {automation.index}: {automation.type}
//                   </Typography>
//                   {stageSelected !== null && renderActionContent(automation.type, stageSelected)}
//                 </Box>
//               ))
//             )}
//           </Box>

//           {/* Footer with Action Buttons */}
//           <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 2 }}>
//             <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
//               <Button
//                 variant="outlined"
//                 startIcon={<LuPlusCircle />}
//                 onClick={handleDrawerMenuOpen}
//                 sx={{ borderRadius: "8px" }}
//               >
//                 Add Another Automation
//               </Button>
//             </Box>

//             <Button
//               variant="contained"
//               fullWidth
//               onClick={handleSaveAllAutomations}
//               disabled={drawerAutomations.length === 0 || stageSelected === null}
//               sx={{
//                 backgroundColor: "var(--color-save-btn)",
//                 "&:hover": {
//                   backgroundColor: "var(--color-save-hover-btn)",
//                 },
//                 "&:disabled": {
//                   backgroundColor: "#ccc",
//                   color: "#666"
//                 },
//                 borderRadius: "8px",
//                 py: 1.5
//               }}
//             >
//               {stageSelected === null ? 'No Stage Selected' : `Save All Automations (${drawerAutomations.length})`}
//             </Button>
//           </Box>

//           {/* Drawer Menu for Adding More Automations */}
//           <Menu
//             anchorEl={drawerAnchorEl}
//             open={Boolean(drawerAnchorEl)}
//             onClose={handleDrawerMenuClose}
//             PaperProps={{
//               style: {
//                 maxHeight: 200,
//                 overflowY: "auto",
//               },
//             }}
//           >
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Email")}>
//               Send Email
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Invoice")}>
//               Send Invoice
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Proposal/Els")}>
//               Send Proposal/Els
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Organizer")}>
//               Create Organizer
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Apply folder template")}>
//               Apply folder template
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update account tags")}>
//               Update account tags
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update job assignees")}>
//               Update job assignees
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Task")}>
//               Create Task
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send message")}>
//               Send message
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update client-facing job status")}>
//               Update client-facing job status
//             </MenuItem>
//           </Menu>
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };
// const StagesSection = ({
//   stages,
//   stageNameErrors,
//   handleAddStage,
//   handleDeleteStage,
//   handleStageNameChange,
//   handleSaveAutomations, // New prop to save automations to stages
// }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [stageSelected, setStageSelected] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [automationSelect, setAutomationSelect] = useState();
//   const [drawerAutomations, setDrawerAutomations] = useState([]);
//   const [drawerAnchorEl, setDrawerAnchorEl] = useState(null);

//   const handleAutomationMenuOpen = (event, stageIndex) => {
//     setAnchorEl(event.currentTarget);
//     setStageSelected(stageIndex);
//   };

//   const handleAutomationMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleAddAutomation = (stageSelected, option) => {
//     console.log("Adding automation to stage index:", stageSelected);
//     console.log("Automation clicked:", option);
    
//     // Initialize drawer with the first automation
//     setDrawerAutomations([{ 
//       type: option, 
//       index: 1,
//       id: Date.now() // Add unique ID for better tracking
//     }]);
//     setAutomationSelect(option);
//     setIsDrawerOpen(true);
//     handleAutomationMenuClose();
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//     setAutomationSelect(null);
//     setDrawerAutomations([]);
//   };

//   // Drawer menu handlers
//   const handleDrawerMenuOpen = (event) => {
//     setDrawerAnchorEl(event.currentTarget);
//   };

//   const handleDrawerMenuClose = () => {
//     setDrawerAnchorEl(null);
//   };

//   const handleDrawerMenuItemSelect = (option) => {
//     const newIndex = drawerAutomations.length + 1;
//     setDrawerAutomations(prev => [...prev, { 
//       type: option, 
//       index: newIndex,
//       id: Date.now() + Math.random() // Add unique ID
//     }]);
//     handleDrawerMenuClose();
//   };

//   // Delete automation from drawer
//   const handleDeleteAutomation = (automationIndex) => {
//     setDrawerAutomations(prev => {
//       const updatedAutomations = prev.filter((_, idx) => idx !== automationIndex);
//       return updatedAutomations.map((automation, idx) => ({
//         ...automation,
//         index: idx + 1
//       }));
//     });
//   };

//   // Save all automations to the stage
//   const handleSaveAllAutomations = () => {
//     if (stageSelected === null) {
//       console.error("No stage selected!");
//       return;
//     }
    
//     if (drawerAutomations.length === 0) {
//       console.error("No automations to save!");
//       return;
//     }
    
//     console.log("Saving all automations to stage:", stageSelected);
//     console.log("Automations to save:", drawerAutomations);
    
//     // Call the parent function to save automations to the stage
//     if (handleSaveAutomations) {
//       handleSaveAutomations(stageSelected, drawerAutomations);
//     }
    
//     alert(`Successfully saved ${drawerAutomations.length} automation(s) to stage ${stageSelected + 1}`);
    
//     // Close the drawer after saving
//     handleDrawerClose();
//   };

//   // Edit existing automation
//   const handleEditAutomation = (stageIndex, automationIndex) => {
//     const stage = stages[stageIndex];
//     if (stage && stage.automations) {
//       const automationToEdit = stage.automations[automationIndex];
//       // Open drawer with existing automation for editing
//       setDrawerAutomations([automationToEdit]);
//       setAutomationSelect(automationToEdit.type);
//       setStageSelected(stageIndex);
//       setIsDrawerOpen(true);
//     }
//   };

//   // Delete saved automation from stage
//   const handleDeleteSavedAutomation = (stageIndex, automationIndex) => {
//     if (handleSaveAutomations) {
//       const stage = stages[stageIndex];
//       if (stage && stage.automations) {
//         const updatedAutomations = stage.automations.filter((_, idx) => idx !== automationIndex);
//         handleSaveAutomations(stageIndex, updatedAutomations);
//       }
//     }
//   };

//   // Simplified renderActionContent for demonstration
//   const renderActionContent = (automationSelect, index) => {
//     switch (automationSelect) {
//       case "Create Task":
//         return (
//           <Box>
//             <Typography variant="h6">Create Task Automation</Typography>
//             <Typography>Configure your task automation settings here...</Typography>
//           </Box>
//         );
//       case "Send Email":
//         return (
//           <Box>
//             <Typography variant="h6">Send Email Automation</Typography>
//             <Typography>Configure your email automation settings here...</Typography>
//           </Box>
//         );
//       case "Send Invoice":
//         return (
//           <Box>
//             <Typography variant="h6">Send Invoice Automation</Typography>
//             <Typography>Configure your invoice automation settings here...</Typography>
//           </Box>
//         );
//       default:
//         return (
//           <Box>
//             <Typography variant="h6">{automationSelect} Automation</Typography>
//             <Typography>Configure your {automationSelect.toLowerCase()} automation settings here...</Typography>
//           </Box>
//         );
//     }
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h6">Stages</Typography>

//         <Button
//           variant="contained"
//           startIcon={<LuPlusCircle />}
//           onClick={() => handleAddStage(stages.length)}
//           sx={{
//             backgroundColor: "var(--color-save-btn)",
//             "&:hover": {
//               backgroundColor: "var(--color-save-hover-btn)",
//             },
//             borderRadius: "15px",
//           }}
//         >
//           Add stage
//         </Button>
//       </Box>

//       {/* Scroll Area */}
//       <Box
//         sx={{
//           display: "flex",
//           gap: "25px",
//           flexDirection: { xs: "column", sm: "row" },
//           marginBottom: "10px",
//         }}
//       >
//         <Box
//           className="stage-scroll"
//           sx={{
//             display: "flex",
//             gap: "15px",
//             overflowX: "auto",
//             whiteSpace: "nowrap",
//             paddingBottom: "8px",
//             maxWidth: "100%",
//             minHeight: "300px",
//             maxHeight: "500px",
//           }}
//         >
//           {stages.map((stage, index) => (
//             <React.Fragment key={index}>
//               {/* Stage Card */}
//               <Box
//                 sx={{
//                   minWidth: "250px",
//                   maxWidth: "270px",
//                   padding: "20px",
//                   backgroundColor: "#F5F5F7",
//                   borderRadius: "12px",
//                   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                   flexShrink: 0,
//                 }}
//               >
//                 <Box>
//                   {/* Header With Edit/Delete */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <RxDragHandleDots2 />

//                     <TextField
//                       variant="standard"
//                       placeholder="Stage Name"
//                       fullWidth
//                       size="small"
//                       value={stage.name}
//                       onChange={(e) => handleStageNameChange(e, index)}
//                       error={!!stageNameErrors[index]}
//                       helperText={stageNameErrors[index]}
//                       InputProps={{
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <LuPenLine style={{ fontSize: "12px" }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     <IconButton
//                       onClick={() => handleDeleteStage(index)}
//                       sx={{ color: "red" }}
//                     >
//                       <RiDeleteBin6Line />
//                     </IconButton>
//                   </Box>

//                   <Divider />

//                   {/* Content */}
//                   <Box sx={{ mt: 2 }}>
//                     <Typography variant="subtitle2" fontWeight="bold">
//                       Stage conditions
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {index === 0
//                         ? "First stage can't have conditions"
//                         : index === stages.length - 1
//                         ? "Last stage can't have conditions"
//                         : "Job enters this stage if conditions are met"}
//                     </Typography>

//                     <Typography
//                       variant="subtitle2"
//                       fontWeight="bold"
//                       sx={{ mt: 2 }}
//                     >
//                       Automations
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Triggered when job enters stage
//                     </Typography>

//                     {/* Show saved automations */}
//                     <Box sx={{ mt: 1, mb: 1 }}>
//                       {stage.automations && stage.automations.length > 0 ? (
//                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                           {stage.automations.map((automation, autoIndex) => (
//                             <Box 
//                               key={automation.id || autoIndex}
//                               sx={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'space-between',
//                                 p: 1,
//                                 backgroundColor: 'white',
//                                 borderRadius: '6px',
//                                 border: '1px solid #e0e0e0',
//                                 '&:hover': {
//                                   backgroundColor: '#f9f9f9'
//                                 }
//                               }}
//                             >
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <Box 
//                                   sx={{
//                                     width: 20,
//                                     height: 20,
//                                     borderRadius: '50%',
//                                     backgroundColor: 'primary.main',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     color: 'white',
//                                     fontSize: '12px',
//                                     fontWeight: 'bold'
//                                   }}
//                                 >
//                                   {automation.index}
//                                 </Box>
//                                 <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
//                                   {automation.type}
//                                 </Typography>
//                               </Box>
//                               <Box sx={{ display: 'flex', gap: 0.5 }}>
//                                 <IconButton 
//                                   size="small"
//                                   onClick={() => handleEditAutomation(index, autoIndex)}
//                                   sx={{ color: 'primary.main' }}
//                                 >
//                                   <LuPenLine size={14} />
//                                 </IconButton>
//                                 <IconButton 
//                                   size="small"
//                                   onClick={() => handleDeleteSavedAutomation(index, autoIndex)}
//                                   sx={{ color: 'error.main' }}
//                                 >
//                                   <RiDeleteBin6Line size={14} />
//                                 </IconButton>
//                               </Box>
//                             </Box>
//                           ))}
//                         </Box>
//                       ) : (
//                         <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
//                           No automations configured
//                         </Typography>
//                       )}
//                     </Box>

//                     {/* Add Automation Button */}
//                     <Button
//                       variant="outlined"
//                       startIcon={<LuPlusCircle />}
//                       fullWidth
//                       sx={{ mt: 1, borderRadius: "8px" }}
//                       onClick={(event) => handleAutomationMenuOpen(event, index)}
//                     >
//                       Add Automation
//                     </Button>
//                   </Box>
//                 </Box>
//               </Box>

//               {/* Plus Icon Between Stages */}
//               {index < stages.length - 1 && (
//                 <IconButton onClick={() => handleAddStage(index + 1)}>
//                   <LuPlusCircle
//                     style={{
//                       color: "var(--color-save-btn)",
//                       width: "25px",
//                       height: "25px",
//                     }}
//                   />
//                 </IconButton>
//               )}
//             </React.Fragment>
//           ))}
//         </Box>
//       </Box>

//       {/* Automation Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleAutomationMenuClose}
//         PaperProps={{
//           style: {
//             maxHeight: 200,
//             overflowY: "auto",
//           },
//         }}
//       >
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Email")}>
//           Send Email
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Invoice")}>
//           Send Invoice
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Proposal/Els")}>
//           Send Proposal/Els
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Organizer")}>
//           Create Organizer
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Apply folder template")}>
//           Apply folder template
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update account tags")}>
//           Update account tags
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update job assignees")}>
//           Update job assignees
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Task")}>
//           Create Task
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send message")}>
//           Send message
//         </MenuItem>
//         <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update client-facing job status")}>
//           Update client-facing job status
//         </MenuItem>
//       </Menu>

//       {/* Automation Drawer */}
//       <Drawer
//         anchor="right"
//         open={isDrawerOpen}
//         onClose={handleDrawerClose}
//         PaperProps={{ 
//           sx: { 
//             width: { xs: "100%", sm: "600px", md: "700px" },
//             padding: 2
//           } 
//         }}
//       >
//         <Box sx={{ padding: 2, display: "flex", flexDirection: "column", height: "100%" }}>
//           {/* Header */}
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//             <Typography variant="h5">
//               Configure Automations - Stage {stageSelected !== null ? stageSelected + 1 : 'Loading...'}
//             </Typography>
//             <IconButton onClick={handleDrawerClose}>
//               <RiDeleteBin6Line />
//             </IconButton>
//           </Box>
          
//           {/* Automation List - Scrollable area */}
//           <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
//             {drawerAutomations.length === 0 ? (
//               <Box sx={{ textAlign: "center", py: 4 }}>
//                 <Typography variant="body1" color="text.secondary">
//                   No automations added yet. Click "Add Another Automation" to get started.
//                 </Typography>
//               </Box>
//             ) : (
//               drawerAutomations.map((automation, idx) => (
//                 <Box 
//                   key={automation.id || idx} 
//                   sx={{ 
//                     mb: 3, 
//                     p: 2, 
//                     border: "1px solid #e0e0e0", 
//                     borderRadius: "8px",
//                     position: "relative"
//                   }}
//                 >
//                   <IconButton
//                     onClick={() => handleDeleteAutomation(idx)}
//                     sx={{ 
//                       position: "absolute", 
//                       top: 8, 
//                       right: 8,
//                       color: "red",
//                       backgroundColor: "rgba(255,255,255,0.8)",
//                       '&:hover': {
//                         backgroundColor: "rgba(255,0,0,0.1)"
//                       }
//                     }}
//                     size="small"
//                   >
//                     <RiDeleteBin6Line />
//                   </IconButton>
                  
//                   <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>
//                     Automation {automation.index}: {automation.type}
//                   </Typography>
//                   {stageSelected !== null && renderActionContent(automation.type, stageSelected)}
//                 </Box>
//               ))
//             )}
//           </Box>

//           {/* Footer with Action Buttons */}
//           <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 2 }}>
//             <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
//               <Button
//                 variant="outlined"
//                 startIcon={<LuPlusCircle />}
//                 onClick={handleDrawerMenuOpen}
//                 sx={{ borderRadius: "8px" }}
//               >
//                 Add Another Automation
//               </Button>
//             </Box>

//             <Button
//               variant="contained"
//               fullWidth
//               onClick={handleSaveAllAutomations}
//               disabled={drawerAutomations.length === 0 || stageSelected === null}
//               sx={{
//                 backgroundColor: "var(--color-save-btn)",
//                 "&:hover": {
//                   backgroundColor: "var(--color-save-hover-btn)",
//                 },
//                 "&:disabled": {
//                   backgroundColor: "#ccc",
//                   color: "#666"
//                 },
//                 borderRadius: "8px",
//                 py: 1.5
//               }}
//             >
//               {stageSelected === null ? 'No Stage Selected' : `Save All Automations (${drawerAutomations.length})`}
//             </Button>
//           </Box>

//           {/* Drawer Menu for Adding More Automations */}
//           <Menu
//             anchorEl={drawerAnchorEl}
//             open={Boolean(drawerAnchorEl)}
//             onClose={handleDrawerMenuClose}
//             PaperProps={{
//               style: {
//                 maxHeight: 200,
//                 overflowY: "auto",
//               },
//             }}
//           >
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Email")}>
//               Send Email
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Invoice")}>
//               Send Invoice
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Proposal/Els")}>
//               Send Proposal/Els
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Organizer")}>
//               Create Organizer
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Apply folder template")}>
//               Apply folder template
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update account tags")}>
//               Update account tags
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update job assignees")}>
//               Update job assignees
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Task")}>
//               Create Task
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Send message")}>
//               Send message
//             </MenuItem>
//             <MenuItem onClick={() => handleDrawerMenuItemSelect("Update client-facing job status")}>
//               Update client-facing job status
//             </MenuItem>
//           </Menu>
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };
const StagesSection = ({
  stages,
  stageNameErrors,
  handleAddStage,
  handleDeleteStage,
  handleStageNameChange,
  handleSaveAutomations,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [stageSelected, setStageSelected] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [automationSelect, setAutomationSelect] = useState();
  const [drawerAutomations, setDrawerAutomations] = useState([]);
  const [drawerAnchorEl, setDrawerAnchorEl] = useState(null);
// State for conditions drawer (shared across all automations)
  const [isConditionsFormOpen, setIsConditionsFormOpen] = useState(false);
  const [currentAutomationIndex, setCurrentAutomationIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedTags, setTempSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
 
 const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const [addTaskTemplates, setAddTaskTemplates] = useState([]);
  const [addEmailTemplates, setAddEmailTemplates] = useState([]);
   const [tags, setTags] = useState([]);

   useEffect(() => {
     fetchTags();
   }, []);
 
   const fetchTags = async () => {
     try {
       const url = `${TAGS_API}/tags/`;
       const response = await fetch(url);
       const data = await response.json();
       console.log("tags dtata", data.tags);
       setFilteredTags(data.tags);
     } catch (error) {
       console.error("Error fetching data:", error);
     }
   };
   const fetchTaskTemplates = async () => {
    try {
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      const response = await fetch(url);
      const data = await response.json();
      setAddTaskTemplates(data.TaskTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const taskTemplateOptions = addTaskTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  const fetchEmailTemplates = async () => {
    try {
      const url = `${EMAIL_API}/workflow/emailtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddEmailTemplates(data.emailTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const emailTemplateOptions = addEmailTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
   useEffect(() => {
     fetchEmailTemplates();
    
     fetchTaskTemplates();
    
   }, []);
 
  // State for each automation type

  const handleAutomationMenuOpen = (event, stageIndex) => {
    setAnchorEl(event.currentTarget);
    setStageSelected(stageIndex);
  };

  const handleAutomationMenuClose = () => {
    setAnchorEl(null);
  };
const handleAddAutomation = (stageSelected, option) => {
    console.log("Adding automation to stage index:", stageSelected);
    console.log("Automation clicked:", option);
    
    // Initialize drawer with the first automation
    const newAutomation = { 
      type: option, 
      index: 1,
      id: Date.now(),
      // Initialize automation-specific state
      selectedtemp: null,
      selectedTags: [],
      reminderChecked: false,
      daysuntilNextReminder: "",
      noOfReminder: "",
      addTags: [],
      removeTags: [],
      selectedAssignees: [],
      assigneesToRemove: [],
      status: null,
      selectedClientStatus: null,
      clientDescription: ""
    };
    
    setDrawerAutomations([newAutomation]);
    setAutomationSelect(option);
    setIsDrawerOpen(true);
    handleAutomationMenuClose();
  };


  // Open drawer with existing automations for editing
  const handleEditAutomations = (stageIndex) => {
    const stage = stages[stageIndex];
    if (stage && stage.automations && stage.automations.length > 0) {
      // Load existing automations into drawer
      setDrawerAutomations([...stage.automations]);
      setStageSelected(stageIndex);
      setIsDrawerOpen(true);
    } else {
      // If no automations, open the menu to add new ones
      console.log("No existing automations to edit");
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setAutomationSelect(null);
    setDrawerAutomations([]);
  };

  // Drawer menu handlers
  const handleDrawerMenuOpen = (event) => {
    setDrawerAnchorEl(event.currentTarget);
  };

  const handleDrawerMenuClose = () => {
    setDrawerAnchorEl(null);
  };
    const handleDrawerMenuItemSelect = (option) => {
    const newIndex = drawerAutomations.length + 1;
    const newAutomation = { 
      type: option, 
      index: newIndex,
      id: Date.now() + Math.random(),
      // Initialize automation-specific state
      selectedtemp: null,
      selectedTags: [],
      reminderChecked: false,
      daysuntilNextReminder: "",
      noOfReminder: "",
      addTags: [],
      removeTags: [],
      selectedAssignees: [],
      assigneesToRemove: [],
      status: null,
      selectedClientStatus: null,
      clientDescription: ""
    };
    
    setDrawerAutomations(prev => [...prev, newAutomation]);
    handleDrawerMenuClose();
  };



  // Delete automation from drawer
  const handleDeleteAutomation = (automationIndex) => {
    setDrawerAutomations(prev => {
      const updatedAutomations = prev.filter((_, idx) => idx !== automationIndex);
      return updatedAutomations.map((automation, idx) => ({
        ...automation,
        index: idx + 1
      }));
    });
  };


  // Update automation state
  const updateAutomationState = (automationIndex, updates) => {
    setDrawerAutomations(prev => 
      prev.map((automation, idx) => 
        idx === automationIndex ? { ...automation, ...updates } : automation
      )
    );
  };

 // Conditions handlers
  const handleAddConditions = (automationIndex) => {
    const automation = drawerAutomations[automationIndex];
    // Set the current automation index and pre-populate with existing tags
    setCurrentAutomationIndex(automationIndex);
    setTempSelectedTags(automation.selectedTags || []);
    setSearchTerm("");
    setIsConditionsFormOpen(true);
  };
  const handleGoBack = () => {
    setIsConditionsFormOpen(false);
    setCurrentAutomationIndex(null);
    setTempSelectedTags([]);
    setSearchTerm("");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Filter tags logic here
  };

  const handleCheckboxChange = (tag) => {
    setTempSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddTags = () => {
    if (currentAutomationIndex !== null) {
      updateAutomationState(currentAutomationIndex, {
        selectedTags: tempSelectedTags
      });
    }
    handleGoBack();
  };

  // Template selection handler
  const handletemp = (newValue, automationType, automationIndex) => {
    updateAutomationState(automationIndex, { selectedtemp: newValue });
  };

 

  // Save all automations to the stage
//   const handleSaveAllAutomations = () => {
//     if (stageSelected === null) {
//       console.error("No stage selected!");
//       return;
//     }
    
//     if (drawerAutomations.length === 0) {
//       console.error("No automations to save!");
//       return;
//     }
    
//     console.log("Saving all automations to stage:", stageSelected);
//     console.log("Automations to save:", drawerAutomations);
    
//     // Call the parent function to save automations to the stage
//     if (handleSaveAutomations) {
//       handleSaveAutomations(stageSelected, drawerAutomations);
//     }
    
//     alert(`Successfully saved ${drawerAutomations.length} automation(s) to stage ${stageSelected + 1}`);
    
//     // Close the drawer after saving
//     handleDrawerClose();
//   };
  const handleSaveAllAutomations = () => {
    if (stageSelected === null) {
      console.error("No stage selected!");
      return;
    }
    
    if (drawerAutomations.length === 0) {
      console.error("No automations to save!");
      return;
    }
    
    console.log("Saving all automations to stage:", stageSelected);
    console.log("Automations to save:", drawerAutomations);
    
    // Prepare automations with template and tag details
    const automationsWithDetails = drawerAutomations.map(automation => ({
      ...automation,
      // Store template details
      template: automation.selectedtemp ? {
        id: automation.selectedtemp.value,
        name: automation.selectedtemp.label
      } : null,
      // Store tags with full details
      tags: automation.selectedTags ? automation.selectedTags.map(tag => ({
        id: tag._id,
        name: tag.tagName,
        color: tag.tagColour
      })) : []
    }));
    
    // Call the parent function to save automations to the stage
    if (handleSaveAutomations) {
      handleSaveAutomations(stageSelected, automationsWithDetails);
    }
    
    alert(`Successfully saved ${drawerAutomations.length} automation(s) to stage ${stageSelected + 1}`);
    
    // Close the drawer after saving
    handleDrawerClose();
  };
 

  // Edit existing automation (individual)
  const handleEditAutomation = (stageIndex, automationIndex) => {
    const stage = stages[stageIndex];
    if (stage && stage.automations) {
      const automationToEdit = stage.automations[automationIndex];
      // Open drawer with existing automation for editing
      setDrawerAutomations([automationToEdit]);
      setAutomationSelect(automationToEdit.type);
      setStageSelected(stageIndex);
      setIsDrawerOpen(true);
    }
  };

  // Delete saved automation from stage
  const handleDeleteSavedAutomation = (stageIndex, automationIndex) => {
    if (handleSaveAutomations) {
      const stage = stages[stageIndex];
      if (stage && stage.automations) {
        const updatedAutomations = stage.automations.filter((_, idx) => idx !== automationIndex);
        handleSaveAutomations(stageIndex, updatedAutomations);
      }
    }
  };

  // Your complex renderActionContent function (simplified for example)
  const renderActionContent = (automation, index) => {
    const automationSelect = automation.type;
    const automationIndex = index;

    // Helper function to get selected tags for this automation
    const selectedTags = automation.selectedTags || [];
    const selectedTagElements = selectedTags.map((tag, idx) => (
      <Chip
        key={idx}
        label={tag.tagName}
        sx={{
          backgroundColor: tag.tagColour,
          color: "#fff",
          fontWeight: "500",
          borderRadius: "20px",
          marginRight: 1,
        }}
      />
    ));

    switch (automationSelect) {
      case "Create Task":
        return (
          <>
            <Grid item>
              <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
                <Typography gutterBottom>1. {automationSelect}</Typography>
                <Typography mb={1}>Select templates</Typography>
                <Autocomplete
                  options={taskTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={automation.selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue, automationSelect, automationIndex)}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ backgroundColor: "#fff" }}
                      placeholder="Select Template"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape
                />
                <Box mt={2}>
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
                  {/* Add Conditions */}
                    {selectedTags.length > 1 ? "Edit Conditions" : "Add Conditions"}
                </Button>
              </Box>
             
            </Grid>
          </>
        );

      case "Send Email":
        return (
          <>
            <Grid item>
              <Box sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2 }}>
                <Typography gutterBottom>1. {automationSelect}</Typography>
                <Autocomplete
                  options={emailTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={automation.selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue, automationSelect, automationIndex)}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} sx={{ cursor: "pointer", margin: "5px 10px" }}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ backgroundColor: "#fff" }}
                      placeholder="Select Template"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape
                />
                <Box mt={2}>
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={() => handleAddConditions(automationIndex)}>
                 {selectedTags.length > 1 ? "Edit Conditions" : "Add Conditions"}
                </Button>
              </Box>
              
            </Grid>
          </>
        );

      // Add other cases similarly...

      default:
        return (
          <Box>
            <Typography variant="h6">{automationSelect} Automation</Typography>
            {/* <Typography>Configure your {automationSelect.toLowerCase()} automation settings here...</Typography> */}
          </Box>
        );
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Stages</Typography>

        <Button
          variant="contained"
          startIcon={<LuPlusCircle />}
          onClick={() => handleAddStage(stages.length)}
          sx={{
            backgroundColor: "var(--color-save-btn)",
            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)",
            },
            borderRadius: "15px",
          }}
        >
          Add stage
        </Button>
      </Box>

      {/* Scroll Area */}
      <Box
        sx={{
          display: "flex",
          gap: "25px",
          flexDirection: { xs: "column", sm: "row" },
          marginBottom: "10px",
        }}
      >
        <Box
          className="stage-scroll"
          sx={{
            display: "flex",
            gap: "15px",
            overflowX: "auto",
            whiteSpace: "nowrap",
            paddingBottom: "8px",
            maxWidth: "100%",
            minHeight: "300px",
            maxHeight: "500px",
          }}
        >
          {stages.map((stage, index) => (
            <React.Fragment key={index}>
              {/* Stage Card */}
              <Box
                sx={{
                  minWidth: "250px",
                  maxWidth: "270px",
                  padding: "20px",
                  backgroundColor: "#F5F5F7",
                  borderRadius: "12px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  flexShrink: 0,
                }}
              >
                <Box>
                  {/* Header With Edit/Delete */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <RxDragHandleDots2 />

                    <TextField
                      variant="standard"
                      placeholder="Stage Name"
                      fullWidth
                      size="small"
                      value={stage.name}
                      onChange={(e) => handleStageNameChange(e, index)}
                      error={!!stageNameErrors[index]}
                      helperText={stageNameErrors[index]}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <LuPenLine style={{ fontSize: "12px" }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <IconButton
                      onClick={() => handleDeleteStage(index)}
                      sx={{ color: "red" }}
                    >
                      <RiDeleteBin6Line />
                    </IconButton>
                  </Box>

                  <Divider />

                  {/* Content */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Stage conditions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {index === 0
                        ? "First stage can't have conditions"
                        : index === stages.length - 1
                        ? "Last stage can't have conditions"
                        : "Job enters this stage if conditions are met"}
                    </Typography>

                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ mt: 2 }}
                    >
                      Automations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Triggered when job enters stage
                    </Typography>

                    {/* Show saved automations */}
                    {/* <Box sx={{ mt: 1, mb: 1 }}>
                      {stage.automations && stage.automations.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {stage.automations.map((automation, autoIndex) => (
                            <Box 
                              key={automation.id || autoIndex}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 1,
                                backgroundColor: 'white',
                                borderRadius: '6px',
                                border: '1px solid #e0e0e0',
                                '&:hover': {
                                  backgroundColor: '#f9f9f9'
                                }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box 
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    backgroundColor: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {automation.index}
                                </Box>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {automation.type}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton 
                                  size="small"
                                  onClick={() => handleEditAutomation(index, autoIndex)}
                                  sx={{ color: 'primary.main' }}
                                >
                                  <LuPenLine size={14} />
                                </IconButton>
                                <IconButton 
                                  size="small"
                                  onClick={() => handleDeleteSavedAutomation(index, autoIndex)}
                                  sx={{ color: 'error.main' }}
                                >
                                  <RiDeleteBin6Line size={14} />
                                </IconButton>
                              </Box>
                            </Box>
                            
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No automations configured
                        </Typography>
                      )}
                    </Box> */}
                    {/* Show saved automations with template and tags */}
                    <Box sx={{ mt: 1, mb: 1 }}>
                      {stage.automations && stage.automations.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {stage.automations.map((automation, autoIndex) => (
                            <Box 
                              key={automation.id || autoIndex}
                              sx={{
                                p: 1.5,
                                backgroundColor: 'white',
                                borderRadius: '6px',
                                border: '1px solid #e0e0e0',
                                '&:hover': {
                                  backgroundColor: '#f9f9f9'
                                }
                              }}
                            >
                              {/* Automation Header */}
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box 
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: '50%',
                                      backgroundColor: 'primary.main',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'white',
                                      fontSize: '12px',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {automation.index}
                                  </Box>
                                  <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {automation.type}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleEditAutomation(index, autoIndex)}
                                    sx={{ color: 'primary.main' }}
                                  >
                                    <LuPenLine size={14} />
                                  </IconButton>
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleDeleteSavedAutomation(index, autoIndex)}
                                    sx={{ color: 'error.main' }}
                                  >
                                    <RiDeleteBin6Line size={14} />
                                  </IconButton>
                                </Box>
                              </Box>

                              {/* Template Information */}
                              {automation.template && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                    Template:
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                    <Chip 
                                      label={automation.template.name}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: '0.7rem' }}
                                    />
                                    {/* <Typography variant="caption" color="text.secondary">
                                      (ID: {automation.template.id})
                                    </Typography> */}
                                  </Box>
                                </Box>
                              )}

                              {/* Conditions Tags */}
                              {automation.tags && automation.tags.length > 0 && (
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                    Conditions:
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                    {automation.tags.map((tag, tagIndex) => (
                                      <Box key={tagIndex} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Chip
                                          label={tag.name}
                                          size="small"
                                          sx={{
                                            backgroundColor: tag.color,
                                            color: "#fff",
                                            fontWeight: "500",
                                            borderRadius: "20px",
                                            fontSize: '0.7rem'
                                          }}
                                        />
                                        {/* <Typography variant="caption" color="text.secondary">
                                          ({tag.id})
                                        </Typography> */}
                                      </Box>
                                    ))}
                                  </Box>
                                </Box>
                              )}

                              {/* Additional automation details can be added here */}
                              {automation.reminderChecked && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                    Reminders:
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {automation.daysuntilNextReminder} days, {automation.noOfReminder} times
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No automations configured
                        </Typography>
                      )}
                    </Box>

                    {/* Dynamic Button - Changes based on whether stage has automations */}
                    {stage.automations && stage.automations.length > 0 ? (
                      // Edit Automations Button (when stage has automations)
                      <Button
                        variant="outlined"
                        startIcon={<LuPenLine />}
                        fullWidth
                        sx={{ 
                          mt: 1, 
                          borderRadius: "8px",
                          borderColor: "primary.main",
                          color: "primary.main",
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white'
                          }
                        }}
                        onClick={() => handleEditAutomations(index)}
                      >
                        Edit Automations ({stage.automations.length})
                      </Button>
                    ) : (
                      // Add Automation Button (when stage has no automations)
                      <Button
                        variant="outlined"
                        startIcon={<LuPlusCircle />}
                        fullWidth
                        sx={{ mt: 1, borderRadius: "8px" }}
                        onClick={(event) => handleAutomationMenuOpen(event, index)}
                      >
                        Add Automation
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Plus Icon Between Stages */}
              {index < stages.length - 1 && (
                <IconButton onClick={() => handleAddStage(index + 1)}>
                  <LuPlusCircle
                    style={{
                      color: "var(--color-save-btn)",
                      width: "25px",
                      height: "25px",
                    }}
                  />
                </IconButton>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Automation Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAutomationMenuClose}
        PaperProps={{
          style: {
            maxHeight: 200,
            overflowY: "auto",
          },
        }}
      >
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Email")}>
          Send Email
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Invoice")}>
          Send Invoice
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send Proposal/Els")}>
          Send Proposal/Els
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Organizer")}>
          Create Organizer
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Apply folder template")}>
          Apply folder template
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update account tags")}>
          Update account tags
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update job assignees")}>
          Update job assignees
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Create Task")}>
          Create Task
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Send message")}>
          Send message
        </MenuItem>
        <MenuItem onClick={() => handleAddAutomation(stageSelected, "Update client-facing job status")}>
          Update client-facing job status
        </MenuItem>
      </Menu>

      {/* Automation Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{ 
          sx: { 
            width: { xs: "100%", sm: "600px", md: "700px" },
            padding: 2
          } 
        }}
      >
        <Box sx={{ padding: 2, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5">
              {stageSelected !== null && stages[stageSelected]?.automations?.length > 0 
                ? `Edit Automations - Stage ${stageSelected + 1}` 
                : `Add Automations - Stage ${stageSelected !== null ? stageSelected + 1 : 'Loading...'}`
              }
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              <RiDeleteBin6Line />
            </IconButton>
          </Box>
          
          {/* Automation List - Scrollable area */}
          <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
            {drawerAutomations.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No automations added yet. Click "Add Another Automation" to get started.
                </Typography>
              </Box>
            ) : (
              drawerAutomations.map((automation, idx) => (
                <Box 
                  key={automation.id || idx} 
                  sx={{ 
                    mb: 3, 
                    p: 2, 
                    border: "1px solid #e0e0e0", 
                    borderRadius: "8px",
                    position: "relative"
                  }}
                >
                  <IconButton
                    onClick={() => handleDeleteAutomation(idx)}
                    sx={{ 
                      position: "absolute", 
                      top: 8, 
                      right: 8,
                      color: "red",
                      backgroundColor: "rgba(255,255,255,0.8)",
                      '&:hover': {
                        backgroundColor: "rgba(255,0,0,0.1)"
                      }
                    }}
                    size="small"
                  >
                    <RiDeleteBin6Line />
                  </IconButton>
                  
                  <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>
                    Automation {automation.index}: {automation.type}
                  </Typography>
                 {renderActionContent(automation, idx)}
                </Box>
              ))
            )}
          </Box>

          {/* Footer with Action Buttons */}
          <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 2 }}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                startIcon={<LuPlusCircle />}
                onClick={handleDrawerMenuOpen}
                sx={{ borderRadius: "8px" }}
              >
                Add Another Automation
              </Button>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleSaveAllAutomations}
              disabled={drawerAutomations.length === 0 || stageSelected === null}
              sx={{
                backgroundColor: "var(--color-save-btn)",
                "&:hover": {
                  backgroundColor: "var(--color-save-hover-btn)",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                  color: "#666"
                },
                borderRadius: "8px",
                py: 1.5
              }}
            >
              {stageSelected === null 
                ? 'No Stage Selected' 
                : stages[stageSelected]?.automations?.length > 0 
                  ? `Update Automations (${drawerAutomations.length})`
                  : `Save Automations (${drawerAutomations.length})`
              }
            </Button>
          </Box>

          {/* Drawer Menu for Adding More Automations */}
          <Menu
            anchorEl={drawerAnchorEl}
            open={Boolean(drawerAnchorEl)}
            onClose={handleDrawerMenuClose}
            PaperProps={{
              style: {
                maxHeight: 200,
                overflowY: "auto",
              },
            }}
          >
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Email")}>
              Send Email
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Invoice")}>
              Send Invoice
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Send Proposal/Els")}>
              Send Proposal/Els
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Organizer")}>
              Create Organizer
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Apply folder template")}>
              Apply folder template
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Update account tags")}>
              Update account tags
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Update job assignees")}>
              Update job assignees
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Create Task")}>
              Create Task
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Send message")}>
              Send message
            </MenuItem>
            <MenuItem onClick={() => handleDrawerMenuItemSelect("Update client-facing job status")}>
              Update client-facing job status
            </MenuItem>
          </Menu>
        </Box>
      </Drawer>
     
      <Drawer
        anchor="right"
        open={isConditionsFormOpen}
        onClose={handleGoBack}
        BackdropProps={{ invisible: true }}
        PaperProps={{ sx: { width: "550px", padding: 2 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handleGoBack}>
            <IoMdArrowRoundBack fontSize="large" color="blue" />
          </IconButton>
          <Typography variant="h6">Add conditions</Typography>
        </Box>

        <Box sx={{ padding: 2 }}>
          <Typography variant="body1">
            Apply automation only for accounts with these tags
          </Typography>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
            }}
            sx={{ marginTop: 2 }}
          />

          <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
            {filteredTags.map((tag) => (
              <Box
                key={tag._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  borderBottom: "1px solid grey",
                  paddingBottom: 1,
                }}
              >
                <Checkbox
                  checked={tempSelectedTags.some(selectedTag => selectedTag._id === tag._id)}
                  onChange={() => handleCheckboxChange(tag)}
                />
                <Chip
                  label={tag.tagName}
                  sx={{
                    backgroundColor: tag.tagColour,
                    color: "#fff",
                    fontWeight: "500",
                    borderRadius: "20px",
                    marginRight: 1,
                  }}
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={tempSelectedTags.length === 0}
              onClick={handleAddTags}
              sx={{
                backgroundColor: "var(--color-save-btn)",
                "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
                borderRadius: "15px",
                width: "80px",
              }}
            >
              {currentAutomationIndex !== null && drawerAutomations[currentAutomationIndex]?.selectedTags?.length > 0 ? "Update" : "Add"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleGoBack}
              sx={{
                borderColor: "var(--color-border-cancel-btn)",
                color: "var(--color-save-btn)",
                "&:hover": {
                  backgroundColor: "var(--color-save-hover-btn)",
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
    </Box>
  );
};
export default StagesSection;
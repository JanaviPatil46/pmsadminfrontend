// // DocumentManager.js (optional file)
// import React from "react";

// const Folder = ({ name, content, onDelete, onEdit, currentPath = "", onPathSelect, selectedPath }) => {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const fullPath = currentPath ? `${currentPath}/${name}` : name;
//   const isSelected = selectedPath === fullPath;

//   return (
//     <div style={{ marginLeft: 20 }}>
//       <div
//         onClick={() => {
//           setIsOpen(!isOpen);
//           onPathSelect(fullPath); // Notify parent of selected path
//         }}
//         style={{
//           cursor: "pointer",
//           fontWeight: "bold",
//           backgroundColor: isSelected ? "#e0f7fa" : "transparent",
//           padding: "4px",
//           borderRadius: "4px",
//         }}
//       >
//         📁 {name} 
//       </div>

//       {isOpen && (
//         <div style={{ marginLeft: 20 }}>
//           {Object.entries(content).map(([subfolder, subcontent]) =>
//             subfolder !== "files" ? (
//               <Folder
//                 key={subfolder}
//                 name={subfolder}
//                 content={subcontent}
//                 currentPath={fullPath}
//                 onDelete={onDelete}
//                 onEdit={onEdit}
//                 onPathSelect={onPathSelect}
//                 selectedPath={selectedPath}
//               />
//             ) : null
//           )}
//           {content.files &&
//             content.files
//               .filter((file) => file.filename !== "#$default.txt")
//               .map((file) => (
//                 <div key={file._id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                   📄 {file.filename}
//                   {file.permissions.canDownload && (
//                     <a href={`http://127.0.0.1:8000/${file.filePath}/${file.filename}`} download>
//                       ⬇️
//                     </a>
//                   )}
//                   {file.permissions.canUpdate && <button onClick={() => onEdit(file)}>✏️</button>}
//                   {file.permissions.canDelete && <button onClick={() => onDelete(file)}>🗑️</button>}
//                 </div>
//               ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // const Folder = ({ name, content, onDelete, onEdit }) => {
// //   const [isOpen, setIsOpen] = React.useState(false);

// //   return (
// //     <div style={{ marginLeft: 20 }}>
// //       <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer", fontWeight: "bold" }}>
// //         📁 {name}
// //       </div>
// //       {isOpen && (
// //         <div style={{ marginLeft: 20 }}>
// //           {Object.entries(content).map(([subfolder, subcontent]) =>
// //             subfolder !== "files" ? (
// //               <Folder key={subfolder} name={subfolder} content={subcontent} onDelete={onDelete} onEdit={onEdit} />
// //             ) : null
// //           )}
// //           {content.files &&
// //             content.files
// //               .filter((file) => file.filename !== "#$default.txt")
// //               .map((file) => (
// //                 <div key={file._id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
// //                   📄 {file.filename}
// //                   {file.permissions.canDownload && (
// //                     <a href={`http://127.0.0.1:8000/${file.filePath}/${file.filename}`} download>
// //                       ⬇️
// //                     </a>
// //                   )}
// //                   {file.permissions.canUpdate && <button onClick={() => onEdit(file)}>✏️</button>}
// //                   {file.permissions.canDelete && <button onClick={() => onDelete(file)}>🗑️</button>}
// //                 </div>
// //               ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const DocumentManager = ({ files }) => {
// //   const folderStructure = organizeFilesIntoFolders(files);
// //   console.log("janvi",folderStructure)

// //   const handleDelete = (file) => {
// //     console.log("Deleting file:", file);
// //   };

// //   const handleEdit = (file) => {
// //     console.log("Editing file:", file);
// //   };

// //   return (
// //     <div>
// //       {Object.entries(folderStructure).map(([folder, content]) => (
// //         <Folder key={folder} name={folder} content={content} onDelete={handleDelete} onEdit={handleEdit} />
// //       ))}
// //     </div>
// //   );
// // };
// const DocumentManager = ({ files, onPathSelect, selectedPath }) => {
//   const folderStructure = organizeFilesIntoFolders(files);

//   const handleDelete = (file) => {
//     console.log("Deleting file:", file);
//   };

//   const handleEdit = (file) => {
//     console.log("Editing file:", file);
//   };

//   return (
//     <div>
//       {Object.entries(folderStructure).map(([folder, content]) => (
//         <Folder
//           key={folder}
//           name={folder}
//           content={content}
//           onDelete={handleDelete}
//           onEdit={handleEdit}
//           currentPath=""
//           onPathSelect={onPathSelect}
//           selectedPath={selectedPath}
//         />
//       ))}
//     </div>
//   );
// };

// const organizeFilesIntoFolders = (files = []) => {
//   if (!Array.isArray(files)) {
//     console.error("Files data is not an array", files);
//     return {};
//   }

//   const folderTree = {};

//   files.forEach((file) => {
//     if (!file.filePath) return;

//     const pathParts = file.filePath.split("/");
//     let currentLevel = folderTree;

//     pathParts.forEach((part, index) => {
//       if (!currentLevel[part]) {
//         currentLevel[part] = {};
//       }

//       if (index === pathParts.length - 1) {
//         if (!currentLevel[part].files) {
//           currentLevel[part].files = [];
//         }
//         currentLevel[part].files.push(file);
//       }

//       currentLevel = currentLevel[part];
//     });
//   });

//   return folderTree;
// };




// export default DocumentManager;


// import React, { useState } from "react";

// const Folder = ({
//   name,
//   content,
//   onDelete,
//   onEdit,
//   currentPath = "",
//   onPathSelect,
//   selectedPath,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const fullPath = currentPath ? `${currentPath}/${name}` : name;
//   const isSelected = selectedPath === fullPath;

//   return (
//     <div style={{ marginLeft: 20 }}>
//       <div
//         onClick={() => {
//           setIsOpen(!isOpen);
//           onPathSelect(fullPath);
//         }}
//         style={{
//           cursor: "pointer",
//           fontWeight: "bold",
//           backgroundColor: isSelected ? "#e0f7fa" : "transparent",
//           padding: "4px",
//           borderRadius: "4px",
//         }}
//       >
//         📁 {name}
//       </div>

//       {isOpen && (
//         <div style={{ marginLeft: 20 }}>
//           {Object.entries(content).map(([subfolder, subcontent]) =>
//             subfolder !== "files" ? (
//               <Folder
//                 key={subfolder}
//                 name={subfolder}
//                 content={subcontent}
//                 currentPath={fullPath}
//                 onDelete={onDelete}
//                 onEdit={onEdit}
//                 onPathSelect={onPathSelect}
//                 selectedPath={selectedPath}
//               />
//             ) : null
//           )}

//           {content.files ? (
//             content.files.filter((f) => f.filename !== "#$default.txt").length > 0 ? (
//               content.files
//                 .filter((f) => f.filename !== "#$default.txt")
//                 .map((file) => (
//                   <div
//                     key={file._id}
//                     style={{ display: "flex", alignItems: "center", gap: "10px" }}
//                   >
//                     📄 {file.filename}
//                     {file.permissions?.canDownload && (
//                       <a
//                         href={`http://127.0.0.1:8000/${file.filePath}/${file.filename}`}
//                         download
//                       >
//                         ⬇️
//                       </a>
//                     )}
//                     {file.permissions?.canUpdate && (
//                       <button onClick={() => onEdit(file)}>✏️</button>
//                     )}
//                     {file.permissions?.canDelete && (
//                       <button onClick={() => onDelete(file)}>🗑️</button>
//                     )}
//                   </div>
//                 ))
//             ) : (
//               <div style={{ fontStyle: "italic", color: "#888" }}>
               
//               </div>
//             )
//           ) : (
//             <div style={{ fontStyle: "italic", color: "#888" }}>
              
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const DocumentManager = ({ folderName, contents, onPathSelect, selectedPath }) => {
//   const folderStructure = buildFolderStructure(folderName, contents);

//   const handleDelete = (file) => {
//     console.log("Deleting file:", file);
//   };

//   const handleEdit = (file) => {
//     console.log("Editing file:", file);
//   };

//   return (
//     <div>
//       {Object.entries(folderStructure).map(([folder, content]) => (
//         <Folder
//           key={folder}
//           name={folder}
//           content={content}
//           onDelete={handleDelete}
//           onEdit={handleEdit}
//           currentPath=""
//           onPathSelect={onPathSelect}
//           selectedPath={selectedPath}
//         />
//       ))}
//     </div>
//   );
// };

// // Utility to create folder tree even if it's empty
// const buildFolderStructure = (folderName, contents = []) => {
//   const root = {};
//   const pathParts = folderName.split("/");

//   let current = root;
//   for (const part of pathParts) {
//     if (!current[part]) current[part] = {};
//     current = current[part];
//   }

//   // Attach files if any
//   current.files = contents
//     .map((item) => item.metadata)
//     .filter((file) => file && file.filename); // safety check

//   return root;
// };

// export default DocumentManager;

import React, { useState } from "react";

const Folder = ({
  name,
  content,
  onDelete,
  onEdit,
  currentPath = "",
  onPathSelect,
  selectedPath,
}) => {
  console.log("janavi",content)
  const [isOpen, setIsOpen] = useState(false);
  const fullPath = currentPath ? `${currentPath}/${name}` : name;
  const isSelected = selectedPath === fullPath;

  const toggleFolder = () => {
    setIsOpen(!isOpen);
    onPathSelect(fullPath);
  };

  return (
    <div className="ml-4">
      <div
        onClick={toggleFolder}
        className="flex items-center gap-1.5 cursor-pointer font-semibold text-sm text-gray-700 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span>{isOpen ? "📂" : "📁"}</span>
        <span>{name}</span>
      </div>

      {isOpen && (
        <div className="ml-4 pl-2 border-l border-dashed border-gray-200">
          {Object.entries(content).map(([subfolder, subcontent]) =>
            subfolder !== "files" ? (
              <Folder
                key={subfolder}
                name={subfolder}
                content={subcontent}
                currentPath={fullPath}
                onDelete={onDelete}
                onEdit={onEdit}
                onPathSelect={onPathSelect}
                selectedPath={selectedPath}
              />
            ) : null
          )}

          {content.files && content.files.length > 0 ? (
            content.files
              .filter((f) => f.filename !== "#$default.txt")
              .map((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg my-0.5 bg-gray-50 text-sm"
                >
                  <div className="flex items-center gap-1.5 text-gray-600">
                    📄 {file.filename}
                  </div>
                  <div className="flex items-center gap-2">
                    {file.permissions?.canDownload && (
                      <a
                        href={`http://127.0.0.1:8000/${file.filePath}/${file.filename}`}
                        download
                        title="Download"
                        className="text-blue-500 hover:text-blue-700 text-xs"
                      >
                        ⬇️
                      </a>
                    )}
                    {file.permissions?.canUpdate && (
                      <button onClick={() => onEdit(file)} title="Edit" className="text-gray-400 hover:text-gray-600 text-xs">
                        ✏️
                      </button>
                    )}
                    {file.permissions?.canDelete && (
                      <button onClick={() => onDelete(file)} title="Delete" className="text-gray-400 hover:text-red-500 text-xs">
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))
          ) : null}
        </div>
      )}
    </div>
  );
};

const DocumentManager = ({ folderName, contents, onPathSelect, selectedPath }) => {
  const folderStructure = buildFolderStructure(folderName, contents);

  const handleDelete = (file) => {
    console.log("Deleting file:", file);
  };

  const handleEdit = (file) => {
    console.log("Editing file:", file);
  };

  return (
    <div className="text-sm">
      {Object.entries(folderStructure).map(([folder, content]) => (
        <Folder
          key={folder}
          name={folder}
          content={content}
          onDelete={handleDelete}
          onEdit={handleEdit}
          currentPath=""
          onPathSelect={onPathSelect}
          selectedPath={selectedPath}
        />
      ))}
    </div>
  );
};

// Utility to create folder tree even if it's empty
// const buildFolderStructure = (folderName, contents = []) => {
//   const root = {};
//   const pathParts = folderName.split("/");

//   let current = root;
//   for (const part of pathParts) {
//     if (!current[part]) current[part] = {};
//     current = current[part];
//   }

//   // Attach files
//   current.files = contents
//     .map((item) => item.metadata)
//     .filter((file) => file && file.filename);

//   return root;
// };

// const buildFolderStructure = (folderName, contents = []) => {
//   if (!folderName || typeof folderName !== "string") return {};

//   const root = {};
//   const pathParts = folderName.split("/");

//   let current = root;
//   for (const part of pathParts) {
//     if (!current[part]) current[part] = {};
//     current = current[part];
//   }

//   current.files = contents
//     .map((item) => item.metadata)
//     .filter((file) => file && file.filename);

//   return root;
// };
const buildFolderStructure = (folderName, contents = []) => {
  if (!folderName || typeof folderName !== "string") return {};

  const root = {};
  const pathParts = folderName.split("/");

  let current = root;
  for (const part of pathParts) {
    if (!current[part]) current[part] = {};
    current = current[part];
  }

  current.files = [];
  contents.forEach((item) => {
    if (item.file && item.metadata) {
      // It's a file
      current.files.push(item.metadata);
    } else if (item.folder) {
      // It's a folder
      current[item.folder] = { files: [] };
    }
  });

  return root;
};

export default DocumentManager;

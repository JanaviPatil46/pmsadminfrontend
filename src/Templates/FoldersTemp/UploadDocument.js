import "./foldertemp.css";
const UploadDocument = ({ isDocumentForm,handleUploadFormClose }) => {
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  

 
  if (!isDocumentForm) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div className="absolute inset-0 bg-black/30" onClick={handleUploadFormClose} />
      <div className="absolute right-0 top-0 h-full w-[800px] bg-white shadow-xl overflow-y-auto p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Upload Documents</h2>
        </div>
        <hr className="border-gray-200 my-3" />
        <div className="flex gap-4 mt-2">
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;

import React from "react";
import { FormDrawer, FormSection } from "../../components/ui/form-layout";

const UploadDocument = ({ isSendFolderForm, handleUploadFormClose }) => {
  const API_KEY = process.env.REACT_APP_FOLDER_URL;

  return (
    <FormDrawer
      open={isSendFolderForm}
      onClose={handleUploadFormClose}
      title="Select Folder to Upload"
      width="xl"
    >
      <FormSection title="Folder Selection">
        {/* Content placeholder — add folder tree or upload UI here */}
      </FormSection>
    </FormDrawer>
  );
};

export default UploadDocument;

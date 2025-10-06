import React from "react";

function EmailViewer({ selectedEmail }) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "10px",
        height: "100%",
      }}
    >
      {selectedEmail ? (
        <div
          dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
          style={{ width: "100%" }}
        />
      ) : (
        <p>Select an email to read</p>
      )}
    </div>
  );
}

export default EmailViewer;

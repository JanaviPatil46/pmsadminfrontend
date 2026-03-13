import { Link, Outlet, useLocation } from "react-router-dom";

const EmailLayout = () => {
  const location = useLocation();
  const isInbox = location.pathname.includes("inbox");
  const isSent = location.pathname.includes("sent");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Top nav tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "8px 16px",
          borderBottom: "1px solid #f0f0f0",
          backgroundColor: "#fff",
          flexShrink: 0,
        }}
      >
        <Link
          to="inbox"
          style={{
            padding: "4px 16px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 500,
            textDecoration: "none",
            backgroundColor: isInbox ? "#00ACC1" : "transparent",
            color: isInbox ? "#fff" : "#666",
            transition: "all 0.2s",
          }}
        >
          Inbox
        </Link>
        <Link
          to="sent"
          style={{
            padding: "4px 16px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 500,
            textDecoration: "none",
            backgroundColor: isSent ? "#00ACC1" : "transparent",
            color: isSent ? "#fff" : "#666",
            transition: "all 0.2s",
          }}
        >
          Sent
        </Link>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default EmailLayout;

import { Link } from "react-router-dom";

export default function HostBottomNav({ eventId, hostSecret }) {
  if (!eventId || !hostSecret) return null;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-around",
        padding: "0.75rem 0",
        width: "50%",
        margin: "0 auto",
        color: "black",
        background: "rgba(255, 255, 255, 0.01)",
        boxShadow: "inset 0 6px 6px 0 rgba(255, 255, 255, 0.3)",
        borderRadius: "6px"
      }}
    >
      <Link to={`/host/${eventId}/${hostSecret}`}>The Details</Link>
      <Link to={`/host/${eventId}/${hostSecret}/invitation`}>The Invitation</Link>
      <Link to={`/host/${eventId}/${hostSecret}/themaking`}>The Making</Link>
      <Link to={`/host/${eventId}/${hostSecret}/thepotluck`}>The Potluck</Link>
    </nav>
  );
}

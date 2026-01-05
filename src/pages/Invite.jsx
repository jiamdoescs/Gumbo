import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Invite() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
const inputStyle = {
    
    width: "70%",
    padding: "0.75rem 2.5rem 0.75rem 0.75rem",
    fontSize: "1rem",
    borderRadius: "0px",
    border: "0px",
    backgroundColor: "#F3F3F3",
     outline: "none",           // removes blue outline on click
  boxShadow: "none" ,
  fontFamily: "inherit",
    zIndex: "0",
    color: "black"

   
  };
   const inputTitleStyle = {
    width: "70%",
    padding: "0.75rem 2.5rem 0.75rem 0.75rem",
    fontSize: "2.5rem",
    borderRadius: "0px",
    color: "black",
    border: "0px",
    backgroundColor: "#F3F3F3",
     outline: "none",           // removes blue outline on click
  boxShadow: "none",
    zIndex: "0" ,
    fontFamily: "inherit" 
  };
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);

        if (!eventSnap.exists()) {
          setEvent(null);
        } else {
          setEvent(eventSnap.data());
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <div>Loading…</div>;
  if (!event) return <div>Event not found.</div>;

  // Format datetime nicely
  const formattedDate =
    event.datetime?.seconds
      ? new Date(event.datetime.seconds * 1000).toLocaleString()
      : event.datetime?.toDate?.().toLocaleString() || "TBD";

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "1rem",
        fontFamily: "Courier Prime",
        color: "black"
      }}
    >
      {/* Event image */}
      <div style={{ marginBottom: "1rem" }}>
  <img
    src={event.imageUrl || "/running.jpg"} // use default if no imageUrl
    alt={event.title}
    style={{
      width: "100%",
      height: "50vh",
      maxHeight: "400px",
      objectFit: "cover",
      borderRadius: "8px",
    }}
  />
</div>

      <h2 style={inputTitleStyle}>{event.title}</h2>
      <p style={ inputStyle}>
        {formattedDate}
      </p>
      <p style={ inputStyle}>
       {event.location || "TBD"}
      </p>
      <p style={ inputStyle}>
       {event.format}
      </p>

      {/* Potluck categories */}
      {event.format === "potluck" && event.potluckCategories?.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <p style={ inputStyle}>Potluck Categories</p>
          <ul>
            {event.potluckCategories.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      <button  className="button" style={{  color: "black"}}
        onClick={() => navigate(`/event/${eventId}/rsvp`)}
        
      >
        RSVP Now
      </button>
    </div>
  );
}

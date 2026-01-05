import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HostBottomNav from "../components/HostBottomNav";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { FiEdit } from "react-icons/fi";

export default function EditInvitation() {
  const { eventId, hostSecret: key } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [title, setTitle] = useState("");
  const [datetime, setDatetime] = useState("");
  const [location, setLocation] = useState("");
  const [format, setFormat] = useState("dinner");
  const [potluckCategories, setPotluckCategories] = useState("");
  const [imageUrl, setImageUrl] = useState("/running.jpg");
  const [funnyQuestion, setFunnyQuestion] = useState(""); // <-- new state

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);

        if (!eventSnap.exists()) {
          setLoading(false);
          return;
        }

        const eventData = eventSnap.data();
        setEvent(eventData);

        if (key !== eventData.hostSecret) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Pre-fill fields
        setTitle(eventData.title || "");
        setDatetime(eventData.datetime?.toDate().toISOString().slice(0,16) || "");
        setLocation(eventData.location || "");
        setFormat(eventData.format || "dinner");
        setPotluckCategories((eventData.potluckCategories || []).join(","));
        setImageUrl(eventData.imageUrl || "/running.jpg");
        setFunnyQuestion(eventData.funnyQuestion || ""); // <-- prefill funny question

        setAuthorized(true);
      } catch (err) {
        console.error("Error loading invitation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, key]);

  const handleSave = async () => {
    if (!event) return;

    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      title,
      datetime: Timestamp.fromDate(new Date(datetime)),
      location,
      format,
      potluckCategories:
        format === "potluck"
          ? potluckCategories.split(",").map(c => c.trim())
          : [],
      imageUrl,
      funnyQuestion, // <-- save the updated question
    });

    alert("invitation updated :)");
  };

  if (loading) return <div>Loading…</div>;
  if (!authorized) return <div>This page is not for you.</div>;

  const inputContainerStyle = {
    position: "relative",
    display: "block",
    marginBottom: "1.5rem",
  };

  const inputStyle = {
    width: "70%",
    padding: "0.75rem 2.5rem 0.75rem 0.75rem",
    fontSize: "1rem",
    borderRadius: "0px",
    border: "0px",
    backgroundColor: "#F3F3F3",
    outline: "none",
    boxShadow: "none",
    fontFamily: "inherit",
    zIndex: "0",
    color: "black",
  };

  const inputTitleStyle = {
    ...inputStyle,
    fontSize: "2.5rem",
  };

  const iconStyle = {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "black",
    fontSize: "1.2rem",
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "Courier Prime", color: "black" , padding: "1rem"}}>
      <h2 style={{color: "black"}}>The Invitation</h2>

      {/* Event image */}
      <div style={{ marginBottom: "1rem" }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Event"
            style={{ width: "100%", height: "50vh", maxHeight: "100%", objectFit: "cover", borderRadius: "0px", flexShrink: "0" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "200px",
              backgroundColor: "#eee",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
              marginBottom: "0.5rem",
              flexShrink: 0
            }}
          >
            No Image
          </div>
        )}

        <label style={inputContainerStyle}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Paste image URL here"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />
        </label>
      </div>

      {/* Title */}
      <label style={inputContainerStyle}>
        <textarea value={title} onChange={e => setTitle(e.target.value)} style={inputTitleStyle} />
        <FiEdit style={iconStyle} />
      </label>

      {/* Date & Time */}
      <label style={inputContainerStyle}>
        <input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} style={inputStyle} />
        <FiEdit style={iconStyle} />
      </label>

      {/* Location */}
      <label style={inputContainerStyle}>
        <textarea value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
        <FiEdit style={iconStyle} />
      </label>

      {/* Format */}
      <label style={inputContainerStyle}>
        <select value={format} onChange={e => setFormat(e.target.value)} style={{ ...inputStyle, appearance: "none", paddingRight: "2.5rem" }}>
          <option value="dinner">Dinner</option>
          <option value="potluck">Potluck</option>
        </select>
        <FiEdit style={iconStyle} />
      </label>

      {/* Potluck categories */}
      {format === "potluck" && (
        <label style={inputContainerStyle}>
          <input
            value={potluckCategories}
            onChange={e => setPotluckCategories(e.target.value)}
            placeholder="Vegetarian dish, Dessert, Drink"
            style={inputStyle}
          />
          <FiEdit style={iconStyle} />
        </label>
      )}

      {/* Funny/Meaningful question */}
      <label style={inputContainerStyle}>
        <input
          value={funnyQuestion}
          onChange={e => setFunnyQuestion(e.target.value)}
          placeholder="meaningful question for seating arrangement"
          style={inputStyle}
        />
        <FiEdit style={iconStyle} />
      </label>

      <button onClick={handleSave} className="button" style={{ marginBottom: "4rem", color: "black" }}>
        Save Invitation
      </button>

      <HostBottomNav eventId={eventId} hostSecret={key} style={{ zIndex: -10 }} />
    </div>
  );
}

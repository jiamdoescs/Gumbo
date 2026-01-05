import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiCopy } from "react-icons/fi";

import {
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { nanoid } from "nanoid";

const RSVP = () => {
  const { eventId, guestId: paramGuestId } = useParams(); // optional guestId from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [guestId, setGuestId] = useState(paramGuestId || null);
  const [form, setForm] = useState({
    name: "",
    rsvp: "yes",
    allergens: "",
    funnyAnswer: "",
    potluckChoice: "",
    plusOneName: "",
    plusOnePhone: "",
  });
  const [takenCategories, setTakenCategories] = useState([]);

  const inputStyle = {
    border: "0",
    borderBottom: "1px solid black",
    width: "70%",
    padding: "0.75rem 2.5rem 0.75rem 0.75rem",
    fontSize: "1rem",
    backgroundColor: "#F3F3F3",
    outline: "none",
    boxShadow: "none",
    fontFamily: "inherit",
    color: "black",
    borderRadius: "0px",
  };

  // Fetch event and existing guest data if guestId exists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);
        if (!eventSnap.exists()) {
          setEvent(null);
          setLoading(false);
          return;
        }
        const eventData = eventSnap.data();
        setEvent(eventData);

        // Fetch taken potluck categories
        if (eventData.format === "potluck") {
          const guestsRef = collection(db, "guests");
          const q = query(guestsRef, where("eventId", "==", eventId));
          const qSnap = await getDocs(q);
          const taken = qSnap.docs
            .map(d => d.data().potluckChoice)
            .filter(Boolean);
          setTakenCategories(taken);
        }

        // Load guest data if guestId exists in URL
        if (paramGuestId) {
          const guestRef = doc(db, "guests", paramGuestId);
          const guestSnap = await getDoc(guestRef);
          if (guestSnap.exists()) {
            setForm(guestSnap.data());
            setGuestId(paramGuestId);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, paramGuestId]);

  if (loading) return <div>Loading…</div>;
  if (!event) return <div>Event not found.</div>;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const id = guestId || nanoid(); // use existing guestId or generate new

      await setDoc(doc(db, "guests", id), {
        ...form,
        eventId,
        potluckChoice: event.format === "potluck" ? form.potluckChoice : null,
        createdAt: new Date(),
      });

      setGuestId(id); // save guestId so link appears
      alert("RSVP saved! Your personalized link is below.");
    } catch (err) {
      console.error("Error saving RSVP:", err);
    }
  };

  const guestLink = guestId
    ? `${window.location.origin}/event/${eventId}/rsvp/${guestId}`
    : null;

  return (
    
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
     
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

      <h2 style={{ color: "black" }}>{event.title}</h2>

      <form style={{ color: "black" }} onSubmit={handleSubmit}>
        <label>
          Your Name
          <input
            style={inputStyle}
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Will you attend?
          <select
            style={{ color: "black" }}
            name="rsvp"
            value={form.rsvp}
            onChange={handleChange}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <label>
          Allergens / Dietary Restrictions
          <input
            style={inputStyle}
            name="allergens"
            value={form.allergens}
            onChange={handleChange}
          />
        </label>

        <label>
          {event.funnyQuestion || "Funny / Meaningful Question"}
          <input
            style={inputStyle}
            name="funnyAnswer"
            value={form.funnyAnswer}
            onChange={handleChange}
          />
        </label>

        {event.format === "potluck" && (
          <label>
            What are you bringing? (Select a category)
            <select
              name="potluckChoice"
              value={form.potluckChoice}
              onChange={handleChange}
              style={{ color: "black" }}
              required={takenCategories.length < event.potluckCategories.length}

            >
              <option value="">-- Choose a category --</option>
              {event.potluckCategories.map(cat => {
                const taken =
                  takenCategories.includes(cat) && form.potluckChoice !== cat;
                return (
                  <option key={cat} value={cat} disabled={taken}>
                    {cat} {taken ? "(taken)" : ""}
                  </option>
                );
              })}
            </select>
          </label>
        )}

        <p>Plus One (optional)</p>
        <label>
          Name
          <input
            style={inputStyle}
            name="plusOneName"
            value={form.plusOneName}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone
          <input
            style={inputStyle}
            name="plusOnePhone"
            value={form.plusOnePhone}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          className="button"
          style={{ color: "black", marginTop: "1rem" }}
        >
          Save RSVP
        </button>
      </form>

      {/* Personalized link section */}
      {guestLink && (
        <div
          style={{
            marginTop: "2rem",
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "6px",
            color: "black",
          }}
        >
          <p>Save this invite to edit later</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              className="button"
              onClick={() => navigator.clipboard.writeText(guestLink)}
              w
            >
              <FiCopy color="black" size={18} />
            </button>
            <p style={{ overflowWrap: "break-word", maxWidth: "50%"}}>{guestLink}</p>
          </div>
          <p>Use this link to edit your RSVP anytime!</p>
        </div>
      )}
    </div>
  );
};

export default RSVP;

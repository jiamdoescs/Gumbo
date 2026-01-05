// src/pages/Potluck.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import HostBottomNav from "../components/HostBottomNav";

export default function Potluck() {
  const { eventId, hostSecret: key } = useParams();
  const [event, setEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

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

        // Check host authorization
        if (key !== eventData.hostSecret) {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }

        // Fetch guests
        const guestsRef = collection(db, "guests");
        const guestSnap = await getDocs(
          query(guestsRef, where("eventId", "==", eventId))
        );
        setGuests(guestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error loading potluck:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, key]);

  if (loading) return <div>Loading…</div>;
  if (!authorized) return <div>This page is not for you.</div>;
  if (!event || event.format !== "potluck") return (        <div className="page-container">
<p style={{color:"black", margin:"auto"}}>This event is not a potluck.</p>
      <HostBottomNav eventId={eventId} hostSecret={key} />
</div>

    

);

  // Group guests by potluck category
  const categoryMap = {};
  guests.forEach(guest => {
    if (guest.potluckChoice) {
      if (!categoryMap[guest.potluckChoice]) categoryMap[guest.potluckChoice] = [];
      categoryMap[guest.potluckChoice].push(guest.name);
    }
  });

  // Find unclaimed categories
  const unclaimed = event.potluckCategories.filter(cat => !categoryMap[cat]);

  return (

        <div className="page-container">
      <div className="hostPageContent">
      <h2 style={{color:"black"}}>Potluck Summary for {event.title}</h2>

      {event.potluckCategories.map(cat => (
        <div key={cat} style={{ marginBottom: "0.5rem" }}>
          <strong>{cat}:</strong> {categoryMap[cat] ? categoryMap[cat].join(", ") : "No one yet"}
        </div>
      ))}

      {unclaimed.length > 0 && (
        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
          Categories still open: {unclaimed.join(", ")}
        </p>
      )}
      
    </div>
    <div display="block" className="images" style={{ zIndex: 0, height: "60vh", marginTop: "0px" }}>
 <img
    src="/deliciousfood.jpg"
    alt="Sandwich"
  />
  <p
    style={{
      position: "absolute",
      bottom: "2rem",
      left: "0.5rem",
      fontSize: "1.5rem",
    fontFamily: "Cedarville Cursive",
    color: "darkblue"
    }}
  >
    august 10th, 2025
  </p>       

      </div>
      <HostBottomNav eventId={eventId} hostSecret={key} />
    </div>

  );
}

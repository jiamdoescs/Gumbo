import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiCopy } from "react-icons/fi";
import HostBottomNav from "../components/HostBottomNav";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";

const HostDashboard = () => {
  const { eventId } = useParams();
  const { hostSecret: key } = useParams();
  const [event, setEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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

        setAuthorized(true);

        const q = query(
          collection(db, "guests"),
          where("eventId", "==", eventId)
        );
        const guestSnap = await getDocs(q);

        setGuests(
          guestSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        );
      } catch (err) {
        console.error("Error loading host dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, key]);

  if (loading) return <div>Loading…</div>;
    
  
  if (!authorized) {
    return <div>This page is not for you.</div>;
  }

const hostLink = `${window.location.origin}/host/${eventId}/${event.hostSecret}`;
  const guestLink = `${window.location.origin}/event/${eventId}`;
  const attending = guests.filter(g => g.rsvp === "yes");

  return (

    

  <div
  className="page-container"
  >

    <div className="hostPageContent">



      <h2 >The Details</h2>
      <div div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button className="button" onClick={() => navigator.clipboard.writeText(hostLink)}>
          <FiCopy color="black" size={18} />
        </button>
        <p>Host Dashboard (private)</p><br/>
        {/* <input className="input"type="text" readOnly value={hostLink} style={{ width: "100%" }} /> */}
      </div>  

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button className="button" onClick={() => navigator.clipboard.writeText(guestLink)}>
          <FiCopy color="black" size={18} />
        </button>
        <p>Guest link</p><br/>
        {/* <input className="input" type="text" color="black" readOnly value={guestLink} style={{ width: "100%"  }} />*/}
        
      </div>
    
      <h2 >{event.title}</h2>
      <p>
        {new Date(event.datetime.seconds * 1000).toLocaleString()}
        <br />
        {event.location}
      </p>

      <p>Overview</p>
      <ul>
        <li>Attending : {attending.length}</li>
      </ul>

      <p>Guests</p>
      <ul>
        {guests.map(g => (
          <li key={g.id}>
            {g.name} — RSVP: {g.rsvp}
            {g.potluckChoice && ` — ${g.potluckChoice}`}
            {g.allergens && ` — Allergens: ${g.allergens}`}
          </li>
        ))}
      </ul>

  
 </div >
    <div className="images" style={{ zIndex: 0, height: "60vh" , marginRight: "100px"}}
  >
    <img src="/basketball.jpg" alt="" />
    <img src="/food.png" alt="" />
    <p
    style={{
      position: "absolute",
      bottom: "6rem",
      left: "0.5rem",
      fontSize: "1.5rem",
    fontFamily: "Cedarville Cursive",
    color: "darkblue"
    }}
  >
    december 4th, 2024
  </p>     
  </div>
  <HostBottomNav eventId={eventId} hostSecret={key} />


  </div>

  

    
    
  );
};

export default HostDashboard;

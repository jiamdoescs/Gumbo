// src/pages/Todo.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, addDoc, updateDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import HostBottomNav from "../components/HostBottomNav";
import Countdown from "../components/Countdown";
import SeatingArrangement from "../components/SeatingArrangement";
import MenuManager from "../components/Menu";

import { FiCopy } from "react-icons/fi";

export default function TheMaking() {
  const { eventId, hostSecret: key } = useParams();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
const [guests, setGuests] = useState([]);
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
  // Load event and check hostSecret
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

        setAuthorized(true);

        // Fetch todos
        const todosRef = collection(db, "events", eventId, "todos");
        const todoSnap = await getDocs(todosRef);
        setTodos(todoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
        const guestsRef = collection(db, "guests");
        const guestSnap = await getDocs(
            query(guestsRef, where("eventId", "==", eventId))
        );
        setGuests(guestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    
    } catch (err) {
        console.error("Error loading todos:", err);
      } finally {
        setLoading(false);
      }

      
    };

    fetchEvent();
  }, [eventId, key]);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const todosRef = collection(db, "events", eventId, "todos");
    const docRef = await addDoc(todosRef, {
  text: newTodo,
  done: false,
  eventId,
  hostSecret: key,
});

    setTodos(prev => [...prev, { id: docRef.id, text: newTodo, done: false }]);
    setNewTodo("");
  };

  const toggleTodo = todo => {
  // Update state immediately so checkbox renders right away
  setTodos(prev =>
    prev.map(t => (t.id === todo.id ? { ...t, done: !t.done } : t))
  );

  // Then update Firestore asynchronously
  const todoRef = doc(db, "events", eventId, "todos", todo.id);
  updateDoc(todoRef, { done: !todo.done }).catch(err =>
    console.error("Error updating todo:", err)
  );
};


  const deleteTodo = async todo => {
    const todoRef = doc(db, "events", eventId, "todos", todo.id);
    await deleteDoc(todoRef);
    setTodos(prev => prev.filter(t => t.id !== todo.id));
  };

  if (loading) return <div>Loading…</div>;
  if (!authorized) return <div>This page is not for you.</div>;

  const hostLink = `${window.location.origin}/host/${eventId}/${event.hostSecret}`;
  const guestLink = `${window.location.origin}/event/${eventId}`;

  return (
    <div className="page-container">
      <div className="hostPageContent">
        
        <h2>Its All In The Seating</h2>
        <SeatingArrangement guests={guests} />
        <h2>The Making of {event.title}</h2>
          <Countdown targetDate={event.datetime.toDate()} />

        <div style={{ marginBottom: "1rem" }}>
          <input            
            style={inputStyle}
            type="text"
            value={newTodo}
            placeholder="book the room, buy the ingredients"
            onChange={e => setNewTodo(e.target.value)}
          />
          <button className="button" onClick={addTodo} style={{borderBottom: "1px solid black", marginLeft: "10px"}}>
            Add
          </button>
        </div>

        <p>Tasks</p>
        <ul>
          {todos.map(todo => (
            <li key={todo.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo)} />
              <span className={todo.done ? "todo-done" : ""}>{todo.text}</span>
              <button className="button" onClick={() => deleteTodo(todo)} >x</button>
            </li>
          ))}
        </ul>
          
      <h2>Menu</h2>
      <MenuManager guests={guests} numGuests={guests.length} />
      </div>

      <div display="block" className="images" style={{ zIndex: 0, height: "60vh", marginRight: "100px" }}>
 <img
    src="/sandwich.jpg"
    alt="Sandwich"
  />
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
    september 1st, 1990
  </p>       

      </div>

        
      <HostBottomNav eventId={eventId} hostSecret={key} />
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [datetime, setDatetime] = useState("");
  const [location, setLocation] = useState("");
  const [format, setFormat] = useState("dinner");
  const [potluckCategories, setPotluckCategories] = useState("");
  const [funnyQuestion, setFunnyQuestion] = useState(""); // new state

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const hostSecret = uuidv4();

      const eventData = {
        title,
        location,
        format,
        datetime: Timestamp.fromDate(new Date(datetime)),
        potluckCategories:
          format === "potluck"
            ? potluckCategories.split(",").map(c => c.trim())
            : [],
        funnyQuestion, // include the funny question
        hostSecret,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, "events"), eventData);

      navigate(`/host/${docRef.id}/${hostSecret}`);
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('/dinner.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          marginRight: "auto",
          marginLeft: "5rem",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <h1>gumbo</h1>
        <h2>intent is everything</h2>
        <h2>the making.</h2>
        <p>undecided? don't worry, it'll be filled in as TBD</p>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="input"
              placeholder="Title"
            />
          </label>

          <label>
            Date & Time
            <input
              type="datetime-local"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
              required
              className="input"
            />
          </label>

          <label>
            Location
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
              className="input"
            />
          </label>

          <label>
            Format
            <select value={format} onChange={e => setFormat(e.target.value)}>
              <option value="dinner">Dinner</option>
              <option value="potluck">Potluck</option>
            </select>
          </label>

          {format === "potluck" && (
            <label>
              Potluck categories (comma separated)
              <input
                placeholder="Vegetarian dish, Dessert, Drink"
                value={potluckCategories}
                onChange={e => setPotluckCategories(e.target.value)}
                className="input"
              />
            </label>
          )}

          {/* New funny question input */}
          <label>
            A Question with meaning
            <input
            
              placeholder="Ex: Chicken or the Egg?"
              value={funnyQuestion}
              onChange={e => setFunnyQuestion(e.target.value)}
              className="input"
            />
          </label>

          <button type="submit" className="button">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

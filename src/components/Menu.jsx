// src/components/MenuManager.jsx
import React, { useState } from "react";

export default function MenuManager({ guests = [], numGuests = 0, eventId }) {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Appetizer",
    quantity: 1,
    allergens: "",
  });

  const categories = ["Appetizer?", "Entree?"];

  const handleAddItem = () => {
    if (!newItem.name.trim() || newItem.quantity <= 0) return;
    setMenuItems(prev => [...prev, { ...newItem }]);
    setNewItem({ name: "", category: "Appetizer", quantity: 1, allergens: "" });
  };

  const handleDeleteItem = idx => {
    setMenuItems(prev => prev.filter((_, i) => i !== idx));
  };
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

  const checkAllergens = item => {
    return guests.filter(guest => {
      if (!guest.allergens) return false;
      const guestAllergens = guest.allergens.split(",").map(a => a.trim().toLowerCase());
      const itemAllergens = item.allergens.split(",").map(a => a.trim().toLowerCase());
      return guestAllergens.some(a => itemAllergens.includes(a));
    });
  };

  const totalServings = menuItems.reduce((sum, item) => sum + item.quantity, 0);
  const enoughFood = totalServings >= numGuests;

  return (
    <div style={{ marginTop: "1rem", color :"black"}}>

      <div style={{ width: "100%",display: "block", gap: "0.5rem", marginBottom: "1rem" , color: "black"}}>
        
        <label>
          Eating Things
          <input
            style={inputStyle}
            name="name"
            value={newItem.name}
            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
        </label>

        <select
        style={{width:"150px",borderBottom: "1px solid black", marginBottom: "1rem"}}
          value={newItem.category}
          onChange={e => setNewItem({ ...newItem, category: e.target.value })}
        
        >
            
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
        style={{ color: "black", width: "70px", borderBottom: "1px solid black", borderRadius: "0px", marginLeft: "10px"}}
          type="number"
          min="1"
          placeholder="Servings"
          value={newItem.quantity}
          onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
        />

        <label>
          Allergens
          <input
            style={inputStyle}
            name="name"
            value={newItem.allergens}
          onChange={e => setNewItem({ ...newItem, allergens: e.target.value })}
            required
          />
        </label>
        <button className="button" onClick={handleAddItem} style={{borderBottom: "1px solid black" ,borderRadius: "0px"}}>Add</button>
      </div>

      <h4>Menu Items</h4>
      {menuItems.length === 0 && <p>No items added yet.</p>}
      <ul>
        {menuItems.map((item, idx) => {
          const allergenGuests = checkAllergens(item);
          return (
            <li key={idx} style={{ marginBottom: "0.5rem" }}>
              <strong>{item.name}</strong> ({item.category}) – {item.quantity} servings
              {item.allergens && <span> | Allergens: {item.allergens}</span>}
              {allergenGuests.length > 0 && (
                <span style={{ color: "red" }}>
                  {" "}⚠ {allergenGuests.map(g => g.name).join(", ")} have allergens
                </span>
              )}
              <button onClick={() => handleDeleteItem(idx)} style={{ marginLeft: "0.5rem" }}>x</button>
            </li>
          );
        })}
      </ul>

      <p>Total servings: {totalServings} / Guests: {numGuests}</p>
      {!enoughFood && <p style={{ color: "red" }}>⚠ no, there's not enough food</p>}
      {enoughFood && <p style={{ color: "green" }}> the menu's ready</p>}
    </div>
  );
}

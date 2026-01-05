// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header style={{  backgroundColor: "#f3f3f3" }}>
      <img src="/dinner.jpg" alt="gumbo logo" style={{ width: "100%", height: "20vh", maxHeight: "100%", objectFit: "cover", borderRadius: "0px" }} />
      <h1 style={{fontFamily:"Cedarville Cursive", color: "white", margin: "0rem", marginLeft: "5rem", marginTop:"-10rem"}}>gumbo</h1>
      </header>

      <main style={{ padding: "0rem" }}>
        <Outlet />
      </main>
    </>
  );
}

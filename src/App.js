// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateEvent from "./pages/CreateEvent";
import HostDashboard from "./pages/HostDashboard";
import Invite from "./pages/Invite";
import RSVP from "./pages/RSVP";
import EditInvitation from "./pages/EditInvitation";
import TheMaking from "./pages/TheMaking";
import ThePotluck from "./pages/ThePotluck";
import Layout from "./components/Layout"; // renamed from Header

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout route */}
        <Route path="/" element={<CreateEvent />} />
        <Route element={<Layout />}>
          <Route path="/host/:eventId/:hostSecret" element={<HostDashboard />} />
          <Route path="/host/:eventId/:hostSecret/invitation" element={<EditInvitation />} />
          <Route path="/event/:eventId/rsvp/:guestId" element={<RSVP />} />
          <Route path="/event/:eventId" element={<Invite />} />
          <Route path="/event/:eventId/rsvp" element={<RSVP />} />
          <Route path="/host/:eventId/:hostSecret/themaking" element={<TheMaking />} />
          <Route path="/host/:eventId/:hostSecret/thepotluck" element={<ThePotluck />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

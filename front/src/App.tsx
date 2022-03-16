import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/AuthenticationPage";
import EmailValidation from "./pages/EmailValidationPage";
import ServiceLinkingPage from "./pages/ServiceLinkingPage";
import Home from "./pages/HomePage";
import Profile from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/auth" element={<Login />} />
        <Route path="/validate/*" element={<EmailValidation />} />
        <Route path="/github/link/*" element={<ServiceLinkingPage />} />
        <Route path="/trello/link/*" element={<ServiceLinkingPage />} />
        <Route path="/twitter/link/*" element={<ServiceLinkingPage />} />
        <Route path="/reddit/link/*" element={<ServiceLinkingPage />} />
        <Route path="/todoist/link/*" element={<ServiceLinkingPage />} />
        <Route path="/discord/link/*" element={<ServiceLinkingPage />} />
      </Routes>
    </Router>
  );
}

export default App;

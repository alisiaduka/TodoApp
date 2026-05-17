import React from "react";
import Login from "./pages/Login";
import Register from "./pages/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Account from "./pages/Account";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
};

export default App;

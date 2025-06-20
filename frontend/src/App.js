import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./components/pages/Home";
import Inventory from "./components/pages/Inventory";
import Reports from "./components/pages/Reports";
import BarItem from "./components/pages/BarItem";
import Calculator from "./components/pages/Cocktail calculator";
import RecipeForm from "./components/recipes/RecipeForm";
import Settings from "./components/pages/Settings";
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <Router>
      <div className="app-container">
        {/* Hamburger button */}
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        {/* Pass toggle state to Sidebar */}
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/bar-item" element={<BarItem />} />
            <Route path="/recipe" element={<RecipeForm />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
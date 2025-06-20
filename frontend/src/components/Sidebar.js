// Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <nav>
        <ul>
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={() => {if (window.innerWidth < 769) {closeSidebar();}}}>Home</NavLink></li>
          <li><NavLink to="/inventory" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={() => {if (window.innerWidth < 769) {closeSidebar();}}}>Inventory</NavLink></li>
          <li><NavLink to="/reports" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={() => {if (window.innerWidth < 769) {closeSidebar();}}}>Reports</NavLink></li>
          <li><NavLink to="/bar-item" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={() => {if (window.innerWidth < 769) {closeSidebar();}}}>Bar Item</NavLink></li>
          <li><NavLink to="/recipe" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={() => {if (window.innerWidth < 769) {closeSidebar();}}}>Recipes</NavLink></li>
          <li><NavLink to="/calculator" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={() => {if (window.innerWidth < 769) {closeSidebar();}}}>Cocktail Calculator</NavLink></li>
          <li><NavLink to="/settings" className={({ isActive }) => isActive ? 'active-link' : ''} onClick={() => {if (window.innerWidth < 769) {closeSidebar();}}}>Settings</NavLink></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

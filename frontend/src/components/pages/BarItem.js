import React, { useState } from "react";
import ItemList from "../ItemCategory/ItemList";
import CategoryList from "../ItemCategory/CategoryList";
import CategoryForm from "../ItemCategory/CategoryForm";
import ItemForm from "../ItemCategory/ItemForm";
import './BarItem.css';

export default function BarItem() {
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);
  const [refreshItems, setRefreshItems] = useState(false);

  const handleItemCreated = () => {
    setRefreshItems((prev) => !prev);
    setShowItemForm(false);
  };

  const toggleCategories = () => setShowCategories(!showCategories);

  const handleCreateItemClick = () => {
    if (showItemForm) {
      const form = document.getElementById("item-create-form");
      if (form) form.requestSubmit();
      setShowItemForm(false);
    } else {
      setShowItemForm(true);
    }
  };

  return (
    <div className="bar-item-container">

      {/* === Toggle Categories === */}
      <div className="category-toggle">
        <button onClick={toggleCategories}>
          {showCategories ? "Hide Categories" : "Show Categories"}
        </button>
        {showCategories && (
          <div className="category-section">
            <h2>Categories</h2>
            <CategoryList />
            <CategoryForm />
          </div>
        )}
      </div>

      {/* === Bar Items Header + Search + Create Button === */}
      <div className="bar-items-header">
        <h2>Bar Items</h2>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" onClick={handleCreateItemClick}>
            {showItemForm ? "Save Item" : "Create Item"}
          </button>
        </div>
      </div>

      {/* === Item Form (conditionally visible) === */}
      {showItemForm && (
        <ItemForm id="item-create-form" onCreated={handleItemCreated} />
      )}

      {/* === Item List with Inline Editing === */}
      <div className="item-section">
        <ItemList
          searchTerm={searchTerm}
          refreshTrigger={refreshItems}
        />
      </div>
    </div>
  );
}
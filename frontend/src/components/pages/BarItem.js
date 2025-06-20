import React, { useState } from "react";
import ItemList from "../ItemCategory/ItemList";
import CategoryList from "../ItemCategory/CategoryList";
import CategoryForm from "../ItemCategory/CategoryForm";
import CategoryEditForm from "../ItemCategory/CategoryEditForm";
import ItemForm from "../ItemCategory/ItemForm";
import ItemEditForm from "../ItemCategory/ItemEditForm";
import './BarItem.css';

export default function BarItem() {
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);
  const [refreshItems, setRefreshItems] = useState(false);
  const handleItemCreated = () => {
    setRefreshItems((prev) => !prev); // toggle to trigger re-fetch
    setShowItemForm(false); // optionally hide the form
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
            <h3>Categories</h3>
            <CategoryList onEdit={setEditingCategoryId} />
            {editingCategoryId ? (
              <CategoryEditForm
                categoryId={editingCategoryId}
                onClose={() => setEditingCategoryId(null)}
              />
            ) : (
              <CategoryForm />
            )}
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
      {showItemForm && !editingItemId && (<ItemForm id="item-create-form" onCreated={handleItemCreated} />)}

      {/* === Item List + Edit Form === */}
      <div className="item-section">
        <ItemList searchTerm={searchTerm} onEdit={setEditingItemId} refreshTrigger={refreshItems} />
        {editingItemId && (
          <ItemEditForm
            itemId={editingItemId}
            onClose={() => setEditingItemId(null)}
          />
        )}
      </div>
    </div>
  );
}
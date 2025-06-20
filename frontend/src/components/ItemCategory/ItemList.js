import { useState, useEffect } from "react";
import axios from "axios";

export default function ItemList({ searchTerm, refreshTrigger }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editData, setEditData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/items/")
      .then(res => setItems(res.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:8000/api/categories/")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios.delete(`http://localhost:8000/api/items/${id}/`)
        .then(() => setItems(items.filter((item) => item.id !== id)))
        .catch((err) => console.error(err));
    }
  };

  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setEditData({
      name: item.name,
      category: item.category,
      units: item.units,
      cost_per_unit: item.cost_per_unit,
      image: null,
    });
  };

  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleFileChange = (file) => {
    setEditData({ ...editData, image: file });
  };

  const handleSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("category", editData.category);
      formData.append("units", editData.units);
      formData.append("cost_per_unit", editData.cost_per_unit);
      if (editData.image) {
        formData.append("image", editData.image);
      }

      await axios.patch(`http://localhost:8000/api/items/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEditingItemId(null);
      const res = await axios.get("http://localhost:8000/api/items/");
      setItems(res.data);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update item");
    }
  };

  const handleCancel = () => {
    setEditingItemId(null);
    setEditData({});
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageUrl = (path) => {
    return path?.startsWith("http") ? path : `http://localhost:8000${path}`;
  };

  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredItems.map((item) => {
          console.log("Image path:", item.image);
          return (
            <li
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
                borderBottom: "1px solid #444",
                paddingBottom: "10px",
              }}
            >
              {item.image && (
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  width="80"
                  height="80"
                  style={{
                    objectFit: "contain",
                    backgroundColor: "#fff",
                    width: "80px",
                    height: "80px",
                    borderRadius: "4px",
                    marginRight: "15px",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                  }}
                  onClick={() => setPreviewImage(getImageUrl(item.image))}
                />
              )}

              <div style={{ flexGrow: 1 }}>
                {editingItemId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      style={{ width: "100%" }}
                    />
                    <select
                      value={editData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.
                          id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editData.units}
                      onChange={(e) => handleInputChange("units", e.target.value)}
                    >
                      <option value="">Select Units</option>
                      <option value="300 ml">300 ml</option>
                      <option value="750 ml">750 ml</option>
                      <option value="1000 ml">1000 ml</option>
                      <option value="bottle">bottle</option>
                      <option value="units">units</option>
                    </select>
                    <input
                      type="number"
                      value={editData.cost_per_unit}
                      onChange={(e) => handleInputChange("cost_per_unit", e.target.value)}
                      placeholder="Cost/unit"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                    />
                  </>
                ) : (
                  <>
                    <p><strong>{item.name}</strong></p>
                    <p>Category: {item.category_name || "N/A"}</p>
                    <p>Units: {item.units || "N/A"}</p>
                    <p>Cost/unit: ${item.cost_per_unit || 0}</p>
                  </>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {editingItemId === item.id ? (
                  <>
                    <button onClick={() => handleSave(item.id)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "8px",
              boxShadow: "0 0 20px rgba(255,255,255,0.3)"
            }}
          />
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CategoryList() {
  const [cats, setCats] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/categories/")
      .then((res) => setCats(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      axios
        .delete(`http://localhost:8000/api/categories/${id}/`)
        .then(() => setCats(cats.filter((c) => c.id !== id)))
        .catch((err) => console.error(err));
    }
  };

  const handleEditClick = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:8000/api/categories/${editingId}/`, { name: editName })
      .then((res) => {
        setCats((prev) =>
          prev.map((cat) => (cat.id === editingId ? res.data : cat))
        );
        setEditingId(null);
        setEditName("");
      })
      .catch((err) => console.error(err));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName("");
  };

  return (
    <div>
      <ul>
        {cats.map((c) => (
          <li key={c.id}>
            {editingId === c.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                {c.name} &nbsp;
                <button onClick={() => handleEditClick(c)}>Edit</button>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
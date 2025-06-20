import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CategoryList(onEdit) {
  const [cats, setCats] = useState([]);

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

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {cats.map((c) => (
          <li key={c.id}>
            {c.name} &nbsp;
            <button onClick={() => onEdit(c)}>Edit</button>
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
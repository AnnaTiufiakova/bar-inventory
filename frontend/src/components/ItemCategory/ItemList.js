import { useState, useEffect } from "react";
import axios from "axios";

export default function ItemList({ searchTerm, onEdit, refreshTrigger }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/items/")
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios
        .delete(`http://localhost:8000/api/items/${id}/`) // <-- Fixed backticks
        .then(() => setItems(items.filter((item) => item.id !== id)))
        .catch((err) => console.error(err));
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Items</h2>
      <ul>
        {filteredItems.map((item) => {
          console.log("Image path:", item.image);
          return (
          <li key={item.id}>
            {/* Image preview if available */}
            {item.image && (
              <img
                src={`http://localhost:8000${item.image}`}
                alt={item.name}
                width="100"
                style={{ marginRight: "10px" }}
              />
            )}
            {item.name} &nbsp;
            <button onClick={() => onEdit(item.id)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ); })}
      </ul>
    </div>
  );
}
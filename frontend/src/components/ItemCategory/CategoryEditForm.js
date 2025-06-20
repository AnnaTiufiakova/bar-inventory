import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function CategoryEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/categories/${id}/`)
      .then((res) => setName(res.data.name))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8000/api/categories/${id}/`, { name })
      .then(() => navigate("/categories"))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>Edit Category</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name: &nbsp;
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

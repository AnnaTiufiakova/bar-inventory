import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ItemEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cost_per_unit, setCostUnit] = useState('');
  const [empty_bottle, setEmptyBottle] = useState('');

  useEffect(() => {
    // Fetch item details
    axios
      .get(`http://localhost:8000/api/items/${id}/`)
      .then((res) => {
        const item = res.data;
        setName(item.name);
        setCategory(item.category);
        setUnits(item.units);
        setQuantity(item.quantity);
        setCostUnit(item.cost_per_unit);
        setEmptyBottle(item.empty_bottle);
      })
      .catch((err) => console.error(err));

    // Fetch available categories
    axios
      .get(`http://localhost:8000/api/categories/`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8000/api/items/${id}/`, {
        name,
        category,
        units,
        quantity,
        cost_per_unit,
        empty_bottle,
      })
      .then(() => navigate("/"))
      .catch((err) => console.error("Update failed:", err));
  };

  return (
    <div>
      <h2>Edit Item</h2>
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
        <br />
        <label>
          Category: &nbsp;
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Units: &nbsp;
          <input
            type="text"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Quantity: &nbsp;
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Cost per Unit: &nbsp;
          <input
            type="number"
            value={cost_per_unit}
            onChange={(e) => setCostUnit(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Empty Bottle Cost: &nbsp;
          <input
            type="number"
            value={empty_bottle}
            onChange={(e) => setEmptyBottle(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
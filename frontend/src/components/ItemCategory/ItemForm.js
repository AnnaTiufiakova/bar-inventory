import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemForm = ({id = "item-create-form", onCreated}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState('');
  const [cost_per_unit, setCostUnit] = useState('');
  const [empty_bottle, setEmptyBottle] = useState('');
  const [showBottleFields, setShowBottleFields] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Fetch available categories to populate the dropdown
    axios
      .get('http://localhost:8000/api/categories/')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    const selected = categories.find((c) => c.id === parseInt(category));
    if (selected && (selected.name.toLowerCase().includes('wine') ||
    selected && selected.name.toLowerCase().includes('liquor'))
  ) {
      setShowBottleFields(true);
    } else {
      setShowBottleFields(false);
    }
  }, [category, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("units", units);
    formData.append("cost_per_unit", cost_per_unit);
    if (showBottleFields && empty_bottle !== "") {
      formData.append("empty_bottle", empty_bottle);
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post("http://localhost:8000/api/items/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Item created!");
      // reset fields
      setName("");
      setCategory("");
      setUnits("");
      setCostUnit("");
      setEmptyBottle("");
      setImage(null); // if image state exists
    } catch (error) {
      console.error("Error creating item:", error.response?.data || error);
      alert("Failed to create item");
    }
  };

  return (
    <div>
      <h2>Create New Item</h2>
      <form onSubmit={handleSubmit} id={id}> 
        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />  
        </label>
        <br />
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Category:
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
          Units:
          <select
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
          >
            <option value="">Select units</option>
            <option value="300 ml">300 ml</option>
            <option value="750 ml">750 ml</option>
            <option value="1000 ml">1000 ml</option>
            <option value="bottle">bottle</option>
            <option value="units">units</option>
          </select>
        </label>
        <br />
        <label>
          Cost per unit:
          <input
            type="number"
            value={cost_per_unit}
            onChange={(e) => setCostUnit(e.target.value)}
            required
          />
        </label>
        <br /> 
        {showBottleFields && (
          <>
            <label>
              Empty bottle weight:
              <input
                type="number"
                value={empty_bottle}
                onChange={(e) => setEmptyBottle(e.target.value)}
                required
              />
            </label>
            <br />
          </>
        )}        
        <button type="submit">Create Item</button>
      </form>
    </div>
  );
};

export default ItemForm;
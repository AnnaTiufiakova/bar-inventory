import React, { useState, useEffect } from "react";
import axios from "axios";
import './RecipeForm.css';

const RecipeForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([{ item_id: "", quantity: "", unit: "ml" }]);
  const [items, setItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/items/")
      .then(res => setItems(res.data))
      .catch(err => console.error("Error loading items:", err));

    axios.get("http://localhost:8000/api/recipe/")
      .then(res => setRecipes(res.data))
      .catch(err => console.error("Error loading recipes:", err));
  }, []);

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { item_id: "", quantity: "", unit: "ml" }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/recipe/", { name, ingredients });
      alert("Recipe created!");
      setName("");
      setIngredients([{ item_id: "", quantity: "", unit: "ml" }]);
      setShowForm(false);

      const res = await axios.get("http://localhost:8000/api/recipe/");
      setRecipes(res.data);
    } catch (err) {
      console.error("Error creating recipe:", err.response?.data || err);
      alert("Failed to create recipe");
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="recipe-container">
      <h2>Recipes</h2>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "➕ Create Recipe"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
          <label>
            Recipe name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <h4>Ingredients:</h4>
          {ingredients.map((ing, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <select
                value={ing.item_id}
                onChange={(e) => handleIngredientChange(index, "item_id", e.target.value)}
                required
              >
                <option value="">Select item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={ing.quantity}
                placeholder="Quantity"
                onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                required
                style={{ width: "80px", marginLeft: "10px" }}
              />

              <select
                value={ing.unit}
                onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                required
                style={{ marginLeft: "10px" }}
              >
                <option value="ml">ml</option>
                <option value="gr">gr</option>
                <option value="units">units</option>
              </select>

              <button type="button" onClick={() => removeIngredient(index)} style={{ marginLeft: "10px" }}>
                ❌
              </button>
            </div>
          ))}

          <button type="button" onClick={addIngredient}>
            ➕ Add Ingredient
          </button>
          <br /><br />
          <button type="submit">Save Recipe</button>
          </form>
      )}

      <div style={{ marginTop: "30px" }}>
        <h3>Existing Recipes</h3>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "15px", padding: "5px", width: "200px" }}
        />

        <ul>
          {filteredRecipes.map((recipe) => (
            <li key={recipe.id}>
              <strong>{recipe.name}</strong>
              <ul>
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id}>
                    {ing.quantity} {ing.unit} of {ing.item.name}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeForm;
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
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/items/")
      .then(res => setItems(res.data))
      .catch(err => console.error("Error loading items:", err));

    loadRecipes();
  }, []);

  const loadRecipes = () => {
    axios.get("http://localhost:8000/api/recipes/")
      .then(res => setRecipes(res.data))
      .catch(err => console.error("Error loading recipes:", err));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleEditIngredientChange = (index, field, value) => {
    const newIngredients = [...editingRecipe.ingredients];
    newIngredients[index][field] = value;
    setEditingRecipe({ ...editingRecipe, ingredients: newIngredients });
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
      await axios.post("http://localhost:8000/api/recipes/", {
        name,
        ingredients,
      });
      alert("Recipe created!");
      setName("");
      setIngredients([{ item_id: "", quantity: "", unit: "ml" }]);
      setShowForm(false);
      loadRecipes();
    } catch (err) {
      console.error("Error creating recipe:", err.response?.data || err);
      alert("Failed to create recipe");
    }
  };

  const handleEditClick = (recipe) => {
    // Prepare ingredients with item_id instead of full item
    const parsedIngredients = recipe.ingredients.map((ing) => ({
      item_id: ing.item.id,
      quantity: ing.quantity,
      unit: ing.unit,
    }));
    setEditingRecipe({
      id: recipe.id,
      name: recipe.name,
      ingredients: parsedIngredients,
    });
  };

  const handleEditSave = async () => {
  try {
    const formattedIngredients = editingRecipe.ingredients.map(ing => ({
      item: ing.item.id || ing.item,
      quantity: ing.quantity,
      unit: ing.unit,
    }));

    await axios.patch(`http://localhost:8000/api/recipes/${editingRecipe.id}/`, {
      name: editingRecipe.name,
      ingredients: formattedIngredients,
    });

    setEditingRecipe(null);
    loadRecipes();
  } catch (err) {
    console.error("Error updating recipe:", err.response?.data || err);
    alert("Failed to update recipe");
  }
};

  const handleDelete = async (id) => {
    if (window.confirm("Delete this recipe?")) {
      try {
        await axios.delete(`http://localhost:8000/api/recipes/${id}/`);
        loadRecipes();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Could not delete recipe");
      }
    }
  };

  const handleCancel = () => {
    setEditingRecipe(null);
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
            <li key={recipe.id} style={{ marginBottom: "15px" }}>
              {editingRecipe && editingRecipe.id === recipe.id ? (
                <div>
                  <input
                    type="text"
                    value={editingRecipe.name}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, name: e.target.value })}
                    style={{ marginBottom: "10px" }}
                  />
                  <h5>Edit Ingredients:</h5>
                  {editingRecipe.ingredients.map((ing, index) => (
                    <div key={index}>
                      <select
                        value={ing.item_id}
                        onChange={(e) => handleEditIngredientChange(index, "item_id", e.target.value)}
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
                        placeholder="Qty"
                        onChange={(e) => handleEditIngredientChange(index, "quantity", e.target.value)}
                        style={{ width: "70px", marginLeft: "10px" }}
                      />

                      <select
                        value={ing.unit}
                        onChange={(e) => handleEditIngredientChange(index, "unit", e.target.value)}
                        style={{ marginLeft: "10px" }}
                      >
                        <option value="ml">ml</option>
                        <option value="gr">gr</option>
                        <option value="units">units</option>
                      </select>
                    </div>
                  ))}
                  <br />
                  <button onClick={handleEditSave}>Save</button>
                  <button onClick={handleCancel} style={{ marginLeft: "10px" }}>Cancel</button>
                  </div>
              ) : (
                <>
                  <strong>{recipe.name}</strong>
                  <button onClick={() => handleEditClick(recipe)} style={{ marginLeft: "10px" }}>Edit</button>
                  <button onClick={() => handleDelete(recipe.id)} style={{ marginLeft: "5px" }}>Delete</button>
                  <ul>
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx}>
                        {ing.quantity} {ing.unit} of {ing.item.name}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeForm;
import React, { useState } from 'react';
import './Inventory.css'; 

const Inventory = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Vodka', quantity: 10, unit: 'bottles' },
    { id: 2, name: 'Gin', quantity: 5, unit: 'bottles' },
    { id: 3, name: 'Whiskey', quantity: 8, unit: 'bottles' },
  ]);

  return (
    <div className="inventory-page">
      <h1>Inventory</h1>
      <button className="add-btn">+ Add Item</button>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
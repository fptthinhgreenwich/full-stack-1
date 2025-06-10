// frontend/src/App.js (Simplified Example)
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [items, setItems] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch(`${API_URL}/items`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch items:", error);
            // setItems([]); // Optionally clear items or show error
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItemName.trim()) return;
        try {
            const response = await fetch(`${API_URL}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newItemName }),
            });
            if (!response.ok) throw new Error('Failed to add item');
            // const addedItem = await response.json(); // Get the added item
            setNewItemName('');
            fetchItems(); // Refresh list
        } catch (error) {
            console.error("Failed to add item:", error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Change</h1>
                <h1>Items List</h1>
                <form onSubmit={handleAddItem}>
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Enter item name"
                    />
                    <button type="submit">Add Item</button>
                </form>
                <ul>
                    {items.length > 0 ? (
                        items.map(item => <li key={item.id}>{item.name}</li>)
                    ) : (
                        <p>No items found, or backend not reachable.</p>
                    )}
                </ul>
                 <p><small>API URL: {API_URL}</small></p>
            </header>
        </div>
    );
}
export default App;
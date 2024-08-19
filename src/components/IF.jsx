import React, { useState, useEffect } from 'react';

const IngredientForm = ({ onAddIngredient, onClose, initialData = null }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [unit, setUnit] = useState('');
    const [cost, setCost] = useState('');
    const [prepTime, setPrepTime] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setAmount(initialData.amount);
            setUnit(initialData.unit);
            setCost(initialData.cost);
            setPrepTime(initialData.prepTime);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const ingredient = { name, amount, unit, cost, prepTime };
        onAddIngredient(ingredient);
        onClose();
        setName('');
        setAmount('');
        setUnit('');
        setCost('');
        setPrepTime('');
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.header}>Add Ingredient</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input}
            />
            <input
                type="text"
                placeholder="Unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={styles.input}
            />
            <input
                type="number"
                placeholder="Cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                style={styles.input}
            />
            <input
                type="number"
                placeholder="Prep Time (seconds)"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                style={styles.input}
            />
            <button type="submit" style={styles.button}>Add</button>
        </form>
    );
};

const styles = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'lightblue',
    },
    header: {
        marginBottom: '20px',
    },
    input: {
        marginBottom: '10px',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default IngredientForm;

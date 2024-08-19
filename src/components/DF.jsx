import React, { useState, useEffect } from 'react';

const DishForm = ({ ingredients, onAddDish, onClose, initialData = null }) => {
    const [name, setName] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [laborTime, setLaborTime] = useState('');
    const [laborCost, setLaborCost] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setSellPrice(initialData.sellPrice.toString());
            setSelectedIngredients(initialData.ingredients);
            setLaborTime(initialData.laborTime);
            setLaborCost(initialData.laborCost);
        }
    }, [initialData]);

    const handleIngredientChange = (index, field, value) => {
      const newSelectedIngredients = [...selectedIngredients];
      newSelectedIngredients[index] = {
          ...newSelectedIngredients[index],
          [field]: value,
      };
      setSelectedIngredients(newSelectedIngredients);
  };

  const handleAddIngredient = () => {
      setSelectedIngredients([...selectedIngredients, { name: '', quantity: '' }]);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const dishIngredients = selectedIngredients.map((ingredient) => {
          const ingredientDetails = ingredients.find((ing) => ing.name === ingredient.name);
          const unitCost = ingredientDetails.cost / ingredientDetails.amount;
          const ingredientCost = unitCost * ingredient.quantity;
          return {
              ...ingredient,
              unit: ingredientDetails.unit,
              cost: ingredientCost,
          };
      });

      const costPrice = dishIngredients.reduce((total, ingredient) => total + ingredient.cost, 0);
      const prepCost = parseFloat(laborCost) * (parseFloat(laborTime) / 3600);
      const profit = parseFloat(sellPrice) - costPrice - prepCost;
      const dish = { name, sellPrice: parseFloat(sellPrice), costPrice, profit, ingredients: dishIngredients, laborTime, laborCost, prepCost };
      onAddDish(dish);
      onClose();
      setName('');
      setSellPrice('');
      setLaborTime('');
      setLaborCost('');
  };

  return (
      <form onSubmit={handleSubmit} style={styles.form}>
          <input
              type="text"
              placeholder="Dish Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
          />
          <input
              type="number"
              placeholder="Sell Price"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              style={styles.input}
          />
          <input
              type="number"
              placeholder="Labor Time (seconds)"
              value={laborTime}
              onChange={(e) => setLaborTime(e.target.value)}
              style={styles.input}
          />
          <input
              type="number"
              placeholder="Labor Cost ($ per hour)"
              value={laborCost}
              onChange={(e) => setLaborCost(e.target.value)}
              style={styles.input}
          />
          {selectedIngredients.map((ingredient, index) => {
              const selectedIngredient = ingredients.find(ing => ing.name === ingredient.name);
              const unit = selectedIngredient ? selectedIngredient.unit : '';
              return (
                  <div key={index} style={styles.ingredientContainer}>
                      <select
                          value={ingredient.name}
                          onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                          style={styles.select}
                      >
                          <option value="">Select Ingredient</option>
                          {ingredients.map((ing, i) => (
                              <option key={i} value={ing.name}>{ing.name}</option>
                          ))}
                      </select>
                      <input
                          type="number"
                          placeholder={`Quantity (${unit})`}
                          value={ingredient.quantity}
                          onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                          style={styles.input}
                      />
                  </div>
              );
          })}
          <button type="button" onClick={handleAddIngredient} style={styles.button}>Add Ingredient</button>
          <button type="submit" style={styles.button}>Add Dish</button>
      </form>
  );
};

const styles = {
  form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '800px',
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
      marginTop: '10px',
  },
  ingredientContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      width: '100%',
  },
  select: {
      marginRight: '10px',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      flex: '1',
  },
};

export default DishForm;
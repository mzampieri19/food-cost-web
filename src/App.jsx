import { useState, useEffect } from 'react'
import './App.css'
import IF from './components/IF'
import DF from './components/DF'
import Modal from './components/Modal'
import SF from './components/SF'
import VI from './components/VI'
import VD from './components/VD'
import AsyncStorage from '@react-native-async-storage/async-storage'

const TestIngredients = [
  { name: 'Flour', amount: 1000, unit: 'g', cost: 1.5, prepTime: 5 },
  { name: 'Sugar', amount: 500, unit: 'g', cost: 2, prepTime: 2 },
];



const TestDishes = [
  {
    name: 'Cake',
    sellPrice: 20,
    profit : 10,
    costPrice: 10,
    
    ingredients: [
      { name: 'Flour', quantity: 500, unit : 'g', cost: 0.75},
      { name: 'Sugar', quantity: 250, unit : 'g', cost: 0.5},
    ],
    laborTime: 1800,
    laborCost: 10,
    prepCost: 5,
  },
];

function App() {
  const [ingredients, setIngredients] = useState([])
  const [showIngredientsModal, setShowIngredientsModal] = useState(false)
  const [dishes, setDishes] = useState([])
  const [showDishModal, setShowDishModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showViewAllIngredients, setShowViewAllIngredients] = useState(false);
  const [showViewAllDishes, setShowViewAllDishes] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true); 

  
  const addIngredient = (newIngredient) => {
    setIngredients(prevIngredients => {
      if (!Array.isArray(prevIngredients)) {
        console.error('prevIngredients is not an array:', prevIngredients);
        return [];
      }
      const index = prevIngredients.findIndex(ing => ing.name === newIngredient.name);
      if (index >= 0) {
        const updatedIngredients = [...prevIngredients];
        updatedIngredients[index] = newIngredient;
        updateDishesWithNewIngredient(newIngredient); // Update dishes with new ingredient
        return updatedIngredients;
      }
      return [...prevIngredients, newIngredient];
    });
  };
  
  const addDish = (dish) => {
    setDishes(prevDishes => {
      const index = prevDishes.findIndex(d => d.name === dish.name);
      if (index >= 0) {
        const updatedDishes = [...prevDishes];
        updatedDishes[index] = dish;
        return updatedDishes;
      }
      return [...prevDishes, dish];
    });
  };

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('ingredients');
        const storedIngredients = jsonValue != null ? JSON.parse(jsonValue) : [];
        setIngredients(storedIngredients);
        console.log('Ingredients loaded:', storedIngredients);
      } catch (error) {
        console.error('Failed to load ingredients:', error);
      }
    };

    const loadDishes = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('dishes');
        const storedDishes = jsonValue != null ? JSON.parse(jsonValue) : [];
        setDishes(storedDishes);
        console.log('Dishes loaded:', storedDishes);
      } catch (error) {
        console.error('Failed to load dishes:', error);
      }
    };

    const loadData = async () => {
      await loadIngredients();
      await loadDishes();
      setLoading(false);
    };

    loadData();
  }, []);

  // Save ingredients when they change, but only after loading is complete
  useEffect(() => {
    if (!loading) {
      const saveIngredients = async () => {
        try {
          const jsonValue = JSON.stringify(ingredients);
          await AsyncStorage.setItem('ingredients', jsonValue);
          console.log('Ingredients saved:', jsonValue);
        } catch (error) {
          console.error('Failed to save ingredients:', error);
        }
      };

      const saveDishes = async () => {
        try {
          const jsonValue = JSON.stringify(dishes);
          await AsyncStorage.setItem('dishes', jsonValue);
          console.log('Dishes saved:', jsonValue);
        } catch (error) {
          console.error('Failed to save dishes:', error);
        }
      };

      saveIngredients();
      saveDishes();
    }
  }, [ingredients, dishes, loading]);

  const closeIngredientsModal = () => {
    setShowIngredientsModal(false)
  };

  const closeDishModal = () => {
    setShowDishModal(false)
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setSelectedItem(null);
    setShowEditModal(false);
  };

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredIngredients = ingredients.filter(ingredient =>
      ingredient.name && ingredient.name.toLowerCase().includes(lowercasedQuery)
    );
    const filteredDishes = dishes.filter(dish =>
      dish.name && dish.name.toLowerCase().includes(lowercasedQuery)
    );
    const combinedResults = [...filteredIngredients, ...filteredDishes];
    
    setSearchResults(combinedResults);
    setShowSearchResults(true);
  };

  const renderForm = () => {
    if (!selectedItem) return null;
    if (selectedItem.amount !== undefined) {
      return (
        <IF
          onAddIngredient={handleEditItem}
          onClose={closeEditModal}
          initialData={selectedItem}
        />
    );
  } else {
    return (
      <DF
        ingredients={ingredients}
        onAddDish={handleEditItem}
        onClose={closeEditModal}
        initialData={selectedItem}
      />
    );
  }
  }; 

  const handleEditItem = (updatedItem) => {
    if (updatedItem.amount) {
      setIngredients(prevIngredients =>
        prevIngredients.map(ingredient =>
          ingredient.name === updatedItem.name ? updatedItem : ingredient
        )
      );
      updateDishesWithNewIngredient(updatedItem);
    } else {
      setDishes(prevDishes =>
        prevDishes.map(dish =>
          dish.name === updatedItem.name ? updatedItem : dish
        )
      );
    }
    closeEditModal();
  };

  const updateDishesWithNewIngredient = (newIngredient) => {
    setDishes(prevDishes =>
      prevDishes.map(dish => {
        let costPrice = 0;
        dish.ingredients.forEach((ing) => {
          const ingredient = ing.name === newIngredient.name ? newIngredient : ingredients.find(i => i.name === ing.name);
          if (ingredient) {
            costPrice += (ingredient.cost / ingredient.amount) * ing.quantity;
          }
        });
        const profit = dish.sellPrice - costPrice;
        return {
          ...dish,
          costPrice,
          profit,
        };
      })
    );
  };

  const handleDelete = () => {
    if (selectedItem.amount) {
      setIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.name !== selectedItem.name)
      );
    } else {
      setDishes(prevDishes =>
        prevDishes.filter(dish => dish.name !== selectedItem.name)
      );
    }
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const deleteAllIngredients = () => {
    setIngredients([]);
    setShowViewAllIngredients(false);
  }

  const deleteAllDishes = () => {
    setDishes([]);
    setShowViewAllDishes(false);
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}> 
        <h1>Food Cost Calculator</h1>
      </header>
      <div style={styles.stepContainer}>
        <h2 style={styles.subtitle}> Step 1: Add Ingredients</h2>
        <button onClick={() => setShowIngredientsModal(true)} style = {styles.button}>Add Ingredients</button>
        <Modal 
          isOpen={showIngredientsModal} 
          onRequestClose={() => setShowIngredientsModal(false)}
          children={ingredients}
        >
          <IF onAddIngredient={addIngredient} onClose={closeIngredientsModal} />
        </Modal>
        <h2 style={styles.text}> Ingredients Added: {ingredients.length} </h2>
      </div>
      <div style={styles.stepContainer}>
      <h2 style={styles.subtitle}> Step 2: Add a Dish</h2>
        <button onClick={() => setShowDishModal(true)} style={styles.button}>Add Dish</button>
        <Modal 
          isOpen={showDishModal} 
          onRequestClose={() => setShowDishModal(false)}
          children={dishes}
        >
          <DF
            ingredients={ingredients}
            onAddDish={addDish}
            onClose={closeDishModal}
          />
        </Modal>
        <h2 style={styles.text}> Dishes Added: {dishes.length} </h2>
      </div>

      {/* <h2> Step 3: Search </h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {showSearchResults && (
        <SF searchResult={searchResults}
            ingredients = {ingredients} 
            dishes = {dishes} />
      )} */}

      <h2 style={styles.subtitle}>Step 3: View All</h2>
      <button onClick={() => setShowViewAllIngredients(true)} style={styles.button}>View All Ingredients</button>
      <Modal 
        isOpen={showViewAllIngredients} 
        onRequestClose={() => setShowViewAllIngredients(false)}
      >
        <VI ingredients={ingredients} onEdit={openEditModal} />
        <button onClick={() => deleteAllIngredients()}style={styles.DeleteButton}>Delete All Ingredients</button>
      </Modal>

      <button onClick={() => setShowViewAllDishes(true)} style={styles.button}>View All Dishes</button>
      <Modal 
        isOpen={showViewAllDishes} 
        onRequestClose={() => setShowViewAllDishes(false)}
      >
        <VD dishes={dishes} onEdit={openEditModal} />
        <button onClick={() => deleteAllDishes()}style={styles.DeleteButton}>Delete All Dishes</button>
      </Modal>

      {showEditModal && (
        <Modal 
          isOpen={showEditModal} 
          onRequestClose={closeEditModal}
        >
          <h2 style={styles.text}>Edit {selectedItem && selectedItem.name}</h2>    
          {renderForm()}
          {console.log('selectedItem:', selectedItem)}
          <button onClick={handleDelete} style={styles.DeleteButton} >Delete</button>
          <button onClick={closeEditModal} style={styles.SaveButton}>Save</button>
        </Modal>
      )}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '20px',
  },
  stepContainer: {
    marginBottom: '20px',
  },
  subtitle: {
    marginBottom: '10px',
  },
  text: {
    marginBottom: '10px',
  },
  button: {
    padding: '10px',
    backgroundColor: 'blue',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  DeleteButton: {
    padding: '10px',
    backgroundColor: 'red',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  SaveButton: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
}

export default App

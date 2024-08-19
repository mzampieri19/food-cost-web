import React from 'react';

const SF = ({ searchQuery = '', ingredients = [], dishes = [] }) => {
    const lowercasedQuery = searchQuery.toLowerCase();

    // Filter ingredients that match the query
    const filteredIngredients = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(lowercasedQuery)
    ).map(item => ({ ...item, type: 'ingredient' }));

    // Filter dishes that match the query
    const filteredDishes = dishes.filter(dish =>
        dish.name.toLowerCase().includes(lowercasedQuery)
    ).map(item => ({ ...item, type: 'dish' }));

    // Combine both results
    const searchResults = [...filteredIngredients, ...filteredDishes];

    return (
        <div>
            <h2>Search Results</h2>
            <ul>
                {searchResults.length > 0 ? (
                    searchResults.map((item, index) => (
                        <li key={index}>
                            {item.name} - {item.type} - {item.cost || 'N/A'}
                        </li>
                    ))
                ) : (
                    <li>No results found</li>
                )}
            </ul>
        </div>
    );
};

export default SF;

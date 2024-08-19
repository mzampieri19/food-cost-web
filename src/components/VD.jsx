const VD = ({ dishes, onEdit }) => {
    const round = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>View Dishes</h2>
            <ul style={styles.list}>
                {dishes.map((dish, index) => (
                    <li key={index} style={styles.listItem} onClick={() => onEdit(dish)}>
                        <div><strong>Name:</strong> {dish.name}</div>
                        <div><strong>Sell Price:</strong> ${dish.sellPrice}</div>
                        <div><strong>Cost Price:</strong> ${round(dish.costPrice, 2)}</div>
                        <div><strong>Labor Time:</strong> {dish.laborTime} seconds</div>
                        <div><strong>Labor Cost:</strong> ${round(dish.laborCost, 2)}</div>
                        <div><strong>Prep Cost:</strong> ${round(dish.prepCost, 2)}</div>
                        <div><strong>Profit:</strong> ${round(dish.profit, 2)}</div>
                        <div><strong>Ingredients:</strong></div>
                        <ul style={styles.ingredientList}>
                            {dish.ingredients.map((ingredient, idx) => (
                                <li key={idx} style={styles.ingredientItem}>
                                    <div><strong>Name:</strong> {ingredient.name}</div>
                                    <div><strong>Amount:</strong> {ingredient.quantity}</div>
                                    <div><strong>Unit:</strong> {ingredient.unit}</div>
                                    <div><strong>Cost of ingredient:</strong> ${ingredient.cost}</div>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

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
    list: {
        listStyleType: 'none',
        padding: '0',
        width: '100%',
    },
    listItem: {
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
        width: '100%',
        backgroundColor: 'lightblue',
        transition: 'background-color 0.3s ease',
    },
    ingredientList: {
        listStyleType: 'none',
        paddingLeft: '20px',
    },
    ingredientItem: {
        marginBottom: '10px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
    },
};

export default VD;
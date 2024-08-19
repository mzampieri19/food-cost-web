const VI = ({ ingredients, onEdit }) => {
    return (
        <div style={styles.container}>
            <h2 style={styles.header}>View Ingredients</h2>
            <ul style={styles.list}>
                {ingredients.map((ingredient, index) => (
                    <li key={index} style={styles.listItem} onClick={() => onEdit(ingredient)}>
                        <div><strong>Name:</strong> {ingredient.name}</div>
                        <div><strong>Amount:</strong> {ingredient.amount}</div>
                        <div><strong>Unit:</strong> {ingredient.unit}</div>
                        <div><strong>Cost:</strong> ${ingredient.cost}</div>
                        <div><strong>Prep Time:</strong> {ingredient.prepTime} seconds</div>
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
        fontColor: 'black',
    },
};

export default VI;
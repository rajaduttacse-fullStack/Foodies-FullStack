import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem';

function FoodDisplay({ category, searchText }) {
    const { foodList } = useContext(StoreContext);

    // Safely ensure foodList is an array (handles page objects or undefined states)
    const listArray = Array.isArray(foodList) 
        ? foodList 
        : (foodList?.content || foodList?.data?.content || []);

    const filteredFoods = listArray.filter(food => (
        (category === 'All' || food.category === category) && 
        food.name.toLowerCase().includes(searchText.toLowerCase())
    ));

    return (
        <div className='Container'>
            <div className="row">
                {filteredFoods.length > 0 ? (
                    filteredFoods.map((food, index) => (
                        <FoodItem key={index} 
                            name={food.name}
                            description={food.description}
                            id={food.id}
                            imageUrl={food.imageUrl}
                            price={food.price} 
                        />
                    ))
                ) : (
                    <div className="text-center mt-4">
                        <h4>No Food Found</h4>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FoodDisplay;
import React, { useContext, useEffect } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import { food_list } from '../../assets/assets';

const FoodDisplay = ({ category }) => {

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {food_list
                    .filter(item => category === 'All' || category === item.category) // Category filter
                    .map((item, index) => {
                      // console.log(item.image)
                     return (
                        <FoodItem 
                            key={item.id || index} 
                            id={item.id || index} 
                            name={item.name} 
                            description={item.description} 
                            price={item.price} 
                            image={item.image}
                        />
                    )
                    } )}
            </div>
        </div>
    );
};

export default FoodDisplay;

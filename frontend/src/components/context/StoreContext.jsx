import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { food_list } from "../../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [validCart, setValidCart] = useState({});
    const [user, setUser] = useState(null); // ✅ Add user state
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");

    const addToCart = async (itemId) => {
        const item = food_list.find((product) => product.id === itemId);
        if (!item) {
            console.warn(`Item with ID ${itemId} not found in food_list`);
            return;
        }

        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));
        console.log(cartItems)


        if (token) {
            try {
                await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
            } catch (error) {
                console.error("Error adding item to cart:", error);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        if (!cartItems[itemId] || cartItems[itemId] <= 0) {
            console.warn(`Cannot remove item ${itemId}, not in cart`);
            return;
        }

        setCartItems((prev) => {
            const updatedCart = { ...prev };
            updatedCart[itemId] -= 1;
            if (updatedCart[itemId] <= 0) delete updatedCart[itemId];
            return updatedCart;
        });
        console.log(cartItems)

        if (token) {
            try {
                await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
            } catch (error) {
                console.error("Error removing item from cart:", error);
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
    
        if (!Array.isArray(food_list) || food_list.length === 0) {
            console.warn("Warning: food_list is empty or not loaded yet.");
            return totalAmount;
        }
    
        for (const itemId in cartItems) {
            const item = food_list.find(product => String(product.id) === String(itemId));
    
            if (item) {
                totalAmount += item.price * cartItems[itemId];
            } else {
                console.warn(`🚨 Removing unknown item ID ${itemId} from cart!`);
                removeFromCart(itemId); // Remove invalid items
            }
        }
    
        return totalAmount;
    };
    
    
    
    
    useEffect(() => {
        // Convert cartItems (object) into an array of valid items
        const filteredCart = Object.entries(cartItems)
            .map(([itemId, quantity]) => {
                const item = food_list.find(product => String(product.id) === String(itemId));
    
                if (item) {
                    return {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: quantity,
                        image: item.image
                    };
                } else {
                    console.warn(`🚨 Skipping unknown item ID ${itemId} from cartItems.`);
                    return null; // Ignore invalid items
                }
            })
            .filter(Boolean); // Remove null values
    
        setValidCart(filteredCart); // ✅ Store only valid items in state
    
    }, [cartItems]); // ✅ Runs whenever cartItems changes
    

    useEffect(() => {
        const filteredCart = Object.entries(cartItems)
            .map(([itemId, quantity]) => {
                // Find the item in food_list using the numerical ID
                const item = food_list.find(product => Number(product.id) === Number(itemId));
    
                if (item) {
                    return {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: quantity, // Add quantity from cartItems
                    };
                } else {
                    console.warn(`⚠️ Item with ID ${itemId} not found in food_list, skipping.`);
                    return null; // Ignore invalid items
                }
            })
            .filter(Boolean); // Remove any null values
    
        setValidCart(filteredCart); // ✅ Store only valid items
    
    }, [cartItems, food_list]); // Runs whenever cartItems or food_list changes
    

    useEffect(() => {
        const loadData = async () => {
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
            }
        };
        loadData();
    }, []);

  
    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        user,
        setUser, // ✅ Provide user context
    };

    return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;

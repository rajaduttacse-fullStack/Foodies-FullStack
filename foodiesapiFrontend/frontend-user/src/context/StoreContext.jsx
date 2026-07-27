import { createContext, useEffect, useState } from "react";
import axios from  "axios" ;
import { fetchFoodList } from "../service/foodService";
import { addToCart, getCartData, removeQtyFromCart } from "../service/cartService";



export const StoreContext = createContext(null) ;

export const StoreContextProvider = (props) => {

    const [foodList , setFoodList] = useState([]);
    const [quantities , setQuantities] = useState({}) ;
    const [token , setToken] = useState(localStorage.getItem('token') ||  '');

    const increaseQuantities = async (foodId) =>{
    setQuantities((prev) => ({...prev , [foodId]:(prev[foodId] || 0)+1}));
    await addToCart(foodId , token) ;
   
    };

    const decreaseQuantities = async (foodId) =>{
    setQuantities((prev) => ({...prev , [foodId]:(prev[foodId] > 0 ? prev[foodId]-1 : 0)}));
    await removeQtyFromCart(foodId , token);
    };

    const removeFromCart = (foodId) => {
        setQuantities((prevQuantities) =>{
          const updatedQuantities =  {...prevQuantities} ;
          delete updatedQuantities[foodId];
          return updatedQuantities;
        })
    }
    const loadCartData = async (token) => {
       const items = await getCartData(token);
    setQuantities(items);
    }
    const contextValue = {
        foodList ,
        increaseQuantities ,
        decreaseQuantities ,
        quantities ,
        removeFromCart,
        token ,
        setToken,
        setQuantities,
        loadCartData
        };
      useEffect(() => {
        async function loadData() {
            const data = await fetchFoodList();
            setFoodList(data);

            const savedToken = localStorage.getItem('token');

            if (savedToken) {
                setToken(savedToken);
                await loadCartData(savedToken);
            }
        }

        loadData();
    }, []);
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
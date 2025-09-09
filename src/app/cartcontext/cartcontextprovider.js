'use client'
import React, { useState } from "react";
import CartContext from "./cartcontext";

const CartContextProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])
    const [wishlist, setWishList] = useState([])
    const [currUser, setCurrUser] = useState(null)

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, wishlist, setWishList, currUser, setCurrUser }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContextProvider
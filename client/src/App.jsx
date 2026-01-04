import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { useSelector } from "react-redux";

function App() {
  const cartItems = useSelector((state) => state.cart);
  return (
    <div className=" w-full">
      <div className="fixed w-full h-[60px] flex items-center justify-between px-8 py-3 bg-gray-200">
        <h1>Nepal Mart</h1>
        <div className="flex items-center gap-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink className="relative" to="/cart">
            Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-black text-white rounded-full text-xs w-5 h-5 flex items-center justify-center ">
                {cartItems.length}
              </span>
            )}
          </NavLink>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/products" element={<Products />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
      </Routes>
    </div>
  );
}

export default App;

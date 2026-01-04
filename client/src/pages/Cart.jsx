import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../features/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  return (
    <div className="pt-[60px] flex flex-col gap-4 px-4">
      <h2>Cart Page</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border p-4">
              <img
                src={item.image}
                alt={item.title}
                className="h-24 w-24 object-contain"
              />

              <div className="flex-1">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-green-600 font-bold">${item.price}</p>
              </div>

              <button
                onClick={() => dispatch(removeFromCart(item))}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;

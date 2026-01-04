import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productSlice";
import { addToCart, removeFromCart } from "../features/cartSlice";

function Products() {
  const dispatch = useDispatch();

  const { items: products, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (status === "loading") {
    return <h2>Loading products...</h2>;
  }

  if (status === "failed") {
    return <h2>Failed to load products</h2>;
  }

  return (
    <div className="pt-[60px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 flex flex-col gap-2">
          <img
            src={product.image}
            alt={product.title}
            className="h-48 mx-auto object-contain"
          />
          <h3 className="text-sm font-semibold">{product.title}</h3>
          <p className="text-green-600 font-bold">${product.price}</p>
          <button
            onClick={() => handleAddToCart(product)}
            className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default Products;

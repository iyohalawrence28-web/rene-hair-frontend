import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { API_BASE } from "../config";

function Success({ setCart }) {
  const [order, setOrder] = useState(null);
  const location = useLocation();
 useEffect(() => {
    // Clear cart from localStorage
    localStorage.removeItem("cart");

    // Clear cart from React state
    if (typeof setCart === "function") {
      setCart([]);
    }

    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");

    if (!orderId) return;

    fetch(`${API_BASE}/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch((err) => console.error("Order fetch error:", err));

  }, [location.search]);

  return (
    <div style={{ padding: "40px" }}>
      <h1>🎉 Payment Successful!</h1>

      {order && (
        <div style={{ marginTop: "20px" }}>
          <h3>Order ID: {order._id}</h3>

          {order.items.map((item) => (
            <div key={item._id}>
              {item.product?.name} × {item.quantity}
            </div>
          ))}

          <h3 style={{ marginTop: "15px" }}>
            Total Paid: ${order.totalAmount}
          </h3>
        </div>
      )}
    </div>
  );
}

export default Success;
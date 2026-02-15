import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";
import AuthorizePayment from "../Payment/AuthorizePayment";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [authorizingOrderId, setAuthorizingOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await authFetch("/orders/my-orders");
      console.log("Orders received:", data); // Debug log
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load orders");
    }
  };

  const handleCancel = async (orderId) => {
    if (!confirm("Cancel this order?")) return;

    try {
      await authFetch(`/orders/cancel?orderId=${orderId}`, {
        method: "POST"
      });
      setMessage("Order cancelled");
      loadOrders();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to cancel order");
    }
  };

  const handleApprove = async (orderId) => {
    if (!confirm("Approve delivery and release payment?")) return;

    try {
      await authFetch(`/orders/approve-delivery?orderId=${orderId}`, {
        method: "POST"
      });
      setMessage("Delivery approved, payment released");
      loadOrders();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to approve delivery");
    }
  };

  if (!orders.length) {
    return <p>{message || "No orders yet"}</p>;
  }

  return (
    <div>
      <h3>My Orders (Consumer)</h3>

      {orders.map((order) => (
        <div key={order.orderId}>
          <b>Order #{order.orderId}</b><br />
          Provider: {order.providerUsername}<br />
          Skill: {order.skillName}<br />
          Price: ${order.agreedPrice}<br />
          Status: {order.status}<br />
          {order.mockPaymentStatus && <>Payment Status: {order.mockPaymentStatus}<br /></>}
          Description: {order.description}<br />
          
          {order.deliveryNotes && (
            <>Delivery Notes: {order.deliveryNotes}<br /></>
          )}
          {order.deliveryUrl && (
            <>Delivery URL: <a href={order.deliveryUrl} target="_blank" rel="noopener noreferrer">{order.deliveryUrl}</a><br /></>
          )}

          {/* PENDING - Need to authorize payment */}
          {order.status === "PENDING" && (!order.mockPaymentStatus || order.mockPaymentStatus === "PENDING") && (
            <div>
              <p>⚠️ <b>Action Required:</b> Authorize payment so provider can accept order</p>
              {authorizingOrderId === order.orderId ? (
                <AuthorizePayment
                  orderId={order.orderId}
                  amount={order.agreedPrice}
                  onAuthorized={() => {
                    setAuthorizingOrderId(null);
                    loadOrders();
                  }}
                />
              ) : (
                <>
                  <button onClick={() => setAuthorizingOrderId(order.orderId)}>
                    🔒 Authorize Payment
                  </button>
                  <button onClick={() => handleCancel(order.orderId)}>
                    ❌ Cancel Order
                  </button>
                </>
              )}
            </div>
          )}

          {/* PENDING but payment authorized - waiting for provider */}
          {order.status === "PENDING" && order.mockPaymentStatus === "AUTHORIZED" && (
            <p>✅ Payment authorized. Waiting for provider to accept...</p>
          )}

          {/* ACCEPTED - Provider accepted */}
          {order.status === "ACCEPTED" && (
            <p>✅ Provider accepted. Work will start soon...</p>
          )}

          {/* IN_PROGRESS - Provider working */}
          {order.status === "IN_PROGRESS" && (
            <p>⏳ Provider is working on your order...</p>
          )}

          {/* DELIVERED - Need to approve */}
          {order.status === "DELIVERED" && (
            <div>
              <p>✅ <b>Work delivered!</b> Please review and approve to release payment.</p>
              <button onClick={() => handleApprove(order.orderId)}>
                ✅ Approve & Release Payment
              </button>
            </div>
          )}

          {/* COMPLETED - Done */}
          {order.status === "COMPLETED" && (
            <p>✅ Order completed. Payment released to provider.</p>
          )}

          {/* CANCELLED - Cancelled */}
          {order.status === "CANCELLED" && (
            <p>❌ Order cancelled.</p>
          )}

          <hr />
        </div>
      ))}

      {message && <p>{message}</p>}
    </div>
  );
}
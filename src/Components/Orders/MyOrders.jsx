import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";
import AuthorizePayment from "../Payment/AuthorizePayment";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [authorizingOrderId, setAuthorizingOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [approvingOrderId, setApprovingOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await authFetch("/orders/my-orders");
      console.log("Orders received:", data);
      setOrders(data || []);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load orders");
    }
  };

  const handleCancel = async (orderId) => {
    if (!confirm("Cancel this order?")) return;

    setCancellingOrderId(orderId);
    try {
      await authFetch(`/orders/cancel?orderId=${orderId}`, {
        method: "POST"
      });
      setMessage("Order cancelled");
      loadOrders();
    } catch (err) {
      console.error(err);
      setMessage((err.message || "Failed to cancel order"));
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleApprove = async (orderId) => {
    if (!confirm("Approve delivery and release payment?")) return;

    setApprovingOrderId(orderId);
    try {
      await authFetch(`/orders/approve-delivery?orderId=${orderId}`, {
        method: "POST"
      });
      setMessage("Delivery approved, payment released");
      loadOrders();
    } catch (err) {
      console.error(err);
      setMessage((err.message || "Failed to approve delivery"));
    } finally {
      setApprovingOrderId(null);
    }
  };

  if (!orders.length) {
    return <p>{message || "No orders yet"}</p>;
  }

  return (
    <div className="card">
      <h2>My Orders (Consumer)</h2>

      {orders.map((order) => (
        <div key={order.orderId} className="order-card mb-md">
          <p><b>Order #{order.orderId}</b> <span className={`status-badge status-${order.status.toLowerCase().replace('_', '-')}`}>{order.status}</span></p>
          <p>Provider: {order.providerUsername}</p>
          <p>Skill: {order.skillName}</p>
          <p>Price: ${order.agreedPrice}</p>

          {order.mockPaymentStatus && <p>Payment Status: <span className="status-badge status-pending">{order.mockPaymentStatus}</span></p>}
          <p>Description: {order.description}</p>

          {order.deliveryNotes && (
            <p>Delivery Notes: {order.deliveryNotes}</p>
          )}
          {order.deliveryUrl && (
            <p>Delivery URL: <a href={order.deliveryUrl} target="_blank" rel="noopener noreferrer">{order.deliveryUrl}</a></p>
          )}

          {/* PENDING - Need to authorize payment */}
          {order.status === "PENDING" && (!order.mockPaymentStatus || order.mockPaymentStatus === "PENDING") && (
            <div className="mt-sm">
              <p className="message message-warning"> <b>Action Required:</b> Authorize payment so provider can accept order</p>
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
                <div className="flex gap-sm">
                  <button className="btn-primary" onClick={() => setAuthorizingOrderId(order.orderId)}>
                    Authorize Payment
                  </button>
                  <button
                    className="btn-danger ml-sm"
                    onClick={() => handleCancel(order.orderId)}
                    disabled={cancellingOrderId === order.orderId}
                  >
                    {cancellingOrderId === order.orderId ? "Cancelling..." : "Cancel Order"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PENDING but payment authorized - waiting for provider */}
          {order.status === "PENDING" && order.mockPaymentStatus === "AUTHORIZED" && (
            <p className="message message-info">Payment authorized. Waiting for provider to accept...</p>
          )}

          {/* ACCEPTED - Provider accepted */}
          {order.status === "ACCEPTED" && (
            <p className="message message-success">Provider accepted. Work will start soon...</p>
          )}

          {/* IN_PROGRESS - Provider working */}
          {order.status === "IN_PROGRESS" && (
            <p className="message message-info">Provider is working on your order...</p>
          )}

          {/* DELIVERED - Need to approve */}
          {order.status === "DELIVERED" && (
            <div className="mt-sm">
              <p className="message message-success"><b>Work delivered!</b> Please review and approve to release payment.</p>
              <button
                className="btn-success"
                onClick={() => handleApprove(order.orderId)}
                disabled={approvingOrderId === order.orderId}
              >
                {approvingOrderId === order.orderId ? "Approving..." : "Approve & Release Payment"}
              </button>
            </div>
          )}

          {/* COMPLETED - Done */}
          {order.status === "COMPLETED" && (
            <p className="message message-success">Order completed. Payment released to provider.</p>
          )}

          {/* CANCELLED - Cancelled */}
          {order.status === "CANCELLED" && (
            <p className="message message-error">Order cancelled.</p>
          )}
        </div>
      ))}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

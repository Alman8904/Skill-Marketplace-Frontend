import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function ReceivedOrders() {

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [acceptingOrderId, setAcceptingOrderId] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [deliveringOrderId, setDeliveringOrderId] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState({
    deliveryNotes: "",
    deliveryUrl: ""
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await authFetch("/orders/received-orders");
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load orders");
    }
  };

  const handleAccept = async (orderId) => {
    if (!deadline) {
      alert("Please enter deadline");
      return;
    }

    try {
      await authFetch(`/orders/accept?orderId=${orderId}&deadline=${deadline}`, {
        method: "POST"
      });
      setMessage("Order accepted");
      setAcceptingOrderId(null);
      setDeadline("");
      loadOrders();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to accept order");
    }
  };

  const handleStartWork = async (orderId) => {
    try {
      await authFetch(`/orders/start-work?orderId=${orderId}`, {
        method: "POST"
      });
      setMessage("Work started");
      loadOrders();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to start work");
    }
  };

  const handleDeliver = async (orderId) => {
    if (!deliveryForm.deliveryNotes && !deliveryForm.deliveryUrl) {
      alert("Provide delivery notes or URL");
      return;
    }

    try {
      await authFetch("/orders/deliver-work", {
        method: "POST",
        body: JSON.stringify({
          orderId: orderId,
          deliveryNotes: deliveryForm.deliveryNotes,
          deliveryUrl: deliveryForm.deliveryUrl
        })
      });
      setMessage("Work delivered");
      setDeliveringOrderId(null);
      setDeliveryForm({ deliveryNotes: "", deliveryUrl: "" });
      loadOrders();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to deliver work");
    }
  };

  if (!orders.length) {
    return <p>{message || "No orders received yet"}</p>;
  }

  return (
    <div className="card">
      <h2>Received Orders (Provider)</h2>

      {orders.map((order) => (
        <div key={order.orderId} className="order-card mb-md">
          <p><b>Order #{order.orderId}</b> <span className={`status-badge status-${order.status.toLowerCase().replace('_', '-')}`}>{order.status}</span></p>
          <p>Consumer: {order.consumerUsername}</p>
          <p>Skill: {order.skillName}</p>
          <p>Price: ${order.agreedPrice}</p>
          <p>Description: {order.description}</p>

          {order.status === "PENDING" && (
            <div className="mt-sm">
              {acceptingOrderId === order.orderId ? (
                <>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="mb-sm"
                  />
                  <br />
                  <button className="btn-primary" onClick={() => handleAccept(order.orderId)}>Confirm Accept</button>
                  <button className="btn-secondary ml-sm" onClick={() => setAcceptingOrderId(null)}>Cancel</button>
                </>
              ) : (
                <button className="btn-primary" onClick={() => setAcceptingOrderId(order.orderId)}>Accept Order</button>
              )}
            </div>
          )}

          {order.status === "ACCEPTED" && (
            <button className="btn-primary mt-sm" onClick={() => handleStartWork(order.orderId)}>Start Work</button>
          )}

          {order.status === "IN_PROGRESS" && (
            <div className="mt-sm">
              {deliveringOrderId === order.orderId ? (
                <>
                  <textarea
                    placeholder="Delivery notes"
                    value={deliveryForm.deliveryNotes}
                    onChange={(e) =>
                      setDeliveryForm({ ...deliveryForm, deliveryNotes: e.target.value })
                    }
                    rows={3}
                  />
                  <br />
                  <input
                    placeholder="Delivery URL (optional)"
                    value={deliveryForm.deliveryUrl}
                    onChange={(e) =>
                      setDeliveryForm({ ...deliveryForm, deliveryUrl: e.target.value })
                    }
                    className="mt-sm"
                  />
                  <br />
                  <button className="btn-success mt-sm" onClick={() => handleDeliver(order.orderId)}>Submit Delivery</button>
                  <button className="btn-secondary mt-sm ml-sm" onClick={() => setDeliveringOrderId(null)}>Cancel</button>
                </>
              ) : (
                <button className="btn-success" onClick={() => setDeliveringOrderId(order.orderId)}>Deliver Work</button>
              )}
            </div>
          )}

          {order.status === "DELIVERED" && (
            <p className="message message-info"><i>Waiting for consumer to approve delivery</i></p>
          )}

          {order.status === "COMPLETED" && (
            <p className="message message-success"><i>Order completed</i></p>
          )}
        </div>
      ))}

      {message && <p className="message">{message}</p>}
    </div>
  );
}
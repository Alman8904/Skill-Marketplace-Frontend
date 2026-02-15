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
    <div>
      <h3>Received Orders (Provider)</h3>

      {orders.map((order) => (
        <div key={order.orderId}>
          <b>Order #{order.orderId}</b><br />
          Consumer: {order.consumerUsername}<br />
          Skill: {order.skillName}<br />
          Price: ${order.agreedPrice}<br />
          Status: {order.status}<br />
          Description: {order.description}<br />

          {order.status === "PENDING" && (
            <>
              {acceptingOrderId === order.orderId ? (
                <>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                  <button onClick={() => handleAccept(order.orderId)}>Confirm Accept</button>
                  <button onClick={() => setAcceptingOrderId(null)}>Cancel</button>
                </>
              ) : (
                <button onClick={() => setAcceptingOrderId(order.orderId)}>Accept Order</button>
              )}
            </>
          )}

          {order.status === "ACCEPTED" && (
            <button onClick={() => handleStartWork(order.orderId)}>Start Work</button>
          )}

          {order.status === "IN_PROGRESS" && (
            <>
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
                  />
                  <br />
                  <button onClick={() => handleDeliver(order.orderId)}>Submit Delivery</button>
                  <button onClick={() => setDeliveringOrderId(null)}>Cancel</button>
                </>
              ) : (
                <button onClick={() => setDeliveringOrderId(order.orderId)}>Deliver Work</button>
              )}
            </>
          )}

          {order.status === "DELIVERED" && (
            <p><i>Waiting for consumer to approve delivery</i></p>
          )}

          {order.status === "COMPLETED" && (
            <p><i>✅ Order completed</i></p>
          )}

          <hr />
        </div>
      ))}

      {message && <p>{message}</p>}
    </div>
  );
}
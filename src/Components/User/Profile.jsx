import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";
import UpdateProfile from "./UpdateProfile";
import DeleteUser from "./DeleteUser";
import MySkills from "../UserSkills/MySkills";
import AssignSkill from "../UserSkills/AssignSkills";

export default function Profile({ onLogout }) {

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await authFetch("/public/user/profile");
      setUser(data);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load profile");
    }
  };

  if (!user) {
    return <p>{message || "Loading profile..."}</p>;
  }

  const isProvider = user.userType === "PROVIDER";
  const isConsumer = user.userType === "CONSUMER";

  return (
    <div>
      <h2>Welcome, {user.firstName} {user.lastName}!</h2>
      <p>Username: {user.username}</p>
      <p>User Type: {user.userType}</p>

      <button onClick={onLogout}>Logout</button>
      <hr />

      <div>
        <button onClick={() => setActiveTab("profile")}>Profile</button>
        <button onClick={() => setActiveTab("wallet")}>Wallet</button>
        <button onClick={() => setActiveTab("trust")}>Trust Score</button>

        {isProvider && (
          <>
            <button onClick={() => setActiveTab("mySkills")}>My Skills</button>
            <button onClick={() => setActiveTab("assignSkill")}>Assign Skill</button>
            <button onClick={() => setActiveTab("receivedOrders")}>Received Orders</button>
          </>
        )}

        {isConsumer && (
          <>
            <button onClick={() => setActiveTab("search")}>Search Providers</button>
            <button onClick={() => setActiveTab("placeOrder")}>Place Order</button>
            <button onClick={() => setActiveTab("myOrders")}>My Orders</button>
          </>
        )}
      </div>
      <hr />

      {activeTab === "profile" && (
        <>
          <h3>Profile Details</h3>
          <p>First Name: {user.firstName}</p>
          <p>Last Name: {user.lastName}</p>
          <p>Username: {user.username}</p>
          <p>User Type: {user.userType}</p>
          <br />
          <UpdateProfile onUpdated={loadProfile} />
          <hr />
          <DeleteUser onDeleted={onLogout} />
        </>
      )}

      {activeTab === "wallet" && (
        <>
          <WalletBalance key={Math.random()} />
          <hr />
          <AddFunds onFundsAdded={() => setActiveTab("wallet")} />
        </>
      )}

      {activeTab === "trust" && <MyTrust />}

      {activeTab === "mySkills" && isProvider && <MySkills />}

      {activeTab === "assignSkill" && isProvider && (
        <AssignSkill onUpdated={() => setActiveTab("mySkills")} />
      )}

      {activeTab === "receivedOrders" && isProvider && <ReceivedOrders />}

      {activeTab === "search" && isConsumer && <SearchProviders />}

      {activeTab === "placeOrder" && isConsumer && (
        <PlaceOrder onOrderPlaced={() => setActiveTab("myOrders")} />
      )}

      {activeTab === "myOrders" && isConsumer && <MyOrders />}
    </div>
  );
}
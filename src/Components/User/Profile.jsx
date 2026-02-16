import { useEffect, useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";
import UpdateProfile from "./UpdateProfile";
import DeleteUser from "./DeleteUser";
import MySkills from "../UserSkills/MySkills";
import AssignSkill from "../UserSkills/AssignSkills";
import SearchProviders from "../UserSkills/SearchProviders";
import PlaceOrder from "../Orders/PlaceOrder";
import MyOrders from "../Orders/MyOrders";
import ReceivedOrders from "../Orders/RecievedOrder";
import WalletBalance from "../Payment/WalletBalance";
import AddFunds from "../Payment/AddFunds";
import MyTrust from "../Trust/Mytrust";
import PublicTrust from "../Trust/Publictrust";

export default function Profile({ onLogout }) {

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setActiveTab("placeOrder");
  };

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
      <div className="card">
        <h2>Welcome, {user.firstName} {user.lastName}!</h2>
        <p className="text-muted">Username: {user.username}</p>
        <p className="text-muted">User Type: <span className="status-badge status-accepted">{user.userType}</span></p>
        <button onClick={onLogout} className="btn-danger btn-sm">Logout</button>
      </div>

      <div className="nav-tabs">
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={activeTab === "wallet" ? "active" : ""}
          onClick={() => setActiveTab("wallet")}
        >
          Wallet
        </button>
        <button
          className={activeTab === "trust" ? "active" : ""}
          onClick={() => setActiveTab("trust")}
        >
          Trust Score
        </button>
        <button
          className={activeTab === "checkTrust" ? "active" : ""}
          onClick={() => setActiveTab("checkTrust")}
        >
          Check Trust
        </button>

        {isProvider && (
          <>
            <button
              className={activeTab === "mySkills" ? "active" : ""}
              onClick={() => setActiveTab("mySkills")}
            >
              My Skills
            </button>
            <button
              className={activeTab === "assignSkill" ? "active" : ""}
              onClick={() => setActiveTab("assignSkill")}
            >
              Assign Skill
            </button>
            <button
              className={activeTab === "receivedOrders" ? "active" : ""}
              onClick={() => setActiveTab("receivedOrders")}
            >
              Received Orders
            </button>
          </>
        )}

        {isConsumer && (
          <>
            <button
              className={activeTab === "search" ? "active" : ""}
              onClick={() => setActiveTab("search")}
            >
              Search Providers
            </button>
            <button
              className={activeTab === "placeOrder" ? "active" : ""}
              onClick={() => setActiveTab("placeOrder")}
            >
              Place Order
            </button>
            <button
              className={activeTab === "myOrders" ? "active" : ""}
              onClick={() => setActiveTab("myOrders")}
            >
              My Orders
            </button>
          </>
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-content mt-md">
        {activeTab === "profile" && (
          <div className="flex flex-col gap-lg">
            <UpdateProfile onUpdated={loadProfile} />
            <DeleteUser onDeleted={onLogout} />
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="flex flex-col gap-lg">
            <WalletBalance />
            <AddFunds onFundsAdded={() => {
              // Optionally reload balance or other profile data
              loadProfile();
            }} />
          </div>
        )}

        {activeTab === "trust" && <MyTrust />}

        {activeTab === "checkTrust" && <PublicTrust />}

        {/* Provider Tabs */}
        {isProvider && activeTab === "mySkills" && <MySkills />}
        {isProvider && activeTab === "assignSkill" && (
          <AssignSkill onUpdated={() => setActiveTab("mySkills")} />
        )}
        {isProvider && activeTab === "receivedOrders" && <ReceivedOrders />}

        {/* Consumer Tabs */}
        {isConsumer && activeTab === "search" && (
          <SearchProviders onProviderSelect={handleProviderSelect} />
        )}
        {isConsumer && activeTab === "placeOrder" && (
          <PlaceOrder
            onOrderPlaced={() => setActiveTab("myOrders")}
            prefilledProvider={selectedProvider}
          />
        )}
        {isConsumer && activeTab === "myOrders" && <MyOrders />}
      </div>
    </div>
  );
}
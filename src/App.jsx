import { useState } from "react"
import CreateUser from "./Components/Public-endpoints/CreateUser.jsx"
import Login from "./Components/Public-endpoints/Login.jsx"
import Profile from "./Components/User/Profile.jsx"

function App() {

  //create a state which tells if user is logged in or not
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token"));
  //if no token found then false


  const [authView, setAuthView] = useState("login");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: "80vh", padding: "20px" }}>
      <h1 className="mb-lg text-center">Skill Marketplace</h1>

      {!isLoggedIn && (
        <div className="w-full" style={{ maxWidth: "450px" }}>
          {/* Auth Toggles */}
          <div className="grid grid-cols-2 gap-md mb-md">
            <button
              className={`text-center py-md rounded-lg transition-all ${authView === "login" ? "bg-primary text-white shadow-md transform scale-105" : "bg-card text-muted hover:bg-hover"}`}
              onClick={() => setAuthView("login")}
              style={{ border: 'none' }}
            >
              For Returning Users
            </button>
            <button
              className={`text-center py-md rounded-lg transition-all ${authView === "create" ? "bg-primary text-white shadow-md transform scale-105" : "bg-card text-muted hover:bg-hover"}`}
              onClick={() => setAuthView("create")}
              style={{ border: 'none' }}
            >
              For New Users
            </button>
          </div>

          {/* Active Component */}
          <div className="transition-all duration-300 ease-in-out">
            {authView === "login" ? (
              <Login onLoginSuccess={() => setIsLoggedIn(true)} />
            ) : (
              <CreateUser />
            )}
          </div>
        </div>
      )}
      {isLoggedIn && <Profile onLogout={handleLogout} />}
    </div>
  )
}

export default App

import { useState } from "react"
import CreateUser from "./Components/Public endpoints/CreateUser.jsx"
import Login from "./Components/Public endpoints/Login.jsx"
import Profile from "./Components/User/Profile.jsx"

function App() {

  //create a state which tells if user is logged in or not
  const [isLoggedIn, setIsLoggedIn]= useState(
    !!localStorage.getItem("token"));
    //if no token found then false

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }  
 
  return (
    <>
    <h1>Skill marketplace</h1>
    
    {/* Here parent (App) creates a function and  we passe it as prop in child (Login) 
    and when child callsback this function the functions code is executed 
    which is to change login state to true */}
    {!isLoggedIn &&(
      <>
        <CreateUser/>
        <Login onLoginSuccess={()=>setIsLoggedIn(true)}/>
      </>
    )}
    
    {/* here parent passes a named function instead of inline function, basically the same*/}
    {isLoggedIn && <Profile onLogout ={handleLogout}/>}
    </>
  )
}

export default App

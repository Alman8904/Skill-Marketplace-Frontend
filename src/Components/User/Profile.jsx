import { useEffect, useState } from "react";
import { authFetch } from "../jwt storage/authFetch";
import UpdateProfile from "./UpdateProfile";
import DeleteUser from "./DeleteUser";
import AssignSkill from "../UserSkills/AssignSkills";
import MySkills from "../UserSkills/MySkills"

export default function Profile({onLogout}) {
    //current user state is null...setUser updates the state
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  //userEffect is react inbuilt hook used to run smth after 
  //a component renders

  //(basically loading profile after this componet renders) 
  //simply loading profile after Profile component renders
  useEffect(() => {
    loadProfile();
  }, []);//empty array means run only once

  const loadProfile = async () => {
    try {
      const data = await authFetch("/public/user/profile");
      setUser(data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load profile");
    }
  };

  if (!user) return <p>{message || "Loading profile..."}</p>;

  //we just updated the state user with the 'data' we got from fetch
  //now we just deconstruct the object to output the data from user
  return (
    <div>
      <h2>Profile</h2>
      <p>ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName}</p>
      <p>User Type: {user.userType}</p>
      <button onClick={onLogout}>Logout</button>
      <UpdateProfile onUpdated={loadProfile}/>
      <DeleteUser onDelete={onLogout}/>
      {user.userType === "PROVIDER" && (
        <AssignSkill onUpdated={loadProfile} />
        
      )}
      {user.userType === "PROVIDER" && (
      <>
        <AssignSkill onUpdated={loadProfile} />
        <MySkills />
      </>
      )}

    </div>
  );
}

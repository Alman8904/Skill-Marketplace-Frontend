import { useState } from "react";
import { authFetch } from "../jwt storage/authFetch";

export default function UpdateProfile({onUpdated}){
    const[form , setForm] = useState({
        password:"",
        firstName:"",
        lastName:"",
        userType:"CONSUMER"
    });

    const[message,setMessage] = useState("");

    const handleChange = (e) =>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();

        try{
            await authFetch("/public/user/update",{
                method:"PUT",
                body:JSON.stringify(form)
            });

            setMessage("Profile updated");

            //tell parent to refresh profile
            onUpdated();
        }catch(err){
            setMessage("Update failed");
            console.error(err);
        }
    };

    return(
        <div>
      <h3>Update Profile</h3>

      <form onSubmit={handleSubmit}>
        <input name="password" placeholder="Password" onChange={handleChange}/>

        <br/>
        <input name="firstName" placeholder="First Name" onChange={handleChange}/>
        <br />

        <input name="lastName" placeholder="Last Name" onChange={handleChange}/>
        <br />

        <select
        name="userType"
        value={form.userType}
        onChange={handleChange}
        >
        <option value="CONSUMER">CONSUMER</option>
        <option value="PROVIDER">PROVIDER</option>
        </select>


        <button type="submit">Update</button>
      </form>

      <p>{message}</p>
    </div>
    );
}
import { useState } from "react";

export default function Login({onLoginSuccess}){

    //form state empty first and setForm changes it when called
    const[form,setForm]=useState({
        username:"",
        password:""
    });

    const[message, setMessage]=useState("");

    //used to add data when called
    //updates fields in form
    const handleChange = (e) =>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
    };

    //when called does this logic
    const handleSubmit= async(e)=>{
        e.preventDefault();

        try{
            const res = await fetch("/auth/login",{
                method: "POST",
                headers :{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(form)
            });

            if(!res.ok){
                throw new Error("Login failed");
            }

            //extracting jwt token from backend
            const token = await res.text();
            //storing jwt token for using as header in other endpoints
            localStorage.setItem("token",token);

            setMessage("Login successful");
            console.log("TOKEN", token);
            //child callsback to parents fucntion
            onLoginSuccess();
        }catch (err){
            setMessage("Login failed");
            console.error(err);
        }
    };

    return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>
    </div>
  );
    
}
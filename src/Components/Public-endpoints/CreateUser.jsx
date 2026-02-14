import { useState } from "react";

//a function is the component 
export default function CreateUser(){

    //react inbuilt hook that has 
    //1. initial state
    //2. a method that changes the state to smth when called 
    const [form , setForm] = useState({
        username:"",
        firstName:"",
        lastName:"",
        password:"",
        userType:"CONSUMER"
    });

    // messege output when completed 
    const [message, setMessage]= useState("");

    //a arrow function that does smth when e or any input is done
    //in the browser
    const handleChange=(e)=>{
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value
            }
        );
    };

    //async function that does the logic when this is called 
    //when form is submitted
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("FORM SENT:", form);


        try{
            //fetching api from backend
            const res = await fetch("/auth/create", {
                method : "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                //convert the form data into json
                body: JSON.stringify(form)
            });
            
            if(!res.ok){
                throw new Error("Failed to create user");
            }

            const data = await res.json();
            setMessage("User created successfully")
            console.log(data);
        }catch(err){
            setMessage("Error creating user");
            console.error(err);
        }
    };

    return(
        <div>
            <h2>Create User</h2>

            
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Username" onChange={handleChange} />
        <br />

        <input name="firstName" placeholder="First Name" onChange={handleChange} />
        <br />

        <input name="lastName" placeholder="Last Name" onChange={handleChange} />
        <br />

        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <br />

        <select name="userType" onChange={handleChange}>
          <option value="CONSUMER">CONSUMER</option>
          <option value="PROVIDER">PROVIDER</option>
        </select>
        <br /><br />

        <button type="submit">Create User</button>
            </form>

            <p>{message}</p>
        </div>
    );
}
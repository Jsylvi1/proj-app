import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const adminUsername = "Admin1";
        const adminPassword = "Password1";

        if (username === adminUsername && password === adminPassword) {

            localStorage.setItem('isAuthenticated', 'true');
            

            navigate("/"); 
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <main className='login'>
            <form className='login__form' onSubmit={handleSubmit}>
                <h2 className='login__title'>Admin Login</h2>
                <label htmlFor='username'>Username</label>
                <input
                    id='username'
                    name='username'
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='username'
                />
                <label htmlFor='password'>Password</label>
                <input
                    id='password'
                    type='password'
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='password'
                />
                <button className='loginButton'>LOGIN</button>
            </form>
        </main>
    );
};

export default Login;

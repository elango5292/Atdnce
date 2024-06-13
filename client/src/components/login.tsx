import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import './Login.css';
import axios from 'axios';  

interface LoginResponse {
    data: {
        message: string;
    };
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>(''); 

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(''); 
        axios.post<LoginResponse>('http://localhost:4000/api/v1/users/login', { email, password }, {
            
            withCredentials: true  
        })
        .then(response => {
            console.log('Login successful:', response.data);
            navigate("/home");
        })
        .catch(error => {
            const errorResponse = error.response ? error.response.data.message : 'No response from server';
            console.error('Login error:', errorResponse);
            setErrorMessage('Login failed: ' + errorResponse); 
        });
    };

    return (
        <div className='wrapper'>
            <form onSubmit={onLogin}>
                <h1>Login</h1>
                <div className='input-box'>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    <FaUser className='icon' />
                </div>

                <div className='input-box'>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <FaLock className='icon' />
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}

export default Login;

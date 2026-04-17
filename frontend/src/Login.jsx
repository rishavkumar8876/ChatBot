import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MyContext } from './MyContext';
import './Auth.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setToken, setUser } = useContext(MyContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.ok) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to login. Please try again.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Login to ApnaGPT</h1>
                <form className="auth-form" onSubmit={handleLogin}>
                    <input className="auth-input" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                    <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    {error && <div className="auth-error">{error}</div>}
                    <button className="auth-button" type="submit">Login</button>
                </form>
                <p className="auth-link-text">Don't have an account? <Link to="/register" className="auth-link">Register</Link></p>
            </div>
        </div>
    );
}

export default Login;

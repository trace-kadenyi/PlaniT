// components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resetLoginState, clearAuthErrors } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loginStatus, loginError, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear errors when component unmounts
    return () => {
      dispatch(clearAuthErrors());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-container">
      <h2>Login to PlaniT</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {loginError && (
          <div className="error-message">
            {loginError}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loginStatus === 'loading'}
        >
          {loginStatus === 'loading' ? 'Logging in...' : 'Login'}
        </button>
      </form>

    
    </div>
  );
};

export default Login;
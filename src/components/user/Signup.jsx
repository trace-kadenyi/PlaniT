// components/Signup.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, resetSignupState, clearAuthErrors } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'planner'
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { signupStatus, signupError, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

 
  


  return (
    <div className="signup-container">
      <h2>Create Your PlaniT Account</h2>
      
    

      
    </div>
  );
};

export default Signup;
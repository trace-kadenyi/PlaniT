import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signupUser,
  resetSignupState,
  clearAuthErrors,
} from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "planner",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { signupStatus, signupError, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  //   if auth, navigate to dash
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  //   clear auth errs
  useEffect(() => {
    return () => {
      dispatch(clearAuthErrors());
    };
  }, [dispatch]);
  // handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser(formData));
  };

  return (
    <div className="signup-container">
      <h2>Create Your PlaniT Account</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {/* first name */}
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          {/* last name */}
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* email */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* pass */}
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
        {/* role */}
        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="planner">Event Planner</option>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* signup err */}
        {signupError && <div className="error-message">{signupError}</div>}
        {/* submit btn */}
        <button type="submit" disabled={signupStatus === "loading"}>
          {signupStatus === "loading" ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {/* login prompt */}
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Signup;

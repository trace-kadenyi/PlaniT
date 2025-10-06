import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  resetLoginState,
  clearAuthErrors,
  setTrustedDevice,
} from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loginStatus, loginError, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // if auth, navigate to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component unmounts

  useEffect(() => {
    return () => {
      dispatch(clearAuthErrors());
    };
  }, [dispatch]);

  //   handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        // AFTER SUCCESSFUL LOGIN, SET TRUSTED DEVICE IF CHECKED
        if (trustDevice) {
          dispatch(setTrustedDevice(true));
        }
      });
  };

  return (
    <div className="login-container">
      <h2>Login to PlaniT</h2>

      {/* email */}
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

        {/* pass */}
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* ADD TRUST DEVICE CHECKBOX */}
        <div className="form-group">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={trustDevice}
              onChange={(e) => setTrustDevice(e.target.checked)}
              className="rounded border-gray-300 text-[#9B2C62] focus:ring-[#9B2C62]"
            />
            <span className="text-sm text-gray-600">Trust this device</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Stay logged in for 7 days on this device
          </p>
        </div>

        {loginError && <div className="error-message">{loginError}</div>}

        <button type="submit" disabled={loginStatus === "loading"}>
          {loginStatus === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
};

export default Login;

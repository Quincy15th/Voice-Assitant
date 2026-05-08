import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Auth.css";

const SignIn = ({ onSwitchView }) => {
  // Đổi tên state từ email thành usernameOrEmail cho chuẩn nghĩa
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Thực hiện đăng nhập với identifier (có thể là email hoặc username)
    login(usernameOrEmail, password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Sign in to AI Voice Assistant</h2>
          <p>Welcome back! Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="label-wrapper">
              <label htmlFor="usernameOrEmail">Email address or username</label>
            </div>
            <input
              type="text"
              id="usernameOrEmail"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="continue-btn">
            Continue
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <span
              className="switch-link"
              onClick={() => onSwitchView("signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

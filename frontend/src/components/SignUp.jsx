import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Auth.css";

const SignUp = ({ onSwitchView }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); // Thêm state cho username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập: Đăng ký thành công thì cho đăng nhập luôn
    console.log("Đăng ký tài khoản:", { name, username, email, password });
    login(email, password); // Tạm thời dùng email để đăng nhập
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create your account</h2>
          <p>Welcome! Please fill in the details to get started.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Ô nhập Username mới thêm */}
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Sign up
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <span
              className="switch-link"
              onClick={() => onSwitchView("signin")}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

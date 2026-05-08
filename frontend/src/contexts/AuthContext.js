import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Hàm xử lý đăng nhập
  const login = (email, password) => {
    // Tạm thời giả lập đăng nhập thành công.
    // Sau này bạn gọi API backend ở đây (ví dụ: Firebase, Node.js)
    setUser({ email: email });
  };

  // Hàm xử lý đăng xuất
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

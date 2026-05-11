import {
  isAuthError,
  loginUser,
  registerUser,
} from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const { accessToken, user } = await registerUser(req.body ?? {});
    return res.status(201).json({
      message: "Đăng ký thành công.",
      accessToken,
      user,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("register error", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const login = async (req, res) => {
  try {
    const { accessToken, user } = await loginUser(req.body ?? {});
    return res.status(200).json({
      message: "Đăng nhập thành công.",
      accessToken,
      user,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("login error", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const logout = async (_req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("token");

    return res.status(200).json({ message: "Đăng xuất thành công." });
  } catch (error) {
    console.error("logout error", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

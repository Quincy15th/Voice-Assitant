// @ts-nocheck
import jwt from "jsonwebtoken";
import { env } from "../utils/env.js";
import { findUserById } from "../repository/userRepository.js";

// authorization - xác minh user là ai
export const protectedRoute = (req, res, next) => {
  try {
    // lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    // xác nhận token hợp lệ
    jwt.verify(token, env.jwtSecret, async (err, decodedUser) => {
      if (err) {
        console.error(err);

        return res
          .status(403)
          .json({ message: "Access token hết hạn hoặc không đúng" });
      }

      try {
        const user = await findUserById(decodedUser.userId, {
          attributes: { exclude: ["hashedPassword"] },
        });
        req.user = user;
        next();
      } catch {
        return res.status(404).json({ message: "người dùng không tồn tại." });
      }
    });
  } catch (error) {
    console.error("Lỗi khi xác minh JWT trong authMiddleware", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
